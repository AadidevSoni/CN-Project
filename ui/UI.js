export function setupUI(controls, network, connectNodes, ping) {
  const ui = document.getElementById("ui");

  if (!ui) {
    console.error("❌ UI div not found. Add <div id='ui'></div> in HTML");
    return {
      showNode: () => {}
    };
  }

  ui.innerHTML = `
    <button id="pc">Add PC</button>
    <button id="router">Add Router</button>
    <button id="select">Select</button>
    <button id="connect">Connect</button>
    <button id="ping">Ping</button>

    <div id="panel"></div>
  `;

  const panel = document.getElementById("panel");

  document.getElementById("pc").onclick = () => controls.setMode("PC");
  document.getElementById("router").onclick = () => controls.setMode("ROUTER");
  document.getElementById("select").onclick = () => controls.setMode("SELECT");

  document.getElementById("connect").onclick = () => {
    const [a, b] = controls.getSelected();
    if (a && b) {
      connectNodes(a, b);
      controls.clear();
    }
  };

  document.getElementById("ping").onclick = () => {
    const ip1 = prompt("Source IP");
    const ip2 = prompt("Destination IP");
    ping(ip1, ip2);
  };

  return {
    showNode: (node) => {
      panel.innerHTML = `
        <b>${node.type}</b><br>
        IP: ${node.ip}
      `;
    }
  };
}