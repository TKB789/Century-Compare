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

function parseWikiEvent(raw, primaryWiki, allLinks, sectionAnchor, boldText, italicText, hasBold) {
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

  // Title extraction strategies in priority order:
  // 1. Bolded text (Wikipedia's editors marked this as the subject)
  // 2. Italicized text (also common for event subjects like book/song names)
  // 3. Text before the first colon, if short (e.g. "Satanic Verses controversy: ...")
  // 4. Humanized primary Wikipedia slug (e.g. "Apollo_11" → "Apollo 11")
  // 5. First sentence fallback
  let title = "";
  if (boldText && boldText.length >= 3 && boldText.length < 90) {
    title = boldText.trim();
  } else if (italicText && italicText.length >= 3 && italicText.length < 90) {
    title = italicText.trim();
  }

  if (!title) {
    // Check for "SUBJECT: description" pattern in body
    const colonMatch = body.match(/^([^:.!?]{3,70}):\s+(.+)/);
    if (colonMatch) {
      title = colonMatch[1].trim();
    }
  }

  if (!title && primaryWiki && primaryWiki.length < 60) {
    const humanized = humanizeSlug(primaryWiki);
    // Only use slug if it looks like a real title (not just a year number or generic word)
    if (humanized.length >= 3 && !/^\d+$/.test(humanized)) {
      title = humanized;
    }
  }

  if (!title || title.length < 3) {
    const firstSentence = body.split(/[.!?]/)[0] || body;
    title = firstSentence.length > 80 ? firstSentence.slice(0, 80).trim() + "…" : firstSentence.trim();
  }

  // Remove trailing "is", "was", "on", etc. — fragments from bad truncation
  title = title.replace(/\s+(is|was|are|were|on|in|of|to|and|the|a|an|by)\s*$/i, "").trim();
  // Remove trailing single letters like "Supreme Leader of I"
  title = title.replace(/\s+[a-zA-Z]{1,2}$/, "").trim();

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
      // Also extract italic text — often used for book/song/work titles
      const italicEl = li.querySelector("i");
      const italicText = italicEl ? italicEl.textContent.trim() : null;
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
      // Also check italic element for a primary link
      if (!primaryWiki && italicEl) {
        const italicLink = italicEl.querySelector("a[href^='/wiki/']");
        if (italicLink) {
          const href = italicLink.getAttribute("href");
          if (href && !href.includes(":")) {
            primaryWiki = decodeURIComponent(href.replace("/wiki/", "").split("#")[0]);
          }
        }
      }
      if (!primaryWiki) primaryWiki = nonGenericLinks[0] || pageName;
      return parseWikiEvent(text, primaryWiki, allLinkSlugs, section, boldText, italicText, hasBold);
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
    // Score = MAX pageview among the bullet's non-generic links.
    // (Previously used SUM, which inadvertently rewarded multi-topic bullets
    // that combined several events into one list item. Using MAX eliminates
    // that length bias — a bullet scores by its single most-visited subject,
    // regardless of how many other topics it mentions.)
    const linkScores = (c.allLinks || [])
      .filter((link) => !isGenericSlug(link))
      .map((link) => pageviews[link] || 0);
    let score = linkScores.length > 0 ? Math.max(...linkScores) : 0;
    if (c.hasBold) score = Math.round(score * 1.5);
    return { ...c, _score: score };
  });

  scored.sort((a, b) => b._score - a._score);

  // Dedup by title (case-insensitive) — after scoring, keep the highest-scored
  // entry per title. This catches cases where two different events end up with
  // the same humanized-slug title (e.g. two "Egypt" events from different links
  // in different entries that both resolved to Egypt's Wikipedia page).
  const seenTitles = new Set();
  const deduped = [];
  for (const s of scored) {
    const titleKey = (s.title || "").toLowerCase().trim();
    if (!titleKey || seenTitles.has(titleKey)) continue;
    seenTitles.add(titleKey);
    deduped.push(s);
    if (deduped.length >= 5) break;
  }

  return deduped.map(({ _score, allLinks, hasBold, ...rest }) => rest);
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
  // Re-fetch years that are: missing, empty array, or have events with empty titles
  // (caused by earlier script bugs).
  const years = [];
  // "Bad title" heuristics — any of these means the entry should be retried:
  // - No title, or too short
  // - Ends with "…" (truncated mid-sentence)
  // - Ends with " of", " is", " in", etc. (fragment from bad truncation)
  // - Ends in a single capital letter (e.g. "Supreme Leader of I")
  const hasBadTitle = (t) => {
    if (!t || typeof t !== "string" || t.length < 3) return true;
    if (t.endsWith("…")) return true;
    if (/\s+(is|was|are|were|of|in|on|to|and|the|a|an|by|for)\s*$/i.test(t)) return true;
    if (/\s+[A-Z]$/.test(t)) return true;
    return false;
  };
  // Check for duplicate titles within a year's events (case-insensitive)
  const hasDuplicateTitles = (events) => {
    const seen = new Set();
    for (const e of events) {
      const key = (e?.title || "").toLowerCase().trim();
      if (key && seen.has(key)) return true;
      seen.add(key);
    }
    return false;
  };
  // A body longer than 500 chars usually means multiple events were combined
  // into one Wikipedia bullet (e.g. Apollo 1 fire + Outer Space Treaty signing
  // both squeezed into one January 27 entry). Re-ranking with MAX scoring should
  // push these down in favor of cleaner single-event entries.
  const hasOversizedBody = (events) =>
    events.some((e) => e && typeof e.body === "string" && e.body.length > 500);
  for (let y = START_YEAR; y <= END_YEAR; y++) {
    if (y === 0) continue;
    const existing_entry = existing[String(y)];
    const isGood = Array.isArray(existing_entry)
      && existing_entry.length >= 3
      && existing_entry.every((e) => e && !hasBadTitle(e.title))
      && !hasDuplicateTitles(existing_entry)
      && !hasOversizedBody(existing_entry);
    if (!isGood) years.push(y);
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
