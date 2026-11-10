// Hidamari: Phase 0 art style test (art-test.html).
//
// Every tile and person is a grid of 16 × 16 letters. Each letter is one pixel and
// stands for a role ("grass", "outline", "hair"...), not a colour. TILE_ROLES and
// PEOPLE_ROLES say which palette colour each role uses, and each art style has its
// own palette, so the same drawings can be shown in three styles.
// A dot (.) is a see-through pixel.
//
// Special letters:
//   y, z  water shine: y shows in the first animation frame, z in the second
//   9     eyes: they close (turn into skin shade f) when a person blinks
//   K     outline: its colour depends on the style's outline type (see STYLES)
//
// Nothing here is game code yet. In Phase 1, the chosen style moves into the real
// sprite files, and tools/make-sprites.js will turn them into PNG images.

(function () {
  'use strict';

  // ----- Tiles -----
  // Roles: a b c grass (base, dark, light) · p q r path · u v paddy water, s t seedlings
  //        w x water (base, dark) · P Q R g panel (face, lines, top edge, glint)
  //        F T post and frame · S shadow on the ground · h i j k hedge (base, dark, light, flowers)
  //        o pond edge · l L lily pad and flower · 1 2 3 4 flowers (three colours, centre)
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
    // One row of panels on taller posts: light reaches the crops underneath.
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
    ]
  };
  const TILE_ORDER = ['grass', 'path', 'paddy', 'water', 'dense', 'spaced', 'hedge', 'pond', 'meadow'];
  // The water colour that the shine letters (y, z) show when they are "off"
  const SHINE_BASE = { paddy: 'u', water: 'w', pond: 'w' };

  // ----- People -----
  // Roles: K outline · e f skin (base, shade) · 9 eyes · W white · H I hair (base, shade)
  //        C D clothes (base, shade) · E G accent (scarf, towel, hat) · L legs · M shoes · B binoculars
  const PEOPLE = {
    // The player: short hair and a sun-yellow scarf
    player: [
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
      '..KeKCCDDCCKeK..',
      '...KKLLLLLLKK...',
      '....KLLKKLLK....',
      '....KMMK.KMMK...'
    ],
    // Gen-san: towel tied round his head, white eyebrows and moustache, work clothes, boots
    gen: [
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
      '..KeKCCCCCCKeK..',
      '...KLLLLLLLLK...',
      '...KLLLKKLLLK...',
      '...KMMMK.KMMMK..'
    ],
    // Midori: bucket hat, ponytail, binoculars on her chest, field vest
    midori: [
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
      '..KeKCCDDCCKeK..',
      '...KKLLLLLLKK...',
      '....KLLKKLLK....',
      '....KMMK.KMMK...'
    ]
  };
  const PEOPLE_ORDER = ['player', 'gen', 'midori'];

  // ----- The small scene (12 × 7 tiles) -----
  const SCENE = [
    'WGMMGDDSSSGG',
    'WGMOGDDSSSGG',
    'WGGGGHHHHHGG',
    'WPPPPPPPPPPP',
    'WGYYYGMMMGGG',
    'WGYYYGMOMGGG',
    'WGYYYGMMGGGG'
  ];
  const SCENE_TILES = { W: 'water', G: 'grass', M: 'meadow', O: 'pond', D: 'dense', S: 'spaced', H: 'hedge', P: 'path', Y: 'paddy' };
  const SCENE_PEOPLE = [['gen', 1, 5], ['player', 4, 3], ['midori', 8, 5]];   // name, tile x, tile y

  // ----- Which palette colour each letter uses -----
  // All three styles use the same roles; only the colours behind the names differ.
  const TILE_ROLES = {
    a: 'green3', b: 'green2', c: 'green4',
    p: 'earth2', q: 'earth1', r: 'earth3',
    u: 'teal1', v: 'teal0', s: 'green4', t: 'green2',
    w: 'water1', x: 'water0', y: 'water2',
    P: 'panel1', Q: 'panel0', R: 'panel2', g: 'white', F: 'metal1', T: 'metal0', S: 'green1',
    h: 'green2', i: 'green1', j: 'green4', k: 'pink',
    o: 'earth1', l: 'green2', L: 'pink',
    1: 'pink', 2: 'yellow', 3: 'lilac', 4: 'earth3'
  };
  const PEOPLE_ROLES = {
    base: { K: 'outline', e: 'skin1', f: 'skin0', 9: 'outline', W: 'white' },
    player: { H: 'earth0', I: 'earth1', C: 'teal1', D: 'teal0', E: 'yellow', G: 'orange', L: 'panel1', M: 'earth0' },
    gen: { E: 'white', G: 'panel1', H: 'grey', I: 'grey', C: 'earth1', D: 'earth0', L: 'metal0', M: 'panel0' },
    midori: { E: 'green2', G: 'green1', H: 'earth0', C: 'earth2', D: 'white', B: 'metal0', L: 'green1', M: 'earth0' }
  };

  // ----- The three styles -----
  // Each style is one palette of 27 colours: a few "ramps" from dark to light
  // (greens, earth, water, panels) shared by tiles and people, so everything fits together.
  // outline: 'soft' = each outline pixel is a darker shade of the colour next to it;
  //          'line' = one outline colour everywhere.
  // grain:   a faint paper texture on the ground (tiles only).
  const STYLES = [
    {
      id: 'a', outline: 'soft', grain: false,
      colours: {
        outline: '#5B4636', white: '#FFFDF5', grey: '#D6CFC4', skin0: '#EBBB97', skin1: '#F9DCBF',
        earth0: '#5E4434', earth1: '#A57F5C', earth2: '#E4C99A', earth3: '#F6E8C6',
        green1: '#5E9A50', green2: '#78B25E', green3: '#9FD171', green4: '#CDEA92',
        teal0: '#4E9C93', teal1: '#7CC4B8', water0: '#62A6CA', water1: '#88C9E2', water2: '#DDF3F9',
        panel0: '#4A68A6', panel1: '#6E92CF', panel2: '#B5CFF1', metal0: '#737B88', metal1: '#ABB2BC',
        pink: '#F4A6B8', yellow: '#F6D46A', orange: '#E5A743', lilac: '#C2B1EC'
      }
    },
    {
      id: 'b', outline: 'line', grain: true, paper: '#F4ECD8',
      colours: {
        outline: '#2B3156', white: '#F3EBD9', grey: '#CFC7B8', skin0: '#DBB290', skin1: '#F1D6B7',
        earth0: '#4A3B33', earth1: '#8C6F55', earth2: '#CDB68C', earth3: '#E8DBBB',
        green1: '#4B6141', green2: '#687F50', green3: '#91A46D', green4: '#BAC492',
        teal0: '#5D7F7A', teal1: '#8DA89F', water0: '#52708A', water1: '#7B9CAD', water2: '#C8D5D2',
        panel0: '#2E3762', panel1: '#46557F', panel2: '#8E9CC0', metal0: '#66625A', metal1: '#9D9586',
        pink: '#D07466', yellow: '#E1B655', orange: '#C77B3B', lilac: '#9C8FB8'
      }
    },
    {
      id: 'c', outline: 'line', grain: false,
      colours: {
        outline: '#2A1C3C', white: '#FFFFFF', grey: '#DCD6E8', skin0: '#F4B59B', skin1: '#FFD9BE',
        earth0: '#5A3346', earth1: '#B9714F', earth2: '#F1B878', earth3: '#FFE2A8',
        green1: '#1D7A55', green2: '#2FA350', green3: '#5CC65A', green4: '#B4EB5C',
        teal0: '#0C8A8C', teal1: '#22B8A8', water0: '#2766C4', water1: '#3AA7E8', water2: '#C4F3FF',
        panel0: '#1E2A82', panel1: '#3557D3', panel2: '#86B3FF', metal0: '#6A6E9C', metal1: '#BAC1DD',
        pink: '#FF5D93', yellow: '#FFD43B', orange: '#F98D2B', lilac: '#9C84FF'
      }
    }
  ];

  // ----- Colour helpers -----
  const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const mix = (c1, c2, amount) => c1.map((v, i) => Math.round(v + (c2[i] - v) * amount));
  const toRgbPalette = (roles, colours) =>
    Object.fromEntries(Object.entries(roles).map(([letter, name]) => [letter, rgb(colours[name])]));

  // A repeatable "random" number from 0 to 1 for each pixel position (for the paper texture)
  function noise(x, y) {
    let n = (x * 374761393 + y * 668265263) | 0;
    n = (n ^ (n >>> 13)) * 1274126177 | 0;
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
  }
  function withGrain(style, colour, x, y) {
    const v = noise(x, y);
    if (v < 0.16) return mix(colour, style.paperRgb, 0.12);
    if (v > 0.95) return mix(colour, style.inkRgb, 0.08);
    return colour;
  }

  // Prepare each style's colours once
  STYLES.forEach(style => {
    style.tileRgb = toRgbPalette(TILE_ROLES, style.colours);
    style.peopleRgb = {};
    PEOPLE_ORDER.forEach(name => {
      style.peopleRgb[name] = toRgbPalette(Object.assign({}, PEOPLE_ROLES.base, PEOPLE_ROLES[name]), style.colours);
    });
    if (style.grain) { style.paperRgb = rgb(style.paper); style.inkRgb = rgb(style.colours.outline); }
  });

  // The colour of one pixel of a drawing, or null for see-through
  function pixelColour(grid, x, y, palette, style, state) {
    let ch = grid[y][x];
    if (ch === '.') return null;
    if (ch === 'y' || ch === 'z') {
      const shining = (ch === 'y') === (state.frame === 0);
      ch = shining ? 'y' : state.shineBase;
    }
    if (ch === '9' && state.blink) ch = 'f';
    if (ch === 'K' && style.outline === 'soft') {
      // Soft outline: a darker shade of the colour inside, next to the outline
      for (const [dx, dy] of [[0, 1], [1, 0], [-1, 0], [0, -1]]) {
        const n = grid[y + dy] && grid[y + dy][x + dx];
        if (n && n !== '.' && n !== 'K' && n !== '9') return mix(mix(palette[n], [0, 0, 0], 0.42), palette.K, 0.35);
      }
    }
    return palette[ch];
  }

  // Draw a 16 × 16 drawing into an image buffer at pixel position (ox, oy)
  function paint(image, grid, palette, style, ox, oy, state) {
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        let c = pixelColour(grid, x, y, palette, style, state);
        if (!c) continue;
        if (style.grain && !state.person) c = withGrain(style, c, ox + x, oy + y);
        const i = ((oy + y) * image.width + ox + x) * 4;
        image.data[i] = c[0]; image.data[i + 1] = c[1]; image.data[i + 2] = c[2]; image.data[i + 3] = 255;
      }
    }
  }

  function fillImage(image, style, colour) {
    for (let y = 0; y < image.height; y++) {
      for (let x = 0; x < image.width; x++) {
        const c = style.grain ? withGrain(style, colour, x, y) : colour;
        const i = (y * image.width + x) * 4;
        image.data[i] = c[0]; image.data[i + 1] = c[1]; image.data[i + 2] = c[2]; image.data[i + 3] = 255;
      }
    }
  }

  // ----- Animation state -----
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let animate = !reducedMotion;
  let now = 0;
  const frameNow = () => (animate ? Math.floor(now / 700) % 2 : 0);
  const blinkNow = offset => animate && (now + offset) % 3600 < 150;
  const BLINK_OFFSET = { player: 0, gen: 1300, midori: 2500 };

  // ----- Drawing each canvas -----
  const drawers = [];

  function drawTile(canvas, style, name) {
    const ctx = canvas.getContext('2d');
    const image = ctx.createImageData(16, 16);
    paint(image, TILES[name], style.tileRgb, style, 0, 0, { frame: frameNow(), shineBase: SHINE_BASE[name] });
    ctx.putImageData(image, 0, 0);
  }

  function drawPerson(canvas, style, name) {
    const ctx = canvas.getContext('2d');
    const image = ctx.createImageData(16, 16);
    fillImage(image, style, style.tileRgb.a);
    paint(image, PEOPLE[name], style.peopleRgb[name], style, 0, 0, { person: true, blink: blinkNow(BLINK_OFFSET[name]) });
    ctx.putImageData(image, 0, 0);
  }

  function drawScene(canvas, style) {
    const ctx = canvas.getContext('2d');
    const image = ctx.createImageData(canvas.width, canvas.height);
    const state = { frame: frameNow() };
    SCENE.forEach((row, ty) => [...row].forEach((code, tx) => {
      const name = SCENE_TILES[code];
      state.shineBase = SHINE_BASE[name];
      paint(image, TILES[name], style.tileRgb, style, tx * 16, ty * 16, state);
    }));
    SCENE_PEOPLE.forEach(([name, tx, ty]) => {
      paint(image, PEOPLE[name], style.peopleRgb[name], style, tx * 16, ty * 16, { person: true, blink: blinkNow(BLINK_OFFSET[name]) });
    });
    ctx.putImageData(image, 0, 0);
  }

  // ----- Building the page -----
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === 'i18n') node.dataset.i18n = v;
      else if (k === 'i18nLabel') node.dataset.i18nAriaLabel = v;
      else node.setAttribute(k, v);
    });
    (children || []).forEach(c => node.appendChild(c));
    return node;
  }

  function pixelCanvas(w, h, labelKey) {
    return el('canvas', { width: w, height: h, role: 'img', i18nLabel: labelKey });
  }

  // All colours of a style (soft outlines are mixed from these, so they are not counted)
  const paletteOf = style => Object.values(style.colours);

  const paletteLabels = [];

  function buildStyle(style) {
    const colours = paletteOf(style);
    const swatches = el('div', { class: 'swatches', 'aria-hidden': 'true' },
      colours.map(c => { const s = el('span', { class: 'swatch', title: c }); s.style.background = c; return s; }));
    const paletteLabel = el('p', { class: 'palette-label' });
    paletteLabels.push([paletteLabel, colours.length]);

    const tiles = el('div', { class: 'tile-grid' }, TILE_ORDER.map(name => {
      const canvas = pixelCanvas(16, 16, 'tile.' + name);
      canvas.className = 'px tile';
      drawers.push(() => drawTile(canvas, style, name));
      return el('figure', {}, [canvas, el('figcaption', { i18n: 'tile.' + name })]);
    }));

    const people = el('div', { class: 'people-row' }, PEOPLE_ORDER.map(name => {
      const canvas = pixelCanvas(16, 16, 'name.' + name);
      canvas.className = 'px person';
      drawers.push(() => drawPerson(canvas, style, name));
      return el('figure', {}, [canvas, el('figcaption', { i18n: 'name.' + name })]);
    }));

    const scene = pixelCanvas(SCENE[0].length * 16, SCENE.length * 16, 'art.sceneLabel');
    scene.className = 'px scene';
    drawers.push(() => drawScene(scene, style));

    return el('section', { class: 'style-card', id: 'style-' + style.id, 'aria-labelledby': 'style-title-' + style.id }, [
      el('h2', { id: 'style-title-' + style.id, i18n: 'style.' + style.id + '.name' }),
      el('p', { class: 'style-desc', i18n: 'style.' + style.id + '.desc' }),
      paletteLabel, swatches,
      el('h3', { i18n: 'art.tiles' }), tiles,
      el('h3', { i18n: 'art.people' }), people,
      el('h3', { i18n: 'art.scene' }), el('div', { class: 'scene-wrap' }, [scene])
    ]);
  }

  // Show pixel art so that each art pixel covers a whole number of screen pixels
  // (otherwise some pixels look wider than others). Screens with "zoom" (for example
  // 125% on Windows, or most phones) have several screen pixels per page pixel.
  function setCrispSize(canvas, scale) {
    const ratio = window.devicePixelRatio || 1;
    const whole = Math.max(1, Math.round(scale * ratio));
    canvas.style.width = canvas.width * whole / ratio + 'px';
    canvas.style.height = canvas.height * whole / ratio + 'px';
  }

  function sizeCanvases() {
    const ratio = window.devicePixelRatio || 1;
    const narrow = window.innerWidth < 480;
    document.querySelectorAll('canvas.tile').forEach(c => setCrispSize(c, 4));
    document.querySelectorAll('canvas.person').forEach(c => setCrispSize(c, narrow ? 4.5 : 6));
    // The scene: as large as fits (at most 4 times), rounded down to whole screen pixels
    document.querySelectorAll('canvas.scene').forEach(canvas => {
      const room = canvas.parentElement.clientWidth;
      const whole = Math.max(1, Math.floor(Math.min(room, canvas.width * 4) * ratio / canvas.width));
      canvas.style.width = canvas.width * whole / ratio + 'px';
      canvas.style.height = canvas.height * whole / ratio + 'px';
    });
  }

  function updateTexts() {
    paletteLabels.forEach(([node, n]) => { node.textContent = t('art.palette', { n }); });
    const btn = document.getElementById('animBtn');
    btn.textContent = t(animate ? 'art.animOn' : 'art.animOff');
    btn.setAttribute('aria-pressed', String(animate));
    document.querySelectorAll('#langSwitch button').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.lang === I18n.getLanguage()));
    });
  }

  function buildLanguageButtons() {
    const nav = document.getElementById('langSwitch');
    // Japanese first, then English
    I18n.languages().sort((a, b) => (a === 'ja' ? -1 : b === 'ja' ? 1 : 0)).forEach(code => {
      const b = el('button', { type: 'button', class: 'lang-btn', lang: code });
      b.dataset.lang = code;
      b.textContent = HM_LANG[code]['lang.name'];
      b.addEventListener('click', () => I18n.setLanguage(code));
      nav.appendChild(b);
    });
  }

  let lastKey = '';
  function tick(time) {
    now = time;
    const key = [frameNow(), ...PEOPLE_ORDER.map(n => blinkNow(BLINK_OFFSET[n]))].join();
    if (key !== lastKey) { lastKey = key; drawers.forEach(draw => draw()); }
    requestAnimationFrame(tick);
  }

  function start() {
    const container = document.getElementById('styles');
    STYLES.forEach(style => container.appendChild(buildStyle(style)));
    buildLanguageButtons();
    I18n.onChange(updateTexts);
    I18n.init();
    updateTexts();
    document.getElementById('animBtn').addEventListener('click', () => {
      animate = !animate;
      updateTexts();
    });
    sizeCanvases();
    window.addEventListener('resize', sizeCanvases);
    requestAnimationFrame(tick);
  }

  start();
})();
