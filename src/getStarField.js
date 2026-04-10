import * as THREE from "three";

export default function getStarfield({ numStars = 500 } = {}) {

  //Creates random points in spherical coordinates around the origin, like stars surrounding the Earth.
  function randomSpherePoint() {
    const radius = Math.random() * 25 + 25; // Radius between 25 and 50
    const u = Math.random(); // Random angle component
    const v = Math.random(); // Random angle component
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    let x = radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.sin(phi) * Math.sin(theta);
    let z = radius * Math.cos(phi);

    return {
      pos: new THREE.Vector3(x, y, z),
      hue: 0.6,
      minDist: radius,
    };
  }

  const verts = [];
  const colors = [];
  const positions = [];
  let col;

  //Star Generation Loop
  for (let i = 0; i < numStars; i += 1) {
    let p = randomSpherePoint();
    const { pos, hue } = p;
    positions.push(p);
    col = new THREE.Color().setHSL(hue, 0.2, Math.random()); //Uses HSL color with hue 0.6 (blue) and lightness randomized.
    verts.push(pos.x, pos.y, pos.z);
    colors.push(col.r, col.g, col.b);
  }

  //BufferGeometry is used for better performance with large numbers of objects.
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  //PointsMaterial is used for drawing small particles.
  const mat = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    map: new THREE.TextureLoader().load(
      "./textures/stars/circle.png"
    ),
  });
  const points = new THREE.Points(geo, mat); //THREE.Points creates a renderable group of points with the geometry and material.
  return points;
}