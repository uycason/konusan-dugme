// Emoji yerine kodla çizilen ikonlar. Bazı telefonlarda yeni emojiler "kutu" (□) görünüyordu,
// bu ikonlar her telefonda aynı görünür. <i data-ic="fish"></i> yazınca Icons.mount çizer.
window.Icons = (function () {
  var O = "#9c6074";
  function g(body) {
    return '<g stroke="' + O + '" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">' + body + "</g>";
  }
  var HRT = "M24 41 C6 28 10 10 20 11 C22.5 11.3 24 13.5 24 15 C24 13.5 25.5 11.3 28 11 C38 10 42 28 24 41 Z";

  var C = {
    coin: g('<circle cx="24" cy="24" r="18" fill="#ffd966"/><circle cx="24" cy="24" r="12" fill="#ffe99f" stroke-width="1.6"/>' +
      '<path d="M24 31.5 C15.5 25 18 18.5 22 19.2 C23.2 19.4 24 20.6 24 21.6 C24 20.6 24.8 19.4 26 19.2 C30 18.5 32.5 25 24 31.5 Z" fill="#ff9ebb" stroke-width="1.4"/>'),
    heart: g('<path d="' + HRT + '" fill="#ff8fb1"/><path d="M14.5 17 Q15.5 14 19 14" stroke="#fff" fill="none" opacity=".8"/>'),
    drum: g('<path d="M29 29 L40 40" stroke-width="8"/><path d="M29 29 L40 40" stroke="#fff6ea" stroke-width="4"/>' +
      '<circle cx="41.5" cy="37" r="3.6" fill="#fff6ea"/><circle cx="37" cy="41.5" r="3.6" fill="#fff6ea"/>' +
      '<ellipse cx="19" cy="19" rx="14" ry="11" transform="rotate(-45 19 19)" fill="#f4a261"/><path d="M11 15 Q13 11 18 10.5" stroke="#fff" fill="none" opacity=".7"/>'),
    bolt: g('<path d="M28 4 L11 27 H22 L19 44 L37 20 H26 Z" fill="#ffd54f"/>'),
    moon: g('<path d="M31 5 C19 7 13 19 17 30 C21 41 33 45 42 37 C30 39 22 29 26 17 C27.4 12.5 29.5 8 31 5 Z" fill="#d7c6f5"/>' +
      '<circle cx="38" cy="13" r="2" fill="#ffe07a" stroke="none"/><circle cx="43" cy="22" r="1.5" fill="#ffe07a" stroke="none"/>'),
    sun: g('<circle cx="24" cy="24" r="9" fill="#ffd966"/><path d="M24 5 V11 M24 37 V43 M5 24 H11 M37 24 H43 M10.5 10.5 L14.5 14.5 M33.5 33.5 L37.5 37.5 M37.5 10.5 L33.5 14.5 M14.5 33.5 L10.5 37.5" stroke="#f5b942" stroke-width="3.2" fill="none"/>'),
    mic: g('<rect x="17" y="5" width="14" height="25" rx="7" fill="#ffb3c6"/><path d="M11 22 Q11 36 24 36 Q37 36 37 22" fill="none"/><path d="M24 36 V43 M17 43 H31" fill="none"/><path d="M21 12 H27 M21 17 H27" stroke-width="1.6" fill="none" opacity=".6"/>'),
    mail: g('<rect x="5" y="11" width="38" height="27" rx="5" fill="#fff7ef"/><path d="M6.5 13.5 L24 27 L41.5 13.5" fill="none"/>' +
      '<path d="M24 36 C19 32 20.5 28.5 22.8 29 C23.5 29.2 24 29.9 24 30.5 C24 29.9 24.5 29.2 25.2 29 C27.5 28.5 29 32 24 36 Z" fill="#ff8fb1" stroke-width="1.2"/>'),
    home: g('<path d="M10 24 V40 Q10 42 12 42 H36 Q38 42 38 40 V24" fill="#fff2f5"/><rect x="20" y="30" width="9" height="12" rx="2" fill="#f6b8c9"/><path d="M4 25 L24 7 L44 25 Z" fill="#f4a4b8"/>'),
    fridge: g('<rect x="11" y="4" width="26" height="40" rx="6" fill="#e6f5f8"/><path d="M11 18 H37" fill="none"/><path d="M31 9 V14 M31 23 V31" fill="none" stroke-width="3"/>' +
      '<path d="M19 34 C14.5 31 15.8 28 17.8 28.4 C18.5 28.6 19 29.2 19 29.8 C19 29.2 19.5 28.6 20.2 28.4 C22.2 28 23.5 31 19 34 Z" fill="#ff8fb1" stroke-width="1.2"/>'),
    pad: g('<path d="M10 17 H38 Q44 17 45 26 L45 33 Q45 38 40 38 Q36 38 33 34 H15 Q12 38 8 38 Q3 38 3 33 L3 26 Q4 17 10 17 Z" fill="#d9c6f3"/>' +
      '<path d="M14 23 V31 M10 27 H18" stroke="#fff" stroke-width="3" fill="none"/><circle cx="32" cy="24" r="2.8" fill="#ff9ebb" stroke-width="1.4"/><circle cx="38" cy="29" r="2.8" fill="#ffd66b" stroke-width="1.4"/>'),
    note: g('<path d="M17 36 V12 L38 8 V32" fill="none" stroke-width="3"/><path d="M17 14 L38 10" stroke-width="5" fill="none"/>' +
      '<ellipse cx="12.5" cy="36" rx="6" ry="4.6" fill="#f59ab5"/><ellipse cx="33.5" cy="32" rx="6" ry="4.6" fill="#f59ab5"/>'),
    glove: g('<path d="M12 24 C7 24 6 31 10 33 C12 34 14 32 15 30" fill="#ff8fa8"/><path d="M12 22 C10 10 20 6 28 8 C38 10 40 20 38 28 C37 33 33 35 28 35 H19 C14 35 12 30 12 22 Z" fill="#ff8fa8"/>' +
      '<rect x="14" y="35" width="22" height="9" rx="3.5" fill="#fff3f5"/><path d="M22 15 Q30 12 33 18" stroke="#fff" fill="none" opacity=".6"/>'),
    cart: g('<path d="M11.5 14 H43 L38 31 H15 Z" fill="#fde4ea"/><path d="M4 8 H10 L15 31 H38" fill="none"/><circle cx="19" cy="39" r="3.6" fill="#f6b8c9"/><circle cx="35" cy="39" r="3.6" fill="#f6b8c9"/><path d="M22 20 V26 M29 20 V26 M36 20 V26" stroke-width="1.6" fill="none" opacity=".5"/>'),
    paw: g('<ellipse cx="24" cy="31" rx="10" ry="8.5" fill="#f6a1b8"/><ellipse cx="11" cy="21" rx="4.2" ry="5.4" transform="rotate(-20 11 21)" fill="#f6a1b8"/><ellipse cx="19.5" cy="13" rx="4.2" ry="5.6" fill="#f6a1b8"/><ellipse cx="28.5" cy="13" rx="4.2" ry="5.6" fill="#f6a1b8"/><ellipse cx="37" cy="21" rx="4.2" ry="5.4" transform="rotate(20 37 21)" fill="#f6a1b8"/>'),
    star: g('<path d="M24 5 L29.5 17.5 L43 19 L33 28.5 L35.8 42 L24 35.2 L12.2 42 L15 28.5 L5 19 L18.5 17.5 Z" fill="#ffd966"/>'),
    clock: g('<circle cx="24" cy="25" r="17" fill="#fff7ef"/><path d="M24 14 V25 L31 29" fill="none" stroke-width="3"/><path d="M19 5 H29" stroke-width="3.5" fill="none"/>'),
    fish: g('<path d="M35 24 L45 14 V34 Z" fill="#74c3ea"/><ellipse cx="22" cy="24" rx="16" ry="11" fill="#9bdcf7"/><path d="M18 14.5 Q23 8 29 14.5" fill="#74c3ea"/>' +
      '<circle cx="13.5" cy="21.5" r="2.2" fill="#4a2c3a" stroke="none"/><path d="M27 16.5 Q30 24 27 31.5 M21 15.5 Q24 24 21 32.5" fill="none" stroke-width="1.5" opacity=".5"/>'),
    milk: g('<path d="M12 7 H36 L32.5 42 H15.5 Z" fill="#eaf6fb"/><path d="M13.3 19 H34.7 L32.5 42 H15.5 Z" fill="#fffdf8" stroke="none"/><path d="M12 7 H36 L32.5 42 H15.5 Z" fill="none"/>' +
      '<path d="M24 36 C19 32 20.5 28.5 22.8 29 C23.5 29.2 24 29.9 24 30.5 C24 29.9 24.5 29.2 25.2 29 C27.5 28.5 29 32 24 36 Z" fill="#ff9ebb" stroke="none"/>'),
    cake: g('<rect x="8" y="26" width="32" height="15" rx="3.5" fill="#ffe3ea"/><path d="M8 27 Q12 20 16 27 Q20 20 24 27 Q28 20 32 27 Q36 20 40 27" fill="#fff"/>' +
      '<circle cx="24" cy="15" r="5" fill="#ff6f8f"/><path d="M24 10 Q25 6 28 5" fill="none" stroke-width="2"/><path d="M15 35 H33" stroke-width="1.6" fill="none" opacity=".5"/>'),
    sushi: g('<ellipse cx="24" cy="31" rx="17" ry="9" fill="#fff"/><path d="M7 27 Q24 12 41 27 Q24 33 7 27 Z" fill="#ff8e8e"/><path d="M16 22 Q18 27 16 30 M24 20 Q26 26 24 31 M32 22 Q34 27 32 30" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>'),
    cheese: g('<path d="M4 31 L43 21 V37 Q43 39 41 39 H6 Q4 39 4 37 Z" fill="#ffd966"/><path d="M4 31 L26 11 Q27.5 9.7 29 11 L43 21 Z" fill="#ffe58f"/>' +
      '<circle cx="15" cy="34" r="2.8" fill="#f7c948" stroke-width="1.6"/><circle cx="28" cy="31.5" r="3.4" fill="#f7c948" stroke-width="1.6"/><circle cx="37" cy="35.5" r="2.3" fill="#f7c948" stroke-width="1.4"/>'),
    bow: g('<path d="M22 28 L16 43 L24 38.5 L32 43 L26 28 Z" fill="#ff8fb1"/><path d="M24 24 L6 12 Q2 24 6 36 Z" fill="#ff8fb1"/><path d="M24 24 L42 12 Q46 24 42 36 Z" fill="#ff8fb1"/><circle cx="24" cy="24" r="6" fill="#ff6f97"/>'),
    glasses: g('<rect x="3" y="15" width="19" height="15" rx="6.5" fill="#4a3a4f"/><rect x="26" y="15" width="19" height="15" rx="6.5" fill="#4a3a4f"/><path d="M22 20 Q24 18 26 20" fill="none"/>' +
      '<path d="M3 19 L0.5 16 M45 19 L47.5 16" fill="none"/><path d="M7 20 L12 20 M30 20 L35 20" stroke="#fff" stroke-width="2" opacity=".5" fill="none"/>'),
    tophat: g('<ellipse cx="24" cy="38" rx="20" ry="6" fill="#4a3a4f"/><path d="M12 38 V11 Q12 7 16 7 H32 Q36 7 36 11 V38" fill="#5a4a60"/><path d="M12.8 31 H35.2" stroke="#f6a1b8" stroke-width="5" fill="none"/>'),
    crown: g('<path d="M6 36 L5 14 L16 24 L24 8 L32 24 L43 14 L42 36 Z" fill="#ffd966"/><rect x="6" y="36" width="36" height="6.5" rx="2.5" fill="#f5b942"/>' +
      '<circle cx="24" cy="29" r="3.2" fill="#ff8fb1" stroke-width="1.4"/><circle cx="14" cy="30" r="2.4" fill="#8fd3f4" stroke-width="1.2"/><circle cx="34" cy="30" r="2.4" fill="#8fd3f4" stroke-width="1.2"/>'),
    cards: g('<rect x="4" y="9" width="24" height="32" rx="4" fill="#d9c6f3" transform="rotate(-10 16 25)"/><rect x="18" y="8" width="24" height="32" rx="4" fill="#fff7ef" transform="rotate(8 30 24)"/>' +
      '<path d="M30 30 C24 26 25.5 21.5 28 22 C29 22.2 30 23.2 30 24 C30 23.2 31 22.2 32 22 C34.5 21.5 36 26 30 30 Z" fill="#ff8fb1" stroke-width="1.4" transform="rotate(8 30 24)"/>'),
    mouse: g('<path d="M37 37 Q47 36 44 25" fill="none" stroke="#e9aab9" stroke-width="3"/><circle cx="11" cy="14" r="8" fill="#e6dfe9"/><circle cx="37" cy="14" r="8" fill="#e6dfe9"/>' +
      '<circle cx="11" cy="14" r="4.2" fill="#f6b8c9" stroke="none"/><circle cx="37" cy="14" r="4.2" fill="#f6b8c9" stroke="none"/><ellipse cx="24" cy="28" rx="16" ry="13.5" fill="#e6dfe9"/>' +
      '<circle cx="18" cy="26" r="2" fill="#4a2c3a" stroke="none"/><circle cx="30" cy="26" r="2" fill="#4a2c3a" stroke="none"/><ellipse cx="24" cy="32.5" rx="2.6" ry="2" fill="#f08aa4" stroke="none"/>' +
      '<path d="M16 33 L6 31 M16 35.5 L7 38 M32 33 L42 31 M32 35.5 L41 38" fill="none" stroke-width="1.4" opacity=".6"/>'),
    dog: g('<ellipse cx="8" cy="22" rx="6.5" ry="12" transform="rotate(12 8 22)" fill="#c98f5f"/><ellipse cx="40" cy="22" rx="6.5" ry="12" transform="rotate(-12 40 22)" fill="#c98f5f"/>' +
      '<ellipse cx="24" cy="26" rx="15.5" ry="15" fill="#f4d3a8"/><ellipse cx="24" cy="32" rx="8.5" ry="6.5" fill="#fff7ef" stroke-width="1.6"/><ellipse cx="24" cy="29.5" rx="3.4" ry="2.4" fill="#4a2c3a" stroke="none"/>' +
      '<circle cx="17.5" cy="22" r="2.2" fill="#4a2c3a" stroke="none"/><circle cx="30.5" cy="22" r="2.2" fill="#4a2c3a" stroke="none"/><path d="M24 32 V35 M20.5 34.5 Q24 38 27.5 34.5" fill="none" stroke-width="1.6"/>'),
    cat: g('<path d="M7 25 L7 6 L21 15.5 Z" fill="#2a2938"/><path d="M41 25 L41 6 L27 15.5 Z" fill="#2a2938"/><path d="M10 20 L10 11 L16 15.5 Z" fill="#f9bccd" stroke="none"/><path d="M38 20 L38 11 L32 15.5 Z" fill="#f9bccd" stroke="none"/>' +
      '<ellipse cx="24" cy="28" rx="18" ry="14.5" fill="#2a2938"/><ellipse cx="16.5" cy="27" rx="4.2" ry="5" fill="#f2d334" stroke="none"/><ellipse cx="31.5" cy="27" rx="4.2" ry="5" fill="#f2d334" stroke="none"/>' +
      '<ellipse cx="16.5" cy="27" rx="1.4" ry="4" fill="#15151f" stroke="none"/><ellipse cx="31.5" cy="27" rx="1.4" ry="4" fill="#15151f" stroke="none"/><path d="M21.5 33 H26.5 L24 36 Z" fill="#ff8fa3" stroke="none"/>' +
      '<path d="M16 38 Q24 44 32 38" fill="none" stroke="#e03a5e" stroke-width="4"/><circle cx="24" cy="43" r="3" fill="#fff6e0" stroke="#d9c38c" stroke-width="1.4"/>'),
    yarn: g('<circle cx="24" cy="24" r="17" fill="#cbb6f0"/><path d="M9 19 Q24 30 39 14 M7 27 Q24 40 41 25 M14 37 Q26 41 37 36" fill="none" stroke-width="1.8" opacity=".8"/><path d="M38 34 Q46 38 41 45" fill="none"/>'),
    basket: g('<path d="M4 21 H44 L39 41 Q38.5 44 35.5 44 H12.5 Q9.5 44 9 41 Z" fill="#f5cc94"/><path d="M6 21 Q24 1 42 21" fill="none" stroke-width="3"/><path d="M14 25 L16 42 M24 25 V43 M34 25 L32 42 M7 32 H41" fill="none" stroke-width="1.6" opacity=".5"/>'),
    onion: g('<path d="M24 6 C26 14 40 17 40 29 C40 38 33 43 24 43 C15 43 8 38 8 29 C8 17 22 14 24 6 Z" fill="#e8b3dd"/><path d="M24 14 V42 M17 20 Q14 31 19 41 M31 20 Q34 31 29 41" fill="none" stroke-width="1.5" opacity=".55"/>'),
    cactus: g('<path d="M20 44 V14 Q20 7 24 7 Q28 7 28 14 V44 Z" fill="#8fd9a8"/><path d="M20 30 H13 Q9 30 9 26 V19 Q9 16 12 16 Q15 16 15 19 V24 H20" fill="#8fd9a8"/><path d="M28 26 H35 Q39 26 39 22 V15 Q39 12 36 12 Q33 12 33 15 V20 H28" fill="#8fd9a8"/>'),
    box: g('<rect x="6" y="14" width="36" height="28" rx="3" fill="#f2c897"/><path d="M6 22 H42 M20 14 V22 M28 14 V22" fill="none"/><path d="M12 30 H24" stroke-width="1.6" fill="none" opacity=".5"/>'),
    rock: g('<path d="M5 41 Q3 27 13 21 Q17 12 28 14 Q41 14 43 28 Q45 38 41 41 Z" fill="#d0c8d8"/><path d="M15 23 Q19 20 24 22" stroke="#fff" fill="none" opacity=".7"/>'),
    fist: g('<ellipse cx="11" cy="27" rx="5" ry="8" transform="rotate(-15 11 27)" fill="#ffd2b0"/><path d="M13 18 Q13 10 21 10 H33 Q40 10 40 17 V31 Q40 40 31 40 H21 Q13 40 13 31 Z" fill="#ffd2b0"/>' +
      '<path d="M21 10 V22 M28 10 V22 M34 11 V22" fill="none" stroke-width="1.8"/><path d="M15 25 H38" fill="none" stroke-width="1.8" opacity=".6"/>'),
    hammer: g('<rect x="22" y="14" width="7" height="31" rx="3" transform="rotate(32 25.5 29.5)" fill="#e0b48a"/><rect x="7" y="7" width="27" height="14" rx="4.5" transform="rotate(32 20.5 14)" fill="#f6a1b8"/>'),
    slipper: g('<path d="M24 4 C34 4 38 12 37 22 C36 34 34 44 24 44 C14 44 12 34 11 24 C10 12 14 4 24 4 Z" fill="#8fd3f4"/><path d="M24 15 L15.5 27 M24 15 L32.5 27" stroke="#fff" stroke-width="4" fill="none"/><circle cx="24" cy="15" r="2.6" fill="#fff" stroke-width="1.6"/>'),
    pillow: g('<path d="M6 12 Q24 5 42 12 Q45 24 42 36 Q24 43 6 36 Q3 24 6 12 Z" fill="#fff0f4"/><path d="M24 31 C17 26 19 20 22.2 20.6 C23.3 20.8 24 21.8 24 22.6 C24 21.8 24.7 20.8 25.8 20.6 C29 20 31 26 24 31 Z" fill="#ff9ebb" stroke-width="1.4"/>')
  };

  // 24x24, rengi CSS "color" belirler
  var S = 'stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"';
  var G = {
    play: '<path d="M7 4.5 V19.5 L19.5 12 Z" fill="currentColor"/>',
    pause: '<path d="M6 4.5 H10 V19.5 H6 Z M14 4.5 H18 V19.5 H14 Z" fill="currentColor"/>',
    prev: '<path d="M5.5 5 H8 V19 H5.5 Z M20 5 V19 L9.5 12 Z" fill="currentColor"/>',
    next: '<path d="M16 5 H18.5 V19 H16 Z M4 5 L14.5 12 L4 19 Z" fill="currentColor"/>',
    shuffle: '<path d="M3 7 H6.5 C9 7 10.5 9 12 11.5 C13.5 14 15 17 17.5 17 H20 M17 14.5 L20 17 L17 19.5 M3 17 H6.5 C8 17 9 16.2 10 15 M13.5 9 C14.5 7.8 15.8 7 17.5 7 H20 M17 4.5 L20 7 L17 9.5" ' + S + "/>",
    repeat: '<path d="M4 11 V9 Q4 6 7 6 H19 M16 3 L19 6 L16 9 M20 13 V15 Q20 18 17 18 H5 M8 15 L5 18 L8 21" ' + S + "/>",
    repeat1: '<path d="M4 11 V9 Q4 6 7 6 H19 M16 3 L19 6 L16 9 M20 13 V15 Q20 18 17 18 H5 M8 15 L5 18 L8 21 M11 10.5 L12.6 9.5 V14.5" ' + S + "/>",
    plus: '<path d="M10.5 4 H13.5 V10.5 H20 V13.5 H13.5 V20 H10.5 V13.5 H4 V10.5 H10.5 Z" fill="currentColor"/>',
    trash: '<path d="M9 3.5 H15 L16 5.5 H20 V7.5 H4 V5.5 H8 Z M6 9 H18 L17 20.5 H7 Z" fill="currentColor"/>',
    close: '<path d="M6 6 L18 18 M18 6 L6 18" ' + S + "/>",
    back: '<path d="M15 5 L8 12 L15 19" ' + S + "/>",
    vol: '<path d="M3.5 9 H7.5 L12.5 4.8 V19.2 L7.5 15 H3.5 Z" fill="currentColor"/><path d="M15.5 9 Q18 12 15.5 15 M18 6.5 Q22.5 12 18 17.5" ' + S + "/>",
    mute: '<path d="M3.5 9 H7.5 L12.5 4.8 V19.2 L7.5 15 H3.5 Z" fill="currentColor"/><path d="M16 9.5 L21 14.5 M21 9.5 L16 14.5" ' + S + "/>",
    note1: '<path d="M9 17.5 V5 L19 3 V15.5" ' + S + '/><ellipse cx="6.8" cy="17.8" rx="3.2" ry="2.5" fill="currentColor"/><ellipse cx="16.8" cy="15.8" rx="3.2" ry="2.5" fill="currentColor"/>'
  };

  // Kenarı zıplayan kedi (Düğme Zıpla oyunu için yandan görünüş), iki koşu karesi
  function catrun(frame) {
    var legs = frame === 1
      ? "M28 40 L22 55 M35 40 L40 55 M54 40 L48 55 M61 40 L67 55"
      : "M28 40 L35 55 M35 40 L27 55 M54 40 L61 55 M61 40 L52 55";
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 62" width="90" height="62">' +
      '<g stroke="#2a2938" stroke-width="6.5" stroke-linecap="round" fill="none"><path d="' + legs + '"/><path d="M19 34 C6 34 4 20 12 12"/></g>' +
      '<g fill="#2a2938"><ellipse cx="42" cy="34" rx="25" ry="13"/><circle cx="68" cy="26" r="12"/>' +
      '<path d="M59 19 L60 7 L69 15 Z"/><path d="M69 15 L77 8 L78 20 Z"/></g>' +
      '<path d="M61 15 L61.5 11 L65.5 14.5 Z" fill="#f9bccd"/>' +
      '<ellipse cx="72" cy="25" rx="3.2" ry="3.8" fill="#f2d334"/><ellipse cx="72.4" cy="25" rx="1" ry="3" fill="#15151f"/>' +
      '<path d="M78.5 29 L81 31 L77.5 32 Z" fill="#ff8fa3"/>' +
      '<path d="M76 31 Q80 36 84 33" stroke="#c9c9de" stroke-width="1.3" fill="none"/>' +
      '<path d="M57 36 Q67 41 76 36" stroke="#e03a5e" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>';
  }

  function svg(name, px) {
    var size = px ? ' width="' + px + '" height="' + px + '"' : ' width="100%" height="100%"';
    if (C[name]) return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"' + size + ' aria-hidden="true">' + C[name] + "</svg>";
    if (G[name]) return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"' + size + ' aria-hidden="true">' + G[name] + "</svg>";
    return "";
  }
  // Metin içine koymak için: <i class="ic">…</i>
  function i(name, cls) { return '<i class="ic ic-' + name + (cls ? " " + cls : "") + '">' + svg(name) + "</i>"; }

  function mount(root) {
    var els = (root || document).querySelectorAll("[data-ic]");
    for (var k = 0; k < els.length; k++) {
      var el = els[k];
      el.innerHTML = svg(el.getAttribute("data-ic"));
      el.classList.add("ic");
      el.removeAttribute("data-ic");
    }
  }

  var cache = {};
  function image(name, w, h) {
    var key = name + ":" + w + "x" + h;
    if (cache[key]) return cache[key];
    var s = name === "catrun1" ? catrun(1) : name === "catrun2" ? catrun(2) : svg(name, w);
    var img = new Image(w, h);
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);
    cache[key] = img;
    return img;
  }
  function names() { return Object.keys(C).concat(Object.keys(G)); }

  return { catrun: catrun, svg: svg, i: i, mount: mount, image: image, names: names, has: function (n) { return !!(C[n] || G[n]); } };
})();
