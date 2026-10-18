// =====================================================
//  KONUŞAN DÜĞME - AYARLAR
//  Bu dosyayı kendine göre düzenle, sonra APK'yı yeniden derle.
// =====================================================
window.CONFIG = {
  // Senin adın (çöp adam ve bildirimlerde geçer)
  yourName: "Umut",

  // Sevgilinin adı. Boş bırakırsan uygulama ilk açılışta soracak.
  herName: "",

  // İstersen telefon numarası yaz (örn "+905551234567").
  // Doluysa mektup ekranında "Affettim 💗" diye SMS atma butonu çıkar.
  herPhone: "",

  // Mektup. {isim} yerine sevgilinin adı gelir. Buraya kendi kelimelerini yaz!
  letterTitle: "Sana bir şey söylemem lazım",
  letter:
    "{isim},\n\n" +
    "Bunu sana bir mobil uygulama yaparak, biraz da mahcup bir şekilde söylemek istedim: " +
    "çok stresliydim ve seni üzdüm. Bunun bir açıklaması olabilir ama mazereti olamaz.\n\n" +
    "Seni çok özlüyorum. Düğme de seni özledi, kapıya bakıp duruyor.\n\n" +
    "Umut da hak ettiği dayağı yedi, morardı bile. :)\n\n" +
    "Bana bir şans daha verirsen daha sabırlı, daha dikkatli olacağım. " +
    "Sözüm söz.\n\n" +
    "Beni affedersen bana bir mesaj atar mısın?\n\n" +
    "— {sen}",

  // Bildirim mesajları (rastgele seçilir)
  notifications: [
    "Düğme acıktı 🐟",
    "Düğme acıktı, buzdolabına bakar mısın? 🧊",
    "Düğme oyun istiyor 🎮",
    "Düğme seninle oynamak istiyor 🧶",
    "Düğme uykusuz kaldı, ninni söyler misin? 😴",
    "{sen} dayak istiyor 😅",
    "{sen} dayak yemeyi hak etti, gel vur 🥊",
    "{sen} seni çok özledi 💔",
    "{sen} seni çok özledi, Düğme de öyle 🐈‍⬛",
    "Düğme sana miyavladı 🐾",
    "Düğme seni görmek istiyor 👀",
    "Düğme kendini yalnız hissediyor 🥺"
  ]
};
