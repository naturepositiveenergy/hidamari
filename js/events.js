// Hidamari: heart events (design.md sections 5 and 6, Milestone 3.1).
//
// Each household has five heart events, one for each heart. Only the rules are here: the words are
// in the language files, under "ev.<household>.<number>.…" (for example ev.gen.2.1).
//
// An event can happen when you have at least as many hearts with the household as its number, the
// household's earlier events have happened, and everything in its "when" fits:
//   who: which resident (the Mori family has three) · spot: where they are · hours: [from, to) ·
//   weather · season: this season, or any later one (so you can't miss it for good) ·
//   fromDay: from this day of the year · door: you knock at this door instead of talking to someone ·
//   need: something in the game (an earlier event whose need isn't met yet doesn't hold the later ones back).
// A small sun over the resident shows that an event is waiting. If it can't happen where you are,
// the resident sometimes drops a hint instead of an everyday line (ev.<household>.<number>.hint).
//
// script: the lines, in order.
//   'gen 1'                  Gen-san says ev.gen.<number>.1 ('n 2': the narrator says ev.gen.<number>.2)
//   'gen =plot.open.gen.1'   a line with its own text code
//   { choice: ['c1', 'c2'] } you choose ev.….c1 or ev.….c2, and the first speaker answers ev.….r1 or ev.….r2.
//                            A choice can also be a list: ['c1', 'line', 'line', …] (lines after choosing it)
//   { if: test, then: [...], else: [...] }  lines that depend on the game
//   { do: fn }               something changes (for example the slope is restored)
// opens: the event opens a plot to build on · anyOrder: doesn't wait for the earlier events · keepsake: the gift you receive (design.md section 6) ·
// minutes: how long it takes (10 if not given) · effect: what changes afterwards ·
// also: another household's event that happens at the same time · same: this event is another household's
// event (it happens there) · external: the event is a scene elsewhere (for example the zoning workshop).

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const R = () => HM.rules, C = () => HM.community, D = () => HM.DATA;

  // ----- Things events look at -----
  const hearts = (s, f) => R().heartsWith(s, f);
  const tilesOf = (s, id) => s.plots[id].tiles;
  const mine = s => Object.values(s.plots).filter(p => p.owner !== 'quick');
  const hasTile = (s, type) => mine(s).some(p => p.tiles.includes(type));
  const hasPanels = s => mine(s).some(p => p.tiles.some(t => t && D().buildTiles[t] && D().buildTiles[t].panel));
  // A crop growing on a spaced-panel tile of your home field
  const cropUnderPanels = s => s.plots.home.owner !== 'quick' &&
    s.plots.home.tiles.some((t, i) => t === 'spaced' && R().cropAt(s, i));
  const muddy = s => !!s.flags.mudflow && !s.flags.cleanUp;
  const invested = (s, f) => (s.funds || []).some(fund => fund.investors[f]);
  const SPOTS = {
    walk: ['walkA', 'walkB', 'walkC'],
    visits: ['visitGen', 'visitFumiko', 'visitHome', 'visitMori'],
    delivery: ['visitFumiko2', 'visitGen2', 'visitKuma'],
    cycling: ['rinA', 'rinB', 'rinC', 'rinD']
  };

  // ----- The events -----
  const EVENTS = {
    gen: [
      { hearts: 1, who: 'gen', spot: 'genPaddy', hours: [6, 11],
        script: ['gen =gen.ev1.1', 'n =gen.ev1.2', 'gen =gen.ev1.3', 'gen =gen.ev1.4', 'gen =gen.ev1.5',
          { choice: [['=gen.ev1.c1', 'gen =gen.ev1.r1'], ['=gen.ev1.c2', 'gen =gen.ev1.r2']] }] },
      { hearts: 2, who: 'gen', weather: ['rain'], spot: 'genHome',
        script: ['n 1', 'gen 2', 'gen 3', 'gen 4', { choice: ['c1', 'c2'] }, 'gen 5'] },
      { hearts: 3, who: 'gen', hours: [6, 17], need: cropUnderPanels,
        script: ['gen 1', 'n 2', 'gen 3', 'gen 4'], effect: s => { s.flags.genTrial = true; } },
      { hearts: 4, who: 'gen', opens: 'gen',
        script: ['gen 1', 'n 2', 'gen =plot.open.gen.1', 'gen =plot.open.gen.2', 'gen 3'] },
      { hearts: 5, who: 'gen', season: 'autumn', spot: 'genPaddy', hours: [6, 11], keepsake: 'strawHat', minutes: 60,
        script: ['n 1', { if: s => tilesOf(s, 'gen').includes('spaced'), then: ['gen 2', 'gen 3'], else: ['gen 4'] }, 'gen 5'] }
    ],
    midori: [
      { hearts: 1, who: 'midori', spot: 'pondShore', hours: [6, 9], need: s => !!s.flags.diary,
        script: ['midori =midori.ev1.1', 'n =midori.ev1.2', 'midori =midori.ev1.3', 'midori =midori.ev1.4', 'midori =midori.ev1.5',
          { choice: [['=midori.ev1.c1', 'midori =midori.ev1.r1'], ['=midori.ev1.c2', 'midori =midori.ev1.r2']] }] },
      { hearts: 2, who: 'midori', spot: 'post',
        script: ['midori 1', 'n 2', 'midori 3', 'midori 4', { choice: ['c1', 'c2'] }] },
      { hearts: 3, who: 'midori', spot: ['streamside', 'terraces'], need: s => hasTile(s, 'pond'),
        script: ['midori 1', 'n 2', 'midori 3', 'n 4', 'midori 5'] },
      { hearts: 4, who: 'midori', season: 'summer', spot: 'terraces', hours: [18, 20], minutes: 60,
        script: ['midori 1', { if: muddy, then: ['n 2', 'midori 3', 'midori 4'], else: ['n 5', 'midori 6', 'midori 7'] }] },
      { hearts: 5, who: 'midori', hours: [6, 18], need: s => !!s.flags.natureSite, keepsake: 'fieldNotebook',
        script: ['midori 1', 'midori 2', 'midori 3', { choice: ['c1', 'c2'] }, 'midori 4'] }
    ],
    fumiko: [
      { hearts: 1, who: 'fumiko', spot: 'fumikoPorch',
        script: ['fumiko 1', 'fumiko 2', 'fumiko 3', 'fumiko 4', { choice: ['c1', 'c2'] }] },
      { hearts: 2, who: 'fumiko', spot: 'fumikoGarden',
        script: ['n 1', 'fumiko 2', 'fumiko 3', 'fumiko 4', { choice: ['c1', 'c2'] }] },
      { hearts: 3, who: 'fumiko', spot: 'fumikoGarden', minutes: 30,
        script: ['fumiko 1', 'n 2', 'fumiko 3', 'fumiko 4'], effect: s => { R().addItem(s, 'seedling', 3); }, gets: { seedling: 3 } },
      // The argument at dinner: Rin's 3-heart event too (design.md sections 5.2 and 5.8)
      { hearts: 4, door: 'fumikoDoor', hours: [17, 20], need: s => hearts(s, 'rin') >= 3, also: 'rin', hintBy: 'fumiko', minutes: 60,
        script: ['n 1', 'rin 2', 'fumiko 3', 'rin 4', 'n 5',
          { choice: [['c1', 'rin r1', 'fumiko r1b'], ['c2', 'rin r2', 'fumiko r2b']] }, 'n 6', 'fumiko 7'],
        effect: s => { s.flags.fumikoRin = true; } },
      { hearts: 5, who: 'fumiko', spot: 'fumikoGarden', keepsake: 'trowel',
        need: s => !s.plots.fumiko.owner && tilesOf(s, 'fumiko').includes('hedge') &&
          tilesOf(s, 'fumiko').some(t => t && D().buildTiles[t] && D().buildTiles[t].panel),
        script: ['n 1', 'fumiko 2', 'fumiko 3', 'fumiko 4'] }
    ],
    mori: [
      { hearts: 1, who: 'sora', spot: 'soraPlay',
        script: ['sora 1', 'n 2', 'n 3', 'sora 4', { choice: ['c1', 'c2'] }] },
      { hearts: 2, who: 'aya', spot: 'moriGarden',
        script: ['aya 1', 'n 2', 'aya 3', 'aya 4', { choice: ['c1', 'c2'] }] },
      { hearts: 3, who: 'ken', spot: 'moriGarden2', need: hasPanels,
        script: ['ken 1', 'ken 2', { choice: ['c1', 'c2'] }, 'ken 3'], effect: s => { s.flags.moriSafe = true; } },
      { hearts: 4, who: 'aya', season: 'autumn', spot: 'moriGarden',
        script: ['aya 1', 'n 2', 'aya 3', 'n 4', 'aya 5'], effect: s => { s.flags.moriStall = true; } },
      { hearts: 5, who: 'aya', spot: 'riverside', keepsake: 'drawing',
        script: ['aya 1', { if: s => invested(s, 'mori'), then: ['aya 2'], else: ['aya 3'] }, 'n 4', 'sora 5', 'n 6'] }
    ],
    oda: [
      { hearts: 1, who: 'oda', spot: SPOTS.walk, minutes: 30,
        script: ['oda 1', 'oda 2', 'oda 3', 'oda 4', { choice: ['c1', 'c2'] }] },
      { hearts: 2, who: 'oda', spot: SPOTS.visits, minutes: 30,
        script: ['n 1', 'oda 2', 'oda 3', 'oda 4', { choice: ['c1', 'c2'] }] },
      // Nemawashi: this opens the worries list before a town meeting (design.md section 10.1)
      { hearts: 3, who: 'oda', anyOrder: true, need: s => !s.flags.nemawashi,
        script: ['oda =nema.lesson.1', 'oda =nema.lesson.2', 'oda =nema.lesson.3', { do: g => { g.state.flags.nemawashi = true; } }, 'n =nema.unlocked'] },
      { hearts: 4, who: 'oda', spot: 'hall', need: s => Object.values(s.plots).some(p => p.approved && p.owner !== 'quick'),
        script: ['oda 1', 'oda 2', 'oda 3', { choice: ['c1', 'c2'] }] },
      { hearts: 5, who: 'oda', fromDay: 26, keepsake: 'calligraphy',
        script: ['oda 1', 'oda 2', 'oda 3', { choice: ['c1', 'c2', 'c3'] }, 'oda 4', 'n 5'] }
    ],
    hiro: [
      { hearts: 1, who: 'hiro', spot: SPOTS.delivery, minutes: 60,
        script: ['hiro 1', 'n 2', 'n 3', 'hiro 4', 'hiro 5'] },
      { hearts: 2, who: 'hiro', spot: 'shopFront',
        script: ['hiro 1', 'n 2', 'hiro 3', 'hiro 4', 'n 5'] },
      { hearts: 3, who: 'hiro', spot: 'shopFront', minutes: 30,
        script: ['hiro 1', 'n 2', 'hiro 3', 'hiro 4', { choice: ['c1', 'c2'] }], effect: s => { s.flags.hiroRoof = true; } },
      { hearts: 4, who: 'hiro', spot: 'shopFront',
        script: [{ if: s => invested(s, 'hiro'), then: ['hiro 1'], else: [{ if: s => C().distrust(s), then: ['hiro 2'], else: ['hiro 3'] }] },
          'hiro 4', 'hiro 5', { choice: ['c1', 'c2'] }] },
      { hearts: 5, who: 'hiro', spot: 'shopFront', keepsake: 'shopSign',
        script: ['hiro 1', 'n 2', 'hiro 3', 'hiro 4'] }
    ],
    kuma: [
      { hearts: 1, who: 'kuma', spot: 'sluice',
        script: ['kuma 1', 'kuma 2', 'kuma 3', { choice: ['c1', 'c2'] }] },
      { hearts: 2, who: 'kuma', spot: ['terraceA', 'terraceB'], minutes: 60,
        script: ['kuma 1', 'n 2', 'kuma 3', 'kuma 4'] },
      { hearts: 3, who: 'kuma', spot: 'sluice', hours: [18, 19],
        script: ['n 1', 'kuma 2', 'kuma 3', { choice: ['c1', 'c2'] }, 'kuma 4'] },
      { hearts: 4, who: 'kuma', opens: 'pond',
        script: ['kuma 1', 'kuma =plot.open.pond.1', 'kuma =plot.open.pond.2', 'kuma 2'] },
      // After the pond draining (かいぼり) in winter
      { hearts: 5, who: 'kuma', fromDay: 27, keepsake: 'sluiceKey',
        script: [{ if: s => HM.festivals.joined(s, 'kaibori'), then: ['kuma 1'], else: ['kuma 5'] }, 'kuma 2', 'kuma 3', 'kuma 4'] }
    ],
    rin: [
      { hearts: 1, who: 'rin', spot: SPOTS.cycling,
        script: ['rin 1', 'n 2', 'rin 3', 'rin 4', { choice: ['c1', 'c2'] }] },
      { hearts: 2, who: 'rin', spot: 'rinShop',
        script: ['rin 1', 'rin 2', { choice: ['c1', 'c2'] }, 'rin 3'] },
      { hearts: 3, same: 'fumiko.4' },
      { hearts: 4, who: 'rin', spot: 'hall',
        script: ['rin 1', 'rin 2', 'n 3', 'rin 4', 'rin 5', 'n 6'], effect: s => { s.flags.rinStudents = true; } },
      { hearts: 5, who: 'rin', season: 'winter', spot: 'rinShop', keepsake: 'charger',
        script: ['rin 1', 'rin 2', 'rin 3', 'rin 4'] }
    ],
    sato: [
      { hearts: 1, who: 'sato', spot: ['office', 'lunch'],
        script: ['sato 1', 'n 2', 'sato 3', 'sato 4', { choice: ['c1', 'c2'] }] },
      { hearts: 2, who: 'sato', opens: 'factory',
        script: ['sato 1', 'sato 2', 'sato 3', 'sato 4', 'sato =plot.open.factory.1', 'sato =plot.open.factory.2'] },
      // The zoning workshop (design.md section 10.4) is a scene of its own
      { hearts: 3, external: s => !!s.flags.zoningDone },
      // The support grant: paid once, when you build new panels in a "welcome" area of the zone
      { hearts: 4, who: 'sato', spot: ['office', 'lunch'], minutes: 30,
        script: ['sato 1', 'n 2', 'sato 3', 'sato 4'] },
      { hearts: 5, who: 'sato', spot: 'lunch', keepsake: 'checklist',
        script: ['sato 1', 'sato 2', 'sato 3', { choice: ['c1', 'c2'] }, 'sato 4'] }
    ],
    kurokawa: [
      { hearts: 1, who: 'kurokawa', spot: 'busBench',
        script: ['kurokawa 1', 'n 2', 'kurokawa 3', 'kurokawa 4', { choice: ['c1', 'c2'] }] },
      { hearts: 2, who: 'kurokawa', spot: 'slopeTrack',
        script: ['n 1', 'kurokawa 2', 'kurokawa 3', 'kurokawa 4', 'kurokawa 5'] },
      // After the rainy season: the mud from the slope, or relief that it held
      { hearts: 3, who: 'kurokawa', fromDay: 11,
        script: [{ if: s => !!s.flags.mudflow,
          then: ['kurokawa 1', 'kurokawa 2', { if: s => !!s.flags.cleanUp, then: ['kurokawa 3'], else: ['kurokawa 4'] }, 'kurokawa 5'],
          else: ['kurokawa 6', 'kurokawa 7'] }] },
      // Restoring the slope after the mudflow (js/community.js), or young trees at its edge
      { hearts: 4, who: 'kurokawa', need: s => !s.flags.slopeRestored,
        script: [{ if: s => C().canRestore(s),
          then: ['kurokawa 1', 'kurokawa =slope.restore.1', 'kurokawa =slope.restore.2', { choice: [
            ['=slope.restore.yes', { do: g => { C().restoreSlope(g.state); } }, 'n =slope.restore.done'],
            ['=slope.restore.later', 'kurokawa =slope.restore.wait']] }],
          else: ['kurokawa 2', 'kurokawa 3', 'n 4', 'kurokawa 5'] }] },
      { hearts: 5, who: 'kurokawa', fromDay: 24, keepsake: 'card',
        script: ['kurokawa 1', 'kurokawa 2', 'kurokawa 3', { choice: ['c1', 'c2'] }, 'kurokawa 4'] }
    ]
  };

  // Give each event its name ("gen.2") and the household it belongs to
  Object.entries(EVENTS).forEach(([friend, list]) => list.forEach((ev, i) => {
    ev.friend = friend;
    ev.n = i + 1;
    ev.id = `${friend}.${i + 1}`;
  }));
  const byId = id => { const [f, n] = id.split('.'); return EVENTS[f] && EVENTS[f][n - 1]; };

  // Plots that an event opens (instead of the owner just saying yes, js/story.js)
  const OPENS = {};
  Object.values(EVENTS).forEach(list => list.forEach(ev => { if (ev.opens) OPENS[ev.opens] = ev.id; }));

  // ----- Has it happened? -----
  // (Gen-san's and Midori's first events, and Mr. Oda's nemawashi lesson, existed before Phase 3)
  const OLD = { 'gen.1': s => !!s.flags.genEvent1, 'midori.1': s => !!s.flags.midoriEvent1, 'oda.3': s => !!s.flags.nemawashi };
  const record = s => s.events || (s.events = {});
  function done(s, id) {
    const ev = byId(id);
    if (!ev) return false;
    if (ev.external) return ev.external(s);
    if (ev.same) return done(s, ev.same);
    return !!record(s)[id] || !!(OLD[id] && OLD[id](s));
  }

  // ----- Which event comes next for a household -----
  // The first that hasn't happened, has enough hearts and whose need is met. Events that happen
  // elsewhere, and events whose need isn't met yet, don't hold the later ones back.
  // Events that open a plot or teach nemawashi come first and don't wait for the earlier ones
  // (they can happen anywhere, so the plot opens at 4 hearts as before).
  function next(s, friend) {
    const h = hearts(s, friend);
    const list = EVENTS[friend] || [];
    const key = list.find(ev => (ev.opens || ev.anyOrder) && !done(s, ev.id) && ev.hearts <= h && (!ev.need || ev.need(s)));
    if (key) return key;
    for (const ev of list) {
      if (done(s, ev.id)) continue;
      if (ev.hearts > h) return null;
      if (ev.external || ev.same) continue;
      if (ev.need && !ev.need(s)) continue;
      return ev;
    }
    return null;
  }

  const SEASONS = ['spring', 'summer', 'autumn', 'winter'];
  const hour = s => s.minutes / 60;
  // Season, day, hours and weather: does the time fit?
  function timeFits(ev, s) {
    if (ev.season && HM.festivals.storyYear(s) && SEASONS.indexOf(R().seasonOf(s.day)) < SEASONS.indexOf(ev.season)) return false;
    if (ev.fromDay && s.day < ev.fromDay) return false;
    if (ev.hours && !(hour(s) >= ev.hours[0] && hour(s) < ev.hours[1])) return false;
    if (ev.weather && !ev.weather.includes(R().weatherOf(s.day))) return false;
    return true;
  }
  // Does it fit this resident, where they are now?
  function fits(ev, s, who, spot) {
    if (!ev || ev.door || ev.who !== who) return false;
    if (spot && /^fest\./.test(spot)) return false;
    if (ev.spot && ![].concat(ev.spot).includes(spot)) return false;
    return timeFits(ev, s);
  }

  // Is an event waiting for this resident here? (a small sun shows over them, js/main.js)
  const waiting = (s, who, spot) => fits(next(s, R().friendOf(who)), s, who, spot);

  // ----- Playing an event -----
  const key = (ev, part) => (part[0] === '=' ? part.slice(1) : `ev.${ev.friend}.${ev.n}.${part}`);
  function line(ev, text) {
    const [who, part] = text.split(' ');
    return { say: key(ev, part), who: who === 'n' ? 'narrator' : who };
  }
  // The script as dialogue steps (js/dialogue.js)
  function steps(ev, s, script) {
    const out = [];
    const firstSpeaker = (ev.script.find(p => typeof p === 'string' && p[0] !== 'n') || '').split(' ')[0] || ev.who;
    script.forEach(part => {
      if (typeof part === 'string') out.push(line(ev, part));
      else if (part.if) out.push(...steps(ev, s, part.if(s) ? part.then : (part.else || [])));
      else if (part.do) out.push({ run: part.do });
      else if (part.choice) {
        out.push({ choice: part.choice.map(c => {
          const [pick, ...after] = [].concat(c);
          const then = after.length ? after : [`${firstSpeaker} ${pick.replace(/^c/, 'r')}`];
          return { key: key(ev, pick), then: steps(ev, s, then) };
        }) });
      }
    });
    return out;
  }

  function play(game, ev) {
    const s = game.state;
    const out = steps(ev, s, ev.script);
    out.push({ run: g => {
      const st = g.state;
      record(st)[ev.id] = st.day;
      R().addPoints(st, ev.friend, D().points.event);
      if (ev.also) { record(st)[`${ev.also}.${EVENTS[ev.also].findIndex(e => e.same === ev.id) + 1}`] = st.day; R().addPoints(st, ev.also, D().points.event); }
      if (ev.opens) st.plots[ev.opens].open = true;
      if (ev.keepsake) st.keepsakes = (st.keepsakes || []).concat([ev.keepsake]);
      if (ev.effect) ev.effect(st);
      g.passTime(ev.minutes || 10);
      const after = [];
      if (ev.opens) after.push({ say: 'plot.opened', who: 'narrator', vars: { plot: { key: 'plot.' + ev.opens } } });
      Object.entries(ev.gets || {}).forEach(([item, n]) => after.push({ say: 'got.item', who: 'narrator', vars: { item: { key: 'item.' + item }, n } }));
      if (ev.keepsake) after.push({ say: 'got.keepsake', who: 'narrator', vars: { item: { key: 'keep.' + ev.keepsake } } });
      return after;
    } });
    return out;
  }

  // Talking to a resident: their waiting event as dialogue steps, or null
  function talk(game, who, resident) {
    const ev = next(game.state, R().friendOf(who));
    return fits(ev, game.state, who, resident.spot) ? play(game, ev) : null;
  }

  // Knocking at a door: an event that happens inside (Fumiko-san's dinner), or null
  function door(game, id) {
    const s = game.state;
    for (const friend of Object.keys(EVENTS)) {
      const ev = next(s, friend);
      if (ev && ev.door === id && timeFits(ev, s)) return play(game, ev);
    }
    return null;
  }
  const doorWaiting = (s, id) => Object.keys(EVENTS).some(f => { const ev = next(s, f); return ev && ev.door === id && timeFits(ev, s); });

  // ----- Hints: the next event can't happen here and now, so the resident mentions it -----
  // At most every 3 days, and 3 times for each event.
  const HINT = { every: 3, times: 3 };
  function hint(s, who) {
    const friend = R().friendOf(who), h = hearts(s, friend);
    const ev = (EVENTS[friend] || []).find(e => !done(s, e.id) && !e.external && !e.same);
    if (!ev || ev.hearts > h || !hasHint(ev) || (ev.hintBy || ev.who) !== who) return null;
    const hints = s.eventHints || (s.eventHints = {});
    const seen = hints[ev.id] || { n: 0, day: -99 };
    if (seen.n >= HINT.times || s.day - seen.day < HINT.every) return null;
    hints[ev.id] = { n: seen.n + 1, day: s.day };
    return key(ev, 'hint');
  }
  // Events that can happen anywhere (they open a plot, or teach something) need no hint
  const hasHint = ev => !!(ev.spot || ev.hours || ev.season || ev.fromDay || ev.weather || ev.door || ev.keepsake || ev.need) &&
    !ev.opens && ev.id !== 'oda.3' && ev.id !== 'kurokawa.4';

  // ----- Keepsakes (the gifts from 5-heart events) -----
  const keepsakes = s => (s.keepsakes || []).slice();
  const KEEPSAKES = Object.values(EVENTS).flatMap(list => list.filter(e => e.keepsake).map(e => e.keepsake));

  // ----- Every text code the events use (for tests/check.js) -----
  function keys() {
    const out = new Set();
    const walk = (ev, script) => script.forEach(part => {
      if (typeof part === 'string') out.add(key(ev, part.split(' ')[1]));
      else if (part.if) { walk(ev, part.then); walk(ev, part.else || []); }
      else if (part.choice) part.choice.forEach(c => { const [pick, ...after] = [].concat(c); out.add(key(ev, pick)); if (after.length) walk(ev, after); else out.add(key(ev, pick.replace(/^c/, 'r'))); });
    });
    Object.values(EVENTS).forEach(list => list.forEach(ev => {
      if (!ev.script) return;
      walk(ev, ev.script);
      if (hasHint(ev)) out.add(key(ev, 'hint'));
      if (ev.keepsake) { out.add('keep.' + ev.keepsake); out.add('keep.' + ev.keepsake + '.text'); }
    }));
    return [...out];
  }

  HM.EVENTS = EVENTS;
  HM.events = { next, done, waiting, talk, door, doorWaiting, hint, opens: id => OPENS[id] || null, keepsakes, KEEPSAKES, keys, byId };
})(globalThis);
