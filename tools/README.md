# tools

Small helper programs, run with Node from the project folder. The game itself never needs them.

- `make-sprites.js`: turns the pixel art in `js/sprites-data.js` into `img/sprites.png` and `js/sprite-sheet.js`. Run `node tools/make-sprites.js` after changing a drawing or a colour.
- `make-fonts.js`: downloads the DotGothic16 font from Google Fonts, with only the characters the game uses, into `fonts/`. Run `node tools/make-fonts.js` after adding text with new characters (needs internet).
- Later: `make-icons.js` for the app icon.

After running a tool, run `node tests/check.js`.
