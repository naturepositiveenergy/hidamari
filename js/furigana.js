// Hidamari: furigana, readings above the kanji (design.md section 15, Milestone 3.3).
//
// When the setting is on and the game is in Japanese, every piece of text on the page gets small
// readings above its kanji (HTML <ruby>). The readings come from lang/ja-readings.js.
// The page's text stays normal text, so screen readers and zooming still work; the readings
// themselves are hidden from screen readers so the text is read only once.

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const KANJI = /[\u4e00-\u9fff\u3005]/;
  const DIGIT = /[0-9\uff10-\uff19]/;
  const MARK = /^\[([^|\]]+)\|([^\]]+)\]/;     // a reading marked in a line: [源|げん]

  // ----- Reading a text -----
  // The words of the reading list, by their first character, longest first
  let index = null;
  function build() {
    index = {};
    Object.keys(root.HM_READINGS || {}).forEach(key => {
      const surface = key.replace(/#/g, '');
      const word = { key, surface, after: key[0] === '#', before: key[key.length - 1] === '#', readings: root.HM_READINGS[key].split('|') };
      (index[surface[0]] = index[surface[0]] || []).push(word);
    });
    Object.values(index).forEach(list => list.sort((a, b) => b.surface.length - a.surface.length || (b.after + b.before) - (a.after + a.before)));
  }

  // The longest word from the list that fits at position i
  function match(text, i) {
    const list = index[text[i]];
    if (!list) return null;
    const prevDigit = DIGIT.test(text[i - 1] || '');
    for (const w of list) {
      if (!text.startsWith(w.surface, i)) continue;
      if (w.after && !prevDigit) continue;
      if (w.before && !DIGIT.test(text[i + w.surface.length] || '')) continue;
      // (a word that starts with a number must start where the number starts: "11人" is not "1人")
      if (DIGIT.test(w.surface[0]) && prevDigit) continue;
      return w;
    }
    return null;
  }

  // A word as pieces: the kanji (with any number in front) get their readings, the kana stay as they are
  function pieces(w) {
    // (a number with its counter is read as a whole: 1か月 → いっかげつ)
    if (DIGIT.test(w.surface[0])) return [{ base: w.surface, reading: w.readings[0] }];
    const out = [];
    let n = 0;
    for (const m of w.surface.matchAll(/([0-9\uff10-\uff19]*[\u4e00-\u9fff\u3005]+)|([^\u4e00-\u9fff\u3005]+)/g)) {
      if (m[1]) out.push({ base: m[1], reading: w.readings[n++] || '' });
      else out.push({ text: m[2] });
    }
    return out;
  }

  // A text as pieces: { text } or { base, reading }
  function parse(text) {
    if (!index) build();
    const out = [];
    let plain = '';
    const flush = () => { if (plain) { out.push({ text: plain }); plain = ''; } };
    let i = 0;
    while (i < text.length) {
      const c = text[i];
      if (c === '[') {
        const m = MARK.exec(text.slice(i));
        if (m) { flush(); out.push({ base: m[1], reading: m[2] }); i += m[0].length; continue; }
      }
      if (KANJI.test(c) || DIGIT.test(c)) {
        const w = match(text, i);
        if (w) { flush(); out.push(...pieces(w)); i += w.surface.length; continue; }
      }
      plain += c;
      i++;
    }
    flush();
    return out;
  }

  // A text without marks (when the setting is off): [源|げん] → 源
  const stripMarks = text => (text.indexOf('[') < 0 ? text : text.replace(/\[([^|\]]+)\|[^\]]+\]/g, '$1'));

  // ----- On the page -----
  let on = false, observer = null;
  const SKIP = new Set(['RUBY', 'RT', 'RP', 'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'TITLE', 'CANVAS']);

  function rubyText(node) {
    const text = node.nodeValue;
    if (!KANJI.test(text) && text.indexOf('[') < 0) return;
    const parent = node.parentNode;
    if (!parent || SKIP.has(parent.nodeName) || parent.closest('[data-no-ruby]')) return;
    const frag = document.createDocumentFragment();
    parse(text).forEach(p => {
      if (p.text !== undefined) { frag.appendChild(document.createTextNode(p.text)); return; }
      if (!p.reading) { frag.appendChild(document.createTextNode(p.base)); return; }
      const ruby = document.createElement('ruby');
      ruby.appendChild(document.createTextNode(p.base));
      const rt = document.createElement('rt');
      rt.textContent = p.reading;
      rt.setAttribute('aria-hidden', 'true');
      ruby.appendChild(rt);
      frag.appendChild(ruby);
    });
    parent.replaceChild(frag, node);
  }

  // Add readings to all text inside an element
  function apply(rootEl) {
    if (!on) return;
    const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(rubyText);
  }

  // Remove the readings again (the setting was turned off, or the language changed)
  function remove() {
    document.querySelectorAll('ruby').forEach(r => {
      const base = [...r.childNodes].filter(n => n.nodeName !== 'RT' && n.nodeName !== 'RP').map(n => n.textContent).join('');
      r.replaceWith(document.createTextNode(base));
    });
    document.body.normalize();
  }

  // Turn furigana on or off (the game turns it on only in Japanese)
  function set(value) {
    on = !!value;
    root.HM_FURIGANA_ON = on;      // (js/i18n.js keeps marks like [源|げん] in the texts only while this is on)
    document.body.classList.toggle('furigana', on);
    if (observer) { observer.disconnect(); observer = null; }
    if (!on) { remove(); return; }
    apply(document.body);
    // New text on the page (dialogue, windows, hints) gets its readings as soon as it appears.
    // (The readings added here change the page too: takeRecords() drops those changes, so they aren't read again.)
    observer = new MutationObserver(records => {
      records.forEach(r => {
        if (r.type === 'characterData') { if (r.target.parentNode) rubyText(r.target); return; }
        r.addedNodes.forEach(n => {
          if (!n.isConnected) return;
          if (n.nodeType === 3) rubyText(n);
          else if (n.nodeType === 1 && !SKIP.has(n.nodeName)) apply(n);
        });
      });
      observer.takeRecords();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  HM.furigana = { parse, stripMarks, set, apply, active: () => on };
})(globalThis);
