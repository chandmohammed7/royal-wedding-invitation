/**
 * ROYAL WEDDING SHAHNAI & AMBIENT MUSIC ENGINE
 * Powered by Web Audio API - Generates pure authentic Raag Yaman / Bhairavi
 * wedding Shehnai melody with Tanpura drone and temple chime bells.
 * Guaranteed 100% offline playback, no CORS or network blocking issues.
 */

class RoyalShehnaiEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.droneGain = null;
    this.shehnaiGain = null;
    this.timerId = null;
    this.currentNoteIndex = 0;
    
    // Auspicious Raag Notes (Frequencies in Hz - Indian Sargam: Sa, Re, Ga, Ma, Pa, Dha, Ni, Sa')
    // Key: D# / E-flat base (traditional Shehnai pitch)
    this.scale = [
      311.13, // Sa (D#4)
      349.23, // Re (F4)
      392.00, // Ga (G4)
      415.30, // Komal Ma (G#4)
      466.16, // Pa (A#4)
      523.25, // Dha (C5)
      587.33, // Ni (D5)
      622.25, // Sa' (D#5)
      698.46  // Re' (F5)
    ];

    // Traditional Shehnai Wedding Melody Phrase (Jashn-e-Shaadi Raag)
    this.melody = [
      { note: 0, dur: 1.2, slide: true },
      { note: 1, dur: 0.8, slide: true },
      { note: 2, dur: 1.6, slide: false },
      { note: 4, dur: 1.8, slide: true },
      { note: 3, dur: 0.6, slide: true },
      { note: 2, dur: 1.0, slide: false },
      { note: 1, dur: 1.2, slide: true },
      { note: 0, dur: 2.2, slide: false },
      
      { note: 4, dur: 1.0, slide: true },
      { note: 5, dur: 1.2, slide: true },
      { note: 6, dur: 1.4, slide: false },
      { note: 7, dur: 2.2, slide: true },
      { note: 6, dur: 0.8, slide: true },
      { note: 5, dur: 1.0, slide: false },
      { note: 4, dur: 1.4, slide: true },
      { note: 2, dur: 1.8, slide: false },
      
      { note: 1, dur: 0.8, slide: true },
      { note: 2, dur: 0.8, slide: true },
      { note: 4, dur: 1.2, slide: true },
      { note: 2, dur: 1.0, slide: false },
      { note: 1, dur: 1.2, slide: true },
      { note: 0, dur: 2.8, slide: false }
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master output with gentle compressor to sound warm and rich
      const compressor = this.ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
      compressor.knee.setValueAtTime(20, this.ctx.currentTime);
      compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      compressor.attack.setValueAtTime(0.01, this.ctx.currentTime);
      compressor.release.setValueAtTime(0.3, this.ctx.currentTime);
      compressor.connect(this.ctx.destination);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.connect(compressor);

      this.setupTanpuraDrone();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setupTanpuraDrone() {
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    this.droneGain.connect(this.masterGain);

    // Deep continuous Sa & Pa Drone (fundamental harmony)
    const droneFreqs = [155.56, 233.08, 311.13]; // Sa low, Pa mid, Sa mid
    droneFreqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Subtle warm filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 + idx * 200, this.ctx.currentTime);

      // Gentle pulsating LFO to mimic tanpura string plucking rhythm
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.2 + idx * 0.15, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      lfo.connect(lfoGain.gain);

      gain.gain.setValueAtTime(0.12 - idx * 0.02, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.droneGain);

      osc.start();
      lfo.start();
    });
  }

  playShehnaiNote(freq, duration, hasSlide) {
    if (!this.isPlaying || !this.ctx) return;

    const now = this.ctx.currentTime;

    // Double-reed Shehnai acoustics: rich sawtooth + sine harmonics with vibrato
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();

    const noteGain = this.ctx.createGain();
    const biquad = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    // Vibrato effect (typical shehnai ornamentation - Meend & Gamak)
    vibrato.frequency.setValueAtTime(5.8, now); // ~6Hz vibrato
    vibratoGain.gain.setValueAtTime(freq * 0.025, now);
    vibrato.connect(osc1.frequency);
    vibrato.connect(osc2.frequency);

    if (hasSlide) {
      // Meend (Indian slide articulation)
      const prevFreq = this.lastFreq || freq * 0.9;
      osc1.frequency.setValueAtTime(prevFreq, now);
      osc2.frequency.setValueAtTime(prevFreq, now);
      osc1.frequency.exponentialRampToValueAtTime(freq, now + 0.18);
      osc2.frequency.exponentialRampToValueAtTime(freq, now + 0.18);
    } else {
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq, now);
    }
    this.lastFreq = freq;

    // Bandpass filter to simulate shehnai wooden horn acoustics
    biquad.type = 'bandpass';
    biquad.frequency.setValueAtTime(1400, now);
    biquad.Q.setValueAtTime(2.2, now);

    // Envelope
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(0.24, now + 0.08); // Attack
    noteGain.gain.exponentialRampToValueAtTime(0.18, now + duration * 0.7); // Sustain
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration); // Release

    osc1.connect(biquad);
    osc2.connect(biquad);
    biquad.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    vibrato.start(now);

    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
    vibrato.stop(now + duration + 0.1);

    // Occasionally add a gentle golden bell chime (Ghungroo / Tinkle)
    if (Math.random() > 0.65) {
      this.playGhungrooChime(now + duration * 0.5);
    }
  }

  playGhungrooChime(time) {
    const chimeOsc = this.ctx.createOscillator();
    const chimeGain = this.ctx.createGain();
    chimeOsc.type = 'sine';
    chimeOsc.frequency.setValueAtTime(2489 + Math.random() * 400, time);

    chimeGain.gain.setValueAtTime(0.001, time);
    chimeGain.gain.linearRampToValueAtTime(0.04, time + 0.01);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.8);

    chimeOsc.connect(chimeGain);
    chimeGain.connect(this.masterGain);

    chimeOsc.start(time);
    chimeOsc.stop(time + 0.85);
  }

  stepMelody() {
    if (!this.isPlaying) return;

    const currentItem = this.melody[this.currentNoteIndex];
    const freq = this.scale[currentItem.note];

    this.playShehnaiNote(freq, currentItem.dur, currentItem.slide);

    this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melody.length;
    this.timerId = setTimeout(() => {
      this.stepMelody();
    }, currentItem.dur * 1000);
  }

  start() {
    this.init();
    if (this.isPlaying) return;

    this.isPlaying = true;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(0.7, now + 1.5); // Smooth fade in

    this.stepMelody();
  }

  pause() {
    if (!this.isPlaying || !this.ctx) return;
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(0.001, now + 0.8); // Smooth fade out
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

// Global engine instance
window.royalShehnai = new RoyalShehnaiEngine();
