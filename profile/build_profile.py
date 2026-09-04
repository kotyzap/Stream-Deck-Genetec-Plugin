#!/usr/bin/env python3
"""Builds the three bundled profiles (Stream Deck 7 v3 format) for Deck for Genetec Security Desk.
Pavel Kotyza <kotyza@gmail.com> — https://www.4xs.dev
"""
import json, os, shutil, uuid, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "build")
PLUGIN = {"Name": "Deck for Genetec Security Desk", "UUID": "com.4xsdev.genetec-sd", "Version": "1.0.0.0"}
UUID = "com.4xsdev.genetec-sd"

def C(command): return dict(uuid=f"{UUID}.command", name="Security Desk Command", settings={"command": command}, img=command)
def H(title, hotkey, color="camera"):
    return dict(uuid=f"{UUID}.hotkey", name="Security Desk Hotkey", settings={"title": title, "hotkey": hotkey, "color": color},
                img="hotkey-" + title.lower().replace(" ", "-"))
def A(): return dict(uuid=f"{UUID}.activate", name="Activate Security Desk", settings={}, img="activate")

# Model codes: 20GAA9902 = Stream Deck MK.2 (15 keys), 20GAI9901 = Mini (6), 20GAT9901 = XL (32).
LAYOUTS = {
    "Security Desk": dict(model="20GAA9902", device_type=0, cols=5, rows=3, keys={
        "0,0": C("rewind"), "1,0": C("prev-frame"), "2,0": C("play"), "3,0": C("next-frame"), "4,0": C("forward"),
        "0,1": C("bookmark"), "1,1": C("instant-replay"), "2,1": C("live"), "3,1": C("playback"), "4,1": C("export"),
        "0,2": C("ack"), "1,2": C("snooze"), "2,2": C("maximize"), "3,2": C("next-tile"), "4,2": A(),
    }),
    "Security Desk Mini": dict(model="20GAI9901", device_type=1, cols=3, rows=2, keys={
        "0,0": C("prev-frame"), "1,0": C("play"), "2,0": C("next-frame"),
        "0,1": C("bookmark"), "1,1": C("live"), "2,1": C("ack"),
    }),
    "Security Desk XL": dict(model="20GAT9901", device_type=2, cols=8, rows=4, keys={
        "0,0": C("rewind"), "1,0": C("prev-frame"), "2,0": C("play"), "3,0": C("next-frame"), "4,0": C("forward"), "5,0": C("slow"), "6,0": C("instant-replay"), "7,0": C("export"),
        "0,1": C("bookmark"), "1,1": C("record"), "2,1": C("live"), "3,1": C("playback"), "4,1": C("jump-back"), "5,1": C("jump-fwd"), "6,1": C("tracking"), "7,1": C("stats"),
        "0,2": C("ack"), "1,2": C("ack-all"), "2,2": C("snooze"), "3,2": C("alarm-page"), "4,2": C("unlock"), "5,2": C("hot-1"), "6,2": C("hot-2"), "7,2": C("hot-3"),
        "0,3": C("prev-tile"), "1,3": C("next-tile"), "2,3": C("maximize"), "3,3": C("next-pattern"), "4,3": C("clear-all"), "5,3": H("Lobby", "12 Enter"), "6,3": H("Parking", "13 Enter"), "7,3": A(),
    }),
}

def action(spec):
    return {"ActionID": str(uuid.uuid4()), "LinkedTitle": True, "Resources": None, "State": 0,
            "Name": spec["name"], "UUID": spec["uuid"], "Plugin": PLUGIN, "Settings": spec["settings"],
            "States": [{"FontFamily": "", "FontSize": 12, "FontStyle": "", "FontUnderline": False,
                        "OutlineThickness": 2, "ShowTitle": False, "TitleAlignment": "middle", "TitleColor": "#ffffff"}]}

def build(name, layout):
    shutil.rmtree(OUT, ignore_errors=True)
    prof, page = str(uuid.uuid4()).upper(), str(uuid.uuid4()).upper()
    root = os.path.join(OUT, f"{prof}.sdProfile"); pdir = os.path.join(root, "Profiles", page)
    os.makedirs(os.path.join(pdir, "Images")); os.makedirs(os.path.join(root, "Images"))
    json.dump({"Controllers": [{"Actions": {k: action(v) for k, v in layout["keys"].items()}, "Type": "Keypad"}], "Icon": "", "Name": ""},
              open(os.path.join(pdir, "manifest.json"), "w"), indent=2)
    json.dump({"Device": {"Model": layout["model"], "UUID": ""}, "Name": name,
               "Pages": {"Current": page.lower(), "Default": page.lower(), "Pages": [page.lower()]}, "Version": "3.0"},
              open(os.path.join(root, "manifest.json"), "w"), indent=2)
    z = os.path.join(HERE, f"{name}.streamDeckProfile")
    with zipfile.ZipFile(z, "w", zipfile.ZIP_DEFLATED) as zf:
        for dp, _, fs in os.walk(root):
            for f in fs: zf.write(os.path.join(dp, f), os.path.relpath(os.path.join(dp, f), OUT))
    print("wrote", z)

if __name__ == "__main__":
    for n, l in LAYOUTS.items(): build(n, l)
    shutil.rmtree(OUT, ignore_errors=True)
