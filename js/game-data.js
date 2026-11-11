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
    berrySeasons: ['spring', 'summer'],   // when the wild strawberries are ripe

    // ----- Residents -----
    // Where they are: from this hour on, at this spot (js/map-data.js). "inside" = at home, unseen.
    residents: {
      gen: {
        legs: 'wide', speed: 30,
        schedule: [[6, 'genPaddy'], [11, 'genHome'], [14, 'genTree'], [17, 'genHome'], [20, 'inside']],
        home: 'genHome',
        loved: ['persimmon', 'onigiri'], liked: ['tea', 'strawberry'], disliked: []
      },
      midori: {
        legs: 'normal', speed: 38,
        schedule: [[6, 'pondShore'], [9, 'post'], [15, 'streamside'], [18, 'terraces'], [20, 'inside']],
        home: 'midoriHome',
        loved: [], liked: ['strawberry', 'onigiri', 'tea'], disliked: []
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
