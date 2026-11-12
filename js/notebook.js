// Hidamari: the village notebook (村のノート, design.md section 13, Milestone 3.2).
//
// Short notes about the real world, one or two sentences each. Each one unlocks at a moment in the
// game (below). The words are in the language files (nb.<id>.title and nb.<id>.text), and their
// sources are in docs/village-notebook.md.
//
// Notes you have found are also kept in the browser apart from the saved game, so the title
// screen can show every note you found in any game.

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const D = () => HM.DATA, E = () => HM.events;
  const KEY = 'hm-notebook';

  // The notes, in the order the notebook shows them
  const ORDER = ['cooperator', 'akiya', 'yui', 'nemawashi', 'briefing', 'farmland', 'agri', 'forest', 'ordinance', 'promo',
    'fitfip', 'fund', 'natureSite', 'decommission', 'tameike', 'paddy', 'firefly', 'hedge', 'shelter', 'meadow'];

  const festival = (s, id) => !!(s.flags.festivals || {})[id];
  const laterYear = s => (s.year || 1) > 1;
  const afterTyphoon = s => s.day > D().festivals.shelter.day || laterYear(s);
  const paddySpecies = s => D().speciesOrder.some(sp => ['paddyEdge', 'paddyWater'].includes(D().species[sp].habitat) && s.diary[sp]);

  // When each note unlocks
  const UNLOCK = {
    cooperator: () => true,                                      // at the start
    akiya: () => true,
    yui: s => !!s.flags.workDay,                                 // your first work day
    nemawashi: s => !!s.flags.nemawashi,                         // Mr. Oda's 3-heart event
    briefing: s => (s.stats.meetings || 0) > 0,                  // your first town meeting
    farmland: s => !!(s.flags.planned || {}).fumiko,             // planning on Fumiko-san's field
    agri: s => !!(s.flags.planned || {}).gen,                    // planning on Gen-san's paddy
    forest: s => !!s.flags.kuroMet,                              // Mr. Kurokawa's slope offer
    ordinance: s => !!s.flags.ordinance || E().done(s, 'sato.2'),
    promo: s => !!s.flags.zoningDone,                            // the zoning workshop
    fitfip: s => E().done(s, 'hiro.3') || !!s.flags.zoningDone,
    fund: s => (s.funds || []).length > 0,
    natureSite: s => !!s.flags.natureSite || E().done(s, 'midori.5'),
    decommission: s => (s.stats.powerTotal || 0) > 0,            // your gardens' first power
    tameike: s => E().done(s, 'kuma.3'),
    paddy: paddySpecies,                                         // a species of the paddies in your diary
    firefly: s => festival(s, 'hotaru') || !!s.diary.firefly,
    hedge: afterTyphoon,
    shelter: s => festival(s, 'shelter') || afterTyphoon(s),
    meadow: s => Object.values(s.plots).some(p => p.owner !== 'quick' && p.tiles.includes('meadow'))
  };

  // ----- Notes found in any game (kept in the browser) -----
  function found() {
    try { const list = JSON.parse(root.localStorage.getItem(KEY)); return Array.isArray(list) ? list.filter(id => UNLOCK[id]) : []; } catch (e) { return []; }
  }
  function remember(ids) {
    try {
      const list = found();
      ids.forEach(id => { if (!list.includes(id)) list.push(id); });
      root.localStorage.setItem(KEY, JSON.stringify(list));
    } catch (e) { /* not remembered: the notes are still in the saved game */ }
  }

  // ----- In this game -----
  const unlocked = s => s.notebook || (s.notebook = {});
  // Unlock the notes whose moment has come. Returns the new ones.
  function check(s) {
    const notes = unlocked(s);
    const fresh = ORDER.filter(id => !notes[id] && UNLOCK[id](s));
    fresh.forEach(id => { notes[id] = s.day; });
    if (fresh.length) remember(fresh);
    return fresh;
  }
  const list = s => ORDER.filter(id => unlocked(s)[id]);
  const isNew = (s, id) => !(s.notebookRead || {})[id];
  function markRead(s) {
    const read = s.notebookRead || (s.notebookRead = {});
    list(s).forEach(id => { read[id] = true; });
  }
  // For the title screen: every note found in any game, in the notebook's order
  const everFound = () => { const f = found(); return ORDER.filter(id => f.includes(id)); };

  HM.notebook = { ORDER, check, list, isNew, markRead, everFound };
})(globalThis);
