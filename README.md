# Hidamari (ひだまり村) — working title

A cozy village life-sim for the browser. You move to a small Japanese village and, over one in-game year, build a community "power garden" with the residents: solar panels and nature in one place.

**Status:** Phase 1, a small playable test of 3 days. Phase 0 (concept and art style A, "Sunspot pastel") was approved on 10 November 2026.

## How to play the test

Double-click `index.html`. It works without internet and without installing anything.

- **Computer:** arrow keys or W A S D to walk, Shift to walk faster, Space (or Enter or E) for the action, Esc for the menu, B to build on your field, N for the nature diary, I for your bag.
- **Phone or tablet:** tap where you want to go, tap a person or thing to go to it, and use the round action button.
- The game saves every evening when you go to bed.

How to run a playtest: `docs/playtest-phase1.md`.

## What is here

| Where | What it is |
|---|---|
| `index.html` | The game |
| `docs/design.md` | The game design document: story, residents, rules, plan |
| `docs/playtest-phase1.md` | How to run the Phase 1 playtests, and the questions to ask |
| `art-test.html` | The Phase 0 page with the three art styles (style A was chosen) |
| `js/` | The program code (plain JavaScript) |
| `lang/` | All game text: `en.js` (English) and `ja.js` (Japanese) |
| `css/` | The page styles |
| `img/` | The pixel art as one picture, made by `tools/make-sprites.js` |
| `fonts/` | The pixel-style font DotGothic16 (only the characters the game uses), with its licence |
| `tools/` | Helper programs run with Node: `make-sprites.js` (pixel art to PNG) and `make-fonts.js` (font files) |
| `tests/` | Automatic checks: `node tests/check.js` |

## After changing things

- Changed a drawing or a colour in `js/sprites-data.js`? Run `node tools/make-sprites.js`.
- Added text with new characters? Run `node tools/make-fonts.js` (downloads the font, needs internet).
- Then run `node tests/check.js`. It ends with "All checks passed" when everything is fine.

## Rules for this project

- Plain HTML, CSS and JavaScript. It opens by double-clicking, with no installation and no paid services.
- All game text lives in the language files, never in the code.
- All art and music are original and made in code. The only downloaded file is a free pixel-style Japanese font with an open licence.

This is a separate project from Solar Commons, the stakeholder workshop game.
