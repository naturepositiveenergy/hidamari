// Hidamari: runs the game. Starts everything, moves time forward, and decides what the
// action button, taps and keys do in each situation ("mode"):
//   title     the title screen
//   world     walking around (the clock runs)
//   dialogue  someone is talking (the clock stops)
//   panel     a window is open: bag, diary, menu, summary (the clock stops)
//   build     build mode on a plot (the clock stops)
// A scene in the community hall (js/scenes.js) is a conversation with the hall room drawn instead of the village.

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const el = id => document.getElementById(id);

  const game = {
    state: null,
    mode: 'title',
    settings: { relaxed: false, motion: true, plainFont: false, textSize: 1, furigana: false, music: 0.4, sounds: 0.6, soundOn: true },
    showControls: true,       // the controls hint, until you first move or tap
    talkingWith: null,
    scene: null,              // a scene in the community hall (js/scenes.js), or null
    pendingEnd: false,
    told: {},                 // hints already shown today (evening chime, late)

    setMode(m) { this.mode = m; },

    // ----- Starting and stopping -----
    newGame(name, look) {
      const state = HM.rules.newGame(name, look);
      HM.save.write(state);
      this.start(state);
    },

    continueGame() {
      const state = HM.save.read();
      if (!state) { HM.ui.refreshTitle(); return; }
      this.start(state);
      if (state.finished) { if (HM.festivals.storyYear(state)) HM.ui.showEnd(); else HM.ui.showFreeEnd(); }
    },

    // After the ending: one more year without new story (design.md section 12)
    startFreeYear() {
      const state = this.state;
      if (!HM.festivals.startFreeYear(state)) return;
      HM.save.write(state);
      HM.world.reset(state);
      this.setMode('world');
      this.play([{ say: 'free.start', who: 'narrator' }].concat(HM.story.morning(state)));
    },

    start(state) {
      this.state = state;
      this.scene = null;
      this.heartsSeen = null;
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
      if (/Door$/.test(id) && id !== 'homeDoor' && id !== 'shopDoor') HM.sound.play('knock');
      const result = HM.story.useObject(this, id);
      if (result && result.build) HM.build.open(result.build === true ? 'home' : result.build);
      else if (result && result.shop) HM.ui.showShop();
      else if (result && result.talkTo) this.talkTo(result.talkTo);
      else if (result && result.length) this.play(result);
    },

    doTarget(target) {
      if (!target) return;
      if (target.type === 'talk') this.talkTo(target.resident);
      else if (target.type === 'look') HM.world.startLook(target.critter);
      else if (target.type === 'object') this.useObject(target.id);
      else if (target.type === 'farm') this.play(HM.story.farm(this, target.i));
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
      let thing = w.thingAt(tile.x, tile.y, state);
      if (!thing && w.fieldIndex(tile.x, tile.y) >= 0) thing = { type: 'farm', i: w.fieldIndex(tile.x, tile.y) };
      const from = w.feetTile(p);
      if (thing) {
        const target = thing.type === 'talk' ? w.feetTile(thing.resident)
          : thing.type === 'object' && thing.x === undefined ? HM.MAP.objects.find(o => o.id === thing.id) : { x: tile.x, y: tile.y };
        const beside = w.besideTile(target.x, target.y, from, state);
        if (!beside) return;
        w.walkTo(beside.x, beside.y, state, () => {
          w.faceTowards(p, target.x, target.y);
          if (this.mode !== 'world') return;
          if (thing.type === 'talk') { if (thing.resident.visible) this.talkTo(thing.resident); }
          else if (thing.type === 'look') { if (w.critters.includes(thing.critter)) w.startLook(thing.critter); }
          else if (thing.type === 'farm') this.play(HM.story.farm(this, thing.i));
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
      // The nearest open plot within 3 tiles
      const here = HM.world.feetTile(HM.world.player);
      const near = HM.MAP.plots.find(p => this.state.plots[p.id].open &&
        here.x >= p.x - 3 && here.x <= p.x + p.w + 2 && here.y >= p.y - 3 && here.y <= p.y + p.h + 2);
      if (near) HM.build.open(near.id);
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
        // The last evening of the year: the village gathers in the community hall, then the ending.
        // After the free year: a short goodbye.
        if (state.finished && HM.festivals.storyYear(state)) { HM.scenes.startEnding(this, () => HM.ui.showEnd()); return; }
        if (state.finished) {
          HM.scenes.start(this, 'ending', [{ say: 'free.goodbye.1', who: 'oda' }, { say: 'free.goodbye.2', who: 'oda' }], () => HM.ui.showFreeEnd());
          return;
        }
        HM.world.reset(state);
        this.play(HM.story.morning(state));
      });
    },

    afterBuild(check) {
      HM.sound.play('build');
      HM.world.settle(this.state);
      HM.world.unstick(this.state);
      if (check.grant) HM.ui.say('build.grant', { amount: check.grant.toLocaleString('en') }, 6);
      else HM.ui.say('build.done', { minutes: check.minutes });
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

  // The text sizes (design.md section 15): normal, large, extra large
  const TEXT_SCALE = { 1: 1, 2: 1.15, 3: 1.3 };
  function applySettings() {
    document.body.classList.toggle('plain-font', !!game.settings.plainFont);
    document.documentElement.style.setProperty('--text-scale', TEXT_SCALE[game.settings.textSize] || 1);
    if (game.state) HM.render.resize();
    // Furigana: only for the Japanese texts (design.md section 15)
    HM.furigana.set(!!game.settings.furigana && I18n.getLanguage() === 'ja');
    // Music and sounds (design.md section 16): two volumes, and the on/off button on the title screen
    HM.sound.setVolume('music', game.settings.soundOn ? game.settings.music : 0);
    HM.sound.setVolume('sounds', game.settings.soundOn ? game.settings.sounds : 0);
  }

  // ----- Every frame -----
  function update(dt, now) {
    const s = game.state;
    const time = HM.DATA.time;
    if (game.mode === 'world' && !s.finished) {
      s.minutes += dt * time.minutesPerSecond * (game.settings.relaxed ? 0.5 : 1);
      if (s.minutes >= time.eveningChime && !game.told.chime) { game.told.chime = true; HM.ui.say('hint.chime'); HM.sound.play('chime'); }
      if (s.minutes >= 22 * 60 && !game.told.late) { game.told.late = true; HM.ui.say('hint.late', null, 6); }
      if (s.minutes >= time.dayEnd) {
        s.minutes = time.dayEnd;
        game.play([{ say: 'hint.midnight', who: 'narrator' }], () => game.endDay());
      } else if (!HM.scenes.check(game)) HM.festivals.check(game);     // meetings, workshops, festivals
      // New notes in the village notebook (js/notebook.js)
      const notes = game.mode === 'world' ? HM.notebook.check(s) : [];
      if (notes.length === 1) HM.ui.say('nb.new', { title: { key: `nb.${notes[0]}.title` } }, 5);
      else if (notes.length > 1) HM.ui.say('nb.newMany', { n: notes.length }, 5);
    }
    HM.world.updatePlayer(dt, s, game.mode === 'world');
    HM.world.updateResidents(dt, s, game.talkingWith);
    const looked = HM.world.updateCritters(dt, s, !!s.flags.diary);
    if (looked && game.mode === 'world') game.onLooked(looked);
    HM.world.residents.forEach(r => { r.eventWaiting = r.visible && HM.events.waiting(s, r.who, r.spot); });
    // A new heart with someone: a little sound
    const hearts = HM.DATA.friends.map(f => HM.rules.heartsWith(s, f)).join();
    if (game.heartsSeen && hearts !== game.heartsSeen && hearts.split(',').some((h, i) => Number(h) > Number(game.heartsSeen.split(',')[i]))) HM.sound.play('heart');
    game.heartsSeen = hearts;
    HM.render.draw(HM.world, game, now);
    HM.ui.updateHud();
  }

  let last = 0;
  function frame(now) {
    const dt = Math.min(0.1, last ? (now - last) / 1000 : 0);
    last = now;
    if (game.state && game.mode !== 'title') update(dt, now);
    HM.soundscape.update(game, now);       // the music and sounds of nature that fit the moment
    requestAnimationFrame(frame);
  }

  // ----- Start -----
  function boot() {
    const reduced = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
    game.settings = Object.assign({ relaxed: false, motion: !reduced, plainFont: false, textSize: 1, furigana: false, music: 0.4, sounds: 0.6, soundOn: true },
      HM.save.readSettings());
    // Browsers allow sound only after a tap or a key press (js/sound.js)
    ['pointerdown', 'keydown'].forEach(type => document.addEventListener(type, () => HM.sound.unlock(), true));
    applySettings();
    I18n.onChange(() => { HM.ui.onLanguage(); HM.build.refresh(); applySettings(); });
    I18n.init();
    HM.dialogue.init();
    HM.build.init(game);
    HM.ui.initTitle(game);
    applySettings();       // (again, now that the language is known: furigana)
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
