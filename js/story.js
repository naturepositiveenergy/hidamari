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
  function eventWaiting(state, who, spot) {
    const f = state.friends[who];
    if (R().heartsOf(f.points) < 1) return false;
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
        { choice: [
          { key: 'midori.req.c1', then: [answer(1)] },
          { key: 'midori.req.c2', then: [answer(2)] },
          { key: 'midori.req.c3', then: [answer(3)] },
          { key: 'midori.req.c0', then: [say('midori', 'midori.req.later')] }
        ] }
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
    else if (resident.spot === 'bridge') key = 'midori.chat.bridge';
    else key = 'midori.chat.meadow';
    return [say('midori', key, vars)];
  }

  // Talking to a resident: their words, then the gift choice
  function talk(game, who, resident) {
    const first = R().talk(game.state, who);
    const steps = who === 'gen' ? talkGen(game, first, resident) : talkMidori(game, first, resident);
    return steps.concat([run(g => giftChoice(g, who))]);
  }

  // ----- Things you can use -----
  // Returns dialogue steps, or { build: true } for the field sign.
  function useObject(game, id) {
    const state = game.state, flags = state.flags;
    switch (id) {
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
        return [narrate('obj.exit')];
      case 'leaves':
        if (flags.genRequest !== 'asked') return [narrate('obj.leaves.look')];
        return [narrate('obj.leaves.clear'), run(g => { g.state.flags.leavesCleared = true; g.passTime(15); })];
      case 'berries1':
      case 'berries2': {
        const picked = flags.picked || (flags.picked = {});
        if (picked[id] === state.day) return [narrate('obj.berries.none')];
        return [
          narrate('obj.berries.pick'),
          run(g => { picked[id] = g.state.day; R().addItem(g.state, 'strawberry', 1); g.passTime(5); }),
          received('strawberry', 1)
        ];
      }
    }
    return [];
  }

  // The label of the action button for each thing
  function actionLabel(target, state) {
    if (!target) return null;
    if (target.type === 'talk') return 'action.talk';
    if (target.type === 'look') return 'action.look';
    return {
      homeDoor: 'action.sleep', genDoor: 'action.knock', letterbox: 'action.read', fieldSign: 'action.build',
      exitSign: 'action.read', leaves: state.flags.genRequest === 'asked' ? 'action.clear' : 'action.check',
      berries1: 'action.pick', berries2: 'action.pick'
    }[target.id] || 'action.check';
  }

  // ----- Fixed scenes -----
  const intro = () => [narrate('intro.1'), narrate('intro.2'), narrate('intro.3')];

  function morning(state) {
    const weather = R().weatherOf(state.day);
    return [
      say('announce', 'announce.chime'), say('announce', 'announce.hello'),
      say('announce', 'announce.weather.' + weather),
      say('announce', 'announce.news.' + state.day), say('announce', 'announce.end')
    ];
  }

  HM.story = { talk, useObject, actionLabel, eventWaiting, intro, morning };
})(globalThis);
