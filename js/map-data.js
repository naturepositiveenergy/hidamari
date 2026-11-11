// Hidamari: the map of the village (80 × 60 tiles), approved on 10 November 2026.
//
// Each letter is one tile of 16 × 16 pixels. LEGEND says which drawing it uses and whether
// you can walk on it. North is at the top. The village follows the sketch in docs/design.md
// (section 4): forest and mountains in the north, the river in the east, your home in the south-west.

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};

  const ROWS = [
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~TTTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~TTTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~TTTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~TTTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~TTTTTTT',
    'TTTTTTT.~~~~~~~~~~.....TTTTTTTTTTTTT.AAAAAA.TTT....TTTTTTTTTTTTTTTTTTT~~~TTTTTTT',
    'TTTTTTT.~~~~~~~~~~..AAATTTTTTTTTTTTQ.BBBBBB.QTT....TTTTTTTTTTTTTTTTTTT~~~TTTTTTT',
    'TTTTTTT.~~~~~~~~~~..BBBTTTTTTTTTTTTT.WWDWWW.TTT....TTTTTTTTTTTTTTTTTTT~~~TTTTTTT',
    'TTTTTTT.~~~~~~~~~~..WDOTTTTTTTTTTTTT.kkkkkk.TTT....TTTTTTTTTTTTTTTTTTT~~~TTTTTTT',
    'TTTTTTT.~~~~~~~~~~..=..TTTTTTTTTTTTQ.kkkkkk.QTT....TTTTTTTTTTTTTTTTTTT~~~TTTTTTT',
    'TTTTTTT.~~~~~~~~~~..=............TTT.kkkkkk.TTT....TTTTTTTTTTTTTTTTTTT~~~TTTTTTT',
    'TTTTTTT.~~~~~~~~~~..=............TTTQkkkkkkQTTT....TTTTTTTTTTTTTTTTTTT~~~TTTTTTT',
    'TTTTTTT.~~~~~~~~~~..=......T.....TTTTTTIJTTTTTT....TTTTTTTTTTTTTTTTTTT~~~TTTTTTT',
    'TT..................=................QTHHTQ.........TTTTTTTTTTTTTTTTTT~~~TTTTTTT',
    'TT."""""""""""""""""=.........T......TTHHTT.........TTTTTT=TT~~TTTTTTT~~~TTTTTTT',
    'TT."""""""""""""""""=...............QTTHHTTQ...AAAA.TTTTTT=TTT~~TTTTTT~~~TTTTTTT',
    'TT.GGGGGGGGGGGGGGGGG=...T............TTHHTT....BBBB.TTTTTT=TTTT~~TTTTT~~~TTTTTTT',
    'TT..""""""""""""""""=................TTHHTT....WDWO.......=.....~~TTTT~~~TTTTTTT',
    'TT..""""""""""""""""=................TTHHTT.....=.........=......~~TTT~~~TTTTTTT',
    'TT..GGGGGGGGGGGGGGGG=======================================.......~~TT~~~TTTTTTT',
    'TT..."""""""""""""""=...................=..........................~~T~~~TTTTTTT',
    'TT..."""""""""""""""=.hhhhhhhhh.........=...hhhhhh..................~~~~TTTTTTTT',
    'TT...GGGGGGGGGGGGGGG=...............T...=..............T.............~~~TTTTTTTT',
    'TT....""""""""""""""=..........T........=..AAAAAAA.T.................~~~TTTTTTTT',
    'TT....""""""""""""""=...................=..AAAAAAA...................~~~TTTTTTTT',
    'TT....GGGGGGGGGGGGGG=......AAAA..AAAAA..=..BBBBBNB...AAAAA..T........~~~TTTTTTTT',
    'TT..................=......BBBB..BNBBB..=..WOWDWOW...BBBBB...........~~~TTTTTTTT',
    'TT..................=...T..ODWO..WWDMO..=.....=......OWDWO......T....~~~TTTTTTTT',
    'TT..................=.......=.X....=....=.nkkkkkkkkZ...=.............~~~TTTTTTTT',
    'TT..................=.......=......=..S.=.=kkkkkkkk....=..Pn.........~~~TTTTTTST',
    'TT===================================================================###========',
    'TT........T.............................=..................==........~~~TTTTTTTT',
    'TT......................................=.............fffff==fffff...~~~TTTTTTTT',
    'TT.....................AAAA.............=.............fccccccccccf...~~~TTTTTTTT',
    'TT..........vvvvvvvv...BBNB.............=.............fccccccccccf...~~~TTTTTTTT',
    'TT..........vvvvvvvv...WDWO.............=.............fccrcccccccf...~~~TTTTTTTT',
    'TT..........vvvvvvvv....=...............=.............fcccccccrccf...~~~TTTTTTTT',
    'TT..........vvvvvvvv....=.""""""L"""""".=.............fccccccccccf...~~~TTTTTTTT',
    'TT..........vvvvvvvv....=.""""""="""""".=.AAAA..AAAA..fccccccccccf...~~~TTTTTTTT',
    'TT..........vvvvvvvv....=.""""""="""""".=.BBBN..BBBB..fccccccrcccf...~~~TTTTTTTT',
    'TT......T.............T.=.""""""="""""".=.WDWW..WDWW..fcrccccccccf...~~~TTTTTTTT',
    'TT.........,,,AAAA,,,...=.""""""="""""".=============.fccccccccrcf..~~~TTTTTTTTT',
    'TT.........,,,BBBB,,,...=.""""""="""""".=.............fccccccccccf..~~~TTTTTTTTT',
    'TT.AAAA....,,,WDWO,,,...=.""""""="""""".=.............ffffffffffff..~~~TTTTTTTTT',
    'TT.BBNB....,,,,=,,,,,...=.""""""="""""".=.,,,,,,,,,,,,,,,,,,,,,,,,,.~~~TTTTTTTTT',
    'TT.WDOW....,,,,=,,,,,...=.""""""="""""".=.,,,,,,,,,,,,,,,,,,,,,,,,,.~~~TTTTTTTTT',
    'TT.X=..........=........=.""""""="""""".=.,,,,,,,,,,,,,,,,,,,,,,,,,.~~~TTTTTTTTT',
    'TT.======================================.,,,T,,,,,,,,,,,,,,,,,,T,,.~~~TTTTTTTTT',
    'TT....SFFFF..........."""""""""=""""""".=.,,,,,Y,,,,,,,,,,,,,,,,,,,.~~~TTTTTTTTT',
    'TT.....FFFF..........."""""""""=""""""".=.,,,,,,,,,,,,,,,,,,,,,,,,,.~~~TTTTTTTTT',
    'TT.....FFFF..........."""""""""=""""""".=.,,,,,,,,,,T,,,,,,,,,,,,,,.~~~TTTTTTTTT',
    'TT.....FFFF..........."""""""""=""""""".=.,,,,,,,,,,,,,,,,,,,,,,,,,.~~~TTTTTTTTT',
    'TT,,,,,,,,,,,,,,,,,,,."""""""""=""""""".=.,,,,,,,,,,,,,,,,,,,,,,,,,.~~~TTTTTTTTT',
    'TT,,,,,,,,,,,,,,,,,,,."""""""""=""""""".=.,,,,,,,,,,,,,,,,,,Y,,,,,,.~~~TTTTTTTTT',
    'TT,,,Y,,,,,,,,,,,,,,,."""""""""=""""""".=.,,,,,,,,,,,,,,,,T,,,,,,,,.~~~TTTTTTTTT',
    'TT,,,,,,,,,,,Y,,,,,,,."""""""""=""""""".=.,,,,,,,,,,,,,,,,,,,,,,,,,.~~~TTTTTTTTT',
    'TT,,,,,,,,,,,,,,,,,,,."""""""""=""""""".=.,,,,,,,,,,,,,,,,,,,,,,,,,.~~~TTTTTTTTT',
    'TT..................................................................~~~TTTTTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~TTTTTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~TTTTTTTTT'
  ];

  // tile: the drawing · walk: can you walk on it · habitat: which animals live there
  const LEGEND = {
    '.': { tile: 'grass', walk: true },
    ',': { tile: 'meadow', walk: true, habitat: 'meadow' },
    '=': { tile: 'path', walk: true },
    '#': { tile: 'bridge', walk: true },
    'F': { tile: 'soil', walk: true },
    'L': { tile: 'leaves', walk: true },
    'H': { tile: 'steps', walk: true },
    'k': { tile: 'gravel', walk: true },
    'I': { tile: 'toriiL', walk: true },
    'J': { tile: 'toriiR', walk: true },
    'v': { tile: 'weeds', walk: true, habitat: 'meadow' },
    'c': { tile: 'concrete', walk: true },
    'T': { tile: 'tree', walk: false, habitat: 'tree' },
    'Q': { tile: 'cherry', walk: false, habitat: 'tree' },
    'Z': { tile: 'bigTree', walk: false, habitat: 'tree' },
    '~': { tile: 'water', walk: false, habitat: 'water' },
    '"': { tile: 'paddy', walk: false, habitat: 'paddy' },
    'G': { tile: 'stoneWall', walk: false },
    'h': { tile: 'hedge', walk: false, habitat: 'hedge' },
    'Y': { tile: 'berries', walk: false, habitat: 'hedge' },
    'r': { tile: 'rubble', walk: false },
    'f': { tile: 'fence', walk: false },
    'A': { tile: 'roof', walk: false },
    'B': { tile: 'eave', walk: false },
    'N': { tile: 'eaveNest', walk: false, habitat: 'nest' },
    'W': { tile: 'wall', walk: false },
    'M': { tile: 'shopSign', walk: false },
    'O': { tile: 'window', walk: false },
    'D': { tile: 'door', walk: false },
    'S': { tile: 'sign', walk: false },
    'X': { tile: 'letterbox', walk: false },
    'P': { tile: 'busStop', walk: false },
    'n': { tile: 'bench', walk: false }
  };

  // Things you can use with the action button
  const OBJECTS = [
    { id: 'homeDoor', x: 4, y: 45 },
    { id: 'letterbox', x: 3, y: 46 },
    { id: 'fieldSign', x: 6, y: 48 },
    { id: 'genDoor', x: 24, y: 35 },
    { id: 'leaves', x: 32, y: 37 },
    { id: 'berries1', x: 5, y: 54 },
    { id: 'berries2', x: 13, y: 55 },
    { id: 'berries3', x: 47, y: 48 },
    { id: 'berries4', x: 60, y: 53 },
    { id: 'shopDoor', x: 35, y: 27 },
    { id: 'hallDoor', x: 46, y: 26 },
    { id: 'postDoor', x: 28, y: 27 },
    { id: 'postBox', x: 30, y: 28 },
    { id: 'officeDoor', x: 55, y: 27 },
    { id: 'shrineDoor', x: 39, y: 7 },
    { id: 'midoriDoor', x: 48, y: 17 },
    { id: 'kumaDoor', x: 21, y: 8 },
    { id: 'odaDoor', x: 43, y: 40 },
    { id: 'moriDoor', x: 49, y: 40 },
    { id: 'fumikoDoor', x: 15, y: 43 },
    { id: 'noticeBoard', x: 38, y: 29 },
    { id: 'busStop', x: 58, y: 29 },
    { id: 'bench', x: 59, y: 29 },
    { id: 'bench', x: 42, y: 28 },
    { id: 'hidamariTree', x: 51, y: 28 },
    { id: 'exitSign', x: 78, y: 29 }
  ];

  // Named spots where residents spend their time (x, y in tiles, which way they face).
  // inside: the resident goes indoors there and can't be seen.
  const SPOTS = {
    genPaddy: { x: 32, y: 40, dir: 'down' },
    genHome: { x: 24, y: 36, dir: 'down' },
    genTree: { x: 24, y: 28, dir: 'down' },
    pondShore: { x: 16, y: 13, dir: 'up' },
    post: { x: 28, y: 28, dir: 'up', inside: true },
    streamside: { x: 65, y: 22, dir: 'right' },
    terraces: { x: 21, y: 22, dir: 'left' },
    midoriHome: { x: 48, y: 18, dir: 'up' }
  };

  // The six plots for power gardens (design.md section 7.1). Only your home field can be built on so far.
  const PLOTS = [
    { id: 'home', x: 7, y: 48, w: 4, h: 4 },
    { id: 'fumiko', x: 12, y: 34, w: 8, h: 6 },
    { id: 'gen', x: 23, y: 48, w: 8, h: 8 },
    { id: 'pond', x: 10, y: 6, w: 6, h: 6 },
    { id: 'factory', x: 55, y: 34, w: 10, h: 8 },
    { id: 'slope', x: 55, y: 6, w: 8, h: 8 }
  ];

  // Areas, for "where you saw it" in the nature diary (x, y, width, height in tiles).
  // The first area that fits is used.
  const AREAS = [
    { id: 'pond', x: 7, y: 4, w: 13, h: 10 },
    { id: 'terraces', x: 2, y: 14, w: 19, h: 14 },
    { id: 'shrine', x: 33, y: 4, w: 14, h: 15 },
    { id: 'stream', x: 60, y: 14, w: 10, h: 10 },
    { id: 'slope', x: 51, y: 4, w: 16, h: 14 },
    { id: 'river', x: 66, y: 0, w: 14, h: 60 },
    { id: 'centre', x: 21, y: 19, w: 45, h: 13 },
    { id: 'factory', x: 53, y: 31, w: 14, h: 14 },
    { id: 'fumikoField', x: 11, y: 32, w: 11, h: 15 },
    { id: 'paddies', x: 22, y: 32, w: 18, h: 26 },
    { id: 'home', x: 2, y: 41, w: 9, h: 11 },
    { id: 'southMeadow', x: 2, y: 52, w: 20, h: 6 },
    { id: 'houses', x: 40, y: 32, w: 14, h: 12 },
    { id: 'eastMeadow', x: 40, y: 44, w: 27, h: 14 },
    { id: 'village', x: 0, y: 0, w: 80, h: 60 }
  ];

  HM.MAP = {
    width: ROWS[0].length, height: ROWS.length, rows: ROWS, legend: LEGEND,
    objects: OBJECTS, spots: SPOTS, plots: PLOTS, areas: AREAS,
    field: { x: 7, y: 48, w: 4, h: 4 },         // your home field (plot "home")
    start: { x: 4, y: 46, dir: 'down' }         // in front of your door
  };
})(globalThis);
