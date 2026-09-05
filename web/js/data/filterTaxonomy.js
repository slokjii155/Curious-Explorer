// ============================================================
// 3D MODELS — FILTER TAXONOMY
// ============================================================
//
// This is filter metadata, not model data — same "subjects are
// metadata and filters, not models" rule from models3d.js. It
// defines what appears in the Subject / Class / Topic dropdowns,
// independent of which models currently exist. A subject can (and
// most do, for now) have zero models and still be a valid filter
// choice — the grid just shows an empty state for it.
//
// models3d.js and this file never duplicate each other's data:
// this file only ever holds filter option lists; the actual
// per-model subject/topic/classes values still live solely on
// each model record in models3d.js.
// ============================================================

// ---------------------------------------------------------------
// SUBJECTS
// ---------------------------------------------------------------
export const SUBJECTS = [
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "Geography",
    "Astronomy & Space Science",
    "Computer Science",
    "General Science",
    "Psychology",
    "Environmental Science",
    "Engineering",
    "Economics",
    "Earth Science",
    "Medicine & Health Science",
    "Architecture",
    "Electronics",
    "Materials Science",
    "Other / Interdisciplinary"
];

// ---------------------------------------------------------------
// CLASS
// ---------------------------------------------------------------
// `value` is what filtering logic matches against: a number for the
// numbered classes, or a short string token for the non-numeric
// cohorts. "all" is the sentinel meaning "don't filter by class".
export const CLASS_OPTIONS = [
    { value: "all", label: "All" },
    { value: 1, label: "Class 1" },
    { value: 2, label: "Class 2" },
    { value: 3, label: "Class 3" },
    { value: 4, label: "Class 4" },
    { value: 5, label: "Class 5" },
    { value: 6, label: "Class 6" },
    { value: 7, label: "Class 7" },
    { value: 8, label: "Class 8" },
    { value: 9, label: "Class 9" },
    { value: 10, label: "Class 10" },
    { value: 11, label: "Class 11" },
    { value: 12, label: "Class 12" },
    { value: "dropper", label: "Dropper" },
    { value: "competitive", label: "Competitive Exams" },
    { value: "ug", label: "Undergraduate / Advanced" }
];

// ---------------------------------------------------------------
// TOPIC
// ---------------------------------------------------------------
// Topic choices depend on Subject (+ Class where a subject's
// curriculum meaningfully changes by class band). A subject entry
// is either:
//   - a flat array of topics (same list regardless of class), or
//   - an object keyed by class band ("junior" = classes 1–10,
//     "senior" = classes 11–12) for subjects where the syllabus
//     genuinely differs, e.g. school Chemistry vs. Class 11–12
//     Chemistry.
//
// Subjects not listed here have no curated topic list yet — the
// Topic filter simply offers "All Topics" for them instead of
// dumping every topic from every subject into one list.
const SUBJECT_TOPICS = {
    "Chemistry": {
        junior: [
            "Matter in Our Surroundings",
            "Atoms and Molecules",
            "Structure of the Atom",
            "Chemical Reactions and Equations",
            "Acids, Bases and Salts",
            "Metals and Non-metals",
            "Carbon and its Compounds",
            "Periodic Classification of Elements"
        ],
        senior: [
            "Atomic Structure",
            "Chemical Bonding",
            "Thermodynamics",
            "Equilibrium",
            "Organic Chemistry",
            "Electrochemistry",
            "Solid State"
        ]
    },
    "Physics": {
        junior: [
            "Motion",
            "Force and Laws of Motion",
            "Gravitation",
            "Work and Energy",
            "Sound",
            "Light — Reflection & Refraction",
            "Electricity",
            "Magnetic Effects of Current"
        ],
        senior: [
            "Mechanics",
            "Electrostatics",
            "Current Electricity",
            "Magnetism",
            "EMI",
            "Optics",
            "Modern Physics"
        ]
    },
    "Biology": {
        junior: [
            "Cell — Structure and Function",
            "Tissues",
            "Diversity in Living Organisms",
            "Life Processes",
            "Control and Coordination",
            "Heredity"
        ],
        senior: [
            "Cell Biology",
            "Molecular Biology",
            "Genetics",
            "Human Anatomy",
            "Physiology",
            "Ecology",
            "Evolution"
        ]
    },
    "Mathematics": [
        "Algebra",
        "Geometry",
        "Trigonometry",
        "Calculus",
        "Coordinate Geometry",
        "Probability & Statistics",
        "Vectors & 3D Geometry"
    ],
    "Geography": [
        "Physical Geography",
        "Climatology",
        "Geomorphology",
        "Human Geography",
        "Map Reading & GIS"
    ],
    "Astronomy & Space Science": [
        "Solar System",
        "Stellar Evolution",
        "Galaxies & Cosmology",
        "Orbital Mechanics",
        "Space Exploration"
    ],
    "Computer Science": [
        "Data Structures",
        "Algorithms",
        "Computer Networks",
        "Databases",
        "Operating Systems"
    ],
    "General Science": [
        "Scientific Method",
        "Matter & Materials",
        "Energy & Forces",
        "Living World",
        "Earth & Space"
    ],
    "Psychology": [
        "Cognitive Psychology",
        "Developmental Psychology",
        "Neuroscience & Behaviour",
        "Social Psychology",
        "Psychological Disorders"
    ],
    "Environmental Science": [
        "Ecosystems",
        "Biodiversity & Conservation",
        "Pollution & Waste",
        "Climate Change",
        "Natural Resources"
    ],
    "Engineering": [
        "Mechanics of Materials",
        "Thermodynamics & Heat Transfer",
        "Structures",
        "Circuits & Systems",
        "Fluid Mechanics"
    ],
    "Economics": [
        "Microeconomics",
        "Macroeconomics",
        "Money & Banking",
        "International Trade",
        "Development Economics"
    ],
    "Earth Science": [
        "Plate Tectonics",
        "Rocks & Minerals",
        "Weather & Climate",
        "Oceanography",
        "Natural Hazards"
    ],
    "Medicine & Health Science": [
        "Human Anatomy",
        "Physiology",
        "Pathology",
        "Pharmacology",
        "Public Health"
    ],
    "Architecture": [
        "Structural Systems",
        "Building Materials",
        "Architectural History",
        "Urban Design",
        "Sustainable Design"
    ],
    "Electronics": [
        "Analog Circuits",
        "Digital Logic",
        "Semiconductors",
        "Microcontrollers",
        "Signal Processing"
    ],
    "Materials Science": [
        "Crystal Structures",
        "Polymers",
        "Metals & Alloys",
        "Composites",
        "Nanomaterials"
    ],
    "Other / Interdisciplinary": [
        "Cross-Subject Projects",
        "Emerging Topics"
    ]
};

/**
 * Topic options for the given subject + class selection.
 * @param {string} subject      exact SUBJECTS entry, or "all"/falsy for no subject selected
 * @param {number|string} [classValue] a CLASS_OPTIONS value, or "all"/undefined
 * @returns {string[]} topics — empty array means "no curated list yet",
 *          so the caller should fall back to offering only "All Topics"
 */
export function getTopicOptions(subject, classValue) {
    if (!subject || subject === "all") return [];

    const entry = SUBJECT_TOPICS[subject];
    if (!entry) return [];

    if (Array.isArray(entry)) return entry.slice();

    // Bucketed by class band. Classes 1–10 => junior, 11–12 => senior.
    // Any other selection (All, Dropper, Competitive Exams,
    // Undergraduate/Advanced, or no class chosen) falls back to the
    // full combined list so the filter still offers something useful.
    if (typeof classValue === "number") {
        if (classValue >= 1 && classValue <= 10) return entry.junior.slice();
        if (classValue >= 11 && classValue <= 12) return entry.senior.slice();
    }

    const combined = entry.junior.concat(entry.senior);
    return combined.filter((topic, i) => combined.indexOf(topic) === i);
}
