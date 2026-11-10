// Hidamari: the map of the Phase 1 test (a small corner of the village, 40 × 25 tiles).
//
// Each letter is one tile of 16 × 16 pixels. LEGEND says which drawing it uses and whether
// you can walk on it. North is at the top.

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};

  const ROWS = [
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~TTT',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTT~~~~~~~~~~TT',
    'TTT.....TTTTTTTTTTTTT.....TT~~~~~~~~~~TT',
    'T..AAAA...............AAAATT~~~~~~~~~~TT',
    'T..BBNB..T....T.......BNBB.......~....TT',
    'T..WDOW....T..........WODW,,,,,,.~.,,,.T',
    'T..X=.............T.....=.,,,,,,.~.,,,.T',
    'T.T.=...................=.,,,,,,.~.,,,.T',
    'T...=SFFFF..............=.,,,,,,.~.,,,.T',
    'T...=.FFFF..............=.,,,,,,.~.,,,.T',
    'T...=.FFFF..hhhhhhhh....=........~.,,,.T',
    'TT..=.FFFF..............=....T...~.,,,.T',
    'T...=...........T.......=........~.....T',
    'T...=...................=........~....ZT',
    'T================================#=====T',
    'T....................L...........~.....T',
    'T.,,,,,,,..."""""""""="""""""""..~...T.T',
    'T.,,,,Y,,..."""""""""="""""""""..~.....T',
    'T.,,Y,,,,..."""""""""="""""""""..~.....T',
    'T.,,,,,,,..."""""""""="""""""""..~.T...T',
    'T.,,,,,,,.T."""""""""="""""""""..~.....T',
    'T..........."""""""""="""""""""..~.....T',
    'T.......................T........~..T..T',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT~TTTTTT'
  ];

  // tile: the drawing · walk: can you walk on it · habitat: which animals live there
  const LEGEND = {
    '.': { tile: 'grass', walk: true },
    ',': { tile: 'meadow', walk: true, habitat: 'meadow' },
    '=': { tile: 'path', walk: true },
    '#': { tile: 'bridge', walk: true },
    'F': { tile: 'soil', walk: true },
    'L': { tile: 'leaves', walk: true },
    'T': { tile: 'tree', walk: false, habitat: 'tree' },
    '~': { tile: 'water', walk: false, habitat: 'water' },
    '"': { tile: 'paddy', walk: false, habitat: 'paddy' },
    'h': { tile: 'hedge', walk: false, habitat: 'hedge' },
    'Y': { tile: 'berries', walk: false, habitat: 'hedge' },
    'A': { tile: 'roof', walk: false },
    'B': { tile: 'eave', walk: false },
    'N': { tile: 'eaveNest', walk: false, habitat: 'nest' },
    'W': { tile: 'wall', walk: false },
    'O': { tile: 'window', walk: false },
    'D': { tile: 'door', walk: false },
    'S': { tile: 'sign', walk: false },
    'X': { tile: 'letterbox', walk: false },
    'Z': { tile: 'sign', walk: false }
  };

  // Things you can use with the action button
  const OBJECTS = [
    { id: 'homeDoor', x: 4, y: 6 },
    { id: 'genDoor', x: 24, y: 6 },
    { id: 'letterbox', x: 3, y: 7 },
    { id: 'fieldSign', x: 5, y: 9 },
    { id: 'exitSign', x: 38, y: 14 },
    { id: 'leaves', x: 21, y: 16 },
    { id: 'berries1', x: 6, y: 18 },
    { id: 'berries2', x: 4, y: 19 }
  ];

  // Named spots where residents spend their time (x, y in tiles, and which way they face)
  const SPOTS = {
    genPaddy: { x: 21, y: 18, dir: 'down' },
    genHome: { x: 24, y: 7, dir: 'down' },
    genTree: { x: 16, y: 14, dir: 'down' },
    pondShore: { x: 30, y: 5, dir: 'up' },
    meadowEast: { x: 36, y: 9, dir: 'left' },
    bridge: { x: 32, y: 15, dir: 'right' },
    exitEast: { x: 38, y: 15, dir: 'right' }
  };

  // Areas, for "where you saw it" in the nature diary (x, y, width, height in tiles)
  const AREAS = [
    { id: 'pond', x: 26, y: 1, w: 13, h: 5 },
    { id: 'stream', x: 32, y: 6, w: 3, h: 19 },
    { id: 'meadow', x: 26, y: 6, w: 13, h: 9 },
    { id: 'paddies', x: 11, y: 16, w: 21, h: 8 },
    { id: 'southMeadow', x: 1, y: 16, w: 10, h: 8 },
    { id: 'hedgerow', x: 11, y: 9, w: 11, h: 4 },
    { id: 'genHouse', x: 19, y: 3, w: 9, h: 11 },
    { id: 'home', x: 1, y: 3, w: 10, h: 12 },
    { id: 'village', x: 0, y: 0, w: 40, h: 25 }
  ];

  HM.MAP = {
    width: ROWS[0].length, height: ROWS.length, rows: ROWS, legend: LEGEND,
    objects: OBJECTS, spots: SPOTS, areas: AREAS,
    field: { x: 6, y: 9, w: 4, h: 4 },          // your home field
    start: { x: 4, y: 7, dir: 'down' }          // in front of your door
  };
})(globalThis);
