# Design system — Swarom Firagannavar

## Purpose and personality
An engineering portfolio for recruiters, hiring managers, and collaborators, especially in software, backend, and developer tools.

**Remember:** “A software engineer who builds technically thoughtful products and makes them feel exceptional to use.”

Quietly confident, editorial, experimental, technically meticulous. Preserve the warm-paper identity, asymmetry, authentic case studies, and restrained project atmospheres. Illustrations must stand on their own without motion.

## Typography
- **DM Sans:** body, navigation-adjacent UI, sans display headings; weights 400/500/700.
- **Playfair Display:** selective italic emphasis, poster titles, note headings; weights 600/700.
- **DM Mono:** metadata, technical labels, actions; weights 400/500.
- Load through Google Fonts with `display=swap`; serif/sans-serif/monospace fallbacks.
- Display: fluid 43–88px hero, 42–78px section headings, 42–70px project titles. Short display lines use about 1.02–1.15 line height; body uses 1.6–1.7.
- Body: 16–18px; supporting notes: 15px; metadata: 10–12px. Poster micro-captions are supplemental, not essential information.
- Tight tracking belongs to short display headings. Paragraphs stay comfortably spaced. Avoid adding font families.

## Color and surfaces
| Role | Day | Night |
|---|---|---|
| Page | `#f1eee6` | `#171c19` |
| Text | `#151515` | `#f1eee6` |
| Secondary text | `#585b50` | `#bcc3b8` |
| Rules | ink at 24% | paper at 25% |

- Forest `#173f30`, acid lime `#d6ff3e`, crimson `#bd1f3a` are identity accents.
- Lime surfaces always use dark ink text, including night mode.
- Foliage: forest, botanical sage, lime. Judgement: felt `#122f29`, cream, aged gold. Reconcile.ly: ledger `#dfd4b8`, paper, terracotta `#b74b32`.
- Project artwork retains its palette in both themes. Contact stays dark `#111b16` with light text and lime accents.
- Normal text requires 4.5:1 contrast. Focus rings use crimson on paper and lime on dark surfaces. Decorative rules are not text.

## Composition and spacing
- Maximum content width: 1240px. Desktop gutters: 40px minimum; tablet: 24px; mobile: 20px.
- Spacing follows a 4px base: 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 112.
- Desktop: asymmetric two-column project spreads, alternating the ledger spread. Hero text and artwork have separate grid cells.
- At 720px and below: normal-flow hero, intentionally cropped decorative hero illustration, image-first project stacks, vertical notes. At 390px and below, navigation occupies its own row.
- Main poster illustrations remain uncropped. Captions belong to the figure, never positioned against a project row or viewport.
- Square editorial surfaces and thin rules. Small radii only within card illustrations; circles for the theme control and selected-work action.
- Notes are an open, staggered editorial layout rather than boxed feature cards.

## Artwork and content
- Homepage posters: authored botanical specimen, illustrated card table, financial ledger. SVG assets live in `Images/poster-*.svg`.
- Case studies: authentic product screenshots; preserve their original aspect ratio and project themes.
- Illustrative ledgers are labeled as illustrative. Never invent product metrics or present schematic output as real product evidence.
- Engineering summaries must agree with `foliage-case-study.js`, `project-decks.js`, and verified source notes in `Plans/case-study-slides-design-plan.md`.
- Every project has three independent actions: Explore case study, Live project, GitHub. Never cover them with a whole-card click overlay.

## Motion and interaction
- Ordinary scrolling, no pinned scenes or autoplay. Poster-only atmosphere uses scroll-triggered SVG path drawing and opacity; no background animation loop.
- `project-scenes.js` adapts the implementation introduced in `bb737f5`, removed in `61cc1bd`. Geometry is read in a batch; writes occur in a scheduled animation frame. Off-screen posters receive no updates.
- Reduced motion: fully drawn static poster decoration; no pointer-following accent or large directional motion. The viewer keeps its existing reduced-motion behavior.
- Use native anchors, visible focus, and 44px minimum interactive height. Preserve modified-click/new-tab behavior.
- Viewer changes must preserve direct URLs, query parameters, Back/Forward, Escape, arrows, swipe intent, and focus restoration to the actual triggering control.
- Reading content remains visible without JavaScript. Theme storage failure must not disable navigation.

## Quality gate
Check 320/360/390/768/1024/1440px, both themes, reduced motion, keyboard use, and project/notes routes. No horizontal overflow, text/art collision, escaped annotations, or blocked project links.

Reference lessons: Brittany Chiang for professional clarity, Paco Coursey for typography and restraint, Rauno Freiberg for a dedicated place for craft experiments. Their visual identities are not templates.

## Decision log
- 2026-11-05: User approved refinement of the existing editorial identity, richly illustrated homepage posters, independent resource actions, specific engineering notes, and preservation of case studies.
- 2026-11-05: Bound recovered atmosphere logic to poster frames to preserve mobile readability. Kept native cursor with a small optional pointer accent; removed perpetual cursor animation.
