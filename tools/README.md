# tools

Small helper programs, run with Node from the project folder. The game itself never needs them.

- `make-sprites.js`: turns the pixel art in `js/sprites-data.js` into `img/sprites.png` and `js/sprite-sheet.js`. Run `node tools/make-sprites.js` after changing a drawing or a colour.
- `make-fonts.js`: downloads the DotGothic16 font from Google Fonts, with only the characters the game uses, into `fonts/`. Run `node tools/make-fonts.js` after adding text with new characters (needs internet).
- `make-icons.js`: draws the app icon (a 16 × 16 pixel drawing in the file) into `icons/`. Run `node tools/make-icons.js` after changing the drawing.
- `simulate-year.js`: plays many simulated years in four play styles and prints how many hearts the residents reach (for checking the balance). Run `node tools/simulate-year.js`.

After running a tool, run `node tests/check.js`.
