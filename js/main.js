// Hidamari: runs the game. Starts everything, moves time forward, and decides what the
// action button, taps and keys do in each situation ("mode"):
//   title     the title screen
//   world     walking around (the clock runs)
//   dialogue  someone is talking (the clock stops)
//   panel     a window is open: bag, diary, menu, summary (the clock stops)
//   build     build mode on your home field (the clock stops)

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const el = id => document.getElementById(id);

  const game = {
    state: null,
    mode: 'title',
    settings: { relaxed: false, motion: true, plainFont: false },
    showControls: true,       // the controls hint, until you first move or tap
    talkingWith: null,
    pendingEnd: false,
    told: {},                 // hints already shown today (evening chime, late)

    setMode(m) { this.mode = m; },

    // ----- Starting and stopping -----
    newGame(name) {
      const state = HM.rules.newGame(name);
      HM.save.write(state);
      this.start(state);
    },

    continueGame() {
      const state = HM.save.read();
      if (!state) { HM.ui.refreshTitle(); return; }
      this.start(state);
      if (state.finished) HM.ui.showEnd();
    },

    start(state) {
      this.state = state;
      this.told = {};
      this.pendingEnd = false;
      HM.world.reset(state);
      HM.ui.showScreen('game');
      this.setMode('world');
      if (state.finished) return;
      if (state.day === 1 && !state.flags.introDone) {
        this.play(HM.story.intro(), () => { this.state.flags.introDone = true; });
      } else {
        this.play(HM.story.morning(state));
      }
    },

    toTitle() {
      HM.ui.closePanel();
      if (HM.build.isOpen()) HM.build.close();
      this.state = null;
      this.setMode('title');
      HM.ui.refreshTitle();
      HM.ui.showScreen('title');
    },

    // ----- Conversations -----
    play(steps, onEnd) {
      this.setMode('dialogue');
      HM.dialogue.play(this, steps, () => {
        this.talkingWith = null;
        if (this.mode === 'dialogue') this.setMode('world');
        if (onEnd) onEnd();
        if (this.pendingEnd) { this.pendingEnd = false; this.endDay(); }
      });
    },

    talkTo(r) {
      const p = HM.world.player;
      const pt = HM.world.feetTile(p), rt = HM.world.feetTile(r);
      HM.world.faceTowards(p, rt.x, rt.y);
      HM.world.faceTowards(r, pt.x, pt.y);
      r.path = r.path || null;
      this.talkingWith = r.who;
      this.play(HM.story.talk(this, r.who, r));
    },

    useObject(id) {
      const result = HM.story.useObject(this, id);
      if (result && result.build) HM.build.open();
      else if (result && result.length) this.play(result);
    },

    doTarget(target) {
      if (!target) return;
      if (target.type === 'talk') this.talkTo(target.resident);
      else if (target.type === 'look') HM.world.startLook(target.critter);
      else if (target.type === 'object') this.useObject(target.id);
    },

    // ----- Input -----
    action(e) {
      if (e && e.target && e.target.closest && e.target.closest('button, input, a, select')) return false;
      if (this.mode === 'dialogue') return HM.dialogue.advance();
      if (this.mode === 'build') { HM.build.placeAtCursor(); return true; }
      if (this.mode !== 'world') return false;
      this.showControls = false;
      this.doTarget(HM.world.actionTarget(this.state));
      return true;
    },

    back() {
      if (this.mode === 'panel') { HM.ui.closePanel(); return true; }
      if (this.mode === 'build') { HM.build.cancel(); return true; }
      if (this.mode === 'world') { HM.ui.showMenu(); return true; }
      return false;
    },

    tap(tile) {
      if (this.mode === 'build') { HM.build.tap(tile); return; }
      if (this.mode === 'dialogue') { HM.dialogue.advance(); return; }
      if (this.mode !== 'world') return;
      this.showControls = false;
      const state = this.state, w = HM.world, p = w.player;
      let thing = w.thingAt(tile.x, tile.y);
      if (!thing && w.fieldIndex(tile.x, tile.y) >= 0) thing = { type: 'object', id: 'fieldSign' };
      const from = w.feetTile(p);
      if (thing) {
        const target = thing.type === 'talk' ? w.feetTile(thing.resident)
          : thing.type === 'object' ? HM.MAP.objects.find(o => o.id === thing.id) : { x: tile.x, y: tile.y };
        const beside = w.besideTile(target.x, target.y, from, state);
        if (!beside) return;
        w.walkTo(beside.x, beside.y, state, () => {
          w.faceTowards(p, target.x, target.y);
          if (this.mode !== 'world') return;
          if (thing.type === 'talk') { if (thing.resident.visible) this.talkTo(thing.resident); }
          else if (thing.type === 'look') { if (w.critters.includes(thing.critter)) w.startLook(thing.critter); }
          else this.useObject(thing.id);
        });
        return;
      }
      if (w.walkable(tile.x, tile.y, state)) w.walkTo(tile.x, tile.y, state);
      else {
        const beside = w.besideTile(tile.x, tile.y, from, state);
        if (beside) w.walkTo(beside.x, beside.y, state);
      }
    },

    openBuild() {
      if (this.mode !== 'world') return false;
      const f = HM.MAP.field, here = HM.world.feetTile(HM.world.player);
      const near = here.x >= f.x - 3 && here.x <= f.x + f.w + 2 && here.y >= f.y - 3 && here.y <= f.y + f.h + 2;
      if (near) HM.build.open();
      else HM.ui.say('build.tooFar');
      return true;
    },

    // ----- Time -----
    passTime(minutes) {
      this.state.minutes = Math.min(HM.DATA.time.dayEnd - 1, this.state.minutes + minutes);
    },

    requestEndDay() { this.pendingEnd = true; },

    endDay() {
      const state = this.state;
      if (state.finished) { HM.ui.showEnd(); return; }
      HM.world.player.path = null;
      HM.world.look = null;
      const sum = HM.rules.endDay(state);
      sum.saved = HM.save.write(state);
      this.told = {};
      HM.ui.showSummary(sum, () => {
        if (state.finished) { HM.ui.showEnd(); return; }
        HM.world.reset(state);
        this.play(HM.story.morning(state));
      });
    },

    afterBuild(check) {
      HM.world.settle(this.state);
      HM.world.unstick(this.state);
      HM.ui.say('build.done', { minutes: check.minutes });
    },

    onLooked(critter) {
      const state = this.state;
      const area = areaOf(critter.tx, critter.ty);
      if (HM.rules.recordSpecies(state, critter.species, area)) HM.ui.showNewSpecies(critter.species, area);
      else HM.ui.say('look.again', { species: t('species.' + critter.species) });
    },

    changeSetting(key, value) {
      this.settings[key] = value;
      HM.save.writeSettings(this.settings);
      applySettings();
    }
  };

  function areaOf(tx, ty) {
    if (HM.world.fieldIndex(tx, ty) >= 0) return 'field';
    const a = HM.MAP.areas.find(a => tx >= a.x && ty >= a.y && tx < a.x + a.w && ty < a.y + a.h);
    return a ? a.id : 'village';
  }

  function applySettings() {
    document.body.classList.toggle('plain-font', !!game.settings.plainFont);
  }

  // ----- Every frame -----
  function update(dt, now) {
    const s = game.state;
    const time = HM.DATA.time;
    if (game.mode === 'world' && !s.finished) {
      s.minutes += dt * time.minutesPerSecond * (game.settings.relaxed ? 0.5 : 1);
      if (s.minutes >= time.eveningChime && !game.told.chime) { game.told.chime = true; HM.ui.say('hint.chime'); }
      if (s.minutes >= 22 * 60 && !game.told.late) { game.told.late = true; HM.ui.say('hint.late', null, 6); }
      if (s.minutes >= time.dayEnd) {
        s.minutes = time.dayEnd;
        game.play([{ say: 'hint.midnight', who: 'narrator' }], () => game.endDay());
      }
    }
    HM.world.updatePlayer(dt, s, game.mode === 'world');
    HM.world.updateResidents(dt, s, game.talkingWith);
    const looked = HM.world.updateCritters(dt, s, !!s.flags.diary);
    if (looked && game.mode === 'world') game.onLooked(looked);
    HM.world.residents.forEach(r => { r.eventWaiting = r.visible && HM.story.eventWaiting(s, r.who, r.spot); });
    HM.render.draw(HM.world, game, now);
    HM.ui.updateHud();
  }

  let last = 0;
  function frame(now) {
    const dt = Math.min(0.1, last ? (now - last) / 1000 : 0);
    last = now;
    if (game.state && game.mode !== 'title') update(dt, now);
    requestAnimationFrame(frame);
  }

  // ----- Start -----
  function boot() {
    const reduced = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
    game.settings = Object.assign({ relaxed: false, motion: !reduced, plainFont: false }, HM.save.readSettings());
    applySettings();
    I18n.onChange(() => { HM.ui.onLanguage(); HM.build.refresh(); });
    I18n.init();
    HM.dialogue.init();
    HM.build.init(game);
    HM.ui.initTitle(game);
    HM.input.init({
      action: e => game.action(e),
      back: () => game.back(),
      build: () => game.openBuild(),
      diary: () => { if (game.mode !== 'world') return false; HM.ui.showDiary(); return true; },
      bag: () => { if (game.mode !== 'world') return false; HM.ui.showBag(); return true; },
      number: n => (game.mode === 'dialogue' ? HM.dialogue.pick(n) : game.mode === 'build' ? HM.build.toolByNumber(n) : false),
      arrow: code => (game.mode === 'build' ? HM.build.moveCursor(code) : game.mode === 'world'),
      tap: tile => game.tap(tile),
      pointerDrag: tile => { if (game.mode === 'build') HM.build.drag(tile); }
    });
    el('menuBtn').addEventListener('click', () => { if (game.mode === 'world') HM.ui.showMenu(); });
    root.addEventListener('resize', () => HM.render.resize());
    HM.render.init(el('world'), () => requestAnimationFrame(frame));
    HM.ui.showScreen('title');
  }

  // For testing: move the game forward by dt seconds without waiting for the screen
  game.step = dt => { if (game.state && game.mode !== 'title') update(dt, performance.now()); };

  HM.game = game;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(globalThis);
