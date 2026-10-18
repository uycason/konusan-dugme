#!/usr/bin/env python3
"""`npx cap add android` sonrası çalışır: ikon, bildirim ikonu, izinler, dikey ekran."""
import os
import re
import shutil
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
RES = os.path.join(ROOT, "android", "app", "src", "main", "res")
MANIFEST = os.path.join(ROOT, "android", "app", "src", "main", "AndroidManifest.xml")

if not os.path.isdir(RES):
    sys.exit("android/ klasörü yok. Önce: npx cap add android")

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
    f.write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#1A1030</color>\n</resources>\n')

# 2) Bildirim ikonu
drawable = os.path.join(RES, "drawable")
os.makedirs(drawable, exist_ok=True)
shutil.copy(os.path.join(ROOT, "assets", "android", "drawable", "ic_stat_dugme.xml"), os.path.join(drawable, "ic_stat_dugme.xml"))

# 3) Manifest: izinler + dikey ekran
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
