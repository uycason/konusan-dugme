// Umut'u döv ekranı: çöp adam, ses efektleri, morarma
window.Beat = (function () {
  const $ = App.$, rnd = App.rnd, clamp = App.clamp;
  const TOOLS = {
    punch:  { emoji: "👊", dmg: 3, words: ["ŞAK!", "KÜT!", "PAT!"], snd: function () { SFX.sak(); if (Math.random() < 0.5) SFX.kut(); } },
    hammer: { emoji: "🔨", dmg: 6, words: ["ÇAT!", "BAM!", "TAK!", "KÜT!"], snd: function () { SFX.cat(); SFX.kut(); } },
    slipper:{ emoji: "🩴", dmg: 2, words: ["ŞAPLAK!", "ŞAK!", "ŞAP!"], snd: function () { SFX.sak(); } },
    glove:  { emoji: "🥊", dmg: 4, words: ["KÜT!", "BOM!", "BAM!"], snd: function () { SFX.kut(); SFX.sak(); } },
    pillow: { emoji: "🛏️", dmg: 1, words: ["PÖF!", "PAT!", "POF!"], snd: function () { SFX.pat(); } }
  };
  const COLORS = ["#ffd23f", "#ff5c8a", "#6ee7a0", "#4fc3f7", "#ff8a5c", "#fff"];
  const BRUISES = [
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

  let hp = 100, tool = "punch", over = false, timers = [], inited = false;

  function figureSVG() {
    return (
      '<svg viewBox="0 0 300 440" xmlns="http://www.w3.org/2000/svg">' +
      '<g stroke="#15151f" stroke-width="9" stroke-linecap="round" fill="none">' +
      '<line x1="150" y1="140" x2="150" y2="272"/>' +
      '<line x1="150" y1="172" x2="100" y2="238"/><line x1="150" y1="172" x2="200" y2="238"/>' +
      '<line x1="150" y1="272" x2="106" y2="402"/><line x1="150" y1="272" x2="194" y2="402"/></g>' +
      '<ellipse cx="96" cy="410" rx="22" ry="9" fill="#15151f"/><ellipse cx="204" cy="410" rx="22" ry="9" fill="#15151f"/>' +
      '<circle cx="97" cy="242" r="8" fill="#15151f"/><circle cx="203" cy="242" r="8" fill="#15151f"/>' +
      '<circle cx="150" cy="92" r="52" fill="#fff6e6" stroke="#15151f" stroke-width="9"/>' +
      '<g id="u-bruises">' + BRUISES.map(function (b, i) { return '<g class="br" id="br' + i + '" style="opacity:0;transition:opacity .3s">' + b + "</g>"; }).join("") + "</g>" +
      '<g id="u-face"></g>' +
      '<g id="u-tears" style="opacity:0;transition:opacity .3s"><path d="M118 106 q-5 14 0 18 q5 -4 0 -18z" fill="#4fc3f7"/><path d="M182 106 q5 14 0 18 q-5 -4 0 -18z" fill="#4fc3f7"/></g>' +
      '<g id="u-stars" style="opacity:0"><g class="stars-spin"><text x="96" y="30" font-size="26">⭐</text><text x="190" y="30" font-size="26">💫</text><text x="144" y="14" font-size="26">⭐</text></g></g>' +
      "</svg>"
    );
  }

  function face(kind) {
    const eyeN = '<circle cx="128" cy="88" r="6" fill="#15151f"/><circle cx="172" cy="88" r="6" fill="#15151f"/>';
    const eyeH = '<path d="M118 80 L136 90 L118 100 M182 80 L164 90 L182 100" stroke="#15151f" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    const eyeX = '<path d="M118 80 L138 100 M138 80 L118 100 M162 80 L182 100 M182 80 L162 100" stroke="#15151f" stroke-width="6" stroke-linecap="round"/>';
    const eyeD = '<path d="M122 90 a7 7 0 1 1 7 7 a4 4 0 1 1 -4 -4 M166 90 a7 7 0 1 1 7 7 a4 4 0 1 1 -4 -4" stroke="#15151f" stroke-width="4" fill="none" stroke-linecap="round"/>';
    const mN = '<path d="M130 118 Q150 134 170 118" stroke="#15151f" stroke-width="6" fill="none" stroke-linecap="round"/>';
    const mO = '<ellipse cx="150" cy="124" rx="12" ry="15" fill="#6e1a39" stroke="#15151f" stroke-width="4"/>';
    const mS = '<path d="M130 130 Q150 112 170 130" stroke="#15151f" stroke-width="6" fill="none" stroke-linecap="round"/>';
    const mW = '<path d="M128 124 q6 -8 11 0 q6 8 11 0 q6 -8 11 0 q6 8 11 0" stroke="#15151f" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M158 126 q6 20 14 6" fill="#ff7b9c" stroke="#15151f" stroke-width="3"/>';
    const brows = '<path d="M112 70 L138 76 M188 70 L162 76" stroke="#15151f" stroke-width="6" stroke-linecap="round"/>';
    if (kind === "hit") return eyeH + mO;
    if (kind === "hurt") return eyeH + mS + brows;
    if (kind === "dead") return eyeX + mW;
    if (kind === "dizzy") return eyeD + mW;
    return eyeN + mN;
  }
  function setFace(k) { $("#u-face").innerHTML = face(k); }

  function updateHP() {
    $("#beat-hp").style.width = hp + "%";
    const dmg = 100 - hp;
    for (let i = 0; i < BRUISES.length; i++) { const e = $("#br" + i); if (e) e.style.opacity = dmg >= (i + 1) * 8.5 ? "1" : "0"; }
    $("#u-tears").style.opacity = hp < 50 ? "1" : "0";
  }

  const SAY = {
    hi:  ["Ah!", "Ayy!", "Tamam tamam!", "Of!", "Hmm?"],
    mid: ["Yeter!", "Hak ettim ama...", "Canım acıdı!", "Ahh!", "Tamam özür dilerim!"],
    low: ["Özür dilerim!", "Bir daha yapmam!", "Beni affet 😭", "Çok pişmanım!", "Düğme yardım et!"]
  };
  function speech(t) {
    const el = $("#beat-speech");
    el.textContent = t; el.classList.remove("hidden");
    clearTimeout(speech._t); speech._t = setTimeout(function () { el.classList.add("hidden"); }, 1300);
  }

  function fx(x, y, tl, big) {
    const layer = $("#beat-fx");
    function add(cls, txt, left, top, styles) {
      const e = document.createElement("div"); e.className = cls; if (txt) e.textContent = txt;
      e.style.left = left + "px"; e.style.top = top + "px";
      Object.keys(styles || {}).forEach(function (k) { e.style.setProperty(k, styles[k]); });
      layer.appendChild(e); setTimeout(function () { e.remove(); }, 800); return e;
    }
    add("fx-flash", "", x, y);
    add("fx-tool", tl.emoji, x + 20, y - 10);
    const w = add("fx-word", rnd(tl.words), x + (Math.random() - 0.5) * 60, y - 20, { "--r": (Math.random() * 30 - 15) + "deg" });
    w.style.color = rnd(COLORS); if (big) w.style.fontSize = "60px";
    for (let i = 0; i < 6; i++) {
      const a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 60;
      add("fx-star", rnd(["✦", "★", "✸", "💥"]), x, y, { "--dx": Math.cos(a) * d + "px", "--dy": Math.sin(a) * d + "px" }).style.color = rnd(COLORS);
    }
  }

  function hit(e) {
    if (over) return;
    SFX.unlock();
    const stage = $("#beat-stage"), sr = stage.getBoundingClientRect();
    const x = e.clientX - sr.left, y = e.clientY - sr.top;
    const fig = $("#beat-figure"), fr = fig.getBoundingClientRect();
    const fx_ = (e.clientX - fr.left) / fr.width * 300, fy_ = (e.clientY - fr.top) / fr.height * 440;
    const half = fy_ < 145 ? 58 : fy_ < 275 ? 74 : 62;
    const on = fy_ > 35 && fy_ < 425 && Math.abs(fx_ - 150) < half;
    const t = TOOLS[tool];
    if (!on) {
      fx(x, y, { emoji: t.emoji, words: ["FFT!", "ISKA!", "BOŞ!"] }, false);
      SFX.pat(); return;
    }
    const head = fy_ < 145;
    const dmg = t.dmg * (head ? 1.5 : 1);
    hp = clamp(hp - dmg, 0, 100);
    t.snd();
    if (Math.random() < 0.5) SFX.ouch(0.8 + (1 - hp / 100) * 0.5);
    fx(x, y, t, head && tool === "hammer");
    // sarsıntı + geri tepme
    const stg = $("#beat-stage"); stg.classList.remove("shake"); void stg.offsetWidth; stg.classList.add("shake");
    const dir = x < sr.width / 2 ? 1 : -1;
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
    App.toast("Umut iyileşti 🩹 (hâlâ hak ediyor ama)");
  }

  function kitty() {
    const k = $("#beat-kitty");
    k.onclick = function () { App.meowAt(); speech(rnd(["Miyav! 😾", "Vur vur!", "Yeter ama 🥺", "Ben izliyorum 🍿"])); };
  }

  function init() {
    inited = true;
    $("#beat-figure").innerHTML = figureSVG();
    setFace("normal"); updateHP(); kitty();
    $("#beat-stage").addEventListener("pointerdown", hit);
    document.querySelectorAll(".tool").forEach(function (b) {
      b.addEventListener("click", function () {
        SFX.unlock(); SFX.click(); tool = b.dataset.tool;
        document.querySelectorAll(".tool").forEach(function (x) { x.classList.toggle("on", x === b); });
      });
    });
    $("#beat-heal").onclick = heal;
    $("#beat-letter").onclick = function () { App.openLetter(); };
  }
  function enter() {
    if (!inited) init();
    speech("Vur bana! Hak ettim 😅");
  }
  function leave() { timers.forEach(clearTimeout); timers = []; }

  return { enter: enter, leave: leave };
})();
