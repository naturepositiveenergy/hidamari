// Hidamari: sound and music, made in code with the browser's Web Audio (design.md section 16, Milestone 3.3).
// There are no sound files: every instrument and every sound of nature is built from simple waves and noise.
//
// Browsers only allow sound after the player has tapped or pressed a key, so sound starts then.
// Two volumes (settings): music, and sounds (actions and nature). 0 turns them off.
//
//   HM.sound.music(name)     play a tune from js/music.js (null: silence); changes fade softly
//   HM.sound.ambience(list)  which sounds of nature play: frogs, cicadas, crickets, chimes, birds, rain, storm
//   HM.sound.play(name)      a short sound: talk, choose, pickup, build, coin, species, heart, knock, chime

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};

  let ctx = null, master = null, musicBus = null, soundBus = null, noiseBuffer = null;
  const volume = { music: 0.4, sounds: 0.6 };

  // ----- Starting -----
  function start() {
    if (ctx) return true;
    const AC = root.AudioContext || root.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = curve(volume.music); musicBus.connect(master);
    soundBus = ctx.createGain(); soundBus.gain.value = curve(volume.sounds); soundBus.connect(master);
    // Two seconds of white noise, for breath, rain, wind and insects
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    root.setInterval(tick, 100);
    return true;
  }
  // Called on the player's first tap or key press
  function unlock() {
    if (!start()) return;
    if (ctx.state === 'suspended') ctx.resume();
  }
  // Volume sliders feel more even on a curve
  const curve = v => Math.pow(Math.max(0, Math.min(1, v)), 1.6);
  function setVolume(kind, value) {
    volume[kind] = value;
    const bus = kind === 'music' ? musicBus : soundBus;
    if (bus) bus.gain.setTargetAtTime(curve(value), ctx.currentTime, 0.05);
  }

  // ----- Notes -----
  const SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function freq(note) {
    const m = /^([A-G])(#?)(\d)$/.exec(note);
    if (!m) return 0;
    const midi = 12 * (Number(m[3]) + 1) + SEMI[m[1]] + (m[2] ? 1 : 0);
    return 440 * Math.pow(2, (midi - 69) / 12);
  }
  const gainNode = (value, to) => { const g = ctx.createGain(); g.gain.value = value; if (to) g.connect(to); return g; };
  function noiseSource(t, dur) {
    const s = ctx.createBufferSource();
    s.buffer = noiseBuffer;
    s.loop = true;
    s.start(t, Math.random() * 1.5);
    if (dur) s.stop(t + dur);
    return s;
  }
  function panTo(value, to) {
    if (!ctx.createStereoPanner) return to;
    const p = ctx.createStereoPanner(); p.pan.value = value; p.connect(to); return p;
  }

  // ----- Instruments -----
  // A plucked string, like a koto: bright at first, then soft
  function pluck(f, t, dur, vel, out) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.7, dur * 1.6));
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(Math.min(12000, f * 9), t);
    lp.frequency.exponentialRampToValueAtTime(Math.max(200, f * 1.4), t + 0.7);
    lp.connect(g); g.connect(out);
    const o1 = ctx.createOscillator(); o1.type = 'triangle';
    o1.frequency.setValueAtTime(f * 1.012, t); o1.frequency.exponentialRampToValueAtTime(f, t + 0.04);
    const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 2;
    o1.connect(lp); o2.connect(gainNode(0.3, lp));
    const end = t + Math.max(0.8, dur * 1.7);
    [o1, o2].forEach(o => { o.start(t); o.stop(end); });
  }
  // A soft flute with a little vibrato and breath
  function flute(f, t, dur, vel, out) {
    const len = Math.max(0.15, dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.07);
    g.gain.setValueAtTime(vel * 0.85, t + len * 0.8);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.18);
    g.connect(out);
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
    const vib = ctx.createOscillator(); vib.frequency.value = 5;
    const vibDepth = gainNode(0, o.frequency);
    vibDepth.gain.setValueAtTime(0, t); vibDepth.gain.linearRampToValueAtTime(f * 0.006, t + 0.35);
    vib.connect(vibDepth);
    o.connect(g);
    o.connect(gainNode(0.12, g));   // (a little brighter)
    const breath = noiseSource(t, len + 0.2);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f * 2; bp.Q.value = 2;
    breath.connect(bp); bp.connect(gainNode(0.05, g));
    [o, vib].forEach(x => { x.start(t); x.stop(t + len + 0.25); });
  }
  // A bell (also the wind chime): a pure tone with a metallic ring that fades slowly
  function bell(f, t, dur, vel, out, ring) {
    const length = ring || 2.6;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + length);
    g.connect(out);
    const car = ctx.createOscillator(); car.type = 'sine'; car.frequency.value = f;
    const mod = ctx.createOscillator(); mod.type = 'sine'; mod.frequency.value = f * 3.5;
    const depth = ctx.createGain();
    depth.gain.setValueAtTime(f * 1.6, t); depth.gain.exponentialRampToValueAtTime(f * 0.05, t + length * 0.6);
    mod.connect(depth); depth.connect(car.frequency);
    car.connect(g);
    [car, mod].forEach(o => { o.start(t); o.stop(t + length + 0.1); });
  }
  // A soft held sound, under the night and hall tunes
  function pad(f, t, dur, vel, out) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vel, t + dur * 0.35);
    g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.6);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = f * 3;
    lp.connect(g); g.connect(out);
    [0.997, 1.003].forEach(d => {
      const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = f * d;
      o.connect(lp); o.start(t); o.stop(t + dur + 0.7);
    });
  }
  // A taiko drum: a deep thump
  function taiko(t, vel, out, big) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(vel * (big ? 1 : 0.55), t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (big ? 0.55 : 0.25));
    g.connect(out);
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(big ? 95 : 140, t); o.frequency.exponentialRampToValueAtTime(big ? 48 : 80, t + 0.25);
    o.connect(g); o.start(t); o.stop(t + 0.6);
    const n = noiseSource(t, 0.08);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 600;
    n.connect(lp); lp.connect(gainNode(0.5, g));
  }
  const kane = (t, vel, out) => bell(2600, t, 0.1, vel, out, 0.18);
  const INSTRUMENTS = { pluck, flute, bell, pad };

  // ----- Music -----
  // A tune as a list of notes in beats: { at, beats, notes: [frequencies], instrument, volume }
  function compile(def) {
    const events = [];
    let length = 0;
    def.layers.forEach(layer => {
      let beat = 0;
      if (layer.pattern) {
        for (let r = 0; r < (layer.repeat || 1); r++) {
          [...layer.pattern].forEach(ch => {
            if (ch !== '.') events.push({ at: beat, beats: 0.5, drum: layer.instrument, big: ch === 'B', volume: layer.volume });
            beat += 0.5;
          });
        }
      } else {
        layer.notes.trim().split(/\s+/).forEach(token => {
          const [notes, beats] = token.split(':');
          const n = Number(beats) || 1;
          if (notes !== 'r') events.push({ at: beat, beats: n, freqs: notes.split('+').map(freq), instrument: layer.instrument, volume: layer.volume });
          beat += n;
        });
      }
      length = Math.max(length, beat);
    });
    return { events: events.sort((a, b) => a.at - b.at), length, spb: 60 / def.tempo, pause: def.pause || 0 };
  }
  const compiled = {};
  const tuneOf = name => compiled[name] || (compiled[name] = compile(HM.MUSIC[name]));

  let current = null;      // { name, tune, out, start, index }
  function music(name) {
    if (!name || !HM.MUSIC[name]) name = null;
    if (current && current.name === name) return;
    if (!ctx) { pending.music = name; return; }
    const now = ctx.currentTime;
    if (current) {
      const old = current.out;
      old.gain.cancelScheduledValues(now);
      old.gain.setTargetAtTime(0, now, 0.5);
      root.setTimeout(() => old.disconnect(), 4000);
      current = null;
    }
    if (!name) return;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0, now);
    out.gain.linearRampToValueAtTime(1, now + 2);
    out.connect(musicBus);
    current = { name, tune: tuneOf(name), out, start: now + 0.2, index: 0 };
  }
  function playEvent(e, t, spb, out) {
    if (e.drum === 'taiko') taiko(t, e.volume, out, e.big);
    else if (e.drum === 'kane') kane(t, e.volume, out);
    else e.freqs.forEach(f => INSTRUMENTS[e.instrument](f, t, e.beats * spb, e.volume, out));
  }
  // Notes are planned a little ahead of time, so they play exactly in time
  function scheduleMusic() {
    if (!current) return;
    const { tune } = current, ahead = ctx.currentTime + 0.4;
    for (;;) {
      if (current.index >= tune.events.length) {
        // The end of the tune: a pause, then again from the start
        current.start += tune.length * tune.spb + tune.pause;
        current.index = 0;
      }
      const e = tune.events[current.index];
      const t = current.start + e.at * tune.spb;
      if (t > ahead) break;
      if (t >= ctx.currentTime - 0.05) playEvent(e, t, tune.spb, current.out);
      current.index++;
    }
  }

  // ----- Sounds of nature -----
  const loops = {};           // the continuous ones: rain, storm, cicadas
  let active = new Set();
  function ambience(list) {
    const next = new Set(list || []);
    if (!ctx) { pending.ambience = [...next]; return; }
    ['rain', 'storm', 'cicadas'].forEach(k => {
      if (next.has(k) && !loops[k]) loops[k] = startLoop(k);
      if (!next.has(k) && loops[k]) { stopLoop(loops[k]); delete loops[k]; }
    });
    active = next;
  }
  function startLoop(kind) {
    const now = ctx.currentTime;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0, now);
    out.connect(soundBus);
    const src = noiseSource(now);
    const nodes = [src];
    if (kind === 'rain' || kind === 'storm') {
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 500;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = kind === 'storm' ? 2200 : 3500;
      src.connect(hp); hp.connect(lp); lp.connect(out);
      out.gain.linearRampToValueAtTime(kind === 'storm' ? 0.3 : 0.12, now + 2);
      if (kind === 'storm') {
        // Wind: a low noise that rises and falls
        const wind = noiseSource(now);
        const wlp = ctx.createBiquadFilter(); wlp.type = 'lowpass'; wlp.frequency.value = 400; wlp.Q.value = 3;
        const sweep = ctx.createOscillator(); sweep.frequency.value = 0.12;
        const sweepDepth = gainNode(250, wlp.frequency);
        sweep.connect(sweepDepth); sweep.start(now);
        wind.connect(wlp); wlp.connect(gainNode(0.9, out));
        nodes.push(wind, sweep);
      }
    } else if (kind === 'cicadas') {
      // A bright buzz that pulses quickly and swells slowly
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 4800; bp.Q.value = 4;
      const am = ctx.createGain(); am.gain.value = 0.5;
      const pulse = ctx.createOscillator(); pulse.frequency.value = 32;
      pulse.connect(gainNode(0.5, am.gain));
      const swell = ctx.createGain(); swell.gain.value = 0.6;
      const slow = ctx.createOscillator(); slow.frequency.value = 0.09;
      slow.connect(gainNode(0.4, swell.gain));
      src.connect(bp); bp.connect(am); am.connect(swell); swell.connect(out);
      pulse.start(now); slow.start(now);
      out.gain.linearRampToValueAtTime(0.07, now + 3);
      nodes.push(pulse, slow);
    }
    return { out, nodes };
  }
  function stopLoop(loop) {
    const now = ctx.currentTime;
    loop.out.gain.cancelScheduledValues(now);
    loop.out.gain.setTargetAtTime(0, now, 0.6);
    loop.nodes.forEach(n => { try { n.stop(now + 3); } catch (e) { /* already stopped */ } });
    root.setTimeout(() => loop.out.disconnect(), 3500);
  }
  // The others are short calls, planned a moment ahead at random times
  const rnd = (a, b) => a + Math.random() * (b - a);
  const PENTA_HIGH = ['E6', 'G6', 'A6', 'B6', 'D7'].map(freq);
  function scheduleNature() {
    const t = ctx.currentTime + 0.15;
    // Frogs: a few voices croaking from different sides
    if (active.has('frogs') && Math.random() < 0.28) {
      const f = rnd(330, 520), len = rnd(0.08, 0.2), pan = rnd(-0.8, 0.8), vel = rnd(0.03, 0.07);
      const repeats = Math.random() < 0.4 ? 3 : 1;
      for (let r = 0; r < repeats; r++) croak(f, t + r * (len + 0.06), len, vel, pan);
    }
    // Crickets: bursts of three high chirps
    if (active.has('crickets') && Math.random() < 0.22) {
      const f = rnd(4100, 4600), pan = rnd(-0.7, 0.7);
      for (let i = 0; i < 3; i++) chirp(f, t + i * 0.055, 0.025, 0.025, pan);
    }
    // Wind chimes: now and then, a few high bells
    if (active.has('chimes') && Math.random() < 0.025) {
      const n = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) bell(PENTA_HIGH[Math.floor(Math.random() * PENTA_HIGH.length)], t + i * rnd(0.12, 0.3), 0.1, rnd(0.02, 0.04), panTo(rnd(-0.3, 0.3), soundBus), 3.2);
    }
    // Birds: little rising whistles in the morning
    if (active.has('birds') && Math.random() < 0.06) {
      const pan = rnd(-0.8, 0.8), base = rnd(2400, 3600), n = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) whistle(base * rnd(0.9, 1.15), t + i * rnd(0.09, 0.16), 0.07, 0.025, pan);
    }
  }
  function croak(f, t, len, vel, pan) {
    const out = panTo(pan, soundBus);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vel, t + 0.01);
    g.gain.setValueAtTime(vel, t + len * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f * 2.2; bp.Q.value = 5;
    const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = f;
    const am = ctx.createGain(); am.gain.value = 0.5;
    const lfo = ctx.createOscillator(); lfo.frequency.value = rnd(28, 45);
    lfo.connect(gainNode(0.5, am.gain));
    o.connect(am); am.connect(bp); bp.connect(g); g.connect(out);
    [o, lfo].forEach(x => { x.start(t); x.stop(t + len + 0.05); });
  }
  function chirp(f, t, len, vel, pan) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vel, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    g.connect(panTo(pan, soundBus));
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
    o.connect(g); o.start(t); o.stop(t + len + 0.02);
  }
  function whistle(f, t, len, vel, pan) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vel, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    g.connect(panTo(pan, soundBus));
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * rnd(1.15, 1.4), t + len);
    o.connect(g); o.start(t); o.stop(t + len + 0.02);
  }

  // ----- Short sounds for actions -----
  const SFX = {
    talk: t => pluck(freq('A5'), t, 0.05, 0.05, soundBus),
    choose: t => pluck(freq('E6'), t, 0.04, 0.04, soundBus),
    pickup: t => { pluck(freq('D5'), t, 0.1, 0.12, soundBus); pluck(freq('A5'), t + 0.08, 0.15, 0.12, soundBus); },
    build: t => { [0, 0.14].forEach(d => { const n = noiseSource(t + d, 0.06); const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 3; n.connect(bp); bp.connect(gainNode(0.35, soundBus)); }); },
    coin: t => { bell(freq('B6'), t, 0.1, 0.06, soundBus, 0.6); bell(freq('E7'), t + 0.07, 0.1, 0.05, soundBus, 0.8); },
    species: t => ['D5', 'G5', 'B5', 'D6'].forEach((n, i) => bell(freq(n), t + i * 0.1, 0.1, 0.07, soundBus, 1.6)),
    heart: t => ['G4', 'B4', 'D5'].forEach((n, i) => pluck(freq(n), t + i * 0.09, 0.4, 0.12, soundBus)),
    knock: t => { [0, 0.18].forEach(d => taiko(t + d, 0.25, soundBus, false)); },
    chime: t => {
      // The evening chime from the village loudspeaker (js/music.js)
      const spb = 60 / HM.CHIME.tempo;
      let beat = 0;
      HM.CHIME.notes.split(/\s+/).forEach(tok => {
        const [n, b] = tok.split(':');
        bell(freq(n), t + beat * spb, 1, 0.08, soundBus, 3.5);
        bell(freq(n) / 2, t + beat * spb, 1, 0.04, soundBus, 3);
        beat += Number(b);
      });
    }
  };
  function play(name) {
    if (!ctx || !SFX[name] || volume.sounds <= 0) return;
    SFX[name](ctx.currentTime + 0.01);
  }

  // ----- Every tenth of a second -----
  const pending = { music: undefined, ambience: null };
  function tick() {
    if (!ctx || ctx.state !== 'running') return;
    if (pending.music !== undefined) { const m = pending.music; pending.music = undefined; music(m); }
    if (pending.ambience) { const a = pending.ambience; pending.ambience = null; ambience(a); }
    if (volume.music > 0) scheduleMusic();
    if (volume.sounds > 0) scheduleNature();
  }

  HM.sound = { unlock, setVolume, music, ambience, play, started: () => !!ctx && ctx.state === 'running', current: () => (current ? current.name : null) };
})(globalThis);
