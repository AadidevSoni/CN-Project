class Network {
  generateIP() {
    const base = "192.168.0.";
    return base + (this.nodes.length + 1);
  }

  findByIP(ip) {
    return this.nodes.find(n => n.ip === ip);
  }

  constructor() {
    this.nodes = [];
    this.edges = new Map(); // adjacency list
  }

  addNode(type, mesh) {
  const ip = this.generateIP();

  const node = {
    id: this.nodes.length,
    type,
    mesh,
    ip, // ✅ ADD THIS
    neighbors: []
  };

  mesh.userData.node = node;

  this.nodes.push(node);
  this.edges.set(node, []);

  return node;
}

  connect(a, b, weight = 1) {
    this.edges.get(a).push({ node: b, weight });
    this.edges.get(b).push({ node: a, weight });
  }
}

export { Network };