import { useState, useMemo, useEffect } from "react";
import { ExternalLink, Search, ArrowUp, ArrowDown, BookOpen, Infinity as InfinityIcon, Loader2, Minus, Sparkles, TrendingUp, ChevronLeft, ChevronRight, Clock, CornerDownRight } from "lucide-react";

// ===================================================================
// DEEP TIME — kept static (pageviews not useful here)
// ===================================================================
const ev = (title, detail, wiki) => ({ title, detail, wiki });
const DEEP_TIME = [
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
  -814, -1000, -1200, -1274, -1351, -1550, -1754, -2560,
];

// ===================================================================
// THEMES — curated "recurring patterns" that span history.
// Each theme groups events from different centuries so users can see
// how similar dynamics play out over time.
//
// Matching: if an event's `wiki` slug appears in a theme's `members`
// array, that event is considered part of the theme, and the other
// members are shown as "See also" links.
// ===================================================================
// Each member has:
//   year: the canonical year for jumping/display
//   wiki: the PRIMARY Wikipedia slug (used for matching + the link)
//   altWikis: array of alternate slugs that also identify this event
//             (handles Wikipedia redirects and variant naming)
//   title: display label in the See Also list
//   desc: short description used when this event is pinned into a year's top 5
const THEMES = [
  {
    id: "pandemics",
    label: "Pandemics",
    description: "Disease events that reshaped populations and institutions",
    members: [
      { year: 541, wiki: "Plague_of_Justinian", altWikis: [], title: "Plague of Justinian", desc: "A devastating outbreak of bubonic plague sweeps the Byzantine Empire, killing an estimated 25–50 million people and accelerating the decline of late antiquity." },
      { year: 1347, wiki: "Black_Death", altWikis: ["Bubonic_plague"], title: "Black Death", desc: "The worst pandemic in recorded human history reaches Europe, killing 30–50% of the population over four years and reshaping labor, religion, and economics for centuries." },
      { year: 1520, wiki: "1520_Mexico_City_smallpox_epidemic", altWikis: ["Smallpox"], title: "Smallpox in the Americas", desc: "Smallpox brought by European colonizers devastates Indigenous populations of the Americas, killing up to 90% of some communities — one of history's greatest demographic catastrophes." },
      { year: 1665, wiki: "Great_Plague_of_London", altWikis: [], title: "Great Plague of London", desc: "The last major outbreak of bubonic plague in England kills roughly a quarter of London's population in 18 months." },
      { year: 1918, wiki: "1918_flu_pandemic", altWikis: ["Spanish_flu", "1918_influenza_pandemic"], title: "1918 flu pandemic", desc: "An influenza strain infects a third of the global population and kills an estimated 50–100 million people worldwide — more than World War I." },
      { year: 2020, wiki: "COVID-19_pandemic", altWikis: ["COVID-19", "Coronavirus_disease_2019"], title: "COVID-19 pandemic", desc: "WHO declares COVID-19 a pandemic in March. Over 7 million confirmed deaths and unprecedented global lockdowns reshape work, travel, and public health." },
    ],
  },
  {
    id: "financial-crises",
    label: "Financial panics",
    description: "Speculative bubbles and their collapses",
    members: [
      { year: 1637, wiki: "Tulip_mania", altWikis: [], title: "Tulip Mania", desc: "Prices for Dutch tulip bulbs collapse after a speculative frenzy — considered the first recorded economic bubble." },
      { year: 1720, wiki: "South_Sea_Bubble", altWikis: ["South_Sea_Company"], title: "South Sea Bubble", desc: "Shares in Britain's South Sea Company crash after wild speculation, wiping out fortunes including Isaac Newton's." },
      { year: 1873, wiki: "Panic_of_1873", altWikis: ["Long_Depression"], title: "Panic of 1873", desc: "A railroad-and-bank collapse triggers the 'Long Depression' — a global economic slump lasting more than two decades." },
      { year: 1929, wiki: "Wall_Street_crash_of_1929", altWikis: ["Great_Depression"], title: "Wall Street Crash", desc: "U.S. stock markets collapse over several days in October, triggering the Great Depression and reshaping global economics and politics for a generation." },
      { year: 2008, wiki: "2007%E2%80%932008_financial_crisis", altWikis: ["Great_Recession", "Financial_crisis_of_2007%E2%80%932008"], title: "Global Financial Crisis", desc: "Subprime mortgage collapse triggers a worldwide banking crisis, Great Recession, and the biggest government bailouts in history." },
    ],
  },
  {
    id: "information-revolutions",
    label: "Information revolutions",
    description: "Technologies that transformed how humans spread knowledge",
    members: [
      { year: 1455, wiki: "Gutenberg_Bible", altWikis: ["Printing_press", "Johannes_Gutenberg"], title: "Printing press (Gutenberg Bible)", desc: "Gutenberg completes his 42-line Bible, the first major European book printed with movable type — launching a revolution in literacy, religion, and science." },
      { year: 1844, wiki: "Telegraph", altWikis: ["Electrical_telegraph", "Samuel_Morse"], title: "Telegraph era begins", desc: "Samuel Morse transmits 'What hath God wrought' from Washington to Baltimore. For the first time, information travels faster than a horse." },
      { year: 1876, wiki: "Telephone", altWikis: ["Alexander_Graham_Bell", "Invention_of_the_telephone"], title: "Telephone invented", desc: "Alexander Graham Bell patents the telephone and makes the first successful voice call. The wired world begins to connect." },
      { year: 1920, wiki: "Radio", altWikis: ["Broadcasting", "KDKA_(AM)"], title: "Broadcast radio", desc: "KDKA in Pittsburgh broadcasts the first commercial radio program — the dawn of mass-audience electronic media." },
      { year: 1969, wiki: "ARPANET", altWikis: ["History_of_the_Internet"], title: "ARPANET (early internet)", desc: "The first message is sent across ARPANET between UCLA and Stanford. The internet is born, though few yet know it." },
      { year: 1991, wiki: "World_Wide_Web", altWikis: ["Tim_Berners-Lee"], title: "World Wide Web", desc: "Tim Berners-Lee publishes the first website from CERN, making the internet accessible through hyperlinked pages anyone can create." },
      { year: 2007, wiki: "IPhone_(1st_generation)", altWikis: ["IPhone", "Smartphone"], title: "Smartphone era (iPhone)", desc: "Apple launches the first iPhone, combining phone, internet, and computer into one pocket device — rewiring human attention and behavior." },
      { year: 2022, wiki: "ChatGPT", altWikis: ["Generative_artificial_intelligence", "GPT-3"], title: "Generative AI goes mainstream", desc: "OpenAI releases ChatGPT, reaching 100 million users in two months — the fastest consumer product adoption in history and the start of the AI era." },
    ],
  },
  {
    id: "empire-falls",
    label: "Fall of empires",
    description: "Collapses of long-dominant political orders",
    members: [
      { year: 476, wiki: "Fall_of_the_Western_Roman_Empire", altWikis: ["Western_Roman_Empire"], title: "Fall of Western Rome", desc: "The last Roman emperor in the West, Romulus Augustulus, is deposed by the Germanic king Odoacer — ending a polity that had lasted nearly a millennium." },
      { year: 1453, wiki: "Fall_of_Constantinople", altWikis: ["Byzantine_Empire"], title: "Fall of Constantinople", desc: "Ottoman forces under Mehmed II capture Constantinople, ending the 1,100-year Byzantine Empire and traditionally marking the close of the Middle Ages." },
      { year: 1644, wiki: "Transition_from_Ming_to_Qing", altWikis: ["Ming_dynasty", "Qing_dynasty"], title: "Fall of Ming China", desc: "After peasant rebellions and Manchu invasion, the 276-year Ming dynasty collapses. The Qing dynasty begins, reshaping China for the next 267 years." },
      { year: 1806, wiki: "Holy_Roman_Empire", altWikis: ["Dissolution_of_the_Holy_Roman_Empire"], title: "End of the Holy Roman Empire", desc: "Under pressure from Napoleon, Emperor Francis II dissolves the thousand-year Holy Roman Empire — ending the medieval European political order." },
      { year: 1917, wiki: "Russian_Revolution", altWikis: ["October_Revolution", "February_Revolution"], title: "Fall of Russian Empire", desc: "The Romanov dynasty collapses amid war and revolution; the Bolsheviks seize power in October, creating the first communist state." },
      { year: 1991, wiki: "Dissolution_of_the_Soviet_Union", altWikis: ["Soviet_Union"], title: "Dissolution of the Soviet Union", desc: "The USSR formally dissolves into 15 independent republics, ending the Cold War and the 20th century's defining ideological conflict." },
    ],
  },
  {
    id: "revolutions",
    label: "Political revolutions",
    description: "Mass uprisings that replaced existing orders",
    members: [
      { year: 1776, wiki: "American_Revolution", altWikis: ["United_States_Declaration_of_Independence", "American_Revolutionary_War"], title: "American Revolution", desc: "Thirteen British colonies declare independence, articulating in the Declaration a new theory of government by consent of the governed." },
      { year: 1789, wiki: "French_Revolution", altWikis: ["Storming_of_the_Bastille"], title: "French Revolution", desc: "The storming of the Bastille ignites a decade of upheaval that abolishes the monarchy, executes the king, and reshapes European politics forever." },
      { year: 1848, wiki: "Revolutions_of_1848", altWikis: ["Spring_of_Nations"], title: "Revolutions of 1848", desc: "A wave of liberal and nationalist uprisings sweeps Europe from France to Hungary — most fail, but they plant seeds for later democratic reform." },
      { year: 1917, wiki: "Russian_Revolution", altWikis: ["October_Revolution", "February_Revolution"], title: "Russian Revolution", desc: "Bolshevik revolutionaries seize power in October, establishing the first communist state and setting the stage for the 20th-century Cold War." },
      { year: 1949, wiki: "Chinese_Communist_Revolution", altWikis: ["Chinese_Civil_War", "Proclamation_of_the_People%27s_Republic_of_China"], title: "Chinese Communist Revolution", desc: "Mao Zedong proclaims the People's Republic of China after decades of civil war, bringing nearly a quarter of the world's population under communist rule." },
      { year: 1979, wiki: "Iranian_Revolution", altWikis: ["Ruhollah_Khomeini"], title: "Iranian Revolution", desc: "The Shah is overthrown and Ayatollah Khomeini establishes an Islamic Republic — the first successful theocratic revolution of the modern era." },
      { year: 1989, wiki: "Revolutions_of_1989", altWikis: ["Fall_of_the_Berlin_Wall", "Berlin_Wall"], title: "Revolutions of 1989", desc: "The Berlin Wall falls and communist regimes collapse across Eastern Europe within months — bloodlessly, and faster than anyone predicted." },
      { year: 2011, wiki: "Arab_Spring", altWikis: [], title: "Arab Spring", desc: "Mass protests topple governments in Tunisia, Egypt, Libya, and Yemen. Some lead to democratic transitions, others to civil wars that continue today." },
    ],
  },
  {
    id: "scientific-paradigms",
    label: "Scientific paradigm shifts",
    description: "Breakthroughs that reshaped our understanding of reality",
    members: [
      { year: 1543, wiki: "De_revolutionibus_orbium_coelestium", altWikis: ["Nicolaus_Copernicus", "Heliocentrism"], title: "Copernican heliocentrism", desc: "Copernicus publishes his argument that Earth orbits the Sun, displacing 1,400 years of geocentric astronomy and triggering the Scientific Revolution." },
      { year: 1687, wiki: "Philosophi%C3%A6_Naturalis_Principia_Mathematica", altWikis: ["Isaac_Newton"], title: "Newton's Principia", desc: "Isaac Newton publishes the Principia, laying out the laws of motion and universal gravitation — the foundation of classical physics for 200+ years." },
      { year: 1859, wiki: "On_the_Origin_of_Species", altWikis: ["Charles_Darwin", "Evolution"], title: "Darwin's Origin of Species", desc: "Darwin publishes his theory of evolution by natural selection, fundamentally reshaping biology and humanity's understanding of its place in nature." },
      { year: 1905, wiki: "Annus_mirabilis_papers", altWikis: ["Albert_Einstein", "Special_relativity"], title: "Einstein's miracle year", desc: "A 26-year-old patent clerk publishes four papers — on the photoelectric effect, Brownian motion, special relativity, and E=mc² — that reshape modern physics." },
      { year: 1925, wiki: "Matrix_mechanics", altWikis: ["Quantum_mechanics", "Werner_Heisenberg"], title: "Quantum mechanics formulated", desc: "Heisenberg formulates matrix mechanics; Schrödinger follows with wave mechanics in 1926. Reality at the atomic scale turns out to be fundamentally probabilistic." },
      { year: 1953, wiki: "Molecular_structure_of_Nucleic_Acids:_A_Structure_for_Deoxyribose_Nucleic_Acid", altWikis: ["DNA", "Francis_Crick", "James_Watson"], title: "DNA double helix", desc: "Watson and Crick publish the double-helix structure of DNA (building on Rosalind Franklin's data), unlocking the molecular basis of heredity." },
    ],
  },
  {
    id: "human-frontiers",
    label: "Reaching new frontiers",
    description: "Moments when humans crossed physical boundaries",
    members: [
      { year: 1492, wiki: "Voyages_of_Christopher_Columbus", altWikis: ["Christopher_Columbus"], title: "Columbus reaches the Americas", desc: "Columbus makes landfall in the Bahamas, beginning sustained European contact with the Americas — launching the Columbian Exchange and centuries of colonization." },
      { year: 1522, wiki: "Magellan%E2%80%93Elcano_expedition", altWikis: ["Ferdinand_Magellan"], title: "First circumnavigation", desc: "Magellan's expedition returns to Spain under Elcano after sailing around the world — proving the earth's sphericity empirically and opening global trade routes." },
      { year: 1903, wiki: "Wright_brothers", altWikis: ["Wright_Flyer"], title: "First powered flight", desc: "At Kitty Hawk, the Wright brothers achieve the first sustained, controlled powered flight — 12 seconds that will transform warfare, travel, and commerce." },
      { year: 1953, wiki: "1953_British_Mount_Everest_expedition", altWikis: ["Edmund_Hillary", "Tenzing_Norgay"], title: "First ascent of Everest", desc: "Edmund Hillary and Tenzing Norgay reach the summit of Mount Everest — the first confirmed ascent of the world's highest peak." },
      { year: 1957, wiki: "Sputnik_1", altWikis: ["Sputnik_program"], title: "Sputnik 1 (first satellite)", desc: "The Soviet Union launches Sputnik 1, the first artificial satellite, shocking the West and launching the Space Age and the space race." },
      { year: 1961, wiki: "Vostok_1", altWikis: ["Yuri_Gagarin"], title: "First human in space", desc: "Yuri Gagarin orbits Earth aboard Vostok 1 — the first human being to leave the planet and return safely." },
      { year: 1969, wiki: "Apollo_11", altWikis: ["Neil_Armstrong", "Moon_landing"], title: "Apollo 11 Moon landing", desc: "Neil Armstrong and Buzz Aldrin walk on the Moon while 650 million people watch live — the farthest humans have ever traveled from Earth." },
    ],
  },
  {
    id: "major-wars",
    label: "Wars that redrew the world",
    description: "Large-scale conflicts with lasting geopolitical consequences",
    members: [
      { year: 1618, wiki: "Thirty_Years%27_War", altWikis: [], title: "Thirty Years' War", desc: "Europe's deadliest religious war kills up to 8 million. The 1648 Peace of Westphalia establishes the modern concept of sovereign nation-states." },
      { year: 1756, wiki: "Seven_Years%27_War", altWikis: [], title: "Seven Years' War", desc: "Often called the first truly global war — fought on five continents. Britain emerges as the dominant colonial power." },
      { year: 1803, wiki: "Napoleonic_Wars", altWikis: ["Napoleon"], title: "Napoleonic Wars", desc: "A decade of conflict spreads French revolutionary ideals across Europe and redraws its political map at the Congress of Vienna in 1815." },
      { year: 1914, wiki: "World_War_I", altWikis: ["First_World_War"], title: "World War I", desc: "Four years of industrial warfare kill 20 million people, destroy four empires, and set the stage for the century's second, even greater war." },
      { year: 1939, wiki: "World_War_II", altWikis: ["Second_World_War"], title: "World War II", desc: "The deadliest conflict in human history kills 70–85 million, introduces nuclear weapons, and ends with the United States and Soviet Union as rival superpowers." },
      { year: 1947, wiki: "Cold_War", altWikis: [], title: "Cold War begins", desc: "The Truman Doctrine formalizes U.S.-Soviet rivalry. A 44-year standoff between two nuclear superpowers defines global politics until 1991." },
    ],
  },
];

// ===================================================================
// CATEGORIES — curated "significant events in a field"
// Distinct from THEMES: themes are about RECURRENCE (pandemics over
// time), categories are about COVERAGE (the big moments in Arts
// regardless of whether they pattern-match). Events matching a
// category get pinned into their year's top 5 like theme events.
// ===================================================================
const CATEGORIES = [
  {
    id: "arts",
    label: "Arts & Culture",
    description: "Movements, masterworks, and moments that shaped how we create",
    accent: "#b8739a",
    members: [
      { year: -480, wiki: "Classical_Greece", altWikis: ["Classical_antiquity"], title: "Classical Greek art begins", desc: "Following the Persian Wars, Athens enters its Golden Age. Sculpture, architecture, and drama flourish — establishing Western aesthetic ideals." },
      { year: 105, wiki: "Cai_Lun", altWikis: ["History_of_paper"], title: "Paper invented in China", desc: "Cai Lun standardizes papermaking from tree bark, hemp, and rags — a medium that will carry human culture for two millennia." },
      { year: 1010, wiki: "The_Tale_of_Genji", altWikis: ["Murasaki_Shikibu"], title: "The Tale of Genji", desc: "Murasaki Shikibu completes what many consider the world's first novel — a Japanese masterpiece of psychological insight predating the European novel by centuries." },
      { year: 1503, wiki: "Mona_Lisa", altWikis: ["Leonardo_da_Vinci"], title: "Mona Lisa painted", desc: "Leonardo da Vinci begins work on the Mona Lisa, a portrait that will become the most famous painting in the world." },
      { year: 1605, wiki: "Don_Quixote", altWikis: ["Miguel_de_Cervantes"], title: "Don Quixote published", desc: "Cervantes publishes the first part of Don Quixote — widely considered the first modern novel and a founding work of Western literature." },
      { year: 1824, wiki: "Symphony_No._9_(Beethoven)", altWikis: ["Ludwig_van_Beethoven"], title: "Beethoven's Ninth Symphony", desc: "Beethoven premieres his Ninth Symphony with the 'Ode to Joy' finale — a towering achievement of the Romantic era, composed while deaf." },
      { year: 1874, wiki: "Impressionism", altWikis: ["Claude_Monet"], title: "Impressionism debuts", desc: "The first Impressionist exhibition in Paris breaks with academic painting. Monet, Degas, and Renoir redefine what art can capture." },
      { year: 1913, wiki: "The_Rite_of_Spring", altWikis: ["Igor_Stravinsky"], title: "The Rite of Spring premieres", desc: "Stravinsky's ballet causes a riot at its Paris premiere. Its dissonance and rhythm shatter classical music conventions and launch modernism." },
      { year: 1939, wiki: "Gone_with_the_Wind_(film)", altWikis: ["Classical_Hollywood_cinema"], title: "Golden Age of Hollywood peak", desc: "Gone with the Wind and The Wizard of Oz release. Studio-era Hollywood reaches its commercial and technical peak." },
      { year: 1967, wiki: "Sgt._Pepper%27s_Lonely_Hearts_Club_Band", altWikis: ["The_Beatles"], title: "Sgt. Pepper's Lonely Hearts Club Band", desc: "The Beatles redefine the album as an art form and mark popular music's full embrace of the avant-garde." },
    ],
  },
  {
    id: "science",
    label: "Science",
    description: "Discoveries that expanded humanity's understanding of the universe",
    accent: "#7ba8d4",
    members: [
      { year: -240, wiki: "Eratosthenes", altWikis: [], title: "Eratosthenes measures Earth", desc: "Eratosthenes calculates Earth's circumference using shadows and geometry — accurate to within a few percent, using only ancient mathematics." },
      { year: 1021, wiki: "Book_of_Optics", altWikis: ["Ibn_al-Haytham"], title: "Ibn al-Haytham's Book of Optics", desc: "Ibn al-Haytham publishes the Book of Optics, founding modern optical science and establishing the experimental method centuries before Europe did." },
      { year: 1610, wiki: "Sidereus_Nuncius", altWikis: ["Galileo_Galilei"], title: "Galileo's Sidereus Nuncius", desc: "Galileo publishes telescopic observations of the moon, Jupiter's moons, and countless stars — providing concrete evidence for the Copernican model." },
      { year: 1869, wiki: "Periodic_table", altWikis: ["Dmitri_Mendeleev"], title: "Mendeleev's periodic table", desc: "Mendeleev publishes the periodic table, correctly predicting the existence and properties of elements not yet discovered." },
      { year: 1896, wiki: "Radioactivity", altWikis: ["Henri_Becquerel", "Marie_Curie"], title: "Radioactivity discovered", desc: "Becquerel discovers radioactivity; Marie and Pierre Curie soon isolate polonium and radium — opening the atomic age." },
      { year: 1915, wiki: "General_relativity", altWikis: ["Albert_Einstein"], title: "General relativity", desc: "Einstein completes general relativity, redefining gravity as curvature of spacetime. Confirmed during the 1919 eclipse, making him a global celebrity." },
      { year: 1928, wiki: "Penicillin", altWikis: ["Alexander_Fleming"], title: "Penicillin discovered", desc: "Alexander Fleming notices mold killing bacteria in a petri dish — the accidental discovery that launches the antibiotic era." },
      { year: 1964, wiki: "Cosmic_microwave_background", altWikis: ["Big_Bang"], title: "Cosmic microwave background", desc: "Penzias and Wilson detect the afterglow of the Big Bang — decisive evidence for the expanding universe." },
      { year: 1996, wiki: "Dolly_(sheep)", altWikis: ["Cloning"], title: "Dolly the sheep cloned", desc: "Scientists at the Roslin Institute clone the first mammal from an adult cell — opening biotechnology's most profound ethical questions." },
      { year: 2012, wiki: "Higgs_boson", altWikis: ["Large_Hadron_Collider"], title: "Higgs boson detected", desc: "CERN announces discovery of the Higgs boson, confirming the mechanism by which fundamental particles gain mass." },
    ],
  },
  {
    id: "politics",
    label: "Politics",
    description: "Moments that transformed how societies organize power",
    accent: "#c9532b",
    members: [
      { year: -508, wiki: "Athenian_democracy", altWikis: ["Cleisthenes"], title: "Athenian democracy founded", desc: "Cleisthenes' reforms establish the world's first democracy in Athens — direct rule by (male) citizens, inspiring political thought for 2,500 years." },
      { year: -221, wiki: "Qin_dynasty", altWikis: ["Qin_Shi_Huang"], title: "Qin unifies China", desc: "Qin Shi Huang conquers the warring states and creates the first unified Chinese empire — standardizing writing, currency, and measurement." },
      { year: 1215, wiki: "Magna_Carta", altWikis: [], title: "Magna Carta signed", desc: "King John of England is forced to seal Magna Carta, limiting royal power and establishing that law applies even to the king — a foundation of constitutional government." },
      { year: 1648, wiki: "Peace_of_Westphalia", altWikis: ["Treaty_of_Westphalia"], title: "Peace of Westphalia", desc: "Ends the Thirty Years' War and establishes the principle of sovereign nation-states — the organizing logic of modern international relations." },
      { year: 1787, wiki: "Constitution_of_the_United_States", altWikis: ["United_States_Constitution"], title: "U.S. Constitution drafted", desc: "The U.S. Constitutional Convention drafts the world's oldest written national constitution still in use — establishing separation of powers and federalism." },
      { year: 1863, wiki: "Emancipation_Proclamation", altWikis: ["Abraham_Lincoln"], title: "Emancipation Proclamation", desc: "Lincoln declares enslaved people in Confederate states free — a turning point in the American Civil War and in global abolition." },
      { year: 1893, wiki: "Women%27s_suffrage_in_New_Zealand", altWikis: ["Women%27s_suffrage"], title: "New Zealand grants women the vote", desc: "New Zealand becomes the first self-governing country to grant women the right to vote — beginning a wave that will span the century." },
      { year: 1948, wiki: "Universal_Declaration_of_Human_Rights", altWikis: [], title: "Universal Declaration of Human Rights", desc: "The UN General Assembly adopts the first global articulation of fundamental human rights — still the most-translated document in history." },
      { year: 1964, wiki: "Civil_Rights_Act_of_1964", altWikis: ["Civil_rights_movement"], title: "U.S. Civil Rights Act", desc: "Outlaws discrimination based on race, religion, sex, and national origin — a landmark victory of the American civil rights movement." },
      { year: 1994, wiki: "1994_South_African_general_election", altWikis: ["Nelson_Mandela", "Apartheid"], title: "End of apartheid in South Africa", desc: "South Africa holds its first fully democratic election. Nelson Mandela is elected president after 27 years in prison." },
    ],
  },
  {
    id: "religion",
    label: "Religion & Philosophy",
    description: "Events that shaped religious institutions and belief systems",
    accent: "#a48fc2",
    members: [
      { year: -500, wiki: "Siddhartha_Gautama", altWikis: ["Buddhism", "Axial_Age"], title: "Buddha's teachings", desc: "Siddhartha Gautama teaches in northern India, founding Buddhism — one of the great 'Axial Age' traditions that reshaped how humans think about ethics and consciousness." },
      { year: -400, wiki: "Confucius", altWikis: ["Confucianism"], title: "Confucian philosophy", desc: "Confucius's disciples compile the Analects after his death. His ethical system will shape Chinese and East Asian societies for 2,500 years." },
      { year: 33, wiki: "Crucifixion_of_Jesus", altWikis: ["Jesus", "Christianity"], title: "Crucifixion of Jesus", desc: "The execution of Jesus under Pontius Pilate becomes the foundational event of Christianity, which over three centuries will become the Roman Empire's official religion." },
      { year: 313, wiki: "Edict_of_Milan", altWikis: ["Constantine_the_Great"], title: "Edict of Milan", desc: "Constantine and Licinius legalize Christianity across the Roman Empire — ending centuries of persecution and beginning Christianity's rise as a world religion." },
      { year: 622, wiki: "Hijra_(Islam)", altWikis: ["Muhammad"], title: "Muhammad's Hijra", desc: "Muhammad migrates from Mecca to Medina, founding the first Muslim community. Year 1 of the Islamic calendar." },
      { year: 1054, wiki: "East%E2%80%93West_Schism", altWikis: ["Great_Schism"], title: "East-West Schism", desc: "Christianity splits into Roman Catholic and Eastern Orthodox branches — a division that continues to this day." },
      { year: 1517, wiki: "Ninety-five_Theses", altWikis: ["Protestant_Reformation", "Martin_Luther"], title: "Luther's 95 Theses", desc: "Martin Luther posts his critique of Catholic indulgences, igniting the Protestant Reformation that will fracture Western Christianity." },
      { year: 1869, wiki: "First_Vatican_Council", altWikis: [], title: "First Vatican Council", desc: "Declares papal infallibility on matters of faith and morals — a doctrine that reshapes Catholicism's internal authority." },
      { year: 1965, wiki: "Second_Vatican_Council", altWikis: ["Vatican_II"], title: "Second Vatican Council concludes", desc: "The most consequential Catholic council in 400 years ends — modernizing liturgy, embracing religious pluralism, and reshaping Catholicism's relationship with the modern world." },
    ],
  },
  {
    id: "economics",
    label: "Economics & Trade",
    description: "Shifts in how humans produce, exchange, and organize work",
    accent: "#d4a856",
    members: [
      { year: -600, wiki: "Coin", altWikis: ["Lydia"], title: "Coinage invented", desc: "The kingdom of Lydia mints the first standardized coins — enabling commerce at a scale previously impossible." },
      { year: 1200, wiki: "Hanseatic_League", altWikis: ["Medieval_commerce"], title: "Medieval trade networks expand", desc: "The Hanseatic League begins organizing Baltic and North Sea trade — one of history's first formal economic unions." },
      { year: 1602, wiki: "Dutch_East_India_Company", altWikis: ["VOC"], title: "Dutch East India Company founded", desc: "The world's first publicly traded joint-stock corporation is founded, pioneering corporate capitalism and launching the modern stock market." },
      { year: 1776, wiki: "The_Wealth_of_Nations", altWikis: ["Adam_Smith"], title: "Adam Smith's Wealth of Nations", desc: "Adam Smith publishes the foundational text of modern economics, arguing for free markets and the 'invisible hand' of competition." },
      { year: 1848, wiki: "The_Communist_Manifesto", altWikis: ["Karl_Marx"], title: "Communist Manifesto published", desc: "Marx and Engels publish their critique of capitalism. Their ideas will reshape politics, economics, and labor movements for the next 150 years." },
      { year: 1913, wiki: "Assembly_line", altWikis: ["Henry_Ford"], title: "Ford's assembly line", desc: "Henry Ford installs the first moving assembly line at Highland Park — slashing car production time from 12 hours to 90 minutes and creating the mass-consumer economy." },
      { year: 1944, wiki: "Bretton_Woods_Conference", altWikis: ["Bretton_Woods_system"], title: "Bretton Woods Conference", desc: "44 nations establish the post-war global financial order: fixed exchange rates, the IMF, and the World Bank. The dollar becomes the anchor currency." },
      { year: 1971, wiki: "Nixon_shock", altWikis: ["End_of_the_Bretton_Woods_system"], title: "End of gold standard", desc: "Nixon ends dollar convertibility to gold, launching the era of fiat currencies and floating exchange rates that defines modern finance." },
      { year: 2001, wiki: "China_and_the_World_Trade_Organization", altWikis: ["World_Trade_Organization"], title: "China joins the WTO", desc: "China's WTO accession accelerates globalization, lifts hundreds of millions out of poverty, and reshapes global supply chains." },
      { year: 2009, wiki: "Bitcoin", altWikis: ["Cryptocurrency", "Satoshi_Nakamoto"], title: "Bitcoin launched", desc: "Satoshi Nakamoto mines the first Bitcoin block — a proof-of-concept for decentralized money that will spawn an entire cryptocurrency industry." },
    ],
  },
  {
    id: "sports",
    label: "Sports",
    description: "Moments that defined athletic competition and its cultural power",
    accent: "#8fc89a",
    members: [
      { year: -776, wiki: "Ancient_Olympic_Games", altWikis: [], title: "First ancient Olympic Games", desc: "The first recorded Olympic Games are held at Olympia, Greece — beginning a tradition of pan-Hellenic athletic competition that lasts over a thousand years." },
      { year: 1863, wiki: "The_Football_Association", altWikis: ["Association_football"], title: "Modern football codified", desc: "The Football Association is formed in England, standardizing the rules of the game and launching what will become the world's most popular sport." },
      { year: 1869, wiki: "Cincinnati_Red_Stockings_(1869)", altWikis: ["Baseball"], title: "First professional baseball team", desc: "The Cincinnati Red Stockings become baseball's first openly all-professional team, launching American professional sports as a commercial enterprise." },
      { year: 1896, wiki: "1896_Summer_Olympics", altWikis: ["Modern_Olympic_Games"], title: "First modern Olympics", desc: "Athens hosts the first modern Olympic Games — 14 nations, 241 athletes (all men). The Games will become the world's preeminent sporting event." },
      { year: 1936, wiki: "1936_Summer_Olympics", altWikis: ["Jesse_Owens"], title: "Jesse Owens in Berlin", desc: "Jesse Owens wins four gold medals at Hitler's Berlin Olympics — a defiant repudiation of Nazi racial ideology seen by the whole world." },
      { year: 1947, wiki: "Jackie_Robinson", altWikis: [], title: "Jackie Robinson breaks MLB color barrier", desc: "Jackie Robinson debuts with the Brooklyn Dodgers, ending six decades of racial segregation in Major League Baseball — a civil rights milestone beyond sports." },
      { year: 1954, wiki: "Four-minute_mile", altWikis: ["Roger_Bannister"], title: "Four-minute mile broken", desc: "Roger Bannister runs a mile in under four minutes, shattering a barrier many believed physically impossible." },
      { year: 1970, wiki: "1970_FIFA_World_Cup", altWikis: ["Pel%C3%A9"], title: "Brazil wins with Pelé", desc: "Brazil wins its third World Cup, cementing Pelé's legacy as football's greatest player. The tournament is the first broadcast live in color worldwide." },
      { year: 1980, wiki: "Miracle_on_Ice", altWikis: ["1980_Winter_Olympics"], title: "Miracle on Ice", desc: "At Lake Placid, the U.S. college hockey team beats the Soviet team — a Cold War-era upset that transcends sport." },
      { year: 1995, wiki: "1995_Rugby_World_Cup_Final", altWikis: ["Nelson_Mandela"], title: "Mandela and the Rugby World Cup", desc: "South Africa wins the Rugby World Cup; Mandela wears the Springbok jersey to present the trophy — a moment of national reconciliation after apartheid." },
    ],
  },
  {
    id: "medicine",
    label: "Medicine & Health",
    description: "Breakthroughs that changed human survival and suffering",
    accent: "#c28a7a",
    members: [
      { year: -400, wiki: "Hippocrates", altWikis: ["Hippocratic_Oath"], title: "Hippocratic medicine", desc: "Hippocrates founds a school of medicine that separates disease from superstition and establishes ethical principles doctors still cite today." },
      { year: 1025, wiki: "The_Canon_of_Medicine", altWikis: ["Avicenna"], title: "Avicenna's Canon of Medicine", desc: "Ibn Sina completes the Canon of Medicine — a medical encyclopedia that will be the standard reference across Europe and the Islamic world for 600 years." },
      { year: 1628, wiki: "De_Motu_Cordis", altWikis: ["William_Harvey"], title: "Harvey describes blood circulation", desc: "William Harvey publishes his discovery that blood circulates through the body in a closed loop — overturning 1,500 years of Galenic medicine." },
      { year: 1796, wiki: "Smallpox_vaccine", altWikis: ["Edward_Jenner"], title: "First vaccine", desc: "Edward Jenner demonstrates that cowpox exposure protects against smallpox — the first vaccine, foundational for all immunization since." },
      { year: 1867, wiki: "Antiseptic", altWikis: ["Joseph_Lister"], title: "Antiseptic surgery", desc: "Joseph Lister pioneers antiseptic surgical techniques using carbolic acid — slashing post-operative mortality and making modern surgery possible." },
      { year: 1895, wiki: "X-ray", altWikis: ["Wilhelm_R%C3%B6ntgen"], title: "X-rays discovered", desc: "Röntgen discovers X-rays, giving doctors their first non-invasive view inside the human body. He'll win the first Nobel Prize in Physics." },
      { year: 1921, wiki: "Insulin", altWikis: ["Frederick_Banting"], title: "Insulin discovered", desc: "Banting and Best isolate insulin and successfully treat diabetic patients — transforming what had been a death sentence into a manageable condition." },
      { year: 1954, wiki: "Polio_vaccine", altWikis: ["Jonas_Salk"], title: "Polio vaccine", desc: "Jonas Salk's polio vaccine is successfully tested — leading to near-eradication of a disease that paralyzed hundreds of thousands of children yearly." },
      { year: 1978, wiki: "In_vitro_fertilisation", altWikis: ["Louise_Brown"], title: "First IVF baby born", desc: "Louise Brown, the first baby born via in vitro fertilization, arrives in England — revolutionizing reproductive medicine." },
      { year: 2003, wiki: "Human_Genome_Project", altWikis: [], title: "Human Genome Project completed", desc: "Scientists publish the full human genome sequence after 13 years of work — laying the foundation for genomic medicine." },
    ],
  },
  {
    id: "architecture",
    label: "Architecture",
    description: "Buildings and structures that reshaped how we inhabit space",
    accent: "#c89a5c",
    members: [
      { year: -2560, wiki: "Great_Pyramid_of_Giza", altWikis: ["Giza_pyramid_complex"], title: "Great Pyramid of Giza", desc: "The Great Pyramid is completed for Pharaoh Khufu — the tallest human-made structure for nearly 4,000 years and the only surviving Wonder of the Ancient World." },
      { year: 70, wiki: "Colosseum", altWikis: [], title: "Roman Colosseum begun", desc: "Construction begins on the Flavian Amphitheatre (Colosseum) in Rome — a concrete-and-stone marvel that hosted 50,000 spectators for nearly 400 years." },
      { year: 537, wiki: "Hagia_Sophia", altWikis: [], title: "Hagia Sophia completed", desc: "Emperor Justinian's cathedral is completed in Constantinople. Its massive dome will be the world's largest for a thousand years." },
      { year: 1163, wiki: "Notre-Dame_de_Paris", altWikis: ["Gothic_architecture"], title: "Notre-Dame de Paris begun", desc: "Construction begins on Notre-Dame Cathedral — a defining work of Gothic architecture whose flying buttresses and pointed arches will inspire builders across Europe." },
      { year: 1506, wiki: "St._Peter%27s_Basilica", altWikis: [], title: "St. Peter's Basilica begun", desc: "Construction of St. Peter's Basilica in Rome begins. Over 120 years, architects including Bramante, Michelangelo, and Bernini will shape it." },
      { year: 1648, wiki: "Taj_Mahal", altWikis: [], title: "Taj Mahal completed", desc: "Emperor Shah Jahan completes the Taj Mahal in Agra — a white marble mausoleum for his wife Mumtaz Mahal, widely regarded as the pinnacle of Mughal architecture." },
      { year: 1889, wiki: "Eiffel_Tower", altWikis: [], title: "Eiffel Tower completed", desc: "Built for the Paris World's Fair as a temporary structure, the Eiffel Tower becomes the world's tallest building and demonstrates iron as a modern architectural material." },
      { year: 1931, wiki: "Empire_State_Building", altWikis: [], title: "Empire State Building opens", desc: "Built in just 410 days during the Great Depression, the Empire State Building becomes the world's tallest building for 40 years — a symbol of American ambition." },
      { year: 1973, wiki: "Sydney_Opera_House", altWikis: [], title: "Sydney Opera House opens", desc: "Jørn Utzon's iconic shell-like design, 14 years in construction, opens in Sydney Harbour — one of the 20th century's most recognizable buildings." },
      { year: 2010, wiki: "Burj_Khalifa", altWikis: [], title: "Burj Khalifa completed", desc: "The Burj Khalifa in Dubai opens as the world's tallest building at 828 meters — more than twice the height of the Empire State Building." },
    ],
  },
];

// Build index for categories (same pattern as THEME_INDEX)
const CATEGORY_INDEX = (() => {
  const idx = new Map();
  for (const category of CATEGORIES) {
    for (const member of category.members) {
      const keys = [member.wiki, ...(member.altWikis || [])];
      for (const key of keys) {
        if (!key) continue;
        if (!idx.has(key)) idx.set(key, []);
        idx.get(key).push({ category, member });
      }
    }
  }
  return idx;
})();

// Build a year → category-members index for pinning into top 5
const CATEGORY_MEMBERS_BY_YEAR = (() => {
  const idx = new Map();
  for (const category of CATEGORIES) {
    for (const member of category.members) {
      if (!idx.has(member.year)) idx.set(member.year, []);
      idx.get(member.year).push(member);
    }
  }
  return idx;
})();

// Build a year → category-id-set index (for quick lookup: "which categories does this year belong to?")
const CATEGORY_IDS_BY_YEAR = (() => {
  const idx = new Map();
  for (const category of CATEGORIES) {
    for (const member of category.members) {
      if (!idx.has(member.year)) idx.set(member.year, new Set());
      idx.get(member.year).add(category.id);
    }
  }
  return idx;
})();

// Build a reverse index: wiki_slug → [themes it belongs to]
// Indexes BOTH the primary wiki slug AND all alternate slugs.
const THEME_INDEX = (() => {
  const idx = new Map();
  for (const theme of THEMES) {
    for (const member of theme.members) {
      const keys = [member.wiki, ...(member.altWikis || [])];
      for (const key of keys) {
        if (!key) continue;
        if (!idx.has(key)) idx.set(key, []);
        idx.get(key).push({ theme, member });
      }
    }
  }
  return idx;
})();

// Build a "year → theme members" index for theme-boost during ranking
const THEME_MEMBERS_BY_YEAR = (() => {
  const idx = new Map();
  for (const theme of THEMES) {
    for (const member of theme.members) {
      if (!idx.has(member.year)) idx.set(member.year, []);
      idx.get(member.year).push(member);
    }
  }
  return idx;
})();

// Find themes that match an event. Returns an array of { theme, matchedMember, otherMembers }.
// An event matches a theme if its primary wiki slug, or any of its allLinks,
// appears in the theme's member list.
function findMatchingThemes(event) {
  const candidateSlugs = [event.wiki, ...(event.allLinks || [])].filter(Boolean);
  const matchedThemes = new Map();
  for (const slug of candidateSlugs) {
    const matches = THEME_INDEX.get(slug);
    if (!matches) continue;
    for (const { theme, member } of matches) {
      if (!matchedThemes.has(theme.id)) {
        matchedThemes.set(theme.id, {
          theme,
          matchedMember: member,
          otherMembers: theme.members.filter((m) => m.wiki !== member.wiki),
        });
      }
    }
  }
  return [...matchedThemes.values()];
}

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
// Returns { title, datePrefix, body } — title is a short headline from the
// primary linked article, body is the full event text capped at 3 sentences.
// ===================================================================
function humanizeSlug(slug) {
  if (!slug) return "";
  // Strip parenthetical disambiguations: "Apollo_11_(mission)" → "Apollo 11"
  let s = decodeURIComponent(slug).replace(/_/g, " ").replace(/\s*\([^)]+\)\s*/g, " ").trim();
  return s;
}

function parseWikiEvent(raw, primaryWiki, allLinks, sectionAnchor, boldText) {
  let text = raw.trim().replace(/\s+/g, " ").replace(/\[[^\]]*\]/g, "").trim();
  // Strip leading "c." or "circa" — these are approximation markers, not content
  text = text.replace(/^(c\.|ca\.|circa)\s+/i, "");
  const dateMatch = text.match(/^((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:\s*[-–—]\s*(?:January|February|March|April|May|June|July|August|September|October|November|December)?\s*\d{1,2})?)\s*[-–—:]\s*(.+)$/i);
  let datePrefix = null;
  let body = text;
  if (dateMatch) {
    datePrefix = dateMatch[1].trim();
    body = dateMatch[2].trim();
  }
  // Also strip leading "c." on body after date stripping
  body = body.replace(/^(c\.|ca\.|circa)\s+/i, "");
  // Cap body at 3 sentences for readability
  const sentenceMatches = body.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (sentenceMatches && sentenceMatches.length > 3) {
    body = sentenceMatches.slice(0, 3).join("").trim();
  }
  // Title: prefer bolded text from the entry (Wikipedia often bolds the main subject),
  // then the humanized primary article slug, then a trimmed first-sentence fallback.
  let title = "";
  if (boldText && boldText.length >= 3 && boldText.length < 90) {
    title = boldText.trim();
  } else if (primaryWiki && primaryWiki.length < 60) {
    title = humanizeSlug(primaryWiki);
  }
  if (!title || title.length < 3) {
    // Last resort: first few words of body
    const firstSentence = body.split(/[.!?]/)[0] || body;
    title = firstSentence.length > 80 ? firstSentence.slice(0, 80).trim() + "…" : firstSentence.trim();
  }
  return {
    title,
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
        // Include LI, DD (definition list items used on some older year pages),
        // and paragraph elements as potential event entries
        if (node.tagName === "LI" || node.tagName === "DD") {
          collected.push({ li: node, section: currentSection });
        }
      }

      const parsed = collected.map(({ li, section }) => {
        li.querySelectorAll(".mw-editsection, sup.reference, sup.noprint, .mw-ext-cite-error, style").forEach((el) => el.remove());
        const text = li.textContent.trim();
        if (!text || text.length < 15) return null;

        // Extract bolded text — Wikipedia uses <b> to highlight the main subject
        // of an event entry. This gives us a clean, short title.
        const boldEl = li.querySelector("b");
        const boldText = boldEl ? boldEl.textContent.trim() : null;
        const hasBold = !!boldText;

        // Collect all wiki links; filter out generic ones for anchor selection
        const allLinkSlugs = Array.from(li.querySelectorAll("a[href^='/wiki/']"))
          .map((a) => a.getAttribute("href"))
          .filter((h) => h && !h.includes(":"))
          .map((h) => decodeURIComponent(h.replace("/wiki/", "").split("#")[0]));

        const nonGenericLinks = allLinkSlugs.filter((s) => !isGenericSlug(s));
        // Primary anchor: prefer a link inside the bold element, else first non-generic, else year page
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

        const parsed = parseWikiEvent(text, primaryWiki, allLinkSlugs, section, boldText);
        return { ...parsed, hasBold };
      }).filter(Boolean);

      const seen = new Set();
      const unique = parsed.filter((e) => {
        // Dedup by body text — the previous version used e.title which no longer exists
        if (seen.has(e.body)) return false;
        seen.add(e.body);
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
// PRELOADED EVENTS from events.json (generated by GitHub Action)
// ===================================================================
let preloadedEvents = null;
let preloadPromise = null;

function loadPreloadedEvents() {
  if (preloadedEvents !== null) return Promise.resolve(preloadedEvents);
  if (preloadPromise) return preloadPromise;
  // Use BASE_URL from Vite so this works in dev and on GitHub Pages
  const base = import.meta.env?.BASE_URL || "/";
  const url = `${base}events.json`.replace(/\/+/g, "/");
  preloadPromise = fetch(url)
    .then((res) => res.ok ? res.json() : {})
    .then((data) => { preloadedEvents = data; return data; })
    .catch(() => { preloadedEvents = {}; return {}; });
  return preloadPromise;
}

// ===================================================================
// RANK EVENTS BY CUMULATIVE PAGEVIEWS
// ===================================================================
async function fetchRankedEvents(year) {
  // 1. Try preloaded JSON first (fastest path)
  const preloaded = await loadPreloadedEvents();
  const key = String(year);
  if (preloaded[key] && preloaded[key].length > 0) {
    return { events: preloaded[key], cached: true, source: "preloaded" };
  }

  // 2. Try runtime cache (localStorage)
  const cacheKey = `year:${year}`;
  const cached = cacheGet(cacheKey);
  if (cached) return { events: cached, cached: true, source: "cache" };

  // 3. Live fetch from Wikipedia (fallback for uncomputed years)
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

  // Score each event: SUM of pageviews for all non-generic links in that event.
  // Bolded events (Wikipedia's editors consider them most significant) get a 1.5x boost.
  const scored = candidates.map((c) => {
    let score = (c.allLinks || [])
      .filter((link) => !isGenericSlug(link))
      .reduce((sum, link) => sum + (pageviews[link] || 0), 0);
    if (c.hasBold) score = Math.round(score * 1.5);
    return { ...c, _score: score };
  });

  scored.sort((a, b) => b._score - a._score);
  const top = scored.slice(0, 5).map(({ _score, allLinks, hasBold, ...rest }) => rest);

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
  const [activeCat, setActiveCat] = useState("all"); // "all" | category.id
  // Previews: year -> { loading, preview: string|null }
  const [previews, setPreviews] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stack = useMemo(() => buildStack(anchor), [anchor]);

  // When a category is active, show only years that have an event in that category.
  // Otherwise show the full SIGNIFICANT_YEARS list.
  const filteredYears = useMemo(() => {
    if (activeCat === "all") return SIGNIFICANT_YEARS;
    const cat = CATEGORIES.find((c) => c.id === activeCat);
    if (!cat) return SIGNIFICANT_YEARS;
    // Return the category's member years, sorted newest first
    return [...cat.members].sort((a, b) => b.year - a.year).map((m) => m.year);
  }, [activeCat]);

  // Reset pagination when category changes
  useEffect(() => { setSigPage(0); }, [activeCat]);

  const totalSigPages = Math.max(1, Math.ceil(filteredYears.length / SIGNIFICANT_PAGE_SIZE));
  const pageYears = filteredYears.slice(sigPage * SIGNIFICANT_PAGE_SIZE, (sigPage + 1) * SIGNIFICANT_PAGE_SIZE);

  // Progressively load previews for the current page of years
  useEffect(() => {
    let cancelled = false;
    const loadPreviews = async () => {
      for (const year of pageYears) {
        if (cancelled) break;
        // Skip if already have a settled result (not loading)
        if (previews[year] && !previews[year].loading) continue;
        setPreviews((p) => ({ ...p, [year]: { loading: true, preview: null, error: null } }));
        try {
          const result = await fetchRankedEvents(year);
          if (cancelled) break;
          if (result?.error) {
            setPreviews((p) => ({ ...p, [year]: { loading: false, preview: null, error: result.error } }));
            continue;
          }
          const topEvent = result?.events?.[0];
          // Prefer the title (short headline) for the preview
          const previewText = topEvent?.title || (topEvent?.body
            ? (topEvent.body.length > 80 ? topEvent.body.slice(0, 80).replace(/\s+\S*$/, "") + "…" : topEvent.body)
            : null);
          setPreviews((p) => ({ ...p, [year]: { loading: false, preview: previewText, error: null } }));
        } catch (err) {
          setPreviews((p) => ({ ...p, [year]: { loading: false, preview: null, error: err.message || "fetch failed" } }));
        }
      }
    };
    loadPreviews();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sigPage]);

  // Keep re-scrolling to the target year for 2 seconds as other blocks
  // finish loading and shift the layout. Uses "auto" instead of "smooth"
  // because smooth scrolling fights itself when called repeatedly.
  const scrollToYear = (y) => {
    const targetId = `year-${y}`;
    const start = Date.now();
    const tick = () => {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
      if (Date.now() - start < 2000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const submit = (e) => {
    e?.preventDefault();
    const n = parseYearInput(input);
    if (n !== null && n >= -3000 && n <= 2100 && n !== 0) {
      setAnchor(n);
      setExpanded(null);
      setShowDeepTime(false);
      setTimeout(() => scrollToYear(n), 50);
    }
  };

  const jumpTo = (y) => {
    setInput(formatYear(y));
    setAnchor(y);
    setExpanded(null);
    setShowDeepTime(false);
    setTimeout(() => scrollToYear(y), 50);
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
              Significant Events
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
              disabled={sigPage >= totalSigPages - 1}
              className="p-1 transition-opacity disabled:opacity-30"
              style={{ color: "#d4a856" }}
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Category filter chips */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setActiveCat("all")}
            className="text-[10px] uppercase tracking-widest px-2.5 py-1 transition-all shrink-0"
            style={{
              background: activeCat === "all" ? "#d4a856" : "transparent",
              color: activeCat === "all" ? "#1a1612" : "#d4a856",
              border: "1px solid #d4a85680",
              fontFamily: "'JetBrains Mono', monospace",
              borderRadius: "2px",
              fontWeight: activeCat === "all" ? 700 : 400,
            }}
          >
            All
          </button>
          {CATEGORIES.map((cat) => {
            const isActive = activeCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className="text-[10px] uppercase tracking-widest px-2.5 py-1 transition-all shrink-0"
                style={{
                  background: isActive ? cat.accent : "transparent",
                  color: isActive ? "#1a1612" : cat.accent,
                  border: `1px solid ${cat.accent}80`,
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
          {pageYears.map((year) => {
            const active = anchor === year;
            // Compute century label as fallback
            const centuryLabel = year > 0
              ? `${Math.floor((year - 1) / 100) + 1}${ordinalSuffix(Math.floor((year - 1) / 100) + 1)} century`
              : `${Math.floor((Math.abs(year) - 1) / 100) + 1}${ordinalSuffix(Math.floor((Math.abs(year) - 1) / 100) + 1)} century BCE`;
            const preview = previews[year];
            // When a category is active, look up the category member for this year
            // and show its title directly (no async loading needed).
            const activeCatMember = activeCat !== "all"
              ? CATEGORIES.find((c) => c.id === activeCat)?.members.find((m) => m.year === year)
              : null;
            const activeCatData = activeCat !== "all" ? CATEGORIES.find((c) => c.id === activeCat) : null;
            // In "All" mode, prefer showing a curated theme or category event for this
            // year if one exists. This ensures the list reflects our curated list
            // rather than showing random pageview-ranked events. Falls back to the
            // pageview preview only when no curated event exists for the year.
            const curatedForAll = activeCat === "all"
              ? (() => {
                  const catMember = CATEGORIES.flatMap((c) => c.members.map((m) => ({ ...m, catLabel: c.label, catAccent: c.accent }))).find((m) => m.year === year);
                  if (catMember) return { title: catMember.title, label: catMember.catLabel, accent: catMember.catAccent };
                  const themeMember = THEMES.flatMap((t) => t.members.map((m) => ({ ...m, themeLabel: t.label }))).find((m) => m.year === year);
                  if (themeMember) return { title: themeMember.title, label: themeMember.themeLabel, accent: "#d4a856" };
                  return null;
                })()
              : null;
            return (
              <button
                key={year}
                onClick={() => jumpTo(year)}
                className="text-left flex items-start gap-3 py-2 px-2.5 transition-all hover:brightness-125"
                style={{
                  background: active ? "#d4a85620" : "transparent",
                  border: `1px solid ${active ? "#d4a856" : "#3d3528"}`,
                  borderRadius: "2px",
                }}
              >
                <span className="text-sm font-bold shrink-0 w-20 pt-0.5" style={{ color: active ? "#d4a856" : "#f5ead0", fontFamily: "'Fraunces', serif" }}>
                  {formatYear(year)}
                </span>
                <span className="text-xs leading-snug flex-1 min-w-0" style={{ color: "#9a8b6f", fontFamily: "'JetBrains Mono', monospace" }}>
                  {activeCatMember ? (
                    <>
                      <span style={{ color: "#f5ead0", fontWeight: 600 }}>{activeCatMember.title}</span>
                      <span className="block mt-0.5 text-[10px]" style={{ color: activeCatData?.accent || "#6c5a3a" }}>{activeCatData?.label}</span>
                    </>
                  ) : curatedForAll ? (
                    <>
                      <span style={{ color: "#f5ead0", fontWeight: 600 }}>{curatedForAll.title}</span>
                      <span className="block mt-0.5 text-[10px]" style={{ color: curatedForAll.accent }}>{curatedForAll.label}</span>
                    </>
                  ) : preview?.loading ? (
                    <span style={{ opacity: 0.6 }}>Loading…</span>
                  ) : preview?.preview ? (
                    <>
                      <span style={{ color: "#d4c7a8" }}>{preview.preview}</span>
                      <span className="block mt-0.5 text-[10px]" style={{ color: "#6c5a3a" }}>{centuryLabel}</span>
                    </>
                  ) : preview?.error ? (
                    <>
                      <span style={{ color: "#c28a7a", opacity: 0.7 }}>⚠ preview unavailable</span>
                      <span className="block mt-0.5 text-[10px]" style={{ color: "#6c5a3a" }}>{centuryLabel}</span>
                    </>
                  ) : (
                    centuryLabel
                  )}
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
                onJumpTo={jumpTo}
              />
            );
          })}

          {/* Century-spanning events — static, always visible before deep time */}
          <CenturySpanningSection />

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

// Given the ranked events list for a year, ensure that any curated
// theme member for this year is present. If the theme event isn't
// already in the list, inject it at position 0 (top), dropping the
// last-ranked pageview event to keep the list at 5.
//
// This guarantees that curated "history repeats" moments surface in
// each year's top 5 even when pageview ranking would bury them.
// Merge curated events (from themes AND categories) into the ranked events list.
// Any theme/category member for this year gets pinned at the top if not already
// represented. Category events carry their category info for UI display.
// Also cleans up bad data in existing events.json (duplicates, combined entries).
function mergeThemeEvents(events, year) {
  // Step 1: Clean up the incoming events
  // - Dedup by title (case-insensitive) — catches old events.json with duplicates
  // - Dedup by body substring — catches events where one body is contained in another
  //   (symptom of combined/split Wikipedia entries)
  let cleanedEvents = [];
  const seenTitles = new Set();
  const seenBodyStarts = new Set();
  for (const e of events || []) {
    if (!e) continue;
    const titleKey = (e.title || "").toLowerCase().trim();
    // Dedup by title
    if (titleKey && seenTitles.has(titleKey)) continue;
    // Dedup by first 50 chars of body (catches split/combined variations)
    const bodyStart = (e.body || "").slice(0, 50).toLowerCase().trim();
    if (bodyStart && seenBodyStarts.has(bodyStart)) continue;
    if (titleKey) seenTitles.add(titleKey);
    if (bodyStart) seenBodyStarts.add(bodyStart);
    cleanedEvents.push(e);
  }

  const themeMembers = THEME_MEMBERS_BY_YEAR.get(year) || [];
  const categoryMembers = CATEGORY_MEMBERS_BY_YEAR.get(year) || [];
  if (themeMembers.length === 0 && categoryMembers.length === 0) return cleanedEvents;

  const eventsCopy = [...cleanedEvents];
  const presentSlugs = new Set(
    eventsCopy.flatMap((e) => [e.wiki, ...(e.allLinks || [])].filter(Boolean))
  );

  // Helper to inject a synthetic event at the top, dropping the last one to stay at 5
  const inject = (synthetic) => {
    eventsCopy.unshift(synthetic);
    if (eventsCopy.length > 5) eventsCopy.pop();
    // Track that this slug is now present so we don't double-inject
    for (const s of synthetic.allLinks || []) presentSlugs.add(s);
    // Also track title for future dedup passes
    if (synthetic.title) seenTitles.add(synthetic.title.toLowerCase().trim());
  };

  for (const member of themeMembers) {
    const memberSlugs = [member.wiki, ...(member.altWikis || [])];
    const alreadyPresent = memberSlugs.some((s) => presentSlugs.has(s));
    if (alreadyPresent) continue;
    const theme = THEMES.find((t) => t.members.includes(member));
    inject({
      title: member.title,
      body: member.desc || `Part of the ${theme?.label || "recurring"} theme — see related events across history below.`,
      wiki: member.wiki,
      allLinks: memberSlugs,
      datePrefix: null,
      sectionAnchor: null,
      _themeInjected: true,
      _themeLabel: theme?.label,
    });
  }

  for (const member of categoryMembers) {
    const memberSlugs = [member.wiki, ...(member.altWikis || [])];
    const alreadyPresent = memberSlugs.some((s) => presentSlugs.has(s));
    if (alreadyPresent) continue;
    const category = CATEGORIES.find((c) => c.members.includes(member));
    inject({
      title: member.title,
      body: member.desc || `Significant event in ${category?.label || "this field"}.`,
      wiki: member.wiki,
      allLinks: memberSlugs,
      datePrefix: null,
      sectionAnchor: null,
      _categoryInjected: true,
      _categoryLabel: category?.label,
      _categoryAccent: category?.accent,
    });
  }

  return eventsCopy;
}

function YearBlock({ year, accent, isAnchor, offset, isFuture, expanded, setExpanded, onJumpTo }) {
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
        setWikiEvents(mergeThemeEvents(result.events, year));
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
    // If the primary wiki link isn't generic, go there directly.
    // Re-encode since slugs are stored decoded.
    if (event.wiki && !isGenericSlug(event.wiki)) {
      return `https://en.wikipedia.org/wiki/${encodeURIComponent(event.wiki).replace(/%2F/g, "/")}`;
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
              const key = `${year}-${i}`;
              const isOpen = expanded === key;
              const linkUrl = eventUrl(event);
              return (
                <li key={i} style={{ borderBottom: "1px solid #3d3528" }}>
                  <button onClick={() => setExpanded(isOpen ? null : key)} className="text-left w-full py-4 group">
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
                        {event._themeInjected && (
                          <div className="text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>
                            <Sparkles size={10} /> Pinned · recurring pattern
                          </div>
                        )}
                        {event._categoryInjected && (
                          <div className="text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: event._categoryAccent || accent }}>
                            <Sparkles size={10} /> Significant in {event._categoryLabel}
                          </div>
                        )}
                        <h3 className="text-base md:text-lg font-semibold leading-snug" style={{ color: "#f5ead0" }}>
                          {event.title || event.body?.slice(0, 80) || "Untitled event"}
                        </h3>
                        {isOpen && (
                          <div className="mt-2.5 leading-relaxed text-[15px]" style={{ color: "#d4c7a8" }}>
                            {event.body}
                            <div className="mt-3">
                              <a href={linkUrl} target="_blank" rel="noopener noreferrer"
                                 onClick={(e) => e.stopPropagation()}
                                 className="inline-flex items-center gap-1 text-xs uppercase tracking-widest hover:underline"
                                 style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>
                                Read on Wikipedia <ExternalLink size={12} />
                              </a>
                            </div>
                            <ThemesSeeAlso event={event} accent={accent} onJumpTo={onJumpTo} />
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
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

function ThemesSeeAlso({ event, accent, onJumpTo }) {
  const matches = findMatchingThemes(event);
  if (!matches || matches.length === 0) return null;

  return (
    <div className="mt-4 pt-3" style={{ borderTop: `1px dashed ${accent}60` }}>
      {matches.map(({ theme, matchedMember, otherMembers }) => (
        <div key={theme.id} className="mb-3 last:mb-0">
          <div className="text-[10px] uppercase tracking-widest mb-1.5 flex items-center gap-1.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>
            <CornerDownRight size={11} />
            <span>See also through history · {theme.label}</span>
          </div>
          <div className="text-[12px] italic mb-2" style={{ color: "#9a8b6f" }}>
            {theme.description}
          </div>
          <ul className="space-y-1">
            {otherMembers.map((m) => (
              <li key={m.wiki}>
                <button
                  onClick={(e) => { e.stopPropagation(); onJumpTo?.(m.year); }}
                  className="text-left flex items-start gap-2 py-0.5 hover:underline decoration-dotted"
                  style={{ color: "#d4c7a8" }}
                >
                  <span className="text-xs font-bold shrink-0 mt-0.5" style={{ color: accent, fontFamily: "'Fraunces', serif", minWidth: "3.5rem" }}>
                    {formatYear(m.year)}
                  </span>
                  <span className="text-[13px] leading-snug">{m.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}


// ===================================================================
// CENTURY-SPANNING EVENTS — static section before deep time.
// These are developments too gradual for a single year but too
// significant to omit. Always visible; not collapsed.
// ===================================================================
const CENTURY_SPANNING = [
  { title: "Iron Age & Phoenician Alphabet", period: "c. 1200–700 BCE", detail: "Iron-smelting technology spreads across Eurasia and Africa, replacing Bronze Age tools and weapons. Simultaneously, the 22-letter Phoenician alphabet emerges in the Levant — ancestor of Greek, Latin, Arabic, and Hebrew writing.", wiki: "Iron_Age" },
  { title: "The Axial Age", period: "c. 800–200 BCE", detail: "Within a few centuries, humanity's greatest philosophical and religious traditions emerge independently across the world: Buddha in India, Confucius in China, Zoroaster in Persia, the Hebrew prophets in Judea, and Socrates, Plato, and Aristotle in Greece.", wiki: "Axial_Age" },
  { title: "Pax Romana", period: "27 BCE – 180 CE", detail: "The Roman Empire's 200-year period of relative peace and stability under Augustus and his successors. At its height, Rome rules over 70 million people — roughly 20% of the world's population — connected by 400,000 km of roads.", wiki: "Pax_Romana" },
  { title: "Spread of Christianity", period: "c. 30–380 CE", detail: "From a small Jewish sect in Roman Judea, Christianity spreads across the Roman Empire within 350 years, becoming the state religion under Theodosius I in 380 CE. The religion would go on to shape the history of Europe, Africa, and the Americas.", wiki: "History_of_Christianity" },
  { title: "The Silk Road", period: "c. 130 BCE – 1450 CE", detail: "A network of trade routes connecting China, Central Asia, India, the Middle East, and Europe. At its height under the Tang dynasty and Mongol Empire, it carries not just silk and spices but ideas, religions, technologies, and diseases — including the Black Death.", wiki: "Silk_Road" },
  { title: "The Black Death", period: "1347–1353", detail: "Bubonic plague originating in Central Asia sweeps across Eurasia, killing an estimated 30–60% of Europe's population — up to 50 million people. The pandemic reshapes European society, accelerates the decline of feudalism, and contributes to labor reforms and the Renaissance.", wiki: "Black_Death" },
  { title: "The Renaissance", period: "c. 1300–1600", detail: "A cultural and intellectual rebirth beginning in the Italian city-states, drawing on rediscovered classical texts. It produces Leonardo da Vinci, Michelangelo, Botticelli, Machiavelli, and Erasmus — and a new emphasis on humanism, observation, and individual expression.", wiki: "Renaissance" },
  { title: "Age of Exploration", period: "c. 1415–1600", detail: "European maritime nations — led by Portugal and Spain — map the world's oceans, connecting the Americas, Africa, and Asia to Europe for the first time. The resulting Columbian Exchange of crops, animals, people, and diseases permanently transforms every continent.", wiki: "Age_of_Discovery" },
  { title: "The Transatlantic Slave Trade", period: "c. 1500–1807", detail: "Approximately 12.5 million Africans are forcibly transported to the Americas over three centuries — the largest forced migration in history. The trade's legacy shapes the demographics, economies, and politics of Africa, the Americas, and Europe to this day.", wiki: "Atlantic_slave_trade" },
  { title: "The Scientific Revolution", period: "c. 1543–1687", detail: "From Copernicus placing the Sun at the centre of the solar system to Newton's laws of motion and gravity, a century and a half of observation and mathematics transforms humanity's understanding of the natural world and establishes the foundations of modern science.", wiki: "Scientific_Revolution" },
  { title: "The Industrial Revolution", period: "c. 1760–1840", detail: "Beginning in Britain, the mechanization of production using coal-powered steam engines transforms agriculture, manufacturing, and transport. Cities explode in size; living standards rise but inequality deepens. The revolution spreads globally and defines the modern world.", wiki: "Industrial_Revolution" },
  { title: "The Digital Revolution", period: "c. 1970–present", detail: "The shift from mechanical and analogue electronics to digital technology — personal computers, the internet, mobile phones, and artificial intelligence — transforms communication, commerce, warfare, and culture at a pace faster than any previous technological revolution.", wiki: "Digital_revolution" },
];

function CenturySpanningSection() {
  const accent = "#c8a060";
  return (
    <section>
      <div className="mb-4 pb-3" style={{ borderBottom: `2px solid ${accent}` }}>
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <h2 className="text-3xl md:text-5xl font-bold leading-none tracking-tight" style={{ color: accent, fontStyle: "italic" }}>
            Century-Spanning Events
          </h2>
          <div className="text-right">
            <div className="text-xs mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>
              across recorded history
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs italic" style={{ color: "#7a6a4a", fontFamily: "'JetBrains Mono', monospace" }}>
          Developments too gradual for a single year · precursor to deep time
        </p>
      </div>
      <ol className="space-y-0">
        {CENTURY_SPANNING.map((event, i) => (
          <li key={i} style={{ borderBottom: "1px solid #3d3528" }} className="py-4">
            <div className="flex items-start gap-3">
              <span className="text-xs mt-1.5 shrink-0 w-6" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9a8b6f" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-widest mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>
                  {event.period}
                </div>
                <h3 className="text-base md:text-lg font-semibold mb-1" style={{ color: "#f5ead0" }}>{event.title}</h3>
                <p className="leading-relaxed text-[15px]" style={{ color: "#d4c7a8" }}>{event.detail}</p>
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
        ))}
      </ol>
    </section>
  );
}

function EdgeOfHistoryGateway({ open, onToggle }) {
  return (
    <div className="py-6">
      <div className="text-center mb-4">
        <p className="text-sm italic" style={{ color: "#9a8b6f" }}>Here written records grow thin.</p>
        <p className="text-xs mt-1" style={{ color: "#5c4a30", fontFamily: "'JetBrains Mono', monospace" }}>
          Beyond c. 3000 BCE lies archaeology, then geology, then the cosmos itself.
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

      {/* Scroll buttons — stacked right: ↑ top, ↓ bottom */}
      {showBackToTop && (
        <div className="fixed bottom-6 right-6 flex flex-col gap-2" style={{ zIndex: 50 }}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            title="Back to top"
            className="flex items-center gap-1.5 px-3 py-2 transition-all hover:brightness-125 active:scale-95"
            style={{
              background: "linear-gradient(180deg, #d4a856 0%, #b88a3d 100%)",
              color: "#1a1612",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: "2px",
              boxShadow: "0 2px 0 #8a6428, 0 4px 16px #00000080",
            }}
          >
            <ArrowUp size={12} /> Top
          </button>
          <button
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
            aria-label="Go to bottom"
            title="Go to bottom"
            className="flex items-center gap-1.5 px-3 py-2 transition-all hover:brightness-125 active:scale-95"
            style={{
              background: "linear-gradient(180deg, #3a2e1e 0%, #2a2016 100%)",
              color: "#d4a856",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: "2px",
              border: "1px solid #5c4a30",
              boxShadow: "0 2px 0 #1a1208, 0 4px 16px #00000080",
            }}
          >
            <ArrowDown size={12} /> Bottom
          </button>
        </div>
      )}
    </div>
  );
}
