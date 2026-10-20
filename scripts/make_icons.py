#!/usr/bin/env python3
"""Düğme ikonlarını üretir (assets/icons). Gerekirse: pip install pillow"""
from PIL import Image, ImageDraw
import os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")


def heart(d, cx, cy, r, fill):
    d.ellipse([cx - r, cy - r * 0.95, cx, cy + r * 0.05], fill=fill)
    d.ellipse([cx, cy - r * 0.95, cx + r, cy + r * 0.05], fill=fill)
    d.polygon([(cx - r * 0.98, cy - r * 0.2), (cx + r * 0.98, cy - r * 0.2), (cx, cy + r * 1.05)], fill=fill)


def cat_face(size, with_bg):
    k = 4
    N = size * k
    im = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if with_bg:
        # toz pembe zemin + açık hale + küçük kalpler
        d.rounded_rectangle([0, 0, N, N], radius=int(N * 0.22), fill=(246, 184, 201, 255))
        glow = Image.new("RGBA", (N, N), (0, 0, 0, 0))
        ImageDraw.Draw(glow).ellipse([N * 0.10, N * 0.08, N * 0.90, N * 0.88], fill=(255, 240, 245, 190))
        im = Image.alpha_composite(im, glow)
        d = ImageDraw.Draw(im)
        for hx, hy, hr in ((0.17, 0.20, 0.055), (0.84, 0.16, 0.045), (0.88, 0.80, 0.06), (0.13, 0.78, 0.04)):
            heart(d, N * hx, N * hy, N * hr, (255, 255, 255, 255))
    s = N * (0.60 if with_bg else 0.50)
    cx, cy = N / 2, N / 2 + N * (0.0 if with_bg else 0.01)
    fur = (28, 27, 38, 255)

    def P(x, y):
        return (cx + x * s, cy + y * s)

    d.polygon([P(-.50, -.10), P(-.46, -.52), P(-.12, -.30)], fill=fur)
    d.polygon([P(.50, -.10), P(.46, -.52), P(.12, -.30)], fill=fur)
    d.polygon([P(-.43, -.14), P(-.41, -.40), P(-.2, -.28)], fill=(255, 143, 163, 255))
    d.polygon([P(.43, -.14), P(.41, -.40), P(.2, -.28)], fill=(255, 143, 163, 255))
    d.ellipse([cx - .52 * s, cy - .42 * s, cx + .52 * s, cy + .40 * s], fill=fur)
    for ex in (-.24, .24):
        d.ellipse([cx + ex * s - .14 * s, cy - .12 * s - .16 * s, cx + ex * s + .14 * s, cy - .12 * s + .16 * s], fill=(242, 211, 52, 255))
        d.ellipse([cx + ex * s - .04 * s, cy - .12 * s - .13 * s, cx + ex * s + .04 * s, cy - .12 * s + .13 * s], fill=(16, 16, 20, 255))
        d.ellipse([cx + ex * s - .09 * s, cy - .12 * s - .10 * s, cx + ex * s - .04 * s, cy - .12 * s - .05 * s], fill=(255, 255, 255, 255))
    d.polygon([P(-.05, .07), P(.05, .07), P(0, .13)], fill=(255, 143, 163, 255))
    w = max(2, int(s * 0.018))
    d.arc([cx - .12 * s, cy + .08 * s, cx, cy + .2 * s], 0, 180, fill=(141, 141, 163, 255), width=w)
    d.arc([cx, cy + .08 * s, cx + .12 * s, cy + .2 * s], 0, 180, fill=(141, 141, 163, 255), width=w)
    for sg in (-1, 1):
        for dy, ey in ((0.10, 0.04), (0.14, 0.15), (0.18, 0.26)):
            d.line([P(sg * .20, dy), P(sg * .52, ey)], fill=(154, 154, 176, 255), width=w)
    d.arc([cx - .40 * s, cy + .10 * s, cx + .40 * s, cy + .62 * s], 20, 160, fill=(224, 58, 94, 255), width=int(s * 0.07))
    bx, by, br = cx, cy + .45 * s, .085 * s
    d.ellipse([bx - br, by - br, bx + br, by + br], fill=(255, 246, 224, 255), outline=(217, 195, 140, 255), width=max(2, int(s * 0.01)))
    for ox, oy in ((-1, -1), (1, -1), (-1, 1), (1, 1)):
        d.ellipse([bx + ox * br * .3 - br * .13, by + oy * br * .3 - br * .13, bx + ox * br * .3 + br * .13, by + oy * br * .3 + br * .13], fill=(138, 116, 64, 255))
    return im.resize((size, size), Image.LANCZOS)


def main():
    out = os.path.join(ROOT, "assets", "icons")
    os.makedirs(out, exist_ok=True)
    full = cat_face(1024, True)
    full.save(os.path.join(out, "icon-1024.png"))
    fg = cat_face(1024, False)
    legacy = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}
    adapt = {"mdpi": 108, "hdpi": 162, "xhdpi": 216, "xxhdpi": 324, "xxxhdpi": 432}
    for dens, px in legacy.items():
        d = os.path.join(out, "mipmap-" + dens)
        os.makedirs(d, exist_ok=True)
        r = full.resize((px, px), Image.LANCZOS)
        r.save(os.path.join(d, "ic_launcher.png"))
        m = Image.new("L", r.size, 0)
        ImageDraw.Draw(m).ellipse([0, 0, px - 1, px - 1], fill=255)
        rr = Image.new("RGBA", r.size, (0, 0, 0, 0))
        rr.paste(r, (0, 0), m)
        rr.save(os.path.join(d, "ic_launcher_round.png"))
        fg.resize((adapt[dens],) * 2, Image.LANCZOS).save(os.path.join(d, "ic_launcher_foreground.png"))
    print("ikonlar hazır:", out)


if __name__ == "__main__":
    main()
