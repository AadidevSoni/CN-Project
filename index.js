//Imports
import * as THREE from "three";
import {OrbitControls} from "jsm/controls/OrbitControls.js";

import getStarField from "./src/getStarField.js";
import { getFresnelMat } from "./src/GetFresnelMat.js";

//Setup
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

//Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

//Earth 
const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);

const loader = new THREE.TextureLoader();
const geo = new THREE.SphereGeometry(1, 64, 64); // or even 128,128 for ultra-smoothness
const mat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/earthmap4k.jpg") 
});
const earthMesh = new THREE.Mesh(geo,mat);
earthGroup.add(earthMesh);

renderer.outputEncoding = THREE.sRGBEncoding;
mat.map.encoding = THREE.sRGBEncoding;

//Stars
const stars = getStarField({numStars: 10000});
scene.add(stars);

//Lights
const lightsMat = new THREE.MeshBasicMaterial({
  //color: 0x00ff00,
  //transparent: true,
  //opacity: 0.6,
  map: loader.load("./textures/earthlights4k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geo,lightsMat);
earthGroup.add(lightsMesh);

//Clouds
const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending, //To sit on top
  //alphaMap: loader.load("./textures/earthcloudmaptrans.jpg")
});
const cloudsMesh = new THREE.Mesh(geo, cloudsMat);
cloudsMesh.scale.setScalar(1.01);
earthGroup.add(cloudsMesh);

lightsMat.map.encoding = THREE.sRGBEncoding;
cloudsMat.map.encoding = THREE.sRGBEncoding;

//Glow
const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geo,fresnelMat);
glowMesh.scale.setScalar(1.02);
earthGroup.add(glowMesh);

//Lighting
const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

function animate() {
  requestAnimationFrame(animate);

  earthMesh.rotation.y += 0.002;

  //Rotating the lightMesh along with earth to remove glitchy green sphere
  lightsMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.0023;
  glowMesh.rotation.y += 0.002;

  controls.update();
  renderer.render(scene,camera);
}
animate();