// Explorer home screen behaviour — wires up the "Coming Soon" overlay for
// subjects that aren't live yet (Physics / Mathematics), and a couple of
// small touch-friendly niceties for the subject cards.
//
// Nothing here touches layout or placement — this only adds interaction
// that the markup already expected (data-soon, #soonOverlay, #soonClose).

(function () {
    "use strict";

    var overlay = document.getElementById("soonOverlay");
    var closeBtn = document.getElementById("soonClose");
    var title = document.getElementById("soonTitle");
    var soonCards = document.querySelectorAll("[data-soon]");

    if (!overlay) return;

    var lastFocused = null;

    function subjectLabel(card) {
        var nameEl = card.querySelector(".subject-name");
        return nameEl ? nameEl.textContent.trim() : "This subject";
    }

    function openSoon(card) {
        lastFocused = document.activeElement;
        if (title) title.textContent = subjectLabel(card) + " — Coming Soon";
        overlay.classList.add("show");
        if (closeBtn) closeBtn.focus();
        document.addEventListener("keydown", onKeydown);
    }

    function closeSoon() {
        overlay.classList.remove("show");
        document.removeEventListener("keydown", onKeydown);
        if (lastFocused && typeof lastFocused.focus === "function") {
            lastFocused.focus();
        }
    }

    function onKeydown(e) {
        if (e.key === "Escape" || e.key === "Esc") {
            closeSoon();
        }
    }

    soonCards.forEach(function (card) {
        card.addEventListener("click", function (e) {
            e.preventDefault();
            openSoon(card);
        });

        // keyboard activation (Enter / Space) for cards that are <a tabindex="0">
        card.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openSoon(card);
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", closeSoon);
    }

    // tapping the dimmed backdrop (but not the card itself) also closes it —
    // matches how this pattern behaves everywhere else on mobile
    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) closeSoon();
    });

    // a light "press" feedback on touch devices, since :hover never fires
    // on a phone — keeps the cards feeling responsive to a tap
    var allCards = document.querySelectorAll(".subject-card");
    allCards.forEach(function (card) {
        card.addEventListener(
            "touchstart",
            function () {
                card.classList.add("is-pressed");
            },
            { passive: true }
        );
        ["touchend", "touchcancel"].forEach(function (evt) {
            card.addEventListener(
                evt,
                function () {
                    card.classList.remove("is-pressed");
                },
                { passive: true }
            );
        });
    });
})();
