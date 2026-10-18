window.App = (function () {
  const KEY = "dugme_save_v1";
  const $ = function (s, r) { return (r || document).querySelector(s); };
  const $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  const rnd = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  const clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  const FOODS = [
    { id: "fish", name: "Balık", emoji: "🐟", price: 8, hunger: 25, happy: 6 },
    { id: "milk", name: "Süt", emoji: "🥛", price: 5, hunger: 12, happy: 8 },
    { id: "chicken", name: "Tavuk", emoji: "🍗", price: 12, hunger: 32, happy: 6 },
    { id: "cake", name: "Pasta", emoji: "🍰", price: 15, hunger: 14, happy: 26 },
    { id: "tuna", name: "Ton Balığı", emoji: "🍣", price: 18, hunger: 30, happy: 16 },
    { id: "cheese", name: "Peynir", emoji: "🧀", price: 6, hunger: 12, happy: 6 }
  ];
  const ACCS = [
    { id: "bow", name: "Fiyonk", emoji: "🎀", price: 40 },
    { id: "glasses", name: "Gözlük", emoji: "🕶️", price: 60 },
    { id: "hat", name: "Şapka", emoji: "🎩", price: 70 },
    { id: "crown", name: "Taç", emoji: "👑", price: 120 }
  ];

  let S = null;            // kayıtlı durum
  let screen = "home";
  let moodNow = "", accNow = "~", talkingNow = false, sigNow = "";
  let transientHappy = 0;
  let marketTab = "food";
  let speechTimer = null;
  let lastTick = Date.now();

  function defaults() {
    return {
      coins: 100, hunger: 70, happy: 75, energy: 80,
      inv: { fish: 2, milk: 2, cake: 1 },
      owned: [], equipped: "",
      herName: (window.CONFIG && CONFIG.herName) || "",
      introDone: false, sleeping: false, last: Date.now(), muted: false
    };
  }
  function load() {
    let d = defaults();
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) d = Object.assign(d, JSON.parse(raw));
    } catch (e) {}
    if (!d.herName && window.CONFIG && CONFIG.herName) d.herName = CONFIG.herName;
    return d;
  }
  function save() {
    S.last = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  }

  // ---------- yardımcılar ----------
  function toast(msg, ms) {
    const t = $("#toast");
    t.textContent = msg; t.classList.remove("hidden");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.add("hidden"); }, ms || 1800);
  }
  function modal(html) { $("#modal-card").innerHTML = html; $("#modal").classList.remove("hidden"); }
  function closeModal() { $("#modal").classList.add("hidden"); $("#modal-card").innerHTML = ""; }
  function fill(text) {
    return String(text).replace(/\{isim\}/g, S.herName || "Sevgilim").replace(/\{sen\}/g, (window.CONFIG && CONFIG.yourName) || "Umut");
  }
  function say(text, ms) {
    const el = $("#speech");
    el.textContent = text; el.classList.remove("hidden");
    clearTimeout(speechTimer);
    speechTimer = setTimeout(function () { el.classList.add("hidden"); }, ms || 2600);
  }
  function floatEmoji(emoji, x, y) {
    const layer = $("#float-layer");
    const el = document.createElement("div");
    el.className = "floaty"; el.textContent = emoji;
    el.style.left = (x - 15) + "px"; el.style.top = (y - 15) + "px";
    layer.appendChild(el);
    setTimeout(function () { el.remove(); }, 1500);
  }
  function catCenter() {
    const r = $("#cat").getBoundingClientRect();
    const h = $("#screen-home").getBoundingClientRect();
    return { x: r.left + r.width / 2 - h.left, y: r.top + r.height * 0.35 - h.top, r: r, h: h };
  }
  function heartRain(n) {
    for (let i = 0; i < (n || 24); i++) {
      setTimeout(function () {
        const e = document.createElement("div");
        e.className = "heart-rain";
        e.textContent = rnd(["💗", "💖", "💕", "❤️", "🐾", "💘"]);
        e.style.left = Math.random() * 94 + "vw";
        e.style.animationDuration = 2.6 + Math.random() * 2 + "s";
        $("#app").appendChild(e);
        setTimeout(function () { e.remove(); }, 5000);
      }, i * 110);
    }
  }

  // ---------- durum ----------
  function stat(k, d) { S[k] = clamp(S[k] + d, k === "hunger" ? 4 : 0, 100); }
  function changeStats(d) {
    Object.keys(d).forEach(function (k) { if (k === "coins") S.coins = Math.max(0, S.coins + d[k]); else stat(k, d[k]); });
    renderBars(); save();
  }
  function addCoins(n) { S.coins = Math.max(0, S.coins + n); renderBars(); save(); }
  function decay(mins) {
    mins = clamp(mins, 0, 600);
    const hungryPenalty = S.hunger < 20 ? 1.6 : 1;
    S.hunger = clamp(S.hunger - 0.07 * mins, 4, 100);
    S.happy = clamp(S.happy - 0.05 * mins * hungryPenalty, 0, 100);
    S.energy = clamp(S.energy - 0.03 * mins, 0, 100);
  }
  function mood() {
    if (S.sleeping) return "sleep";
    if (transientHappy > Date.now()) return "happy";
    if (S.hunger < 25 || S.happy < 25 || S.energy < 12) return "sad";
    if (S.happy > 80) return "happy";
    return "normal";
  }
  function renderBars() {
    $("#b-hunger").style.width = S.hunger + "%";
    $("#b-happy").style.width = S.happy + "%";
    $("#b-energy").style.width = S.energy + "%";
    $("#coin-n").textContent = Math.floor(S.coins);
  }
  function renderCat(force) {
    const m = mood();
    const sig = m + "|" + S.equipped + "|" + talkingNow;
    if (!force && sig === sigNow) return;
    sigNow = sig;
    $("#cat").innerHTML = CatArt.cat(m, { acc: S.equipped, talking: talkingNow });
  }
  function renderRoom() {
    const h = new Date().getHours();
    const key = h >= 20 || h < 6 ? "n" : (h >= 18 && h < 20) || (h >= 6 && h < 8) ? "d" : "g";
    if (renderRoom._k !== key) { renderRoom._k = key; $("#room").innerHTML = CatArt.room(h); }
  }

  // ---------- gezinme ----------
  function show(name) {
    if (screen === "games" && name !== "games" && window.Games) Games.stop();
    if (screen === "beat" && name !== "beat" && window.Beat) Beat.leave();
    screen = name;
    $$(".screen").forEach(function (s) { s.classList.toggle("active", s.id === "screen-" + name); });
    $$(".nav-btn").forEach(function (b) { b.classList.toggle("on", b.dataset.go === name); });
    if (name === "fridge") renderFridge();
    if (name === "market") renderMarket();
    if (name === "games") { $("#game-area").classList.add("hidden"); $("#game-menu").classList.remove("hidden"); }
    if (name === "beat") Beat.enter();
    if (name === "home") { renderRoom(); renderCat(true); }
  }

  // ---------- ev: kediyi sev / konuştur ----------
  const PHRASES = [
    "Miyav! 🐾", "Mrrrr... 💗", "Beni sevdin mi?", "Seni özledim!", "Karnım acıktı mı? 🐟",
    "Oyun oynayalım! 🎮", "Umut çok pişman, biliyor musun? 🥺", "Umut'a bir şans daha ver 🥺",
    "Bana bir balık? 🐟", "Seni çok seviyorum 💗", "Miyaaav!", "Uykum geldi 😴", "Kuyruğumu tutma! 😾"
  ];
  function meowAt(pitch) {
    SFX.meow(pitch || (0.9 + Math.random() * 0.4));
    const c = $("#cat");
    c.classList.remove("meowing"); void c.offsetWidth; c.classList.add("meowing");
    c.classList.remove("bounce"); void c.offsetWidth; c.classList.add("bounce");
  }
  function setupPetting() {
    const wrap = $("#cat-wrap");
    let down = false, lx = 0, ly = 0, moved = 0, lastPurr = 0, lastHeart = 0, sx = 0, sy = 0;
    wrap.addEventListener("pointerdown", function (e) {
      SFX.unlock();
      if (S.sleeping) { wake(); return; }
      down = true; moved = 0; lx = sx = e.clientX; ly = sy = e.clientY;
      try { wrap.setPointerCapture(e.pointerId); } catch (x) {}
    });
    wrap.addEventListener("pointermove", function (e) {
      if (!down || S.sleeping) return;
      const d = Math.hypot(e.clientX - lx, e.clientY - ly);
      lx = e.clientX; ly = e.clientY; moved += d;
      if (d > 0) { stat("happy", d * 0.012); }
      const now = Date.now();
      if (moved > 40) {
        transientHappy = now + 2500;
        if (now - lastPurr > 1100) { lastPurr = now; SFX.purr(1.2); }
        if (now - lastHeart > 350) { lastHeart = now; const h = $("#screen-home").getBoundingClientRect(); floatEmoji("💗", e.clientX - h.left, e.clientY - h.top); }
        renderBars(); renderCat();
      }
    });
    function up(e) {
      if (!down) return; down = false;
      if (moved < 18) {
        // dokunma = miyav
        meowAt();
        stat("happy", 2); renderBars();
        const c = catCenter(); floatEmoji(rnd(["💗", "🐾", "✨"]), c.x + (Math.random() - 0.5) * 80, c.y);
        say(rnd(PHRASES));
      } else { save(); }
    }
    wrap.addEventListener("pointerup", up);
    wrap.addEventListener("pointercancel", function () { down = false; });
  }

  function sleep() {
    S.sleeping = true; save();
    $("#darkness").classList.remove("hidden"); $("#zzz").classList.remove("hidden");
    $("#act-sleep").innerHTML = "<span>☀️</span>Uyandır";
    SFX.sleepy(); renderCat(true);
    say("Zzz... iyi geceler 💤", 2000);
  }
  function wake() {
    S.sleeping = false; save();
    $("#darkness").classList.add("hidden"); $("#zzz").classList.add("hidden");
    $("#act-sleep").innerHTML = "<span>💡</span>Uyut";
    renderCat(true); meowAt(1.1); say("Günaydın! Miyav 🌞");
  }

  // ----- mikrofon: konuşunca Düğme tiz sesle tekrar eder -----
  let rec = null;
  async function startTalk() {
    SFX.unlock();
    if (S.sleeping) { wake(); return; }
    const btn = $("#act-talk");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === "undefined") {
      meowAt(); say("Mikrofonum yok ama miyav! 🐾"); return;
    }
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch (e) { meowAt(); say("Mikrofon iznini verirsen seni dinlerim 🎤", 3200); return; }
    const chunks = [];
    const mr = new MediaRecorder(stream);
    rec = { mr: mr, stream: stream, t0: Date.now(), done: false };
    mr.ondataavailable = function (ev) { if (ev.data && ev.data.size) chunks.push(ev.data); };
    mr.onstop = async function () {
      stream.getTracks().forEach(function (t) { t.stop(); });
      btn.classList.remove("rec");
      const dur = Date.now() - rec.t0; rec = null;
      if (dur < 350 || !chunks.length) { meowAt(); say(rnd(PHRASES)); return; }
      try {
        const buf = await new Blob(chunks).arrayBuffer();
        const audio = await SFX.ctx().decodeAudioData(buf);
        const rate = 1.75;
        talkingNow = true; renderCat(true);
        SFX.playBuffer(audio, rate);
        say(rnd(["Ben de öyle diyorum! 😸", "Miyav miyav!", "Aynen öyle 🐾", "Tekrar söyle! 😻"]), 2200);
        setTimeout(function () { talkingNow = false; renderCat(true); }, Math.min(6000, audio.duration / rate * 1000 + 200));
        stat("happy", 5); renderBars(); save();
      } catch (e) { meowAt(); say("Anlayamadım, miyav? 🐾"); }
    };
    mr.start();
    btn.classList.add("rec");
    say("Dinliyorum... 👂", 8000);
    setTimeout(function () { stopTalk(); }, 6500);
  }
  function stopTalk() {
    if (rec && !rec.done && rec.mr.state === "recording") { rec.done = true; try { rec.mr.stop(); } catch (e) {} }
  }

  // ---------- buzdolabı / market ----------
  function foodById(id) { return FOODS.find(function (f) { return f.id === id; }); }
  function renderFridge() {
    const box = $("#fridge");
    const items = FOODS.filter(function (f) { return (S.inv[f.id] || 0) > 0; });
    if (!items.length) {
      box.innerHTML = '<div class="empty">Buzdolabı bomboş! 😿<br>Önce <b>Market</b>e git ya da oyun oynayıp altın kazan.</div>';
      return;
    }
    box.innerHTML = items.map(function (f) {
      return '<button class="slot" data-food="' + f.id + '"><span class="cnt">' + S.inv[f.id] + '</span><span class="big-emoji">' + f.emoji + '</span><b>' + f.name + "</b></button>";
    }).join("");
    $$(".slot", box).forEach(function (b) { b.addEventListener("click", function () { feed(b.dataset.food); }); });
  }
  function feed(id) {
    const f = foodById(id);
    if (!f || (S.inv[id] || 0) < 1) return;
    SFX.unlock();
    if (S.sleeping) wake();
    if (S.hunger > 94) { SFX.bad(); toast("Düğme tok, şimdi istemiyor 🥺"); return; }
    S.inv[id]--;
    show("home");
    SFX.click();
    // yemek kedinin ağzına uçar
    setTimeout(function () {
      const c = catCenter();
      const el = document.createElement("div");
      el.className = "floaty"; el.style.animation = "none"; el.style.fontSize = "46px"; el.textContent = f.emoji;
      el.style.left = (c.h.width / 2 - 23) + "px"; el.style.top = (c.h.height - 90) + "px";
      $("#float-layer").appendChild(el);
      const dy = (c.y + c.r.height * 0.18) - (c.h.height - 90);
      const a = el.animate([{ transform: "translate(0,0) scale(1)" }, { transform: "translate(0," + dy + "px) scale(.5)" }], { duration: 650, easing: "ease-in" });
      a.onfinish = function () {
        el.remove();
        talkingNow = true; renderCat(true);
        $("#cat").classList.add("eating"); SFX.eat();
        setTimeout(function () {
          $("#cat").classList.remove("eating"); talkingNow = false;
          transientHappy = Date.now() + 3500;
          changeStats({ hunger: f.hunger, happy: f.happy });
          renderCat(true); meowAt(1.15);
          const cc = catCenter(); floatEmoji("💗", cc.x - 20, cc.y); floatEmoji("😋", cc.x + 24, cc.y - 10);
          say(rnd(["Nam nam! 😋", "Çok lezzetliydi!", "Teşekkürler! 💗", "Bir tane daha? 🥺"]));
        }, 1500);
      };
    }, 200);
  }
  function renderMarket() {
    const box = $("#market");
    if (marketTab === "food") {
      box.innerHTML = FOODS.map(function (f) {
        return '<button class="card ' + (S.coins < f.price ? "off" : "") + '" data-buy="' + f.id + '"><span class="big-emoji">' + f.emoji + "</span><b>" + f.name +
          '</b><small>Dolapta: ' + (S.inv[f.id] || 0) + '</small><span class="price">🪙 ' + f.price + "</span></button>";
      }).join("");
      $$("[data-buy]", box).forEach(function (b) {
        b.addEventListener("click", function () {
          const f = foodById(b.dataset.buy);
          if (S.coins < f.price) { SFX.bad(); toast("Altının yetmiyor 🪙 Oyun oyna!"); return; }
          S.coins -= f.price; S.inv[f.id] = (S.inv[f.id] || 0) + 1;
          SFX.coin(); toast(f.emoji + " " + f.name + " dolaba kondu"); renderBars(); save(); renderMarket();
        });
      });
    } else {
      box.innerHTML = ACCS.map(function (a) {
        const own = S.owned.indexOf(a.id) >= 0, eq = S.equipped === a.id;
        return '<button class="card ' + (eq ? "sel" : "") + " " + (!own && S.coins < a.price ? "off" : "") + '" data-acc="' + a.id + '"><span class="big-emoji">' + a.emoji + "</span><b>" + a.name +
          "</b>" + (own ? "<small>" + (eq ? "Takılı ✓ (çıkarmak için dokun)" : "Sende var, tak") + "</small>" : '<span class="price">🪙 ' + a.price + "</span>") + "</button>";
      }).join("");
      $$("[data-acc]", box).forEach(function (b) {
        b.addEventListener("click", function () {
          const a = ACCS.find(function (x) { return x.id === b.dataset.acc; });
          const own = S.owned.indexOf(a.id) >= 0;
          if (!own) {
            if (S.coins < a.price) { SFX.bad(); toast("Altının yetmiyor 🪙"); return; }
            S.coins -= a.price; S.owned.push(a.id); S.equipped = a.id; SFX.coin(); toast(a.emoji + " Düğme çok yakıştı!");
          } else { S.equipped = S.equipped === a.id ? "" : a.id; SFX.pop(); }
          renderBars(); save(); renderMarket();
        });
      });
    }
  }

  // ---------- mektup / ilk açılış ----------
  function openLetter() {
    SFX.unlock(); SFX.pop();
    const phone = window.CONFIG && CONFIG.herPhone;
    modal(
      '<div class="letter"><h3>💌 ' + fill(CONFIG.letterTitle) + "</h3><p>" + fill(CONFIG.letter).replace(/</g, "&lt;") + "</p>" +
      '<button class="btn" id="m-love">💗 Okudum</button>' +
      (phone ? '<button class="btn ghost" id="m-sms">💬 ' + (CONFIG.yourName || "Umut") + "'a yaz</button>" : "") +
      '<button class="btn ghost" id="m-close">Kapat</button></div>'
    );
    $("#m-love").onclick = function () { heartRain(30); SFX.meow(1.2); closeModal(); say("Düğme de seni çok seviyor 💗", 3500); show("home"); };
    if (phone) $("#m-sms").onclick = function () { window.location.href = "sms:" + phone + "?body=" + encodeURIComponent("Konuşan Düğme'yi aldım 💗"); };
    $("#m-close").onclick = closeModal;
  }
  function intro() {
    function step2() {
      modal('<h3>🐈‍⬛ Merhaba' + (S.herName ? " " + S.herName.replace(/</g, "&lt;") : "") + "!</h3><p>Ben Düğme. Beni sev, doyur, oyun oyna.\n\n" +
        (CONFIG.yourName || "Umut") + " bunu senin için hazırladı. Mektubunu 💌 düğmesinden okuyabilirsin.</p>" +
        '<button class="btn" id="m-go">Başla 🐾</button>');
      $("#m-go").onclick = function () { S.introDone = true; save(); closeModal(); SFX.unlock(); meowAt(); say("Hoş geldin! Beni sev 💗", 3500); setupNotif(); };
    }
    if (!S.herName) {
      modal('<h3>🐈‍⬛ Merhaba!</h3><p>Ben Düğme. Adın ne?</p><input id="m-name" maxlength="24" placeholder="Adın..." autocomplete="off"><button class="btn" id="m-ok">Tamam</button>');
      $("#m-ok").onclick = function () { S.herName = $("#m-name").value.trim(); save(); step2(); };
    } else step2();
  }
  function setupNotif() { if (window.Notif) Notif.setup(S); }

  // ---------- döngü ----------
  function tick() {
    const now = Date.now();
    const dt = (now - lastTick) / 1000; lastTick = now;
    if (S.sleeping) {
      S.energy = clamp(S.energy + dt * 0.5, 0, 100);
      S.hunger = clamp(S.hunger - dt * 0.0006 * 60 * 0.4, 4, 100);
      if (S.energy >= 100) { wake(); }
    } else { decay(dt / 60); }
    renderBars(); renderCat();
    if (!S.sleeping && screen === "home" && Math.random() < 0.05) {
      if (S.hunger < 30) say("Karnım aç... 🐟 buzdolabına bakar mısın?");
      else if (S.happy < 30) say("Bana biraz ilgi göster 🥺");
      else if (S.energy < 15) say("Çok uykum var 😴");
    }
    save();
  }

  function boot() {
    S = load();
    const away = (Date.now() - (S.last || Date.now())) / 60000;
    if (away > 0.5) decay(away);
    lastTick = Date.now();
    SFX.setMuted(!!S.muted);
    $("#btn-mute").textContent = S.muted ? "🔇" : "🔊";

    $$(".nav-btn").forEach(function (b) { b.addEventListener("click", function () { SFX.unlock(); SFX.click(); show(b.dataset.go); }); });
    $$(".tab").forEach(function (b) { b.addEventListener("click", function () { SFX.click(); marketTab = b.dataset.tab; $$(".tab").forEach(function (x) { x.classList.toggle("on", x === b); }); renderMarket(); }); });
    $("#btn-mute").addEventListener("click", function () { S.muted = !S.muted; SFX.setMuted(S.muted); $("#btn-mute").textContent = S.muted ? "🔇" : "🔊"; save(); });
    $("#act-sleep").addEventListener("click", function () { SFX.unlock(); S.sleeping ? wake() : sleep(); });
    $("#darkness").addEventListener("pointerdown", function () { wake(); });
    $("#act-letter").addEventListener("click", openLetter);
    const talk = $("#act-talk");
    talk.addEventListener("pointerdown", function (e) { e.preventDefault(); startTalk(); });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) { talk.addEventListener(ev, stopTalk); });
    $("#modal").addEventListener("pointerdown", function (e) { if (e.target.id === "modal" && S.introDone) closeModal(); });
    $$(".game-card").forEach(function (b) { b.addEventListener("click", function () { SFX.unlock(); SFX.click(); Games.start(b.dataset.game); }); });

    setupPetting();
    renderBars(); renderRoom(); renderCat(true);
    if (S.sleeping) { $("#darkness").classList.remove("hidden"); $("#zzz").classList.remove("hidden"); $("#act-sleep").innerHTML = "<span>☀️</span>Uyandır"; }
    show("home");
    setInterval(tick, 2000);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { save(); }
      else { const m = (Date.now() - S.last) / 60000; if (m > 0.3 && !S.sleeping) decay(m); lastTick = Date.now(); renderBars(); renderCat(); renderRoom(); setupNotif(); }
    });
    if (!S.introDone) setTimeout(intro, 400); else setupNotif();
    else_hello();
  }
  function else_hello() {
    if (S.introDone) setTimeout(function () {
      if (S.hunger < 35) say("Geldin! Karnım çok aç 🐟", 3500);
      else say("Geldin! Seni özledim 💗", 3000);
    }, 700);
  }

  return {
    boot: boot, show: show, toast: toast, say: say, modal: modal, closeModal: closeModal,
    changeStats: changeStats, addCoins: addCoins, openLetter: openLetter, meowAt: meowAt,
    state: function () { return S; }, $: $, $$: $$, rnd: rnd, clamp: clamp, fill: fill, heartRain: heartRain
  };
})();
