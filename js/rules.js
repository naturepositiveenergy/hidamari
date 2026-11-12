// Hidamari: the game rules, without anything on screen.
//
// Everything that decides numbers (hearts, gifts, building, power, money, the end of a day)
// lives here, so the automatic checks (tests/check.js) can test the rules without a browser.
// The numbers come from js/game-data.js.

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const D = () => HM.DATA;

  const SAVE_VERSION = 2;   // 2: the whole village and the whole year (Milestone 2.1)
  const FIELD_SIZE = 16;   // the home field has 4 × 4 tiles

  // ----- A new game -----
  function newGame(name) {
    const data = D();
    const friends = {};
    data.friends.forEach(who => { friends[who] = { points: 0, talkDay: 0, giftDay: 0 }; });
    return {
      version: SAVE_VERSION,
      name: String(name || '').trim().slice(0, 10),
      day: 1,
      minutes: data.time.firstDayStart,
      money: data.money.start + data.money.allowance,
      bag: Object.assign({}, data.startBag),
      field: Array(FIELD_SIZE).fill(null),
      friends,
      flags: {},
      requests: {},          // the residents' requests: { friend: { status: 'asked' | 'done', tasks: [true/false...] } }
      diary: {},
      stats: { powerTotal: 0, incomeTotal: 0 },
      dayStart: { points: pointsOf(friends), diary: [] },
      finished: false
    };
  }

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
    state.bag[item]--;
    if (!state.bag[item]) delete state.bag[item];
    state.friends[friendOf(who)].giftDay = state.day;
    addPoints(state, friendOf(who), D().points[reaction]);
    return reaction;
  }

  // ----- Hiro's shop -----
  function shopOpen(state) {
    const shop = D().shop;
    const h = state.minutes / 60;
    return dayInSeason(state.day) !== shop.closedDay && h >= shop.open && h < shop.close;
  }

  // Buy one item. Returns true if it worked.
  function buy(state, item) {
    const price = D().items[item] && D().items[item].price;
    if (!price || !D().shop.items.includes(item) || state.money < price) return false;
    state.money -= price;
    addItem(state, item, 1);
    return true;
  }

  function addItem(state, item, count) {
    state.bag[item] = (state.bag[item] || 0) + (count || 1);
  }

  // ----- The home field -----
  // Power, nature points and counts for a field (a list of 16 tiles or nulls)
  function fieldStats(field) {
    const tiles = D().buildTiles;
    const counts = {};
    let power = 0, nature = 0;
    field.forEach(t => {
      if (!t) return;
      counts[t] = (counts[t] || 0) + 1;
      power += tiles[t].power;
      nature += tiles[t].nature;
    });
    const types = Object.keys(counts).filter(t => tiles[t].natureType).length;
    if (types > 1) nature += D().varietyBonus * (types - 1);
    return { power, nature, counts };
  }

  // Check a plan (the field as it would be after building). Returns what it costs and any problems.
  function checkPlan(state, plan) {
    const data = D();
    let cost = 0, refund = 0, newTiles = 0, removed = 0;
    const needs = {};
    plan.forEach((t, i) => {
      const was = state.field[i];
      if (t === was) return;
      if (was) { removed++; refund += Math.round(data.buildTiles[was].cost * data.build.refund); }
      if (t) {
        newTiles++;
        cost += data.buildTiles[t].cost;
        const need = data.buildTiles[t].needs;
        if (need) needs[need] = (needs[need] || 0) + 1;
      }
    });
    const problems = [];
    if (newTiles > data.build.maxAlone) problems.push('tooMany');
    if (cost - refund > state.money) problems.push('money');
    Object.entries(needs).forEach(([item, n]) => { if ((state.bag[item] || 0) < n) problems.push('needs.' + item); });
    const minutes = (newTiles + removed) * data.build.minutesPerTile;
    if (newTiles + removed === 0) problems.push('nothing');
    else if (state.minutes + minutes > data.time.dayEnd) problems.push('late');
    return { cost, refund, newTiles, removed, minutes, needs, problems, ok: problems.length === 0 };
  }

  // Build a plan that passed checkPlan. Returns the minutes it took.
  function buildPlan(state, plan) {
    const check = checkPlan(state, plan);
    if (!check.ok) return null;
    state.money += check.refund - check.cost;
    Object.entries(check.needs).forEach(([item, n]) => {
      state.bag[item] -= n;
      if (!state.bag[item]) delete state.bag[item];
    });
    state.field = plan.slice();
    state.minutes += check.minutes;
    return check;
  }

  // ----- Seasons, weather, power and the end of the day -----
  // Day 1 to 28: spring is day 1–7, summer 8–14, autumn 15–21, winter 22–28
  const seasonOf = day => D().seasons[Math.min(D().seasons.length - 1, Math.floor((day - 1) / D().daysPerSeason))];
  const dayInSeason = day => ((day - 1) % D().daysPerSeason) + 1;
  const weatherOf = day => D().days[Math.max(0, Math.min(D().days.length - 1, day - 1))];

  function dayPower(state) {
    const factor = D().weatherPower[weatherOf(state.day)];
    return Math.round(fieldStats(state.field).power * factor);
  }

  // Ends the day: the panels' power becomes money, and the next morning begins.
  // Returns a summary of the day for the evening screen.
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
      power, income, money: state.money,
      newSpecies: state.dayStart.diary.slice(),
      friends: Object.keys(state.friends).map(who => ({
        who,
        gained: state.friends[who].points - (before[who] || 0),
        hearts: heartsOf(state.friends[who].points)
      })),
      last: state.day >= D().time.lastDay
    };
    if (summary.last) state.finished = true;
    else {
      state.day++;
      state.minutes = D().time.dayStart;
      // A new season begins: your cooperator allowance arrives
      if (dayInSeason(state.day) === 1) {
        state.money += D().money.allowance;
        summary.allowance = D().money.allowance;
        summary.money = state.money;
      }
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

  // Read a saved game. Returns null if it is damaged or from another version.
  function deserialize(text) {
    let s;
    try { s = JSON.parse(text); } catch (e) { return null; }
    if (!s || s.version !== SAVE_VERSION || typeof s.day !== 'number' || !Array.isArray(s.field) ||
        s.field.length !== FIELD_SIZE || !s.friends || !s.bag || !s.flags || !s.diary) return null;
    const fresh = newGame(s.name);
    // Saves from before Milestone 2.2: add the new residents and their requests
    Object.keys(fresh.friends).forEach(who => { if (!s.friends[who]) s.friends[who] = fresh.friends[who]; });
    if (!s.requests) s.requests = {};
    Object.keys(fresh.friends).forEach(who => { if (!(who in s.dayStart.points)) s.dayStart.points[who] = s.friends[who].points; });
    return s;
  }

  HM.rules = {
    newGame, heartsOf, addPoints, friendOf, talk, giftReaction, canGift, giveGift, addItem, shopOpen, buy,
    fieldStats, checkPlan, buildPlan, seasonOf, dayInSeason, weatherOf, dayPower, endDay, recordSpecies,
    serialize, deserialize, FIELD_SIZE
  };
})(globalThis);
