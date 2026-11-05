# terminal-life

Conway's Game of Life, right in your terminal. Zero dependencies — just Node.js
and the standard library.

The universe is a **toroidal grid** (edges wrap around), seeded by a tiny
deterministic PRNG, so the same `--seed` always replays the same universe.

## Quick start

```console
$ node bin/life.js --rows 12 --cols 40 --gens 3 --seed 42

-- generation 0/3  alive 118 --
....##....##......#.......#....##......#...
...#.......#....##...##...#......#...##....
...

$ node bin/life.js --animate --seed 42 --gens 200
```

`--animate` redraws in place for a live view (8 fps by default).

## Options

| Option | Default | Meaning |
| --- | --- | --- |
| `--rows N` | 20 | Grid height |
| `--cols N` | 60 | Grid width |
| `--gens N` | 10 | Generations to run |
| `--seed N` | 1 | PRNG seed — same seed, same universe |
| `--density F` | 0.25 | Fraction of initially alive cells |
| `--fps N` | 8 | Frames per second with `--animate` |
| `--animate` | off | Live redraw instead of printing all frames |

## Rules

Classic **B3/S23** on a torus:

- A dead cell with exactly 3 live neighbours is born
- A live cell with 2 or 3 live neighbours survives
- Everything else dies of loneliness or crowding

The engine (and the blinker/block/torus behaviour) is covered by tests — see
[test/life.test.js](test/life.test.js), run on Node 18/20/22 in CI.

## Development

```console
$ npm test
```

## License

[MIT](LICENSE)
