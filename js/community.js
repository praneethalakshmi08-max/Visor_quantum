/* Community Projects Showcase & Leaderboard */
const PROJECTS = [
  { name: 'VQE Molecular Hydrogen', author: 'qbit_pioneer', stars: 142, desc: 'Variational eigensolver computing ground state energy with 4 qubits.' },
  { name: 'Quantum Teleportation Lab', author: 'alice_and_bob', stars: 98, desc: 'Interactive step-by-step breakdown of state transfer.' },
  { name: '3-Qubit Grover Search', author: 'dev_zero', stars: 76, desc: 'Unstructured search with custom oracle matrix visualization.' }
];

const LEADERBOARD = [
  { name: 'nsingh_dev', score: 998 },
  { name: 'lina_qc', score: 941 },
  { name: 'qmartinez', score: 887 },
  { name: 'kenji.t', score: 812 },
  { name: 'you', score: null }
];

function renderLeaderboard() {
  const lbList = document.getElementById('leaderboard-list');
  if (!lbList) return;
  lbList.innerHTML = LEADERBOARD.map((r, i) => `
    <div class="leader-row">
      <span><span class="rank">#${i + 1}</span> ${r.name}</span>
      <span class="score">${r.score !== null ? r.score + ' pts' : '—'}</span>
    </div>
  `).join('');
}

function initCommunity() {
  const projectList = document.getElementById('project-list');
  if (projectList) {
    PROJECTS.forEach(p => {
      const card = document.createElement('div');
      card.className = 'panel project-card';
      card.innerHTML = `
        <div>
          <div class="p-name">${p.name}</div>
          <div style="font-size:12.5px; color:var(--text-dim); margin-top:4px;">${p.desc}</div>
          <div class="p-meta">by @${p.author}</div>
        </div>
        <div style="text-align:right;">
          <span class="badge">★ ${p.stars}</span>
        </div>
      `;
      card.addEventListener('click', () => {
        openModal(`
          <h3>${p.name}</h3>
          <div class="m-sub">by @${p.author} · ★ ${p.stars}</div>
          <p style="font-size:13.5px; color:var(--text-dim); line-height:1.6; margin-bottom:16px;">${p.desc}</p>
          <div class="eyebrow" style="margin-bottom:8px;">Suggested Gates</div>
          <div>
            <span class="modal-gate-chip">H</span>
            <span class="modal-gate-chip">CNOT</span>
            <span class="modal-gate-chip">RZ(π/4)</span>
          </div>
          <div class="modal-actions">
            <button class="btn small" style="flex:1; justify-content:center;" id="load-into-composer">Load into Composer</button>
            <button class="btn ghost small" style="flex:1; justify-content:center;" id="close-project-modal">Close</button>
          </div>
        `);
        document.getElementById('close-project-modal').addEventListener('click', closeModal);
        document.getElementById('load-into-composer').addEventListener('click', () => {
          closeModal();
          document.getElementById('composer').scrollIntoView({ behavior: 'smooth' });
        });
      });
      projectList.appendChild(card);
    });
  }

  renderLeaderboard();

  const scoreBtn = document.getElementById('submit-score-btn');
  if (scoreBtn) {
    scoreBtn.addEventListener('click', () => {
      openModal(`
        <h3>Submit Solution</h3>
        <div class="m-sub">Weekly GHZ State Challenge</div>
        <label>Display Name</label>
        <input id="score-name" type="text" placeholder="your_handle" value="you">
        <label>Your Score (fidelity %)</label>
        <input id="score-val" type="number" placeholder="e.g. 965">
        <div class="modal-status" id="score-status"></div>
        <div class="modal-actions">
          <button class="btn small" id="submit-score-confirm" style="flex:1; justify-content:center;">Submit</button>
          <button class="btn ghost small" id="submit-score-cancel" style="flex:1; justify-content:center;">Cancel</button>
        </div>
      `);
      document.getElementById('submit-score-cancel').addEventListener('click', closeModal);
      document.getElementById('submit-score-confirm').addEventListener('click', () => {
        const name = document.getElementById('score-name').value.trim() || 'you';
        const val = parseInt(document.getElementById('score-val').value, 10);
        const status = document.getElementById('score-status');
        if (isNaN(val)) {
          status.className = 'modal-status warn';
          status.textContent = '⚠ Enter a numeric score.';
          return;
        }
        const existing = LEADERBOARD.find(r => r.name === 'you');
        if (existing) {
          existing.name = name;
          existing.score = val;
        } else {
          LEADERBOARD.push({ name, score: val });
        }
        LEADERBOARD.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
        renderLeaderboard();
        status.className = 'modal-status ok';
        status.textContent = ' ✓ Added — session only, not persisted server-side.';
        setTimeout(closeModal, 900);
      });
    });
  }
}
