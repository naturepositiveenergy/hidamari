// Hidamari: turns the pixel art in js/sprites-data.js into the picture the game draws from.
//
// Run it in the project folder after changing any drawing or colour (needs Node.js only):
//
//     node tools/make-sprites.js
//
// It writes:
//   img/sprites.png      all drawings side by side in one picture (a "sprite sheet")
//   js/sprite-sheet.js   where each drawing is in that picture, for the game
//
// It also makes the variations, so they don't have to be drawn by hand: walking frames
// (people's legs), people facing left (mirrored), blinking eyes, the water's shimmer, and
// style A's soft outlines (each outline pixel is a darker shade of the colour next to it).
//
// The PNG writer is copied from Solar Commons (tools/make-icons.js).

'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const zlib = require('zlib');

const ROOT = path.join(__dirname, '..');
const SIZE = 16;          // every drawing is 16 × 16 pixels
const COLUMNS = 16;       // drawings per row in the sheet

// ----- Read the drawings -----
function loadData() {
  const ctx = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/sprites-data.js'), 'utf8'), ctx);
  return ctx.HM.SPRITE_DATA;
}

// ----- Colours -----
const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
const mix = (c1, c2, amount) => c1.map((v, i) => Math.round(v + (c2[i] - v) * amount));

function colourMap(roles, palette) {
  const map = {};
  for (const [letter, name] of Object.entries(roles)) {
    if (!palette[name]) throw new Error(`Role "${letter}" uses an unknown colour "${name}"`);
    map[letter] = rgb(palette[name]);
  }
  return map;
}

// ----- Variations -----
const mirror = grid => grid.map(row => [...row].reverse().join(''));

// The most common letter of a drawing (the water colour under the shine)
function mostCommon(grid) {
  const count = {};
  grid.join('').split('').forEach(ch => { count[ch] = (count[ch] || 0) + 1; });
  return Object.keys(count).sort((a, b) => count[b] - count[a])[0];
}

// Water shine: frame 0 shows y, frame 1 shows z
function shineFrame(grid, frame) {
  const base = mostCommon(grid);
  return grid.map(row => row.replace(/[yz]/g, ch => ((ch === 'y') === (frame === 0) ? 'y' : base)));
}

const blink = grid => grid.map(row => row.replace(/9/g, 'f'));

// ----- Turning a drawing into pixels -----
// soft: outline pixels (K) take a darker shade of the colour inside, next to them
function render(grid, colours, soft, name) {
  const pixels = [];
  for (let y = 0; y < SIZE; y++) {
    if (!grid[y] || grid[y].length !== SIZE) throw new Error(`${name}: a row is not ${SIZE} letters long: "${grid[y]}"`);
    for (let x = 0; x < SIZE; x++) {
      const ch = grid[y][x];
      if (ch === '.') { pixels.push(null); continue; }
      if (!colours[ch]) throw new Error(`${name}: unknown letter "${ch}"`);
      let c = colours[ch];
      if (ch === 'K' && soft) {
        for (const [dx, dy] of [[0, 1], [1, 0], [-1, 0], [0, -1]]) {
          const n = grid[y + dy] && grid[y + dy][x + dx];
          if (n && n !== '.' && n !== 'K' && n !== '9') { c = mix(mix(colours[n], [0, 0, 0], 0.42), colours.K, 0.35); break; }
        }
      }
      pixels.push(c);
    }
  }
  return pixels;
}

// ----- Collect every frame: [name, grid, colours, soft] -----
function collectFrames(data) {
  const { PALETTE, ROLES, TILES, CROPS, PEOPLE, LEGS, PETS, CRITTERS, SPECIES_ART, UI, SEASONS } = data;
  const frames = [];   // { name, grids: [frame0, frame1...], colours, soft }
  const tileColours = colourMap(ROLES.tile, PALETTE);

  for (const [name, grid] of Object.entries(TILES)) {
    const animated = grid.some(row => /[yz]/.test(row));
    const grids = animated ? [shineFrame(grid, 0), shineFrame(grid, 1)] : [grid];
    frames.push({ name: 'tile.' + name, grids, colours: tileColours });
    // The same tile in summer, autumn and winter, if its colours change in that season
    for (const [season, def] of Object.entries(SEASONS || {})) {
      const colours = colourMap(Object.assign({}, ROLES.tile, def.roles, def.tiles[name] || {}), PALETTE);
      const looks = c => JSON.stringify(grids.map(g => render(g, c, false, name)));
      if (looks(colours) !== looks(tileColours)) frames.push({ name: `tile.${name}@${season}`, grids, colours });
    }
  }

  // Vegetables (no season changes: they are already seasonal plants)
  for (const [name, grid] of Object.entries(CROPS || {})) frames.push({ name: 'crop.' + name, grids: [grid], colours: tileColours });

  for (const [who, person] of Object.entries(PEOPLE)) {
    const colours = colourMap(Object.assign({}, ROLES.people.base, ROLES.people[who]), PALETTE);
    const legs = LEGS[person.legs];
    const build = (top, legRows) => [...top, ...legRows];
    const poses = {
      down: { top: person.down, legs: legs.front, flipStep: true },
      up: { top: person.up, legs: legs.front, flipStep: true },
      right: { top: person.side, legs: legs.side, flipStep: false }
    };
    for (const [dir, p] of Object.entries(poses)) {
      const stand = build(p.top, p.legs.stand);
      const stepA = build(p.top, p.legs.step);
      const stepB = p.flipStep ? build(p.top, mirror(p.legs.step)) : stepA;
      const sets = { stand, stepA, stepB };
      for (const [pose, grid] of Object.entries(sets)) {
        frames.push({ name: `${who}.${dir}.${pose}`, grids: [grid], colours, soft: true });
        if (dir === 'right') frames.push({ name: `${who}.left.${pose}`, grids: [mirror(grid)], colours, soft: true });
      }
      if (dir !== 'up') {
        frames.push({ name: `${who}.${dir}.blink`, grids: [blink(stand)], colours, soft: true });
        if (dir === 'right') frames.push({ name: `${who}.left.blink`, grids: [mirror(blink(stand))], colours, soft: true });
      }
    }
  }

  // Pets (Kotetsu the dog): two walking frames for each direction, named like people's frames
  const petColours = colourMap(ROLES.pet, PALETTE);
  for (const [pet, dirs] of Object.entries(PETS || {})) {
    for (const [dir, [a, b]] of Object.entries(dirs)) {
      const sets = { stand: a, stepA: b, stepB: b, blink: a };
      for (const [pose, grid] of Object.entries(sets)) {
        const name = dir === 'side' ? 'right' : dir;
        frames.push({ name: `${pet}.${name}.${pose}`, grids: [grid], colours: petColours, soft: true });
        if (dir === 'side') frames.push({ name: `${pet}.left.${pose}`, grids: [mirror(grid)], colours: petColours, soft: true });
      }
    }
  }

  for (const [species, art] of Object.entries(SPECIES_ART)) {
    const colours = colourMap(Object.assign({}, ROLES.critter, art.recolor), PALETTE);
    frames.push({ name: 'critter.' + species, grids: CRITTERS[art.shape], colours, soft: true });
  }

  const uiColours = colourMap(ROLES.ui, PALETTE);
  for (const [name, grid] of Object.entries(UI)) frames.push({ name: 'ui.' + name, grids: [grid], colours: uiColours });

  return frames;
}

// ----- The sheet -----
function build() {
  const data = loadData();
  const frames = collectFrames(data);
  const cells = frames.reduce((n, f) => n + f.grids.length, 0);
  const width = COLUMNS * SIZE;
  const height = Math.ceil(cells / COLUMNS) * SIZE;
  const pixels = Buffer.alloc(width * height * 4);
  const map = {};
  let cell = 0;
  for (const f of frames) {
    map[f.name] = [];
    for (const grid of f.grids) {
      const ox = (cell % COLUMNS) * SIZE, oy = Math.floor(cell / COLUMNS) * SIZE;
      render(grid, f.colours, f.soft, f.name).forEach((c, i) => {
        if (!c) return;
        const p = ((oy + Math.floor(i / SIZE)) * width + ox + (i % SIZE)) * 4;
        pixels[p] = c[0]; pixels[p + 1] = c[1]; pixels[p + 2] = c[2]; pixels[p + 3] = 255;
      });
      map[f.name].push([ox, oy]);
      cell++;
    }
  }
  const sheetJs = '// Made by tools/make-sprites.js from js/sprites-data.js. Do not change by hand.\n' +
    '// Where each drawing is in img/sprites.png: name: [[x, y] for each animation frame]\n' +
    'globalThis.HM = globalThis.HM || {};\n' +
    'HM.SHEET = ' + JSON.stringify({ size: SIZE, width, height, frames: map }, null, 0)
      .replace(/\],"/g, '],\n  "').replace('"frames":{', '"frames":{\n  ') + ';\n';
  return { png: png(width, height, pixels), sheetJs, frames: Object.keys(map).length };
}

// ----- PNG file format (from Solar Commons tools/make-icons.js) -----
const CRC = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (const byte of buf) c = CRC[(c ^ byte) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function chunk(type, data) {
  const head = Buffer.alloc(4); head.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const tail = Buffer.alloc(4); tail.writeUInt32BE(crc32(body));
  return Buffer.concat([head, body, tail]);
}
function png(width, height, pixels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6;   // 8 bits per channel, red-green-blue-alpha
  const rows = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) pixels.copy(rows, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(rows, { level: 9 })), chunk('IEND', Buffer.alloc(0))
  ]);
}

module.exports = { build, png };

// ----- Save (only when run directly, not when the checks use build()) -----
if (require.main === module) {
  const out = build();
  fs.mkdirSync(path.join(ROOT, 'img'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'img/sprites.png'), out.png);
  fs.writeFileSync(path.join(ROOT, 'js/sprite-sheet.js'), out.sheetJs);
  console.log(`  img/sprites.png  ${out.frames} drawings, ${Math.round(out.png.length / 1024 * 10) / 10} KB`);
  console.log('  js/sprite-sheet.js');
  console.log('Done.');
}
