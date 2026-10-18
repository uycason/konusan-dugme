// 4 mini oyun: Balık Yakala, Hafıza, Fare Avı, Düğme Zıpla
window.Games = (function () {
  const $ = App.$, rnd = App.rnd, clamp = App.clamp;
  let area = null, raf = 0, timers = [], cleanup = [], current = "", ended = false;

  function later(fn, ms) { const t = setTimeout(fn, ms); timers.push(t); return t; }
  function every(fn, ms) { const t = setInterval(fn, ms); timers.push(t); return t; }

  function stop() {
    cancelAnimationFrame(raf); raf = 0;
    timers.forEach(function (t) { clearTimeout(t); clearInterval(t); }); timers = [];
    cleanup.forEach(function (f) { try { f(); } catch (e) {} }); cleanup = [];
    if (area) { area.innerHTML = ""; area.classList.add("hidden"); }
    $("#game-menu").classList.remove("hidden");
    current = "";
  }

  function begin(id, hudLeft, hudRight) {
    stop();
    current = id; ended = false;
    area = $("#game-area");
    area.classList.remove("hidden");
    $("#game-menu").classList.add("hidden");
    area.innerHTML =
      '<div class="g-top"><span id="g-l">' + (hudLeft || "") + '</span><span id="g-r">' + (hudRight || "") + "</span></div>" +
      '<button class="g-quit" id="g-quit">← Çık</button>';
    $("#g-quit").onclick = function () { SFX.click(); stop(); };
    return area;
  }
  function hud(l, r) { if (l != null && $("#g-l")) $("#g-l").textContent = l; if (r != null && $("#g-r")) $("#g-r").textContent = r; }

  function finish(title, line, coins) {
    if (ended) return; ended = true;
    cancelAnimationFrame(raf);
    timers.forEach(function (t) { clearTimeout(t); clearInterval(t); }); timers = [];
    coins = Math.max(0, Math.round(coins));
    App.addCoins(coins);
    App.changeStats({ happy: 12, energy: -8, hunger: -5 });
    coins > 0 ? SFX.win() : SFX.lose();
    const id = current;
    const end = document.createElement("div");
    end.className = "g-end";
    end.innerHTML = '<div class="box"><h3>' + title + "</h3><p>" + line + '</p><p style="font-size:30px;margin:6px 0 12px">+' + coins + ' 🪙</p><button class="btn" id="g-again">🔁 Tekrar</button><button class="btn ghost" id="g-menu" style="color:#2a1a4a">Oyunlar</button></div>';
    area.appendChild(end);
    $("#g-again").onclick = function () { SFX.click(); start(id); };
    $("#g-menu").onclick = function () { SFX.click(); stop(); };
  }

  // ======================================================
  // 1) BALIK YAKALA
  // ======================================================
  function fish() {
    begin("fish", "🐟 0", "⏱ 30");
    const W = area.clientWidth, H = area.clientHeight;
    const basket = document.createElement("div");
    basket.className = "basket"; basket.textContent = "🧺";
    area.appendChild(basket);
    let bx = W / 2, score = 0, left = 30, items = [], spawnT = 0, last = performance.now();
    const BASKET_TOP = H - 56 - 62;
    function setB(x) { bx = clamp(x, 34, W - 34); basket.style.transform = "translateX(" + (bx - 30) + "px)"; }
    setB(bx);
    function move(e) { const r = area.getBoundingClientRect(); setB(e.clientX - r.left); }
    area.addEventListener("pointerdown", move); area.addEventListener("pointermove", move);
    cleanup.push(function () { area.removeEventListener("pointerdown", move); area.removeEventListener("pointermove", move); });
    every(function () { left--; hud(null, "⏱ " + left); if (left <= 0) finish("Süre bitti! 🐟", score + " puan topladın", Math.max(0, score)); }, 1000);

    function pick() {
      const r = Math.random();
      if (r < 0.62) return { e: "🐟", v: 1, vy: 170 };
      if (r < 0.74) return { e: "🍣", v: 3, vy: 230 };
      return { e: "🧅", v: -2, vy: 190 };
    }
    function loop(now) {
      if (ended) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      spawnT -= dt;
      if (spawnT <= 0) {
        spawnT = clamp(0.75 - (30 - left) * 0.012, 0.35, 0.8);
        const t = pick(); const el = document.createElement("div");
        el.className = "fish-item"; el.textContent = t.e; area.appendChild(el);
        t.el = el; t.x = 24 + Math.random() * (W - 48); t.y = -40; t.vy *= 1 + (30 - left) * 0.012;
        items.push(t);
      }
      for (let i = items.length - 1; i >= 0; i--) {
        const t = items[i]; t.y += t.vy * dt;
        t.el.style.transform = "translate(" + (t.x - 18) + "px," + t.y + "px)";
        if (t.y + 34 >= BASKET_TOP && t.y <= BASKET_TOP + 50 && Math.abs(t.x - bx) < 50) {
          score += t.v; hud("🐟 " + Math.max(0, score));
          t.v > 0 ? SFX.coin() : SFX.bad();
          t.el.remove(); items.splice(i, 1);
        } else if (t.y > H) { t.el.remove(); items.splice(i, 1); }
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
  }

  // ======================================================
  // 2) HAFIZA
  // ======================================================
  function memory() {
    begin("memory", "Hamle: 0", "Eş: 0/8");
    const emojis = ["🐟", "🥛", "🍗", "🐭", "🧶", "🐾", "❤️", "⭐"];
    const deck = emojis.concat(emojis).sort(function () { return Math.random() - 0.5; });
    const grid = document.createElement("div"); grid.className = "mem-grid"; area.appendChild(grid);
    let first = null, lock = false, moves = 0, pairs = 0;
    deck.forEach(function (e) {
      const c = document.createElement("div"); c.className = "mem-card";
      c.innerHTML = '<div class="in"><div class="b">🐈‍⬛</div><div class="f">' + e + "</div></div>";
      c.dataset.e = e;
      c.addEventListener("click", function () {
        if (lock || ended || c.classList.contains("up")) return;
        SFX.flip(); c.classList.add("up");
        if (!first) { first = c; return; }
        moves++; hud("Hamle: " + moves);
        if (first.dataset.e === c.dataset.e) {
          const a = first; first = null; pairs++; hud(null, "Eş: " + pairs + "/8");
          a.classList.add("done"); c.classList.add("done"); SFX.coin();
          if (pairs === 8) later(function () { finish("Hepsini buldun! 🃏", moves + " hamlede bitirdin", clamp(42 - moves * 2, 8, 30)); }, 600);
        } else {
          const a = first; first = null; lock = true;
          later(function () { a.classList.remove("up"); c.classList.remove("up"); lock = false; }, 800);
        }
      });
      grid.appendChild(c);
    });
  }

  // ======================================================
  // 3) FARE AVI
  // ======================================================
  function mouse() {
    begin("mouse", "🐭 0", "⏱ 30");
    const grid = document.createElement("div"); grid.className = "mouse-grid"; area.appendChild(grid);
    let score = 0, left = 30; const holes = [];
    for (let i = 0; i < 9; i++) {
      const h = document.createElement("div"); h.className = "hole"; h.innerHTML = '<div class="pop">🐭</div>';
      const o = { el: h, up: false, kind: "m", t: 0 };
      h.addEventListener("pointerdown", function () {
        if (!o.up || ended) return;
        o.up = false; h.classList.add("hit"); h.classList.remove("up");
        if (o.kind === "m") { score++; SFX.coin(); } else { score = Math.max(0, score - 3); SFX.bad(); }
        hud("🐭 " + score);
      });
      holes.push(o); grid.appendChild(h);
    }
    every(function () { left--; hud(null, "⏱ " + left); if (left <= 0) finish("Süre bitti! 🐭", score + " fare yakaladın", score); }, 1000);
    function popOne() {
      const free = holes.filter(function (h) { return !h.up; });
      if (!free.length) return;
      const o = rnd(free); o.up = true; o.kind = Math.random() < 0.2 ? "d" : "m";
      o.el.classList.remove("hit"); o.el.firstChild.textContent = o.kind === "m" ? "🐭" : "🐶";
      o.el.classList.add("up"); SFX.pop();
      later(function () { o.up = false; o.el.classList.remove("up"); }, 800 + Math.random() * 500);
    }
    every(popOne, 620);
  }

  // ======================================================
  // 4) DÜĞME ZIPLA
  // ======================================================
  function jump() {
    begin("jump", "0 m", "🐟 0");
    const W = area.clientWidth, H = area.clientHeight, dpr = window.devicePixelRatio || 1;
    const cv = document.createElement("canvas"); cv.id = "jump-canvas";
    cv.width = W * dpr; cv.height = H * dpr; area.insertBefore(cv, area.firstChild);
    const g = cv.getContext("2d"); g.scale(dpr, dpr);
    const ground = H * 0.7, cx = 74;
    let y = 0, vy = 0, onGround = true, dist = 0, fishN = 0, speed = 230, last = performance.now();
    let obs = [], pick = [], spawnX = W + 100, clouds = [];
    for (let i = 0; i < 4; i++) clouds.push({ x: Math.random() * W, y: 40 + Math.random() * 120, s: 0.5 + Math.random() });
    function doJump() { if (onGround && !ended) { vy = -560; onGround = false; SFX.jump(); } }
    area.addEventListener("pointerdown", doJump);
    cleanup.push(function () { area.removeEventListener("pointerdown", doJump); });

    function loop(now) {
      if (ended) return;
      const dt = Math.min(0.04, (now - last) / 1000); last = now;
      speed += dt * 6; dist += speed * dt * 0.05;
      vy += 1500 * dt; y += vy * dt;
      if (y >= 0) { y = 0; vy = 0; onGround = true; }
      // üret
      spawnX -= speed * dt;
      if (spawnX < W - 60 - Math.random() * 240 && obs.length < 3 && spawnX < W) {
        obs.push({ x: W + 40, e: rnd(["📦", "🪨", "🌵"]) });
        if (Math.random() < 0.7) pick.push({ x: W + 40 + 130 + Math.random() * 60, y: -(60 + Math.random() * 85) });
        spawnX = W + 220 + Math.random() * 240;
      }
      obs.forEach(function (o) { o.x -= speed * dt; });
      pick.forEach(function (p) { p.x -= speed * dt; });
      obs = obs.filter(function (o) { return o.x > -60; });
      // çarpışma
      for (let i = 0; i < obs.length; i++) {
        if (Math.abs(obs[i].x - cx) < 34 && y > -44) {
          SFX.bad(); hud(Math.floor(dist) + " m");
          return finish("Çarptın! 😿", Math.floor(dist) + " m koştun, " + fishN + " balık topladın", Math.floor(dist / 20) + fishN * 2);
        }
      }
      for (let i = pick.length - 1; i >= 0; i--) {
        const p = pick[i];
        if (Math.abs(p.x - cx) < 38 && Math.abs(p.y - y) < 52) { fishN++; SFX.coin(); hud(null, "🐟 " + fishN); pick.splice(i, 1); }
        else if (p.x < -40) pick.splice(i, 1);
      }
      hud(Math.floor(dist) + " m");
      // çiz
      g.clearRect(0, 0, W, H);
      const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, "#3b2670"); sky.addColorStop(1, "#ff8fb1");
      g.fillStyle = sky; g.fillRect(0, 0, W, H);
      g.font = "46px serif"; g.textAlign = "center"; g.textBaseline = "alphabetic";
      clouds.forEach(function (c) { c.x -= speed * dt * 0.1 * c.s; if (c.x < -60) c.x = W + 60; g.globalAlpha = 0.7; g.fillText("☁️", c.x, c.y); });
      g.globalAlpha = 1;
      g.fillStyle = "#2a1a4a"; g.fillRect(0, ground, W, H - ground);
      g.fillStyle = "#4a3a8a"; g.fillRect(0, ground, W, 6);
      g.font = "52px serif";
      obs.forEach(function (o) { g.fillText(o.e, o.x, ground + 2); });
      g.font = "40px serif";
      pick.forEach(function (p) { g.fillText("🐟", p.x, ground + p.y + 2); });
      g.font = "64px serif";
      g.save(); g.translate(cx, ground + y + 2);
      if (!onGround) g.rotate(Math.max(-0.35, Math.min(0.35, vy / 1800)));
      g.fillText("🐈‍⬛", 0, 0); g.restore();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
  }

  const MAP = { fish: fish, memory: memory, mouse: mouse, jump: jump };
  function start(id) { (MAP[id] || fish)(); }
  return { start: start, stop: stop };
})();
