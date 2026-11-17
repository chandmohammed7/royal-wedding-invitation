/**
 * ==========================================================================
 * AUDIO ENGINE - MUTED / DISABLED
 * Shehnai music has been completely disabled per user preference.
 * ==========================================================================
 */

class RoyalShehnaiEngine {
  constructor() {
    this.isPlaying = false;
  }
  init() {}
  start() {}
  pause() {}
  toggle() { return false; }
  playShehnaiNote() {}
  playChime() {}
  playSealBreakSound() {}
}

window.royalShehnai = new RoyalShehnaiEngine();
