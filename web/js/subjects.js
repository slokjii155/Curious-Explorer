// Homepage "Subjects" section.
//
// Renders the subject cards from a single data list, then layers on:
//   - favoriting (persisted to localStorage)
//   - favorites-first ordering (via flex `order`, so the same DOM nodes
//     stay in place — this keeps the cards' existing hover/press/soon-
//     overlay listeners from ./explorerHome.js working untouched)
//   - a compact "Show More / Show Less" view that always keeps
//     favorited subjects visible, even collapsed.
//
// Card markup mirrors the original static markup exactly
// (.subject-card > .subject-icon / .subject-name / .badge, plus
// data-subject / data-soon), so none of the existing CSS or the
// soon-overlay script needed to change.
//
// SUBJECT DATA — kept deliberately simple for now (name/icon/href/status)
// but shaped so each entry can later grow its own chapters, materials,
// simulations, 3D models, practice sets, and AI tools without changing
// this file's structure or the logic below.
(function () {
    "use strict";

    var SUBJECTS = [
        { id: "chemistry", name: "Chemistry", icon: "⚛", href: "./chemistry.html", status: "active",
            chapters: [], materials: [], simulations: [], models3d: [], practice: [], aiTools: [] },
        { id: "physics", name: "Physics", icon: "🪐", href: "#", status: "soon",
            chapters: [], materials: [], simulations: [], models3d: [], practice: [], aiTools: [] },
        { id: "biology", name: "Biology", icon: "🧬", href: "#", status: "soon",
            chapters: [], materials: [], simulations: [], models3d: [], practice: [], aiTools: [] },
        { id: "math", name: "Mathematics", icon: "📐", href: "#", status: "soon",
            chapters: [], materials: [], simulations: [], models3d: [], practice: [], aiTools: [] },
        { id: "computer-science", name: "Computer Science", icon: "💻", href: "#", status: "soon",
            chapters: [], materials: [], simulations: [], models3d: [], practice: [], aiTools: [] },
        { id: "english", name: "English", icon: "📖", href: "#", status: "soon",
            chapters: [], materials: [], simulations: [], models3d: [], practice: [], aiTools: [] },
        { id: "economics", name: "Economics", icon: "📈", href: "#", status: "soon",
            chapters: [], materials: [], simulations: [], models3d: [], practice: [], aiTools: [] },
        { id: "accountancy", name: "Accountancy", icon: "🧾", href: "#", status: "soon",
            chapters: [], materials: [], simulations: [], models3d: [], practice: [], aiTools: [] },
        { id: "business-studies", name: "Business Studies", icon: "💼", href: "#", status: "soon",
            chapters: [], materials: [], simulations: [], models3d: [], practice: [], aiTools: [] },
        { id: "geography", name: "Geography", icon: "🌍", href: "#", status: "soon",
            chapters: [], materials: [], simulations: [], models3d: [], practice: [], aiTools: [] },
        { id: "political-science", name: "Political Science", icon: "🏛", href: "#", status: "soon",
            chapters: [], materials: [], simulations: [], models3d: [], practice: [], aiTools: [] },
        { id: "history", name: "History", icon: "📜", href: "#", status: "soon",
            chapters: [], materials: [], simulations: [], models3d: [], practice: [], aiTools: [] }
    ];

    var STORAGE_KEY = "vce_favorite_subjects";
    var COMPACT_COUNT = 3;
    var STAR_PATH = "M12 2.6 L14.7 8.9 L21.6 9.6 L16.4 14.1 L18 20.9 L12 17.3 L6 20.9 L7.6 14.1 L2.4 9.6 L9.3 8.9 Z";

    var grid = document.getElementById("subjectsGrid");
    var moreWrap = document.querySelector(".subjects-more-wrap");
    var moreBtn = document.getElementById("subjectsMoreBtn");
    var moreLabel = document.getElementById("subjectsMoreLabel");

    if (!grid || !moreBtn) return;

    function loadFavorites() {
        try {
            var raw = window.localStorage.getItem(STORAGE_KEY);
            var parsed = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(parsed)) return [];
            return parsed.filter(function (id) {
                return SUBJECTS.some(function (s) { return s.id === id; });
            });
        } catch (e) {
            return [];
        }
    }

    function saveFavorites(list) {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        } catch (e) {
            // storage unavailable (private browsing, etc.) — favorites just
            // won't persist across reloads; the UI still works this session
        }
    }

    var favorites = loadFavorites(); // ids, in the order the student favorited them
    var expanded = false;

    function isFav(id) {
        return favorites.indexOf(id) !== -1;
    }

    function buildCard(subject) {
        var a = document.createElement("a");
        a.className = "subject-card";
        a.setAttribute("data-subject", subject.id);
        a.setAttribute("tabindex", "0");
        a.href = subject.status === "active" ? subject.href : "#";
        if (subject.status !== "active") {
            a.setAttribute("data-soon", "");
        }

        var favBtn = document.createElement("button");
        favBtn.type = "button";
        favBtn.className = "fav-btn";
        favBtn.setAttribute("aria-pressed", "false");
        favBtn.setAttribute("aria-label", "Add " + subject.name + " to favorites");
        favBtn.innerHTML =
            '<svg viewBox="0 0 24 24">' +
                '<path class="fav-star-outline" d="' + STAR_PATH + '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
                '<path class="fav-star-fill" d="' + STAR_PATH + '" fill="currentColor"/>' +
            "</svg>";
        favBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(subject.id);
        });

        var icon = document.createElement("div");
        icon.className = "subject-icon";
        icon.textContent = subject.icon;

        var name = document.createElement("div");
        name.className = "subject-name";
        name.textContent = subject.name;

        var badge = document.createElement("div");
        badge.className = subject.status === "active" ? "badge go" : "badge soon";
        badge.textContent = subject.status === "active" ? "Explore Now" : "Coming Soon";

        a.appendChild(favBtn);
        a.appendChild(icon);
        a.appendChild(name);
        a.appendChild(badge);

        subject._el = a;
        subject._favBtn = favBtn;
        return a;
    }

    SUBJECTS.forEach(function (subject) {
        grid.appendChild(buildCard(subject));
    });

    function sortedSubjects() {
        var favs = [];
        favorites.forEach(function (id) {
            var match = SUBJECTS.filter(function (s) { return s.id === id; })[0];
            if (match) favs.push(match);
        });
        var rest = SUBJECTS.filter(function (s) { return favorites.indexOf(s.id) === -1; });
        return favs.concat(rest);
    }

    // which subjects stay visible while the section is collapsed —
    // every favorite, plus enough non-favorites to reach COMPACT_COUNT
    function collapsedVisibleIds(order) {
        var favs = order.filter(function (s) { return isFav(s.id); });
        var nonFavs = order.filter(function (s) { return !isFav(s.id); });
        var slotsLeft = Math.max(0, COMPACT_COUNT - favs.length);
        var visible = {};
        favs.concat(nonFavs.slice(0, slotsLeft)).forEach(function (s) {
            visible[s.id] = true;
        });
        return visible;
    }

    var laidOutOnce = false;

    function revealCard(el) {
        el.classList.remove("is-collapsed-hidden");
        el.classList.add("is-revealing");
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                el.classList.remove("is-revealing");
            });
        });
    }

    var prefersReducedMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // fades a card out in place, then pulls it out of grid flow once the
    // transition finishes — avoids the instant "pop out" jump on Show Less
    function hideCard(subject) {
        var el = subject._el;
        clearTimeout(subject._hideTimer);
        if (prefersReducedMotion) {
            el.classList.add("is-collapsed-hidden");
            return;
        }
        el.classList.remove("is-revealing");
        el.classList.add("is-hiding");
        subject._hideTimer = setTimeout(function () {
            el.classList.remove("is-hiding");
            el.classList.add("is-collapsed-hidden");
        }, 320);
    }

    function applyLayout() {
        var order = sortedSubjects();
        var visibleIds = collapsedVisibleIds(order);
        var hasMore = order.length > Object.keys(visibleIds).length;

        order.forEach(function (subject, i) {
            var fav = isFav(subject.id);

            subject._el.style.order = i;
            subject._el.classList.toggle("is-favorite", fav);
            subject._favBtn.classList.toggle("is-fav", fav);
            subject._favBtn.setAttribute("aria-pressed", fav ? "true" : "false");
            subject._favBtn.setAttribute(
                "aria-label",
                (fav ? "Remove " : "Add ") + subject.name + (fav ? " from favorites" : " to favorites")
            );

            var shouldShow = expanded || !!visibleIds[subject.id];

            if (shouldShow) {
                clearTimeout(subject._hideTimer);
                subject._el.classList.remove("is-hiding");
                if (subject._el.classList.contains("is-collapsed-hidden")) {
                    if (laidOutOnce) {
                        revealCard(subject._el);
                    } else {
                        subject._el.classList.remove("is-collapsed-hidden");
                    }
                }
            } else if (!subject._el.classList.contains("is-collapsed-hidden")) {
                if (laidOutOnce) {
                    hideCard(subject);
                } else {
                    subject._el.classList.add("is-collapsed-hidden");
                }
            }
        });

        laidOutOnce = true;

        if (moreWrap) moreWrap.style.display = hasMore ? "flex" : "none";
        moreBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
        moreBtn.classList.toggle("is-expanded", expanded);
        if (moreLabel) moreLabel.textContent = expanded ? "Show Less" : "Show More";
    }

    function toggleFavorite(id) {
        var idx = favorites.indexOf(id);
        if (idx === -1) {
            favorites.push(id);
        } else {
            favorites.splice(idx, 1);
        }
        saveFavorites(favorites);
        applyLayout();
    }

    moreBtn.addEventListener("click", function () {
        expanded = !expanded;
        applyLayout();
    });

    applyLayout();
})();
