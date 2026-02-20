/* ─────────────────────────────────────────────────────────────────────────────
   Day 01 — Flow Field
   Particles follow a vector field derived from 2-D Perlin noise.
   Colors shift slowly through the full hue spectrum over time.
   Mouse repels particles; click bursts a cluster at that point.
───────────────────────────────────────────────────────────────────────────── */

const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');

let W, H;
function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);


// ── 2-D Perlin noise ─────────────────────────────────────────────────────────

const noise2D = (() => {
  // Build a shuffled permutation table
  const base = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [base[i], base[j]] = [base[j], base[i]];
  }
  const p = new Uint8Array(512);
  for (let i = 0; i < 512; i++) p[i] = base[i & 255];

  const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + t * (b - a);
  const grad = (h, x, y) => {
    switch (h & 3) {
      case 0: return  x + y;
      case 1: return -x + y;
      case 2: return  x - y;
      default: return -x - y;
    }
  };

  return (x, y) => {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u  = fade(xf);
    const v  = fade(yf);
    const aa = p[p[xi    ] + yi    ];
    const ab = p[p[xi    ] + yi + 1];
    const ba = p[p[xi + 1] + yi    ];
    const bb = p[p[xi + 1] + yi + 1];
    return lerp(
      lerp(grad(aa, xf,     yf    ), grad(ba, xf - 1, yf    ), u),
      lerp(grad(ab, xf,     yf - 1), grad(bb, xf - 1, yf - 1), u),
      v
    );
  };
})();


// ── Config ───────────────────────────────────────────────────────────────────

const CFG = {
  count:       1400,   // total particles
  speed:       1.9,    // pixels per frame
  scale:       0.0028, // noise sampling scale
  maxLife:     130,    // frames a particle lives
  trailAlpha:  0.038,  // background fade per frame (lower = longer trails)
  mouseRadius: 130,    // px — repulsion zone
  mousePush:   5,      // repulsion strength
  hueRange:    80,     // each particle's hue offset from global (±half)
};


// ── Mouse / touch ─────────────────────────────────────────────────────────────

const mouse = { x: -9999, y: -9999 };
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

// Touch support
window.addEventListener('touchmove', e => {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
}, { passive: true });
window.addEventListener('touchend', () => { mouse.x = -9999; mouse.y = -9999; });


// ── Particle ──────────────────────────────────────────────────────────────────

class Particle {
  constructor(scattered = true) {
    this.spawn(scattered);
  }

  spawn(scattered = false) {
    // Scattered = random anywhere; focused = near centre on burst
    if (scattered) {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
    } else {
      this.x = mouse.x + (Math.random() - 0.5) * 30;
      this.y = mouse.y + (Math.random() - 0.5) * 30;
    }
    this.px      = this.x;
    this.py      = this.y;
    this.life    = 0;
    this.maxLife = CFG.maxLife * (0.5 + Math.random() * 1.0);
    // Tight hue band around the global hue that shifts over time
    this.hOff    = (Math.random() - 0.5) * CFG.hueRange;
  }

  update(t, globalHue) {
    this.px = this.x;
    this.py = this.y;

    // Flow direction from noise field
    const n     = noise2D(this.x * CFG.scale, this.y * CFG.scale + t);
    const angle = n * Math.PI * 4;
    this.x += Math.cos(angle) * CFG.speed;
    this.y += Math.sin(angle) * CFG.speed;

    // Mouse repulsion
    const dx  = this.x - mouse.x;
    const dy  = this.y - mouse.y;
    const dSq = dx * dx + dy * dy;
    if (dSq < CFG.mouseRadius * CFG.mouseRadius && dSq > 0.001) {
      const d    = Math.sqrt(dSq);
      const push = (CFG.mouseRadius - d) / CFG.mouseRadius;
      this.x += (dx / d) * push * CFG.mousePush;
      this.y += (dy / d) * push * CFG.mousePush;
    }

    this.life++;

    if (
      this.life > this.maxLife ||
      this.x < -12 || this.x > W + 12 ||
      this.y < -12 || this.y > H + 12
    ) {
      this.spawn(true);
    }
  }

  draw(globalHue) {
    const progress = this.life / this.maxLife;
    // Fade in, peak, then fade out
    const alpha    = Math.sin(progress * Math.PI) * 0.7;
    const hue      = (globalHue + this.hOff + 360) % 360;
    const sat      = 78;
    const lum      = 52 + progress * 18;

    ctx.beginPath();
    ctx.moveTo(this.px, this.py);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsla(${hue},${sat}%,${lum}%,${alpha})`;
    ctx.lineWidth   = 1;
    ctx.stroke();
  }
}


// ── Click burst ───────────────────────────────────────────────────────────────

// Reuse a dedicated pool of particles for click bursts
const BURST_SIZE = 80;
const burstPool  = Array.from({ length: BURST_SIZE }, () => new Particle(true));

window.addEventListener('click', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  for (const p of burstPool) {
    p.x = p.px = e.clientX + (Math.random() - 0.5) * 10;
    p.y = p.py = e.clientY + (Math.random() - 0.5) * 10;
    p.life    = 0;
    p.maxLife = CFG.maxLife * (0.7 + Math.random() * 0.6);
  }
});

window.addEventListener('touchstart', e => {
  const t = e.touches[0];
  mouse.x = t.clientX;
  mouse.y = t.clientY;
  for (const p of burstPool) {
    p.x = p.px = t.clientX + (Math.random() - 0.5) * 10;
    p.y = p.py = t.clientY + (Math.random() - 0.5) * 10;
    p.life    = 0;
    p.maxLife = CFG.maxLife * (0.7 + Math.random() * 0.6);
  }
}, { passive: true });


// ── Setup ─────────────────────────────────────────────────────────────────────

const particles = Array.from({ length: CFG.count }, () => new Particle(true));
const allParticles = [...particles, ...burstPool];

// Warm-start: age particles randomly so the field is already populated
for (const p of particles) {
  p.life = (Math.random() * p.maxLife) | 0;
}

// Solid black start
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, W, H);

let t         = 0;
let globalHue = 210; // start in blue


// ── Animation loop ────────────────────────────────────────────────────────────

function loop() {
  requestAnimationFrame(loop);

  // Trailing fade — lower alpha = longer persistence
  ctx.fillStyle = `rgba(0,0,0,${CFG.trailAlpha})`;
  ctx.fillRect(0, 0, W, H);

  for (const p of allParticles) {
    p.update(t, globalHue);
    p.draw(globalHue);
  }

  // Slowly drift through the colour wheel
  t         += 0.004;
  globalHue  = (globalHue + 0.15) % 360;
}

loop();
