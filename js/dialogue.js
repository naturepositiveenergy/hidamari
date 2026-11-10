// Hidamari: the dialogue box.
//
// A conversation is a list of steps (see js/story.js):
//   { say: 'text.code', who: 'gen' }          one line, shown until you press the action button
//   { choice: [{ key: 'text.code', then: [...] }, ...] }   buttons to choose from
//   { run: game => ... }                      does something (gives an item, sets a flag...);
//                                             if it returns a list of steps, they come next
// The text is normal page text (readable by screen readers, and it can be zoomed).

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};

  let queue = [], onEnd = null, active = false, choosing = false, game = null;
  const el = id => document.getElementById(id);

  function heartsText(who) {
    const f = game.state.friends[who];
    if (!f) return '';
    const h = HM.rules.heartsOf(f.points);
    return '♥'.repeat(h) + '♡'.repeat(HM.DATA.hearts.max - h);
  }

  function show(step) {
    const box = el('dialogue');
    const who = step.who || 'narrator';
    const named = who !== 'narrator';
    el('dlgName').textContent = named ? t('who.' + who, { name: game.state.name }) : '';
    el('dlgName').hidden = !named;
    const hearts = heartsText(who);
    el('dlgHearts').textContent = hearts;
    el('dlgHearts').hidden = !hearts;
    el('dlgHearts').setAttribute('aria-label', hearts ? t('ui.heartsLabel', { n: HM.rules.heartsOf(game.state.friends[who].points) }) : '');
    el('dlgText').textContent = t(step.say, Object.assign({ name: game.state.name }, step.vars || {}));
    box.classList.toggle('narration', !named);
    box.dataset.who = who;
    el('dlgChoices').innerHTML = '';
    el('dlgNext').hidden = false;
    box.hidden = false;
  }

  function showChoices(step) {
    choosing = true;
    el('dlgNext').hidden = true;
    const wrap = el('dlgChoices');
    wrap.innerHTML = '';
    step.choice.forEach((c, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'choice';
      b.textContent = t(c.key, Object.assign({ name: game.state.name }, c.vars || {}));
      b.addEventListener('click', ev => {
        ev.stopPropagation();
        choosing = false;
        wrap.innerHTML = '';
        queue = (c.then || []).concat(queue);
        next();
      });
      wrap.appendChild(b);
      if (i === 0) setTimeout(() => b.focus(), 0);
    });
  }

  // Go to the next step. Steps that only do something run straight away.
  function next() {
    while (queue.length) {
      const step = queue.shift();
      if (step.run) {
        const more = step.run(game);
        if (Array.isArray(more)) queue = more.concat(queue);
        continue;
      }
      if (step.say) {
        show(step);
        if (queue[0] && queue[0].choice) showChoices(queue.shift());
        return;
      }
      if (step.choice) { showChoices(step); return; }
    }
    finish();
  }

  function finish() {
    active = false;
    choosing = false;
    el('dialogue').hidden = true;
    const done = onEnd;
    onEnd = null;
    if (done) done();
  }

  function play(g, steps, whenDone) {
    game = g;
    queue = steps.slice();
    onEnd = whenDone || null;
    active = true;
    next();
    if (active) el('dialogue').focus({ preventScroll: true });
  }

  // The action button or a click on the box: next line (not while choosing)
  function advance() {
    if (!active || choosing) return false;
    next();
    return true;
  }

  // Number keys pick a choice
  function pick(n) {
    if (!choosing) return false;
    const b = el('dlgChoices').querySelectorAll('button')[n - 1];
    if (b) b.click();
    return !!b;
  }

  function init() {
    el('dialogue').addEventListener('click', e => { if (!e.target.closest('button')) advance(); });
  }

  HM.dialogue = { init, play, advance, pick, isActive: () => active, isChoosing: () => choosing };
})(globalThis);
