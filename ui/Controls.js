export function setupControls() {
  let mode = "SELECT";
  let selected = [];

  return {
    setMode: (m) => {
      mode = m;
      selected = [];
    },

    getMode: () => mode,

    addSelection: (node) => {
      selected.push(node);
      if (selected.length > 2) selected.shift();
    },

    getSelected: () => selected,

    clear: () => selected = []
  };
}