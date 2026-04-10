export function setupUI(controls, network, connectNodes, ping, clearNetwork) {
  const ui = document.getElementById("ui");

  // 🌌 FUTURE CSS
  const style = document.createElement("style");
  style.innerHTML = `
    #ui {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-family: 'Orbitron', sans-serif;
    }

    .toolbar {
      display: flex;
      gap: 10px;
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(10px);
      padding: 10px;
      border-radius: 12px;
      border: 1px solid rgba(0,255,255,0.2);
    }

    .btn {
      padding: 8px 12px;
      border: none;
      border-radius: 8px;
      background: rgba(0,0,0,0.6);
      color: cyan;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 0 8px rgba(0,255,255,0.3);
    }

    .btn:hover {
      transform: scale(1.1);
      box-shadow: 0 0 15px cyan;
    }

    .btn.active {
      background: cyan;
      color: black;
      box-shadow: 0 0 20px cyan;
    }

    #panel {
      background: rgba(0,0,0,0.5);
      padding: 10px;
      border-radius: 10px;
      color: white;
      border: 1px solid rgba(255,255,255,0.2);
      min-width: 150px;
    }
  `;
  document.head.appendChild(style);

  // 🌌 HTML
  ui.innerHTML = `
  <div class="toolbar">
    <button class="btn" id="pc">PC</button>
    <button class="btn" id="router">Router</button>
    <button class="btn" id="select">Select</button>
    <button class="btn" id="connect">Connect</button>
    <button class="btn" id="ping">Ping</button>
    <button class="btn" id="clear">Clear</button>
  </div>

  <div id="panel">Select a node</div>
`;

  const panel = document.getElementById("panel");
  const buttons = document.querySelectorAll(".btn");

  function setActive(btn, mode) {
    buttons.forEach(b => b.classList.remove("active"));
    const current = controls.setMode(mode);

    if (current !== "NONE") {
      btn.classList.add("active");
    }
  }

  // 🎮 BUTTON LOGIC
  document.getElementById("pc").onclick = (e) => setActive(e.target, "PC");
  document.getElementById("router").onclick = (e) => setActive(e.target, "ROUTER");
  document.getElementById("select").onclick = (e) => setActive(e.target, "SELECT");

  document.getElementById("connect").onclick = (e) => {
    setActive(e.target, "CONNECT");
  };

  document.getElementById("ping").onclick = () => {
    const ip1 = prompt("Source IP");
    const ip2 = prompt("Destination IP");
    ping(ip1, ip2);
  };

  document.getElementById("clear").onclick = () => {
    clearNetwork();
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