# 🐾 Konuşan Düğme

Siyah kedi **Düğme**'yi sev, doyur, oyun oyna. Buzdolabı, market, 4 mini oyun,
mikrofonla konuşunca tiz sesle tekrar eden kedi, **müzik çalar** ve **Umut'u döv** ekranı var.
Her yer toz pembe, tavşan çıkartmalarıyla süslü.
Bazen bildirim gönderir: "Düğme acıktı 🐟", "Umut seni çok özledi 💔" gibi.

Android için APK olarak derlenir. Derlemeyi bilgisayarında program kurmadan **GitHub kendisi yapar**.

## APK'yı almak (bilgisayara hiçbir şey kurmadan)

1. [github.com](https://github.com) 'da hesabına gir, **New repository** de, adı `konusan-dugme` olsun.
2. Bu klasörün **içindekileri** (klasörün kendisini değil) repoya yükle:
   - Kolay yol: repo sayfasında **uploading an existing file** de, tüm dosyaları sürükle. `.github` klasörü gizli
     olduğu için görünmeyebilir; Mac'te `Cmd+Shift+.`, Windows'ta "Gizli öğeler" ile göster ve onu da yükle.
   - Ya da terminalden:
     ```bash
     git init -b main
     git add .
     git commit -m "Konuşan Düğme"
     git remote add origin https://github.com/KULLANICI_ADIN/konusan-dugme.git
     git push -u origin main
     ```
3. Repoda **Actions** sekmesine gir, **APK derle** çalışıyor olacak (5-10 dakika sürer).
4. Bitince **Releases** (sağ kenar) → **Konuşan Düğme (son sürüm)** → `Konusan-Dugme.apk` dosyasını indir.
   Aynı dosya Actions çalıştırmasının altında **Artifacts** bölümünde de durur.

Derleme kırmızı biterse Actions'taki hata satırını bana yapıştır, düzeltelim.

## Telefona kurmak

APK dosyasını telefona gönder (WhatsApp, Drive, kablo, Telegram, ne olursa), dosyaya dokun.
Android "bilinmeyen kaynaklardan yükleme" izni isteyecek, izin ver. Açılışta **bildirim** ve
**mikrofon** izinlerini vermesini unutma. Bildirimler olmazsa Düğme sessiz kalır.

Not: Bu uygulama sadece **Android** içindir. iPhone'a APK kurulmaz.

## Kendine göre düzenle

`www/js/config.js` dosyasını aç:

- `yourName`: senin adın (bildirimlerde ve mektupta geçer)
- `herName`: sevgilinin adı (boş bırakırsan uygulama ilk açılışta sorar)
- `herPhone`: doldurursan mektup ekranında "Mesaj gönder" butonu çıkar (SMS sana, "Seni affediyorum birtanem 💗" yazılı gider)
- `letter`: **mektubu kendi kelimelerinle yaz.** Hazır metin sadece taslak.
- `notifications`: bildirim cümleleri
- `songs`: uygulamanın içine hazır şarkı koymak için (aşağıda "Müzik" bölümüne bak)

Küçük not: eski telefonlarda yeni emojiler "kutu" olarak görünür. Metinlerde 💗 🐾 🐟 😅 🎵 gibi eski emojileri kullan,
resimlerin hepsi zaten uygulamanın içinde çizili (SVG).

Dosyayı GitHub'da değiştirip kaydettiğin an APK otomatik yeniden derlenir.

## Özellikler

| | |
|---|---|
| 🏠 Ev | Düğme'yi sev (parmağını sürükle, mırıldanır), dokun (miyavlar), uyut, 🎤 basılı tutup konuş (tiz sesle tekrar eder) |
| 🧊 Buzdolabı | Aldığın yemekleri yedir (balık, süt, tavuk, pasta...) |
| 🛒 Market | Yemek al, Düğme'ye fiyonk / gözlük / şapka / taç al |
| 🎮 Oyunlar | Balık Yakala, Hafıza, Fare Avı, Düğme Zıpla (altın kazandırır) |
| 🥊 Umut | Çöp adamı dövdükçe ŞAK ÇAT KÜT sesleri ve efektler, morarır, en sonda özür mektubu |
| 🎵 Müzik | Spotify gibi çalar: **Şarkı ekle** ile telefondaki müzikleri ekle, çal, karıştır, tekrarla, sesi ayarla. Düğme'nin kendi ninnisi hazır gelir. Başka ekranda da altta mini çalar durur |
| 🔔 Bildirim | Günde 4 rastgele bildirim (önümüzdeki 7 gün için, uygulama her açılışta yenilenir) |

Düğme aç kalırsa, ilgisiz kalırsa mutsuz olur. Uygulama kapalıyken de zaman geçer.

## Müzik

- Müzik sekmesinde **Şarkı ekle**ye dokun, telefondan bir ya da birkaç şarkı seç. Şarkılar uygulamanın içinde saklanır
  (uygulamayı silmedikçe kalır). Dosya adı `Sanatçı - Şarkı.mp3` biçimindeyse adlar otomatik ayrılır.
- Şarkıyı çöp kutusuyla silebilirsin.
- **Hazır şarkı gömmek istersen:** mp3 dosyalarını `www/music/` klasörüne koy ve `www/js/config.js` içindeki `songs` listesine yaz:
  ```js
  songs: [ { title: "Bizim Şarkımız", artist: "Umut", file: "music/bizim-sarkimiz.mp3" } ]
  ```
  APK yeniden derlenince şarkı hazır gelir. (Telif hakkı olan şarkıları yayınlamamak için repoyu **özel (private)** tut.)
- Mikrofonla konuşturken müzik kısa süre durur, sonra devam eder.

## Dosyalar

- `www/` oyunun kendisi (HTML/CSS/JS). Tarayıcıda `www/index.html` açarak da deneyebilirsin.
- `assets/`, `scripts/` ikon ve Android ayarları
- `.github/workflows/build-apk.yml` APK'yı derleyen tarif
- `android/` derleme sırasında otomatik oluşur, repoda tutulmaz

## Teknik not

Capacitor 7 + yerel bildirim eklentisi. Tüm sesler kodla üretilir, dış dosya yok.
Çizimler SVG. Kayıtlar telefonda (`localStorage`) tutulur, internet gerekmez.
