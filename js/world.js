// Hidamari: everything that moves in the world: you, the residents and the animals.
//
// Positions are in pixels (one tile = 16 pixels). Feet decide where someone stands:
// you can walk where the tile under your feet is walkable.

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const T = 16;
  const WALK_SPEED = 56, FAST_SPEED = 92;   // pixels per second

  const world = {
    player: null,
    residents: [],
    pets: [],
    critters: [],
    look: null,               // "look closely" in progress: { critter, progress, x, y }
    lastSpawn: -1
  };

  // ----- The map -----
  function tileAt(tx, ty) {
    const map = HM.MAP;
    if (tx < 0 || ty < 0 || tx >= map.width || ty >= map.height) return null;
    return map.rows[ty][tx];
  }

  // Field tile index at a map tile, or -1
  function fieldIndex(tx, ty) {
    const f = HM.MAP.field;
    if (tx < f.x || ty < f.y || tx >= f.x + f.w || ty >= f.y + f.h) return -1;
    return (ty - f.y) * f.w + (tx - f.x);
  }

  // Can you walk on this tile? Built panels and hedges on your field block the way; meadow does not.
  function walkable(tx, ty, state) {
    const ch = tileAt(tx, ty);
    if (ch === null || !HM.MAP.legend[ch].walk) return false;
    const i = fieldIndex(tx, ty);
    if (i >= 0 && state && state.field[i] && state.field[i] !== 'meadow') return false;
    return true;
  }

  const feetTile = e => ({ x: Math.floor((e.x + 8) / T), y: Math.floor((e.y + 13) / T) });

  // The feet: a small box at the bottom of the 16 × 16 picture
  function feetFree(x, y, state) {
    const pts = [[x + 4, y + 11], [x + 11, y + 11], [x + 4, y + 15], [x + 11, y + 15]];
    return pts.every(([px, py]) => walkable(Math.floor(px / T), Math.floor(py / T), state));
  }

  // ----- Finding a way (breadth-first search over tiles) -----
  function findPath(from, to, state) {
    const map = HM.MAP;
    const key = (x, y) => y * map.width + x;
    if (!walkable(to.x, to.y, state)) return null;
    const prev = new Map([[key(from.x, from.y), null]]);
    const queue = [from];
    while (queue.length) {
      const c = queue.shift();
      if (c.x === to.x && c.y === to.y) {
        const path = [];
        let k = key(c.x, c.y);
        while (k !== key(from.x, from.y)) {
          path.unshift({ x: k % map.width, y: Math.floor(k / map.width) });
          k = prev.get(k);
        }
        return path;
      }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const n = { x: c.x + dx, y: c.y + dy };
        const k = key(n.x, n.y);
        if (prev.has(k) || !walkable(n.x, n.y, state)) continue;
        prev.set(k, key(c.x, c.y));
        queue.push(n);
      }
    }
    return null;
  }

  // The walkable tile next to (tx, ty) that is closest to `near`
  function besideTile(tx, ty, near, state) {
    const options = [[0, 1], [0, -1], [-1, 0], [1, 0]]
      .map(([dx, dy]) => ({ x: tx + dx, y: ty + dy }))
      .filter(t => walkable(t.x, t.y, state));
    if (walkable(tx, ty, state)) options.unshift({ x: tx, y: ty });
    options.sort((a, b) => Math.hypot(a.x - near.x, a.y - near.y) - Math.hypot(b.x - near.x, b.y - near.y));
    return options[0] || null;
  }

  function faceTowards(e, tx, ty) {
    const dx = tx * T - e.x, dy = ty * T - e.y;
    if (Math.abs(dx) > Math.abs(dy)) e.dir = dx > 0 ? 'right' : 'left';
    else if (dy !== 0) e.dir = dy > 0 ? 'down' : 'up';
  }

  // ----- People -----
  function makePerson(who, tx, ty, dir) {
    return { who, x: tx * T, y: ty * T, dir: dir || 'down', moving: false, walkTime: 0,
      blinkOffset: Math.floor(Math.random() * 3000), path: null, onArrive: null, visible: true };
  }

  // Move along a path of tiles. Returns true while still walking.
  function followPath(e, speed, dt) {
    if (!e.path || !e.path.length) return false;
    const next = e.path[0];
    const tx = next.x * T, ty = next.y * T;
    const dx = tx - e.x, dy = ty - e.y;
    const dist = Math.hypot(dx, dy);
    const step = speed * dt;
    if (Math.abs(dx) > Math.abs(dy)) e.dir = dx > 0 ? 'right' : 'left';
    else if (dy) e.dir = dy > 0 ? 'down' : 'up';
    if (dist <= step) {
      e.x = tx; e.y = ty;
      e.path.shift();
      if (!e.path.length) {
        e.path = null;
        const done = e.onArrive;
        e.onArrive = null;
        if (done) done();
        return false;
      }
    } else {
      e.x += dx / dist * step;
      e.y += dy / dist * step;
    }
    return true;
  }

  // Walk the player to a tile (by tapping). onArrive runs when there.
  function walkTo(tx, ty, state, onArrive) {
    const p = world.player;
    const from = feetTile(p);
    if (from.x === tx && from.y === ty) {
      p.path = null;
      // snap to the tile, then arrive
      p.x = tx * T; p.y = ty * T;
      if (onArrive) onArrive();
      return true;
    }
    const path = findPath(from, { x: tx, y: ty }, state);
    if (!path) return false;
    p.path = path;
    p.onArrive = onArrive || null;
    return true;
  }

  function updatePlayer(dt, state, canMove) {
    const p = world.player;
    let moving = false;
    const input = canMove ? HM.input.direction() : { dx: 0, dy: 0 };
    if (input.dx || input.dy) {
      p.path = null; p.onArrive = null;
      const speed = input.fast ? FAST_SPEED : WALK_SPEED;
      const len = Math.hypot(input.dx, input.dy);
      const mx = input.dx / len * speed * dt, my = input.dy / len * speed * dt;
      if (input.dx && !input.dy) p.dir = input.dx > 0 ? 'right' : 'left';
      else if (input.dy && !input.dx) p.dir = input.dy > 0 ? 'down' : 'up';
      else if (!((p.dir === 'left' || p.dir === 'right') ? (input.dx > 0) === (p.dir === 'right') : (input.dy > 0) === (p.dir === 'down'))) {
        p.dir = input.dy > 0 ? 'down' : 'up';
      }
      if (feetFree(p.x + mx, p.y, state)) { p.x += mx; moving = true; }
      if (feetFree(p.x, p.y + my, state)) { p.y += my; moving = true; }
      p.fast = input.fast && moving;
    } else if (canMove && p.path) {
      moving = followPath(p, WALK_SPEED * 1.15, dt);
      p.fast = false;
    }
    p.moving = moving;
    p.walkTime = moving ? p.walkTime + dt : 0;
  }

  // If a newly built tile is under your feet, step aside
  function unstick(state) {
    const p = world.player;
    if (feetFree(p.x, p.y, state)) return;
    const s = HM.MAP.start;
    const here = feetTile(p);
    const spot = besideTile(here.x, here.y, here, state) || { x: s.x, y: s.y };
    p.x = spot.x * T; p.y = spot.y * T;
  }

  // ----- Residents and their daily routine -----
  // Does a plan's "when" fit today? (see js/game-data.js)
  function planFits(when, state) {
    if (!when) return true;
    const R = HM.rules;
    const dayIn = R.dayInSeason(state.day);
    if (when.weather && !when.weather.includes(R.weatherOf(state.day))) return false;
    if (when.weekend !== undefined && when.weekend !== (dayIn >= 6)) return false;
    if (when.days && !when.days.includes(dayIn)) return false;
    if (when.fromDay && state.day < when.fromDay) return false;
    return true;
  }

  // Where a resident wants to be now: a spot name, or a list of spots (a walk)
  function scheduledSpot(who, state) {
    const plan = HM.DATA.residents[who].plans.find(p => planFits(p.when, state));
    const hour = state.minutes / 60;
    let spot = 'inside';
    plan.at.forEach(([from, name]) => { if (hour >= from) spot = name; });
    return spot;
  }
  const spotKey = spot => (Array.isArray(spot) ? spot.join('>') : spot);

  // Where a resident goes: a named spot, or their front door for "inside"
  function spotTile(who, spot) {
    const name = spot === 'inside' ? HM.DATA.residents[who].home : spot;
    return HM.MAP.spots[name];
  }

  // Is the resident indoors (unseen) at this spot?
  const indoors = spot => spot === 'inside' || !!(HM.MAP.spots[spot] && HM.MAP.spots[spot].inside);

  function placeResidents(state) {
    world.residents = Object.keys(HM.DATA.residents).map(who => {
      const want = scheduledSpot(who, state);
      const name = Array.isArray(want) ? want[0] : want;
      const t = spotTile(who, name);
      const r = makePerson(who, t.x, t.y, t.dir);
      Object.assign(r, { want, key: spotKey(want), stop: 0, spot: name, wait: 0, arrived: true, visible: !indoors(name) });
      return r;
    });
    placePets();
  }

  // Send a resident to a spot (out of a building first, if they are inside one)
  function headTo(r, name) {
    const from = spotTile(r.who, r.spot);
    r.spot = name;
    r.wait = 0;
    r.arrived = false;
    const t = spotTile(r.who, name);
    if (!r.visible) {
      r.x = from.x * T; r.y = from.y * T;
      r.visible = true;
    }
    r.path = findPath(feetTile(r), { x: t.x, y: t.y }, null) || [];
    if (!r.path.length) r.path = null;
    r.onArrive = () => {
      r.dir = t.dir;
      r.arrived = true;
      if (indoors(name)) r.visible = false;
    };
    if (!r.path) r.onArrive();
  }

  function updateResidents(dt, state, busyWith) {
    world.residents.forEach(r => {
      const want = scheduledSpot(r.who, state);
      const key = spotKey(want);
      if (key !== r.key) {
        r.want = want; r.key = key; r.stop = 0;
        headTo(r, Array.isArray(want) ? want[0] : want);
      } else if (Array.isArray(r.want) && r.arrived && r.who !== busyWith) {
        // On a walk: stay a moment at each stop, then go on to the next
        r.wait += dt;
        if (r.wait > 2.5) {
          r.stop = (r.stop + 1) % r.want.length;
          headTo(r, r.want[r.stop]);
        }
      }
      if (r.who === busyWith) { r.moving = false; return; }
      r.moving = followPath(r, HM.DATA.residents[r.who].speed, dt);
      r.walkTime = r.moving ? r.walkTime + dt : 0;
    });
    updatePets(dt);
  }

  // ----- Pets: Kotetsu walks with Mr. Oda on his morning walk -----
  function placePets() {
    world.pets = Object.entries(HM.DATA.residents).filter(([, info]) => info.pet).map(([owner, info]) => {
      const o = world.residents.find(r => r.who === owner);
      const p = makePerson(info.pet, 0, 0, 'down');
      Object.assign(p, { owner, route: info.petRoute, x: o.x, y: o.y, visible: false });
      return p;
    });
  }

  function updatePets(dt) {
    world.pets.forEach(p => {
      const o = world.residents.find(r => r.who === p.owner);
      const walking = o.visible && Array.isArray(o.want) && o.want.includes(p.route);
      if (!walking) { p.visible = false; p.x = o.x; p.y = o.y; p.moving = false; return; }
      p.visible = true;
      // Trot a little behind the owner
      const back = { up: [0, 12], down: [0, -12], left: [12, 0], right: [-12, 0] }[o.dir];
      const tx = o.x + back[0], ty = o.y + back[1];
      const dx = tx - p.x, dy = ty - p.y, dist = Math.hypot(dx, dy);
      const step = HM.DATA.residents[p.owner].speed * 1.4 * dt;
      if (dist > 3) {
        p.x += dx / dist * Math.min(step, dist);
        p.y += dy / dist * Math.min(step, dist);
        if (Math.abs(dx) > Math.abs(dy)) p.dir = dx > 0 ? 'right' : 'left';
        else p.dir = dy > 0 ? 'down' : 'up';
        p.moving = true;
        p.walkTime += dt;
      } else {
        p.moving = false;
        p.walkTime = 0;
        p.dir = o.dir;
      }
    });
  }

  // ----- Animals -----
  function habitatTiles(habitat, state) {
    const map = HM.MAP;
    const tiles = [];
    const f = map.field;
    const fieldTiles = type => state.field
      .map((t, i) => (t === type ? { x: f.x + i % f.w, y: f.y + Math.floor(i / f.w) } : null)).filter(Boolean);
    if (habitat === 'gardenMeadow') return fieldTiles('meadow');
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const ch = map.rows[y][x];
        const h = map.legend[ch].habitat;
        if (habitat === 'meadow' && h === 'meadow') tiles.push({ x, y });
        if (habitat === 'hedge' && h === 'hedge') tiles.push({ x, y });
        if (habitat === 'waterEdge' && walkable(x, y, state) && fieldIndex(x, y) < 0 &&
            [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => ['water', 'paddy'].includes((map.legend[tileAt(x + dx, y + dy)] || {}).habitat))) tiles.push({ x, y });
        if (habitat === 'nest' && walkable(x, y, state)) {
          for (let ny = y - 3; ny <= y; ny++) for (let nx = x - 2; nx <= x + 2; nx++) {
            if (tileAt(nx, ny) === 'N' && !tiles.some(t => t.x === x && t.y === y)) tiles.push({ x, y });
          }
        }
      }
    }
    if (habitat === 'meadow') tiles.push(...fieldTiles('meadow'));
    if (habitat === 'hedge') tiles.push(...fieldTiles('hedge'));
    return tiles;
  }

  function speciesActive(sp, state) {
    const info = HM.DATA.species[sp];
    const weather = HM.rules.weatherOf(state.day);
    if (!info.seasons.includes(HM.rules.seasonOf(state.day))) return false;
    if (info.notIn && info.notIn.includes(weather)) return false;
    const hours = weather === 'rain' && info.rainHours ? info.rainHours : info.hours;
    const h = state.minutes / 60;
    if (!hours.some(([a, b]) => h >= a && h < b)) return false;
    if (info.minGarden && habitatTiles(info.habitat, state).length < info.minGarden) return false;
    return true;
  }

  const BOB = { cabbageWhite: [300, 2], grassBlue: [260, 2], swallow: [480, 3] };

  function spawnCritters(state) {
    const half = Math.floor(state.minutes / 30);
    if (half === world.lastSpawn) return;
    world.lastSpawn = half;
    // Animals leave when their time is over
    world.critters = world.critters.filter(c => speciesActive(c.species, state) && state.minutes < c.until);
    const p = feetTile(world.player);
    HM.DATA.speciesOrder.forEach(sp => {
      const info = HM.DATA.species[sp];
      if (!speciesActive(sp, state)) return;
      if (world.critters.filter(c => c.species === sp).length >= info.max) return;
      if (Math.random() < 0.35) return;   // not every half hour
      // Not on a tile that already has an animal, and not right on top of you
      let tiles = habitatTiles(info.habitat, state).filter(t => !world.critters.some(c => c.tx === t.x && c.ty === t.y) &&
        (Math.abs(t.x - p.x) > 1 || Math.abs(t.y - p.y) > 1));
      const near = tiles.filter(t => Math.abs(t.x - p.x) <= 12 && Math.abs(t.y - p.y) <= 9);
      if (near.length) tiles = near;
      if (!tiles.length) return;
      const t = tiles[Math.floor(Math.random() * tiles.length)];
      const [period, size] = BOB[sp] || [1, 0];
      world.critters.push({
        species: sp, tx: t.x, ty: t.y, x: t.x * T, y: t.y * T - (info.habitat === 'hedge' ? 4 : 0),
        phase: Math.random() < 0.5 ? 0 : 1, until: state.minutes + 120 + Math.random() * 60,
        bob: time => (size ? Math.round(Math.sin(time / period) * size) : 0), showAlert: false
      });
    });
  }

  function updateCritters(dt, state, diaryOpen) {
    spawnCritters(state);
    const p = world.player;
    const pc = { x: p.x + 8, y: p.y + 10 };
    world.critters = world.critters.filter(c => {
      const d = Math.hypot(c.x + 8 - pc.x, c.y + 8 - pc.y);
      // Shy birds fly off when you run close to them
      if (HM.DATA.species[c.species].shy && p.fast && d < 48) {
        if (world.look && world.look.critter === c) world.look = null;
        return false;
      }
      c.showAlert = diaryOpen && d < 44 && !(world.look && world.look.critter === c);
      return true;
    });
    // Looking closely: stand still until the ring is full
    if (world.look) {
      const l = world.look;
      if (p.moving || !world.critters.includes(l.critter)) world.look = null;
      else {
        l.progress = Math.min(1, l.progress + dt / HM.DATA.lookSeconds);
        if (l.progress >= 1) {
          world.look = null;
          return l.critter;
        }
      }
    }
    return null;
  }

  function startLook(critter) {
    world.look = { critter, progress: 0, x: critter.x, y: critter.y };
  }

  // ----- What the action button would do now -----
  function actionTarget(state) {
    const p = world.player;
    const off = { up: [0, -12], down: [0, 12], left: [-12, 0], right: [12, 0] }[p.dir];
    const front = { x: p.x + 8 + off[0], y: p.y + 12 + off[1] };
    const pc = { x: p.x + 8, y: p.y + 12 };

    const near = world.residents.find(r => r.visible &&
      (Math.hypot(r.x + 8 - front.x, r.y + 12 - front.y) < 14 || Math.hypot(r.x + 8 - pc.x, r.y + 12 - pc.y) < 10));
    if (near) return { type: 'talk', who: near.who, resident: near };

    if (state.flags.diary) {
      const c = world.critters.filter(c => Math.hypot(c.x + 8 - pc.x, c.y + 8 - pc.y) < 40)
        .sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y))[0];
      if (c) return { type: 'look', critter: c };
    }

    const ft = { x: Math.floor(front.x / T), y: Math.floor(front.y / T) };
    const own = feetTile(p);
    for (const t of [ft, own]) {
      const obj = HM.MAP.objects.find(o => o.x === t.x && o.y === t.y && HM.story.available(state, o));
      if (obj && !(obj.id === 'leaves' && state.flags.leavesCleared)) return { type: 'object', id: obj.id };
      if (fieldIndex(t.x, t.y) >= 0) return { type: 'object', id: 'fieldSign' };
    }
    return null;
  }

  // What is at a tapped tile: a resident, an animal or a thing to use
  function thingAt(tx, ty, state) {
    const r = world.residents.find(r => r.visible && feetTile(r).x === tx && feetTile(r).y === ty);
    if (r) return { type: 'talk', who: r.who, resident: r };
    const c = world.critters.find(c => c.tx === tx && c.ty === ty);
    if (c) return { type: 'look', critter: c };
    const obj = HM.MAP.objects.find(o => o.x === tx && o.y === ty && HM.story.available(state, o));
    if (obj) return { type: 'object', id: obj.id };
    return null;
  }

  // Start of a day (or after loading): you at your door, residents where they belong
  function reset(state) {
    const s = HM.MAP.start;
    world.player = makePerson('player', s.x, s.y, s.dir);
    world.player.fast = false;
    placeResidents(state);
    world.critters = [];
    world.look = null;
    world.lastSpawn = -1;
  }

  // After time jumps (for example while building): everyone goes straight to their spot
  function settle(state) {
    placeResidents(state);
    world.lastSpawn = -1;
  }

  Object.assign(world, {
    reset, settle, updatePlayer, updateResidents, updateCritters, startLook,
    actionTarget, thingAt, walkTo, besideTile, faceTowards, feetTile, unstick, walkable, fieldIndex
  });
  HM.world = world;
})(globalThis);
