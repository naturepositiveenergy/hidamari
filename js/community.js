// Hidamari: the village's decisions (Milestone 2.4), as rules without anything on screen.
//
// The worries list and nemawashi, the town meeting (説明会), the farmland permit, the citizen fund,
// Mr. Kurokawa's offers, the forest slope and its water, the promotion zone, letters, and the three
// meters and the endings. The scenes and conversations that use these rules are in js/scenes.js and
// js/story.js. The numbers are in js/game-data.js; design.md sections 1, 7, 10 and 12 explain them.
// js/rules.js calls planProblems() while checking a plan, and evening() and morning() at the end of a day.

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const D = () => HM.DATA;
  const R = () => HM.rules;
  const plotGeo = id => HM.MAP.plots.find(p => p.id === id);
  const tileInfo = t => D().buildTiles[t];
  const isPanel = t => !!t && !!tileInfo(t).panel;

  // ----- Plans that wait for a town meeting -----
  const needsMeeting = (state, id) => !!D().plots[id].meeting && !state.plots[id].approved;
  // The plan you keep for a plot (or what is built, if there is no plan)
  const planOf = (state, id) => state.plots[id].plan || state.plots[id].tiles;
  const hasPlan = (state, id) => {
    const plot = state.plots[id];
    return !!plot.plan && plot.plan.some((t, i) => t !== plot.tiles[i]);
  };
  // Open plots with a plan that needs the village's agreement
  const pendingPlots = state => D().plotOrder.filter(id => state.plots[id].open && needsMeeting(state, id) && hasPlan(state, id));

  // ----- The worries list (design.md section 10.1) -----
  // The tiles along one edge of a plot, and all round it
  function southEdge(id) {
    const { w, h } = plotGeo(id);
    return Array.from({ length: w }, (_, x) => (h - 1) * w + x);
  }
  function ring(id) {
    const { w, h } = plotGeo(id);
    const out = [];
    for (let i = 0; i < w * h; i++) {
      const x = i % w, y = Math.floor(i / w);
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) out.push(i);
    }
    return out;
  }

  const RULES = {
    // Gen-san: fields stay fields (spaced panels over crops, no dense panels)
    farmed: (state, id, plan) => !plan.includes('dense'),
    // Fumiko-san: the mountain view from her veranda (a hedge all along the south edge)
    view: (state, id, plan) => {
      const edge = southEdge(id);
      return edge.every(i => plan[i] === 'hedge' || plan[i] === 'path') && edge.some(i => plan[i] === 'hedge');
    },
    // The Mori family: children's safety (hedges or fences all round, or a fence there already)
    safe: (state, id, plan) => !!D().plots[id].fenced || ring(id).every(i => ['hedge', 'fence', 'path'].includes(plan[i])),
    // Midori: life in the garden (the pond's wild edge counts as an answer)
    nature: (state, id, plan) => !!D().plots[id].naturalEdge || R().plotStats(state, id, plan).nature >= D().natureNeeded,
    // Kuma-san: the water (the pond's rules and the paddy's water channels keep it safe)
    water: () => true,
    // Hiro: the money stays in the village
    village: state => !state.flags.quickDeal
  };

  // Each worry that counts on this plot: { who, ok, fixable }
  function worries(state, id, plan) {
    plan = plan || planOf(state, id);
    return D().worryOrder.filter(who => D().worries[who].plots.includes(id)).map(who => {
      const w = D().worries[who];
      return { who, ok: !!RULES[w.rule](state, id, plan), fixable: !!w.fixable };
    });
  }
  const worryOk = (state, id, who, plan) => !!RULES[D().worries[who].rule](state, id, plan || planOf(state, id));

  // ----- Nemawashi (根回し): talking to everyone before the meeting -----
  const told = (state, id) => state.plots[id].told || {};
  function tell(state, id, friend) {
    state.plots[id].told = Object.assign({}, told(state, id), { [friend]: true });
  }
  // Mr. Oda's worry: has everyone with a worry heard about the plan?
  const toldAll = (state, id) => worries(state, id).every(w => told(state, id)[w.who]);
  // The plot a resident would hear about now (after Mr. Oda has taught you nemawashi), or null
  function nemawashiPlot(state, friend) {
    if (!state.flags.nemawashi || !D().worries[friend]) return null;
    const ids = state.meeting ? [state.meeting.plot] : pendingPlots(state);
    return ids.find(id => D().worries[friend].plots.includes(id) && !told(state, id)[friend]) || null;
  }

  // ----- The town meeting -----
  function scheduleMeeting(state, id) {
    state.meeting = { plot: id, day: state.day + 1 };
  }
  const meetingToday = state => !!state.meeting && state.meeting.day === state.day;
  const zoneOf = (state, id) => (state.zone && state.zone[id]) || null;

  // How warm the room is at the start, and why (text codes: meeting.note.<reason>)
  function meetingStart(state, id) {
    const m = D().meeting;
    let warmth = m.start;
    const notes = [];
    if (state.flags.nemawashi) {
      if (toldAll(state, id)) { warmth++; notes.push('told'); } else { warmth--; notes.push('notTold'); }
    }
    if (zoneOf(state, id) === 'green') { warmth++; notes.push('zone'); }
    if (state.flags.mudflow) {
      warmth--; notes.push('mudflow');
      if (state.flags.mudflow.by === 'partner') { warmth--; notes.push('blame'); }
    }
    if (state.flags.ordinance) notes.push('ordinance');
    return { warmth, notes };
  }
  const meetingNeed = state => (state.flags.ordinance ? D().meeting.needOrdinance : D().meeting.need);

  // What you lead with: the village (works if you talked to everyone), nature (if the plan really has it)
  // or money (if the plan really makes power)
  function leadEffect(state, id, lead) {
    const plan = planOf(state, id);
    if (lead === 'village') return toldAll(state, id) ? 1 : 0;
    if (lead === 'nature') return worryOk(state, id, 'midori', plan) ? 1 : -1;
    return R().plotStats(state, id, plan).power >= D().meeting.leadPower ? 1 : 0;
  }
  // An answer to a question: 'honest' (good if the plan has the answer), 'change' or 'vague'
  function answerEffect(kind, ok) {
    const m = D().meeting;
    if (kind === 'honest') return ok ? m.honestGood : m.honestBad;
    return kind === 'change' ? m.change : m.vague;
  }
  const clampWarmth = n => Math.max(0, Math.min(D().meeting.max, n));

  // Friends who speak up for you: 3 hearts or more (Mr. Oda, the host, at 4 hearts; not Mr. Kurokawa)
  const supporters = state => D().friends.filter(f => f !== 'kurokawa' &&
    R().heartsWith(state, f) >= (f === 'oda' ? 4 : D().meeting.friendHearts));

  // The meeting agreed: the plot is approved for good (with the conditions you promised)
  function approve(state, id, conditions) {
    const plot = state.plots[id];
    plot.approved = true;
    plot.conditions = (conditions || []).slice();
    const permit = D().plots[id].permit;
    if (permit && zoneOf(state, id) !== 'green') plot.permitDay = state.day + permit;
    state.stats.meetings = (state.stats.meetings || 0) + 1;
    state.meeting = null;
  }

  // Extra problems for a plan (added to the ones in js/rules.js checkPlan)
  function planProblems(state, id, plan, newPanels) {
    const plot = state.plots[id], rules = D().plots[id];
    const problems = [], extra = {};
    if (plot.owner === 'quick') problems.push('quick');
    if (needsMeeting(state, id)) problems.push('meeting');
    else {
      const unmet = (plot.conditions || []).filter(who => !worryOk(state, id, who, plan));
      if (unmet.length) { problems.push('condition'); extra.unmet = unmet; }
    }
    // The farmland conversion permit: only for dense panels (spaced panels over crops are farming)
    if (plot.permitDay && state.day < plot.permitDay && plan.includes('dense') && zoneOf(state, id) !== 'green') {
      problems.push('permit');
      extra.permitDay = plot.permitDay;
    }
    if (rules.slope && state.flags.ordinance && newPanels > 0) problems.push('ordinance');
    return { problems, extra };
  }

  // ----- The citizen fund (design.md section 10.2) -----
  // Hiro doesn't trust you after a deal with Quick Solar Co. or a mudflow from your garden
  const distrust = state => !!state.flags.quickDeal || !!(state.flags.mudflow && state.flags.mudflow.by === 'partner');
  const openFund = state => (state.funds || []).find(f => !f.closed) || null;
  const canSuggestFund = state => !openFund(state) && !distrust(state) && R().heartsWith(state, 'hiro') >= D().meeting.hiroHearts;
  function startFund(state, id) {
    state.funds = (state.funds || []).concat([{ plot: id, until: state.day + D().fund.days - 1, investors: {}, closed: false }]);
  }
  // How much a household invests now (0 = not)
  function investment(state, friend) {
    const f = D().fund;
    if (f.notInvesting.includes(friend)) return 0;
    if (friend === 'hiro' && distrust(state)) return 0;
    const h = R().heartsWith(state, friend);
    if (friend === 'mori' && h < f.moriHearts) return 0;
    return f.amounts[h] || 0;
  }
  // Each evening while the fund is open, friends who trust you invest; it closes after 3 days
  function fundEvening(state, summary) {
    const fund = openFund(state);
    if (!fund) return;
    const fresh = [];
    D().friends.forEach(who => {
      if (fund.investors[who]) return;
      const amount = investment(state, who);
      if (!amount) return;
      fund.investors[who] = amount;
      state.money += amount;
      R().addPoints(state, who, D().fund.points);
      fresh.push(who);
    });
    if (state.day >= fund.until) fund.closed = true;
    summary.fund = { fresh, amount: fresh.reduce((n, who) => n + fund.investors[who], 0), closed: fund.closed,
      total: Object.values(fund.investors).reduce((n, a) => n + a, 0) };
  }
  const investors = state => (state.funds || []).reduce((n, f) => n + Object.keys(f.investors).length, 0);

  // ----- Letters in your letterbox -----
  function addLetter(state, name) {
    state.letters = (state.letters || []).concat([name]);
  }
  const letterLines = name => Array.from({ length: D().letters[name] || 0 }, (_, i) => `letter.${name}.${i + 1}`);

  // ----- Mr. Kurokawa and the forest slope (design.md sections 7.4 and 10.3) -----
  const slope = state => state.plots.slope;
  const slopeBuilt = state => !!slope(state).cleared;
  // Fill rows and columns of the slope with dense panels
  function slopeLayout(area) {
    const { w, h } = plotGeo('slope');
    return Array.from({ length: w * h }, (_, i) => {
      const x = i % w, y = Math.floor(i / w);
      return y >= area.rows[0] && y <= area.rows[1] && x >= area.cols[0] && x <= area.cols[1] ? 'dense' : null;
    });
  }
  // Quick Solar Co.'s crew clears the forest and builds (owner: 'partner' with you, or 'quick' alone)
  function buildSlope(state, owner) {
    const plot = slope(state), k = D().kurokawa;
    plot.owner = owner;
    plot.cleared = true;
    plot.approved = true;          // the company held its own briefing in town
    plot.open = owner === 'partner';
    plot.tiles = slopeLayout(owner === 'partner' ? k.partner : k.park);
    plot.plan = null;
    plot.loose = [];
    plot.builtDay = state.day;
  }

  // His offer on spring day 3: 'lease' your home field, 'partner' on the slope, or 'no'
  function kurokawaDeal(state, deal) {
    const k = D().kurokawa;
    state.flags.kuro = deal;
    if (deal === 'lease') {
      const home = state.plots.home;
      // Built tiles go back for half their cost; the field becomes Quick Solar's for the year
      state.money += k.lease + home.tiles.reduce((n, t) => n + (t ? Math.round(tileInfo(t).cost * D().build.refund) : 0), 0);
      home.owner = 'quick';
      home.open = false;
      home.tiles = home.tiles.map(() => 'dense');
      home.loose = [];
      home.plan = null;
      if (home.crops) home.crops = home.crops.map(() => null);
      state.flags.quickDeal = true;
      Object.entries(k.leasePoints).forEach(([who, n]) => R().addPoints(state, who, n));
    }
    if (deal === 'partner') state.flags.quickDeal = true;
  }
  // Mr. Oda writes to the slope's owner in Tokyo (with 3 hearts, before the summer)
  const canAskOda = state => !state.flags.slopeSaved && !slopeBuilt(state) && state.flags.kuro !== 'partner' &&
    !!state.flags.kuroMet && state.day < D().kurokawa.parkDay && R().heartsWith(state, 'oda') >= 3;

  // The water view: rain runs downhill (south). A drainage ditch or a pond further south in the same
  // column catches a panel's runoff; otherwise it runs off the plot into the stream.
  function runoff(id, tiles) {
    const caught = [], loose = [];
    if (!D().plots[id].slope) return { caught, loose, flat: true };
    const { w, h } = plotGeo(id);
    tiles.forEach((t, i) => {
      if (!isPanel(t)) return;
      const x = i % w;
      let by = -1;
      for (let y = Math.floor(i / w) + 1; y < h && by < 0; y++) {
        const below = tiles[y * w + x];
        if (below === 'drain' || below === 'pond') by = y * w + x;
      }
      (by >= 0 ? caught : loose).push({ i, by });
    });
    return { caught, loose };
  }

  // Clean up after the mudflow (a work day with at least one friend), and restore the slope
  const canCleanUp = state => !!state.flags.mudflow && !state.flags.cleanUp;
  function checkCleanUp(state) {
    const helping = R().helpers(state);
    const problems = [];
    if (!R().crew(state)) problems.push('helpers');
    else if (state.minutes / 60 > D().workDay.startBy) problems.push('workDayLate');
    return { ok: !problems.length, problems, helpers: helping, students: !!state.flags.rinStudents };
  }
  function cleanUp(state) {
    const check = checkCleanUp(state);
    if (!check.ok) return null;
    const k = D().kurokawa;
    state.flags.cleanUp = true;
    state.flags.workDay = true;
    state.minutes = Math.max(state.minutes, D().workDay.endAt * 60);
    Object.entries(k.cleanUp).forEach(([who, n]) => R().addPoints(state, who, n));
    check.helpers.filter(f => !k.cleanUp[f]).forEach(f => R().addPoints(state, f, D().workDay.helperPoints));
    check.kurokawa = R().heartsWith(state, 'kurokawa') >= 2;
    if (check.kurokawa) R().addPoints(state, 'kurokawa', k.cleanUpKurokawa);
    return check;
  }
  const canRestore = state => !!state.flags.mudflow && !state.flags.slopeRestored && R().heartsWith(state, 'kurokawa') >= 4;
  // Young trees, a meadow and a small retention pond where the panels were
  function restoreSlope(state) {
    const plot = slope(state), { w, h } = plotGeo('slope');
    plot.tiles = plot.tiles.map((t, i) => {
      const y = Math.floor(i / w);
      return y === h - 1 ? 'pond' : y === h - 2 ? 'meadow' : 'hedge';
    });
    plot.owner = null;
    plot.open = false;
    plot.loose = [];
    state.flags.slopeRestored = true;
    Object.entries(D().kurokawa.restore).forEach(([who, n]) => R().addPoints(state, who, n));
  }

  // His autumn offer: buy your biggest power garden for 1.5 times what it cost
  const gardenCost = tiles => tiles.reduce((n, t) => n + (t ? tileInfo(t).cost : 0), 0);
  function buyOffer(state) {
    const k = D().kurokawa;
    if (state.day < k.buyFromDay || state.flags.kuroBuyAsked) return null;
    const id = D().plotOrder.filter(p => !state.plots[p].owner && state.plots[p].tiles.some(isPanel))
      .sort((a, b) => state.plots[b].tiles.filter(isPanel).length - state.plots[a].tiles.filter(isPanel).length)[0];
    return id ? { plot: id, price: Math.round(gardenCost(state.plots[id].tiles) * k.buyFactor) } : null;
  }
  // If you sell: the hedges are cut, weed killer is sprayed, and investors and Midori are hurt
  function sellGarden(state, id) {
    const offer = buyOffer(state);
    if (!offer || offer.plot !== id) return null;
    const plot = state.plots[id];
    state.money += offer.price;
    plot.owner = 'quick';
    plot.open = false;
    plot.tiles = plot.tiles.map(t => (isPanel(t) ? t : null));
    plot.plan = null;
    if (plot.crops) plot.crops = plot.crops.map(() => null);
    state.flags.quickDeal = true;
    state.flags.kuroBuyAsked = true;
    state.flags.sold = id;
    const hurt = new Set(['midori']);
    (state.funds || []).forEach(f => Object.keys(f.investors).forEach(who => hurt.add(who)));
    hurt.forEach(who => R().addPoints(state, who, D().kurokawa.soldPoints));
    return offer;
  }

  // ----- The promotion zone (design.md section 10.4) -----
  // How the village votes for each plot: 'green' (welcome), 'yellow' (careful) or 'red' (no)
  function zoneVotes(state) {
    const owner = { gen: 'gen', fumiko: 'fumiko', pond: 'kuma' };
    const votes = {};
    D().zoning.plots.forEach(id => {
      if (id === 'factory') votes[id] = 'green';
      else if (id === 'slope') votes[id] = 'red';
      else votes[id] = R().heartsWith(state, owner[id]) >= 4 ? 'green' : 'yellow';
    });
    return votes;
  }
  // You speak for one plot: a yellow plot turns green (the slope stays red)
  function speakFor(votes, id) {
    const out = Object.assign({}, votes);
    if (out[id] === 'yellow') out[id] = 'green';
    return out;
  }
  const firstYear = state => (state.year || 1) === 1;
  const zoningToday = state => firstYear(state) && !state.flags.zoningDone && state.day === D().zoning.day &&
    R().heartsWith(state, 'sato') >= D().zoning.satoHearts;
  function finishZoning(state, votes) {
    state.zone = Object.assign({}, votes);
    state.flags.zoningDone = true;
    // Plots in the zone need no farmland permit
    Object.keys(state.zone).forEach(id => { if (state.zone[id] === 'green') delete state.plots[id].permitDay; });
  }
  // A support grant, once, when you build panels in the zone: after you applied with Ms. Sato (her 4-heart event)
  function grantFor(state, id, check) {
    const z = D().zoning;
    if (state.flags.grant || zoneOf(state, id) !== 'green' || !check.newPanels || !HM.events.done(state, 'sato.4')) return 0;
    state.flags.grant = true;
    state.money += z.grant;
    return z.grant;
  }

  // ----- At the end of a day (before the next morning) -----
  function evening(state, summary) {
    fundEvening(state, summary);
    // The rainy season: a slope garden whose runoff nothing catches sends mud into the stream
    const k = D().kurokawa;
    if (firstYear(state) && state.day === k.mudflowDay && slopeBuilt(state) && slope(state).tiles.some(isPanel)) {
      const by = slope(state).owner;
      if (runoff('slope', slope(state).tiles).loose.length) {
        state.flags.mudflow = { day: state.day, by };
        state.flags.ordinance = true;
        if (by === 'partner') Object.entries(k.blame).forEach(([who, n]) => R().addPoints(state, who, n));
        addLetter(state, 'ordinance');
        summary.mudflow = by;
      } else if (Math.random() < k.harmless) summary.mudflow = 'harmless';
    }
    // A town meeting you missed moves to the next day
    if (state.meeting && state.meeting.day <= state.day) {
      state.meeting.day = state.day + 1;
      summary.meetingMoved = true;
    }
  }

  // ----- In the morning (the new day has begun) -----
  function morning(state, summary) {
    const k = D().kurokawa, R_ = R();
    // Letters from the citizen fund's investors at the start of each season
    if (R_.dayInSeason(state.day) === 1 && investors(state)) {
      const season = R_.seasonOf(state.day);
      addLetter(state, 'fund' + season[0].toUpperCase() + season.slice(1));
    }
    if (!firstYear(state)) return;     // the free year has no new story (design.md section 12)
    // His crew builds your partner garden overnight
    if (state.flags.kuro === 'partner' && !slopeBuilt(state)) { buildSlope(state, 'partner'); summary.slopeBuilt = 'partner'; }
    // If you said no and nobody stopped him, he builds his own smaller park at the start of summer
    if (state.day >= k.parkDay && !slopeBuilt(state) && !state.flags.slopeSaved && state.flags.kuro !== 'partner') {
      buildSlope(state, 'quick');
      addLetter(state, 'quickPark');
      summary.slopeBuilt = 'quick';
    }
    if (state.day === k.fromDay) addLetter(state, 'kuroFlyer');
    if (state.day === D().zoning.day - 1 && R_.heartsWith(state, 'sato') >= D().zoning.satoHearts) addLetter(state, 'zoning');
  }

  // ----- The three meters and the endings (design.md sections 1 and 12) -----
  function meters(state) {
    const m = D().meters, R_ = R();
    let power = 0, nature = 0;
    D().plotOrder.forEach(id => {
      const share = R_.powerShare(state, id);
      if (!share) return;
      const stats = R_.plotStats(state, id);
      power += stats.power * share;
      if (state.plots[id].owner !== 'partner') nature += stats.nature;
    });
    const hearts = D().friends.reduce((n, f) => n + R_.heartsWith(state, f), 0);
    const pct = n => Math.max(0, Math.min(100, Math.round(n)));
    return {
      sun: pct(power / m.sunDiv),
      nature: pct((nature + Object.keys(state.diary).length * m.diaryPoints) / m.natureDiv),
      community: pct(hearts * m.heart + (state.stats.meetings || 0) * m.meeting + investors(state) * m.investor +
        (state.flags.cleanUp ? m.cleanUp : 0) + (state.flags.zoningDone ? m.zoning : 0) +
        (state.stats.festivals || 0) * m.festival + (state.stats.gifts || 0) * m.gift)
    };
  }
  function ending(state) {
    const m = meters(state), t = D().meters;
    if (m.sun >= t.high && m.nature >= t.high && m.community >= t.high) return 'sunVillage';
    const best = Math.max(m.sun, m.nature, m.community);
    if (best < t.low) return 'firstStep';
    if (m.nature === best) return 'firefly';
    if (m.community === best) return 'everyone';
    return 'lights';
  }
  // How the slope looks at the end of the year
  function slopeEnding(state) {
    if (state.flags.slopeRestored) return 'restored';
    if (state.flags.mudflow) return 'scar';
    return slopeBuilt(state) ? 'park' : 'forest';
  }
  // Each resident's last words of the year depend on your friendship
  // A resident's epilogue: after their 5-heart event, one about what came of it (Milestone 3.2)
  function epilogue(state, friend) {
    if (HM.events && HM.events.done(state, friend + '.5')) return 'five';
    const h = R().heartsWith(state, friend);
    return h >= 4 ? 'high' : h >= 2 ? 'mid' : 'low';
  }

  // ----- The ending scene (Milestone 3.2): the year in numbers, and a word from each close friend -----
  const gardens = state => Object.values(state.plots).filter(p => p.owner !== 'quick' && p.tiles.some(Boolean)).length;
  function review(state) {
    return {
      species: Object.keys(state.diary).length, gardens: gardens(state),
      power: Math.round(state.stats.powerTotal || 0), festivals: state.stats.festivals || 0
    };
  }
  // Friends with 3 hearts or more stand up and say a word, in the order of the hall's seats.
  // Some words depend on what happened (a second text code with a name, for example ending.word.gen.paddy).
  const WORD_VARIANTS = {
    gen: s => (s.plots.gen.tiles.includes('spaced') ? 'paddy' : null),
    midori: s => (s.flags.natureSite ? 'site' : null),
    hiro: s => (s.flags.hiroRoof ? 'roof' : null),
    kurokawa: s => (HM.events && HM.events.done(s, 'kurokawa.5') ? 'quit' : null)
  };
  const SPEAKERS = { mori: 'aya' };
  function words(state) {
    return D().friends.filter(f => R().heartsWith(state, f) >= D().endingWords && (f !== 'kurokawa' || state.flags.kuroMet)).map(f => {
      const variant = WORD_VARIANTS[f] && WORD_VARIANTS[f](state);
      return { who: SPEAKERS[f] || f, key: 'ending.word.' + f + (variant ? '.' + variant : '') };
    });
  }

  HM.community = {
    needsMeeting, planOf, hasPlan, pendingPlots, worries, worryOk, tell, told, toldAll, nemawashiPlot,
    scheduleMeeting, meetingToday, meetingStart, meetingNeed, leadEffect, answerEffect, clampWarmth, supporters, approve,
    planProblems, zoneOf,
    distrust, openFund, canSuggestFund, startFund, investment, investors,
    addLetter, letterLines,
    slopeBuilt, buildSlope, kurokawaDeal, canAskOda, runoff, canCleanUp, checkCleanUp, cleanUp, canRestore, restoreSlope,
    buyOffer, sellGarden, gardenCost,
    zoneVotes, speakFor, zoningToday, finishZoning, grantFor, firstYear,
    evening, morning, meters, ending, slopeEnding, epilogue, review, words
  };
})(globalThis);
