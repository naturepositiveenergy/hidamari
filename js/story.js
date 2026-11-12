// Hidamari: what people say and what happens when you use things (Phase 1 test).
//
// Conversations are lists of steps for js/dialogue.js. The words themselves are in the
// language files: here are only their text codes (for example 'gen.meet.1').

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const R = () => HM.rules;

  const C = () => HM.community;
  const say = (who, key, vars) => ({ say: key, who, vars });
  const narrate = (key, vars) => ({ say: key, who: 'narrator', vars });
  const run = fn => ({ run: fn });

  const hour = state => state.minutes / 60;
  // What you have built, on all your plots together
  const allTiles = state => Object.values(state.plots).flatMap(p => p.tiles);
  const fieldHas = (state, type) => allTiles(state).includes(type);
  const count = (state, type) => allTiles(state).filter(t => t === type).length;

  // ----- A plot owner gives permission (design.md section 7.1) -----
  // When you are close enough friends, the owner of a plot lets you build there.
  function permission(state, who) {
    const friend = R().friendOf(who);
    const id = HM.DATA.plotOrder.find(id => {
      const rule = HM.DATA.plots[id].open;
      return rule && rule.friend === friend && !state.plots[id].open && R().canOpen(state, id) && !HM.events.opens(id);
    });
    if (!id) return null;
    return [say(who, `plot.open.${id}.1`), say(who, `plot.open.${id}.2`),
      run(g => { g.state.plots[id].open = true; }), narrate('plot.opened', { plot: { key: 'plot.' + id } })];
  }

  // ----- Your home field: sow, wait, harvest -----
  function farm(game, i) {
    const state = game.state;
    if (state.plots.home.owner === 'quick') return [narrate('farm.leased')];
    const crop = R().cropAt(state, i);
    if (crop && R().isGrown(crop)) {
      return [run(g => { R().harvest(g.state, i); g.passTime(5); }), received(crop.crop, 1)];
    }
    if (crop) {
      if (!R().cropLight(state, i)) return [narrate('farm.dark')];
      const left = HM.DATA.crops[crop.crop].days - crop.age;
      return [narrate('farm.growing', { crop: { key: 'item.' + crop.crop }, days: left })];
    }
    if (!R().cropLight(state, i)) return [narrate('farm.dark')];
    const seeds = R().sowable(state);
    if (!seeds.length) return [narrate(state.plots.home.tiles[i] && state.plots.home.tiles[i] !== 'spaced' ? 'farm.built' : 'farm.noSeeds')];
    return [narrate('farm.sow'), {
      choice: seeds.map(seed => ({
        key: 'talk.giftItem', vars: { item: { key: 'item.' + seed }, n: state.bag[seed] },
        then: [run(g => { R().plant(g.state, i, seed); g.passTime(5); }), narrate('farm.sown', { crop: { key: 'item.' + HM.DATA.items[seed].crop } })]
      })).concat([{ key: 'talk.cancel', then: [] }])
    }];
  }

  // An item you received, as a line
  const received = (item, n) => narrate('got.item', { item: { key: 'item.' + item }, n });

  // ----- Gifts: "Give a gift" / "Goodbye" at the end of a chat -----
  function giftChoice(game, who) {
    const state = game.state;
    if (!R().canGift(state, who)) return [];
    const items = Object.keys(state.bag).filter(i => HM.DATA.items[i] && HM.DATA.items[i].gift && state.bag[i] > 0);
    if (!items.length) return [];
    return [{
      choice: [
        { key: 'talk.gift', then: [{ choice: items.map(item => ({
          key: 'talk.giftItem', vars: { item: { key: 'item.' + item }, n: state.bag[item] },
          then: [run(g => {
            const reaction = R().giveGift(g.state, who, item);
            return reaction ? [say(who, `${who}.gift.${reaction}`, { item: { key: 'item.' + item } })] : [];
          })]
        })).concat([{ key: 'talk.cancel', then: [] }]) }] },
        { key: 'talk.bye', then: [] }
      ]
    }];
  }

  // ----- Gen-san -----
  function talkGen(game, first, resident) {
    const state = game.state, flags = state.flags;
    if (!flags.metGen) {
      flags.metGen = true;
      return [
        say('gen', 'gen.meet.1'), say('gen', 'gen.meet.2'), say('gen', 'gen.meet.3'),
        { choice: [
          { key: 'gen.meet.c1', then: [say('gen', 'gen.meet.r1')] },
          { key: 'gen.meet.c2', then: [say('gen', 'gen.meet.r2')] }
        ] },
        say('gen', 'gen.req.ask.1'), say('gen', 'gen.req.ask.2'),
        run(g => { g.state.flags.genRequest = 'asked'; })
      ];
    }
    const allow = permission(state, 'gen');
    if (allow) return allow;
    if (flags.genRequest === 'asked' && flags.leavesCleared) {
      return [
        say('gen', 'gen.req.done.1'), say('gen', 'gen.req.done.2'),
        run(g => {
          g.state.flags.genRequest = 'done';
          R().addPoints(g.state, 'gen', HM.DATA.points.request);
          R().addItem(g.state, 'onigiri', 2);
        }),
        received('onigiri', 2)
      ];
    }
    const request = requestTalk(game, 'gen', first);
    if (request) return request;
    if (!first) return [say('gen', 'gen.chat.again')];
    const hint = HM.events.hint(state, 'gen');
    if (hint) return [say('gen', hint)];
    let key;
    if (fieldHas(state, 'spaced') && !flags.genSawSpaced) { key = 'gen.chat.spaced'; flags.genSawSpaced = true; }
    else if (fieldHas(state, 'hedge') && !flags.genSawHedge) { key = 'gen.chat.hedge'; flags.genSawHedge = true; }
    else if (fieldHas(state, 'dense') && !flags.genSawDense) { key = 'gen.chat.panels'; flags.genSawDense = true; }
    else if (flags.genRequest === 'asked') key = 'gen.chat.reminder';
    else key = pickChat(state, 'gen', resident);       // everyday lines (js/talks.js)
    return [say('gen', key)];
  }

  // ----- Midori -----
  function talkMidori(game, first, resident) {
    const state = game.state, flags = state.flags;
    const steps = [];
    if (!flags.metMidori) {
      flags.metMidori = true;
      steps.push(say('midori', 'midori.meet.1'), say('midori', 'midori.meet.2'));
      if (state.day < 2) {
        steps.push(say('midori', 'midori.meet.3'));
        return steps;
      }
    }
    if (!flags.diary) {
      if (state.day < 2) return [say('midori', 'midori.chat.tomorrow')];
      return steps.concat([
        say('midori', 'midori.diary.1'), say('midori', 'midori.diary.2'),
        run(g => { g.state.flags.diary = true; }),
        narrate('got.diary'),
        say('midori', 'midori.req.ask'),
        run(g => { g.state.flags.midoriRequest = 'asked'; })
      ]);
    }
    if (flags.midoriRequest === 'asked') {
      const answer = n => run(g => {
        const right = n === HM.DATA.nestCount;
        g.state.flags.midoriRequest = 'done';
        R().addPoints(g.state, 'midori', right ? HM.DATA.points.request : HM.DATA.points.wrongAnswer);
        return [say('midori', right ? 'midori.req.right' : 'midori.req.wrong')];
      });
      return [
        say('midori', 'midori.req.q'),
        { choice: HM.DATA.nestChoices.map(n => ({ key: 'midori.req.count', vars: { n }, then: [answer(n)] }))
          .concat([{ key: 'midori.req.c0', then: [say('midori', 'midori.req.later')] }]) }
      ];
    }
    const request = requestTalk(game, 'midori', first);
    if (request) return request;
    if (!first) return [say('midori', 'midori.chat.again')];
    const hint = HM.events.hint(state, 'midori');
    if (hint) return [say('midori', hint)];
    const species = Object.keys(state.diary).length;
    let key, vars;
    if (fieldHas(state, 'meadow') && !flags.midoriSawMeadow) { key = 'midori.chat.meadowBuilt'; flags.midoriSawMeadow = true; }
    else if (fieldHas(state, 'hedge') && !flags.midoriSawHedge) { key = 'midori.chat.hedgeBuilt'; flags.midoriSawHedge = true; }
    else if (count(state, 'dense') >= 2 && !fieldHas(state, 'meadow') && !fieldHas(state, 'hedge') && !flags.midoriSawDense) {
      key = 'midori.chat.dense'; flags.midoriSawDense = true;
    } else if (species >= 2 && flags.midoriCounted !== species) { key = 'midori.chat.diaryCount'; vars = { n: species }; flags.midoriCounted = species; }
    else key = pickChat(state, 'midori', resident);    // everyday lines (js/talks.js)
    return [say('midori', key, vars)];
  }

  // ----- Everyone else: conversations from js/talks.js -----
  // Does a chat line's "when" fit now?
  function chatFits(when, state, who, resident) {
    if (!when) return true;
    const spots = [].concat(when.spot || []);
    if (spots.length && !spots.includes(resident.spot)) return false;
    if (when.weather && !when.weather.includes(R().weatherOf(state.day))) return false;
    if (when.seasons && !when.seasons.includes(R().seasonOf(state.day))) return false;
    if (when.weekend !== undefined && when.weekend !== (R().dayInSeason(state.day) >= 6)) return false;
    if (when.field === 'panels' && !(fieldHas(state, 'dense') || fieldHas(state, 'spaced'))) return false;
    if (when.field && when.field !== 'panels' && !fieldHas(state, when.field)) return false;
    if (when.hearts && R().heartsOf(state.friends[R().friendOf(who)].points) < when.hearts) return false;
    // (since Milestone 3.2) hours: [from, to) · flag / notFlag: something that happened, or hasn't ·
    // event: a heart event that happened · fund: a citizen fund has been opened
    if (when.hours && !(hour(state) >= when.hours[0] && hour(state) < when.hours[1])) return false;
    if (when.flag && !state.flags[when.flag]) return false;
    if (when.notFlag && state.flags[when.notFlag]) return false;
    if (when.event && !HM.events.done(state, when.event)) return false;
    if (when.fund && !(state.funds || []).length) return false;
    return true;
  }

  // Pick an everyday line: the first that fits and that you haven't heard for two days
  function pickChat(state, who, resident) {
    const heard = state.flags.heard || (state.flags.heard = {});
    const fitting = HM.TALKS[who].chats.filter(c => chatFits(c.when, state, who, resident));
    if (!fitting.length) return HM.TALKS[who].again;
    const fresh = fitting.find(c => !(heard[c.key] >= state.day - 2));
    const pick = fresh || fitting.slice().sort((a, b) => (heard[a.key] || 0) - (heard[b.key] || 0))[0];
    heard[pick.key] = state.day;
    return pick.key;
  }

  // ----- Requests (js/talks.js, HM.REQUESTS) -----
  // Each household has two requests, one after the other (Gen-san's and Midori's first ones are above).
  const requestOf = (state, id) => state.requests[id];
  const householdOf = id => HM.REQUESTS[id].friend || id;
  // "Bring" tasks are done when you have the things with you
  const has = (state, items) => Object.entries(items).every(([item, n]) => (state.bag[item] || 0) >= n);
  const taskDone = (state, req, task, i) => req.tasks[i] || (task.bring && has(state, task.bring));

  // The request this person can ask now, or the one they asked: its id, or null
  function currentRequest(state, who) {
    const friend = R().friendOf(who);
    const ids = Object.keys(HM.REQUESTS).filter(id => householdOf(id) === friend);
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i], def = HM.REQUESTS[id], req = requestOf(state, id);
      if (req && req.status === 'done') continue;
      if (def.giver !== who) return null;
      if (req) return id;
      // Not asked yet: after the one before (on an earlier day), with enough hearts
      const prev = ids[i - 1] && requestOf(state, ids[i - 1]);
      const ready = def.after ? def.after(state)
        : prev ? prev.status === 'done' && !(prev.day >= state.day)
          : ((state.flags.met || {})[who] || state.day) < state.day;
      return ready && R().heartsWith(state, friend) >= (def.hearts || 0) ? id : null;
    }
    return null;
  }

  // Asking, reminding and thanking: steps, or null
  function requestTalk(game, who, first) {
    const state = game.state;
    const id = currentRequest(state, who);
    if (!id) return null;
    const def = HM.REQUESTS[id], req = requestOf(state, id);
    if (!req) return def.ask.map(k => say(who, k)).concat([run(g => { g.state.requests[id] = { status: 'asked', tasks: def.tasks.map(() => false) }; })]);
    if (def.tasks.every((task, i) => taskDone(state, req, task, i))) {
      return def.done.map(k => say(who, k)).concat([run(g => {
        def.tasks.forEach(task => Object.entries(task.bring || {}).forEach(([item, n]) => R().takeItem(g.state, item, n)));
      })], rewardSteps(def.reward), [run(g => {
        Object.assign(g.state.requests[id], { status: 'done', day: g.state.day });
        R().addPoints(g.state, householdOf(id), HM.DATA.points.request);
      })]);
    }
    return first ? [say(who, def.remind)] : null;
  }

  // Rewards: items and money, as lines
  function rewardSteps(reward) {
    const steps = [run(g => {
      Object.entries(reward.items || {}).forEach(([item, n]) => R().addItem(g.state, item, n));
      if (reward.money) g.state.money += reward.money;
    })];
    Object.entries(reward.items || {}).forEach(([item, n]) => steps.push(received(item, n)));
    if (reward.money) steps.push(narrate('got.money', { money: reward.money.toLocaleString('en') }));
    return steps;
  }

  // A task of an active request that this thing or person completes (or null)
  function openTask(state, match) {
    for (const [id, def] of Object.entries(HM.REQUESTS)) {
      const req = requestOf(state, id);
      if (!req || req.status !== 'asked') continue;
      const i = def.tasks.findIndex((task, n) => !req.tasks[n] && !task.bring && match(task));
      if (i >= 0) return { friend: householdOf(id), req, task: def.tasks[i], index: i };
    }
    return null;
  }

  function doTask(found, who) {
    return found.task.say.map(k => (who ? say(who, k) : narrate(k)))
      .concat([run(g => { found.req.tasks[found.index] = true; g.passTime(10); })]);
  }

  function talkOthers(game, who, first, resident) {
    const state = game.state, flags = state.flags;
    const friend = R().friendOf(who);
    const met = flags.met || (flags.met = {});
    if (!met[who]) {
      met[who] = state.day;
      return HM.TALKS[who].meet.map(k => say(who, k));
    }
    // A plot owner who now trusts you enough
    const allow = permission(state, who);
    if (allow) return allow;
    // Someone else's request that needs this person (for example Mr. Oda's stamp for Ms. Sato)
    const task = openTask(state, t => t.talk === who);
    if (task) return doTask(task, who);
    const request = requestTalk(game, who, first);
    if (request) return request;
    if (!first) return [say(who, HM.TALKS[who].again)];
    // A heart event that can't happen here: a hint about it now and then (js/events.js)
    const hint = HM.events.hint(state, who);
    return [say(who, hint || pickChat(state, who, resident))];
  }

  // ----- The village's decisions (Milestone 2.4; the rules are in js/community.js) -----
  const plotName = id => ({ key: 'plot.' + id });
  const money = n => Math.round(n).toLocaleString('en');
  const metAlready = (state, who) => (who === 'gen' ? !!state.flags.metGen
    : who === 'midori' ? !!state.flags.diary : !!(state.flags.met && state.flags.met[who]));

  // "Gen-san, Hiro and Kuma-san" (js/ui.js)
  const names = list => HM.ui.names(list);

  // Mr. Kurokawa's two offers (spring day 3, design.md section 10.3)
  function kurokawaOffer(state) {
    const k = HM.DATA.kurokawa;
    const sure = (key, deal, done) => [say('kurokawa', key, { money: money(k.lease), share: Math.round(k.share * 100) }), {
      choice: [
        { key: 'kuro.yes', then: [run(g => { C().kurokawaDeal(g.state, deal); })].concat(done) },
        { key: 'kuro.wait', then: [run(g => { g.state.flags.kuro = 'later'; }), say('kurokawa', 'kuro.later')] }
      ]
    }];
    return [say('kurokawa', 'kuro.offer.1'), say('kurokawa', 'kuro.offer.2'), {
      choice: [
        { key: 'kuro.offer.lease', vars: { money: money(k.lease) },
          then: sure('kuro.lease.sure', 'lease', [say('kurokawa', 'kuro.lease.done'), narrate('kuro.lease.narr')]) },
        { key: 'kuro.offer.partner',
          then: sure('kuro.partner.sure', 'partner', [say('kurokawa', 'kuro.partner.done'), narrate('kuro.partner.narr')]) },
        { key: 'kuro.offer.think', then: [run(g => { g.state.flags.kuro = 'later'; }), say('kurokawa', 'kuro.later')] },
        { key: 'kuro.offer.no', then: [run(g => { C().kurokawaDeal(g.state, 'no'); }), say('kurokawa', 'kuro.no.1'), say('kurokawa', 'kuro.no.2')] }
      ]
    }];
  }
  const offerOpen = state => HM.festivals.storyYear(state) && !C().slopeBuilt(state) && !state.flags.slopeSaved &&
    state.day < HM.DATA.kurokawa.parkDay;

  // Ask for a town meeting (Mr. Oda or the notice board) for a plan that waits
  function meetingChoice(state, who) {
    const pending = C().pendingPlots(state);
    const done = id => (who === 'oda'
      ? [say('oda', 'meeting.ask.done', { plot: plotName(id) })].concat(state.flags.nemawashi ? [say('oda', 'meeting.ask.nemawashi')] : [])
      : [narrate('meeting.board.done', { plot: plotName(id) })]);
    return {
      choice: pending.map(id => ({
        key: 'meeting.ask.plot', vars: { plot: plotName(id) },
        then: [run(g => { C().scheduleMeeting(g.state, id); })].concat(done(id))
      })).concat([{ key: 'meeting.ask.notYet', then: who === 'oda' ? [say('oda', 'meeting.ask.later')] : [] }])
    };
  }

  // Conversations about the village's decisions. Returns steps, or null for an everyday chat.
  function villageTalk(game, who, first) {
    const state = game.state, flags = state.flags;
    const friend = R().friendOf(who);
    if (who === 'kurokawa') {
      if (flags.slopeSaved && !flags.kuroGrumbled) { flags.kuroGrumbled = true; return [say('kurokawa', 'kuro.grumble')]; }
      if (first && flags.kuro === 'later' && offerOpen(state)) return [say('kurokawa', 'kuro.again')].concat(kurokawaOffer(state));
      if (first && C().canRestore(state)) {
        return [say('kurokawa', 'slope.restore.1'), say('kurokawa', 'slope.restore.2'), {
          choice: [
            { key: 'slope.restore.yes', then: [run(g => { C().restoreSlope(g.state); }), narrate('slope.restore.done')] },
            { key: 'slope.restore.later', then: [say('kurokawa', 'slope.restore.wait')] }
          ]
        }];
      }
      const offer = first && C().buyOffer(state);
      if (offer) {
        return [say('kurokawa', 'kuro.buy.1', { plot: plotName(offer.plot) }), say('kurokawa', 'kuro.buy.2', { money: money(offer.price) }), {
          choice: [
            { key: 'kuro.buy.sell', then: [run(g => { C().sellGarden(g.state, offer.plot); }), say('kurokawa', 'kuro.buy.done'), narrate('kuro.buy.narr', { plot: plotName(offer.plot) })] },
            { key: 'kuro.buy.keep', then: [run(g => { g.state.flags.kuroBuyAsked = true; }), say('kurokawa', 'kuro.buy.no')] }
          ]
        }];
      }
    }
    if (who === 'oda') {
      // He can write to the slope's owner in Tokyo
      if (C().canAskOda(state) && flags.odaSlopeDay !== state.day) {
        flags.odaSlopeDay = state.day;
        return [say('oda', 'slope.oda.1'), say('oda', 'slope.oda.2'), {
          choice: [
            { key: 'slope.oda.yes', then: [run(g => { g.state.flags.slopeSaved = true; }), say('oda', 'slope.oda.done'), narrate('slope.oda.narr')] },
            { key: 'slope.oda.no', then: [say('oda', 'slope.oda.later')] }
          ]
        }];
      }
      if (!state.meeting && C().pendingPlots(state).length && flags.odaMeetingDay !== state.day) {
        flags.odaMeetingDay = state.day;
        return [say('oda', 'meeting.ask.oda'), meetingChoice(state, 'oda')];
      }
    }
    // From 4 hearts, Midori offers a nature survey of your gardens (once a day, each garden once a season)
    if (who === 'midori' && flags.surveyDay !== state.day) {
      const survey = HM.festivals.surveySteps(state);
      if (survey) { flags.surveyDay = state.day; return survey; }
    }
    // After the mudflow, Ms. Sato tells you about the new ordinance and the clean-up
    if (who === 'sato' && flags.mudflow && !flags.satoMud) {
      flags.satoMud = true;
      return [say('sato', 'slope.sato.1'), say('sato', 'slope.sato.2')];
    }
    // Nemawashi: tell residents about your plan before the meeting, and hear their worry
    if (who !== 'sora') {
      const id = C().nemawashiPlot(state, friend);
      if (id) {
        const ok = C().worryOk(state, id, friend);
        return [narrate('nema.tell', { who: { key: 'who.' + who }, plot: plotName(id) }),
          say(who, `worry.${friend}.${ok ? 'nemaOk' : 'nemaNo'}`), run(g => { C().tell(g.state, id, friend); })];
      }
    }
    return null;
  }

  // Talking to a resident: their words, then the gift choice
  function talk(game, who, resident) {
    const state = game.state;
    const first = R().talk(state, who);
    let steps = null;
    // At a festival, everyone has something to say about it (js/festivals.js)
    if (metAlready(state, who) && HM.festivals.atFestival(resident)) steps = HM.festivals.talk(game, who, resident);
    // A heart event (js/events.js), a plot owner who says yes, or the village's decisions
    else if (metAlready(state, who)) steps = HM.events.talk(game, who, resident) || permission(state, who) || villageTalk(game, who, first);
    else if (who === 'kurokawa') {
      // Meeting Mr. Kurokawa: his card, then his offers
      (state.flags.met = state.flags.met || {}).kurokawa = state.day;
      state.flags.kuroMet = true;
      steps = HM.TALKS.kurokawa.meet.map(k => say('kurokawa', k)).concat(offerOpen(state) ? kurokawaOffer(state) : []);
    }
    if (!steps) {
      steps = who === 'gen' ? talkGen(game, first, resident)
        : who === 'midori' ? talkMidori(game, first, resident)
          : talkOthers(game, who, first, resident);
    }
    return steps.concat([run(g => giftChoice(g, who))]);
  }

  // The forest slope's sign
  function slopeSign(game) {
    const state = game.state, plot = state.plots.slope;
    if (C().canCleanUp(state)) {
      return [narrate('slope.sign.mud'), {
        choice: [
          { key: 'slope.cleanUp.go', then: [run(g => {
            const check = C().checkCleanUp(g.state);
            if (!check.ok) return [narrate('build.p.' + check.problems[0])];
            C().cleanUp(g.state);
            HM.world.settle(g.state);
            return [narrate('slope.cleanUp.start', { names: names(check.helpers) }), narrate('workday.lunch')]
              .concat(R().heartsWith(g.state, 'kurokawa') >= 2 ? [say('kurokawa', 'slope.cleanUp.kurokawa')] : [])
              .concat([narrate('slope.cleanUp.done')]);
          })] },
          { key: 'slope.cleanUp.later', then: [] }
        ]
      }];
    }
    if (state.flags.slopeRestored) return [narrate('slope.sign.restored')];
    if (plot.owner === 'partner') return { build: 'slope' };
    if (plot.owner === 'quick') return [narrate('slope.sign.quick')];
    if (state.flags.slopeSaved) return [narrate('slope.sign.saved')];
    return [narrate(state.flags.kuroMet ? 'slope.sign.offer' : 'slope.sign.forest')];
  }

  // ----- Things you can use -----
  // Returns dialogue steps, or { build: true } for the field sign.
  function useObject(game, id) {
    const state = game.state, flags = state.flags;
    const obj = HM.MAP.objects.find(o => o.id === id) || {};
    // A request's task?
    const task = openTask(state, t => t.object === id);
    if (task) {
      const h = hour(state);
      if (task.task.hours && !(h >= task.task.hours[0] && h < task.task.hours[1])) return [narrate(task.task.notNow)];
      return doTask(task);
    }
    if (obj.request) return [];
    // A heart event behind a door (Fumiko-san's dinner)
    const inside = HM.events.door(game, id);
    if (inside) return inside;
    if (id === 'signSlope') return slopeSign(game);
    if (id === 'donationBox') return HM.festivals.donationBox(game);
    if (id === 'hallDoor' && C().meetingToday(state)) return [narrate('meeting.hallDoor', { plot: plotName(state.meeting.plot) })];
    // Something to pick?
    if (obj.forage) {
      const def = HM.DATA.forage[obj.forage];
      const picked = flags.picked || (flags.picked = {});
      if (!def.seasons.includes(R().seasonOf(state.day))) return [narrate(`obj.${obj.forage}.season`)];
      if (picked[id] === state.day) return [narrate(`obj.${obj.forage}.none`)];
      return [
        narrate(`obj.${obj.forage}.pick`),
        run(g => { picked[id] = g.state.day; R().addItem(g.state, def.item, 1); g.passTime(5); }),
        received(def.item, 1)
      ];
    }
    // A door with someone inside: they come to the door
    if (obj.spots) {
      const r = HM.world.residents.find(r => obj.spots.includes(r.spot) && !r.visible && r.arrived);
      if (r) return { talkTo: r };
    }
    // A plot's sign: build mode if the owner has said yes
    if (obj.plot && obj.plot !== 'home') {
      return state.plots[obj.plot].open ? { build: obj.plot } : [narrate('plot.closed.' + obj.plot)];
    }
    switch (id) {
      case 'shopDoor':
        if (R().shopOpen(state)) return { shop: true };
        return [narrate(R().dayInSeason(state.day) === HM.DATA.shop.closedDay ? 'shop.closedDay' : 'shop.closed')];
      case 'homeDoor': {
        // An evening in the community hall (the welcome party, the typhoon shelter): go first?
        const hall = HM.festivals.hallFestival(state);
        if (hall && !HM.festivals.joined(state, hall) && hour(state) < HM.DATA.festivals[hall].hall) {
          return [narrate('obj.bed.' + hall), { choice: [
            { key: 'obj.bed.toHall', then: [run(g => { g.state.minutes = HM.DATA.festivals[hall].hall * 60; })] },
            { key: 'obj.bed.yes', then: [run(g => { g.requestEndDay(); })] },
            { key: 'obj.bed.no', then: [] }
          ] }];
        }
        // The winter solstice: a yuzu bath before bed
        const sleep = state.day === HM.DATA.solsticeDay ? [narrate('fest.solstice'), run(g => { g.requestEndDay(); })] : [run(g => { g.requestEndDay(); })];
        // The town meeting is tonight: go first, or sleep and move it to tomorrow
        if (C().meetingToday(state) && hour(state) < HM.DATA.meeting.hour) {
          return [narrate('obj.bed.meeting'), { choice: [
            { key: 'obj.bed.toMeeting', then: [run(g => { g.state.minutes = HM.DATA.meeting.hour * 60; })] },
            { key: 'obj.bed.yes', then: sleep },
            { key: 'obj.bed.no', then: [] }
          ] }];
        }
        return [
          narrate(hour(state) < 17 ? 'obj.bed.early' : 'obj.bed.ask'),
          { choice: [
            { key: 'obj.bed.yes', then: sleep },
            { key: 'obj.bed.no', then: [] }
          ] }
        ];
      }
      case 'genDoor': {
        const gen = HM.world.residents.find(r => r.who === 'gen');
        return [narrate(gen && gen.spot === 'inside' ? 'obj.genDoor.home' : 'obj.genDoor.out')];
      }
      case 'letterbox': {
        // Mr. Oda's welcome letter the first time, then any letters that have arrived
        const lines = flags.letter1 ? [] : ['letter.welcome.1', 'letter.welcome.2', 'letter.welcome.3', 'letter.welcome.4', 'letter.welcome.5'];
        flags.letter1 = true;
        (state.letters || []).forEach(name => lines.push(...C().letterLines(name)));
        state.letters = [];
        return lines.length ? lines.map(k => say('letter', k)) : [narrate('obj.letterbox.empty')];
      }
      case 'fieldSign':
        return state.plots.home.owner === 'quick' ? [narrate('plot.leased')] : { build: 'home' };
      case 'noticeBoard': {
        // The notice board: the next town meeting, or put up a notice for one
        const m = state.meeting;
        if (m) return [narrate('meeting.notice', { plot: plotName(m.plot), season: { key: 'season.' + R().seasonOf(m.day) }, day: R().dayInSeason(m.day) })];
        if (C().pendingPlots(state).length) return [narrate('obj.noticeBoard'), narrate('meeting.board.ask'), meetingChoice(state, 'board')];
        return [narrate('obj.noticeBoard')];
      }
      case 'exitSign':
      case 'postBox':
      case 'busStop':
      case 'bench':
      case 'hidamariTree':
        return [narrate('obj.' + id)];
      case 'leaves':
        if (flags.genRequest !== 'asked') return [narrate('obj.leaves.look')];
        return [narrate('obj.leaves.clear'), run(g => { g.state.flags.leavesCleared = true; g.passTime(15); })];
    }
    // Other doors: a short description of the building
    if (/Door$/.test(id)) return [narrate('obj.door.' + id.replace(/Door$/, ''))];
    return [];
  }

  // The label of the action button for each thing
  function actionLabel(target, state) {
    if (!target) return null;
    if (target.type === 'talk') return 'action.talk';
    if (target.type === 'look') return 'action.look';
    if (target.type === 'farm') {
      if (state.plots.home.owner === 'quick') return 'action.check';
      const crop = R().cropAt(state, target.i);
      return crop && R().isGrown(crop) ? 'action.harvest' : crop ? 'action.check' : 'action.sow';
    }
    if (target.id === 'signSlope') return state.plots.slope.open ? 'action.build' : C().canCleanUp(state) ? 'action.clear' : 'action.read';
    if (/^sign/.test(target.id)) return 'action.build';
    const obj = HM.MAP.objects.find(o => o.id === target.id) || {};
    if (obj.forage) return 'action.pick';
    if (target.id === 'sunriseView') return 'action.photo';
    if (target.id === 'waterGauge') return 'action.read';
    if (target.id === 'shopDoor' && R().shopOpen(state)) return 'action.shop';
    if (obj.request) return 'action.check';
    return {
      homeDoor: 'action.sleep', genDoor: 'action.knock', letterbox: 'action.read', fieldSign: 'action.build', donationBox: 'action.give',
      exitSign: 'action.read', noticeBoard: 'action.read', busStop: 'action.read', postBox: 'action.check',
      bench: 'action.sit', hidamariTree: 'action.check', shrineDoor: 'action.pray',
      leaves: state.flags.genRequest === 'asked' ? 'action.clear' : 'action.check'
    }[target.id] || (/Door$/.test(target.id) ? 'action.knock' : 'action.check');
  }

  // ----- Fixed scenes -----
  const intro = () => [narrate('intro.1'), narrate('intro.2'), narrate('intro.3')];

  function morning(state) {
    const weather = R().weatherOf(state.day);
    const steps = [say('announce', 'announce.chime'), say('announce', 'announce.hello')];
    if (state.day > 1 && R().dayInSeason(state.day) === 1) steps.push(say('announce', 'announce.season.' + R().seasonOf(state.day)));
    // In the free year, some everyday news have a second-year version (Milestone 3.2)
    const news = HM.festivals.storyYear(state) ? 'announce.news.' + state.day
      : state.day === 1 ? 'announce.news.freeYear'
        : HM.DATA.freeYearNews.includes(state.day) ? `announce.news.${state.day}.y2` : 'announce.news.' + state.day;
    steps.push(say('announce', 'announce.weather.' + weather), say('announce', news));
    // Today's festival (design.md section 11)
    const fest = HM.DATA.festivalOrder.find(id => HM.DATA.festivals[id].day === state.day && id !== 'shelter');
    if (fest) steps.push(say('announce', 'announce.fest.' + fest));
    // The village's news (Milestone 2.4)
    const slope = state.plots.slope;
    if (slope.builtDay === state.day) steps.push(say('announce', 'announce.slope.' + slope.owner));
    if (state.flags.mudflow && state.flags.mudflow.day === state.day - 1) steps.push(say('announce', 'announce.mudflow'), say('announce', 'announce.ordinance'));
    if (C().meetingToday(state)) steps.push(say('announce', 'announce.meeting', { plot: plotName(state.meeting.plot) }));
    if (C().zoningToday(state)) steps.push(say('announce', 'announce.zoning'));
    steps.push(say('announce', 'announce.end'));
    // New Year's day: the first sunrise of the year
    if (state.day === HM.DATA.sunriseDay) {
      steps.push(narrate('fest.sunrise.1'));
      if (Object.values(state.plots).some(p => !p.owner && p.tiles.some(t => t && HM.DATA.buildTiles[t].panel))) steps.push(narrate('fest.sunrise.panels'));
    }
    return steps;
  }

  // Should a thing sparkle? (things to pick in season, things a request needs)
  function sparkles(state, obj) {
    if (HM.events.doorWaiting(state, obj.id)) return true;
    if (obj.id === 'letterbox') return !state.flags.letter1 || (state.letters || []).length > 0;
    if (obj.forage) {
      const def = HM.DATA.forage[obj.forage];
      return def.seasons.includes(R().seasonOf(state.day)) && !((state.flags.picked || {})[obj.id] === state.day);
    }
    if (obj.request && !obj.noSparkle) return !!openTask(state, t => t.object === obj.id);
    return false;
  }

  // Can a thing be used now? (things for requests only while the request needs them)
  const available = (state, obj) => !obj.request || !!openTask(state, t => t.object === obj.id);

  HM.story = { talk, useObject, actionLabel, intro, morning, sparkles, available, farm };
})(globalThis);
