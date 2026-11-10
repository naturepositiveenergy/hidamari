// Hidamari: keyboard, mouse and touch.
//
// Computer: arrow keys or W A S D to walk, Shift to walk faster, Space / Enter / E for the
// action, Esc to go back, B build mode, N nature diary, I or Tab bag.
// Phone and tablet: tap the ground to walk there, tap a person or thing to go to it,
// and the round action button.

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};

  const held = new Set();
  const KEYS = {
    left: ['ArrowLeft', 'KeyA'], right: ['ArrowRight', 'KeyD'],
    up: ['ArrowUp', 'KeyW'], down: ['ArrowDown', 'KeyS']
  };

  // Which way the keys point: { dx, dy } between -1 and 1, and whether Shift is held
  function direction() {
    const on = name => KEYS[name].some(k => held.has(k));
    return {
      dx: (on('right') ? 1 : 0) - (on('left') ? 1 : 0),
      dy: (on('down') ? 1 : 0) - (on('up') ? 1 : 0),
      fast: held.has('ShiftLeft') || held.has('ShiftRight')
    };
  }

  // Typing in a text field (for example your name) must not move the player
  const typing = e => e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA');

  function init(handlers) {
    root.addEventListener('keydown', e => {
      if (typing(e)) return;
      held.add(e.code);
      if (e.repeat) return;
      const key = e.code;
      let used = true;
      if (key === 'Space' || key === 'Enter' || key === 'KeyE' || key === 'NumpadEnter') used = handlers.action(e);
      else if (key === 'Escape') used = handlers.back();
      else if (key === 'KeyB') used = handlers.build();
      else if (key === 'KeyN') used = handlers.diary();
      else if (key === 'KeyI' || key === 'Tab') used = handlers.bag();
      else if (/^Digit[1-9]$/.test(key)) used = handlers.number(Number(key.slice(5)));
      else if (handlers.arrow && Object.values(KEYS).some(list => list.includes(key))) used = handlers.arrow(key);
      else used = false;
      if (used) e.preventDefault();
    });
    root.addEventListener('keyup', e => held.delete(e.code));
    root.addEventListener('blur', () => held.clear());

    // Taps and clicks on the world
    const canvas = document.getElementById('world');
    let down = null;
    canvas.addEventListener('pointerdown', e => {
      down = { x: e.clientX, y: e.clientY };
      handlers.pointerDown && handlers.pointerDown(HM.render.screenToTile(e.clientX, e.clientY), e);
    });
    canvas.addEventListener('pointermove', e => {
      if (down && e.buttons) handlers.pointerDrag && handlers.pointerDrag(HM.render.screenToTile(e.clientX, e.clientY), e);
    });
    canvas.addEventListener('pointerup', e => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      down = null;
      if (moved < 12) handlers.tap(HM.render.screenToTile(e.clientX, e.clientY), e);
    });
    canvas.addEventListener('contextmenu', e => e.preventDefault());

    document.getElementById('actionBtn').addEventListener('click', () => handlers.action());
  }

  HM.input = { init, direction, clear: () => held.clear() };
})(globalThis);
