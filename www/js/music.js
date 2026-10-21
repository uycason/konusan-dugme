// Müzik çalar: kendi şarkılarını ekle (telefonundan), repo içindeki şarkılar ve ninni.
window.Music = (function () {
  var LS = "dugme_music_v1";
  var audio = new Audio();
  audio.preload = "metadata";
  var tracks = [];
  var cur = -1;
  var cfg = { vol: 0.8, shuffle: false, repeat: "all" };
  var objURL = null, inited = false, onScreen = false, seeking = false, micWas = false;
  var lull = null, idbOk = true, memRows = [];
  var FURS = ["pink", "lav", "peach", "sky", "white", "butter"];

  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function fmt(s) { if (!isFinite(s) || s <= 0) return "0:00"; var m = Math.floor(s / 60), x = Math.floor(s % 60); return m + ":" + (x < 10 ? "0" : "") + x; }
  function toast(t) { if (window.App) App.toast(t); }

  function loadCfg() { try { var r = localStorage.getItem(LS); if (r) { var o = JSON.parse(r); for (var k in o) cfg[k] = o[k]; } } catch (e) {} }
  function saveCfg() { try { localStorage.setItem(LS, JSON.stringify(cfg)); } catch (e) {} }

  // ---------- IndexedDB (şarkılar telefonda kalır) ----------
  function openDB() {
    return new Promise(function (res, rej) {
      if (!window.indexedDB) return rej(new Error("idb yok"));
      var r = indexedDB.open("dugme_music", 1);
      r.onupgradeneeded = function () { r.result.createObjectStore("songs", { keyPath: "id" }); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
  }
  function idb(mode, fn) {
    return openDB().then(function (db) {
      return new Promise(function (res, rej) {
        var t = db.transaction("songs", mode), rq = fn(t.objectStore("songs"));
        t.oncomplete = function () { res(rq && rq.result); };
        t.onerror = function () { rej(t.error); };
        t.onabort = function () { rej(t.error || new Error("abort")); };
      });
    });
  }

  // ---------- çalma listesi ----------
  function userTrack(r) { return { id: r.id, kind: "user", title: r.title, artist: r.artist, blob: r.blob, dur: r.dur || 0, added: r.added }; }
  function parseName(fn) {
    var n = String(fn || "Şarkı").replace(/\.[^.]+$/, "").replace(/_+/g, " ").replace(/\s+/g, " ").trim();
    var p = n.split(" - ");
    if (p.length >= 2) return { artist: p[0].trim(), title: p.slice(1).join(" - ").trim() };
    return { artist: "Benim şarkılarım", title: n || "Şarkı" };
  }
  function probe(src, cb) {
    var a = new Audio(), done = false;
    function fin(d) { if (done) return; done = true; try { a.removeAttribute("src"); } catch (e) {} cb(d); }
    a.preload = "metadata";
    a.onloadedmetadata = function () { fin(isFinite(a.duration) ? a.duration : 0); };
    a.onerror = function () { fin(-1); };
    setTimeout(function () { fin(0); }, 5000);
    a.src = src;
  }

  function init() {
    if (inited) return; inited = true;
    loadCfg(); audio.volume = cfg.vol;
    tracks = [{ id: "builtin-lullaby", kind: "builtin", title: "Düğme'nin Ninnisi", artist: "Konuşan Düğme", dur: 41 }];
    var songs = (window.CONFIG && CONFIG.songs) || [];
    songs.forEach(function (s, k) {
      var t = { id: "bundled-" + k, kind: "bundled", title: s.title || parseName(s.file).title, artist: s.artist || "Sana özel", src: encodeURI(s.file), dur: 0 };
      tracks.push(t);
      probe(encodeURI(s.file), function (d) { if (d < 0) { var ix = tracks.indexOf(t); if (ix >= 0) { tracks.splice(ix, 1); refresh(); } } else if (d) { t.dur = d; refresh(); } });
    });
    audio.addEventListener("timeupdate", ui);
    audio.addEventListener("loadedmetadata", function () { if (tracks[cur] && isFinite(audio.duration)) { tracks[cur].dur = audio.duration; refresh(); } });
    audio.addEventListener("play", function () { ui(); refresh(); });
    audio.addEventListener("pause", function () { ui(); refresh(); });
    audio.addEventListener("ended", function () { if (cfg.repeat === "one") { audio.currentTime = 0; audio.play(); } else next(true); });
    audio.addEventListener("error", function () { if (cur >= 0) { toast("Bu şarkı çalınamadı"); refresh(); } });
    renderMini();
    idb("readonly", function (s) { return s.getAll(); }).then(function (rows) {
      (rows || []).sort(function (a, b) { return (a.added || 0) - (b.added || 0); }).forEach(function (r) { tracks.push(userTrack(r)); });
      refresh();
    }).catch(function () { idbOk = false; });
  }

  function makeURL(blob) {
    if (objURL) { try { URL.revokeObjectURL(objURL); } catch (e) {} }
    objURL = URL.createObjectURL(blob);
    return objURL;
  }
  function srcOf(t) {
    if (t.kind === "bundled") return Promise.resolve(t.src);
    if (t.kind === "user") return Promise.resolve(makeURL(t.blob));
    if (lull) return Promise.resolve(makeURL(lull));
    toast("Ninni hazırlanıyor...");
    return Lullaby.render().then(function (r) { lull = r.blob; t.dur = r.duration; return makeURL(lull); });
  }

  function playIndex(i) {
    var t = tracks[i]; if (!t) return Promise.resolve();
    cur = i; refresh();
    return srcOf(t).then(function (src) {
      if (cur !== i) return;
      audio.src = src;
      var p = audio.play();
      if (p && p.catch) p.catch(function (err) { if (err && err.name === "NotAllowedError") toast("Çalmak için oynat düğmesine dokun"); });
      meta(t);
    }).catch(function () { toast("Şarkı açılamadı"); });
  }
  function meta(t) {
    try {
      if (navigator.mediaSession && window.MediaMetadata) {
        navigator.mediaSession.metadata = new MediaMetadata({ title: t.title, artist: t.artist, album: "Konuşan Düğme" });
        navigator.mediaSession.setActionHandler("play", function () { audio.play(); });
        navigator.mediaSession.setActionHandler("pause", function () { audio.pause(); });
        navigator.mediaSession.setActionHandler("nexttrack", function () { next(); });
        navigator.mediaSession.setActionHandler("previoustrack", function () { prev(); });
      }
    } catch (e) {}
  }
  function isPlaying() { return !audio.paused && !audio.ended && cur >= 0; }
  function toggle() {
    if (cur < 0) return playIndex(cfg.shuffle ? Math.floor(Math.random() * tracks.length) : 0);
    if (audio.paused) { var p = audio.play(); if (p && p.catch) p.catch(function () {}); } else audio.pause();
  }
  function next(auto) {
    if (!tracks.length) return;
    var i;
    if (cfg.shuffle && tracks.length > 1) { do { i = Math.floor(Math.random() * tracks.length); } while (i === cur); }
    else { i = cur + 1; if (i >= tracks.length) { if (cfg.repeat === "all" || !auto) i = 0; else { audio.pause(); audio.currentTime = 0; return; } } }
    playIndex(i);
  }
  function prev() {
    if (cur < 0) return;
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    playIndex(cur - 1 < 0 ? tracks.length - 1 : cur - 1);
  }
  function seekTo(f) { if (isFinite(audio.duration) && audio.duration > 0) audio.currentTime = f * audio.duration; }
  function setVol(v) { cfg.vol = Math.max(0, Math.min(1, v)); audio.volume = cfg.vol; saveCfg(); }
  function toggleShuffle() { cfg.shuffle = !cfg.shuffle; saveCfg(); refresh(); }
  function cycleRepeat() { cfg.repeat = cfg.repeat === "all" ? "one" : cfg.repeat === "one" ? "off" : "all"; saveCfg(); refresh(); }

  // ---------- şarkı ekle / sil ----------
  function addFiles(files) {
    var list = Array.prototype.slice.call(files || []).filter(function (f) { return /^audio\//.test(f.type) || /\.(mp3|m4a|aac|ogg|oga|wav|flac|opus|webm)$/i.test(f.name); });
    if (!list.length) { toast("Müzik dosyası seçilmedi"); return Promise.resolve(); }
    var ok = 0, i = 0;
    function one() {
      if (i >= list.length) { toast(ok ? ok + " şarkı eklendi" : "Şarkı eklenemedi"); refresh(); return; }
      var f = list[i++];
      return f.arrayBuffer().then(function (buf) {
        var blob = new Blob([buf], { type: f.type || "audio/mpeg" }), nm = parseName(f.name);
        var rec = { id: "u" + Date.now() + "-" + Math.floor(Math.random() * 1e6), title: nm.title, artist: nm.artist, blob: blob, added: Date.now(), dur: 0 };
        return new Promise(function (res) {
          var u = URL.createObjectURL(blob);
          probe(u, function (d) { try { URL.revokeObjectURL(u); } catch (e) {} rec.dur = d; res(); });
        }).then(function () {
          var t = userTrack(rec); tracks.push(t); ok++; refresh();
          if (idbOk) return idb("readwrite", function (s) { return s.put(rec); }).catch(function () { idbOk = false; toast("Şarkı bu oturumda kalır, telefona kaydedilemedi"); });
        });
      }).catch(function () {}).then(one);
    }
    return one();
  }
  function removeTrack(id) {
    var i = -1; tracks.forEach(function (t, k) { if (t.id === id) i = k; });
    if (i < 0 || tracks[i].kind !== "user") return;
    if (i === cur) { audio.pause(); audio.removeAttribute("src"); cur = -1; }
    else if (i < cur) cur--;
    tracks.splice(i, 1);
    if (idbOk) idb("readwrite", function (s) { return s["delete"](id); }).catch(function () {});
    refresh();
  }
  function askRemove(id) {
    var t = tracks.filter(function (x) { return x.id === id; })[0]; if (!t) return;
    App.modal('<h3>Şarkıyı sil?</h3><p>' + esc(t.title) + '</p><button class="btn" id="m-yes">Sil</button><button class="btn ghost" id="m-no">Vazgeç</button>', "sit|none|white|cry");
    $("#m-yes").onclick = function () { removeTrack(id); App.closeModal(); };
    $("#m-no").onclick = App.closeModal;
  }

  // ---------- arayüz ----------
  function cover(i) { return '<div class="cover cv' + (i % 6) + '">' + Bunny.svg({ pose: "peek", fur: FURS[i % 6], face: i % 2 ? "smile" : "happy" }) + "</div>"; }
  function curTrack() { return tracks[cur]; }

  function renderFull() {
    var root = $("#music-root"); if (!root) return;
    var t = curTrack(), pl = isPlaying();
    var rows = tracks.map(function (s, i) {
      var on = i === cur;
      return '<div class="song' + (on ? " on" : "") + '" data-i="' + i + '">' + cover(i) +
        '<div class="s-info"><b>' + esc(s.title) + "</b><small>" + esc(s.artist) + "</small></div>" +
        (on && pl ? '<span class="eq"><i></i><i></i><i></i></span>' : "") +
        '<span class="s-dur">' + (s.dur ? fmt(s.dur) : "") + "</span>" +
        (s.kind === "user" ? '<button class="s-del" data-del="' + esc(s.id) + '" aria-label="Sil">' + Icons.i("trash") + "</button>" : "") + "</div>";
    }).join("");
    root.innerHTML =
      '<div class="screen-head"><div><h2>Müzik</h2><p class="hint">Düğme\'nin çalma listesi</p></div><span class="head-bunny" data-bunny="sit|phones|peach|smile"></span></div>' +
      '<div class="np"><span class="notes-float">' + Icons.i("note1") + "</span>" +
      '<div class="vinyl' + (pl ? " spin" : "") + '"><div class="vinyl-label"></div></div>' +
      '<div class="np-title">' + esc(t ? t.title : "Bir şarkı seç") + '</div><div class="np-artist">' + esc(t ? t.artist : "Dokun ve çal") + "</div>" +
      '<div class="seekrow"><span id="t-cur">0:00</span><input id="seek" type="range" min="0" max="1000" value="0"><span class="r" id="t-dur">0:00</span></div>' +
      '<div class="ctrls"><button class="cbtn' + (cfg.shuffle ? " on" : "") + '" id="c-shuf">' + Icons.i("shuffle") + '</button><button class="cbtn" id="c-prev">' + Icons.i("prev") +
      '</button><button class="cbtn play" id="c-play">' + Icons.i(pl ? "pause" : "play") + '</button><button class="cbtn" id="c-next">' + Icons.i("next") +
      '</button><button class="cbtn' + (cfg.repeat !== "off" ? " on" : "") + '" id="c-rep">' + Icons.i(cfg.repeat === "one" ? "repeat1" : "repeat") + "</button></div>" +
      '<div class="volrow">' + Icons.i("vol") + '<input id="vol" type="range" min="0" max="100" value="' + Math.round(cfg.vol * 100) + '"></div></div>' +
      '<div class="add-row"><h3>Şarkılar</h3><label class="add-btn">' + Icons.i("plus") + 'Şarkı ekle<input id="file" type="file" accept="audio/*" multiple></label></div>' +
      '<div class="songs">' + rows + "</div>" +
      '<div class="empty-music">Telefonundaki müzikleri <b>Şarkı ekle</b> ile ekleyebilirsin.<br>Eklenen şarkılar uygulamada kalır.</div>';
    Bunny.mount(root);
    var vinyl = $(".vinyl", root);
    $("#c-play", root).onclick = function () { SFX.unlock(); toggle(); };
    $("#c-next", root).onclick = function () { next(); };
    $("#c-prev", root).onclick = function () { prev(); };
    $("#c-shuf", root).onclick = toggleShuffle;
    $("#c-rep", root).onclick = cycleRepeat;
    var sk = $("#seek", root), vo = $("#vol", root);
    sk.addEventListener("input", function () { seeking = true; sk.style.setProperty("--p", sk.value / 10 + "%"); if (isFinite(audio.duration)) $("#t-cur").textContent = fmt(sk.value / 1000 * audio.duration); });
    sk.addEventListener("change", function () { seekTo(sk.value / 1000); seeking = false; });
    vo.style.setProperty("--p", vo.value + "%");
    vo.addEventListener("input", function () { setVol(vo.value / 100); vo.style.setProperty("--p", vo.value + "%"); });
    $("#file", root).addEventListener("change", function (e) { addFiles(e.target.files).then(function () { try { e.target.value = ""; } catch (x) {} }); });
    Array.prototype.forEach.call(root.querySelectorAll(".song"), function (el) {
      el.addEventListener("click", function (e) {
        var d = e.target.closest ? e.target.closest("[data-del]") : null;
        if (d) { askRemove(d.getAttribute("data-del")); return; }
        SFX.unlock(); playIndex(+el.getAttribute("data-i"));
      });
    });
    if (vinyl) vinyl.className = "vinyl" + (pl ? " spin" : "");
    ui();
  }

  function renderMini() {
    var m = $("#miniplayer"); if (!m) return;
    var t = curTrack(), pl = isPlaying();
    m.innerHTML = cover(cur < 0 ? 0 : cur) + '<div class="mini-info" id="mini-go"><div class="mini-title">' + esc(t ? t.title : "") + '</div><div class="mini-bar"><i id="mini-prog"></i></div></div>' +
      '<button class="mini-btn" id="mini-prev">' + Icons.i("prev") + '</button><button class="mini-btn play" id="mini-play">' + Icons.i(pl ? "pause" : "play") +
      '</button><button class="mini-btn" id="mini-next">' + Icons.i("next") + "</button>";
    $("#mini-play").onclick = function () { SFX.unlock(); toggle(); };
    $("#mini-next").onclick = function () { next(); };
    $("#mini-prev").onclick = function () { prev(); };
    $("#mini-go").onclick = function () { App.show("music"); };
    syncMini();
  }
  function syncMini() {
    var m = $("#miniplayer"); if (!m) return;
    var show = cur >= 0 && !onScreen;
    m.classList.toggle("hidden", !show);
    if (window.App && App.relayout) App.relayout();
  }
  // yalnızca değişen kısımları güncelle (kaydırma çubuğu bozulmasın)
  function ui() {
    var d = audio.duration, c = audio.currentTime, f = isFinite(d) && d > 0 ? c / d : 0;
    var sk = $("#seek");
    if (sk && !seeking) { sk.value = Math.round(f * 1000); sk.style.setProperty("--p", f * 100 + "%"); }
    var a = $("#t-cur"), b = $("#t-dur");
    if (a && !seeking) a.textContent = fmt(c);
    if (b) b.textContent = fmt(isFinite(d) ? d : 0);
    var mp = $("#mini-prog"); if (mp) mp.style.width = f * 100 + "%";
  }
  function refresh() {
    if (onScreen) renderFull();
    renderMini();
  }

  function enter() { init(); onScreen = true; renderFull(); syncMini(); }
  function leave() { onScreen = false; syncMini(); }
  function pauseForMic() { if (isPlaying()) { micWas = true; audio.pause(); } }
  function resumeAfterMic() { if (micWas) { micWas = false; var p = audio.play(); if (p && p.catch) p.catch(function () {}); } }

  return {
    init: init, enter: enter, leave: leave, syncMini: syncMini, toggle: toggle, next: next, prev: prev,
    pauseForMic: pauseForMic, resumeAfterMic: resumeAfterMic, isPlaying: isPlaying, hasTrack: function () { return cur >= 0; },
    addFiles: addFiles, count: function () { return tracks.length; }, _tracks: function () { return tracks; }, _audio: audio
  };
})();
