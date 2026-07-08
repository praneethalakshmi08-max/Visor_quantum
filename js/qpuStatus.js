/* QPU Mock Telemetry Chart & Metrics */
function initQPUStatus() {
  const chartCanvas = document.getElementById('qpu-chart');
  if (!chartCanvas) return;
  const ctx = chartCanvas.getContext('2d');

  let history = Array.from({ length: 40 }, () => 40 + Math.random() * 20);

  function drawChart() {
    const w = chartCanvas.clientWidth, h = chartCanvas.clientHeight;
    chartCanvas.width = w;
    chartCanvas.height = h;

    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.strokeStyle = '#00f6ff';
    ctx.lineWidth = 2;

    const step = w / (history.length - 1);
    history.forEach((val, i) => {
      const x = i * step;
      const y = h - (val / 100) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill Gradient under graph
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(0,246,255,0.25)');
    grad.addColorStop(1, 'rgba(0,246,255,0)');
    ctx.fillStyle = grad;
    ctx.fill();
  }

  function tickQPU() {
    history.shift();
    const last = history[history.length - 1];
    history.push(Math.max(10, Math.min(90, last + (Math.random() - 0.48) * 8)));

    const qEl = document.getElementById('m-queue');
    const t1El = document.getElementById('m-t1');
    const fidEl = document.getElementById('m-fid');
    const upEl = document.getElementById('m-up');

    if (qEl) qEl.textContent = Math.floor(12 + Math.random() * 6);
    if (t1El) t1El.textContent = (142 + Math.random() * 8).toFixed(1) + ' µs';
    if (fidEl) fidEl.textContent = (99.42 + Math.random() * 0.1).toFixed(2) + '%';
    if (upEl) upEl.textContent = '99.8%';

    drawChart();
  }

  drawChart();
  setInterval(tickQPU, 2200);
  window.addEventListener('resize', drawChart);
}
