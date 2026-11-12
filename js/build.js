// Hidamari: build mode on the plots (design.md section 7).
//
// Choose a tile type, then tap or click the plot (or drag to paint several tiles).
// With the keyboard: arrow keys move the cursor, Space places, number keys choose the tile type,
// Enter (on the Build button) builds, Esc cancels. Time stops while you plan.
// The views (wind, wildlife, light, water) draw the rules on the plot (js/render.js).
// Plans of more than 8 tiles need a work day with friends. The rules are in js/rules.js.
// On plots that need a town meeting, your plan is kept (as a sketch) for the meeting, and the
// Worries button shows whose worry the plan answers (js/community.js).

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const el = id => document.getElementById(id);
  const R = () => HM.rules;
  const C = () => HM.community;

  let game = null, open = false, plotId = 'home', plan = null, history = [], tool = 'meadow', cursor = { x: 0, y: 0 }, view = null;
  const geo = () => HM.MAP.plots.find(p => p.id === plotId);
  const tools = () => HM.DATA.plots[plotId].tools.concat(['remove']);
  const VIEWS = ['wind', 'wildlife', 'light', 'water'];
  const fmt = n => Math.round(n).toLocaleString('en');

  function button(cls, onClick) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.addEventListener('click', onClick);
    return b;
  }

  function init(g) {
    game = g;
    // The view buttons and extra actions share the row with Undo, Cancel and Build
    const actions = document.querySelector('#buildBar .build-actions');
    const views = document.createElement('div');
    views.id = 'buildViews';
    views.className = 'views';
    VIEWS.forEach(v => {
      const b = button('btn btn-small view-btn', () => { view = view === v ? null : v; refresh(); });
      b.dataset.view = v;
      views.appendChild(b);
    });
    const repair = button('btn btn-small', doRepair);
    repair.id = 'buildRepair';
    const rubble = button('btn btn-small', doRubble);
    rubble.id = 'buildRubble';
    const sweep = button('btn btn-small', doSweep);
    sweep.id = 'buildSweep';
    actions.prepend(sweep);
    const worries = button('btn btn-small', () => HM.ui.showWorries(plotId, plan));
    worries.id = 'buildWorries';
    actions.prepend(rubble);
    actions.prepend(worries);
    actions.prepend(repair);
    actions.prepend(views);
    el('buildUndo').addEventListener('click', undo);
    el('buildCancel').addEventListener('click', cancel);
    el('buildGo').addEventListener('click', confirm);
    el('buildBar').addEventListener('keydown', e => { if (e.code === 'Escape') { cancel(); e.stopPropagation(); } });
  }

  // The tool buttons depend on the plot
  function makeTools() {
    const box = el('buildTools');
    box.innerHTML = '';
    tools().forEach((name, i) => {
      const b = button('tool', () => selectTool(name));
      b.dataset.tool = name;
      if (name !== 'remove') {
        const c = document.createElement('canvas');
        c.width = 16; c.height = 16;
        c.className = 'px tool-icon';
        c.setAttribute('aria-hidden', 'true');
        b.appendChild(c);
        HM.render.drawTo(c, 'tile.' + name);
      } else {
        const x = document.createElement('span');
        x.className = 'tool-icon remove-icon';
        x.setAttribute('aria-hidden', 'true');
        x.textContent = '×';
        b.appendChild(x);
      }
      const label = document.createElement('span');
      label.className = 'tool-label';
      b.appendChild(label);
      if (i < 9) {
        const key = document.createElement('span');
        key.className = 'tool-key';
        key.textContent = String(i + 1);
        key.setAttribute('aria-hidden', 'true');
        b.appendChild(key);
      }
      box.appendChild(b);
    });
  }

  function openMode(id) {
    plotId = id || 'home';
    open = true;
    // (the village notebook has notes about planning on farmland: js/notebook.js)
    game.state.flags.planned = Object.assign({}, game.state.flags.planned, { [plotId]: true });
    // A plan you kept for a town meeting, or what is built
    plan = (game.state.plots[plotId].plan || game.state.plots[plotId].tiles).slice();
    history = [];
    cursor = { x: 0, y: 0 };
    view = null;
    if (!tools().includes(tool)) tool = tools()[0];
    makeTools();
    el('buildBar').hidden = false;
    game.setMode('build');
    refresh();
    setTimeout(() => { const b = document.querySelector(`#buildTools [data-tool="${tool}"]`); if (b) b.focus(); });
  }

  function close() {
    // Keep the plan for a plot that needs a town meeting (the village talks about it)
    if (plan && C().needsMeeting(game.state, plotId)) {
      const plot = game.state.plots[plotId];
      plot.plan = plan.some((t, i) => t !== plot.tiles[i]) ? plan.slice() : null;
    }
    open = false;
    plan = null;
    view = null;
    el('buildBar').hidden = true;
    game.setMode('world');
  }
  const cancel = () => close();

  function selectTool(name) {
    tool = name;
    refresh();
  }

  // Put the chosen tile on one plot tile
  function place(i) {
    const value = tool === 'remove' ? null : tool;
    if (plan[i] === value) return;
    history.push(plan.slice());
    plan[i] = value;
    refresh();
  }

  function undo() {
    if (!history.length) return;
    plan = history.pop();
    refresh();
  }

  // "Gen-san, Hiro and Kuma-san" (js/ui.js)
  const names = list => HM.ui.names(list);

  function confirm() {
    const check = R().checkPlan(game.state, plotId, plan);
    if (!check.ok) { refresh(); return; }
    const id = plotId, planned = plan.slice();
    close();
    if (!check.workDay) {
      R().buildPlan(game.state, id, planned);
      game.afterBuild(check);
      return;
    }
    // A work day: friends come to help, and the work takes until the evening
    game.play([
      { say: 'workday.start', who: 'narrator', vars: { names: names(check.helpers) } }
    ].concat(check.students ? [{ say: 'workday.students', who: 'narrator' }] : [], [
      { say: 'workday.lunch', who: 'narrator' },
      { run: g => { R().buildPlan(g.state, id, planned); } },
      { say: 'workday.end', who: 'narrator' }
    ]), () => game.afterBuild(check));
  }

  function doRepair() {
    const r = R().repair(game.state, plotId);
    if (!r) { el('buildProblem').textContent = t('build.p.repair'); return; }
    plan = game.state.plots[plotId].tiles.slice();
    HM.ui.say('build.repaired', { n: r.n });
    refresh();
  }

  // Snow days: sweep the snow off the panels (half power instead of a tenth)
  function doSweep() {
    const r = R().sweep(game.state, plotId);
    if (!r) { el('buildProblem').textContent = t('build.p.sweep'); el('buildProblem').classList.add('problem'); return; }
    HM.ui.say('build.swept', { n: r.n });
    refresh();
  }

  function doRubble() {
    const check = R().checkRubble(game.state);
    if (!check.ok) { el('buildProblem').textContent = t('build.p.' + check.problems[0]); el('buildProblem').classList.add('problem'); return; }
    const id = plotId;
    close();
    game.play([
      { say: 'workday.rubble', who: 'narrator', vars: { names: names(check.helpers) } }
    ].concat(check.students ? [{ say: 'workday.students', who: 'narrator' }] : [], [
      { say: 'workday.lunch', who: 'narrator' },
      { run: g => { R().clearRubble(g.state, id); } },
      { say: 'workday.rubbleDone', who: 'narrator' }
    ]), () => { HM.world.settle(game.state); });
  }

  // Taps and drags on the canvas
  function plotTile(tile) {
    const p = geo();
    const x = tile.x - p.x, y = tile.y - p.y;
    if (x < 0 || y < 0 || x >= p.w || y >= p.h) return -1;
    return y * p.w + x;
  }
  function tap(tile) {
    const i = plotTile(tile);
    if (i < 0) return;
    cursor = { x: i % geo().w, y: Math.floor(i / geo().w) };
    place(i);
  }
  function drag(tile) {
    const i = plotTile(tile);
    if (i >= 0 && plan[i] !== (tool === 'remove' ? null : tool)) tap(tile);
  }

  // Keyboard
  function moveCursor(code) {
    const p = geo();
    const d = { ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0], ArrowUp: [0, -1], KeyW: [0, -1], ArrowDown: [0, 1], KeyS: [0, 1] }[code];
    if (!d) return false;
    cursor = { x: Math.max(0, Math.min(p.w - 1, cursor.x + d[0])), y: Math.max(0, Math.min(p.h - 1, cursor.y + d[1])) };
    return true;
  }
  const placeAtCursor = () => place(cursor.y * geo().w + cursor.x);
  const toolByNumber = n => { const name = tools()[n - 1]; if (name) selectTool(name); return !!name; };

  // The numbers under the plot: cost, power, nature, shade, parts, time, and any problem
  function refresh() {
    if (!open) return;
    const state = game.state;
    const data = HM.DATA;
    document.querySelector('#buildBar .build-head h2').textContent = t('plot.' + plotId);
    document.querySelectorAll('#buildTools .tool').forEach(b => {
      const name = b.dataset.tool;
      b.setAttribute('aria-pressed', String(name === tool));
      b.querySelector('.tool-label').textContent = name === 'remove' ? t('build.remove')
        : t('build.toolLabel', { tile: t('tile.' + name), cost: fmt(data.buildTiles[name].cost) });
      b.title = t('build.info.' + name);
    });
    document.querySelectorAll('#buildViews .view-btn').forEach(b => {
      b.textContent = t('view.' + b.dataset.view);
      b.setAttribute('aria-pressed', String(b.dataset.view === view));
    });
    const check = R().checkPlan(state, plotId, plan);
    const stats = R().plotStats(state, plotId, plan);
    const parts = R().partsLeft(state);
    const lines = [
      t('build.planCost', { cost: fmt(check.cost - check.refund), money: fmt(state.money) }),
      state.plots[plotId].owner === 'partner'
        ? t('build.powerShare', { power: stats.power, share: Math.round(R().powerShare(state, plotId) * 100) })
        : t('build.power', { power: stats.power }),
      t('build.nature', { nature: stats.nature })
    ];
    if (data.plots[plotId].agri) lines.push(t('build.shade', { shade: Math.round(stats.shade * 100) }));
    if (data.plots[plotId].tools.includes('hedge')) lines.push(t('build.seedlings', { n: state.bag.seedling || 0 }));
    lines.push(parts === Infinity ? t('build.partsHiro') : t('build.parts', { n: parts }));
    if (check.workDay) lines.push(t('build.workDay', { n: check.helpers.length }));
    else if (check.newTiles + check.removed) lines.push(t('build.time', { minutes: check.minutes }));
    el('buildInfo').textContent = lines.join('　·　');
    const problem = check.problems.find(p => p !== 'nothing');
    // Too much shade on a farmed plot does not stop you building, but the harvest will be poor
    const dark = data.plots[plotId].agri && stats.panels && stats.shade >= data.agriShadeLimit;
    const hint = view ? t('view.' + view + '.hint' + (view === 'water' && !data.plots[plotId].slope ? 'Flat' : ''))
      : t('build.toolInfo', { info: t(tool === 'remove' ? 'build.info.remove' : 'build.info.' + tool) });
    el('buildProblem').textContent = problem ? problemText(problem, check) : dark ? t('build.shadeWarn') : hint;
    el('buildProblem').classList.toggle('problem', !!(problem || dark));
    el('buildGo').disabled = !check.ok;
    el('buildGo').textContent = t(check.workDay ? 'build.goWorkDay' : 'build.go');
    // Before the town meeting, closing keeps the plan; after it, the worries list shows your promises
    const meeting = C().needsMeeting(state, plotId);
    el('buildCancel').textContent = t(meeting ? 'build.keep' : 'build.cancel');
    el('buildWorries').hidden = !(data.plots[plotId].meeting && (state.flags.nemawashi || (state.plots[plotId].conditions || []).length));
    el('buildWorries').textContent = t('build.worries');
    el('buildUndo').disabled = !history.length;
    const loose = R().repairCost(state, plotId);
    el('buildRepair').hidden = !loose.n;
    el('buildRepair').textContent = t('build.repair', { n: loose.n, cost: fmt(loose.cost) });
    const snow = R().sweepCost(state, plotId);
    el('buildSweep').hidden = !snow.n;
    el('buildSweep').textContent = t('build.sweep', { n: snow.n, minutes: snow.minutes });
    const rubble = data.plots[plotId].rubble && !state.plots[plotId].rubbleCleared;
    el('buildRubble').hidden = !rubble;
    el('buildRubble').textContent = t('build.rubble');
  }

  // A problem as a sentence (some need a name or a day)
  function problemText(problem, check) {
    if (problem === 'condition') {
      const who = check.unmet[0];
      return t('build.p.condition', { who: t('who.' + who), need: t('worry.' + who + '.need') });
    }
    if (problem === 'permit') {
      return t('build.p.permit', { season: t('season.' + R().seasonOf(check.permitDay)), day: R().dayInSeason(check.permitDay) });
    }
    if (problem === 'meeting' && game.state.flags.nemawashi) return t('build.p.meeting') + ' ' + t('build.p.meetingWorries');
    return t('build.p.' + problem);
  }

  HM.build = {
    init, open: openMode, close, cancel, confirm, undo, tap, drag, moveCursor, placeAtCursor, toolByNumber, refresh,
    isOpen: () => open,
    plan: () => plan,
    plotId: () => plotId,
    view: () => view,
    cursorTile: () => cursor,
    focusPoint: () => {
      const p = geo(), T = HM.render.TILE;
      return { x: (p.x + p.w / 2) * T, y: (p.y + p.h / 2) * T };
    }
  };
})(globalThis);
