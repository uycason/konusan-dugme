// Düğme'nin SVG çizimi + oda arka planı
window.CatArt = (function () {
  const FUR = "#1c1b26";
  const FUR2 = "#2a2938";

  function accessory(id) {
    switch (id) {
      case "bow":
        return '<g transform="translate(206 66) rotate(18)"><path d="M0 0 L-26 -16 L-26 16 Z" fill="#ff5c8a"/><path d="M0 0 L26 -16 L26 16 Z" fill="#ff5c8a"/><circle r="8" fill="#ff8fb1"/></g>';
      case "hat":
        return '<g><ellipse cx="150" cy="66" rx="62" ry="12" fill="#111"/><rect x="108" y="6" width="84" height="62" rx="6" fill="#161616"/><rect x="108" y="46" width="84" height="14" fill="#c0392b"/></g>';
      case "crown":
        return '<g><path d="M102 70 L108 22 L128 48 L150 14 L172 48 L192 22 L198 70 Z" fill="#ffd23f" stroke="#e0a800" stroke-width="3"/><circle cx="150" cy="30" r="5" fill="#ff5c8a"/><circle cx="116" cy="40" r="4" fill="#4fc3f7"/><circle cx="184" cy="40" r="4" fill="#4fc3f7"/></g>';
      case "glasses":
        return '<g><rect x="96" y="108" width="52" height="34" rx="12" fill="#0b0b10" stroke="#e8e8f0" stroke-width="4"/><rect x="152" y="108" width="52" height="34" rx="12" fill="#0b0b10" stroke="#e8e8f0" stroke-width="4"/><line x1="148" y1="122" x2="152" y2="122" stroke="#e8e8f0" stroke-width="4"/><path d="M104 116 L118 116" stroke="#6a6a88" stroke-width="3" stroke-linecap="round"/><path d="M160 116 L174 116" stroke="#6a6a88" stroke-width="3" stroke-linecap="round"/></g>';
      default:
        return "";
    }
  }

  function eyes(mood) {
    // yeşil-sarı gözler
    const open =
      '<g class="eyes">' +
      '<ellipse cx="120" cy="124" rx="18" ry="21" fill="#f2d334"/><ellipse cx="120" cy="124" rx="5.5" ry="16" fill="#101014"/><circle cx="114" cy="115" r="4.5" fill="#fff"/>' +
      '<ellipse cx="180" cy="124" rx="18" ry="21" fill="#f2d334"/><ellipse cx="180" cy="124" rx="5.5" ry="16" fill="#101014"/><circle cx="174" cy="115" r="4.5" fill="#fff"/>' +
      "</g>";
    const happy =
      '<path d="M100 130 Q120 106 140 130" stroke="#f2d334" stroke-width="8" fill="none" stroke-linecap="round"/>' +
      '<path d="M160 130 Q180 106 200 130" stroke="#f2d334" stroke-width="8" fill="none" stroke-linecap="round"/>';
    const sleep =
      '<path d="M102 128 Q120 140 138 128" stroke="#f2d334" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M162 128 Q180 140 198 128" stroke="#f2d334" stroke-width="7" fill="none" stroke-linecap="round"/>';
    const sad =
      open +
      '<path d="M98 100 L140 110" stroke="' + FUR + '" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M202 100 L160 110" stroke="' + FUR + '" stroke-width="9" stroke-linecap="round"/>';
    if (mood === "happy") return happy;
    if (mood === "sleep") return sleep;
    if (mood === "sad") return sad;
    return open;
  }

  function mouth(mood, talking) {
    if (talking || mood === "eat") {
      return '<g class="mouth-open"><ellipse cx="150" cy="172" rx="13" ry="11" fill="#6e1a39"/><ellipse cx="150" cy="179" rx="8" ry="5" fill="#ff7b9c"/></g>';
    }
    if (mood === "sad") {
      return '<path d="M150 160 Q138 150 126 162 M150 160 Q162 150 174 162" stroke="#8d8da3" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
    }
    return '<path d="M150 158 Q140 172 128 164 M150 158 Q160 172 172 164" stroke="#8d8da3" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
  }

  // mood: normal | happy | sleep | sad | eat ; opts: {talking, acc}
  function cat(mood, opts) {
    opts = opts || {};
    const blush = mood === "happy" ? '<circle cx="98" cy="152" r="11" fill="#ff7b9c" opacity=".35"/><circle cx="202" cy="152" r="11" fill="#ff7b9c" opacity=".35"/>' : "";
    return (
      '<svg class="cat-svg" viewBox="0 0 300 350" xmlns="http://www.w3.org/2000/svg" aria-label="Düğme">' +
      // kuyruk
      '<g class="tail"><path d="M218 275 C282 272 296 214 266 178" stroke="' + FUR + '" stroke-width="24" fill="none" stroke-linecap="round"/></g>' +
      '<g class="body">' +
      // vücut
      '<ellipse cx="150" cy="262" rx="78" ry="72" fill="' + FUR + '"/>' +
      '<ellipse cx="150" cy="276" rx="48" ry="52" fill="' + FUR2 + '"/>' +
      // ön patiler
      '<rect x="104" y="272" width="40" height="52" rx="20" fill="' + FUR + '"/><rect x="156" y="272" width="40" height="52" rx="20" fill="' + FUR + '"/>' +
      '<ellipse cx="124" cy="326" rx="25" ry="15" fill="' + FUR + '"/><ellipse cx="176" cy="326" rx="25" ry="15" fill="' + FUR + '"/>' +
      '<circle cx="114" cy="328" r="3" fill="#ff8fa3" opacity=".8"/><circle cx="124" cy="331" r="3" fill="#ff8fa3" opacity=".8"/><circle cx="134" cy="328" r="3" fill="#ff8fa3" opacity=".8"/>' +
      '<circle cx="166" cy="328" r="3" fill="#ff8fa3" opacity=".8"/><circle cx="176" cy="331" r="3" fill="#ff8fa3" opacity=".8"/><circle cx="186" cy="328" r="3" fill="#ff8fa3" opacity=".8"/>' +
      "</g>" +
      '<g class="head">' +
      // kulaklar
      '<polygon points="88,92 80,24 138,64" fill="' + FUR + '"/><polygon points="212,92 220,24 162,64" fill="' + FUR + '"/>' +
      '<polygon points="96,78 92,44 124,66" fill="#ff8fa3" opacity=".75"/><polygon points="204,78 208,44 176,66" fill="#ff8fa3" opacity=".75"/>' +
      // kafa
      '<ellipse cx="150" cy="130" rx="76" ry="68" fill="' + FUR + '"/>' +
      blush +
      eyes(mood) +
      // burun
      '<path d="M142 147 H158 L150 158 Z" fill="#ff8fa3"/>' +
      mouth(mood, opts.talking) +
      // bıyıklar
      '<g stroke="#9a9ab0" stroke-width="2.2" stroke-linecap="round" fill="none">' +
      '<path d="M112 156 L52 146"/><path d="M112 164 L50 168"/><path d="M114 172 L58 190"/>' +
      '<path d="M188 156 L248 146"/><path d="M188 164 L250 168"/><path d="M186 172 L242 190"/></g>' +
      accessory(opts.acc) +
      "</g>" +
      // tasma + düğme (adı Düğme!)
      '<path d="M96 206 Q150 232 204 206" stroke="#e03a5e" stroke-width="13" fill="none" stroke-linecap="round"/>' +
      '<circle cx="150" cy="224" r="13" fill="#fff6e0" stroke="#d9c38c" stroke-width="2"/>' +
      '<circle cx="146" cy="220" r="2.2" fill="#8a7440"/><circle cx="154" cy="220" r="2.2" fill="#8a7440"/><circle cx="146" cy="228" r="2.2" fill="#8a7440"/><circle cx="154" cy="228" r="2.2" fill="#8a7440"/>' +
      "</svg>"
    );
  }

  // Oda arka planı. hour: 0-23
  function room(hour) {
    const night = hour >= 20 || hour < 6;
    const dusk = (hour >= 18 && hour < 20) || (hour >= 6 && hour < 8);
    const sky = night ? ["#0f1233", "#26306b"] : dusk ? ["#ff9a8b", "#ffd3a5"] : ["#7fd0ff", "#d6f1ff"];
    const celestial = night
      ? '<circle cx="268" cy="86" r="18" fill="#fff6c8"/><circle cx="276" cy="80" r="16" fill="' + sky[0] + '"/><circle cx="232" cy="70" r="2" fill="#fff"/><circle cx="296" cy="120" r="2" fill="#fff"/><circle cx="244" cy="118" r="1.6" fill="#fff"/>'
      : '<circle cx="268" cy="90" r="20" fill="#ffe066"/><g fill="#fff" opacity=".9"><ellipse cx="240" cy="116" rx="20" ry="8"/><ellipse cx="256" cy="110" rx="14" ry="8"/></g>';
    return (
      '<svg class="room-svg" viewBox="0 0 360 560" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      "<defs>" +
      '<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + (night ? "#3a2a5e" : "#f3c6d8") + '"/><stop offset="1" stop-color="' + (night ? "#2a1f47" : "#e9a9c2") + '"/></linearGradient>' +
      '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + sky[0] + '"/><stop offset="1" stop-color="' + sky[1] + '"/></linearGradient>' +
      "</defs>" +
      '<rect width="360" height="560" fill="url(#wall)"/>' +
      // duvar kağıdı noktaları
      '<g fill="#fff" opacity=".07">' + (function () { let s = ""; for (let y = 20; y < 400; y += 40) for (let x = (y / 40) % 2 ? 20 : 0; x < 380; x += 40) s += '<circle cx="' + x + '" cy="' + y + '" r="5"/>'; return s; })() + "</g>" +
      // pencere
      '<rect x="196" y="44" width="132" height="150" rx="10" fill="#fff" opacity=".9"/>' +
      '<rect x="204" y="52" width="116" height="134" rx="6" fill="url(#sky)"/>' +
      celestial +
      '<rect x="258" y="52" width="6" height="134" fill="#fff"/><rect x="204" y="116" width="116" height="6" fill="#fff"/>' +
      '<path d="M188 40 Q214 120 192 200" stroke="#ff7aa8" stroke-width="16" fill="none" opacity=".8"/>' +
      // tablo
      '<rect x="40" y="70" width="104" height="82" rx="6" fill="#7a4b2a"/><rect x="48" y="78" width="88" height="66" rx="3" fill="#fff6e0"/>' +
      '<path d="M92 128 C70 112 70 94 82 94 C88 94 92 98 92 102 C92 98 96 94 102 94 C114 94 114 112 92 128 Z" fill="#ff5c8a"/>' +
      // raf + bitki
      '<rect x="30" y="228" width="120" height="9" rx="3" fill="#7a4b2a"/>' +
      '<rect x="58" y="200" width="22" height="28" rx="4" fill="#c97a4a"/><path d="M69 200 C50 180 56 166 69 186 C70 168 86 168 78 200" fill="#3fa86b"/>' +
      '<g transform="translate(100 205)"><rect width="30" height="23" rx="3" fill="#ffd23f"/><text x="15" y="17" text-anchor="middle" font-size="14">🐟</text></g>' +
      // zemin
      '<rect y="396" width="360" height="164" fill="' + (night ? "#4a3322" : "#c98f5b") + '"/>' +
      '<g stroke="#000" opacity=".12">' + (function () { let s = ""; for (let y = 396; y < 560; y += 28) s += '<line x1="0" y1="' + y + '" x2="360" y2="' + y + '"/>'; for (let x = 0; x < 360; x += 60) s += '<line x1="' + x + '" y1="396" x2="' + (x - 20) + '" y2="560"/>'; return s; })() + "</g>" +
      '<rect y="390" width="360" height="12" fill="' + (night ? "#e9d6e8" : "#fff") + '" opacity=".85"/>' +
      // halı
      '<ellipse cx="180" cy="500" rx="150" ry="42" fill="#ff7aa8" opacity=".85"/><ellipse cx="180" cy="500" rx="118" ry="30" fill="#ffd1e0" opacity=".7"/>' +
      // yumak
      '<g transform="translate(300 492)"><circle r="16" fill="#4fc3f7"/><path d="M-12 -6 Q0 4 12 -8 M-14 2 Q0 12 14 0 M-8 10 Q2 14 10 8" stroke="#1f8fc4" stroke-width="2" fill="none"/></g>' +
      "</svg>"
    );
  }

  return { cat: cat, room: room };
})();
