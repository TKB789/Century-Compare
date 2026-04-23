import { useState, useMemo, useEffect } from "react";
import { ExternalLink, Search, ArrowDown, Plus, Minus, BookOpen, Infinity as InfinityIcon, CornerDownRight, Loader2, Info } from "lucide-react";

// Event shape: title, detail, wiki (slug). Optional `footnote` for context on niche items.
const ev = (title, detail, wiki, footnote) => ({ title, detail, wiki, footnote });

// ===================================================================
// CURATED DATASET — globally rebalanced, emphasis on well-referenced events
// Years stored internally as integers; negative = BCE. So 525 = 525 CE, -500 = 500 BCE.
// ===================================================================
const EVENTS = {
  "-500": {
    displayYear: "500 BCE",
    key: [
      ev("Buddha and Confucius Active", "Siddhartha Gautama is teaching in northern India; Confucius is developing his ethical philosophy in China. The 'Axial Age' reshapes human thought across civilizations.", "Axial_Age"),
      ev("Roman Republic Founded (509 BCE)", "Romans overthrow their last king, Tarquinius Superbus, and establish a republic that will last nearly 500 years.", "Roman_Republic"),
      ev("Persian Empire at its Peak", "Under Darius I, the Achaemenid Persian Empire stretches from the Indus Valley to the Balkans — the largest empire the world has yet seen.", "Achaemenid_Empire"),
      ev("Greco-Persian Wars Begin", "Ionian Greek cities revolt against Persian rule in 499 BCE, triggering the wars that will produce Marathon, Thermopylae, and Salamis.", "Greco-Persian_Wars"),
      ev("Zapotec Civilization Rises", "Monte Albán, high above the valley of Oaxaca, becomes one of Mesoamerica's first true urban centers.", "Monte_Alb%C3%A1n"),
    ],
    seeAlso: [
      { year: -490, note: "Battle of Marathon — Greeks defeat Persian invasion" },
      { year: -480, note: "Battles of Thermopylae and Salamis" },
    ],
  },
  525: {
    displayYear: "525 CE",
    key: [
      ev("Justinian Rises to Power", "Future Eastern Roman emperor takes the throne in 527; will codify Roman law and reconquer much of the Mediterranean.", "Justinian_I"),
      ev("Volcanic Winter of 536", "A massive volcanic eruption will darken skies globally next decade, causing crop failures from China to Ireland.", "Volcanic_winter_of_536"),
      ev("Gupta Empire Collapses", "India's classical golden age of mathematics, astronomy, and art is fading under Hun invasions.", "Gupta_Empire"),
      ev("Buddhism Flourishes in East Asia", "Mahayana Buddhism deepens its roots in China and is about to reach Japan officially (538 CE).", "Buddhism_in_China"),
      ev("Maya Classic Period Peaks", "In Mesoamerica, cities like Tikal and Palenque thrive as centers of astronomy, writing, and monumental architecture.", "Maya_civilization"),
    ],
    seeAlso: [
      { year: 541, note: "Plague of Justinian — first recorded bubonic pandemic" },
      { year: 622, note: "Muhammad's Hijra — start of Islamic calendar" },
    ],
  },
  1225: {
    displayYear: "1225 CE",
    key: [
      ev("Mongol Empire Expands", "Genghis Khan's conquests are reshaping Eurasia; he will die in 1227 leaving the largest contiguous land empire in history.", "Mongol_Empire"),
      ev("Thomas Aquinas Born", "Future philosopher-theologian will synthesize Aristotle and Christian thought, shaping Western philosophy for centuries.", "Thomas_Aquinas"),
      ev("Magna Carta Reissued", "King Henry III confirms the 1215 charter, cementing its role in English constitutional law.", "Magna_Carta"),
      ev("Delhi Sultanate Consolidates", "Under Iltutmish, the Turkic-led sultanate becomes the dominant power in northern India.", "Delhi_Sultanate"),
      ev("Kamakura Shogunate Rules Japan", "Hōjō clan governs as regents; samurai culture and Zen Buddhism are taking shape.", "Kamakura_shogunate"),
    ],
    seeAlso: [
      { year: 1215, note: "Magna Carta signed" },
      { year: 1227, note: "Death of Genghis Khan" },
      { year: 1258, note: "Mongol sack of Baghdad" },
    ],
  },
  1525: {
    displayYear: "1525 CE",
    key: [
      ev("Mughal Empire Founded", "Babur defeats the Delhi Sultanate at the First Battle of Panipat (1526), founding an empire that will rule much of India for three centuries.", "Mughal_Empire"),
      ev("German Peasants' War Crushed", "Largest European popular uprising before the French Revolution ends with ~100,000 peasants killed.", "German_Peasants%27_War"),
      ev("Reformation Spreads Across Europe", "Luther's movement has fractured Western Christianity; Tyndale prints the first English New Testament this year.", "Reformation"),
      ev("Inca Empire at Its Height", "Huayna Capac rules from modern Ecuador to Chile — but smallpox arriving from Spanish contact will soon devastate the empire.", "Inca_Empire"),
      ev("Suleiman the Magnificent Ascendant", "Ottoman sultan is at the peak of his 46-year reign; will besiege Vienna in 1529.", "Suleiman_the_Magnificent"),
    ],
    seeAlso: [
      { year: 1517, note: "Luther's 95 Theses spark the Reformation" },
      { year: 1521, note: "Fall of Tenochtitlan to Cortés" },
      { year: 1533, note: "Pizarro captures the Inca emperor Atahualpa" },
    ],
  },
  1625: {
    displayYear: "1625 CE",
    key: [
      ev("Charles I Crowned in England", "His reign will end in civil war and public execution in 1649 — a revolution in royal accountability.", "Charles_I_of_England"),
      ev("Thirty Years' War Rages", "Europe's deadliest religious conflict continues; will kill up to 8 million before ending in 1648.", "Thirty_Years%27_War"),
      ev("Dutch Buy Manhattan (1626)", "Peter Minuit 'purchases' Manhattan from Lenape people for ~60 guilders — founding of New Amsterdam.", "Manhattan"),
      ev("Ming Dynasty Weakens", "Famines, peasant revolts, and Manchu pressure are eroding the dynasty, which will fall in 1644.", "Ming_dynasty"),
      ev("Safavid Persia Flourishes Under Abbas I", "Isfahan becomes one of the world's great cities; Persian art and architecture reach a pinnacle.", "Abbas_I_of_Persia"),
    ],
    seeAlso: [
      { year: 1620, note: "Mayflower lands at Plymouth" },
      { year: 1649, note: "Execution of Charles I" },
    ],
  },
  1725: {
    displayYear: "1725 CE",
    key: [
      ev("Peter the Great Dies", "Russian tsar who westernized the empire dies; succeeded by his wife Catherine I.", "Peter_the_Great"),
      ev("Qing China at its Zenith", "Under the Yongzheng Emperor, imperial China is the world's largest economy and nearing its greatest territorial extent.", "Qing_dynasty"),
      ev("Enlightenment Takes Shape", "Voltaire is imprisoned in the Bastille (1726); Montesquieu is writing. The Age of Reason is underway.", "Age_of_Enlightenment"),
      ev("Bach in Leipzig", "J.S. Bach composes cantatas and passions that define Baroque music at the height of his powers.", "Johann_Sebastian_Bach"),
      ev("Tokugawa Japan in Seclusion", "Shogunate's sakoku policy keeps Japan largely closed; domestic urban culture flourishes in Edo (Tokyo).", "Sakoku"),
    ],
    seeAlso: [
      { year: 1720, note: "South Sea Bubble bursts" },
      { year: 1776, note: "American Declaration of Independence" },
    ],
  },
  1825: {
    displayYear: "1825 CE",
    key: [
      ev("Stockton–Darlington Railway Opens", "First public railway to use steam locomotives — the railway age begins.", "Stockton_and_Darlington_Railway"),
      ev("Latin American Independence Won", "Simón Bolívar's armies complete the liberation of most of Spanish South America; Bolivia is named for him.", "Spanish_American_wars_of_independence"),
      ev("Decembrist Revolt in Russia", "Liberal army officers try to block Nicholas I's accession — crushed, but seeds later Russian reform movements.", "Decembrist_revolt"),
      ev("Haiti Forced to Pay Indemnity", "France demands 150 million francs as reparations for 'lost' slave-produced wealth — a debt that will cripple Haiti for 120 years.", "Haiti_indemnity_controversy"),
      ev("Java War Begins in Indonesia", "Prince Diponegoro leads a five-year rebellion against Dutch colonial rule — one of the most costly colonial wars in the 19th century.", "Java_War"),
    ],
    seeAlso: [
      { year: 1820, note: "Missouri Compromise; Antarctica discovered" },
      { year: 1848, note: "Revolutions sweep Europe" },
    ],
  },
  1925: {
    displayYear: "1925 CE",
    key: [
      ev("The Great Gatsby Published", "F. Scott Fitzgerald's novel captures the Jazz Age's glamour and rot — later called the Great American Novel.", "The_Great_Gatsby"),
      ev("Mein Kampf Published", "Hitler's manifesto lays out his ideology from prison. Largely ignored at the time.", "Mein_Kampf"),
      ev("Television Demonstrated", "Scottish engineer John Logie Baird demonstrates the first working television system.", "History_of_television"),
      ev("Quantum Mechanics Takes Shape", "Heisenberg formulates matrix mechanics; Schrödinger will follow with wave mechanics in 1926 — a revolution in physics.", "Matrix_mechanics"),
      ev("Scopes 'Monkey Trial'", "Tennessee teacher John Scopes prosecuted for teaching evolution — a national spectacle over science and religion.", "Scopes_trial"),
    ],
    more: [
      ev("Hitler Rebuilds the Nazi Party", "Released from prison in late 1924, he reconstitutes the NSDAP — a decade before taking power.", "Nazi_Party"),
      ev("Art Deco Named", "Paris Exposition gives the modernist design movement its name and global reach.", "Art_Deco"),
      ev("Locarno Treaties Signed", "European powers attempt to secure post-WWI peace; hopes will dissolve by the 1930s.", "Locarno_Treaties"),
      ev("Harlem Renaissance Peaks", "Langston Hughes, Zora Neale Hurston, Duke Ellington — Black American culture reshapes the nation.", "Harlem_Renaissance"),
      ev("Reza Shah Founds Pahlavi Dynasty", "Modernizing ruler takes the Iranian throne; his dynasty will last until 1979.", "Reza_Shah", "The Pahlavi era brought rapid westernization to Iran and ended with the 1979 Islamic Revolution."),
    ],
    seeAlso: [
      { year: 1918, note: "Spanish flu pandemic" },
      { year: 1929, note: "Wall Street Crash" },
    ],
  },
  2025: {
    displayYear: "2025 CE",
    key: [
      ev("Trump Returns to the White House", "Inaugurated January 20 as the 47th U.S. president — the second to serve non-consecutive terms. Sweeping tariffs, mass deportations, and overhauls of federal agencies reshape global politics.", "Second_presidency_of_Donald_Trump"),
      ev("Global AI Spending Explodes", "AI-related investment reaches ~$1.5 trillion for the year. Nvidia briefly crosses a $5 trillion valuation. DeepSeek, a Chinese model, rivals ChatGPT.", "Artificial_intelligence"),
      ev("Pope Francis Dies; Leo XIV Elected", "Pope Francis dies at 88 on April 21. Chicago-born Robert Prevost is elected May 8 as Pope Leo XIV — first American pope.", "Pope_Leo_XIV"),
      ev("Gaza Ceasefire Reached", "After two years of war and ~70,000 deaths, U.S.-mediated ceasefire takes effect. Hostages return, humanitarian aid flows in — but the truce remains fragile.", "Gaza_war"),
      ev("LA Wildfires Devastate California", "January fires in Pacific Palisades and Eaton Canyon kill 30, burn ~50,000 acres, and cause $100B+ in damages.", "January_2025_Southern_California_wildfires"),
    ],
    more: [
      ev("Israel–Iran 12-Day War", "In June, Israel strikes Iran's nuclear program; U.S. joins with strikes on key sites. Ceasefire brokered June 24.", "June_2025_Iran%E2%80%93Israel_war"),
      ev("Myanmar Earthquake Kills Thousands", "Magnitude 7.7 quake near Mandalay on March 28 kills over 3,600 and injures thousands.", "2025_Myanmar_earthquake"),
      ev("Hurricane Melissa Batters the Caribbean", "One of the strongest Atlantic hurricanes on record hits Jamaica as Category 5; devastation across Haiti and Cuba follows.", "Hurricane_Melissa"),
      ev("Louvre Crown Jewels Heist", "On October 19, thieves use a furniture ladder to raid the Louvre, fleeing with €88 million in Crown Jewels.", "2025_Louvre_robbery"),
      ev("Signs of Life on K2-18b?", "April observations of the exoplanet detect dimethyl sulfide — a molecule produced on Earth only by living organisms.", "K2-18b", "The detection is debated; independent teams have not yet confirmed the finding."),
    ],
    seeAlso: [
      { year: 2020, note: "COVID-19 pandemic" },
      { year: 2001, note: "September 11 attacks" },
      { year: 2008, note: "Global financial crisis" },
    ],
  },
};

// Deep time remains the same
const DEEP_TIME = [
  { yearsAgo: 3000, label: "c. 1000 BCE", era: "Iron Age",
    key: [
      ev("Iron Working Spreads", "Technology of smelting iron spreads across Eurasia and Africa, enabling stronger tools and weapons than the preceding Bronze Age.", "Iron_Age"),
      ev("Phoenician Alphabet", "A 22-letter script developed in the Levant becomes the ancestor of Greek, Latin, Arabic, and Hebrew writing.", "Phoenician_alphabet"),
      ev("Composition of the Rigveda", "Sanskrit hymns transmitted orally for centuries are among the oldest surviving religious texts.", "Rigveda"),
      ev("Bronze Age Collapse Aftermath", "The Late Bronze Age civilizations of the eastern Mediterranean collapsed ~1177 BCE; survivors are rebuilding.", "Late_Bronze_Age_collapse"),
      ev("Olmec Civilization Rises", "First major Mesoamerican culture flourishes in what is now Mexico — stone heads, calendar, rubber ball games.", "Olmecs"),
    ],
  },
  { yearsAgo: 5000, label: "c. 3000 BCE", era: "Dawn of Writing",
    key: [
      ev("Cuneiform Writing Emerges", "Sumerians in Mesopotamia develop wedge-shaped writing on clay tablets — the first known writing system.", "Cuneiform"),
      ev("Egyptian Hieroglyphs", "Parallel writing system emerges in Egypt; the Old Kingdom and pyramid-building will soon follow.", "Egyptian_hieroglyphs"),
      ev("The Bronze Age Begins", "Copper and tin alloy reshapes tools, weapons, and trade routes across Eurasia.", "Bronze_Age"),
      ev("Wheeled Vehicles Spread", "Evidence of wheeled carts from Mesopotamia to the Pontic steppe transforms transport and warfare.", "History_of_the_wheel"),
      ev("Indus Valley Civilization Rising", "Planned cities at Harappa and Mohenjo-Daro feature drainage, standardized bricks, and writing we still can't read.", "Indus_Valley_Civilisation"),
    ],
  },
  { yearsAgo: 10000, label: "c. 8000 BCE", era: "Agricultural Revolution",
    key: [
      ev("Agriculture Begins", "In the Fertile Crescent, humans start domesticating wheat, barley, sheep, and goats — the Neolithic Revolution.", "Neolithic_Revolution"),
      ev("End of the Last Ice Age", "The Pleistocene ends; glaciers retreat; sea levels rise dramatically; climate stabilizes into the Holocene.", "Last_Glacial_Period"),
      ev("Göbekli Tepe Built", "Massive stone temple complex in Turkey predates agriculture — upending theories about why humans first built monuments.", "G%C3%B6bekli_Tepe"),
      ev("Jericho Settled", "One of the oldest continuously inhabited cities begins as a permanent settlement around a spring.", "Jericho"),
      ev("Megafauna Extinctions", "Mammoths, saber-toothed cats, giant sloths, and many other large mammals go extinct — likely a mix of climate and human hunting.", "Quaternary_extinction_event"),
    ],
  },
  { yearsAgo: 50000, label: "c. 48,000 BCE", era: "Upper Paleolithic",
    key: [
      ev("Cognitive Revolution", "Modern humans develop symbolic thought, complex language, art, and long-range trade networks.", "Behavioral_modernity"),
      ev("Cave Art Flourishes", "Paintings in caves like Chauvet (France) and Sulawesi (Indonesia) show stunning artistic sophistication.", "Cave_painting"),
      ev("Homo Sapiens Reaches Australia", "Humans cross open ocean to colonize Australia — one of the earliest known sea voyages.", "Prehistory_of_Australia"),
      ev("Neanderthals Begin to Disappear", "Our closest cousins fade from the fossil record around 40,000 years ago, leaving only traces in our DNA.", "Neanderthal_extinction"),
      ev("First Musical Instruments", "Bone flutes found in Germany are among the oldest known instruments — music is at least this old.", "Prehistoric_music"),
    ],
  },
  { yearsAgo: 300000, label: "c. 300,000 BCE", era: "Emergence of Homo Sapiens",
    key: [
      ev("Anatomically Modern Humans", "Earliest known Homo sapiens fossils from Jebel Irhoud, Morocco. Our species is born.", "Homo_sapiens"),
      ev("Control of Fire Mastered", "Regular, controlled use of fire for cooking, warmth, and protection is well established among hominins.", "Control_of_fire_by_early_humans"),
      ev("Multiple Human Species Coexist", "Homo erectus, Neanderthals, Denisovans, and others share the planet — we are not alone.", "Hominini"),
      ev("Stone Tool Sophistication", "Middle Stone Age toolmakers produce hafted spears and refined hand axes.", "Stone_tool"),
      ev("Ice Ages Come and Go", "Cycles of glacial and interglacial periods drive migration and adaptation across continents.", "Quaternary_glaciation"),
    ],
  },
  { yearsAgo: 2_000_000, label: "c. 2 million BCE", era: "Early Stone Age",
    key: [
      ev("Homo Habilis, 'Handy Man'", "Early human ancestors in Africa use simple stone tools — the Oldowan industry.", "Homo_habilis"),
      ev("First Stone Tools", "Deliberately chipped stones used for cutting and scraping mark the start of the archaeological record.", "Oldowan"),
      ev("Savanna Adaptation", "Bipedalism frees hands for tool use; brains grow larger, requiring more calories.", "Bipedalism"),
      ev("Pleistocene Begins", "Epoch of repeated ice ages begins — will shape human evolution and migration for the next ~2.5 million years.", "Pleistocene"),
      ev("Homo Erectus Emerges", "Longer-legged, larger-brained ancestor will spread out of Africa and persist for over a million years.", "Homo_erectus"),
    ],
  },
  { yearsAgo: 65_000_000, label: "65 million BCE", era: "End of the Dinosaurs",
    key: [
      ev("Chicxulub Impact", "An asteroid ~10km wide strikes what is now Mexico. Global fires, tsunami, 'impact winter' — the K-Pg extinction.", "Chicxulub_impactor"),
      ev("Non-Avian Dinosaurs Extinct", "After 165 million years of dominance, the great reptilian lineages vanish — except the birds.", "Cretaceous%E2%80%93Paleogene_extinction_event"),
      ev("Mammals Begin to Diversify", "Small, furry survivors radiate into countless niches — ancestors of every mammal alive today, including us.", "Mammal"),
      ev("Flowering Plants Dominate", "Angiosperms, which emerged ~130 million years ago, continue their takeover of the plant world.", "Flowering_plant"),
      ev("Birds Survive the Apocalypse", "The one dinosaur lineage to make it through — small, beaked, feathered survivors repopulate the skies.", "Origin_of_birds"),
    ],
  },
  { yearsAgo: 540_000_000, label: "540 million BCE", era: "Cambrian Explosion",
    key: [
      ev("Cambrian Explosion", "In a geological instant, most major animal body plans appear in the fossil record — arthropods, molluscs, chordates, more.", "Cambrian_explosion"),
      ev("First Chordates Appear", "Early ancestors of all vertebrates — including us — wiggle through Cambrian seas.", "Chordate"),
      ev("Oxygen Reaches Modern Levels", "Photosynthesis by cyanobacteria over billions of years has oxygenated the atmosphere enough for complex life.", "Great_Oxidation_Event"),
      ev("Eyes Evolve", "Complex image-forming eyes emerge in multiple lineages — triggers an arms race of predator and prey.", "Evolution_of_the_eye"),
      ev("Life Remains Aquatic", "Land is still barren — no plants, no animals above water. It will be another ~100 million years.", "Colonisation_of_land"),
    ],
  },
  { yearsAgo: 2_400_000_000, label: "2.4 billion BCE", era: "Great Oxidation Event",
    key: [
      ev("The Great Oxidation", "Cyanobacteria pump oxygen into the atmosphere for the first time, poisoning most existing life — 'the Oxygen Catastrophe.'", "Great_Oxidation_Event"),
      ev("Iron Oceans Rust", "Dissolved iron reacts with new oxygen, precipitating banded iron formations — the red rocks we mine today.", "Banded_iron_formation"),
      ev("Huronian Glaciation", "One of the longest and most severe ice ages in Earth's history — possibly a 'Snowball Earth'.", "Huronian_glaciation"),
      ev("Eukaryotes Emerge", "Cells with nuclei appear, likely by engulfing bacteria that become mitochondria — a merger that makes complex life possible.", "Eukaryote"),
      ev("Life is Still Microbial", "No multicellular life yet. The planet is alive but invisible to eyes that don't exist yet.", "Archean"),
    ],
  },
  { yearsAgo: 3_800_000_000, label: "3.8 billion BCE", era: "Origin of Life",
    key: [
      ev("Earliest Life Emerges", "Chemical self-replicators in warm vents or tidal pools become the first cells. All known life shares a common ancestor (LUCA).", "Abiogenesis"),
      ev("Late Heavy Bombardment Ending", "A period of intense asteroid impacts is tapering off; Earth's surface finally stable enough for life to persist.", "Late_Heavy_Bombardment"),
      ev("Oceans Form", "Water vapor from volcanoes and cometary ice condenses into the first oceans.", "Origin_of_water_on_Earth"),
      ev("Atmosphere Thickens", "Volcanic outgassing creates an atmosphere of nitrogen, CO₂, and water vapor — very little oxygen.", "Atmosphere_of_Earth"),
      ev("Moon Stabilizes Earth's Axis", "Our oversized moon, formed from a Mars-sized impact ~4.5 billion years ago, keeps Earth's tilt stable — a gift for life.", "Moon"),
    ],
  },
  { yearsAgo: 4_540_000_000, label: "4.54 billion BCE", era: "Formation of Earth",
    key: [
      ev("Earth Accretes from Solar Nebula", "Dust and gas around the young Sun clump into planetesimals, then into the proto-Earth.", "History_of_Earth"),
      ev("Theia Impact Forms Moon", "A Mars-sized planet collides with proto-Earth. Debris coalesces into the Moon.", "Giant-impact_hypothesis"),
      ev("The Sun Ignites", "~4.6 billion years ago, gravitational collapse triggers hydrogen fusion — our star begins to shine.", "Sun"),
      ev("Other Planets Form", "Mercury, Venus, Mars, and the gas giants accrete from the same solar nebula.", "Formation_and_evolution_of_the_Solar_System"),
      ev("Hadean Eon", "Earth's surface is molten rock, scorching heat, and constant bombardment — hellish conditions that give the eon its name.", "Hadean"),
    ],
  },
  { yearsAgo: 13_800_000_000, label: "13.8 billion BCE", era: "The Big Bang",
    key: [
      ev("The Big Bang", "The universe expands from an unimaginably hot, dense state. Space, time, and the laws of physics as we know them begin.", "Big_Bang"),
      ev("Cosmic Inflation", "In a fraction of a second, the universe expands faster than light — stretching quantum fluctuations into the seeds of galaxies.", "Inflation_(cosmology)"),
      ev("First Atoms Form", "380,000 years after the Bang, the universe cools enough for electrons to bind with nuclei. Light travels freely for the first time.", "Recombination_(cosmology)"),
      ev("First Stars Ignite", "~100 million years later, hydrogen and helium clouds collapse into the first stars — enormous, short-lived, and fuse the first heavy elements.", "Stellar_population#Population_III_stars"),
      ev("Galaxies Assemble", "Gravity pulls stars and gas into the first galaxies. The Milky Way's ancestors are among them.", "Galaxy_formation_and_evolution"),
    ],
  },
];

// ===================================================================
// Significant-events quick picks
// Years chosen for high Wikipedia prominence + global reach
// ===================================================================
const SIGNIFICANT_YEARS = [
  { year: 2025, label: "2025", caption: "Trump II, AI boom, Gaza ceasefire" },
  { year: 1969, label: "1969", caption: "Moon landing" },
  { year: 1945, label: "1945", caption: "End of WWII, atomic age" },
  { year: 1918, label: "1918", caption: "WWI ends, flu pandemic" },
  { year: 1776, label: "1776", caption: "U.S. Declaration of Independence" },
  { year: 1492, label: "1492", caption: "Columbus reaches the Americas" },
  { year: 1066, label: "1066", caption: "Norman Conquest of England" },
  { year: 622, label: "622", caption: "Muhammad's Hijra — Islamic Year 1" },
  { year: -44, label: "44 BCE", caption: "Assassination of Julius Caesar" },
  { year: -500, label: "500 BCE", caption: "Axial Age, Roman Republic" },
];

// ===================================================================
// Helpers
// ===================================================================

// Compute the most recent completed year — auto-updates
function currentDefaultYear() {
  return new Date().getFullYear() - 1;
}

// The actual current year — used for "in progress" mode
function currentYear() {
  return new Date().getFullYear();
}

// Format today's date for the "last updated" display
function formatToday() {
  const d = new Date();
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

// Convert an integer year to a Wikipedia page slug.
// Positive years → "1969". Negative → "44 BC" (Wikipedia's BCE pages use BC).
function yearToWikiSlug(year) {
  if (year > 0) return String(year);
  return `${Math.abs(year)}_BC`;
}

// Format a year for display: 1969 → "1969"; -44 → "44 BCE"
function formatYear(year) {
  if (year > 0) return String(year);
  return `${Math.abs(year)} BCE`;
}

// Clean up Wikipedia-extracted event strings
function cleanWikiEventText(raw) {
  let text = raw.trim().replace(/\s+/g, " ");
  // Remove trailing citation markers like "[1]" "[citation needed]"
  text = text.replace(/\[[^\]]*\]/g, "").trim();
  // Remove leading bullet artifacts
  text = text.replace(/^[•·‣▪]\s*/, "");
  return text;
}

// Given a raw event string, try to split out date prefix and create a clean title + detail
function parseWikiEvent(raw, fallbackSlug) {
  const text = cleanWikiEventText(raw);
  // Common pattern: "Month Day – Description." or "Month Day — Description."
  const dateMatch = text.match(/^((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:\s*[-–—]\s*(?:January|February|March|April|May|June|July|August|September|October|November|December)?\s*\d{1,2})?)\s*[-–—:]\s*(.+)$/i);
  let datePrefix = null;
  let body = text;
  if (dateMatch) {
    datePrefix = dateMatch[1].trim();
    body = dateMatch[2].trim();
  }
  // Get first sentence as title; rest as detail.
  const firstSentenceMatch = body.match(/^(.+?[.!?])(\s|$)(.*)/s);
  let title, detail;
  if (firstSentenceMatch) {
    title = firstSentenceMatch[1].trim();
    detail = (firstSentenceMatch[3] || "").trim() || body;
  } else {
    // Short entry — use whole thing as title, detail same
    title = body;
    detail = body;
  }
  // Shorten title if too long
  if (title.length > 95) {
    // Find a good break point
    const breakPoint = title.slice(0, 95).lastIndexOf(",");
    title = breakPoint > 50 ? title.slice(0, breakPoint) + "…" : title.slice(0, 95) + "…";
  }
  // Strip redundant parentheticals from title like "(1492)"
  title = title.replace(/\s*\(\d{3,4}\)$/, "");
  // If we had a date prefix, prepend it as a compact label
  const finalTitle = datePrefix ? `${datePrefix}: ${title}` : title;
  return { title: finalTitle, detail: body, wiki: fallbackSlug };
}

// Fetch the "Events" section from a Wikipedia year page.
// Returns { events: [...] } on success, or { error: "message" } on failure.
// Handles both flat and nested (January/February subsections) structures.
async function fetchWikipediaEvents(year) {
  const pageName = yearToWikiSlug(year);
  let html;
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(pageName)}&prop=text&format=json&origin=*&redirects=1`;
    const res = await fetch(url);
    if (!res.ok) return { error: `HTTP ${res.status} from Wikipedia` };
    const data = await res.json();
    if (data?.error) return { error: data.error.info || "Wikipedia API error" };
    html = data?.parse?.text?.["*"];
    if (!html) return { error: "No page content returned" };
  } catch (err) {
    return { error: `Network error: ${err.message || "fetch blocked"}` };
  }

  try {
    const doc = new DOMParser().parseFromString(html, "text/html");

    // Find the "Events" heading
    const allHeadings = Array.from(doc.querySelectorAll("h2, h3"));
    const eventsHeading = allHeadings.find((h) => {
      const text = (h.textContent || "").trim().toLowerCase().replace(/\[edit\]/g, "").trim();
      return text === "events" || text.startsWith("events");
    });
    if (!eventsHeading) return { error: "Events section not found on page" };

    // Find the index of the Events heading in the full heading list
    const eventsIdx = allHeadings.indexOf(eventsHeading);
    // Find the next top-level (h2) heading that marks the end of Events
    const stopHeadings = ["births", "deaths", "references", "see also", "external links", "notes", "publications", "new works", "by topic", "by place", "by category"];
    let stopHeading = null;
    for (let i = eventsIdx + 1; i < allHeadings.length; i++) {
      const h = allHeadings[i];
      // Only stop at h2 (same level as Events) to catch all subsections between
      if (h.tagName !== "H2") continue;
      const t = (h.textContent || "").trim().toLowerCase().replace(/\[edit\]/g, "").trim();
      if (stopHeadings.some((s) => t === s || t.startsWith(s))) { stopHeading = h; break; }
      // Any h2 after Events is probably a stop heading
      stopHeading = h;
      break;
    }

    // Walk the DOM between eventsHeading and stopHeading, collecting <li> elements.
    // Use a TreeWalker to iterate over all elements in document order.
    const startContainer = eventsHeading.closest(".mw-heading") || eventsHeading;
    const stopContainer = stopHeading ? (stopHeading.closest(".mw-heading") || stopHeading) : null;

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
      if (node.tagName === "LI") collected.push(node);
    }

    const events = collected
      .map((li) => {
        li.querySelectorAll(".mw-editsection, sup.reference, sup.noprint, .mw-ext-cite-error, style").forEach((el) => el.remove());
        const text = li.textContent.trim();
        if (!text || text.length < 25) return null;
        const linkEl = li.querySelector("a[href^='/wiki/']");
        const href = linkEl?.getAttribute("href") || "";
        const wikiSlug = href.startsWith("/wiki/") ? decodeURIComponent(href.replace("/wiki/", "").split("#")[0]) : pageName;
        return parseWikiEvent(text, wikiSlug);
      })
      .filter(Boolean);

    const seen = new Set();
    const unique = events.filter((e) => {
      if (seen.has(e.title)) return false;
      seen.add(e.title);
      return true;
    });

    if (unique.length === 0) return { error: "No list items found in Events section" };
    return { events: unique.slice(0, 5) };
  } catch (err) {
    return { error: `Parse error: ${err.message}` };
  }
}

// Build cascade: anchor year + exact century steps back through BCE too
function buildStack(anchor) {
  const items = [{ year: anchor, isAnchor: true, offset: 0 }];
  let stepsBack = 1;
  while (stepsBack <= 30) {
    const target = anchor - 100 * stepsBack;
    // Stop once we go past ~3000 BCE (the very edge of recorded history)
    if (target < -3000) break;
    items.push({ year: target, isAnchor: false, offset: -100 * stepsBack });
    stepsBack++;
  }
  return items;
}

function formatYearsAgo(yearsAgo) {
  if (yearsAgo >= 1e9) return `${(yearsAgo / 1e9).toFixed(1)} billion years ago`;
  if (yearsAgo >= 1e6) return `${(yearsAgo / 1e6).toFixed(0)} million years ago`;
  if (yearsAgo >= 1e3) return `${(yearsAgo / 1e3).toFixed(0)},000 years ago`;
  return `${yearsAgo} years ago`;
}

// Parse user input: "1969", "44 BCE", "44BC", "-44" all work
function parseYearInput(raw) {
  if (!raw) return null;
  const trimmed = String(raw).trim().toUpperCase();
  const bceMatch = trimmed.match(/^(\d+)\s*(BCE|BC)$/);
  if (bceMatch) return -parseInt(bceMatch[1], 10);
  const ceMatch = trimmed.match(/^(\d+)\s*(CE|AD)?$/);
  if (ceMatch) return parseInt(ceMatch[1], 10);
  const n = parseInt(trimmed, 10);
  return isNaN(n) ? null : n;
}

// ===================================================================
// Main component
// ===================================================================
export default function CenturyCompare() {
  const defaultYear = currentDefaultYear();
  const initialAnchor = EVENTS[String(defaultYear)] ? defaultYear : 2025;

  const [input, setInput] = useState(String(initialAnchor));
  const [anchor, setAnchor] = useState(initialAnchor);
  const [expanded, setExpanded] = useState(null);
  const [showMore, setShowMore] = useState({});
  const [showDeepTime, setShowDeepTime] = useState(false);

  const stack = useMemo(() => buildStack(anchor), [anchor]);

  const submit = (e) => {
    e?.preventDefault();
    const n = parseYearInput(input);
    if (n !== null && n >= -3000 && n <= 2100 && n !== 0) {
      setAnchor(n);
      setExpanded(null);
      setShowMore({});
      setShowDeepTime(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const jumpTo = (y) => {
    setInput(formatYear(y));
    setAnchor(y);
    setExpanded(null);
    setShowMore({});
    setShowDeepTime(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleMore = (id) => setShowMore((s) => ({ ...s, [id]: !s[id] }));

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
          Enter a year (e.g. 1969, 44 BCE). See it one century at a time, going back.
        </p>
      </header>

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

        <div className="mt-4">
          <div className="text-[10px] uppercase tracking-widest mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9a8b6f" }}>
            Significant years
          </div>
          <div className="flex flex-col gap-1.5">
            {/* Current year — live, in progress */}
            {(() => {
              const cy = currentYear();
              const active = anchor === cy;
              return (
                <button
                  key={`current-${cy}`}
                  onClick={() => jumpTo(cy)}
                  className="text-left flex items-baseline gap-3 py-1.5 px-2.5 transition-all hover:brightness-125"
                  style={{
                    background: active ? "#e8923d20" : "#e8923d10",
                    border: `1px solid ${active ? "#e8923d" : "#e8923d60"}`,
                    borderRadius: "2px",
                  }}
                >
                  <span className="text-sm font-bold shrink-0 w-20" style={{ color: "#e8923d", fontFamily: "'Fraunces', serif" }}>
                    {cy}
                  </span>
                  <span className="text-xs flex items-center gap-1.5 flex-wrap" style={{ color: "#9a8b6f", fontFamily: "'JetBrains Mono', monospace" }}>
                    <span style={{
                      color: "#e8923d",
                      border: "1px solid #e8923d",
                      padding: "1px 5px",
                      borderRadius: "2px",
                      fontSize: "9px",
                      letterSpacing: "0.15em",
                    }}>
                      ● LIVE
                    </span>
                    <span>events so far · updates as they happen</span>
                  </span>
                </button>
              );
            })()}
            {SIGNIFICANT_YEARS.filter((y) => y.year !== currentYear()).map(({ year, label, caption }) => {
              const active = anchor === year;
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
                  <span className="text-sm font-bold shrink-0 w-20" style={{ color: active ? "#d4a856" : "#f5ead0", fontFamily: "'Fraunces', serif" }}>
                    {label}
                  </span>
                  <span className="text-xs" style={{ color: "#9a8b6f", fontFamily: "'JetBrains Mono', monospace" }}>
                    {caption}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-5 md:px-12 py-3 flex items-center justify-center gap-2 text-xs" style={{ color: "#9a8b6f", fontFamily: "'JetBrains Mono', monospace", background: "#1a1612" }}>
        <span>one century each step</span>
        <ArrowDown size={12} />
      </div>

      <main className="px-5 md:px-12 py-8">
        <div className="space-y-14 max-w-3xl mx-auto">
          {stack.map((item) => {
            const depthIdx = Math.abs(item.offset / 100);
            const color = item.isAnchor
              ? "#e8923d"
              : ["#9dc68c", "#c89a5c", "#b8739a", "#7aa890", "#a48fc2", "#d4a856", "#a08a6c", "#8fb3a0", "#c28a7a", "#7a9bb8"][depthIdx - 1] || "#9a8b6f";

            return (
              <YearBlock
                key={item.year}
                year={item.year}
                accent={color}
                isAnchor={item.isAnchor}
                offset={item.offset}
                expanded={expanded}
                setExpanded={setExpanded}
                showMore={!!showMore[String(item.year)]}
                toggleMore={() => toggleMore(String(item.year))}
                onJumpTo={jumpTo}
              />
            );
          })}

          <EdgeOfHistoryGateway open={showDeepTime} onToggle={() => setShowDeepTime((s) => !s)} />

          {showDeepTime && (
            <div className="space-y-14 pt-2">
              {DEEP_TIME.map((era, idx) => {
                const colors = ["#b8a878", "#a89060", "#8a7a5c", "#6c7a5a", "#5c6b6f", "#4a5a6c", "#3a4a6c", "#4a3a6c", "#5c3a5a", "#6c2a4a", "#7a2a3a", "#8a1a1a"];
                const color = colors[idx] || "#5a4a3a";
                return (
                  <DeepTimeBlock key={era.yearsAgo} era={era} accent={color} expanded={expanded} setExpanded={setExpanded} />
                );
              })}
              <FinalMessage />
            </div>
          )}
        </div>
      </main>

      <footer className="px-5 md:px-12 py-6 text-xs" style={{ borderTop: "1px solid #3d3528", color: "#5c4a30", fontFamily: "'JetBrains Mono', monospace" }}>
        Default updates automatically to the most recent completed year · Curated + live Wikipedia fallback · Globally weighted toward high-reference events
      </footer>
    </div>
  );
}

function YearBlock({ year, accent, isAnchor, offset, expanded, setExpanded, showMore, toggleMore, onJumpTo }) {
  const curated = EVENTS[String(year)];
  const [wikiEvents, setWikiEvents] = useState(null);
  const [loading, setLoading] = useState(!curated);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (curated) return;
    let cancelled = false;
    setLoading(true);
    setFetchError(null);
    fetchWikipediaEvents(year).then((result) => {
      if (cancelled) return;
      if (result?.events) {
        setWikiEvents(result.events);
        setFetchError(null);
      } else {
        setFetchError(result?.error || "Unknown error");
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [year, curated]);

  const data = curated || (wikiEvents ? { key: wikiEvents, more: [], seeAlso: [], fromWiki: true } : null);
  const allEvents = data ? (showMore && data.more?.length ? [...data.key, ...data.more] : data.key) : [];
  const hasMore = data && data.more && data.more.length > 0;
  // Filter seeAlso to same century only (defensive — also prevents future data mistakes)
  const sameCentury = (a, b) => Math.floor((a - (a < 0 ? 99 : 0)) / 100) === Math.floor((b - (b < 0 ? 99 : 0)) / 100);
  const seeAlso = (data?.seeAlso || []).filter((s) => sameCentury(s.year, year));
  const eraBadge = year < 0 ? "BCE" : "CE";
  const yearNumber = Math.abs(year);
  const wikiSlug = yearToWikiSlug(year);
  const isCurrent = year === currentYear();

  return (
    <section style={{
      background: isAnchor ? "#2a2218" : "transparent",
      padding: isAnchor ? "20px" : "0",
      border: isAnchor ? `1px solid ${accent}40` : "none",
      borderRadius: isAnchor ? "4px" : "0",
    }}>
      <div className="flex items-baseline gap-3 mb-4 pb-3" style={{ borderBottom: `2px solid ${accent}` }}>
        <div className="flex flex-col items-start">
          <span
            className="text-[10px] uppercase tracking-[0.2em] px-1.5 py-0.5 mb-1"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: accent,
              border: `1px solid ${accent}60`,
              borderRadius: "2px",
              letterSpacing: "0.2em",
            }}
          >
            {eraBadge}
          </span>
          <h2 className="text-5xl md:text-7xl font-bold leading-none tracking-tighter" style={{ color: accent }}>
            {yearNumber}
          </h2>
        </div>
        <div className="flex-1 text-right">
          <div className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: isCurrent ? accent : "#9a8b6f" }}>
            {isCurrent ? "In progress" : isAnchor ? "Your year" : offset > 0 ? `+${offset} years` : `${offset} years`}
          </div>
          <div className="text-xs mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#d4a856" }}>
            {loading ? "loading…" : data ? (showMore ? `${allEvents.length} events` : `${allEvents.length} key events`) : "no data"}
          </div>
        </div>
      </div>

      {isCurrent && (
        <div
          className="mb-4 p-3 flex items-start gap-2"
          style={{
            background: `linear-gradient(90deg, ${accent}15 0%, transparent 100%)`,
            border: `1px solid ${accent}40`,
            borderLeftWidth: "3px",
            borderRadius: "2px",
          }}
        >
          <span
            className="text-[9px] uppercase tracking-[0.2em] px-1.5 py-0.5 shrink-0 mt-0.5"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              background: accent,
              color: "#1a1612",
              borderRadius: "2px",
              fontWeight: 700,
            }}
          >
            ● LIVE
          </span>
          <div className="text-xs leading-relaxed" style={{ color: "#d4c7a8", fontFamily: "'JetBrains Mono', monospace" }}>
            <div>{yearNumber} is still in progress — events below are what Wikipedia has recorded so far.</div>
            <div className="mt-1" style={{ color: "#9a8b6f" }}>Page loaded {formatToday()}</div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 py-4 text-sm" style={{ color: "#9a8b6f" }}>
          <Loader2 size={14} className="animate-spin" /> Fetching from Wikipedia…
        </div>
      )}

      {!loading && !data && fetchError && (
        <div className="py-4 text-sm italic space-y-2" style={{ color: "#9a8b6f" }}>
          <div>
            Couldn't load events for {yearNumber} {eraBadge}.
          </div>
          <div className="text-xs not-italic" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#6c5a3a" }}>
            ⚠ {fetchError}
          </div>
          <div>
            Try{" "}
            <a href={`https://en.wikipedia.org/wiki/${wikiSlug}`} target="_blank" rel="noopener noreferrer"
               className="underline hover:no-underline" style={{ color: accent }}>
              the Wikipedia page
            </a>{" "}directly.
          </div>
        </div>
      )}

      {data && (
        <>
          {data.fromWiki && (
            <div className="mb-3 text-[10px] uppercase tracking-widest flex items-center gap-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>
              <Info size={10} /> Live from Wikipedia — not hand-curated
            </div>
          )}
          <ol className="space-y-0">
            {allEvents.map((event, i) => {
              const key = `${year}-${i}`;
              const isOpen = expanded === key;
              const isBonus = i >= 5;
              return (
                <li key={i} style={{ borderBottom: "1px solid #3d3528" }}>
                  <button onClick={() => setExpanded(isOpen ? null : key)} className="text-left w-full py-4 group">
                    <div className="flex items-start gap-3">
                      <span className="text-xs mt-1.5 shrink-0 w-6" style={{ fontFamily: "'JetBrains Mono', monospace", color: isBonus ? accent : "#9a8b6f" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-semibold leading-snug" style={{ color: "#f5ead0" }}>
                          {event.title}
                        </h3>
                        {isOpen && (
                          <div className="mt-2.5 leading-relaxed text-[15px]" style={{ color: "#d4c7a8" }}>
                            {event.detail}
                            {event.footnote && (
                              <div className="mt-2 pl-3 text-[13px] italic border-l-2" style={{ color: "#9a8b6f", borderColor: `${accent}60` }}>
                                ⓘ {event.footnote}
                              </div>
                            )}
                            <div className="mt-3">
                              <a href={`https://en.wikipedia.org/wiki/${event.wiki}`} target="_blank" rel="noopener noreferrer"
                                 className="inline-flex items-center gap-1 text-xs uppercase tracking-widest hover:underline"
                                 style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>
                                Read more <ExternalLink size={12} />
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>

          {seeAlso.length > 0 && (
            <div className="mt-5 pt-4" style={{ borderTop: `1px dashed ${accent}60` }}>
              <div className="text-[10px] uppercase tracking-widest mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>
                Also within this century
              </div>
              <ul className="space-y-1.5">
                {seeAlso.map((s, i) => (
                  <li key={i}>
                    <button onClick={() => onJumpTo(s.year)}
                      className="text-left flex items-start gap-2 hover:underline decoration-dotted"
                      style={{ color: "#d4c7a8" }}>
                      <CornerDownRight size={14} className="mt-1 shrink-0" style={{ color: accent }} />
                      <span className="text-sm leading-snug">
                        <span className="font-semibold" style={{ color: accent }}>{formatYear(s.year)}</span>
                        <span className="mx-1.5">·</span>
                        {s.note}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5 flex flex-col sm:flex-row gap-2">
            {hasMore && (
              <button onClick={toggleMore}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-widest font-semibold transition-all hover:brightness-125"
                style={{
                  background: showMore ? "transparent" : `${accent}20`,
                  color: accent,
                  border: `1px solid ${accent}`,
                  fontFamily: "'JetBrains Mono', monospace",
                  borderRadius: "2px",
                }}>
                {showMore ? <><Minus size={14} /> Show fewer</> : <><Plus size={14} /> Show {data.more.length} more</>}
              </button>
            )}
            <a href={`https://en.wikipedia.org/wiki/${wikiSlug}`} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-widest font-semibold transition-all hover:brightness-125"
              style={{
                background: "transparent",
                color: "#d4a856",
                border: "1px solid #5c4a30",
                fontFamily: "'JetBrains Mono', monospace",
                borderRadius: "2px",
                textDecoration: "none",
              }}>
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
        <p className="text-sm italic" style={{ color: "#9a8b6f" }}>
          Here written records grow thin.
        </p>
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
          const key = `deep-${era.yearsAgo}-${i}`;
          const isOpen = expanded === key;
          return (
            <li key={i} style={{ borderBottom: "1px solid #3d3528" }}>
              <button onClick={() => setExpanded(isOpen ? null : key)} className="text-left w-full py-4 group">
                <div className="flex items-start gap-3">
                  <span className="text-xs mt-1.5 shrink-0 w-6" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9a8b6f" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold" style={{ color: "#f5ead0" }}>{event.title}</h3>
                    {isOpen && (
                      <div className="mt-2.5 leading-relaxed text-[15px]" style={{ color: "#d4c7a8" }}>
                        {event.detail}
                        <div className="mt-3">
                          <a href={`https://en.wikipedia.org/wiki/${event.wiki}`} target="_blank" rel="noopener noreferrer"
                             className="inline-flex items-center gap-1 text-xs uppercase tracking-widest hover:underline"
                             style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>
                            Read more <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </button>
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
      <p className="text-xl md:text-2xl font-semibold mb-4 italic" style={{ color: "#a48fc2" }}>
        And before the Big Bang?
      </p>
      <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: "#9a8ba8" }}>
        We don't know. Time itself may not have existed. Physics breaks down at the singularity,
        and every theory of what came before — cyclic universes, quantum foam, a multiverse —
        remains speculation.
      </p>
      <p className="text-sm leading-relaxed max-w-lg mx-auto mt-3 italic" style={{ color: "#7a6b9a" }}>
        The record is silent. Here our timeline ends.
      </p>
      <p className="text-xs mt-6 uppercase tracking-widest" style={{ color: "#4a3a6c", fontFamily: "'JetBrains Mono', monospace" }}>
        ✦ t = 0 ✦
      </p>
    </div>
  );
}
