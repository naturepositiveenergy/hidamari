// Hidamari: all pixel art, written as text (art style A, "Sunspot pastel").
//
// Every drawing is a grid of 16 × 16 letters. Each letter is one pixel and stands for a
// role (for example "grass", "outline", "hair"). The ROLES below say which palette colour
// each role uses. A dot (.) is a see-through pixel.
//
// After changing anything here, run   node tools/make-sprites.js   to renew img/sprites.png
// (the picture the game draws from). The automatic checks (node tests/check.js) tell you
// if you forgot.
//
// Special letters:
//   y, z  water shine: y shows in the first animation frame, z in the second
//   9     eyes: they close (turn into skin shade f) when a person blinks
//   K     outline: drawn as a darker shade of the colour next to it (style A's soft outlines)

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};

  // ----- The palette: 27 colours -----
  const PALETTE = {
    outline: '#5B4636', white: '#FFFDF5', grey: '#D6CFC4', skin0: '#EBBB97', skin1: '#F9DCBF',
    earth0: '#5E4434', earth1: '#A57F5C', earth2: '#E4C99A', earth3: '#F6E8C6',
    green1: '#5E9A50', green2: '#78B25E', green3: '#9FD171', green4: '#CDEA92',
    teal0: '#4E9C93', teal1: '#7CC4B8', water0: '#62A6CA', water1: '#88C9E2', water2: '#DDF3F9',
    panel0: '#4A68A6', panel1: '#6E92CF', panel2: '#B5CFF1', metal0: '#737B88', metal1: '#ABB2BC',
    pink: '#F4A6B8', yellow: '#F6D46A', orange: '#E5A743', lilac: '#C2B1EC'
  };

  // ----- Which palette colour each letter uses -----
  const ROLES = {
    // Tiles: a b c grass · p q r n earth (path, dark, light, darkest) · u v paddy water · s t seedlings
    //        w x water (base, dark) · P Q R g panel (face, lines, top edge, glint) · F T posts
    //        S shadow · h i j k hedge and trees · o pond edge · l L lily · 1 2 3 4 flowers
    //        d e f roof (gaps, tiles, highlights) · O orange
    tile: {
      a: 'green3', b: 'green2', c: 'green4',
      p: 'earth2', q: 'earth1', r: 'earth3', n: 'earth0',
      u: 'teal1', v: 'teal0', s: 'green4', t: 'green2',
      w: 'water1', x: 'water0', y: 'water2',
      P: 'panel1', Q: 'panel0', R: 'panel2', g: 'white', F: 'metal1', T: 'metal0', S: 'green1',
      h: 'green2', i: 'green1', j: 'green4', k: 'pink',
      o: 'earth1', l: 'green2', L: 'pink',
      1: 'pink', 2: 'yellow', 3: 'lilac', 4: 'earth3',
      d: 'outline', e: 'metal0', f: 'metal1', O: 'orange'
    },
    // People: K outline · e f skin · 9 eyes · W white · H I hair · C D clothes · E G accent
    //         L legs · M shoes · B binoculars
    people: {
      base: { K: 'outline', e: 'skin1', f: 'skin0', 9: 'outline', W: 'white' },
      player: { H: 'earth0', I: 'earth1', C: 'teal1', D: 'teal0', E: 'yellow', G: 'orange', L: 'panel1', M: 'earth0' },
      gen: { E: 'white', G: 'panel1', H: 'grey', I: 'grey', C: 'earth1', D: 'earth0', L: 'metal0', M: 'panel0' },
      midori: { E: 'green2', G: 'green1', H: 'earth0', I: 'earth1', C: 'earth2', D: 'white', B: 'metal0', L: 'green1', M: 'earth0' }
    },
    // Animals: K outline · W wings or belly · M grey · G D greens · N navy · R red throat
    critter: { K: 'outline', W: 'white', M: 'metal1', G: 'green4', D: 'green2', N: 'panel0', R: 'orange' },
    // Small signs above people and animals, and the build mode cursor
    ui: { K: 'outline', W: 'white', Y: 'yellow', O: 'orange' }
  };

  // ----- Tiles (the ground, plants, panels and houses) -----
  const TILES = {
    grass: [
      'aaaaaaaaaaaaaaaa',
      'aaaaaaaaabaaaaaa',
      'aacaaaaaaaaaaaaa',
      'abcbaaaaaaacaaaa',
      'aaaaaaaaaabcbaaa',
      'aaaabaaaaaaaaaaa',
      'aaaaaacaaaaaaaaa',
      'aaaaabcbaaaaaaaa',
      'aaaaaaaaaaaaaaba',
      'aaaaaaaaaaaaacaa',
      'acaaaaaaaaaabcba',
      'bcbaaaaaaaaaaaaa',
      'aaaaaaaacaaaaaaa',
      'aaaaaaabcbaaaaaa',
      'aaabaaaaaaaaaaaa',
      'aaaaaaaaaaabaaaa'
    ],
    path: [
      'pppppppppppppppp',
      'ppppppppppprpppp',
      'pprppppppppqqppp',
      'pqqppppppppppppp',
      'pppppppppppppppp',
      'pppppprpppppppqp',
      'ppppppqqpppppppp',
      'pppppppppppppppp',
      'ppqpppppppprpppp',
      'pppppppppppqqppp',
      'pppppppppppppppp',
      'pppprppppppppppp',
      'ppppqqpppppppprp',
      'ppppppppppppppqq',
      'pppppppppqpppppp',
      'pppppppppppppppp'
    ],
    paddy: [
      'uuuuuuuuuuuuuuuu',
      'ususuuuuususuuuu',
      'uusuuuuuuusuuuuu',
      'uutvuyyuuutvuuuu',
      'uuuuuuuuuuuuuuuu',
      'uuuuususuuuuusus',
      'uuuuuusuuuuuuusu',
      'uvvuuutvuuzuuutv',
      'uuuuuuuuuuuuuuuu',
      'ususuuuuususuuuu',
      'uusuuuuuuusuuuuu',
      'uutvuuuuuutvzzuu',
      'uuuuuuuuuuuuuuuu',
      'uuuuususuuuuusus',
      'uuuuuusuuuuuuusu',
      'uuuyuutvuuvuuutv'
    ],
    water: [
      'wwwwwwwwwwwwwwww',
      'wwwwwwwwwwwwwwww',
      'wwyyywwwwwwwwwww',
      'wwwxxxwwwwwwwwww',
      'wwwwwwwwwwzzzwww',
      'wwwwwwwwwwwxxxww',
      'wwwwwwwwwwwwwwww',
      'wwwwwwwwwwwwwwww',
      'wwwwwyyywwwwwwww',
      'wwwwwwxxxwwwwwww',
      'wwwwwwwwwwwwzzzw',
      'wwwwwwwwwwwwwxxx',
      'wwwwwwwwwwwwwwww',
      'wzzzwwwwwwwwwwww',
      'wwxxxwwwwyyywwww',
      'wwwwwwwwwwxxxwww'
    ],
    // Two rows of panels close together: nothing grows underneath.
    dense: [
      'RRRRRRRRRRRRRRRR',
      'PggQPPPQPPPQPPPQ',
      'PgPQPPPQPPPQPPPQ',
      'QQQQQQQQQQQQQQQQ',
      'PPPQPPPQPPPQPPPQ',
      'PPPQPPPQPPPQPPPQ',
      'FFFFFFFFFFFFFFFF',
      'SSSSSSSSSSSSSSSS',
      'RRRRRRRRRRRRRRRR',
      'PPPQPPPQPggQPPPQ',
      'PPPQPPPQPgPQPPPQ',
      'QQQQQQQQQQQQQQQQ',
      'PPPQPPPQPPPQPPPQ',
      'PPPQPPPQPPPQPPPQ',
      'FFFFFFFFFFFFFFFF',
      'SSSSSSSSSSSSSSSS'
    ],
    // One row of panels on taller posts: light reaches the plants underneath.
    spaced: [
      'aaaaaacaaaaaaaaa',
      'RRRRRRRRRRRRRRRR',
      'PggQPPPQPPPQPPPQ',
      'QQQQQQQQQQQQQQQQ',
      'PPPQPPPQPPPQPPPQ',
      'FFFFFFFFFFFFFFFF',
      'SSFSSSSSSSSSSFSS',
      'bbFbbbbbbbbbbFbb',
      'aaFaaaacaaaaaFaa',
      'aaTaaaaaaacaaTaa',
      'aaaaasaaaasaaaaa',
      'aaaastsaastsaaaa',
      'aaaaataaaataaaac',
      'aaasaaaasaaaasaa',
      'aastsaastsaastsa',
      'acataaaataaaataa'
    ],
    hedge: [
      'aaaaaaaaaaaaaaaa',
      'aaaaaaaaaaaaaaaa',
      'aaajjjjaaaajjjaa',
      'aajjhhjjaajjhhja',
      'ajhhhhhhjjjhhhhj',
      'jhhkhhhhhhhhhhhj',
      'hhhhhhhjhhhhkhhh',
      'hhhhjhhhhhhhhhhh',
      'hhhhhhhhhkhhhjhh',
      'ihhhhhhhhhhhhhhi',
      'iihhhihhhhhihhii',
      'iiihhiiihhhiiiii',
      'iiiiiiiiiiiiiiii',
      'iiiiiiiiiiiiiiii',
      'SSSSSSSSSSSSSSSS',
      'aaaaaaaaaaaaaaaa'
    ],
    pond: [
      'aaaaaaaaaaaaaaaa',
      'asaaaooooooaaaaa',
      'astoowwwwwwooaaa',
      'atowwwwwwwwwwoaa',
      'aowwwyywwwwwwwoa',
      'aowwwwwwwwllwwoa',
      'owwwwwwwwwlLlwwo',
      'owwwwwwwwwwlwwwo',
      'owwzzwwwwwwwwwwo',
      'owwwwwwwwwwwwwwo',
      'aowwwwwwwwwyywoa',
      'aoxwwwwwwwwwwxoa',
      'aaoxxwwwwwwxxoaa',
      'aaaooxxxxxxooaaa',
      'aaaaaooooooaaaaa',
      'aaaaaaaaaaaaaaaa'
    ],
    meadow: [
      'aaaaaaaaaaaaaaaa',
      'aaa1aaaaaaacaa2a',
      'aa141aaa3aaaaaba',
      'aaa1aaaabaaaaaaa',
      'caabaacaaaaa2aaa',
      'aaaaaaaaaaa242aa',
      'aaaaa2aaaaaa2aaa',
      'a3aaabaaaa1abaaa',
      'abaaaaa3aabacaaa',
      'aaaaaa343aaaaaa3',
      'acaaaaa3aaaaaaab',
      'aaa2aaabaacaa1aa',
      'aa242aaaaaaa141a',
      'aaa2aaaaa2aaa1aa',
      'aaabaacaabaaabaa',
      'aaaaaaaaaaaaaaac'
    ],
    tree: [
      'aaaaaiiiiiiaaaaa',
      'aaaiijjhhhhiiaaa',
      'aaijjjhhhhhhhiaa',
      'aijjhhhhhhhhhhia',
      'aijhhhhjhhhhhhia',
      'ijhhhhhhhhhhhhhi',
      'ihhhhhhhhhjhhhhi',
      'ihhjhhhhhhhhhhii',
      'ihhhhhhhhhhhhiii',
      'aihhhhhhhhhhiiia',
      'aaiihhhhhhhiiiaa',
      'aaaaiiiqqiiiaaaa',
      'aaaaaaaqqaaaaaaa',
      'aaaaaaqqqqaaaaaa',
      'aaaaaSSSSSSaaaaa',
      'aaaaaaaaaaaaaaaa'
    ],
    // Soft, freshly dug earth in ridges
    soil: [
      'qpqqqqpqqqqqpqqq',
      'qqqqpqqqqqpqqqqq',
      'nqnnnnnqnnnnnnqn',
      'nnnqnnnnnnqnnnnn',
      'qqpqqqqqpqqqqqpq',
      'qqqqqpqqqqqqpqqq',
      'nnnnnqnnnnnnnqnn',
      'nqnnnnnnnqnnnnnn',
      'qqqqpqqqqqqpqqqq',
      'qpqqqqqqpqqqqqpq',
      'nnnnnnqnnnnnqnnn',
      'nnqnnnnnnqnnnnnn',
      'qqqpqqqqqqqpqqqq',
      'qqqqqqpqqqqqqqpq',
      'nnqnnnnnnnqnnnnn',
      'nnnnnqnnnnnnnnqn'
    ],
    bridge: [
      'nnnnnnnnnnnnnnnn',
      'qqqqqqqqqqqqqqqq',
      'rppqrppqrppqrppq',
      'rnpqrnpqrnpqrnpq',
      'rppqrppqrppqrppq',
      'rppqrppqrppqrppq',
      'rppqrppqrppqrppq',
      'rppqrppqrppqrppq',
      'rppqrppqrppqrppq',
      'rppqrppqrppqrppq',
      'rppqrppqrppqrppq',
      'rppqrppqrppqrppq',
      'rnpqrnpqrnpqrnpq',
      'rppqrppqrppqrppq',
      'qqqqqqqqqqqqqqqq',
      'nnnnnnnnnnnnnnnn'
    ],
    // A wild strawberry bush (クサイチゴ) with ripe berries
    berries: [
      'aaaaaaaaaaaaaaaa',
      'aaaaaaaaaaaaaaaa',
      'aaaaaaaaaaaaaaaa',
      'aaaaaiiiiiiaaaaa',
      'aaaiihhjhhhiiaaa',
      'aaihhOhhhhOhhiaa',
      'aihhhhhhjhhhhhia',
      'aihOhhhhhhhOhhia',
      'ihhhhhjhhhhhhhhi',
      'ihhhhOhhhOhhhhii',
      'aiihhhhhhhhhiiia',
      'aaaiiiiiiiiiiaaa',
      'aaaaSSSSSSSSaaaa',
      'aaaaaaaaaaaaaaaa',
      'aaaaaaaaaaaaaaaa',
      'aaaaaaaaaaaaaaaa'
    ],
    // Leaves blocking Gen-san's water inlet (his request)
    leaves: [
      'pppppppppppppppp',
      'pppppppppppppppp',
      'pppppppppppppppp',
      'ppppppqOqppppppp',
      'ppppqOOhOqpppppp',
      'pppqOhOOqOqppppp',
      'ppqOOqhOOhOqpppp',
      'pppqhOOqOOqppppp',
      'ppppqqOhqOqppppp',
      'pppppqqqqqpppppp',
      'pppppppppppppppp',
      'pppppppppppppppp',
      'pppppppppppppppp',
      'pppppprppppppppp',
      'pppppppppppppppp',
      'pppppppppppppppp'
    ],
    sign: [
      'aaaaaaaaaaaaaaaa',
      'aaaaaaaaaaaaaaaa',
      'aannnnnnnnnnnnaa',
      'aanrrrrrrrrrrnaa',
      'aanrqqqrqqqqrnaa',
      'aanrrrrrrrrrrnaa',
      'aanrqqqqqrqqrnaa',
      'aanrrrrrrrrrrnaa',
      'aannnnnnnnnnnnaa',
      'aaaaaanqqnaaaaaa',
      'aaaaaanqqnaaaaaa',
      'aaaaaanqqnaaaaaa',
      'aaaaaanqqnaaaaaa',
      'aaaaaanqqnaaaaaa',
      'aaaaaSSSSSSaaaaa',
      'aaaaaaaaaaaaaaaa'
    ],
    letterbox: [
      'aaaaaaaaaaaaaaaa',
      'aaaaaaaaaaaaaaaa',
      'aaaaaaaaaaaaaaaa',
      'aaaaadddddddaaaa',
      'aaaaadOOOOOdaaaa',
      'aaaaadOdddOdaaaa',
      'aaaaadOOOOOdaaaa',
      'aaaaadOOOOOdaaaa',
      'aaaaadddddddaaaa',
      'aaaaaaadndaaaaaa',
      'aaaaaaadndaaaaaa',
      'aaaaaaadndaaaaaa',
      'aaaaaaadndaaaaaa',
      'aaaaaaadndaaaaaa',
      'aaaaaaSSSSSaaaaa',
      'aaaaaaaaaaaaaaaa'
    ],
    roof: [
      'dddddddddddddddd',
      'ffffffffffffffff',
      'feedfeedfeedfeed',
      'feedfeedfeedfeed',
      'feedfeedfeedfeed',
      'dddddddddddddddd',
      'feedfeedfeedfeed',
      'feedfeedfeedfeed',
      'feedfeedfeedfeed',
      'feedfeedfeedfeed',
      'dddddddddddddddd',
      'feedfeedfeedfeed',
      'feedfeedfeedfeed',
      'feedfeedfeedfeed',
      'feedfeedfeedfeed',
      'dddddddddddddddd'
    ],
    eave: [
      'feedfeedfeedfeed',
      'feedfeedfeedfeed',
      'feedfeedfeedfeed',
      'feedfeedfeedfeed',
      'dddddddddddddddd',
      'feedfeedfeedfeed',
      'feedfeedfeedfeed',
      'feedfeedfeedfeed',
      'feedfeedfeedfeed',
      'ffffffffffffffff',
      'fdfffdfffdfffdff',
      'dddddddddddddddd',
      'nppppppppppppppp',
      'nppppppppppppppp',
      'nppppppppppppppp',
      'nppppppppppppppp'
    ],
    // The eave with a swallows' nest under it
    eaveNest: [
      'feedfeedfeedfeed',
      'feedfeedfeedfeed',
      'feedfeedfeedfeed',
      'feedfeedfeedfeed',
      'dddddddddddddddd',
      'feedfeedfeedfeed',
      'feedfeedfeedfeed',
      'feedfeedfeedfeed',
      'feedfeedfeedfeed',
      'ffffffffffffffff',
      'fdfffdfffdfffdff',
      'dddddddddddddddd',
      'nppppnnnnnnppppp',
      'npppppnqqnpppppp',
      'nppppppnnppppppp',
      'nppppppppppppppp'
    ],
    wall: [
      'nrrrrrrrrrrrrrrr',
      'nrrrrrrrrrrrrrrr',
      'nrrrrrrrrrrrrrrr',
      'nrrrrrrrrrrrrrrr',
      'nrrrrrrrrrrrrrrr',
      'nrrrrrrrrrrrrrrr',
      'nrrrrrrrrrrrrrrr',
      'nrrrrrrrrrrrrrrr',
      'nnnnnnnnnnnnnnnn',
      'nqqqnqqqnqqqnqqq',
      'nqqqnqqqnqqqnqqq',
      'nqqqnqqqnqqqnqqq',
      'nqqqnqqqnqqqnqqq',
      'nqqqnqqqnqqqnqqq',
      'nqqqnqqqnqqqnqqq',
      'nqqqnqqqnqqqnqqq'
    ],
    window: [
      'nrrrrrrrrrrrrrrr',
      'nrrnnnnnnnnnnrrr',
      'nrrnggqggqggnrrr',
      'nrrnggqggqggnrrr',
      'nrrnqqqqqqqqnrrr',
      'nrrnggqggqggnrrr',
      'nrrnggqggqggnrrr',
      'nrrnnnnnnnnnnrrr',
      'nnnnnnnnnnnnnnnn',
      'nqqqnqqqnqqqnqqq',
      'nqqqnqqqnqqqnqqq',
      'nqqqnqqqnqqqnqqq',
      'nqqqnqqqnqqqnqqq',
      'nqqqnqqqnqqqnqqq',
      'nqqqnqqqnqqqnqqq',
      'nqqqnqqqnqqqnqqq'
    ],
    door: [
      'nrrrrrrrrrrrrrrr',
      'nrnnnnnnnnnnnnrr',
      'nrnqqqqnnqqqqnrr',
      'nrnwwwwnnwwwwnrr',
      'nrnwwwwnnwwwwnrr',
      'nrnnnnnnnnnnnnrr',
      'nrnwwwwnnwwwwnrr',
      'nrnwwwwnnwwwwnrr',
      'nrnqqqqnnqqqqnrr',
      'nrnqqqqnnqqqqnrr',
      'nrnqqqqnnqqqqnrr',
      'nrnqqqqnnqqqqnrr',
      'nrnqqqqnnqqqqnrr',
      'nrnqqqqnnqqqqnrr',
      'nrnqqqqnnqqqqnrr',
      'nrnqqqqnnqqqqnrr'
    ]
  };

  // ----- People -----
  // Each person has a top part (rows 0–12) for each direction, and shares the legs
  // (rows 13–15) below. "side" faces right; facing left is the same drawing mirrored.
  // Walking uses "stand", "step" and the step mirrored (the other foot).
  const PEOPLE = {
    player: {
      legs: 'normal',
      down: [
        '................',
        '.....KKKKKK.....',
        '....KHHHHHHK....',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHIeeeeIHK...',
        '...KHe9ee9eHK...',
        '....KeeeeeeK....',
        '.....KKffKK.....',
        '....KEEEEEEK....',
        '...KCEGEECCCK...',
        '..KCKCCCCCCKCK..',
        '..KeKCCDDCCKeK..'
      ],
      up: [
        '................',
        '.....KKKKKK.....',
        '....KHHHHHHK....',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHHIHHIHHK...',
        '....KHHHHHHK....',
        '.....KKffKK.....',
        '....KEEEEEEK....',
        '...KCCCCCCCCK...',
        '..KCKCCDDCCKCK..',
        '..KeKCCCCCCKeK..'
      ],
      side: [
        '................',
        '.....KKKKKK.....',
        '....KHHHHHHK....',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHHHHIeeeK...',
        '...KHHHHee9eK...',
        '....KHHHeeeK....',
        '.....KKffKK.....',
        '.....KEEEEK.....',
        '.....KCCEGK.....',
        '.....KCDCCK.....',
        '.....KCeCCK.....'
      ]
    },
    gen: {
      legs: 'wide',
      down: [
        '................',
        '................',
        '.....KKKKKK.....',
        '....KEEGGEEK....',
        '...KEEEEEEEEK...',
        '...KHWeeeeWHK...',
        '...KHe9ee9eHK...',
        '...KHeeffeeHK...',
        '....KeIIIIeK....',
        '.....KKeeKK.....',
        '...KCCCCCCCCK...',
        '..KCKCDCCDCKCK..',
        '..KeKCCCCCCKeK..'
      ],
      up: [
        '................',
        '................',
        '.....KKKKKK.....',
        '....KEEEEEEK....',
        '...KEEEGGEEEK...',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KeHHHHHHeK...',
        '....KHHHHHHK....',
        '.....KKeeKK.....',
        '...KCCCCCCCCK...',
        '..KCKCCDDCCKCK..',
        '..KeKCCCCCCKeK..'
      ],
      side: [
        '................',
        '................',
        '.....KKKKKK.....',
        '....KEEGGEEK....',
        '...KEEEEEEEEK...',
        '...KHHHHWWeeK...',
        '...KHHHHee9eK...',
        '...KHHHeeeefK...',
        '....KHHHIIIK....',
        '.....KKeeKK.....',
        '.....KCCCCK.....',
        '.....KCDCCK.....',
        '.....KCeCCK.....'
      ]
    },
    midori: {
      legs: 'normal',
      down: [
        '................',
        '.....KKKKKK.....',
        '....KEEEEEEK....',
        '...KEEEEEEEEK...',
        '..KGGGGGGGGGGK..',
        '...KHeeeeeeHKK..',
        '...KHe9ee9eHKHK.',
        '....KeeeeeeKKHK.',
        '.....KKffKK..K..',
        '....KCDDDDCK....',
        '...KCCBDDBCCK...',
        '..KCKBBKKBBKCK..',
        '..KeKCCDDCCKeK..'
      ],
      up: [
        '................',
        '.....KKKKKK.....',
        '....KEEEEEEK....',
        '...KEEEEEEEEK...',
        '..KGGGGGGGGGGK..',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '....KHHHHHHK....',
        '.....KKHHKK.....',
        '....KCCHHCCK....',
        '...KCCCKKCCCK...',
        '..KCKCCCCCCKCK..',
        '..KeKCCCCCCKeK..'
      ],
      side: [
        '................',
        '.....KKKKKK.....',
        '....KEEEEEEK....',
        '...KEEEEEEEEK...',
        '..KGGGGGGGGGGGK.',
        '..KHKHHHIeeeK...',
        '..KHKHHHee9eK...',
        '...K.KHHeeeK....',
        '.....KKffKK.....',
        '.....KCDDCK.....',
        '.....KCDBBK.....',
        '.....KCDCCK.....',
        '.....KCeCCK.....'
      ]
    }
  };

  // Legs (rows 13–15) for each kind of figure, direction ("front" = down and up) and pose
  const LEGS = {
    normal: {
      front: {
        stand: ['...KKLLLLLLKK...', '....KLLKKLLK....', '....KMMKKMMK....'],
        step: ['...KKLLLLLLKK...', '....KLLKKMMK....', '....KMMKKKKK....']
      },
      side: {
        stand: ['.....KLLLLK.....', '.....KLLLLK.....', '.....KMMMMMK....'],
        step: ['.....KLLLLK.....', '....KLLKKLLK....', '...KMMK..KMMK...']
      }
    },
    wide: {
      front: {
        stand: ['...KLLLLLLLLK...', '...KLLLKKLLLK...', '...KMMMKKMMMK...'],
        step: ['...KLLLLLLLLK...', '...KLLLKKMMMK...', '...KMMMKKKKKK...']
      },
      side: {
        stand: ['.....KLLLLK.....', '.....KLLLLK.....', '.....KMMMMMK....'],
        step: ['.....KLLLLK.....', '....KLLKKLLK....', '...KMMK..KMMK...']
      }
    }
  };

  // ----- Animals for the nature diary (two animation frames each) -----
  const EMPTY = '................';
  const pad = (top, rows) => [...Array(top).fill(EMPTY), ...rows, ...Array(16 - top - rows.length).fill(EMPTY)];
  const CRITTERS = {
    butterfly: [
      pad(5, [
        '....KKK..KKK....',
        '...KWWWKKWWWK...',
        '...KWKWKKWKWK...',
        '....KWWKKWWK....',
        '.....KWKKWK.....',
        '......K..K......'
      ]),
      pad(5, [
        '......K..K......',
        '.....KWKKWK.....',
        '.....KWKKWK.....',
        '.....KWKKWK.....',
        '......KKKK......'
      ])
    ],
    tit: [
      pad(6, [
        '..........KKK...',
        '.........KWWKK..',
        '....MMMGKKWWK...',
        '...MMMMMGKKKK...',
        '..MMMMMMWKWW....',
        '...MMMMWWKW.....',
        '.....K...K......'
      ]),
      pad(5, [
        '..........KKK...',
        '.........KWWKK..',
        '....MMMGKKWWK...',
        '...MMMMMGKKKK...',
        '..MMMMMMWKWW....',
        '...MMMMWWKW.....'
      ])
    ],
    frog: [
      pad(6, [
        '.....KK..KK.....',
        '....KWKKKKWK....',
        '....KGGGGGGK....',
        '...KGGGGGGGGK...',
        '...KGDGGGGDGK...',
        '..KGGKGGGGKGGK..',
        '..KKK.KKKK.KKK..'
      ]),
      pad(6, [
        '.....KK..KK.....',
        '....KWKKKKWK....',
        '....KGGGGGGK....',
        '...KGGGGGGGGK...',
        '...KGDGWWGDGK...',
        '..KGGKGGGGKGGK..',
        '..KKK.KKKK.KKK..'
      ])
    ],
    swallow: [
      pad(6, [
        '.......KK.......',
        'NN....KRRK....NN',
        '.NNN.KNWWNK.NNN.',
        '..NNNNNWWNNNNN..',
        '....NNNNNNNN....',
        '......NNNN......',
        '......N..N......',
        '.....N....N.....'
      ]),
      pad(6, [
        '.......KK.......',
        '......KRRK......',
        '.....KNWWNK.....',
        '...NNNNWWNNNN...',
        '..NN.NNNNNN.NN..',
        '.N....NNNN....N.',
        '......N..N......',
        '.....N....N.....'
      ])
    ]
  };

  // Which drawing and colours each diary species uses
  const SPECIES_ART = {
    cabbageWhite: { shape: 'butterfly', recolor: {} },
    grassBlue: { shape: 'butterfly', recolor: { W: 'lilac' } },
    tit: { shape: 'tit', recolor: {} },
    treeFrog: { shape: 'frog', recolor: {} },
    swallow: { shape: 'swallow', recolor: {} }
  };

  // ----- Small signs -----
  const UI = {
    // "!" above an animal you can look at closely
    alert: pad(0, [
      '.....KKKKK......',
      '....KWWKWWK.....',
      '....KWWKWWK.....',
      '....KWWKWWK.....',
      '....KWWWWWK.....',
      '....KWWKWWK.....',
      '.....KKKKK......',
      '.......K........'
    ]),
    // A small sun above a resident who has a heart event waiting
    sun: pad(0, [
      '.......Y........',
      '..Y....Y....Y...',
      '...Y.YYYYY.Y....',
      '....YYYYYYY.....',
      '....YYYOYYY.....',
      'YY.YYYOOOYYY.YY.',
      '....YYYOYYY.....',
      '....YYYYYYY.....',
      '...Y.YYYYY.Y....',
      '..Y....Y....Y...',
      '.......Y........'
    ]),
    // The build mode cursor
    cursor: [
      'OOOO........OOOO',
      'O..............O',
      'O..............O',
      'O..............O',
      EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY,
      'O..............O',
      'O..............O',
      'O..............O',
      'OOOO........OOOO'
    ]
  };

  HM.SPRITE_DATA = { PALETTE, ROLES, TILES, PEOPLE, LEGS, CRITTERS, SPECIES_ART, UI };
})(globalThis);
