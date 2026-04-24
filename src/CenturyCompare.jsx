import { useState, useMemo, useEffect } from "react";
import { ExternalLink, Search, ArrowUp, ArrowDown, BookOpen, Infinity as InfinityIcon, Loader2, Minus, Sparkles, TrendingUp, ChevronLeft, ChevronRight, Clock } from "lucide-react";

// ===================================================================
// DEEP TIME — kept static (pageviews not useful here)
// ===================================================================
const ev = (title, detail, wiki) => ({ title, detail, wiki });
const DEEP_TIME = [
  { yearsAgo: 3000, label: "c. 1000 BCE", era: "Iron Age",
    key: [
      ev("Iron Working Spreads", "Technology of smelting iron spreads across Eurasia and Africa, enabling stronger tools and weapons than the preceding Bronze Age.", "Iron_Age"),
      ev("Phoenician Alphabet", "A 22-letter script developed in the Levant becomes the ancestor of Greek, Latin, Arabic, and Hebrew writing.", "Phoenician_alphabet"),
      ev("Composition of the Rigveda", "Sanskrit hymns transmitted orally for centuries are among the oldest surviving religious texts.", "Rigveda"),
      ev("Bronze Age Collapse Aftermath", "Late Bronze Age civilizations of the eastern Mediterranean collapsed ~1177 BCE; survivors are rebuilding.", "Late_Bronze_Age_collapse"),
      ev("Olmec Civilization Rises", "First major Mesoamerican culture flourishes in what is now Mexico.", "Olmecs"),
    ],
  },
  { yearsAgo: 5000, label: "c. 3000 BCE", era: "Dawn of Writing",
    key: [
      ev("Cuneiform Writing Emerges", "Sumerians in Mesopotamia develop wedge-shaped writing on clay tablets — the first known writing system.", "Cuneiform"),
      ev("Egyptian Hieroglyphs", "Parallel writing system emerges in Egypt.", "Egyptian_hieroglyphs"),
      ev("The Bronze Age Begins", "Copper and tin alloy reshapes tools, weapons, and trade routes across Eurasia.", "Bronze_Age"),
      ev("Wheeled Vehicles Spread", "Evidence of wheeled carts from Mesopotamia to the Pontic steppe transforms transport and warfare.", "History_of_the_wheel"),
      ev("Indus Valley Civilization Rising", "Planned cities at Harappa and Mohenjo-Daro feature drainage, standardized bricks, and writing we still can't read.", "Indus_Valley_Civilisation"),
    ],
  },
  { yearsAgo: 10000, label: "c. 8000 BCE", era: "Agricultural Revolution",
    key: [
      ev("Agriculture Begins", "In the Fertile Crescent, humans start domesticating wheat, barley, sheep, and goats.", "Neolithic_Revolution"),
      ev("End of the Last Ice Age", "The Pleistocene ends; glaciers retreat; sea levels rise dramatically.", "Last_Glacial_Period"),
      ev("Göbekli Tepe Built", "Massive stone temple complex in Turkey predates agriculture.", "G%C3%B6bekli_Tepe"),
      ev("Jericho Settled", "One of the oldest continuously inhabited cities begins as a permanent settlement.", "Jericho"),
      ev("Megafauna Extinctions", "Mammoths, saber-toothed cats, giant sloths, and many other large mammals go extinct.", "Quaternary_extinction_event"),
    ],
  },
  { yearsAgo: 50000, label: "c. 48,000 BCE", era: "Upper Paleolithic",
    key: [
      ev("Cognitive Revolution", "Modern humans develop symbolic thought, complex language, art, and long-range trade networks.", "Behavioral_modernity"),
      ev("Cave Art Flourishes", "Paintings in caves like Chauvet and Sulawesi show stunning artistic sophistication.", "Cave_painting"),
      ev("Homo Sapiens Reaches Australia", "Humans cross open ocean to colonize Australia.", "Prehistory_of_Australia"),
      ev("Neanderthals Begin to Disappear", "Our closest cousins fade from the fossil record around 40,000 years ago.", "Neanderthal_extinction"),
      ev("First Musical Instruments", "Bone flutes found in Germany are among the oldest known instruments.", "Prehistoric_music"),
    ],
  },
  { yearsAgo: 300000, label: "c. 300,000 BCE", era: "Emergence of Homo Sapiens",
    key: [
      ev("Anatomically Modern Humans", "Earliest known Homo sapiens fossils from Jebel Irhoud, Morocco.", "Homo_sapiens"),
      ev("Control of Fire Mastered", "Regular, controlled use of fire is well established among hominins.", "Control_of_fire_by_early_humans"),
      ev("Multiple Human Species Coexist", "Homo erectus, Neanderthals, Denisovans, and others share the planet.", "Hominini"),
      ev("Stone Tool Sophistication", "Middle Stone Age toolmakers produce hafted spears and refined hand axes.", "Stone_tool"),
      ev("Ice Ages Come and Go", "Cycles of glacial and interglacial periods drive migration and adaptation.", "Quaternary_glaciation"),
    ],
  },
  { yearsAgo: 2_000_000, label: "c. 2 million BCE", era: "Early Stone Age",
    key: [
      ev("Homo Habilis, 'Handy Man'", "Early human ancestors in Africa use simple stone tools.", "Homo_habilis"),
      ev("First Stone Tools", "Deliberately chipped stones mark the start of the archaeological record.", "Oldowan"),
      ev("Savanna Adaptation", "Bipedalism frees hands for tool use; brains grow larger.", "Bipedalism"),
      ev("Pleistocene Begins", "Epoch of repeated ice ages begins.", "Pleistocene"),
      ev("Homo Erectus Emerges", "Longer-legged, larger-brained ancestor will spread out of Africa.", "Homo_erectus"),
    ],
  },
  { yearsAgo: 65_000_000, label: "65 million BCE", era: "End of the Dinosaurs",
    key: [
      ev("Chicxulub Impact", "An asteroid ~10km wide strikes what is now Mexico.", "Chicxulub_impactor"),
      ev("Non-Avian Dinosaurs Extinct", "After 165 million years of dominance, the great reptilian lineages vanish — except the birds.", "Cretaceous%E2%80%93Paleogene_extinction_event"),
      ev("Mammals Begin to Diversify", "Small, furry survivors radiate into countless niches.", "Mammal"),
      ev("Flowering Plants Dominate", "Angiosperms continue their takeover of the plant world.", "Flowering_plant"),
      ev("Birds Survive the Apocalypse", "The one dinosaur lineage to make it through.", "Origin_of_birds"),
    ],
  },
  { yearsAgo: 540_000_000, label: "540 million BCE", era: "Cambrian Explosion",
    key: [
      ev("Cambrian Explosion", "In a geological instant, most major animal body plans appear in the fossil record.", "Cambrian_explosion"),
      ev("First Chordates Appear", "Early ancestors of all vertebrates wiggle through Cambrian seas.", "Chordate"),
      ev("Oxygen Reaches Modern Levels", "Photosynthesis by cyanobacteria has oxygenated the atmosphere enough for complex life.", "Great_Oxidation_Event"),
      ev("Eyes Evolve", "Complex image-forming eyes emerge in multiple lineages.", "Evolution_of_the_eye"),
      ev("Life Remains Aquatic", "Land is still barren.", "Colonisation_of_land"),
    ],
  },
  { yearsAgo: 2_400_000_000, label: "2.4 billion BCE", era: "Great Oxidation Event",
    key: [
      ev("The Great Oxidation", "Cyanobacteria pump oxygen into the atmosphere — 'the Oxygen Catastrophe.'", "Great_Oxidation_Event"),
      ev("Iron Oceans Rust", "Dissolved iron reacts with new oxygen, precipitating banded iron formations.", "Banded_iron_formation"),
      ev("Huronian Glaciation", "One of the longest and most severe ice ages in Earth's history.", "Huronian_glaciation"),
      ev("Eukaryotes Emerge", "Cells with nuclei appear.", "Eukaryote"),
      ev("Life is Still Microbial", "No multicellular life yet.", "Archean"),
    ],
  },
  { yearsAgo: 3_800_000_000, label: "3.8 billion BCE", era: "Origin of Life",
    key: [
      ev("Earliest Life Emerges", "Chemical self-replicators become the first cells.", "Abiogenesis"),
      ev("Late Heavy Bombardment Ending", "A period of intense asteroid impacts is tapering off.", "Late_Heavy_Bombardment"),
      ev("Oceans Form", "Water vapor condenses into the first oceans.", "Origin_of_water_on_Earth"),
      ev("Atmosphere Thickens", "Volcanic outgassing creates an atmosphere.", "Atmosphere_of_Earth"),
      ev("Moon Stabilizes Earth's Axis", "Our oversized moon keeps Earth's tilt stable.", "Moon"),
    ],
  },
  { yearsAgo: 4_540_000_000, label: "4.54 billion BCE", era: "Formation of Earth",
    key: [
      ev("Earth Accretes from Solar Nebula", "Dust and gas around the young Sun clump into planetesimals.", "History_of_Earth"),
      ev("Theia Impact Forms Moon", "A Mars-sized planet collides with proto-Earth.", "Giant-impact_hypothesis"),
      ev("The Sun Ignites", "Gravitational collapse triggers hydrogen fusion.", "Sun"),
      ev("Other Planets Form", "Mercury, Venus, Mars, and the gas giants accrete.", "Formation_and_evolution_of_the_Solar_System"),
      ev("Hadean Eon", "Earth's surface is molten rock.", "Hadean"),
    ],
  },
  { yearsAgo: 13_800_000_000, label: "13.8 billion BCE", era: "The Big Bang",
    key: [
      ev("The Big Bang", "The universe expands from an unimaginably hot, dense state.", "Big_Bang"),
      ev("Cosmic Inflation", "The universe expands faster than light in a fraction of a second.", "Inflation_(cosmology)"),
      ev("First Atoms Form", "380,000 years after the Bang, light travels freely for the first time.", "Recombination_(cosmology)"),
      ev("First Stars Ignite", "~100 million years later, the first stars fuse heavy elements.", "Stellar_population#Population_III_stars"),
      ev("Galaxies Assemble", "Gravity pulls stars and gas into the first galaxies.", "Galaxy_formation_and_evolution"),
    ],
  },
];

// ===================================================================
// SIGNIFICANT EVENTS — one anchor per century for coverage.
// These are "century representatives" — the site ranks them at runtime,
// but we seed the list so every century is represented.
// ===================================================================
const SIGNIFICANT_YEARS = [
  // Each entry is a year we suggest — the actual event will be fetched and ranked live
  // Covers every century from ancient to modern
  2024, 2020, 2001, 1989, 1969, 1945, 1918, 1905, 1876, 1859,
  1776, 1687, 1492, 1455, 1347, 1215, 1066, 1054, 960, 800,
  622, 476, 313, 100, -44, -221, -323, -500, -776,
];

// ===================================================================
// HELPERS
// ===================================================================
function currentYear() { return new Date().getFullYear(); }
function formatToday() {
  return new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}
function ordinalSuffix(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

// Wikipedia page name candidates. Order matters — we try these in sequence.
// For ambiguous short years (like "12"), AD_12 must come first.
function wikiSlugCandidates(year) {
  if (year < 0) {
    const abs = Math.abs(year);
    return [`${abs}_BC`, `${abs}_BCE`];
  }
  if (year < 1000) {
    // Small integers disambiguate away from the number page
    return [`AD_${year}`, String(year), `${year}_(year)`];
  }
  return [String(year)];
}
function yearToWikiSlug(year) { return wikiSlugCandidates(year)[0]; }

function formatYear(year) {
  if (year > 0) return String(year);
  return `${Math.abs(year)} BCE`;
}
function formatYearWithEra(year) {
  if (year > 0) return `${year} CE`;
  return `${Math.abs(year)} BCE`;
}

function parseYearInput(raw) {
  if (!raw) return null;
  const trimmed = String(raw).trim().toUpperCase();
  const bceMatch = trimmed.match(/^(\d+)\s*(BCE|BC)$/);
  if (bceMatch) return -parseInt(bceMatch[1], 10);
  const ceMatch = trimmed.match(/^(?:AD\s*)?(\d+)\s*(CE|AD)?$/);
  if (ceMatch) return parseInt(ceMatch[1], 10);
  const n = parseInt(trimmed, 10);
  return isNaN(n) ? null : n;
}

// ===================================================================
// CACHE (localStorage on deployed site, in-memory in sandbox)
// ===================================================================
const memoryCache = new Map();
const CACHE_VERSION = "v2";
const CACHE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function cacheGet(key) {
  try {
    const raw = localStorage.getItem(`cc:${CACHE_VERSION}:${key}`);
    if (!raw) return memoryCache.get(key) ?? null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.t > CACHE_MAX_AGE_MS) {
      localStorage.removeItem(`cc:${CACHE_VERSION}:${key}`);
      return null;
    }
    memoryCache.set(key, parsed.v);
    return parsed.v;
  } catch {
    return memoryCache.get(key) ?? null;
  }
}

function cacheSet(key, value) {
  const payload = { t: Date.now(), v: value };
  try {
    localStorage.setItem(`cc:${CACHE_VERSION}:${key}`, JSON.stringify(payload));
  } catch { /* sandboxed — memory only */ }
  memoryCache.set(key, value);
}

// ===================================================================
// LINK FILTERING — avoid generic/calendar links when picking event anchors
// ===================================================================
const GENERIC_SLUGS = new Set([
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
  "Common_Era", "Anno_Domini", "BC", "BCE", "AD", "CE",
  // Very common country/region links that are usually irrelevant anchors
  "United_States", "United_Kingdom", "England", "France", "Germany",
  "China", "Japan", "India", "Russia", "Europe", "Asia", "Africa",
  "North_America", "South_America",
]);

function isGenericSlug(slug) {
  if (!slug) return true;
  if (GENERIC_SLUGS.has(slug)) return true;
  // Pure numeric slugs (year links) are generic
  if (/^\d+$/.test(slug)) return true;
  // "15_January" style day-month anchors are generic
  if (/^\d{1,2}_[A-Z]/.test(slug)) return true;
  if (/^(January|February|March|April|May|June|July|August|September|October|November|December)_\d/.test(slug)) return true;
  // AD_XXX / XXX_BC year pages
  if (/^(AD_)?\d+$/.test(slug) || /^\d+_(BC|BCE|AD|CE)$/.test(slug)) return true;
  return false;
}

// ===================================================================
// EVENT TEXT PARSING
// Returns { datePrefix, body } — the whole event, capped at 3 sentences.
// The UI renders datePrefix as a small label, body as the main content.
// ===================================================================
function parseWikiEvent(raw, primaryWiki, allLinks, sectionAnchor) {
  let text = raw.trim().replace(/\s+/g, " ").replace(/\[[^\]]*\]/g, "").trim();
  const dateMatch = text.match(/^((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:\s*[-–—]\s*(?:January|February|March|April|May|June|July|August|September|October|November|December)?\s*\d{1,2})?)\s*[-–—:]\s*(.+)$/i);
  let datePrefix = null;
  let body = text;
  if (dateMatch) {
    datePrefix = dateMatch[1].trim();
    body = dateMatch[2].trim();
  }
  // Cap body at 3 sentences for readability
  const sentenceMatches = body.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (sentenceMatches && sentenceMatches.length > 3) {
    body = sentenceMatches.slice(0, 3).join("").trim();
  }
  return {
    datePrefix,
    body,
    wiki: primaryWiki,
    allLinks: allLinks,
    sectionAnchor,
  };
}

// ===================================================================
// FETCH CANDIDATES FROM WIKIPEDIA YEAR PAGE
// ===================================================================
async function fetchWikipediaCandidates(year) {
  const candidates = wikiSlugCandidates(year);
  for (const pageName of candidates) {
    try {
      const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(pageName)}&prop=text&format=json&origin=*&redirects=1`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      if (data?.error) continue;
      const html = data?.parse?.text?.["*"];
      if (!html) continue;

      const doc = new DOMParser().parseFromString(html, "text/html");
      const allHeadings = Array.from(doc.querySelectorAll("h2, h3"));
      const eventsHeading = allHeadings.find((h) => {
        const t = (h.textContent || "").trim().toLowerCase().replace(/\[edit\]/g, "").trim();
        return t === "events" || t.startsWith("events");
      });
      if (!eventsHeading) continue;

      const eventsIdx = allHeadings.indexOf(eventsHeading);
      // Strong stop signals — these definitively mark the end of events
      const strongStops = ["births", "deaths", "references", "see also", "external links", "notes", "publications", "new works"];
      let stopHeading = null;
      for (let i = eventsIdx + 1; i < allHeadings.length; i++) {
        const h = allHeadings[i];
        if (h.tagName !== "H2") continue;
        const t = (h.textContent || "").trim().toLowerCase().replace(/\[edit\]/g, "").trim();
        // Only stop at strong signals — older year pages have "By place" / "By topic" H2s
        // that still contain Events content, so skip those
        if (strongStops.some((s) => t === s || t.startsWith(s))) { stopHeading = h; break; }
      }

      const startContainer = eventsHeading.closest(".mw-heading") || eventsHeading;
      const stopContainer = stopHeading ? (stopHeading.closest(".mw-heading") || stopHeading) : null;

      // Track the current sub-section (e.g. "January") to build section anchors
      let currentSection = null;

      const collected = [];
      const walker = doc.createTreeWalker(doc.body || doc.documentElement, NodeFilter.SHOW_ELEMENT);
      let started = false;
      let node = walker.currentNode;
      while ((node = walker.nextNode())) {
        if (!started) {
          if (node === startContainer || startContainer.contains(node)) started = true;
          continue;
        }
        if (stopContainer && (node === stopContainer || stopContainer.contains(node))) break;
        // Track subsections for anchor building
        if (node.tagName === "H3" || node.tagName === "H4") {
          const id = node.id || node.querySelector("[id]")?.id;
          if (id) currentSection = id;
        }
        if (node.tagName === "LI") collected.push({ li: node, section: currentSection });
      }

      const parsed = collected.map(({ li, section }) => {
        li.querySelectorAll(".mw-editsection, sup.reference, sup.noprint, .mw-ext-cite-error, style").forEach((el) => el.remove());
        const text = li.textContent.trim();
        if (!text || text.length < 15) return null;

        // Collect all wiki links; filter out generic ones for anchor selection
        const allLinkSlugs = Array.from(li.querySelectorAll("a[href^='/wiki/']"))
          .map((a) => a.getAttribute("href"))
          .filter((h) => h && !h.includes(":"))
          .map((h) => decodeURIComponent(h.replace("/wiki/", "").split("#")[0]));

        const nonGenericLinks = allLinkSlugs.filter((s) => !isGenericSlug(s));
        // Primary anchor: first non-generic link, else fallback to year page
        const primaryWiki = nonGenericLinks[0] || pageName;

        return parseWikiEvent(text, primaryWiki, allLinkSlugs, section);
      }).filter(Boolean);

      const seen = new Set();
      const unique = parsed.filter((e) => {
        if (seen.has(e.title)) return false;
        seen.add(e.title);
        return true;
      });

      if (unique.length > 0) return { candidates: unique.slice(0, 50), pageName };
    } catch { /* try next */ }
  }
  return { error: "No Wikipedia page found" };
}

// ===================================================================
// PAGEVIEWS — cumulative across all non-generic links per event
// ===================================================================
async function fetchSinglePageview(slug) {
  const cacheKey = `pv:${slug}`;
  const cached = cacheGet(cacheKey);
  if (cached !== null) return cached;

  const end = new Date();
  const start = new Date(end.getTime() - 60 * 24 * 60 * 60 * 1000);
  const fmt = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  try {
    const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/${encodeURIComponent(slug)}/daily/${fmt(start)}/${fmt(end)}`;
    const res = await fetch(url);
    if (!res.ok) { cacheSet(cacheKey, 0); return 0; }
    const data = await res.json();
    const total = (data.items || []).reduce((sum, item) => sum + (item.views || 0), 0);
    cacheSet(cacheKey, total);
    return total;
  } catch {
    cacheSet(cacheKey, 0);
    return 0;
  }
}

// Fetch pageviews for many slugs with concurrency control
async function fetchPageviewsBatch(slugs) {
  const results = {};
  const BATCH = 5;
  for (let i = 0; i < slugs.length; i += BATCH) {
    const batch = slugs.slice(i, i + BATCH);
    await Promise.all(batch.map(async (slug) => {
      results[slug] = await fetchSinglePageview(slug);
    }));
  }
  return results;
}

// ===================================================================
// RANK EVENTS BY CUMULATIVE PAGEVIEWS
// ===================================================================
async function fetchRankedEvents(year) {
  const cacheKey = `year:${year}`;
  const cached = cacheGet(cacheKey);
  if (cached) return { events: cached, cached: true };

  const { candidates, error } = await fetchWikipediaCandidates(year);
  if (error || !candidates) return { error: error || "No candidates found" };

  // Gather ALL non-generic links across all candidates and fetch pageviews once
  const allSlugs = new Set();
  for (const c of candidates) {
    for (const link of c.allLinks || []) {
      if (!isGenericSlug(link)) allSlugs.add(link);
    }
  }
  const pageviews = await fetchPageviewsBatch([...allSlugs]);

  // Score each event: SUM of pageviews for all non-generic links in that event
  const scored = candidates.map((c) => {
    const score = (c.allLinks || [])
      .filter((link) => !isGenericSlug(link))
      .reduce((sum, link) => sum + (pageviews[link] || 0), 0);
    return { ...c, _score: score };
  });

  scored.sort((a, b) => b._score - a._score);
  const top = scored.slice(0, 5).map(({ _score, allLinks, ...rest }) => rest);

  cacheSet(cacheKey, top);
  return { events: top, cached: false };
}

// ===================================================================
// STACK BUILDER
// ===================================================================
function buildStack(anchor) {
  const cy = currentYear();
  const items = [];

  // Centuries after anchor — walk forward until we reach current year + 1 future century
  // (cap at 10 to prevent absurd stacks for very ancient anchors)
  const maxForward = Math.min(10, Math.ceil((cy + 100 - anchor) / 100));
  for (let i = maxForward; i >= 1; i--) {
    const target = anchor + 100 * i;
    if (target <= cy + 100) {
      items.push({ year: target, isAnchor: false, offset: 100 * i, isFuture: target > cy });
    }
  }

  items.push({ year: anchor, isAnchor: true, offset: 0, isFuture: anchor > cy });

  // Centuries before anchor
  let i = 1;
  while (i <= 30) {
    const target = anchor - 100 * i;
    if (target < -3000) break;
    items.push({ year: target, isAnchor: false, offset: -100 * i, isFuture: false });
    i++;
  }
  return items;
}

function formatYearsAgo(yearsAgo) {
  if (yearsAgo >= 1e9) return `${(yearsAgo / 1e9).toFixed(1)} billion years ago`;
  if (yearsAgo >= 1e6) return `${(yearsAgo / 1e6).toFixed(0)} million years ago`;
  if (yearsAgo >= 1e3) return `${(yearsAgo / 1e3).toFixed(0)},000 years ago`;
  return `${yearsAgo} years ago`;
}

// ===================================================================
// MAIN
// ===================================================================
const SIGNIFICANT_PAGE_SIZE = 8;

export default function CenturyCompare() {
  // Default: current year (shows "events so far" via pageview ranking)
  const initialAnchor = currentYear();
  const [input, setInput] = useState(String(initialAnchor));
  const [anchor, setAnchor] = useState(initialAnchor);
  const [expanded, setExpanded] = useState(null);
  const [showDeepTime, setShowDeepTime] = useState(false);
  const [sigPage, setSigPage] = useState(0);

  const stack = useMemo(() => buildStack(anchor), [anchor]);

  const totalSigPages = Math.ceil(SIGNIFICANT_YEARS.length / SIGNIFICANT_PAGE_SIZE);
  const pageYears = SIGNIFICANT_YEARS.slice(sigPage * SIGNIFICANT_PAGE_SIZE, (sigPage + 1) * SIGNIFICANT_PAGE_SIZE);

  const submit = (e) => {
    e?.preventDefault();
    const n = parseYearInput(input);
    if (n !== null && n >= -3000 && n <= 2100 && n !== 0) {
      setAnchor(n);
      setExpanded(null);
      setShowDeepTime(false);
      // Scroll to anchor after render
      setTimeout(() => {
        const el = document.getElementById(`year-${n}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  const jumpTo = (y) => {
    setInput(formatYear(y));
    setAnchor(y);
    setExpanded(null);
    setShowDeepTime(false);
    setTimeout(() => {
      const el = document.getElementById(`year-${y}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen" style={{
      background: "linear-gradient(180deg, #1a1612 0%, #2a221b 50%, #0a0812 100%)",
      color: "#f0e6d2",
      fontFamily: "'Fraunces', Georgia, serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />

      <header className="px-5 md:px-12 py-6" style={{ borderBottom: "1px solid #3d3528" }}>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-none" style={{ color: "#f5ead0" }}>
          A Century <em className="italic font-normal" style={{ color: "#d4a856" }}>Apart</em>
        </h1>
        <p className="mt-2 text-xs md:text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9a8b6f" }}>
          Enter a year. Events ranked by Wikipedia pageview popularity.
        </p>
      </header>

      {/* Input */}
      <div className="px-5 md:px-12 py-5" style={{ borderBottom: "1px solid #3d3528", background: "#221c15" }}>
        <form onSubmit={submit} className="flex gap-2 items-stretch">
          <div className="flex-1 flex items-center gap-2 px-3" style={{ background: "#0f0c09", border: "1px solid #5c4a30", borderRadius: "2px" }}>
            <Search size={18} style={{ color: "#9a8b6f" }} />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. 1969 or 44 BCE"
              className="flex-1 outline-none text-lg font-semibold bg-transparent py-2.5 min-w-0"
              style={{ fontFamily: "'Fraunces', serif", color: "#f5ead0" }}
            />
          </div>
          <button type="submit"
            className="px-5 text-xs uppercase tracking-widest font-semibold transition-all hover:brightness-110"
            style={{
              background: "linear-gradient(180deg, #d4a856 0%, #b88a3d 100%)",
              color: "#1a1612",
              fontFamily: "'JetBrains Mono', monospace",
              borderRadius: "2px",
              boxShadow: "0 2px 0 #8a6428",
            }}>
            Go
          </button>
        </form>
      </div>

      {/* Significant Events — paginated, one per century */}
      <div className="px-5 md:px-12 py-5" style={{ borderBottom: "1px solid #3d3528" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={14} style={{ color: "#d4a856" }} />
            <div className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#d4a856" }}>
              Significant Years
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSigPage((p) => Math.max(0, p - 1))}
              disabled={sigPage === 0}
              className="p-1 transition-opacity disabled:opacity-30"
              style={{ color: "#d4a856" }}
              aria-label="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9a8b6f" }}>
              {sigPage + 1}/{totalSigPages}
            </span>
            <button
              onClick={() => setSigPage((p) => Math.min(totalSigPages - 1, p + 1))}
              disabled={sigPage === totalSigPages - 1}
              className="p-1 transition-opacity disabled:opacity-30"
              style={{ color: "#d4a856" }}
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {pageYears.map((year) => {
            const active = anchor === year;
            // Compute century label
            const centuryLabel = year > 0
              ? `${Math.floor((year - 1) / 100) + 1}${ordinalSuffix(Math.floor((year - 1) / 100) + 1)} century`
              : `${Math.floor((Math.abs(year) - 1) / 100) + 1}${ordinalSuffix(Math.floor((Math.abs(year) - 1) / 100) + 1)} century BCE`;
            return (
              <button
                key={year}
                onClick={() => jumpTo(year)}
                className="text-left flex items-baseline gap-3 py-1.5 px-2.5 transition-all hover:brightness-125"
                style={{
                  background: active ? "#d4a85620" : "transparent",
                  border: `1px solid ${active ? "#d4a856" : "#3d3528"}`,
                  borderRadius: "2px",
                }}
              >
                <span className="text-sm font-bold shrink-0 w-24" style={{ color: active ? "#d4a856" : "#f5ead0", fontFamily: "'Fraunces', serif" }}>
                  {formatYear(year)}
                </span>
                <span className="text-xs" style={{ color: "#9a8b6f", fontFamily: "'JetBrains Mono', monospace" }}>
                  {centuryLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Direction hint */}
      <div className="px-5 md:px-12 py-3 flex items-center justify-center gap-4 text-xs" style={{ color: "#9a8b6f", fontFamily: "'JetBrains Mono', monospace", background: "#1a1612" }}>
        <span className="flex items-center gap-1"><ArrowUp size={12} /> newer</span>
        <span style={{ color: "#5c4a30" }}>·</span>
        <span className="flex items-center gap-1">older <ArrowDown size={12} /></span>
      </div>

      <main className="px-5 md:px-12 py-8">
        <div className="space-y-14 max-w-3xl mx-auto">
          {stack.map((item) => {
            const depthIdx = Math.abs(item.offset / 100);
            const color = item.isAnchor
              ? "#e8923d"
              : item.offset > 0
                ? ["#7ba8d4", "#8fb3a0", "#a48fc2"][depthIdx - 1] || "#9a8b6f"
                : ["#9dc68c", "#c89a5c", "#b8739a", "#7aa890", "#a48fc2", "#d4a856", "#a08a6c", "#8fb3a0", "#c28a7a", "#7a9bb8"][depthIdx - 1] || "#9a8b6f";

            return (
              <YearBlock
                key={item.year}
                year={item.year}
                accent={color}
                isAnchor={item.isAnchor}
                offset={item.offset}
                isFuture={item.isFuture}
                expanded={expanded}
                setExpanded={setExpanded}
              />
            );
          })}

          <EdgeOfHistoryGateway open={showDeepTime} onToggle={() => setShowDeepTime((s) => !s)} />

          {showDeepTime && (
            <div className="space-y-14 pt-2">
              {DEEP_TIME.map((era, idx) => {
                const colors = ["#b8a878", "#a89060", "#8a7a5c", "#6c7a5a", "#5c6b6f", "#4a5a6c", "#3a4a6c", "#4a3a6c", "#5c3a5a", "#6c2a4a", "#7a2a3a", "#8a1a1a"];
                const color = colors[idx] || "#5a4a3a";
                return <DeepTimeBlock key={era.yearsAgo} era={era} accent={color} expanded={expanded} setExpanded={setExpanded} />;
              })}
              <FinalMessage />
            </div>
          )}
        </div>
      </main>

      <footer className="px-5 md:px-12 py-6 text-xs" style={{ borderTop: "1px solid #3d3528", color: "#5c4a30", fontFamily: "'JetBrains Mono', monospace" }}>
        Events ranked by cumulative Wikipedia pageviews (last 60 days). Cached for 30 days per year.
      </footer>
    </div>
  );
}

function YearBlock({ year, accent, isAnchor, offset, isFuture, expanded, setExpanded }) {
  const [wikiEvents, setWikiEvents] = useState(null);
  const [loading, setLoading] = useState(!isFuture);
  const [fetchError, setFetchError] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    if (isFuture) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    setFetchError(null);
    fetchRankedEvents(year).then((result) => {
      if (cancelled) return;
      if (result?.events) {
        setWikiEvents(result.events);
        setFromCache(result.cached || false);
      } else {
        setFetchError(result?.error || "Unknown error");
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [year, isFuture]);

  const eraBadge = year < 0 ? "BCE" : "CE";
  const yearNumber = Math.abs(year);
  const wikiSlug = yearToWikiSlug(year);
  const wikiUrl = `https://en.wikipedia.org/wiki/${wikiSlug}`;

  // Build event-specific URL — link to the year page with section anchor if we have one
  const eventUrl = (event) => {
    // If the primary wiki link isn't generic, go there directly
    if (event.wiki && !isGenericSlug(event.wiki)) {
      return `https://en.wikipedia.org/wiki/${event.wiki}`;
    }
    // Otherwise, link to the year page's Events section (or subsection if known)
    if (event.sectionAnchor) {
      return `${wikiUrl}#${event.sectionAnchor}`;
    }
    return `${wikiUrl}#Events`;
  };

  // Future year block
  if (isFuture) {
    return (
      <section id={`year-${year}`} style={{
        background: isAnchor ? "#2a2218" : "transparent",
        padding: isAnchor ? "20px" : "0",
        border: isAnchor ? `1px solid ${accent}40` : "none",
        borderRadius: isAnchor ? "4px" : "0",
      }}>
        <div className="flex items-baseline gap-3 mb-4 pb-3" style={{ borderBottom: `2px solid ${accent}` }}>
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase tracking-[0.2em] px-1.5 py-0.5 mb-1"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: accent, border: `1px solid ${accent}60`, borderRadius: "2px" }}>
              {eraBadge}
            </span>
            <h2 className="text-5xl md:text-7xl font-bold leading-none tracking-tighter" style={{ color: accent }}>
              {yearNumber}
            </h2>
          </div>
          <div className="flex-1 text-right">
            <div className="text-[10px] uppercase tracking-widest flex items-center justify-end gap-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>
              <Clock size={10} /> Not here yet
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3" style={{
          background: `linear-gradient(90deg, ${accent}12 0%, transparent 100%)`,
          border: `1px solid ${accent}30`,
          borderLeftWidth: "3px",
          borderRadius: "2px",
        }}>
          <p className="text-[15px] leading-relaxed" style={{ color: "#d4c7a8" }}>
            The future hasn't happened yet. But humanity keeps a running list of what's coming — scheduled missions, planned anniversaries, predicted milestones, and treaties with long tails. Here are good places to explore.
          </p>
          <div className="flex flex-col gap-2">
            <a href="https://en.wikipedia.org/wiki/List_of_future_events" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 py-2.5 px-3 text-xs transition-all hover:brightness-125"
              style={{
                background: "transparent",
                color: accent,
                border: `1px solid ${accent}60`,
                fontFamily: "'JetBrains Mono', monospace",
                borderRadius: "2px",
                textDecoration: "none",
              }}>
              <span className="uppercase tracking-widest">▸ List of future events</span>
              <ExternalLink size={12} />
            </a>
            <a href="https://en.wikipedia.org/wiki/Timeline_of_the_near_future" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 py-2.5 px-3 text-xs transition-all hover:brightness-125"
              style={{
                background: "transparent",
                color: accent,
                border: `1px solid ${accent}60`,
                fontFamily: "'JetBrains Mono', monospace",
                borderRadius: "2px",
                textDecoration: "none",
              }}>
              <span className="uppercase tracking-widest">▸ Timeline of the near future</span>
              <ExternalLink size={12} />
            </a>
            {year >= 2101 && (
              <a href="https://en.wikipedia.org/wiki/3rd_millennium" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 py-2.5 px-3 text-xs transition-all hover:brightness-125"
                style={{
                  background: "transparent",
                  color: accent,
                  border: `1px solid ${accent}60`,
                  fontFamily: "'JetBrains Mono', monospace",
                  borderRadius: "2px",
                  textDecoration: "none",
                }}>
                <span className="uppercase tracking-widest">▸ Predictions for the 3rd millennium</span>
                <ExternalLink size={12} />
              </a>
            )}
            <a href={wikiUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 py-2.5 px-3 text-xs transition-all hover:brightness-125"
              style={{
                background: accent,
                color: "#1a1612",
                fontFamily: "'JetBrains Mono', monospace",
                borderRadius: "2px",
                textDecoration: "none",
                fontWeight: 600,
              }}>
              <span className="uppercase tracking-widest">▸ Wikipedia's {yearNumber} page</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={`year-${year}`} style={{
      background: isAnchor ? "#2a2218" : "transparent",
      padding: isAnchor ? "20px" : "0",
      border: isAnchor ? `1px solid ${accent}40` : "none",
      borderRadius: isAnchor ? "4px" : "0",
    }}>
      <div className="flex items-baseline gap-3 mb-4 pb-3" style={{ borderBottom: `2px solid ${accent}` }}>
        <div className="flex flex-col items-start">
          <span className="text-[10px] uppercase tracking-[0.2em] px-1.5 py-0.5 mb-1"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: accent, border: `1px solid ${accent}60`, borderRadius: "2px" }}>
            {eraBadge}
          </span>
          <h2 className="text-5xl md:text-7xl font-bold leading-none tracking-tighter" style={{ color: accent }}>
            {yearNumber}
          </h2>
        </div>
        <div className="flex-1 text-right">
          <div className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9a8b6f" }}>
            {isAnchor ? (year === currentYear() ? "So far" : "Your year") : offset > 0 ? `+${offset} years` : `${offset} years`}
          </div>
          <div className="text-xs mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#d4a856" }}>
            {loading ? "ranking…" : wikiEvents ? `top ${wikiEvents.length} by pageviews` : "no data"}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-4 text-sm" style={{ color: "#9a8b6f" }}>
          <Loader2 size={14} className="animate-spin" /> Fetching & ranking by Wikipedia popularity…
        </div>
      )}

      {!loading && !wikiEvents && fetchError && (
        <div className="py-4 text-sm italic space-y-2" style={{ color: "#9a8b6f" }}>
          <div>Couldn't load events for {yearNumber} {eraBadge}.</div>
          <div className="text-xs not-italic" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#6c5a3a" }}>⚠ {fetchError}</div>
          <div>
            Try{" "}
            <a href={wikiUrl} target="_blank" rel="noopener noreferrer"
               className="underline hover:no-underline" style={{ color: accent }}>the Wikipedia page</a>{" "}directly.
          </div>
        </div>
      )}

      {wikiEvents && (
        <>
          <div className="mb-3 text-[10px] uppercase tracking-widest flex items-center gap-1.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>
            <TrendingUp size={10} />
            <span>Ranked by cumulative pageviews (60 days)</span>
            {fromCache && <span style={{ opacity: 0.6 }}>· cached</span>}
          </div>
          <ol className="space-y-0">
            {wikiEvents.map((event, i) => {
              const linkUrl = eventUrl(event);
              return (
                <li key={i} style={{ borderBottom: "1px solid #3d3528" }} className="py-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xs mt-1.5 shrink-0 w-6" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9a8b6f" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      {event.datePrefix && (
                        <div className="text-[10px] uppercase tracking-widest mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>
                          {event.datePrefix}
                        </div>
                      )}
                      <p className="text-[15px] leading-relaxed" style={{ color: "#f5ead0" }}>
                        {event.body}
                      </p>
                      <div className="mt-2">
                        <a href={linkUrl} target="_blank" rel="noopener noreferrer"
                           className="inline-flex items-center gap-1 text-xs uppercase tracking-widest hover:underline"
                           style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>
                          Read more <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-5">
            <a href={wikiUrl} target="_blank" rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-widest font-semibold transition-all hover:brightness-125"
              style={{ background: "transparent", color: "#d4a856", border: "1px solid #5c4a30", fontFamily: "'JetBrains Mono', monospace", borderRadius: "2px", textDecoration: "none" }}>
              <BookOpen size={14} /> Read more about {yearNumber} {eraBadge}
            </a>
          </div>
        </>
      )}
    </section>
  );
}

function EdgeOfHistoryGateway({ open, onToggle }) {
  return (
    <div className="py-6">
      <div className="text-center mb-4">
        <p className="text-sm italic" style={{ color: "#9a8b6f" }}>Here written records grow thin.</p>
        <p className="text-xs mt-1" style={{ color: "#5c4a30", fontFamily: "'JetBrains Mono', monospace" }}>
          Beyond lies archaeology, then geology, then the cosmos itself.
        </p>
      </div>
      <button onClick={onToggle}
        className="w-full py-4 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-semibold transition-all hover:brightness-125"
        style={{
          background: open ? "transparent" : "linear-gradient(90deg, #2a221b 0%, #3a2a1b 50%, #2a221b 100%)",
          color: "#d4a856",
          border: "1px solid #5c4a30",
          fontFamily: "'JetBrains Mono', monospace",
          borderRadius: "2px",
        }}>
        {open ? <><Minus size={14} /> Collapse deep time</> : <><InfinityIcon size={14} /> Venture into deep time</>}
      </button>
    </div>
  );
}

function DeepTimeBlock({ era, accent, expanded, setExpanded }) {
  return (
    <section>
      <div className="mb-4 pb-3" style={{ borderBottom: `2px solid ${accent}` }}>
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <h2 className="text-3xl md:text-5xl font-bold leading-none tracking-tight" style={{ color: accent, fontStyle: "italic" }}>
            {era.era}
          </h2>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9a8b6f" }}>
              {formatYearsAgo(era.yearsAgo)}
            </div>
            <div className="text-xs mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>
              {era.label}
            </div>
          </div>
        </div>
      </div>
      <ol className="space-y-0">
        {era.key.map((event, i) => {
          return (
            <li key={i} style={{ borderBottom: "1px solid #3d3528" }} className="py-4">
              <div className="flex items-start gap-3">
                <span className="text-xs mt-1.5 shrink-0 w-6" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9a8b6f" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-semibold mb-1" style={{ color: "#f5ead0" }}>{event.title}</h3>
                  <p className="leading-relaxed text-[15px]" style={{ color: "#d4c7a8" }}>
                    {event.detail}
                  </p>
                  <div className="mt-2">
                    <a href={`https://en.wikipedia.org/wiki/${event.wiki}`} target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center gap-1 text-xs uppercase tracking-widest hover:underline"
                       style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>
                      Read more <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function FinalMessage() {
  return (
    <div className="mt-8 p-10 text-center" style={{ background: "radial-gradient(ellipse at center, #1a0f2a 0%, transparent 70%)", borderTop: "1px solid #3d2850" }}>
      <div className="text-5xl mb-4" style={{ color: "#6c4a9a" }}>✦</div>
      <p className="text-xl md:text-2xl font-semibold mb-4 italic" style={{ color: "#a48fc2" }}>And before the Big Bang?</p>
      <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: "#9a8ba8" }}>
        We don't know. Time itself may not have existed. Physics breaks down at the singularity, and every theory of what came before remains speculation.
      </p>
      <p className="text-sm leading-relaxed max-w-lg mx-auto mt-3 italic" style={{ color: "#7a6b9a" }}>
        The record is silent. Here our timeline ends.
      </p>
      <p className="text-xs mt-6 uppercase tracking-widest" style={{ color: "#4a3a6c", fontFamily: "'JetBrains Mono', monospace" }}>✦ t = 0 ✦</p>
    </div>
  );
}
