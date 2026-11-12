// Hidamari: the music (design.md section 16, Milestone 3.3). Original tunes, played by js/sound.js.
//
// Every tune uses a five-note scale: mostly the bright Japanese "yo" scale (D E G A B), and a soft
// minor five-note scale at night. Each tune has a tempo (beats per minute), a pause before it repeats
// (seconds), and layers. A layer is an instrument and its notes:
//   "D4:1" a note and its length in beats · "r:2" a rest · "D3+A3:2" two notes together
// Instruments (made in js/sound.js): pluck (like a koto), flute, bell, pad (a soft held sound),
// taiko (drum: "B" big, "s" small, "." nothing, one per half beat; repeat: how often), kane (a small bell, same pattern).

(function (root) {
  'use strict';
  const HM = root.HM = root.HM || {};

  HM.MUSIC = {
    // Daytime in the village: an easy-going koto melody over a low pluck
    day: {
      tempo: 88, pause: 8,
      layers: [
        { instrument: 'pluck', volume: 0.5, notes:
          'D4:1 E4:1 G4:1 A4:1 B4:2 A4:1 G4:1 A4:1 G4:1 E4:1 D4:1 E4:3 r:1 ' +
          'G4:1 A4:1 B4:1 D5:1 E5:2 D5:1 B4:1 A4:1 B4:1 A4:1 G4:1 A4:3 r:1 ' +
          'D5:1 B4:1 A4:1 B4:1 G4:2 E4:1 G4:1 A4:1 G4:1 E4:1 D4:1 E4:2 G4:2 ' +
          'B4:1 A4:1 G4:1 A4:1 B4:2 D5:2 A4:1 G4:1 E4:1 G4:1 D4:3 r:1' },
        { instrument: 'pluck', volume: 0.3, notes:
          'D3:2 A3:2 D3:2 A3:2 A2:2 E3:2 A2:2 E3:2 G2:2 D3:2 G2:2 D3:2 A2:2 E3:2 A2:2 E3:2 ' +
          'D3:2 A3:2 G2:2 D3:2 A2:2 E3:2 A2:2 E3:2 G2:2 D3:2 G2:2 D3:2 A2:2 E3:2 D3:4' }
      ]
    },
    // Evening: a slow flute over gentle broken chords
    evening: {
      tempo: 66, pause: 10,
      layers: [
        { instrument: 'flute', volume: 0.35, notes:
          'A4:2 B4:1 A4:1 G4:2 E4:2 D4:2 E4:1 G4:1 A4:4 ' +
          'B4:2 D5:1 B4:1 A4:2 G4:2 E4:2 G4:1 E4:1 D4:4' },
        { instrument: 'pluck', volume: 0.25, notes:
          'D3:1 A3:1 D4:1 A3:1 G2:1 D3:1 G3:1 D3:1 D3:1 A3:1 D4:1 A3:1 A2:1 E3:1 A3:1 E3:1 ' +
          'G2:1 D3:1 G3:1 D3:1 D3:1 A3:1 D4:1 A3:1 A2:1 E3:1 A3:1 E3:1 D3:4' }
      ]
    },
    // Night: a few bell notes in the dark, over a soft held sound
    night: {
      tempo: 52, pause: 14,
      layers: [
        { instrument: 'bell', volume: 0.22, notes: 'E5:3 r:1 D5:2 A4:2 r:2 C5:2 A4:4 G4:3 r:1 A4:2 C5:2 D5:2 r:2 E5:4' },
        { instrument: 'pad', volume: 0.12, notes: 'A2+E3:8 G2+D3:8 A2+E3:8 A2+E3:8' }
      ]
    },
    // Festivals: a lively flute, taiko and a small bell
    festival: {
      tempo: 112, pause: 4,
      layers: [
        { instrument: 'flute', volume: 0.3, notes:
          'D5:1 D5:0.5 E5:0.5 D5:1 B4:1 A4:1 B4:1 D5:2 E5:1 D5:0.5 B4:0.5 A4:1 G4:1 A4:3 r:1 ' +
          'G4:1 A4:1 B4:1 A4:1 G4:1 E4:1 D4:2 E4:1 G4:1 A4:1 B4:1 D5:3 r:1' },
        { instrument: 'taiko', volume: 0.5, pattern: 'B.s.B.s.B.s.BsBs', repeat: 4 },
        { instrument: 'kane', volume: 0.12, pattern: '.s.s.s.s', repeat: 8 }
      ]
    },
    // The community hall (meetings, workshops, the welcome party): calm and a little thoughtful
    hall: {
      tempo: 76, pause: 10,
      layers: [
        { instrument: 'pluck', volume: 0.45, notes:
          'G4:1 B4:1 D5:2 E5:1 D5:1 B4:2 A4:1 B4:1 A4:1 G4:1 E4:4 ' +
          'G4:1 A4:1 B4:1 D5:1 E5:2 D5:2 B4:1 A4:1 G4:1 A4:1 G4:4' },
        { instrument: 'pad', volume: 0.1, notes: 'G2+D3:8 E2+B2:8 G2+D3:8 D2+A2:4 G2+D3:4' }
      ]
    },
    // The ending: the day melody, slower, with flute and bells
    ending: {
      tempo: 60, pause: 6,
      layers: [
        { instrument: 'flute', volume: 0.3, notes:
          'D4:1 E4:1 G4:1 A4:1 B4:2 A4:1 G4:1 A4:1 G4:1 E4:1 D4:1 E4:4 ' +
          'G4:1 A4:1 B4:1 D5:1 E5:2 D5:1 B4:1 A4:1 G4:1 E4:1 G4:1 D4:4' },
        { instrument: 'bell', volume: 0.12, notes: 'D5:4 A4:4 G4:4 A4:4 B4:4 E5:4 A4:4 D5:4' },
        { instrument: 'pad', volume: 0.1, notes: 'D3+A3:8 G2+D3:8 G2+D3:8 D3+A3:8' }
      ]
    }
  };

  // The evening chime over the village loudspeaker (an original four-note melody, played on bells)
  HM.CHIME = { tempo: 60, notes: 'D5:1.5 B4:1.5 E5:1.5 A4:3' };
})(globalThis);
