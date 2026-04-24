#!/usr/bin/env node
// ============================================================================
// build-events.mjs
// Generates public/events.json — a pre-computed map of year → top 5 events
// ranked by Wikipedia pageview popularity.
//
// Usage:
//   node scripts/build-events.mjs                 # default range 500 BCE - 2025
//   node scripts/build-events.mjs --start=1900    # override start year
//   node scripts/build-events.mjs --end=2024      # override end year
//
// Resumable: re-running picks up where it left off by reading existing
// events.json first and skipping years already computed.
// ============================================================================

import fs from "fs/promises";
import path from "path";
import { JSDOM } from "jsdom";

// -------------------- CONFIG --------------------
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);

const START_YEAR = parseInt(args.start ?? "-500", 10);
const END_YEAR = parseInt(args.end ?? "2025", 10);
const OUTPUT_PATH = args.out ?? "public/events.json";
const PAGEVIEW_DAYS = 60;
const REQUEST_DELAY_MS = 150; // ~7 req/sec, well under Wikipedia's limits
const MAX_RETRIES = 3;

console.log(`Building events.json for years ${START_YEAR} → ${END_YEAR}`);
console.log(`Output: ${OUTPUT_PATH}`);

// -------------------- HELPERS --------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, attempt = 1) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "CenturyCompareBuilder/1.0 (https://github.com; contact via repo issues)",
      },
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      if (res.status === 429 && attempt <= MAX_RETRIES) {
        console.log(`  rate-limited, waiting ${attempt * 5}s...`);
        await sleep(attempt * 5000);
        return fetchWithRetry(url, attempt + 1);
      }
      throw new Error(`HTTP ${res.status}`);
    }
    await sleep(REQUEST_DELAY_MS);
    return res;
  } catch (err) {
    if (attempt <= MAX_RETRIES) {
      await sleep(attempt * 1000);
      return fetchWithRetry(url, attempt + 1);
    }
    throw err;
  }
}

function wikiSlugCandidates(year) {
  if (year < 0) {
    const abs = Math.abs(year);
    return [`${abs}_BC`, `${abs}_BCE`];
  }
  if (year < 1000) {
    return [`AD_${year}`, String(year), `${year}_(year)`];
  }
  return [String(year)];
}

const GENERIC_SLUGS = new Set([
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
  "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
  "Common_Era","Anno_Domini","BC","BCE","AD","CE",
  "United_States","United_Kingdom","England","France","Germany",
  "China","Japan","India","Russia","Europe","Asia","Africa",
  "North_America","South_America",
]);

function isGenericSlug(slug) {
  if (!slug) return true;
  if (GENERIC_SLUGS.has(slug)) return true;
  if (/^\d+$/.test(slug)) return true;
  if (/^\d{1,2}_[A-Z]/.test(slug)) return true;
  if (/^(January|February|March|April|May|June|July|August|September|October|November|December)_\d/.test(slug)) return true;
  if (/^(AD_)?\d+$/.test(slug) || /^\d+_(BC|BCE|AD|CE)$/.test(slug)) return true;
  return false;
}

function humanizeSlug(slug) {
  if (!slug) return "";
  return decodeURIComponent(slug).replace(/_/g, " ").replace(/\s*\([^)]+\)\s*/g, " ").trim();
}

function parseWikiEvent(raw, primaryWiki, allLinks, sectionAnchor, boldText, hasBold) {
  let text = raw.trim().replace(/\s+/g, " ").replace(/\[[^\]]*\]/g, "").trim();
  text = text.replace(/^(c\.|ca\.|circa)\s+/i, "");
  const dateMatch = text.match(/^((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:\s*[-–—]\s*(?:January|February|March|April|May|June|July|August|September|October|November|December)?\s*\d{1,2})?)\s*[-–—:]\s*(.+)$/i);
  let datePrefix = null;
  let body = text;
  if (dateMatch) {
    datePrefix = dateMatch[1].trim();
    body = dateMatch[2].trim();
  }
  body = body.replace(/^(c\.|ca\.|circa)\s+/i, "");
  const sentenceMatches = body.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (sentenceMatches && sentenceMatches.length > 3) {
    body = sentenceMatches.slice(0, 3).join("").trim();
  }
  let title = "";
  if (boldText && boldText.length >= 3 && boldText.length < 90) {
    title = boldText.trim();
  } else if (primaryWiki && primaryWiki.length < 60) {
    title = humanizeSlug(primaryWiki);
  }
  if (!title || title.length < 3) {
    const firstSentence = body.split(/[.!?]/)[0] || body;
    title = firstSentence.length > 80 ? firstSentence.slice(0, 80).trim() + "…" : firstSentence.trim();
  }
  return { title, datePrefix, body, wiki: primaryWiki, allLinks, sectionAnchor, hasBold };
}

// -------------------- CORE --------------------
const pageviewCache = new Map();

async function fetchPageview(slug) {
  if (pageviewCache.has(slug)) return pageviewCache.get(slug);
  const end = new Date();
  const start = new Date(end.getTime() - PAGEVIEW_DAYS * 24 * 60 * 60 * 1000);
  const fmt = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/${encodeURIComponent(slug)}/daily/${fmt(start)}/${fmt(end)}`;
  try {
    const res = await fetchWithRetry(url);
    if (!res) { pageviewCache.set(slug, 0); return 0; }
    const data = await res.json();
    const total = (data.items || []).reduce((sum, item) => sum + (item.views || 0), 0);
    pageviewCache.set(slug, total);
    return total;
  } catch {
    pageviewCache.set(slug, 0);
    return 0;
  }
}

async function fetchCandidates(year) {
  for (const pageName of wikiSlugCandidates(year)) {
    const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(pageName)}&prop=text&format=json&redirects=1`;
    let res;
    try { res = await fetchWithRetry(url); } catch { continue; }
    if (!res) continue;
    const data = await res.json();
    if (data?.error) continue;
    const html = data?.parse?.text?.["*"];
    if (!html) continue;

    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const allHeadings = Array.from(doc.querySelectorAll("h2, h3"));
    const eventsHeading = allHeadings.find((h) => {
      const t = (h.textContent || "").trim().toLowerCase().replace(/\[edit\]/g, "").trim();
      return t === "events" || t.startsWith("events");
    });
    if (!eventsHeading) continue;

    const eventsIdx = allHeadings.indexOf(eventsHeading);
    const strongStops = ["births", "deaths", "references", "see also", "external links", "notes", "publications", "new works"];
    let stopHeading = null;
    for (let i = eventsIdx + 1; i < allHeadings.length; i++) {
      const h = allHeadings[i];
      if (h.tagName !== "H2") continue;
      const t = (h.textContent || "").trim().toLowerCase().replace(/\[edit\]/g, "").trim();
      if (strongStops.some((s) => t === s || t.startsWith(s))) { stopHeading = h; break; }
    }

    const startContainer = eventsHeading.closest(".mw-heading") || eventsHeading;
    const stopContainer = stopHeading ? (stopHeading.closest(".mw-heading") || stopHeading) : null;

    let currentSection = null;
    const collected = [];
    const walker = doc.createTreeWalker(doc.body, dom.window.NodeFilter.SHOW_ELEMENT);
    let started = false;
    let node = walker.currentNode;
    while ((node = walker.nextNode())) {
      if (!started) {
        if (node === startContainer || startContainer.contains(node)) started = true;
        continue;
      }
      if (stopContainer && (node === stopContainer || stopContainer.contains(node))) break;
      if (node.tagName === "H3" || node.tagName === "H4") {
        const id = node.id || node.querySelector("[id]")?.id;
        if (id) currentSection = id;
      }
      if (node.tagName === "LI" || node.tagName === "DD") {
        collected.push({ li: node, section: currentSection });
      }
    }

    const parsed = collected.map(({ li, section }) => {
      li.querySelectorAll(".mw-editsection, sup.reference, sup.noprint, .mw-ext-cite-error, style").forEach((el) => el.remove());
      const text = li.textContent.trim();
      if (!text || text.length < 15) return null;
      const boldEl = li.querySelector("b");
      const boldText = boldEl ? boldEl.textContent.trim() : null;
      const hasBold = !!boldText;
      const allLinkSlugs = Array.from(li.querySelectorAll("a[href^='/wiki/']"))
        .map((a) => a.getAttribute("href"))
        .filter((h) => h && !h.includes(":"))
        .map((h) => decodeURIComponent(h.replace("/wiki/", "").split("#")[0]));
      const nonGenericLinks = allLinkSlugs.filter((s) => !isGenericSlug(s));
      let primaryWiki = null;
      if (boldEl) {
        const boldLink = boldEl.querySelector("a[href^='/wiki/']");
        if (boldLink) {
          const href = boldLink.getAttribute("href");
          if (href && !href.includes(":")) {
            primaryWiki = decodeURIComponent(href.replace("/wiki/", "").split("#")[0]);
          }
        }
      }
      if (!primaryWiki) primaryWiki = nonGenericLinks[0] || pageName;
      return parseWikiEvent(text, primaryWiki, allLinkSlugs, section, boldText, hasBold);
    }).filter(Boolean);

    const seen = new Set();
    const unique = parsed.filter((e) => {
      if (seen.has(e.body)) return false;
      seen.add(e.body);
      return true;
    });
    if (unique.length > 0) return { candidates: unique.slice(0, 50), pageName };
  }
  return null;
}

async function computeYear(year) {
  const result = await fetchCandidates(year);
  if (!result) return null;

  const allSlugs = new Set();
  for (const c of result.candidates) {
    for (const link of c.allLinks || []) {
      if (!isGenericSlug(link)) allSlugs.add(link);
    }
  }

  // Fetch pageviews for all slugs
  const pageviews = {};
  for (const slug of allSlugs) {
    pageviews[slug] = await fetchPageview(slug);
  }

  const scored = result.candidates.map((c) => {
    let score = (c.allLinks || [])
      .filter((link) => !isGenericSlug(link))
      .reduce((sum, link) => sum + (pageviews[link] || 0), 0);
    if (c.hasBold) score = Math.round(score * 1.5);
    return { ...c, _score: score };
  });

  scored.sort((a, b) => b._score - a._score);
  return scored.slice(0, 5).map(({ _score, allLinks, hasBold, ...rest }) => rest);
}

// -------------------- MAIN --------------------
async function main() {
  // Ensure output dir exists
  const outDir = path.dirname(OUTPUT_PATH);
  await fs.mkdir(outDir, { recursive: true });

  // Load existing events.json for resumability
  let existing = {};
  try {
    const raw = await fs.readFile(OUTPUT_PATH, "utf-8");
    existing = JSON.parse(raw);
    console.log(`Loaded ${Object.keys(existing).length} existing years (resuming)`);
  } catch {
    console.log("No existing events.json — starting fresh");
  }

  // Build year list. Skip 0 (no year zero).
  const years = [];
  for (let y = START_YEAR; y <= END_YEAR; y++) {
    if (y === 0) continue;
    if (!existing[String(y)]) years.push(y);
  }

  console.log(`${years.length} years to compute`);
  let done = 0;
  const startTime = Date.now();
  let lastSave = Date.now();

  for (const year of years) {
    try {
      const events = await computeYear(year);
      existing[String(year)] = events || [];
      done++;
      const elapsed = (Date.now() - startTime) / 1000;
      const rate = done / elapsed;
      const remaining = (years.length - done) / rate;
      if (done % 10 === 0 || done === 1) {
        console.log(`  [${done}/${years.length}] ${year}: ${events ? events.length : 0} events (${elapsed.toFixed(0)}s elapsed, ~${Math.ceil(remaining / 60)}min left)`);
      }
      // Save every 30 seconds so we don't lose progress
      if (Date.now() - lastSave > 30_000) {
        await fs.writeFile(OUTPUT_PATH, JSON.stringify(existing, null, 0));
        lastSave = Date.now();
      }
    } catch (err) {
      console.error(`  [${year}] failed: ${err.message}`);
      existing[String(year)] = []; // Mark as attempted so we don't retry
    }
  }

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(existing, null, 0));
  console.log(`\n✓ Done. Saved ${Object.keys(existing).length} years to ${OUTPUT_PATH}`);
  console.log(`  Total time: ${((Date.now() - startTime) / 60000).toFixed(1)} minutes`);
  console.log(`  File size: ${((await fs.stat(OUTPUT_PATH)).size / 1024).toFixed(0)} KB`);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
