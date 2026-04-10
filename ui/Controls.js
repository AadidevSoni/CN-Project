export function setupControls() {
  let mode = "NONE";
  let selected = [];

  return {
    setMode: (m) => {
      mode = (mode === m) ? "NONE" : m;
      selected = [];
      return mode;
    },

    getMode: () => mode,

    addSelection: (node) => {
      selected.push(node);
      if (selected.length > 2) selected.shift();
      return selected;
    },

    clearSelection: () => selected = [],

    getSelected: () => selected
  };
}