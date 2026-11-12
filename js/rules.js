// Hidamari: the game rules, without anything on screen.
//
// Everything that decides numbers (hearts, gifts, building, power, money, vegetables, the end of a day)
// lives here, so the automatic checks (tests/check.js) can test the rules without a browser.
// The numbers come from js/game-data.js; where the plots are comes from js/map-data.js.

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const D = () => HM.DATA;

  const SAVE_VERSION = 4;   // 3: six plots and vegetables (Milestone 2.3) · 4: village decisions (Milestone 2.4)

  // ----- A new game -----
  function newGame(name, look) {
    const data = D();
    const friends = {};
    data.friends.forEach(who => { friends[who] = { points: 0, talkDay: 0, giftDay: 0 }; });
    return {
      version: SAVE_VERSION,
      name: String(name || '').trim().slice(0, 10),
      look: data.looks.includes(look) ? look : data.looks[0],
      day: 1,
      minutes: data.time.firstDayStart,
      money: data.money.start + data.money.allowance,
      bag: Object.assign({}, data.startBag),
      plots: newPlots(),
      friends,
      flags: { starterPanels: data.starterPanels },
      requests: {},          // the residents' requests: { friend: { status: 'asked' | 'done', tasks: [true/false...] } }
      diary: {},
      events: {},            // heart events that have happened: { 'gen.2': day } (js/events.js)
      eventHints: {},        // hints about heart events: { 'gen.2': { n, day } }
      keepsakes: [],         // gifts from 5-heart events
      notebook: {},          // notes in the village notebook: { id: day found } (js/notebook.js)
      notebookRead: {},      // notes you have read
      letters: [],           // letters waiting in your letterbox (names from DATA.letters)
      meeting: null,         // the next town meeting: { plot, day }
      funds: [],             // citizen funds: { plot, until, investors: { friend: yen }, closed }
      zone: null,            // the promotion zone after the workshop: { plot: 'green' | 'yellow' | 'red' }
      stats: { powerTotal: 0, incomeTotal: 0, meetings: 0 },
      dayStart: { points: pointsOf(friends), diary: [] },
      finished: false
    };
  }

  // The drawing of the player's look (saved games from before Phase 3 have the first look)
  const lookOf = state => (state && D().looks.includes(state.look) ? state.look : D().looks[0]);

  const pointsOf = friends => Object.fromEntries(Object.entries(friends).map(([who, f]) => [who, f.points]));

  // ----- Friendship -----
  function heartsOf(points) {
    const h = D().hearts;
    return Math.max(0, Math.min(h.max, Math.floor(points / h.pointsPerHeart)));
  }

  // Add friendship points. Returns the hearts before and after.
  function addPoints(state, who, amount) {
    const f = state.friends[who];
    const before = heartsOf(f.points);
    const max = D().hearts.max * D().hearts.pointsPerHeart;
    f.points = Math.max(0, Math.min(max, f.points + amount));
    return { before, after: heartsOf(f.points) };
  }

  // Whose heart meter a character belongs to (Aya, Ken and Sora share the Mori family's)
  const friendOf = who => (D().residents[who] && D().residents[who].friend) || who;
  const heartsWith = (state, friend) => heartsOf(state.friends[friend].points);

  // The first chat of the day with a household gives points. Returns true if it did.
  function talk(state, who) {
    const f = state.friends[friendOf(who)];
    if (f.talkDay === state.day) return false;
    f.talkDay = state.day;
    addPoints(state, friendOf(who), D().points.talk);
    return true;
  }

  function giftReaction(who, item) {
    const r = D().residents[who];
    if (r.loved.includes(item)) return 'loved';
    if (r.liked.includes(item)) return 'liked';
    if (r.disliked.includes(item)) return 'disliked';
    return 'neutral';
  }

  // One gift per household per day
  const canGift = (state, who) => state.friends[friendOf(who)].giftDay !== state.day;

  // Give an item from the bag to a character. Their own tastes decide the reaction;
  // the points go to their household. Returns the reaction, or null if it isn't possible.
  function giveGift(state, who, item) {
    if (!canGift(state, who) || !(state.bag[item] > 0) || !D().items[item] || !D().items[item].gift) return null;
    const reaction = giftReaction(who, item);
    takeItem(state, item, 1);
    state.friends[friendOf(who)].giftDay = state.day;
    addPoints(state, friendOf(who), D().points[reaction]);
    return reaction;
  }

  function addItem(state, item, count) {
    state.bag[item] = (state.bag[item] || 0) + (count || 1);
  }
  function takeItem(state, item, count) {
    state.bag[item] -= count;
    if (!(state.bag[item] > 0)) delete state.bag[item];
  }

  // ----- Hiro's shop -----
  function shopOpen(state) {
    const shop = D().shop;
    const h = state.minutes / 60;
    return dayInSeason(state.day) !== shop.closedDay && h >= shop.open && h < shop.close;
  }

  // What the shop sells today (seeds only in their sowing season)
  function shopItems(state) {
    return D().shop.items.filter(item => {
      const crop = D().items[item].crop;
      return !crop || D().crops[crop].seasons.includes(seasonOf(state.day));
    });
  }

  // Buy one item. Returns true if it worked.
  function buy(state, item) {
    const price = D().items[item] && D().items[item].price;
    if (!price || !shopItems(state).includes(item) || state.money < price) return false;
    state.money -= price;
    addItem(state, item, 1);
    return true;
  }

  // Sell one item to Hiro (vegetables from your field). Returns true if it worked.
  function sell(state, item) {
    const price = D().items[item] && D().items[item].sell;
    if (!price || !(state.bag[item] > 0)) return false;
    takeItem(state, item, 1);
    state.money += price;
    return true;
  }

  // ----- The plots -----
  const plotGeo = id => HM.MAP.plots.find(p => p.id === id);
  const tileInfo = t => D().buildTiles[t];

  function newPlots() {
    const plots = {};
    HM.MAP.plots.forEach(p => {
      plots[p.id] = { tiles: Array(p.w * p.h).fill(null), loose: [], open: !D().plots[p.id].open };
      if (D().plots[p.id].farm) plots[p.id].crops = Array(p.w * p.h).fill(null);
      if (D().plots[p.id].rubble) plots[p.id].rubbleCleared = false;
    });
    return plots;
  }

  // Can this plot be opened now? (the owner's hearts)
  function canOpen(state, id) {
    const rule = D().plots[id].open;
    if (!rule) return true;
    if (rule.later) return false;
    return heartsWith(state, rule.friend) >= rule.hearts;
  }

  // Which corridor tiles are connected: a chain of corridor, hedge, meadow and pond tiles that
  // touches the plot's edge and has a pond, hedge or meadow in it (design.md section 7.3)
  function connectedCorridors(id, tiles) {
    const { w, h } = plotGeo(id);
    const chain = t => ['corridor', 'hedge', 'meadow', 'pond'].includes(t);
    const seen = new Set(), connected = new Set();
    tiles.forEach((t, start) => {
      if (t !== 'corridor' || seen.has(start)) return;
      const group = [start];
      seen.add(start);
      let edge = false, habitat = false;
      for (let k = 0; k < group.length; k++) {
        const i = group[k], x = i % w, y = Math.floor(i / w);
        if (x === 0 || y === 0 || x === w - 1 || y === h - 1) edge = true;
        if (tiles[i] !== 'corridor') habitat = true;
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
          const nx = x + dx, ny = y + dy, n = ny * w + nx;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h || seen.has(n) || !chain(tiles[n])) return;
          seen.add(n);
          group.push(n);
        });
      }
      if (edge && habitat) group.forEach(i => { if (tiles[i] === 'corridor') connected.add(i); });
    });
    return connected;
  }

  // Panels with no hedge between them and the south edge of the plot (the typhoon's side).
  // Floating panels are anchored and are not counted.
  function exposedPanels(id, tiles) {
    const { w, h } = plotGeo(id);
    const out = [];
    tiles.forEach((t, i) => {
      if (!t || !tileInfo(t).panel || t === 'floating') return;
      const x = i % w;
      let sheltered = false;
      for (let y = Math.floor(i / w) + 1; y < h; y++) if (tiles[y * w + x] === 'hedge') sheltered = true;
      if (!sheltered) out.push(i);
    });
    return out;
  }

  // Power, nature, shade and more for a plot (tiles: a plan, or the built tiles)
  function plotStats(state, id, tiles) {
    tiles = tiles || state.plots[id].tiles;
    const loose = new Set(state.plots[id].loose || []);
    const summer = seasonOf(state.day) === 'summer';
    const connected = connectedCorridors(id, tiles);
    const counts = {};
    let power = 0, nature = 0, shade = 0, panels = 0;
    const types = new Set();
    tiles.forEach((t, i) => {
      if (!t) return;
      const info = tileInfo(t);
      counts[t] = (counts[t] || 0) + 1;
      if (info.panel) panels++;
      if (info.panel && !loose.has(i)) power += info.power + (summer && info.summer ? info.summer : 0);
      if (info.mustConnect && !connected.has(i)) return;
      nature += info.nature;
      if (info.natureType) types.add(t);
      shade += info.shade || 0;
    });
    if (types.size > 1) nature += D().varietyBonus * (types.size - 1);
    return {
      power, nature, counts, panels,
      shade: shade / tiles.length,             // the share of the plot in shade (for the light rule)
      connected, exposed: exposedPanels(id, tiles), loose: loose.size
    };
  }

  // Your share of a plot's power: Quick Solar Co.'s parks are not yours, a partnership gives you a share
  function powerShare(state, id) {
    const owner = state.plots[id].owner;
    return owner === 'quick' ? 0 : owner === 'partner' ? D().kurokawa.share : 1;
  }

  // Helpers for a work day: friends with enough hearts
  const helpers = state => D().friends.filter(f => heartsWith(state, f) >= D().workDay.helperHearts);
  // How many come to a work day: your friends, and Rin's student friends after her 4-heart event
  const crew = state => helpers(state).length + (state.flags.rinStudents ? 1 : 0);

  // Panel parts you can still use: the starter kit, or any number once Hiro orders them
  function partsLeft(state) {
    const p = D().partsFrom;
    return heartsWith(state, p.friend) >= p.hearts ? Infinity : (state.flags.starterPanels || 0);
  }

  // Check a plan for a plot. Returns what it costs, how long it takes, and any problems.
  function checkPlan(state, id, plan) {
    const data = D(), rules = data.plots[id], plot = state.plots[id];
    let cost = 0, refund = 0, newTiles = 0, removed = 0, newPanels = 0;
    const needs = {};
    const problems = [];
    plan.forEach((t, i) => {
      const was = plot.tiles[i];
      if (t === was) return;
      if (was) { removed++; refund += Math.round(tileInfo(was).cost * data.build.refund); }
      if (t) {
        if (!rules.tools.includes(t) && !problems.includes('notHere')) problems.push('notHere');
        newTiles++;
        cost += tileInfo(t).cost;
        if (tileInfo(t).panel) newPanels++;
        const need = tileInfo(t).needs;
        if (need) needs[need] = (needs[need] || 0) + 1;
      }
    });
    // The village's decisions first: a town meeting, promises, the farmland permit (js/community.js)
    const village = HM.community ? HM.community.planProblems(state, id, plan, newPanels) : { problems: [], extra: {} };
    problems.unshift(...village.problems.filter(p => !problems.includes(p)));
    if (rules.rubble && !plot.rubbleCleared) problems.push('rubble');
    if (rules.maxPanels && plan.filter(t => t && tileInfo(t).panel).length > rules.maxPanels * plan.length) problems.push('maxPanels');
    // The outer ring of the pond stays natural (for frogs and dragonflies)
    if (rules.naturalEdge) {
      const p = plotGeo(id);
      const edge = i => i % p.w === 0 || i % p.w === p.w - 1 || i < p.w || i >= p.w * (p.h - 1);
      if (plan.some((t, i) => t && tileInfo(t).panel && edge(i))) problems.push('naturalEdge');
    }
    if (newPanels > partsLeft(state)) problems.push('parts');
    if (cost - refund > state.money) problems.push('money');
    Object.entries(needs).forEach(([item, n]) => { if ((state.bag[item] || 0) < n) problems.push('needs.' + item); });
    let minutes = (newTiles + removed) * data.build.minutesPerTile;
    let workDay = false;
    const helping = helpers(state);
    if (newTiles + removed === 0) problems.push('nothing');
    else if (newTiles + removed > data.build.maxAlone) {
      // A big plan: a work day with friends
      workDay = true;
      if (crew(state) < data.workDay.minHelpers) problems.push('helpers');
      else if (state.minutes / 60 > data.workDay.startBy) problems.push('workDayLate');
      minutes = Math.max(0, data.workDay.endAt * 60 - state.minutes);
    } else if (state.minutes + minutes > data.time.dayEnd) problems.push('late');
    return Object.assign({ cost, refund, newTiles, removed, newPanels, minutes, needs, workDay, helpers: helping,
      students: workDay && !!state.flags.rinStudents, problems, ok: problems.length === 0 }, village.extra);
  }

  // Build a plan that passed checkPlan. Returns the check (with what happened).
  function buildPlan(state, id, plan) {
    const check = checkPlan(state, id, plan);
    if (!check.ok) return null;
    const plot = state.plots[id];
    state.money += check.refund - check.cost;
    Object.entries(check.needs).forEach(([item, n]) => takeItem(state, item, n));
    if (partsLeft(state) !== Infinity) state.flags.starterPanels -= check.newPanels;
    plan.forEach((t, i) => {
      if (t === plot.tiles[i]) return;
      plot.loose = plot.loose.filter(n => n !== i);
      // Crops survive only under spaced panels or on open soil
      if (plot.crops && t && !tileInfo(t).crops) plot.crops[i] = null;
    });
    plot.tiles = plan.slice();
    plot.plan = null;
    state.minutes += check.minutes;
    if (check.workDay) { check.helpers.forEach(f => addPoints(state, f, D().workDay.helperPoints)); state.flags.workDay = true; }
    // A support grant for the first panels in the promotion zone (with Ms. Sato's help)
    if (HM.community) check.grant = HM.community.grantFor(state, id, check);
    return check;
  }

  // Clear the factory site's rubble on a work day (at least two friends must help)
  function checkRubble(state) {
    const problems = [];
    if (crew(state) < D().workDay.rubbleHelpers) problems.push('rubbleHelpers');
    else if (state.minutes / 60 > D().workDay.startBy) problems.push('workDayLate');
    return { ok: !problems.length, problems, helpers: helpers(state), students: !!state.flags.rinStudents };
  }
  function clearRubble(state, id) {
    const check = checkRubble(state);
    if (!check.ok) return null;
    state.plots[id].rubbleCleared = true;
    state.flags.workDay = true;
    state.minutes = Math.max(state.minutes, D().workDay.endAt * 60);
    check.helpers.forEach(f => addPoints(state, f, D().workDay.helperPoints));
    return check;
  }

  // Repair panels the typhoon loosened
  function repairCost(state, id) {
    const n = state.plots[id].loose.length;
    return { n, cost: n * D().typhoon.repairCost, minutes: n * D().typhoon.repairMinutes };
  }
  function repair(state, id) {
    const r = repairCost(state, id);
    if (!r.n || r.cost > state.money || state.minutes + r.minutes > D().time.dayEnd) return null;
    state.money -= r.cost;
    state.minutes += r.minutes;
    state.plots[id].loose = [];
    return r;
  }

  // ----- Vegetables on your home field -----
  const cropAt = (state, i) => (state.plots.home.crops || [])[i] || null;
  // Crops need light: they grow on open soil and under spaced panels, not under dense panels
  function cropLight(state, i) {
    const t = state.plots.home.tiles[i];
    return !t || !!tileInfo(t).crops;
  }
  // Seeds you can sow today
  const sowable = state => Object.keys(state.bag).filter(item => {
    const crop = D().items[item] && D().items[item].crop;
    return crop && D().crops[crop].seasons.includes(seasonOf(state.day));
  });
  function plant(state, i, seed) {
    const crop = D().items[seed] && D().items[seed].crop;
    if (!crop || !(state.bag[seed] > 0) || cropAt(state, i) || !cropLight(state, i)) return false;
    if (!D().crops[crop].seasons.includes(seasonOf(state.day))) return false;
    takeItem(state, seed, 1);
    state.plots.home.crops[i] = { crop, age: 0 };
    return true;
  }
  const isGrown = c => !!c && c.age >= D().crops[c.crop].days;
  function harvest(state, i) {
    const c = cropAt(state, i);
    if (!isGrown(c)) return null;
    addItem(state, c.crop, 1);
    state.plots.home.crops[i] = null;
    return c.crop;
  }

  // ----- Seasons, weather, power and the end of the day -----
  // Day 1 to 28: spring is day 1–7, summer 8–14, autumn 15–21, winter 22–28
  const seasonOf = day => D().seasons[Math.min(D().seasons.length - 1, Math.floor((day - 1) / D().daysPerSeason))];
  const dayInSeason = day => ((day - 1) % D().daysPerSeason) + 1;
  const weatherOf = day => D().days[Math.max(0, Math.min(D().days.length - 1, day - 1))];

  // On snow days, panels make 10% until you sweep them, then half (design.md section 7.5)
  const dayKey = state => (state.year || 1) * 100 + state.day;
  const swept = (state, id) => state.plots[id].sweptDay === dayKey(state);
  function dayPower(state) {
    const weather = weatherOf(state.day);
    const total = Object.keys(state.plots).reduce((sum, id) => {
      const factor = weather === 'snow' && swept(state, id) ? D().snow.swept : D().weatherPower[weather];
      return sum + plotStats(state, id).power * powerShare(state, id) * factor;
    }, 0);
    return Math.round(total);
  }
  // Sweeping the snow off a plot's panels: how many, and how long it takes
  function sweepCost(state, id) {
    const plot = state.plots[id];
    const n = weatherOf(state.day) === 'snow' && !swept(state, id) && plot.owner !== 'quick'
      ? plot.tiles.filter(t => t && tileInfo(t).panel).length : 0;
    return { n, minutes: n * D().snow.minutesPerPanel };
  }
  function sweep(state, id) {
    const c = sweepCost(state, id);
    if (!c.n || state.minutes + c.minutes > D().time.dayEnd) return null;
    state.plots[id].sweptDay = dayKey(state);
    state.minutes += c.minutes;
    return c;
  }
  // Snow lies on the panels (not swept today)
  const snowy = state => weatherOf(state.day) === 'snow' && Object.keys(state.plots).some(id => sweepCost(state, id).n > 0);

  // Ends the day: the panels' power becomes money, crops grow, the typhoon loosens panels,
  // the rice harvest is checked, and the next morning begins. Returns a summary for the evening screen.
  function endDay(state) {
    const power = dayPower(state);
    const income = power * D().money.perPower;
    state.money += income;
    state.stats.powerTotal += power;
    state.stats.incomeTotal += income;
    const before = state.dayStart.points;
    const summary = {
      day: state.day,
      weather: weatherOf(state.day),
      snowy: snowy(state),
      power, income, money: state.money,
      newSpecies: state.dayStart.diary.slice(),
      last: state.day >= D().time.lastDay
    };

    // Crops with light grow one day
    (state.plots.home.crops || []).forEach((c, i) => { if (c && cropLight(state, i)) c.age++; });

    // The typhoon night: about half of the exposed panels come loose
    if (summary.weather === 'typhoon') {
      let loose = 0;
      Object.keys(state.plots).forEach(id => {
        const plot = state.plots[id];
        if (plot.owner === 'quick') return;      // Quick Solar Co. looks after its own parks
        const exposed = exposedPanels(id, plot.tiles).filter(i => !plot.loose.includes(i));
        const hit = exposed.filter((i, n) => n % Math.round(1 / D().typhoon.looseShare) === 0);
        plot.loose = plot.loose.concat(hit);
        loose += hit.length;
      });
      summary.loose = loose;
    }

    // The rice harvest on Gen-san's paddy: enough light under the panels?
    if (state.day === D().harvestDay && state.plots.gen.tiles.some(t => t && tileInfo(t).panel)) {
      const good = plotStats(state, 'gen').shade < D().agriShadeLimit;
      summary.harvest = good ? 'good' : 'poor';
      if (good) { addPoints(state, 'gen', D().points.event); addItem(state, 'onigiri', 3); }
      else state.flags.genGuidance = true;
    }

    // The village: the citizen fund, the rainy season on the slope, a missed meeting (js/community.js)
    if (HM.community) HM.community.evening(state, summary);
    summary.money = state.money;

    // Friendship today (after the harvest and the fund, which can change it)
    summary.friends = Object.keys(state.friends).map(who => ({
      who,
      gained: state.friends[who].points - (before[who] || 0),
      hearts: heartsOf(state.friends[who].points)
    }));

    if (summary.last) state.finished = true;
    else {
      state.day++;
      state.minutes = D().time.dayStart;
      // A new season begins: your cooperator allowance arrives
      if (dayInSeason(state.day) === 1) {
        state.money += D().money.allowance;
        summary.allowance = D().money.allowance;
      }
      // The morning: Quick Solar Co.'s crew, letters (js/community.js)
      if (HM.community) HM.community.morning(state, summary);
      summary.money = state.money;
    }
    state.dayStart = { points: pointsOf(state.friends), diary: [] };
    return summary;
  }

  // ----- Nature diary -----
  function recordSpecies(state, species, area) {
    if (state.diary[species]) return false;
    state.diary[species] = { day: state.day, minutes: Math.floor(state.minutes), area };
    state.dayStart.diary.push(species);
    return true;
  }

  // ----- Saving -----
  function serialize(state) { return JSON.stringify(state); }

  // Read a saved game. Returns null if it is damaged or too old. Saves from Milestones 2.1 to 2.3
  // (versions 2 and 3) are brought up to date.
  function deserialize(text) {
    let s;
    try { s = JSON.parse(text); } catch (e) { return null; }
    if (!s || typeof s.day !== 'number' || !s.friends || !s.bag || !s.flags || !s.diary) return null;
    if (s.version === 2 && Array.isArray(s.field) && s.field.length === 16) {
      // Version 2: one home field → six plots
      s.plots = newPlots();
      s.plots.home.tiles = s.field;
      delete s.field;
      const built = s.plots.home.tiles.filter(t => t && tileInfo(t) && tileInfo(t).panel).length;
      s.flags.starterPanels = Math.max(0, D().starterPanels - built);
      s.version = 3;
    }
    if (s.version === 3 && s.plots && s.plots.home) {
      // Version 3 (Milestone 2.3): add what the village's decisions need
      Object.assign(s, { letters: [], meeting: null, funds: [], zone: null });
      s.stats.meetings = 0;
      s.version = SAVE_VERSION;
    }
    if (s.version !== SAVE_VERSION || !s.plots || !s.plots.home) return null;
    const fresh = newGame(s.name);
    // Residents added in Milestone 2.2
    Object.keys(fresh.friends).forEach(who => { if (!s.friends[who]) s.friends[who] = fresh.friends[who]; });
    if (!s.requests) s.requests = {};
    Object.keys(fresh.friends).forEach(who => { if (!(who in s.dayStart.points)) s.dayStart.points[who] = s.friends[who].points; });
    return s;
  }

  HM.rules = {
    newGame, lookOf, crew, heartsOf, addPoints, friendOf, heartsWith, talk, giftReaction, canGift, giveGift, addItem, takeItem,
    shopOpen, shopItems, buy, sell,
    canOpen, plotStats, connectedCorridors, exposedPanels, powerShare, helpers, partsLeft, checkPlan, buildPlan,
    checkRubble, clearRubble, repairCost, repair, sweepCost, sweep, swept, snowy,
    cropAt, cropLight, sowable, plant, isGrown, harvest,
    seasonOf, dayInSeason, weatherOf, dayPower, endDay, recordSpecies, serialize, deserialize
  };
})(globalThis);
