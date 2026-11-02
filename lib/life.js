export class Life {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.grid = Array.from({ length: rows }, () => Array(cols).fill(0));
  }

  // toroidal coordinates: the grid wraps on both axes
  get(r, c) {
    return this.grid[((r % this.rows) + this.rows) % this.rows][((c % this.cols) + this.cols) % this.cols];
  }

  set(r, c, v = 1) {
    this.grid[((r % this.rows) + this.rows) % this.rows][((c % this.cols) + this.cols) % this.cols] = v;
  }

  neighbors(r, c) {
    let n = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr || dc) n += this.get(r + dr, c + dc);
      }
    }
    return n;
  }

  // classic B3/S23 rules: born with 3 neighbours, survives with 2 or 3
  step() {
    this.grid = this.grid.map((row, r) =>
      row.map((cell, c) => {
        const n = this.neighbors(r, c);
        return cell ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
      }),
    );
    return this;
  }

  alive() {
    return this.grid.flat().reduce((a, b) => a + b, 0);
  }

  render() {
    return this.grid.map((row) => row.map((v) => (v ? '#' : '.')).join('')).join('\n');
  }
}

// tiny deterministic PRNG so --seed always replays the same universe
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
