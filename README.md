# Hidamari (ひだまり村) — working title

A cozy village life-sim for the browser. You move to a small Japanese village and, over one in-game year, build a community "power garden" with the residents: solar panels and nature in one place.

**Status:** test version, Phase 4 (polish and release). The whole year of 28 days is playable, with all residents, heart events, festivals, the village's decisions, five endings and a free year, in Japanese and English.

## How to play the test

Double-click `index.html`. It works without internet and without installing anything. On the website, the game can also be installed as an app ("Install the game" on the title screen) and then plays offline.

- **Computer:** arrow keys or W A S D to walk, Shift to walk faster, Space (or Enter or E) for the action, Esc for the menu, B to build on your field, N for the nature diary, I for your bag.
- **Phone or tablet:** tap where you want to go, tap a person or thing to go to it, and use the round action button.
- The game saves every evening when you go to bed.
- Settings (in the menu): language, text size, furigana, volume of music and sounds, relaxed clock, animations, standard font.

## What is here

| Where | What it is |
|---|---|
| `index.html` | The game |
| `docs/design.md` | The game design document: story, residents, rules, plan |
| `docs/playtest-full.md` | How to run the playtests of the whole game, the questions to ask and a notes table |
| `docs/playtest-phase1.md` | How to run the Phase 1 playtests (replaced by one round with the whole game in Milestone 4.2) |
| `docs/fact-check.md` | Every real fact in the game, with where it appears and the result of checking it |
| `docs/village-notebook.md` | The village notebook's notes, with their sources |
| `art-test.html` | The Phase 0 page with the three art styles (style A was chosen) |
| `sound-test.html` | The listening page for all music and sounds (made in code) |
| `sw.js`, `manifest.webmanifest` | Playing offline and installing the game as an app (only from the website) |
| `icons/` | The app icon, made by `tools/make-icons.js` |
| `js/` | The program code (plain JavaScript) |
| `lang/` | All game text: `en.js` (English) and `ja.js` (Japanese), and `ja-readings.js` (the readings for furigana) |
| `css/` | The page styles |
| `img/` | The pixel art as one picture, made by `tools/make-sprites.js` |
| `fonts/` | The pixel-style font DotGothic16 (only the characters the game uses), with its licence |
| `tools/` | Helper programs run with Node (see `tools/README.md`) |
| `tests/` | Automatic checks: `node tests/check.js` |

## After changing things

- Changed a drawing or a colour in `js/sprites-data.js`? Run `node tools/make-sprites.js`.
- Added text with new characters? Run `node tools/make-fonts.js` (downloads the font, needs internet).
- Added Japanese text with a new kanji word? Add its reading to `lang/ja-readings.js` (the checks say which).
- Changed the app icon in `tools/make-icons.js`? Run `node tools/make-icons.js`.
- Added a file the game loads? Add it to the list in `sw.js` (the checks say so if you forget).
- Before putting a new version on the website, raise the version number `?v=…` in `index.html` everywhere at once (for example from 4.1.1 to 4.1.2), so browsers fetch the new files instead of mixing them with older ones they keep.
- Then run `node tests/check.js`. It ends with "All checks passed" when everything is fine.

## Rules for this project

- Plain HTML, CSS and JavaScript. It opens by double-clicking, with no installation and no paid services.
- All game text lives in the language files, never in the code.
- All art and music are original and made in code. The only downloaded file is a free pixel-style Japanese font with an open licence.

This is a separate project from Solar Commons, the stakeholder workshop game.
