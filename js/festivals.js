// Hidamari: festivals and village life (Milestone 2.5).
//
// The festivals and special days of the year (design.md section 11), gifts to the village (section 9),
// Midori's nature survey (section 5.4) and the free year after the ending (section 12).
// Festivals take place on the village map: everyone gathers at the festival's place for a few hours,
// and the host offers a small activity. The welcome party and the typhoon shelter night are scenes in
// the community hall (js/scenes.js). The rules here have no screen, so tests/check.js can test them;
// the conversations are built from text codes in the language files.

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const D = () => HM.DATA;
  const R = () => HM.rules;

  const say = (who, key, vars) => ({ say: key, who, vars });
  const narrate = (key, vars) => ({ say: key, who: 'narrator', vars });
  const run = fn => ({ run: fn });

  // Everyone who can come to a festival (Mr. Kurokawa once you have met him)
  const PEOPLE = ['oda', 'gen', 'fumiko', 'midori', 'aya', 'ken', 'sora', 'hiro', 'kuma', 'rin', 'sato', 'kurokawa'];
  const year = state => state.year || 1;

  // ----- Where everyone stands at each festival -----
  // Spots around the festival's place, found by walking outwards from it (every other tile, so people
  // don't stand on top of each other). They are added to the map's spots as "fest.<festival>.<person>".
  function placeSpots() {
    const map = HM.MAP;
    const walk = (x, y) => x >= 0 && y >= 0 && x < map.width && y < map.height && !!map.legend[map.rows[y][x]].walk;
    const busy = (x, y) => map.objects.some(o => o.x === x && o.y === y) ||
      map.plots.some(p => x >= p.x && y >= p.y && x < p.x + p.w && y < p.y + p.h);
    Object.entries(D().festivals).forEach(([id, f]) => {
      if (!f.place) return;
      const [cx, cy] = f.place;
      const seen = new Set([cx + ',' + cy]), queue = [[cx, cy]], free = [];
      while (queue.length && free.length < PEOPLE.length) {
        const [x, y] = queue.shift();
        if ((x + y) % 2 === 0 && !(x === cx && y === cy) && !busy(x, y)) free.push([x, y]);
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
          const k = (x + dx) + ',' + (y + dy);
          if (!seen.has(k) && walk(x + dx, y + dy)) { seen.add(k); queue.push([x + dx, y + dy]); }
        });
      }
      PEOPLE.forEach((who, n) => {
        const [x, y] = free[n % free.length];
        const dx = cx - x, dy = cy - y;
        const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy >= 0 ? 'down' : 'up');
        map.spots[`fest.${id}.${who}`] = { x, y, dir };
      });
    });
  }

  // ----- Festivals -----
  // The festival on the map that is on right now (or null)
  function activeFestival(state) {
    const h = state.minutes / 60;
    return D().festivalOrder.find(id => {
      const f = D().festivals[id];
      return f.place && f.day === state.day && h >= f.from && h < f.to;
    }) || null;
  }
  // The festival in the community hall today (or null)
  const hallFestival = state => D().festivalOrder.find(id => D().festivals[id].hall && D().festivals[id].day === state.day) || null;
  const comes = (state, who) => who !== 'kurokawa' || !!state.flags.kuroMet;
  // Where a resident goes during a festival (js/world.js), or null
  function gatheringSpot(state, who) {
    const id = activeFestival(state);
    return id && PEOPLE.includes(who) && comes(state, who) ? `fest.${id}.${who}` : null;
  }
  const atFestival = resident => !!resident && typeof resident.spot === 'string' && resident.spot.startsWith('fest.');
  const joined = (state, id) => (state.flags.festivals || {})[id] === year(state);
  // The households who are there
  const attending = state => D().friends.filter(f => f !== 'kurokawa' || state.flags.kuroMet);

  // You join a festival's activity: friendship with everyone there (design.md section 6)
  function join(state, id) {
    if (joined(state, id)) return false;
    state.flags.festivals = Object.assign({}, state.flags.festivals, { [id]: year(state) });
    state.stats.festivals = (state.stats.festivals || 0) + 1;
    attending(state).forEach(f => R().addPoints(state, f, D().festivalPoints));
    return true;
  }
  // The firefly count at the firefly festival: fewer after the mudflow, coming back after the clean-up
  function fireflies(state) {
    const n = D().fireflies, mud = state.flags.mudflow;
    return mud && year(state) === 1 ? (state.flags.cleanUp ? n.restored : n.muddy) : n.clear;
  }

  // What a resident says at a festival, and the host's activity
  // What someone says at a festival: in the free year a line of its own, so nothing repeats (Milestone 3.2)
  function festivalLine(state, id, who) {
    if (!storyYear(state)) return `fest.${id}.${who}.y2`;
    if (id === 'hatsumode' && who === 'kurokawa' && HM.events.done(state, 'kurokawa.5')) return 'fest.hatsumode.kurokawa.quit';
    return `fest.${id}.${who}`;
  }

  function talk(game, who, resident) {
    const state = game.state, id = resident.spot.split('.')[1], f = D().festivals[id];
    const steps = [say(who, festivalLine(state, id, who))];
    if (who === f.host && !joined(state, id)) {
      steps.push({ choice: [
        { key: `fest.${id}.join`, then: activity(game, id) },
        { key: 'talk.bye', then: [] }
      ] });
    }
    return steps;
  }
  const done = (id, extra) => [run(g => { join(g.state, id); })].concat(extra || [], [narrate(`fest.${id}.done`)]);

  function activity(game, id) {
    const state = game.state, f = D().festivals[id];
    const spend = run(g => { if (f.minutes) g.passTime(f.minutes); });
    if (id === 'hanami') {
      // Share some food on the picnic sheet
      const items = Object.keys(state.bag).filter(i => D().items[i] && D().items[i].gift && state.bag[i] > 0);
      if (!items.length) return [narrate('fest.hanami.nothing')].concat(done(id));
      return [narrate('fest.hanami.share'), { choice: items.map(item => ({
        key: 'talk.giftItem', vars: { item: { key: 'item.' + item }, n: state.bag[item] },
        then: [run(g => { R().takeItem(g.state, item, 1); }), narrate('fest.hanami.shared', { item: { key: 'item.' + item } })].concat(done(id))
      })) }];
    }
    if (id === 'taue') {
      return [narrate('fest.taue.1'), { choice: [
        { key: 'fest.taue.c1', then: [say('gen', 'fest.taue.r1')] },
        { key: 'fest.taue.c2', then: [say('gen', 'fest.taue.r2')] }
      ] }, spend].concat(done(id));
    }
    if (id === 'hotaru') {
      const n = fireflies(state), D_ = D().fireflies;
      const line = n === D_.clear ? 'fest.hotaru.clear' : n === D_.muddy ? 'fest.hotaru.muddy' : 'fest.hotaru.restored';
      return [narrate('fest.hotaru.1'), narrate('fest.hotaru.count', { n }), say('midori', line),
        // Seeing the fireflies up close draws them into your diary
        run(g => (R().recordSpecies(g.state, 'firefly', 'stream') ? [narrate('fest.hotaru.diary')] : []))].concat(done(id));
    }
    if (id === 'akimatsuri') {
      const prize = (choice, item) => ({ key: choice, then: [run(g => { R().addItem(g.state, item, 1); }), narrate('fest.akimatsuri.prize', { item: { key: 'item.' + item } })] });
      return [narrate('fest.akimatsuri.1'), { choice: [
        prize('fest.akimatsuri.c1', 'manju'), prize('fest.akimatsuri.c2', 'senbei'), prize('fest.akimatsuri.c3', 'ramune')
      ] }].concat(done(id, given(state, 'lanterns') ? [narrate('fest.akimatsuri.lanterns')] : []));
    }
    if (id === 'hatsumode') {
      return [narrate('fest.hatsumode.1'), run(() => {
        const r = Math.random();
        return [narrate(r < 0.3 ? 'fest.hatsumode.great' : r < 0.7 ? 'fest.hatsumode.good' : 'fest.hatsumode.small')];
      })].concat(done(id));
    }
    // kaibori: draining the irrigation pond with Kuma-san
    return [narrate('fest.kaibori.1'), narrate('fest.kaibori.2'), say('kuma', 'fest.kaibori.kuma'), spend,
      run(g => { R().addPoints(g.state, 'kuma', 30); })].concat(done(id));
  }

  // ----- The welcome party and the typhoon shelter night (in the community hall) -----
  const hasPanels = state => Object.keys(state.plots).some(id => !state.plots[id].owner && state.plots[id].tiles.some(t => t && D().buildTiles[t].panel));
  // With the battery gift and a garden that charges it, the shelter keeps its lights on
  const shelterLit = state => given(state, 'battery') && hasPanels(state);

  function hallSteps(game, id) {
    const state = game.state;
    if (id === 'welcome') {
      return [narrate('party.arrive'), say('oda', 'party.oda.1'), say('oda', 'party.oda.2'),
        say('aya', 'party.aya'), say('ken', 'party.ken'), say('sora', 'party.sora'), say('oda', 'party.toast'),
        { choice: [
          { key: 'party.c1', then: [say('gen', 'party.r1')] },
          { key: 'party.c2', then: [say('rin', 'party.r2')] },
          { key: 'party.c3', then: [say('fumiko', 'party.r3')] }
        ] }].concat(done('welcome'));
    }
    const lit = shelterLit(state);
    return [narrate('shelter.arrive'), say('oda', 'shelter.oda')]
      .concat(lit ? [narrate('shelter.lit'), say('hiro', 'shelter.lit.hiro'), say('sato', 'shelter.lit.sato')]
        : [narrate('shelter.dark'), say('rin', 'shelter.dark.rin'), say('sato', 'shelter.dark.sato')])
      .concat([say('fumiko', 'shelter.story.1'), say('fumiko', 'shelter.story.2'), say('sora', 'shelter.sora')], done('shelter'));
  }
  function startHall(game, id) {
    const f = D().festivals[id];
    game.state.minutes = Math.max(game.state.minutes, f.hall * 60);
    HM.scenes.start(game, id, hallSteps(game, id), () => HM.scenes.afterHall(game, f.endHour), { dark: id === 'shelter' && !shelterLit(game.state) });
  }

  // Checked every frame while you walk around: a hall festival starts at its hour; a map festival
  // shows a short hint when it begins
  function check(game) {
    const state = game.state;
    const hall = hallFestival(state);
    if (hall && !joined(state, hall) && state.minutes >= D().festivals[hall].hall * 60) {
      game.play([narrate(`fest.${hall}.time`)], () => startHall(game, hall));
      return true;
    }
    const id = activeFestival(state);
    if (id && game.told.festival !== id) {
      game.told.festival = id;
      HM.ui.say(`fest.${id}.now`, null, 6);
    }
    return false;
  }

  // ----- Gifts to the village (the donation box by the community hall) -----
  const given = (state, id) => !!(state.flags.gifts || {})[id];
  function donate(state, id) {
    const cost = D().gifts[id];
    if (given(state, id) || state.money < cost) return false;
    state.money -= cost;
    state.flags.gifts = Object.assign({}, state.flags.gifts, { [id]: true });
    state.stats.gifts = (state.stats.gifts || 0) + 1;
    D().friends.forEach(f => R().addPoints(state, f, D().giftPoints));
    return true;
  }
  function donationBox(game) {
    const state = game.state;
    const left = D().giftOrder.filter(id => !given(state, id));
    if (!left.length) return [narrate('gift.allDone')];
    return [narrate('gift.box'), { choice: left.map(id => ({
      key: 'gift.' + id, vars: { cost: D().gifts[id].toLocaleString('en') },
      then: [run(g => (donate(g.state, id) ? [narrate(`gift.${id}.done`), narrate('gift.thanks')] : [narrate('gift.noMoney')]))]
    })).concat([{ key: 'gift.notNow', then: [] }]) }];
  }

  // ----- Midori's nature survey (from 4 hearts, once per garden each season) -----
  const seasonKey = state => year(state) * 10 + D().seasons.indexOf(R().seasonOf(state.day));
  function surveyGardens(state) {
    if (R().heartsWith(state, 'midori') < D().survey.hearts) return [];
    return D().plotOrder.filter(id => {
      const plot = state.plots[id];
      return plot.owner !== 'quick' && plot.tiles.some(Boolean) && (state.flags.survey || {})[id] !== seasonKey(state);
    });
  }
  // The garden's score, what Midori thinks of it, and a tip for more life
  function survey(state, id) {
    const tiles = state.plots[id].tiles, score = R().plotStats(state, id).nature;
    state.flags.survey = Object.assign({}, state.flags.survey, { [id]: seasonKey(state) });
    R().addPoints(state, 'midori', D().survey.points);
    if (score >= D().survey.site) state.flags.natureSite = true;
    const verdict = score >= D().survey.site ? 'site' : score >= D().survey.good ? 'good' : 'low';
    const tip = tiles.filter(t => t === 'hedge').length < D().gardenHedges && D().plots[id].tools.includes('hedge') ? 'hedge'
      : !tiles.includes('pond') && D().plots[id].tools.includes('pond') ? 'pond'
        : !tiles.includes('meadow') && D().plots[id].tools.includes('meadow') ? 'meadow'
          : !R().connectedCorridors(id, tiles).size && D().plots[id].tools.includes('corridor') ? 'corridor' : 'more';
    return { score, verdict, tip };
  }
  function surveySteps(state) {
    const gardens = surveyGardens(state);
    if (!gardens.length) return null;
    return [say('midori', 'survey.ask'), { choice: gardens.map(id => ({
      key: 'survey.plot', vars: { plot: { key: 'plot.' + id } },
      then: [run(g => {
        const r = survey(g.state, id);
        const out = [narrate('survey.walk', { plot: { key: 'plot.' + id } }), say('midori', 'survey.score', { score: r.score }), say('midori', 'survey.' + r.verdict)];
        if (r.verdict !== 'site') out.push(say('midori', 'survey.tip.' + r.tip));
        return out;
      })]
    })).concat([{ key: 'survey.notNow', then: [] }]) }];
  }

  // ----- The free year after the ending (design.md section 12) -----
  // The ending you reached is kept; the calendar starts again in spring, without new story
  function startFreeYear(state) {
    if (year(state) !== 1 || !state.finished) return false;
    state.ending = HM.community.ending(state);
    state.year = 2;
    state.day = 1;
    state.minutes = D().time.dayStart;
    state.finished = false;
    state.money += D().money.allowance;
    state.dayStart = { points: Object.fromEntries(Object.entries(state.friends).map(([w, f]) => [w, f.points])), diary: [] };
    return true;
  }
  const storyYear = state => year(state) === 1;

  placeSpots();

  HM.festivals = {
    activeFestival, hallFestival, gatheringSpot, atFestival, joined, join, attending, fireflies, talk, check,
    startHall, shelterLit, given, donate, donationBox, surveyGardens, survey, surveySteps, startFreeYear, storyYear, year
  };
})(globalThis);
