/* Glossary Search and Filtering */
const TERMS = [
  ['Superposition', 'A qubit existing in a combination of |0⟩ and |1⟩ simultaneously, until measured.'],
  ['Entanglement', 'A correlation between qubits so strong that measuring one instantly determines information about the other.'],
  ['Decoherence', 'The loss of quantum information to the environment, collapsing superposition into classical noise.'],
  ['Ansatz', 'A parameterized circuit structure used as a starting guess in variational algorithms like VQE.'],
  ['Bloch Sphere', 'A geometric representation of a single qubit\'s pure state as a point on a unit sphere.'],
  ['Hadamard Gate', 'A gate that creates equal superposition from a basis state — the "coin flip" of quantum computing.'],
  ['CNOT Gate', 'A two-qubit gate that flips a target qubit only when the control qubit is |1⟩ — the standard entangler.'],
  ['QAOA', 'Quantum Approximate Optimization Algorithm — a hybrid method for combinatorial optimization problems.'],
  ['Coherence Time (T1/T2)', 'How long a qubit retains useful quantum information before decohering.'],
  ['Quantum Volume', 'A benchmark combining qubit count, connectivity, and error rates into a single hardware metric.'],
  ['Fidelity', 'A measure of how closely an executed quantum operation matches its ideal, noiseless version.'],
  ['Grover\'s Algorithm', 'A quantum search algorithm offering quadratic speedup over classical unstructured search.']
];

function initGlossary() {
  const gEl = document.getElementById('gloss-grid');
  const searchEl = document.getElementById('gloss-search');
  if (!gEl) return;

  function renderGlossary(filter = '') {
    gEl.innerHTML = '';
    TERMS.filter(([t, d]) => (t + d).toLowerCase().includes(filter.toLowerCase())).forEach(([t, d]) => {
      const div = document.createElement('div');
      div.className = 'panel gloss-item';
      div.innerHTML = `<div class="term">${t}</div><div class="def">${d}</div>`;
      gEl.appendChild(div);
    });
  }

  renderGlossary();
  if (searchEl) {
    searchEl.addEventListener('input', e => renderGlossary(e.target.value));
  }
}
