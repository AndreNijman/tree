import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, readdir, rename, writeFile, open, unlink } from 'node:fs/promises';
import path from 'node:path';

export const VERSION = 1;
export const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export const validLane = name => typeof name === 'string' && /^[a-z0-9][a-z0-9-]{0,63}$/.test(name);
export async function json(file) { return JSON.parse(await readFile(file, 'utf8')); }
export async function atomic(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  const temp = file + '.' + randomUUID() + '.tmp';
  await writeFile(temp, JSON.stringify(value, null, 2), { mode: 0o600 });
  await rename(temp, file);
}

export async function sourceHashes(root) {
  const hashes = {};
  async function scan(relative) {
    for (const entry of (await readdir(path.join(root, relative), { withFileTypes: true })).sort((a,b) => a.name.localeCompare(b.name))) {
      const name = path.posix.join(relative, entry.name);
      if (entry.isSymbolicLink()) throw new Error('Source symlinks are not supported: ' + name);
      if (entry.isDirectory()) await scan(name);
      else if (entry.isFile()) hashes[name] = digest(await readFile(path.join(root, name)));
    }
  }
  hashes['index.html'] = digest(await readFile(path.join(root, 'index.html')));
  for (const directory of ['js', 'css', 'assets']) await scan(directory);
  return hashes;
}
export function sameHashes(a, b) {
  return Object.keys(a).length === Object.keys(b).length && Object.entries(a).every(([key, value]) => b[key] === value);
}

export function worldsIn(storage) {
  const worlds = [];
  for (const origin of storage.origins || []) {
    for (const database of origin.indexedDB || []) {
      if (database.name !== 'tree.worlds') continue;
      for (const store of database.stores || []) {
        if (store.name !== 'worlds') continue;
        for (const record of store.records || []) {
          if (record.value?.data && !record.value.deletedAt) worlds.push({ origin: origin.origin, record: record.value });
        }
      }
    }
  }
  return worlds;
}
export function inventoryFingerprint(inventory) {
  if (!inventory) return null;
  const { slots, held = null, armor, accessories, dyes, ammo } = inventory;
  return digest(JSON.stringify({ slots, held, armor, accessories, dyes, ammo }));
}
export function savedSummary(storage, worldId) {
  const selected = worldsIn(storage).filter(w => !worldId || w.record.id === worldId);
  if (selected.length !== 1) return { verified: false, reason: selected.length ? 'Select a single world ID.' : 'No saved world record.', worlds: selected.length };
  const r = selected[0].record, d = r.data;
  if(typeof r.id!=='string' || !Number.isFinite(d.seed) || !Number.isFinite(d.savedAt) || !Array.isArray(d.player?.inventory?.slots))return {verified:false,reason:'Malformed saved world payload; do not silently create a replacement.',worldId:r.id};
  return { verified: true, worldId: r.id, name: r.name, seed: d.seed, savedAt: d.savedAt,
    timeOfDay: d.progress?.timeOfDay, player: { x: d.player?.x, y: d.player?.y, hp: d.player?.hp },
    inventoryFingerprint: inventoryFingerprint(d.player?.inventory) };
}
export function remapStorage(storage, origin) {
  const copy = structuredClone(storage);
  if (!copy.origins?.length) throw new Error('Storage export has no origins.');
  if (copy.origins.length !== 1) throw new Error('Refusing ambiguous multi-origin storage. Export only the disposable playtest context.');
  const previous = new URL(copy.origins[0].origin);
  if (!['127.0.0.1', 'localhost', '[::1]'].includes(previous.hostname)) throw new Error('Only disposable loopback storage can be imported.');
  if ((copy.cookies || []).some(c => !['127.0.0.1', 'localhost', '::1'].includes(c.domain))) throw new Error('External cookies are not playtest storage.');
  copy.origins[0].origin = origin;
  // Cookie hosts differ between localhost and 127.0.0.1; never import production credentials.
  for (const cookie of copy.cookies || []) cookie.domain = new URL(origin).hostname;
  return copy;
}

export class OwnerLease {
  constructor(durationMs, clock = Date.now) {
    if (!Number.isInteger(durationMs) || durationMs < 1000) throw new Error('Lease must be at least 1000ms.');
    this.durationMs = durationMs; this.clock = clock; this.owner = null; this.generation = 0; this.expiresAt = 0; this.epoch = randomUUID();
  }
  get expired() { return this.owner !== null && this.clock() >= this.expiresAt; }
  claim(owner) {
    if (typeof owner !== 'string' || !owner.trim() || owner.length > 160) throw new Error('Provide a short owner/model identifier.');
    if (this.owner && !this.expired) throw new Error('Lane already owned; pause/release it or wait for lease expiry.');
    this.owner = owner; this.generation++; this.expiresAt = this.clock() + this.durationMs;
    return this.snapshot();
  }
  assert(ticket) {
    if (this.expired || !this.owner || ticket?.epoch !== this.epoch || ticket?.owner !== this.owner || ticket?.generation !== this.generation) throw new Error('Stale or expired owner ticket. Claim the lane first.');
  }
  renew(ticket) { this.assert(ticket); this.expiresAt = this.clock() + this.durationMs; }
  release() { this.owner = null; this.expiresAt = 0; }
  snapshot() { return { owner: this.owner, generation: this.generation, epoch:this.epoch, expiresAt: this.expiresAt, durationMs: this.durationMs }; }
}

export async function acquireLock(directory) {
  await mkdir(directory, { recursive: true });
  const file = path.join(directory, 'controller.lock');
  const identity = { pid: process.pid, token: randomUUID() };
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const handle = await open(file, 'wx', 0o600);
      await handle.writeFile(JSON.stringify(identity)); await handle.close();
      return async () => {
        if ((await json(file).catch(() => null))?.token === identity.token) await unlink(file);
      };
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      const previous = await json(file).catch(() => null);
      if (!previous?.pid) throw new Error('Unreadable controller lock; inspect it instead of launching a duplicate.');
      let alive = true;
      try { process.kill(previous.pid, 0); } catch (e) { if (e.code === 'ESRCH') alive = false; }
      if (alive) throw new Error('Controller already running (PID ' + previous.pid + '). Use status/claim, not another start.');
      if ((await json(file)).token !== previous.token) throw new Error('Controller lock changed; retry.');
      await unlink(file);
    }
  }
  throw new Error('Could not acquire controller lock.');
}

export async function writeCheckpoint(directory, packet) {
  const id = 'cp-' + Date.now() + '-' + randomUUID().slice(0, 8);
  const relative = path.join('checkpoints', id), target = path.join(directory, relative);
  await mkdir(target, { recursive: true });
  await atomic(path.join(target, 'storage.json'), packet.storage);
  const storageHash = digest(await readFile(path.join(target, 'storage.json')));
  const handoff = { ...packet.handoff, version: VERSION, checkpoint: id, storageFile: 'storage.json', storageHash,
    authority:'latest.json commits the authoritative generation. Root HANDOFF files are convenience caches and may lag after a crash.' };
  await atomic(path.join(target, 'handoff.json'), handoff);
  if (packet.screenshot) await writeFile(path.join(target, 'screen.png'), packet.screenshot);
  // Commit pointer last: interrupted exports leave the last complete generation usable.
  await atomic(path.join(directory, 'latest.json'), { version: VERSION, directory: relative, checkpoint: id,
    handoffHash: digest(await readFile(path.join(target, 'handoff.json'))) });
  await atomic(path.join(directory, 'HANDOFF.json'), handoff);
  return { handoff, target };
}
export async function loadCheckpoint(directory) {
  const pointer = await json(path.join(directory, 'latest.json'));
  if(pointer.version!==VERSION)throw new Error('Unsupported checkpoint version.');
  const target = path.resolve(directory, pointer.directory);
  if (!target.startsWith(path.resolve(directory, 'checkpoints') + path.sep)) throw new Error('Invalid checkpoint path.');
  const bytes = await readFile(path.join(target, 'handoff.json'));
  if (digest(bytes) !== pointer.handoffHash) throw new Error('Handoff checksum mismatch.');
  const handoff = JSON.parse(bytes);
  const storageBytes = await readFile(path.join(target, 'storage.json'));
  if (digest(storageBytes) !== handoff.storageHash) throw new Error('Storage checksum mismatch.');
  return { handoff, storage: JSON.parse(storageBytes), target };
}
