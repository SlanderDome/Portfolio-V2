# Portfolio Project Case-Study Slides — Refined Design Plan

## Visual system

- Preserve the portfolio’s `DM Sans`, `DM Mono`, and `Playfair Display` typography, paper/ink palette, grain, project placeholders, and editorial character.
- Give each project a restrained accent: Foliage acid green/forest, Judgement felt green/aged gold, Reconcile.ly terracotta/ledger cream.
- Use screenshots as editorial images, not card thumbnails. Text-bearing screenshots use `object-fit: contain`; decorative crops are permitted only when no interface content is lost.
- Use one dominant idea per slide, asymmetrical grids, generous margins, and no repeated “heading plus three cards” composition.
- The full-screen viewer uses fixed chrome for close, project name, slide count, progress, GitHub, and live links. The slide body is independently scrollable.

## Slide compositions

### Foliage Care — 7 slides

1. **Opening Poster:** Full-width landing screenshot occupying roughly two-thirds of the canvas; oversized title and project number sit in the remaining negative space. No text overlay across the screenshot.
2. **The Problem:** Narrow editorial text column paired with a large image aperture and three short observations aligned vertically. Avoid feature cards.
3. **Consultation Flow:** Animated horizontal path on desktop and vertical path on mobile: Diagnose → Simulate → Prescribe → Consult. Each stage appears as typography plus a restrained line icon, not a boxed tile.
4. **Visual Evidence:** Large source-derived schematic showing image input, structured diagnosis, affected-region coordinates, and care plan. Do not represent this as a real product screenshot unless an authentic result capture is supplied.
5. **System Architecture:** Wide native SVG network with browser, FastAPI, AI providers, Firebase, Open-Meteo, and Hugging Face. Labels remain outside nodes where possible to preserve whitespace.
6. **Engineering Depth:** Layered editorial lanes for model fallback, role-specific prompting, Firestore history, and optional progression generation. A narrow source-note rail distinguishes implemented behavior from limitations.
7. **Closing Statement:** Large product statement, one real screenshot, technology line, and prominent GitHub/live links. No fabricated performance or accuracy metrics.

### Judgement Online — 7 slides

1. **Opening Table:** Desktop lobby screenshot presented as a large landscape window with the title set above it like a game poster.
2. **Enter the Room:** Circular seating diagram offset against the create/join screenshot. Player arrival animates around the ring rather than appearing as cards.
3. **Game Loop:** Radial state diagram for lobby, pre-bidding, bidding, trick play, trick reveal, round summary, and game over.
4. **At the Table:** Portrait gameplay screenshot displayed at near-native aspect ratio, balanced by a compact rules column describing bidding, follow-suit, and trump behavior.
5. **Authoritative State:** Client/server swimlane diagram showing command, validation, mutation, personalized snapshot, and render. Private hands visibly branch to the correct player only.
6. **Time and Recovery:** Horizontal event timeline showing verified 30-second bid, 20-second play, 5-second trick reveal, and 5-second summary timers, followed by localStorage-based reconnection.
7. **Closing Manifesto:** Large typographic ending with technology, verified limitations, GitHub, and live deployment. Explicitly describe it as a casual private-room system with in-memory state.

### Reconcile.ly — 6 slides

1. **Opening Ledger:** Upload screenshot occupies most of the canvas with the title placed in a clean top margin.
2. **The Reconciliation Gap:** Two abstract ledger columns connected by mismatched transaction lines. Use native SVG and monospace labels rather than dashboard cards.
3. **Working Sequence:** Three real screenshots arranged as a staggered filmstrip: upload, dashboard overview, transaction ledger. Desktop uses horizontal progression; mobile uses a vertical sequence.
4. **Matching Engine:** One transaction row at the center branching to the four verified classifications. Wording must reflect implementation: an unmatched negative platform transaction is classified as an orphaned refund, and rounding uses the current hard-coded `< 0.50` threshold.
5. **Local-First Boundary:** Browser-shaped composition showing SheetJS parsing, column/currency detection, reconciliation, session storage, dashboard, and export inside the client boundary. No server is shown.
6. **Closing Balance:** Large closing phrase, a focused dashboard crop, technology line, and GitHub/live links. Do not claim time saved or recovery value without measured evidence.

## Animation choreography

- Opening: backdrop fades to full opacity over `180ms`; the viewer shell enters over `460ms` from `translateY(24px) scale(.985)` using `cubic-bezier(.22,1,.36,1)`. Chrome begins after `100ms`; first-slide content begins after `150ms`.
- Closing: content fades over `120ms`; shell recedes over `260ms`; backdrop completes over `220ms`. Focus returns to the triggering project control after the dialog is fully closed.
- Forward navigation: outgoing slide moves `-6vw` and fades; incoming slide starts at `+6vw`. Reverse navigation mirrors the direction.
- Slide transition duration: `420ms` with `cubic-bezier(.22,1,.36,1)`.
- Reveal order: eyebrow and title at `0ms`, supporting text at `70ms`, primary media or diagram at `110ms`, annotations at `170ms`, actions at `220ms`. Individual reveals last `420–520ms`.
- Diagrams: connector paths draw over `600ms`; nodes appear at `80ms` intervals. Animate only `opacity`, `transform`, and SVG stroke properties.
- Interruption handling: a new navigation request cancels active Web Animations/CSS transition state immediately, resolves the latest requested index, and begins from the currently rendered state. Inputs are not queued.
- No autoplay, parallax inside the viewer, scroll-linked animation, or animation that blocks navigation.
- Reduced motion: opening, closing, slide changes, and diagrams become immediate crossfades of at most `100ms`; all directional movement and staged delays are removed.
- Use native CSS/JavaScript only; add no animation dependency.

## URL and browser history

- Canonical state uses `?project=<slug>&slide=<number>`, preserving unrelated query parameters and existing page anchors.
- Clicking `Explore case study` pushes `?project=foliage&slide=1`, for example, and opens the dialog.
- Every explicit slide change pushes a new history entry. Back and Forward therefore move through visited slides.
- Returning to the original portfolio history entry closes the dialog and restores the original scroll position.
- Close button, backdrop close, and `Escape` use the same route-closing function.
- For a deck opened during the current page session, closing travels back across that deck’s known history depth to the original portfolio entry.
- For a direct URL or refreshed deck where no in-memory opening depth exists, closing uses `replaceState` to remove only `project` and `slide`; it must not navigate the visitor away from the site.
- Refreshing a valid project URL opens the specified slide without adding another history entry.
- Invalid project slugs remove both parameters with `replaceState`. Invalid slide values clamp to the project’s valid range and replace the URL with the corrected value.
- `popstate` is the single source of truth for Back/Forward. It opens, changes, or closes the dialog without creating additional history entries.
- GitHub and published links open new tabs and do not alter case-study state.

## Mobile behavior

- Below `720px`, slides become purpose-designed vertical editorial layouts rather than scaled desktop grids.
- Viewer chrome uses a compact top bar and sticky bottom navigation, both inside safe-area insets.
- Slide content uses `overflow-y: auto`, `overscroll-behavior: contain`, and at least `24px` bottom clearance above navigation.
- Slide content generally orders title → image → explanation. Architecture diagrams become vertical flows rather than compressed horizontal diagrams.
- Portrait Judgement gameplay remains portrait and may occupy most of the viewport width. Landscape screenshots remain uncropped and can scroll naturally with the slide.
- Swipe activates only when horizontal displacement exceeds `48px` and is at least `1.25×` the vertical displacement. Vertical intent is never cancelled.
- Use `touch-action: pan-y pinch-zoom`; do not start slide swipes from links, buttons, diagrams with controls, or horizontally scrollable media.
- A content-heavy slide may scroll vertically from any position. Reaching the top or bottom never advances the deck.

## Assets and verified claims

- Existing local assets: one Foliage landing image, one Judgement lobby image, one Judgement portrait gameplay image, and three Reconcile.ly workflow screenshots.
- Foliage’s repository contains authentic landing, diagnosis, login, about, and contact screenshots. Only relevant screenshots should be copied locally and optimized; do not remote-hotlink.
- No authentic Foliage result screenshot currently shows a completed region overlay, care plan, or progression result. Use a clearly labeled source-derived diagram unless the user supplies or approves capturing a real result.
- Judgement lacks authentic bidding, summary, and reconnection screenshots. Use verified diagrams and the two existing screenshots rather than recreating product screens.
- Reconcile.ly has sufficient imagery for upload and dashboard flow. The two dashboard images are distinct: overview-only and overview plus transaction ledger.
- All three live deployments and GitHub repositories were reachable during the refinement pass.
- Foliage source verifies FastAPI endpoints, Gemini/Groq/OpenAI routing, region-coordinate responses, progression generation, role-specific prompts, Firebase storage, and Open-Meteo fetching.
- Judgement source verifies server-authoritative validation, personalized snapshots, state phases, timers, reconnection, follow-suit enforcement, scoring, and in-memory limitations.
- Reconcile.ly source verifies browser-side SheetJS parsing, column/currency detection, four classifications, conversion multiplier, and client-side reconciliation.

## Preserved project links

| Project | GitHub | Published |
|---|---|---|
| Foliage Care | `https://github.com/SlanderDome/Foliage_Care` | `https://foliagecare.netlify.app/start` |
| Judgement | `https://github.com/SlanderDome/Judgement` | `https://judgement-x0wl.onrender.com/` |
| Reconcile.ly | `https://github.com/SlanderDome/Reconcile` | `https://reconcilely.netlify.app/` |

## Acceptance criteria

- Every slide has a visibly distinct composition; no two consecutive slides reuse the same grid or media placement.
- Layouts are reviewed at `1440×900`, `1024×768`, `768×1024`, `390×844`, and `360×800`.
- No text-bearing screenshot is cropped. Media aspect ratios remain stable during loading and transitions.
- Body text is at least `16px` on mobile, uses a readable line length, and maintains at least `4.5:1` contrast.
- Diagram labels remain readable without zooming: at least `12px` desktop and `13px` mobile, with no overlapping connectors or clipped labels.
- Existing type families and hierarchy remain consistent across the portfolio and viewer; project accents do not introduce new fonts.
- Navigation, close controls, and links have visible keyboard focus and at least `44×44px` touch targets.
- Slides have no unintended horizontal overflow. Content-heavy mobile slides scroll vertically without triggering navigation.
- Motion remains smooth by restricting animated properties to compositor-friendly transforms, opacity, and SVG strokes; no repeated layout reads occur during active animation.
- Rapid navigation always lands on the latest requested slide with correct content, URL, progress, and focus state.
- Reduced-motion mode contains no large transforms, staggered reveals, or animated path drawing.
- Placeholder artwork and overall portfolio layout remain visually unchanged outside the new project controls.

## Unresolved risks

- Foliage’s frontend sends `weather_trend` during diagnosis, while the current FastAPI endpoint accepts `weather`. Weather is fetched, but weather-aware diagnosis should not be presented as reliably wired end-to-end until that source mismatch is resolved.
- Reconcile.ly’s README describes a configurable rounding threshold, but current source uses a hard-coded `< 0.50` comparison. The case study will describe source behavior, not the README claim.
- Authentic Foliage result imagery and additional Judgement phase imagery are unavailable. Adding them requires real captures from the applications; synthetic recreations are excluded.
- The Judgement Render deployment may cold-start even though its URL is valid.
- The portfolio stylesheet contains duplicated and conflicting late overrides. New viewer styles must be strictly scoped to avoid changing the preserved placeholders or existing layout.
