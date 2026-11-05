# Design audit — Swarom portfolio

**Date:** 2026-11-04  
**Scope:** Full single-page portfolio at desktop (1440px), tablet (768px), and mobile (390px)  
**Classification:** Personal portfolio / hybrid landing page  
**Review target:** Current local working tree, including its pre-existing changes

## First impression

The page communicates a software engineer who cares about product craft. The first screen reads as one editorial composition: availability line, oversized headline, Foliage Care visual, then a clear Selected Work link. My eye goes to the headline, the green project artwork, and the lime action. The warm paper background and restrained red accent give the portfolio a distinct identity.

At mobile and tablet widths, the hero image initially covered the italic second half of the headline. The mobile header also removed every section link, and its remaining theme control was too small to tap comfortably.

## Inferred design system

- **Typography:** DM Sans for body and sans headlines, DM Mono for labels and metadata, Playfair Display for italic emphasis. Arial appears as a minor fallback.
- **Palette:** warm paper `#f1eee6`, ink `#151515`, acid lime `#d6ff3e`, and crimson `#bd1f3a`.
- **Composition:** editorial headlines, asymmetric project rows, thin rules, and generous section spacing. The lab notes are a horizontally scrollable rail with a visible drag instruction.
- **Responsive behavior:** project rows stack into image-first case studies on mobile; the lab rail remains horizontally scrollable.

## Findings and fixes

### FINDING-001 — Mobile hero artwork covers the headline

**Impact:** High · **Status:** Verified  
At 390px, the absolute-positioned hero figure began before the large italic headline had finished, obscuring “with consequence.” Move the figure down so the headline reads completely before the image begins.

- Before: [mobile-before.png](mobile-before.png)
- After: [mobile.png](mobile.png)
- Fix: set the mobile hero figure top offset to 350px.
- Commit: `2ac55a5` (`style(design): FINDING-001 separate mobile hero artwork`)

### FINDING-004 — Tablet hero artwork crosses the headline

**Impact:** High · **Status:** Verified  
At 768px, the desktop-positioned artwork crossed the headline’s second line. Move the figure lower between 721px and 900px and reduce its width to preserve a clear text area.

- Before: [tablet-before.png](tablet-before.png)
- After: [tablet.png](tablet.png)
- Fix: add a tablet-specific top offset and figure width.
- Commit: `d8dd9be` (`style(design): FINDING-004 clear tablet hero headline`)

### FINDING-002 — Mobile section navigation was hidden and controls were undersized

**Impact:** Medium · **Status:** Verified  
At 390px, the Work, About, and Contact links were hidden. The theme button measured 32×32px and the Resume link 97×40px. Restore the section links and give the header and contact links 44px minimum tap dimensions.

- Before: [mobile-before.png](mobile-before.png)
- After: [mobile.png](mobile.png)
- Fix: reveal compact section links, preserve the Resume action, and enlarge the theme and text-link targets.
- Commit containing this change: `61cc1bd` (also contains pre-existing project-scenes removals and audit artifacts).

### FINDING-003 — Desktop navigation and footer links had short tap areas

**Impact:** Medium · **Status:** Verified  
The desktop navigation links, theme control, and footer links were shorter than 44px. Extend their hit areas without changing the visual hierarchy.

- Before: original [desktop.png](desktop.png)
- After: current [desktop.png](desktop.png)
- Fix: provide 44px minimum height and width where needed.
- Commit: `3b9a0a1` (`style(design): FINDING-003 enlarge desktop link targets`)

## Quick wins

- Keep hero headlines and project artwork in separate vertical bands at mobile and tablet widths.
- Keep all primary navigation visible on narrow screens, using compact labels.
- Use 44px minimum hit areas for header, theme, email, and social links.

## Interaction and responsive checks

- Desktop and mobile document widths matched their viewport widths: 1440/1440 and 390/390. Tablet also matched at 768/768.
- No browser console errors or page exceptions were observed during screenshot capture.
- Mobile navigation reached Work; the theme toggle changed to night mode; the project case study opened and closed after its history update; the lab rail scrolled horizontally.
- The partial next lab card is intentional: the “Drag to explore” cue is visible and the rail responds to scrolling.

## Scores

| Measure | Baseline | Final |
|---|---:|---:|
| Design score | 6.5/10 | 8.5/10 |
| AI-slop score (lower is better) | 1/10 | 1/10 |

The visual identity was already strong. The score increase reflects the corrected responsive hierarchy and more usable targets. The page avoids a generic SaaS card grid; its AI-slop risk is low.

## Summary

**Findings:** 4 · **Verified fixes:** 4 · **Deferred:** 0  
**Design score:** 6.5 → 8.5 · **AI-slop score:** 1 → 1  
**PR summary:** Design review found 4 issues and fixed all 4; design score 6.5 → 8.5, AI-slop score 1 → 1.
