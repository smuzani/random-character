# V8: datasets, login, and ownership

Status: agreed product scope, 20 September 2026. This document describes planned behavior, not implemented features. No release date is set.

V8 moves generation content and rules from hardcoded definitions into database-backed datasets. Datasets, login, and ownership are its core changes.

Users select datasets for their settings and add their own descriptors. This gives them more variety without changes to the engine code.

The [public roadmap](roadmap.html) summarizes the plans. [ARCHITECTURE.md](ARCHITECTURE.md) records technical boundaries. [ROADMAP_CHECKLIST.md](ROADMAP_CHECKLIST.md) tracks remaining work.

## Generation and datasets

The engine continues to chain tropes through tags, weights, requirements, and exclusions. Dataset origin alone does not constrain another trait.

V8 uses the existing attribute and section types. The engine shows the traits that generation produces. It hides missing traits and empty sections.

For example, no want means no Want section. No hair color means no hair color field. An empty eligible pool does not itself invalidate a character.

Selected datasets contribute entries to a combined pool. Each eligible entry uses its own weight. Dataset size does not receive automatic normalization.

For example, 100 eligible entries and 10 eligible entries, all with weight 1, give the smaller dataset about 9% of rolls.

Entries with the same displayed value remain distinct. Human Black and Ulm Black can have different descriptors, weights, and rules.

An illustrative combined hair-color pool is:

- Human: Black, Brown, Blond, Red.
- Elves: Silver, White, Gold.
- Ulm: Black, Blue-Black.

Both Black entries remain in the pool. Hair texture, such as tightly curled, belongs to a separate attribute.

Datasets do not automatically replace one another. A general Person dataset can coexist with Elves. Contemporary Human can add content such as jeans.

The actual dataset content and declared dependencies determine these relationships. Disabling specific inherited entries is later scope.

## Shared tags and descriptors

A major base dependency supplies shared tags with consistent meanings across datasets. Maintainers control this vocabulary. Users cannot create or fork tags in V8.

For example, Elves and Contemporary Human reference the same `jerk` tag. An author requests a new shared tag instead of creating a private equivalent.

Dataset authors control entry weights, requirements, exclusions, output tags, and descriptors within the supported engine model.

Each entry can provide several text variants for each existing section. Templates support a limited set of placeholders for pronouns and grammar.

For example, one hair-color entry can offer “{Their} hair is jet black” and “{They} {have} ink-black hair.”

Each contributing entry supplies one selected variant per section. If Jerk and Coward both contribute Portrayal text, both appear.

Existing eligibility and chaining behavior remain the baseline. Arbitrary author-defined branch types or executable scripts are not part of this scope.

## Dependencies and versions

Authors can declare dependencies. The app includes those dependencies and shows them to the user.

For example, Elves can require Person. A self-contained dataset can omit that dependency.

Each dependency enters the selection once, even through several dependency paths. Person does not gain extra weight because two datasets require it.

Generation uses chosen published versions. Dependencies also reference specific published versions.

If Elves requires Person v1 and Contemporary Human requires Person v2, the app reports a conflict. The user must select compatible releases before generation.

Publishing creates a stable version. Publication does not make a dataset public. A private or invite-only dataset can have published versions.

Normal generation uses published versions. Authors can preview a single character from a draft before publication. Batch previews, such as 100 characters, are later scope.

## Local generation and updates

The client downloads datasets and generates characters locally for speed. Cached datasets support offline generation.

The user chooses **Update Dataset** to fetch a newer published version. The app does not silently change the selected versions.

An update includes its required dependencies. The app downloads and validates the complete set before it switches versions.

For example, Elves v2 can require Person v3. If either download fails, the previous working set remains active.

## Ownership and collaboration

Each dataset has an owner. The owner decides who can edit, merge, publish, and invite collaborators.

Users can fork datasets and submit changes for review. An authorized user reviews and accepts changes into the destination dataset.

For example, a fork adds five descriptors and changes three weights. The reviewer can inspect those changes and resolve conflicts before acceptance.

Users can select both a dataset and its fork for generation. Both contribute their entries and weights, including unchanged entries.

The app warns that shared content can gain extra weight, but it allows the selection. A fork remains distinct from a shared dependency.

Maintainers supply datasets for everyone. Users create datasets for themselves and invited collaborators.

Wider user distribution is later scope. It needs a verification policy and a possible commercial arrangement. Neither policy is settled.

## Authoring and exchange

The app provides the main dataset editor. Authors edit content and supported rules through forms.

Structured import and export support work across tools. The format and conflict behavior remain implementation decisions.

MCP access is later scope.

## Login and saved work

Visitors start with anonymous accounts. Anonymous users can create datasets and submit changes for review.

Users can attach a login to keep their work and access it across devices. The account retains its characters, datasets, ownership, and submissions.

If a user signs into an existing account, the app prompts before it transfers anonymous work. Matching names do not cause overwrites.

Supabase supports anonymous sign-in and identity linking. Its anonymous session alone does not provide recovery on another device or after browser data removal.

See the [Supabase anonymous sign-in documentation](https://supabase.com/docs/guides/auth/auth-anonymous). The final backend selection remains a technical decision.

Saved characters contain rendered text and exact source references. For example, `ulm-v2` plus `ulm-hair-black-2` identifies the dataset version and descriptor variant.

These identifiers illustrate the required precision, not a final identifier format. Opening a saved character shows its saved text without regeneration.

Dataset updates do not rewrite saved characters. Their text remains readable without the source dataset. Direct editing of generated character text is outside V8 scope.

Saved characters sync across devices. Offline saves sync after reconnection.

Dataset presets also belong to the account and sync across devices. Each preset retains its dataset selections and pinned versions.

For example, “Ulm campaign” retains Person v1, Fantasy v3, and Ulm v2. Another device downloads those versions before generation and caches them locally.

## Later scope

- Dataset-defined attribute and section types.
- Disabling specific inherited entries.
- Batch generation for author testing.
- MCP access.
- Wider distribution of user datasets, verification, and possible commercial terms.

Existing ideas for manual creation, multiple-character scenarios, AI art, and character chat remain outside the first V8 release.

Trait locks and individual rerolls still have no assigned release.

## Open implementation decisions

These details need a separate design pass:

- Database schema, stable identifiers, and the migration of existing content into initial datasets.
- Import/export format and handling of imported identities or conflicting changes.
- Permission controls, merge conflict resolution, and concurrent draft edits.
- Exact template placeholders and supported grammar rules.
- Retention and access behavior for old versions, deleted datasets, and revoked invitations.
- Sync conflict handling and account-transfer behavior after a user declines the prompt.
- Anonymous account limits and recovery messages.

The approved product scope does not select defaults for these unresolved policies.
