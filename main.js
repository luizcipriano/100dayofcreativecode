/* ─────────────────────────────────────────────────────────────────────────────
   100 Days of Creative Code — Main index script

   HOW TO ADD A NEW DAY:
   1. Create a folder  dayN/  with index.html, style.css, script.js
   2. Add an entry to the DAYS array below following the same shape
   3. Commit & push — the card will appear automatically on the site
───────────────────────────────────────────────────────────────────────────── */

// ── Day registry ─────────────────────────────────────────────────────────────
// Each entry maps to one completed day.
// Fields:
//   n     {number}   Day number (1-100)
//   title {string}   Short animation title
//   desc  {string}   One-sentence description shown on the card
//   tags  {string[]} Technique tags (canvas, svg, gsap, 3d, scroll, …)
//   path  {string}   Relative URL to the day folder (must end with /)

const DAYS = [
  {
    n:     1,
    title: "Flow Field",
    desc:  "Noise-driven particle simulation through a Perlin vector field.",
    tags:  ["canvas", "particles", "perlin"],
    path:  "./day1/"
  },

  // ── Add new days here ── //
  // {
  //   n:     2,
  //   title: "My Animation",
  //   desc:  "Short description of what this day explores.",
  //   tags:  ["svg", "gsap"],
  //   path:  "./day2/"
  // },
];


// ── Helpers ───────────────────────────────────────────────────────────────────

// Derive a stable hue from the day number (well-spread across the wheel)
const dayHue = n => (n * 37 + 180) % 360;

// Zero-pad a number to 2 digits
const pad = n => String(n).padStart(2, '0');


// ── Build card HTML ───────────────────────────────────────────────────────────

function buildActiveCard(day) {
  const hue = dayHue(day.n);
  return `
    <li class="day-card is-active" style="--card-hue:${hue}" data-n="${day.n}">
      <span class="card-day">DAY</span>
      <p class="card-num">${pad(day.n)}</p>
      <p class="card-title">${day.title}</p>
      <p class="card-desc">${day.desc}</p>
      <div class="card-footer">
        <div class="card-tags">
          ${day.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <a class="card-link" href="${day.path}" aria-label="Open day ${day.n}: ${day.title}">
          Open&nbsp;↗
        </a>
      </div>
    </li>`.trim();
}

function buildLockedCard(n) {
  const hue = dayHue(n);
  return `
    <li class="day-card is-locked" style="--card-hue:${hue}" data-n="${n}" aria-hidden="true">
      <span class="card-day">DAY</span>
      <p class="card-num">${pad(n)}</p>
      <div class="card-placeholder">
        <span></span><span></span>
      </div>
    </li>`.trim();
}


// ── Render ────────────────────────────────────────────────────────────────────

function render() {
  const grid      = document.getElementById('js-grid');
  const countEl   = document.getElementById('js-count');
  const progressEl= document.getElementById('js-progress');
  const labelEl   = document.getElementById('js-progress-label');

  if (!grid) return;

  // Index the completed days by number for fast lookup
  const completed = new Map(DAYS.map(d => [d.n, d]));
  const total     = DAYS.length;

  // Render all 100 slots
  const html = [];
  for (let n = 1; n <= 100; n++) {
    html.push(completed.has(n) ? buildActiveCard(completed.get(n)) : buildLockedCard(n));
  }
  grid.innerHTML = html.join('');

  // Update header counters
  if (countEl)    countEl.textContent = `${pad(total)} / 100`;
  if (labelEl)    labelEl.textContent = `${total} of 100 complete`;
  if (progressEl) {
    // Trigger transition after first paint
    requestAnimationFrame(() => {
      progressEl.style.width = `${(total / 100) * 100}%`;
    });
  }
}


// ── Entrance animation via IntersectionObserver ───────────────────────────────

function observeCards() {
  const cards = document.querySelectorAll('.day-card');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card  = entry.target;
      const n     = parseInt(card.dataset.n, 10);
      // Stagger by position within visible batch
      const delay = ((n - 1) % 10) * 35; // ms
      setTimeout(() => card.classList.add('visible'), delay);
      io.unobserve(card);
    });
  }, { threshold: 0.05 });

  cards.forEach(card => io.observe(card));
}


// ── Click handler for active cards ───────────────────────────────────────────
// Allows clicking anywhere on the card (not just the link)

function bindCardClicks() {
  document.getElementById('js-grid').addEventListener('click', e => {
    const card = e.target.closest('.day-card.is-active');
    if (!card) return;
    // Don't double-navigate if they clicked the <a> directly
    if (e.target.closest('.card-link')) return;
    const link = card.querySelector('.card-link');
    if (link) window.location.href = link.href;
  });
}


// ── Init ─────────────────────────────────────────────────────────────────────

const yearEl = document.getElementById('js-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

render();
observeCards();
bindCardClicks();
