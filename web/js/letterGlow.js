// Global cursor-proximity letter glow.
//
// Splits the site's major headings (topbar title, panel titles, hero
// headline, subject/model card names) into per-letter spans, then tints
// each letter toward the page's existing purple/lavender accent based on
// its distance from the cursor — anywhere on the page, not just on
// direct hover. Letters always start from a bright, fully-readable
// baseline and only ever shift *toward* the accent hue, capped well
// short of the strongest accent tone, so a word stays legible as a
// whole no matter where the cursor is.
//
// Self-contained, dependency-free, and safe to include on any page:
// if none of the target elements exist, it simply does nothing.
(function () {
    "use strict";

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    var SELECTOR = ".title, .properties-title, .headline, .subject-name, .pt-title, .mc-name";

    var RADIUS = 260;          // px — how far the cursor's influence reaches
    var MAX_INTENSITY = 0.72;  // caps the shift so letters never fully reach the strongest accent tone
    var EASE = 0.18;           // per-frame smoothing so color changes glide rather than snap

    var letters = [];          // { el, colors, cx, cy, current }
    var mouseX = -9999, mouseY = -9999;
    var rafId = null;

    function hexToRgb(hex) {
        var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
        return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
    }

    // Reads whichever accent-color system the current page already
    // defines (style.css/chemistry.html use --accent/--accent-2,
    // index.html uses --lavender/--lavender-soft) so no new colors
    // are introduced.
    function colorSystem() {
        var cs = getComputedStyle(document.documentElement);
        var accent = cs.getPropertyValue("--accent").trim();
        if (accent) {
            return {
                base: [255, 255, 255],
                mid: hexToRgb(cs.getPropertyValue("--accent-2").trim()) || [203, 182, 255],
                top: hexToRgb(accent) || [155, 107, 255]
            };
        }
        var lavender = cs.getPropertyValue("--lavender").trim();
        return {
            base: [255, 255, 255],
            mid: hexToRgb(cs.getPropertyValue("--lavender-soft").trim()) || [217, 207, 255],
            top: hexToRgb(lavender) || [185, 166, 255]
        };
    }

    function splitEl(el) {
        if (el.dataset.lpSplit) return;
        el.dataset.lpSplit = "1";

        var colors = colorSystem();
        var nodes = Array.prototype.slice.call(el.childNodes);

        nodes.forEach(function (node) {
            if (node.nodeType !== 3) return; // only direct text nodes — leaves nested elements (e.g. <small>) untouched
            var text = node.textContent.replace(/\s+/g, " ").trim();
            if (!text) return;

            var frag = document.createDocumentFragment();
            Array.from(text).forEach(function (ch) {
                if (ch === " ") {
                    frag.appendChild(document.createTextNode(" "));
                    return;
                }
                var span = document.createElement("span");
                span.className = "lp-char";
                span.style.color = "rgba(255,255,255,.94)";
                span.textContent = ch;
                frag.appendChild(span);
                letters.push({ el: span, colors: colors, cx: 0, cy: 0, current: 0 });
            });
            el.replaceChild(frag, node);
        });
    }

    function lerp(a, b, t) { return a + (b - a) * t; }

    function mixColor(colors, t) {
        var stops = [colors.base, colors.mid, colors.top];
        var scaled = t * 2;
        var idx = scaled >= 1 ? 1 : 0;
        var localT = idx === 0 ? scaled : scaled - 1;
        var a = stops[idx], b = stops[idx + 1];
        return "rgb(" +
            Math.round(lerp(a[0], b[0], localT)) + "," +
            Math.round(lerp(a[1], b[1], localT)) + "," +
            Math.round(lerp(a[2], b[2], localT)) + ")";
    }

    function measure() {
        letters = letters.filter(function (l) { return l.el.isConnected; });
        letters.forEach(function (l) {
            var r = l.el.getBoundingClientRect();
            l.cx = r.left + r.width / 2;
            l.cy = r.top + r.height / 2;
        });
    }

    function tick() {
        rafId = null;
        var stillEasing = false;

        for (var i = 0; i < letters.length; i++) {
            var l = letters[i];
            var dx = l.cx - mouseX, dy = l.cy - mouseY;
            var dist = Math.sqrt(dx * dx + dy * dy);
            var raw = dist >= RADIUS ? 0 : 1 - dist / RADIUS;
            raw = raw * raw * (3 - 2 * raw); // smoothstep for a gradual, elegant falloff
            var targetT = raw * MAX_INTENSITY;

            l.current += (targetT - l.current) * EASE;
            if (Math.abs(targetT - l.current) > 0.002) stillEasing = true;

            l.el.style.color = mixColor(l.colors, Math.max(0, Math.min(1, l.current)));
        }

        if (stillEasing) rafId = requestAnimationFrame(tick);
    }

    function requestTick() {
        if (rafId === null) rafId = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        requestTick();
    }, { passive: true });

    window.addEventListener("pointerleave", function () {
        mouseX = -9999;
        mouseY = -9999;
        requestTick();
    }, { passive: true });

    var remeasureTimer = null;
    function scheduleRemeasure() {
        clearTimeout(remeasureTimer);
        remeasureTimer = setTimeout(measure, 120);
    }
    window.addEventListener("resize", scheduleRemeasure, { passive: true });
    window.addEventListener("scroll", scheduleRemeasure, { passive: true });

    function scan(root) {
        var found = false;
        if (root.matches && root.matches(SELECTOR)) { splitEl(root); found = true; }
        if (root.querySelectorAll) {
            root.querySelectorAll(SELECTOR).forEach(function (el) { splitEl(el); found = true; });
        }
        return found;
    }

    // Some headings (e.g. the properties panel title) are rebuilt by
    // other scripts at runtime, so keep watching for new matches
    // instead of only scanning once on load.
    var observer = new MutationObserver(function (mutations) {
        var found = false;
        mutations.forEach(function (m) {
            m.addedNodes.forEach(function (node) {
                if (node.nodeType === 1 && scan(node)) found = true;
            });
        });
        if (found) scheduleRemeasure();
    });

    function init() {
        scan(document.body);
        measure();
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
