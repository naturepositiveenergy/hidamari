// Hidamari: everything on screen that is page text, not canvas: the title screen, the top bar,
// hints, and the windows (bag, nature diary, menu, settings, evening summary).

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const el = id => document.getElementById(id);
  let game = null, panelOnClose = null, message = null;

  const fmt = n => Math.round(n).toLocaleString('en');
  const clock = minutes => {
    const m = Math.floor(minutes) % (24 * 60);
    return Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0');
  };
  // "Spring, day 3": the season and the day within it (day 1 to 28 of the year)
  const when = day => ({ season: t('season.' + HM.rules.seasonOf(day)), day: HM.rules.dayInSeason(day) });
  const touch = () => root.matchMedia && root.matchMedia('(pointer: coarse)').matches;

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
      el('nameInput').focus();
    });
    el('nameForm').addEventListener('submit', e => {
      e.preventDefault();
      const name = el('nameInput').value.trim() || t('title.namePlaceholder');
      game.newGame(name);
    });
    el('continueBtn').addEventListener('click', () => game.continueGame());
    buildLanguageButtons(el('langSwitch'));
    refreshTitle();
  }

  function refreshTitle() {
    const saved = HM.save.read();
    el('continueBtn').hidden = !saved;
    if (saved) el('continueBtn').textContent = t(saved.finished ? 'title.continueDone' : 'title.continue', when(saved.day));
    el('nameForm').hidden = true;
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
    el('hudDay').textContent = t('ui.day', when(s.day));
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
    el('panel').hidden = false;
    game.setMode('panel');
  }

  function closePanel(then) {
    if (el('panel').hidden) return;
    el('panel').hidden = true;
    const after = panelOnClose;
    panelOnClose = null;
    game.setMode('world');
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
    const body = items.length
      ? listOf(items.map(i => t('bag.line', { item: t('item.' + i), n: s.bag[i] })))
      : node('p', {}, t('bag.empty'));
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
        card.appendChild(node('p', { class: 'muted' }, t('hint.' + HM.DATA.species[sp].habitat)));
      }
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    openPanel({ title: 'diary.title', body: wrap });
  }

  // A new diary entry, right after looking closely
  function showNewSpecies(sp, area) {
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
    toggle('settings.relaxed', game.settings.relaxed, v => game.changeSetting('relaxed', v));
    toggle('settings.motion', game.settings.motion, v => game.changeSetting('motion', v));
    toggle('settings.plainFont', game.settings.plainFont, v => game.changeSetting('plainFont', v));
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
    HM.DATA.shop.items.forEach(item => {
      const row = node('li', { class: 'shop-row' });
      row.appendChild(node('span', {}, t('shop.line', { item: t('item.' + item), price: fmt(HM.DATA.items[item].price) })));
      const b = node('button', { type: 'button', class: 'btn btn-small' }, t('shop.buy'));
      b.setAttribute('aria-label', t('shop.buyLabel', { item: t('item.' + item) }));
      b.addEventListener('click', () => {
        message.textContent = HM.rules.buy(s, item) ? t('shop.bought', { item: t('item.' + item) }) : t('shop.noMoney');
        refresh();
      });
      row.appendChild(b);
      list.appendChild(row);
    });
    body.appendChild(money);
    body.appendChild(list);
    body.appendChild(message);
    refresh();
    openPanel({ title: 'shop.title', body });
  }

  // ----- Evening summary -----
  function showSummary(sum, onNext) {
    const lines = [t('summary.weather', { weather: t('weather.' + sum.weather) })];
    lines.push(sum.power > 0 || HM.rules.fieldStats(game.state.field).power > 0
      ? t('summary.power', { power: sum.power, income: fmt(sum.income) })
      : t('summary.noPanels'));
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

  // ----- End of the test -----
  function showEnd() {
    const s = game.state;
    const hearts = Object.values(s.friends).reduce((n, f) => n + HM.rules.heartsOf(f.points), 0);
    const body = node('div');
    body.appendChild(node('p', {}, t('end.text')));
    body.appendChild(node('p', { class: 'big' }, t('end.results', {
      hearts, species: Object.keys(s.diary).length, total: HM.DATA.speciesOrder.length, power: s.stats.powerTotal
    })));
    body.appendChild(node('p', { class: 'muted' }, t('end.feedback')));
    openPanel({
      title: 'end.title', body,
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
    showBag, showDiary, showNewSpecies, showMenu, showSettings, showShop, showSummary, showEnd, onLanguage, clock
  };
})(globalThis);
