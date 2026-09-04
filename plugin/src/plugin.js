// Deck for Genetec Security Desk — Stream Deck plugin
// Pavel Kotyza <kotyza@gmail.com> — https://www.4xs.dev
//
// Security Desk (Genetec Security Center's operator client) is a Windows application with a documented set of
// default keyboard shortcuts (Options → Keyboard shortcuts). Each key sends one of them to the front window:
// Windows via SendKeys, macOS via System Events (Mac operators run Security Desk in Parallels / VMware / Remote
// Desktop, where ⌃ arrives as Ctrl). Every key can be re-mapped in Security Desk; the key's Hotkey field follows.
import streamDeck, { SingletonAction } from "@elgato/streamdeck";
import { execFile } from "node:child_process";
import { platform } from "node:os";

const PLUGIN = "com.4xsdev.genetec-sd";
const AMBER = "#ffcc33", BLUE = "#4da3ff", GREEN = "#34c759", RED = "#ff453a", PURPLE = "#bf5af2", GREY = "#9a9a9e";

// ---------------------------------------------------------------- commands
// Defaults from "Default keyboard shortcuts in Security Desk" (Security Center 5.13). A hotkey is a space-separated
// sequence of combos: "Ctrl+Shift+N", "12 Enter", "3 Shift+Insert".
const CMD = {
    // Camera
    "play":          { title: "Play /\nPause",       color: AMBER, glyph: "play",     hotkey: "G" },
    "prev-frame":    { title: "Previous\nframe",     color: AMBER, glyph: "back",     hotkey: "N" },
    "next-frame":    { title: "Next\nframe",         color: AMBER, glyph: "fwd",      hotkey: "M" },
    "rewind":        { title: "Rewind",              color: AMBER, glyph: "rewind",   hotkey: "," },
    "forward":       { title: "Forward",             color: AMBER, glyph: "forward",  hotkey: "." },
    "jump-back":     { title: "Jump\nbackward",      color: AMBER, glyph: "jumpback", hotkey: "Ctrl+Shift+N" },
    "jump-fwd":      { title: "Jump\nforward",       color: AMBER, glyph: "jumpfwd",  hotkey: "Ctrl+Shift+M" },
    "slow":          { title: "Slow\nmotion",        color: AMBER, glyph: "slow",     hotkey: "Shift+Minus" },
    "instant-replay":{ title: "Instant\nreplay",     color: AMBER, glyph: "replay",   hotkey: "I" },
    "live":          { title: "Switch\nto live",     color: AMBER, glyph: "live",     hotkey: "L" },
    "playback":      { title: "Switch to\nplayback", color: AMBER, glyph: "playback", hotkey: "P" },
    "bookmark":      { title: "Add\nbookmark",       color: AMBER, glyph: "flag",     hotkey: "B" },
    "record":        { title: "Toggle\nrecording",   color: AMBER, glyph: "record",   hotkey: "R" },
    "export":        { title: "Export\nvideo",       color: AMBER, glyph: "export",   hotkey: "Ctrl+E" },
    "tracking":      { title: "Visual\ntracking",    color: AMBER, glyph: "track",    hotkey: "Alt+F" },
    "stats":         { title: "Stream\nstatistics",  color: AMBER, glyph: "stats",    hotkey: "Ctrl+Shift+A" },
    // Alarms
    "ack":           { title: "Acknowledge\nalarm",  color: RED,   glyph: "bellok",   hotkey: "Space" },
    "ack-all":       { title: "Acknowledge\nall",    color: RED,   glyph: "bellall",  hotkey: "Ctrl+Shift+Space" },
    "snooze":        { title: "Snooze\nalarm",       color: RED,   glyph: "bellzz",   hotkey: "S" },
    "alarm-page":    { title: "Alarm\npage",         color: RED,   glyph: "bell",     hotkey: "Ctrl+A" },
    "monitor-alarms":{ title: "Monitor\nalarms",     color: RED,   glyph: "belleye",  hotkey: "Alt+A" },
    // Tiles
    "maximize":      { title: "Maximize\ntile",      color: BLUE,  glyph: "expand",   hotkey: "E" },
    "tile-full":     { title: "Tile\nfull screen",   color: BLUE,  glyph: "fullscreen", hotkey: "Alt+Enter" },
    "next-tile":     { title: "Next\ntile",          color: BLUE,  glyph: "cellnext", hotkey: "Y" },
    "prev-tile":     { title: "Previous\ntile",      color: BLUE,  glyph: "cellprev", hotkey: "T" },
    "next-pattern":  { title: "Next\npattern",       color: BLUE,  glyph: "pattern",  hotkey: "W" },
    "prev-pattern":  { title: "Previous\npattern",   color: BLUE,  glyph: "patternprev", hotkey: "Q" },
    "clear-all":     { title: "Clear\nall tiles",    color: BLUE,  glyph: "clear",    hotkey: "Ctrl+Backspace" },
    "back":          { title: "Back",                color: BLUE,  glyph: "histback", hotkey: "Alt+Left" },
    "fwd":           { title: "Forward",             color: BLUE,  glyph: "histfwd",  hotkey: "Alt+Right" },
    "home":          { title: "Home",                color: BLUE,  glyph: "home",     hotkey: "Alt+Home" },
    "cycle":         { title: "Start\ncycling",      color: BLUE,  glyph: "cycle",    hotkey: "Ctrl+Up" },
    "cycle-next":    { title: "Next in\ncycle",      color: BLUE,  glyph: "cyclenext", hotkey: "Ctrl+Right" },
    "cycle-prev":    { title: "Previous\nin cycle",  color: BLUE,  glyph: "cycleprev", hotkey: "Ctrl+Left" },
    "refresh":       { title: "Refresh",             color: BLUE,  glyph: "refresh",  hotkey: "F5" },
    // PTZ
    "pan-left":      { title: "Pan left",            color: GREEN, glyph: "left",     hotkey: "Left" },
    "pan-right":     { title: "Pan right",           color: GREEN, glyph: "right",    hotkey: "Right" },
    "tilt-up":       { title: "Tilt up",             color: GREEN, glyph: "up",       hotkey: "Up" },
    "tilt-down":     { title: "Tilt down",           color: GREEN, glyph: "down",     hotkey: "Down" },
    "zoom-in":       { title: "Zoom in",             color: GREEN, glyph: "zoomin",   hotkey: "Plus" },
    "zoom-out":      { title: "Zoom out",            color: GREEN, glyph: "zoomout",  hotkey: "Minus" },
    "preset-1":      { title: "Preset 1",            color: GREEN, glyph: "p1",       hotkey: "1 Shift+Insert" },
    "preset-2":      { title: "Preset 2",            color: GREEN, glyph: "p2",       hotkey: "2 Shift+Insert" },
    "preset-3":      { title: "Preset 3",            color: GREEN, glyph: "p3",       hotkey: "3 Shift+Insert" },
    "preset-4":      { title: "Preset 4",            color: GREEN, glyph: "p4",       hotkey: "4 Shift+Insert" },
    // Doors
    "unlock":        { title: "Unlock\ndoor",        color: PURPLE, glyph: "door",    hotkey: "U" },
    "unlock-all":    { title: "Unlock\nall doors",   color: PURPLE, glyph: "doorall", hotkey: "Ctrl+Shift+U" },
    // General
    "fullscreen":    { title: "Full\nscreen",        color: GREY,  glyph: "fullscreen", hotkey: "F11" },
    "tiles-only":    { title: "Tiles\nonly",         color: GREY,  glyph: "tilesonly", hotkey: "F10" },
    "layout":        { title: "Canvas /\nreport",    color: GREY,  glyph: "layout",   hotkey: "F9" },
    "controls":      { title: "Controls",            color: GREY,  glyph: "controls", hotkey: "F7" },
    "selector":      { title: "Selector",            color: GREY,  glyph: "selector", hotkey: "F6" },
    "next-page":     { title: "Next\npage",          color: GREY,  glyph: "tabnext",  hotkey: "Ctrl+Tab" },
    "prev-page":     { title: "Previous\npage",      color: GREY,  glyph: "tabprev",  hotkey: "Ctrl+Shift+Tab" },
    "homepage":      { title: "Home\npage",          color: GREY,  glyph: "home",     hotkey: "Ctrl+Grave" },
    "saved-tasks":   { title: "Saved\ntasks",        color: GREY,  glyph: "tasks",    hotkey: "Ctrl+N" },
    "options":       { title: "Options",             color: GREY,  glyph: "gear",     hotkey: "Ctrl+O" },
    "autolock":      { title: "Auto\nlock",          color: GREY,  glyph: "lock",     hotkey: "Ctrl+Shift+L" },
    "help":          { title: "Help",                color: GREY,  glyph: "help",     hotkey: "F1" },
};
for (let n = 1; n <= 10; n++) CMD[`hot-${n}`] = { title: `Hot\naction ${n}`, color: PURPLE, glyph: `hot${n}`, hotkey: `Ctrl+F${n}` };
export { CMD };

// ---------------------------------------------------------------- key art
// Glyphs: stroked/filled paths on a 144×144 key, centred around (72,56). "C" is replaced by the key colour.
const S = 'fill="none" stroke="C" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"';
const S7 = 'fill="none" stroke="C" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"';
const BELL = `<path d="M54 70V54a18 18 0 0 1 36 0v16l6 8H48z" fill="C"/><path d="M64 84a8 8 0 0 0 16 0" fill="C"/>`;
const BRACKETS = `<path d="M40 40h-2v-6h10M104 40h2v-6H96M40 72h-2v6h10M104 72h2v6H96" ${S}/>`;
const CORNERS = `<path d="M40 44v-8h8M104 44v-8h-8M40 68v8h8M104 68v8h-8" ${S}/>`;
const GLYPH = {
    play:     `<path d="M50 32v48l38-24z" fill="C"/><rect x="94" y="32" width="8" height="48" fill="C" opacity=".55"/>`,
    back:     `<path d="M84 34L58 56l26 22" ${S}/>`,
    fwd:      `<path d="M60 34l26 22-26 22" ${S}/>`,
    rewind:   `<path d="M72 36v40L44 56zM100 36v40L72 56z" fill="C"/>`,
    forward:  `<path d="M44 36v40l28-20zM72 36v40l28-20z" fill="C"/>`,
    jumpback: `<path d="M96 36v40L66 56z" fill="C"/><rect x="46" y="36" width="8" height="40" fill="C"/>`,
    jumpfwd:  `<path d="M48 36v40l30-20z" fill="C"/><rect x="90" y="36" width="8" height="40" fill="C"/>`,
    slow:     `<path d="M46 36v40l30-20z" fill="C"/><text x="100" y="70" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="700" fill="C" text-anchor="middle">½</text>`,
    replay:   `<path d="M52 56a20 20 0 1 0 6-14" ${S}/><path d="M50 30v14h14" ${S}/>`,
    live:     `<circle cx="72" cy="56" r="10" fill="C"/><circle cx="72" cy="56" r="22" fill="none" stroke="C" stroke-width="6" opacity=".55"/>`,
    playback: `<circle cx="72" cy="56" r="22" fill="none" stroke="C" stroke-width="7"/><path d="M72 42v14l10 8" ${S7}/>`,
    flag:     `<path d="M52 82V32" ${S}/><path d="M52 34h38l-8 12 8 12H52z" fill="C"/>`,
    record:   `<circle cx="72" cy="56" r="20" fill="C"/>`,
    export:   `<path d="M46 62v16a4 4 0 0 0 4 4h44a4 4 0 0 0 4-4V62" ${S7}/><path d="M72 66V30M58 44l14-14 14 14" ${S}/>`,
    track:    `${CORNERS}<circle cx="72" cy="56" r="9" fill="C"/>`,
    stats:    `<rect x="42" y="58" width="12" height="22" fill="C"/><rect x="66" y="42" width="12" height="38" fill="C"/><rect x="90" y="32" width="12" height="48" fill="C"/>`,
    bell:     BELL,
    bellok:   `${BELL}<path d="M92 34l6 6 12-14" fill="none" stroke="#1c1c1e" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M92 34l6 6 12-14" ${S7}/>`,
    bellall:  `<g transform="translate(-16,10) scale(.8)">${BELL}</g><g transform="translate(40,10) scale(.8)">${BELL}</g>`,
    bellzz:   `${BELL}<text x="106" y="44" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="700" fill="C" text-anchor="middle">z</text>`,
    belleye:  `<g transform="translate(-6,4) scale(.75)">${BELL}</g><ellipse cx="94" cy="72" rx="16" ry="10" fill="none" stroke="C" stroke-width="6"/><circle cx="94" cy="72" r="4" fill="C"/>`,
    expand:   `<path d="M46 46V34h12M98 46V34H86M46 66v12h12M98 66v12H86" ${S}/><rect x="60" y="48" width="24" height="16" fill="C"/>`,
    fullscreen:`<path d="M40 48V32h16M104 48V32H88M40 64v16h16M104 64v16H88" ${S}/>`,
    cellnext: `<rect x="40" y="36" width="28" height="18" fill="none" stroke="C" stroke-width="5"/><rect x="76" y="36" width="28" height="18" fill="C"/><rect x="40" y="60" width="28" height="18" fill="none" stroke="C" stroke-width="5"/><rect x="76" y="60" width="28" height="18" fill="none" stroke="C" stroke-width="5"/>`,
    cellprev: `<rect x="40" y="36" width="28" height="18" fill="C"/><rect x="76" y="36" width="28" height="18" fill="none" stroke="C" stroke-width="5"/><rect x="40" y="60" width="28" height="18" fill="none" stroke="C" stroke-width="5"/><rect x="76" y="60" width="28" height="18" fill="none" stroke="C" stroke-width="5"/>`,
    pattern:  `<rect x="40" y="34" width="20" height="20" rx="3" fill="C"/><rect x="66" y="34" width="38" height="20" rx="3" fill="C" opacity=".5"/><rect x="40" y="60" width="64" height="18" rx="3" fill="C" opacity=".5"/><path d="M110 40l6 6-6 6" ${S7}/>`,
    patternprev:`<rect x="84" y="34" width="20" height="20" rx="3" fill="C"/><rect x="40" y="34" width="38" height="20" rx="3" fill="C" opacity=".5"/><rect x="40" y="60" width="64" height="18" rx="3" fill="C" opacity=".5"/><path d="M34 40l-6 6 6 6" ${S7}/>`,
    clear:    `<rect x="42" y="36" width="60" height="40" rx="6" fill="none" stroke="C" stroke-width="7"/><path d="M60 46l24 20M84 46L60 66" ${S7}/>`,
    histback: `<path d="M96 56H50M66 40L50 56l16 16" ${S}/>`,
    histfwd:  `<path d="M48 56h46M78 40l16 16-16 16" ${S}/>`,
    home:     `<path d="M40 60l32-28 32 28" ${S}/><path d="M50 56v24h44V56" ${S7}/>`,
    cycle:    `<path d="M52 66a22 22 0 1 0 2-20" ${S}/><path d="M50 32v16h16" ${S}/>`,
    cyclenext:`<path d="M52 66a22 22 0 1 0 2-20" ${S7} opacity=".6"/><path d="M62 44l22 12-22 12z" fill="C"/>`,
    cycleprev:`<path d="M92 66a22 22 0 1 1-2-20" ${S7} opacity=".6"/><path d="M82 44L60 56l22 12z" fill="C"/>`,
    refresh:  `<path d="M94 46a24 24 0 1 0 4 20" ${S}/><path d="M96 28v18H78" ${S}/>`,
    left:     `<path d="M94 56H52M72 34L50 56l22 22" ${S}/>`,
    right:    `<path d="M50 56h42M72 34l22 22-22 22" ${S}/>`,
    up:       `<path d="M72 78V36M50 56l22-22 22 22" ${S}/>`,
    down:     `<path d="M72 34v42M50 56l22 22 22-22" ${S}/>`,
    zoomin:   `<circle cx="66" cy="52" r="20" fill="none" stroke="C" stroke-width="8"/><path d="M81 67l16 16" stroke="C" stroke-width="9" stroke-linecap="round"/><path d="M66 42v20M56 52h20" stroke="C" stroke-width="7" stroke-linecap="round"/>`,
    zoomout:  `<circle cx="66" cy="52" r="20" fill="none" stroke="C" stroke-width="8"/><path d="M81 67l16 16" stroke="C" stroke-width="9" stroke-linecap="round"/><path d="M56 52h20" stroke="C" stroke-width="7" stroke-linecap="round"/>`,
    door:     `<rect x="44" y="30" width="40" height="52" rx="4" fill="none" stroke="C" stroke-width="7"/><circle cx="74" cy="58" r="4" fill="C"/><path d="M92 50a8 8 0 0 1 16 0v8" ${S7}/>`,
    doorall:  `<rect x="34" y="34" width="30" height="46" rx="3" fill="none" stroke="C" stroke-width="6"/><rect x="80" y="34" width="30" height="46" rx="3" fill="none" stroke="C" stroke-width="6"/><circle cx="56" cy="58" r="3.5" fill="C"/><circle cx="102" cy="58" r="3.5" fill="C"/>`,
    tilesonly:`<rect x="38" y="34" width="68" height="46" rx="4" fill="none" stroke="C" stroke-width="6"/><path d="M72 34v46M38 57h68" stroke="C" stroke-width="5"/>`,
    layout:   `<rect x="36" y="34" width="40" height="46" rx="4" fill="none" stroke="C" stroke-width="6"/><path d="M84 40h24M84 52h24M84 64h24M84 76h24" stroke="C" stroke-width="6" stroke-linecap="round"/>`,
    controls: `<path d="M44 40h56M44 56h56M44 72h56" stroke="C" stroke-width="6" stroke-linecap="round"/><circle cx="60" cy="40" r="6" fill="C"/><circle cx="86" cy="56" r="6" fill="C"/><circle cx="68" cy="72" r="6" fill="C"/>`,
    selector: `<rect x="36" y="34" width="26" height="46" rx="4" fill="C" opacity=".55"/><rect x="68" y="34" width="40" height="46" rx="4" fill="none" stroke="C" stroke-width="6"/>`,
    tabnext:  `<path d="M40 40h40a6 6 0 0 1 6 6v34H40z" fill="none" stroke="C" stroke-width="7"/><path d="M86 40h18v40H86" fill="none" stroke="C" stroke-width="7" opacity=".5"/><path d="M60 52l10 8-10 8" ${S}/>`,
    tabprev:  `<path d="M104 40H64a6 6 0 0 0-6 6v34h46z" fill="none" stroke="C" stroke-width="7"/><path d="M58 40H40v40h18" fill="none" stroke="C" stroke-width="7" opacity=".5"/><path d="M84 52l-10 8 10 8" ${S}/>`,
    tasks:    `<path d="M44 40h6l4 6 8-12M64 42h36M44 62h6l4 6 8-12M64 64h36" ${S7}/>`,
    gear:     `<circle cx="72" cy="56" r="12" fill="none" stroke="C" stroke-width="8"/><path d="M72 28v10M72 74v10M44 56h10M90 56h10M52 36l7 7M85 69l7 7M92 36l-7 7M59 69l-7 7" stroke="C" stroke-width="8" stroke-linecap="round"/>`,
    lock:     `<rect x="50" y="52" width="44" height="32" rx="6" fill="C"/><path d="M58 52V42a14 14 0 0 1 28 0v10" ${S7}/>`,
    help:     `<circle cx="72" cy="56" r="24" fill="none" stroke="C" stroke-width="8"/><path d="M63 49a9 9 0 1 1 13 8c-3 2-4 4-4 7" fill="none" stroke="C" stroke-width="7" stroke-linecap="round"/><circle cx="72" cy="70" r="4" fill="C"/>`,
    window:   `<rect x="40" y="36" width="64" height="44" rx="6" fill="none" stroke="C" stroke-width="8"/><path d="M40 48h64" stroke="C" stroke-width="6"/><circle cx="49" cy="42" r="2.5" fill="C"/><circle cx="57" cy="42" r="2.5" fill="C"/>`,
    key:      `<rect x="36" y="38" width="72" height="40" rx="8" fill="none" stroke="C" stroke-width="7"/>`,
};
for (const n of [1, 2, 3, 4]) GLYPH[`p${n}`] = `${BRACKETS}<text x="72" y="70" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="700" fill="C" text-anchor="middle">${n}</text>`;
for (let n = 1; n <= 10; n++) GLYPH[`hot${n}`] = `<path d="M74 26L48 62h18l-6 30 26-36H68z" fill="C"/><text x="102" y="84" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="700" fill="C" text-anchor="middle">${n}</text>`;

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
/** Key: colour bar, glyph, title (≤2 lines) and the hotkey in small mono at the bottom. `inner` overrides the glyph (Hotkey key). */
function keyImage(glyph, color, title, hotkey, inner) {
    const lines = String(title).split("\n").slice(0, 2);
    const size = Math.max(...lines.map((l) => l.length)) <= 10 ? 18 : 15;
    const y0 = lines.length === 1 ? 108 : 100;
    const text = lines.map((l, i) =>
        `<text x="72" y="${y0 + i * (size + 1)}" font-family="Helvetica, Arial, sans-serif" font-size="${size}" font-weight="700" fill="#f2f2f7" text-anchor="middle">${esc(l)}</text>`).join("");
    const hk = hotkey ? `<text x="72" y="135" font-family="Menlo, Consolas, monospace" font-size="11" fill="#8e8e93" text-anchor="middle">${esc(hotkey)}</text>` : "";
    const art = (inner ?? GLYPH[glyph] ?? "").replace(/"C"/g, `"${color}"`);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
  <rect width="144" height="144" rx="18" fill="#1c1c1e"/><rect width="144" height="10" fill="${color}"/>${art}${text}${hk}</svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
const HOTKEY_COLORS = { camera: BLUE, recording: AMBER, ptz: GREEN, alarm: RED, door: PURPLE };
/** Hotkey key: rounded key shape with the last key name inside, title + full sequence below. */
function hotkeyImage(title, hotkey, colorName) {
    const color = HOTKEY_COLORS[colorName] ?? GREY;
    const last = hotkey ? hotkey.trim().split(/\s+/).pop() : "";
    const label = last ? last.split("+").filter(Boolean).pop() ?? "+" : "?";
    const inner = `<rect x="36" y="34" width="72" height="44" rx="8" fill="none" stroke="C" stroke-width="7"/><text x="72" y="66" font-family="Helvetica, Arial, sans-serif" font-size="${label.length > 3 ? 20 : 28}" font-weight="700" fill="C" text-anchor="middle">${esc(label)}</text>`;
    return keyImage(null, color, title || "Hotkey", hotkey || "set hotkey", inner);
}
const activateImage = () => keyImage("window", GREY, "Activate\nSecurity Desk", "");
export { GLYPH, keyImage, hotkeyImage, activateImage };

// ---------------------------------------------------------------- hotkeys → keystrokes
// A hotkey is a space-separated sequence of combos ("12 Enter", "3 Shift+Insert"); a combo is Modifier+…+Key.
// A bare digit run like "12" is typed digit by digit.
function parseCombo(combo) {
    const parts = combo.split("+").map((p) => p.trim()).filter(Boolean);
    if (/\+\s*$/.test(combo.trim())) parts.push("+");
    if (!parts.length) throw new Error("empty hotkey");
    const key = parts.pop();
    return { mods: parts.map((m) => m.toLowerCase()), key };
}
function sequence(hotkey) {
    const out = [];
    for (const combo of String(hotkey).trim().split(/\s+/).filter(Boolean)) {
        const { mods, key } = parseCombo(combo);
        if (!mods.length && /^\d{2,}$/.test(key)) for (const d of key) out.push({ mods, key: d });
        else out.push({ mods, key });
    }
    if (!out.length) throw new Error("empty hotkey");
    return out;
}

// Windows: SendKeys. Ctrl ^, Alt %, Shift +.
const NAMED = {
    space: " ", enter: "{ENTER}", return: "{ENTER}", esc: "{ESC}", escape: "{ESC}", tab: "{TAB}", backspace: "{BACKSPACE}",
    delete: "{DELETE}", del: "{DELETE}", insert: "{INSERT}", ins: "{INSERT}", home: "{HOME}", end: "{END}", pageup: "{PGUP}", pagedown: "{PGDN}",
    up: "{UP}", down: "{DOWN}", left: "{LEFT}", right: "{RIGHT}", plus: "{+}", minus: "-", comma: ",", period: ".", grave: "`", "+": "{+}", "-": "-",
    "^": "{^}", "%": "{%}", "~": "{~}", "(": "{(}", ")": "{)}", "[": "{[}", "]": "{]}", "{": "{{}", "}": "{}}",
};
const WIN_MOD = { ctrl: "^", control: "^", alt: "%", shift: "+" };
const badMod = (x) => { throw new Error(`unknown modifier "${x}"`); };
export function toSendKeys(hotkey) {
    return sequence(hotkey).map(({ mods, key }) => {
        const m = mods.map((x) => WIN_MOD[x] ?? badMod(x)).join("");
        const l = key.toLowerCase();
        let k;
        if (NAMED[l] !== undefined) k = NAMED[l];
        else if (/^f([1-9]|1[0-6])$/.test(l)) k = `{${l.toUpperCase()}}`;
        else if (key.length === 1) k = l;
        else throw new Error(`unknown key "${key}"`);
        return m + k;
    }).join("");
}

// macOS: System Events, one statement per combo.
const MAC_CODE = { f1: 122, f2: 120, f3: 99, f4: 118, f5: 96, f6: 97, f7: 98, f8: 100, f9: 101, f10: 109, f11: 103, f12: 111,
    left: 123, right: 124, down: 125, up: 126, esc: 53, escape: 53, tab: 48, enter: 36, return: 36, space: 49, backspace: 51,
    delete: 117, del: 117, home: 115, end: 119, pageup: 116, pagedown: 121, insert: 114, ins: 114 };
const MAC_MOD = { ctrl: "control", control: "control", alt: "option", shift: "shift" };
const MAC_CHAR = { plus: "+", minus: "-", comma: ",", period: ".", grave: "`" };
export function toAppleScript(hotkey) {
    return sequence(hotkey).map(({ mods, key }) => {
        const m = mods.map((x) => MAC_MOD[x] ?? badMod(x));
        const using = m.length ? ` using {${m.map((x) => x + " down").join(", ")}}` : "";
        const l = key.toLowerCase();
        if (MAC_CODE[l] !== undefined) return `key code ${MAC_CODE[l]}${using}`;
        const ch = MAC_CHAR[l] ?? (key.length === 1 ? l : null);
        if (ch === null) throw new Error(`unknown key "${key}"`);
        return `keystroke "${ch.replace(/(["\\])/g, "\\$1")}"${using}`;
    });
}

function run(cmd, args) {
    return new Promise((resolve, reject) => execFile(cmd, args, (err) => (err ? reject(err) : resolve())));
}
const ps = (script) => run("powershell", ["-NoProfile", "-NonInteractive", "-WindowStyle", "Hidden", "-Command", script]);

async function sendHotkey(hotkey) {
    if (platform() === "win32") {
        const keys = toSendKeys(hotkey).replace(/'/g, "''");
        await ps(`Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('${keys}')`);
    } else if (platform() === "darwin") {
        const stmts = toAppleScript(hotkey).map((s) => `tell application "System Events" to ${s}`);
        await run("osascript", stmts.flatMap((s) => ["-e", s]));
    } else throw new Error(`unsupported platform ${platform()}`);
}

const DEFAULT_TARGET = { win32: "Security Desk", darwin: "Parallels Desktop" };
async function activateWindow(target) {
    if (platform() === "win32") {
        const t = String(target).replace(/'/g, "''");
        // AppActivate matches a window whose title starts with or ends with the string; fall back to the process' main window.
        await ps(`$ok = (New-Object -ComObject WScript.Shell).AppActivate('${t}'); if (-not $ok) { $p = Get-Process | Where-Object { $_.MainWindowTitle -like '*${t}*' } | Select-Object -First 1; if ($p) { (New-Object -ComObject WScript.Shell).AppActivate($p.Id) | Out-Null } else { exit 2 } }`);
    } else if (platform() === "darwin") {
        // the app hosting Security Desk: Parallels Desktop, VMware Fusion, Windows App (Remote Desktop)
        await run("osascript", ["-e", `tell application "${String(target).replace(/(["\\])/g, "\\$1")}" to activate`]);
    } else throw new Error(`unsupported platform ${platform()}`);
}

// ---------------------------------------------------------------- actions
function fail(ev, e) { streamDeck.logger.error(`${ev.action.manifestId}: ${e.message}`); ev.action.showAlert(); }

/** Command — one Security Desk action from the list; hotkey defaults to Genetec's default, overridable per key. */
class Command extends SingletonAction {
    manifestId = `${PLUGIN}.command`;
    onWillAppear(ev) { this.#paint(ev.action, ev.payload.settings); }
    onDidReceiveSettings(ev) { this.#paint(ev.action, ev.payload.settings); }
    async onKeyDown(ev) {
        const { hotkey } = resolve(ev.payload.settings);
        try { await sendHotkey(hotkey); } catch (e) { fail(ev, e); }
    }
    #paint(a, s) { const { cmd, hotkey } = resolve(s); a.setImage(keyImage(cmd.glyph, cmd.color, cmd.title, hotkey)); }
}
function resolve(s) {
    const cmd = CMD[s.command] ?? CMD.play;
    const hotkey = (s.hotkey ?? "").trim() || cmd.hotkey;
    return { cmd, hotkey };
}

/** Hotkey — any combo or sequence with your own title: "<logical ID> Enter" displays an entity, "<n> Shift+Insert" a preset. */
class Hotkey extends SingletonAction {
    manifestId = `${PLUGIN}.hotkey`;
    onWillAppear(ev) { this.#paint(ev.action, ev.payload.settings); }
    onDidReceiveSettings(ev) { this.#paint(ev.action, ev.payload.settings); }
    async onKeyDown(ev) {
        const hotkey = (ev.payload.settings.hotkey ?? "").trim();
        if (!hotkey) return fail(ev, new Error("no hotkey set"));
        try { await sendHotkey(hotkey); } catch (e) { fail(ev, e); }
    }
    #paint(a, s) { a.setImage(hotkeyImage((s.title ?? "").trim(), (s.hotkey ?? "").trim(), s.color)); }
}

/** Activate — brings Security Desk to the front so the next hotkey lands there. */
class Activate extends SingletonAction {
    manifestId = `${PLUGIN}.activate`;
    onWillAppear(ev) { ev.action.setImage(activateImage()); }
    async onKeyDown(ev) {
        const target = (ev.payload.settings.title ?? "").trim() || DEFAULT_TARGET[platform()] || "Security Desk";
        try { await activateWindow(target); } catch (e) { fail(ev, e); }
    }
}

/** Ko-fi — GitHub build only (Marketplace forbids sponsor links inside plugins; plugin/package.sh --kofi adds it). */
class Kofi extends SingletonAction {
    manifestId = `${PLUGIN}.kofi`;
    onKeyDown() { streamDeck.system.openUrl("https://ko-fi.com/K3K6RR4LY"); }
}

streamDeck.actions.registerAction(new Command());
streamDeck.actions.registerAction(new Hotkey());
streamDeck.actions.registerAction(new Activate());
streamDeck.actions.registerAction(new Kofi());
streamDeck.connect();
