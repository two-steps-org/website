---
# gstack: design-md-format=spec
name: two-steps
typography:
  display:
    fontFamily: Inter Tight
    fontWeight: 300
  body:
    fontFamily: Inter
  label:
    fontFamily: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace
  mono:
    fontFamily: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace
    fontFeature: tnum
  hebrew:
    fontFamily: Heebo
    fontWeight: 300
  accent:
    fontFamily: Instrument Serif
    fontStyle: italic
colors:
  base-dark: "#0A0A0C"
  surface-dark: "#14161B"
  surface-2-dark: "#1C1F26"
  text-dark: "#F5F6F8"
  muted-dark: "#8A8F98"
  border-dark: "rgba(255,255,255,0.08)"
  border-strong-dark: "rgba(255,255,255,0.16)"
  base-light: "#F4F5F3"
  surface-light: "#FFFFFF"
  text-light: "#0B0B0D"
  muted-light: "#5B616B"
  border-light: "rgba(0,0,0,0.08)"
  border-strong-light: "rgba(0,0,0,0.16)"
  tone-sand: "#D9B27C"
  tone-sand-deep: "#7A5A2E"
  tone-ember: "#C86A3A"
  tone-ember-deep: "#5C2A14"
  tone-ocean: "#3F6F86"
  tone-ocean-deep: "#12303F"
  tone-moss: "#6F7F5A"
  tone-moss-deep: "#2C3622"
  success: "#4ADE80"
  warning: "#FBBF24"
  error: "#F87171"
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
  section: clamp(64px, 8vw, 128px)
rounded:
  sm: 8px
  nested: 12px
  card: 20px
  full: 9999px
---

# Design System — Two Steps

Written 2026-10-24 by the overhaul audit (design-consultation phase). Stack stays React 19, Vite, Tailwind 4; every token below already exists in `src/index.css` and `src/tailwind-theme.css` or maps to one line there. This file governs what is built from here; where it contradicts a component on `ne1`, the component changes.

## Overview

- **What this is:** The marketing site of a four-person AI and software studio in Tel Aviv that sells AI agents, voice agents, custom CRM and custom software to ops leaders at 200 to 5000-person companies and to funded founders.
- **The one thing to remember:** "The people who scoped it built it, and you can see the thing running." Every design decision serves that: real artefacts over illustration, names over adjectives, one voice from hero to booking.
- **Project type:** marketing site with one transactional flow (booking) and, in phase 3, two live demos (chat, voice).
- **Direction:** Brutally minimal with intentional decoration. Type and hairlines do the work; the only colour is in photography and the ambient field; the only ornament is motion. This is the direction `ne1` already chose (`src/index.css:6-11` "Accent is inverted ink, colour enters only through the photographic tone fields") and it is the right one: seven of the eight reference sites are black, white or grey with at most one flat accent (`02-competitive-teardown.md`, Patterns to avoid).
- **Reference sites, and what each one is a reference for:** linear.app (two-tone headings, mono annotations, product-as-hero), vercel.com (one client, one number, one screenshot per block), 10clouds.com (production status tags on work), monogram.io (proof sentences inside service cards, dated engineering writing), basement.studio (nav counts, live presence; not the WebGL hero), fantasy.co (one memorable number). Not references: idealink.tech (template), lazarev.agency (density and marquee), the live twosteps.ai (gradient).
- **Use scene:** a COO or founder, on a laptop, in daylight, with twenty tabs open, deciding in ten seconds. Dark ground is kept because it is the studio's identity and reads as "software", but every light band must hold its own contrast in a bright room.

## Typography

- **Display: Inter Tight 300, tracking -0.021em, `clamp(40px, 6.4vw, 96px)`** (`.ts-display`). Kept. It is the site's identity and the owner chose it in September. gstack's own list marks Inter as an overused display voice; the mitigation is the emphasis system below, not a face swap. If the CEO review wants a face with more character, General Sans 500/400 (Fontshare, verified 2026-10-24) is the drop-in: same proportions, cleaner at 96px. Satoshi was checked and rejected: too geometric for the voice. No change is recommended now.
- **Emphasis: two-tone split on at most two long headings per page, not the italic serif and not as a system** (Linear, `02-competitive-teardown.md` §1.8; used everywhere it is the Linear look of 2026). The clause that matters sits in `text-ink`, the rest in muted. Instrument Serif italic (the `.sig` class) survives as a signature, used at most once per route including the booking modal (the closing band's "vision" or "ahead"), never in the H1 and never on a service page; the verify script counts `.sig` per route and fails above one. Reason: the italic accent word is the most copied studio device of 2025 and it currently appears three times on the home page (`Hero` no longer, `CtaBand.tsx:21`, `CaseStudyDetailSections.tsx:418`, `Blog.tsx:37`, `BookCallIntro.tsx:8`).
- **Body: Inter 400, 17 to 19px, line-height 1.6, measure 52 to 65ch** (`.ts-body`). Kept.
- **Label and mono: the system mono stack (`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`), 12 to 13px, weight 500 on dark, `tnum`.** New. Zero bytes, which matters while the font budget is being cut (plan 0.8); JetBrains Mono (Google Fonts, verified) is the upgrade only if a later measurement allows another 30 to 40 KB. One job: captions, status tags, dates, figures, the "Delivered for" label in the hero, the facts rail on case studies. Client names are never set in mono (they read as terminal strings and demote EY); names use the wordmark style. It never sets a sentence. This is the Linear "FIG 0.1" and 10clouds "LIVE AND IN ACTIVE USE" layer, and it is what makes a number on the page read as measured rather than decorative.
- **Hebrew (`/he`): Heebo 300 (or Assistant 300), Google Fonts, self-hosted with the others, tracking 0 under `[dir=rtl]`.** Inter Tight and Inter have no Hebrew glyphs; without this the page renders in the OS fallback, unbranded, with negative tracking applied to a script that must not be tracked. The mono layer stays for figures.
- **Scale:** display 40 to 96 · h2 28 to 48 (`.ts-h2`) · h3 20 to 24 (`.ts-h3`) · lede 20 to 26 · body 17 to 19 · caption 13 · mono 11 to 13. No heading within one step of body size; the h3 at 20px against 19px body (`.ts-h3` on a `.ts-body` lede) is the one violation to fix by setting ledes at 17px when they sit under an h3.
- **Case:** sentence case everywhere. Uppercase only in the mono layer, tracked 0.08 to 0.14em.
- **Loading:** Google Fonts with `display=swap` as today; add JetBrains Mono to the same request; hero entrances gate on the three faces with the 1200ms cap (`Hero.tsx:19-34`). Self-host when the benchmark report says the Google round trip costs LCP (`06-performance-seo.md`).

## Colors

- **Approach:** Restrained monochrome. Ink on near-black, inverted on the light bands. Colour enters only through photographic grounds and the four tone fields (sand, ember, ocean, moss), never through text, borders, buttons or glow. Keep.
- **Dark (default):** base #0A0A0C, surface #14161B, surface-2 #1C1F26, text #F5F6F8, muted #8A8F98, border rgba(255,255,255,.08), border-strong rgba(255,255,255,.16). (`src/index.css:12-33`)
- **Light bands:** base #F4F5F3 (ProofStrip and WorkRail use #FAFAFA today: unify on one), text #0B0B0D, muted #5B616B.
- **Muted contrast:** #8A8F98 on #0A0A0C is 5.4:1 (passes), #6B6B6B on #FAFAFA is 5.3:1 (passes), the `#8a8a8a` wordmarks the ne1 review flagged are 3.3:1 (fails; use muted-light #5B616B).
- **Accent:** there is none, and that is the position. The one accent colour on the site today is the `#0099ff` "After" label in the fake rail cards (`WorkRail.tsx:200`). It goes with the cards.
- **Status:** success #4ADE80, warning #FBBF24, error #F87171 (dark), #166534 / #854D0E / #991B1B (light). Used only inside the booking flow and the agent panel.
- **Tone fields:** sand #D9B27C→#7A5A2E, ember #C86A3A→#5C2A14, ocean #3F6F86→#12303F, moss #6F7F5A→#2C3622. Used as graded grounds under real photography and the ambient field. Rule: a tone field never sits alone as "art". The blog covers (`public/blog/covers/*.svg`) are tone fields alone; they get replaced by artefacts (07 §8).
- **Glow:** the ember/ocean ambient field behind the hero stays (owner's look) but it is a ground, not a halo: no radial glow behind text, no zero-offset coloured shadows (`DataEncryptionCard.tsx:85`, `PipelineCard.tsx:93-115` are the violations, all deleted with the cards).

## Layout and grid

- **Container:** `.ts-container`, max 1280px, gutter clamp(16px, 4.5vw, 24px) → 32px → 48px. Keep. Every heading starts on the logo line (verified by `scripts/verify-layout.mjs`).
- **Grid:** 12 columns desktop, 6 tablet, 4 mobile, 24px gutter. Section headers use the two-column "statement left, support right" split the nav plan deferred (`md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]` already exists as `Split` in `CaseStudyDetailSections.tsx:24`); now that every section has a lede it is used on home too.
- **Section rhythm:** `.ts-section` padding-block clamp(64px, 8vw, 128px). Keep. Exceptions carry `data-layout="free"` (hero, proof strip).
- **Composition rule:** the first viewport is a poster, not a document. Headline + sub + proof line + one artefact. The artefact, in order: the live voice control; otherwise a recording of a real task in an owned product (no device frame, hairline card, mono caption); type only is a build fallback and never the launch state. The ambient glow sits on the artefact side, never centred behind the H1. On mobile the hero is as tall as its content and the proof line is above the fold at 390px.
- **Bands:** dark → light → dark alternation stays. The proof strip is cut (its names moved into the hero), so "What we build" becomes the first light band: hero dark, what we build light, work dark, method light, studio dark, questions dark, footer dark. The nav flip on `data-band="light"` is unchanged.
- **Density:** one idea per screen on desktop, never more than one signature display line per page.

## Spacing

- Base unit 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Inside components: 16/24. Between components: 32/48. Between sections: the rhythm token.
- Text measure: body 52 to 65ch, ledes 40 to 48ch, headlines 12 to 16ch.

## Components

- **Buttons:** `.ts-pill` (ink fill) and `.ts-pill-ghost` (hairline). Heights 44 (nav), 48 (inline), 56 (hero). Press scale 0.97 at 160ms. Keep. Never a gradient, never a third style.
- **Links in text:** underline, offset 4px, hairline colour, hover to ink. Keep.
- **Cards:** one surface (`.ts-card`), 20px radius, hairline border, no shadow unless floating (modal, launcher). No card inside a card. No icon tile above a heading.
- **Eyebrows:** `.ts-eyebrow` 12px, tracking .12em, uppercase. Allowed only where the eyebrow carries information the heading does not (a count, a client name, a date). Deleted wherever it repeats the heading (`Services.tsx:21`, `ServiceDetail.tsx:58`, `FAQ.tsx:60`, `Team.tsx:60`, `Process.tsx:66`).
- **Chips:** `.ts-chip` for stack and industry labels, 13px, hairline. Never for metrics.
- **Lists:** hairline-separated rows (the capability list pattern in `Services.tsx:19-27`) are the house list. No bullet-point grids of equal boxes.
- **Wordmarks:** client names set in Inter Tight 500, 15px, tracking .14em, uppercase, one weight, in a hairline grid (the ProofStrip grid is right; its content is not).
- **Proof line in hero:** "Delivered for" in mono 12px muted; the four names in wordmark style (Inter Tight 500, tracked), separated by middots; no logos.
- **Work card without an image:** mono status tag top-left ("live" may use the success token, the only colour a tag may carry), title `.ts-h3`, outcome line, client in wordmark style, hairline, the whole card a link; no image slot. Under four entries, a static grid with no arrows.
- **Case-study hero without an image:** breadcrumb, outcome title, mono facts rail (service, client, status, stack); no background image, no tone field alone.
- **Mobile line per rebuilt section:** hero (content height, proof line above the fold); capability rows (single column, example line under the title); work grid (one column, status tag stays top-left); method (stacked, timing and team captions inline); questions (full-width rows, 88px tap height).
- **Nav:** three floating pieces (logo, glass pill with lamp, CTA) over any content, flipping to ink over light bands. Keep exactly as is (owner's decision, 2026-09-19). Do not propose a capsule.
- **Modal:** `.ts-modal-shell`, scale 0.96→1 at 220ms, scrim 70% with blur. Keep.
- **Forms:** `.ts-field` 48px, hairline, focus ring ink. Labels as eyebrows above. Error text 13px in status-error.
- **Media:** real screens and recordings only. `ResponsiveImage` with width/height set. Tone-graded grounds under photography. No stock, no placeholder SVG cards (`public/work/case-*.svg` are deleted).
- **States:** every component designs empty, loading, error and long-content. The booking calendar already does; the agent panel and the work rail do not.

## Motion

- **Principle 1, scroll-linked and reversible per section.** This is the owner's standing requirement (2026-09-13): each section has its own scrubbed choreography (`Scrub` effects: rise, curtain, timeline, shutter, signature, portrait, focus, assemble), reversible on scroll-up, distinct per section. The design system does not remove it; it governs it.
- **Principle 2, entrances always play.** The hero entrance (`SplitText` + `enter`) plays on every load, gated on fonts with the 1200ms cap. Reduced motion collapses to opacity only.
- **Principle 3, nothing self-animates inside a scrubbed scene.** No pulsing dots, no looping marquees, no live cards inside a scroll-pinned region (`animate-pulse` at `PipelineCard.tsx:175` and `EncryptionMetricPanels.tsx:32` are the violations). Enforced by a lint: no `animate-*` class inside a `Scrub` subtree. Live artefacts (voice waveform, product recordings) live in their own non-scrubbed frame.
- **Principle 4, reading is never blocked.** Entrances move with transform and clip only; opacity stays at 1 (every `opacity` in the `Scrub` START table set to 1), so axe never samples half-faded text and assistive tech never meets hidden content. A scrub finishes within the first 30% of the section's travel and never moves text more than 32px. The CTA band's button is not scrubbed (already true, `CtaBand.tsx:24`).
- **Principle 5, one easing family.** `--ease` cubic-bezier(.22,1,.36,1) for movement, `EASE_OUT` (.23,1,.32,1) for UI, `EASE_DRAWER` for the sheet. Durations: UI 200 to 220ms, entrances 360 to 400ms, stagger 35 to 60ms. No `transition-all` (`PipelineCard.tsx`, `NavbarMobileMenu.tsx:84`).
- **Principle 6, transform and opacity only, plus clip-path for the three reveal effects.** No height, no filter animation on large areas (the `blur-[6px]` parallax hero image on case studies is a known cost; the benchmark report says whether it matters).
- **Principle 7, nav chrome is thresholded, not scrubbed.** The light-band flip snaps at the band edge.
- **Hover:** colour and hairline changes only. No image zoom on hover (`CaseStudyDetailSections.tsx:378`, `Team.tsx:42` are the violations).

## Accessibility

- WCAG 2.2 AA throughout: 4.5:1 body, 3:1 large and UI; focus-visible ring on every control (remove `focus:outline-none` from the logo links); 44px targets on coarse pointers (`.ts-slot` and `.ts-seg` are 28px); label-in-name for every link (strip the differing footer aria-labels); one h1 per page; `prefers-reduced-motion` collapses every scrub to a fade.

## Components, by page (what each section is allowed to be)

| Section | Allowed form | Not allowed |
|---|---|---|
| Hero | Display line, lede, two pills, proof line, one real artefact (voice, else a product recording) | Diagram of nouns, three stat tiles without sources, chip above the headline, a type-only launch |
| Capabilities (light band) | Three hairline rows: h3, two sentences, mono example line, one real still; a row without a cleared example has no still slot | Equal-box icon grid, decorative cards, a half-filled grid of stills |
| Work rail | Real cards with status tag, outcome line, client mark, linked | Cards without links, Before/After pairs with invented text |
| Method | Two columns, mono timing and team captions, the blueprint artefact | Numbered circles, icon tiles, five steps |
| Studio teaser | Statement, one sentence, four portraits, one link | Values list |
| Questions | Hairline accordion, 8 to 9 questions | Title Case heading, "Got Any Questions?" |
| Closing band | One per page, display line, one pill | Two signature bands on one page |
| Footer | Three quiet columns, mono legal line | Icon boxes, decorative hover underlines |

## Risks (deliberate departures from the category)

1. **No accent colour at all.** Gain: every client mark and every photograph is the colour on the page, and the site cannot be confused with the blue-purple AI template. Cost: visited links cannot differ (accepted); status tags all weigh the same in a scan, so the word "Live" alone may use the success token; error states stay inside the booking flow.
2. **Mono proof layer.** Gain: numbers and tags read as engineering fact; the site borrows the credibility of a changelog. Cost: on the system stack, none in bytes; the look varies slightly by OS (SF Mono, Consolas, Menlo), which is acceptable for captions.
3. **Scroll-linked choreography kept, governed, not removed.** Gain: the site moves like a studio that builds interfaces, which is the owner's standing requirement. Cost: every new section needs its own scrub recipe and reduced-motion fallback; the design review rates each one.
4. **An owned product in the hero.** Gain: the first viewport shows the studio's own shipped work, which no agency can fake, from launch. Cost: a recording has to be good enough to sit under the headline; Shift Manager in Hebrew is also a choice to lead with the local product in front of a US buyer, which the caption ("our product · live") makes a strength.

## Safe choices (category baseline)

- Dark base, light bands, hairline dividers, pill buttons: what every reference studio does.
- One container, one section rhythm, headings on the logo line: already verified by `scripts/verify-layout.mjs`.
- Sentence case, short H1, lede under 20 words: the two best heroes in the set are 2 and 5 words.

## Coherence

Monochrome ink plus a mono data layer plus governed scroll motion plus real artefacts all say the same thing: a small team that measures, ships and shows. Remove any one and the others read as style.
