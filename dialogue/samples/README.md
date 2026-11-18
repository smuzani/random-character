# RDG samples

Each sample is a single-scene `.fountain` file. Copy `rooftop.fountain` as a template and add its filename to `index.json` to preload it. Then run `node dialogue/build-samples.mjs` to refresh the checked-in `samples.js` bundle for local use. The first file opens on startup; Randomize switches the setup, selected cast, screenplay and Fountain download link together.

Keep RDG setup in a `[[rdg ... ]]` note with Tone, Start and End fields. Give every speaker a `[[character: Name ... ]]` note with Voice, Want and Obstacle fields. Metadata labels are case-insensitive and may have surrounding Markdown emphasis. Dialogue uses normal Fountain uppercase character cues, or forced `@Name` cues. Keep blank lines between screenplay blocks. Parentheticals and inline emphasis are retained as text in the current preview.

The separate `fountain-parser.js` reader supports this single-scene subset, including ordinary notes, action and multiline dialogue. It is not a complete screenplay layout engine: multiple scenes, sections, transitions and dual dialogue are outside the sample format. Missing required metadata and unknown speakers produce errors. Setup-only files are supported, with an empty screenplay preview.

Open `dialogue/index.html` directly from disk or serve the site over HTTP. Both load the same classic `samples.js` script, so local startup needs no fetch or server. The deployment build automatically validates the Fountain files and regenerates that bundle. Twenty samples still load in one script request. Individual Fountain files remain available for download.
