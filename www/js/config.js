// =====================================================
//  KONUŞAN DÜĞME - AYARLAR
//  Bu dosyayı kendine göre düzenle, sonra APK'yı yeniden derle.
//  (Not: eski telefonlarda "kutu" çıkmasın diye sadece eski/güvenli emojiler kullan.)
// =====================================================
window.CONFIG = {
  // Senin adın (çöp adam ve bildirimlerde geçer)
  yourName: "Umut",

  // Sevgilinin adı
  herName: "Nisa",

  // SENİN numaran. Nisa mektuptaki "Mesaj gönder"e basınca bu numaraya
  // "Seni affediyorum birtanem 💗" yazılı bir SMS ekranı açılır.
  herPhone: "+905335916577",

  // Mektup. {isim} yerine sevgilinin adı gelir.
  letterTitle: "Sana bir şey söylemem lazım",
  letter:
    "{isim},\n\n" +
    "Bunu sana bir uygulama yaparak söylemek istedim çünkü kelimelerim yetmedi. " +
    "Çok stresliydim ve bunu sana yansıttım, seni üzdüm. Bunun bir açıklaması olabilir ama mazereti olamaz. Özür dilerim.\n\n" +
    "Seni çok özlüyorum. Düğme de seni özledi, kapıya bakıp duruyor. 🐾\n\n" +
    "Umut da hak ettiği dayağı yedi, bak morardı bile. :)\n\n" +
    "Bana bir şans daha verirsen daha sabırlı, daha dikkatli olacağım. " +
    "Ama ne olursa olsun, seni dinlemek isterim. Konuşalım mı?\n\n" +
    "— {sen}",

  // ŞARKILAR: Müzik sekmesindeki "Şarkı ekle" düğmesiyle telefondan şarkı eklenir.
  // Uygulamanın İÇİNE hazır şarkı koymak istersen mp3 dosyalarını www/music/ klasörüne at,
  // sonra buraya şöyle yaz (APK yeniden derlenince hazır gelir):
  //   songs: [
  //     { title: "Bizim Şarkımız", artist: "Sanatçı", file: "music/bizim-sarkimiz.mp3" }
  //   ]
  songs: [],

  // Bildirim mesajları (rastgele seçilir)
  notifications: [
    "Düğme acıktı 🐟",
    "Düğme acıktı, buzdolabına bakar mısın? 🐟",
    "Düğme oyun istiyor 🎮",
    "Düğme seninle oynamak istiyor 🐾",
    "Düğme uykusuz kaldı, ninni çalar mısın? 😴",
    "Düğme müzik dinlemek istiyor 🎵",
    "{sen} dayak istiyor 😅",
    "{sen} dayak yemeyi hak etti, gel vur 😅",
    "{sen} seni çok özledi 💔",
    "{sen} seni çok özledi, Düğme de öyle 🐾",
    "{isim}, Düğme seni bekliyor 🐾",
    "{isim}, {sen} sana bir şey söylemek istiyor 💌",
    "Düğme sana miyavladı 🐾",
    "Düğme seni görmek istiyor 👀",
    "Düğme kendini yalnız hissediyor 😿"
  ]
};
