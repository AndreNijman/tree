// ---------- Procedural audio ----------
var AudioSys = {
  ctx: null,
  master: null,
  enabled: true,

  init: function() {
    if (this.ctx) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);
    } catch (e) { this.enabled = false; }
  },

  resume: function() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },

  tone: function(freq, dur, type, vol, slide, delay) {
    if (!this.enabled || !this.ctx) return;
    var t0 = this.ctx.currentTime + (delay || 0);
    var osc = this.ctx.createOscillator();
    var g = this.ctx.createGain();
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(freq, t0);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(slide, 1), t0 + dur);
    g.gain.setValueAtTime(vol || 0.15, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(g); g.connect(this.master);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  },

  noise: function(dur, vol, filterFreq, delay) {
    if (!this.enabled || !this.ctx) return;
    var t0 = this.ctx.currentTime + (delay || 0);
    var len = Math.floor(this.ctx.sampleRate * dur);
    var buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    var src = this.ctx.createBufferSource();
    src.buffer = buf;
    var f = this.ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = filterFreq || 800;
    var g = this.ctx.createGain();
    g.gain.setValueAtTime(vol || 0.2, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(this.master);
    src.start(t0); src.stop(t0 + dur);
  },

  play: function(name) {
    if (!this.enabled || !this.ctx) return;
    switch (name) {
      case 'jump': this.tone(220, 0.12, 'square', 0.08, 440); break;
      case 'land': this.noise(0.08, 0.1, 300); break;
      case 'hit': this.noise(0.1, 0.25, 1200); break;
      case 'mine': this.tone(300, 0.05, 'square', 0.07, 220); this.noise(0.05, 0.1, 1000); break;
      case 'break': this.tone(180, 0.1, 'square', 0.12, 90); this.noise(0.12, 0.15, 600); break;
      case 'place': this.tone(500, 0.07, 'square', 0.09, 380); break;
      case 'hurt': this.tone(120, 0.25, 'sawtooth', 0.2, 60); this.noise(0.15, 0.12, 400); break;
      case 'shoot': this.tone(900, 0.08, 'square', 0.08, 300); break;
      case 'bow': this.noise(0.08, 0.12, 2500); break;
      case 'laser': this.tone(1400, 0.12, 'sawtooth', 0.1, 200); break;
      case 'magic': this.tone(600, 0.15, 'sine', 0.14, 1200); break;
      case 'potion': this.tone(400, 0.2, 'sine', 0.15, 800); this.tone(600, 0.25, 'sine', 0.15, 1200, 0.12); break;
      case 'craft': this.tone(520, 0.09, 'triangle', 0.14, 660); this.tone(660, 0.12, 'triangle', 0.14, 880, 0.08); break;
      case 'pickup': this.tone(880, 0.06, 'sine', 0.1, 1320); break;
      case 'roar': this.tone(90, 0.5, 'sawtooth', 0.3, 45); this.tone(70, 0.7, 'sawtooth', 0.25, 40, 0.1); break;
      case 'bossDeath': this.tone(400, 0.3, 'square', 0.2, 50); this.noise(0.6, 0.3, 300); break;
      case 'death': this.tone(300, 0.6, 'sawtooth', 0.25, 60); break;
      case 'spawn': this.tone(200, 0.2, 'sawtooth', 0.2, 400); this.noise(0.25, 0.2, 500); break;
    }
  }
};
