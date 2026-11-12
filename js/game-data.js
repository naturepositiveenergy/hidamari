// Hidamari: the game's numbers and lists.
//
// The numbers are first guesses from docs/design.md and will be balanced in Phase 2.
// All texts are in the language files; here are only text codes.

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};

  HM.DATA = {
    // ----- Time (design.md section 2) -----
    time: {
      minutesPerSecond: 4,        // in-game minutes per real second (relaxed clock: half)
      dayStart: 6 * 60,           // you wake at 6:00
      dayEnd: 24 * 60,            // at midnight you fall asleep
      firstDayStart: 9 * 60,      // on day 1 you arrive at 9:00
      eveningChime: 17 * 60,
      lastDay: 28                 // one year: 4 seasons of 7 days
    },
    seasons: ['spring', 'summer', 'autumn', 'winter'],
    daysPerSeason: 7,

    // The weather of every day of the year (design.md section 11): spring, summer with the
    // rainy season, autumn with the typhoon, winter with snow
    days: [
      'sunny', 'sunny', 'cloudy', 'sunny', 'cloudy', 'sunny', 'rain',          // spring
      'rain', 'rain', 'rain', 'cloudy', 'sunny', 'sunny', 'sunny',             // summer: rainy season, then hot days
      'sunny', 'typhoon', 'sunny', 'cloudy', 'sunny', 'sunny', 'cloudy',       // autumn: typhoon on day 2
      'cloudy', 'snow', 'snow', 'sunny', 'sunny', 'cloudy', 'sunny'            // winter
    ],
    // How much power the panels make in each kind of weather
    weatherPower: { sunny: 1, cloudy: 0.5, rain: 0.2, typhoon: 0, snow: 0.1 },

    // ----- Money (design.md section 9) -----
    money: {
      start: 30000,
      allowance: 40000,           // your cooperator allowance at the start of each season
      perPower: 150               // yen for each power point the panels make
    },

    // ----- Building (design.md section 7) -----
    build: {
      minutesPerTile: 15,
      maxAlone: 8,                // bigger plans need a work day with friends (later)
      refund: 0.5                 // removing a built tile gives half its cost back
    },
    // cost in yen · power per sunny day · nature points · needs an item from your bag ·
    // panel: needs panel parts · walk: you can walk on it · shade: how much it shades the crops below ·
    // crops: crops can grow under it · summer: extra power in summer (the water cools floating panels)
    buildTiles: {
      dense: { cost: 20000, power: 10, nature: 0, panel: true, shade: 1 },
      spaced: { cost: 24000, power: 7, nature: 1, natureType: true, panel: true, shade: 0.5, walk: true, crops: true },
      floating: { cost: 26000, power: 9, nature: 0, panel: true, summer: 1 },
      hedge: { cost: 2000, power: 0, nature: 3, natureType: true, needs: 'seedling' },
      meadow: { cost: 500, power: 0, nature: 2, natureType: true, walk: true },
      pond: { cost: 5000, power: 0, nature: 4, natureType: true },
      corridor: { cost: 1000, power: 0, nature: 2, natureType: true, walk: true, mustConnect: true },
      path: { cost: 300, power: 0, nature: 0, walk: true },
      fence: { cost: 3000, power: 0, nature: 0 }
    },
    buildOrder: ['dense', 'spaced', 'floating', 'hedge', 'meadow', 'pond', 'corridor', 'path', 'fence'],
    // The six plots (design.md section 7.1; where they are: js/map-data.js)
    // tools: what can be built · farm: you can grow vegetables there · agri: the light rule (shade under 30%) ·
    // maxPanels: share of the plot panels may cover · rubble: must be cleared first ·
    // open: whose hearts open the plot (the town meeting comes in Milestone 2.4)
    plots: {
      home: { tools: ['dense', 'spaced', 'hedge', 'meadow', 'pond', 'corridor', 'path', 'fence'], farm: true, open: null },
      fumiko: { tools: ['dense', 'spaced', 'hedge', 'meadow', 'pond', 'corridor', 'path', 'fence'], open: { friend: 'fumiko', hearts: 4 } },
      gen: { tools: ['spaced', 'hedge', 'corridor'], agri: true, open: { friend: 'gen', hearts: 4 } },
      pond: { tools: ['floating'], maxPanels: 0.5, naturalEdge: true, open: { friend: 'kuma', hearts: 4 } },
      factory: { tools: ['dense', 'spaced', 'hedge', 'meadow', 'pond', 'corridor', 'path', 'fence'], rubble: true, open: { friend: 'sato', hearts: 2 } },
      slope: { tools: [], open: { later: true } }
    },
    plotOrder: ['home', 'fumiko', 'gen', 'pond', 'factory', 'slope'],
    agriShadeLimit: 0.3,          // shade on Gen-san's paddy must stay under 30% (the rule from April 2027)
    starterPanels: 4,             // the town's starter kit: enough parts for 4 panels
    partsFrom: { friend: 'hiro', hearts: 2 },   // after that, Hiro orders panel parts
    // A work day (結): for plans of more than 8 tiles, or to clear the factory rubble
    workDay: { startBy: 12, endAt: 17, helperHearts: 2, minHelpers: 1, rubbleHelpers: 2, helperPoints: 10 },
    typhoon: { looseShare: 0.5, repairCost: 2000, repairMinutes: 15 },
    harvestDay: 17,               // autumn day 3: the rice harvest on Gen-san's paddy
    varietyBonus: 5,              // nature points for each different nature tile type after the first

    // ----- Friendship (design.md section 6) -----
    hearts: { pointsPerHeart: 100, max: 5 },
    points: { talk: 10, loved: 50, liked: 25, neutral: 10, disliked: -20, request: 40, event: 30, wrongAnswer: 10 },

    // ----- Your bag -----
    // gift: can be given · price: what it costs at Hiro's shop (if he sells it)
    items: {
      onigiri: { gift: true, price: 200 },
      tea: { gift: true, price: 150 },
      persimmon: { gift: true },
      strawberry: { gift: true },
      manju: { gift: true, price: 250 },
      coffee: { gift: true, price: 130 },
      ramune: { gift: true, price: 120 },
      senbei: { gift: true, price: 300 },
      soySnack: { gift: true },
      camelliaSeedling: { gift: true, price: 1500 },
      stone: { gift: true },
      chestnut: { gift: true },
      camellia: { gift: true },
      seedling: { gift: false, price: 500 },
      seedKomatsuna: { gift: false, price: 200, crop: 'komatsuna' },
      seedCucumber: { gift: false, price: 250, crop: 'cucumber' },
      seedTomato: { gift: false, price: 300, crop: 'tomato' },
      seedSweetPotato: { gift: false, price: 300, crop: 'sweetPotato' },
      seedDaikon: { gift: false, price: 200, crop: 'daikon' },
      // sell: what Hiro pays for it
      komatsuna: { gift: true, sell: 300 },
      cucumber: { gift: true, sell: 250 },
      tomato: { gift: true, sell: 350 },
      sweetPotato: { gift: true, sell: 400 },
      daikon: { gift: true, sell: 350 }
    },
    startBag: { onigiri: 2, tea: 2, persimmon: 1, seedling: 4, seedKomatsuna: 2 },
    // Vegetables for your home field: when you can sow them, and how many days until harvest
    crops: {
      komatsuna: { seasons: ['spring', 'autumn'], days: 3, seed: 'seedKomatsuna' },
      cucumber: { seasons: ['summer'], days: 3, seed: 'seedCucumber' },
      tomato: { seasons: ['summer'], days: 4, seed: 'seedTomato' },
      sweetPotato: { seasons: ['autumn'], days: 4, seed: 'seedSweetPotato' },
      daikon: { seasons: ['winter'], days: 4, seed: 'seedDaikon' }
    },
    // What Hiro's shop sells, in this order. It is open 9:00–17:00, except on the closing day.
    // Seeds are only sold in their sowing season.
    shop: {
      items: ['onigiri', 'tea', 'manju', 'senbei', 'coffee', 'ramune', 'camelliaSeedling', 'seedling',
        'seedKomatsuna', 'seedCucumber', 'seedTomato', 'seedSweetPotato', 'seedDaikon'],
      open: 9, close: 17, closedDay: 3
    },
    // Things to pick around the village, once a day each, in their seasons (the places are in js/map-data.js)
    forage: {
      berries: { item: 'strawberry', seasons: ['spring', 'summer'] },
      stone: { item: 'stone', seasons: ['spring', 'summer', 'autumn', 'winter'] },
      chestnut: { item: 'chestnut', seasons: ['autumn'] },
      camellia: { item: 'camellia', seasons: ['winter'] }
    },
    berrySeasons: ['spring', 'summer'],   // when the wild strawberries are ripe

    // ----- Residents (design.md section 5) -----
    // friend: whose heart meter they share (the Mori family shares one) · home: their front door ·
    // plans: their daily routine. The first plan whose "when" fits today is used:
    //   weather: only in this weather · weekend: days 6 and 7 of each season · days: these days of the season ·
    //   fromDay: from this day of the year on.
    // at: [from this hour, at this spot]. A list of spots is a walk from spot to spot.
    // "inside" = indoors at home, unseen. Spots are in js/map-data.js.
    friends: ['gen', 'midori', 'fumiko', 'mori', 'oda', 'hiro', 'kuma', 'rin', 'sato', 'kurokawa'],
    residents: {
      gen: {
        friend: 'gen', legs: 'wide', speed: 30, home: 'genHome',
        plans: [
          { when: { weather: ['typhoon'] }, at: [[0, 'inside']] },
          { when: { weather: ['rain'] }, at: [[6, 'genHome'], [20, 'inside']] },     // repairing tools by his barn
          { at: [[6, 'genPaddy'], [11, 'genHome'], [14, 'shopBenchA'], [17, 'genHome'], [20, 'inside']] }
        ],
        loved: ['persimmon', 'onigiri'], liked: ['sweetPotato', 'tea', 'strawberry', 'chestnut', 'senbei'], disliked: []
      },
      midori: {
        friend: 'midori', legs: 'normal', speed: 38, home: 'midoriHome',
        plans: [
          { when: { weather: ['typhoon'] }, at: [[0, 'inside']] },
          { when: { weekend: true }, at: [[6, 'pondShore'], [9, ['surveyA', 'surveyB']], [15, 'streamside'], [18, 'terraces'], [20, 'inside']] },
          { when: { days: [3] }, at: [[6, 'pondShore'], [9, 'post'], [15, 'streamside'], [18, 'hallMeeting'], [21, 'inside']] },
          { at: [[6, 'pondShore'], [9, 'post'], [15, 'streamside'], [18, 'terraces'], [20, 'inside']] }
        ],
        loved: [], liked: ['komatsuna', 'strawberry', 'onigiri', 'tea', 'chestnut'], disliked: []
      },
      fumiko: {
        friend: 'fumiko', legs: 'wide', speed: 26, home: 'fumikoHome',
        plans: [
          { when: { weather: ['typhoon'] }, at: [[0, 'inside']] },
          { when: { weather: ['rain', 'snow'] }, at: [[0, 'inside'], [12, 'fumikoPorch'], [15, 'inside']] },
          { at: [[6, 'fumikoGarden'], [9, 'shrineSweep'], [12, 'fumikoPorch'], [17, 'inside']] }
        ],
        loved: ['camelliaSeedling', 'manju'], liked: ['daikon', 'strawberry', 'tea', 'camellia', 'chestnut'], disliked: ['coffee']
      },
      aya: {
        friend: 'mori', legs: 'normal', speed: 38, home: 'moriHome',
        plans: [
          { when: { weather: ['typhoon'] }, at: [[0, 'inside']] },
          { when: { weekend: true }, at: [[0, 'inside'], [9, 'riverside'], [12, 'shrineFamily'], [15, 'moriGarden'], [17, 'inside']] },
          { at: [[0, 'inside'], [7.5, 'busWait'], [8.25, 'inside'], [14.75, 'busWait'], [15.5, 'moriGarden'], [17, 'inside']] }
        ],
        loved: ['coffee'], liked: ['tomato', 'tea', 'strawberry', 'manju'], disliked: []
      },
      ken: {
        friend: 'mori', legs: 'normal', speed: 40, home: 'moriHome',
        plans: [
          { when: { weather: ['typhoon'] }, at: [[0, 'inside']] },
          { when: { weekend: true }, at: [[0, 'inside'], [9, 'riverside2'], [12, 'shrineFamily2'], [15, 'moriGarden2'], [17, 'inside']] },
          { at: [[0, 'inside'], [7.5, 'bus'], [18, 'moriGarden2'], [19, 'inside']] }
        ],
        loved: ['tea'], liked: ['cucumber', 'senbei', 'onigiri', 'coffee'], disliked: []
      },
      sora: {
        friend: 'mori', legs: 'child', speed: 34, home: 'moriHome',
        plans: [
          { when: { weather: ['typhoon'] }, at: [[0, 'inside']] },
          { when: { weekend: true }, at: [[0, 'inside'], [9, 'riverside3'], [12, 'shrineFamily3'], [15, 'soraPlay'], [17, 'inside']] },
          { when: { weather: ['rain', 'snow'] }, at: [[0, 'inside'], [7.5, 'bus'], [15, 'inside']] },
          { at: [[0, 'inside'], [7.5, 'bus'], [15, 'soraPlay'], [17, 'inside']] }
        ],
        loved: ['stone', 'ramune'], liked: ['tomato', 'strawberry', 'manju', 'chestnut'], disliked: ['coffee']
      },
      oda: {
        friend: 'oda', legs: 'normal', speed: 32, home: 'odaHome', pet: 'kotetsu', petRoute: 'walkA',
        plans: [
          { when: { weather: ['typhoon'] }, at: [[0, 'inside']] },
          { at: [[6, ['walkA', 'walkB', 'walkC', 'walkB']], [9, 'hall'], [14, ['visitGen', 'visitFumiko', 'visitHome', 'visitMori']], [17, 'inside']] }
        ],
        loved: ['senbei'], liked: ['daikon', 'tea', 'manju', 'persimmon'], disliked: []
      },
      hiro: {
        friend: 'hiro', legs: 'wide', speed: 34, home: 'shopFront',
        plans: [
          { when: { weather: ['typhoon'] }, at: [[0, 'inside']] },
          { when: { days: [3] }, at: [[0, 'inside'], [10, 'riverside4'], [15, 'shopBenchC'], [18, 'inside']] },   // closing day: fishing
          { at: [[6, ['visitFumiko2', 'visitGen2', 'visitKuma']], [9, 'shopFront'], [17, 'inside']] }
        ],
        loved: ['coffee'], liked: ['komatsuna', 'onigiri', 'strawberry', 'chestnut'], disliked: []
      },
      kuma: {
        friend: 'kuma', legs: 'wide', speed: 28, home: 'kumaHome',
        plans: [
          { when: { weather: ['typhoon'] }, at: [[0, 'inside']] },
          { at: [[6, 'sluice'], [8, ['terraceA', 'terraceB']], [15, 'shopBenchB'], [18, 'sluice'], [19, 'inside']] }
        ],
        loved: [], liked: ['cucumber', 'tea', 'onigiri', 'senbei', 'chestnut'], disliked: ['ramune']
      },
      rin: {
        friend: 'rin', legs: 'normal', speed: 46, home: 'fumikoHome',
        plans: [
          { when: { weather: ['typhoon'] }, at: [[0, 'inside']] },
          { when: { weekend: true }, at: [[0, 'inside'], [10, ['rinA', 'rinB', 'rinC', 'rinD']], [17, 'rinShop'], [19, 'inside']] },
          { at: [[0, 'inside'], [8, 'hall'], [12, ['rinA', 'rinB', 'rinC', 'rinD']], [17, 'rinShop'], [19, 'inside']] }
        ],
        loved: ['soySnack'], liked: ['komatsuna', 'strawberry', 'ramune', 'stone'], disliked: ['coffee']
      },
      sato: {
        friend: 'sato', legs: 'normal', speed: 38, home: 'town',
        plans: [
          { when: { weather: ['typhoon'] }, at: [[0, 'inside']] },
          { when: { days: [6] }, at: [[0, 'inside'], [9, ['hikeA', 'hikeB']], [15, 'inside']] },
          { when: { days: [7] }, at: [[0, 'inside']] },
          { when: { days: [2] }, at: [[0, 'inside'], [8.5, 'office'], [10, ['siteFactory', 'siteField']], [13, 'lunch'], [14, 'office'], [17.25, 'inside']] },
          { at: [[0, 'inside'], [8.5, 'office'], [12, 'lunch'], [13, 'office'], [17.25, 'inside']] }
        ],
        loved: ['manju'], liked: ['sweetPotato', 'coffee', 'tea', 'chestnut'], disliked: []
      },
      kurokawa: {
        friend: 'kurokawa', legs: 'normal', speed: 44, home: 'town',
        plans: [
          { when: { fromDay: 3, days: [1, 3, 5], weather: ['sunny', 'cloudy', 'rain', 'snow'] },
            at: [[0, 'inside'], [10, 'slopeTrack'], [12, 'busBench'], [14, 'kuroShop'], [16, 'plaza'], [17, 'inside']] },
          { at: [[0, 'inside']] }
        ],
        loved: ['onigiri'], liked: ['coffee', 'manju'], disliked: []
      }
    },

    // ----- Nature diary (design.md section 8) -----
    // habitat: where it appears · seasons: when · hours: [from, to) · notIn: not in this weather ·
    // max: how many at once · shy: flies off when you run nearby
    species: {
      cabbageWhite: { habitat: 'meadow', seasons: ['spring', 'summer', 'autumn'], hours: [[9, 17]], notIn: ['rain', 'typhoon', 'snow'], max: 3 },
      grassBlue: { habitat: 'gardenMeadow', minGarden: 2, seasons: ['spring', 'summer', 'autumn'], hours: [[9, 17]], notIn: ['rain', 'typhoon', 'snow'], max: 1 },
      tit: { habitat: 'hedge', seasons: ['spring', 'summer', 'autumn', 'winter'], hours: [[6, 11], [15, 18]], notIn: ['rain', 'typhoon'], max: 2, shy: true },
      treeFrog: { habitat: 'waterEdge', seasons: ['spring', 'summer', 'autumn'], hours: [[18, 23]], rainHours: [[6, 23]], notIn: ['typhoon', 'snow'], max: 3 },
      swallow: { habitat: 'nest', seasons: ['spring', 'summer'], hours: [[7, 18]], notIn: ['typhoon'], max: 2, shy: true }
    },
    speciesOrder: ['cabbageWhite', 'grassBlue', 'tit', 'treeFrog', 'swallow'],
    lookSeconds: 2,               // stand still this long to draw an animal into the diary

    // ----- Midori's request: how many swallows' nests are there in the village? -----
    nestCount: 5,
    nestChoices: [3, 4, 5]
  };
})(globalThis);
