# Remaining work

The [public roadmap](roadmap.html) summarizes feature plans. [V8_SPEC.md](V8_SPEC.md) defines the agreed V8 scope.
This checklist tracks remaining work. List order does not indicate priority. Release dates are not set.

## Generator improvements

- [ ] Creation controls: lock traits and replace individual aspects while preserving dependent rules. The release version is undecided.
- [ ] Obstacles: decide whether they replace plot hooks or accompany them, and connect them to wants.
- [ ] Names: reduce US bias and support names from more cultures.
- [ ] Useful depth: expand plot hooks, backstories, relationships, likes and dislikes, birthdays, weapons, and job concepts.
- [ ] Optional character details: religion, ethnicity, and sexual orientation.
- [ ] Consistency: reduce contradictions and improve user reporting.
- [ ] Resources and credits: collect useful tools, reading, and acknowledgements.

## V8: datasets, login, and ownership

- [ ] Move content and generation rules into database-backed datasets with shared, maintainer-controlled tags.
- [ ] Combine weighted dataset entries, resolve pinned dependencies, and warn about selections that include forks and their sources.
- [ ] Cache datasets for local and offline generation, with explicit updates of complete dependency sets.
- [ ] Add app-based authoring, descriptor variants, draft preview, and structured import/export.
- [ ] Add dataset ownership, owner-assigned permissions, invitations, forks, and reviewed merges.
- [ ] Separate published versions from dataset visibility.
- [ ] Add anonymous login, linked accounts, and a prompt before transfer into an existing account.
- [ ] Sync saved characters and dataset presets across devices, including offline character saves after reconnection.
- [ ] Save rendered character text and exact source variants without automatic regeneration.

## Later scope

- [ ] Support new attribute types and exclusion of specific inherited entries.
- [ ] Add batch previews and MCP access.
- [ ] Define verification and possible commercial terms for wider user dataset distribution.
- [ ] Add multi-character scenarios and manual creation.
- [ ] Add optional AI art and character chat through a backend.

Direct editing of generated character text is outside V8 scope. Tags are not forkable in V8.

## Outside the current release scope

World generation, combat, first-encounter prompts, fictional languages, poetry, fandom generators, and access to older generator versions remain ideas.

See [ARCHITECTURE.md](ARCHITECTURE.md) for implementation choices and technical boundaries.
