#!/usr/bin/env node
import { Life, mulberry32 } from '../lib/life.js';

const DEFAULTS = { rows: 20, cols: 60, gens: 10, seed: 1, density: 0.25, fps: 8 };

function parseArgs(argv) {
  const opts = { ...DEFAULTS, animate: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--animate') {
      opts.animate = true;
    } else if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const val = Number(argv[++i]);
      if (!(key in DEFAULTS) || Number.isNaN(val)) {
        console.error(`error: unknown or malformed option ${arg}`);
        process.exit(1);
      }
      opts[key] = val;
    } else {
      console.error(`error: unexpected argument ${arg} (try --animate, --rows, --cols, --gens, --seed)`);
      process.exit(1);
    }
  }
  return opts;
}

function randomLife({ rows, cols, seed, density }) {
  const life = new Life(rows, cols);
  const rand = mulberry32(seed);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rand() < density) life.set(r, c);
    }
  }
  return life;
}

const opts = parseArgs(process.argv.slice(2));
const life = randomLife(opts);

if (opts.animate) {
  const delay = Math.round(1000 / opts.fps);
  for (let gen = 0; gen <= opts.gens; gen++) {
    process.stdout.write(`\x1b[2J\x1b[Hgeneration ${gen}/${opts.gens}  alive ${life.alive()}\n\n${life.render()}\n`);
    life.step();
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
} else {
  for (let gen = 0; gen <= opts.gens; gen++) {
    console.log(`-- generation ${gen}/${opts.gens}  alive ${life.alive()} --`);
    console.log(life.render());
    life.step();
  }
}
