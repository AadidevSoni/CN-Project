// ==============================
// IMPORTS
// ==============================
import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

import getStarField from "./src/getStarField.js";
import { getFresnelMat } from "./src/GetFresnelMat.js";

import { Network } from "./core/Network.js";
import { findPath } from "./core/OSPF.js";
import {
  createNodeMesh,
  drawConnection,
  drawOSPFPath,
  animatePacket
} from "./visuals/Visuals.js";
import { setupControls } from "./ui/Controls.js";
import { setupUI } from "./ui/UI.js";

// ==============================
// BASIC SETUP (FIXED)
// ==============================
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// resize fix
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==============================
// CONTROLS
// ==============================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// ==============================
// EARTH (UNCHANGED)
// ==============================
const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);

const loader = new THREE.TextureLoader();
const geo = new THREE.SphereGeometry(1, 64, 64);

const mat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/earthmap4k.jpg")
});

const earthMesh = new THREE.Mesh(geo, mat);
earthGroup.add(earthMesh);

renderer.outputEncoding = THREE.sRGBEncoding;
mat.map.encoding = THREE.sRGBEncoding;

// Stars
const stars = getStarField({ numStars: 10000 });
scene.add(stars);

// Lights
const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/earthlights4k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geo, lightsMat);
earthGroup.add(lightsMesh);

// Clouds
const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
});
const cloudsMesh = new THREE.Mesh(geo, cloudsMat);
cloudsMesh.scale.setScalar(1.01);
earthGroup.add(cloudsMesh);

lightsMat.map.encoding = THREE.sRGBEncoding;
cloudsMat.map.encoding = THREE.sRGBEncoding;

// Glow
const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geo, fresnelMat);
glowMesh.scale.setScalar(1.02);
earthGroup.add(glowMesh);

// Light
const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

// ==============================
// NETWORK SYSTEM
// ==============================
const network = new Network();
const controlsState = setupControls();
const ui = setupUI(controlsState, network, connectNodes, ping);

// ==============================
// RAYCASTER
// ==============================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// ==============================
// CREATE NODE
// ==============================
function createNode(point, type) {
  const mesh = createNodeMesh(type);

  // convert world → local (CRITICAL)
  const local = earthMesh.worldToLocal(point.clone());
  const dir = local.clone().normalize();

  mesh.position.copy(dir.multiplyScalar(1.02));

  earthMesh.add(mesh);

  return network.addNode(type, mesh);
}

// ==============================
// CONNECT NODES
// ==============================
function connectNodes(a, b) {
  network.connect(a, b);
}

// ==============================
// PING (OSPF)
// ==============================
function ping(ip1, ip2) {
  let n1 = network.findByIP(ip1);
  let n2 = network.findByIP(ip2);

  if (!n1 || !n2) {
    const selected = controlsState.getSelected();
    if (selected.length < 2) return alert("Select 2 nodes or enter IPs");
    [n1, n2] = selected;
  }

  const path = findPath(network.nodes, n1, n2);

  const curve = drawOSPFPath(earthMesh, path);
  animatePacket(scene, curve);
}

// ==============================
// CLICK HANDLING
// ==============================
window.addEventListener("click", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const hits = raycaster.intersectObjects(scene.children, true);

  if (hits.length > 0) {
    const obj = hits[0].object;

    if (obj.userData.node) {
      const node = obj.userData.node;
      const mode = controlsState.getMode();

      const selected = controlsState.addSelection(node);
      ui.showNode(node);

      // 🔗 CONNECT MODE
      if (mode === "CONNECT" && selected.length === 2) {
        connectNodes(selected[0], selected[1]);

        drawConnection(earthMesh, selected[0], selected[1]);

        controlsState.clearSelection();
      }

      return;
    }
  }

  const earthHit = raycaster.intersectObject(earthMesh);

  if (earthHit.length > 0) {
    const mode = controlsState.getMode();

    if (mode === "PC" || mode === "ROUTER") {
      createNode(earthHit[0].point, mode);
    }
  }
});

// ==============================
// ANIMATION LOOP (UNCHANGED + SAFE)
// ==============================
function animate() {
  requestAnimationFrame(animate);

  earthMesh.rotation.y += 0.002;
  lightsMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.0023;
  glowMesh.rotation.y += 0.002;

  controls.update();
  renderer.render(scene, camera);
}

animate();