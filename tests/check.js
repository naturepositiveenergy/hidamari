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
//    the end of the year, and saving then loading gives the same game. Then the village's decisions
//    (Milestone 2.4): worries, the town meeting, the farmland permit, the citizen fund, Mr. Kurokawa's
//    offers, the slope's water and the mudflow, the promotion zone, the meters and the endings.
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
for (const f of ['js/i18n.js', 'lang/en.js', 'lang/ja.js', 'lang/ja-readings.js', 'js/furigana.js', 'js/sprites-data.js', 'js/map-data.js', 'js/game-data.js', 'js/rules.js', 'js/community.js', 'js/festivals.js', 'js/events.js', 'js/notebook.js', 'js/talks.js', 'js/music.js', 'js/soundscape.js']) {
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
const PREFIXES = 'title|ui|weather|hint|action|who|talk|got|item|bag|intro|letter|announce|obj|gen|midori|diary|look|species|place|menu|settings|summary|end|build|tile|game|app|name|art|style|lang|' +
  'plot|view|workday|farm|meeting|worry|worries|nema|fund|kuro|slope|zone|notebook|meter|ending|' +
  'fest|party|shelter|gift|survey|free|ev|keep|nb|sound|about';
const used = new Set();
codeFiles.forEach(f => {
  for (const m of read(f).matchAll(new RegExp(`['\`"]((?:${PREFIXES})\\.[A-Za-z0-9.]+[A-Za-z0-9])['\`"]`, 'g'))) used.add(m[1]);
});
['index.html', 'art-test.html', 'sound-test.html'].forEach(f => {
  for (const m of read(f).matchAll(/data-i18n(?:-aria-label)?="([^"]+)"/g)) used.add(m[1]);
});
// Text codes the code builds from parts
const D = HM.DATA;
D.friends.forEach(who => used.add('who.' + who));
// Everything the residents say (js/talks.js)
Object.entries(HM.TALKS).forEach(([who, talk]) => {
  [...talk.meet, talk.again, ...talk.chats.map(c => c.key)].forEach(k => used.add(k));
  ok(D.residents[who], `js/talks.js has lines for "${who}", who is not a resident`);
  // Only conditions js/story.js knows, and only heart events that exist
  const WHEN = ['spot', 'weather', 'seasons', 'weekend', 'field', 'hearts', 'hours', 'flag', 'notFlag', 'event', 'fund'];
  talk.chats.forEach(c => Object.keys(c.when || {}).forEach(k => ok(WHEN.includes(k), `the line "${c.key}" has an unknown condition "${k}"`)));
  talk.chats.forEach(c => { if (c.when && c.when.event) ok(HM.events.byId(c.when.event), `the line "${c.key}" waits for an unknown event`); });
});
Object.entries(HM.REQUESTS).forEach(([friend, req]) => {
  [...req.ask, req.remind, ...req.done].forEach(k => used.add(k));
  ok(D.friends.includes(req.friend || friend), `the request "${friend}" belongs to an unknown household`);
  req.tasks.forEach(task => {
    (task.say || []).forEach(k => used.add(k));
    Object.keys(task.bring || {}).forEach(item => ok(D.items[item], `the request "${friend}" asks for an unknown thing "${item}"`));
    if (task.notNow) used.add(task.notNow);
    if (task.object) ok(HM.MAP.objects.some(o => o.id === task.object), `the request of "${friend}" needs "${task.object}", which is not on the map`);
    if (task.talk) ok(D.residents[task.talk], `the request of "${friend}" needs to talk to "${task.talk}", who is not a resident`);
  });
  Object.keys((req.reward || {}).items || {}).forEach(item => ok(D.items[item], `unknown reward "${item}"`));
});
Object.keys(D.residents).forEach(who => {
  used.add('who.' + who);
  ['loved', 'liked', 'neutral', 'disliked'].forEach(r => used.add(`${who}.gift.${r}`));
});
D.days.forEach((weather, i) => { used.add('weather.' + weather); used.add('announce.weather.' + weather); used.add('announce.news.' + (i + 1)); });
D.seasons.forEach((season, i) => { used.add('season.' + season); if (i) used.add('announce.season.' + season); });
HM.MAP.objects.forEach(o => {
  if (/Door$/.test(o.id) && !['homeDoor', 'genDoor', 'shopDoor'].includes(o.id)) used.add('obj.door.' + o.id.replace(/Door$/, ''));
  if (o.forage) ['pick', 'none', 'season'].forEach(k => used.add(`obj.${o.forage}.${k}`));
  if (['noticeBoard', 'postBox', 'busStop', 'bench', 'hidamariTree'].includes(o.id)) used.add('obj.' + o.id);
});
Object.keys(D.items).forEach(i => used.add('item.' + i));
D.speciesOrder.forEach(sp => ['', '.fact', '.hint'].forEach(k => used.add('species.' + sp + k)));
HM.MAP.areas.forEach(a => used.add('place.' + a.id));
used.add('place.field');
D.buildOrder.forEach(tl => { used.add('tile.' + tl); used.add('build.info.' + tl); });
['money', 'late', 'needs.seedling', 'notHere', 'rubble', 'maxPanels', 'naturalEdge', 'parts', 'helpers', 'workDayLate', 'rubbleHelpers', 'repair',
  'meeting', 'meetingWorries', 'condition', 'permit', 'quick', 'ordinance'].forEach(p => used.add('build.p.' + p));
D.plotOrder.forEach(id => {
  used.add('plot.' + id);
  const rule = D.plots[id].open;
  if (rule && !rule.later) ['plot.closed.' + id, `plot.open.${id}.1`, `plot.open.${id}.2`].forEach(k => used.add(k));
});
['wind', 'wildlife', 'light', 'water'].forEach(v => { used.add('view.' + v); used.add(`view.${v}.hint`); });
used.add('view.water.hintFlat');
// The village's decisions (Milestone 2.4): texts the code builds from parts
Object.entries(D.worries).forEach(([who, w]) => {
  ['need', 'ask', 'honestGood', 'good', 'honestBad', 'bad', 'thanks', 'nemaOk', 'nemaNo', w.fixable ? 'change' : 'promise']
    .forEach(k => used.add(`worry.${who}.${k}`));
});
D.friends.filter(f => f !== 'kurokawa').forEach(f => used.add('meeting.support.' + f));
['told', 'notTold', 'zone', 'mudflow', 'blame', 'ordinance'].forEach(n => used.add('meeting.note.' + n));
['village', 'nature', 'money'].forEach(l => { used.add('meeting.lead.' + l); used.add(`meeting.lead.${l}.say`); });
['factory.green', 'gen.green', 'gen.yellow', 'fumiko.green', 'fumiko.yellow', 'pond.green', 'pond.yellow', 'slope.red', 'slope.redMud']
  .forEach(v => used.add('zone.vote.' + v));
['gen', 'fumiko', 'pond'].forEach(id => used.add('zone.agree.' + id));
Object.entries(D.letters).forEach(([name, n]) => { for (let i = 1; i <= n; i++) used.add(`letter.${name}.${i}`); });
D.endings.forEach(e => ['title', 'name', '1', '2', '3', '4'].forEach(k => used.add(`ending.${e}.${k}`)));
D.friends.forEach(f => ['high', 'mid', 'low', 'five'].forEach(l => used.add(`ending.epi.${f}.${l}`)));
// The ending scene's words: every friend, and the variants (js/community.js)
D.friends.forEach(f => used.add('ending.word.' + f));
['gen.paddy', 'midori.site', 'hiro.roof', 'kurokawa.quit'].forEach(v => used.add('ending.word.' + v));
['forest', 'restored', 'scar', 'park'].forEach(k => used.add('ending.slope.' + k));
['partner', 'quick', 'harmless'].forEach(k => used.add('summary.mudflow.' + k));
['partner', 'quick'].forEach(k => { used.add('summary.slope.' + k); used.add('announce.slope.' + k); });
['sun', 'nature', 'community'].forEach(k => { used.add('meter.' + k); used.add(`meter.${k}.about`); });
// Festivals, gifts and Midori's survey (Milestone 2.5)
const FEST_PEOPLE = ['oda', 'gen', 'fumiko', 'midori', 'aya', 'ken', 'sora', 'hiro', 'kuma', 'rin', 'sato', 'kurokawa'];
D.festivalOrder.forEach(id => {
  const f = D.festivals[id];
  used.add(`fest.${id}.done`);
  if (id !== 'shelter') used.add('announce.fest.' + id);
  if (f.place) { ['join', 'now'].forEach(k => used.add(`fest.${id}.${k}`)); FEST_PEOPLE.forEach(who => { used.add(`fest.${id}.${who}`); used.add(`fest.${id}.${who}.y2`); }); }
  if (f.hall) { used.add(`fest.${id}.time`); used.add('obj.bed.' + id); }
});
D.giftOrder.forEach(id => { used.add('gift.' + id); used.add(`gift.${id}.done`); });
['site', 'good', 'low'].forEach(v => used.add('survey.' + v));
['hedge', 'pond', 'meadow', 'corridor', 'more'].forEach(v => used.add('survey.tip.' + v));
['good', 'poor'].forEach(h => used.add('summary.harvest.' + h));
// Heart events (Milestone 3.1): every line, choice, answer, hint and keepsake
HM.events.keys().forEach(k => used.add(k));
// The listening page (Milestone 3.3): one text for each tune, sound of nature and short sound
Object.keys(HM.MUSIC).forEach(n => used.add('sound.tune.' + n));
['frogs', 'cicadas', 'crickets', 'chimes', 'birds', 'rain', 'storm'].forEach(n => used.add('sound.nature.' + n));
['talk', 'choose', 'pickup', 'build', 'coin', 'species', 'heart', 'knock', 'chime'].forEach(n => used.add('sound.fx.' + n));
// Morning news in the free year (Milestone 3.2)
D.freeYearNews.forEach(day => used.add(`announce.news.${day}.y2`));
// The About window (Milestone 4.2)
['made', 'art', 'font', 'facts', 'fiction', 'privacy'].forEach(k => used.add('about.' + k));
// The village notebook (Milestone 3.2)
HM.notebook.ORDER.forEach(id => { used.add(`nb.${id}.title`); used.add(`nb.${id}.text`); });
const spriteNames = /^(ui|tile|critter)\.(alert|sun|cursor|item|concrete|spacedTop|cleared|hallTable|lantern|lamp|donation|roofPanel)$/;
[...used].filter(k => !spriteNames.test(k) && !(k in en)).forEach(k => fail(`the code uses "${k}", but it is not in the language files`));

// Furigana (Milestone 3.3): every kanji in the Japanese texts has a reading in lang/ja-readings.js
{
  const noReading = new Map();
  Object.entries(LANG.ja).forEach(([key, text]) => {
    // (numbers stand in for the placeholders, as in the game)
    HM.furigana.parse(text.replace(/\{[^}]+\}/g, '3')).forEach(p => {
      const loose = p.text !== undefined ? p.text : (p.reading ? '' : p.base);
      [...loose].filter(c => /[一-鿿々]/.test(c)).forEach(c => noReading.set(c, key));
    });
  });
  noReading.forEach((key, c) => fail(`the kanji ${c} (in "${key}") has no reading in lang/ja-readings.js`));
  // A word of two or more kanji must be in the list as a whole, not read kanji by kanji
  // (a number with its counter, like 3日 in 3日目, may split a word)
  const split = new Map();
  Object.entries(LANG.ja).forEach(([key, text]) => {
    const plainText = text.replace(/\{[^}]+\}/g, '3');
    const owner = [];
    HM.furigana.parse(plainText).forEach((p, n) => [...(p.text !== undefined ? p.text : p.base)].forEach(() => owner.push(p.text !== undefined ? -1 : n)));
    const starts = HM.furigana.parse(plainText).map(p => (p.base || '')[0] || '');
    for (const m of plainText.matchAll(/[一-鿿々]{2,}/g)) {
      const pieces = new Set(owner.slice(m.index, m.index + m[0].length));
      if (pieces.size > 1 && ![...pieces].some(n => /[0-9]/.test(starts[n]))) split.set(m[0], key);
    }
  });
  split.forEach((key, word) => fail(`the word ${word} (in "${key}") is not in lang/ja-readings.js as a whole`));
  ok(HM.furigana.parse('3人と1人').map(p => p.reading || p.text).join() === '3,にん,と,ひとり', 'counters after numbers have their own readings');
  ok(HM.furigana.parse('生け垣').map(p => p.reading || p.text).join() === 'い,け,がき', 'a word with kana inside gets a reading for each kanji');
}

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
  // The player's four looks (Phase 3) are drawn
  D.looks.forEach(look => ok(HM.SPRITE_DATA.PEOPLE[look], `the player's look "${look}" has no drawing`));
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
Object.entries(D.residents).forEach(([who, r]) => {
  ok(map.spots[r.home], `${who}'s home "${r.home}" is not a spot`);
  ok(D.friends.includes(r.friend), `${who} belongs to an unknown household "${r.friend}"`);
  ok(!r.plans[r.plans.length - 1].when, `${who}'s last plan should fit every day`);
  r.plans.forEach(p => p.at.forEach(([, spot]) => [].concat(spot).forEach(name =>
    ok(name === 'inside' || map.spots[name], `${who} goes to an unknown spot "${name}"`))));
  [...r.loved, ...r.liked, ...r.disliked].forEach(item => ok(D.items[item], `${who} likes an unknown item "${item}"`));
});
D.shop.items.forEach(item => ok(D.items[item] && D.items[item].price, `the shop sells "${item}" without a price`));
// The plots: inside the map, one for each plot in the game data, the home field is soil, and open plots have a sign
D.plotOrder.forEach(id => ok(map.plots.some(p => p.id === id), `plot "${id}" is not on the map`));
map.plots.forEach(p => ok(p.x >= 0 && p.y >= 0 && p.x + p.w <= map.width && p.y + p.h <= map.height, `plot "${p.id}" is outside the map`));
const home = map.plots.find(p => p.id === 'home');
for (let y = home.y; y < home.y + home.h; y++) for (let x = home.x; x < home.x + home.w; x++) ok(map.rows[y][x] === 'F', `the home field should be soil (F) at ${x},${y}`);
D.plotOrder.filter(id => !(D.plots[id].open || {}).later).forEach(id => ok(map.objects.some(o => o.plot === id), `plot "${id}" has no sign`));
Object.values(D.plots).forEach(p => p.tools.forEach(tl => ok(D.buildTiles[tl], `unknown tile "${tl}" in a plot`)));
console.log(`  ${map.width} × ${map.height} tiles, ${reach.size} reachable`);

// ---------- 4. Rules ----------
section('4. Rules');
const R = HM.rules;
const s = R.newGame('Test');
ok(s.money === D.money.start + D.money.allowance, 'a new game should start with the starting money plus the allowance');
ok(s.day === 1 && s.minutes === D.time.firstDayStart, 'a new game should start on day 1 at 9:00');
// The player's look (Phase 3): one of four, each with its drawings; old saved games get the first
ok(R.lookOf(s) === D.looks[0] && R.lookOf(R.newGame('A', 'player3')) === 'player3', 'a new game should keep the chosen look');
ok(R.lookOf(R.newGame('A', 'nobody')) === D.looks[0] && R.lookOf({}) === D.looks[0], 'an unknown or missing look should be the first look');
// Friendship
ok(R.talk(s, 'gen') && !R.talk(s, 'gen'), 'only the first chat of the day should give points');
ok(R.giveGift(s, 'gen', 'persimmon') === 'loved' && s.friends.gen.points === D.points.talk + D.points.loved, 'a loved gift should give its points');
ok(R.giveGift(s, 'gen', 'tea') === null, 'only one gift per resident per day');
ok(R.heartsOf(99) === 0 && R.heartsOf(100) === 1 && R.heartsOf(9999) === D.hearts.max, 'hearts should be points ÷ 100, at most 5');
// Building on your home field
const plan = s.plots.home.tiles.slice();
plan[0] = 'dense'; plan[1] = 'spaced'; plan[4] = 'hedge'; plan[5] = 'meadow';
const check = R.checkPlan(s, 'home', plan);
ok(check.ok && check.cost === 20000 + 24000 + 2000 + 500 && check.minutes === 4 * D.build.minutesPerTile, 'a small plan should be allowed, with the right cost and time');
const stats = R.plotStats(s, 'home', plan);
ok(stats.power === 17 && stats.nature === 1 + 3 + 2 + D.varietyBonus * 2, `nature points should include the variety bonus (got ${stats.nature})`);
const big = s.plots.home.tiles.map(() => 'meadow');
ok(R.checkPlan(s, 'home', big).problems.includes('helpers'), 'more than 8 tiles need a work day with friends');
const hedges = s.plots.home.tiles.slice(); [0, 1, 2, 3, 4].forEach(i => { hedges[i] = 'hedge'; });
ok(R.checkPlan(s, 'home', hedges).problems.includes('needs.seedling'), 'hedges should need seedlings');
const rich = s.plots.home.tiles.slice(); [0, 1, 2].forEach(i => { rich[i] = 'spaced'; });
ok(R.checkPlan(s, 'home', rich).problems.includes('money'), 'a plan you cannot pay for should not be allowed');
const tooManyPanels = s.plots.home.tiles.slice(); [0, 1, 2, 3, 4].forEach(i => { tooManyPanels[i] = 'dense'; });
ok(R.checkPlan(s, 'home', tooManyPanels).problems.includes('parts'), 'the starter kit has parts for 4 panels only');
const notHere = s.plots.home.tiles.slice(); notHere[0] = 'floating';
ok(R.checkPlan(s, 'home', notHere).problems.includes('notHere'), 'floating panels only on the pond');
const before = s.money;
R.buildPlan(s, 'home', plan);
ok(s.money === before - check.cost && s.bag.seedling === D.startBag.seedling - 1 && s.flags.starterPanels === D.starterPanels - 2,
  'building should cost money, seedlings and panel parts');
const removePlan = s.plots.home.tiles.slice(); removePlan[0] = null;
ok(R.checkPlan(s, 'home', removePlan).refund === D.buildTiles.dense.cost * D.build.refund, 'removing a built tile should give half its cost back');
// The plot rules
const g = R.newGame('Test');
ok(!g.plots.gen.open && g.plots.home.open, 'only your home field is open at the start');
g.friends.gen.points = 400;
ok(R.canOpen(g, 'gen') && !R.canOpen(g, 'slope'), 'Gen-san opens his paddy at 4 hearts; the slope comes later');
const pondPlan = g.plots.pond.tiles.map((t, i) => (i < 19 ? 'floating' : null));
g.friends.hiro.points = 200;
ok(R.checkPlan(g, 'pond', pondPlan).problems.includes('maxPanels'), 'floating panels may cover at most half of the pond plot');
const pg = map.plots.find(p => p.id === 'pond');
const ring = g.plots.pond.tiles.map((t, i) => (i === 0 ? 'floating' : null));
const inner = g.plots.pond.tiles.map((t, i) => (i === pg.w + 1 ? 'floating' : null));
ok(R.checkPlan(g, 'pond', ring).problems.includes('naturalEdge') && !R.checkPlan(g, 'pond', inner).problems.includes('naturalEdge'), 'the outer ring of the pond stays natural');
ok(R.checkPlan(g, 'factory', g.plots.factory.tiles.map((t, i) => (i === 0 ? 'meadow' : null))).problems.includes('rubble'), 'the factory rubble must be cleared first');
g.minutes = 9 * 60;
ok(!R.checkRubble(R.newGame('Alone')).ok, 'clearing the rubble needs two friends');
g.friends.gen.points = 400; g.friends.kuma.points = 200;
ok(R.clearRubble(g, 'factory') && g.plots.factory.rubbleCleared && g.minutes === D.workDay.endAt * 60, 'a rubble work day lasts until the evening');
g.minutes = 9 * 60;
const workPlan = g.plots.home.tiles.map(() => 'meadow');
const work = R.checkPlan(g, 'home', workPlan);
ok(work.ok && work.workDay && work.helpers.length >= 1, 'with friends, a big plan becomes a work day');
// Corridors count only when connected; panels without a hedge to the south are exposed
const fp = map.plots.find(p => p.id === 'fumiko');
const corr = Array(fp.w * fp.h).fill(null);
corr[fp.w * 2 + 3] = 'corridor';
ok(!R.connectedCorridors('fumiko', corr).size, 'a lonely corridor tile is not connected');
corr[fp.w * 2 + 0] = 'corridor'; corr[fp.w * 2 + 1] = 'corridor'; corr[fp.w * 2 + 2] = 'corridor'; corr[fp.w * 2 + 4] = 'pond';
ok(R.connectedCorridors('fumiko', corr).size === 4, 'a corridor from the edge to a pond is connected');
const wind = Array(16).fill(null); wind[0] = 'dense'; wind[1] = 'dense'; wind[13] = 'hedge';
ok(JSON.stringify(R.exposedPanels('home', wind)) === '[0]', 'a hedge south of a panel shelters it');
// The light rule on Gen-san's paddy
const paddy = g.plots.gen.tiles.map((t, i) => (i < 30 ? 'spaced' : null));
ok(R.plotStats(g, 'gen', paddy).shade < D.agriShadeLimit, 'about half spaced panels keeps the paddy under 30% shade');
const dark = g.plots.gen.tiles.map((t, i) => (i < 40 ? 'spaced' : null));
ok(R.plotStats(g, 'gen', dark).shade >= D.agriShadeLimit, 'too many panels shade the paddy too much');
ok(R.checkPlan(g, 'gen', g.plots.gen.tiles.map((t, i) => (i === 0 ? 'dense' : null))).problems.includes('notHere'), 'only spaced panels on the paddy');
// Vegetables: sow, grow with light, harvest; nothing grows under dense panels
const v = R.newGame('Test');
ok(R.plant(v, 0, 'seedKomatsuna') && !R.plant(v, 0, 'seedKomatsuna'), 'one crop per tile');
v.plots.home.tiles[1] = 'dense';
ok(!R.plant(v, 1, 'seedKomatsuna'), 'nothing can be sown under dense panels');
for (let d = 0; d < D.crops.komatsuna.days; d++) R.endDay(v);
ok(R.isGrown(R.cropAt(v, 0)) && R.harvest(v, 0) === 'komatsuna' && v.bag.komatsuna === 1, 'komatsuna can be harvested after 3 days');
v.minutes = 10 * 60;
ok(R.sell(v, 'komatsuna') && !v.bag.komatsuna, 'vegetables can be sold to Hiro');
// The typhoon loosens exposed panels; the harvest check on Gen-san's paddy
const ty = R.newGame('Test');
ty.plots.home.tiles = Array(16).fill(null); [0, 1, 2, 3].forEach(i => { ty.plots.home.tiles[i] = 'dense'; });
ty.day = D.days.indexOf('typhoon') + 1;
const tsum = R.endDay(ty);
ok(tsum.loose === 2 && ty.plots.home.loose.length === 2, 'the typhoon loosens about half of the exposed panels');
ty.plots.gen.tiles = paddy.slice();
ty.day = D.harvestDay;
const hsum = R.endDay(ty);
ok(hsum.harvest === 'good' && hsum.friends.find(f => f.who === 'gen').gained === D.points.event, 'enough light gives a good rice harvest, and Gen-san is happy');
// Saves from Milestone 2.2 (version 2) are brought up to date
const old = JSON.parse(R.serialize(R.newGame('Old')));
old.version = 2; old.field = Array(16).fill(null); old.field[0] = 'dense'; delete old.plots;
const up = R.deserialize(JSON.stringify(old));
ok(up && up.plots.home.tiles[0] === 'dense' && up.flags.starterPanels === D.starterPanels - 1, 'a save from Milestone 2.2 should still load');
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
// The Mori family shares one heart meter; gifts follow each person's taste; the shop
const m = R.newGame('Test');
ok(Object.keys(m.friends).length === D.friends.length && R.friendOf('sora') === 'mori', "Aya, Ken and Sora should share the Mori family's hearts");
R.talk(m, 'aya');
ok(!R.talk(m, 'sora') && m.friends.mori.points === D.points.talk, 'one first chat per day for the whole family');
m.bag.stone = 1;
ok(R.giveGift(m, 'sora', 'stone') === 'loved' && m.friends.mori.points === D.points.talk + D.points.loved, "Sora loves shiny stones, and the points go to the family");
ok(R.giveGift(m, 'ken', 'tea') === null, 'one gift per household per day');
m.minutes = 10 * 60;
const cash = m.money;
ok(R.shopOpen(m) && R.buy(m, 'manju') && m.money === cash - D.items.manju.price && m.bag.manju === 1, 'buying at the shop should cost money and fill the bag');
m.day = D.shop.closedDay;
ok(!R.shopOpen(m), 'the shop should be closed on its closing day');
console.log('  friendship, gifts, the shop, plots, building, work days, vegetables, the typhoon, money, days and saving checked');

// ---------- 4b. The village's decisions (Milestone 2.4) ----------
const V = HM.community;
const hearts = (st, list) => Object.entries(list).forEach(([f, h]) => { st.friends[f].points = h * 100; });
const fpG = map.plots.find(p => p.id === 'fumiko');
// Worries on Fumiko-san's field
const w = R.newGame('Test');
const empty = w.plots.fumiko.tiles.slice();
const okOf = (st, plan) => Object.fromEntries(V.worries(st, 'fumiko', plan).map(x => [x.who, x.ok]));
let ok0 = okOf(w, empty);
ok(ok0.gen && !ok0.fumiko && !ok0.mori && !ok0.midori && ok0.hiro && !('kuma' in ok0), 'an empty plan on Fumiko-san\'s field answers Gen-san and Hiro only');
const ringPlan = empty.map((t, i) => { const x = i % fpG.w, y = Math.floor(i / fpG.w); return x === 0 || y === 0 || x === fpG.w - 1 || y === fpG.h - 1 ? 'hedge' : 'spaced'; });
ok0 = okOf(w, ringPlan);
ok(ok0.gen && ok0.fumiko && ok0.mori && ok0.midori, 'a hedge all round with spaced panels inside answers Gen-san, Fumiko-san, the Mori family and Midori');
const densePlan = ringPlan.slice(); densePlan[fpG.w + 1] = 'dense';
ok(!okOf(w, densePlan).gen, 'dense panels on farmland worry Gen-san');
ok(V.worries(w, 'factory', empty.slice(0, 80)).find(x => x.who === 'mori').ok, 'the old factory fence answers the Mori family');
// A plan waits for a town meeting; nemawashi; the room's warmth
hearts(w, { fumiko: 4 });
w.plots.fumiko.open = true;
w.plots.fumiko.plan = ringPlan.slice();
ok(V.pendingPlots(w).includes('fumiko') && R.checkPlan(w, 'fumiko', ringPlan).problems[0] === 'meeting', 'a plan on Fumiko-san\'s field waits for a town meeting');
ok(V.meetingStart(w, 'fumiko').warmth === D.meeting.start, 'before nemawashi, the meeting starts at the normal warmth');
w.flags.nemawashi = true;
ok(V.nemawashiPlot(w, 'gen') === 'fumiko' && V.nemawashiPlot(w, 'sato') === null, 'after nemawashi, residents with a worry can hear about the plan');
ok(V.meetingStart(w, 'fumiko').warmth === D.meeting.start - 1, 'without telling everyone, the meeting starts colder');
V.worries(w, 'fumiko').forEach(x => V.tell(w, 'fumiko', x.who));
ok(V.toldAll(w, 'fumiko') && V.meetingStart(w, 'fumiko').warmth === D.meeting.start + 1, 'telling everyone first warms the meeting');
ok(V.answerEffect('honest', true) > 0 && V.answerEffect('honest', false) < 0 && V.answerEffect('vague') < V.answerEffect('change'), 'honest answers with a real answer warm the room, vague answers cool it');
V.scheduleMeeting(w, 'fumiko');
ok(w.meeting.day === w.day + 1 && !V.meetingToday(w), 'a town meeting is the next evening');
// The meeting agrees with a promise: Fumiko-san's hedge; the farmland permit for dense panels
const noHedge = ringPlan.map((t, i) => (i >= fpG.w * (fpG.h - 1) ? null : t));
V.approve(w, 'fumiko', ['fumiko']);
ok(w.plots.fumiko.approved && w.meeting === null && w.stats.meetings === 1, 'a meeting that agrees approves the plot');
const c1 = R.checkPlan(w, 'fumiko', noHedge);
ok(c1.problems.includes('condition') && c1.unmet[0] === 'fumiko', 'a plan without the promised hedge cannot be built');
ok(!R.checkPlan(w, 'fumiko', ringPlan).problems.includes('condition'), 'keeping the promise lets you build');
const dense2 = ringPlan.slice(); dense2[fpG.w + 2] = 'dense';
ok(R.checkPlan(w, 'fumiko', dense2).problems.includes('permit') && !R.checkPlan(w, 'fumiko', ringPlan).problems.includes('permit'),
  'dense panels on farmland wait for the permit; spaced panels over crops do not');
w.day += D.plots.fumiko.permit;
ok(!R.checkPlan(w, 'fumiko', dense2).problems.includes('permit'), 'after 2 days the permit has arrived');
// The citizen fund: friends with 3 hearts or more invest (the Mori family from 4)
const f = R.newGame('Fund');
hearts(f, { gen: 3, midori: 5, mori: 3, hiro: 4 });
V.startFund(f, 'fumiko');
const cash0 = f.money;
let fsum = R.endDay(f);
ok(fsum.fund && fsum.fund.fresh.includes('gen') && fsum.fund.fresh.includes('midori') && !fsum.fund.fresh.includes('mori') &&
  f.funds[0].investors.gen === D.fund.amounts[3] && f.funds[0].investors.midori === D.fund.amounts[5],
  'friends with 3 or more hearts invest; the Mori family waits for 4 hearts');
ok(f.money >= cash0 + D.fund.amounts[3] + D.fund.amounts[5] + D.fund.amounts[4], 'the fund\'s money goes into your purse');
R.endDay(f); fsum = R.endDay(f);
ok(fsum.fund.closed && !V.openFund(f), 'the fund closes after 3 days');
const q = R.newGame('Quick');
hearts(q, { hiro: 4 });
q.flags.quickDeal = true;
ok(V.investment(q, 'hiro') === 0 && !V.canSuggestFund(q), 'Hiro does not invest after a deal with Quick Solar Co.');
// Mr. Kurokawa: leasing your home field
const l = R.newGame('Lease');
const cash1 = l.money;
V.kurokawaDeal(l, 'lease');
ok(l.money === cash1 + D.kurokawa.lease && l.plots.home.owner === 'quick' && !l.plots.home.open &&
  R.checkPlan(l, 'home', l.plots.home.tiles.map(() => 'meadow')).problems.includes('quick') && R.powerShare(l, 'home') === 0,
  'leasing your home field gives money now, but the field and its power are Quick Solar\'s');
// Partner on the slope: built overnight, no drainage, a share of the power, and the mudflow in the rainy season
const pt = R.newGame('Partner');
pt.day = 3;
V.kurokawaDeal(pt, 'partner');
R.endDay(pt);
const sl = pt.plots.slope;
ok(sl.owner === 'partner' && sl.open && sl.approved && sl.tiles.filter(Boolean).length === 24, 'his crew builds the partner garden overnight');
ok(V.runoff('slope', sl.tiles).loose.length === 24 && V.runoff('home', pt.plots.home.tiles).flat, 'without drainage, all the rain runs off the slope; flat plots keep it');
const powerOnly = R.plotStats(pt, 'slope').power;
ok(Math.abs(R.dayPower(Object.assign({}, pt, { day: 1 })) - Math.round(powerOnly * D.kurokawa.share)) <= 1, 'you get your share of the partner garden\'s power');
const pts = { kuma: pt.friends.kuma.points, midori: pt.friends.midori.points };
hearts(pt, { kuma: 2, midori: 2 });
pt.day = D.kurokawa.mudflowDay;
const ms = R.endDay(pt);
ok(ms.mudflow === 'partner' && pt.flags.mudflow && pt.flags.ordinance && pt.friends.kuma.points === 200 + D.kurokawa.blame.kuma &&
  pt.letters.includes('ordinance'), 'the mudflow from your garden costs hearts and brings the ordinance');
ok(R.checkPlan(pt, 'slope', sl.tiles.map((t, i) => (i === 0 ? 'dense' : t))).problems.includes('ordinance'), 'after the ordinance, no new panels on the slope');
ok(V.meetingNeed(pt) === D.meeting.needOrdinance && V.meetingStart(pt, 'fumiko').notes.includes('blame'), 'after your mudflow, meetings are harder');
ok(V.distrust(pt) && V.investment(Object.assign(pt, {}), 'hiro') === 0, 'Hiro does not trust you after your mudflow');
// Ditches catch the runoff: with drainage there is only a small, harmless runoff
const dr = R.newGame('Drained');
dr.day = 3; V.kurokawaDeal(dr, 'partner'); R.endDay(dr);
const drained = dr.plots.slope.tiles.map((t, i) => (Math.floor(i / 8) === 7 ? 'drain' : t));
ok(!V.runoff('slope', drained).loose.length && V.runoff('slope', drained).caught.length === 24, 'a ditch at the bottom catches every column');
dr.plots.slope.tiles = drained;
dr.day = D.kurokawa.mudflowDay;
const ctxMath = vm.runInContext('Math', ctx), realRandom = ctxMath.random;
ctxMath.random = () => 0.01;
const hs = R.endDay(dr);
ctxMath.random = realRandom;
ok(hs.mudflow === 'harmless' && !dr.flags.mudflow, 'with drainage, the rainy season does no harm');
// Saying no: he builds his own park at the start of summer, unless Mr. Oda wrote to the owner
const no = R.newGame('No');
V.kurokawaDeal(no, 'no');
no.day = D.kurokawa.parkDay - 1;
const ns = R.endDay(no);
ok(ns.slopeBuilt === 'quick' && no.plots.slope.owner === 'quick' && R.powerShare(no, 'slope') === 0, 'if you say no, he builds his own park in summer');
const saved = R.newGame('Saved');
hearts(saved, { oda: 3 });
saved.flags.kuroMet = true;
ok(V.canAskOda(saved), 'with 3 hearts, Mr. Oda can write to the slope\'s owner');
saved.flags.slopeSaved = true;
saved.day = D.kurokawa.parkDay - 1;
R.endDay(saved);
ok(!V.slopeBuilt(saved), 'after Mr. Oda\'s letter, the slope stays a forest');
// Mud from his park: no blame for you; clean up and restore
hearts(no, { kuma: 2, midori: 2, gen: 2 });
no.day = D.kurokawa.mudflowDay;
const ns2 = R.endDay(no);
ok(ns2.mudflow === 'quick' && no.friends.kuma.points === 200, 'mud from Quick Solar\'s park is not blamed on you');
no.minutes = 9 * 60;
ok(V.canCleanUp(no) && V.cleanUp(no) && no.flags.cleanUp && no.friends.kuma.points === 200 + D.kurokawa.cleanUp.kuma, 'cleaning up the mud brings hearts back');
hearts(no, { kurokawa: 4 });
V.restoreSlope(no);
ok(no.flags.slopeRestored && !no.plots.slope.tiles.some(t => t && D.buildTiles[t].panel) && V.slopeEnding(no) === 'restored', 'with Mr. Kurokawa, the slope can be restored');
// His autumn offer to buy your garden
const b = R.newGame('Buy');
b.plots.home.tiles = b.plots.home.tiles.map((t, i) => (i < 4 ? 'dense' : i < 8 ? 'hedge' : null));
b.day = D.kurokawa.buyFromDay;
const offer = V.buyOffer(b);
ok(offer && offer.plot === 'home' && offer.price === Math.round((4 * 20000 + 4 * 2000) * D.kurokawa.buyFactor), 'he offers 1.5 times what the garden cost');
hearts(b, { midori: 2 });
V.sellGarden(b, 'home');
ok(b.plots.home.owner === 'quick' && !b.plots.home.tiles.includes('hedge') && b.friends.midori.points === 200 + D.kurokawa.soldPoints,
  'if you sell, the hedges are cut and Midori is hurt');
// The promotion zone
const z = R.newGame('Zone');
hearts(z, { gen: 4, sato: 3 });
const votes = V.zoneVotes(z);
ok(votes.factory === 'green' && votes.slope === 'red' && votes.gen === 'green' && votes.fumiko === 'yellow', 'the village votes by its friendships and worries');
const spoken = V.speakFor(V.speakFor(votes, 'fumiko'), 'slope');
ok(spoken.fumiko === 'green' && spoken.slope === 'red', 'speaking for a yellow place turns it green; the slope stays red');
z.day = D.zoning.day;
ok(V.zoningToday(z), 'the workshop is on autumn day 1 when Ms. Sato has 3 hearts');
z.plots.fumiko.permitDay = z.day + 2;
V.finishZoning(z, spoken);
ok(z.zone.fumiko === 'green' && !z.plots.fumiko.permitDay && V.meetingStart(z, 'fumiko').notes.includes('zone'), 'the zone needs no farmland permit and warms meetings');
hearts(z, { sato: 4 });
z.events = Object.assign(z.events || {}, { 'sato.4': 1 });
ok(V.grantFor(z, 'fumiko', { newPanels: 2 }) === D.zoning.grant && V.grantFor(z, 'fumiko', { newPanels: 2 }) === 0, 'the support grant comes once');
// Letters
const lt = R.newGame('Letters');
lt.day = D.kurokawa.fromDay - 1;
R.endDay(lt);
ok(lt.letters.includes('kuroFlyer') && V.letterLines('kuroFlyer').length === D.letters.kuroFlyer, 'Quick Solar Co.\'s flyer arrives on spring day 3');
// The meters and the endings
const e = R.newGame('Ending');
ok(V.ending(e) === 'firstStep', 'a year with little done ends with "A small first step"');
D.friends.forEach(fr => { e.friends[fr].points = 500; });
e.plots.factory.tiles = e.plots.factory.tiles.map((t, i) => (i % 2 ? 'dense' : 'meadow'));
e.plots.fumiko.tiles = e.plots.fumiko.tiles.map((t, i) => ['hedge', 'meadow', 'pond', 'corridor'][i % 4]);
const mm = V.meters(e);
ok(mm.sun >= 60 && mm.nature >= 60 && mm.community >= 60 && V.ending(e) === 'sunVillage', 'all three meters high: "A village in the sun"');
ok(V.epilogue(e, 'gen') === 'high' && V.slopeEnding(e) === 'forest', 'epilogues follow the hearts; an untouched slope stays a forest');
// Saves from Milestone 2.3 (version 3) are brought up to date
const v3 = JSON.parse(R.serialize(R.newGame('Old3')));
v3.version = 3; delete v3.letters; delete v3.meeting; delete v3.funds; delete v3.zone; delete v3.stats.meetings;
const up3 = R.deserialize(JSON.stringify(v3));
ok(up3 && up3.version === 4 && Array.isArray(up3.letters) && Array.isArray(up3.funds) && up3.stats.meetings === 0, 'a save from Milestone 2.3 should still load');
console.log('  worries, nemawashi, the town meeting, the permit, the fund, Mr. Kurokawa, the slope, the zone, letters, meters and endings checked');

// ---------- 4c. Nature, festivals and the free year (Milestone 2.5) ----------
const F = HM.festivals;
ok(D.speciesOrder.length === 32 && D.speciesOrder.every(sp => D.species[sp]), 'the nature diary has 32 species, each with its habitat');
// Every festival on the map has a spot for everyone, on ground you can walk to
D.festivalOrder.filter(id => D.festivals[id].place).forEach(id => FEST_PEOPLE.forEach(who =>
  ok(map.spots[`fest.${id}.${who}`], `nobody knows where ${who} stands at the ${id} festival`)));
const fe = R.newGame('Festival');
fe.day = D.festivals.hanami.day; fe.minutes = (D.festivals.hanami.from + 1) * 60;
ok(F.activeFestival(fe) === 'hanami' && F.gatheringSpot(fe, 'gen') === 'fest.hanami.gen' && F.gatheringSpot(fe, 'kurokawa') === null,
  'during the cherry-blossom picnic, everyone gathers at the shrine (Mr. Kurokawa once you have met him)');
fe.minutes = (D.festivals.hanami.to) * 60;
ok(!F.activeFestival(fe), 'a festival ends at its hour');
const before5 = fe.friends.gen.points;
ok(F.join(fe, 'hanami') && !F.join(fe, 'hanami') && fe.friends.gen.points === before5 + D.festivalPoints && fe.stats.festivals === 1,
  'joining a festival gives friendship with everyone there, once');
ok(F.hallFestival(Object.assign({}, fe, { day: D.festivals.welcome.day })) === 'welcome', 'the welcome party is in the community hall');
// The firefly count follows the stream
const ff = R.newGame('Fireflies');
ok(F.fireflies(ff) === D.fireflies.clear, 'a clean stream: many fireflies');
ff.flags.mudflow = { day: 10, by: 'quick' };
ok(F.fireflies(ff) === D.fireflies.muddy, 'after the mudflow: few fireflies');
ff.flags.cleanUp = true;
ok(F.fireflies(ff) === D.fireflies.restored, 'after the clean-up, they start to come back');
// Gifts to the village
const gv = R.newGame('Gift');
const cash5 = gv.money, mori5 = gv.friends.mori.points;
ok(F.donate(gv, 'lanterns') && gv.money === cash5 - D.gifts.lanterns && gv.friends.mori.points === mori5 + D.giftPoints && !F.donate(gv, 'lanterns'),
  'a gift to the village costs money and gives friendship with everyone, once');
gv.money = 0;
ok(!F.donate(gv, 'battery'), 'a gift needs enough money');
gv.money = 100000;
F.donate(gv, 'battery');
ok(!F.shelterLit(gv), 'the battery alone does not light the shelter');
gv.plots.home.tiles[0] = 'dense';
ok(F.shelterLit(gv), 'with the battery and a garden with panels, the shelter stays lit');
// Midori's survey
const sv = R.newGame('Survey');
sv.plots.home.tiles = sv.plots.home.tiles.map((t, i) => ['hedge', 'meadow', 'pond', null][i % 4]);
ok(!F.surveyGardens(sv).length, 'the survey needs 4 hearts with Midori');
sv.friends.midori.points = 400;
ok(F.surveyGardens(sv).includes('home'), 'with 4 hearts, Midori offers to survey your gardens');
const sr = F.survey(sv, 'home');
ok(sr.score === R.plotStats(sv, 'home').nature && sr.verdict === (sr.score >= D.survey.site ? 'site' : sr.score >= D.survey.good ? 'good' : 'low') &&
  !F.surveyGardens(sv).includes('home'),
  'the survey shows the nature score, once a season');
// Snow on the panels
const sn = R.newGame('Snow');
sn.plots.home.tiles = sn.plots.home.tiles.map((t, i) => (i < 4 ? 'dense' : null));
sn.day = D.days.indexOf('snow') + 1;
const snowPower = R.dayPower(sn);
const sc = R.sweepCost(sn, 'home');
ok(sc.n === 4 && sc.minutes === 4 * D.snow.minutesPerPanel && R.sweep(sn, 'home') && R.dayPower(sn) === Math.round(40 * D.snow.swept) && snowPower === Math.round(40 * D.weatherPower.snow),
  'sweeping the snow off the panels gives half power instead of a tenth');
ok(!R.sweepCost(sn, 'home').n, 'swept panels need no more sweeping today');
// The free year
const fy = R.newGame('Free');
while (!fy.finished) R.endDay(fy);
const ending1 = HM.community.ending(fy);
ok(F.startFreeYear(fy) && fy.year === 2 && fy.day === 1 && !fy.finished && fy.ending === ending1, 'after the ending, the free year begins in spring');
ok(!F.storyYear(fy) && !HM.community.zoningToday(Object.assign({}, fy, { day: D.zoning.day })), 'the free year has no new story');
fy.day = D.kurokawa.fromDay - 1;
fy.letters = [];
R.endDay(fy);
ok(!fy.letters.includes('kuroFlyer'), 'no Quick Solar Co. flyer in the free year');
while (!fy.finished) R.endDay(fy);
ok(fy.finished && fy.year === 2, 'the free year ends after 28 days');
// The meters count festivals and gifts
const mt = R.newGame('Meters');
const c0 = HM.community.meters(mt).community;
mt.stats.festivals = 2; mt.stats.gifts = 1;
ok(HM.community.meters(mt).community === c0 + 2 * D.meters.festival + D.meters.gift, 'festivals and gifts raise the Community meter');
console.log('  species, festivals, gifts, the survey, snow and the free year checked');

// Heart events (Milestone 3.1, js/events.js)
const E = HM.events;
// Play an event's lines like the dialogue box does (always the first choice), and return the text codes
function playAll(game, steps) {
  const said = [], queue = steps.slice();
  while (queue.length) {
    const st = queue.shift();
    if (st.run) { const more = st.run(game); if (Array.isArray(more)) queue.unshift(...more); }
    else if (st.choice) queue.unshift(...st.choice[0].then);
    else said.push(st.say);
  }
  return said;
}
const gameOf = st => ({ state: st, passTime(m) { st.minutes += m; } });
const at = (st, day, hour) => { st.day = day; st.minutes = hour * 60; };
const setHearts = (st, f, h) => { st.friends[f].points = h * D.hearts.pointsPerHeart; };
// Every event belongs to the right household, at places that exist, and every keepsake is described
Object.entries(HM.EVENTS).forEach(([friend, list]) => {
  ok(list.length === 5 && list.every((ev, i) => ev.hearts === i + 1), `${friend} should have five heart events, one for each heart`);
  list.filter(ev => ev.script).forEach(ev => {
    ok(ev.door ? HM.MAP.objects.some(o => o.id === ev.door) : R.friendOf(ev.who) === friend, `event ${ev.id} happens with someone of another household`);
    [].concat(ev.spot || []).forEach(sp => ok(HM.MAP.spots[sp], `event ${ev.id} happens at an unknown spot "${sp}"`));
  });
});
ok(E.KEEPSAKES.length === D.friends.length, 'every household gives a keepsake at 5 hearts');
const ev = R.newGame('Events');
at(ev, 2, 7);
ok(!E.waiting(ev, 'gen', 'genPaddy'), 'no heart event before the first heart');
setHearts(ev, 'gen', 1);
ok(E.waiting(ev, 'gen', 'genPaddy') && !E.waiting(ev, 'gen', 'shopBenchA'), "Gen-san's first event waits at his paddy in the morning");
at(ev, 2, 12);
ok(!E.waiting(ev, 'gen', 'genPaddy'), "Gen-san's first event is a morning event");
ok(E.hint(ev, 'gen') === 'ev.gen.1.hint' && E.hint(ev, 'gen') === null, 'a resident hints at an event that cannot happen here, once a day at most');
at(ev, 5, 7);
const gp = ev.friends.gen.points;
const said = playAll(gameOf(ev), E.talk(gameOf(ev), 'gen', { spot: 'genPaddy' }));
ok(said[0] === 'gen.ev1.1' && E.done(ev, 'gen.1') && ev.friends.gen.points === gp + D.points.event && ev.minutes > 7 * 60,
  'a heart event plays its lines, then counts as done, gives its points and takes time');
// Order: the next event waits for the earlier one; events whose need isn't met don't hold the others back
setHearts(ev, 'gen', 3);
ok(E.next(ev, 'gen').id === 'gen.2', 'events come in order');
ev.events['gen.2'] = 1;
ok(E.next(ev, 'gen') === null, "Gen-san's 3-heart event needs crops under spaced panels");
setHearts(ev, 'gen', 4);
ok(E.next(ev, 'gen').id === 'gen.4', 'an event whose need is not met does not hold the later ones back');
delete ev.events['gen.2'];
ok(E.next(ev, 'gen').id === 'gen.4', 'an event that opens a plot does not wait for the earlier events');
playAll(gameOf(ev), E.talk(gameOf(ev), 'gen', { spot: 'shopBenchA' }));
ok(ev.plots.gen.open && E.opens('gen') === 'gen.4', "Gen-san's 4-heart event opens his paddy");
// The season fallback: Midori's summer event can happen in summer, or later
['midori.1', 'midori.2', 'midori.3'].forEach(id => { ev.events[id] = 1; });
setHearts(ev, 'midori', 4);
at(ev, 3, 19);
ok(!E.waiting(ev, 'midori', 'terraces'), 'a summer event does not happen in spring');
at(ev, 9, 19);
ok(E.waiting(ev, 'midori', 'terraces'), 'a summer event happens in summer');
at(ev, 17, 19);
ok(E.waiting(ev, 'midori', 'terraces'), 'a summer event can still happen in autumn (the fallback)');
// Fumiko-san's dinner: behind her door, and Rin's 3-heart event too
['fumiko.1', 'fumiko.2', 'fumiko.3', 'rin.1', 'rin.2'].forEach(id => { ev.events[id] = 1; });
setHearts(ev, 'fumiko', 4);
at(ev, 10, 18);
ok(!E.doorWaiting(ev, 'fumikoDoor'), "the dinner needs Rin's 3 hearts too");
setHearts(ev, 'rin', 3);
ok(E.doorWaiting(ev, 'fumikoDoor') && !E.doorWaiting(ev, 'genDoor'), "the dinner waits behind Fumiko-san's door in the evening");
const rp = ev.friends.rin.points;
playAll(gameOf(ev), E.door(gameOf(ev), 'fumikoDoor'));
ok(E.done(ev, 'fumiko.4') && E.done(ev, 'rin.3') && ev.friends.rin.points === rp + D.points.event, "the dinner is Fumiko-san's and Rin's event");
// Keepsakes, the support grant and Rin's students
['gen.2', 'gen.3'].forEach(id => { ev.events[id] = 1; });
setHearts(ev, 'gen', 5);
at(ev, 16, 7);
playAll(gameOf(ev), E.talk(gameOf(ev), 'gen', { spot: 'genPaddy' }));
ok(E.done(ev, 'gen.5') && E.keepsakes(ev).includes('strawHat'), "Gen-san's 5-heart event gives his straw hat");
ok(E.done(ev, 'sato.3') === !!ev.flags.zoningDone, "Ms. Sato's 3-heart event is the zoning workshop");
const helpersBefore = R.crew(ev);
ev.flags.rinStudents = true;
ok(R.crew(ev) === helpersBefore + 1, "after Rin's 4-heart event, her student friends help on work days");
// Saved games from before Phase 3: their events count as done
const oldSave = R.newGame('Old');
delete oldSave.events;
oldSave.flags.genEvent1 = true; oldSave.flags.nemawashi = true;
ok(E.done(oldSave, 'gen.1') && E.done(oldSave, 'oda.3'), 'events from older saved games count as done');
console.log('  heart events, hints, the season fallback, keepsakes and the dinner checked');

// The village notebook (Milestone 3.2, js/notebook.js)
const NB = HM.notebook;
const nb = R.newGame('Notebook');
ok(NB.ORDER.length === 20, 'the village notebook has 20 notes (design.md section 13)');
const first = NB.check(nb);
ok(first.join() === 'cooperator,akiya' && NB.check(nb).length === 0, 'two notes unlock at the start, each only once');
nb.flags.workDay = true;
nb.plots.home.tiles[0] = 'meadow';
ok(NB.check(nb).join() === 'yui,meadow', 'a work day and a meadow tile unlock their notes');
ok(NB.isNew(nb, 'yui') && (NB.markRead(nb), !NB.isNew(nb, 'yui')), 'notes are new until you read the notebook');
nb.day = D.festivals.shelter.day + 1;
ok(NB.check(nb).join() === 'hedge,shelter', 'after the typhoon, the notes about hedges and shelters unlock');
console.log('  the village notebook checked');

// The ending (Milestone 3.2): the year in numbers, words from close friends, epilogues after 5-heart events
const en2 = R.newGame('Ending');
ok(V.words(en2).length === 0 && V.review(en2).gardens === 0, 'without close friends nobody speaks, and there are no gardens yet');
en2.friends.gen.points = 300; en2.friends.kurokawa.points = 500;
ok(V.words(en2).map(w => w.key).join() === 'ending.word.gen', 'friends with 3 hearts speak; Mr. Kurokawa only once you have met him');
en2.plots.gen.tiles[0] = 'spaced'; en2.flags.kuroMet = true; en2.events['kurokawa.5'] = 1;
ok(V.words(en2).map(w => w.key).join() === 'ending.word.gen.paddy,ending.word.kurokawa.quit', 'some words depend on what happened');
ok(V.epilogue(en2, 'kurokawa') === 'five' && V.epilogue(en2, 'gen') === 'mid', "after a 5-heart event, the epilogue tells what came of it");
console.log('  the ending checked');

// Music and sounds of nature for the moment (Milestone 3.3, js/soundscape.js)
const SC = HM.soundscape;
const sg = { mode: 'world', scene: null, state: R.newGame('Sound') };
const dayOf = (season, weather) => { for (let d = 1; d <= 28; d++) if (R.seasonOf(d) === season && R.weatherOf(d) === weather) return d; return 0; };
sg.state.day = dayOf('summer', 'sunny'); sg.state.minutes = 12 * 60;
ok(SC.musicFor(sg) === 'day' && SC.natureFor(sg).join() === 'cicadas,chimes', 'a summer noon: the day tune, cicadas and wind chimes');
sg.state.minutes = 20 * 60;
ok(SC.musicFor(sg) === 'night' && SC.natureFor(sg).join() === 'frogs', 'a summer night: the night tune and frogs');
sg.state.day = dayOf('autumn', 'typhoon');
ok(SC.musicFor(sg) === null && SC.natureFor(sg).join() === 'storm', 'the typhoon: no music, only the storm');
sg.state.day = dayOf('winter', 'snow'); sg.state.minutes = 10 * 60;
ok(SC.natureFor(sg).length === 0, 'snow is quiet');
sg.scene = { kind: 'meeting' };
ok(SC.musicFor(sg) === 'hall' && (sg.scene = { kind: 'ending' }, SC.musicFor(sg) === 'ending'), 'the hall and the ending have their own tunes');
ok(Object.keys(HM.MUSIC).every(n => HM.MUSIC[n].layers.length), 'every tune has notes');
console.log('  music and sounds for the moment checked');

// Simulated years in four play styles (tools/simulate-year.js): every year reaches an ending
{
  const sim = require(path.join(ROOT, 'tools/simulate-year.js')).run(2);
  Object.entries(sim).forEach(([style, r]) => ok(r.ended === 2 && r.endings.every(e => D.endings.includes(e)), `a simulated "${style}" year did not reach an ending`));
  ok(sim.everyone.five === D.friends.length && sim.builder.five < sim.focused.five, 'friendships grow with the time you spend with people');
  console.log('  simulated years checked');
}

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

// ---------- 6. Offline and installing (Milestone 4.1) ----------
// The offline helper (sw.js) copies the files on its list. A file the game loads but the list
// forgets would be missing offline. (The font files are read from fonts/fonts.css by the helper.)
section('6. Offline and installing');
{
  const swList = (read('sw.js').match(/const FILES = \[([\s\S]*?)\];/) || [])[1];
  ok(swList, 'could not find the list of files (const FILES = [...]) in sw.js');
  const offlineFiles = new Set([...(swList || '').matchAll(/'([^']+)'/g)].map(m => (m[1] === './' ? 'index.html' : m[1])));
  offlineFiles.forEach(f => ok(fs.existsSync(path.join(ROOT, f)), `sw.js lists ${f}, which does not exist`));
  // Files the page loads: links and scripts in index.html, the picture sheet, and the icons in the app description
  const html = read('index.html');
  const pageFiles = [...html.matchAll(/(?:href|src)="([^"#:]+)"/g)].map(m => m[1].split('?')[0]).concat(['img/sprites.png']);
  const manifest = JSON.parse(read('manifest.webmanifest'));
  manifest.icons.forEach(icon => pageFiles.push(icon.src));
  new Set(pageFiles).forEach(f => {
    if (!fs.existsSync(path.join(ROOT, f))) fail(`index.html or the manifest uses ${f}, which does not exist`);
    else ok(offlineFiles.has(f), `${f} is used by the game but missing from the list in sw.js (it would be missing offline)`);
  });
  ok(html.includes('js/offline.js'), 'index.html does not load js/offline.js, so the offline helper never starts');
  // One version on every local stylesheet and script, so browsers never mix new and older files
  const local = [...html.matchAll(/(?:href|src)="((?:css|fonts|js|lang)\/[^"]+)"/g)].map(m => m[1]);
  const versions = new Set(local.map(f => (f.match(/\?v=([\w.-]+)$/) || [])[1]));
  ok(versions.size === 1 && !versions.has(undefined), `every stylesheet and script in index.html needs the same ?v=... (found: ${[...versions].join(', ')})`);
  // The icon files are up to date with the drawing in tools/make-icons.js
  const icons = require(path.join(ROOT, 'tools/make-icons.js')).build();
  Object.entries(icons).forEach(([name, data]) => ok(fs.existsSync(path.join(ROOT, 'icons', name)) &&
    (name.endsWith('.svg') ? read('icons/' + name).replace(/\r\n/g, '\n') === data   // (Windows may store text files with other line endings)
      : Buffer.compare(Buffer.from(data), fs.readFileSync(path.join(ROOT, 'icons', name))) === 0), `icons/${name} is out of date: run  node tools/make-icons.js`));
  console.log(`  ${offlineFiles.size} files for playing offline, ${Object.keys(icons).length} icon files`);
}

console.log(failures ? `\n${failures} problem(s) found.` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
