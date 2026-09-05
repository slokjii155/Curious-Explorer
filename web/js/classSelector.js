// Class / Stream / Competitive-Exam selectors for the homepage.
//
// This module only figures out WHICH subject ids should be visible for the
// current selection and hands that off to subjects.js via a custom event —
// it knows nothing about cards, favorites, or grid layout. The id lists
// below are a first-pass structural mapping built only from subjects that
// already exist in ./subjects.js; real per-class/stream/exam content is a
// later step.

(function () {
    "use strict";

    var SENIOR_CLASSES = ["11", "12", "dropper"];

    // Classes 1-10 don't have streams yet — a simple, broad subject set per
    // class band, using only the subject ids that already exist.
    // 1-5: foundational subjects (EVS instead of split Science/Social Science).
    // 6-8: combined Science + Social Science subjects, no stream split yet.
    // 9-10: Science splits into Physics/Chemistry/Biology, plus commerce/
    //       humanities subjects start appearing ahead of stream selection.
    var CLASS_SUBJECTS = {
        "1": ["math", "english", "hindi", "evs"],
        "2": ["math", "english", "hindi", "evs"],
        "3": ["math", "english", "hindi", "evs"],
        "4": ["math", "english", "hindi", "evs"],
        "5": ["math", "english", "hindi", "evs"],
        "6": ["math", "english", "hindi", "science", "geography", "history"],
        "7": ["math", "english", "hindi", "science", "geography", "history"],
        "8": ["math", "english", "hindi", "science", "geography", "history", "computer-science"],
        "9": ["math", "english", "hindi", "physics", "chemistry", "biology", "computer-science", "economics", "geography", "political-science", "history"],
        "10": ["math", "english", "hindi", "physics", "chemistry", "biology", "computer-science", "economics", "geography", "political-science", "history"]
    };

    // Classes 11, 12 and Dropper are stream-based instead.
    var STREAM_SUBJECTS = {
        science: ["physics", "chemistry", "biology", "math", "computer-science", "english"],
        commerce: ["accountancy", "business-studies", "economics", "math", "english", "computer-science"],
        humanities: ["history", "political-science", "geography", "economics", "english"]
    };

    // Competitive-exam subject sets — only used when the student explicitly
    // asks to see exam-based subjects instead of class-based ones.
    var EXAM_SUBJECTS = {
        jee: ["physics", "chemistry", "math"],
        neet: ["physics", "chemistry", "biology"]
        // "cuet" and "other" don't narrow the list on their own — they fall
        // back to whatever the class/stream selection already resolved to.
    };

    var classSelect = document.getElementById("classSelect");
    var streamGroup = document.getElementById("streamGroup");
    var streamSelect = document.getElementById("streamSelect");
    var examSelect = document.getElementById("examSelect");
    var examModeGroup = document.getElementById("examModeGroup");
    var examModeSegmented = document.getElementById("examModeSegmented");

    if (!classSelect) return;

    var state = {
        cls: "",
        stream: "",
        exam: "",
        examMode: "class" // "class" | "exam" — only meaningful once an exam is picked
    };

    function isSenior(cls) {
        return SENIOR_CLASSES.indexOf(cls) !== -1;
    }

    function setSegmentedActive(group, attr, value) {
        if (!group) return;
        var btns = group.querySelectorAll(".segmented-btn");
        btns.forEach(function (btn) {
            var active = btn.getAttribute(attr) === value;
            btn.classList.toggle("is-active", active);
            btn.setAttribute("aria-checked", active ? "true" : "false");
        });
    }

    // Resolves the current selection to a list of subject ids to show, or
    // null when nothing has been chosen yet (meaning: don't filter at all).
    function computeSubjectIds() {
        if (!state.cls) return null;

        var base;
        if (isSenior(state.cls)) {
            base = state.stream ? (STREAM_SUBJECTS[state.stream] || []) : [];
        } else {
            base = CLASS_SUBJECTS[state.cls] || [];
        }

        if (state.exam && state.examMode === "exam") {
            var examIds = EXAM_SUBJECTS[state.exam];
            if (examIds) return examIds;
        }

        return base;
    }

    function computeEmptyMessage() {
        if (state.cls && isSenior(state.cls) && !state.stream) {
            return "Choose a stream to see subjects for this class.";
        }
        return "No subjects to show yet for this selection — check back soon.";
    }

    function emitFilter() {
        document.dispatchEvent(new CustomEvent("vce:subjectfilter", {
            detail: {
                ids: computeSubjectIds(),
                emptyMessage: computeEmptyMessage()
            }
        }));
    }

    // Shows/hides the Stream and Exam-mode groups based on the current
    // selection, and resets any now-irrelevant state along with them.
    function syncVisibility() {
        var senior = isSenior(state.cls);

        if (streamGroup) streamGroup.hidden = !senior;
        if (!senior) {
            state.stream = "";
            if (streamSelect) streamSelect.value = "";
        }

        var showExamMode = !!state.exam;
        if (examModeGroup) examModeGroup.hidden = !showExamMode;
        if (!showExamMode) {
            state.examMode = "class";
            setSegmentedActive(examModeSegmented, "data-mode", "class");
        }
    }

    classSelect.addEventListener("change", function () {
        state.cls = classSelect.value;
        syncVisibility();
        emitFilter();
    });

    if (streamSelect) {
        streamSelect.addEventListener("change", function () {
            state.stream = streamSelect.value;
            emitFilter();
        });
    }

    if (examSelect) {
        examSelect.addEventListener("change", function () {
            state.exam = examSelect.value;
            syncVisibility();
            emitFilter();
        });
    }

    if (examModeSegmented) {
        examModeSegmented.addEventListener("click", function (e) {
            var btn = e.target.closest(".segmented-btn");
            if (!btn) return;
            state.examMode = btn.getAttribute("data-mode");
            setSegmentedActive(examModeSegmented, "data-mode", state.examMode);
            emitFilter();
        });
    }

    // Initial state: nothing selected yet, so the homepage shows every
    // subject exactly as it did before this feature existed.
    syncVisibility();
    emitFilter();
})();
