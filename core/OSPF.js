export function findPath(nodes, start, end) {

  function getConnectedRouters(node) {
    return node.neighbors
      .filter(n => n.node.type === "ROUTER")
      .map(n => ({ node: n.node, weight: n.weight }));
  }

  let startRouters = [];
  let endRouters = [];

  if (start.type === "PC") {
    startRouters = getConnectedRouters(start);
    if (startRouters.length === 0) return null;
  } else {
    startRouters = [{ node: start, weight: 0 }];
  }

  if (end.type === "PC") {
    endRouters = getConnectedRouters(end);
    if (endRouters.length === 0) return null;
  } else {
    endRouters = [{ node: end, weight: 0 }];
  }

  const routers = nodes.filter(n => n.type === "ROUTER");

  const dist = new Map();
  const prev = new Map();
  const visited = new Set();

  routers.forEach(r => dist.set(r, Infinity));

  startRouters.forEach(r => {
    dist.set(r.node, r.weight);
  });

  while (true) {
    let current = null;
    let min = Infinity;

    for (let r of routers) {
      if (!visited.has(r) && dist.get(r) < min) {
        min = dist.get(r);
        current = r;
      }
    }

    if (!current) break;

    visited.add(current);

    for (let { node: neighbor, weight } of current.neighbors) {
      if (neighbor.type !== "ROUTER") continue; 

      const newDist = dist.get(current) + weight;

      if (newDist < dist.get(neighbor)) {
        dist.set(neighbor, newDist);
        prev.set(neighbor, current);
      }
    }
  }

  let bestEndRouter = null;
  let bestCost = Infinity;

  for (let r of endRouters) {
    const totalCost = dist.get(r.node) + r.weight;

    if (totalCost < bestCost) {
      bestCost = totalCost;
      bestEndRouter = r.node;
    }
  }

  if (!bestEndRouter || dist.get(bestEndRouter) === Infinity) return null;

  const routerPath = [];
  let curr = bestEndRouter;

  while (curr) {
    routerPath.unshift(curr);
    curr = prev.get(curr);
  }

  const finalPath = [];

  if (start.type === "PC") finalPath.push(start);

  finalPath.push(...routerPath);

  if (end.type === "PC") finalPath.push(end);

  return finalPath;
}