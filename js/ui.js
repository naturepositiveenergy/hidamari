// Hidamari: everything on screen that is page text, not canvas: the title screen, the top bar,
// hints, and the windows (bag, nature diary, menu, settings, evening summary, the worries list,
// the village notebook and the ending).

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const el = id => document.getElementById(id);
  let game = null, panelOnClose = null, message = null, panelReturn = 'world';

  const fmt = n => Math.round(n).toLocaleString('en');
  const clock = minutes => {
    const m = Math.floor(minutes) % (24 * 60);
    return Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0');
  };
  // "Spring, day 3": the season and the day within it (day 1 to 28 of the year)
  const when = day => ({ season: t('season.' + HM.rules.seasonOf(day)), day: HM.rules.dayInSeason(day) });
  const touch = () => root.matchMedia && root.matchMedia('(pointer: coarse)').matches;

  // "Gen-san, Hiro and Kuma-san"
  function names(list) {
    const n = list.map(f => t('who.' + f));
    return n.length < 2 ? n.join('') : n.slice(0, -1).join(t('summary.listJoin')) + t('summary.listLast') + n[n.length - 1];
  }

  function node(tag, attrs, text) {
    const n = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => n.setAttribute(k, v));
    if (text !== undefined) n.textContent = text;
    return n;
  }

  // ----- Screens -----
  function showScreen(name) {
    el('titleScreen').hidden = name !== 'title';
    el('gameScreen').hidden = name !== 'game';
    if (name === 'game') HM.render.resize();
  }

  // ----- Title screen -----
  function initTitle(g) {
    game = g;
    el('newGameBtn').addEventListener('click', () => {
      el('nameForm').hidden = false;
      el('overwriteNote').hidden = !HM.save.read();
      el('nameInput').placeholder = t('title.namePlaceholder');
      buildLooks();
      el('nameInput').focus();
    });
    el('nameForm').addEventListener('submit', e => {
      e.preventDefault();
      const name = el('nameInput').value.trim() || t('title.namePlaceholder');
      const look = el('nameForm').querySelector('input[name="look"]:checked');
      game.newGame(name, look ? look.value : null);
    });
    el('continueBtn').addEventListener('click', () => game.continueGame());
    el('soundBtn').addEventListener('click', () => { game.changeSetting('soundOn', !game.settings.soundOn); soundButton(); });
    // The village notebook from the title screen
    el('notebookBtn').addEventListener('click', () => {
      const body = el('titlePanelBody');
      body.innerHTML = '';
      body.appendChild(node('p', { class: 'muted' }, t('title.notebookIntro')));
      body.appendChild(notesList(HM.notebook.everFound(), () => false));
      el('titlePanel').hidden = false;
      el('titlePanelClose').focus();
    });
    const closeTitlePanel = () => { el('titlePanel').hidden = true; el('notebookBtn').focus(); };
    el('titlePanelClose').addEventListener('click', closeTitlePanel);
    el('titlePanel').addEventListener('keydown', e => { if (e.key === 'Escape') closeTitlePanel(); });
    buildLanguageButtons(el('langSwitch'));
    refreshTitle();
  }

  // The four looks to choose from (design.md section 5), each a small picture of the player
  function buildLooks() {
    const box = el('lookChoices');
    const chosen = box.querySelector('input:checked');
    box.innerHTML = '';
    HM.DATA.looks.forEach((look, n) => {
      const label = document.createElement('label');
      label.className = 'look-btn';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'look';
      input.value = look;
      input.checked = chosen ? chosen.value === look : n === 0;
      input.setAttribute('aria-label', t('title.look', { n: n + 1 }));
      const c = document.createElement('canvas');
      c.width = c.height = HM.render.TILE;
      c.setAttribute('aria-hidden', 'true');
      HM.render.whenReady(() => HM.render.drawTo(c, look + '.down.stand'));
      label.append(input, c);
      box.append(label);
    });
  }

  // The title screen's sound button: on or off
  function soundButton() {
    const b = el('soundBtn');
    b.textContent = t(game.settings.soundOn ? 'title.soundOn' : 'title.soundOff');
    b.setAttribute('aria-pressed', String(!!game.settings.soundOn));
  }

  function refreshTitle() {
    const saved = HM.save.read();
    el('continueBtn').hidden = !saved;
    if (saved) {
      el('continueBtn').textContent = saved.finished ? t('title.continueDone')
        : (saved.year || 1) > 1 ? t('title.continueYear', Object.assign({ year: saved.year }, when(saved.day))) : t('title.continue', when(saved.day));
    }
    el('nameForm').hidden = true;
    el('notebookBtn').hidden = !HM.notebook.everFound().length;
    soundButton();
    el('titlePanel').hidden = true;
  }

  function buildLanguageButtons(nav) {
    nav.innerHTML = '';
    I18n.languages().sort((a, b) => (a === 'ja' ? -1 : b === 'ja' ? 1 : 0)).forEach(code => {
      const b = node('button', { type: 'button', class: 'lang-btn', lang: code, 'data-lang': code }, HM_LANG[code]['lang.name']);
      b.addEventListener('click', () => I18n.setLanguage(code));
      nav.appendChild(b);
    });
    markLanguage();
  }
  function markLanguage() {
    document.querySelectorAll('.lang-btn').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === I18n.getLanguage())));
  }

  // ----- The top bar and the action button -----
  function updateHud() {
    const s = game.state;
    if (!s) return;
    el('hudDay').textContent = (s.year || 1) > 1 ? t('ui.dayYear', Object.assign({ year: s.year }, when(s.day))) : t('ui.day', when(s.day));
    el('hudTime').textContent = clock(s.minutes);
    el('hudWeather').textContent = t('weather.' + HM.rules.weatherOf(s.day));
    el('hudMoney').textContent = t('ui.money', { money: fmt(s.money) });

    const inWorld = game.mode === 'world';
    const target = inWorld ? HM.world.actionTarget(s) : null;
    const label = HM.story.actionLabel(target, s);
    const btn = el('actionBtn');
    btn.hidden = !inWorld || !touch();
    btn.textContent = label ? t(label) : t('ui.actionNone');
    btn.classList.toggle('idle', !label);
    btn.setAttribute('aria-label', label ? t(label) : t('ui.actionNone'));

    if (message && performance.now() < message.until) setHintText(message.text);
    else {
      message = null;
      if (!inWorld) setHintText('');
      else if (label) setHintText(touch() ? '' : t('hint.press', { action: t(label) }));
      else setHintText(game.showControls ? t(touch() ? 'hint.touch' : 'hint.keys') : '');
    }
  }

  function setHintText(text) {
    const h = el('hint');
    if (h.textContent !== text) h.textContent = text;
    h.hidden = !text;
  }

  // A short message in the hint line (for a few seconds)
  function say(key, vars, seconds) {
    message = { text: t(key, vars), until: performance.now() + (seconds || 4) * 1000 };
  }

  // ----- Windows -----
  function openPanel(opts) {
    el('panelTitle').textContent = t(opts.title, opts.titleVars);
    const body = el('panelBody');
    body.innerHTML = '';
    if (opts.body) body.appendChild(opts.body);
    const actions = el('panelActions');
    actions.innerHTML = '';
    (opts.actions || [{ key: 'ui.close', primary: true }]).forEach((a, i) => {
      const b = node('button', { type: 'button', class: 'btn' + (a.primary ? ' btn-primary' : '') }, t(a.key));
      b.addEventListener('click', () => {
        if (a.keepOpen) { a.onClick(); return; }
        closePanel(a.onClick);
      });
      actions.appendChild(b);
      if (i === 0) setTimeout(() => b.focus(), 0);
    });
    panelOnClose = opts.onClose || null;
    // A window opened from build mode goes back to build mode
    if (game.mode !== 'panel') panelReturn = game.mode === 'build' ? 'build' : 'world';
    el('panel').hidden = false;
    game.setMode('panel');
  }

  function closePanel(then) {
    if (el('panel').hidden) return;
    el('panel').hidden = true;
    const after = panelOnClose;
    panelOnClose = null;
    game.setMode(panelReturn);
    panelReturn = 'world';
    if (after) after();
    if (then) then();
  }
  const panelOpen = () => !el('panel').hidden;

  function listOf(lines) {
    const ul = node('ul', { class: 'panel-list' });
    lines.forEach(l => ul.appendChild(node('li', {}, l)));
    return ul;
  }

  function showBag() {
    const s = game.state;
    const items = Object.keys(s.bag).filter(i => s.bag[i] > 0);
    const body = node('div');
    body.appendChild(items.length
      ? listOf(items.map(i => t('bag.line', { item: t('item.' + i), n: s.bag[i] })))
      : node('p', {}, t('bag.empty')));
    // Keepsakes: the gifts from 5-heart events (js/events.js), with a line about each
    const kept = HM.events.keepsakes(s);
    if (kept.length) {
      body.appendChild(node('h3', {}, t('bag.keepsakes')));
      const ul = node('ul', { class: 'panel-list keepsakes' });
      kept.forEach(k => {
        const li = node('li');
        li.appendChild(node('strong', {}, t('keep.' + k)));
        li.appendChild(node('span', { class: 'muted' }, t('keep.' + k + '.text')));
        ul.appendChild(li);
      });
      body.appendChild(ul);
    }
    openPanel({ title: 'bag.title', body });
  }

  // A small canvas with one picture from the sprite sheet
  function spriteCanvas(name, label) {
    const c = node('canvas', { width: 16, height: 16, class: 'px sketch', role: 'img', 'aria-label': label });
    HM.render.drawTo(c, name);
    return c;
  }

  function showDiary() {
    const s = game.state;
    const wrap = node('div');
    if (!s.flags.diary) {
      wrap.appendChild(node('p', {}, t('diary.none')));
      openPanel({ title: 'diary.title', body: wrap });
      return;
    }
    const order = HM.DATA.speciesOrder;
    wrap.appendChild(node('p', { class: 'muted' }, t('diary.count', { n: Object.keys(s.diary).length, total: order.length })));
    const grid = node('div', { class: 'diary-grid' });
    order.forEach(sp => {
      const seen = s.diary[sp];
      const card = node('div', { class: 'diary-card' + (seen ? '' : ' unknown') });
      if (seen) {
        card.appendChild(spriteCanvas('critter.' + sp, t('species.' + sp)));
        card.appendChild(node('h3', {}, t('species.' + sp)));
        card.appendChild(node('p', { class: 'muted' }, t('diary.seen', Object.assign(when(seen.day), { time: clock(seen.minutes), place: t('place.' + seen.area) }))));
        card.appendChild(node('p', {}, t('species.' + sp + '.fact')));
      } else {
        card.appendChild(node('div', { class: 'sketch blank', 'aria-hidden': 'true' }, '?'));
        card.appendChild(node('h3', {}, t('diary.unknown')));
        card.appendChild(node('p', { class: 'muted' }, t('species.' + sp + '.hint')));
      }
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    openPanel({ title: 'diary.title', body: wrap });
  }

  // A new diary entry, right after looking closely
  function showNewSpecies(sp, area) {
    HM.sound.play('species');
    const body = node('div', { class: 'new-species' });
    body.appendChild(spriteCanvas('critter.' + sp, t('species.' + sp)));
    body.appendChild(node('p', { class: 'big' }, t('look.new', { species: t('species.' + sp) })));
    body.appendChild(node('p', { class: 'muted' }, t('place.' + area)));
    body.appendChild(node('p', {}, t('species.' + sp + '.fact')));
    openPanel({ title: 'diary.newTitle', body });
  }

  function showMenu() {
    openPanel({
      title: 'menu.title',
      body: node('p', { class: 'muted' }, t('menu.quitNote')),
      actions: [
        { key: 'menu.back', primary: true },
        { key: 'menu.bag', onClick: () => setTimeout(showBag) },
        { key: 'menu.diary', onClick: () => setTimeout(showDiary) },
        { key: 'menu.notebook', onClick: () => setTimeout(showNotebook) },
        { key: 'menu.settings', onClick: () => setTimeout(showSettings) },
        { key: 'menu.quit', onClick: () => game.toTitle() }
      ]
    });
  }

  function showSettings() {
    const body = node('div', { class: 'settings' });
    const langRow = node('div', { class: 'setting-row' });
    langRow.appendChild(node('span', {}, t('settings.language')));
    const nav = node('nav', { class: 'lang-switch' });
    langRow.appendChild(nav);
    body.appendChild(langRow);
    buildLanguageButtons(nav);
    const toggle = (key, value, onChange) => {
      const label = node('label', { class: 'setting-row' });
      const box = node('input', { type: 'checkbox' });
      box.checked = value;
      box.addEventListener('change', () => onChange(box.checked));
      label.appendChild(box);
      label.appendChild(node('span', {}, t(key)));
      body.appendChild(label);
    };
    // Text size: three buttons
    const sizeRow = node('div', { class: 'setting-row' });
    sizeRow.appendChild(node('span', { id: 'sizeLabel' }, t('settings.textSize')));
    const sizes = node('div', { class: 'size-switch', role: 'group', 'aria-labelledby': 'sizeLabel' });
    [1, 2, 3].forEach(n => {
      const b = node('button', { type: 'button', class: 'btn btn-small size-btn', 'aria-pressed': String(game.settings.textSize === n) }, t('settings.textSize.' + n));
      b.addEventListener('click', () => {
        game.changeSetting('textSize', n);
        sizes.querySelectorAll('.size-btn').forEach((x, i) => x.setAttribute('aria-pressed', String(i + 1 === n)));
      });
      sizes.appendChild(b);
    });
    sizeRow.appendChild(sizes);
    body.appendChild(sizeRow);
    toggle('settings.relaxed', game.settings.relaxed, v => game.changeSetting('relaxed', v));
    toggle('settings.motion', game.settings.motion, v => game.changeSetting('motion', v));
    toggle('settings.plainFont', game.settings.plainFont, v => game.changeSetting('plainFont', v));
    toggle('settings.furigana', game.settings.furigana, v => game.changeSetting('furigana', v));
    // Music and sounds: two sliders (0 turns them off)
    ['music', 'sounds'].forEach(kind => {
      const row = node('label', { class: 'setting-row volume-row' });
      row.appendChild(node('span', {}, t(kind === 'music' ? 'settings.musicVolume' : 'settings.soundVolume')));
      const slider = node('input', { type: 'range', min: '0', max: '100', step: '5' });
      slider.value = String(Math.round(game.settings[kind] * 100));
      slider.addEventListener('input', () => game.changeSetting(kind, Number(slider.value) / 100));
      slider.addEventListener('change', () => HM.sound.play(kind === 'music' ? 'choose' : 'coin'));
      row.appendChild(slider);
      body.appendChild(row);
    });
    openPanel({ title: 'settings.title', body });
  }

  // ----- Hiro's shop -----
  function showShop() {
    const s = game.state;
    const body = node('div', { class: 'shop' });
    body.appendChild(node('p', {}, t('shop.intro')));
    const money = node('p', { class: 'muted' });
    const message = node('p', { class: 'shop-message', 'aria-live': 'polite' });
    const list = node('ul', { class: 'shop-list' });
    const refresh = () => { money.textContent = t('shop.money', { money: fmt(s.money) }); };
    HM.rules.shopItems(s).forEach(item => {
      const row = node('li', { class: 'shop-row' });
      row.appendChild(node('span', {}, t('shop.line', { item: t('item.' + item), price: fmt(HM.DATA.items[item].price) })));
      const b = node('button', { type: 'button', class: 'btn btn-small' }, t('shop.buy'));
      b.setAttribute('aria-label', t('shop.buyLabel', { item: t('item.' + item) }));
      b.addEventListener('click', () => {
        const bought = HM.rules.buy(s, item);
        message.textContent = bought ? t('shop.bought', { item: t('item.' + item) }) : t('shop.noMoney');
        if (bought) HM.sound.play('coin');
        refresh();
      });
      row.appendChild(b);
      list.appendChild(row);
    });
    // Selling vegetables from your field
    const sellList = node('ul', { class: 'shop-list' });
    const fillSell = () => {
      sellList.innerHTML = '';
      Object.keys(s.bag).filter(item => HM.DATA.items[item] && HM.DATA.items[item].sell && s.bag[item] > 0).forEach(item => {
        const row = node('li', { class: 'shop-row' });
        row.appendChild(node('span', {}, t('shop.sellLine', { item: t('item.' + item), price: fmt(HM.DATA.items[item].sell), n: s.bag[item] })));
        const b = node('button', { type: 'button', class: 'btn btn-small' }, t('shop.sell'));
        b.setAttribute('aria-label', t('shop.sellLabel', { item: t('item.' + item) }));
        b.addEventListener('click', () => {
          if (HM.rules.sell(s, item)) { message.textContent = t('shop.sold', { item: t('item.' + item) }); HM.sound.play('coin'); }
          refresh();
          fillSell();
        });
        row.appendChild(b);
        sellList.appendChild(row);
      });
      sellHead.hidden = !sellList.children.length;
    };
    const sellHead = node('h3', {}, t('shop.sellTitle'));
    body.appendChild(money);
    body.appendChild(list);
    body.appendChild(sellHead);
    body.appendChild(sellList);
    body.appendChild(message);
    fillSell();
    refresh();
    openPanel({ title: 'shop.title', body });
  }

  // ----- Evening summary -----
  function showSummary(sum, onNext) {
    const lines = [t('summary.weather', { weather: t('weather.' + sum.weather) })];
    const panels = Object.keys(game.state.plots).some(id => HM.rules.plotStats(game.state, id).panels > 0);
    lines.push(sum.power > 0 || panels ? t('summary.power', { power: sum.power, income: fmt(sum.income) }) : t('summary.noPanels'));
    if (sum.loose) lines.push(t('summary.loose', { n: sum.loose }));
    if (sum.snowy) lines.push(t('summary.snow'));
    else if (sum.weather === 'typhoon' && panels) lines.push(t('summary.noLoose'));
    if (sum.harvest) lines.push(t('summary.harvest.' + sum.harvest));
    // The village (Milestone 2.4)
    if (sum.mudflow) lines.push(t('summary.mudflow.' + sum.mudflow));
    if (sum.fund) {
      if (sum.fund.fresh.length) lines.push(t('summary.fund', { names: names(sum.fund.fresh), amount: fmt(sum.fund.amount) }));
      if (sum.fund.closed) lines.push(t('summary.fundClosed', { total: fmt(sum.fund.total) }));
    }
    if (sum.slopeBuilt) lines.push(t('summary.slope.' + sum.slopeBuilt));
    if (sum.meetingMoved) lines.push(t('summary.meetingMoved'));
    if ((game.state.letters || []).length) lines.push(t('summary.letters', { n: game.state.letters.length }));
    const ready = (game.state.plots.home.crops || []).filter(c => HM.rules.isGrown(c)).length;
    if (ready) lines.push(t('summary.crops', { n: ready }));
    if (sum.allowance) lines.push(t('summary.allowance', { amount: fmt(sum.allowance), season: t('season.' + HM.rules.seasonOf(sum.day + 1)) }));
    lines.push(t('summary.money', { money: fmt(sum.money) }));
    sum.friends.filter(f => f.hearts > 0 || f.gained !== 0).forEach(f => lines.push(t('summary.friend', {
      who: t('who.' + f.who), hearts: '♥'.repeat(f.hearts) + '♡'.repeat(HM.DATA.hearts.max - f.hearts), gained: f.gained
    })));
    lines.push(sum.newSpecies.length
      ? t('summary.diary', { list: sum.newSpecies.map(sp => t('species.' + sp)).join(t('summary.listJoin')) })
      : t('summary.noDiary'));
    const body = node('div');
    body.appendChild(listOf(lines));
    body.appendChild(node('p', { class: 'muted' }, t(sum.saved ? 'summary.saved' : 'summary.notSaved')));
    openPanel({ title: 'summary.title', titleVars: when(sum.day), body, actions: [{ key: 'summary.next', primary: true, onClick: onNext }] });
  }

  // ----- The worries list (from build mode, after Mr. Oda has taught you nemawashi) -----
  function showWorries(plotId, plan) {
    const s = game.state, C = HM.community, plot = s.plots[plotId];
    const before = C.needsMeeting(s, plotId);
    const body = node('div');
    body.appendChild(node('p', { class: 'muted' }, t(before ? 'worries.intro' : 'worries.after', { plot: t('plot.' + plotId) })));
    const ul = node('ul', { class: 'worry-list' });
    C.worries(s, plotId, plan).forEach(w => {
      const li = node('li', { class: 'worry' + (w.ok ? ' ok' : '') });
      li.appendChild(node('span', { class: 'worry-mark', 'aria-hidden': 'true' }, w.ok ? '○' : '×'));
      const note = (plot.conditions || []).includes(w.who) ? t('worries.promised') : before && C.told(s, plotId)[w.who] ? t('worries.told') : '';
      li.appendChild(node('span', {}, t('worries.line', {
        who: t('who.' + w.who), need: t('worry.' + w.who + '.need'), answer: t(w.ok ? 'worries.ok' : 'worries.no')
      }) + note));
      ul.appendChild(li);
    });
    body.appendChild(ul);
    if (before) body.appendChild(node('p', {}, t(C.toldAll(s, plotId) ? 'worries.odaOk' : 'worries.odaNo')));
    openPanel({ title: 'worries.title', body });
  }

  // ----- The village notebook: the three meters (design.md section 1) and the notes (section 13) -----
  // The notes as a list: title, text, and "new" for notes you haven't read yet
  function notesList(ids, isNew) {
    const box = node('div', { class: 'notes' });
    ids.forEach(id => {
      const note = node('article', { class: 'note' });
      const h = node('h4', {}, t(`nb.${id}.title`));
      if (isNew(id)) h.appendChild(node('span', { class: 'note-new' }, t('nb.newMark')));
      note.appendChild(h);
      note.appendChild(node('p', {}, t(`nb.${id}.text`)));
      box.appendChild(note);
    });
    return box;
  }

  function showNotebook() {
    const m = HM.community.meters(game.state);
    const body = node('div', { class: 'notebook' });
    body.appendChild(node('p', { class: 'muted' }, t('notebook.intro')));
    ['sun', 'nature', 'community'].forEach(k => {
      body.appendChild(node('h3', {}, t('meter.' + k, { n: m[k] })));
      const bar = node('div', { class: 'meter meter-' + k, role: 'meter', 'aria-valuemin': '0', 'aria-valuemax': '100',
        'aria-valuenow': String(m[k]), 'aria-label': t('meter.' + k, { n: m[k] }) });
      const fill = node('span', { class: 'meter-fill' });
      fill.style.width = m[k] + '%';
      bar.appendChild(fill);
      body.appendChild(bar);
      body.appendChild(node('p', { class: 'muted' }, t('meter.' + k + '.about')));
    });
    const s = game.state, notes = HM.notebook.list(s);
    body.appendChild(node('h3', {}, t('nb.heading')));
    if (notes.length) body.appendChild(notesList(notes, id => HM.notebook.isNew(s, id)));
    if (notes.length < HM.notebook.ORDER.length) body.appendChild(node('p', { class: 'muted' }, t('notebook.later')));
    HM.notebook.markRead(s);
    openPanel({ title: 'notebook.title', body });
  }

  // Have you met this household?
  function metFriend(s, f) {
    if (f === 'gen') return !!s.flags.metGen;
    if (f === 'midori') return !!s.flags.metMidori;
    const met = s.flags.met || {};
    return f === 'mori' ? !!(met.aya || met.ken || met.sora) : !!met[f];
  }

  // ----- The ending (design.md section 12) -----
  function showEnd() {
    const s = game.state, C = HM.community;
    const id = C.ending(s), m = C.meters(s);
    const hearts = Object.values(s.friends).reduce((n, f) => n + HM.rules.heartsOf(f.points), 0);
    const body = node('div', { class: 'ending' });
    body.appendChild(node('p', { class: 'big' }, t('ending.' + id + '.title')));
    body.appendChild(node('p', {}, t('ending.' + id + '.1')));
    body.appendChild(node('p', {}, t('ending.' + id + '.2')));
    body.appendChild(node('p', {}, t('ending.' + id + '.3')));
    body.appendChild(node('p', {}, t('ending.' + id + '.4')));
    body.appendChild(node('p', { class: 'muted' }, t('end.meters', { sun: m.sun, nature: m.nature, community: m.community })));
    body.appendChild(node('h3', {}, t('end.epilogues')));
    body.appendChild(listOf(HM.DATA.friends.filter(f => metFriend(s, f)).map(f => t(`ending.epi.${f}.${C.epilogue(s, f)}`))));
    body.appendChild(node('p', {}, t('ending.slope.' + C.slopeEnding(s))));
    body.appendChild(node('p', {}, t('end.results', {
      hearts, species: Object.keys(s.diary).length, total: HM.DATA.speciesOrder.length, power: s.stats.powerTotal
    })));
    body.appendChild(node('p', { class: 'muted' }, t('end.text')));
    body.appendChild(node('p', { class: 'muted' }, t('end.feedback')));
    openPanel({
      title: 'end.title', body,
      actions: [
        { key: 'end.freeYear', primary: true, onClick: () => game.startFreeYear() },
        { key: 'end.title2', onClick: () => game.toTitle() },
        { key: 'end.again', onClick: () => { game.toTitle(); setTimeout(() => el('newGameBtn').click()); } }
      ]
    });
  }

  // ----- The end of the free year -----
  function showFreeEnd() {
    const s = game.state;
    const body = node('div', { class: 'ending' });
    body.appendChild(node('p', {}, t('free.end.text')));
    if (s.ending) body.appendChild(node('p', { class: 'muted' }, t('free.end.ending', { ending: t('ending.' + s.ending + '.name') })));
    body.appendChild(node('p', { class: 'muted' }, t('end.feedback')));
    openPanel({
      title: 'free.end.title', body,
      actions: [
        { key: 'end.title2', primary: true, onClick: () => game.toTitle() },
        { key: 'end.again', onClick: () => { game.toTitle(); setTimeout(() => el('newGameBtn').click()); } }
      ]
    });
  }

  // Redraw texts made in code when the language changes
  function onLanguage() {
    markLanguage();
    if (game && !el('titleScreen').hidden) refreshTitle();
  }

  HM.ui = {
    initTitle, refreshTitle, showScreen, updateHud, say, openPanel, closePanel, panelOpen,
    showBag, showDiary, showNewSpecies, showMenu, showSettings, showShop, showSummary, showEnd, onLanguage, clock,
    showWorries, showNotebook, showFreeEnd, names
  };
})(globalThis);
