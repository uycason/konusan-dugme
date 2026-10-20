// Yerel bildirimler: "Düğme acıktı", "Umut seni çok özledi" vb.
// Uygulama her açıldığında önümüzdeki 7 gün için günde 4 rastgele bildirim planlar.
window.Notif = (function () {
  function plugin() {
    try { return window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications; } catch (e) { return null; }
  }
  function fill(t, S) {
    return t.replace(/\{isim\}/g, S.herName || "Sevgilim").replace(/\{sen\}/g, CONFIG.yourName || "Umut");
  }

  async function setup(S) {
    const LN = plugin();
    if (!LN) return; // tarayıcıda çalışıyorsa bildirim yok
    try {
      let p = await LN.checkPermissions();
      if (p.display !== "granted") p = await LN.requestPermissions();
      if (p.display !== "granted") return;

      try {
        await LN.createChannel({ id: "dugme", name: "Düğme", description: "Düğme'nin mesajları", importance: 4, visibility: 1, vibration: true });
      } catch (e) {}

      const pend = await LN.getPending();
      if (pend && pend.notifications && pend.notifications.length) await LN.cancel({ notifications: pend.notifications });

      const msgs = CONFIG.notifications;
      const slots = [[10, 13], [13, 16], [16, 19], [19, 22]];
      const list = [];
      let id = 1, last = "";
      const now = Date.now();
      for (let day = 0; day < 7; day++) {
        slots.forEach(function (s) {
          const d = new Date();
          d.setDate(d.getDate() + day);
          d.setHours(s[0] + Math.floor(Math.random() * (s[1] - s[0])), Math.floor(Math.random() * 60), 0, 0);
          if (d.getTime() < now + 60000) return;
          let m; do { m = msgs[Math.floor(Math.random() * msgs.length)]; } while (m === last && msgs.length > 1);
          last = m;
          list.push({
            id: id++, title: "Konuşan Düğme 🐾", body: fill(m, S),
            channelId: "dugme", schedule: { at: d, allowWhileIdle: true }
          });
        });
      }
      if (list.length) await LN.schedule({ notifications: list });
    } catch (e) { /* sessizce geç */ }
  }
  return { setup: setup };
})();
