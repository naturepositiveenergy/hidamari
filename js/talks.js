// Hidamari: what the residents say (Milestone 2.2). Only text codes: the words are in the language files.
//
// For each character:
//   meet:  the first meeting
//   chats: everyday lines. A line can be said when everything in its "when" fits:
//          spot (where they are), weather, seasons, weekend, field ('panels', 'hedge' or 'meadow' built on
//          your field), hearts (at least). The game prefers lines you haven't heard for a while.
//   again: when you talk to them a second time on the same day
// Gift reactions are "<character>.gift.loved" (and liked, neutral, disliked).
// Gen-san's and Midori's first meetings and reactions are in js/story.js (they have their own scenes from
// Phase 1); their everyday lines are here too (since Milestone 3.2).
// More "when" conditions (since Milestone 3.2): hours, flag / notFlag (something that happened, or hasn't),
// event (a heart event that happened), fund (a citizen fund has been opened).
//
// REQUESTS: two per household, one after the other (Gen-san's and Midori's first ones are in js/story.js).
// friend: the household (if the name isn't the household's) · giver: who asks · ask: the request ·
// tasks: what to do (use a thing, talk to someone, or bring things; hours: only at that time) · remind ·
// done · reward. The second request comes on a later day than the first was done, from 2 hearts
// (after: a rule of its own instead, for Gen-san's and Midori's).

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};

  HM.TALKS = {
    gen: {
      meet: [],
      chats: [
        { key: 'gen.chat.mud', when: { flag: 'mudflow' } },
        { key: 'gen.chat.hiroRoof', when: { event: 'hiro.3' } },
        { key: 'gen.chat.rain', when: { weather: ['rain'] } },
        { key: 'gen.chat.spring', when: { seasons: ['spring'] } },
        { key: 'gen.chat.summer', when: { seasons: ['summer'] } },
        { key: 'gen.chat.autumn', when: { seasons: ['autumn'] } },
        { key: 'gen.chat.winter', when: { seasons: ['winter'] } },
        { key: 'gen.chat.morning', when: { hours: [0, 11] } },
        { key: 'gen.chat.noon', when: { hours: [11, 14] } },
        { key: 'gen.chat.afternoon', when: { hours: [14, 17] } },
        { key: 'gen.chat.evening', when: { hours: [17, 24] } }
      ],
      again: 'gen.chat.again'
    },
    midori: {
      meet: [],
      chats: [
        { key: 'midori.chat.muddy', when: { flag: 'mudflow', notFlag: 'cleanUp' } },
        { key: 'midori.chat.clearer', when: { flag: 'cleanUp' } },
        { key: 'midori.chat.rain', when: { weather: ['rain'] } },
        { key: 'midori.chat.pond', when: { spot: 'pondShore' } },
        { key: 'midori.chat.terraces', when: { spot: 'terraces' } },
        { key: 'midori.chat.spring', when: { seasons: ['spring'] } },
        { key: 'midori.chat.summer', when: { seasons: ['summer'] } },
        { key: 'midori.chat.autumn', when: { seasons: ['autumn'] } },
        { key: 'midori.chat.winter', when: { seasons: ['winter'] } },
        { key: 'midori.chat.stream', when: { spot: 'streamside' } }
      ],
      again: 'midori.chat.again'
    },
    fumiko: {
      meet: ['fumiko.meet.1', 'fumiko.meet.2', 'fumiko.meet.3'],
      chats: [
        { key: 'fumiko.chat.dinner', when: { event: 'fumiko.4' } },
        { key: 'fumiko.chat.mud', when: { flag: 'mudflow' } },
        { key: 'fumiko.chat.corner', when: { event: 'hiro.5' } },
        { key: 'fumiko.chat.rain', when: { weather: ['rain', 'snow'] } },
        { key: 'fumiko.chat.panels', when: { field: 'panels' } },
        { key: 'fumiko.chat.garden', when: { spot: 'fumikoGarden' } },
        { key: 'fumiko.chat.shrine', when: { spot: 'shrineSweep' } },
        { key: 'fumiko.chat.spring', when: { seasons: ['spring'] } },
        { key: 'fumiko.chat.summer', when: { seasons: ['summer'] } },
        { key: 'fumiko.chat.autumn', when: { seasons: ['autumn'] } },
        { key: 'fumiko.chat.winter', when: { seasons: ['winter'] } },
        { key: 'fumiko.chat.rin', when: { hearts: 1 } },
        { key: 'fumiko.chat.weekend', when: { weekend: true } },
        { key: 'fumiko.chat.photo', when: { hearts: 3 } },
        { key: 'fumiko.chat.oda', when: { hearts: 2 } },
        { key: 'fumiko.chat.porch' }
      ],
      again: 'fumiko.again'
    },
    aya: {
      meet: ['aya.meet.1', 'aya.meet.2'],
      chats: [
        { key: 'aya.chat.poster', when: { event: 'mori.4' } },
        { key: 'aya.chat.fund', when: { fund: true } },
        { key: 'aya.chat.rain', when: { weather: ['rain'] } },
        { key: 'aya.chat.morning', when: { spot: 'busWait' } },
        { key: 'aya.chat.weekend', when: { weekend: true } },
        { key: 'aya.chat.bill', when: { hearts: 1 } },
        { key: 'aya.chat.summer', when: { seasons: ['summer'] } },
        { key: 'aya.chat.winter', when: { seasons: ['winter'] } },
        { key: 'aya.chat.work', when: { hearts: 2 } },
        { key: 'aya.chat.garden' }
      ],
      again: 'aya.again'
    },
    ken: {
      meet: ['ken.meet.1', 'ken.meet.2'],
      chats: [
        { key: 'ken.chat.hedge', when: { flag: 'moriSafe' } },
        { key: 'ken.chat.mud', when: { flag: 'mudflow' } },
        { key: 'ken.chat.rain', when: { weather: ['rain'] } },
        { key: 'ken.chat.weekend', when: { weekend: true } },
        { key: 'ken.chat.safety', when: { hearts: 1 } },
        { key: 'ken.chat.summer', when: { seasons: ['summer'] } },
        { key: 'ken.chat.autumn', when: { seasons: ['autumn'] } },
        { key: 'ken.chat.grewUp', when: { hearts: 2 } },
        { key: 'ken.chat.evening' }
      ],
      again: 'ken.again'
    },
    sora: {
      meet: ['sora.meet.1', 'sora.meet.2'],
      chats: [
        { key: 'sora.chat.meadow', when: { field: 'meadow' } },
        { key: 'sora.chat.rain', when: { weather: ['rain'] } },
        { key: 'sora.chat.stone', when: { spot: ['riverside3', 'soraPlay'] } },
        { key: 'sora.chat.school', when: { weekend: false } },
        { key: 'sora.chat.summer', when: { seasons: ['summer'] } },
        { key: 'sora.chat.autumn', when: { seasons: ['autumn'] } },
        { key: 'sora.chat.winter', when: { seasons: ['winter'] } },
        { key: 'sora.chat.weekend', when: { weekend: true } },
        { key: 'sora.chat.grownUp', when: { hearts: 2 } },
        { key: 'sora.chat.play' }
      ],
      again: 'sora.again'
    },
    oda: {
      meet: ['oda.meet.1', 'oda.meet.2', 'oda.meet.3'],
      chats: [
        { key: 'oda.chat.zone', when: { flag: 'zoningDone' } },
        { key: 'oda.chat.mud', when: { flag: 'mudflow' } },
        { key: 'oda.chat.rain', when: { weather: ['rain', 'snow'] } },
        { key: 'oda.chat.walk', when: { spot: ['walkA', 'walkB', 'walkC'] } },
        { key: 'oda.chat.hall', when: { spot: 'hall' } },
        { key: 'oda.chat.visit', when: { spot: ['visitGen', 'visitFumiko', 'visitHome', 'visitMori'] } },
        { key: 'oda.chat.panels', when: { field: 'panels' } },
        { key: 'oda.chat.spring', when: { seasons: ['spring'] } },
        { key: 'oda.chat.summer', when: { seasons: ['summer'] } },
        { key: 'oda.chat.autumn', when: { seasons: ['autumn'] } },
        { key: 'oda.chat.winter', when: { seasons: ['winter'] } },
        { key: 'oda.chat.tea', when: { hearts: 2 } },
        { key: 'oda.chat.consensus' }
      ],
      again: 'oda.again'
    },
    hiro: {
      meet: ['hiro.meet.1', 'hiro.meet.2', 'hiro.meet.3'],
      chats: [
        { key: 'hiro.chat.meter', when: { event: 'hiro.3' } },
        { key: 'hiro.chat.kurokawa', when: { flag: 'kuroMet' } },
        { key: 'hiro.chat.closed', when: { spot: ['riverside4', 'shopBenchC'] } },
        { key: 'hiro.chat.delivery', when: { spot: ['visitFumiko2', 'visitGen2', 'visitKuma'] } },
        { key: 'hiro.chat.rain', when: { weather: ['rain'] } },
        { key: 'hiro.chat.winter', when: { seasons: ['winter'] } },
        { key: 'hiro.chat.panels', when: { field: 'panels' } },
        { key: 'hiro.chat.fridges', when: { hearts: 1 } },
        { key: 'hiro.chat.summer', when: { seasons: ['summer'] } },
        { key: 'hiro.chat.autumn', when: { seasons: ['autumn'] } },
        { key: 'hiro.chat.weekend', when: { weekend: true } },
        { key: 'hiro.chat.father', when: { hearts: 2 } },
        { key: 'hiro.chat.shop' }
      ],
      again: 'hiro.again'
    },
    kuma: {
      meet: ['kuma.meet.1', 'kuma.meet.2', 'kuma.meet.3'],
      chats: [
        { key: 'kuma.chat.mud', when: { flag: 'mudflow' } },
        { key: 'kuma.chat.association', when: { event: 'kuma.4' } },
        { key: 'kuma.chat.rain', when: { weather: ['rain'] } },
        { key: 'kuma.chat.winter', when: { seasons: ['winter'] } },
        { key: 'kuma.chat.sluice', when: { spot: 'sluice' } },
        { key: 'kuma.chat.terraces', when: { spot: ['terraceA', 'terraceB'] } },
        { key: 'kuma.chat.bench', when: { spot: 'shopBenchB' } },
        { key: 'kuma.chat.panels', when: { field: 'panels' } },
        { key: 'kuma.chat.spring', when: { seasons: ['spring'] } },
        { key: 'kuma.chat.summer', when: { seasons: ['summer'] } },
        { key: 'kuma.chat.autumn', when: { seasons: ['autumn'] } },
        { key: 'kuma.chat.father', when: { hearts: 2 } }
      ],
      again: 'kuma.again'
    },
    rin: {
      meet: ['rin.meet.1', 'rin.meet.2', 'rin.meet.3'],
      chats: [
        { key: 'rin.chat.agreed', when: { event: 'fumiko.4' } },
        { key: 'rin.chat.mud', when: { flag: 'mudflow' } },
        { key: 'rin.chat.zone', when: { flag: 'zoningDone' } },
        { key: 'rin.chat.rain', when: { weather: ['rain'] } },
        { key: 'rin.chat.panels', when: { field: 'panels' } },
        { key: 'rin.chat.summer', when: { seasons: ['summer'] } },
        { key: 'rin.chat.shop', when: { spot: 'rinShop' } },
        { key: 'rin.chat.grandma', when: { hearts: 1 } },
        { key: 'rin.chat.hall', when: { spot: 'hall' } },
        { key: 'rin.chat.autumn', when: { seasons: ['autumn'] } },
        { key: 'rin.chat.winter', when: { seasons: ['winter'] } },
        { key: 'rin.chat.weekend', when: { weekend: true } },
        { key: 'rin.chat.cycling' }
      ],
      again: 'rin.again'
    },
    sato: {
      meet: ['sato.meet.1', 'sato.meet.2', 'sato.meet.3'],
      chats: [
        { key: 'sato.chat.ordinance', when: { flag: 'ordinance' } },
        { key: 'sato.chat.zone', when: { flag: 'zoningDone' } },
        { key: 'sato.chat.rain', when: { weather: ['rain'] } },
        { key: 'sato.chat.panels', when: { field: 'panels' } },
        { key: 'sato.chat.lunch', when: { spot: 'lunch' } },
        { key: 'sato.chat.site', when: { spot: ['siteFactory', 'siteField'] } },
        { key: 'sato.chat.hike', when: { spot: ['hikeA', 'hikeB'] } },
        { key: 'sato.chat.slope', when: { hearts: 1 } },
        { key: 'sato.chat.spring', when: { seasons: ['spring'] } },
        { key: 'sato.chat.summer', when: { seasons: ['summer'] } },
        { key: 'sato.chat.winter', when: { seasons: ['winter'] } },
        { key: 'sato.chat.hometown', when: { hearts: 2 } },
        { key: 'sato.chat.office' }
      ],
      again: 'sato.again'
    },
    kurokawa: {
      meet: ['kurokawa.meet.1', 'kurokawa.meet.2', 'kurokawa.meet.3'],
      chats: [
        { key: 'kurokawa.chat.mother', when: { event: 'kurokawa.2' } },
        { key: 'kurokawa.chat.mud', when: { flag: 'mudflow' } },
        { key: 'kurokawa.chat.rain', when: { weather: ['rain'] } },
        { key: 'kurokawa.chat.slope', when: { spot: 'slopeTrack' } },
        { key: 'kurokawa.chat.bus', when: { spot: 'busBench' } },
        { key: 'kurokawa.chat.shop', when: { spot: 'kuroShop' } },
        { key: 'kurokawa.chat.plaza', when: { spot: 'plaza' } },
        { key: 'kurokawa.chat.sunny', when: { weather: ['sunny'] } },
        { key: 'kurokawa.chat.summer', when: { seasons: ['summer'] } },
        { key: 'kurokawa.chat.winter', when: { seasons: ['winter'] } },
        { key: 'kurokawa.chat.problem', when: { hearts: 2 } },
        { key: 'kurokawa.chat.quota' }
      ],
      again: 'kurokawa.again'
    }
  };

  HM.REQUESTS = {
    fumiko: {
      giver: 'fumiko',
      ask: ['fumiko.req.ask.1', 'fumiko.req.ask.2'],
      tasks: [{ object: 'bellRope', say: ['fumiko.req.found'] }],
      remind: 'fumiko.req.remind',
      done: ['fumiko.req.done.1', 'fumiko.req.done.2'],
      reward: { items: { seedling: 2 } }
    },
    mori: {
      giver: 'sora',
      ask: ['sora.req.ask.1', 'sora.req.ask.2'],
      tasks: [{ object: 'soraCap', say: ['sora.req.found'] }],
      remind: 'sora.req.remind',
      done: ['sora.req.done.1', 'sora.req.done.2'],
      reward: { items: { stone: 1 } }
    },
    oda: {
      giver: 'oda',
      ask: ['oda.req.ask.1', 'oda.req.ask.2'],
      tasks: [
        { object: 'genDoor', say: ['oda.req.board'] },
        { object: 'fumikoDoor', say: ['oda.req.board'] },
        { object: 'moriDoor', say: ['oda.req.board'] }
      ],
      remind: 'oda.req.remind',
      done: ['oda.req.done.1', 'oda.req.done.2'],
      reward: { items: { senbei: 2 } }
    },
    hiro: {
      giver: 'hiro',
      ask: ['hiro.req.ask.1', 'hiro.req.ask.2'],
      tasks: [{ object: 'kumaDoor', say: ['hiro.req.delivered'] }],
      remind: 'hiro.req.remind',
      done: ['hiro.req.done.1', 'hiro.req.done.2'],
      reward: { money: 1000, items: { coffee: 1 } }
    },
    kuma: {
      giver: 'kuma',
      ask: ['kuma.req.ask.1', 'kuma.req.ask.2'],
      tasks: [{ object: 'sluiceLeaves', say: ['kuma.req.cleared'] }],
      remind: 'kuma.req.remind',
      done: ['kuma.req.done.1', 'kuma.req.done.2'],
      reward: { items: { tea: 2 } }
    },
    rin: {
      giver: 'rin',
      ask: ['rin.req.ask.1', 'rin.req.ask.2'],
      tasks: [{ object: 'sunriseView', hours: [6, 7], say: ['rin.req.photo'], notNow: 'rin.req.tooLate' }],
      remind: 'rin.req.remind',
      done: ['rin.req.done.1', 'rin.req.done.2'],
      reward: { items: { soySnack: 2 } }
    },
    sato: {
      giver: 'sato',
      ask: ['sato.req.ask.1', 'sato.req.ask.2'],
      tasks: [{ talk: 'oda', say: ['oda.req.sign.1', 'oda.req.sign.2'] }],
      remind: 'sato.req.remind',
      done: ['sato.req.done.1', 'sato.req.done.2'],
      reward: { items: { manju: 2 } }
    },

    // ----- The second requests (Milestone 3.1, from design.md section 5) -----
    gen2: {
      friend: 'gen', giver: 'gen', hearts: 1, after: s => s.flags.genRequest === 'done',
      ask: ['gen.req2.ask.1', 'gen.req2.ask.2'],
      tasks: [{ object: 'sickle', say: ['gen.req2.found'] }],
      remind: 'gen.req2.remind',
      done: ['gen.req2.done.1', 'gen.req2.done.2'],
      reward: { items: { persimmon: 2 } }
    },
    midori2: {
      friend: 'midori', giver: 'midori', hearts: 1, after: s => s.flags.midoriRequest === 'done',
      ask: ['midori.req2.ask.1', 'midori.req2.ask.2'],
      tasks: [{ object: 'riverLitter', say: ['midori.req2.found'] }],
      remind: 'midori.req2.remind',
      done: ['midori.req2.done.1', 'midori.req2.done.2'],
      reward: { items: { strawberry: 2 } }
    },
    fumiko2: {
      friend: 'fumiko', giver: 'fumiko', hearts: 2,
      ask: ['fumiko.req2.ask.1', 'fumiko.req2.ask.2'],
      tasks: [{ object: 'compost', say: ['fumiko.req2.carried'] }],
      remind: 'fumiko.req2.remind',
      done: ['fumiko.req2.done.1', 'fumiko.req2.done.2'],
      reward: { items: { daikon: 2 } }
    },
    mori2: {
      friend: 'mori', giver: 'ken', hearts: 2,
      ask: ['ken.req2.ask.1', 'ken.req2.ask.2'],
      tasks: [{ object: 'swing', say: ['ken.req2.fixed'] }],
      remind: 'ken.req2.remind',
      done: ['ken.req2.done.1', 'ken.req2.done.2'],
      reward: { items: { onigiri: 2 } }
    },
    oda2: {
      friend: 'oda', giver: 'oda', hearts: 2,
      ask: ['oda.req2.ask.1', 'oda.req2.ask.2'],
      tasks: [{ object: 'hallStore', say: ['oda.req2.chairs'] }],
      remind: 'oda.req2.remind',
      done: ['oda.req2.done.1', 'oda.req2.done.2'],
      reward: { items: { senbei: 2 } }
    },
    hiro2: {
      friend: 'hiro', giver: 'hiro', hearts: 2,
      ask: ['hiro.req2.ask.1', 'hiro.req2.ask.2'],
      tasks: [{ bring: { cucumber: 5 } }],
      remind: 'hiro.req2.remind',
      done: ['hiro.req2.done.1', 'hiro.req2.done.2'],
      reward: { money: 1500, items: { coffee: 1 } }
    },
    kuma2: {
      friend: 'kuma', giver: 'kuma', hearts: 2,
      ask: ['kuma.req2.ask.1', 'kuma.req2.ask.2'],
      tasks: [{ object: 'waterGauge', hours: [6, 8], say: ['kuma.req2.read'], notNow: 'kuma.req2.notNow' }],
      remind: 'kuma.req2.remind',
      done: ['kuma.req2.done.1', 'kuma.req2.done.2'],
      reward: { items: { chestnut: 2 } }
    },
    rin2: {
      friend: 'rin', giver: 'rin', hearts: 2,
      ask: ['rin.req2.ask.1', 'rin.req2.ask.2'],
      tasks: [{ talk: 'hiro', say: ['rin.req2.hiro'] }, { talk: 'ken', say: ['rin.req2.ken'] }],
      remind: 'rin.req2.remind',
      done: ['rin.req2.done.1', 'rin.req2.done.2'],
      reward: { items: { soySnack: 1, ramune: 1 } }
    },
    sato2: {
      friend: 'sato', giver: 'sato', hearts: 2,
      ask: ['sato.req2.ask.1', 'sato.req2.ask.2'],
      tasks: [{ talk: 'oda', say: ['sato.req2.oda'] }],
      remind: 'sato.req2.remind',
      done: ['sato.req2.done.1', 'sato.req2.done.2'],
      reward: { items: { manju: 2 } }
    }
  };
})(globalThis);
