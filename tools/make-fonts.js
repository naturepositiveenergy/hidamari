// Hidamari: makes the font files in the fonts/ folder.
// (Adapted from Solar Commons tools/make-fonts.js; the original is unchanged.)
//
// The game uses one free pixel-style font: DotGothic16 (Japanese and English), under the
// SIL Open Font License. Instead of loading it from Google Fonts on every visit, the game keeps
// its own copy, so it works offline and players' browsers don't contact Google.
// A complete Japanese font is several MB. This tool asks Google Fonts for small font files that
// contain only the characters the game uses (all texts and code), plus all kana and common
// punctuation, so most new texts need no new font files.
//
// Run it in the project folder (needs Node.js and an internet connection):
//
//     node tools/make-fonts.js
//
// Run it again when new text uses a character the font files don't have yet. The automatic
// checks (node tests/check.js) tell you when that is the case.
//
// It writes: fonts/*.woff2 (the font), fonts/fonts.css (tells browsers which file has which
// characters), fonts/characters.json (the list of characters included) and the licence text.

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FONT_DIR = path.join(ROOT, 'fonts');

// Files and folders whose characters must be in the font (folders: all .js files in them)
const SOURCES = ['index.html', 'lang', 'js'];

// Always included: English letters and punctuation, all kana, Japanese punctuation, full-width forms
const EXTRA = [
  [0x20, 0x7E], [0xA0, 0xFF], [0x2010, 0x2027], [0x2190, 0x2193], [0x2212, 0x2212],
  [0x3000, 0x303F], [0x3041, 0x3096], [0x309B, 0x309E], [0x30A1, 0x30FE], [0xFF01, 0xFF5E]
];

const FONT = { family: 'DotGothic16', file: 'dotgothic16', licence: 'dotgothic16', weight: 400 };
const MAX_REQUEST = 3600;   // characters per request are limited by the length of the web address
// Google Fonts sends the modern, small font format (woff2) only to modern browsers
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

// ----- Which characters the game uses (also used by tests/check.js) -----
function usedCharacters() {
  const chars = new Set();
  const addText = text => {
    for (const ch of text) {
      const c = ch.codePointAt(0);
      if (c >= 0x20 && c !== 0x7F && !(c >= 0x80 && c < 0xA0) && c !== 0xFEFF) chars.add(ch);
    }
  };
  for (const source of SOURCES) {
    const full = path.join(ROOT, source);
    const files = fs.statSync(full).isDirectory()
      ? fs.readdirSync(full).filter(f => f.endsWith('.js')).map(f => path.join(full, f))
      : [full];
    files.forEach(f => addText(fs.readFileSync(f, 'utf8')));
  }
  return [...chars].sort((a, b) => a.codePointAt(0) - b.codePointAt(0));
}
function extraCharacters() {
  const chars = [];
  for (const [from, to] of EXTRA) for (let c = from; c <= to; c++) chars.push(String.fromCodePoint(c));
  return chars;
}

// "U+20-7E, U+3001" style list for the unicode-range line in fonts.css
function unicodeRange(chars) {
  const codes = chars.map(ch => ch.codePointAt(0)).sort((a, b) => a - b);
  const parts = [];
  for (let i = 0; i < codes.length; i++) {
    let j = i;
    while (j + 1 < codes.length && codes[j + 1] === codes[j] + 1) j++;
    const hex = n => n.toString(16).toUpperCase();
    parts.push(j > i ? `U+${hex(codes[i])}-${hex(codes[j])}` : `U+${hex(codes[i])}`);
    i = j;
  }
  return parts.join(', ');
}

// Splits the characters into groups that fit in one request
function groups(chars) {
  const out = [[]];
  let length = 0;
  for (const ch of chars) {
    const size = encodeURIComponent(ch).length;
    if (length + size > MAX_REQUEST) { out.push([]); length = 0; }
    out[out.length - 1].push(ch);
    length += size;
  }
  return out;
}

async function download(url, binary) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`could not download ${url.slice(0, 90)}… (status ${res.status})`);
  return binary ? Buffer.from(await res.arrayBuffer()) : res.text();
}

async function main() {
  const used = usedCharacters();
  const all = [...new Set([...used, ...extraCharacters()])].sort((a, b) => a.codePointAt(0) - b.codePointAt(0));
  fs.mkdirSync(FONT_DIR, { recursive: true });
  const written = new Set();
  const css = [
    '/* The font of Hidamari, kept in the project so the game works offline and doesn\'t contact Google.',
    '   Made by tools/make-fonts.js from Google Fonts, with only the characters the game uses (characters.json).',
    '   Don\'t edit this file by hand: run  node tools/make-fonts.js  again after adding text with new characters.',
    '   Licence: SIL Open Font License 1.1, see OFL-dotgothic16.txt in this folder. */',
    ''
  ];

  const parts = groups(all);
  for (let n = 0; n < parts.length; n++) {
    const text = parts[n].join('');
    const answer = await download(`https://fonts.googleapis.com/css2?family=${FONT.family}` +
      `&text=${encodeURIComponent(text)}`);
    const url = (answer.match(/url\((https:[^)]+)\)/) || [])[1];
    if (!url) throw new Error(`Google Fonts sent no ${FONT.family} file`);
    const name = `${FONT.file}${parts.length > 1 ? '-' + (n + 1) : ''}.woff2`;
    const data = await download(url, true);
    fs.writeFileSync(path.join(FONT_DIR, name), data);
    written.add(name);
    console.log(`  ${name}  ${Math.round(data.length / 1024)} KB, ${parts[n].length} characters`);
    css.push(
      '@font-face {',
      `  font-family: "${FONT.family}";`,
      '  font-style: normal;',
      `  font-weight: ${FONT.weight};`,
      '  font-display: swap;',
      `  src: url("${name}") format("woff2");`,
      `  unicode-range: ${unicodeRange(parts[n])};`,
      '}',
      '');
  }
  const licence = await download(`https://raw.githubusercontent.com/google/fonts/main/ofl/${FONT.licence}/OFL.txt`);
  fs.writeFileSync(path.join(FONT_DIR, `OFL-${FONT.file}.txt`), licence);

  fs.writeFileSync(path.join(FONT_DIR, 'fonts.css'), css.join('\n'));
  fs.writeFileSync(path.join(FONT_DIR, 'characters.json'), JSON.stringify({
    note: 'Characters in the font files. Made by tools/make-fonts.js, do not edit.',
    characters: all.join('')
  }, null, 2) + '\n');

  // Remove font files of an earlier run that are no longer used (for example after regrouping)
  for (const f of fs.readdirSync(FONT_DIR)) {
    if (f.endsWith('.woff2') && !written.has(f)) {
      fs.unlinkSync(path.join(FONT_DIR, f));
      console.log(`  removed old file ${f}`);
    }
  }
  console.log(`Done: ${all.length} characters (${used.length} used in the game). Then run: node tests/check.js`);
}

module.exports = { usedCharacters, FONT_DIR };
if (require.main === module) {
  main().catch(e => { console.error('Making the fonts failed: ' + e.message); process.exit(1); });
}
