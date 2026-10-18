// Tüm sesler WebAudio ile kodla üretilir (dosya gerekmez).
window.SFX = (function () {
  let ctx = null;
  let master = null;
  let muted = false;

  function ac() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      ctx = new C();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function out() { ac(); return master; }

  function noiseBuf(dur) {
    const c = ac();
    const b = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dur)), c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  function env(g, t, a, d, peak) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }
  function tone(type, f0, f1, dur, vol, delay) {
    if (muted) return;
    const c = ac(); const t = c.currentTime + (delay || 0);
    const o = c.createOscillator(); const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t + dur);
    env(g, t, 0.008, dur, vol);
    o.connect(g); g.connect(out());
    o.start(t); o.stop(t + dur + 0.05);
  }
  function noise(dur, vol, ftype, freq, q, delay) {
    if (muted) return;
    const c = ac(); const t = c.currentTime + (delay || 0);
    const s = c.createBufferSource(); s.buffer = noiseBuf(dur);
    const f = c.createBiquadFilter(); f.type = ftype; f.frequency.value = freq; f.Q.value = q || 1;
    const g = c.createGain(); env(g, t, 0.004, dur, vol);
    s.connect(f); f.connect(g); g.connect(out());
    s.start(t); s.stop(t + dur + 0.05);
  }
  function vib(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

  // ---- Kedi sesleri ----
  function meow(pitch, len) {
    if (muted) return;
    pitch = pitch || 1; len = len || 0.55;
    const c = ac(); const t = c.currentTime;
    const f = c.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 4;
    f.frequency.setValueAtTime(700, t);
    f.frequency.linearRampToValueAtTime(2100, t + len * 0.35);
    f.frequency.linearRampToValueAtTime(900, t + len);
    const g = c.createGain(); env(g, t, 0.06, len, 0.55);
    f.connect(g); g.connect(out());
    [1, 1.01].forEach(function (det) {
      const o = c.createOscillator(); o.type = "sawtooth";
      o.frequency.setValueAtTime(420 * pitch * det, t);
      o.frequency.linearRampToValueAtTime(820 * pitch * det, t + len * 0.35);
      o.frequency.linearRampToValueAtTime(380 * pitch * det, t + len);
      o.connect(f); o.start(t); o.stop(t + len + 0.1);
    });
    vib(25);
  }
  function purr(dur) {
    if (muted) return function () {};
    dur = dur || 1.2;
    const c = ac(); const t = c.currentTime;
    const s = c.createBufferSource(); s.buffer = noiseBuf(dur); s.loop = true;
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 160;
    const am = c.createGain(); am.gain.value = 0.5;
    const lfo = c.createOscillator(); lfo.frequency.value = 26;
    const lfoG = c.createGain(); lfoG.gain.value = 0.5;
    lfo.connect(lfoG); lfoG.connect(am.gain);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.7, t + 0.15);
    g.gain.setValueAtTime(0.7, t + dur - 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(lp); lp.connect(am); am.connect(g); g.connect(out());
    s.start(t); lfo.start(t); s.stop(t + dur + 0.05); lfo.stop(t + dur + 0.05);
    return function () { try { g.gain.cancelScheduledValues(c.currentTime); g.gain.setTargetAtTime(0.0001, c.currentTime, 0.05); } catch (e) {} };
  }
  function eat() {
    for (let i = 0; i < 4; i++) {
      noise(0.07, 0.5, "bandpass", 1400 + Math.random() * 600, 2, i * 0.16);
      tone("triangle", 220, 110, 0.06, 0.15, i * 0.16);
    }
  }
  function sleepy() { tone("sine", 330, 220, 0.5, 0.15); tone("sine", 262, 196, 0.6, 0.12, 0.35); }

  // ---- Arayüz sesleri ----
  function click() { tone("triangle", 660, 880, 0.06, 0.18); }
  function coin() { tone("square", 988, 988, 0.07, 0.12); tone("square", 1319, 1319, 0.18, 0.12, 0.07); }
  function pop() { tone("sine", 500, 900, 0.08, 0.25); }
  function bad() { tone("sawtooth", 220, 110, 0.25, 0.2); }
  function win() { [523, 659, 784, 1047].forEach(function (f, i) { tone("square", f, f, 0.16, 0.12, i * 0.11); }); }
  function lose() { [392, 330, 262, 196].forEach(function (f, i) { tone("triangle", f, f * 0.95, 0.2, 0.2, i * 0.14); }); }
  function flip() { tone("triangle", 400, 700, 0.07, 0.18); }
  function jump() { tone("square", 300, 700, 0.15, 0.1); }

  // ---- Dayak sesleri: şak, çat, küt, pat, bam ----
  function sak() {      // tokat
    noise(0.1, 0.9, "highpass", 2200, 1);
    tone("triangle", 380, 90, 0.08, 0.4);
    vib(30);
  }
  function cat() {      // çat (kırılma / çatlama)
    noise(0.06, 0.9, "bandpass", 3600, 9);
    tone("square", 1900, 380, 0.05, 0.3);
    noise(0.05, 0.7, "bandpass", 2400, 7, 0.05);
    tone("square", 1500, 300, 0.05, 0.25, 0.05);
    vib(40);
  }
  function kut() {      // küt (ağır darbe)
    tone("sine", 170, 42, 0.22, 0.95);
    noise(0.09, 0.5, "lowpass", 500, 1);
    vib(50);
  }
  function pat() {      // yumuşak yastık
    noise(0.14, 0.7, "lowpass", 900, 1);
    tone("sine", 140, 70, 0.12, 0.4);
    vib(15);
  }
  function bam() {      // büyük patlama
    tone("sine", 100, 28, 0.4, 1.0);
    noise(0.3, 0.8, "lowpass", 800, 1);
    tone("square", 800, 90, 0.1, 0.25);
    vib(90);
  }
  function ouch(pitch) { // "ahh" sesi
    if (muted) return;
    pitch = pitch || 1;
    const c = ac(); const t = c.currentTime; const len = 0.35;
    const f = c.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 850; f.Q.value = 3;
    const g = c.createGain(); env(g, t, 0.03, len, 0.5);
    f.connect(g); g.connect(out());
    const o = c.createOscillator(); o.type = "sawtooth";
    o.frequency.setValueAtTime(340 * pitch, t);
    o.frequency.exponentialRampToValueAtTime(170 * pitch, t + len);
    const v = c.createOscillator(); v.frequency.value = 9;
    const vg = c.createGain(); vg.gain.value = 12 * pitch;
    v.connect(vg); vg.connect(o.frequency);
    o.connect(f); o.start(t); v.start(t); o.stop(t + len + 0.1); v.stop(t + len + 0.1);
  }

  // ---- Kaydedilen sesi tiz (kedi gibi) çal ----
  function playBuffer(buf, rate) {
    if (muted) return;
    const c = ac(); const s = c.createBufferSource();
    s.buffer = buf; s.playbackRate.value = rate || 1.7;
    const g = c.createGain(); g.gain.value = 1.4;
    s.connect(g); g.connect(out()); s.start();
    return s;
  }

  return {
    unlock: function () { ac(); },
    setMuted: function (m) { muted = m; },
    isMuted: function () { return muted; },
    ctx: ac,
    meow: meow, purr: purr, eat: eat, sleepy: sleepy,
    click: click, coin: coin, pop: pop, bad: bad, win: win, lose: lose, flip: flip, jump: jump,
    sak: sak, cat: cat, kut: kut, pat: pat, bam: bam, ouch: ouch,
    playBuffer: playBuffer, vib: vib
  };
})();
