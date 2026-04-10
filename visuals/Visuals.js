import * as THREE from "three";

// ==============================
// 🌐 CREATE CURVE (REUSABLE)
// ==============================
function createCurve(a, b) {
  const points = [];

  for (let i = 0; i <= 80; i++) {
    const t = i / 80;

    const p = new THREE.Vector3().lerpVectors(a, b, t);

    // push outward to follow globe curvature
    p.normalize().multiplyScalar(1.05 + Math.sin(Math.PI * t) * 0.25);

    points.push(p);
  }

  return new THREE.CatmullRomCurve3(points);
}

// ==============================
// 🖥️ CREATE NODE (PC / ROUTER)
// ==============================
export function createNodeMesh(type) {
  let color;

  if (type === "PC") color = 0x00ff88;       // neon green
  else if (type === "ROUTER") color = 0xff4444; // soft red
  else color = 0xffffff;

  const geometry = new THREE.SphereGeometry(0.035, 16, 16);
  const material = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.5
  });

  const mesh = new THREE.Mesh(geometry, material);

  // IMPORTANT for click detection
  mesh.userData.node = null;

  return mesh;
}

// ==============================
// 🔗 DRAW CONNECTION (NORMAL LINK)
// ==============================
export function drawConnection(earthMesh, a, b, weight = 1) {
  const curve = createCurve(a.mesh.position, b.mesh.position);

  // 🔗 LINE
  const geo = new THREE.TubeGeometry(curve, 64, 0.004, 6);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.7
  });

  const mesh = new THREE.Mesh(geo, mat);
  earthMesh.add(mesh); // ✅ FIXED

  // ==============================
  // 🏷️ WEIGHT LABEL (BETTER VERSION)
  // ==============================

  const mid = curve.getPointAt(0.5);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 256;
  canvas.height = 128;

  ctx.fillStyle = "white";
  ctx.font = "bold 48px Arial";
  ctx.textAlign = "center";
  ctx.fillText(weight.toString(), 128, 64);

  const texture = new THREE.CanvasTexture(canvas);

  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true
  });

  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.position.copy(mid);
  sprite.scale.set(0.3, 0.15, 1);

  earthMesh.add(sprite);

  return curve;
}

// ==============================
// 📡 DRAW OSPF PATH (HIGHLIGHT)
// ==============================
export function drawOSPFPath(earthMesh, path) {
  const points = path.map(n => n.mesh.position.clone());

  const curve = new THREE.CatmullRomCurve3(points);

  const geo = new THREE.TubeGeometry(curve, 100, 0.007, 8);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    emissive: 0xffff00
  });

  const mesh = new THREE.Mesh(geo, mat);
  earthMesh.add(mesh);

  return curve;
}

// ==============================
// 🚀 PACKET ANIMATION (UPGRADED)
// ==============================
export function animatePacket(scene, curve) {
  const geometry = new THREE.SphereGeometry(0.02, 12, 12);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  const packet = new THREE.Mesh(geometry, material);
  scene.add(packet);

  let t = 0;

  function animate() {
    t += 0.008; // slower = smoother

    if (t > 1) {
      scene.remove(packet);
      return;
    }

    const pos = curve.getPointAt(t);
    packet.position.copy(pos);

    requestAnimationFrame(animate);
  }

  animate();
}