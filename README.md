# Random Character Generator

Serve the repository root with a static server to open the character generator at `/` and the Dialogue editor at `/dialogue/`. Both use the same character library in browser storage.

Run `node dialogue/build-site.mjs` to package both pages for Netlify. Use the repository root as the Netlify base directory. Set `GEMINI_API_KEY` for the site's Functions runtime to enable scene generation at `/api/generate`.
