// grid background
(function drawGrid() {
  const c = document.getElementById('grid-bg');
  const ctx = c.getContext('2d');
  function resize() { c.width = window.innerWidth; c.height = window.innerHeight; draw(); }
  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 0.5;
    const s = 40;
    for (let x = 0; x < c.width; x += s) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, c.height); ctx.stroke(); }
    for (let y = 0; y < c.height; y += s) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(c.width, y); ctx.stroke(); }
  }
  window.addEventListener('resize', resize);
  resize();
})();

// helpers
function relTime(ts) {
  const d = new Date(ts);
  const now = Date.now();
  const diff = now - d.getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'just now';
  if (h < 24) return h + 'h ago';
  const days = Math.floor(h / 24);
  if (days < 7) return days + 'd ago';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// load signals (filter out entries older than 7 days)
fetch('content/signals.json').then(r => r.json()).then(data => {
  const el = document.getElementById('signals-feed');
  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  
  // Filter to only show signals from last 7 days
  const recent = data.filter(s => {
    const signalTime = new Date(s.timestamp).getTime();
    return (now - signalTime) < sevenDaysMs;
  });
  
  recent.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  if (recent.length === 0) {
    el.innerHTML = '<div class="signal-empty">no recent signals — checking back soon.</div>';
    return;
  }
  
  recent.slice(0, 20).forEach(s => {
    const tags = (s.tags || []).map(t => `<span class="signal-tag">${t}</span>`).join('');
    el.innerHTML += `<div class="signal-card">
      <div class="signal-time">${relTime(s.timestamp)}</div>
      <div class="signal-text">${s.text}</div>
      ${tags ? `<div class="signal-tags">${tags}</div>` : ''}
    </div>`;
  });
}).catch(() => {});

// load journal (filter to public entries only)
fetch('content/journal.json').then(r => r.json()).then(data => {
  const el = document.getElementById('journal-feed');
  
  // Filter to public entries only (default to true for backwards compatibility)
  const publicEntries = data.filter(j => j.public !== false);
  
  publicEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  publicEntries.forEach(j => {
    el.innerHTML += `<div class="journal-entry">
      <div class="journal-time">${relTime(j.timestamp)}</div>
      <div class="journal-text">${j.text}</div>
    </div>`;
  });
}).catch(() => {});

// load projects
fetch('content/projects.json').then(r => r.json()).then(data => {
  const el = document.getElementById('projects-grid');
  data.forEach(p => {
    el.innerHTML += `<div class="project-card">
      <div class="project-name">${p.name}</div>
      <span class="project-status status-${p.status}">${p.status}</span>
      <div class="project-desc">${p.description}</div>
    </div>`;
  });
}).catch(() => {});
