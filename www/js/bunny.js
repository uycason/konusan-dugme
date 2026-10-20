// Tavşan çıkartmaları (SVG) ve süsler. Hepsi kodla çizilir, dış dosya yok.
// Kullanım: <span data-bunny="pose|prop|fur|face|tilt"></span>  (Bunny.mount çağrılınca çizilir)
//   pose: sit | peek    prop: none heart carrot letter phones controller flowers bow zzz
//   fur : white pink lav peach sky butter    face: happy smile sleep love cry wow wink
window.Bunny = (function () {
  var INK = "#b0707f";
  var DARK = "#4a2c3a";
  var CHEEK = "#f6a9bd";
  var EAR_IN = "#f9bccd";
  var FURS = { white: "#fffaf7", pink: "#fcdfe7", lav: "#ecdff8", peach: "#fce5d4", sky: "#dfecf9", butter: "#fff3c6" };

  function E(cx, cy, rx, ry, f, rot, opt) {
    var o = { t: "ellipse", f: f, s: INK, w: 2,
      a: 'cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '"' +
         (rot ? ' transform="rotate(' + rot[0] + " " + rot[1] + " " + rot[2] + ')"' : "") };
    if (opt) for (var k in opt) o[k] = opt[k];
    return o;
  }
  function P(d, f, s, w, opt) {
    var o = { t: "path", f: f, s: s || INK, w: w || 2, a: 'd="' + d + '"' };
    if (opt) for (var k in opt) o[k] = opt[k];
    return o;
  }
  function R(x, y, w, h, rx, f, s, sw) {
    return { t: "rect", f: f, s: s || INK, w: sw || 2, a: 'x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + rx + '"' };
  }
  function art(o) {
    return "<" + o.t + " " + o.a + ' fill="' + o.f + '" stroke="' + o.s + '" stroke-width="' + o.w + '" stroke-linejoin="round" stroke-linecap="round"/>';
  }
  function edge(o) {
    if (o.noedge) return "";
    return "<" + o.t + " " + o.a + ' fill="' + (o.f === "none" ? "none" : "#fff") + '" stroke="#fff" stroke-width="' + (o.w + 12) + '" stroke-linejoin="round" stroke-linecap="round"/>';
  }

  var HEART = "M0 10 C-14 0 -10 -10 -4 -9 C-1.5 -8.5 0 -6.5 0 -5 C0 -6.5 1.5 -8.5 4 -9 C10 -10 14 0 0 10 Z";
  function heart(x, y, s, f, st) {
    return P(HEART, f || "#ff86a8", st || "#d9507a", 1.6, { a: 'd="' + HEART + '" transform="translate(' + x + " " + y + ") scale(" + s + ')"' });
  }

  function bodyShapes(fur, pose) {
    var s = [];
    if (pose !== "peek") {
      s.push(E(60, 121, 27, 24, fur));
      s.push(E(44, 141, 12, 7, fur));
      s.push(E(76, 141, 12, 7, fur));
    }
    s.push(E(43, 36, 12.5, 31, fur, [-11, 47, 64]));
    s.push(E(77, 36, 12.5, 31, fur, [11, 73, 64]));
    s.push(E(43.6, 33, 6, 19, EAR_IN, [-11, 47, 64], { s: "none", w: 0, noedge: true }));
    s.push(E(76.4, 33, 6, 19, EAR_IN, [11, 73, 64], { s: "none", w: 0, noedge: true }));
    s.push(E(60, 82, 37, 31, fur));
    return s;
  }

  function eyes(face) {
    var L = 46, Rr = 74, y = 83, h = "";
    function dot(x, rx, ry) {
      return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + DARK + '"/>' +
        '<circle cx="' + (x - 1.2) + '" cy="' + (y - 1.7) + '" r="1.3" fill="#fff"/>';
    }
    function arc(x, up) {
      return '<path d="M' + (x - 5) + " " + (y + (up ? 1 : -1)) + " Q" + x + " " + (y + (up ? -6 : 6)) + " " + (x + 5) + " " + (y + (up ? 1 : -1)) +
        '" fill="none" stroke="' + DARK + '" stroke-width="2.6" stroke-linecap="round"/>';
    }
    function lv(x) {
      return '<path d="M' + x + " " + (y + 5) + " C" + (x - 8) + " " + (y - 1) + " " + (x - 5) + " " + (y - 6) + " " + (x - 2) + " " + (y - 5) +
        " C" + (x - 1) + " " + (y - 4.7) + " " + x + " " + (y - 3.6) + " " + x + " " + (y - 2.8) +
        " C" + x + " " + (y - 3.6) + " " + (x + 1) + " " + (y - 4.7) + " " + (x + 2) + " " + (y - 5) +
        " C" + (x + 5) + " " + (y - 6) + " " + (x + 8) + " " + (y - 1) + " " + x + " " + (y + 5) + ' Z" fill="#ff6f97"/>';
    }
    switch (face) {
      case "smile": h = arc(L, true) + arc(Rr, true); break;
      case "sleep": h = arc(L, false) + arc(Rr, false); break;
      case "love": h = lv(L) + lv(Rr); break;
      case "wow": h = dot(L, 4.2, 5.4) + dot(Rr, 4.2, 5.4); break;
      case "wink": h = arc(L, true) + dot(Rr, 3.4, 4.6); break;
      case "cry":
        h = arc(L, true) + arc(Rr, true) +
          '<path d="M41 90 Q37.5 95.5 41 98 Q44.5 95.5 41 90 Z" fill="#9fd6f5"/>' +
          '<path d="M79 90 Q75.5 95.5 79 98 Q82.5 95.5 79 90 Z" fill="#9fd6f5"/>';
        break;
      default: h = dot(L, 3.4, 4.6) + dot(Rr, 3.4, 4.6);
    }
    return h;
  }
  function mouth(face) {
    var nose = '<ellipse cx="60" cy="90" rx="3.2" ry="2.3" fill="#f08aa4"/>';
    if (face === "wow") return nose + '<ellipse cx="60" cy="97" rx="3.4" ry="4" fill="#c85a7a"/>';
    if (face === "cry") return nose + '<path d="M54 98 Q57 94.5 60 97 Q63 94.5 66 98" fill="none" stroke="' + DARK + '" stroke-width="1.8" stroke-linecap="round"/>';
    return nose + '<path d="M60 92.4 L60 95 M60 95 Q56.5 99.2 52.5 95.5 M60 95 Q63.5 99.2 67.5 95.5" fill="none" stroke="' + DARK + '" stroke-width="1.8" stroke-linecap="round"/>';
  }

  function paws(fur, y) { return [E(49, y, 5.8, 5.2, fur), E(71, y, 5.8, 5.2, fur)]; }

  function props(kind, fur, pose) {
    var s = [], extra = "";
    var peek = pose === "peek";
    switch (kind) {
      case "heart":
        s.push(E(46, 118, 7, 12, fur, [14, 46, 118]), E(74, 118, 7, 12, fur, [-14, 74, 118]));
        s.push(heart(60, 121, 1.15));
        s = s.concat(paws(fur, 114));
        break;
      case "carrot":
        s.push(E(56, 110, 3.4, 8, "#7fd19a", [-18, 56, 118]), E(60, 108, 3.4, 9, "#6fc78b"), E(64, 110, 3.4, 8, "#7fd19a", [18, 64, 118]));
        s.push(P("M52 114 L68 114 L61 144 Q60 146 59 144 Z", "#ffa45c", "#d9742f", 1.8));
        s = s.concat(paws(fur, 118));
        extra = '<path d="M55 123 L60 123 M58 131 L63 131" stroke="#e58b44" stroke-width="1.6" stroke-linecap="round"/>';
        break;
      case "letter":
        s.push(R(44, 108, 32, 22, 3, "#fffaf3", "#d98aa3", 1.8));
        s.push(heart(60, 122, 0.55));
        s = s.concat(paws(fur, 110));
        extra = '<path d="M44.5 109.5 L60 121 L75.5 109.5" fill="none" stroke="#d98aa3" stroke-width="1.6" stroke-linejoin="round"/>';
        break;
      case "phones":
        s.push(P("M27 80 C26 38 94 38 93 80", "none", "#f08aa7", 5, {}));
        s.push(E(27, 85, 6.5, 10.5, "#f6a1b8"), E(93, 85, 6.5, 10.5, "#f6a1b8"));
        break;
      case "controller":
        s.push(R(38, 112, 44, 22, 10, "#d3c0f0", "#9a7fc8", 1.8));
        s.push(P("M50 118 L50 128 M45 123 L55 123", "none", "#fff", 3));
        s.push(E(68, 120, 2.8, 2.8, "#ff9ebb", null, { s: "none", w: 0 }), E(75, 126, 2.8, 2.8, "#ffd66b", null, { s: "none", w: 0 }));
        s = s.concat([E(40, 116, 5.5, 5, fur), E(80, 116, 5.5, 5, fur)]);
        break;
      case "flowers":
        var cols = ["#ff9ebb", "#ffe08a", "#c9a8f0", "#9fe0c0", "#ff9ebb", "#ffe08a"];
        var pts = [[32, 70], [38, 60], [49, 54], [71, 54], [82, 60], [88, 70]];
        for (var i = 0; i < pts.length; i++) {
          s.push(E(pts[i][0], pts[i][1], 5.2, 5.2, cols[i], null, { s: "#ffffffaa", w: 1.5 }));
        }
        break;
      case "bow":
        s.push(P("M60 106 L44 97 Q41 109 44 115 Z", "#ff8fb1", "#d9507a", 1.6));
        s.push(P("M60 106 L76 97 Q79 109 76 115 Z", "#ff8fb1", "#d9507a", 1.6));
        s.push(E(60, 106, 4.6, 4.6, "#ff6f97", null, { s: "#d9507a", w: 1.4 }));
        break;
      case "zzz":
        extra = '<g font-family="Arial,Helvetica,sans-serif" font-weight="700" fill="#a98bd0">' +
          '<text x="90" y="56" font-size="20">z</text><text x="100" y="40" font-size="15">z</text><text x="107" y="27" font-size="11">z</text></g>';
        break;
    }
    if (peek && kind === "none") s = s.concat([E(38, 111, 8, 5.6, fur), E(82, 111, 8, 5.6, fur)]);
    return { shapes: s, extra: extra };
  }

  function svg(o) {
    o = o || {};
    var pose = o.pose || "sit";
    var fur = FURS[o.fur] || o.fur || FURS.white;
    var face = o.face || "happy";
    var body = bodyShapes(fur, pose);
    var pr = props(o.prop || "none", fur, pose);
    if (pose === "peek" && (!o.prop || o.prop === "none")) pr = props("none", fur, pose);
    var all = body.concat(pr.shapes);
    var i, g = "";
    for (i = 0; i < all.length; i++) g += edge(all[i]);
    var inner = "";
    for (i = 0; i < body.length; i++) inner += art(body[i]);
    if (pose !== "peek") inner += '<ellipse cx="60" cy="127" rx="15" ry="13" fill="#fff" opacity=".55"/>';
    inner += '<circle cx="36.5" cy="93" r="6.6" fill="' + CHEEK + '" opacity=".6"/><circle cx="83.5" cy="93" r="6.6" fill="' + CHEEK + '" opacity=".6"/>';
    inner += eyes(face) + mouth(face);
    for (i = 0; i < pr.shapes.length; i++) inner += art(pr.shapes[i]);
    inner += pr.extra;
    var vb = pose === "peek" ? "6 -5 108 125" : "6 -5 108 162";
    var tilt = o.tilt ? ' transform="rotate(' + o.tilt + ' 60 100)"' : "";
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" ' + (o.attrs || "") + ' aria-hidden="true"><g' + tilt + ">" + g + inner + "</g></svg>";
  }

  function url(o) { return 'url("data:image/svg+xml,' + encodeURIComponent(svg(o)) + '")'; }

  function mount(root) {
    var els = (root || document).querySelectorAll("[data-bunny]");
    for (var i = 0; i < els.length; i++) {
      var el = els[i], p = el.getAttribute("data-bunny").split("|");
      el.innerHTML = svg({ pose: p[0] || "sit", prop: p[1] || "none", fur: p[2] || "white", face: p[3] || "happy", tilt: +p[4] || 0 });
      el.removeAttribute("data-bunny");
      el.classList.add("stk");
    }
  }

  // Duvar kağıdı gibi tekrar eden minik tavşan / kalp deseni
  function pattern() {
    function head(x, y, r, s, c) {
      return '<g transform="translate(' + x + " " + y + ") rotate(" + r + ") scale(" + s + ')" fill="' + c + '">' +
        '<ellipse cx="-7" cy="-17" rx="4.6" ry="12"/><ellipse cx="7" cy="-17" rx="4.6" ry="12"/><ellipse cx="0" cy="0" rx="14" ry="11.5"/></g>';
    }
    function hrt(x, y, s, c, op) {
      return '<path d="' + HEART + '" transform="translate(' + x + " " + y + ") scale(" + s + ')" fill="' + c + '" opacity="' + op + '"/>';
    }
    function carrot(x, y, r, c) {
      return '<g transform="translate(' + x + " " + y + ") rotate(" + r + ')" fill="' + c + '"><path d="M-4 -8 L4 -8 L0 12 Z"/><ellipse cx="-2" cy="-10" rx="1.6" ry="4"/><ellipse cx="2" cy="-10" rx="1.6" ry="4"/></g>';
    }
    var s = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">' +
      head(44, 52, -8, 1.05, "#f7d1dc") + head(150, 112, 10, 0.9, "#f7d1dc") + head(58, 160, 6, 0.8, "#f9dbe4") +
      hrt(112, 40, 0.8, "#ffffff", 0.85) + hrt(172, 176, 0.9, "#ffffff", 0.85) + hrt(14, 112, 0.6, "#ffffff", 0.85) +
      hrt(104, 108, 0.5, "#f5b8c9", 0.5) + carrot(120, 160, 35, "#ffd8bf") + carrot(176, 36, -25, "#ffd8bf") +
      '<circle cx="90" cy="84" r="2.4" fill="#f9dbe4"/><circle cx="24" cy="30" r="2" fill="#f9dbe4"/><circle cx="188" cy="82" r="2.4" fill="#f9dbe4"/><circle cx="34" cy="190" r="2" fill="#f9dbe4"/>' +
      "</svg>";
    return 'url("data:image/svg+xml,' + encodeURIComponent(s) + '")';
  }

  return { svg: svg, url: url, mount: mount, pattern: pattern, FURS: FURS };
})();
