// YouTube video sweep: fetch metadata + auto-caption transcripts per representative item.
// Uses yt-dlp (pip-managed) for metadata/subs; no video download (--skip-download all the way).
// Honest process: transcripts (auto-ASR) + wiki pages; visual frames are NOT watched here.
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const dir = 'test-results/terraria-item-parity-20261102/wiki-notes/video';
mkdirSync(dir, { recursive: true });
const OUT = path.join(dir, 'sweep.json');
const prior = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : { started: new Date().toISOString(), entries: [] };
const byItem = new Map(prior.entries.map(e => [e.item, e]));

const PY = 'C:\\Users\\ethan\\AppData\\Local\\Python\\pythoncore-3.14-64\\python.exe';
const WAVE = [
  { item: "Light's Bane", videoUrl: 'https://www.youtube.com/watch?v=AeB84KR6ZC4' },
  { item: 'Code 1', videoUrl: 'https://www.youtube.com/watch?v=DglT_EAEHso' },
  { item: 'Blue Moon', videoUrl: 'https://www.youtube.com/watch?v=zh1_fUqZum8' },
  { item: 'Flairon', videoUrl: 'https://www.youtube.com/watch?v=PQa2Pt6tZXc' },
  { item: 'Dao of Pow', videoUrl: 'https://www.youtube.com/watch?v=rY3zP2S_L0M' },
  { item: 'Dark Lance', videoUrl: 'https://www.youtube.com/watch?v=uHYH9Dl7n3I' },
  { item: 'Tsunami', videoUrl: 'https://www.youtube.com/watch?v=_GXnVC4zvoY' },
  { item: 'Megashark', videoUrl: 'https://www.youtube.com/watch?v=osTQJnlDkmQ' },
  { item: 'Water Bolt', videoUrl: 'https://www.youtube.com/watch?v=pcVZqeZ8wOQ' },
  { item: 'Golden Shower', videoUrl: 'https://www.youtube.com/watch?v=JVlCc1qYEgo' },
  { item: 'Razorblade Typhoon', videoUrl: 'https://www.youtube.com/watch?v=qvk5-v9lMlA' },
  { item: 'Last Prism', videoUrl: 'https://www.youtube.com/watch?v=CImkrHdo6RI' },
  { item: 'Imp Staff', videoUrl: 'https://www.youtube.com/watch?v=GUDBDroI860' },
  { item: 'Stardust Dragon Staff', videoUrl: 'https://www.youtube.com/watch?v=EiWUPbVR1Hg' },
  { item: 'Firecracker', videoUrl: 'https://www.youtube.com/watch?v=9Vjre91AxeA' },
  { item: 'Kaleidoscope', videoUrl: 'https://www.youtube.com/watch?v=edo9CwZa0RU' },
  { item: 'The Eye of Cthulhu', videoUrl: 'https://www.youtube.com/watch?v=R6m1dDTkFP0' },
  { item: 'Daedalus Stormbow', videoUrl: 'https://www.youtube.com/watch?v=ZNK3syV2G2w' },
];

const eventsToLines = events => {
  const lines = [];
  for (const ev of events || []) {
    const text = (ev.segs || []).map(s => (s.utf8 || '')).join('').replace(/\n/g, ' ').trim();
    if (text) lines.push({ t: ev.tStartMs != null ? Math.round(ev.tStartMs / 1000) : null, text });
  }
  return lines;
};

for (const { item, videoUrl } of WAVE) {
  const id = new URL(videoUrl).searchParams.get('v');
  let entry = byItem.get(item);
  if (entry && entry.status === 'done' && entry.transcript === false) { console.log(item, 'checked: no en subs available'); continue; }
  entry = entry || { item, videoUrl, attempts: 0 };
  if (!byItem.has(item)) { byItem.set(item, entry); prior.entries.push(entry); }
  entry.attempts++;
  try {
    // 1) metadata
    const metaJson = execFileSync(PY, ['-m', 'yt_dlp', '--skip-download', '--no-warnings', '--dump-json', videoUrl], { encoding: 'utf8', timeout: 120000 });
    const meta = JSON.parse(metaJson.trim().split('\n').pop());
    entry.status = 'done';
    entry.videoId = id; entry.title = meta.title; entry.channel = meta.channel || meta.uploader;
    entry.lengthSeconds = meta.duration; entry.upload = meta.upload_date;
    entry.description = (meta.description || '').slice(0, 600);
    entry.views = meta.view_count;
    // 2) captions (auto + manual, EN), json3
    execFileSync(PY, ['-m', 'yt_dlp', '--skip-download', '--no-warnings', '--write-auto-subs', '--write-subs',
      '--sub-format', 'json3', '--sub-langs', 'en.*', '-o', path.join(dir, '%(id)s.%(ext)s'), videoUrl], { encoding: 'utf8', timeout: 180000 });
    const subFile = existsSync(path.join(dir, id + '.en.json3')) ? path.join(dir, id + '.en.json3')
      : existsSync(path.join(dir, id + '.en-orig.json3')) ? path.join(dir, id + '.en-orig.json3') : null;
    if (subFile) {
      const j = JSON.parse(readFileSync(subFile, 'utf8'));
      entry.transcript = eventsToLines(j.events);
      entry.transcriptKind = subFile.includes('-orig') ? 'asr' : 'sub';
    } else entry.transcript = null;
  } catch (e) {
    entry.status = 'error'; entry.lastError = String(e && e.message || e).slice(0, 200);
  }
  if (entry.status === 'done') delete entry.lastError;
  if (entry.status === 'done' && (!entry.transcript || !entry.transcript.length)) entry.transcript = false; // remember: checked, no en subs
  writeFileSync(OUT, JSON.stringify(prior, null, 1));
  console.log(item, '→', entry.status, entry.transcript ? entry.transcript.length + ' lines' : '(no en subs)', entry.lastError ? 'ERR: ' + entry.lastError.slice(0, 80) : '');
}
console.log('sweep wave complete →', OUT);
