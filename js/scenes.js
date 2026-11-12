// Hidamari: scenes in the community hall (Milestone 2.4): the town meeting (住民説明会), the
// promotion zone workshop and the year's-end gathering.
//
// A scene is the hall room drawn on the canvas (js/render.js) with the residents in it, together
// with a conversation (js/dialogue.js). The person speaking stands up. The rules (worries, the room's
// warmth, votes) are in js/community.js; the words are in the language files.

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const C = () => HM.community;
  const R = () => HM.rules;
  const el = id => document.getElementById(id);

  const say = (who, key, vars) => ({ say: key, who, vars });
  const narrate = (key, vars) => ({ say: key, who: 'narrator', vars });
  const run = fn => ({ run: fn });
  const plotName = id => ({ key: 'plot.' + id });
  // "A, B and C"
  const list = texts => (texts.length < 2 ? texts.join('')
    : texts.slice(0, -1).join(t('summary.listJoin')) + t('summary.listLast') + texts[texts.length - 1]);

  let scene = null;

  // ----- Who sits or stands where (x, y in tiles of the hall room) -----
  // Seated people have a long table in front of them. The audience faces you (down).
  const MEETING = {
    people: [
      ['gen', 1, 2.2], ['fumiko', 3, 2.2], ['kuma', 5, 2.2], ['hiro', 7, 2.2], ['midori', 9, 2.2],
      ['rin', 1.2, 4], ['aya', 3.4, 4], ['sora', 4.5, 4], ['ken', 5.6, 4], ['sato', 8.4, 4]
    ],
    tables: [[0.5, 9.5, 2.2], [0.5, 9.5, 4]],
    oda: [1.6, 5.9, 'right'],
    player: [5, 6.1, 'up'],
    kurokawa: [9.8, 0.7, 'down']
  };
  // The zoning workshop: everyone stands around a big map of the village on the table
  const ZONING = {
    people: [
      ['gen', 2.2, 0.4, 'down'], ['fumiko', 3.6, 0.4, 'down'], ['kuma', 5, 0.4, 'down'], ['hiro', 6.4, 0.4, 'down'],
      ['midori', 7.8, 0.4, 'down'], ['rin', 0.8, 2.6, 'right'], ['sato', 9.3, 2.6, 'left'],
      ['aya', 2.2, 5.5, 'up'], ['sora', 3.2, 5.5, 'up'], ['ken', 4.2, 5.5, 'up'], ['oda', 8, 5.5, 'up']
    ],
    player: [6, 5.6, 'up'],
    map: { x: 48, y: 26 }          // where the map lies on the table (pixels in the room)
  };

  function layout(kind, state) {
    const people = [];
    if (kind === 'zoning') {
      ZONING.people.forEach(([who, x, y, dir]) => people.push({ who, x, y, dir, seated: false }));
      people.push({ who: 'player', x: ZONING.player[0], y: ZONING.player[1], dir: ZONING.player[2] });
      return { kind, people, tables: [], warmth: null, votes: null, map: ZONING.map };
    }
    MEETING.people.forEach(([who, x, y]) => people.push({ who, x, y, dir: 'down', seated: true }));
    people.push({ who: 'oda', x: MEETING.oda[0], y: MEETING.oda[1], dir: MEETING.oda[2] });
    people.push({ who: 'player', x: MEETING.player[0], y: MEETING.player[1], dir: MEETING.player[2] });
    // Mr. Kurokawa listens from the back of the room once you have met him
    if (state.flags.kuroMet) people.push({ who: 'kurokawa', x: MEETING.kurokawa[0], y: MEETING.kurokawa[1], dir: MEETING.kurokawa[2] });
    return { kind, people, tables: MEETING.tables, warmth: null, votes: null, map: null };
  }

  // ----- The line under the top bar: the room's warmth, or what the stickers mean -----
  function showInfo() {
    const box = el('sceneInfo');
    if (!box) return;
    let text = '';
    if (scene && scene.warmth !== null) {
      const max = HM.DATA.meeting.max;
      text = t('meeting.warmth', { suns: '☀'.repeat(scene.warmth) + '○'.repeat(max - scene.warmth), n: scene.warmth, max });
    } else if (scene && scene.votes) text = t('zone.legend');
    box.textContent = text;
    box.hidden = !text;
    // Just below the top bar (which is taller on narrow screens)
    const hud = document.querySelector('.hud');
    if (hud && text) box.style.top = Math.round(hud.getBoundingClientRect().bottom + 6) + 'px';
  }

  // Start a scene: the room appears, the conversation plays, then you are back in the village.
  // opts.dark: the lights are out (the typhoon night without a battery)
  function start(game, kind, steps, onEnd, opts) {
    scene = Object.assign(layout(kind, game.state), opts || {});
    game.scene = scene;
    showInfo();
    game.play(steps, () => {
      scene = null;
      game.scene = null;
      showInfo();
      if (onEnd) onEnd();
    });
  }

  // ----- The town meeting (design.md section 10.1) -----
  function meeting(game) {
    const state = game.state, data = HM.DATA, id = state.meeting.plot;
    const plan = C().planOf(state, id).slice();
    const begin = C().meetingStart(state, id);
    const told = C().told(state, id);
    const conditions = [];
    const spoken = new Set();
    const warm = n => run(() => { scene.warmth = C().clampWarmth(scene.warmth + n); showInfo(); });
    const react = n => narrate(n > 0 ? 'meeting.react.warm' : n < 0 ? 'meeting.react.cool' : 'meeting.react.calm');
    const speakerOf = who => data.worries[who].speaker || who;

    // Questions from everyone whose worry isn't settled (nemawashi: those who know the plan answers it stay quiet)
    const questions = C().worries(state, id, plan).filter(w => !(told[w.who] && w.ok));
    // A friend with 3 or more hearts speaks up for you (once each, and not just before their own question)
    const support = asker => run(() => {
      const later = questions.slice(questions.findIndex(q => q.who === asker) + 1).map(q => q.who);
      const f = C().supporters(state).find(x => !spoken.has(x) && x !== asker && !later.includes(x));
      if (!f) return [];
      spoken.add(f);
      return [say(f === 'mori' ? 'ken' : f, 'meeting.support.' + f), warm(1)];
    });

    const steps = [
      run(() => { scene.warmth = C().clampWarmth(begin.warmth); showInfo(); }),
      narrate('meeting.arrive', { plot: plotName(id) }),
      say('oda', 'meeting.open.1', { plot: plotName(id) }),
      say('oda', 'meeting.open.2')
    ];
    begin.notes.forEach(note => steps.push(say(note === 'zone' ? 'sato' : 'oda', 'meeting.note.' + note)));

    // You present the plan: what do you lead with?
    steps.push(say('oda', 'meeting.present'), {
      choice: ['village', 'nature', 'money'].map(lead => {
        const n = C().leadEffect(state, id, lead);
        return { key: 'meeting.lead.' + lead, then: [say('player', 'meeting.lead.' + lead + '.say'), warm(n), react(n)] };
      })
    });

    questions.forEach(w => {
      const who = w.who, speaker = speakerOf(who);
      const honest = data.meeting.honestGood;
      const answers = [{
        key: `worry.${who}.${w.ok ? 'honestGood' : 'honestBad'}`,
        then: [say(speaker, `worry.${who}.${w.ok ? 'good' : 'bad'}`), warm(C().answerEffect('honest', w.ok)), react(w.ok ? honest : -1), support(who)]
      }];
      if (w.fixable && !w.ok) {
        answers.push({ key: `worry.${who}.change`, then: [say(speaker, `worry.${who}.thanks`), run(() => { conditions.push(who); }), warm(C().answerEffect('change')), support(who)] });
      } else if (!w.fixable) {
        answers.push({ key: `worry.${who}.promise`, then: [say(speaker, `worry.${who}.thanks`), warm(C().answerEffect('change')), support(who)] });
      }
      answers.push({ key: 'meeting.vague', then: [warm(C().answerEffect('vague')), narrate('meeting.react.vague')] });
      steps.push(say(speaker, `worry.${who}.ask`), { choice: answers });
    });

    // Mr. Kurokawa's offer from the back row (once)
    if (state.flags.kuroMet && !state.flags.kuroMeeting && state.flags.kuro !== 'partner') {
      steps.push(run(() => { state.flags.kuroMeeting = true; }), say('kurokawa', 'meeting.kuro.1'), {
        choice: [
          { key: 'meeting.kuro.c1', then: [say('oda', 'meeting.kuro.r1'), warm(data.meeting.kurokawaGood)] },
          { key: 'meeting.kuro.c2', then: [narrate('meeting.kuro.r2'), warm(data.meeting.kurokawaBad), run(() => { R().addPoints(state, 'kurokawa', 10); })] }
        ]
      });
    }

    // The result
    steps.push(say('oda', 'meeting.decide'), run(() => {
      const need = C().meetingNeed(state);
      if (scene.warmth < need) {
        state.meeting = null;
        return [say('oda', 'meeting.again'), narrate('meeting.result.again')];
      }
      C().approve(state, id, conditions);
      R().addPoints(state, 'oda', 20);
      const out = [say('oda', conditions.length ? 'meeting.agree.conditions' : 'meeting.agree'),
        narrate('meeting.result.agreed', { plot: plotName(id) })];
      if (conditions.length) out.push(narrate('meeting.result.conditions', { list: list(conditions.map(w => t('worry.' + w + '.need'))) }));
      const permitDay = state.plots[id].permitDay;
      if (permitDay) out.push(narrate('meeting.result.permit', { season: { key: 'season.' + R().seasonOf(permitDay) }, day: R().dayInSeason(permitDay) }));
      if (R().heartsWith(state, 'oda') >= 4) out.push(say('oda', 'meeting.laughed'));
      // Hiro suggests a citizen fund, and Ms. Sato helps with the paperwork
      if (C().canSuggestFund(state)) {
        out.push(say('hiro', 'fund.suggest.1'), say('sato', 'fund.suggest.2'), {
          choice: [
            { key: 'fund.open', then: [run(() => { C().startFund(state, id); }), narrate('fund.opened', { days: data.fund.days })] },
            { key: 'fund.notNow', then: [say('hiro', 'fund.later')] }
          ]
        });
      }
      return out;
    }));
    return steps;
  }

  function startMeeting(game) {
    const state = game.state;
    state.minutes = Math.max(state.minutes, HM.DATA.meeting.hour * 60);
    const id = state.meeting.plot;
    if (!C().hasPlan(state, id) || !C().needsMeeting(state, id)) {
      // Nothing to talk about any more (the plan was cleared)
      state.meeting = null;
      game.play([say('oda', 'meeting.nothing')]);
      return;
    }
    start(game, 'meeting', meeting(game), () => afterHall(game, HM.DATA.meeting.endHour));
  }

  // ----- The promotion zone workshop (design.md section 10.4) -----
  const VOTER = { factory: 'hiro', gen: 'gen', fumiko: 'fumiko', pond: 'kuma', slope: 'midori' };
  function zoning(game) {
    const state = game.state, plots = HM.DATA.zoning.plots;
    const votes = C().zoneVotes(state);
    const steps = [
      narrate('zone.arrive'),
      say('sato', 'zone.open.1'), say('sato', 'zone.open.2'), say('sato', 'zone.open.3'),
      run(() => { scene.votes = {}; showInfo(); })
    ];
    plots.forEach(id => {
      const voter = id === 'slope' && state.flags.mudflow ? 'kuma' : VOTER[id];
      steps.push(run(() => { scene.votes = Object.assign({}, scene.votes, { [id]: votes[id] }); }),
        say(voter, `zone.vote.${id}.${votes[id]}${id === 'slope' && state.flags.mudflow ? 'Mud' : ''}`));
    });
    // You can speak for one place that is still yellow
    const yellow = plots.filter(id => votes[id] === 'yellow');
    steps.push(say('sato', 'zone.speak'), {
      choice: yellow.map(id => ({
        key: 'zone.speakFor', vars: { plot: plotName(id) },
        then: [run(() => { scene.votes = C().speakFor(scene.votes, id); }), say(VOTER[id], 'zone.agree.' + id)]
      })).concat([
        { key: 'zone.speakSlope', then: [narrate('zone.slopeQuiet')] },
        { key: 'zone.quiet', then: [] }
      ])
    });
    steps.push(run(() => {
      C().finishZoning(state, scene.votes);
      const green = plots.filter(id => state.zone[id] === 'green').map(id => t('plot.' + id));
      return [
        say('sato', 'zone.result.1', { list: list(green) }),
        say('sato', 'zone.result.2'), say('sato', 'zone.result.3')
      ];
    }));
    return steps;
  }

  function startZoning(game) {
    game.state.minutes = Math.max(game.state.minutes, HM.DATA.zoning.hour * 60);
    start(game, 'zoning', zoning(game), () => afterHall(game, HM.DATA.zoning.endHour));
  }

  // ----- The year's-end gathering: the village remembers the year (design.md section 12) -----
  function startEnding(game, onEnd) {
    const id = C().ending(game.state);
    const state = game.state, year = C().review(state), words = C().words(state);
    start(game, 'ending', [
      narrate('ending.gather'),
      say('oda', 'ending.oda.1'), say('oda', 'ending.oda.2'),
      // The year in numbers, then a word from each close friend (Milestone 3.2)
      say('oda', year.gardens ? 'ending.review.gardens' : 'ending.review.noGardens', year)
    ].concat(words.length ? [narrate('ending.words')].concat(words.map(w => say(w.who, w.key))) : [], [
      narrate('ending.' + id + '.title'),
      narrate('ending.' + id + '.1'), narrate('ending.' + id + '.2'), narrate('ending.' + id + '.3'), narrate('ending.' + id + '.4')
    ]), onEnd);
  }

  // Back in the village, in front of the community hall
  function afterHall(game, hour) {
    const state = game.state, door = HM.MAP.hall.door;
    state.minutes = Math.max(state.minutes, hour * 60);
    HM.world.settle(state);
    const p = HM.world.player;
    p.x = door.x * HM.render.TILE; p.y = door.y * HM.render.TILE; p.dir = door.dir; p.path = null;
  }

  // Scenes that start at their hour wherever you are (checked every frame while you walk around)
  function check(game) {
    const state = game.state;
    if (C().meetingToday(state) && state.minutes >= HM.DATA.meeting.hour * 60) {
      game.play([narrate('meeting.time')], () => startMeeting(game));
      return true;
    }
    if (C().zoningToday(state) && state.minutes >= HM.DATA.zoning.hour * 60) {
      game.play([narrate('zone.time')], () => startZoning(game));
      return true;
    }
    return false;
  }

  HM.scenes = { start, startMeeting, startZoning, startEnding, check, afterHall, current: () => scene, showInfo };
})(globalThis);
