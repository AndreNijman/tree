// Demo-GIF frame decoder (research-only, pure JS + omggif + sharp):
// downloads wiki demo GIFs, decodes ALL frames (composing disposal/transparency),
// builds labeled contact sheets of sampled frames and records GIF timing —
// qualitative rhythm only, never tick-accurate claims.
// Usage: node tools/decode-demo-gif.mjs "Gungnir" "Dao of Pow" ...
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import sharp from 'sharp';

const SDK = 'C:/Users/ethan/AppData/Local/Temp/opencode/gifsdk';
const require = createRequire(import.meta.url);
const dir = 'test-results/terraria-item-parity-20261102';
const GifReader = require(path.join(SDK, 'node_modules', 'omggif') + '/omggif.js'); // CJS via createRequire
const infobox = JSON.parse(readFileSync(path.join(dir, 'wiki-notes', 'infobox.json'), 'utf8'));
const framesDir = path.join(dir, 'wiki-notes', 'frames');
mkdirSync(framesDir, { recursive: true });

const nameOf = item => item.toLowerCase().replace(/[^a-z0-9]+/g, '_');
const results = existsSync(path.join(framesDir, 'gif-analysis.json'))
  ? JSON.parse(readFileSync(path.join(framesDir, 'gif-analysis.json'), 'utf8'))
  : { created: new Date().toISOString(), results: {} };

const SHEET = { tile: 160, labelH: 14, cols: 8, capFrames: 96 };

async function downloadGif(item, row, gifPath) {
  const candidates = [row.demos[0], row.demos[0].replace('/thumb/', '/').replace(/\/\d+px-[^/]*$/, '')];
  for (const raw of candidates) {
    const url = raw.startsWith('http') ? raw : 'https://' + raw;
    try {
      const res = await fetch(url);
      if (res.status !== 200) throw new Error('HTTP ' + res.status);
      const b = Buffer.from(await res.arrayBuffer());
      if (b.slice(0, 3).toString() !== 'GIF') throw new Error('not a GIF');
      writeFileSync(gifPath, b);
      console.log(item, '←', url, b.length + 'B');
      return url;
    } catch (e) { console.log(item, 'candidate failed:', String(e && e.message || e).slice(0, 80)); }
  }
  return null;
}

function decodeFrames(buf) {
  const reader = new GifReader.GifReader(buf);
  const w = reader.width, h = reader.height, n = reader.numFrames();
  const canvas = Buffer.alloc(w * h * 4, 255); // RGBA running canvas
  const frames = [];
  for (let f = 0; f < n; f++) {
    const info = reader.frameInfo(f);
    const patch = Buffer.alloc(w * h * 4);
    reader.decodeAndBlitFrameRGBA(f, patch); // returns undefined on success; throws on corruption
    const disposal = info.disposal || 0;
    // composite patch onto canvas honoring per-pixel alpha (RGBA blit is premasked alpha 0 = unchanged)
    for (let p = 0; p < w * h; p++) {
      const a = patch[p * 4 + 3];
      if (a !== 0) { for (let c = 0; c < 4; c++) canvas[p * 4 + c] = patch[p * 4 + c]; }
    }
    frames.push({ index: f, delayMs: (info.delay || 0) * 10, disposal, snapshot: Buffer.from(canvas) });
    // handle disposal ahead: restore-to-background clears (alpha 0) → next frame sees cleared pixels
    if (disposal === 2) {
      const { x, y, width, height } = info;
      for (let yy = y; yy < y + height; yy++) for (let xx = x; xx < x + width; xx++) {
        const p = yy * w + xx; canvas[p * 4] = 255; canvas[p * 4 + 1] = 255; canvas[p * 4 + 2] = 255; canvas[p * 4 + 3] = 0;
      }
    } else if (disposal === 3) { canvas.fill(0); }
  }
  return { w, h, n, frames };
}

for (const item of process.argv.slice(2)) {
  const row = infobox.rows.find(r => r.display === item) || infobox.rows.find(r => r.display && r.display.toLowerCase().includes(item.toLowerCase()));
  if (!row || !row.demos || !row.demos.length) { console.log(item, ': no demo in inventory'); continue; }
  const folder = path.join(framesDir, nameOf(item));
  mkdirSync(folder, { recursive: true });
  try {
    const hasMeta = existsSync(path.join(folder, 'meta.json'));
    if (hasMeta && !process.env.FORCE_GIF) { console.log(item, ': cached'); continue; }
    rmSync(folder, { recursive: true, force: true }); mkdirSync(folder, { recursive: true });
    const gifPath = path.join(folder, 'demo.gif');
    const url = await downloadGif(item, row, gifPath);
    if (!url) throw new Error('all url candidates failed');
    const t0 = Date.now();
    const { w, h, n, frames } = decodeFrames(readFileSync(gifPath));
    const decMs = Date.now() - t0;
    // sample frames evenly
    const stride = Math.ceil(n / SHEET.capFrames);
    const samples = [];
    for (let i = 0; i < n && samples.length < SHEET.capFrames; i += stride) samples.push(i);
    // write sampled PNGs & build contact sheets
    const pngBufs = new Map();
    for (const idx of samples) {
      const png = await sharp(frames[idx].snapshot, { raw: { width: w, height: h, channels: 4 } })
        .resize(SHEET.tile, SHEET.tile, { fit: 'inside', background: { r: 22, g: 22, b: 30, alpha: 1 } })
        .png().toBuffer();
      pngBufs.set(idx, png);
    }
    for (let sheetStart = 0; sheetStart < samples.length; sheetStart += SHEET.cols * 6) {
      const slice = samples.slice(sheetStart, sheetStart + SHEET.cols * 6);
      const comps = [];
      for (let k = 0; k < slice.length; k++) {
        const gidx = slice[k];
        const cx = (k % SHEET.cols) * SHEET.tile, cy = Math.floor(k / SHEET.cols) * (SHEET.tile + SHEET.labelH);
        comps.push({ input: pngBufs.get(gidx), left: cx, top: cy });
        const label = Buffer.from(`<svg width="${SHEET.tile}" height="${SHEET.labelH}"><text x="2" y="11" font-size="11" font-family="monospace" fill="#fff">f${gidx} ${frames[gidx].delayMs}ms</text></svg>`);
        comps.push({ input: label, left: cx, top: cy + SHEET.tile });
      }
      const rows = Math.ceil(slice.length / SHEET.cols);
      const sheet = path.join(folder, `sheet${String(Math.floor(sheetStart / (SHEET.cols * 6))).padStart(2, '0')}.png`);
      await sharp({ create: { width: SHEET.cols * SHEET.tile, height: rows * (SHEET.tile + SHEET.labelH), channels: 4, background: { r: 16, g: 16, b: 22, alpha: 1 } } })
        .composite(comps).png().toFile(sheet);
    }
    const info = { item, url, frames: n, size: [w, h], decodedInMs: decMs, sampled: samples, delays: frames.map(f => f.delayMs) };
    results.results[item] = info;
    writeFileSync(path.join(folder, 'meta.json'), JSON.stringify(info, null, 1));
    console.log(item, `: decoded ${n} frames (${w}x${h}) in ${decMs}ms → ${Math.ceil(samples.length / (SHEET.cols * 6))} sheets`);
  } catch (e) {
    console.log(item, 'ERROR:', String(e && e.message || e).slice(0, 160));
    continue;
  }
}
writeFileSync(path.join(framesDir, 'gif-analysis.json'), JSON.stringify(results, null, 1));
