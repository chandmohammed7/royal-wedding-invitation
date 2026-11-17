/**
 * ==========================================================================
 * ROYAL WEDDING SHAHNAI & AMBIENT MUSIC ENGINE (Web Audio API)
 * Soulful Traditional Indian Shehnai (शहनाई), Tanpura Drone (तानपूरा),
 * & Golden Ghungroo Chimes (घुंघरू)
 * 100% Offline, Zero external dependencies, Zero CORS/Network issues.
 * ==========================================================================
 */

class RoyalShehnaiEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.droneGain = null;
    this.shehnaiGain = null;
    this.melodyTimer = null;
    this.currentNoteIndex = 0;
    this.lastFreq = null;

    // Auspicious Raag Yaman & Bhairavi Wedding Swaras (Tuned to D# / Eb Shehnai pitch)
    this.notes = {
      Sa_low: 155.56,
      Pa_low: 233.08,
      Dha_low: 261.63,
      Ni_low: 293.66,
      Sa: 311.13,      // D#4 Base
      Re: 349.23,      // F4 (Shuddha Re)
      Ga: 392.00,      // G4 (Shuddha Ga)
      Ma: 415.30,      // G#4 (Komal Ma)
      TivraMa: 440.00, // A4 (Teevra Ma)
      Pa: 466.16,      // A#4 (Pa)
      Dha: 523.25,     // C5 (Dha)
      Ni: 587.33,      // D5 (Ni)
      Sa_high: 622.25, // D#5 (Taar Sa)
      Re_high: 698.46, // F5 (Taar Re)
      Ga_high: 783.99  // G5 (Taar Ga)
    };

    // Authentic Traditional Wedding Melody Sequence (Auspicious Shehnai Sargam)
    this.melody = [
      // Phrase 1: Mangal Aalaap (Sa -> Re -> Ga -> Pa)
      { freq: this.notes.Sa, dur: 1.4, meend: false, vol: 0.28 },
      { freq: this.notes.Re, dur: 0.9, meend: true, vol: 0.30 },
      { freq: this.notes.Ga, dur: 1.6, meend: true, vol: 0.32 },
      { freq: this.notes.Pa, dur: 2.2, meend: true, vol: 0.35, chime: true },

      // Phrase 2: Joyful ornamentation (Pa -> Dha -> Ni -> Sa_high)
      { freq: this.notes.Ma, dur: 0.6, meend: true, vol: 0.28 },
      { freq: this.notes.Ga, dur: 1.0, meend: true, vol: 0.30 },
      { freq: this.notes.Re, dur: 1.2, meend: true, vol: 0.28 },
      { freq: this.notes.Sa, dur: 2.4, meend: false, vol: 0.25 },

      // Phrase 3: Ascending celebration (Jashn-e-Shaadi climax)
      { freq: this.notes.Pa, dur: 1.1, meend: true, vol: 0.32 },
      { freq: this.notes.Dha, dur: 1.2, meend: true, vol: 0.34 },
      { freq: this.notes.Ni, dur: 1.4, meend: true, vol: 0.36 },
      { freq: this.notes.Sa_high, dur: 2.5, meend: true, vol: 0.38, chime: true },
      { freq: this.notes.Re_high, dur: 0.9, meend: true, vol: 0.36 },
      { freq: this.notes.Sa_high, dur: 1.5, meend: true, vol: 0.34 },
      { freq: this.notes.Ni, dur: 0.8, meend: true, vol: 0.30 },
      { freq: this.notes.Dha, dur: 1.1, meend: true, vol: 0.30 },
      { freq: this.notes.Pa, dur: 2.2, meend: true, vol: 0.32 },

      // Phrase 4: Gentle emotional resolution (Dua & Mubarakbaad)
      { freq: this.notes.Ga, dur: 1.2, meend: true, vol: 0.30 },
      { freq: this.notes.TivraMa, dur: 0.8, meend: true, vol: 0.32 },
      { freq: this.notes.Pa, dur: 1.6, meend: true, vol: 0.34, chime: true },
      { freq: this.notes.Ga, dur: 1.0, meend: true, vol: 0.28 },
      { freq: this.notes.Re, dur: 1.3, meend: true, vol: 0.28 },
      { freq: this.notes.Sa, dur: 3.2, meend: true, vol: 0.26 }
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Warm Dynamics Processor
      const compressor = this.ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-16, this.ctx.currentTime);
      compressor.knee.setValueAtTime(24, this.ctx.currentTime);
      compressor.ratio.setValueAtTime(5, this.ctx.currentTime);
      compressor.attack.setValueAtTime(0.008, this.ctx.currentTime);
      compressor.release.setValueAtTime(0.25, this.ctx.currentTime);
      compressor.connect(this.ctx.destination);

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.connect(compressor);

      // Setup continuous Tanpura Drone harmony
      this.setupTanpuraDrone();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Tanpura Drone: Simulates 4 tuned strings (Pa, Sa, Sa, Kharaj Sa)
   * producing eternal meditative resonance typical of royal Indian weddings.
   */
  setupTanpuraDrone() {
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    this.droneGain.connect(this.masterGain);

    const droneStrings = [
      { freq: this.notes.Pa_low, type: 'triangle', filterFreq: 650, vol: 0.12, lfoRate: 0.18 },
      { freq: this.notes.Sa, type: 'sine', filterFreq: 900, vol: 0.15, lfoRate: 0.24 },
      { freq: this.notes.Sa, type: 'triangle', filterFreq: 1100, vol: 0.10, lfoRate: 0.32 },
      { freq: this.notes.Sa_low, type: 'sine', filterFreq: 450, vol: 0.20, lfoRate: 0.15 }
    ];

    droneStrings.forEach(str => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = str.type;
      osc.frequency.setValueAtTime(str.freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(str.filterFreq, this.ctx.currentTime);

      // Shimmer LFO for gentle rhythmic string plucking
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(str.lfoRate, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      lfo.connect(lfoGain.gain);

      gain.gain.setValueAtTime(str.vol, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.droneGain);

      osc.start();
      lfo.start();
    });
  }

  /**
   * Shehnai Double-Reed Acoustics:
   * Uses dual oscillators with sawtooth & square nasal harmonics,
   * coupled with 2 resonant formant bandpass filters and authentic vibrato (Gamak).
   */
  playShehnaiNote(freq, duration, hasMeend, targetVol = 0.30) {
    if (!this.isPlaying || !this.ctx) return;

    const now = this.ctx.currentTime;

    const oscSaw = this.ctx.createOscillator();
    const oscSquare = this.ctx.createOscillator();
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();

    const noteGain = this.ctx.createGain();
    const formant1 = this.ctx.createBiquadFilter();
    const formant2 = this.ctx.createBiquadFilter();

    oscSaw.type = 'sawtooth';
    oscSquare.type = 'triangle';

    // Gamak / Vibrato: 5.6 Hz natural vocal modulation
    vibrato.frequency.setValueAtTime(5.6, now);
    vibratoGain.gain.setValueAtTime(freq * 0.022, now);
    vibrato.connect(oscSaw.frequency);
    vibrato.connect(oscSquare.frequency);

    // Meend (Continuous slide from previous note for emotional fluidity)
    if (hasMeend && this.lastFreq) {
      oscSaw.frequency.setValueAtTime(this.lastFreq, now);
      oscSquare.frequency.setValueAtTime(this.lastFreq, now);
      oscSaw.frequency.exponentialRampToValueAtTime(freq, now + 0.16);
      oscSquare.frequency.exponentialRampToValueAtTime(freq, now + 0.16);
    } else {
      oscSaw.frequency.setValueAtTime(freq, now);
      oscSquare.frequency.setValueAtTime(freq, now);
    }
    this.lastFreq = freq;

    // Double formant filtering simulating wooden shehnai bell resonance
    formant1.type = 'bandpass';
    formant1.frequency.setValueAtTime(1350, now);
    formant1.Q.setValueAtTime(2.4, now);

    formant2.type = 'peaking';
    formant2.frequency.setValueAtTime(2800, now);
    formant2.gain.setValueAtTime(4.5, now);
    formant2.Q.setValueAtTime(1.8, now);

    // Dynamic Swara Envelope
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(targetVol, now + 0.07); // Swara attack
    noteGain.gain.exponentialRampToValueAtTime(targetVol * 0.85, now + duration * 0.7); // Sustain
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration); // Soft breath release

    oscSaw.connect(formant1);
    oscSquare.connect(formant1);
    formant1.connect(formant2);
    formant2.connect(noteGain);
    noteGain.connect(this.masterGain);

    oscSaw.start(now);
    oscSquare.start(now);
    vibrato.start(now);

    const stopTime = now + duration + 0.08;
    oscSaw.stop(stopTime);
    oscSquare.stop(stopTime);
    vibrato.stop(stopTime);
  }

  /**
   * Royal Temple Chime / Ghungroo Tinkle
   */
  playChime(time = null) {
    if (!this.ctx) return;
    const t = time !== null ? time : this.ctx.currentTime;

    const chimeFreqs = [2489, 3135, 4186]; // High festive harmonics
    chimeFreqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f + (Math.random() - 0.5) * 40, t + idx * 0.03);

      gain.gain.setValueAtTime(0.001, t + idx * 0.03);
      gain.gain.linearRampToValueAtTime(0.035, t + idx * 0.03 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.03 + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + idx * 0.03);
      osc.stop(t + idx * 0.03 + 1.25);
    });
  }

  /**
   * Authentic Wax Seal Cracking Sound
   */
  playSealBreakSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Low wooden snap + high ceramic crackle
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);

    // Chime sparkle
    this.playChime(now + 0.05);
  }

  stepMelody() {
    if (!this.isPlaying) return;

    const item = this.melody[this.currentNoteIndex];
    this.playShehnaiNote(item.freq, item.dur, item.meend, item.vol);

    if (item.chime) {
      this.playChime(this.ctx.currentTime + item.dur * 0.5);
    }

    this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melody.length;
    this.melodyTimer = setTimeout(() => {
      this.stepMelody();
    }, item.dur * 1000);
  }

  start() {
    this.init();
    if (this.isPlaying) return;

    this.isPlaying = true;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(0.75, now + 1.6); // Smooth luxury fade in

    this.stepMelody();
  }

  pause() {
    if (!this.isPlaying || !this.ctx) return;
    this.isPlaying = false;
    if (this.melodyTimer) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(0.001, now + 0.9); // Smooth fade out
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

// Global Instance
window.royalShehnai = new RoyalShehnaiEngine();
