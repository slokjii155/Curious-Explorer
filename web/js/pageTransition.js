// VCE cinematic page transition — a small, reusable "portal" effect used
// whenever navigating into a different part of VCE (right now: Homepage
// <-> 3D Models). Not tied to any specific destination or model: any link
// or button can opt in by calling VCETransition.navigate(url, event).
//
// How it works (multi-page site, no client-side router):
//   1. LEAVE:   the current page blurs/scales inward toward the origin of
//               the click while a light sweep + expanding ring + a few
//               particles play over it, then we navigate.
//   2. ARRIVE:  a sessionStorage flag tells the next page it arrived via
//               a transition, so it starts in the same blurred/scaled
//               state and eases back to normal — same motion, continued
//               across the page load, instead of a hard cut.
//   3. Safety:  the flag is consumed (removed) the instant it's read, so
//               refreshing or landing on a page normally never replays
//               the animation. bfcache restores are swept clean on
//               `pageshow` so a stuck mid-transition frame can never
//               show up if the user uses the browser's own Back/Forward.
//
// This file is intentionally framework-free and safe to include on any
// page — it does nothing until something calls VCETransition.navigate().

(function () {
    "use strict";

    var STORAGE_KEY = "vce:transitionIn";
    var DURATION = 680; // ms — keep in sync with the CSS transition below
    var HOLD = 90; // ms the arrival state holds before easing out

    var isNavigating = false;
    var overlay = null;

    // ---------------------------------------------------------------
    // styles (injected once, so every page just needs the <script> tag)
    // ---------------------------------------------------------------
    function injectStyles() {
        if (document.getElementById("vce-transition-styles")) return;

        var style = document.createElement("style");
        style.id = "vce-transition-styles";
        style.textContent = [
            "body.vce-transition-motion{",
            "  transition:transform " + DURATION + "ms cubic-bezier(.4,0,.2,1), filter " + DURATION + "ms cubic-bezier(.4,0,.2,1);",
            "  will-change:transform, filter;",
            "}",
            "body.vce-transition-warp{",
            "  transform:scale(1.055);",
            "  filter:blur(9px) brightness(1.12) saturate(1.15);",
            "}",

            ".vce-transition-overlay{",
            "  position:fixed; inset:0; z-index:9999;",
            "  opacity:0; pointer-events:none;",
            "  transition:opacity " + DURATION + "ms ease;",
            "}",
            ".vce-transition-overlay.is-active{ opacity:1; pointer-events:auto; }",

            ".vce-t-veil{",
            "  position:absolute; inset:0;",
            "  background:radial-gradient(circle at var(--ox,50%) var(--oy,50%), rgba(185,150,255,.4), rgba(18,10,38,.88) 55%, rgba(2,1,5,.98) 100%);",
            "}",

            ".vce-t-sweep{",
            "  position:absolute; inset:-20%;",
            "  background:linear-gradient(100deg, transparent 42%, rgba(255,255,255,.55) 49%, rgba(220,200,255,.22) 53%, transparent 62%);",
            "  transform:translateX(-140%);",
            "  opacity:0;",
            "}",
            ".vce-transition-overlay.is-active .vce-t-sweep{",
            "  animation:vce-t-sweep-move " + (DURATION + 220) + "ms cubic-bezier(.4,0,.2,1) forwards;",
            "}",
            "@keyframes vce-t-sweep-move{",
            "  0%{ transform:translateX(-140%); opacity:0; }",
            "  32%{ opacity:1; }",
            "  100%{ transform:translateX(140%); opacity:0; }",
            "}",

            ".vce-t-ring{",
            "  position:absolute;",
            "  left:var(--ox,50%); top:var(--oy,50%);",
            "  width:36px; height:36px; margin:-18px 0 0 -18px;",
            "  border-radius:50%;",
            "  border:1px solid rgba(214,199,255,.55);",
            "  box-shadow:0 0 30px 6px rgba(150,120,255,.28);",
            "  opacity:0;",
            "  transform:scale(.3);",
            "}",
            ".vce-transition-overlay.is-active .vce-t-ring{",
            "  animation:vce-t-ring-expand " + (DURATION + 120) + "ms cubic-bezier(.2,.7,.3,1) forwards;",
            "}",
            "@keyframes vce-t-ring-expand{",
            "  0%{ opacity:0; transform:scale(.3); }",
            "  18%{ opacity:.85; }",
            "  100%{ opacity:0; transform:scale(42); }",
            "}",

            ".vce-t-particles{ position:absolute; inset:0; overflow:hidden; }",
            ".vce-t-particles span{",
            "  position:absolute;",
            "  width:3px; height:3px;",
            "  border-radius:50%;",
            "  background:#e4dbff;",
            "  box-shadow:0 0 8px 2px rgba(185,166,255,.55);",
            "  opacity:0;",
            "}",
            ".vce-transition-overlay.is-active .vce-t-particles span{",
            "  animation:vce-t-particle-drift var(--dur,1.05s) ease-out forwards;",
            "  animation-delay:var(--delay,0s);",
            "}",
            "@keyframes vce-t-particle-drift{",
            "  0%{ opacity:0; transform:translateY(10px) scale(.6); }",
            "  35%{ opacity:1; }",
            "  100%{ opacity:0; transform:translateY(-42px) scale(1); }",
            "}",

            "@media(prefers-reduced-motion:reduce){",
            "  body.vce-transition-motion{ transition:opacity " + DURATION + "ms ease; }",
            "  body.vce-transition-warp{ transform:none; filter:none; opacity:.15; }",
            "  .vce-t-sweep, .vce-t-ring, .vce-t-particles span{ display:none; }",
            "}"
        ].join("\n");

        document.head.appendChild(style);
    }

    // ---------------------------------------------------------------
    // overlay element (built once, reused for both directions)
    // ---------------------------------------------------------------
    function buildOverlay() {
        if (overlay) return overlay;

        overlay = document.createElement("div");
        overlay.className = "vce-transition-overlay";
        overlay.setAttribute("aria-hidden", "true");

        var veil = document.createElement("div");
        veil.className = "vce-t-veil";

        var sweep = document.createElement("div");
        sweep.className = "vce-t-sweep";

        var ring = document.createElement("div");
        ring.className = "vce-t-ring";

        var particles = document.createElement("div");
        particles.className = "vce-t-particles";
        for (var i = 0; i < 12; i++) {
            var p = document.createElement("span");
            p.style.left = (8 + Math.random() * 84).toFixed(1) + "%";
            p.style.top = (16 + Math.random() * 68).toFixed(1) + "%";
            p.style.setProperty("--dur", (0.85 + Math.random() * 0.6).toFixed(2) + "s");
            p.style.setProperty("--delay", (Math.random() * 0.35).toFixed(2) + "s");
            particles.appendChild(p);
        }

        overlay.appendChild(veil);
        overlay.appendChild(sweep);
        overlay.appendChild(ring);
        overlay.appendChild(particles);

        // appended to <html>, not <body> — so the body's own scale/blur
        // transform (used for the "warp" effect) never distorts the
        // overlay that's supposed to stay fixed to the viewport
        document.documentElement.appendChild(overlay);
        return overlay;
    }

    function setOrigin(el, evt) {
        var ox = "50%", oy = "50%";
        var source = evt && (evt.currentTarget || evt.target);
        if (source && source.getBoundingClientRect) {
            var r = source.getBoundingClientRect();
            ox = (r.left + r.width / 2).toFixed(0) + "px";
            oy = (r.top + r.height / 2).toFixed(0) + "px";
        }
        el.style.setProperty("--ox", ox);
        el.style.setProperty("--oy", oy);
        return { ox: ox, oy: oy };
    }

    // ---------------------------------------------------------------
    // LEAVE — play the outward warp, then hand off to the next page
    // ---------------------------------------------------------------
    function navigate(url, evt) {
        if (evt && evt.preventDefault) evt.preventDefault();
        if (isNavigating || !url) return;
        isNavigating = true;

        injectStyles();
        var el = buildOverlay();
        var origin = setOrigin(el, evt);

        document.body.style.transformOrigin = origin.ox + " " + origin.oy;
        document.body.classList.add("vce-transition-motion");

        // rAF so the browser commits the "before" frame first, guaranteeing
        // the scale/blur actually animates instead of snapping instantly
        requestAnimationFrame(function () {
            el.classList.add("is-active");
            document.body.classList.add("vce-transition-warp");
        });

        try {
            sessionStorage.setItem(STORAGE_KEY, "1");
        } catch (e) {
            // sessionStorage unavailable (private mode etc.) — the page will
            // just load normally without a matching arrival animation
        }

        setTimeout(function () {
            window.location.href = url;
        }, DURATION);
    }

    // ---------------------------------------------------------------
    // ARRIVE — if we got here via navigate(), continue the same motion
    // ---------------------------------------------------------------
    function consumeArrivalFlag() {
        try {
            if (!sessionStorage.getItem(STORAGE_KEY)) return false;
            sessionStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (e) {
            return false;
        }
    }

    function playArrival() {
        injectStyles();
        var el = buildOverlay();

        // start already "inside" the warped/blurred state, instantly —
        // this is what makes the two page loads feel like one continuous
        // motion instead of a blurred page suddenly appearing from nothing
        el.classList.add("is-active");
        document.body.classList.add("vce-transition-warp");

        window.addEventListener("load", function () {
            setTimeout(function () {
                document.body.classList.add("vce-transition-motion");
                requestAnimationFrame(function () {
                    document.body.classList.remove("vce-transition-warp");
                    el.classList.remove("is-active");
                });

                setTimeout(function () {
                    document.body.classList.remove("vce-transition-motion");
                    if (el && el.parentNode) el.parentNode.removeChild(el);
                    overlay = null;
                }, DURATION + 80);
            }, HOLD);
        });
    }

    // if this page was reached through VCETransition.navigate(), the flag
    // is already waiting — pick it up immediately (before first paint,
    // since this script runs at the top of <body>) so there's no flash of
    // the clean, unblurred page before the arrival animation takes over
    if (consumeArrivalFlag()) {
        playArrival();
    }

    // bfcache safety net: if the browser restores this page from cache
    // (e.g. native Back/Forward button) mid-animation, make sure nothing
    // is left stuck blurred/scaled or blocking clicks
    window.addEventListener("pageshow", function (e) {
        if (!e.persisted) return;
        isNavigating = false;
        document.body.classList.remove("vce-transition-warp", "vce-transition-motion");
        if (overlay) {
            overlay.classList.remove("is-active");
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            overlay = null;
        }
    });

    window.VCETransition = { navigate: navigate };
})();
