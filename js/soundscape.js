// Hidamari: which music and sounds of nature fit the moment (design.md section 16, Milestone 3.3).
// js/sound.js plays them; this file only decides, twice a second.
//
// Music: daytime 6:00–16:00, evening 16:00–19:00, night after that; a festival tune at festivals on the
// map (not at the firefly evening, which is quiet); the hall tune in the community hall; the ending tune
// at the end; no music on the typhoon day.
// Nature: rain and the typhoon; birds on spring and summer mornings; frogs on spring and summer evenings
// and in the rain; cicadas and wind chimes on summer days; crickets on autumn nights; quiet in the snow.

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const R = () => HM.rules;

  function musicFor(game) {
    const s = game.state;
    if (!s || game.mode === 'title') return 'day';
    if (s.finished) return 'ending';
    if (game.scene) return game.scene.kind === 'ending' ? 'ending' : 'hall';
    if (R().weatherOf(s.day) === 'typhoon') return null;
    const fest = HM.festivals.activeFestival(s);
    if (fest && fest !== 'hotaru' && HM.DATA.festivals[fest].place) return 'festival';
    const h = s.minutes / 60;
    return h >= 6 && h < 16 ? 'day' : h >= 16 && h < 19 ? 'evening' : 'night';
  }

  function natureFor(game) {
    const s = game.state;
    if (!s || game.mode === 'title' || s.finished) return [];
    const weather = R().weatherOf(s.day), season = R().seasonOf(s.day), h = s.minutes / 60;
    if (weather === 'typhoon') return ['storm'];
    if (game.scene) return [];
    if (weather === 'snow') return [];
    const out = [], rain = weather === 'rain', warm = season === 'spring' || season === 'summer';
    if (rain) out.push('rain');
    if (warm && !rain && h >= 5 && h < 9) out.push('birds');
    if (warm && ((h >= 17 && h < 23) || rain)) out.push('frogs');
    if (season === 'summer' && !rain && h >= 9 && h < 17) out.push('cicadas');
    if (season === 'summer' && !rain && h >= 10 && h < 18) out.push('chimes');
    if (season === 'autumn' && (h >= 18 || h < 4)) out.push('crickets');
    return out;
  }

  let next = 0;
  function update(game, now) {
    if (now < next) return;
    next = now + 500;
    HM.sound.music(musicFor(game));
    HM.sound.ambience(natureFor(game));
  }

  HM.soundscape = { update, musicFor, natureFor };
})(globalThis);
