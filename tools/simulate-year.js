// Hidamari: plays many simulated years in different styles, to check the balance of friendships
// and that every year reaches an ending (Milestone 4.1). Run with:
//
//     node tools/simulate-year.js
//
// It uses the game's own rules (no screen). A simulated player follows a style each day:
// whom they chat with, whether they buy and give gifts, and whether they join the festivals.
// Requests and heart events are counted when the player meets that household (a heart event
// happens on about every second meeting, as places and times have to fit). Building is left out:
// it doesn't change friendships.
// The design's goal (design.md section 6): in one year, about 4 residents at 5 hearts and most
// others at 3 hearts.

'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.join(__dirname, '..');

function loadGame() {
  const ctx = vm.createContext({ console });
  ['js/i18n.js', 'lang/en.js', 'lang/ja.js', 'js/sprites-data.js', 'js/map-data.js', 'js/game-data.js', 'js/rules.js',
    'js/community.js', 'js/festivals.js', 'js/events.js', 'js/talks.js']
    .forEach(f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f }));
  return ctx.HM;
}

// A random number generator that gives the same years every run (so results can be compared)
function seeded(seed) {
  return () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
}

const SPEAKER = { mori: 'aya' };
const STYLES = {
  // Chats with four favourites every day and brings them gifts; others now and then
  focused: { favourites: ['gen', 'fumiko', 'midori', 'mori'], others: 0.35, gifts: 0.6, festivals: 0.9 },
  // Talks to five or six people a day, gifts sometimes
  casual: { favourites: [], others: 0.55, gifts: 0.25, festivals: 0.6 },
  // Goes everywhere, every day, with gifts (an upper limit)
  everyone: { favourites: null, others: 1, gifts: 0.8, festivals: 1 },
  // Mostly builds: few chats
  builder: { favourites: ['gen'], others: 0.2, gifts: 0.15, festivals: 0.4 }
};

function playYear(HM, styleName, random) {
  const R = HM.rules, E = HM.events, F = HM.festivals, D = HM.DATA;
  const style = STYLES[styleName];
  const s = R.newGame('Sim');
  const favourites = style.favourites || D.friends.slice();
  const requests = {};
  while (!s.finished) {
    s.minutes = 10 * 60;
    // Festivals today
    D.festivalOrder.filter(id => D.festivals[id].day === s.day).forEach(id => { if (random() < style.festivals) F.join(s, id); });
    // Whom to meet today
    const met = D.friends.filter(f => (f !== 'kurokawa' || s.day >= D.kurokawa.fromDay) &&
      (favourites.includes(f) ? random() < 0.95 : random() < style.others));
    met.forEach(f => {
      const who = SPEAKER[f] || f;
      R.talk(s, who);
      // A gift: buy something they like if there's money, and give it
      if (random() < style.gifts && R.canGift(s, who)) {
        const res = D.residents[who];
        const wish = (res.loved || []).concat(res.liked || []).find(item => D.items[item] && D.items[item].price && s.money > 20000);
        if (wish && R.buy(s, wish)) R.giveGift(s, who, wish);
        else if (s.bag.onigiri > 0) R.giveGift(s, who, 'onigiri');
      }
      // Requests: the first one after meeting a few times, the second from 2 hearts
      const n = requests[f] = (requests[f] || 0);
      if (n < 2 && random() < 0.15 && (n === 0 || R.heartsWith(s, f) >= 2)) { requests[f] = n + 1; R.addPoints(s, f, D.points.request); }
      // A heart event, if one is due and the place and time happen to fit
      const ev = E.next(s, f);
      if (ev && random() < 0.5) { s.events[ev.id] = s.day; R.addPoints(s, f, D.points.event); }
    });
    R.endDay(s);
  }
  const hearts = D.friends.map(f => R.heartsWith(s, f));
  return { hearts, ending: HM.community.ending(s), money: s.money };
}

function run(years) {
  const HM = loadGame();
  const out = {};
  Object.keys(STYLES).forEach(style => {
    const random = seeded(7);
    const results = Array.from({ length: years }, () => playYear(HM, style, random));
    const avg = HM.DATA.friends.map((f, i) => results.reduce((n, r) => n + r.hearts[i], 0) / years);
    const five = results.reduce((n, r) => n + r.hearts.filter(h => h >= 5).length, 0) / years;
    const threePlus = results.reduce((n, r) => n + r.hearts.filter(h => h >= 3).length, 0) / years;
    out[style] = { avg, five, threePlus, endings: [...new Set(results.map(r => r.ending))], ended: results.length };
  });
  return out;
}

module.exports = { run, STYLES };

if (require.main === module) {
  const years = 30;
  const HM = loadGame();
  const res = run(years);
  console.log(`${years} simulated years per style. Hearts at the end of the year (average):\n`);
  console.log('style      ' + HM.DATA.friends.map(f => f.slice(0, 6).padStart(7)).join('') + '   at 5♥   at 3♥+');
  Object.entries(res).forEach(([style, r]) => {
    console.log(style.padEnd(11) + r.avg.map(h => h.toFixed(1).padStart(7)).join('') + r.five.toFixed(1).padStart(8) + r.threePlus.toFixed(1).padStart(8));
  });
  console.log('\nEvery year reached an ending. Endings seen: ' + [...new Set(Object.values(res).flatMap(r => r.endings))].join(', '));
}
