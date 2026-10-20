// Umut'u döv ekranı: çöp adam, şak/çat/küt sesleri, efektler, morarma
window.Beat = (function () {
  var $ = App.$, rnd = App.rnd, clamp = App.clamp;
  var TOOLS = {
    punch:   { icon: "fist",    dmg: 3, words: ["ŞAK!", "KÜT!", "PAT!"],          snd: function () { SFX.sak(); if (Math.random() < 0.5) SFX.kut(); } },
    hammer:  { icon: "hammer",  dmg: 6, words: ["ÇAT!", "BAM!", "TAK!", "KÜT!"],  snd: function () { SFX.cat(); SFX.kut(); } },
    slipper: { icon: "slipper", dmg: 2, words: ["ŞAPLAK!", "ŞAK!", "ŞAP!"],       snd: function () { SFX.sak(); } },
    glove:   { icon: "glove",   dmg: 4, words: ["KÜT!", "BOM!", "BAM!"],          snd: function () { SFX.kut(); SFX.sak(); } },
    pillow:  { icon: "pillow",  dmg: 1, words: ["PÖF!", "PAT!", "POF!"],          snd: function () { SFX.pat(); } }
  };
  var COLORS = ["#ffd23f", "#ff5c8a", "#6ee7a0", "#4fc3f7", "#ff8a5c", "#ffffff"];
  var INK = "#4a3340";
  var BRUISES = [
    '<circle cx="128" cy="62" r="12" fill="#7a4bbf" opacity=".65"/>',
    '<circle cx="124" cy="90" r="17" fill="#3d1f6e" opacity=".7"/>',
    '<g><circle cx="170" cy="56" r="11" fill="#ff6b6b"/><path d="M166 52 Q170 49 174 52" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g>',
    '<circle cx="182" cy="116" r="13" fill="#5a8a5a" opacity=".6"/><circle cx="182" cy="116" r="8" fill="#7a4bbf" opacity=".55"/>',
    '<circle cx="176" cy="90" r="17" fill="#3d1f6e" opacity=".7"/>',
    '<ellipse cx="150" cy="205" rx="16" ry="22" fill="#7a4bbf" opacity=".55"/>',
    '<g transform="rotate(-25 160 72)"><rect x="140" y="64" width="40" height="15" rx="3" fill="#f2c7a0" stroke="#c9976d" stroke-width="2"/><rect x="154" y="64" width="12" height="15" fill="#fff" opacity=".6"/></g>',
    '<ellipse cx="116" cy="205" rx="10" ry="15" fill="#3d1f6e" opacity=".6" transform="rotate(40 116 205)"/>',
    '<g><rect x="190" y="205" width="22" height="12" rx="3" fill="#fff" stroke="#999" stroke-width="2" transform="rotate(35 200 211)"/></g>',
    '<circle cx="128" cy="116" r="10" fill="#ff6b6b" opacity=".6"/><circle cx="150" cy="128" r="7" fill="#7a4bbf" opacity=".6"/>'
  ];

  var hp = 100, tool = "punch", over = false, timers = [], inited = false, bunnyFace = "";

  function starPts(cx, cy, r) {
    var pts = [], i, a, rr;
    for (i = 0; i < 10; i++) {
      a = -Math.PI / 2 + i * Math.PI / 5; rr = i % 2 ? r * 0.45 : r;
      pts.push((cx + Math.cos(a) * rr).toFixed(1) + "," + (cy + Math.sin(a) * rr).toFixed(1));
    }
    return pts.join(" ");
  }
  function starSvg(color) {
    return '<svg viewBox="0 0 24 24" width="100%" height="100%"><polygon points="' + starPts(12, 12.5, 11) + '" fill="' + color + '" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  }

  function figureSVG() {
    return (
      '<svg viewBox="0 0 300 440" xmlns="http://www.w3.org/2000/svg">' +
      '<ellipse cx="150" cy="418" rx="92" ry="12" fill="#d96f8d" opacity=".18"/>' +
      '<g stroke="' + INK + '" stroke-width="9" stroke-linecap="round" fill="none">' +
      '<line x1="150" y1="140" x2="150" y2="272"/>' +
      '<line x1="150" y1="172" x2="100" y2="238"/><line x1="150" y1="172" x2="200" y2="238"/>' +
      '<line x1="150" y1="272" x2="106" y2="402"/><line x1="150" y1="272" x2="194" y2="402"/></g>' +
      '<ellipse cx="96" cy="410" rx="22" ry="9" fill="' + INK + '"/><ellipse cx="204" cy="410" rx="22" ry="9" fill="' + INK + '"/>' +
      '<circle cx="97" cy="242" r="8" fill="' + INK + '"/><circle cx="203" cy="242" r="8" fill="' + INK + '"/>' +
      '<rect x="120" y="186" width="60" height="26" rx="8" fill="#fff" stroke="#d96f8d" stroke-width="3"/>' +
      '<text x="150" y="205" font-size="17" font-weight="900" text-anchor="middle" fill="#d96f8d" font-family="Arial,Helvetica,sans-serif">UMUT</text>' +
      '<circle cx="150" cy="92" r="52" fill="#fff6e6" stroke="' + INK + '" stroke-width="9"/>' +
      '<g id="u-bruises">' + BRUISES.map(function (b, i) { return '<g class="br" id="br' + i + '" style="opacity:0;transition:opacity .3s">' + b + "</g>"; }).join("") + "</g>" +
      '<g id="u-face"></g>' +
      '<g id="u-tears" style="opacity:0;transition:opacity .3s"><path d="M118 106 q-5 14 0 18 q5 -4 0 -18z" fill="#4fc3f7"/><path d="M182 106 q5 14 0 18 q-5 -4 0 -18z" fill="#4fc3f7"/></g>' +
      '<g id="u-stars" style="opacity:0"><g class="stars-spin">' +
      '<polygon points="' + starPts(96, 32, 15) + '" fill="#ffd23f" stroke="#fff" stroke-width="2"/>' +
      '<polygon points="' + starPts(196, 32, 15) + '" fill="#ff8fb1" stroke="#fff" stroke-width="2"/>' +
      '<polygon points="' + starPts(146, 12, 13) + '" fill="#ffd23f" stroke="#fff" stroke-width="2"/>' +
      "</g></g></svg>"
    );
  }

  function face(kind) {
    var eyeN = '<circle cx="128" cy="88" r="6" fill="' + INK + '"/><circle cx="172" cy="88" r="6" fill="' + INK + '"/>';
    var eyeH = '<path d="M118 80 L136 90 L118 100 M182 80 L164 90 L182 100" stroke="' + INK + '" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    var eyeX = '<path d="M118 80 L138 100 M138 80 L118 100 M162 80 L182 100 M182 80 L162 100" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>';
    var eyeD = '<path d="M122 90 a7 7 0 1 1 7 7 a4 4 0 1 1 -4 -4 M166 90 a7 7 0 1 1 7 7 a4 4 0 1 1 -4 -4" stroke="' + INK + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
    var mN = '<path d="M130 118 Q150 134 170 118" stroke="' + INK + '" stroke-width="6" fill="none" stroke-linecap="round"/>';
    var mO = '<ellipse cx="150" cy="124" rx="12" ry="15" fill="#8a2a4a" stroke="' + INK + '" stroke-width="4"/>';
    var mS = '<path d="M130 130 Q150 112 170 130" stroke="' + INK + '" stroke-width="6" fill="none" stroke-linecap="round"/>';
    var mW = '<path d="M128 124 q6 -8 11 0 q6 8 11 0 q6 -8 11 0 q6 8 11 0" stroke="' + INK + '" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M158 126 q6 20 14 6" fill="#ff7b9c" stroke="' + INK + '" stroke-width="3"/>';
    var brows = '<path d="M112 70 L138 76 M188 70 L162 76" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>';
    if (kind === "hit") return eyeH + mO;
    if (kind === "hurt") return eyeH + mS + brows;
    if (kind === "dead") return eyeX + mW;
    if (kind === "dizzy") return eyeD + mW;
    return eyeN + mN;
  }
  function setFace(k) { $("#u-face").innerHTML = face(k); }

  function setBunny() {
    var f = hp > 60 ? "wow" : "cry";
    if (f === bunnyFace) return;
    bunnyFace = f;
    $("#beat-bunny").innerHTML = Bunny.svg({ pose: "sit", prop: "none", fur: "pink", face: f });
  }

  function updateHP() {
    $("#beat-hp").style.width = hp + "%";
    var dmg = 100 - hp, i, e;
    for (i = 0; i < BRUISES.length; i++) { e = $("#br" + i); if (e) e.style.opacity = dmg >= (i + 1) * 8.5 ? "1" : "0"; }
    $("#u-tears").style.opacity = hp < 50 ? "1" : "0";
    setBunny();
  }

  var SAY = {
    hi:  ["Ah!", "Ayy!", "Tamam tamam!", "Of!", "Hmm?"],
    mid: ["Yeter!", "Hak ettim ama...", "Canım acıdı!", "Ahh!", "Tamam özür dilerim!"],
    low: ["Özür dilerim!", "Bir daha yapmam!", "Beni affet 😭", "Çok pişmanım!", "Düğme yardım et!"]
  };
  function speech(t) {
    var el = $("#beat-speech");
    el.textContent = t; el.classList.remove("hidden");
    clearTimeout(speech._t); speech._t = setTimeout(function () { el.classList.add("hidden"); }, 1300);
  }

  function fx(x, y, tl, big) {
    var layer = $("#beat-fx");
    function add(cls, html, left, top, styles) {
      var e = document.createElement("div"); e.className = cls; if (html) e.innerHTML = html;
      e.style.left = left + "px"; e.style.top = top + "px";
      Object.keys(styles || {}).forEach(function (k) { e.style.setProperty(k, styles[k]); });
      layer.appendChild(e);
      setTimeout(function () { if (e.parentNode) e.parentNode.removeChild(e); }, 800);
      return e;
    }
    add("fx-flash", "", x, y);
    add("fx-tool", Icons.svg(tl.icon), x + 20, y - 10);
    var w = add("fx-word", rnd(tl.words), x + (Math.random() - 0.5) * 60, y - 20, { "--r": (Math.random() * 30 - 15) + "deg" });
    w.style.color = rnd(COLORS); if (big) w.style.fontSize = "60px";
    for (var i = 0; i < 6; i++) {
      var a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 60;
      add("fx-star", starSvg(rnd(COLORS)), x, y, { "--dx": Math.cos(a) * d + "px", "--dy": Math.sin(a) * d + "px" });
    }
  }

  function hit(e) {
    if (over) return;
    if (e.target && e.target.closest && e.target.closest("#beat-kitty,#beat-over,#beat-hp-wrap")) return;
    SFX.unlock();
    var stage = $("#beat-stage"), sr = stage.getBoundingClientRect();
    var x = e.clientX - sr.left, y = e.clientY - sr.top;
    var fig = $("#beat-figure"), fr = fig.getBoundingClientRect();
    var fx_ = (e.clientX - fr.left) / fr.width * 300, fy_ = (e.clientY - fr.top) / fr.height * 440;
    var half = fy_ < 145 ? 58 : fy_ < 275 ? 74 : 62;
    var on = fy_ > 35 && fy_ < 425 && Math.abs(fx_ - 150) < half;
    var t = TOOLS[tool];
    if (!on) {
      fx(x, y, { icon: t.icon, words: ["FFT!", "ISKA!", "BOŞ!"] }, false);
      SFX.pat(); return;
    }
    var head = fy_ < 145;
    hp = clamp(hp - t.dmg * (head ? 1.5 : 1), 0, 100);
    t.snd();
    if (Math.random() < 0.5) SFX.ouch(0.8 + (1 - hp / 100) * 0.5);
    fx(x, y, t, head && tool === "hammer");
    // sarsıntı + geri tepme
    stage.classList.remove("shake"); void stage.offsetWidth; stage.classList.add("shake");
    var dir = x < sr.width / 2 ? 1 : -1;
    fig.style.transform = "translate(-50%,-48%) translateX(" + dir * 16 + "px) rotate(" + dir * (head ? 8 : 4) + "deg)";
    setTimeout(function () { fig.style.transform = ""; }, 110);
    setFace(hp <= 0 ? "dizzy" : hp < 25 ? "hurt" : "hit");
    timers.push(setTimeout(function () { if (!over) setFace(hp < 30 ? "hurt" : "normal"); }, 450));
    updateHP();
    if (Math.random() < 0.45 && hp > 0) speech(rnd(hp > 65 ? SAY.hi : hp > 35 ? SAY.mid : SAY.low));
    if (hp <= 0) finishOff();
  }

  function finishOff() {
    over = true; setFace("dead");
    $("#u-stars").style.opacity = "1";
    SFX.lose(); speech("Yeter... özür dilerim 😵");
    timers.push(setTimeout(function () { $("#beat-over").classList.remove("hidden"); }, 900));
  }
  function heal() {
    hp = 100; over = false; $("#beat-over").classList.add("hidden");
    $("#u-stars").style.opacity = "0"; setFace("normal"); updateHP(); SFX.win();
    App.toast("Umut iyileşti (hâlâ hak ediyor ama)");
  }

  function layout() {
    var st = $("#beat-stage"); if (!st) return;
    var W = st.clientWidth, H = st.clientHeight; if (!W || !H) return;
    var w = Math.min(W * 0.84, H * 0.94 * 300 / 440);
    $("#beat-figure").style.width = Math.round(w) + "px";
  }

  function init() {
    inited = true;
    $("#beat-figure").innerHTML = figureSVG();
    setFace("normal"); updateHP();
    $("#beat-kitty").onclick = function () {
      App.meowAt(); speech(rnd(["Miyav!", "Vur vur!", "Yeter ama...", "Ben izliyorum 🐾"]));
    };
    $("#beat-stage").addEventListener("pointerdown", hit);
    App.$$(".tool").forEach(function (b) {
      b.addEventListener("click", function () {
        SFX.unlock(); SFX.click(); tool = b.getAttribute("data-tool");
        App.$$(".tool").forEach(function (x) { x.classList.toggle("on", x === b); });
      });
    });
    $("#beat-heal").onclick = heal;
    $("#beat-letter").onclick = function () { App.openLetter(); };
    window.addEventListener("resize", layout);
  }
  function enter() {
    if (!inited) init();
    layout();
    speech("Vur bana! Hak ettim 😅");
  }
  function leave() { timers.forEach(clearTimeout); timers = []; }

  return { enter: enter, leave: leave };
})();
