// Hidamari: automatic checks. Run in the project folder with:
//
//   node tests/check.js
//
// 1. Texts: both language files have the same text codes and placeholders, every text code
//    the game uses exists, and no Japanese text is written directly in the code.
// 2. Pixel art: every drawing is 16 × 16 with known letters, and img/sprites.png is up to date
//    (otherwise run: node tools/make-sprites.js).
// 3. Map: every row has the same length, every letter is known, every walkable place can be
//    reached from your door, and every spot and thing to use can be reached.
// 4. Rules: a new game, gifts, build mode limits, nature points, money at the end of the day,
//    the end of the test after 3 days, and saving then loading gives the same game.
// 5. Font: every character the game uses is in the font files in fonts/
//    (otherwise run: node tools/make-fonts.js).
//
// It needs only Node.js. "All checks passed" at the end means everything is fine.

'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
let failures = 0;
const fail = text => { failures++; console.log('  ✗ ' + text); };
const ok = (cond, text) => { if (!cond) fail(text); return cond; };
const section = name => console.log('\n' + name);

// Load the game's data and rules the same way the page does (without the screen)
const ctx = vm.createContext({ console });
for (const f of ['js/i18n.js', 'lang/en.js', 'lang/ja.js', 'js/sprites-data.js', 'js/map-data.js', 'js/game-data.js', 'js/rules.js']) {
  vm.runInContext(read(f), ctx, { filename: f });
}
const HM = ctx.HM, LANG = ctx.HM_LANG;

// ---------- 1. Texts ----------
section('1. Texts');
const en = LANG.en, ja = LANG.ja;
const placeholders = s => (s.match(/\{\w+(?::\+?\d)?\}/g) || []).sort().join(' ');
Object.keys(en).forEach(k => {
  if (!(k in ja)) fail(`"${k}" is missing in lang/ja.js`);
  else if (placeholders(en[k]) !== placeholders(ja[k])) fail(`"${k}" has different {placeholders} in English and Japanese`);
});
Object.keys(ja).forEach(k => { if (!(k in en)) fail(`"${k}" is missing in lang/en.js`); });

// Text codes written in the code and in the pages
// (js/sprite-sheet.js is made by a tool and only has picture names)
const codeFiles = fs.readdirSync(path.join(ROOT, 'js')).filter(f => f.endsWith('.js') && f !== 'sprite-sheet.js').map(f => 'js/' + f);
const PREFIXES = 'title|ui|weather|hint|action|who|talk|got|item|bag|intro|letter|announce|obj|gen|midori|diary|look|species|place|menu|settings|summary|end|build|tile|game|app|name|art|style|lang';
const used = new Set();
codeFiles.forEach(f => {
  for (const m of read(f).matchAll(new RegExp(`['\`"]((?:${PREFIXES})\\.[A-Za-z0-9.]+[A-Za-z0-9])['\`"]`, 'g'))) used.add(m[1]);
});
['index.html', 'art-test.html'].forEach(f => {
  for (const m of read(f).matchAll(/data-i18n(?:-aria-label)?="([^"]+)"/g)) used.add(m[1]);
});
// Text codes the code builds from parts
const D = HM.DATA;
Object.keys(D.residents).forEach(who => {
  used.add('who.' + who);
  ['loved', 'liked', 'neutral', 'disliked'].forEach(r => used.add(`${who}.gift.${r}`));
});
D.days.forEach((weather, i) => { used.add('weather.' + weather); used.add('announce.weather.' + weather); used.add('announce.news.' + (i + 1)); });
D.seasons.forEach((season, i) => { used.add('season.' + season); if (i) used.add('announce.season.' + season); });
HM.MAP.objects.forEach(o => {
  if (/Door$/.test(o.id) && o.id !== 'homeDoor' && o.id !== 'genDoor') used.add('obj.door.' + o.id.replace(/Door$/, ''));
  if (['noticeBoard', 'postBox', 'busStop', 'bench', 'hidamariTree'].includes(o.id)) used.add('obj.' + o.id);
});
Object.keys(D.items).forEach(i => used.add('item.' + i));
D.speciesOrder.forEach(sp => { used.add('species.' + sp); used.add('species.' + sp + '.fact'); used.add('hint.' + D.species[sp].habitat); });
HM.MAP.areas.forEach(a => used.add('place.' + a.id));
used.add('place.field');
D.buildOrder.forEach(tl => { used.add('tile.' + tl); used.add('build.info.' + tl); });
['tooMany', 'money', 'late', 'needs.seedling'].forEach(p => used.add('build.p.' + p));
const spriteNames = /^(ui|tile|critter)\.(alert|sun|cursor)$/;
[...used].filter(k => !spriteNames.test(k) && !(k in en)).forEach(k => fail(`the code uses "${k}", but it is not in the language files`));

// No Japanese text in the code (it belongs in lang/ja.js). Comments are allowed.
codeFiles.forEach(f => {
  const code = read(f).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const m = code.match(/[぀-ヿ㐀-鿿]+/);
  if (m) fail(`${f} has Japanese text in the code ("${m[0]}"): move it to lang/ja.js`);
});
console.log(`  ${Object.keys(en).length} text codes in each language, ${used.size} used by the game`);

// ---------- 2. Pixel art ----------
section('2. Pixel art');
try {
  const { build } = require(path.join(ROOT, 'tools/make-sprites.js'));
  const out = build();
  ok(fs.existsSync(path.join(ROOT, 'img/sprites.png')) && Buffer.compare(out.png, fs.readFileSync(path.join(ROOT, 'img/sprites.png'))) === 0,
    'img/sprites.png is out of date: run  node tools/make-sprites.js');
  // (Windows may store the file with other line endings; they don't matter)
  ok(out.sheetJs === read('js/sprite-sheet.js').replace(/\r\n/g, '\n'), 'js/sprite-sheet.js is out of date: run  node tools/make-sprites.js');
  // Every map tile and every species has a drawing
  const sheet = vm.runInContext(out.sheetJs + '; HM.SHEET', vm.createContext({}));
  Object.values(HM.MAP.legend).forEach(l => ok(sheet.frames['tile.' + l.tile], `the map uses tile "${l.tile}", which has no drawing`));
  D.speciesOrder.forEach(sp => ok(sheet.frames['critter.' + sp], `species "${sp}" has no drawing`));
  // The seasons change the look of the ground and the trees
  ['summer', 'autumn', 'winter'].forEach(season => ['grass', 'tree', 'paddy'].forEach(tl =>
    ok(sheet.frames[`tile.${tl}@${season}`], `"${tl}" has no ${season} drawing`)));
  D.buildOrder.forEach(tl => ok(sheet.frames['tile.' + tl], `build tile "${tl}" has no drawing`));
  Object.keys(HM.SPRITE_DATA.PEOPLE).forEach(who => ['down', 'up', 'left', 'right'].forEach(dir => ['stand', 'stepA', 'stepB'].forEach(pose =>
    ok(sheet.frames[`${who}.${dir}.${pose}`], `${who} has no "${dir} ${pose}" drawing`))));
  console.log(`  ${out.frames} drawings`);
} catch (e) { fail('the pixel art has a problem: ' + e.message); }

// ---------- 3. Map ----------
section('3. Map');
const map = HM.MAP;
map.rows.forEach((row, y) => {
  ok(row.length === map.width, `map row ${y} has ${row.length} tiles instead of ${map.width}`);
  [...row].forEach((ch, x) => ok(map.legend[ch], `unknown map letter "${ch}" at ${x},${y}`));
});
const walk = (x, y) => x >= 0 && y >= 0 && x < map.width && y < map.height && map.legend[map.rows[y][x]].walk;
const reach = new Set([`${map.start.x},${map.start.y}`]);
const queue = [[map.start.x, map.start.y]];
while (queue.length) {
  const [x, y] = queue.shift();
  [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
    const k = `${x + dx},${y + dy}`;
    if (!reach.has(k) && walk(x + dx, y + dy)) { reach.add(k); queue.push([x + dx, y + dy]); }
  });
}
for (let y = 0; y < map.height; y++) for (let x = 0; x < map.width; x++) {
  if (walk(x, y)) ok(reach.has(`${x},${y}`), `the walkable tile ${x},${y} cannot be reached from your door`);
}
Object.entries(map.spots).forEach(([name, s]) => ok(reach.has(`${s.x},${s.y}`), `the spot "${name}" cannot be reached`));
map.objects.forEach(o => ok([[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => reach.has(`${o.x + dx},${o.y + dy}`)),
  `"${o.id}" cannot be reached to use it`));
Object.values(D.residents).forEach(r => r.schedule.forEach(([, spot]) => ok(spot === 'inside' || spot === 'away' || map.spots[spot], `unknown spot "${spot}"`)));
const f = map.field;
for (let y = f.y; y < f.y + f.h; y++) for (let x = f.x; x < f.x + f.w; x++) ok(map.rows[y][x] === 'F', `the home field should be soil (F) at ${x},${y}`);
console.log(`  ${map.width} × ${map.height} tiles, ${reach.size} reachable`);

// ---------- 4. Rules ----------
section('4. Rules');
const R = HM.rules;
const s = R.newGame('Test');
ok(s.money === D.money.start + D.money.allowance, 'a new game should start with the starting money plus the allowance');
ok(s.day === 1 && s.minutes === D.time.firstDayStart, 'a new game should start on day 1 at 9:00');
// Friendship
ok(R.talk(s, 'gen') && !R.talk(s, 'gen'), 'only the first chat of the day should give points');
ok(R.giveGift(s, 'gen', 'persimmon') === 'loved' && s.friends.gen.points === D.points.talk + D.points.loved, 'a loved gift should give its points');
ok(R.giveGift(s, 'gen', 'tea') === null, 'only one gift per resident per day');
ok(R.heartsOf(99) === 0 && R.heartsOf(100) === 1 && R.heartsOf(9999) === D.hearts.max, 'hearts should be points ÷ 100, at most 5');
// Building
const plan = s.field.slice();
plan[0] = 'dense'; plan[1] = 'spaced'; plan[4] = 'hedge'; plan[5] = 'meadow';
const check = R.checkPlan(s, plan);
ok(check.ok && check.cost === 20000 + 24000 + 2000 + 500 && check.minutes === 4 * D.build.minutesPerTile, 'a small plan should be allowed, with the right cost and time');
const stats = R.fieldStats(plan);
ok(stats.power === 17 && stats.nature === 1 + 3 + 2 + D.varietyBonus * 2, `nature points should include the variety bonus (got ${stats.nature})`);
const big = s.field.map(() => 'meadow');
ok(R.checkPlan(s, big).problems.includes('tooMany'), 'more than 8 new tiles alone should not be allowed');
const hedges = s.field.slice(); [0, 1, 2, 3, 4].forEach(i => { hedges[i] = 'hedge'; });
ok(R.checkPlan(s, hedges).problems.includes('needs.seedling'), 'hedges should need seedlings');
const rich = s.field.slice(); [0, 1, 2, 3].forEach(i => { rich[i] = 'spaced'; });
ok(R.checkPlan(s, rich).problems.includes('money'), 'a plan you cannot pay for should not be allowed');
const before = s.money;
R.buildPlan(s, plan);
ok(s.money === before - check.cost && s.bag.seedling === D.startBag.seedling - 1, 'building should cost money and seedlings');
const removePlan = s.field.slice(); removePlan[0] = null;
const removeCheck = R.checkPlan(s, removePlan);
ok(removeCheck.refund === D.buildTiles.dense.cost * D.build.refund, 'removing a built tile should give half its cost back');
// Days, money and the end of the test
const money1 = s.money;
const sum1 = R.endDay(s);
ok(sum1.income === Math.round(17 * D.weatherPower[R.weatherOf(1)]) * D.money.perPower && s.money === money1 + sum1.income, 'the panels should earn money at the end of the day');
ok(s.day === 2 && s.minutes === D.time.dayStart && !s.finished, 'the next day should start at 6:00');
R.recordSpecies(s, 'tit', 'hedgerow');
ok(!R.recordSpecies(s, 'tit', 'hedgerow'), 'a species should be recorded only once');
// Saving
const copy = R.deserialize(R.serialize(s));
ok(copy && JSON.stringify(copy) === JSON.stringify(s), 'saving and loading should give the same game');
ok(R.deserialize('{broken') === null && R.deserialize(JSON.stringify({ version: 99 })) === null, 'a damaged save should be ignored');
// A whole year: the seasons, the allowance at the start of each season, and the end after day 28
ok(R.seasonOf(1) === 'spring' && R.seasonOf(8) === 'summer' && R.seasonOf(16) === 'autumn' && R.seasonOf(28) === 'winter' &&
  R.dayInSeason(9) === 2, 'days 1–7 should be spring, 8–14 summer, 15–21 autumn and 22–28 winter');
ok(D.days.length === D.time.lastDay, 'every day of the year should have its weather');
let last = null, allowances = 0;
while (!s.finished) { last = R.endDay(s); if (last.allowance) allowances++; }
ok(allowances === 3, `the allowance should arrive at the start of summer, autumn and winter (got ${allowances} times)`);
ok(last.last && s.day === D.time.lastDay, 'the year should end after day 28');
console.log('  friendship, gifts, building, money, days and saving checked');

// ---------- 5. Font ----------
section('5. Font');
try {
  const { usedCharacters } = require(path.join(ROOT, 'tools/make-fonts.js'));
  const have = new Set([...JSON.parse(read('fonts/characters.json')).characters]);
  const missing = usedCharacters().filter(ch => !have.has(ch));
  ok(!missing.length, `characters missing in the font files: ${missing.join('')}  (run: node tools/make-fonts.js)`);
  ok(/DotGothic16/.test(read('fonts/fonts.css')) && fs.existsSync(path.join(ROOT, 'fonts/OFL-dotgothic16.txt')), 'fonts/fonts.css or the font licence is missing');
  console.log(`  ${have.size} characters in the font files`);
} catch (e) { fail('the font files are missing: run  node tools/make-fonts.js  (' + e.message + ')'); }

console.log(failures ? `\n${failures} problem(s) found.` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
