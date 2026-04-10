import * as THREE from "three";

function createCurve(a, b) {
  const points = [];

  for (let i = 0; i <= 80; i++) {
    const t = i / 80;

    const p = new THREE.Vector3().lerpVectors(a, b, t);

    p.normalize().multiplyScalar(1.05 + Math.sin(Math.PI * t) * 0.25);

    points.push(p);
  }

  return new THREE.CatmullRomCurve3(points);
}

export function createNodeMesh(type) {
  let color;

  if (type === "PC") color = 0x00ff88;     
  else if (type === "ROUTER") color = 0xff4444; 
  else color = 0xffffff;

  const geometry = new THREE.SphereGeometry(0.035, 16, 16);
  const material = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.5
  });

  const mesh = new THREE.Mesh(geometry, material);

  mesh.userData.node = null;

  return mesh;
}

export function drawConnection(earthMesh, a, b, weight) {
  const curve = createCurve(a.mesh.position, b.mesh.position);

  const mesh = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 64, 0.005, 6),
    new THREE.MeshBasicMaterial({ color: 0x00ffff })
  );

  earthMesh.add(mesh);

  const mid = curve.getPointAt(0.5);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 256;
  canvas.height = 128;

  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.fillText(weight, 80, 70);

  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));

  sprite.scale.set(0.3, 0.15, 1);
  sprite.position.copy(mid);

  earthMesh.add(sprite);

  return { mesh, label: sprite, curve };
}

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

export function animatePacket(scene, curve) {
  const geometry = new THREE.SphereGeometry(0.02, 12, 12);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  const packet = new THREE.Mesh(geometry, material);
  scene.add(packet);

  let t = 0;

  function animate() {
    t += 0.008; 

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