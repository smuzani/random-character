# CLAUDE.md — Random Character Generator

## Project Overview

A procedural **random character generator** for writers, game designers, and storytellers. Generates personality-driven characters using weighted trope-based aspects, with support for wants, plot hooks, appearance, and team dynamics. Currently at **V7.4**.

Live site: Static HTML/JS served directly (no build step, no framework).

## Tech Stack

- **HTML5** — Static pages, no templating engine
- **CSS** — Bootstrap 4 (bundled `css/bootstrap.min.css`) + custom `css/main.css`
- **JavaScript** — Vanilla ES6, jQuery 3.3.1, Ramda.js (functional utils)
- **Backend** — Currently none
- **Analytics** — Google Analytics (UA-140909040-1)
- **Fonts** — Custom fonts via `css/fonts.css`

## Architecture

### No Build Step

This is a **static site** — open `index.html` directly or serve with any static file server. There is no `package.json`, no bundler, no transpiler.

### Core Engine (`js/generator7.js`, ~1072 lines)

The generator uses a **weighted procedural system** based on TV Tropes archetypes:

1. **`Character`** — Holds `tags` (Set), `excludes` (Set), `branches` (Array), and `aspects` (Array)
2. **`Aspect`** — A weighted trope with `name`, `weight`, `text`, `type`, `tags`, `requirements`, `excludes`, `branchRequirements`, `branchExcludes`
3. **Generation flow**:
   - User selects Role (Heroic/Villainous/Support/Any), Gender, Detail level
   - `loadTags()` → initial tags from form inputs
   - `loadInitialBranches()` → branch sequence based on detail level (e.g. `[BWANT, BSINGLEPLOT, BPERSONALITY, BPERSONALITY]`)
   - `createCharacter()` → iterates branches, rolling weighted aspects that match tag requirements
   - `displayCharacter()` → renders results into DOM sections

### Tag System

Tags are string constants (e.g. `TBADASS = 'badass'`, `TSWEET = 'sweet'`). They serve as:
- **Requirements** — Aspect only rolls if character has these tags
- **Excludes** — Aspect won't roll if character has these tags
- **Outputs** — Tags added to character after aspect is picked

This prevents conflicts (e.g. a pacifist won't also be a sadist).

### Branch Types

| Branch | Array | Purpose |
|--------|-------|---------|
| `BPERSONALITY` | `aspects` | Core personality tropes |
| `BTEAMONE` | `soloTeam` | Solo/loner situation tropes |
| `BSINGLEPLOT` | `drama` | Plot hooks (36 Dramatic Situations) |
| `BWANT` | `want` | Character motivations/desires |

### Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main generator page |
| `js/generator7.js` | Core engine: Character/Aspect classes, generation logic, display |
| `js/tag-details.js` | Tag constants + `tagToDesc()`, `tagToPortrayal()`, `tagToAppearance()`, `tagToPowerBase()`, `tagToHiddenPersonality()`, `tagToWealth()` |
| `js/plot-details.js` | Plot hook constants + `plotToDesc()`, `initPlots()` |
| `js/want-details.js` | Want/motivation constants + `wantToDesc()`, `initWants()` |
| `assets/names.js` | Name lists (`namesM`, `namesF`) from Moby Word List |
| `js/plugins.js` | Browser console safety shim |
| `css/main.css` | Custom styles (H5BP-based) |
| `css/fonts.css` | Font-face declarations |

### Pages

| Page | Description |
|------|-------------|
| `index.html` | Generator (main page) |
| `whatisthis.html` | About page with changelog (V1-V7.3) |
| `roadmap.html` | Feature roadmap + survey results |
| `tags.html` | Tag management CRUD (Vue.js) |
| `contact.html` | Feedback form |
| `blog.html` | Blog page |
| `privacy.html` | Privacy policy |
| `ai-policy.html` | AI usage policy |
| `chat.html` | Chat page (commented out in nav) |
| `404.html` | Error page |

## How Generation Works

```
User Input → loadTags() → [TFACE, TMALE, BTEAMONE]
                        → loadInitialBranches() → [BWANT, BSINGLEPLOT, BPERSONALITY, BPERSONALITY]

For each branch:
  1. Filter aspects array by character's current tags (requirements/excludes)
  2. Roll weighted random from filtered list
  3. Add aspect's tags to character, aspect's excludes to character's exclude set
  4. Aspect may spawn additional branches (branchRequirements/branchExcludes)

Display: Tags → mapped through tagToDesc(), tagToPortrayal(), tagToAppearance(), etc.
```

## Display Sections (Detail Mode)

When `showDetails = true` (default), the output is categorized into:
- **Personality** — Main traits list
- **Want** — Character motivation paragraph
- **Plot Hook** — Story situation paragraph
- **Appearance** — Physical description bullets
- **Portrayal** — Behavioral description bullets
- **Strengths & Weaknesses** — Power base bullets
- **Private Details** — Hidden personality bullets
- **Wealth** — Economic status bullets
- **Background** — Backstory bullets (currently disabled in code)
- **Team Structure** — Solo situation description (if applicable)

## Conventions

- **Pronouns**: Dynamic via `p` object (`p.she`, `p.him`, `p.his`, etc.), set by `generatePronouns()`
- **Randomness**: `roll(min, max)` for dice, `rollRole(array)` for weighted selection using Ramda's `R.pluck`
- **Naming**: `randomName(gender)` picks from `namesM`/`namesF` arrays
- **No stereotypes checkbox**: When checked, gender tags are skipped entirely

## Common Tasks

### Adding a New Personality Aspect
In `generator7.js` → `initAspects()`:
```js
aspects.push(new Aspect("Trope Name", weight, "Description text",
  BPERSONALITY, [TAG1, TAG2], [ROLE_TAG], [EXCLUDE_TAG], [], []));
```

### Adding a New Tag
1. Define constant in `tag-details.js`: `const TNEWTAG = 'newtag';`
2. Add cases to relevant `tagTo*()` functions
3. Use in Aspect definitions

### Adding a New Want
1. Define constant in `want-details.js`: `const WNEW = 'newwant';`
2. Add case to `wantToDesc()`
3. Add to `initWants()` with appropriate weight and requirements

### Adding a New Plot Hook
1. Define constant in `plot-details.js`: `const PNEW = 'newplot';`
2. Add cases to `plotToDesc()` and `plotToObjective()`
3. Add to `initPlots()`

## Incomplete / Stub Content

Several want descriptions in `want-details.js` are stubs (just return the tag name):
- `WGETJOBDONE`, `WRETURNHOME`, `WUPHOLDHONOR`, `WENEMIES`, `WCOLLECTION`, `WSMALLTHING`, `WFREEFROMBONDAGE`, `WSAVEDLIFE`, `WCHOSENONE`, `WENVY`, `WLOSTLOVE`, `WSPECIFICWEALTH`, `WSPECIFICJOB`, `WFAKEHEROISM`, `WFEAR`, `WBULLY`, `WFORCEDVILLAIN`, `WDISABLED`, `WBEHUMAN`, `WRESURRECT`, `WLUST`, `WSEERUINED`

These are commented out in `initWants()` so they don't appear in generation.

## Notes

- `js/main.js` is empty
- `dist/` directory exists but is empty
- `doc/` contains H5BP boilerplate docs, not project-specific documentation
- The `tags.html` page uses Vue.js (CDN) for a CRUD interface
- Background texture: `img/cream_texture.png`
- Version comment in code says "Will be deprecated for V8, once content is always from from server"
