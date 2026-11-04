import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Life, mulberry32 } from '../lib/life.js';

const bin = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'bin', 'life.js');
const run = (...args) => execFileSync(process.execPath, [bin, ...args], { encoding: 'utf8' });

function blinker() {
  const life = new Life(5, 5);
  life.set(2, 1);
  life.set(2, 2);
  life.set(2, 3);
  return life;
}

test('blinker oscillates with period 2', () => {
  const life = blinker();
  const before = life.render();
  life.step();
  const mid = life.render();
  life.step();
  assert.equal(life.render(), before);
  assert.notEqual(mid, before);
  assert.equal(life.alive(), 3);
});

test('blinker rotates vertical to horizontal', () => {
  const life = blinker();
  life.step();
  assert.equal(life.get(1, 2) + life.get(2, 2) + life.get(3, 2), 3);
});

test('block is a still life', () => {
  const life = new Life(6, 6);
  life.set(1, 1);
  life.set(1, 2);
  life.set(2, 1);
  life.set(2, 2);
  const before = life.render();
  life.step();
  life.step();
  assert.equal(life.render(), before);
  assert.equal(life.alive(), 4);
});

test('grid wraps toroidally', () => {
  const life = new Life(3, 3);
  life.set(2, 2);
  // on a 3x3 torus, (2,2) is a diagonal neighbour of (0,0)
  assert.equal(life.neighbors(0, 0), 1);
  assert.equal(life.neighbors(1, 1), 1);
});

test('underpopulation kills a lonely cell', () => {
  const life = new Life(5, 5);
  life.set(2, 2);
  life.step();
  assert.equal(life.alive(), 0);
});

test('mulberry32 is deterministic per seed', () => {
  const a = mulberry32(42);
  const b = mulberry32(42);
  assert.deepEqual([a(), a(), a()], [b(), b(), b()]);
});

test('mulberry32 differs across seeds', () => {
  assert.notEqual(mulberry32(1)(), mulberry32(2)());
});

test('CLI smoke: runs and prints stats', () => {
  const out = run('--rows', '5', '--cols', '5', '--gens', '1', '--seed', '7');
  assert.match(out, /generation 1\/1/);
});
