// Render the plugin's own key SVGs (and the monochrome action/plugin icons) to PNG.
// Output: keys/*.png (144²) for docs/marketplace mockups, plugin imgs/ (icon 20/40, key 72/144, category 28/56, marketplace 256/512).
// Run from the repo root: node site/render.mjs   (needs playwright)
import { chromium } from "playwright";
import fs from "node:fs";

const SD = "plugin/com.4xsdev.genetec-sd.sdPlugin";
const src = fs.readFileSync("plugin/src/plugin.js", "utf8");
// evaluate CMD, GLYPH and the image helpers from the plugin source without the SDK import / runtime part
const body = src.replace(/^import .*$/mg, "").replace(/^export /mg, "").replace(/^function run\([\s\S]*$/m, "");
const m = new Function(body + "\nreturn { CMD, GLYPH, keyImage, hotkeyImage, activateImage };")();

// --- keys (144²) -------------------------------------------------------------
const keys = {};
for (const [id, c] of Object.entries(m.CMD)) keys[id] = m.keyImage(c.glyph, c.color, c.title, c.hotkey);
keys["activate"] = m.activateImage();
for (const [t, h] of [["Lobby", "12 Enter"], ["Parking", "13 Enter"], ["Entrance", "14 Enter"]])
  keys["hotkey-" + t.toLowerCase().replace(" ", "-")] = m.hotkeyImage(t, h, "camera");
keys["hotkey"] = m.hotkeyImage("", "", "other");   // unconfigured key as shown in the action list

// --- monochrome icons (white on transparent) --------------------------------
const mono = (inner, size) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="24 24 96 96">${inner.replace(/"C"/g, '"#ffffff"')}</svg>`;
// re-centre glyphs (drawn around y=56 on the key) to the middle of a square
const centred = (g) => `<g transform="translate(0,16)">${g}</g>`;
const icons = {
  "imgs/actions/command/icon": centred(m.GLYPH.play),
  "imgs/actions/hotkey/icon": centred(m.GLYPH.key + `<text x="72" y="67" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="700" fill="C" text-anchor="middle">F5</text>`),
  "imgs/actions/activate/icon": centred(m.GLYPH.window),
  "imgs/plugin/category": centred(m.GLYPH.tilesonly),
};
// coloured marketplace icon: Axis yellow rounded square, dark camera
const marketplace = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 144 144"><rect width="144" height="144" rx="30" fill="#2b3a4e"/><rect x="28" y="34" width="88" height="76" rx="8" fill="none" stroke="#ffffff" stroke-width="8"/><path d="M72 34v76M28 72h88" stroke="#ffffff" stroke-width="6"/><path d="M52 46v20l16-10z" fill="#ffffff"/></svg>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 512, height: 512 }, deviceScaleFactor: 1 });
async function shot(dataUrlOrSvg, size, path) {
  const srcAttr = dataUrlOrSvg.startsWith("data:") ? dataUrlOrSvg : `data:image/svg+xml;base64,${Buffer.from(dataUrlOrSvg).toString("base64")}`;
  await page.setContent(`<body style="margin:0;background:transparent"><img src="${srcAttr}" width="${size}" height="${size}"></body>`);
  await page.screenshot({ path, omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
}
fs.mkdirSync("keys", { recursive: true });
for (const [id, url] of Object.entries(keys)) await shot(url, 144, `keys/${id}.png`);
for (const [p, inner] of Object.entries(icons)) {
  const [s1, s2] = p.includes("category") ? [28, 56] : [20, 40];
  fs.mkdirSync(`${SD}/${p}`.replace(/\/[^/]+$/, ""), { recursive: true });
  await shot(mono(inner, s1), s1, `${SD}/${p}.png`);
  await shot(mono(inner, s2), s2, `${SD}/${p}@2x.png`);
}
// default key images shown in the action list
for (const [p, url] of [["command", keys.play], ["hotkey", keys.hotkey], ["activate", keys.activate]]) {
  await shot(url, 72, `${SD}/imgs/actions/${p}/key.png`);
  await shot(url, 144, `${SD}/imgs/actions/${p}/key@2x.png`);
}
await shot(marketplace, 256, `${SD}/imgs/plugin/marketplace.png`);
await shot(marketplace, 512, `${SD}/imgs/plugin/marketplace@2x.png`);
await browser.close();
console.log("rendered", Object.keys(keys).length, "keys +", Object.keys(icons).length + 1, "icons");
