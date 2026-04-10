export class Network {
  constructor() {
    this.nodes = [];
    this.links = [];
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

  connect(a, b, mesh, weight, label, curve) {
  weight = Number(weight);

  a.neighbors.push({ node: b, weight });
  b.neighbors.push({ node: a, weight });

  this.links.push({ a, b, mesh, weight, label, curve });
}

  findByIP(ip) {
    return this.nodes.find(n => n.ip === ip);
  }

  clear() {
    this.nodes = [];
    this.links = [];
    this.ipCounter = 1;
  }
}