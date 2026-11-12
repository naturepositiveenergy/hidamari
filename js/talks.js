// Hidamari: what the residents say (Milestone 2.2). Only text codes: the words are in the language files.
//
// For each character:
//   meet:  the first meeting
//   chats: everyday lines. A line can be said when everything in its "when" fits:
//          spot (where they are), weather, seasons, weekend, field ('panels', 'hedge' or 'meadow' built on
//          your field), hearts (at least). The game prefers lines you haven't heard for a while.
//   again: when you talk to them a second time on the same day
// Gift reactions are "<character>.gift.loved" (and liked, neutral, disliked).
// Gen-san's and Midori's conversations are in js/story.js (they have their own scenes from Phase 1).
//
// REQUESTS: one per household. giver: who asks · ask: the request · tasks: what to do
// (use a thing, or talk to someone; hours: only at that time) · remind · done · reward.

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};

  HM.TALKS = {
    fumiko: {
      meet: ['fumiko.meet.1', 'fumiko.meet.2', 'fumiko.meet.3'],
      chats: [
        { key: 'fumiko.chat.rain', when: { weather: ['rain', 'snow'] } },
        { key: 'fumiko.chat.panels', when: { field: 'panels' } },
        { key: 'fumiko.chat.garden', when: { spot: 'fumikoGarden' } },
        { key: 'fumiko.chat.shrine', when: { spot: 'shrineSweep' } },
        { key: 'fumiko.chat.spring', when: { seasons: ['spring'] } },
        { key: 'fumiko.chat.summer', when: { seasons: ['summer'] } },
        { key: 'fumiko.chat.autumn', when: { seasons: ['autumn'] } },
        { key: 'fumiko.chat.winter', when: { seasons: ['winter'] } },
        { key: 'fumiko.chat.rin', when: { hearts: 1 } },
        { key: 'fumiko.chat.porch' }
      ],
      again: 'fumiko.again'
    },
    aya: {
      meet: ['aya.meet.1', 'aya.meet.2'],
      chats: [
        { key: 'aya.chat.morning', when: { spot: 'busWait' } },
        { key: 'aya.chat.weekend', when: { weekend: true } },
        { key: 'aya.chat.bill', when: { hearts: 1 } },
        { key: 'aya.chat.garden' }
      ],
      again: 'aya.again'
    },
    ken: {
      meet: ['ken.meet.1', 'ken.meet.2'],
      chats: [
        { key: 'ken.chat.weekend', when: { weekend: true } },
        { key: 'ken.chat.safety', when: { hearts: 1 } },
        { key: 'ken.chat.evening' }
      ],
      again: 'ken.again'
    },
    sora: {
      meet: ['sora.meet.1', 'sora.meet.2'],
      chats: [
        { key: 'sora.chat.rain', when: { weather: ['rain'] } },
        { key: 'sora.chat.stone', when: { spot: ['riverside3', 'soraPlay'] } },
        { key: 'sora.chat.school', when: { weekend: false } },
        { key: 'sora.chat.play' }
      ],
      again: 'sora.again'
    },
    oda: {
      meet: ['oda.meet.1', 'oda.meet.2', 'oda.meet.3'],
      chats: [
        { key: 'oda.chat.rain', when: { weather: ['rain', 'snow'] } },
        { key: 'oda.chat.walk', when: { spot: ['walkA', 'walkB', 'walkC'] } },
        { key: 'oda.chat.hall', when: { spot: 'hall' } },
        { key: 'oda.chat.visit', when: { spot: ['visitGen', 'visitFumiko', 'visitHome', 'visitMori'] } },
        { key: 'oda.chat.panels', when: { field: 'panels' } },
        { key: 'oda.chat.spring', when: { seasons: ['spring'] } },
        { key: 'oda.chat.consensus' }
      ],
      again: 'oda.again'
    },
    hiro: {
      meet: ['hiro.meet.1', 'hiro.meet.2', 'hiro.meet.3'],
      chats: [
        { key: 'hiro.chat.closed', when: { spot: ['riverside4', 'shopBenchC'] } },
        { key: 'hiro.chat.delivery', when: { spot: ['visitFumiko2', 'visitGen2', 'visitKuma'] } },
        { key: 'hiro.chat.rain', when: { weather: ['rain'] } },
        { key: 'hiro.chat.winter', when: { seasons: ['winter'] } },
        { key: 'hiro.chat.panels', when: { field: 'panels' } },
        { key: 'hiro.chat.fridges', when: { hearts: 1 } },
        { key: 'hiro.chat.shop' }
      ],
      again: 'hiro.again'
    },
    kuma: {
      meet: ['kuma.meet.1', 'kuma.meet.2', 'kuma.meet.3'],
      chats: [
        { key: 'kuma.chat.rain', when: { weather: ['rain'] } },
        { key: 'kuma.chat.winter', when: { seasons: ['winter'] } },
        { key: 'kuma.chat.sluice', when: { spot: 'sluice' } },
        { key: 'kuma.chat.terraces', when: { spot: ['terraceA', 'terraceB'] } },
        { key: 'kuma.chat.bench', when: { spot: 'shopBenchB' } },
        { key: 'kuma.chat.panels', when: { field: 'panels' } }
      ],
      again: 'kuma.again'
    },
    rin: {
      meet: ['rin.meet.1', 'rin.meet.2', 'rin.meet.3'],
      chats: [
        { key: 'rin.chat.rain', when: { weather: ['rain'] } },
        { key: 'rin.chat.panels', when: { field: 'panels' } },
        { key: 'rin.chat.summer', when: { seasons: ['summer'] } },
        { key: 'rin.chat.shop', when: { spot: 'rinShop' } },
        { key: 'rin.chat.grandma', when: { hearts: 1 } },
        { key: 'rin.chat.hall', when: { spot: 'hall' } },
        { key: 'rin.chat.cycling' }
      ],
      again: 'rin.again'
    },
    sato: {
      meet: ['sato.meet.1', 'sato.meet.2', 'sato.meet.3'],
      chats: [
        { key: 'sato.chat.rain', when: { weather: ['rain'] } },
        { key: 'sato.chat.panels', when: { field: 'panels' } },
        { key: 'sato.chat.lunch', when: { spot: 'lunch' } },
        { key: 'sato.chat.site', when: { spot: ['siteFactory', 'siteField'] } },
        { key: 'sato.chat.hike', when: { spot: ['hikeA', 'hikeB'] } },
        { key: 'sato.chat.slope', when: { hearts: 1 } },
        { key: 'sato.chat.office' }
      ],
      again: 'sato.again'
    },
    kurokawa: {
      meet: ['kurokawa.meet.1', 'kurokawa.meet.2', 'kurokawa.meet.3'],
      chats: [
        { key: 'kurokawa.chat.rain', when: { weather: ['rain'] } },
        { key: 'kurokawa.chat.slope', when: { spot: 'slopeTrack' } },
        { key: 'kurokawa.chat.bus', when: { spot: 'busBench' } },
        { key: 'kurokawa.chat.shop', when: { spot: 'kuroShop' } },
        { key: 'kurokawa.chat.plaza', when: { spot: 'plaza' } },
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
    }
  };
})(globalThis);
