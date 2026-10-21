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
    "Balım,\n\n" +
    "Bunu sana uygulama yaparak söylemek istedim çünkü daha güzel anlayacağını ve kafandaki yanlış düşünceleri kırabileceğimi düşünüyorum. " +
    "Ben garip dönemlerden geçtim ve sana yansıttım. Hiç yansıtmak istemememe rağmen böyle bir hata yaptım ve son derece pişmanım, olabildiği kadar pişmanım. " +
    "Açıklamam ve mazeretim yok ama özür dilerim.\n\n" +
    "Yokluğun her şeyden daha stresli ve zor geçiyor. Hayatıma renk katan tek şey sensin ve ben seni kırıp üzdüm. " +
    "Çok pişmanım ve elimden geldiği kadar düzeltmeye çalışacağım. İstediğin kadar döv beni, istediğini yap, acını çıkar. Ne dersen, ne yapsan haklısın çünkü.\n\n" +
    "Bundan sonra daha dikkatli olacağım, söz veriyorum. Özür dilerim, seni seviyorum.\n\n" +
    "— {sen}",

  // ŞARKILAR: Müzik sekmesindeki "Şarkı ekle" düğmesiyle telefondan şarkı eklenir.
  // Uygulamanın İÇİNE hazır şarkı koymak istersen mp3 dosyalarını www/music/ klasörüne at,
  // sonra buraya şöyle yaz (APK yeniden derlenince hazır gelir):
  //   songs: [
  //     { title: "Bizim Şarkımız", artist: "Sanatçı", file: "music/bizim-sarkimiz.mp3" }
  //   ]
  songs: [
    { title: "Özür Remix", artist: "Ben", file: "music/ozur.mp3" },
    { title: "HEAVEN", artist: "Jennie", file: "music/jennie-heaven.mp3" },
    { title: "FALLEN ANGEL", artist: "Jennie", file: "music/fallen-angel.mp3" },
    { title: "Seoul City", artist: "Jennie", file: "music/seoul-city.mp3" }
  ],

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
