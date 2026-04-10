export class Network {
  constructor() {
    this.nodes = [];
    this.ipCounter = 1;
  }

  addNode(type, mesh) {
    const node = {
      id: this.nodes.length,
      type,
      ip: `192.168.1.${this.ipCounter++}`,
      neighbors: [],
      mesh
    };

    mesh.userData.node = node;
    this.nodes.push(node);
    return node;
  }

  connect(a, b) {
    const cost = a.mesh.position.distanceTo(b.mesh.position);

    a.neighbors.push({ node: b, cost });
    b.neighbors.push({ node: a, cost });
  }

  findByIP(ip) {
    return this.nodes.find(n => n.ip === ip);
  }
}