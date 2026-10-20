// "Düğme'nin Ninnisi": müzik kutusu sesiyle, kodla üretilen kısa bir ninni (dış dosya yok).
// Melodi bize ait, bilinen bir şarkı değil.
window.Lullaby = (function () {
  var RATE = 22050, BPM = 78, BEAT = 60 / BPM;
  var CH = ["C", "Am", "F", "G", "C", "Am", "F", "C", "F", "C", "G", "G", "F", "G", "Am", "C"];
  var ROOT = { C: 48, Am: 45, F: 41, G: 43 };
  var THIRD = { C: 4, Am: 3, F: 4, G: 4 };
  var MEL = [
    [[76, 1], [79, 1], [81, 1]], [[79, 2], [76, 1]], [[74, 1], [76, 1], [72, 1]], [[74, 3]],
    [[76, 1], [79, 1], [84, 1]], [[81, 2], [79, 1]], [[76, 1], [74, 1], [72, 1]], [[72, 3]],
    [[81, 1], [84, 1], [81, 1]], [[79, 2], [76, 1]], [[74, 1], [79, 1], [74, 1]], [[71, 2], [74, 1]],
    [[72, 1], [76, 1], [81, 1]], [[79, 2], [74, 1]], [[76, 1], [74, 1], [72, 1]], [[72, 3]]
  ];

  function freq(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function note(ctx, bus, t, midi, dur, vol, bright) {
    var f = freq(midi), g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(bus);
    var parts = [[1, 1], [2, 0.3], [3.01, 0.12], [4.2, 0.08 * bright]];
    for (var i = 0; i < parts.length; i++) {
      var o = ctx.createOscillator(), pg = ctx.createGain();
      o.type = "sine"; o.frequency.value = f * parts[i][0]; pg.gain.value = parts[i][1];
      o.connect(pg); pg.connect(g);
      o.start(t); o.stop(t + dur + 0.05);
    }
  }

  function wav(data, rate) {
    var n = data.length, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf), i;
    function s(o, str) { for (var k = 0; k < str.length; k++) v.setUint8(o + k, str.charCodeAt(k)); }
    s(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); s(8, "WAVE"); s(12, "fmt ");
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    s(36, "data"); v.setUint32(40, n * 2, true);
    for (i = 0; i < n; i++) { var x = Math.max(-1, Math.min(1, data[i])); v.setInt16(44 + i * 2, x < 0 ? x * 0x8000 : x * 0x7fff, true); }
    return new Blob([buf], { type: "audio/wav" });
  }

  function render() {
    var OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OC) return Promise.reject(new Error("OfflineAudioContext yok"));
    var secs = CH.length * 3 * BEAT + 3.5;
    var ctx = new OC(1, Math.ceil(secs * RATE), RATE);
    var bus = ctx.createGain(), dry = ctx.createGain(), wet = ctx.createGain(), master = ctx.createGain();
    dry.gain.value = 0.8; wet.gain.value = 0.32; master.gain.value = 0.9;
    var ir = ctx.createBuffer(1, Math.floor(RATE * 1.4), RATE), d = ir.getChannelData(0);
    for (var k = 0; k < d.length; k++) d[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / d.length, 2.4);
    var conv = ctx.createConvolver(); conv.buffer = ir;
    bus.connect(dry); dry.connect(master); bus.connect(conv); conv.connect(wet); wet.connect(master); master.connect(ctx.destination);

    for (var b = 0; b < CH.length; b++) {
      var t0 = 0.2 + b * 3 * BEAT, c = CH[b], r = ROOT[c], th = THIRD[c];
      var arp = [r, r + 7, r + th + 12, r + 7, r + th + 12, r + 7];
      for (var a = 0; a < 6; a++) note(ctx, bus, t0 + a * 0.5 * BEAT, arp[a], 1.0, a === 0 ? 0.2 : 0.12, 0.6);
      var pos = 0;
      for (var m = 0; m < MEL[b].length; m++) {
        var nt = MEL[b][m];
        note(ctx, bus, t0 + pos * BEAT, nt[0], 1.7 + nt[1] * 0.3, 0.3, 1);
        pos += nt[1];
      }
    }
    return ctx.startRendering().then(function (buf) {
      var src = buf.getChannelData(0), out = new Float32Array(src.length), peak = 0, i;
      for (i = 0; i < src.length; i++) { var a2 = Math.abs(src[i]); if (a2 > peak) peak = a2; }
      var gain = peak > 0 ? 0.85 / peak : 1;
      for (i = 0; i < src.length; i++) out[i] = src[i] * gain;
      return { blob: wav(out, RATE), duration: src.length / RATE, peak: peak };
    });
  }
  return { render: render };
})();
