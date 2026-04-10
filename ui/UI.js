export function setupUI(controls, network, connectNodes, ping, clearNetwork) {
  const ui = document.getElementById("ui");

  // 🌌 FUTURISTIC GLASS CSS
  const style = document.createElement("style");
  style.innerHTML = `
  #ui {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 10;
    font-family: 'Orbitron', sans-serif;
  }

  .glass-panel {
    width: 260px;
    padding: 15px;
    border-radius: 16px;
    backdrop-filter: blur(20px);
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(0, 255, 255, 0.2);
    box-shadow:
      0 0 20px rgba(0,255,255,0.2),
      inset 0 0 10px rgba(0,255,255,0.1);
  }

  .title {
    text-align: center;
    color: cyan;
    font-size: 14px;
    letter-spacing: 1px;
    margin-bottom: 12px;
    text-shadow: 0 0 10px cyan;
  }

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
  }

  .btn {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 8px;
    background: rgba(0,0,0,0.6);
    color: cyan;
    cursor: pointer;
    transition: 0.25s;
    font-size: 12px;
    box-shadow: 0 0 8px rgba(0,255,255,0.3);
  }

  .btn:hover {
    transform: scale(1.08);
    box-shadow: 0 0 15px cyan;
  }

  .btn.active {
    background: cyan;
    color: black;
    box-shadow: 0 0 20px cyan;
  }

  .btn.danger {
    color: red;
    box-shadow: 0 0 10px rgba(255,0,0,0.4);
  }

  .panel {
    background: rgba(0,0,0,0.5);
    padding: 10px;
    border-radius: 10px;
    color: white;
    border: 1px solid rgba(255,255,255,0.15);
    font-size: 12px;
    min-height: 50px;
  }

  /* Glow animation */
  .glass-panel::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 16px;
    background: linear-gradient(120deg, transparent, rgba(0,255,255,0.2), transparent);
    opacity: 0.2;
    pointer-events: none;
  }
  `;
  document.head.appendChild(style);

  // 🌌 HTML STRUCTURE
  ui.innerHTML = `
  <div class="glass-panel">
    <div class="title">🌐 OSPF SIMULATOR</div>

    <div class="toolbar">
      <button class="btn" id="pc">PC</button>
      <button class="btn" id="router">Router</button>
      <button class="btn" id="select">Select</button>
      <button class="btn" id="connect">Connect</button>
      <button class="btn" id="ping">Ping</button>
      <button class="btn danger" id="clear">Clear</button>
    </div>

    <div class="panel" id="panel">
      Click a node to view details
    </div>
  </div>
  `;

  const panel = document.getElementById("panel");

  // ⚠️ FIX: only toolbar buttons
  const buttons = document.querySelectorAll(".toolbar .btn");

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
  document.getElementById("connect").onclick = (e) => setActive(e.target, "CONNECT");

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
        <b style="color:cyan">${node.type}</b><br>
        <span style="color:#aaa">IP:</span> ${node.ip}
      `;
    }
  };
}