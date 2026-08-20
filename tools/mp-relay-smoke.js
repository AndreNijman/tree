import assert from 'node:assert/strict';
import {
  constantTimeEqual,
  hashPassword,
  makeCode,
  normalizeCode,
  originAllowed,
  sanitizeText,
} from '../worker/relay.js';

assert.match(makeCode(), /^[BCDFGHJKLMNPQRSTVWXYZ23456789]{5}$/);
assert.equal(normalizeCode(' a-b c12 '), 'ABC12');
assert.equal(sanitizeText('  Oak\nWorld  ', 20, 'fallback'), 'OakWorld');
assert.equal(originAllowed('https://tree.andrenijman.com'), true);
assert.equal(originAllowed('null'), true);
assert.equal(originAllowed('http://localhost:8787'), true);
assert.equal(originAllowed('http://127.0.0.1:8765'), true);
assert.equal(originAllowed('https://evil.example'), false);

const first = await hashPassword('acorn');
const second = await hashPassword('acorn');
const wrong = await hashPassword('mushroom');
assert.equal(first.length, 32);
assert.equal(constantTimeEqual(first, second), true);
assert.equal(constantTimeEqual(first, wrong), false);
assert.equal(await hashPassword(''), null);

console.log('relay helper smoke passed');
