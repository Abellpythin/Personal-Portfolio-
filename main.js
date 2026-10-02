// ---------------------------------------------------------------------------
// main.js — scene assembly, lighting, wall-frame layout, and app bootstrap.
//
// ⚠️ PERSONAL INFO PLACEHOLDERS
// This file does NOT pull any of your real personal information automatically.
// Every resume/LinkedIn/GitHub/website link and every document/image path is a
// placeholder — search for "TODO:" below and fill in your own details.
// ---------------------------------------------------------------------------
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { loadModels } from "./loaders/gltfLoader.js";
import { MODEL_PLACEMENTS, BOOKSHELF_ITEMS, BOOKSHELF_ORIGIN, BOOKSHELF_SPACING } from "./loaders/modelConfig.js";
import { flyToObject, resetView, DEFAULT_VIEW } from "./interactions/cameraFocus.js";
import { setupRaycaster } from "./interactions/raycaster.js";
import { createTexturedFrame, createIconFrame } from "./interactions/textures.js";
import { createBookshelfBooks, pullOutBook } from "./interactions/bookshelf.js";
import { createDayNightController } from "./interactions/dayNight.js";
import { createSoundManager } from "./audio/soundManager.js";

// ---------------------------------------------------------------------------
// TODO: fill in your real personal info / links / file paths here.
// ---------------------------------------------------------------------------
const PROFILE_LINKS = [
  { id: "resume", icon: "📄", label: "Resume", href: "assets/documents/resume.pdf" },     // TODO: add your resume PDF
  { id: "linkedin", icon: "💼", label: "LinkedIn", href: "https://linkedin.com/in/your-handle" }, // TODO
  { id: "github", icon: "🐙", label: "GitHub", href: "https://github.com/your-handle" },   // TODO
  { id: "website", icon: "🌐", label: "Website", href: "https://your-website.example" },   // TODO
];

const DISPLAY_FRAMES = [
  {
    id: "degree",
    label: "Degree",
    image: "assets/textures/degree.jpg", // TODO: your degree scan
    title: "Degree",
    bodyHtml: `<p>Placeholder: replace with your actual degree image and details.</p>`,
  },
  {
    id: "diploma",
    label: "Diploma",
    image: "assets/textures/diploma.jpg", // TODO
    title: "Diploma",
    bodyHtml: `<p>Placeholder: replace with your actual diploma image and details.</p>`,
  },
  {
    id: "research",
    label: "Research",
    image: "assets/textures/research.jpg", // TODO
    title: "Research",
    bodyHtml: `<p>Placeholder: summarize your research work here (papers, projects, links to PDFs).</p>`,
  },
  {
    id: "events",
    label: "Presentations & Events",
    image: "assets/textures/events.jpg", // TODO
    title: "Presentations & Events",
    bodyHtml: `<p>Placeholder: list talks, posters, and conferences you've presented at.</p>`,
  },
  {
    id: "honors",
    label: "Honors",
    image: "assets/textures/honors.jpg", // TODO
    title: "Honors",
    bodyHtml: `<p>Placeholder: list honors/scholarships/recognitions here.</p>`,
  },
  {
    id: "leadership",
    label: "Leadership",
    image: "assets/textures/leadership.jpg", // TODO
    title: "Leadership",
    bodyHtml: `<p>Placeholder: describe leadership roles and club involvement here.</p>`,
  },
  {
    id: "awards",
    label: "Awards",
    image: "assets/textures/awards.jpg", // TODO
    title: "Awards",
    bodyHtml: `<p>Placeholder: list awards and competitions here.</p>`,
  },
];

// ---------------------------------------------------------------------------
// DOM references
// ---------------------------------------------------------------------------
const canvas = document.getElementById("scene");
const preloaderEl = document.getElementById("preloader");
const progressBarEl = document.getElementById("progress-bar");
const progressLabelEl = document.getElementById("progress-label");
const tooltipEl = document.getElementById("tooltip");
const modalOverlayEl = document.getElementById("modal-overlay");
const modalTitleEl = document.getElementById("modal-title");
const modalBodyEl = document.getElementById("modal-body");
const modalCloseEl = document.getElementById("modal-close");
const btnDayNight = document.getElementById("toggle-daynight");
const btnSound = document.getElementById("toggle-sound");
const btnReset = document.getElementById("reset-view");

// ---------------------------------------------------------------------------
// Renderer / scene / camera
// ---------------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcfe3f7);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.copy(DEFAULT_VIEW.position);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.copy(DEFAULT_VIEW.target);
controls.enableDamping = true;
controls.minDistance = 1;
controls.maxDistance = 9;
controls.maxPolarAngle = Math.PI * 0.49;
controls.update();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------------------------------------------------------------------------
// Lighting
// ---------------------------------------------------------------------------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
dirLight.position.set(4, 6, 3);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(1024, 1024);
scene.add(dirLight);

const fillLight = new THREE.PointLight(0xffd9a0, 0.4, 8);
fillLight.position.set(0, 1.6, -1);
scene.add(fillLight);

const dayNight = createDayNightController(scene, ambientLight, dirLight, fillLight);

// ---------------------------------------------------------------------------
// Room shell (floor / walls / ceiling) — simple boxes, easy to reskin.
// ---------------------------------------------------------------------------
const ROOM = { width: 8, height: 3, depth: 8 };

function buildRoom() {
  const room = new THREE.Group();

  const floorMat = new THREE.MeshStandardMaterial({ color: 0x8a6f52, roughness: 0.85 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.width, ROOM.depth), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  room.add(floor);

  const ceilMat = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 1 });
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.width, ROOM.depth), ceilMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = ROOM.height;
  room.add(ceiling);

  const wallMat = new THREE.MeshStandardMaterial({ color: 0xe8e2d5, roughness: 0.95 });

  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.width, ROOM.height), wallMat);
  backWall.position.set(0, ROOM.height / 2, -ROOM.depth / 2);
  backWall.receiveShadow = true;
  room.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.depth, ROOM.height), wallMat);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-ROOM.width / 2, ROOM.height / 2, 0);
  leftWall.receiveShadow = true;
  room.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.depth, ROOM.height), wallMat);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.set(ROOM.width / 2, ROOM.height / 2, 0);
  rightWall.receiveShadow = true;
  room.add(rightWall);

  return room;
}
scene.add(buildRoom());

// ---------------------------------------------------------------------------
// Wall decor: profile-link icons + textured display frames.
// Positions are laid out along the back wall; edit freely.
// ---------------------------------------------------------------------------
function buildWallDecor() {
  const group = new THREE.Group();
  const backZ = -ROOM.depth / 2 + 0.03;

  // Profile links row (top of back wall)
  const linkStartX = -1.2;
  PROFILE_LINKS.forEach((link, i) => {
    const frame = createIconFrame({ icon: link.icon, label: link.label });
    frame.position.set(linkStartX + i * 0.85, 2.35, backZ);
    frame.userData = { interactive: true, type: "link", label: link.label, payload: link };
    group.add(frame);
  });

  // Display frames row (degree / diploma / research / events / honors / leadership / awards)
  const displayStartX = -3.0;
  DISPLAY_FRAMES.forEach((item, i) => {
    const frame = createTexturedFrame({ imagePath: item.image, label: item.label });
    frame.position.set(displayStartX + i * 1.05, 1.35, backZ);
    frame.userData = { interactive: true, type: "display", label: item.label, payload: item };
    group.add(frame);
  });

  return group;
}
scene.add(buildWallDecor());

// ---------------------------------------------------------------------------
// Bookshelf project books
// ---------------------------------------------------------------------------
const bookGroup = createBookshelfBooks(BOOKSHELF_ITEMS, BOOKSHELF_ORIGIN, BOOKSHELF_SPACING);
scene.add(bookGroup);
let openBook = null;

// ---------------------------------------------------------------------------
// Furniture (optional GLB models with primitive fallbacks)
// ---------------------------------------------------------------------------
async function buildFurniture() {
  const results = await loadModels(MODEL_PLACEMENTS, (fraction) => {
    const pct = Math.round(fraction * 100);
    progressBarEl.style.width = `${pct}%`;
    progressLabelEl.textContent = `${pct}%`;
  });

  MODEL_PLACEMENTS.forEach((cfg) => {
    const loaded = results[cfg.id];
    let obj;
    if (loaded) {
      obj = loaded;
      obj.scale.setScalar(cfg.scale);
    } else {
      const [w, h, d] = cfg.fallbackSize;
      const geo = new THREE.BoxGeometry(w, h, d);
      const mat = new THREE.MeshStandardMaterial({ color: cfg.fallbackColor, roughness: 0.7 });
      obj = new THREE.Mesh(geo, mat);
      obj.position.y = h / 2;
    }
    obj.position.x += cfg.position[0];
    obj.position.y += cfg.position[1];
    obj.position.z += cfg.position[2];
    obj.rotation.set(...cfg.rotation);
    obj.castShadow = true;
    obj.receiveShadow = true;
    scene.add(obj);
  });
}

// ---------------------------------------------------------------------------
// Sound
// ---------------------------------------------------------------------------
const sound = createSoundManager();

// ---------------------------------------------------------------------------
// Modal helpers
// ---------------------------------------------------------------------------
function openModal(title, bodyHtml) {
  modalTitleEl.textContent = title;
  modalBodyEl.innerHTML = bodyHtml;
  modalOverlayEl.classList.remove("hidden");
}
function closeModal() {
  modalOverlayEl.classList.add("hidden");
}
modalCloseEl.addEventListener("click", closeModal);
modalOverlayEl.addEventListener("click", (e) => {
  if (e.target === modalOverlayEl) closeModal();
});

function handleInteractiveClick(object) {
  sound.playClick();
  const { type, payload } = object.userData;

  if (type === "link") {
    flyToObject(camera, controls, object);
    openModal(
      payload.label,
      `<p>Opens: <strong>${payload.href}</strong></p>
       <a class="btn" href="${payload.href}" target="_blank" rel="noopener">Open ${payload.label}</a>
       <div class="placeholder-note">Placeholder link — replace with your real ${payload.label} URL in main.js (PROFILE_LINKS).</div>`
    );
  } else if (type === "display") {
    flyToObject(camera, controls, object);
    openModal(
      payload.title,
      `${payload.bodyHtml}
       <img src="${payload.image}" alt="${payload.title}" onerror="this.style.display='none'" />
       <div class="placeholder-note">Placeholder content — replace the image at "${payload.image}" and the text in main.js (DISPLAY_FRAMES).</div>`
    );
  } else if (type === "book") {
    if (openBook && openBook !== object) pullOutBook(openBook, false);
    const isOpen = openBook === object;
    pullOutBook(object, !isOpen);
    openBook = isOpen ? null : object;

    flyToObject(camera, controls, object, new THREE.Vector3(0, 0.1, 0.9), 700);
    openModal(
      payload.title,
      `<p>${payload.description}</p>
       <a class="btn" href="${payload.link}" target="_blank" rel="noopener">View Project</a>`
    );
  }
}

// ---------------------------------------------------------------------------
// Raycasting (hover + click)
// ---------------------------------------------------------------------------
setupRaycaster({
  camera,
  scene,
  domElement: renderer.domElement,
  tooltipEl,
  onHover: () => sound.playHover(),
  onLeave: () => {},
  onClick: handleInteractiveClick,
});

// ---------------------------------------------------------------------------
// HUD buttons
// ---------------------------------------------------------------------------
btnDayNight.addEventListener("click", () => {
  const isNight = dayNight.toggle();
  btnDayNight.textContent = isNight ? "☀️" : "🌙";
});

btnSound.addEventListener("click", () => {
  const muted = sound.toggleMute();
  btnSound.textContent = muted ? "🔇" : "🔊";
});

btnReset.addEventListener("click", () => {
  if (openBook) {
    pullOutBook(openBook, false);
    openBook = null;
  }
  resetView(camera, controls);
});

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
async function init() {
  await buildFurniture();
  preloaderEl.classList.add("hidden");
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

init();
