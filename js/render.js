// Hidamari: drawing the world on the canvas.
//
// The canvas is drawn at a small size (each pixel of the art is one canvas pixel) and then
// shown larger, so that every art pixel covers a whole number of screen pixels and stays crisp.
// The pictures come from img/sprites.png (made by tools/make-sprites.js).

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const T = 16;   // tile size in pixels

  let canvas, ctx, sheet, view = { w: 320, h: 180, scale: 1 };
  const camera = { x: 0, y: 0 };

  function init(canvasEl, onReady) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    sheet = new Image();
    sheet.onload = onReady;
    sheet.src = 'img/sprites.png';
    resize();
  }

  // Fit the canvas to its box: show about 11 tiles across the shorter side
  let fitted = '';
  function resize() {
    const box = canvas.parentElement;
    const ratio = root.devicePixelRatio || 1;
    fitted = [box.clientWidth, box.clientHeight, ratio].join();
    const devW = Math.max(1, Math.round(box.clientWidth * ratio));
    const devH = Math.max(1, Math.round(box.clientHeight * ratio));
    const scale = Math.max(1, Math.floor(Math.min(devW, devH) / (T * 11)));
    view = { w: Math.ceil(devW / scale), h: Math.ceil(devH / scale), scale, ratio };
    canvas.width = view.w;
    canvas.height = view.h;
    canvas.style.width = (view.w * scale / ratio) + 'px';
    canvas.style.height = (view.h * scale / ratio) + 'px';
    ctx.imageSmoothingEnabled = false;
  }

  // Draw one picture from the sheet at world position (x, y)
  function sprite(name, frame, x, y, alpha) {
    const frames = HM.SHEET.frames[name];
    if (!frames) return;
    const [sx, sy] = frames[frame % frames.length];
    const dx = Math.round(x - camera.x), dy = Math.round(y - camera.y);
    if (dx < -T || dy < -T || dx > view.w || dy > view.h) return;
    if (alpha !== undefined) ctx.globalAlpha = alpha;
    ctx.drawImage(sheet, sx, sy, T, T, dx, dy, T, T);
    if (alpha !== undefined) ctx.globalAlpha = 1;
  }

  // Keep the camera centred on (x, y), but inside the map
  function centreOn(x, y) {
    const map = HM.MAP;
    const mw = map.width * T, mh = map.height * T;
    camera.x = mw <= view.w ? (mw - view.w) / 2 : Math.max(0, Math.min(mw - view.w, x - view.w / 2));
    camera.y = mh <= view.h ? (mh - view.h) / 2 : Math.max(0, Math.min(mh - view.h, y - view.h / 2));
    camera.x = Math.round(camera.x);
    camera.y = Math.round(camera.y);
  }

  // Which drawing a map tile uses right now
  function tileSprite(ch, state) {
    if (ch === 'L' && state.flags.leavesCleared) return 'tile.path';
    return 'tile.' + HM.MAP.legend[ch].tile;
  }

  // The colour wash for the time of day: [red, green, blue, strength]
  function tint(minutes) {
    const h = minutes / 60;
    const night = [40, 50, 110, 0.45];
    if (h < 6.5) return night;
    if (h < 7.5) return [night[0], night[1], night[2], night[3] * (7.5 - h)];
    if (h < 17) return null;
    if (h < 18.5) return [240, 150, 60, 0.12 * (h - 17) / 1.5];
    if (h < 20) {
      const k = (h - 18.5) / 1.5;
      return [240 + (40 - 240) * k, 150 + (50 - 150) * k, 60 + (110 - 60) * k, 0.12 + (0.45 - 0.12) * k];
    }
    return night;
  }

  function drawRain(time, still) {
    ctx.fillStyle = 'rgba(225, 240, 250, 0.55)';
    const n = Math.floor(view.w * view.h / 700);
    for (let i = 0; i < n; i++) {
      const sx = (i * 97.13) % view.w;
      const speed = 140 + (i % 7) * 12;
      const y = still ? (i * 53.7) % view.h : ((i * 53.7) + time / 1000 * speed) % (view.h + 8) - 4;
      const x = still ? sx : (sx + time / 1000 * 18) % view.w;
      ctx.fillRect(Math.round(x), Math.round(y), 1, 3);
    }
  }

  // Draw everything. w = the world (from world.js), g = the game (main.js)
  function draw(w, g, time) {
    const state = g.state;
    // The window or the screen zoom changed: fit again
    const box = canvas.parentElement;
    if ([box.clientWidth, box.clientHeight, root.devicePixelRatio || 1].join() !== fitted) resize();
    const map = HM.MAP;
    const anim = g.settings.motion ? Math.floor(time / 700) % 2 : 0;
    const focus = g.mode === 'build' ? HM.build.focusPoint() : { x: w.player.x + T / 2, y: w.player.y + T / 2 };
    centreOn(focus.x, focus.y + (g.mode === 'dialogue' ? T * 1.5 : 0));

    ctx.fillStyle = '#5E9A50';
    ctx.fillRect(0, 0, view.w, view.h);

    // Ground and buildings
    const x0 = Math.max(0, Math.floor(camera.x / T)), y0 = Math.max(0, Math.floor(camera.y / T));
    const x1 = Math.min(map.width - 1, Math.floor((camera.x + view.w) / T));
    const y1 = Math.min(map.height - 1, Math.floor((camera.y + view.h) / T));
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        sprite(tileSprite(map.rows[ty][tx], state), anim, tx * T, ty * T);
      }
    }

    // Your home field: built tiles, and the plan while in build mode
    const f = map.field;
    const plan = g.mode === 'build' ? HM.build.plan() : null;
    for (let i = 0; i < state.field.length; i++) {
      const fx = (f.x + i % f.w) * T, fy = (f.y + Math.floor(i / f.w)) * T;
      const built = state.field[i];
      const planned = plan ? plan[i] : built;
      if (built && planned === built) sprite('tile.' + built, anim, fx, fy);
      else if (planned) {
        sprite('tile.' + planned, anim, fx, fy, 0.55);
        ctx.strokeStyle = 'rgba(91, 70, 54, 0.8)';
        ctx.setLineDash([2, 2]);
        ctx.strokeRect(Math.round(fx - camera.x) + 0.5, Math.round(fy - camera.y) + 0.5, T - 1, T - 1);
        ctx.setLineDash([]);
      }
    }

    // People and animals, from back to front
    const things = [];
    w.critters.forEach(c => things.push({ y: c.y, draw: () => sprite('critter.' + c.species, anim + c.phase, c.x, c.y + c.bob(time)) }));
    w.residents.forEach(r => { if (r.visible) things.push({ y: r.y, draw: () => sprite(personFrame(r, time), 0, r.x, r.y) }); });
    things.push({ y: w.player.y, draw: () => sprite(personFrame(w.player, time), 0, w.player.x, w.player.y) });
    things.sort((a, b) => a.y - b.y).forEach(t => t.draw());

    // Signs above: "!" over animals you can look at, a sun over residents with a heart event
    w.critters.forEach(c => { if (c.showAlert) sprite('ui.alert', 0, c.x + 2, c.y - 9 + c.bob(time)); });
    w.residents.forEach(r => { if (r.visible && r.eventWaiting) sprite('ui.sun', 0, r.x, r.y - 13); });
    if (w.look) drawLookRing(w.look);
    if (g.mode === 'build') {
      const c = HM.build.cursorTile();
      if (c) sprite('ui.cursor', 0, (f.x + c.x) * T, (f.y + c.y) * T);
    }

    // Time of day and weather
    const wash = tint(state.minutes);
    if (wash) {
      ctx.fillStyle = `rgba(${wash[0] | 0}, ${wash[1] | 0}, ${wash[2] | 0}, ${wash[3]})`;
      ctx.fillRect(0, 0, view.w, view.h);
    }
    if (HM.rules.weatherOf(state.day) === 'rain') drawRain(time, !g.settings.motion);
  }

  // "Look closely": a ring around the animal that fills up while you stand still
  function drawLookRing(look) {
    const cx = Math.round(look.x + T / 2 - camera.x), cy = Math.round(look.y + T / 2 - camera.y);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 253, 245, 0.6)';
    ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#E5A743';
    ctx.beginPath(); ctx.arc(cx, cy, 10, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * look.progress); ctx.stroke();
    ctx.lineWidth = 1;
  }

  // The picture of a person: direction, walking step and blinking
  function personFrame(p, time) {
    let pose = 'stand';
    if (p.moving) pose = ['stand', 'stepA', 'stand', 'stepB'][Math.floor(p.walkTime / 0.14) % 4];
    else if (p.dir !== 'up' && (time + p.blinkOffset) % 3800 < 140) pose = 'blink';
    return `${p.who}.${p.dir}.${pose}`;
  }

  // Convert a point on the screen to a tile of the map
  function screenToTile(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * canvas.width / rect.width + camera.x;
    const y = (clientY - rect.top) * canvas.height / rect.height + camera.y;
    return { x: Math.floor(x / T), y: Math.floor(y / T), px: x, py: y };
  }

  // Draw one picture into a small canvas of its own (for the nature diary)
  function drawTo(target, name) {
    const frames = HM.SHEET.frames[name];
    if (!frames || !sheet) return;
    const c = target.getContext('2d');
    c.imageSmoothingEnabled = false;
    c.clearRect(0, 0, T, T);
    c.drawImage(sheet, frames[0][0], frames[0][1], T, T, 0, 0, T, T);
  }

  HM.render = { init, resize, draw, drawTo, screenToTile, TILE: T };
})(globalThis);
