/* Main App Entry Point & Single-Qubit Bloch State Logic */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Bloch Spheres
  const heroCanvas = document.getElementById('bloch-canvas-hero');
  const mainCanvas = document.getElementById('bloch-canvas');

  const heroScene = heroCanvas ? makeBlochScene(heroCanvas) : null;
  const mainScene = mainCanvas ? makeBlochScene(mainCanvas) : null;

  // Qubit State: Initialized to |0>
  let qstate = [{ re: 1, im: 0 }, { re: 0, im: 0 }];

  function fmt(c) {
    const s = (n) => (n >= 0 ? '' : '−') + Math.abs(n).toFixed(2);
    if (Math.abs(c.im) < 0.005) return s(c.re);
    return `${s(c.re)}${c.im >= 0 ? '+' : '−'}${Math.abs(c.im).toFixed(2)}i`;
  }

  function updateReadouts() {
    const b = blochFromState(qstate);
    if (mainScene) mainScene.setTargetFromBloch(b);
    if (heroScene) heroScene.setTargetFromBloch(b);

    const p0 = (C.abs2(qstate[0]) * 100).toFixed(0);
    const p1 = (C.abs2(qstate[1]) * 100).toFixed(0);

    const readout = document.getElementById('state-readout');
    if (readout) {
      readout.innerHTML = `|ψ ⟩ = <b>${fmt(qstate[0])}</b>|0 ⟩ + <b>${fmt(qstate[1])}</b>|1 ⟩ &nbsp;·&nbsp; P(0)=<b>${p0}%</b> P(1)=<b>${p1}%</b>`;
    }

    const heroBasis = document.getElementById('hero-basis');
    if (heroBasis) {
      heroBasis.textContent = `|ψ ⟩ = ${fmt(qstate[0])}|0 ⟩ + ${fmt(qstate[1])}|1 ⟩`;
    }
  }

  // Bind single-qubit gate buttons
  document.querySelectorAll('.gatebtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const g = btn.dataset.gate;
      if (g === 'RESET') {
        qstate = [{ re: 1, im: 0 }, { re: 0, im: 0 }];
      } else if (GATES[g]) {
        qstate = applyGate1(qstate, GATES[g]);
      }
      updateReadouts();
    });
  });

  // Initial readout update
  updateReadouts();

  // 2. Initialize Sub-modules
  setupComposerControls();
  initGlossary();
  initQPUStatus();
  initModalSystem();
  initCommunity();
  initTranslate();
});
