// Hidamari: build mode on your home field.
//
// Choose a tile type, then tap or click the field (or drag to paint several tiles).
// With the keyboard: arrow keys move the cursor, Space places, 1–5 choose the tile type,
// Enter (on the Build button) builds, Esc cancels. Time stops while you plan.
// The rules (costs, limits) are in js/rules.js.

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const el = id => document.getElementById(id);
  const TOOLS = () => HM.DATA.buildOrder.concat(['remove']);

  let game = null, open = false, plan = null, history = [], tool = 'meadow', cursor = { x: 0, y: 0 };

  function init(g) {
    game = g;
    const bar = el('buildBar');
    const tools = el('buildTools');
    TOOLS().forEach((name, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'tool';
      b.dataset.tool = name;
      if (name !== 'remove') {
        const c = document.createElement('canvas');
        c.width = 16; c.height = 16;
        c.className = 'px tool-icon';
        c.setAttribute('aria-hidden', 'true');
        b.appendChild(c);
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
      const key = document.createElement('span');
      key.className = 'tool-key';
      key.textContent = String(i + 1);
      key.setAttribute('aria-hidden', 'true');
      b.appendChild(key);
      b.addEventListener('click', () => selectTool(name));
      tools.appendChild(b);
    });
    el('buildUndo').addEventListener('click', undo);
    el('buildCancel').addEventListener('click', cancel);
    el('buildGo').addEventListener('click', confirm);
    bar.addEventListener('keydown', e => { if (e.code === 'Escape') { cancel(); e.stopPropagation(); } });
  }

  function openMode() {
    open = true;
    plan = game.state.field.slice();
    history = [];
    cursor = { x: 0, y: 0 };
    el('buildBar').hidden = false;
    document.querySelectorAll('#buildTools canvas').forEach(c => HM.render.drawTo(c, 'tile.' + c.parentElement.dataset.tool));
    game.setMode('build');
    refresh();
    setTimeout(() => { const b = document.querySelector(`#buildTools [data-tool="${tool}"]`); if (b) b.focus(); });
  }

  function close() {
    open = false;
    plan = null;
    el('buildBar').hidden = true;
    game.setMode('world');
  }

  const cancel = () => close();

  function selectTool(name) {
    tool = name;
    refresh();
  }

  // Put the chosen tile on one field tile (i = 0 to 15)
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

  function confirm() {
    const check = HM.rules.checkPlan(game.state, plan);
    if (!check.ok) { refresh(); return; }
    HM.rules.buildPlan(game.state, plan);
    close();
    game.afterBuild(check);
  }

  // Taps and drags on the canvas
  function fieldTile(tile) {
    const f = HM.MAP.field;
    const x = tile.x - f.x, y = tile.y - f.y;
    if (x < 0 || y < 0 || x >= f.w || y >= f.h) return -1;
    return y * f.w + x;
  }
  function tap(tile) {
    const i = fieldTile(tile);
    if (i < 0) return;
    cursor = { x: i % HM.MAP.field.w, y: Math.floor(i / HM.MAP.field.w) };
    place(i);
  }
  function drag(tile) {
    const i = fieldTile(tile);
    if (i >= 0 && plan[i] !== (tool === 'remove' ? null : tool)) tap(tile);
  }

  // Keyboard
  function moveCursor(code) {
    const f = HM.MAP.field;
    const d = { ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0], ArrowUp: [0, -1], KeyW: [0, -1], ArrowDown: [0, 1], KeyS: [0, 1] }[code];
    if (!d) return false;
    cursor = { x: Math.max(0, Math.min(f.w - 1, cursor.x + d[0])), y: Math.max(0, Math.min(f.h - 1, cursor.y + d[1])) };
    return true;
  }
  const placeAtCursor = () => place(cursor.y * HM.MAP.field.w + cursor.x);
  const toolByNumber = n => { const name = TOOLS()[n - 1]; if (name) selectTool(name); return !!name; };

  // The numbers under the field: cost, power, nature, time, and any problem
  function refresh() {
    if (!open) return;
    const state = game.state;
    const data = HM.DATA;
    document.querySelectorAll('#buildTools .tool').forEach(b => {
      const name = b.dataset.tool;
      b.setAttribute('aria-pressed', String(name === tool));
      const label = name === 'remove' ? t('build.remove')
        : t('build.toolLabel', { tile: t('tile.' + name), cost: data.buildTiles[name].cost.toLocaleString('en') });
      b.querySelector('.tool-label').textContent = label;
      b.title = name === 'remove' ? t('build.info.remove') : t('build.info.' + name);
    });
    const check = HM.rules.checkPlan(state, plan);
    const stats = HM.rules.fieldStats(plan);
    const lines = [
      t('build.planCost', { cost: (check.cost - check.refund).toLocaleString('en'), money: state.money.toLocaleString('en') }),
      t('build.power', { power: stats.power }),
      t('build.nature', { nature: stats.nature }),
      t('build.seedlings', { n: state.bag.seedling || 0 })
    ];
    if (check.newTiles + check.removed) lines.push(t('build.time', { minutes: check.minutes }));
    el('buildInfo').textContent = lines.join('　·　');
    const problem = check.problems.find(p => p !== 'nothing');
    el('buildProblem').textContent = problem ? t('build.p.' + problem) : t('build.toolInfo', { info: t(tool === 'remove' ? 'build.info.remove' : 'build.info.' + tool) });
    el('buildProblem').classList.toggle('problem', !!problem);
    el('buildGo').disabled = !check.ok;
    el('buildUndo').disabled = !history.length;
  }

  HM.build = {
    init, open: openMode, close, cancel, confirm, undo, tap, drag, moveCursor, placeAtCursor, toolByNumber, refresh,
    isOpen: () => open,
    plan: () => plan,
    cursorTile: () => cursor,
    focusPoint: () => {
      const f = HM.MAP.field, T = HM.render.TILE;
      return { x: (f.x + f.w / 2) * T, y: (f.y + f.h / 2) * T + T * 1.5 };
    }
  };
})(globalThis);
