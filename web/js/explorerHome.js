import * as THREE from "three";
import { createStars } from "./stars.js";

//================================
// Explorer — parent homepage 3D background.
// One shared scene, reused geometries where possible (createStars
// is the same module explorer.html already uses). Kept intentionally
// light: a handful of objects, no shaders, no custom loaders.
//================================

const canvas = document.getElementById("bgCanvas");
const isDesktop = window.matchMedia("(hover:hover) and (pointer:fine)").matches;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050508);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 9);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isDesktop ? 2 : 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

//================================
// Lights — white key light + lavender accent, matching the
// "royal black + lavender glow" brief.
//================================

scene.add(new THREE.HemisphereLight(0xbcb2ff, 0x05050a, 0.7));

const key = new THREE.DirectionalLight(0xffffff, 1.4);
key.position.set(6, 8, 6);
scene.add(key);

const lavenderLight = new THREE.PointLight(0x9b86ff, 2.2, 40);
lavenderLight.position.set(-5, 2, 4);
scene.add(lavenderLight);

//================================
// Background dust — reuse the exact same starfield the atom
// explorer already uses (no new particle code needed).
//================================

createStars(scene);

//================================
// CORE — always-visible premium shapes (glossy black + frosted
// glass + lavender/white orbital rings). This is the "main
// attraction" the brief asks for.
//================================

const core = new THREE.Group();
scene.add(core);

const glossyBlack = new THREE.MeshPhysicalMaterial({
    color: 0x0b0b12,
    metalness: 0.85,
    roughness: 0.25,
    clearcoat: 1,
    clearcoatRoughness: 0.15
});

const centerpiece = new THREE.Mesh(new THREE.IcosahedronGeometry(2.1, 1), glossyBlack);
core.add(centerpiece);

const glass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.1,
    roughness: 0.05,
    metalness: 0,
    clearcoat: 1
});

const glassPositions = [
    [3.2, 1.2, -1.5, 0.55],
    [-3, -1.4, -0.5, 0.75],
    [2, -2.2, 1.5, 0.4],
    [-2.6, 1.8, 1.8, 0.5]
];

glassPositions.forEach(([x, y, z, r]) => {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 32), glass);
    sphere.position.set(x, y, z);
    core.add(sphere);
});

[2.7, 3.4].forEach((radius, i) => {
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.01, 16, 128),
        new THREE.MeshBasicMaterial({
            color: i % 2 ? 0xb9a6ff : 0xffffff,
            transparent: true,
            opacity: 0.35
        })
    );
    ring.rotation.x = Math.PI / 2.3;
    ring.rotation.z = i * 0.6;
    core.add(ring);
});

//================================
// SUBJECT ATMOSPHERE — three dim groups layered into the same
// scene. Hovering a subject card fades its group up; the rest
// stay subtle. No separate scenes, just opacity targets.
//================================

function setGroupOpacity(group, value) {
    group.traverse(obj => {
        if (obj.material && "opacity" in obj.material) {
            obj.material.transparent = true;
            obj.material.opacity = value;
        }
    });
}

// Physics — trajectory curves + a tilted force-ring
const physicsGroup = new THREE.Group();
const physicsMat = new THREE.LineBasicMaterial({ color: 0xb9a6ff, transparent: true, opacity: 0 });
for (let i = 0; i < 3; i++) {
    const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-3, -1 + i * 0.6, -1),
        new THREE.Vector3(0, 2 + i * 0.4, 0.5),
        new THREE.Vector3(3, -0.5 + i * 0.5, 1)
    );
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)), physicsMat.clone());
    physicsGroup.add(line);
}
const forceRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.3, 0.012, 16, 128),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
);
forceRing.rotation.x = Math.PI / 3;
physicsGroup.add(forceRing);
physicsGroup.position.set(-1.5, 0.5, 1);
core.add(physicsGroup);

// Chemistry — small atom (nucleus + orbits + electrons)
const chemistryGroup = new THREE.Group();
const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xb9a6ff, transparent: true, opacity: 0 })
);
chemistryGroup.add(nucleus);
for (let i = 0; i < 2; i++) {
    const orbit = new THREE.Mesh(
        new THREE.TorusGeometry(0.7 + i * 0.35, 0.006, 16, 96),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
    );
    orbit.rotation.x = Math.PI / 2;
    orbit.rotation.z = i * 0.9;
    chemistryGroup.add(orbit);

    const electron = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xb9a6ff, transparent: true, opacity: 0 })
    );
    electron.position.set(0.7 + i * 0.35, 0, 0);
    orbit.add(electron);
}
chemistryGroup.position.set(1.8, -0.8, 1.2);
core.add(chemistryGroup);

// Mathematics — abstract wireframe forms
const mathGroup = new THREE.Group();
const wireMat = () => new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0 });
const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.55, 0.16, 80, 8), wireMat());
knot.position.set(-1.5, -1.5, 1.5);
mathGroup.add(knot);
const cube = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), wireMat());
cube.position.set(2.2, 1.8, -0.5);
mathGroup.add(cube);
core.add(mathGroup);

const subjectGroups = { physics: physicsGroup, chemistry: chemistryGroup, math: mathGroup };
const subjectTargets = { physics: 0.12, chemistry: 0.12, math: 0.12 };
const IDLE_OPACITY = 0.12;
const HOVER_OPACITY = 0.75;

document.querySelectorAll(".subject-card").forEach(card => {
    const key = card.dataset.subject;
    if (!subjectGroups[key]) return;

    card.addEventListener("mouseenter", () => { subjectTargets[key] = HOVER_OPACITY; });
    card.addEventListener("mouseleave", () => { subjectTargets[key] = IDLE_OPACITY; });
    card.addEventListener("focus", () => { subjectTargets[key] = HOVER_OPACITY; });
    card.addEventListener("blur", () => { subjectTargets[key] = IDLE_OPACITY; });
});

//================================
// CURSOR PARALLAX (desktop) / gentle auto-drift (mobile)
//================================

let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

if (isDesktop) {
    window.addEventListener("mousemove", e => {
        mouseX = e.clientX / window.innerWidth - 0.5;
        mouseY = e.clientY / window.innerHeight - 0.5;
    });
}

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    if (isDesktop) {
        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;
    } else {
        // gentle automatic movement when there's no cursor to track
        targetX = Math.sin(t * 0.15) * 0.15;
        targetY = Math.cos(t * 0.12) * 0.1;
    }

    // camera/environment shifts a little
    camera.position.x = targetX * 1.4;
    camera.position.y = -targetY * 1.0;
    camera.lookAt(0, 0, 0);

    // background core drifts less than foreground subject groups
    core.rotation.y = targetX * 0.25 + t * 0.02;
    core.rotation.x = targetY * 0.15;

    physicsGroup.rotation.y = targetX * 0.5;
    chemistryGroup.rotation.y += 0.01;
    mathGroup.rotation.y += 0.006;
    mathGroup.rotation.x += 0.004;

    // ease each subject group's opacity toward its target
    Object.keys(subjectGroups).forEach(key => {
        const group = subjectGroups[key];
        const current = group.userData.opacity ?? IDLE_OPACITY;
        const next = current + (subjectTargets[key] - current) * 0.08;
        group.userData.opacity = next;
        setGroupOpacity(group, next);
    });

    renderer.render(scene, camera);
}

animate();

//================================
// RESIZE
//================================

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onResize);
window.addEventListener("orientationchange", () => setTimeout(onResize, 250));

//================================
// "Coming Soon" overlay for Physics / Mathematics
//================================

const soonOverlay = document.getElementById("soonOverlay");
const soonTitle = document.getElementById("soonTitle");
const soonClose = document.getElementById("soonClose");

document.querySelectorAll(".subject-card[data-soon]").forEach(card => {
    card.addEventListener("click", e => {
        e.preventDefault();
        soonTitle.textContent = card.dataset.subject === "physics" ? "Physics" : "Mathematics";
        soonOverlay.classList.add("show");
    });
});

function closeSoon() { soonOverlay.classList.remove("show"); }

soonClose.addEventListener("click", closeSoon);
soonOverlay.addEventListener("click", e => { if (e.target === soonOverlay) closeSoon(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSoon(); });
