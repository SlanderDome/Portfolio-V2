# Project guidance

## Design system
Read `DESIGN.md` before making visual or UI changes. It defines the approved typography, palette, spacing, illustration direction, and interaction requirements. Do not change that direction without explicit user approval. In QA, flag deviations.

## Structure
- Static HTML/CSS/JavaScript; no build step or framework.
- `styles.css`: homepage. `foliage-case-study.css` and `project-decks.css`: scoped case-study themes.
- `foliage-case-study.js`: shared viewer and Foliage narrative. `project-decks.js`: Judgement and Reconcile.ly narratives.
- `project-scenes.js`: poster-contained atmosphere, adapted from the removed historical implementation.
- Keep all three project actions independent. Preserve viewer URL/history and focus behavior.

## Verification
With an installed `playwright-core` module (or `PLAYWRIGHT_MODULE` set to its path):

```sh
node tests/homepage.cjs
node tests/foliage-case-study.cjs
```

Both tests serve the local site and write screenshots to temporary directories. Homepage resource navigation uses intercepted responses; this verifies destinations and independent actions, not external deployment health. Review screenshots as well as assertions.
