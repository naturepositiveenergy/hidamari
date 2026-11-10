// Hidamari: saving in the browser's own storage on this device (no account, no server).
//
// The game saves every evening (and once when a new game starts). The previous save is kept
// as a backup, in case the newest one is damaged.

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};
  const KEY = 'hm-save-1', BACKUP = 'hm-save-1-backup', SETTINGS = 'hm-settings';

  function storage() {
    try { return root.localStorage; } catch (e) { return null; }
  }

  function write(state) {
    const s = storage();
    if (!s) return false;
    try {
      const old = s.getItem(KEY);
      if (old) s.setItem(BACKUP, old);
      s.setItem(KEY, HM.rules.serialize(state));
      return true;
    } catch (e) { return false; }
  }

  // The saved game, or the backup if the newest save is damaged, or null
  function read() {
    const s = storage();
    if (!s) return null;
    try {
      return HM.rules.deserialize(s.getItem(KEY)) || HM.rules.deserialize(s.getItem(BACKUP));
    } catch (e) { return null; }
  }

  function readSettings() {
    const s = storage();
    try { return JSON.parse(s.getItem(SETTINGS)) || {}; } catch (e) { return {}; }
  }
  function writeSettings(settings) {
    const s = storage();
    try { s.setItem(SETTINGS, JSON.stringify(settings)); } catch (e) { /* not remembered */ }
  }

  HM.save = { write, read, readSettings, writeSettings };
})(globalThis);
