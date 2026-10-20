#!/usr/bin/env python3
"""`npx cap add android` sonrası çalışır: pembe ikon, açılış ekranı, bildirim ikonu, izinler, dikey ekran."""
import os
import re
import shutil
import struct
import sys
import zlib

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
RES = os.path.join(ROOT, "android", "app", "src", "main", "res")
MANIFEST = os.path.join(ROOT, "android", "app", "src", "main", "AndroidManifest.xml")

PINK_BG = "#FDEEF2"      # uygulama zemini / açılış ekranı
PINK_BAR = "#FDE6EC"     # durum çubuğu
ICON_BG = "#F6B8C9"      # adaptive ikon zemini

if not os.path.isdir(RES):
    sys.exit("android/ klasörü yok. Önce: npx cap add android")


def solid_png(path, rgb, w=16, h=16):
    """Pillow'a ihtiyaç duymadan düz renkli PNG yazar."""
    raw = b"".join(b"\x00" + bytes(rgb) * w for _ in range(h))

    def chunk(tag, data):
        body = tag + data
        return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)

    png = (b"\x89PNG\r\n\x1a\n"
           + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
           + chunk(b"IDAT", zlib.compress(raw))
           + chunk(b"IEND", b""))
    with open(path, "wb") as f:
        f.write(png)


# 1) Launcher ikonları (düz, yuvarlak ve adaptive ön plan)
icons = os.path.join(ROOT, "assets", "icons")
for dens in ("mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"):
    dst = os.path.join(RES, "mipmap-" + dens)
    os.makedirs(dst, exist_ok=True)
    for name in ("ic_launcher.png", "ic_launcher_round.png", "ic_launcher_foreground.png"):
        shutil.copy(os.path.join(icons, "mipmap-" + dens, name), os.path.join(dst, name))

# adaptive ikon arka plan rengi
values = os.path.join(RES, "values")
os.makedirs(values, exist_ok=True)
with open(os.path.join(values, "ic_launcher_background.xml"), "w", encoding="utf-8") as f:
    f.write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">%s</color>\n</resources>\n' % ICON_BG)

# 2) Bildirim ikonu
drawable = os.path.join(RES, "drawable")
os.makedirs(drawable, exist_ok=True)
shutil.copy(os.path.join(ROOT, "assets", "android", "drawable", "ic_stat_dugme.xml"), os.path.join(drawable, "ic_stat_dugme.xml"))

# 3) Açılış ekranı: Capacitor'un varsayılan logosu yerine düz toz pembe
n_splash = 0
for dirpath, _dirs, files in os.walk(RES):
    for fn in files:
        if fn == "splash.png":
            solid_png(os.path.join(dirpath, fn), (253, 238, 242))
            n_splash += 1
print("splash.png yenilendi:", n_splash)

# 4) Tema: pembe açılış zemini, pembe durum çubuğu (bulunamazsa sessizce atlar)
styles = os.path.join(values, "styles.xml")
if os.path.isfile(styles):
    with open(styles, "r", encoding="utf-8") as f:
        st = f.read()
    if "Theme.SplashScreen" in st and "windowSplashScreenBackground" not in st:
        st = re.sub(r'(<style name="AppTheme\.NoActionBarLaunch"[^>]*>)',
                    r'\1\n        <item name="windowSplashScreenBackground">%s</item>' % PINK_BG, st, count=1)
    if "android:statusBarColor" not in st:
        st = re.sub(r'(<style name="AppTheme\.NoActionBar"[^>]*>)',
                    r'\1\n        <item name="android:statusBarColor">%s</item>'
                    r'\n        <item name="android:navigationBarColor">%s</item>'
                    r'\n        <item name="android:windowLightStatusBar">true</item>'
                    r'\n        <item name="android:windowLightNavigationBar">true</item>' % (PINK_BAR, PINK_BAR), st, count=1)
    with open(styles, "w", encoding="utf-8") as f:
        f.write(st)
    print("styles.xml güncellendi")

# 5) Manifest: izinler + dikey ekran
with open(MANIFEST, "r", encoding="utf-8") as f:
    m = f.read()

perms = [
    "android.permission.INTERNET",
    "android.permission.POST_NOTIFICATIONS",
    "android.permission.VIBRATE",
    "android.permission.RECORD_AUDIO",
    "android.permission.MODIFY_AUDIO_SETTINGS",
    "android.permission.RECEIVE_BOOT_COMPLETED",
]
add = ""
for p in perms:
    if p not in m:
        add += '    <uses-permission android:name="%s" />\n' % p
if add:
    m = m.replace("</manifest>", add + "</manifest>")

if "android:screenOrientation" not in m:
    m = re.sub(r"(<activity\b)", r'\1 android:screenOrientation="portrait"', m, count=1)

with open(MANIFEST, "w", encoding="utf-8") as f:
    f.write(m)

print("Android projesi ayarlandı.")
