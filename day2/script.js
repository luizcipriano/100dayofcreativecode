/* ─────────────────────────────────────────────────────────────────────────────
   Day 02 — Harmonograph
   A digital simulation of a two-pendulum harmonograph drawing machine.
   Each axis is driven by two slightly detuned oscillators with natural damping,
   producing Lissajous-like figures that slowly spiral inward to rest.
   Click / tap anywhere to generate a new figure with random parameters.
───────────────────────────────────────────────────────────────────────────── */

const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');

let W, H, cx, cy, R;

function resize() {
  W  = canvas.width  = window.innerWidth;
  H  = canvas.height = window.innerHeight;
  cx = W / 2;
  cy = H / 2;
  R  = Math.min(W, H) * 0.42;
}
resize();
window.addEventListener('resize', () => { resize(); start(); });


// ── Config ────────────────────────────────────────────────────────────────────

const CFG = {
  stepsPerFrame: 500,   // path points rendered per animation frame
  totalSteps:    90000, // total points per drawing before auto-restart
  dt:            0.025, // time increment per step
  damping:       0.0006,// base amplitude decay rate
  lineWidth:     1.0,   // stroke thickness in pixels
  glow:          10,    // shadowBlur radius for the neon glow
  pauseAfter:    120,   // frames to hold the finished figure before restarting
};


// ── Frequency ratios that produce aesthetically pleasing figures ───────────────

const RATIOS = [
  [2, 3], [3, 4], [3, 5], [4, 5],
  [5, 6], [4, 7], [5, 7], [5, 8],
];


// ── State ─────────────────────────────────────────────────────────────────────

let params     = {};
let t          = 0;
let step       = 0;
let hueBase    = 0;
let pausing    = false;
let pauseFrame = 0;
let prev       = null;


// ── Parameter generation ──────────────────────────────────────────────────────

function randomize() {
  const [a, b] = RATIOS[Math.floor(Math.random() * RATIOS.length)];
  const base   = 0.8 + Math.random() * 0.4;

  // Slight detuning between the two oscillators on each axis creates organic drift
  const detune = () => 1 + (Math.random() - 0.5) * 0.012;
  const damp   = () => CFG.damping * (0.7 + Math.random() * 0.6);
  const phase  = () => Math.random() * Math.PI * 2;

  params = {
    // X axis — two oscillators with ratio a
    f1: base * a,          p1: phase(), d1: damp(),
    f2: base * a * detune(), p2: phase(), d2: damp(),
    // Y axis — two oscillators with ratio b
    f3: base * b,          p3: phase(), d3: damp(),
    f4: base * b * detune(), p4: phase(), d4: damp(),
  };
}


// ── Pendulum equations ────────────────────────────────────────────────────────
//
//   x(t) = R · ( 0.65·sin(f₁t + φ₁)·e^(−d₁t) + 0.35·sin(f₂t + φ₂)·e^(−d₂t) )
//   y(t) = R · ( 0.65·sin(f₃t + φ₃)·e^(−d₃t) + 0.35·sin(f₄t + φ₄)·e^(−d₄t) )
//
// Two oscillators per axis — primary (65%) plus detuned secondary (35%).

function getXY(time) {
  const { f1, p1, d1, f2, p2, d2, f3, p3, d3, f4, p4, d4 } = params;
  const x = R * (
    Math.sin(f1 * time + p1) * Math.exp(-d1 * time) * 0.65 +
    Math.sin(f2 * time + p2) * Math.exp(-d2 * time) * 0.35
  );
  const y = R * (
    Math.sin(f3 * time + p3) * Math.exp(-d3 * time) * 0.65 +
    Math.sin(f4 * time + p4) * Math.exp(-d4 * time) * 0.35
  );
  return { x: cx + x, y: cy + y };
}


// ── Drawing lifecycle ─────────────────────────────────────────────────────────

function start() {
  ctx.clearRect(0, 0, W, H);
  randomize();
  hueBase    = Math.random() * 360;
  t          = 0;
  step       = 0;
  pausing    = false;
  pauseFrame = 0;
  prev       = getXY(0);
}


// ── Animation loop ────────────────────────────────────────────────────────────

function loop() {
  requestAnimationFrame(loop);

  if (pausing) {
    pauseFrame++;
    if (pauseFrame >= CFG.pauseAfter) start();
    return;
  }

  for (let i = 0; i < CFG.stepsPerFrame && step < CFG.totalSteps; i++, step++) {
    t += CFG.dt;
    const curr     = getXY(t);
    const progress = step / CFG.totalSteps;

    // Hue sweeps 240° along the path; alpha fades gently toward the end
    const hue   = (hueBase + progress * 240) % 360;
    const alpha = Math.max(0.06, 0.88 - progress * 0.65);

    ctx.strokeStyle = `hsla(${hue}, 85%, 62%, ${alpha})`;
    ctx.shadowColor = `hsla(${hue}, 100%, 70%, 0.35)`;
    ctx.shadowBlur  = CFG.glow;
    ctx.lineWidth   = CFG.lineWidth;

    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(curr.x, curr.y);
    ctx.stroke();

    prev = curr;
  }

  if (step >= CFG.totalSteps) pausing = true;
}


// ── Interaction ───────────────────────────────────────────────────────────────

canvas.addEventListener('click', start);
canvas.addEventListener('touchend', e => { e.preventDefault(); start(); });


// ── Init ─────────────────────────────────────────────────────────────────────

start();
loop();
