/**
 * ==========================================================================
 * ROYAL WEDDING INVITATION INTERACTIVE CONTROLLER & CANVAS FX
 * Couples: ताहिरा ख़ान & जावेद खाँ | सानिया ख़ान & समीर खाँ
 * Main Wedding Date: Friday, 27 November 2026
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initCountdownTimer();
  initEnvelopeCeremony();
  initAudioControls();
  initScrollAnimations();
  initInteractiveActions();
});

/* ==========================================================================
   1. CANVAS ROSE PETALS & GOLDEN SPARKLES ENGINE
   ========================================================================== */
let fxCanvas, ctx;
let petals = [];
let sparkles = [];
let cursorParticles = [];
let animFrameId;
const maxPetals = 45;

function initParticleCanvas() {
  fxCanvas = document.getElementById('fxCanvas');
  if (!fxCanvas) return;
  ctx = fxCanvas.getContext('2d');

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Initialize petals
  for (let i = 0; i < maxPetals; i++) {
    petals.push(createPetal(true));
  }

  // Initialize gold sparkles
  for (let i = 0; i < 30; i++) {
    sparkles.push(createSparkle());
  }

  // Track cursor/touch for golden fairy dust
  window.addEventListener('mousemove', (e) => {
    addCursorSparkle(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      addCursorSparkle(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  animateFX();
}

function resizeCanvas() {
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
}

function createPetal(randomY = false) {
  const colors = [
    'rgba(185, 20, 45, 0.85)',   // Deep Crimson Rose
    'rgba(220, 38, 65, 0.8)',    // Vivid Rose
    'rgba(140, 15, 30, 0.9)',    // Royal Velvet Maroon
    'rgba(240, 100, 120, 0.75)', // Soft Rose Blush
    'rgba(212, 160, 45, 0.75)'   // Golden Leaf Accent
  ];

  return {
    x: Math.random() * fxCanvas.width,
    y: randomY ? Math.random() * fxCanvas.height : -30,
    size: 10 + Math.random() * 16,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedY: 1.0 + Math.random() * 2.0,
    speedX: Math.sin(Math.random() * Math.PI * 2) * 1.2,
    angle: Math.random() * Math.PI * 2,
    angleSpeed: (Math.random() - 0.5) * 0.04,
    flip: Math.random() * Math.PI,
    flipSpeed: 0.02 + Math.random() * 0.03,
    sway: Math.random() * 100,
    swaySpeed: 0.015 + Math.random() * 0.02
  };
}

function createSparkle() {
  return {
    x: Math.random() * fxCanvas.width,
    y: Math.random() * fxCanvas.height,
    radius: 1 + Math.random() * 2.5,
    color: 'rgba(255, 225, 120, ',
    alpha: 0.2 + Math.random() * 0.8,
    alphaSpeed: 0.015 + Math.random() * 0.02,
    increasing: Math.random() > 0.5,
    vy: -0.2 - Math.random() * 0.5
  };
}

function addCursorSparkle(x, y) {
  if (cursorParticles.length > 35) return;
  cursorParticles.push({
    x: x + (Math.random() - 0.5) * 10,
    y: y + (Math.random() - 0.5) * 10,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2 - 0.8,
    radius: 1.5 + Math.random() * 3,
    alpha: 1,
    color: Math.random() > 0.3 ? '#ffd700' : '#ff9ebb'
  });
}

function animateFX() {
  ctx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

  // Draw & update floating sparkles
  for (let i = 0; i < sparkles.length; i++) {
    const s = sparkles[i];
    if (s.increasing) {
      s.alpha += s.alphaSpeed;
      if (s.alpha >= 0.9) s.increasing = false;
    } else {
      s.alpha -= s.alphaSpeed;
      if (s.alpha <= 0.15) s.increasing = true;
    }
    s.y += s.vy;
    if (s.y < 0) s.y = fxCanvas.height;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = s.color + s.alpha + ')';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ffd700';
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Draw & update cursor sparkles
  for (let i = cursorParticles.length - 1; i >= 0; i--) {
    const cp = cursorParticles[i];
    cp.x += cp.vx;
    cp.y += cp.vy;
    cp.alpha -= 0.035;

    if (cp.alpha <= 0) {
      cursorParticles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = cp.alpha;
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, cp.radius, 0, Math.PI * 2);
    ctx.fillStyle = cp.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffd700';
    ctx.fill();
    ctx.restore();
  }

  // Draw & update rose petals
  for (let i = 0; i < petals.length; i++) {
    const p = petals[i];
    p.sway += p.swaySpeed;
    p.x += Math.sin(p.sway) * 1.5 + p.speedX * 0.4;
    p.y += p.speedY;
    p.angle += p.angleSpeed;
    p.flip += p.flipSpeed;

    if (p.y > fxCanvas.height + 40 || p.x < -40 || p.x > fxCanvas.width + 40) {
      petals[i] = createPetal(false);
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.scale(1, Math.sin(p.flip));

    // Curved rose petal shape
    ctx.beginPath();
    ctx.moveTo(0, -p.size * 0.6);
    ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.6, p.size * 0.9, p.size * 0.5, 0, p.size * 0.8);
    ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.5, -p.size * 0.8, -p.size * 0.6, 0, -p.size * 0.6);

    ctx.fillStyle = p.color;
    ctx.shadowBlur = 4;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.fill();
    ctx.restore();
  }

  animFrameId = requestAnimationFrame(animateFX);
}

// Grand flower shower burst
window.showerFlowerPetals = function(burstCount = 60) {
  for (let i = 0; i < burstCount; i++) {
    const p = createPetal(false);
    p.x = fxCanvas.width * (0.2 + Math.random() * 0.6);
    p.y = -20 - Math.random() * 150;
    p.speedY = 3.5 + Math.random() * 4;
    p.speedX = (Math.random() - 0.5) * 4;
    petals.push(p);
  }

  // Also spawn burst of golden stardust
  for (let i = 0; i < 40; i++) {
    cursorParticles.push({
      x: fxCanvas.width / 2 + (Math.random() - 0.5) * 200,
      y: fxCanvas.height / 3 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 2,
      radius: 2 + Math.random() * 4,
      alpha: 1,
      color: '#ffd700'
    });
  }

  showToast('🌸 दुआओं और फूलों की बारिश! मुबारकबाद! 🌸');
};

/* ==========================================================================
   2. ENVELOPE OPENING CEREMONY
   ========================================================================== */
function initEnvelopeCeremony() {
  const overlay = document.getElementById('envelopeOverlay');
  const openBtn = document.getElementById('openInvitationBtn');
  const waxSeal = document.getElementById('waxSeal');
  const envelope = document.getElementById('envelopeWrapper');

  function openEnvelope() {
    if (!overlay || overlay.classList.contains('opened')) return;

    // Trigger flower shower burst
    window.showerFlowerPetals(70);

    // Start Royal Shehnai melody
    if (window.royalShehnai) {
      window.royalShehnai.start();
      updateAudioButtonState(true);
    }

    overlay.classList.add('opened');

    // Scroll to top of card smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (openBtn) openBtn.addEventListener('click', openEnvelope);
  if (waxSeal) waxSeal.addEventListener('click', openEnvelope);
  if (envelope) envelope.addEventListener('click', openEnvelope);
}

/* ==========================================================================
   3. LIVE COUNTDOWN TIMER (Friday, 27 November 2026, 18:30 IST)
   ========================================================================== */
function initCountdownTimer() {
  // 27 November 2026, 18:30:00 IST (UTC+05:30)
  const weddingDate = new Date('2026-11-27T18:30:00+05:30').getTime();

  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minsEl = document.getElementById('countMins');
  const secsEl = document.getElementById('countSecs');

  function update() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   4. AUDIO TOGGLE & CONTROLS
   ========================================================================== */
function initAudioControls() {
  const audioBtn = document.getElementById('audioToggleBtn');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    if (window.royalShehnai) {
      const isPlaying = window.royalShehnai.toggle();
      updateAudioButtonState(isPlaying);
      showToast(isPlaying ? '🎶 शहनाई संगीत जारी है' : '🔇 संगीत बंद किया गया');
    }
  });
}

function updateAudioButtonState(isPlaying) {
  const audioBtn = document.getElementById('audioToggleBtn');
  const soundWaves = document.getElementById('soundWaves');
  if (!audioBtn) return;

  if (isPlaying) {
    audioBtn.classList.add('active');
    if (soundWaves) soundWaves.classList.remove('sound-paused');
  } else {
    audioBtn.classList.remove('active');
    if (soundWaves) soundWaves.classList.add('sound-paused');
  }
}

/* ==========================================================================
   5. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.couple-card, .timeline-item, .family-tile, .nanhi-farmaish-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
  });
}

/* ==========================================================================
   6. INTERACTIVE ACTIONS (WHATSAPP RSVP, CALENDAR, MAP, SHARE)
   ========================================================================== */
function initInteractiveActions() {
  // Shower Flowers Button
  const showerBtn = document.getElementById('showerFlowersBtn');
  if (showerBtn) {
    showerBtn.addEventListener('click', () => {
      window.showerFlowerPetals(60);
    });
  }

  // Share Button
  const shareBtn = document.getElementById('shareInviteBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'निकाह-ए-मसनून | ताहिरा ख़ान & जावेद खाँ | सानिया ख़ान & समीर खाँ',
        text: '॥ जश्न - ए - शादी ॥ तारखानी परिवार आपका तहेदिल से इस्तकबाल करता है। 27 नवम्बर 2026, कुचामन सिटी। सादर आमंत्रित हैं!',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          copyToClipboard(window.location.href);
        }
      } else {
        copyToClipboard(window.location.href);
      }
    });
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('✨ शादी के कार्ड का लिंक कॉपी हो गया!');
  }).catch(() => {
    showToast('✨ लिंक: ' + text);
  });
}

function showToast(message) {
  let toast = document.getElementById('royalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'royalToast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
