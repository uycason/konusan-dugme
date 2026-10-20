// Düğme'nin SVG çizimi + pastel pembe oda
window.CatArt = (function () {
  var FUR = "#1c1b26";
  var FUR2 = "#2a2938";

  function accessory(id) {
    switch (id) {
      case "bow":
        return '<g transform="translate(206 66) rotate(18)"><path d="M0 0 L-26 -16 L-26 16 Z" fill="#ff5c8a"/><path d="M0 0 L26 -16 L26 16 Z" fill="#ff5c8a"/><circle r="8" fill="#ff8fb1"/></g>';
      case "hat":
        return '<g><ellipse cx="150" cy="66" rx="62" ry="12" fill="#111"/><rect x="108" y="6" width="84" height="62" rx="6" fill="#161616"/><rect x="108" y="46" width="84" height="14" fill="#f06a8d"/></g>';
      case "crown":
        return '<g><path d="M102 70 L108 22 L128 48 L150 14 L172 48 L192 22 L198 70 Z" fill="#ffd23f" stroke="#e0a800" stroke-width="3"/><circle cx="150" cy="30" r="5" fill="#ff5c8a"/><circle cx="116" cy="40" r="4" fill="#4fc3f7"/><circle cx="184" cy="40" r="4" fill="#4fc3f7"/></g>';
      case "glasses":
        return '<g><rect x="96" y="108" width="52" height="34" rx="12" fill="#0b0b10" stroke="#e8e8f0" stroke-width="4"/><rect x="152" y="108" width="52" height="34" rx="12" fill="#0b0b10" stroke="#e8e8f0" stroke-width="4"/><line x1="148" y1="122" x2="152" y2="122" stroke="#e8e8f0" stroke-width="4"/><path d="M104 116 L118 116" stroke="#6a6a88" stroke-width="3" stroke-linecap="round"/><path d="M160 116 L174 116" stroke="#6a6a88" stroke-width="3" stroke-linecap="round"/></g>';
      default:
        return "";
    }
  }

  function eyes(mood) {
    var open =
      '<g class="eyes">' +
      '<ellipse cx="120" cy="124" rx="18" ry="21" fill="#f2d334"/><ellipse cx="120" cy="124" rx="5.5" ry="16" fill="#101014"/><circle cx="114" cy="115" r="4.5" fill="#fff"/>' +
      '<ellipse cx="180" cy="124" rx="18" ry="21" fill="#f2d334"/><ellipse cx="180" cy="124" rx="5.5" ry="16" fill="#101014"/><circle cx="174" cy="115" r="4.5" fill="#fff"/>' +
      "</g>";
    var happy =
      '<path d="M100 130 Q120 106 140 130" stroke="#f2d334" stroke-width="8" fill="none" stroke-linecap="round"/>' +
      '<path d="M160 130 Q180 106 200 130" stroke="#f2d334" stroke-width="8" fill="none" stroke-linecap="round"/>';
    var sleep =
      '<path d="M102 128 Q120 140 138 128" stroke="#f2d334" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M162 128 Q180 140 198 128" stroke="#f2d334" stroke-width="7" fill="none" stroke-linecap="round"/>';
    var sad =
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
    var blush = mood === "happy" ? '<circle cx="98" cy="152" r="11" fill="#ff7b9c" opacity=".35"/><circle cx="202" cy="152" r="11" fill="#ff7b9c" opacity=".35"/>' : "";
    return (
      '<svg class="cat-svg" viewBox="0 0 300 350" xmlns="http://www.w3.org/2000/svg" aria-label="Düğme">' +
      '<g class="tail"><path d="M218 275 C282 272 296 214 266 178" stroke="' + FUR + '" stroke-width="24" fill="none" stroke-linecap="round"/></g>' +
      '<g class="body">' +
      '<ellipse cx="150" cy="262" rx="78" ry="72" fill="' + FUR + '"/>' +
      '<ellipse cx="150" cy="276" rx="48" ry="52" fill="' + FUR2 + '"/>' +
      '<rect x="104" y="272" width="40" height="52" rx="20" fill="' + FUR + '"/><rect x="156" y="272" width="40" height="52" rx="20" fill="' + FUR + '"/>' +
      '<ellipse cx="124" cy="326" rx="25" ry="15" fill="' + FUR + '"/><ellipse cx="176" cy="326" rx="25" ry="15" fill="' + FUR + '"/>' +
      '<circle cx="114" cy="328" r="3" fill="#ff8fa3" opacity=".8"/><circle cx="124" cy="331" r="3" fill="#ff8fa3" opacity=".8"/><circle cx="134" cy="328" r="3" fill="#ff8fa3" opacity=".8"/>' +
      '<circle cx="166" cy="328" r="3" fill="#ff8fa3" opacity=".8"/><circle cx="176" cy="331" r="3" fill="#ff8fa3" opacity=".8"/><circle cx="186" cy="328" r="3" fill="#ff8fa3" opacity=".8"/>' +
      "</g>" +
      '<g class="head">' +
      '<polygon points="88,92 80,24 138,64" fill="' + FUR + '"/><polygon points="212,92 220,24 162,64" fill="' + FUR + '"/>' +
      '<polygon points="96,78 92,44 124,66" fill="#ff8fa3" opacity=".75"/><polygon points="204,78 208,44 176,66" fill="#ff8fa3" opacity=".75"/>' +
      '<ellipse cx="150" cy="130" rx="76" ry="68" fill="' + FUR + '"/>' +
      blush +
      eyes(mood) +
      '<path d="M142 147 H158 L150 158 Z" fill="#ff8fa3"/>' +
      mouth(mood, opts.talking) +
      '<g stroke="#9a9ab0" stroke-width="2.2" stroke-linecap="round" fill="none">' +
      '<path d="M112 156 L52 146"/><path d="M112 164 L50 168"/><path d="M114 172 L58 190"/>' +
      '<path d="M188 156 L248 146"/><path d="M188 164 L250 168"/><path d="M186 172 L242 190"/></g>' +
      accessory(opts.acc) +
      "</g>" +
      '<path d="M96 206 Q150 232 204 206" stroke="#e03a5e" stroke-width="13" fill="none" stroke-linecap="round"/>' +
      '<circle cx="150" cy="224" r="13" fill="#fff6e0" stroke="#d9c38c" stroke-width="2"/>' +
      '<circle cx="146" cy="220" r="2.2" fill="#8a7440"/><circle cx="154" cy="220" r="2.2" fill="#8a7440"/><circle cx="146" cy="228" r="2.2" fill="#8a7440"/><circle cx="154" cy="228" r="2.2" fill="#8a7440"/>' +
      "</svg>"
    );
  }

  function nested(o, x, y, w) {
    o.attrs = 'x="' + x + '" y="' + y + '" width="' + w + '" height="' + Math.round(w * 1.5) + '"';
    return Bunny.svg(o);
  }

  // Pastel oda. hour: 0-23
  function room(hour) {
    var night = hour >= 20 || hour < 6;
    var dusk = (hour >= 18 && hour < 20) || (hour >= 6 && hour < 8);
    var wall = night ? ["#c993ae", "#b57f9b"] : dusk ? ["#f8c6cf", "#f1adbb"] : ["#fad2dd", "#f4bccd"];
    var sky = night ? ["#5b66a8", "#2b3270"] : dusk ? ["#ffc4b8", "#ffe6cf"] : ["#c4e8fa", "#f2fbff"];
    var wains = night ? "#e8cddb" : "#fff1f5";
    var floor = night ? "#d6ab93" : "#f8dcc4";
    var plank = night ? "#bf9078" : "#e9bfa2";
    var celestial = night
      ? '<circle cx="276" cy="92" r="18" fill="#fff6c8"/><circle cx="285" cy="86" r="16" fill="' + sky[0] + '"/><circle cx="232" cy="76" r="2" fill="#fff"/><circle cx="300" cy="124" r="2" fill="#fff"/><circle cx="244" cy="130" r="1.6" fill="#fff"/><circle cx="222" cy="108" r="1.6" fill="#fff"/>'
      : '<circle cx="272" cy="92" r="20" fill="#ffe27a"/><g fill="#fff"><ellipse cx="236" cy="124" rx="22" ry="9"/><ellipse cx="254" cy="117" rx="15" ry="9"/><ellipse cx="300" cy="152" rx="16" ry="7"/></g>';
    var flags = "", fc = ["#ff9ebb", "#ffe08a", "#c9a8f0", "#9fe0c0", "#8fd3f4"];
    for (var i = 0; i < 9; i++) {
      var fx = 20 + i * 40, fy = 22 + Math.sin(i / 8 * Math.PI) * 10;
      flags += '<path d="M' + (fx - 11) + " " + fy + " L" + (fx + 11) + " " + fy + " L" + fx + " " + (fy + 22) + ' Z" fill="' + fc[i % 5] + '" opacity=".95"/>';
    }
    var planks = "";
    for (var y = 392; y < 560; y += 28) planks += '<line x1="0" y1="' + y + '" x2="360" y2="' + y + '"/>';
    for (var x = 0; x < 360; x += 60) planks += '<line x1="' + x + '" y1="392" x2="' + (x - 20) + '" y2="560"/>';

    return (
      '<svg class="room-svg" viewBox="0 0 360 560" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      "<defs>" +
      '<linearGradient id="rwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + wall[0] + '"/><stop offset="1" stop-color="' + wall[1] + '"/></linearGradient>' +
      '<linearGradient id="rsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + sky[0] + '"/><stop offset="1" stop-color="' + sky[1] + '"/></linearGradient>' +
      '<pattern id="rpat" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M12 17 C5 12 7 6 11 7 C12 7.2 12 8 12 8.6 C12 8 12.4 7.2 13.5 7 C17 6 19 12 12 17 Z" fill="#fff" opacity=".4"/><circle cx="36" cy="34" r="2.2" fill="#fff" opacity=".4"/><circle cx="30" cy="12" r="1.4" fill="#fff" opacity=".3"/></pattern>' +
      "</defs>" +
      '<rect width="360" height="560" fill="url(#rwall)"/>' +
      '<rect width="360" height="392" fill="url(#rpat)"/>' +
      '<path d="M-5 22 Q180 56 365 22" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>' + flags +
      // pencere
      '<rect x="196" y="52" width="132" height="150" rx="14" fill="#fff"/>' +
      '<rect x="204" y="60" width="116" height="134" rx="8" fill="url(#rsky)"/>' + celestial +
      '<rect x="258" y="60" width="6" height="134" fill="#fff"/><rect x="204" y="124" width="116" height="6" fill="#fff"/>' +
      '<path d="M190 48 Q214 128 192 208 L212 208 Q222 128 208 48 Z" fill="#f7a8c0"/><path d="M334 48 Q312 128 332 208 L312 208 Q302 128 316 48 Z" fill="#f7a8c0"/>' +
      '<path d="M200 130 Q196 130 192 134" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>' +
      // çerçeve: kalpli tavşan
      '<rect x="34" y="78" width="112" height="92" rx="10" fill="#fff"/><rect x="42" y="86" width="96" height="76" rx="6" fill="#fff4f6"/>' +
      nested({ pose: "sit", prop: "heart", fur: "pink", face: "love" }, 62, 84, 54) +
      // raf
      '<rect x="26" y="240" width="130" height="10" rx="4" fill="#e9b9a3"/><path d="M34 250 V262 M148 250 V262" stroke="#e9b9a3" stroke-width="5"/>' +
      '<rect x="40" y="214" width="24" height="26" rx="5" fill="#f2a98c"/><path d="M52 214 C34 192 40 178 52 198 C54 178 70 178 62 214" fill="#7fd19a"/>' +
      '<rect x="116" y="222" width="12" height="18" rx="2" fill="#c9a8f0"/><rect x="128" y="226" width="10" height="14" rx="2" fill="#ffd0e0"/>' +
      nested({ pose: "sit", prop: "carrot", fur: "white", face: "smile" }, 76, 174, 40) +
      // lambri
      '<rect y="326" width="360" height="66" fill="' + wains + '"/><rect y="322" width="360" height="8" fill="#fff" opacity=".9"/>' +
      '<g stroke="#f0c4d1" stroke-width="2" opacity=".6"><line x1="60" y1="330" x2="60" y2="392"/><line x1="120" y1="330" x2="120" y2="392"/><line x1="180" y1="330" x2="180" y2="392"/><line x1="240" y1="330" x2="240" y2="392"/><line x1="300" y1="330" x2="300" y2="392"/></g>' +
      // zemin
      '<rect y="392" width="360" height="168" fill="' + floor + '"/><g stroke="' + plank + '" stroke-width="2" opacity=".8">' + planks + "</g>" +
      '<rect y="388" width="360" height="10" fill="#fff" opacity=".95"/>' +
      // halı
      '<ellipse cx="180" cy="498" rx="170" ry="48" fill="#f3a3bb"/><ellipse cx="180" cy="498" rx="140" ry="36" fill="#fbd0dc"/><ellipse cx="180" cy="498" rx="104" ry="25" fill="#f8b9cb" opacity=".7"/>' +
      '<g fill="#fff" opacity=".7"><circle cx="40" cy="498" r="3"/><circle cx="320" cy="498" r="3"/><circle cx="76" cy="472" r="3"/><circle cx="284" cy="472" r="3"/><circle cx="76" cy="524" r="3"/><circle cx="284" cy="524" r="3"/></g>' +
      // yumak ve peluş tavşan
      '<g transform="translate(306 494)"><circle r="17" fill="#cbb6f0"/><path d="M-13 -6 Q0 5 13 -9 M-15 3 Q0 14 15 1 M-9 11 Q2 15 11 9" stroke="#9a7fc8" stroke-width="2" fill="none"/></g>' +
      nested({ pose: "sit", prop: "bow", fur: "pink", face: "happy" }, 12, 436, 48) +
      "</svg>"
    );
  }

  return { cat: cat, room: room };
})();
