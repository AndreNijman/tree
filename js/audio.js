// ---------- Procedural audio ----------
var AudioSys = {
  ctx: null,
  master: null,
  musicGain: null,
  sfxGain: null,
  enabled: true,
  masterVolume: 0.6,
  musicVolume: 0.3,
  sfxVolume: 0.5,
  _musicOsc: null,
  _musicTimer: 0,
  _ambientTimer: 0,

  init: function() {
    if (this.ctx) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.masterVolume;
      this.master.connect(this.ctx.destination);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.master);
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicVolume;
      this.musicGain.connect(this.master);
    } catch (e) { this.enabled = false; }
  },

  resume: function() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },

  setVolume: function(type, vol) {
    if (typeof vol !== 'number' || !isFinite(vol)) return;
    vol = Math.max(0, Math.min(1, vol));
    if (type === 'master') { this.masterVolume = vol; if (this.master) this.master.gain.value = vol; }
    if (type === 'music') { this.musicVolume = vol; if (this.musicGain) this.musicGain.gain.value = vol; }
    if (type === 'sfx') { this.sfxVolume = vol; if (this.sfxGain) this.sfxGain.gain.value = vol; }
  },

  tone: function(freq, dur, type, vol, slide, delay, dest) {
    if (!this.enabled || !this.ctx) return;
    var t0 = this.ctx.currentTime + (delay || 0);
    var osc = this.ctx.createOscillator();
    var g = this.ctx.createGain();
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(freq, t0);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(slide, 1), t0 + dur);
    g.gain.setValueAtTime(vol || 0.15, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(g); g.connect(dest || this.sfxGain);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  },

  noise: function(dur, vol, filterFreq, delay, dest) {
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
    src.connect(f); f.connect(g); g.connect(dest || this.sfxGain);
    src.start(t0); src.stop(t0 + dur);
  },

  play: function(name) {
    if (!this.enabled || !this.ctx) return;
    switch (name) {
      case 'jump': this.tone(220, 0.1, 'square', 0.08, 440); break;
      case 'land': this.noise(0.06, 0.08, 300); break;
      case 'hit': this.noise(0.1, 0.22, 1200); break;
      case 'hitSoft': this.noise(0.06, 0.12, 800); break;
      case 'mine':
        var mFreq = 250 + Math.random() * 100;
        this.tone(mFreq, 0.04, 'square', 0.06, mFreq - 80);
        this.noise(0.04, 0.08, 1000 + Math.random() * 400);
        break;
      case 'mineHard':
        this.tone(180 + Math.random() * 60, 0.05, 'triangle', 0.08, 120);
        this.noise(0.05, 0.1, 600);
        break;
      case 'break':
        this.tone(160 + Math.random() * 40, 0.12, 'square', 0.14, 70);
        this.noise(0.15, 0.18, 600);
        this.tone(100, 0.08, 'triangle', 0.06, 50, 0.04);
        break;
      case 'place': this.tone(500, 0.06, 'square', 0.08, 380); break;
      case 'hurt':
        this.tone(120, 0.2, 'sawtooth', 0.22, 60);
        this.noise(0.12, 0.14, 400);
        break;
      case 'hurtHard':
        this.tone(90, 0.3, 'sawtooth', 0.28, 45);
        this.noise(0.18, 0.18, 350);
        break;
      case 'shoot': this.tone(900, 0.07, 'square', 0.08, 300); break;
      case 'shootHeavy': this.tone(600, 0.1, 'sawtooth', 0.1, 200); this.noise(0.06, 0.08, 1500); break;
      case 'bow': this.noise(0.07, 0.1, 2500); break;
      case 'laser': this.tone(1400, 0.12, 'sawtooth', 0.1, 200); break;
      case 'magic':
        this.tone(600 + Math.random() * 200, 0.15, 'sine', 0.12, 1200);
        break;
      case 'magicBig':
        this.tone(400, 0.2, 'sine', 0.14, 1000);
        this.tone(800, 0.15, 'sine', 0.08, 1600, 0.06);
        break;
      case 'potion':
        this.tone(400, 0.18, 'sine', 0.14, 800);
        this.tone(600, 0.22, 'sine', 0.12, 1200, 0.1);
        break;
      case 'craft':
        this.tone(520, 0.08, 'triangle', 0.12, 660);
        this.tone(660, 0.1, 'triangle', 0.12, 880, 0.06);
        this.tone(880, 0.08, 'triangle', 0.08, 1100, 0.14);
        break;
      case 'pickup':
        this.tone(880, 0.05, 'sine', 0.08, 1320);
        break;
      case 'pickupRare':
        this.tone(660, 0.06, 'sine', 0.1, 990);
        this.tone(990, 0.06, 'sine', 0.1, 1320, 0.06);
        break;
      case 'roar':
        this.tone(90, 0.5, 'sawtooth', 0.3, 45);
        this.tone(70, 0.7, 'sawtooth', 0.25, 40, 0.1);
        break;
      case 'bossDeath':
        this.tone(400, 0.3, 'square', 0.2, 50);
        this.noise(0.6, 0.3, 300);
        this.tone(300, 0.4, 'triangle', 0.1, 100, 0.3);
        break;
      case 'death':
        this.tone(300, 0.6, 'sawtooth', 0.25, 60);
        break;
      case 'spawn':
        this.tone(200, 0.2, 'sawtooth', 0.2, 400);
        this.noise(0.25, 0.2, 500);
        break;
      case 'warp':
        this.tone(400, 0.15, 'sine', 0.12, 800);
        this.tone(800, 0.15, 'sine', 0.08, 1600, 0.05);
        this.noise(0.2, 0.08, 2000, 0.08);
        break;
      case 'coin':
        this.tone(1200, 0.04, 'sine', 0.08, 1600);
        this.tone(1600, 0.04, 'sine', 0.06, 2000, 0.04);
        break;
    }
  },

  updateMusic: function(game) {
    if (!this.enabled || !this.ctx || !this.musicGain) return;
    var dt = 1 / 60;
    this._musicTimer -= dt;
    this._ambientTimer -= dt;
    if (this._musicTimer > 0) return;

    var t = game.timeOfDay;
    var underground = game.player.y > game.world.surfaceY[Math.floor(game.player.x / TILE)] * TILE + 100;
    var night = t < 0.22 || t > 0.78;
    var boss = game.anyBossAlive && game.anyBossAlive();

    // ambient drip/stalactite in caves
    if (underground && this._ambientTimer <= 0) {
      this._ambientTimer = 3 + Math.random() * 5;
      this.tone(1800 + Math.random() * 400, 0.03, 'sine', 0.03, 900, Math.random() * 2);
    }

    // simple tonal music bed
    if (boss) {
      this._musicTimer = 0.8;
      this.tone(110, 0.4, 'sawtooth', 0.04, 55, 0, this.musicGain);
      this.tone(140, 0.3, 'square', 0.02, 70, 0.1, this.musicGain);
    } else if (underground) {
      this._musicTimer = 2 + Math.random();
      var base = night ? 65 : 82;
      this.tone(base, 1.5, 'sine', 0.025, base * 0.5, 0, this.musicGain);
      this.tone(base * 1.5, 1.2, 'triangle', 0.015, base * 0.75, 0.3, this.musicGain);
    } else if (night) {
      this._musicTimer = 2.5 + Math.random();
      this.tone(73, 2, 'sine', 0.03, 36, 0, this.musicGain);
      this.tone(110, 1.5, 'triangle', 0.015, 55, 0.5, this.musicGain);
    } else {
      this._musicTimer = 3 + Math.random();
      this.tone(130, 2.5, 'sine', 0.02, 65, 0, this.musicGain);
      this.tone(196, 2, 'triangle', 0.012, 98, 0.8, this.musicGain);
    }
  }
};
