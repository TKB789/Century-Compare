import { useState, useMemo, useEffect } from "react";
import { ExternalLink, Search, ArrowUp, ArrowDown, BookOpen, Infinity as InfinityIcon, CornerDownRight, Loader2, Info, Minus, Sparkles, TrendingUp } from "lucide-react";

// ===================================================================
// CATEGORIES — simplified to two
// Health/Medicine and Exploration/Space are folded into Science & Tech
// ===================================================================
const CATEGORIES = [
  { key: "all", label: "All", color: "#d4a856" },
  { key: "POL", label: "Politics & War", color: "#c9532b" },
  { key: "SCI", label: "Science & Technology", color: "#7ba8d4" },
];

const ev = (title, detail, wiki, footnote) => ({ title, detail, wiki, footnote });

// ===================================================================
// CURATED YEARS
// ===================================================================
const EVENTS = {
  "-500": {
    events: [
      ev("Buddha and Confucius Active", "Siddhartha Gautama teaches in northern India; Confucius develops ethical philosophy in China. The 'Axial Age' reshapes human thought across civilizations.", "Axial_Age"),
      ev("Roman Republic Founded (509 BCE)", "Romans overthrow their last king, Tarquinius Superbus, and establish a republic that will last nearly 500 years.", "Roman_Republic"),
      ev("Persian Empire at its Peak", "Under Darius I, the Achaemenid Empire stretches from the Indus Valley to the Balkans — the largest empire the world has yet seen.", "Achaemenid_Empire"),
      ev("Greco-Persian Wars Begin", "Ionian Greek cities revolt against Persian rule in 499 BCE, triggering wars that will produce Marathon, Thermopylae, and Salamis.", "Greco-Persian_Wars"),
      ev("Zapotec Civilization Rises", "Monte Albán in Oaxaca becomes one of Mesoamerica's first true urban centers.", "Monte_Alb%C3%A1n"),
    ],
    seeAlso: [
      { year: -490, note: "Battle of Marathon" },
      { year: -480, note: "Thermopylae and Salamis" },
    ],
  },
  525: {
    events: [
      ev("Justinian Rises to Power", "Future Eastern Roman emperor takes the throne in 527; will codify Roman law and reconquer much of the Mediterranean.", "Justinian_I"),
      ev("Volcanic Winter of 536 Approaches", "A massive eruption will darken skies globally next decade, causing crop failures from China to Ireland.", "Volcanic_winter_of_536"),
      ev("Gupta Empire Collapses", "India's classical golden age of mathematics, astronomy, and art fades under Hun invasions.", "Gupta_Empire"),
      ev("Buddhism Flourishes in East Asia", "Mahayana Buddhism deepens roots in China and is about to reach Japan officially (538 CE).", "Buddhism_in_China"),
      ev("Maya Classic Period Peaks", "Tikal and Palenque thrive as centers of astronomy, writing, and monumental architecture.", "Maya_civilization"),
    ],
    seeAlso: [
      { year: 541, note: "Plague of Justinian begins" },
      { year: 622, note: "Muhammad's Hijra — Islamic Year 1" },
    ],
  },
  1225: {
    events: [
      ev("Mongol Empire Expands", "Genghis Khan's conquests reshape Eurasia; he will die in 1227 leaving the largest contiguous land empire in history.", "Mongol_Empire"),
      ev("Thomas Aquinas Born", "Future philosopher will synthesize Aristotle and Christian thought, shaping Western philosophy for centuries.", "Thomas_Aquinas"),
      ev("Magna Carta Reissued", "King Henry III confirms the 1215 charter, cementing its role in English constitutional law.", "Magna_Carta"),
      ev("Delhi Sultanate Consolidates", "Under Iltutmish, the Turkic-led sultanate becomes the dominant power in northern India.", "Delhi_Sultanate"),
      ev("Kamakura Shogunate Rules Japan", "Hōjō clan governs as regents; samurai culture and Zen Buddhism are taking shape.", "Kamakura_shogunate"),
    ],
    seeAlso: [
      { year: 1215, note: "Magna Carta signed" },
      { year: 1258, note: "Mongol sack of Baghdad" },
    ],
  },
  1525: {
    events: [
      ev("Mughal Empire Founded", "Babur defeats the Delhi Sultanate at Panipat (1526), founding an empire that will rule much of India for three centuries.", "Mughal_Empire"),
      ev("German Peasants' War Crushed", "Largest European popular uprising before the French Revolution ends with ~100,000 peasants killed.", "German_Peasants%27_War"),
      ev("Reformation Spreads", "Luther's movement has fractured Western Christianity; Tyndale prints the first English New Testament this year.", "Reformation"),
      ev("Inca Empire at Its Height", "Huayna Capac rules from Ecuador to Chile — but smallpox from Spanish contact will soon devastate the empire.", "Inca_Empire"),
      ev("Suleiman the Magnificent Ascendant", "Ottoman sultan is at the peak of his 46-year reign; will besiege Vienna in 1529.", "Suleiman_the_Magnificent"),
    ],
    seeAlso: [
      { year: 1517, note: "Luther's 95 Theses" },
      { year: 1521, note: "Fall of Tenochtitlan" },
    ],
  },
  1625: {
    events: [
      ev("Charles I Crowned in England", "His reign will end in civil war and public execution in 1649 — a revolution in royal accountability.", "Charles_I_of_England"),
      ev("Thirty Years' War Rages", "Europe's deadliest religious conflict continues; will kill up to 8 million before ending in 1648.", "Thirty_Years%27_War"),
      ev("Dutch Buy Manhattan (1626)", "Peter Minuit 'purchases' Manhattan from Lenape people for ~60 guilders — founding of New Amsterdam.", "Manhattan"),
      ev("Ming Dynasty Weakens", "Famines, peasant revolts, and Manchu pressure erode the dynasty, which will fall in 1644.", "Ming_dynasty"),
      ev("Safavid Persia Flourishes", "Under Abbas I, Isfahan becomes one of the world's great cities; Persian art and architecture reach a pinnacle.", "Abbas_I_of_Persia"),
    ],
    seeAlso: [
      { year: 1620, note: "Mayflower lands at Plymouth" },
      { year: 1649, note: "Execution of Charles I" },
    ],
  },
  1725: {
    events: [
      ev("Peter the Great Dies", "Russian tsar who westernized the empire dies; succeeded by his wife Catherine I.", "Peter_the_Great"),
      ev("Qing China at its Zenith", "Under the Yongzheng Emperor, imperial China is the world's largest economy and nearing its greatest territorial extent.", "Qing_dynasty"),
      ev("Enlightenment Takes Shape", "Voltaire is imprisoned in the Bastille (1726); Montesquieu is writing. The Age of Reason is underway.", "Age_of_Enlightenment"),
      ev("Bach in Leipzig", "J.S. Bach composes cantatas and passions that define Baroque music at the height of his powers.", "Johann_Sebastian_Bach"),
      ev("Tokugawa Japan in Seclusion", "Shogunate's sakoku policy keeps Japan largely closed; domestic urban culture flourishes in Edo.", "Sakoku"),
    ],
    seeAlso: [
      { year: 1720, note: "South Sea Bubble bursts" },
      { year: 1776, note: "American Declaration of Independence" },
    ],
  },
  1825: {
    events: [
      ev("Stockton–Darlington Railway Opens", "First public railway to use steam locomotives — the railway age begins.", "Stockton_and_Darlington_Railway"),
      ev("Latin American Independence Won", "Simón Bolívar's armies complete the liberation of most of Spanish South America.", "Spanish_American_wars_of_independence"),
      ev("Decembrist Revolt in Russia", "Liberal army officers try to block Nicholas I's accession — crushed, but seeds later Russian reform movements.", "Decembrist_revolt"),
      ev("Haiti Forced to Pay Indemnity", "France demands 150 million francs for 'lost' slave-produced wealth — a debt that will cripple Haiti for 120 years.", "Haiti_indemnity_controversy"),
      ev("Java War Begins", "Prince Diponegoro leads a five-year rebellion against Dutch colonial rule — one of the costliest colonial wars of the century.", "Java_War"),
    ],
    seeAlso: [
      { year: 1820, note: "Missouri Compromise" },
      { year: 1848, note: "Revolutions sweep Europe" },
    ],
  },
  1925: {
    events: [
      ev("The Great Gatsby Published", "F. Scott Fitzgerald's novel captures the Jazz Age — later called the Great American Novel.", "The_Great_Gatsby"),
      ev("Mein Kampf Published", "Hitler's manifesto lays out his ideology from prison. Largely ignored at the time.", "Mein_Kampf"),
      ev("Television Demonstrated", "Scottish engineer John Logie Baird demonstrates the first working television system.", "History_of_television"),
      ev("Quantum Mechanics Takes Shape", "Heisenberg formulates matrix mechanics; Schrödinger will follow with wave mechanics in 1926 — a revolution in physics.", "Matrix_mechanics"),
      ev("Scopes 'Monkey Trial'", "Tennessee teacher John Scopes prosecuted for teaching evolution — a national spectacle over science and religion.", "Scopes_trial"),
    ],
    seeAlso: [
      { year: 1918, note: "Spanish flu pandemic" },
      { year: 1929, note: "Wall Street Crash" },
    ],
  },
  2021: {
    events: [
      ev("January 6 U.S. Capitol Attack", "Rioters supporting Donald Trump storm the U.S. Capitol to disrupt Electoral College certification. Five die. Marks an unprecedented rupture in American democratic tradition.", "January_6_United_States_Capitol_attack"),
      ev("Biden Becomes President", "Joe Biden inaugurated as 46th U.S. president on January 20. Rejoins the Paris Agreement and WHO on day one; ends the war in Afghanistan by August.", "Presidency_of_Joe_Biden"),
      ev("Taliban Retakes Afghanistan", "After U.S. withdrawal in August, the Taliban captures Kabul in 11 days. 20 years of Western intervention collapse; chaotic evacuations follow.", "Fall_of_Kabul_(2021)"),
      ev("COVID-19 Vaccines Roll Out Globally", "Mass vaccination campaigns begin worldwide. By year's end, over 8.5 billion doses administered — but Delta and Omicron variants extend the pandemic.", "COVID-19_vaccine"),
      ev("Civilian Spaceflight Goes Mainstream", "SpaceX's Inspiration4 sends the first all-civilian crew to orbit. Blue Origin and Virgin Galactic also begin suborbital tourist flights.", "Inspiration4"),
    ],
    seeAlso: [
      { year: 2020, note: "COVID-19 pandemic declared" },
      { year: 2001, note: "September 11 attacks" },
    ],
  },
  2022: {
    events: [
      ev("Russia Invades Ukraine", "On February 24, Vladimir Putin launches a full-scale invasion. Largest war in Europe since WWII. Millions flee as NATO rallies behind Kyiv.", "Russian_invasion_of_Ukraine"),
      ev("Queen Elizabeth II Dies", "Britain's longest-serving monarch dies September 8 at 96, ending a 70-year reign. Charles III ascends the throne.", "Death_and_state_funeral_of_Elizabeth_II"),
      ev("ChatGPT Launched", "OpenAI releases ChatGPT on November 30. Reaches 100 million users in two months — the fastest consumer product adoption in history.", "ChatGPT"),
      ev("Roe v. Wade Overturned", "U.S. Supreme Court reverses 1973 abortion rights precedent in Dobbs v. Jackson, returning the issue to states.", "Dobbs_v._Jackson_Women%27s_Health_Organization"),
      ev("Iran Protests Spread", "Death of Mahsa Amini in police custody triggers the largest challenge to the Iranian regime since 1979. Hundreds killed in crackdowns.", "Mahsa_Amini_protests"),
    ],
    seeAlso: [
      { year: 2023, note: "Israel–Hamas war begins" },
      { year: 1979, note: "Iranian Revolution" },
    ],
  },
  2023: {
    events: [
      ev("Hamas Attack; Israel–Gaza War", "On October 7, Hamas launches a surprise assault on Israel, killing ~1,200 and taking hostages. Israel's response devastates Gaza; conflict will reshape the Middle East.", "Israel%E2%80%93Hamas_war"),
      ev("AI Year of Breakthrough", "GPT-4 launches in March; Google releases Bard; Midjourney v5 and Stable Diffusion XL redefine AI image generation. AI enters mainstream life and law.", "GPT-4"),
      ev("Turkey–Syria Earthquake", "On February 6, a magnitude 7.8 quake kills ~62,000 across Turkey and Syria — the 5th-deadliest earthquake of the 21st century.", "2023_Turkey%E2%80%93Syria_earthquakes"),
      ev("India Passes China in Population", "India becomes the world's most populous country, with ~1.43 billion people. Demographic shift will reshape the 21st century.", "Demographics_of_India"),
      ev("WHO Ends COVID Global Emergency", "On May 5, the World Health Organization declares the COVID-19 public health emergency over after 3+ years. Over 7 million confirmed dead worldwide.", "COVID-19_pandemic"),
    ],
    seeAlso: [
      { year: 2020, note: "COVID-19 pandemic begins" },
      { year: 1948, note: "Founding of Israel" },
    ],
  },
  2024: {
    events: [
      ev("Trump Re-elected to Presidency", "Donald Trump wins the November U.S. election, defeating Kamala Harris. Becomes the first convicted felon elected president, and the first to win non-consecutive terms since Grover Cleveland.", "2024_United_States_presidential_election"),
      ev("Fall of Assad in Syria", "After 53 years of Ba'ath Party rule, Bashar al-Assad flees to Moscow in December as rebels led by HTS sweep through Damascus in 11 days.", "Fall_of_the_Assad_regime"),
      ev("Climate Crosses 1.5°C Threshold", "2024 becomes the first calendar year with average global temperature 1.5°C above pre-industrial levels — the Paris Agreement's symbolic red line.", "Climate_change"),
      ev("Hottest Year on Record", "Hurricane Helene and Milton batter the U.S.; floods in Spain; wildfires across the Amazon. Record-breaking extreme weather affirms accelerating climate change.", "2024_Atlantic_hurricane_season"),
      ev("Paris Summer Olympics", "First Olympics after COVID's disruption, held in Paris. Opening ceremony along the Seine; Simone Biles returns; a rare moment of global cooperation.", "2024_Summer_Olympics"),
    ],
    seeAlso: [
      { year: 2020, note: "COVID-19 disrupts prior Olympics" },
      { year: 2011, note: "Start of Syrian civil war" },
    ],
  },
  2025: {
    events: [
      ev("Trump Returns to the White House", "Inaugurated January 20 as the 47th U.S. president — the second to serve non-consecutive terms. Sweeping tariffs, mass deportations, and overhauls of federal agencies reshape global politics.", "Second_presidency_of_Donald_Trump"),
      ev("Global AI Spending Explodes", "AI-related investment reaches ~$1.5 trillion for the year. Nvidia briefly crosses a $5 trillion valuation. DeepSeek, a Chinese model, rivals ChatGPT.", "Artificial_intelligence"),
      ev("Pope Francis Dies; Leo XIV Elected", "Pope Francis dies at 88 on April 21. Chicago-born Robert Prevost is elected May 8 as Pope Leo XIV — first American pope.", "Pope_Leo_XIV"),
      ev("Gaza Ceasefire Reached", "After two years of war and ~70,000 deaths, U.S.-mediated ceasefire takes effect. Hostages return, humanitarian aid flows in — but the truce remains fragile.", "Gaza_war"),
      ev("LA Wildfires Devastate California", "January fires in Pacific Palisades and Eaton Canyon kill 30, burn ~50,000 acres, and cause $100B+ in damages.", "January_2025_Southern_California_wildfires"),
    ],
    seeAlso: [
      { year: 2020, note: "COVID-19 pandemic" },
      { year: 2001, note: "September 11 attacks" },
      { year: 2008, note: "Global financial crisis" },
    ],
  },
};

// ===================================================================
// DEEP TIME (unchanged)
// ===================================================================
const DEEP_TIME = [
  { yearsAgo: 3000, label: "c. 1000 BCE", era: "Iron Age",
    key: [
      ev("Iron Working Spreads", "Technology of smelting iron spreads across Eurasia and Africa, enabling stronger tools and weapons than the preceding Bronze Age.", "Iron_Age"),
      ev("Phoenician Alphabet", "A 22-letter script developed in the Levant becomes the ancestor of Greek, Latin, Arabic, and Hebrew writing.", "Phoenician_alphabet"),
      ev("Composition of the Rigveda", "Sanskrit hymns transmitted orally for centuries are among the oldest surviving religious texts.", "Rigveda"),
      ev("Bronze Age Collapse Aftermath", "Late Bronze Age civilizations of the eastern Mediterranean collapsed ~1177 BCE; survivors are rebuilding.", "Late_Bronze_Age_collapse"),
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
      ev("First Musical Instruments", "Bone flutes found in Germany are among the oldest known instruments.", "Prehistoric_music"),
    ],
  },
  { yearsAgo: 300000, label: "c. 300,000 BCE", era: "Emergence of Homo Sapiens",
    key: [
      ev("Anatomically Modern Humans", "Earliest known Homo sapiens fossils from Jebel Irhoud, Morocco. Our species is born.", "Homo_sapiens"),
      ev("Control of Fire Mastered", "Regular, controlled use of fire for cooking, warmth, and protection is well established among hominins.", "Control_of_fire_by_early_humans"),
      ev("Multiple Human Species Coexist", "Homo erectus, Neanderthals, Denisovans, and others share the planet.", "Hominini"),
      ev("Stone Tool Sophistication", "Middle Stone Age toolmakers produce hafted spears and refined hand axes.", "Stone_tool"),
      ev("Ice Ages Come and Go", "Cycles of glacial and interglacial periods drive migration and adaptation across continents.", "Quaternary_glaciation"),
    ],
  },
  { yearsAgo: 2_000_000, label: "c. 2 million BCE", era: "Early Stone Age",
    key: [
      ev("Homo Habilis, 'Handy Man'", "Early human ancestors in Africa use simple stone tools.", "Homo_habilis"),
      ev("First Stone Tools", "Deliberately chipped stones used for cutting and scraping mark the start of the archaeological record.", "Oldowan"),
      ev("Savanna Adaptation", "Bipedalism frees hands for tool use; brains grow larger, requiring more calories.", "Bipedalism"),
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
      ev("Earliest Life Emerges", "Chemical self-replicators in warm vents or tidal pools become the first cells.", "Abiogenesis"),
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
// SIGNIFICANT EVENTS (only POL and SCI categories now)
// ===================================================================
const SIGNIFICANT_EVENTS = [
  { year: 2024, cat: "POL", label: "Fall of Assad; Trump re-elected" },
  { year: 2022, cat: "POL", label: "Russia invades Ukraine" },
  { year: 2020, cat: "SCI", label: "COVID-19 pandemic declared" },
  { year: 2001, cat: "POL", label: "September 11 attacks" },
  { year: 1989, cat: "POL", label: "Fall of the Berlin Wall" },
  { year: 1969, cat: "SCI", label: "Moon landing (Apollo 11)" },
  { year: 1945, cat: "POL", label: "End of WWII, atomic age" },
  { year: 1918, cat: "SCI", label: "Flu pandemic, WWI ends" },
  { year: 1905, cat: "SCI", label: "Einstein's miracle year (relativity)" },
  { year: 1876, cat: "SCI", label: "Telephone invented" },
  { year: 1859, cat: "SCI", label: "Darwin publishes On the Origin of Species" },
  { year: 1776, cat: "POL", label: "U.S. Declaration of Independence" },
  { year: 1687, cat: "SCI", label: "Newton's Principia published" },
  { year: 1492, cat: "SCI", label: "Columbus reaches the Americas" },
  { year: 1455, cat: "SCI", label: "Gutenberg Bible printed" },
  { year: 1347, cat: "SCI", label: "Black Death begins in Europe" },
  { year: 1215, cat: "POL", label: "Magna Carta signed" },
  { year: 1066, cat: "POL", label: "Norman Conquest of England" },
  { year: 622, cat: "POL", label: "Muhammad's Hijra — Islamic Year 1" },
  { year: 476, cat: "POL", label: "Fall of Western Roman Empire" },
  { year: -44, cat: "POL", label: "Assassination of Julius Caesar" },
  { year: -221, cat: "POL", label: "Qin unifies China" },
  { year: -323, cat: "POL", label: "Death of Alexander the Great" },
  { year: -500, cat: "POL", label: "Axial Age: Buddha & Confucius" },
  { year: -776, cat: "POL", label: "First Olympic Games" },
  { year: -1754, cat: "POL", label: "Code of Hammurabi" },
];

// ===================================================================
// HELPERS
// ===================================================================
function currentDefaultYear() { return new Date().getFullYear() - 1; }
function currentYear() { return new Date().getFullYear(); }
function formatToday() {
  return new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function wikiSlugCandidates(year) {
  if (year > 0) return [String(year), `AD_${year}`];
  const abs = Math.abs(year);
  return [`${abs}_BC`, `${abs}_BCE`];
}
function yearToWikiSlug(year) { return wikiSlugCandidates(year)[0]; }

function formatYear(year) {
  if (year > 0) return String(year);
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
// CACHE — uses localStorage when available (deployed site),
// in-memory fallback otherwise (artifact sandbox)
// ===================================================================
const memoryCache = new Map();
const CACHE_VERSION = "v1";
const CACHE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function cacheGet(key) {
  try {
    const raw = localStorage.getItem(`cc:${CACHE_VERSION}:${key}`);
    if (!raw) return memoryCache.get(key) ?? null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.t > CACHE_MAX_AGE_MS) {
      localStorage.removeItem(`cc:${CACHE_VERSION}:${key}`);
      return null;
    }
    return parsed.v;
  } catch {
    return memoryCache.get(key) ?? null;
  }
}

function cacheSet(key, value) {
  const payload = { t: Date.now(), v: value };
  try {
    localStorage.setItem(`cc:${CACHE_VERSION}:${key}`, JSON.stringify(payload));
  } catch {
    // localStorage blocked (artifact sandbox) — fall back to memory
  }
  memoryCache.set(key, value);
}

// ===================================================================
// EVENT TEXT PARSING
// ===================================================================
function parseWikiEvent(raw, fallbackSlug) {
  let text = raw.trim().replace(/\s+/g, " ").replace(/\[[^\]]*\]/g, "").trim();
  const dateMatch = text.match(/^((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:\s*[-–—]\s*(?:January|February|March|April|May|June|July|August|September|October|November|December)?\s*\d{1,2})?)\s*[-–—:]\s*(.+)$/i);
  let datePrefix = null;
  let body = text;
  if (dateMatch) {
    datePrefix = dateMatch[1].trim();
    body = dateMatch[2].trim();
  }
  const firstSentenceMatch = body.match(/^(.+?[.!?])(\s|$)(.*)/s);
  let title, detail;
  if (firstSentenceMatch) {
    title = firstSentenceMatch[1].trim();
    detail = (firstSentenceMatch[3] || "").trim() || body;
  } else {
    title = body;
    detail = body;
  }
  if (title.length > 95) {
    const breakPoint = title.slice(0, 95).lastIndexOf(",");
    title = breakPoint > 50 ? title.slice(0, breakPoint) + "…" : title.slice(0, 95) + "…";
  }
  title = title.replace(/\s*\(\d{3,4}\)$/, "");
  const finalTitle = datePrefix ? `${datePrefix}: ${title}` : title;
  return { title: finalTitle, detail: body, wiki: fallbackSlug };
}

// ===================================================================
// WIKIPEDIA FETCH + PAGEVIEW RANKING
// ===================================================================

// Extract all candidate events from a Wikipedia year page.
// Returns up to ~25 candidates (to then rank by pageviews).
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
      const stopHeadings = ["births", "deaths", "references", "see also", "external links", "notes", "publications", "new works", "by topic", "by place", "by category"];
      let stopHeading = null;
      for (let i = eventsIdx + 1; i < allHeadings.length; i++) {
        const h = allHeadings[i];
        if (h.tagName !== "H2") continue;
        const t = (h.textContent || "").trim().toLowerCase().replace(/\[edit\]/g, "").trim();
        if (stopHeadings.some((s) => t === s || t.startsWith(s))) { stopHeading = h; break; }
        stopHeading = h;
        break;
      }

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

      const parsed = collected.map((li) => {
        li.querySelectorAll(".mw-editsection, sup.reference, sup.noprint, .mw-ext-cite-error, style").forEach((el) => el.remove());
        const text = li.textContent.trim();
        if (!text || text.length < 25) return null;
        // Get the most prominent/earliest wiki link — this is usually the subject of the event
        const links = Array.from(li.querySelectorAll("a[href^='/wiki/']"))
          .map((a) => a.getAttribute("href"))
          .filter((h) => h && !h.includes(":")) // skip File:/Category: etc.
          .map((h) => decodeURIComponent(h.replace("/wiki/", "").split("#")[0]));
        const wikiSlug = links[0] || pageName;
        const parsedEv = parseWikiEvent(text, wikiSlug);
        return { ...parsedEv, _allLinks: links };
      }).filter(Boolean);

      const seen = new Set();
      const unique = parsed.filter((e) => {
        if (seen.has(e.title)) return false;
        seen.add(e.title);
        return true;
      });

      if (unique.length > 0) return { candidates: unique.slice(0, 25), pageName };
    } catch {
      // try next
    }
  }
  return { error: "No Wikipedia page found" };
}

// Fetch pageview totals for a set of article slugs.
// Uses the Wikipedia REST pageviews API (last 60 days, aggregated).
// Returns a map: slug → total pageviews (or 0 on failure).
async function fetchPageviews(slugs) {
  const end = new Date();
  const start = new Date(end.getTime() - 60 * 24 * 60 * 60 * 1000);
  const fmt = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const startStr = fmt(start);
  const endStr = fmt(end);

  const results = {};
  // Batch fetches with concurrency limit to avoid overwhelming Wikipedia
  const BATCH_SIZE = 5;
  for (let i = 0; i < slugs.length; i += BATCH_SIZE) {
    const batch = slugs.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (slug) => {
      const cacheKey = `pv:${slug}`;
      const cached = cacheGet(cacheKey);
      if (cached !== null) {
        results[slug] = cached;
        return;
      }
      try {
        const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/${encodeURIComponent(slug)}/daily/${startStr}/${endStr}`;
        const res = await fetch(url);
        if (!res.ok) { results[slug] = 0; return; }
        const data = await res.json();
        const total = (data.items || []).reduce((sum, item) => sum + (item.views || 0), 0);
        results[slug] = total;
        cacheSet(cacheKey, total);
      } catch {
        results[slug] = 0;
      }
    }));
  }
  return results;
}

// Fetch events for a year, ranked by Wikipedia pageview popularity.
async function fetchRankedEvents(year) {
  const cacheKey = `year:${year}`;
  const cached = cacheGet(cacheKey);
  if (cached) return { events: cached, cached: true };

  const candidates = await fetchWikipediaCandidates(year);
  if (candidates.error || !candidates.candidates) {
    return { error: candidates.error || "No candidates found" };
  }

  // Gather unique slugs from top link in each event
  const slugs = Array.from(new Set(candidates.candidates.map((c) => c.wiki).filter(Boolean)));
  const pageviews = await fetchPageviews(slugs);

  // Score each event by its link's pageview count
  const scored = candidates.candidates.map((c) => ({
    ...c,
    _score: pageviews[c.wiki] || 0,
  }));

  // Sort by pageviews descending, take top 5
  scored.sort((a, b) => b._score - a._score);
  const top = scored.slice(0, 5).map(({ _score, _allLinks, ...rest }) => rest);

  cacheSet(cacheKey, top);
  return { events: top, cached: false };
}

// ===================================================================
// STACK BUILDER
// ===================================================================
function buildStack(anchor) {
  const items = [];
  for (let i = 3; i >= 1; i--) {
    const target = anchor + 100 * i;
    if (target <= currentYear() + 100) {
      items.push({ year: target, isAnchor: false, offset: 100 * i });
    }
  }
  items.push({ year: anchor, isAnchor: true, offset: 0 });
  let i = 1;
  while (i <= 30) {
    const target = anchor - 100 * i;
    if (target < -3000) break;
    items.push({ year: target, isAnchor: false, offset: -100 * i });
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
// MAIN COMPONENT
// ===================================================================
export default function CenturyCompare() {
  const defaultYear = currentDefaultYear();
  const initialAnchor = EVENTS[String(defaultYear)] ? defaultYear : 2025;

  const [input, setInput] = useState(String(initialAnchor));
  const [anchor, setAnchor] = useState(initialAnchor);
  const [expanded, setExpanded] = useState(null);
  const [showDeepTime, setShowDeepTime] = useState(false);
  const [activeCat, setActiveCat] = useState("all");

  const stack = useMemo(() => buildStack(anchor), [anchor]);

  const filteredSignificant = useMemo(() => {
    if (activeCat === "all") return SIGNIFICANT_EVENTS;
    return SIGNIFICANT_EVENTS.filter((e) => e.cat === activeCat);
  }, [activeCat]);

  const submit = (e) => {
    e?.preventDefault();
    const n = parseYearInput(input);
    if (n !== null && n >= -3000 && n <= 2100 && n !== 0) {
      setAnchor(n);
      setExpanded(null);
      setShowDeepTime(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const jumpTo = (y) => {
    setInput(formatYear(y));
    setAnchor(y);
    setExpanded(null);
    setShowDeepTime(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          Enter a year. See it among the centuries before and after.
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
      </div>

      <div className="px-5 md:px-12 py-5" style={{ borderBottom: "1px solid #3d3528" }}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} style={{ color: "#d4a856" }} />
          <div className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#d4a856" }}>
            Significant Events
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {CATEGORIES.map((cat) => {
            const isActive = activeCat === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCat(cat.key)}
                className="text-[10px] uppercase tracking-widest px-2.5 py-1 transition-all"
                style={{
                  background: isActive ? cat.color : "transparent",
                  color: isActive ? "#1a1612" : cat.color,
                  border: `1px solid ${cat.color}80`,
                  fontFamily: "'JetBrains Mono', monospace",
                  borderRadius: "2px",
                  fontWeight: isActive ? 700 : 400,
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-1">
          {filteredSignificant.length === 0 ? (
            <div className="text-xs italic py-2" style={{ color: "#6c5a3a" }}>
              No events in this category yet.
            </div>
          ) : filteredSignificant.map((item) => {
            const active = anchor === item.year;
            const cat = CATEGORIES.find((c) => c.key === item.cat) || CATEGORIES[0];
            return (
              <button
                key={`${item.year}-${item.cat}`}
                onClick={() => jumpTo(item.year)}
                className="text-left flex items-baseline gap-3 py-1.5 px-2.5 transition-all hover:brightness-125"
                style={{
                  background: active ? `${cat.color}20` : "transparent",
                  border: `1px solid ${active ? cat.color : "#3d3528"}`,
                  borderRadius: "2px",
                }}
              >
                <span className="text-sm font-bold shrink-0 w-20" style={{ color: active ? cat.color : "#f5ead0", fontFamily: "'Fraunces', serif" }}>
                  {formatYear(item.year)}
                </span>
                <span className="text-xs flex items-center gap-2 flex-wrap" style={{ color: "#9a8b6f", fontFamily: "'JetBrains Mono', monospace" }}>
                  <span style={{
                    color: cat.color,
                    border: `1px solid ${cat.color}80`,
                    padding: "1px 5px",
                    borderRadius: "2px",
                    fontSize: "9px",
                    letterSpacing: "0.1em",
                  }}>
                    {cat.key === "POL" ? "POL" : cat.key === "SCI" ? "SCI" : "ALL"}
                  </span>
                  <span>{item.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

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
                expanded={expanded}
                setExpanded={setExpanded}
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
                return <DeepTimeBlock key={era.yearsAgo} era={era} accent={color} expanded={expanded} setExpanded={setExpanded} />;
              })}
              <FinalMessage />
            </div>
          )}
        </div>
      </main>

      <footer className="px-5 md:px-12 py-6 text-xs" style={{ borderTop: "1px solid #3d3528", color: "#5c4a30", fontFamily: "'JetBrains Mono', monospace" }}>
        Curated events · Wikipedia fallback ranked by 60-day pageview popularity · Cached for 30 days
      </footer>
    </div>
  );
}

function YearBlock({ year, accent, isAnchor, offset, expanded, setExpanded, onJumpTo }) {
  const isCurrent = year === currentYear();
  const curated = EVENTS[String(year)];
  const [wikiEvents, setWikiEvents] = useState(null);
  const [loading, setLoading] = useState(!curated && !isCurrent);
  const [fetchError, setFetchError] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    if (curated || isCurrent) return;
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
  }, [year, curated, isCurrent]);

  const eraBadge = year < 0 ? "BCE" : "CE";
  const yearNumber = Math.abs(year);
  const wikiSlug = yearToWikiSlug(year);
  const sameCentury = (a, b) => Math.floor((a - (a < 0 ? 99 : 0)) / 100) === Math.floor((b - (b < 0 ? 99 : 0)) / 100);

  if (isCurrent) {
    return (
      <section style={{ background: "#2a2218", padding: "20px", border: `1px solid ${accent}60`, borderRadius: "4px" }}>
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
            <div className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>
              In progress
            </div>
          </div>
        </div>

        <div className="p-4 mb-3" style={{ background: `linear-gradient(90deg, ${accent}15 0%, transparent 100%)`, border: `1px solid ${accent}40`, borderLeftWidth: "3px", borderRadius: "2px" }}>
          <div className="flex items-start gap-2 mb-2">
            <span className="text-[9px] uppercase tracking-[0.2em] px-1.5 py-0.5 shrink-0"
              style={{ fontFamily: "'JetBrains Mono', monospace", background: accent, color: "#1a1612", borderRadius: "2px", fontWeight: 700 }}>
              ● LIVE
            </span>
            <span className="text-[10px] uppercase tracking-widest" style={{ color: "#9a8b6f", fontFamily: "'JetBrains Mono', monospace" }}>
              Events in progress · {formatToday()}
            </span>
          </div>
          <p className="text-[15px] leading-relaxed mb-3" style={{ color: "#d4c7a8" }}>
            {yearNumber} is still unfolding. Rather than cherry-pick events from an incomplete year, head to Wikipedia's live-updated page for the full record as it develops.
          </p>
          <a href={`https://en.wikipedia.org/wiki/${wikiSlug}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-2.5 px-4 text-xs uppercase tracking-widest font-semibold transition-all hover:brightness-125"
            style={{ background: accent, color: "#1a1612", fontFamily: "'JetBrains Mono', monospace", borderRadius: "2px", textDecoration: "none" }}>
            <BookOpen size={14} /> Read {yearNumber} on Wikipedia <ExternalLink size={12} />
          </a>
        </div>
      </section>
    );
  }

  const data = curated || (wikiEvents ? { events: wikiEvents, seeAlso: [], fromWiki: true } : null);
  const events = data?.events || [];
  const seeAlso = (data?.seeAlso || []).filter((s) => sameCentury(s.year, year));

  return (
    <section style={{
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
            {isAnchor ? "Your year" : offset > 0 ? `+${offset} years` : `${offset} years`}
          </div>
          <div className="text-xs mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#d4a856" }}>
            {loading ? "ranking…" : events.length > 0 ? `${events.length} key events` : "no data"}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-4 text-sm" style={{ color: "#9a8b6f" }}>
          <Loader2 size={14} className="animate-spin" /> Fetching & ranking by Wikipedia popularity…
        </div>
      )}

      {!loading && !data && fetchError && (
        <div className="py-4 text-sm italic space-y-2" style={{ color: "#9a8b6f" }}>
          <div>Couldn't load events for {yearNumber} {eraBadge}.</div>
          <div className="text-xs not-italic" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#6c5a3a" }}>⚠ {fetchError}</div>
          <div>
            Try{" "}
            <a href={`https://en.wikipedia.org/wiki/${wikiSlug}`} target="_blank" rel="noopener noreferrer"
               className="underline hover:no-underline" style={{ color: accent }}>the Wikipedia page</a>{" "}directly.
          </div>
        </div>
      )}

      {data && (
        <>
          {data.fromWiki && (
            <div className="mb-3 text-[10px] uppercase tracking-widest flex items-center gap-1.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>
              <TrendingUp size={10} />
              <span>Live from Wikipedia · ranked by 60-day pageviews</span>
              {fromCache && <span style={{ opacity: 0.6 }}>· cached</span>}
            </div>
          )}
          <ol className="space-y-0">
            {events.map((event, i) => {
              const key = `${year}-${i}`;
              const isOpen = expanded === key;
              return (
                <li key={i} style={{ borderBottom: "1px solid #3d3528" }}>
                  <button onClick={() => setExpanded(isOpen ? null : key)} className="text-left w-full py-4 group">
                    <div className="flex items-start gap-3">
                      <span className="text-xs mt-1.5 shrink-0 w-6" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9a8b6f" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-semibold leading-snug" style={{ color: "#f5ead0" }}>{event.title}</h3>
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

          <div className="mt-5">
            <a href={`https://en.wikipedia.org/wiki/${wikiSlug}`} target="_blank" rel="noopener noreferrer"
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
