// Hidamari: what people say and what happens when you use things (Phase 1 test).
//
// Conversations are lists of steps for js/dialogue.js. The words themselves are in the
// language files: here are only their text codes (for example 'gen.meet.1').

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const R = () => HM.rules;

  const say = (who, key, vars) => ({ say: key, who, vars });
  const narrate = (key, vars) => ({ say: key, who: 'narrator', vars });
  const run = fn => ({ run: fn });

  const hour = state => state.minutes / 60;
  const fieldHas = (state, type) => state.field.includes(type);
  const count = (state, type) => state.field.filter(t => t === type).length;

  // An item you received, as a line
  const received = (item, n) => narrate('got.item', { item: { key: 'item.' + item }, n });

  // ----- Heart events: is one waiting? (a small sun shows over the resident) -----
  // (Only Gen-san and Midori have heart events so far; the others come in Phase 3.)
  function eventWaiting(state, who, spot) {
    if (who !== 'gen' && who !== 'midori') return false;
    if (R().heartsOf(state.friends[who].points) < 1) return false;
    if (who === 'gen') return !state.flags.genEvent1 && spot === 'genPaddy' && hour(state) < 11;
    if (who === 'midori') return !state.flags.midoriEvent1 && state.flags.diary && spot === 'pondShore' && hour(state) < 9;
    return false;
  }

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
    if (eventWaiting(state, 'gen', resident.spot)) {
      return [
        say('gen', 'gen.ev1.1'), narrate('gen.ev1.2'), say('gen', 'gen.ev1.3'), say('gen', 'gen.ev1.4'), say('gen', 'gen.ev1.5'),
        { choice: [
          { key: 'gen.ev1.c1', then: [say('gen', 'gen.ev1.r1')] },
          { key: 'gen.ev1.c2', then: [say('gen', 'gen.ev1.r2')] }
        ] },
        run(g => { g.state.flags.genEvent1 = true; R().addPoints(g.state, 'gen', HM.DATA.points.event); })
      ];
    }
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
    if (!first) return [say('gen', 'gen.chat.again')];
    let key;
    if (R().weatherOf(state.day) === 'rain') key = 'gen.chat.rain';
    else if (fieldHas(state, 'spaced') && !flags.genSawSpaced) { key = 'gen.chat.spaced'; flags.genSawSpaced = true; }
    else if (fieldHas(state, 'hedge') && !flags.genSawHedge) { key = 'gen.chat.hedge'; flags.genSawHedge = true; }
    else if (fieldHas(state, 'dense') && !flags.genSawDense) { key = 'gen.chat.panels'; flags.genSawDense = true; }
    else if (flags.genRequest === 'asked') key = 'gen.chat.reminder';
    else if (hour(state) < 11) key = 'gen.chat.morning';
    else if (hour(state) < 14) key = 'gen.chat.noon';
    else if (hour(state) < 17) key = 'gen.chat.afternoon';
    else key = 'gen.chat.evening';
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
    if (eventWaiting(state, 'midori', resident.spot)) {
      return [
        say('midori', 'midori.ev1.1'), narrate('midori.ev1.2'), say('midori', 'midori.ev1.3'),
        say('midori', 'midori.ev1.4'), say('midori', 'midori.ev1.5'),
        { choice: [
          { key: 'midori.ev1.c1', then: [say('midori', 'midori.ev1.r1')] },
          { key: 'midori.ev1.c2', then: [say('midori', 'midori.ev1.r2')] }
        ] },
        run(g => { g.state.flags.midoriEvent1 = true; R().addPoints(g.state, 'midori', HM.DATA.points.event); })
      ];
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
    if (!first) return [say('midori', 'midori.chat.again')];
    const species = Object.keys(state.diary).length;
    let key, vars;
    if (R().weatherOf(state.day) === 'rain') key = 'midori.chat.rain';
    else if (fieldHas(state, 'meadow') && !flags.midoriSawMeadow) { key = 'midori.chat.meadowBuilt'; flags.midoriSawMeadow = true; }
    else if (fieldHas(state, 'hedge') && !flags.midoriSawHedge) { key = 'midori.chat.hedgeBuilt'; flags.midoriSawHedge = true; }
    else if (count(state, 'dense') >= 2 && !fieldHas(state, 'meadow') && !fieldHas(state, 'hedge') && !flags.midoriSawDense) {
      key = 'midori.chat.dense'; flags.midoriSawDense = true;
    } else if (species >= 2 && flags.midoriCounted !== species) { key = 'midori.chat.diaryCount'; vars = { n: species }; flags.midoriCounted = species; }
    else if (resident.spot === 'pondShore') key = 'midori.chat.pond';
    else if (resident.spot === 'terraces') key = 'midori.chat.terraces';
    else key = 'midori.chat.stream';
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
  const requestOf = (state, friend) => state.requests[friend];

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
    for (const [friend, def] of Object.entries(HM.REQUESTS)) {
      const req = requestOf(state, friend);
      if (!req || req.status !== 'asked') continue;
      const i = def.tasks.findIndex((task, n) => !req.tasks[n] && match(task));
      if (i >= 0) return { friend, req, task: def.tasks[i], index: i };
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
    // Someone else's request that needs this person (for example Mr. Oda's stamp for Ms. Sato)
    const task = openTask(state, t => t.talk === who);
    if (task) return doTask(task, who);
    const def = HM.REQUESTS[friend];
    if (def && def.giver === who) {
      const req = requestOf(state, friend);
      if (!req && met[who] < state.day) {
        return def.ask.map(k => say(who, k)).concat([run(g => { g.state.requests[friend] = { status: 'asked', tasks: def.tasks.map(() => false) }; })]);
      }
      if (req && req.status === 'asked') {
        if (req.tasks.every(Boolean)) {
          return def.done.map(k => say(who, k)).concat(rewardSteps(def.reward), [run(g => {
            g.state.requests[friend].status = 'done';
            R().addPoints(g.state, friend, HM.DATA.points.request);
          })]);
        }
        if (first) return [say(who, def.remind)];
      }
    }
    if (!first) return [say(who, HM.TALKS[who].again)];
    return [say(who, pickChat(state, who, resident))];
  }

  // Talking to a resident: their words, then the gift choice
  function talk(game, who, resident) {
    const first = R().talk(game.state, who);
    const steps = who === 'gen' ? talkGen(game, first, resident)
      : who === 'midori' ? talkMidori(game, first, resident)
        : talkOthers(game, who, first, resident);
    return steps.concat([run(g => giftChoice(g, who))]);
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
    switch (id) {
      case 'shopDoor':
        if (R().shopOpen(state)) return { shop: true };
        return [narrate(R().dayInSeason(state.day) === HM.DATA.shop.closedDay ? 'shop.closedDay' : 'shop.closed')];
      case 'homeDoor':
        return [
          narrate(hour(state) < 17 ? 'obj.bed.early' : 'obj.bed.ask'),
          { choice: [
            { key: 'obj.bed.yes', then: [run(g => { g.requestEndDay(); })] },
            { key: 'obj.bed.no', then: [] }
          ] }
        ];
      case 'genDoor': {
        const gen = HM.world.residents.find(r => r.who === 'gen');
        return [narrate(gen && gen.spot === 'inside' ? 'obj.genDoor.home' : 'obj.genDoor.out')];
      }
      case 'letterbox':
        if (!flags.letter1) {
          flags.letter1 = true;
          return ['letter.welcome.1', 'letter.welcome.2', 'letter.welcome.3', 'letter.welcome.4', 'letter.welcome.5']
            .map(k => say('letter', k));
        }
        return [narrate('obj.letterbox.empty')];
      case 'fieldSign':
        return { build: true };
      case 'exitSign':
      case 'noticeBoard':
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
    const obj = HM.MAP.objects.find(o => o.id === target.id) || {};
    if (obj.forage) return 'action.pick';
    if (target.id === 'sunriseView') return 'action.photo';
    if (target.id === 'shopDoor' && R().shopOpen(state)) return 'action.shop';
    if (obj.request) return 'action.check';
    return {
      homeDoor: 'action.sleep', genDoor: 'action.knock', letterbox: 'action.read', fieldSign: 'action.build',
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
    steps.push(say('announce', 'announce.weather.' + weather), say('announce', 'announce.news.' + state.day), say('announce', 'announce.end'));
    return steps;
  }

  // Should a thing sparkle? (things to pick in season, things a request needs)
  function sparkles(state, obj) {
    if (obj.forage) {
      const def = HM.DATA.forage[obj.forage];
      return def.seasons.includes(R().seasonOf(state.day)) && !((state.flags.picked || {})[obj.id] === state.day);
    }
    if (obj.request && !obj.noSparkle) return !!openTask(state, t => t.object === obj.id);
    return false;
  }

  // Can a thing be used now? (things for requests only while the request needs them)
  const available = (state, obj) => !obj.request || !!openTask(state, t => t.object === obj.id);

  HM.story = { talk, useObject, actionLabel, eventWaiting, intro, morning, sparkles, available };
})(globalThis);
