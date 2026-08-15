/* ============================================================
   3D print viewer — three.js + STLLoader + OrbitControls.
   Reads the model registry from js/models-list.js (window.MODELS).
   Models render in "printed PLA" orange on a drafting grid.
   ============================================================ */

import * as THREE from "three";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const stage = document.getElementById("stage");
const msg = document.getElementById("viewer-msg");
const listEl = document.getElementById("model-list");
const nameEl = document.getElementById("m-name");
const matEl = document.getElementById("m-mat");
const descEl = document.getElementById("m-desc");
const dlEl = document.getElementById("m-download");

const models = window.MODELS || [];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* --- renderer / scene / camera --- */

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 4 / 3, 0.1, 5000);

scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa6b0, 1.2));
const key = new THREE.DirectionalLight(0xffffff, 1.6);
key.position.set(60, 90, 50);
scene.add(key);
const fill = new THREE.DirectionalLight(0xffffff, 0.5);
fill.position.set(-50, 30, -60);
scene.add(fill);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.autoRotate = !reducedMotion;
controls.autoRotateSpeed = 1.4;
controls.addEventListener("start", () => {
  controls.autoRotate = false; // stop spinning once the visitor takes over
});

const material = new THREE.MeshPhongMaterial({
  color: 0xe8590c,
  specular: 0x2a2a2a,
  shininess: 30,
  flatShading: true
});

const loader = new STLLoader();
let mesh = null;
let grid = null;

/* --- helpers --- */

function setMsg(text) {
  if (text) {
    msg.textContent = text;
    msg.hidden = false;
  } else {
    msg.hidden = true;
  }
}

function clearModel() {
  if (mesh) {
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh = null;
  }
  if (grid) {
    scene.remove(grid);
    grid.geometry.dispose();
    grid.material.dispose();
    grid = null;
  }
}

/* Orient the part (STL is Z-up, three.js is Y-up), rest it on the
   grid, and frame the camera to fit. */
function frame(geometry) {
  geometry.rotateX(-Math.PI / 2);
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  const center = new THREE.Vector3();
  box.getCenter(center);
  geometry.translate(-center.x, -box.min.y, -center.z);

  geometry.computeBoundingBox();
  const size = new THREE.Vector3();
  geometry.boundingBox.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);

  const gridSize = Math.max(40, Math.ceil((Math.max(size.x, size.z) * 1.8) / 10) * 10);
  grid = new THREE.GridHelper(gridSize, 24, 0xb9c4cc, 0xdde4e9);
  scene.add(grid);

  const d = maxDim * 2.2;
  camera.position.set(d * 0.8, d * 0.65, d * 0.9);
  camera.near = maxDim / 100;
  camera.far = maxDim * 100;
  camera.updateProjectionMatrix();

  controls.target.set(0, size.y * 0.45, 0);
  controls.minDistance = maxDim * 0.6;
  controls.maxDistance = maxDim * 6;
  controls.update();
}

function loadModel(index) {
  const m = models[index];
  if (!m) return;

  const buttons = listEl.querySelectorAll(".model-btn");
  buttons.forEach((b, i) => b.classList.toggle("active", i === index));

  nameEl.textContent = m.name;
  matEl.textContent = m.material || "";
  descEl.textContent = m.desc || "";
  dlEl.href = encodeURI(m.file);

  setMsg("Loading model…");
  loader.load(
    encodeURI(m.file),
    (geometry) => {
      clearModel();
      frame(geometry);
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      setMsg(null);
    },
    undefined,
    () => {
      if (window.location.protocol === "file:") {
        setMsg(
          "The viewer cannot load models from a double-clicked file. " +
          "Start a local server first — see README.md."
        );
      } else {
        setMsg(
          "Could not load \"" + m.file + "\". " +
          "Check that the file is in the models/ folder, and that the name in " +
          "js/models-list.js matches the file name exactly, including capital letters."
        );
      }
    }
  );
}

/* --- sizing --- */

function resize() {
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage);
resize();

renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});

/* --- build the model list --- */

if (!models.length) {
  setMsg("No models yet. Add STL files to models/ and list them in js/models-list.js.");
} else {
  models.forEach((m, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "model-btn";
    const name = document.createElement("span");
    name.className = "mb-name";
    name.textContent = m.name;
    const file = document.createElement("span");
    file.className = "mb-file";
    file.textContent = m.file.split("/").pop();
    b.append(name, file);
    b.addEventListener("click", () => loadModel(i));
    listEl.appendChild(b);
  });
  loadModel(0);
}
