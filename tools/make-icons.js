// Hidamari: draws the app icon and saves it in the icons/ folder (Milestone 4.1).
//
// The icon is a 16 × 16 pixel drawing, like the game's own art: a house with solar panels on its
// roof, a hedge, green ground and a warm sun: a sunny spot (hidamari). The colours come from the
// game's palette (js/sprites-data.js). Changing the drawing below and running the tool again
// renews all icon files. No downloads or extra programs are needed:
//
//     node tools/make-icons.js
//
// Files made (sizes in pixels):
//   icons/icon.svg               the browser-tab icon (a drawing that stays sharp at every size)
//   icons/icon-192.png, -512.png the app icon with rounded corners (computers, app lists)
//   icons/icon-maskable-512.png  for Android, which cuts icons into its own shape; the picture is
//                                smaller, on a full background, so nothing is cut off
//   icons/apple-touch-icon.png   180, for iPhone and iPad home screens (iOS rounds the corners)

'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { png } = require('./make-sprites.js');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'icons');

// The drawing: one letter per pixel
const ICON = [
  '................',
  '...........O....',
  '.......O.YYYY.O.',
  '........YYYYYY..',
  '.......YYwYYYYY.',
  '.....O.YwYYYYYY.',
  '.......YYYYYYYYO',
  '........YYYYYY..',
  '..KKKKKK.YYYY...',
  '.KQPQPQPK...O...',
  'KQPQPQPQPK......',
  'KKKKKKKKKKK.....',
  '.KWWnnWWWK.hhhh.',
  'gKWWnnWWWKghhhhg',
  'gggggggggggggggg',
  'GGGGGGGGGGGGGGGG'
];
// The letters' colours, from the game's palette
const ROLES = {
  '.': 'earth3', Y: 'yellow', O: 'orange', w: 'white', K: 'outline', Q: 'panel0', P: 'panel1',
  W: 'white', n: 'earth0', h: 'green1', g: 'green3', G: 'green2'
};

function palette() {
  const ctx = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/sprites-data.js'), 'utf8'), ctx);
  return vm.runInContext('HM.SPRITE_DATA.PALETTE', ctx);
}
const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));

// A square picture: the drawing scaled up by whole pixels, centred on the background,
// with rounded corners (corner = 0: square to the edge)
function picture(size, scale, corner, colours) {
  const pixels = Buffer.alloc(size * size * 4);
  const offset = Math.floor((size - 16 * scale) / 2);
  const bg = colours['.'];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const gx = Math.floor((x - offset) / scale), gy = Math.floor((y - offset) / scale);
      const inside = gx >= 0 && gy >= 0 && gx < 16 && gy < 16;
      const c = inside ? colours[ICON[gy][gx]] : bg;
      const p = (y * size + x) * 4;
      pixels[p] = c[0]; pixels[p + 1] = c[1]; pixels[p + 2] = c[2];
      pixels[p + 3] = inCorner(x, y, size, corner) ? 0 : 255;
    }
  }
  return png(size, size, pixels);
}
// Outside a rounded corner?
function inCorner(x, y, size, r) {
  if (!r) return false;
  const cx = x < r ? r : x >= size - r ? size - r - 1 : x;
  const cy = y < r ? r : y >= size - r ? size - r - 1 : y;
  return (x - cx) ** 2 + (y - cy) ** 2 > r * r;
}

// The browser-tab icon as an SVG drawing: one square per pixel
function svg(hex) {
  const rects = [];
  ICON.forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch !== '.') rects.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${hex[ch]}"/>`);
  }));
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">\n' +
    `<clipPath id="r"><rect width="16" height="16" rx="3.5"/></clipPath>\n<g clip-path="url(#r)">\n` +
    `<rect width="16" height="16" fill="${hex['.']}"/>\n${rects.join('\n')}\n</g>\n</svg>\n`;
}

function build() {
  const pal = palette();
  const hex = Object.fromEntries(Object.entries(ROLES).map(([ch, name]) => [ch, pal[name]]));
  const colours = Object.fromEntries(Object.entries(hex).map(([ch, h]) => [ch, rgb(h)]));
  return {
    'icon.svg': svg(hex),
    'icon-192.png': picture(192, 12, 42, colours),
    'icon-512.png': picture(512, 32, 112, colours),
    'icon-maskable-512.png': picture(512, 25, 0, colours),
    'apple-touch-icon.png': picture(180, 11, 0, colours)
  };
}

module.exports = { build, ICON };

if (require.main === module) {
  fs.mkdirSync(OUT, { recursive: true });
  Object.entries(build()).forEach(([name, data]) => {
    fs.writeFileSync(path.join(OUT, name), data);
    console.log(`  icons/${name}  ${Math.round(data.length / 1024 * 10) / 10} KB`);
  });
  console.log('Done.');
}
