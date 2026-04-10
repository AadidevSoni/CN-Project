export function findPath(nodes, start, end) {
  // ❌ RULE: PC → PC must pass through router
  if (start.type === "PC" && end.type === "PC") {
    const hasRouter = nodes.some(n => n.type === "ROUTER");
    if (!hasRouter) return null;
  }

  const dist = new Map();
  const prev = new Map();
  const visited = new Set();

  nodes.forEach(n => dist.set(n, Infinity));
  dist.set(start, 0);

  while (true) {
    let current = null;
    let minDist = Infinity;

    for (let n of nodes) {
      if (!visited.has(n) && dist.get(n) < minDist) {
        minDist = dist.get(n);
        current = n;
      }
    }

    if (!current) break;
    if (current === end) break;

    visited.add(current);

    for (let { node: neighbor, weight } of current.neighbors || []) {
      const newDist = dist.get(current) + weight;

      if (newDist < dist.get(neighbor)) {
        dist.set(neighbor, newDist);
        prev.set(neighbor, current);
      }
    }
  }

  // ❌ No path
  if (!prev.has(end)) return null;

  // reconstruct path
  const path = [];
  let curr = end;

  while (curr) {
    path.unshift(curr);
    curr = prev.get(curr);
  }

  // ✅ RULE: ensure router exists in path (for PC → PC)
  if (start.type === "PC" && end.type === "PC") {
    const hasRouterInPath = path.some(n => n.type === "ROUTER");
    if (!hasRouterInPath) return null;
  }

  return path;
}