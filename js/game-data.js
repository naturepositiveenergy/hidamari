// Hidamari: the game's numbers and lists for the Phase 1 test.
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
      lastDay: 3                  // the Phase 1 test lasts 3 days
    },

    // Weather of the 3 test days, and how much power the panels make in it
    days: {
      1: { weather: 'sunny' },
      2: { weather: 'cloudy' },
      3: { weather: 'rain' }
    },
    weatherPower: { sunny: 1, cloudy: 0.5, rain: 0.2 },

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
    // cost in yen · power per sunny day · nature points · needs an item from your bag
    buildTiles: {
      dense: { cost: 20000, power: 10, nature: 0 },
      spaced: { cost: 24000, power: 7, nature: 1, natureType: true },
      hedge: { cost: 2000, power: 0, nature: 3, natureType: true, needs: 'seedling' },
      meadow: { cost: 500, power: 0, nature: 2, natureType: true }
    },
    buildOrder: ['dense', 'spaced', 'hedge', 'meadow'],
    varietyBonus: 5,              // nature points for each different nature tile type after the first

    // ----- Friendship (design.md section 6) -----
    hearts: { pointsPerHeart: 100, max: 5 },
    points: { talk: 10, loved: 50, liked: 25, neutral: 10, disliked: -20, request: 40, event: 30, wrongAnswer: 10 },

    // ----- Your bag -----
    items: {
      onigiri: { gift: true },
      tea: { gift: true },
      persimmon: { gift: true },
      strawberry: { gift: true },
      seedling: { gift: false }
    },
    startBag: { onigiri: 2, tea: 2, persimmon: 1, seedling: 4 },

    // ----- Residents -----
    // Where they are: from this hour on, at this spot ("away" = gone to the village, "inside" = at home)
    residents: {
      gen: {
        legs: 'wide', speed: 30,
        schedule: [[6, 'genPaddy'], [11, 'genHome'], [14, 'genTree'], [17, 'genHome'], [20, 'inside']],
        home: 'genHome',
        loved: ['persimmon', 'onigiri'], liked: ['tea', 'strawberry'], disliked: []
      },
      midori: {
        legs: 'normal', speed: 38,
        schedule: [[6, 'pondShore'], [9, 'away'], [15, 'meadowEast'], [18, 'bridge'], [20, 'away']],
        home: 'exitEast',
        loved: [], liked: ['strawberry', 'onigiri', 'tea'], disliked: []
      }
    },

    // ----- Nature diary (design.md section 8) -----
    // habitat: where it appears · hours: [from, to) · weather: only in this weather ·
    // max: how many at once · shy: flies off when you run nearby
    species: {
      cabbageWhite: { habitat: 'meadow', hours: [[9, 17]], notIn: ['rain'], max: 2 },
      grassBlue: { habitat: 'gardenMeadow', minGarden: 2, hours: [[9, 17]], notIn: ['rain'], max: 1 },
      tit: { habitat: 'hedge', hours: [[6, 11], [15, 18]], notIn: ['rain'], max: 1, shy: true },
      treeFrog: { habitat: 'waterEdge', hours: [[18, 23]], rainHours: [[6, 23]], max: 2 },
      swallow: { habitat: 'nest', hours: [[7, 18]], max: 1, shy: true }
    },
    speciesOrder: ['cabbageWhite', 'grassBlue', 'tit', 'treeFrog', 'swallow'],
    lookSeconds: 2,               // stand still this long to draw an animal into the diary

    // ----- Midori's request: how many swallows' nests are there? -----
    nestCount: 2
  };
})(globalThis);
