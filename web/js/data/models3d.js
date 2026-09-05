// ============================================================
// 3D MODELS — DATA ARCHITECTURE
// ============================================================
//
// CORE RULE: Subjects are NOT models. Subjects are metadata used
// to tag and filter models. Every entry in MODELS below is one
// individual visualization (e.g. "Atomic Structure", "DNA Double
// Helix") — never a subject itself (e.g. "Chemistry", "Biology").
//
// This file is the single source of truth for the 3D Models
// library. Pages render cards by calling the query functions
// below — they never hold their own copies of model data. Adding
// a new model means adding one object to MODELS; it should never
// require touching a page's markup or a rendering component.
//
// Everything here is plain data + pure functions, so it works
// the same whether it's imported by a Vite-bundled page
// (chemistry.html, a future physics/biology page, a future
// dedicated "/models" library page) or used from a test file.
// ============================================================

// ---------------------------------------------------------------
// STATUS VALUES
// ---------------------------------------------------------------
// Central enum so new states (e.g. "beta", "maintenance",
// "retired") can be added in one place later without hunting down
// every string literal that compares against a status.
export const MODEL_STATUS = Object.freeze({
    AVAILABLE: "available",
    COMING_SOON: "coming-soon"
});

// Order used when sorting/grouping by status (available first).
const STATUS_ORDER = Object.freeze({
    [MODEL_STATUS.AVAILABLE]: 0,
    [MODEL_STATUS.COMING_SOON]: 1
});

// ---------------------------------------------------------------
// MODEL RECORDS
// ---------------------------------------------------------------
// Each record is ONE model (one visualization), never a subject.
// Shape:
//   id                   unique slug, used for lookup + routing
//   name                 display name of the visualization
//   subject              metadata/filter only — "Chemistry", "Physics", "Biology"
//   topic                metadata/filter only — narrower than subject
//   classes              array of class levels this model is relevant for
//   description          short student-facing description
//   tags                 lowercase keyword list, used for search/filter
//   status               one of MODEL_STATUS
//   route                where the model lives once available
//   preview               optional preview asset path (thumbnail/gif) — null until produced
//   frequency            0-100, how often this topic appears in VCE exams
//   popularity           0-100, student engagement signal
//   views                lifetime view count (0 for unreleased models)
//   explorations         count of completed interactive sessions
//   priority             0-100, drives default library ordering
//   educationalImportance 0-100, curriculum-weight signal (independent of exam frequency)
//   difficulty           "beginner" | "intermediate" | "advanced"
//
// Only the models listed in the patch requirements are seeded
// here. This is intentionally NOT the full subject library.
const MODELS = [
    {
        id: "atomic-structure",
        name: "Atomic Structure",
        subject: "Chemistry",
        topic: "Atomic Structure",
        classes: [9, 10, 11, 12],
        description: "Explore the Bohr and Quantum Orbital models of the atom across the full periodic table in an interactive 3D universe.",
        tags: ["atom", "electron", "shell", "nucleus", "bohr", "quantum", "orbital"],
        status: MODEL_STATUS.AVAILABLE,
        route: "./explorer.html",
        preview: null,
        frequency: 100,
        popularity: 95,
        views: 0,
        explorations: 0,
        priority: 100,
        educationalImportance: 100,
        difficulty: "beginner"
    },
    {
        id: "electric-field",
        name: "Electric Field",
        subject: "Physics",
        topic: "Electrostatics",
        classes: [11, 12],
        description: "Visualize field lines and field strength around point charges, dipoles and charged plates in 3D space.",
        tags: ["electricity", "field lines", "charge", "electrostatics", "coulomb"],
        status: MODEL_STATUS.COMING_SOON,
        route: "/models/electric-field",
        preview: null,
        frequency: 98,
        popularity: 88,
        views: 0,
        explorations: 0,
        priority: 90,
        educationalImportance: 92,
        difficulty: "intermediate"
    },
    {
        id: "dna-double-helix",
        name: "DNA Double Helix",
        subject: "Biology",
        topic: "Molecular Biology",
        classes: [11, 12],
        description: "Rotate and zoom into the double helix to see base pairing, the sugar-phosphate backbone, and strand directionality.",
        tags: ["dna", "genetics", "double helix", "base pairs", "molecular biology"],
        status: MODEL_STATUS.COMING_SOON,
        route: "/models/dna-double-helix",
        preview: null,
        frequency: 96,
        popularity: 93,
        views: 0,
        explorations: 0,
        priority: 88,
        educationalImportance: 95,
        difficulty: "intermediate"
    },
    {
        id: "molecular-geometry",
        name: "Molecular Geometry",
        subject: "Chemistry",
        topic: "Chemical Bonding",
        classes: [11, 12],
        description: "See how VSEPR theory predicts 3D molecular shapes — linear, trigonal planar, tetrahedral, and beyond.",
        tags: ["vsepr", "molecule", "shape", "bond angle", "geometry"],
        status: MODEL_STATUS.COMING_SOON,
        route: "/models/molecular-geometry",
        preview: null,
        frequency: 92,
        popularity: 85,
        views: 0,
        explorations: 0,
        priority: 85,
        educationalImportance: 90,
        difficulty: "intermediate"
    },
    {
        id: "human-cell",
        name: "Human Cell",
        subject: "Biology",
        topic: "Cell Biology",
        classes: [9, 10, 11],
        description: "Navigate a fully labelled animal cell and inspect each organelle's structure and function up close.",
        tags: ["cell", "organelle", "biology", "mitochondria", "nucleus"],
        status: MODEL_STATUS.COMING_SOON,
        route: "/models/human-cell",
        preview: null,
        frequency: 90,
        popularity: 89,
        views: 0,
        explorations: 0,
        priority: 84,
        educationalImportance: 88,
        difficulty: "beginner"
    },
    {
        id: "projectile-motion",
        name: "Projectile Motion",
        subject: "Physics",
        topic: "Mechanics",
        classes: [11, 12],
        description: "Adjust launch angle and speed to see the resulting trajectory, range, and time of flight in real time.",
        tags: ["kinematics", "trajectory", "motion", "gravity", "mechanics"],
        status: MODEL_STATUS.COMING_SOON,
        route: "/models/projectile-motion",
        preview: null,
        frequency: 94,
        popularity: 87,
        views: 0,
        explorations: 0,
        priority: 82,
        educationalImportance: 89,
        difficulty: "intermediate"
    },
    {
        id: "solar-system",
        name: "Solar System",
        subject: "Physics",
        topic: "Mechanics",
        classes: [9, 10, 11],
        description: "Fly through a to-scale model of the solar system and see orbital mechanics and gravitation in action.",
        tags: ["astronomy", "orbits", "gravitation", "planets", "space"],
        status: MODEL_STATUS.COMING_SOON,
        route: "/models/solar-system",
        preview: null,
        frequency: 80,
        popularity: 91,
        views: 0,
        explorations: 0,
        priority: 78,
        educationalImportance: 75,
        difficulty: "beginner"
    },
    {
        id: "chemical-bonding",
        name: "Chemical Bonding",
        subject: "Chemistry",
        topic: "Chemical Bonding",
        classes: [10, 11, 12],
        description: "Compare ionic, covalent, and metallic bonding side by side and see how electrons are shared or transferred.",
        tags: ["bonding", "ionic", "covalent", "metallic", "electrons"],
        status: MODEL_STATUS.COMING_SOON,
        route: "/models/chemical-bonding",
        preview: null,
        frequency: 97,
        popularity: 86,
        views: 0,
        explorations: 0,
        priority: 87,
        educationalImportance: 93,
        difficulty: "intermediate"
    },
    {
        id: "human-heart",
        name: "Human Heart",
        subject: "Biology",
        topic: "Human Anatomy",
        classes: [11, 12],
        description: "Peel back the layers of a beating 3D heart model to trace blood flow through all four chambers.",
        tags: ["heart", "anatomy", "circulatory system", "biology", "blood flow"],
        status: MODEL_STATUS.COMING_SOON,
        route: "/models/human-heart",
        preview: null,
        frequency: 89,
        popularity: 90,
        views: 0,
        explorations: 0,
        priority: 81,
        educationalImportance: 87,
        difficulty: "advanced"
    },
    {
        id: "magnetic-field",
        name: "Magnetic Field",
        subject: "Physics",
        topic: "Magnetism",
        classes: [11, 12],
        description: "Map field lines around bar magnets, coils and current-carrying wires, and explore the right-hand rule in 3D.",
        tags: ["magnetism", "field lines", "current", "electromagnetism", "coil"],
        status: MODEL_STATUS.COMING_SOON,
        route: "/models/magnetic-field",
        preview: null,
        frequency: 91,
        popularity: 83,
        views: 0,
        explorations: 0,
        priority: 79,
        educationalImportance: 86,
        difficulty: "intermediate"
    }
];

// Freeze each record + the container so nothing downstream can
// accidentally mutate shared data (e.g. a card renderer tweaking
// a field on the object it was handed).
MODELS.forEach(Object.freeze);
Object.freeze(MODELS);

// ---------------------------------------------------------------
// CORE ACCESSORS
// ---------------------------------------------------------------

/**
 * Every model in the library, unfiltered, in source order.
 * Returns a shallow copy so callers can freely sort/splice the
 * array they get back without touching the underlying data.
 */
export function getAllModels() {
    return MODELS.slice();
}

/**
 * Find a single model by its id.
 * @param {string} id
 * @returns {object|null}
 */
export function getModelById(id) {
    if (!id) return null;
    return MODELS.find(function (model) { return model.id === id; }) || null;
}

/**
 * True if a model (by id or object) is currently available to open.
 * Centralizing this means "what counts as available" only has to
 * change in one place if a new status is added later.
 * @param {string|object} modelOrId
 */
export function isAvailable(modelOrId) {
    var model = typeof modelOrId === "string" ? getModelById(modelOrId) : modelOrId;
    return !!model && model.status === MODEL_STATUS.AVAILABLE;
}

// ---------------------------------------------------------------
// FILTERING
// ---------------------------------------------------------------

/**
 * Filter models by any combination of criteria. Every criterion is
 * optional and they combine with AND. Designed to scale to a large
 * library — this stays a single pass over the data regardless of
 * how many filters are supplied.
 *
 * @param {object} [criteria]
 * @param {string|string[]} [criteria.subject]   e.g. "Chemistry" or ["Chemistry","Physics"]
 * @param {string|string[]} [criteria.topic]
 * @param {number} [criteria.classLevel]         e.g. 11 — matches models whose `classes` includes it
 * @param {string|string[]} [criteria.status]    e.g. "available"
 * @param {string|string[]} [criteria.tags]      matches if a model has ANY of the given tags
 * @param {string|string[]} [criteria.difficulty]
 * @param {string} [criteria.query]              free-text match against name/description/tags
 * @returns {object[]}
 */
export function filterModels(criteria) {
    var c = criteria || {};
    var subjectSet = toLowerSet(c.subject);
    var topicSet = toLowerSet(c.topic);
    var statusSet = toLowerSet(c.status);
    var tagSet = toLowerSet(c.tags);
    var difficultySet = toLowerSet(c.difficulty);
    var query = c.query ? String(c.query).trim().toLowerCase() : "";

    return MODELS.filter(function (model) {
        if (subjectSet && !subjectSet.has(model.subject.toLowerCase())) return false;
        if (topicSet && !topicSet.has(model.topic.toLowerCase())) return false;
        if (statusSet && !statusSet.has(model.status.toLowerCase())) return false;
        if (difficultySet && !difficultySet.has(String(model.difficulty).toLowerCase())) return false;

        // classLevel is usually a number (9, 11, 12...), but the class
        // filter also supports non-numeric tokens like "dropper" or
        // "competitive" for cohorts outside the numbered classes. Those
        // will simply never appear in a model's numeric `classes` array,
        // so this correctly resolves to "no match" rather than needing
        // a separate code path per token.
        if (c.classLevel !== undefined && c.classLevel !== null &&
            model.classes.indexOf(c.classLevel) === -1) {
            return false;
        }

        if (tagSet) {
            var hasTag = model.tags.some(function (tag) { return tagSet.has(tag.toLowerCase()); });
            if (!hasTag) return false;
        }

        if (query) {
            var haystack = (
                model.name + " " +
                model.description + " " +
                model.subject + " " +
                model.topic + " " +
                model.tags.join(" ")
            ).toLowerCase();
            if (haystack.indexOf(query) === -1) return false;
        }

        return true;
    });
}

/** Convenience wrapper: all models with status "available". */
export function getAvailableModels() {
    return filterModels({ status: MODEL_STATUS.AVAILABLE });
}

/** Convenience wrapper: all models with status "coming-soon". */
export function getComingSoonModels() {
    return filterModels({ status: MODEL_STATUS.COMING_SOON });
}

/** Convenience wrapper: all models tagged with a given subject. */
export function getModelsBySubject(subject) {
    return filterModels({ subject: subject });
}

// ---------------------------------------------------------------
// SORTING
// ---------------------------------------------------------------

var SORTABLE_NUMERIC_KEYS = [
    "frequency", "popularity", "views", "explorations",
    "priority", "educationalImportance"
];

/**
 * Return a NEW sorted array — never mutates the input.
 * @param {object[]} models
 * @param {string} [key="priority"] one of the numeric fields above,
 *        "name" (alphabetical), or "status" (available before coming-soon)
 * @param {"asc"|"desc"} [direction="desc"]
 */
export function sortModels(models, key, direction) {
    var sortKey = key || "priority";
    var dir = direction === "asc" ? 1 : -1;
    var list = (models || MODELS).slice();

    list.sort(function (a, b) {
        var result;

        if (sortKey === "name") {
            result = a.name.localeCompare(b.name);
        } else if (sortKey === "status") {
            result = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
        } else if (SORTABLE_NUMERIC_KEYS.indexOf(sortKey) !== -1) {
            result = (a[sortKey] || 0) - (b[sortKey] || 0);
        } else {
            // Unknown key — keep stable input order instead of throwing,
            // so a typo'd sort key degrades gracefully.
            result = 0;
        }

        return result * dir;
    });

    return list;
}

// ---------------------------------------------------------------
// SEARCH
// ---------------------------------------------------------------

/** Free-text search across name/description/tags/subject/topic. */
export function searchModels(query) {
    return filterModels({ query: query });
}

// ---------------------------------------------------------------
// internal helpers
// ---------------------------------------------------------------

function toLowerSet(value) {
    if (value === undefined || value === null) return null;
    var arr = Array.isArray(value) ? value : [value];
    if (arr.length === 0) return null;
    return new Set(arr.map(function (v) { return String(v).toLowerCase(); }));
}
