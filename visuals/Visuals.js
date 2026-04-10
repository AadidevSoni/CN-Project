import * as THREE from "three";

// 🌐 great-circle curve
function createCurve(a, b) {
  const points = [];

  for (let i = 0; i <= 50; i++) {
    const t = i / 50;

    const p = new THREE.Vector3().lerpVectors(a, b, t);

    // push outward to follow globe
    p.normalize().multiplyScalar(1.05 + Math.sin(Math.PI * t) * 0.2);

    points.push(p);
  }

  return new THREE.CatmullRomCurve3(points);
}

// 🔗 CONNECTION LINE
export function drawConnection(earthMesh, a, b) {
  const curve = createCurve(a.mesh.position, b.mesh.position);

  const geo = new THREE.TubeGeometry(curve, 64, 0.005, 6);
  const mat = new THREE.MeshBasicMaterial({ color: 0x00ffff });

  const mesh = new THREE.Mesh(geo, mat);
  earthMesh.add(mesh);
}

// 📡 OSPF PATH
export function drawOSPFPath(earthMesh, path) {
  const points = [];

  path.forEach(n => {
    points.push(n.mesh.position.clone());
  });

  const curve = new THREE.CatmullRomCurve3(points);

  const geo = new THREE.TubeGeometry(curve, 100, 0.008, 8);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });

  const mesh = new THREE.Mesh(geo, mat);
  earthMesh.add(mesh);

  return curve;
}