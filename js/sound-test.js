// Hidamari: the listening page (sound-test.html, Milestone 3.3): every tune, every sound of nature
// and every short sound, to listen to before they go into the game.

(function (root) {
  'use strict';
  const HM = root.HM;
  const el = id => document.getElementById(id);
  const t = (key, vars) => I18n.t(key, vars);
  const TUNES = ['day', 'evening', 'night', 'festival', 'hall', 'ending'];
  const NATURE = ['frogs', 'cicadas', 'crickets', 'chimes', 'birds', 'rain', 'storm'];
  const EFFECTS = ['talk', 'choose', 'pickup', 'build', 'coin', 'species', 'heart', 'knock', 'chime'];
  const nature = new Set();

  function button(key, onClick) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn btn-small';
    b.dataset.key = key;
    b.textContent = t(key);
    b.addEventListener('click', () => { HM.sound.unlock(); onClick(b); });
    return b;
  }
  const pressAll = (box, pressed) => box.querySelectorAll('.btn').forEach(b => b.setAttribute('aria-pressed', String(pressed(b))));

  function build() {
    const tunes = el('tunes'), box = el('nature'), effects = el('effects');
    [tunes, box, effects].forEach(b => { b.innerHTML = ''; });
    TUNES.forEach(name => tunes.appendChild(button('sound.tune.' + name, () => {
      HM.sound.music(HM.sound.current() === name ? null : name);
      pressAll(tunes, b => b.dataset.key === 'sound.tune.' + HM.sound.current());
    })));
    NATURE.forEach(name => box.appendChild(button('sound.nature.' + name, b => {
      if (nature.has(name)) nature.delete(name); else nature.add(name);
      HM.sound.ambience([...nature]);
      b.setAttribute('aria-pressed', String(nature.has(name)));
    })));
    EFFECTS.forEach(name => effects.appendChild(button('sound.fx.' + name, () => HM.sound.play(name))));
    pressAll(tunes, b => b.dataset.key === 'sound.tune.' + HM.sound.current());
    pressAll(box, b => nature.has(b.dataset.key.split('.')[2]));
  }

  function languages() {
    const nav = el('langSwitch');
    nav.innerHTML = '';
    Object.keys(root.HM_LANG).forEach(code => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn-small lang-btn';
      b.textContent = root.HM_LANG[code]['lang.name'];
      b.setAttribute('aria-pressed', String(code === I18n.getLanguage()));
      b.addEventListener('click', () => I18n.setLanguage(code));
      nav.appendChild(b);
    });
  }

  el('musicVol').addEventListener('input', e => { HM.sound.unlock(); HM.sound.setVolume('music', e.target.value / 100); });
  el('soundVol').addEventListener('input', e => { HM.sound.unlock(); HM.sound.setVolume('sounds', e.target.value / 100); });
  I18n.onChange(() => { build(); languages(); });
  I18n.init();
})(globalThis);
