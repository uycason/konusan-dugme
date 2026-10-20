window.App = (function () {
  var KEY = "dugme_save_v1";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var rnd = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  var FOODS = [
    { id: "fish", name: "Balık", ic: "fish", price: 8, hunger: 25, happy: 6 },
    { id: "milk", name: "Süt", ic: "milk", price: 5, hunger: 12, happy: 8 },
    { id: "chicken", name: "Tavuk", ic: "drum", price: 12, hunger: 32, happy: 6 },
    { id: "cake", name: "Pasta", ic: "cake", price: 15, hunger: 14, happy: 26 },
    { id: "tuna", name: "Ton Balığı", ic: "sushi", price: 18, hunger: 30, happy: 16 },
    { id: "cheese", name: "Peynir", ic: "cheese", price: 6, hunger: 12, happy: 6 }
  ];
  var ACCS = [
    { id: "bow", name: "Fiyonk", ic: "bow", price: 40 },
    { id: "glasses", name: "Gözlük", ic: "glasses", price: 60 },
    { id: "hat", name: "Şapka", ic: "tophat", price: 70 },
    { id: "crown", name: "Taç", ic: "crown", price: 120 }
  ];
  var PHRASES = [
    "Miyav!", "Mrrrr... 💗", "Beni sevdin mi?", "Seni özledim!", "Karnım acıktı mı? 🐟",
    "Oyun oynayalım!", "Umut çok pişman, biliyor musun?", "Umut'a bir şans daha ver 💗",
    "Bana bir balık?", "Seni çok seviyorum 💗", "Miyaaav!", "Uykum geldi 💤", "Kuyruğumu tutma! 😾"
  ];

  var S = null, screen = "home", transientHappy = 0, sigNow = "", talkingNow = false;
  var kitchenTab = "fridge", speechTimer = null, lastTick = Date.now(), pushed = false, rec = null;

  function defaults() {
    return {
      coins: 100, hunger: 70, happy: 75, energy: 80,
      inv: { fish: 2, milk: 2, cake: 1 }, owned: [], equipped: "",
      herName: (window.CONFIG && CONFIG.herName) || "",
      introDone: false, sleeping: false, last: Date.now(), muted: false
    };
  }
  function load() {
    var d = defaults();
    try { var raw = localStorage.getItem(KEY); if (raw) d = Object.assign(d, JSON.parse(raw)); } catch (e) {}
    if (!d.herName && window.CONFIG && CONFIG.herName) d.herName = CONFIG.herName;
    return d;
  }
  function save() { S.last = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  // ---------- yardımcılar ----------
  function toast(msg, ms) {
    var t = $("#toast"); t.textContent = msg; t.classList.remove("hidden");
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.add("hidden"); }, ms || 1800);
  }
  function modal(html, bunny) {
    $("#modal-body").innerHTML = html;
    var p = (bunny || "sit|heart|white|love").split("|");
    $("#modal-bunny").innerHTML = Bunny.svg({ pose: p[0], prop: p[1], fur: p[2], face: p[3] });
    $("#modal").classList.remove("hidden");
    $("#modal-body").scrollTop = 0;
  }
  function closeModal() { $("#modal").classList.add("hidden"); $("#modal-body").innerHTML = ""; }
  function fill(text) {
    return String(text).replace(/\{isim\}/g, S.herName || "Sevgilim").replace(/\{sen\}/g, (window.CONFIG && CONFIG.yourName) || "Umut");
  }
  function say(text, ms) {
    var el = $("#speech"); el.textContent = text; el.classList.remove("hidden");
    clearTimeout(speechTimer); speechTimer = setTimeout(function () { el.classList.add("hidden"); }, ms || 2600);
  }
  function floatIcon(name, x, y) {
    var el = document.createElement("div"); el.className = "floaty"; el.innerHTML = Icons.svg(name);
    el.style.left = (x - 16) + "px"; el.style.top = (y - 16) + "px";
    $("#float-layer").appendChild(el); setTimeout(function () { el.remove(); }, 1500);
  }
  function catCenter() {
    var r = $("#cat").getBoundingClientRect(), h = $("#screen-home").getBoundingClientRect();
    return { x: r.left + r.width / 2 - h.left, y: r.top + r.height * 0.35 - h.top, r: r, h: h };
  }
  function heartRain(n) {
    var names = ["heart", "star", "heart", "paw"];
    for (var i = 0; i < (n || 24); i++) {
      (function (k) {
        setTimeout(function () {
          var e = document.createElement("div"); e.className = "heart-rain"; e.innerHTML = Icons.i(names[k % names.length]);
          e.style.left = Math.random() * 90 + "vw"; e.style.animationDuration = 2.6 + Math.random() * 2 + "s";
          $("#app").appendChild(e); setTimeout(function () { e.remove(); }, 5200);
        }, k * 110);
      })(i);
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
    var pen = S.hunger < 20 ? 1.6 : 1;
    S.hunger = clamp(S.hunger - 0.07 * mins, 4, 100);
    S.happy = clamp(S.happy - 0.05 * mins * pen, 0, 100);
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
    $("#b-hunger").style.width = S.hunger + "%"; $("#b-happy").style.width = S.happy + "%"; $("#b-energy").style.width = S.energy + "%";
    $("#coin-n").textContent = Math.floor(S.coins);
  }
  function renderCat(force) {
    var m = mood(), sig = m + "|" + S.equipped + "|" + talkingNow;
    if (!force && sig === sigNow) return;
    sigNow = sig; $("#cat").innerHTML = CatArt.cat(m, { acc: S.equipped, talking: talkingNow });
  }
  function renderRoom() {
    var h = new Date().getHours(), key = h >= 20 || h < 6 ? "n" : (h >= 18 && h < 20) || (h >= 6 && h < 8) ? "d" : "g";
    if (renderRoom._k !== key) { renderRoom._k = key; $("#room").innerHTML = CatArt.room(h); }
  }
  function setSleepBtn() { $("#act-sleep").innerHTML = S.sleeping ? Icons.i("sun") + "<span>Uyandır</span>" : Icons.i("moon") + "<span>Uyut</span>"; }
  function setMuteBtn() { $("#btn-mute").innerHTML = Icons.i(S.muted ? "mute" : "vol"); }

  // ---------- yerleşim ----------
  function layoutHome() {
    var sc = $("#screen-home"); if (!sc || screen !== "home") return;
    var W = sc.clientWidth, H = sc.clientHeight; if (!W || !H) return;
    var w = Math.max(150, Math.min(W * 0.72, (H - 104 - 60) * 300 / 350));
    $("#cat-wrap").style.width = Math.round(w) + "px";
  }
  function placeNavBunny() {
    var on = $(".nav-btn.on"), nav = $("#nav"), b = $("#nav-bunny"); if (!on || !nav || !b) return;
    b.style.display = screen === "beat" ? "none" : "";   // Umut ekranında kendi tavşanı var
    var r = on.getBoundingClientRect(), n = nav.getBoundingClientRect(), mp = $("#miniplayer");
    b.style.left = Math.round(r.left - n.left + r.width / 2 - 23) + "px";
    // mini oynatıcı açıksa tavşan onun arkasından başını çıkarır
    var up = mp && !mp.classList.contains("hidden") ? mp.offsetHeight + 8 : 0;
    b.style.marginBottom = (up - 17) + "px";
  }
  function relayout() { layoutHome(); placeNavBunny(); }

  // ---------- gezinme ----------
  function show(name, fromPop) {
    if (screen === "games" && name !== "games" && window.Games) Games.stop();
    if (screen === "beat" && name !== "beat" && window.Beat) Beat.leave();
    if (screen === "music" && name !== "music") Music.leave();
    screen = name;
    $$(".screen").forEach(function (s) { s.classList.toggle("active", s.id === "screen-" + name); });
    $$(".nav-btn").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-go") === name); });
    if (!fromPop) {
      try {
        if (name !== "home" && !pushed) { history.pushState({ d: 1 }, ""); pushed = true; }
        else if (name === "home" && pushed) { pushed = false; history.back(); }
      } catch (e) {}
    }
    if (name === "kitchen") renderKitchen();
    if (name === "games") { $("#game-area").classList.add("hidden"); $("#game-menu").classList.remove("hidden"); }
    if (name === "beat") Beat.enter();
    if (name === "music") Music.enter();
    if (name === "home") { renderRoom(); renderCat(true); }
    Music.syncMini();
    relayout();
  }

  // ---------- ev: sev, konuştur ----------
  function meowAt(pitch) {
    SFX.meow(pitch || (0.9 + Math.random() * 0.4));
    var c = $("#cat");
    c.classList.remove("meowing"); void c.offsetWidth; c.classList.add("meowing");
    c.classList.remove("bounce"); void c.offsetWidth; c.classList.add("bounce");
  }
  function setupPetting() {
    var wrap = $("#cat-wrap"), down = false, lx = 0, ly = 0, moved = 0, lastPurr = 0, lastHeart = 0;
    wrap.addEventListener("pointerdown", function (e) {
      SFX.unlock();
      if (S.sleeping) { wake(); return; }
      down = true; moved = 0; lx = e.clientX; ly = e.clientY;
      try { wrap.setPointerCapture(e.pointerId); } catch (x) {}
    });
    wrap.addEventListener("pointermove", function (e) {
      if (!down || S.sleeping) return;
      var d = Math.hypot(e.clientX - lx, e.clientY - ly);
      lx = e.clientX; ly = e.clientY; moved += d;
      if (d > 0) stat("happy", d * 0.012);
      var now = Date.now();
      if (moved > 40) {
        transientHappy = now + 2500;
        if (now - lastPurr > 1100) { lastPurr = now; SFX.purr(1.2); }
        if (now - lastHeart > 350) { lastHeart = now; var h = $("#screen-home").getBoundingClientRect(); floatIcon("heart", e.clientX - h.left, e.clientY - h.top); }
        renderBars(); renderCat();
      }
    });
    wrap.addEventListener("pointerup", function () {
      if (!down) return; down = false;
      if (moved < 18) {
        meowAt(); stat("happy", 2); renderBars();
        var c = catCenter(); floatIcon(rnd(["heart", "paw", "star"]), c.x + (Math.random() - 0.5) * 80, c.y);
        say(rnd(PHRASES));
      } else save();
    });
    wrap.addEventListener("pointercancel", function () { down = false; });
  }
  function sleep() {
    S.sleeping = true; save();
    $("#darkness").classList.remove("hidden"); $("#zzz").classList.remove("hidden");
    setSleepBtn(); SFX.sleepy(); renderCat(true); say("Zzz... iyi geceler 💤", 2000);
  }
  function wake() {
    S.sleeping = false; save();
    $("#darkness").classList.add("hidden"); $("#zzz").classList.add("hidden");
    setSleepBtn(); renderCat(true); meowAt(1.1); say("Günaydın! Miyav");
  }

  // ----- mikrofon: konuşunca Düğme tiz sesle tekrar eder -----
  function startTalk() {
    SFX.unlock();
    if (S.sleeping) { wake(); return Promise.resolve(); }
    var btn = $("#act-talk");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === "undefined") { meowAt(); say("Mikrofonum yok ama miyav!"); return Promise.resolve(); }
    Music.pauseForMic();
    return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      var chunks = [], mr = new MediaRecorder(stream);
      rec = { mr: mr, t0: Date.now(), done: false };
      mr.ondataavailable = function (ev) { if (ev.data && ev.data.size) chunks.push(ev.data); };
      mr.onstop = function () {
        stream.getTracks().forEach(function (t) { t.stop(); });
        btn.classList.remove("rec");
        var dur = Date.now() - rec.t0; rec = null;
        if (dur < 350 || !chunks.length) { meowAt(); say(rnd(PHRASES)); Music.resumeAfterMic(); return; }
        new Blob(chunks).arrayBuffer().then(function (buf) {
          return SFX.ctx().decodeAudioData(buf);
        }).then(function (audio) {
          var rate = 1.75; talkingNow = true; renderCat(true);
          SFX.playBuffer(audio, rate);
          say(rnd(["Ben de öyle diyorum! 😸", "Miyav miyav!", "Aynen öyle 🐾", "Tekrar söyle! 😻"]), 2200);
          setTimeout(function () { talkingNow = false; renderCat(true); Music.resumeAfterMic(); }, Math.min(6000, audio.duration / rate * 1000 + 200));
          stat("happy", 5); renderBars(); save();
        }).catch(function () { meowAt(); say("Anlayamadım, miyav? 🐾"); Music.resumeAfterMic(); });
      };
      mr.start(); btn.classList.add("rec"); say("Dinliyorum...", 8000);
      setTimeout(stopTalk, 6500);
    }).catch(function () { meowAt(); say("Mikrofon iznini verirsen seni dinlerim", 3200); Music.resumeAfterMic(); });
  }
  function stopTalk() {
    if (rec && !rec.done && rec.mr.state === "recording") { rec.done = true; try { rec.mr.stop(); } catch (e) {} }
  }

  // ---------- mutfak: buzdolabı / market / giyecek ----------
  function foodById(id) { return FOODS.filter(function (f) { return f.id === id; })[0]; }
  function renderKitchen() {
    var box = $("#kitchen-body"), hints = { fridge: "Yemeğe dokun, Düğme yesin.", shop: "Altınla yemek al.", wear: "Düğme'yi giydir." };
    $$(".seg-btn").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-k") === kitchenTab); });
    $("#kitchen-hint").textContent = hints[kitchenTab];
    var html = "";
    if (kitchenTab === "fridge") {
      var items = FOODS.filter(function (f) { return (S.inv[f.id] || 0) > 0; });
      html = '<div class="fridge-wrap"><span data-bunny="peek|none|white|smile" class="fridge-bunny"></span><span data-bunny="peek|none|pink|wink" class="fridge-bunny2" style="--r:6deg"></span><div class="fridge"><div class="handle"></div>';
      if (!items.length) {
        html += '<div class="empty-box"><span data-bunny="sit|none|white|cry"></span><div>Buzdolabı bomboş!</div><button class="btn" id="go-shop">' + Icons.i("cart") + "Markete git</button></div>";
      } else {
        html += '<div class="fridge-grid">' + items.map(function (f) {
          return '<button class="slot" data-food="' + f.id + '"><span class="cnt">' + S.inv[f.id] + "</span>" + Icons.i(f.ic, "big") + "<b>" + f.name + "</b></button>";
        }).join("") + "</div>";
      }
      html += "</div></div>";
    } else if (kitchenTab === "shop") {
      html = '<div class="shop-top"><span data-bunny="peek|bow|white|happy" class="shop-bunny"></span></div><div class="shop-body grid">' + FOODS.map(function (f) {
        return '<button class="card' + (S.coins < f.price ? " off" : "") + '" data-buy="' + f.id + '">' + Icons.i(f.ic, "big") + "<b>" + f.name + "</b><small>Dolapta: " + (S.inv[f.id] || 0) + '</small><span class="price">' + Icons.i("coin") + f.price + "</span></button>";
      }).join("") + "</div>";
    } else {
      html = '<div class="mirror">' + CatArt.cat("happy", { acc: S.equipped }) + '<span data-bunny="sit|flowers|pink|love" style="--r:8deg"></span></div><div class="grid">' + ACCS.map(function (a) {
        var own = S.owned.indexOf(a.id) >= 0, eq = S.equipped === a.id;
        return '<button class="card' + (eq ? " sel" : "") + (!own && S.coins < a.price ? " off" : "") + '" data-acc="' + a.id + '">' + Icons.i(a.ic, "big") + "<b>" + a.name + "</b>" +
          (own ? "<small>" + (eq ? "Takılı, çıkarmak için dokun" : "Sende var, tak") + "</small>" : '<span class="price">' + Icons.i("coin") + a.price + "</span>") + "</button>";
      }).join("") + "</div>";
    }
    box.innerHTML = html; Bunny.mount(box);
    $$("[data-food]", box).forEach(function (b) { b.addEventListener("click", function () { feed(b.getAttribute("data-food")); }); });
    var gs = $("#go-shop"); if (gs) gs.onclick = function () { kitchenTab = "shop"; renderKitchen(); };
    $$("[data-buy]", box).forEach(function (b) {
      b.addEventListener("click", function () {
        var f = foodById(b.getAttribute("data-buy"));
        if (S.coins < f.price) { SFX.bad(); toast("Altının yetmiyor, oyun oyna!"); return; }
        S.coins -= f.price; S.inv[f.id] = (S.inv[f.id] || 0) + 1;
        SFX.coin(); toast(f.name + " dolaba kondu"); renderBars(); save(); renderKitchen();
      });
    });
    $$("[data-acc]", box).forEach(function (b) {
      b.addEventListener("click", function () {
        var a = ACCS.filter(function (x) { return x.id === b.getAttribute("data-acc"); })[0], own = S.owned.indexOf(a.id) >= 0;
        if (!own) {
          if (S.coins < a.price) { SFX.bad(); toast("Altının yetmiyor"); return; }
          S.coins -= a.price; S.owned.push(a.id); S.equipped = a.id; SFX.coin(); toast("Düğme çok yakıştı!");
        } else { S.equipped = S.equipped === a.id ? "" : a.id; SFX.pop(); }
        renderBars(); save(); renderKitchen();
      });
    });
  }
  function feed(id) {
    var f = foodById(id);
    if (!f || (S.inv[id] || 0) < 1) return;
    SFX.unlock();
    if (S.sleeping) wake();
    if (S.hunger > 94) { SFX.bad(); toast("Düğme tok, şimdi istemiyor"); return; }
    S.inv[id]--; show("home"); SFX.click();
    setTimeout(function () {
      var c = catCenter(), el = document.createElement("div");
      el.className = "floaty"; el.style.animation = "none"; el.style.width = "50px"; el.style.height = "50px"; el.innerHTML = Icons.svg(f.ic);
      el.style.left = (c.h.width / 2 - 25) + "px"; el.style.top = (c.h.height - 100) + "px";
      $("#float-layer").appendChild(el);
      var dy = (c.y + c.r.height * 0.18) - (c.h.height - 100);
      var a = el.animate([{ transform: "translate(0,0) scale(1)" }, { transform: "translate(0," + dy + "px) scale(.5)" }], { duration: 650, easing: "ease-in" });
      a.onfinish = function () {
        el.remove(); talkingNow = true; renderCat(true); $("#cat").classList.add("eating"); SFX.eat();
        setTimeout(function () {
          $("#cat").classList.remove("eating"); talkingNow = false; transientHappy = Date.now() + 3500;
          changeStats({ hunger: f.hunger, happy: f.happy }); renderCat(true); meowAt(1.15);
          var cc = catCenter(); floatIcon("heart", cc.x - 20, cc.y); floatIcon("star", cc.x + 24, cc.y - 10);
          say(rnd(["Nam nam! 😋", "Çok lezzetliydi!", "Teşekkürler! 💗", "Bir tane daha?"]));
        }, 1500);
      };
    }, 200);
  }

  // ---------- mektup / ilk açılış ----------
  function openLetter() {
    SFX.unlock(); SFX.pop();
    var phone = window.CONFIG && CONFIG.herPhone;
    modal('<div class="letter"><h3>' + fill(CONFIG.letterTitle) + "</h3><p>" + fill(CONFIG.letter).replace(/</g, "&lt;") + "</p>" +
      '<button class="btn" id="m-love">' + Icons.i("heart") + "Okudum</button>" +
      (phone ? '<button class="btn ghost" id="m-sms">' + Icons.i("mail") + "Mesaj gönder</button>" : "") +
      '<button class="btn ghost" id="m-close">Kapat</button></div>', "sit|letter|white|love");
    $("#m-love").onclick = function () { heartRain(30); SFX.meow(1.2); closeModal(); say("Düğme de seni çok seviyor 💗", 3500); show("home"); };
    if (phone) $("#m-sms").onclick = function () { window.location.href = "sms:" + phone + "?body=" + encodeURIComponent("Seni affediyorum birtanem 💗"); };
    $("#m-close").onclick = closeModal;
  }
  function intro() {
    function step2() {
      modal("<h3>Merhaba" + (S.herName ? " " + S.herName.replace(/</g, "&lt;") : "") + "!</h3><p>Ben Düğme. Beni sev, doyur, oyun oyna, müzik dinle.\n\n" +
        (CONFIG.yourName || "Umut") + " bunu senin için hazırladı. Mektubunu alttaki Mektup düğmesinden okuyabilirsin.</p>" +
        '<button class="btn" id="m-go">' + Icons.i("paw") + "Başla</button>", "sit|heart|pink|love");
      $("#m-go").onclick = function () { S.introDone = true; save(); closeModal(); SFX.unlock(); meowAt(); say("Hoş geldin! Beni sev 💗", 3500); setupNotif(); };
    }
    if (!S.herName) {
      modal('<h3>Merhaba!</h3><p>Ben Düğme. Adın ne?</p><input id="m-name" maxlength="24" placeholder="Adın..." autocomplete="off"><button class="btn" id="m-ok">Tamam</button>', "sit|none|white|happy");
      $("#m-ok").onclick = function () { S.herName = $("#m-name").value.trim(); save(); step2(); };
    } else step2();
  }
  function setupNotif() { if (window.Notif) Notif.setup(S); }

  // ---------- döngü ----------
  function tick() {
    var now = Date.now(), dt = (now - lastTick) / 1000; lastTick = now;
    if (S.sleeping) {
      S.energy = clamp(S.energy + dt * 0.5, 0, 100); S.hunger = clamp(S.hunger - dt * 0.0144, 4, 100);
      if (S.energy >= 100) wake();
    } else decay(dt / 60);
    renderBars(); renderCat();
    if (!S.sleeping && screen === "home" && Math.random() < 0.05) {
      if (S.hunger < 30) say("Karnım aç... buzdolabına bakar mısın? 🐟");
      else if (S.happy < 30) say("Bana biraz ilgi göster 😿");
      else if (S.energy < 15) say("Çok uykum var 💤");
    }
    save();
  }

  function boot() {
    S = load();
    var away = (Date.now() - (S.last || Date.now())) / 60000;
    if (away > 0.5) decay(away);
    lastTick = Date.now();
    SFX.setMuted(!!S.muted);
    var root = document.documentElement.style;
    root.setProperty("--pat", Bunny.pattern());
    root.setProperty("--bunny-back", Bunny.url({ pose: "peek", fur: "white", face: "smile" }));
    Icons.mount(document); Bunny.mount(document);
    setMuteBtn(); setSleepBtn(); Music.init();

    $$(".nav-btn").forEach(function (b) { b.addEventListener("click", function () { SFX.unlock(); SFX.click(); show(b.getAttribute("data-go")); }); });
    $$(".seg-btn").forEach(function (b) { b.addEventListener("click", function () { SFX.click(); kitchenTab = b.getAttribute("data-k"); renderKitchen(); }); });
    $("#btn-mute").addEventListener("click", function () { S.muted = !S.muted; SFX.setMuted(S.muted); setMuteBtn(); save(); });
    $("#act-sleep").addEventListener("click", function () { SFX.unlock(); S.sleeping ? wake() : sleep(); });
    $("#darkness").addEventListener("pointerdown", function () { wake(); });
    $("#act-letter").addEventListener("click", openLetter);
    var talk = $("#act-talk");
    talk.addEventListener("pointerdown", function (e) { e.preventDefault(); startTalk(); });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) { talk.addEventListener(ev, stopTalk); });
    $("#modal").addEventListener("pointerdown", function (e) { if (e.target.id === "modal" && S.introDone) closeModal(); });
    $$(".game-card").forEach(function (b) { b.addEventListener("click", function () { SFX.unlock(); SFX.click(); Games.start(b.getAttribute("data-game")); }); });
    window.addEventListener("resize", relayout);
    window.addEventListener("popstate", function () { pushed = false; if (screen !== "home") show("home", true); });

    setupPetting(); renderBars(); renderRoom(); renderCat(true);
    if (S.sleeping) { $("#darkness").classList.remove("hidden"); $("#zzz").classList.remove("hidden"); }
    show("home", true);
    setTimeout(relayout, 60);
    setInterval(tick, 2000);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) save();
      else { var m = (Date.now() - S.last) / 60000; if (m > 0.3 && !S.sleeping) decay(m); lastTick = Date.now(); renderBars(); renderCat(); renderRoom(); setupNotif(); }
    });
    if (!S.introDone) setTimeout(intro, 400);
    else {
      setupNotif();
      setTimeout(function () { say(S.hunger < 35 ? "Geldin! Karnım çok aç 🐟" : "Geldin! Seni özledim 💗", 3200); }, 700);
    }
  }

  return {
    boot: boot, show: show, toast: toast, say: say, modal: modal, closeModal: closeModal, relayout: relayout,
    changeStats: changeStats, addCoins: addCoins, openLetter: openLetter, meowAt: meowAt,
    state: function () { return S; }, $: $, $$: $$, rnd: rnd, clamp: clamp, fill: fill, heartRain: heartRain
  };
})();
