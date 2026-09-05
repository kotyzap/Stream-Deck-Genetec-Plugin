#!/usr/bin/env python3
"""Generates docs/index.html (GitHub Pages) for Deck for Genetec Security Desk.
Pavel Kotyza <kotyza@gmail.com> — https://www.4xs.dev
"""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
REPO = "https://github.com/kotyzap/Stream-Deck-Genetec-Plugin"
DL = f"{REPO}/raw/main/dist/com.4xsdev.genetec-sd-kofi.streamDeckPlugin"
ACS_DOCS = "https://techdocs.genetec.com/r/en-US/Security-Desk-Getting-Started-Guide-5.13/Default-keyboard-shortcuts-in-Security-Desk"

FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400&display=swap">'

CSS = """
:root{--bg:#f7f5f1;--bg2:#efece6;--fg:#1c1b19;--fg2:#5f5c56;--line:#e0dcd4;--card:#ffffff;--accent:#2f5d9e;--accent-fg:#ffffff;--deck:#1c1c1e}
[data-theme=dark]{--bg:#161615;--bg2:#1f1f1e;--fg:#f2f0ec;--fg2:#a09c94;--line:#2c2b29;--card:#1d1d1c;--accent:#78aaff;--accent-fg:#161615}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font-family:"IBM Plex Sans",system-ui,-apple-system,sans-serif;font-size:17px;line-height:1.55;-webkit-font-smoothing:antialiased}
a{color:var(--accent);text-decoration:none}a:hover{color:var(--fg)}
h1,h2,h3{font-family:"Space Grotesk","Helvetica Neue",Arial,sans-serif;letter-spacing:-0.02em;margin:0}
code,kbd{font-family:"IBM Plex Mono",ui-monospace,Menlo,monospace;font-size:0.9em}
kbd{background:var(--bg2);border:1px solid var(--line);border-radius:6px;padding:1px 7px}
.wrap{max-width:1040px;margin:0 auto;padding:0 28px}
nav{display:flex;align-items:center;justify-content:space-between;height:68px}
.brand{display:flex;align-items:center;gap:12px;font-family:"Space Grotesk",sans-serif;font-weight:700;font-size:18px;color:var(--fg)}
.mark{width:30px;height:30px;border-radius:8px;background:#2b3a4e;color:#fff;display:grid;place-items:center}
.navlinks{display:flex;align-items:center;gap:22px;font-size:15px;color:var(--fg2)}
.navlinks a{color:var(--fg2)}.navlinks a:hover{color:var(--fg)}
.toggle{width:40px;height:26px;border-radius:13px;border:1px solid var(--line);background:var(--bg2);position:relative;cursor:pointer;padding:0}
.toggle::after{content:"";position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:var(--fg);transition:left .15s}
[data-theme=dark] .toggle::after{left:17px}
.hero{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,7fr);gap:40px;align-items:center;padding:48px 0 56px}
.hero h1{font-size:44px;line-height:1.05;font-weight:700}
.hero p{font-size:19px;color:var(--fg2);margin:20px 0 28px}
.cta{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:8px;background:var(--accent);color:var(--accent-fg);font-weight:500;padding:12px 16px;border-radius:10px;font-size:15px}
.btn:hover{color:var(--accent-fg);filter:brightness(1.08)}
.btn.ghost{background:transparent;color:var(--fg);border:1px solid var(--line)}
.meta{font-size:14px;color:var(--fg2)}
.hero img{width:100%;height:auto;display:block}
section{padding:56px 0;border-top:1px solid var(--line)}
.eyebrow{font-family:"IBM Plex Mono",monospace;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin-bottom:12px}
h2{font-size:32px;font-weight:700;margin-bottom:12px}
.lead{font-size:18px;color:var(--fg2);max-width:640px;margin:0 0 32px}
.grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:22px}
.card h3{font-size:18px;margin-bottom:8px}
.card p{margin:0;color:var(--fg2);font-size:15.5px}
.num{font-family:"IBM Plex Mono",monospace;color:var(--accent);font-size:13px;margin-bottom:10px}
.sheet{background:var(--deck);border-radius:16px;padding:20px;margin:0 0 28px}
.sheet img{display:block;width:100%;max-width:760px;margin:0 auto;height:auto}
table{width:100%;border-collapse:collapse;font-size:15.5px}
td{padding:10px 0;border-top:1px solid var(--line);vertical-align:top}
td:first-child{font-weight:500;white-space:nowrap;padding-right:22px}
td:last-child{color:var(--fg2)}
.decks{display:grid;grid-template-columns:minmax(0,3fr) minmax(0,8fr);gap:24px;align-items:end}.decks img{width:100%;height:auto;display:block;border-radius:12px}
.flow{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;align-items:stretch}
footer{padding:36px 0 48px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;font-size:14px;color:var(--fg2)}
footer a{color:var(--fg2)}footer a:hover{color:var(--fg)}
@media (max-width:820px){.decks{grid-template-columns:1fr}.hero{grid-template-columns:1fr;padding-top:24px}.hero h1{font-size:38px}.grid3,.flow{grid-template-columns:1fr}.navlinks span{display:none}}

.cardlink{display:block;text-decoration:none;color:inherit;transition:border-color .15s}
.cardlink:hover{border-color:var(--accent)}
.cardlink h3{color:var(--fg)}
"""

GH_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>'
DL_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>'
MARK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16M3 12h18"/><path d="M7 8v4l3-2z" fill="#ffffff" stroke="none"/></svg>'

BODY = f"""
<div class="wrap">
  <nav>
    <a class="brand" href="#"><span class="mark">{MARK}</span><span>Deck for Genetec Security Desk</span></a>
    <div class="navlinks"><a href="#actions">Actions</a><a href="#cameras">Cameras</a><a href="#decks">Decks</a><a href="#install">Install</a><a href="{REPO}">{GH_ICON}</a><button class="toggle" id="theme" aria-label="Toggle dark mode" onclick="toggleTheme()"></button></div>
  </nav>

  <div class="hero">
    <div>
      <h1>Security Desk on physical keys.</h1>
      <p>Play, frame step, bookmark, instant replay, acknowledge the alarm, maximize the tile, unlock the door, hot actions — Genetec Security Desk's own shortcuts on a Stream Deck, plus any camera by logical ID. Windows natively; on a Mac through Parallels, VMware or Remote Desktop.</p>
      <div class="cta">
        <a class="btn" href="{DL}">{DL_ICON}Download plugin</a>
        <a class="btn ghost" href="{REPO}">Source on GitHub</a>
      </div>
      <p class="meta" style="margin-top:16px">Windows 10+ · macOS 12+ · Stream Deck 6.9+ · one-click install with a ready profile for Mini, MK.2 and XL. Free and open source (MIT). No Security Center SDK, nothing on the server. Also on the Elgato Marketplace; this GitHub build adds a <a href="https://ko-fi.com/K3K6RR4LY">Buy me a Ko-fi</a> key.</p>
    </div>
    <img src="img/hero-decks.png" width="1600" height="1434" alt="The three bundled profiles on Stream Deck XL, MK.2 and Mini: playback, alarm, tile, PTZ, door and camera keys for Security Desk">
  </div>

  <section id="actions">
    <div class="eyebrow">Works out of the box</div>
    <h2>69 documented shortcuts, one key each.</h2>
    <p class="lead">Security Desk ships with a documented set of default keyboard shortcuts. Every <strong>Command</strong> key sends one of them to the front window, so the bundled profiles work on a stock installation. If your site changed them (Options → Keyboard shortcuts), type yours into the key. Every key prints the shortcut it sends.</p>
    <div class="sheet"><img src="img/actions.png" width="1220" height="920" alt="Key arts for camera, alarm, tile, PTZ, door, hot action and general commands"></div>
    <table>
      <tr><td>Camera</td><td>Play / pause <kbd>G</kbd> · previous / next frame <kbd>N</kbd> <kbd>M</kbd> · rewind / forward <kbd>,</kbd> <kbd>.</kbd> · jump backward / forward · slow motion · instant replay <kbd>I</kbd> · live <kbd>L</kbd> / playback <kbd>P</kbd> · bookmark <kbd>B</kbd> · toggle recording <kbd>R</kbd> · export <kbd>Ctrl</kbd> <kbd>E</kbd> · visual tracking · stream statistics.</td></tr>
      <tr><td>Alarms</td><td>Acknowledge <kbd>Space</kbd> · acknowledge all · snooze <kbd>S</kbd> · alarm page <kbd>Ctrl</kbd> <kbd>A</kbd> · monitor alarms in tile.</td></tr>
      <tr><td>Tiles</td><td>Maximize <kbd>E</kbd> · tile full screen <kbd>Alt</kbd> <kbd>Enter</kbd> · next / previous tile <kbd>Y</kbd> <kbd>T</kbd> · next / previous pattern <kbd>W</kbd> <kbd>Q</kbd> · clear all · back / forward / home · start cycling, next / previous in cycle · refresh <kbd>F5</kbd>.</td></tr>
      <tr><td>PTZ</td><td>Pan and tilt (arrows) · zoom <kbd>+</kbd> <kbd>−</kbd> · presets 1–4 (<kbd>n</kbd> <kbd>Shift</kbd> <kbd>Insert</kbd>).</td></tr>
      <tr><td>Doors · Hot actions</td><td>Unlock <kbd>U</kbd>, unlock all · hot actions 1–10 <kbd>Ctrl</kbd> <kbd>F1</kbd>–<kbd>F10</kbd> — the slots Security Desk lets you bind to anything.</td></tr>
      <tr><td>General</td><td>Full screen <kbd>F11</kbd> · tiles only <kbd>F10</kbd> · canvas / report <kbd>F9</kbd> · controls <kbd>F7</kbd> · selector <kbd>F6</kbd> · next / previous page · home page · saved tasks · options · auto lock · help.</td></tr>
      <tr><td>Activate Security Desk</td><td>Brings the client to the front so the next shortcut lands in it — the window on Windows, the hosting app (Parallels, VMware, Windows App) on a Mac. Chain it first in a Multi Action.</td></tr>
    </table>
    <p class="meta" style="margin-top:20px">Defaults from Genetec's <a href="{ACS_DOCS}">Default keyboard shortcuts in Security Desk</a> (Security Center 5.13).</p>
  </section>

  <section id="cameras">
    <div class="eyebrow">Camera wall</div>
    <h2>Any camera, one press.</h2>
    <p class="lead">Security Desk displays an entity when you type its logical ID and press Enter. The <strong>Hotkey</strong> key sends exactly that sequence: title "Lobby", shortcut <code>12 Enter</code>, and the camera lands in the selected tile. Same trick for camera sequences (<code>7 Ctrl+Enter</code>) and PTZ presets (<code>3 Shift+Insert</code>). Thirty-two keys on an XL, thirty-two cameras.</p>
  </section>

  <section id="decks">
    <div class="eyebrow">Every deck size</div>
    <h2>Mini, MK.2, XL — a profile for each.</h2>
    <p class="lead">The installer carries three ready-made profiles — <strong>Security Desk</strong> (MK.2, 5×3), <strong>Security Desk Mini</strong> (3×2) and <strong>Security Desk XL</strong> (8×4) — and Stream Deck installs only the one that matches your device. The XL carries two camera examples (Lobby, Parking) to rename to your own logical IDs.</p>
    <div class="decks"><img src="img/deck-mini.png" width="568" height="408" alt="Stream Deck Mini profile: frame step, play, bookmark, live, acknowledge"><img src="img/deck-xl.png" width="1368" height="728" alt="Stream Deck XL profile: playback row, video row, alarms and doors, tiles and cameras"></div>
  </section>

  <section id="install">
    <div class="eyebrow">Install</div>
    <h2>Two steps, once.</h2>
    <div class="grid3">
      <div class="card"><div class="num">1</div><h3>Download and double-click</h3><p><code>com.4xsdev.genetec-sd.streamDeckPlugin</code> — Stream Deck asks to install the plugin. It brings the actions and a ready profile for your deck (Mini, MK.2 or XL).</p></div>
      <div class="card"><div class="num">2</div><h3>Press Activate, then go</h3><p>Shortcuts go to the front window. Press <strong>Activate Security Desk</strong> (or click into it) and every key works on a stock installation — no configuration in Security Desk.</p></div>
      <div class="card"><div class="num">+</div><h3>Optional</h3><p>Rename the camera keys to your logical IDs; if your site customised shortcuts, type them into the affected keys. Mac: Stream Deck needs Accessibility permission once.</p></div>
    </div>
    <p class="meta" style="margin-top:24px">Limits: keystroke-based — Security Desk must be the front window, and the plugin cannot read state back (door status, alarm counts); that would need a Security Center SDK integration, a different class of project. Written to Genetec's documented defaults but not yet tested against a running Security Desk — reports welcome via <a href="{REPO}/issues">GitHub issues</a>.</p>
  </section>


  <section id="more">
    <div class="eyebrow">More from 4xs.dev</div>
    <h2>Other Stream Deck plugins.</h2>
    <p class="lead">Physical keys for the tools you already use. All free and open source.</p>
    <div class="grid3">
      <a class="card cardlink" href="https://kotyzap.github.io/Stream-Deck-Claude-Plugin/"><h3>Deck for Claude ↗</h3><p>Answer permission prompts, replies, shortcuts & status for the Claude desktop app</p></a>
      <a class="card cardlink" href="https://kotyzap.github.io/Stream-Deck-Axis-Cam-CamStreamer-Plugin/"><h3>Camera Deck for Axis &amp; CamStreamer ↗</h3><p>PTZ, presets, overlays and CamStreamer/CamSwitcher control for Axis cameras</p></a>
      <a class="card cardlink" href="https://kotyzap.github.io/Stream-Deck-ACS-Edge-Plugin/"><h3>Deck for AXIS Camera Station Edge ↗</h3><p>Recording playback, PTZ and view controls for ACS Edge</p></a>
      <a class="card cardlink" href="https://kotyzap.github.io/Stream-Deck-ACS-Pro-Plugin/"><h3>Deck for AXIS Camera Station Pro &amp; 5 ↗</h3><p>Playback, cameras, PTZ presets and any hotkey for ACS 5 &amp; Pro</p></a>
      <a class="card cardlink" href="https://kotyzap.github.io/Stream-Deck-Milestone-Plugin/"><h3>Deck for Milestone XProtect ↗</h3><p>Playback, evidence, PTZ, views and any camera or view by number for XProtect Smart Client</p></a>
    </div>
  </section>

  <footer>
    <div>Pavel Kotyza · <a href="https://www.4xs.dev">4xs.dev</a> · MIT License · <a href="https://ko-fi.com/K3K6RR4LY">Buy me a Ko-fi</a></div>
    <div>Independent project; not affiliated with Genetec Inc. or Elgato. Genetec and Security Center are trademarks of Genetec Inc.</div>
  </footer>
</div>
"""

JS = """
<script>
(function(){var t=null;try{t=localStorage.getItem('theme')}catch(e){}
if(!t&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)t='dark';
if(t==='dark')document.documentElement.setAttribute('data-theme','dark');})();
function toggleTheme(){var r=document.documentElement,d=r.getAttribute('data-theme')==='dark';
if(d)r.removeAttribute('data-theme');else r.setAttribute('data-theme','dark');
try{localStorage.setItem('theme',d?'light':'dark')}catch(e){}}
</script>"""


def write_index():
    html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Deck for Genetec Security Desk</title>
<meta name="description" content="Stream Deck plugin for Genetec Security Desk: playback, alarms, tiles, PTZ, doors, hot actions and any camera by logical ID on physical keys. Windows and Mac, profiles for Mini, MK.2 and XL.">
{FONTS}
<style>{CSS}</style>
</head>
<body>
{BODY}
{JS}
</body>
</html>
"""
    (ROOT / "docs" / "index.html").write_text(html)


if __name__ == "__main__":
    write_index()
    print("ok")
