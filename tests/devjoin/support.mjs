// Shared by the dev-join tests: a throwaway Ed25519 key pair standing in for
// games-guard's, passes signed with it (netdev.js signDevPass), and a
// `wrangler dev` relay that trusts its public half (DEV_TEST_PUBLIC_KEY, only
// ever passed with --var, never in wrangler config).
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { signDevPass } from '../../worker/netdev.js';

export const HOST = 'tree.andrenijman.com';
export const root = fileURLToPath(new URL('../..', import.meta.url));
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const b64url = bytes => Buffer.from(bytes).toString('base64url');

export async function keyPair() {
  const pair = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']);
  return {
    publicKey: b64url(new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey))),
    privateKey: b64url(new Uint8Array(await crypto.subtle.exportKey('pkcs8', pair.privateKey))),
  };
}

export async function pass(privateKey, options = {}) {
  return (await signDevPass(privateKey, { name: 'Andre', host: HOST, ...options })).pass;
}

/** wrangler dev on `port` (inspector `inspector`), trusting `publicKey` for dev passes. */
export async function startRelay({ port, inspector, publicKey }) {
  let output = '';
  const dev = spawn('npx', [
    'wrangler', 'dev', '-c', 'wrangler.jsonc', '-c', 'tests/latency/stub-guard/wrangler.jsonc',
    '--port', String(port), '--inspector-port', String(inspector), '--ip', '127.0.0.1',
    '--var', 'TREE_ADMIN_TOKEN:local-test', '--var', `DEV_TEST_PUBLIC_KEY:${publicKey}`,
  ], {
    cwd: root, stdio: ['ignore', 'pipe', 'pipe'], detached: true,
    env: { ...process.env, WRANGLER_REGISTRY_PATH: mkdtempSync(join(tmpdir(), 'tree-devjoin-')) },
  });
  const onOutput = chunk => { output = (output + chunk).slice(-20_000); };
  dev.stdout.setEncoding('utf8').on('data', onOutput);
  dev.stderr.setEncoding('utf8').on('data', onOutput);
  const stop = () => { try { process.kill(-dev.pid, 'SIGTERM'); } catch { /* already gone */ } };
  process.on('exit', stop);
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 180; i++) {
    try { if ((await fetch(base + '/health')).ok) return { base, stop, output: () => output }; } catch { /* not up yet */ }
    await sleep(500);
  }
  stop();
  throw new Error('wrangler dev did not start:\n' + output);
}
