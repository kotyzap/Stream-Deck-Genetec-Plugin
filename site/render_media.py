#!/usr/bin/env python3
"""Renders deck mockups (docs/img/deck*.png, hero-decks.png), the actions sheet and Marketplace media from keys/*.png.
Run after `node site/render.mjs`. Pavel Kotyza <kotyza@gmail.com> — https://www.4xs.dev
"""
import pathlib, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "profile"))
from build_profile import LAYOUTS  # noqa: E402

KEYS = ROOT / "keys"
DOCS = ROOT / "docs" / "img"
MKT = ROOT / "marketplace"
DECK = (28, 28, 30, 255)
EDGE = (52, 52, 56, 255)
EMPTY = (38, 38, 41, 255)
NAME = "Deck for Genetec Security Desk"

def font(size, bold=False):
    for f in (["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"] if bold else ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]):
        try: return ImageFont.truetype(f, size)
        except OSError: pass
    return ImageFont.load_default()

def key_img(name, size):
    return Image.open(KEYS / f"{name}.png").convert("RGBA").resize((size, size), Image.LANCZOS)

def rounded(size, radius, fill):
    im = Image.new("RGBA", size, (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius, fill=fill)
    return im

def deck(layout, key=140, gap=20, pad=48):
    cols, rows = layout["cols"], layout["rows"]
    w = pad * 2 + cols * key + (cols - 1) * gap
    h = pad * 2 + rows * key + (rows - 1) * gap
    im = rounded((w + 12, h + 12), 26, EDGE)
    im.alpha_composite(rounded((w, h), 22, DECK), (6, 6))
    for r in range(rows):
        for c in range(cols):
            x = 6 + pad + c * (key + gap); y = 6 + pad + r * (key + gap)
            spec = layout["keys"].get(f"{c},{r}")
            if spec: im.alpha_composite(key_img(spec["img"], key), (x, y))
            else: im.alpha_composite(rounded((key, key), 12, EMPTY), (x, y))
    return im

def shadowed(im, blur=18, off=(0, 10)):
    from PIL import ImageFilter
    pad = blur * 3
    out = Image.new("RGBA", (im.width + pad * 2, im.height + pad * 2), (0, 0, 0, 0))
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); sh.paste((0, 0, 0, 110), (0, 0, im.width, im.height), im.split()[3])
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    out.alpha_composite(sh, (pad + off[0], pad + off[1])); out.alpha_composite(im, (pad, pad))
    return out

def hero(decks, size=(1600, 1434)):
    """XL top right, MK.2 bottom left, Mini bottom right — same composition as the other decks' sites."""
    xl, mk, mini = (shadowed(decks[n]) for n in ("Security Desk XL", "Security Desk", "Security Desk Mini"))
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    xl = xl.resize((int(xl.width * 1.0), int(xl.height * 1.0)))
    canvas.alpha_composite(xl, (size[0] - xl.width + 40, 0))
    canvas.alpha_composite(mk, (-30, size[1] - mk.height))
    canvas.alpha_composite(mini, (size[0] - mini.width + 40, size[1] - mini.height - 20))
    return canvas

def actions_sheet(names, cols=8, cell=130, gap=20, pad=20):
    rows = (len(names) + cols - 1) // cols
    im = Image.new("RGBA", (pad * 2 + cols * cell + (cols - 1) * gap, pad * 2 + rows * cell + (rows - 1) * gap), (0, 0, 0, 0))
    for i, n in enumerate(names):
        im.alpha_composite(key_img(n, cell), (pad + (i % cols) * (cell + gap), pad + (i // cols) * (cell + gap)))
    return im

def fit(im, box):
    s = min(box[0] / im.width, box[1] / im.height)
    return im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)

def marketplace(decks, sheet):
    W, H = 1920, 960
    bg = (22, 22, 24, 255); yellow = (120, 170, 255, 255); white = (242, 242, 247, 255); grey = (160, 160, 166, 255)
    # thumbnail: title left, decks right
    t = Image.new("RGBA", (W, H), bg); d = ImageDraw.Draw(t)
    t.alpha_composite(Image.open(ROOT / "plugin" / "com.4xsdev.genetec-sd.sdPlugin" / "imgs" / "plugin" / "marketplace@2x.png").resize((96, 96), Image.LANCZOS), (90, 110))
    d.text((90, 250), "Deck for", font=font(64, True), fill=white)
    d.text((90, 330), "Genetec", font=font(72, True), fill=yellow)
    d.text((90, 415), "Security Desk", font=font(72, True), fill=yellow)
    d.text((90, 540), "Playback, alarms, tiles, PTZ, doors, hot actions and any\nentity by logical ID — on physical keys. Windows · Mac (Parallels/RDP).", font=font(30), fill=grey, spacing=10)
    d.text((90, 660), "Stream Deck · Mini · XL profiles included", font=font(26), fill=grey)
    h = fit(hero(decks), (1000, 860)); t.alpha_composite(h, (W - h.width - 40, (H - h.height) // 2))
    t.convert("RGB").save(MKT / "thumbnail.png")
    # gallery 1: MK.2 deck
    g = Image.new("RGBA", (W, H), bg); mk = fit(shadowed(decks["Security Desk"]), (1400, 760)); g.alpha_composite(mk, ((W - mk.width) // 2, 60))
    ImageDraw.Draw(g).text((W // 2, 890), "Playback row · bookmark, instant replay, live / playback, export · alarms, tiles — the default 15-key profile", font=font(26), fill=grey, anchor="mm")
    g.convert("RGB").save(MKT / "gallery-1-deck.png")
    # gallery 2: all three devices
    g = Image.new("RGBA", (W, H), bg); h = fit(hero(decks), (1800, 840)); g.alpha_composite(h, ((W - h.width) // 2, 40))
    ImageDraw.Draw(g).text((W // 2, 920), "Ready-made profiles for Stream Deck Mini, MK.2 and XL — the matching one installs automatically", font=font(26), fill=grey, anchor="mm")
    g.convert("RGB").save(MKT / "gallery-2-devices.png")
    # gallery 3: actions sheet + hotkey explanation
    g = Image.new("RGBA", (W, H), bg); d = ImageDraw.Draw(g)
    d.text((W // 2, 70), "69 Security Desk commands, an Activate key, and a free Hotkey key for any entity by logical ID", font=font(30, True), fill=white, anchor="mm")
    s = fit(sheet, (1800, 700)); g.alpha_composite(s, ((W - s.width) // 2, 130))
    d.text((W // 2, 905), "Every key shows the shortcut it sends — Genetec's documented defaults, editable per key if you customised them.", font=font(24), fill=grey, anchor="mm")
    g.convert("RGB").save(MKT / "gallery-3-actions.png")
    # app icon 288
    Image.open(ROOT / "plugin" / "com.4xsdev.genetec-sd.sdPlugin" / "imgs" / "plugin" / "marketplace@2x.png").resize((288, 288), Image.LANCZOS).save(MKT / "app-icon-288.png")

if __name__ == "__main__":
    DOCS.mkdir(parents=True, exist_ok=True); MKT.mkdir(exist_ok=True)
    decks = {n: deck(l) for n, l in LAYOUTS.items()}
    decks["Security Desk"].save(DOCS / "deck.png"); decks["Security Desk Mini"].save(DOCS / "deck-mini.png"); decks["Security Desk XL"].save(DOCS / "deck-xl.png")
    hero(decks).save(DOCS / "hero-decks.png")
    names = ["play", "prev-frame", "next-frame", "rewind", "forward", "jump-back", "jump-fwd", "slow",
             "instant-replay", "live", "playback", "bookmark", "record", "export", "tracking", "stats",
             "ack", "ack-all", "snooze", "alarm-page", "monitor-alarms", "maximize", "tile-full", "next-tile",
             "prev-tile", "next-pattern", "prev-pattern", "clear-all", "cycle", "home", "refresh", "unlock",
             "pan-left", "pan-right", "tilt-up", "tilt-down", "zoom-in", "zoom-out", "preset-1", "preset-2",
             "hot-1", "hot-2", "fullscreen", "tiles-only", "next-page", "options", "hotkey-lobby", "activate"]
    sheet = actions_sheet(names); sheet.save(DOCS / "actions.png"); print("actions.png", sheet.size)
    marketplace(decks, sheet)
    for p in sorted(DOCS.glob("*.png")) + sorted(MKT.glob("*.png")): print(p.relative_to(ROOT), Image.open(p).size)
