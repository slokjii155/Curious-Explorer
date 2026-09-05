// ============================================================
// PORTAL TRANSITION — shared cinematic page-transition module
// ============================================================
//
// Reusable across pages: any page can import this module, mark its
// main content wrapper with [data-portal-content], add the overlay
// markup (.portal-overlay > .portal-glass/.portal-sweep/.portal-particles)
// once in its body, and either call initPortalLinks() to wire up
// every [data-portal] link automatically, or call portalNavigate()
// directly for a custom trigger.
//
// Nothing here knows about "3D Models" specifically — a future page
// (e.g. an individual model's own entrance) can reuse this exact
// module for its own transition.
// ============================================================

const SESSION_KEY = "vce:portal:pending";
const LEAVE_DURATION = 820;   // ms — must stay in sync with the CSS clip-path transition
const ENTER_DURATION = 900;   // ms — time to keep the entering classes before cleanup
const STALE_AFTER_MS = 15000; // ignore a pending flag left over from an abandoned tab

function setOriginVars(xPct, yPct){
    document.documentElement.style.setProperty("--portal-x", xPct + "%");
    document.documentElement.style.setProperty("--portal-y", yPct + "%");
}

function readPending(){
    try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        // sessionStorage unavailable (private browsing, etc.) — the
        // entrance simply won't play; forward navigation still works.
        return null;
    }
}

function clearPending(){
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
}

function writePending(payload){
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload)); } catch (e) { /* ignore */ }
}

/**
 * Play the "leaving" animation on the current page, then navigate.
 * @param {string} targetUrl
 * @param {object} [opts]
 * @param {MouseEvent} [opts.originEvent] click event to open the portal from
 * @param {Element} [opts.originEl] element to open the portal from, if no event is available
 */
export function portalNavigate(targetUrl, opts){
    if (!targetUrl) return;
    const options = opts || {};

    let xPct = 50;
    let yPct = 50;

    if (options.originEvent && typeof options.originEvent.clientX === "number") {
        xPct = (options.originEvent.clientX / window.innerWidth) * 100;
        yPct = (options.originEvent.clientY / window.innerHeight) * 100;
    } else if (options.originEl && options.originEl.getBoundingClientRect) {
        const rect = options.originEl.getBoundingClientRect();
        xPct = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
        yPct = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
    }

    setOriginVars(xPct.toFixed(2), yPct.toFixed(2));
    writePending({ x: xPct, y: yPct, t: Date.now() });

    document.body.classList.add("portal-leaving");

    window.setTimeout(() => {
        window.location.href = targetUrl;
    }, LEAVE_DURATION);
}

/**
 * Call once on a destination page's load. If the page was reached
 * via portalNavigate(), plays the reveal entrance from the
 * remembered origin point and returns true. Otherwise does nothing
 * (a direct visit, reload, or browser back/forward doesn't replay
 * the cinematic) and returns false.
 */
export function portalRevealOnLoad(){
    const pending = readPending();

    // Consume immediately: a refresh right after landing should not
    // replay the entrance, and a stale flag should never resurface.
    clearPending();

    if (!pending || (Date.now() - pending.t) > STALE_AFTER_MS) {
        return false;
    }

    setOriginVars(pending.x, pending.y);
    document.body.classList.add("portal-entering");

    // Two rAFs so the browser paints the fully-covered "entering"
    // state on its own frame before we flip to "-active" — otherwise
    // both class changes can land in the same frame and the browser
    // never renders anything to animate away from.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.classList.add("portal-entering-active");
        });
    });

    window.setTimeout(() => {
        document.body.classList.remove("portal-entering", "portal-entering-active");
    }, ENTER_DURATION);

    return true;
}

/**
 * Wire up every element matching `selector` (default "[data-portal]")
 * so a plain click intercepts the normal navigation and plays
 * portalNavigate() instead. Falls back to a normal link if JS never
 * runs, since the href is left untouched.
 */
export function initPortalLinks(selector){
    const sel = selector || "[data-portal]";

    document.querySelectorAll(sel).forEach((el) => {
        el.addEventListener("click", (e) => {
            // Let modified clicks (new tab/window, middle-click) and
            // already-handled events behave normally.
            if (e.defaultPrevented || e.button !== 0 ||
                e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
                return;
            }

            const href = el.getAttribute("href");
            if (!href) return;

            e.preventDefault();
            portalNavigate(href, { originEvent: e });
        });
    });
}

// If the page is restored from the back/forward cache mid-transition
// (e.g. the user clicks the button, then immediately hits Back before
// navigation completes), strip any lingering portal classes instead
// of leaving the page stuck blurred — this is what keeps the portal
// from ever "breaking" the homepage or replaying unexpectedly.
window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
        document.body.classList.remove("portal-leaving", "portal-entering", "portal-entering-active");
    }
});
