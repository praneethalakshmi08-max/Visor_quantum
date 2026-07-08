/* Circuit Composer Simulation Logic */
const COLS = 6;
let selectedGate = 'H';
let circuit = Array.from({ length: COLS }, () => ({
  q0: null, q1: null, cnotCtrl: null, cnotTgt: null
}));

function setupPalette() {
  document.querySelectorAll('.palette button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.palette button').forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
      selectedGate = btn.dataset.g;
    });
  });
  const first = document.querySelector('.palette button[data-g="H"]');
  if (first) first.classList.add('sel');
}

function renderCircuit() {
  const wiresEl = document.getElementById('circuit-wires');
  if (!wiresEl) return;
  wiresEl.innerHTML = '';

  [0, 1].forEach(row => {
    const qrow = document.createElement('div');
    qrow.className = 'qrow';

    const lbl = document.createElement('div');
    lbl.className = 'qlabel';
    lbl.textContent = `|q${row}⟩`;
    qrow.appendChild(lbl);

    const wire = document.createElement('div');
    wire.className = 'wire';

    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      const colData = circuit[c];

      if (colData.cnotCtrl === row) {
        cell.classList.add('ctrl');
        cell.textContent = '●';
      } else if (colData.cnotTgt === row) {
        cell.classList.add('tgt');
        cell.textContent = '⊕';
      } else {
        const g = row === 0 ? colData.q0 : colData.q1;
        if (g) {
          cell.classList.add('filled');
          cell.textContent = g;
        } else {
          cell.textContent = '+';
        }
      }

      cell.addEventListener('click', () => handleCellClick(row, c));
      wire.appendChild(cell);
    }

    qrow.appendChild(wire);
    wiresEl.appendChild(qrow);
  });
}

function handleCellClick(row, c) {
  const col = circuit[c];
  if (selectedGate === 'ERASE') {
    col.q0 = null; col.q1 = null;
    col.cnotCtrl = null; col.cnotTgt = null;
  } else if (selectedGate === 'CNOT') {
    if (col.cnotCtrl === null && col.cnotTgt === null) {
      col.cnotCtrl = row;
    } else if (col.cnotCtrl !== null && col.cnotCtrl !== row && col.cnotTgt === null) {
      col.cnotTgt = row;
    } else {
      col.cnotCtrl = null; col.cnotTgt = null;
    }
  } else {
    const key = row === 0 ? 'q0' : 'q1';
    col[key] = col[key] === selectedGate ? null : selectedGate;
  }
  renderCircuit();
}

function applyGate2(state, M, qubit) {
  const ns = [C.fromReal(0), C.fromReal(0), C.fromReal(0), C.fromReal(0)];
  for (let i = 0; i < 4; i++) {
    const bits = [(i >> 1) & 1, i & 1];
    const b = bits[qubit];
    for (let nb = 0; nb < 2; nb++) {
      const coeff = M[nb][b];
      if (coeff.re === 0 && coeff.im === 0) continue;
      const nbits = bits.slice();
      nbits[qubit] = nb;
      const j = nbits[0] * 2 + nbits[1];
      ns[j] = C.add(ns[j], C.mul(coeff, state[i]));
    }
  }
  return ns;
}

function applyCNOT2(state, ctrl, tgt) {
  const ns = [C.fromReal(0), C.fromReal(0), C.fromReal(0), C.fromReal(0)];
  for (let i = 0; i < 4; i++) {
    const bits = [(i >> 1) & 1, i & 1];
    if (bits[ctrl] === 1) {
      bits[tgt] = 1 - bits[tgt];
    }
    const j = bits[0] * 2 + bits[1];
    ns[j] = state[i];
  }
  return ns;
}

function runCircuitSimulation() {
  let state = [C.fromReal(1), C.fromReal(0), C.fromReal(0), C.fromReal(0)]; // |00>

  for (let c = 0; c < COLS; c++) {
    const col = circuit[c];
    if (col.q0 && GATES[col.q0]) state = applyGate2(state, GATES[col.q0], 0);
    if (col.q1 && GATES[col.q1]) state = applyGate2(state, GATES[col.q1], 1);
    if (col.cnotCtrl !== null && col.cnotTgt !== null) {
      state = applyCNOT2(state, col.cnotCtrl, col.cnotTgt);
    }
  }

  const probs = state.map(c => C.abs2(c));
  const labels = ['|00⟩', '|01⟩', '|10⟩', '|11⟩'];

  const histEl = document.getElementById('hist-bars');
  if (histEl) {
    histEl.innerHTML = probs.map((p, i) => `
      <div class="hist-col">
        <div class="hist-bar" style="height:${(p * 100).toFixed(1)}%;"></div>
        <div class="hist-label">${labels[i]}<br><b>${(p * 100).toFixed(0)}%</b></div>
      </div>
    `).join('');
  }

  const ampEl = document.getElementById('amp-list');
  if (ampEl) {
    ampEl.innerHTML = state.map((c, i) => {
      const mag = Math.sqrt(C.abs2(c)).toFixed(2);
      const phase = (C.phase(c) * 180 / Math.PI).toFixed(0);
      return `<div>${labels[i]} : <b>amp = ${mag}</b> (phase ${phase}°)</div>`;
    }).join('');
  }
}

function setupComposerControls() {
  setupPalette();
  renderCircuit();

  const runBtn = document.getElementById('run-circuit-btn');
  if (runBtn) runBtn.addEventListener('click', runCircuitSimulation);

  const clearBtn = document.getElementById('clear-circuit-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      circuit = Array.from({ length: COLS }, () => ({ q0: null, q1: null, cnotCtrl: null, cnotTgt: null }));
      renderCircuit();
      document.getElementById('hist-bars').innerHTML = '';
      document.getElementById('amp-list').innerHTML = '';
    });
  }
}
