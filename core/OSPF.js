export function findPath(nodes, start, end) {
  const dist = {};
  const prev = {};
  const visited = new Set();

  nodes.forEach(n => {
    dist[n.id] = Infinity;
    prev[n.id] = null;
  });

  dist[start.id] = 0;

  while (visited.size < nodes.length) {
    let u = null;

    nodes.forEach(n => {
      if (!visited.has(n.id) && (u === null || dist[n.id] < dist[u.id])) {
        u = n;
      }
    });

    if (!u) break;
    visited.add(u.id);

    u.neighbors.forEach(({ node, cost }) => {
      const alt = dist[u.id] + cost;
      if (alt < dist[node.id]) {
        dist[node.id] = alt;
        prev[node.id] = u;
      }
    });
  }

  let path = [];
  let curr = end;

  while (curr) {
    path.unshift(curr);
    curr = prev[curr.id];
  }

  return path;
}