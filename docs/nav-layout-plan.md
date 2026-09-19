# Navbar & page layout plan

Written 2026-09-19, revised the same day after review. Based on a measured study
of wonderful.ai and idealink.tech (desktop 1440px, mobile 390px) and the same
measurements taken from our own site.

Scope: navbar and page layout only. **Copy is a separate pass after this one** —
section 6 lists what that pass should pick up.

## 1. What stays (our look)

None of this changes. The plan is about structure underneath it.

- Dark monochrome base with the warm ember / ocean glow.
- Inter Tight light headings with the serif italic accent word (*Ahead*).
- Over the hero, the nav is three floating pieces: logo, glass link pill with
  the glow "lamp" on the active link, and the CTA. That is the distinctive look.
- Light bands (`data-band="light"`) that flip the nav to dark ink.
- Scroll-linked, per-section choreography **inside sections**. The nav chrome is
  the one exception — see N1.

## 2. What the two sites do that we don't

| Lesson | wonderful.ai | idealink.tech | Us today |
|---|---|---|---|
| Nav is readable over any content | Transparent on hero, frosted white bar after | Solid white bar always | Logo and CTA float with **no backing** — they collide with page content on scroll (desktop and mobile) |
| Few nav links | 4 | 4 | 7 |
| One content edge | Everything starts at 60px | Everything starts at 72px | Two containers (`max-w-7xl` and `max-w-[1312px]`) with four different paddings: headings start at 68, 88, 112, 124 and 128px, some centred |
| One section rhythm | Consistent | 104px top and bottom, every section | 112 / 96 / 0+128 on desktop; 24 vs 80–96 on mobile |
| One heading size | 48px | 60px | 44, 54 and 56px |
| Dense scroll | ~7,200px page | ~11,000px page | 13,195px, of which **5,400px (41%) is the pinned Why Us section** showing one sentence per screen |
| A call to action mid-page | Buttons inside sections | Navy CTA banner, twice | Only the nav button and the footer |
| Hero fits the first screen | Exactly 100vh | Yes | Desktop yes (847px). Mobile no — 1,046px on an 844px screen, diagram cut in half |

Things we already do as well as they do: alternating dark/light scenes, a
carousel with the next card peeking in, a full-screen mobile menu sheet, a fixed
nav that never hides.

## 3. Navbar

Files: `src/components/layout/Navbar.tsx`, `NavbarDesktopNav.tsx`,
`NavbarMobileMenu.tsx`, `useNavbar.ts`, `src/data/navItems.ts`.

### N1 — Capsule after the hero (fixes the collision bug)

Over the hero nothing changes: three floating pieces. Once the hero has scrolled
past the nav, a single frosted capsule appears behind the whole row — logo, link
pill and CTA — using the existing `ts-glass` surface.

- **A threshold, not a scrub.** One boolean (`isPastHero`), flipped when the
  hero's bottom edge passes the nav. The capsule transitions opacity over
  ~200ms ease-out, the same in both directions. Glass at partial opacity looks
  muddy, so it is never held there by scroll position.
- **The capsule is a background layer only:** `pointer-events-none`,
  `aria-hidden`, absolutely positioned behind the row. The header stays
  `pointer-events-none` with only the logo, pill, CTA and menu toggle opting
  back in, exactly as today. The gaps between them must stay click-through.
  Verified by script: clicking a page element in the gap between logo and pill
  still hits the page.
- Same behaviour on mobile (logo + hamburger inside the capsule).
- Over a light band the capsule uses the existing light glass values.
- This **replaces** the `showMobileContrastBar` workaround, which only appears
  at the footer. Delete that state, its effect (~35 lines in `useNavbar.ts`)
  and the gradient div in `Navbar.tsx`.
- Reduced motion: the capsule appears without the transition.

### N2 — Seven links down to four

Desktop pill becomes: **Services · Why Us · Q&A · Case Studies.**

- **Home** goes — the logo already does it.
- **Process** and **Team** move to the mobile menu and footer only. Q&A stays in
  the pill ahead of them because it is a closer: a visitor hunting for an
  objection to be answered is nearer to booking than one reading the team page.
- Four matches both references. Final wording is decided in the copy pass.
- `navItems` gets one optional flag (`desktop: false`) rather than a second list.

**Requirement — a no-active state.** The scroll-spy in `useNavbar.ts` starts
from `let active = sections[0]`, so with Home gone, Services would light up at
the top of the page. Change it so:

- nothing is active while the trigger line is above the first tracked section
  (the hero), and `activeTab` initialises to empty on `/` instead of
  `navItems[0].name`;
- while scrolling through Process or Team on desktop, nothing in the pill is
  lit (they are not in the pill). The mobile menu still marks them.

Verified by script: at `scrollY = 0` no pill link has `aria-current`.

### N3 — Mobile menu polish

Keep the full-screen sheet. Borrow from wonderful.ai:

- Larger, lighter rows (about 24px, weight 300) separated by hairlines instead
  of rounded hover boxes.
- "Book a Call" pinned to the bottom of the sheet, in thumb reach, instead of
  directly under the last link.
- Email and phone in small type above the button.
- Rows stagger in using the existing drawer motion presets.

### Deliberately skipped

- **Mega menu.** It earns its place when the items lead to pages. Our four
  services open modals inside one section and are already listed as chips in
  the hero. Add it when service pages exist.
- **Announcement bar.** Add when there is news to announce.
- **Hide on scroll down.** Neither reference does it; a visible CTA is worth more.
- **Language switcher.** No second language yet.

## 4. Page layout

### L1 — One container

Add one utility, `.ts-container`, to `src/index.css`: the nav's own measure
(`max-w-7xl`, mobile gutter → `px-8` → `xl:px-12`). Use it in the nav,
`common/Section.tsx`, and the places that currently roll their own
(`Services`, `ProofStrip`, `WorkRail`, `Testimonials`, `WhyUs` use
`max-w-[1312px]` with three different paddings; `Hero` uses `max-w-7xl` with no
padding of its own).

Result: every section heading starts on the same vertical line as the logo
(128px at 1440). Carousels may still bleed off the right edge — that is a
feature — but their left edge sits on the line.

### L2 — One section rhythm, with named exceptions

Add `.ts-section`: `padding-block: clamp(64px, 8vw, 128px)`. It is for
**chapter sections only**: Services, WorkRail, Testimonials, Process, Team, FAQ
and the new CTA band. This lifts the mobile dark sections from 24px to 64px,
the biggest single mobile improvement.

Three sections are not chapters and keep their own vertical sizing:

| Exception | Why | What it uses instead |
|---|---|---|
| Hero | A viewport composition | First-viewport height (L7) |
| Why Us (pinned, desktop) | A viewport composition | Pin height (L4) |
| ProofStrip | A dense band; 128px around one row of marks looks sparse | Its own compact padding, about half the chapter value |

All three still use `.ts-container` horizontally. Each carries
`data-layout="free"` so the verify script knows to skip its vertical checks —
the exceptions live in the markup, not in a list someone has to remember to
update or is tempted to switch off.

Drop `md:min-h-[calc(100vh-80px)]` from `Section.tsx`. It forces Team and FAQ to
a full screen each regardless of content and is why both measure exactly 820px.

### L3 — One heading pattern (size and alignment now, two-column later)

Now:

- One size: `.ts-h2` becomes `clamp(28px, 3.4vw, 48px)`; WorkRail (54px) and
  Testimonials (56px) drop their custom sizes and use it.
- Eyebrow → h2, single column.
- **Left by default.** Centre only ProofStrip and FAQ. Process and Team move
  from centred to left.

Deferred to the copy pass: the "statement left, support text right" two-column
header. It needs a real lede per section, and those words do not exist yet. No
placeholder ledes — placeholder copy has a way of shipping. Until then a section
header is eyebrow + h2 and nothing else, which reads as finished.

### L4 — Why Us: same choreography, half the scroll

Keep the pin and the scrubbed step change.

**4a (required).** Scroll distance per step from ~900px to ~55vh. Six steps ≈
3,000px, down from 5,400px.

**4b (only with assets that already exist).** The right half of the pinned
screen is empty today. Give each step one **static** visual that crossfades with
the step:

- Not the live bento cards. They carry their own hover and loop motion, and
  running that inside a scrubbed pin is two motion systems fighting. Where a
  card is the right picture ("Security at the Core" → encryption, "Effortless
  Integration" → integration), use a still, simplified version with no internal
  animation.
- For the rest, large Lucide glyphs (already a dependency) composed in the same
  line style as the hero network nodes. No new illustration assets.
- If a step has no convincing visual from those two sources, **4b is cut from
  this pass** and revisited with the copy. 4a ships regardless.

### L5 — One loud ask mid-page, a quiet footer

Add one `CtaBand` after Testimonials — the point where a visitor has seen the
work and the quotes. The big "Your business, two steps *ahead*" headline
treatment **moves** there from `Footer.tsx`; it is not duplicated. Headline
words reveal with scroll.

The footer becomes compact: brand column, link columns and its existing Book a
Call button, with no display headline. One big ask on the page, not two.

### L6 — Closing rhythm

The page ends with three dark, centred sections in a row (Process, Team, FAQ).
Put **Team on a light band** so the ending alternates like the top half does.
The nav already flips automatically on `data-band="light"`.

### L7 — Mobile hero fits the first viewport

Target the **first viewport**, whatever its height — not a fixed 844px. Hero is
`min-h-[100svh]` on mobile and is checked at three sizes: 375×667 (SE),
390×844, 430×932 (Pro Max).

- Headline, paragraph and the primary "Book a Call" button are inside the first
  viewport at all three sizes. The secondary button and service chips may fall
  below on the SE; they must fit at 844 and up.
- The network diagram moves **fully below the fold** on mobile as its own
  scroll-in moment. No attempt to shrink it into the first screen.

### L8 — Case studies page

Apply L1–L3 to `src/pages/CaseStudies.tsx` and the detail sections so the two
pages share one grid.

### Section order

Unchanged: Hero → Proof → Services → Work → Testimonials → **CTA (new)** →
Why Us → Process → Team → FAQ → Footer. It already matches both references
(proof early, team and FAQ last).

## 5. Order of work

Commit the current working tree first (45 modified files on `ne1`) so this pass
is a clean diff.

| Step | Item | What you can see afterwards |
|---|---|---|
| 1 | L1 container | Every heading lines up with the logo |
| 2 | L2 rhythm (with exceptions) + L3 size and alignment | Even spacing; one heading size; mobile sections breathe |
| 3 | N1 capsule | Nav no longer collides with content |
| 4 | N2 links + N3 mobile menu | Four links, no false "active" on the hero, cleaner sheet |
| 5 | L7 mobile hero | First screen ends cleanly on any phone |
| 6 | L4 Why Us | Page ~2,400px shorter |
| 7 | L6 Team on light band | Alternating ending |
| 8 | L5 CTA band + compact footer | One loud ask |
| 9 | L8 case studies page | Both pages on one grid |
| — | Copy pass | Section 6 |

Steps 1–3 are what is visibly wrong today; the rest is polish on a page that
finally lines up.

### How each step is checked

One new script, `scripts/verify-layout.mjs` (Playwright, same style as
`verify-motion.mjs`). It checks only what is supposed to be true:

- **Grid:** at 1440 and 390, the left edge of every section heading equals the
  logo's left edge, for every section that uses `.ts-container` and is not
  centred by rule (ProofStrip, FAQ). The WorkRail's right-edge bleed is not
  checked.
- **Rhythm:** sections with `.ts-section` share one computed `padding-block`.
  Sections marked `data-layout="free"` are skipped.
- **Nav:** at `scrollY = 0` no pill link has `aria-current`; past the hero the
  capsule is visible; an element in the gap between logo and pill is still the
  `elementFromPoint` target.
- **Mobile hero:** at 375×667, 390×844 and 430×932 the primary CTA's bottom
  edge is inside the viewport at `scrollY = 0`.

Also: existing `scripts/verify-motion.mjs` and `scripts/verify-scroll-scenes.mjs`
still pass; `pnpm run build` passes including the performance budget (needs
`VITE_SITE_URL` / `SITE_URL` exported); before/after screenshots at both widths
for every step.

## 6. Notes for the copy pass

Spotted during the study; not addressed here.

- Hero headline runs to four lines on desktop ("Always Be / Ahead / AI Built
  Just / For You"). Both references say what they do in two.
- Headings mix Title Case ("Automate Roles, Not Just Tasks") and sentence case
  ("Work that used to queue, now closing itself."). Pick one.
- ProofStrip shows generic labels ("INTERNAL TEAM", "INDEPENDENT BARBER") where
  both references show client logos. Real logos, or a different kind of proof.
- Generic headings: "We Are Ready To Provide Solutions", "Got Any Questions?",
  "What Sets Us Apart".
- Hero paragraph talks about our process; both references talk about the
  client's outcome.
- A lede for each section, which unlocks the two-column header deferred in L3.
- Why Us step visuals, if 4b was cut.
- Nav labels (N2) and the CTA band headline (L5) get their final wording here.
