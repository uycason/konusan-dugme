// 4 mini oyun: Balık Yakala, Hafıza, Fare Avı, Düğme Zıpla
// (resimler hep SVG ikon: eski telefonlarda "kutu" çıkmasın diye emoji kullanılmaz)
window.Games = (function () {
  var $ = App.$, rnd = App.rnd, clamp = App.clamp;
  var area = null, raf = 0, timers = [], cleanup = [], current = "", ended = false;

  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function every(fn, ms) { var t = setInterval(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(function (t) { clearTimeout(t); clearInterval(t); }); timers = []; }

  function stop() {
    cancelAnimationFrame(raf); raf = 0;
    clearTimers();
    cleanup.forEach(function (f) { try { f(); } catch (e) {} }); cleanup = [];
    if (area) { area.innerHTML = ""; area.classList.add("hidden"); }
    $("#game-menu").classList.remove("hidden");
    current = "";
  }

  function chip(id, ic, v) { return '<span class="g-chip" id="' + id + '">' + Icons.i(ic) + "<b>" + v + "</b></span>"; }

  function begin(id, l, r, hint) {
    stop();
    current = id; ended = false;
    area = $("#game-area");
    $("#screen-games").scrollTop = 0;
    area.classList.remove("hidden");
    $("#game-menu").classList.add("hidden");
    area.innerHTML =
      '<div class="g-top">' + chip("g-l", l[0], l[1]) + chip("g-r", r[0], r[1]) + "</div>" +
      '<button class="g-quit" id="g-quit">' + Icons.i("back") + "Çık</button>" +
      (hint ? '<div class="g-hint">' + hint + "</div>" : "");
    $("#g-quit").onclick = function () { SFX.click(); stop(); };
    if (hint) later(function () { var h = $(".g-hint", area); if (h) h.classList.add("gone"); }, 2800);
    return area;
  }
  function hud(l, r) {
    var a, b;
    if (l != null) { a = $("#g-l b"); if (a) a.textContent = l; }
    if (r != null) { b = $("#g-r b"); if (b) b.textContent = r; }
  }
  function popText(x, y, txt, bad) {
    var e = document.createElement("div");
    e.className = "g-pop" + (bad ? " bad" : "");
    e.textContent = txt; e.style.left = x + "px"; e.style.top = y + "px";
    area.appendChild(e);
    setTimeout(function () { if (e.parentNode) e.parentNode.removeChild(e); }, 850);
  }

  function finish(title, line, coins, face) {
    if (ended) return; ended = true;
    cancelAnimationFrame(raf); clearTimers();
    var hh = $(".g-hint", area); if (hh && hh.parentNode) hh.parentNode.removeChild(hh);
    coins = Math.max(0, Math.round(coins));
    App.addCoins(coins);
    App.changeStats({ happy: 12, energy: -8, hunger: -5 });
    if (coins > 0) SFX.win(); else SFX.lose();
    var id = current, end = document.createElement("div");
    end.className = "g-end";
    end.innerHTML = '<div class="box"><span data-bunny="sit|' + (coins > 0 ? "heart" : "none") + "|white|" + (face || (coins > 0 ? "happy" : "cry")) + '"></span>' +
      "<h3>" + title + "</h3><p>" + line + '</p><div class="gain">' + Icons.i("coin") + "+" + coins + "</div>" +
      '<button class="btn" id="g-again">' + Icons.i("repeat") + 'Tekrar</button><button class="btn ghost" id="g-menu">Oyunlara dön</button></div>';
    area.appendChild(end); Bunny.mount(end);
    $("#g-again").onclick = function () { SFX.click(); start(id); };
    $("#g-menu").onclick = function () { SFX.click(); stop(); };
  }

  // ======================================================
  // 1) BALIK YAKALA
  // ======================================================
  function fish() {
    begin("fish", ["fish", "0"], ["clock", "30"], "Sepeti kaydır, balıkları yakala. Soğandan kaç!");
    var W = area.clientWidth, H = area.clientHeight;
    var waves = document.createElement("div"); waves.className = "waves"; area.appendChild(waves);
    var basket = document.createElement("div");
    basket.className = "basket"; basket.innerHTML = Icons.svg("basket");
    area.appendChild(basket);
    var bx = W / 2, score = 0, left = 30, items = [], spawnT = 0, last = performance.now();
    var BASKET_TOP = H - 64 - 68 + 14;
    function setB(x) { bx = clamp(x, 34, W - 34); basket.style.transform = "translateX(" + (bx - 34) + "px)"; }
    setB(bx);
    function move(e) { var r = area.getBoundingClientRect(); setB(e.clientX - r.left); }
    area.addEventListener("pointerdown", move); area.addEventListener("pointermove", move);
    cleanup.push(function () { area.removeEventListener("pointerdown", move); area.removeEventListener("pointermove", move); });
    every(function () {
      left--; hud(null, left);
      if (left <= 0) finish("Süre bitti!", score + " puan topladın", score);
    }, 1000);

    function pick() {
      var r = Math.random();
      if (r < 0.62) return { n: "fish", v: 1, vy: 170 };
      if (r < 0.74) return { n: "sushi", v: 3, vy: 230 };
      return { n: "onion", v: -2, vy: 190 };
    }
    function loop(now) {
      if (ended) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      spawnT -= dt;
      if (spawnT <= 0) {
        spawnT = clamp(0.75 - (30 - left) * 0.012, 0.35, 0.8);
        var t = pick(), el = document.createElement("div");
        el.className = "fish-item"; el.innerHTML = Icons.svg(t.n); area.appendChild(el);
        t.el = el; t.x = 24 + Math.random() * (W - 48); t.y = -44; t.vy *= 1 + (30 - left) * 0.012;
        items.push(t);
      }
      for (var i = items.length - 1; i >= 0; i--) {
        var q = items[i]; q.y += q.vy * dt;
        q.el.style.transform = "translate(" + (q.x - 20) + "px," + q.y + "px)";
        if (q.y + 36 >= BASKET_TOP && q.y <= BASKET_TOP + 44 && Math.abs(q.x - bx) < 46) {
          score = Math.max(0, score + q.v); hud(score);
          if (q.v > 0) SFX.coin(); else SFX.bad();
          popText(bx, BASKET_TOP - 6, (q.v > 0 ? "+" : "") + q.v, q.v < 0);
          q.el.remove(); items.splice(i, 1);
        } else if (q.y > H) { q.el.remove(); items.splice(i, 1); }
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
  }

  // ======================================================
  // 2) HAFIZA
  // ======================================================
  function memory() {
    begin("memory", ["paw", "Hamle 0"], ["cards", "0/8"], "");
    var names = ["fish", "milk", "drum", "mouse", "yarn", "paw", "heart", "star"];
    var deck = names.concat(names).sort(function () { return Math.random() - 0.5; });
    var grid = document.createElement("div"); grid.className = "mem-grid"; area.appendChild(grid);
    var first = null, lock = false, moves = 0, pairs = 0;
    deck.forEach(function (n) {
      var c = document.createElement("div"); c.className = "mem-card";
      c.innerHTML = '<div class="in"><div class="b"></div><div class="f">' + Icons.i(n) + "</div></div>";
      c.setAttribute("data-n", n);
      c.addEventListener("click", function () {
        if (lock || ended || c.classList.contains("up")) return;
        SFX.flip(); c.classList.add("up");
        if (!first) { first = c; return; }
        moves++; hud("Hamle " + moves);
        if (first.getAttribute("data-n") === n) {
          var a = first; first = null; pairs++; hud(null, pairs + "/8");
          a.classList.add("done"); c.classList.add("done"); SFX.coin();
          if (pairs === 8) later(function () { finish("Hepsini buldun!", moves + " hamlede bitirdin", clamp(42 - moves * 2, 8, 30)); }, 600);
        } else {
          var b = first; first = null; lock = true;
          later(function () { b.classList.remove("up"); c.classList.remove("up"); lock = false; }, 800);
        }
      });
      grid.appendChild(c);
    });
  }

  // ======================================================
  // 3) FARE AVI
  // ======================================================
  function mouse() {
    begin("mouse", ["mouse", "0"], ["clock", "30"], "Fareleri yakala, köpeğe dokunma!");
    var grid = document.createElement("div"); grid.className = "mouse-grid"; area.appendChild(grid);
    var AW = area.clientWidth, AH = area.clientHeight;
    var cell = Math.max(60, Math.min(Math.floor((AW - 32 - 20) / 3), Math.floor((AH - 130 - 20) / 3))), gs = cell * 3 + 20;
    grid.style.left = Math.round((AW - gs) / 2) + "px"; grid.style.right = "auto"; grid.style.width = gs + "px";
    grid.style.top = Math.round((AH - gs) / 2 + 10) + "px"; grid.style.bottom = "auto"; grid.style.height = gs + "px";
    var score = 0, left = 30, holes = [];
    function makeHole() {
      var h = document.createElement("div"); h.className = "hole"; h.innerHTML = '<div class="pop">' + Icons.i("mouse") + "</div>";
      var o = { el: h, up: false, kind: "m" };
      h.addEventListener("pointerdown", function (e) {
        if (!o.up || ended) return;
        o.up = false; h.classList.add("hit"); h.classList.remove("up");
        var r = area.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top - 24;
        if (o.kind === "m") { score++; SFX.coin(); popText(px, py, "+1"); }
        else { score = Math.max(0, score - 3); SFX.bad(); popText(px, py, "-3", true); }
        hud(score);
      });
      holes.push(o); grid.appendChild(h);
    }
    for (var i = 0; i < 9; i++) makeHole();
    every(function () { left--; hud(null, left); if (left <= 0) finish("Süre bitti!", score + " fare yakaladın", score); }, 1000);
    function popOne() {
      var free = holes.filter(function (h) { return !h.up; });
      if (!free.length) return;
      var o = rnd(free); o.up = true; o.kind = Math.random() < 0.2 ? "d" : "m";
      o.el.classList.remove("hit");
      o.el.firstChild.innerHTML = Icons.i(o.kind === "m" ? "mouse" : "dog");
      o.el.classList.add("up"); SFX.pop();
      later(function () { o.up = false; o.el.classList.remove("up"); }, 800 + Math.random() * 500);
    }
    every(popOne, 620);
  }

  // ======================================================
  // 4) DÜĞME ZIPLA
  // ======================================================
  function jump() {
    begin("jump", ["paw", "0 m"], ["fish", "0"], "Ekrana dokun: zıpla! Balıkları topla.");
    var W = area.clientWidth, H = area.clientHeight, dpr = window.devicePixelRatio || 1;
    var cv = document.createElement("canvas"); cv.id = "jump-canvas";
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); area.insertBefore(cv, area.firstChild);
    var g = cv.getContext("2d"); g.scale(dpr, dpr);
    var ground = Math.round(H * 0.72), cx = 74;
    var y = 0, vy = 0, onGround = true, dist = 0, fishN = 0, speed = 230, scroll = 0, runT = 0, lastD = -1, last = performance.now();
    var obs = [], pick = [], spawnX = W + 100, clouds = [];
    function sprite(html, w, h) { var e = document.createElement("div"); e.className = "sp"; e.style.width = w + "px"; e.style.height = h + "px"; e.innerHTML = html; area.appendChild(e); return e; }
    var catEl = sprite('<div class="f1">' + Icons.catrun(1) + '</div><div class="f2" style="display:none">' + Icons.catrun(2) + "</div>", 84, 58);
    var f1 = catEl.firstChild, f2 = catEl.lastChild;
    for (var i = 0; i < 4; i++) clouds.push({ x: Math.random() * W, y: 50 + Math.random() * 110, s: 0.6 + Math.random() * 0.7 });
    function doJump() { if (onGround && !ended) { vy = -560; onGround = false; SFX.jump(); } }
    area.addEventListener("pointerdown", doJump);
    cleanup.push(function () { area.removeEventListener("pointerdown", doJump); });

    function img(im, x, yy, w, h) { if (im.complete) { try { g.drawImage(im, x, yy, w, h); } catch (e) {} } }
    function blob(x, yy, s) {
      var parts = [[0, 0, 16], [18, -8, 20], [40, 0, 15], [20, 5, 17]];
      g.beginPath();
      parts.forEach(function (c) { g.moveTo(x + c[0] * s + c[2] * s, yy + c[1] * s); g.arc(x + c[0] * s, yy + c[1] * s, c[2] * s, 0, 6.2832); });
      g.fill();
    }
    function hills(off, step, r, col, base) {
      g.fillStyle = col; g.beginPath();
      for (var x = -(off % step) - step; x < W + step; x += step) { g.moveTo(x + step / 2 + r, base); g.arc(x + step / 2, base, r, 0, 6.2832); }
      g.fill();
    }

    function loop(now) {
      if (ended) return;
      var dt = Math.min(0.04, (now - last) / 1000); last = now;
      speed += dt * 6; dist += speed * dt * 0.05; scroll += speed * dt; runT += dt;
      vy += 1500 * dt; y += vy * dt;
      if (y >= 0) { y = 0; vy = 0; onGround = true; }
      // engel ve balık üret
      spawnX -= speed * dt;
      if (spawnX < W - 60 - Math.random() * 240 && obs.length < 3 && spawnX < W) {
        obs.push({ x: W + 40, k: rnd(["box", "rock", "cactus"]) }); obs[obs.length - 1].el = sprite(Icons.svg(obs[obs.length - 1].k), 52, 52);
        if (Math.random() < 0.7) { var np = { x: W + 40 + 130 + Math.random() * 60, y: -(60 + Math.random() * 85) }; np.el = sprite(Icons.svg("fish"), 38, 38); pick.push(np); }
        spawnX = W + 220 + Math.random() * 240;
      }
      obs.forEach(function (o) { o.x -= speed * dt; });
      pick.forEach(function (p) { p.x -= speed * dt; });
      obs = obs.filter(function (o) { if (o.x > -60) return true; if (o.el.parentNode) o.el.parentNode.removeChild(o.el); return false; });
      // çarpışma
      for (var i = 0; i < obs.length; i++) {
        if (Math.abs(obs[i].x - cx) < 34 && y > -44) {
          SFX.bad(); hud(Math.floor(dist) + " m");
          return finish("Çarptın!", Math.floor(dist) + " m koştun, " + fishN + " balık topladın", Math.floor(dist / 20) + fishN * 2, "wow");
        }
      }
      for (var k = pick.length - 1; k >= 0; k--) {
        var p = pick[k];
        if (Math.abs(p.x - cx) < 38 && Math.abs(p.y - y) < 52) { fishN++; SFX.coin(); hud(null, fishN); pick.splice(k, 1); if (p.el.parentNode) p.el.parentNode.removeChild(p.el); }
        else if (p.x < -40) { pick.splice(k, 1); if (p.el.parentNode) p.el.parentNode.removeChild(p.el); }
      }
      var dd = Math.floor(dist); if (dd !== lastD) { lastD = dd; hud(dd + " m"); }

      // çiz
      g.clearRect(0, 0, W, H);
      var sky = g.createLinearGradient(0, 0, 0, ground);
      sky.addColorStop(0, "#e6d4f5"); sky.addColorStop(0.55, "#fbd3e1"); sky.addColorStop(1, "#ffeadb");
      g.fillStyle = sky; g.fillRect(0, 0, W, H);
      g.fillStyle = "rgba(255,255,255,.55)"; g.beginPath(); g.arc(W - 64, 78, 34, 0, 6.2832); g.fill();
      g.fillStyle = "rgba(255,255,255,.82)";
      clouds.forEach(function (c) { c.x -= speed * dt * 0.08 * c.s; if (c.x < -90) c.x = W + 60; blob(c.x, c.y, c.s); });
      hills(scroll * 0.2, 230, 95, "#f6c7d7", ground + 28);
      hills(scroll * 0.45, 160, 62, "#f1b0c5", ground + 22);
      g.fillStyle = "#f4a9c0"; g.fillRect(0, ground, W, H - ground);
      g.fillStyle = "#e98aa4"; g.fillRect(0, ground, W, 6);
      g.fillStyle = "rgba(255,255,255,.55)";
      for (var gx = -(scroll % 64); gx < W; gx += 64) { g.fillRect(gx, ground + 24, 26, 5); g.fillRect(gx + 32, ground + 46, 18, 4); }
      obs.forEach(function (o) { o.el.style.transform = "translate(" + (o.x - 26) + "px," + (ground - 50) + "px)"; });
      pick.forEach(function (p) { p.el.style.transform = "translate(" + (p.x - 19) + "px," + (ground + p.y - 38) + "px)"; });
      g.fillStyle = "rgba(120,60,90,.22)"; g.beginPath();
      g.ellipse(cx, ground + 5, Math.max(12, 30 + y / 6), 5, 0, 0, 6.2832); g.fill();
      var fr = onGround ? Math.floor(runT / 0.1) % 2 : 0;
      f1.style.display = fr ? "none" : "block"; f2.style.display = fr ? "block" : "none";
      catEl.style.transform = "translate(" + (cx - 42) + "px," + (ground + y + 2 - 58) + "px) rotate(" + (onGround ? 0 : clamp(vy / 1800, -0.35, 0.35)) + "rad)";
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
  }

  var MAP = { fish: fish, memory: memory, mouse: mouse, jump: jump };
  function start(id) { (MAP[id] || fish)(); }
  return { start: start, stop: stop };
})();
