// Hidamari: drawing the world on the canvas.
//
// The canvas is drawn at a small size (each pixel of the art is one canvas pixel) and then
// shown larger, so that every art pixel covers a whole number of screen pixels and stays crisp.
// The pictures come from img/sprites.png (made by tools/make-sprites.js).

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const T = 16;   // tile size in pixels
  // The game's version (?v=... on this script in index.html), also used for the picture sheet,
  // so the browser never mixes a new game with an older picture sheet
  const VERSION = ((root.document && root.document.currentScript && root.document.currentScript.src) || '').split('?')[1] || '';

  let canvas, ctx, sheet, view = { w: 320, h: 180, scale: 1 };
  const camera = { x: 0, y: 0 };

  function init(canvasEl, onReady) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    sheet = new Image();
    sheet.onload = onReady;
    sheet.src = 'img/sprites.png' + (VERSION ? '?' + VERSION : '');
    resize();
  }

  // Fit the canvas to its box: show about 11 tiles across the shorter side
  let fitted = '';
  const fitKey = (box, fit) => [box.clientWidth, box.clientHeight, root.devicePixelRatio || 1, fit ? fit.id : ''].join();
  // In build mode: the plot, and the parts of the screen the top bar and the build bar cover (CSS pixels)
  function buildFit(g) {
    if (g.mode !== 'build') return null;
    const p = HM.MAP.plots.find(q => q.id === HM.build.plotId());
    const box = canvas.getBoundingClientRect();
    const hud = document.querySelector('.hud'), bar = document.getElementById('buildBar');
    return {
      id: p.id, w: p.w, h: p.h,
      top: hud ? Math.max(0, hud.getBoundingClientRect().bottom - box.top) : 0,
      bottom: bar ? Math.max(0, box.bottom - bar.getBoundingClientRect().top) : 0
    };
  }
  // In a scene in the community hall: the room, the top bar and the dialogue box (CSS pixels)
  function sceneFit(g) {
    if (!g.scene) return null;
    const box = canvas.getBoundingClientRect(), hall = HM.MAP.hall;
    const hud = document.querySelector('.hud'), dlg = document.getElementById('dialogue');
    // (the last floor row may hide behind the dialogue box, so the room can be drawn larger)
    return {
      id: 'scene:' + g.scene.kind, w: hall.rows[0].length, h: hall.rows.length - 1, margin: 0,
      // (below the top bar, room for the line with the room's warmth or the sticker legend)
      top: (hud ? Math.max(0, hud.getBoundingClientRect().bottom - box.top) : 0) + (g.scene.kind === 'ending' ? 0 : 36),
      bottom: dlg && !dlg.hidden ? Math.max(0, box.bottom - dlg.getBoundingClientRect().top) : 0
    };
  }
  // fit (in build mode): the plot's size and how much of the screen the top bar and the build bar
  // cover (in CSS pixels). Then the picture zooms out, in whole steps so the pixels stay crisp,
  // until the whole plot fits between the two bars.
  function resize(fit) {
    const box = canvas.parentElement;
    const ratio = root.devicePixelRatio || 1;
    fitted = fitKey(box, fit);
    const devW = Math.max(1, Math.round(box.clientWidth * ratio));
    const devH = Math.max(1, Math.round(box.clientHeight * ratio));
    let scale = Math.max(1, Math.floor(Math.min(devW, devH) / (T * 11)));
    if (fit) {
      const seenH = devH - (fit.top + fit.bottom) * ratio;
      const margin = fit.margin === undefined ? 1 : fit.margin;
      scale = Math.max(1, Math.min(scale, Math.floor(seenH / ((fit.h + margin) * T)), Math.floor(devW / ((fit.w + margin) * T))));
    }
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

  // Keep the camera centred on (x, y), but inside the map. top, bottom: how much of the screen
  // the top bar and the build bar cover (in canvas pixels), so the point is centred in the part you can see.
  function centreOn(x, y, top, bottom) {
    const map = HM.MAP;
    const mw = map.width * T, mh = map.height * T;
    top = top || 0; bottom = bottom || 0;
    const seen = view.h - top - bottom;
    camera.x = mw <= view.w ? (mw - view.w) / 2 : Math.max(0, Math.min(mw - view.w, x - view.w / 2));
    // (with the build bar open, the camera may go past the bottom of the map: that part is behind the bar)
    camera.y = mh <= view.h ? (mh - view.h) / 2 : Math.max(0, Math.min(mh - view.h + bottom, y - top - seen / 2));
    camera.x = Math.round(camera.x);
    camera.y = Math.round(camera.y);
  }

  // The drawing of a tile in this season ("tile.tree@autumn"), or the spring drawing
  function seasonal(name, season) {
    const own = 'tile.' + name + '@' + season;
    return HM.SHEET.frames[own] ? own : 'tile.' + name;
  }

  // Which drawing a map tile uses right now
  function tileSprite(ch, state, season) {
    if (ch === 'L' && state.flags.leavesCleared) return seasonal('path', season);
    return seasonal(HM.MAP.legend[ch].tile, season);
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

  // Rain (heavier and windier in a typhoon) and snow. still: no movement (animations off)
  function drawWeather(kind, time, still) {
    const storm = kind === 'typhoon', snow = kind === 'snow';
    if (storm) { ctx.fillStyle = 'rgba(70, 80, 95, 0.22)'; ctx.fillRect(0, 0, view.w, view.h); }
    ctx.fillStyle = snow ? 'rgba(255, 255, 255, 0.85)' : 'rgba(225, 240, 250, 0.55)';
    const n = Math.floor(view.w * view.h / (storm ? 320 : snow ? 900 : 700));
    for (let i = 0; i < n; i++) {
      const sx = (i * 97.13) % view.w;
      const speed = snow ? 18 + (i % 5) * 4 : (storm ? 220 : 140) + (i % 7) * 12;
      const drift = snow ? Math.sin(time / 900 + i) * 6 : storm ? 90 : 18;
      const y = still ? (i * 53.7) % view.h : ((i * 53.7) + time / 1000 * speed) % (view.h + 8) - 4;
      const x = still ? sx : ((sx + (snow ? drift : time / 1000 * drift)) % view.w + view.w) % view.w;
      if (snow) ctx.fillRect(Math.round(x), Math.round(y), 2, 2);
      else ctx.fillRect(Math.round(x), Math.round(y), storm ? 2 : 1, storm ? 4 : 3);
    }
  }

  // Draw everything. w = the world (from world.js), g = the game (main.js)
  function draw(w, g, time) {
    const state = g.state;
    // The window or the screen zoom changed: fit again
    const box = canvas.parentElement;
    const fit = g.scene ? sceneFit(g) : buildFit(g);
    if (fitKey(box, fit) !== fitted) resize(fit);
    if (g.scene) { drawScene(g, time, fit); return; }
    const map = HM.MAP;
    const season = HM.rules.seasonOf(state.day);
    const anim = g.settings.motion ? Math.floor(time / 700) % 2 : 0;
    const focus = g.mode === 'build' ? HM.build.focusPoint() : { x: w.player.x + T / 2, y: w.player.y + T / 2 };
    // In build mode, keep the plot between the top bar and the build bar
    const css = view.h / Math.max(1, canvas.getBoundingClientRect().height);
    centreOn(focus.x, focus.y + (g.mode === 'dialogue' ? T * 1.5 : 0), fit ? fit.top * css : 0, fit ? fit.bottom * css : 0);

    ctx.fillStyle = '#5E9A50';
    ctx.fillRect(0, 0, view.w, view.h);

    // Ground and buildings
    const x0 = Math.max(0, Math.floor(camera.x / T)), y0 = Math.max(0, Math.floor(camera.y / T));
    const x1 = Math.min(map.width - 1, Math.floor((camera.x + view.w) / T));
    const y1 = Math.min(map.height - 1, Math.floor((camera.y + view.h) / T));
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        sprite(tileSprite(map.rows[ty][tx], state, season), anim, tx * T, ty * T);
      }
    }

    // The plots: vegetables, built tiles, and the plan of the plot you are planning
    const building = g.mode === 'build' ? HM.build.plotId() : null;
    const snowy = HM.rules.weatherOf(state.day) === 'snow';
    map.plots.forEach(p => {
      const plot = state.plots[p.id];
      // The plan you are drawing, or a plan you kept for a town meeting (shown as a sketch)
      const plan = p.id === building ? HM.build.plan() : plot.plan || null;
      for (let i = 0; i < plot.tiles.length; i++) {
        const fx = (p.x + i % p.w) * T, fy = (p.y + Math.floor(i / p.w)) * T;
        // Cleared rubble becomes plain concrete; the cleared forest slope becomes bare earth
        if (map.rows[p.y + Math.floor(i / p.w)][p.x + i % p.w] === 'r' && plot.rubbleCleared) sprite('tile.concrete', 0, fx, fy);
        if (plot.cleared) sprite('tile.cleared', 0, fx, fy);
        const built = plot.tiles[i];
        const planned = plan ? plan[i] : built;
        const crop = plot.crops && plot.crops[i];
        if (crop && (!planned || planned === 'spaced')) sprite(HM.rules.isGrown(crop) ? 'crop.' + crop.crop : 'crop.sprout', 0, fx, fy);
        const draw = (t, alpha) => sprite(t === 'spaced' ? 'tile.spacedTop' : seasonal(t, season), anim, fx, fy, alpha);
        if (built && planned === built) draw(built);
        else if (planned) {
          draw(planned, 0.55);
          ctx.strokeStyle = 'rgba(91, 70, 54, 0.8)';
          ctx.setLineDash([2, 2]);
          ctx.strokeRect(Math.round(fx - camera.x) + 0.5, Math.round(fy - camera.y) + 0.5, T - 1, T - 1);
          ctx.setLineDash([]);
        }
        if (plot.loose.includes(i) && built && planned === built) sprite('ui.alert', 0, fx + 2, fy - 4);
        // Snow on panels that haven't been swept today
        if (snowy && built && HM.DATA.buildTiles[built].panel && !HM.rules.swept(state, p.id) && plot.owner !== 'quick') {
          ctx.fillStyle = 'rgba(255, 253, 245, 0.85)';
          ctx.fillRect(Math.round(fx - camera.x), Math.round(fy - camera.y), T, 6);
        }
      }
      if (plan && p.id === building) {
        // The edge of the plot you are planning (on open water or grass you could not see it otherwise)
        const ox = Math.round(p.x * T - camera.x), oy = Math.round(p.y * T - camera.y);
        ctx.strokeStyle = 'rgba(255, 248, 225, 0.9)';
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(ox - 0.5, oy - 0.5, p.w * T + 1, p.h * T + 1);
        ctx.setLineDash([]);
        drawView(p, plan, state);
      }
    });

    // After the mudflow, the stream runs brown until the clean-up (or the end of summer)
    const mud = state.flags.mudflow;
    if (mud && !state.flags.cleanUp && season === 'summer') {
      ctx.fillStyle = 'rgba(150, 100, 50, 0.75)';
      for (let ty = Math.max(y0, 13); ty <= Math.min(y1, 31); ty++) {
        for (let tx = Math.max(x0, 59); tx <= Math.min(x1, 72); tx++) {
          if (map.rows[ty][tx] === '~') ctx.fillRect(tx * T - camera.x, ty * T - camera.y, T, T);
        }
      }
    }

    // Things with their own picture (the donation box), festival lanterns and the school-route lights
    map.objects.forEach(o => { if (o.sprite) sprite(o.sprite, 0, o.x * T, o.y * T); });
    // Panels on Hiro's shop roof, after his 3-heart event
    if (state.flags.hiroRoof) SHOP_ROOF.forEach(([x, y]) => sprite('tile.roofPanel', 0, x * T, y * T));
    const lights = drawVillageLights(state, anim);

    // Sparkles on things to pick or find
    map.objects.forEach(o => {
      if (HM.story.sparkles(state, o)) sprite('ui.item', anim, o.x * T, o.y * T - 3 - anim);
    });

    // People and animals, from back to front
    const things = [];
    w.pets.forEach(p => { if (p.visible) things.push({ y: p.y, draw: () => sprite(personFrame(p, time), 0, p.x, p.y) }); });
    w.critters.forEach(c => things.push({ y: c.y, draw: () => sprite('critter.' + c.species, anim + c.phase, c.x, c.y + c.bob(time)) }));
    w.residents.forEach(r => { if (r.visible) things.push({ y: r.y, draw: () => sprite(personFrame(r, time), 0, r.x, r.y) }); });
    things.push({ y: w.player.y, draw: () => sprite(personFrame(w.player, time), 0, w.player.x, w.player.y) });
    things.sort((a, b) => a.y - b.y).forEach(t => t.draw());

    // Signs above: "!" over animals you can look at, a sun over residents with a heart event
    w.critters.forEach(c => { if (c.showAlert) sprite('ui.alert', 0, c.x + 2, c.y - 9 + c.bob(time)); });
    w.residents.forEach(r => { if (r.visible && r.eventWaiting) sprite('ui.sun', 0, r.x, r.y - 13); });
    if (w.look) drawLookRing(w.look);
    if (g.mode === 'build') {
      const c = HM.build.cursorTile(), p = map.plots.find(p => p.id === building);
      if (c && p) sprite('ui.cursor', 0, (p.x + c.x) * T, (p.y + c.y) * T);
    }

    // Time of day and weather
    const wash = tint(state.minutes);
    if (wash) {
      ctx.fillStyle = `rgba(${wash[0] | 0}, ${wash[1] | 0}, ${wash[2] | 0}, ${wash[3]})`;
      ctx.fillRect(0, 0, view.w, view.h);
    }
    // Lamps and lanterns glow through the dark
    lights.forEach(([x, y, r]) => glow(x, y, r));
    const weather = HM.rules.weatherOf(state.day);
    if (weather === 'rain' || weather === 'typhoon' || weather === 'snow') drawWeather(weather, time, !g.settings.motion);
  }

  // ----- The four views in build mode (design.md section 7.3) -----
  // They use shapes as well as colour: stripes, footprints, dots and arrows.
  function drawView(p, plan, state) {
    const view = HM.build.view();
    if (!view) return;
    const at = i => ({ x: Math.round((p.x + i % p.w) * T - camera.x), y: Math.round((p.y + Math.floor(i / p.w)) * T - camera.y) });
    if (view === 'wind') {
      // Arrows blowing in from the south; exposed panels get orange stripes
      ctx.fillStyle = 'rgba(80, 120, 200, 0.85)';
      for (let x = 0; x < p.w; x++) {
        const sx = Math.round((p.x + x) * T - camera.x) + 7, sy = Math.round((p.y + p.h) * T - camera.y) + 3;
        ctx.fillRect(sx, sy, 2, 7);
        ctx.fillRect(sx - 2, sy + 2, 6, 1);
        ctx.fillRect(sx - 1, sy + 1, 4, 1);
      }
      HM.rules.exposedPanels(p.id, plan).forEach(i => {
        const { x, y } = at(i);
        ctx.fillStyle = 'rgba(240, 140, 40, 0.55)';
        for (let k = -T; k < T; k += 4) ctx.fillRect(x + Math.max(0, k), y + Math.max(0, -k), 2, 2);
        ctx.strokeStyle = 'rgba(220, 110, 20, 0.95)';
        ctx.strokeRect(x + 0.5, y + 0.5, T - 1, T - 1);
      });
    } else if (view === 'wildlife') {
      // Footprints on connected corridors; a grey cross on corridors that lead nowhere
      const connected = HM.rules.connectedCorridors(p.id, plan);
      plan.forEach((t, i) => {
        if (t !== 'corridor') return;
        const { x, y } = at(i);
        if (connected.has(i)) {
          ctx.fillStyle = 'rgba(70, 45, 30, 0.9)';
          [[3, 4], [6, 2], [9, 8], [12, 6], [5, 12], [8, 10]].forEach(([dx, dy]) => ctx.fillRect(x + dx, y + dy, 2, 2));
        } else {
          ctx.fillStyle = 'rgba(120, 120, 120, 0.9)';
          for (let k = 2; k < 14; k++) { ctx.fillRect(x + k, y + k, 1, 1); ctx.fillRect(x + 15 - k, y + k, 1, 1); }
        }
      });
    } else if (view === 'water') {
      // Rain runs downhill (south). Brown solid arrows: runoff nothing catches, off the plot into the stream.
      // Blue dotted arrows: runoff a drainage ditch or pond catches. On flat plots, rain soaks in (blue rings).
      const water = HM.community.runoff(p.id, plan);
      const panel = t => t && HM.DATA.buildTiles[t].panel;
      if (water.flat) {
        ctx.fillStyle = 'rgba(50, 110, 200, 0.85)';
        plan.forEach((t, i) => {
          if (!panel(t)) return;
          const { x, y } = at(i);
          ctx.fillRect(x + 5, y + 12, 6, 1); ctx.fillRect(x + 4, y + 13, 1, 1); ctx.fillRect(x + 11, y + 13, 1, 1); ctx.fillRect(x + 5, y + 14, 6, 1);
        });
        return;
      }
      const arrow = (x, y, solid) => {
        if (solid) ctx.fillRect(x + 7, y + 1, 2, 10);
        else for (let k = 1; k < 11; k += 3) ctx.fillRect(x + 7, y + k, 2, 2);
        ctx.fillRect(x + 4, y + 10, 8, 1); ctx.fillRect(x + 5, y + 11, 6, 1); ctx.fillRect(x + 6, y + 12, 4, 1); ctx.fillRect(x + 7, y + 13, 2, 1);
      };
      const column = (i, to, solid) => {
        const col = i % p.w;
        for (let row = Math.floor(i / p.w); row < to; row++) {
          const { x, y } = at(row * p.w + col);
          arrow(x, y, solid);
        }
      };
      ctx.fillStyle = 'rgba(50, 110, 200, 0.95)';
      water.caught.forEach(({ i, by }) => {
        column(i, Math.floor(by / p.w), false);
        const { x, y } = at(by);
        ctx.strokeStyle = 'rgba(50, 110, 200, 0.95)';
        ctx.strokeRect(x + 1.5, y + 1.5, T - 3, T - 3);
      });
      ctx.fillStyle = 'rgba(120, 70, 30, 0.95)';
      water.loose.forEach(({ i }) => column(i, p.h + 1, true));
    } else if (view === 'light') {
      // Shade on the ground: dark under dense panels, dappled under spaced ones
      plan.forEach((t, i) => {
        const shade = t ? HM.DATA.buildTiles[t].shade || 0 : 0;
        if (!shade) return;
        const { x, y } = at(i);
        ctx.fillStyle = 'rgba(30, 30, 60, 0.45)';
        if (shade >= 1) ctx.fillRect(x, y, T, T);
        else for (let yy = 0; yy < T; yy += 2) for (let xx = (yy / 2) % 2 * 2; xx < T; xx += 4) ctx.fillRect(x + xx, y + yy, 2, 2);
      });
    }
  }

  // ----- Scenes in the community hall (js/scenes.js) -----
  function drawScene(g, time, fit) {
    const sc = g.scene, hall = HM.MAP.hall;
    const css = view.h / Math.max(1, canvas.getBoundingClientRect().height);
    const top = fit ? fit.top * css : 0, bottom = fit ? fit.bottom * css : 0;
    const roomW = hall.rows[0].length * T, roomH = hall.rows.length * T;
    camera.x = Math.round(roomW / 2 - view.w / 2);
    // Centred between the top bar and the dialogue box, or just below the top bar if the room is taller
    const seen = view.h - top - bottom;
    camera.y = Math.round(roomH <= seen ? roomH / 2 - (top + seen / 2) : -top);
    ctx.fillStyle = '#3A2F28';
    ctx.fillRect(0, 0, view.w, view.h);
    hall.rows.forEach((row, y) => [...row].forEach((ch, x) => sprite('tile.' + hall.legend[ch], 0, x * T, y * T)));
    if (sc.warmth !== null) drawWarmth(sc.warmth);
    if (sc.map) drawZoneMap(sc);

    // People and tables, back to front. The person speaking stands up.
    const speaker = HM.dialogue.speaker();
    const things = [];
    sc.people.forEach((p, n) => {
      const standing = p.who === speaker;
      const person = { who: p.who, dir: standing && p.seated ? 'down' : p.dir, moving: false, walkTime: 0, blinkOffset: n * 677 };
      const y = p.y * T - (standing && p.seated ? 4 : 0);
      things.push({ y: p.y * T + (standing ? 1 : 0), draw: () => sprite(personFrame(person, time), 0, p.x * T, y) });
    });
    sc.tables.forEach(([x0, x1, ty]) => things.push({ y: ty * T + 0.5, draw: () => {
      for (let x = x0; x < x1; x++) sprite('tile.hallTable', 0, x * T, ty * T + 5);
    } }));
    things.sort((a, b) => a.y - b.y).forEach(t => t.draw());
    // A blackout (the typhoon night without a battery): only candles light the room
    if (sc.dark) {
      ctx.fillStyle = 'rgba(20, 24, 60, 0.6)';
      ctx.fillRect(0, 0, view.w, view.h);
      // (candles stand on the tables, in the gaps between people)
      sc.tables.forEach(([x0, , ty]) => [x0 + 2, x0 + 6].forEach(x => glow(x * T, ty * T + 13, 5)));
    }
  }

  // A warm round glow (lanterns, lamps and candles at night)
  function glow(x, y, r) {
    const cx = Math.round(x - camera.x), cy = Math.round(y - camera.y);
    ctx.fillStyle = 'rgba(246, 212, 106, 0.35)';
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255, 240, 180, 0.9)';
    ctx.fillRect(cx - 1, cy - 1, 2, 2);
  }

  // Gifts to the village you can see: lanterns at festivals, solar lights on the school route (lit at night)
  const LAMPS = [[52, 29], [56, 29], [50, 31], [60, 31]];
  const SHOP_ROOF = [[34, 25], [35, 25], [36, 25]];
  const LANTERNS = [[-3, -2], [3, -2], [-3, 2], [3, 2], [0, -3]];
  // Returns the glows to draw at night, after the evening colour wash: [x, y, radius]
  function drawVillageLights(state, anim) {
    const gifts = state.flags.gifts || {}, h = state.minutes / 60, night = h >= 18 || h < 6;
    const glows = [];
    if (gifts.schoolLights) LAMPS.forEach(([x, y]) => { sprite('ui.lamp', 0, x * T, y * T - 8); if (night) glows.push([x * T + 8, y * T - 3, 6]); });
    const fest = HM.festivals.activeFestival(state);
    // (not at the firefly evening: fireflies need the dark)
    if (gifts.lanterns && fest && fest !== 'hotaru') {
      const [cx, cy] = HM.DATA.festivals[fest].place;
      LANTERNS.forEach(([dx, dy]) => {
        const x = (cx + dx) * T, y = (cy + dy) * T - 6;
        sprite('ui.lantern', 0, x, y);
        if (night) glows.push([x + 8, y + 8, 8 + anim]);
      });
    }
    return glows;
  }

  // The room's warmth: a sun on the wall that grows with good answers (and a pale circle when it's cold)
  function drawWarmth(warmth) {
    const cx = Math.round(3.5 * T - camera.x), cy = Math.round(0.5 * T - camera.y) - 1;
    const r = 2 + warmth;
    if (warmth >= 3) {
      ctx.fillStyle = '#E5A743';
      for (let k = 0; k < 8; k++) {
        const a = k * Math.PI / 4;
        ctx.fillRect(Math.round(cx + Math.cos(a) * (r + 2)), Math.round(cy + Math.sin(a) * (r + 2)), 1, 1);
      }
    }
    ctx.beginPath();
    ctx.arc(cx + 0.5, cy + 0.5, r, 0, Math.PI * 2);
    ctx.fillStyle = warmth ? '#F6D46A' : '#D6CFC4';
    ctx.fill();
    ctx.strokeStyle = warmth ? '#E5A743' : '#737B88';
    ctx.stroke();
  }

  // The zoning workshop: a small map of the village on the table, with stickers on the plots.
  // Shapes as well as colours: green circle = welcome, yellow triangle = careful, red cross = no.
  let miniMap = null;
  const MINI = {
    grass: '#9FD171', meadow: '#CDEA92', weeds: '#CDEA92', path: '#E4C99A', bridge: '#A57F5C', soil: '#A57F5C',
    tree: '#5E9A50', cherry: '#F4A6B8', bigTree: '#5E9A50', water: '#62A6CA', paddy: '#7CC4B8', concrete: '#ABB2BC',
    rubble: '#ABB2BC', hedge: '#78B25E', berries: '#78B25E', roof: '#D96A55', eave: '#5E4434', eaveNest: '#5E4434',
    stoneWall: '#D6CFC4', gravel: '#D6CFC4', steps: '#D6CFC4', fence: '#5E4434'
  };
  function zoneMapCanvas() {
    if (miniMap) return miniMap;
    const map = HM.MAP, c = document.createElement('canvas');
    c.width = map.width; c.height = map.height;
    const k = c.getContext('2d');
    map.rows.forEach((row, y) => [...row].forEach((ch, x) => {
      k.fillStyle = MINI[map.legend[ch].tile] || '#F6E8C6';
      k.fillRect(x, y, 1, 1);
    }));
    miniMap = c;
    return c;
  }
  function drawZoneMap(sc) {
    const map = HM.MAP, mx = sc.map.x - camera.x, my = sc.map.y - camera.y;
    ctx.fillStyle = '#5E4434';
    ctx.fillRect(mx - 5, my - 5, map.width + 10, map.height + 10);
    ctx.fillStyle = '#A57F5C';
    ctx.fillRect(mx - 4, my - 4, map.width + 8, map.height + 8);
    ctx.drawImage(zoneMapCanvas(), mx, my);
    ctx.strokeStyle = 'rgba(58, 47, 40, 0.8)';
    map.plots.forEach(p => { if (p.id !== 'home') ctx.strokeRect(mx + p.x + 0.5, my + p.y + 0.5, p.w - 1, p.h - 1); });
    Object.entries(sc.votes || {}).forEach(([id, vote]) => {
      const p = map.plots.find(q => q.id === id);
      sticker(Math.round(mx + p.x + p.w / 2), Math.round(my + p.y + p.h / 2), vote);
    });
  }
  function sticker(cx, cy, vote) {
    ctx.fillStyle = '#FFFDF5';
    ctx.fillRect(cx - 5, cy - 5, 11, 11);
    ctx.strokeStyle = '#5B4636';
    ctx.strokeRect(cx - 4.5, cy - 4.5, 10, 10);
    if (vote === 'green') {
      ctx.strokeStyle = '#3F7A35';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx + 0.5, cy + 0.5, 3, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 1;
    } else if (vote === 'yellow') {
      ctx.fillStyle = '#C98A1E';
      for (let row = 0; row < 6; row++) ctx.fillRect(cx - Math.floor(row / 2), cy - 3 + row, row + 1, 1);
    } else {
      ctx.fillStyle = '#C24A36';
      for (let k = -3; k <= 2; k++) { ctx.fillRect(cx + k, cy + k, 2, 2); ctx.fillRect(cx + k, cy - k - 1, 2, 2); }
    }
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
    // (the player is drawn in the look chosen for this game)
    const who = p.who === 'player' && HM.game && HM.game.state ? HM.rules.lookOf(HM.game.state) : p.who;
    return `${who}.${p.dir}.${pose}`;
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

  // Run fn once the picture sheet has loaded (for the title screen's looks)
  function whenReady(fn) {
    if (sheet && sheet.complete && sheet.naturalWidth) fn();
    else if (sheet) sheet.addEventListener('load', fn, { once: true });
  }

  HM.render = { init, resize, draw, drawTo, whenReady, screenToTile, TILE: T };
})(globalThis);
