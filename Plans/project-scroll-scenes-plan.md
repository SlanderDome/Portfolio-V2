# Main-Page Project Scroll Scenes — Design Plan

## Goal

Add lightweight, project-specific visual scenes to the main portfolio Projects section. As visitors naturally scroll through the existing projects, a restrained thematic animation appears around the active project. Keep the project text, existing placeholders, links, and overall portfolio layout as the focus.

## Project scenes

### Foliage Care

- Draw two asymmetrical, thin SVG vines from opposite page edges, staying clear of text, screenshots, placeholders, and controls.
- Reveal vine paths progressively as the project enters view; unfold a small number of leaves after their stems reach the attachment points.
- Use the existing forest and acid-green palette.
- Once revealed, the scene settles into a static frame rather than moving continuously.

### Judgement Online

- Use a restrained felt-green wash behind or around the project, consistent with its existing placeholder art.
- Reveal a few card silhouettes near the outer margins and settle them into a small fan. Keep cards decorative and outside reading and interaction areas.
- Use aged-gold details sparingly; preserve strong contrast with project content.

### Reconcile.ly

- Reveal fine ledger lines from the outer edges of the project.
- Animate a few transaction marks along those lines until selected marks align, suggesting reconciliation without implying actual live processing.
- Use the existing terracotta and ledger-cream palette.

## Scroll behavior

- Preserve ordinary document scrolling: no pinned scenes, forced pauses, scroll hijacking, or automatic slide changes.
- Activate a scene as its project approaches the viewport center. Reveal the first edge details on entry, complete the main effect as the project reaches focus, and leave the decoration settled while the visitor reads.
- Fade the scene out as its project leaves the active region. Brief crossfades between adjacent scenes are acceptable; avoid running multiple full scenes at once.
- Drive the primary reveal progress from scroll position within the project’s visible range. Scrolling upward reverses the reveal naturally.
- Use `IntersectionObserver` to limit active work to nearby projects and a shared `requestAnimationFrame` update for progress. Stop progress updates while the Projects section is off-screen.
- Keep decorative layers isolated with `pointer-events: none` and `aria-hidden="true"` so they cannot obstruct selection, links, or project interactions.

## Optional sound

- Add a compact `Sound off` / `Sound on` control beside the Selected Work heading.
- Sound is off by default and begins only after explicit visitor interaction.
- Use short, project-specific entry cues: soft leaf rustle for Foliage Care, quiet card shuffle/deal for Judgement, and soft paper movement with a muted confirmation tick for Reconcile.ly.
- Play at most one cue per project activation; do not retrigger on minor scroll movement. Fade audio when the scene deactivates, the visitor opens a case study, or the document becomes hidden.
- Do not add continuous ambience or background music in this design pass.
- Use properly licensed sound assets. If appropriate assets are unavailable, ship the visual scenes without sound rather than using synthetic placeholder audio.

## Motion and accessibility

- Use native SVG, CSS, and JavaScript only; add no animation library.
- Animate primarily opacity, transforms, and SVG stroke drawing. Avoid repeated layout reads and expensive filters.
- With `prefers-reduced-motion: reduce`, show a static edge illustration for each project and disable scroll-linked drawing, path animation, drifting, and fades.
- Respect touch and keyboard behavior; animations must never capture input or change focus.
- Keep all essential project information visible independently of the decorative scene.

## Responsive behavior

- Preserve the current project layout and placeholder artwork at desktop and mobile breakpoints.
- On mobile, reduce the number and size of decorative elements and keep them within narrow edge gutters; do not overlay project copy, images, or controls.
- Keep the same project activation and natural scroll behavior on touch devices. Do not interpret vertical touch scrolling as a scene navigation gesture.
- Verify the scenes at narrow phone widths, tablet portrait, and desktop widths to prevent clipping and horizontal overflow.

## Scope constraints

- Preserve existing project placeholders, visual identity, project links, and overall portfolio layout.
- Treat the scenes as decoration only; do not invent product features, outcomes, metrics, or screenshots.
- Keep animation restrained, avoid excessive effects, and do not change the separate case-study slide experience.

## Acceptance criteria

- Each project has a distinct scene: growing vines/leaves, settling card silhouettes, and aligning ledger marks.
- The Projects section remains naturally scrollable; there is no pinning, forced scroll, or interruption to reading and interaction.
- Only the active project receives the full effect; adjacent project transitions are brief and do not compete visually.
- Effects remain behind or outside content and do not obscure or intercept clicks, focus, text selection, or links.
- Scroll-up reverses progress smoothly; entering and leaving the section does not cause jumps or repeated animation flashes.
- Reduced-motion mode presents static thematic visuals with scroll-linked and timed motion disabled.
- Mobile scenes are edge-confined, do not create horizontal overflow, and do not cover project content.
- Sound stays off until explicitly enabled, does not replay on small scroll changes, and can be turned off immediately.
- All sound assets have documented reuse rights; if none are available, sound controls and playback are omitted.
- Existing placeholders, links, typography, palette, and page layout remain intact.
- Performance remains smooth on mobile: no continuous work while off-screen and no unnecessary animation of layout-heavy properties.

## Open implementation detail

- Final scroll activation thresholds and scene geometry should be tuned against the actual project section at desktop and mobile viewport sizes. Keep the effects modest and prioritize clear content over full-bleed decoration.
