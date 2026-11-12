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

  // ----- The palette: 28 colours -----
  const PALETTE = {
    outline: '#5B4636', white: '#FFFDF5', grey: '#D6CFC4', skin0: '#EBBB97', skin1: '#F9DCBF',
    earth0: '#5E4434', earth1: '#A57F5C', earth2: '#E4C99A', earth3: '#F6E8C6',
    green1: '#5E9A50', green2: '#78B25E', green3: '#9FD171', green4: '#CDEA92',
    teal0: '#4E9C93', teal1: '#7CC4B8', water0: '#62A6CA', water1: '#88C9E2', water2: '#DDF3F9',
    panel0: '#4A68A6', panel1: '#6E92CF', panel2: '#B5CFF1', metal0: '#737B88', metal1: '#ABB2BC',
    pink: '#F4A6B8', yellow: '#F6D46A', orange: '#E5A743', lilac: '#C2B1EC',
    red: '#D96A55'   // vermilion, for the shrine's torii gate
  };

  // ----- Which palette colour each letter uses -----
  const ROLES = {
    // Tiles: a b c grass · p q r n earth (path, dark, light, darkest) · u v paddy water · s t seedlings
    //        w x water (base, dark) · P Q R g panel (face, lines, top edge, glint) · F T posts
    //        S shadow · h i j k hedge and trees · o pond edge · l L lily · 1 2 3 4 flowers
    //        d e f roof and stone (gaps, tiles, highlights) · O orange
    //        C D E tree crowns (base, dark, light) · U V X cherry blossom · G gravel · Z vermilion
    tile: {
      a: 'green3', b: 'green2', c: 'green4',
      p: 'earth2', q: 'earth1', r: 'earth3', n: 'earth0',
      u: 'teal1', v: 'teal0', s: 'green4', t: 'green2',
      w: 'water1', x: 'water0', y: 'water2',
      P: 'panel1', Q: 'panel0', R: 'panel2', g: 'white', F: 'metal1', T: 'metal0', S: 'green1',
      h: 'green2', i: 'green1', j: 'green4', k: 'pink',
      o: 'earth1', l: 'green2', L: 'pink',
      1: 'pink', 2: 'yellow', 3: 'lilac', 4: 'earth3',
      d: 'outline', e: 'metal0', f: 'metal1', O: 'orange',
      C: 'green2', D: 'green1', E: 'green4', U: 'pink', V: 'lilac', X: 'white', G: 'grey', Z: 'red'
    },
    // People: K outline · e f skin · 9 eyes · W white · H I hair · C D clothes · E G accent
    //         L legs · M shoes · B binoculars
    people: {
      base: { K: 'outline', e: 'skin1', f: 'skin0', 9: 'outline', W: 'white' },
      player: { H: 'earth0', I: 'earth1', C: 'teal1', D: 'teal0', E: 'yellow', G: 'orange', L: 'panel1', M: 'earth0' },
      gen: { E: 'white', G: 'panel1', H: 'grey', I: 'grey', C: 'earth1', D: 'earth0', L: 'metal0', M: 'panel0' },
      midori: { E: 'green2', G: 'green1', H: 'earth0', I: 'earth1', C: 'earth2', D: 'white', B: 'metal0', L: 'green1', M: 'earth0' },
      fumiko: { H: 'grey', I: 'white', C: 'lilac', D: 'panel1', E: 'white', G: 'grey', L: 'panel0', M: 'earth0' },
      aya: { H: 'earth0', I: 'earth1', C: 'yellow', D: 'orange', E: 'white', L: 'panel1', M: 'white' },
      ken: { H: 'outline', I: 'earth0', E: 'panel1', G: 'panel0', C: 'metal1', D: 'metal0', L: 'panel0', M: 'white' },
      sora: { E: 'yellow', G: 'orange', H: 'earth0', I: 'earth1', C: 'panel2', D: 'panel1', B: 'red', L: 'panel1', M: 'earth0' },
      oda: { H: 'grey', I: 'white', C: 'earth2', D: 'earth1', E: 'white', B: 'metal0', L: 'metal0', M: 'earth0' },
      hiro: { H: 'earth0', I: 'earth1', C: 'white', D: 'grey', E: 'orange', G: 'earth1', L: 'panel0', M: 'earth0' },
      kuma: { E: 'earth0', G: 'earth1', H: 'white', I: 'grey', C: 'teal1', D: 'teal0', L: 'metal0', M: 'panel0' },
      rin: { H: 'outline', I: 'earth0', C: 'pink', D: 'red', E: 'yellow', B: 'metal1', L: 'panel0', M: 'white' },
      sato: { H: 'earth0', I: 'earth1', C: 'panel0', D: 'outline', E: 'white', G: 'red', L: 'panel0', M: 'outline' },
      kurokawa: { H: 'outline', I: 'metal0', C: 'metal0', D: 'outline', E: 'white', G: 'panel1', B: 'earth0', L: 'metal0', M: 'outline' }
    },
    // Animals: K outline · W wings or belly · M grey · G D greens · N navy · R red throat
    critter: { K: 'outline', W: 'white', M: 'metal1', G: 'green4', D: 'green2', N: 'panel0', R: 'orange' },
    // Kotetsu, Mr. Oda's shiba dog: K outline · O fur · W white chest · 9 eyes
    pet: { K: 'outline', O: 'orange', W: 'white', 9: 'outline' },
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
      'aaaaaDDDDDDaaaaa',
      'aaaDDEECCCCDDaaa',
      'aaDEEECCCCCCCDaa',
      'aDEECCCCCCCCCCDa',
      'aDECCCCECCCCCCDa',
      'DECCCCCCCCCCCCCD',
      'DCCCCCCCCCECCCCD',
      'DCCECCCCCCCCCCDD',
      'DCCCCCCCCCCCCDDD',
      'aDCCCCCCCCCCDDDa',
      'aaDDCCCCCCCDDDaa',
      'aaaaDDDqqDDDaaaa',
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
    // A cherry tree (blossoms in spring)
    cherry: [
      'aaaaaVVVVVVaaaaa',
      'aaaVVXXUUUUVVaaa',
      'aaVXXXUUUUUUUVaa',
      'aVXXUUUUXUUUUUVa',
      'aVXUUUUUUUUUUUVa',
      'VXUUUXUUUUUUUUUV',
      'VUUUUUUUUUXUUUUV',
      'VUUXUUUUUUUUUUVV',
      'VUUUUUUUUUUUUVVV',
      'aVUUUUUXUUUUVVVa',
      'aaVVUUUUUUUVVVaa',
      'aaaaVVVnnVVVaaaa',
      'aaaaaaanqaaaaaaa',
      'aaaaaannqqaaaaaa',
      'aaaaaSSSSSSaaaaa',
      'aaaaaaaaaaaaaaaa'
    ],
    // The old zelkova in front of the community hall: the village's "hidamari", a sunny spot
    bigTree: [
      'aDDDDDDDDDDDDDDa',
      'DCCEECCCCCCCCCCD',
      'DCEECCCCCECCCCCD',
      'DCECCCCCCCCCCCDD',
      'DCCCCCECCCCCCCDD',
      'DCCCCCCCCCCCCDDD',
      'aDCCCCCCCCCCDDDa',
      'aaDDDCCCCCDDDDaa',
      'aaaaDDDnnDDDaaaa',
      'aaaaaaannaaaaaaa',
      'aaaaaannnnaaaaaa',
      'aacaaannnnaaacaa',
      'acaaaSnnnnSaaaca',
      'aaccSSSSSSSSccaa',
      'aaaacccccccccaaa',
      'aaaaaaaaaaaaaaaa'
    ],
    // The stone walls of the rice terraces
    stoneWall: [
      'acaabacaacabaaca',
      'bbbbbbbbbbbbbbbb',
      'fffffeffffffefff',
      'fgfffefffgffefff',
      'eeeeeeeeeeeeeeee',
      'ffeffffffeffffff',
      'gfefffbffeffgfff',
      'eeeeeeeeeeeeeeee',
      'fffffffeffffffef',
      'ffgffffeffbfffef',
      'eeeeeeeeeeeeeeee',
      'ffffeffffffffeff',
      'fbffeffgffffbeff',
      'eeeeeeeeeeeeeeee',
      'dddddddddddddddd',
      'SSSSSSSSSSSSSSSS'
    ],
    // Stone steps
    steps: [
      'ffffffffffffffff',
      'ffffffffffffffff',
      'fgffffgfffffgfff',
      'eeeeeeeeeeeeeeee',
      'ffffffffffffffff',
      'fffbffffffffffff',
      'fgffffgfffffgfff',
      'eeeeeeeeeeeeeeee',
      'ffffffffffffffff',
      'ffffffffffffbfff',
      'fgffffgfffffgfff',
      'eeeeeeeeeeeeeeee',
      'ffffffffffffffff',
      'ffffffbfffffffff',
      'fgffffgfffffgfff',
      'eeeeeeeeeeeeeeee'
    ],
    // Shrine gravel
    gravel: [
      'GgGGfgGGgGGGGGGG',
      'GGGGgGgGGGGGGfGG',
      'ffGGGGGfGGGGGGGG',
      'GGGGGGGGGGGGGGGG',
      'GGGGGGfGfGGGGGGG',
      'GGGGGgGGGfGGffGG',
      'GGGGGGGGGGfGGGgG',
      'GGGGGGGGGGGGGGGG',
      'gGGGGGGGGfGGGGGG',
      'GfGGfGGGGGGGfGGG',
      'GGgGGGfGgGGfGGGG',
      'fGGGGGGGGGGGfGfG',
      'GGGfGGGGGGGGGGGG',
      'GGGGgGGGGGGGGfGG',
      'gGGGGGGfGgGGGgGG',
      'fGGGGGGGGGGGGGGG'
    ],
    // The torii gate of the shrine (left half; the right half is its mirror image)
    toriiL: [
      'ddGGGGGGGGGGGGGG',
      'dddddddddddddddd',
      'Gddddddddddddddd',
      'GGZZZZZZZZZZZZZZ',
      'GGGGGZZnGGGGGGGG',
      'GGZZZZZZZZZZZZZZ',
      'GGGGGZZnGGGGGGGG',
      'GfGGGZZnGGGGGGGG',
      'GGGGGZZnGGGGGGGG',
      'GGGGGZZnGGGGGGGf',
      'GGGGGZZnGGGGGGGG',
      'GGGGGZZnGGGGGGGf',
      'GGGGGZZnGGGGGGGG',
      'GGGGGZZnGGGGGGGf',
      'GGfGGZZnGGfGGGGG',
      'GGGGddddGGGGGGGG'
    ],
    toriiR: [
      'GGGGGGGGGGGGGGdd',
      'dddddddddddddddd',
      'dddddddddddddddG',
      'ZZZZZZZZZZZZZZGG',
      'GGGGGGGGnZZGGGGG',
      'ZZZZZZZZZZZZZZGG',
      'GGGGGGGGnZZGGGGG',
      'GGGGGGGGnZZGGGfG',
      'GGGGGGGGnZZGGGGG',
      'fGGGGGGGnZZGGGGG',
      'GGGGGGGGnZZGGGGG',
      'fGGGGGGGnZZGGGGG',
      'GGGGGGGGnZZGGGGG',
      'fGGGGGGGnZZGGGGG',
      'GGGGGfGGnZZGGfGG',
      'GGGGGGGGddddGGGG'
    ],
    // Abandoned farmland, overgrown with weeds
    weeds: [
      'qqqqqqqqqqqqqqqq',
      'qqqqqqqqqcqqqqqq',
      'qqcqqqpqbtbqqqqq',
      'qbtbqqqqqqqqqqqq',
      'qqqqqqnqqqqqqnqq',
      'qqqqqpqqqqqqqqpq',
      'qqqqqqqqpqqqcqqq',
      'qqqqpcppqqqbtbqq',
      'qpqqbtbqqqqpnqqq',
      'qqqqpqnqqqqqpqqq',
      'qqqqqqqqqqqqqqqn',
      'qqcqqqqqqqqqqqqq',
      'qbtbqqqqqcqpqqqq',
      'qqqqqqqqbtbqqqcq',
      'qpqpqqcqpqqpqbtb',
      'qnqqpbtbqqqqqqnq'
    ],
    // Concrete of the old factory site
    concrete: [
      'FFFFFFFTFFFFFFFF',
      'FFFFFFFTFFFFFFFF',
      'FFdFFFFTFFFFFFFF',
      'FFFddFFTFFFFFFFF',
      'FFFFFdFTFFFFgFFF',
      'FFFFFFFTFFFFFFFF',
      'FFFFFFFTFFFFFFFF',
      'TTTTTTTTTTTTTTTT',
      'FFFFFFFTFFFFFFFF',
      'FFFFFFFTFFFFFFFF',
      'FFFFgFFTFFFdFFFF',
      'FFFFFFFTFFFFdFFF',
      'FFbFFFFTFFFFdFFF',
      'FFFbFFFTFFFFFdFF',
      'FFFFFFFTFFFFFFFF',
      'TTTTTTTTTTTTTTTT'
    ],
    // Rubble on the old factory site
    rubble: [
      'FFFFFFFTFFFFFFFF',
      'FFFFFFFTFFFFFFFF',
      'FFdFeeeTFFFFFFFF',
      'FFFeTTTeFFFFFFFF',
      'FFeTgTTTeFFFgFFF',
      'FFeTTTTTeFFeeFFF',
      'FFFeeeeeFFeTTeFF',
      'TTTTTTTTTTeTgTeT',
      'FFFFFFFTFFFeeeFF',
      'FFFFFFFTFFFFFFFF',
      'FFFFeeFTFFFdFFFF',
      'FFFeTTeTFFFFdFFF',
      'FFeTgTTeFFFFeeeF',
      'FFFeeeeTFFFeTTTe',
      'FFFFFFFTFFFFeeeF',
      'TTTTTTTTTTTTTTTT'
    ],
    // A wooden fence
    fence: [
      'acaaaaaaaaaaaaaa',
      'aaaaaaaaaaaaaaaa',
      'aaaaaaaaaaaaaaaa',
      'anqaaaaaaaaaanqa',
      'anqaaaaaaaaaanqa',
      'qqqqqqqqqqqqqqqq',
      'nnnnnnnnnnnnnnnn',
      'anqbaaaaaaaaanqa',
      'anqaaaaaaaaaanqa',
      'anqaaaaaaaaaanqa',
      'qqqqqqqqqqqqqqqq',
      'nnnnnnnnnnnnnnnn',
      'anqaaaaaaaaaanqa',
      'anqaaaaaaaaaanqa',
      'anqabaaaaaaaanqa',
      'aSSSaaaaaaaaSSSa'
    ],
    // A wooden bench
    bench: [
      'aaaaaaaaaaaaaaaa',
      'aaaaaaaaaaaaaaaa',
      'aaaaaaaaaaaaaaaa',
      'aaaacaaaaaaaaaaa',
      'annnnnnnnnnnnnna',
      'aqqqqqqqqqqqqqqa',
      'aqqqqqqqqqqqqqqa',
      'aanaaaaaaaaaanaa',
      'nnnnnnnnnnnnnnnn',
      'pppppppppppppppp',
      'qqqqqqqqqqqqqqqq',
      'aanaaaaaaaaaanac',
      'aanaaaaaaaaaanaa',
      'aanaaaaaaaaaanaa',
      'aSSSSSSSSSSSSSSa',
      'abaaaaaaaaaaaaaa'
    ],
    // The bus stop sign
    busStop: [
      'aaaaaddddddaaaaa',
      'aaaadPPPPPPdaaaa',
      'aabdPPggggPPdaaa',
      'aaadPPPPPPPPdaaa',
      'aaadPPggggPPdaaa',
      'aaaadPPPPPPdaaaa',
      'aaaaaddddddaaaaa',
      'aaaacaaTFaaaaaaa',
      'aaaaaaaTFaaaaaaa',
      'aaaaaaaTFaaaaaaa',
      'aaaaaaaTFaaaaaaa',
      'aaaaaaaTFaaaaaaa',
      'aaaacaaTFaaaaaaa',
      'aaaaaaaTFbaaaaaa',
      'aaaaaaaTFaaaaaaa',
      'aaaaaSSSSSSaaaaa'
    ],

    // The shop's wall with its sign
    shopSign: [
      'nrrrrrrrrrrrrrrr',
      'nrnnnnnnnnnnnnrr',
      'nrnOOOOOOOOOOnrr',
      'nrnOgOgggOggOnrr',
      'nrnOOOOOOOOOOnrr',
      'nrnOggOgOgggOnrr',
      'nrnOOOOOOOOOOnrr',
      'nrnnnnnnnnnnnnrr',
      'nnnnnnnnnnnnnnnn',
      'nqqqnqqqnqqqnqqq',
      'nqqqnqqqnqqqnqqq',
      'nqqqnqqqnqqqnqqq',
      'nqqqnqqqnqqqnqqq',
      'nqqqnqqqnqqqnqqq',
      'nqqqnqqqnqqqnqqq',
      'nqqqnqqqnqqqnqqq'
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
    },
    // Fumiko-san: grey hair in a bun, lilac cardigan, white apron, work trousers
    fumiko: {
      legs: 'wide',
      down: [
        '................',
        '......KKKK......',
        '......KHHK......',
        '....KKKHHKKK....',
        '...KHHHHHHHHK...',
        '...KHIeeeeIHK...',
        '...KHe9ee9eHK...',
        '....KeeffeeK....',
        '.....KKeeKK.....',
        '....KCEEEECK....',
        '...KCCEEEECCK...',
        '..KCKCEEEECKCK..',
        '..KeKCEEEECKeK..'
      ],
      up: [
        '................',
        '......KKKK......',
        '......KHHK......',
        '....KKKIIKKK....',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '....KHHHHHHK....',
        '.....KKeeKK.....',
        '....KCCGGCCK....',
        '...KCCCGGCCCK...',
        '..KCKCCCCCCKCK..',
        '..KeKCCCCCCKeK..'
      ],
      side: [
        '................',
        '................',
        '..KKK...........',
        '.KHHHKKKKKKK....',
        '.KHHKHHHHHHHK...',
        '..KKKHHHIeeeK...',
        '....KHHHee9eK...',
        '....KHHeeeefK...',
        '.....KKeeKK.....',
        '.....KCEEEK.....',
        '.....KCEEGK.....',
        '.....KCDEEK.....',
        '.....KCeEEK.....'
      ]
    },
    // Aya: shoulder-length hair, mustard cardigan over a white shirt
    aya: {
      legs: 'normal',
      down: [
        '................',
        '.....KKKKKK.....',
        '....KHHHHHHK....',
        '...KHHHHHHHHK...',
        '...KHIHHHHIHK...',
        '..KHHeeeeeeHHK..',
        '..KHHe9ee9eHHK..',
        '..KHHeeeeeeHHK..',
        '..KHHKKffKKHHK..',
        '...KKCEEEECKK...',
        '...KCCEEEECCK...',
        '..KCKCEEEECKCK..',
        '..KeKCCDDCCKeK..'
      ],
      up: [
        '................',
        '.....KKKKKK.....',
        '....KHHHHHHK....',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '..KHHHHHHHHHHK..',
        '..KHHHHHHHHHHK..',
        '..KHHHIHHIHHHK..',
        '..KHHHHHHHHHHK..',
        '...KKCCCCCCKK...',
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
        '..KHHHHHIeeeK...',
        '..KHHHHHee9eK...',
        '..KHHHHKeeeK....',
        '..KHHHKKffKK....',
        '...KKKCEEEK.....',
        '.....KCEEEK.....',
        '.....KCDCCK.....',
        '.....KCeCCK.....'
      ]
    },
    // Ken: blue baseball cap, grey sweatshirt
    ken: {
      legs: 'normal',
      down: [
        '................',
        '.....KKKKKK.....',
        '....KEEEEEEK....',
        '...KEEEEEEEEK...',
        '...KGGGGGGGGK...',
        '...KHeeeeeeHK...',
        '...KHe9ee9eHK...',
        '....KeeeeeeK....',
        '.....KKffKK.....',
        '....KCCCCCCK....',
        '...KCCCCCCCCK...',
        '..KCKCCDDCCKCK..',
        '..KeKCCCCCCKeK..'
      ],
      up: [
        '................',
        '.....KKKKKK.....',
        '....KEEEEEEK....',
        '...KEEEEEEEEK...',
        '...KEEEGGEEEK...',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '....KHHHHHHK....',
        '.....KKffKK.....',
        '....KCCCCCCK....',
        '...KCCCCCCCCK...',
        '..KCKCCDDCCKCK..',
        '..KeKCCCCCCKeK..'
      ],
      side: [
        '................',
        '.....KKKKKK.....',
        '....KEEEEEEK....',
        '...KEEEEEEEEK...',
        '...KEEEEEGGGGGK.',
        '...KHHHHIeeeK...',
        '...KHHHHee9eK...',
        '....KHHHeeeK....',
        '.....KKffKK.....',
        '.....KCCCCK.....',
        '.....KCCCCK.....',
        '.....KCDCCK.....',
        '.....KCeCCK.....'
      ]
    },
    // Sora (7): yellow school hat and a red school backpack (randoseru)
    sora: {
      legs: 'child',
      down: [
        '................',
        '................',
        '................',
        '......KKKK......',
        '.....KEEEEK.....',
        '....KEEEEEEK....',
        '....KGGGGGGK....',
        '....KHeeeeHK....',
        '....Ke9ee9eK....',
        '.....KeffeK.....',
        '.....KKCCKK.....',
        '....KCCCCCCK....',
        '....KeCCCCeK....'
      ],
      up: [
        '................',
        '................',
        '................',
        '......KKKK......',
        '.....KEEEEK.....',
        '....KEEEEEEK....',
        '....KEEGGEEK....',
        '....KHHHHHHK....',
        '....KHHHHHHK....',
        '.....KHHHHK.....',
        '....KKBBBBKK....',
        '....KBBBBBBK....',
        '....KeBBBBeK....'
      ],
      side: [
        '................',
        '................',
        '................',
        '......KKKK......',
        '.....KEEEEK.....',
        '....KEEEEEEK....',
        '....KEEEGGGGK...',
        '....KHHHIeeK....',
        '....KHHHe9eK....',
        '.....KHeeefK....',
        '.....KBKCCK.....',
        '....KBBKCCK.....',
        '....KBBKeCK.....'
      ]
    },
    // Mr. Oda: tidy grey hair, glasses, beige jacket
    oda: {
      legs: 'normal',
      down: [
        '................',
        '.....KKKKKK.....',
        '....KHHHHHHK....',
        '...KHHHHHHHHK...',
        '...KHHIHHHHHK...',
        '...KHeeeeeeHK...',
        '...KHB9BB9BHK...',
        '....KeeffeeK....',
        '.....KKeeKK.....',
        '....KCCEECCK....',
        '...KCCCEECCCK...',
        '..KCKCCDDCCKCK..',
        '..KeKCCCCCCKeK..'
      ],
      up: [
        '................',
        '.....KKKKKK.....',
        '....KHHHHHHK....',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '....KHHHHHHK....',
        '.....KKeeKK.....',
        '....KCCCCCCK....',
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
        '...KHHHHeB9BK...',
        '....KHHHeeeK....',
        '.....KKeeKK.....',
        '.....KCCEEK.....',
        '.....KCCCCK.....',
        '.....KCDCCK.....',
        '.....KCeCCK.....'
      ]
    },
    // Hiro: brown moustache, orange shop apron over a white shirt
    hiro: {
      legs: 'wide',
      down: [
        '................',
        '.....KKKKKK.....',
        '....KHHHHHHK....',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KeeeeeeeeK...',
        '...Ke9eeee9eK...',
        '...KeeIIIIeeK...',
        '....KKeeeeKK....',
        '..KCCEEEEEECCK..',
        '..KCCEEEEEECCK..',
        '..KCKEEEEEEKCK..',
        '..KeKEEEEEEKeK..'
      ],
      up: [
        '................',
        '.....KKKKKK.....',
        '....KHHHHHHK....',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KeHHHHHHeK...',
        '....KKeeeeKK....',
        '..KCCCGGGGCCCK..',
        '..KCCCCCCCCCCK..',
        '..KCKCCCCCCKCK..',
        '..KeKCCCCCCKeK..'
      ],
      side: [
        '................',
        '.....KKKKKK.....',
        '....KHHHHHHK....',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHHHHeeeeK...',
        '...KHHHHee9eK...',
        '...KHHHeeIIIK...',
        '....KKKeeeK.....',
        '....KCCEEEEK....',
        '....KCCEEEEK....',
        '....KCDCEEEK....',
        '....KCeCEEEK....'
      ]
    },
    // Kuma-san: knitted cap, big grey beard, padded vest, rubber boots
    kuma: {
      legs: 'wide',
      down: [
        '................',
        '....KKKKKKKK....',
        '...KEEEEEEEEK...',
        '...KEGEGEGEGK...',
        '...KEEEEEEEEK...',
        '...KeeeeeeeeK...',
        '...Ke9eeee9eK...',
        '...KIIeffeIIK...',
        '...KIIIIIIIIK...',
        '..KCKIIIIIIKCK..',
        '..KCCKIIIIKCCK..',
        '..KCKCCCCCCKCK..',
        '..KeKCCDDCCKeK..'
      ],
      up: [
        '................',
        '....KKKKKKKK....',
        '...KEEEEEEEEK...',
        '...KEGEGEGEGK...',
        '...KEEEEEEEEK...',
        '...KEEEEEEEEK...',
        '...KeHHHHHHeK...',
        '...KHHHHHHHHK...',
        '...KKeeeeeeKK...',
        '..KCCCCCCCCCCK..',
        '..KCCCCCCCCCCK..',
        '..KCKCCDDCCKCK..',
        '..KeKCCCCCCKeK..'
      ],
      side: [
        '................',
        '....KKKKKKKK....',
        '...KEEEEEEEEK...',
        '...KEGEGEGEGK...',
        '...KEEEEEEEEK...',
        '...KHHHHeeeeK...',
        '...KHHHHee9eK...',
        '...KHHHIIeeeK...',
        '...KHHIIIIIIK...',
        '....KKIIIIIK....',
        '....KCCIIICK....',
        '....KCDCCCCK....',
        '....KCeCCCCK....'
      ]
    },
    // Rin: dark hair with long bangs, pink hoodie, headphones, a sun badge
    rin: {
      legs: 'normal',
      down: [
        '................',
        '.....KKKKKK.....',
        '....KHHHHHHK....',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHe9ee9eHK...',
        '...KHeeeeeeHK...',
        '...KHKBffBKHK...',
        '....KBBCCBBK....',
        '...KCCCCCCECK...',
        '..KCKCCDDCCKCK..',
        '..KeKCCCCCCKeK..'
      ],
      up: [
        '................',
        '.....KKKKKK.....',
        '....KHHHHHHK....',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHHHIIHHHK...',
        '...KHHHHHHHHK...',
        '...KHKBBBBKHK...',
        '....KCCCCCCK....',
        '...KCCDDDDCCK...',
        '..KCKCCCCCCKCK..',
        '..KeKCCCCCCKeK..'
      ],
      side: [
        '................',
        '.....KKKKKK.....',
        '....KHHHHHHK....',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHHHHee9eK...',
        '...KHHHHeeeK....',
        '...KHHKBffK.....',
        '....KCKBBCK.....',
        '.....KCCECK.....',
        '.....KCDCCK.....',
        '.....KCeCCK.....'
      ]
    },
    // Ms. Sato: neat bob, navy blazer, white blouse, red ID lanyard
    sato: {
      legs: 'normal',
      down: [
        '................',
        '.....KKKKKK.....',
        '....KHHHHHHK....',
        '...KHHHHHHHHK...',
        '...KHIHHHHHHK...',
        '...KHeeeeeeHK...',
        '...KHe9ee9eHK...',
        '...KHeeeeeeHK...',
        '...KHKKffKKHK...',
        '....KCEEEECK....',
        '...KCCEGGECCK...',
        '..KCKCCGGCCKCK..',
        '..KeKCCCCCCKeK..'
      ],
      up: [
        '................',
        '.....KKKKKK.....',
        '....KHHHHHHK....',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHKKeeKKHK...',
        '....KCCCCCCK....',
        '...KCCCCCCCCK...',
        '..KCKCCCCCCKCK..',
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
        '...KHHHHeeeK....',
        '...KHHKKffK.....',
        '.....KCCEEK.....',
        '.....KCCGEK.....',
        '.....KCDCCK.....',
        '.....KCeCCK.....'
      ]
    },
    // Mr. Kurokawa: slicked-back hair, grey suit, blue company tie, briefcase
    kurokawa: {
      legs: 'normal',
      down: [
        '................',
        '.....KKKKKK.....',
        '....KHHHHHHK....',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHeeeeeeHK...',
        '...KHe9ee9eHK...',
        '....KeeffeeK....',
        '.....KKeeKK.....',
        '....KCEGGECK....',
        '...KCCEGGECCK...',
        '..KCKCCGGCCKCK..',
        '..KeKCCCCCCKeB..'
      ],
      up: [
        '................',
        '.....KKKKKK.....',
        '....KHHHHHHK....',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '...KHHHHHHHHK...',
        '....KHHHHHHK....',
        '.....KKeeKK.....',
        '....KCCCCCCK....',
        '...KCCCDDCCCK...',
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
        '.....KCEGCK.....',
        '.....KCEGCK.....',
        '.....KCDCCK.....',
        '.....KCeBBK.....'
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
    },
    // A child: shorts and short legs
    child: {
      front: {
        stand: ['.....KLLLLK.....', '.....KeKKeK.....', '.....KMKKMK.....'],
        step: ['.....KLLLLK.....', '.....KeKKMK.....', '.....KMKKKK.....']
      },
      side: {
        stand: ['......KLLK......', '......KeeK......', '......KMMMK.....'],
        step: ['......KLLK......', '.....KeKKeK.....', '....KMK..KMK....']
      }
    }
  };

  const EMPTY = '................';
  const pad = (top, rows) => [...Array(top).fill(EMPTY), ...rows, ...Array(16 - top - rows.length).fill(EMPTY)];

  // ----- Kotetsu, Mr. Oda's shiba dog (two walking frames for each direction) -----
  const PETS = {
    kotetsu: {
      down: [
        pad(8, ['.....K....K.....', '....KOK..KOK....', '....KOOKKOOK....', '....KO9OO9OK....', '....KOOKKOOK....', '.....KWWWWK.....', '....KOWWWWOK....', '....KK....KK....']),
        pad(8, ['.....K....K.....', '....KOK..KOK....', '....KOOKKOOK....', '....KO9OO9OK....', '....KOOKKOOK....', '.....KWWWWK.....', '....KOWWWWOK....', '.....KK..KK.....'])
      ],
      up: [
        pad(8, ['.....K....K.....', '....KOK..KOK....', '....KOOOOOOK....', '....KOOOOOOK....', '.....KOOOOK.....', '....KOOOOOOK....', '....KOOKKOOK....', '....KK....KK....']),
        pad(8, ['.....K....K.....', '....KOK..KOK....', '....KOOOOOOK....', '....KOOOOOOK....', '.....KOOOOK.....', '....KOOOOOOK....', '....KOOKKOOK....', '.....KK..KK.....'])
      ],
      side: [
        pad(9, ['..K........KK...', '.KOK......KOOK..', '.KOOKKKKKKOO9OK.', '..KOOOOOOOOOOOKK', '..KOOOOOOOWWWK..', '..KOK.KOK.KOK...', '..KK..KK..KK....']),
        pad(9, ['..K........KK...', '.KOK......KOOK..', '.KOOKKKKKKOO9OK.', '..KOOOOOOOOOOOKK', '..KOOOOOOOWWWK..', '...KOK.KOK.KOK..', '...KK..KK..KK...'])
      ]
    }
  };

  // ----- Animals for the nature diary (two animation frames each) -----
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
    // A sparkle on things you can pick or find
    item: pad(4, [
      '.......Y........',
      '......YWY.......',
      '....YYWWWYY.....',
      '......YWY.......',
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

  // ----- The four seasons -----
  // Spring uses the colours above. The other seasons change some tile colours:
  // roles = for all tiles, tiles = only for one tile. tools/make-sprites.js makes a
  // separate drawing for each season where something changes (for example "tile.tree@autumn").
  const SEASONS = {
    summer: {
      roles: {
        a: 'green2', b: 'green1', c: 'green3', S: 'teal0', h: 'green1', i: 'teal0', j: 'green2',
        C: 'green1', D: 'teal0', E: 'green2', U: 'green1', V: 'teal0', X: 'green2', s: 'green3', t: 'green1', l: 'green1'
      },
      tiles: {}
    },
    autumn: {
      roles: {
        b: 'green2', c: 'yellow', C: 'orange', D: 'earth1', E: 'yellow', U: 'red', V: 'earth1', X: 'orange',
        u: 'yellow', v: 'orange', s: 'earth3', t: 'earth1', 1: 'pink', 2: 'white', 3: 'lilac'
      },
      tiles: { paddy: { y: 'earth3' } }    // golden rice, ready for harvest
    },
    winter: {
      roles: {
        a: 'white', b: 'grey', c: 'water2', S: 'water2', h: 'green1', i: 'teal0', j: 'white', k: 'pink',
        C: 'white', D: 'grey', E: 'white', U: 'white', V: 'grey', X: 'white', G: 'white', f: 'white',
        u: 'white', v: 'grey', s: 'earth2', t: 'earth1', l: 'grey', 1: 'white', 2: 'white', 3: 'grey', 4: 'white'
      },
      tiles: { paddy: { y: 'white' } }     // snow on the empty paddies
    }
  };

  HM.SPRITE_DATA = { PALETTE, ROLES, TILES, PEOPLE, LEGS, PETS, CRITTERS, SPECIES_ART, UI, SEASONS };
})(globalThis);
