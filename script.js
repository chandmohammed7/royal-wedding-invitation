/**
 * ==========================================================================
 * ROYAL WEDDING INVITATION INTERACTIVE CONTROLLER & CANVAS FX
 * Couples: ताहिरा खान & जावेद खाँ | सानिया खान & समीर खाँ
 * Wedding Date: Friday, 27 November 2026 (17 जमादिउल आखिर, 1448 हिजरी)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initGuestPersonalization();
  initParticleCanvas();
  initEnvelopeCeremony();
  initCountdownTimer();
  initAudioControls();
  initKidInteractions();
  initActionButtons();
});

/* ==========================================================================
   1. GUEST PERSONALIZATION ENGINE
   ========================================================================== */
let currentGuestName = 'अज़ीज़ मेहमॉन';

function initGuestPersonalization() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestFromUrl = urlParams.get('guest') || urlParams.get('name');
  
  if (guestFromUrl && guestFromUrl.trim()) {
    currentGuestName = guestFromUrl.trim();
  }

  updateGuestDisplays();

  // Modal dialog controls
  const modal = document.getElementById('guestNameModal');
  const editBtn = document.getElementById('editGuestBtn');
  const saveBtn = document.getElementById('saveGuestNameBtn');
  const closeBtn = document.getElementById('closeGuestModalBtn');
  const input = document.getElementById('guestNameInput');

  if (editBtn && modal) {
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (input) input.value = currentGuestName === 'अज़ीज़ मेहमॉन' ? '' : currentGuestName;
      modal.showModal();
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.close());
  }

  if (saveBtn && modal) {
    saveBtn.addEventListener('click', () => {
      if (input && input.value.trim()) {
        currentGuestName = input.value.trim();
        updateGuestDisplays();
        showToast(`✨ अतिथि का नाम अपडेट हुआ: ${currentGuestName}`);
      }
      modal.close();
    });
  }
}

function updateGuestDisplays() {
  const envelopeNameEl = document.getElementById('receptionGuestName');
  const cardNames = document.querySelectorAll('.guest-name-display');

  if (envelopeNameEl) envelopeNameEl.textContent = currentGuestName;
  cardNames.forEach(el => el.textContent = currentGuestName);

  // Update WhatsApp link text
  const waBtn = document.getElementById('whatsappRsvpLink');
  if (waBtn) {
    const customMsg = `अस्सलाम वालेकुम सिकन्दर जी, ताहिरा खान व सानिया खान की शादी की बहुत-बहुत मुबारकबाद! मैं (${currentGuestName}) शादी के जश्न में ज़रूर शरीक होऊँगा/होऊँगी।`;
    waBtn.href = `https://wa.me/918107911057?text=${encodeURIComponent(customMsg)}`;
  }
}

/* ==========================================================================
   2. CANVAS ROSE PETALS & GOLDEN STARDUST ENGINE
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
  for (let i = 0; i < 35; i++) {
    sparkles.push(createSparkle());
  }

  // Track cursor / touch for golden fairy dust
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
  if (!fxCanvas) return;
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
}

function createPetal(randomY = false) {
  const colors = [
    'rgba(185, 20, 45, 0.88)',   // Deep Crimson Rose
    'rgba(220, 38, 65, 0.82)',   // Vivid Rose
    'rgba(140, 15, 30, 0.92)',   // Royal Velvet Maroon
    'rgba(240, 100, 120, 0.78)', // Soft Rose Blush
    'rgba(223, 168, 44, 0.78)'   // Golden Leaf Accent
  ];

  return {
    x: Math.random() * (fxCanvas ? fxCanvas.width : 1200),
    y: randomY ? Math.random() * (fxCanvas ? fxCanvas.height : 800) : -30,
    size: 11 + Math.random() * 16,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedY: 1.0 + Math.random() * 2.2,
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
    x: Math.random() * (fxCanvas ? fxCanvas.width : 1200),
    y: Math.random() * (fxCanvas ? fxCanvas.height : 800),
    radius: 1 + Math.random() * 2.8,
    color: 'rgba(255, 225, 120, ',
    alpha: 0.2 + Math.random() * 0.8,
    alphaSpeed: 0.015 + Math.random() * 0.02,
    increasing: Math.random() > 0.5,
    vy: -0.2 - Math.random() * 0.5
  };
}

function addCursorSparkle(x, y) {
  if (cursorParticles.length > 30) return;
  cursorParticles.push({
    x: x + (Math.random() - 0.5) * 8,
    y: y + (Math.random() - 0.5) * 8,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2 - 0.8,
    radius: 1.5 + Math.random() * 2.5,
    alpha: 1,
    color: Math.random() > 0.3 ? '#ffd700' : '#ff9ebb'
  });
}

function animateFX() {
  if (!ctx || !fxCanvas) return;
  ctx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

  // Draw floating sparkles
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

  // Draw cursor sparkles
  for (let i = cursorParticles.length - 1; i >= 0; i--) {
    const cp = cursorParticles[i];
    cp.x += cp.vx;
    cp.y += cp.vy;
    cp.alpha -= 0.04;

    if (cp.alpha <= 0) {
      cursorParticles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = cp.alpha;
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, cp.radius, 0, Math.PI * 2);
    ctx.fillStyle = cp.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ffd700';
    ctx.fill();
    ctx.restore();
  }

  // Draw rose petals
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

// Grand Flower Shower
window.showerFlowerPetals = function(burstCount = 70) {
  if (!fxCanvas) return;
  for (let i = 0; i < burstCount; i++) {
    const p = createPetal(false);
    p.x = fxCanvas.width * (0.15 + Math.random() * 0.7);
    p.y = -20 - Math.random() * 180;
    p.speedY = 3.5 + Math.random() * 4.5;
    p.speedX = (Math.random() - 0.5) * 4;
    petals.push(p);
  }

  for (let i = 0; i < 40; i++) {
    cursorParticles.push({
      x: fxCanvas.width / 2 + (Math.random() - 0.5) * 250,
      y: fxCanvas.height / 3 + (Math.random() - 0.5) * 150,
      vx: (Math.random() - 0.5) * 9,
      vy: (Math.random() - 0.5) * 9 - 2,
      radius: 2 + Math.random() * 4,
      alpha: 1,
      color: '#ffd700'
    });
  }

  showToast('🌸 दुआओं और फूलों की बारिश! मुबारकबाद! 🌸');
};

/* ==========================================================================
   3. 3D ENVELOPE OPENING CEREMONY (PHASED GRAND REVEAL)
   ========================================================================== */
function initEnvelopeCeremony() {
  const overlay = document.getElementById('envelopeOverlay');
  const envelope = document.getElementById('envelopeWrapper');
  const waxSeal = document.getElementById('waxSeal');
  const openBtn = document.getElementById('openInvitationBtn');

  let isOpening = false;

  function triggerOpen() {
    if (isOpening || !overlay || overlay.classList.contains('opened')) return;
    isOpening = true;

    // Step 1: Crack Wax Seal with sound & sparkle burst
    if (window.royalShehnai) {
      window.royalShehnai.playSealBreakSound();
    }
    if (waxSeal) {
      waxSeal.classList.add('broken');
    }

    // Spawn seal fragmentation particles
    for (let i = 0; i < 25; i++) {
      cursorParticles.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 50,
        y: window.innerHeight / 2 + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12 - 3,
        radius: 2 + Math.random() * 4,
        alpha: 1,
        color: Math.random() > 0.4 ? '#c81e32' : '#ffd700'
      });
    }

    // Step 2: Unfold 3D Flap & Slide Inner Letter Up
    setTimeout(() => {
      if (envelope) {
        envelope.classList.add('unfolding');
      }
    }, 200);

    // Step 3: Trigger Royal Shehnai Melody
    setTimeout(() => {
      if (window.royalShehnai) {
        window.royalShehnai.start();
        updateAudioButtonState(true);
      }
    }, 450);

    // Step 4: Part velvet curtains and reveal grand royal card
    setTimeout(() => {
      overlay.classList.add('opened');
      window.showerFlowerPetals(80);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1100);
  }

  if (openBtn) openBtn.addEventListener('click', triggerOpen);
  if (waxSeal) waxSeal.addEventListener('click', triggerOpen);
  if (envelope) envelope.addEventListener('click', (e) => {
    // Don't open if clicked the edit guest button
    if (e.target && e.target.id === 'editGuestBtn') return;
    triggerOpen();
  });
}

/* ==========================================================================
   4. LIVE MULTI-EVENT COUNTDOWN TIMER
   ========================================================================== */
function initCountdownTimer() {
  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minsEl = document.getElementById('countMins');
  const secsEl = document.getElementById('countSecs');
  const labelEl = document.getElementById('countdownEventLabel');
  const tabs = document.querySelectorAll('.cd-tab');

  let targetTimestamp = new Date('2026-11-27T18:30:00+05:30').getTime();

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetDateStr = tab.getAttribute('data-target');
      const labelText = tab.getAttribute('data-label');

      if (targetDateStr) {
        targetTimestamp = new Date(targetDateStr).getTime();
      }
      if (labelEl && labelText) {
        labelEl.textContent = labelText;
      }
      updateTimer();
    });
  });

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetTimestamp - now;

    if (distance <= 0) {
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

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   5. AUDIO CONTROLS
   ========================================================================== */
function initAudioControls() {
  const audioBtn = document.getElementById('audioToggleBtn');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    if (window.royalShehnai) {
      const isPlaying = window.royalShehnai.toggle();
      updateAudioButtonState(isPlaying);
      showToast(isPlaying ? '🎶 शहनाई संगीत शुरू हुआ' : '🔇 संगीत बंद किया गया');
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
   6. KIDS "नन्ही फरमाईश" INTERACTIVE REACTION
   ========================================================================== */
function initKidInteractions() {
  const kidPills = document.querySelectorAll('.kid-name-pill');
  const messages = [
    'की ओर से ढेर सारा प्यार और मुबारकबाद! 💖',
    'आपकी आमद के इंतज़ार में पलकें बिछाए बैठे हैं! 🌸',
    'की तरफ से दिल से इस्तकबाल! ⭐',
    'शादी के जश्न में आपका स्वागत करने को तैयार हैं! 🌹',
    'की नन्ही दुआएं आपके साथ हैं! 🌙'
  ];

  kidPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      const kidName = pill.textContent.trim().replace(/^[^\w\s\u0900-\u097F]+/, '').trim();
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];

      // Sound chime
      if (window.royalShehnai) {
        window.royalShehnai.playChime();
      }

      // Sparkles at button position
      const rect = pill.getBoundingClientRect();
      for (let i = 0; i < 15; i++) {
        cursorParticles.push({
          x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 20,
          y: rect.top + rect.height / 2 + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6 - 2,
          radius: 2 + Math.random() * 3,
          alpha: 1,
          color: Math.random() > 0.5 ? '#ff758c' : '#ffd700'
        });
      }

      showToast(`✨ ${kidName} ${randomMsg}`);
    });
  });
}

/* ==========================================================================
   7. INTERACTIVE ACTION BUTTONS
   ========================================================================== */
function initActionButtons() {
  // Flower Shower Floating Button
  const showerBtn = document.getElementById('showerFlowersBtn');
  if (showerBtn) {
    showerBtn.addEventListener('click', () => {
      window.showerFlowerPetals(75);
    });
  }

  // Share Invitation Button
  const shareBtn = document.getElementById('shareInviteBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      // Build personalized URL
      const currentUrl = new URL(window.location.href);
      if (currentGuestName && currentGuestName !== 'अज़ीज़ मेहमॉन') {
        currentUrl.searchParams.set('guest', currentGuestName);
      }

      const shareData = {
        title: 'निकाह-ए-मसनून | ताहिरा खान & जावेद खाँ | सानिया खान & समीर खाँ',
        text: `॥ जश्न - ए - शादी ॥ तारखानी परिवार आपका तहेदिल से इस्तकबाल करता है। 27 नवम्बर 2026, कुचामन सिटी। सादर आमंत्रित हैं!`,
        url: currentUrl.toString()
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          copyPersonalizedUrl(currentUrl.toString());
        }
      } else {
        copyPersonalizedUrl(currentUrl.toString());
      }
    });
  }
}

function copyPersonalizedUrl(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('✨ शादी के कार्ड का लिंक कॉपी हो गया! अब आप इसे शेयर कर सकते हैं।');
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
