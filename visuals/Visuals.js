import * as THREE from "three";

export function createNodeMesh(type) {
  const colors = {
    PC: 0x00ff00,
    ROUTER: 0xff0000
  };

  return new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 16, 16),
    new THREE.MeshBasicMaterial({ color: colors[type] })
  );
}

export function drawCurvedPath(earthMesh, path) {
  const points = path.map(n =>
    n.mesh.position.clone().normalize().multiplyScalar(1.3)
  );

  const curve = new THREE.CatmullRomCurve3(points);

  const geo = new THREE.TubeGeometry(curve, 64, 0.01, 8);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });

  const mesh = new THREE.Mesh(geo, mat);
  earthMesh.add(mesh);

  return curve;
}

export function animatePacket(scene, curve) {
  const packet = new THREE.Mesh(
    new THREE.SphereGeometry(0.02),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
  );

  scene.add(packet);

  let t = 0;

  function step() {
    t += 0.005;
    packet.position.copy(curve.getPoint(t));

    if (t < 1) requestAnimationFrame(step);
  }

  step();
}