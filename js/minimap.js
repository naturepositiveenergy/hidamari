// Hidamari: the village map, a window with the whole village drawn small (Milestone 4.2).
//
// Every tile is one small square in its own colour (the average colour of its drawing, saved by
// tools/make-sprites.js in js/sprite-sheet.js), so the map follows the seasons. On top: your gardens
// outlined, numbered pins for the buildings and places (HM.MAP.places in js/map-data.js), and a
// blinking marker where you are. Under the map: where you are in words, and the list of places.
// Tapping a place in the list makes its pin flash. The residents are not shown (decided on
// 13 November 2026): finding people is part of village life.

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const t = (key, vars) => I18n.t(key, vars);
  const SCALE = 4;            // canvas pixels for each tile
  const GRASS = '#5e9a50';

  function node(tag, attrs, text) {
    const n = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => n.setAttribute(k, v));
    if (text !== undefined) n.textContent = text;
    return n;
  }
  const colour = name => (HM.SHEET.colours && HM.SHEET.colours[name]) || GRASS;

  // ----- Drawing the village -----
  function drawVillage(canvas, state) {
    const map = HM.MAP, season = HM.rules.seasonOf(state.day);
    canvas.width = map.width * SCALE;
    canvas.height = map.height * SCALE;
    const c = canvas.getContext('2d');
    const square = (tx, ty, fill) => { c.fillStyle = fill; c.fillRect(tx * SCALE, ty * SCALE, SCALE, SCALE); };
    for (let ty = 0; ty < map.height; ty++) {
      for (let tx = 0; tx < map.width; tx++) square(tx, ty, colour(HM.render.tileSprite(map.rows[ty][tx], state, season)));
    }
    // Your gardens: what is built, and an outline (yellow where you may build, grey where not yet)
    map.plots.forEach(p => {
      const plot = state.plots[p.id];
      plot.tiles.forEach((built, i) => {
        const tx = p.x + i % p.w, ty = p.y + Math.floor(i / p.w);
        if (map.rows[ty][tx] === 'r' && plot.rubbleCleared) square(tx, ty, colour('tile.concrete'));
        if (plot.cleared) square(tx, ty, colour('tile.cleared'));
        if (built) square(tx, ty, colour(HM.render.seasonal(built, season)));
      });
      c.lineWidth = 1;
      c.strokeStyle = plot.open ? '#F6D46A' : 'rgba(255, 253, 245, 0.7)';
      c.setLineDash(plot.open ? [] : [2, 2]);
      c.strokeRect(p.x * SCALE + 0.5, p.y * SCALE + 0.5, p.w * SCALE - 1, p.h * SCALE - 1);
    });
    c.setLineDash([]);
  }

  // ----- Where you are -----
  function areaOf(tx, ty) {
    if (HM.world.fieldIndex(tx, ty) >= 0) return 'field';
    const a = HM.MAP.areas.find(a => tx >= a.x && ty >= a.y && tx < a.x + a.w && ty < a.y + a.h);
    return a ? a.id : 'village';
  }
  const percent = (v, total) => ((v + 0.5) / total * 100).toFixed(2) + '%';

  // ----- The window's content -----
  function body(state) {
    const map = HM.MAP, wrap = node('div', { class: 'minimap' });
    const me = HM.world.feetTile(HM.world.player);
    const here = t('map.here', { place: { key: 'place.' + areaOf(me.x, me.y) } });

    // The map, with the pins and you (the pins repeat the list below, so screen readers skip them)
    const box = node('div', { class: 'minimap-box', role: 'img', 'aria-label': t('map.label') + ' ' + here });
    const canvas = node('canvas', { 'aria-hidden': 'true' });
    drawVillage(canvas, state);
    box.appendChild(canvas);
    const pins = map.places.map((place, n) => {
      const pin = node('span', { class: 'minimap-pin', 'aria-hidden': 'true' }, String(n + 1));
      pin.style.left = percent(place.x, map.width);
      pin.style.top = percent(place.y, map.height);
      box.appendChild(pin);
      return pin;
    });
    const you = node('span', { class: 'minimap-you', 'aria-hidden': 'true' }, t('map.you'));
    you.style.left = percent(me.x, map.width);
    you.style.top = percent(me.y, map.height);
    box.appendChild(you);
    wrap.appendChild(box);

    wrap.appendChild(node('p', { class: 'minimap-here' }, here));
    wrap.appendChild(node('p', { class: 'muted' }, t('map.gardens')));

    // The places: tap one and its pin flashes on the map
    const list = node('ol', { class: 'minimap-list' });
    map.places.forEach((place, n) => {
      const li = node('li');
      const b = node('button', { type: 'button', class: 'minimap-place' });
      b.appendChild(node('span', { class: 'minimap-num', 'aria-hidden': 'true' }, String(n + 1)));
      b.appendChild(document.createTextNode(t('map.place.' + place.id)));
      b.addEventListener('click', () => {
        pins.forEach(p => p.classList.remove('flash'));
        void pins[n].offsetWidth;            // (restart the flash if it is already running)
        pins[n].classList.add('flash');
        box.scrollIntoView({ block: 'nearest' });
      });
      li.appendChild(b);
      list.appendChild(li);
    });
    wrap.appendChild(list);
    return wrap;
  }

  HM.minimap = { body, areaOf };
})(globalThis);
