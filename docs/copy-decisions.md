# Copy Migration — Decisions

**Companion to `docs/two-steps-copy-table.md`.** Read both. Where they disagree, this file wins — it reconciles the spec against the code as it exists on 30 September 2026.

**Corrections below, recorded 30 September 2026, supersede this file wherever they conflict.**

## Corrections

These were confirmed after the implementation plan. They win over the sections further down.

1. **Testimonials come off first, with no gate.** Delete `Testimonials.tsx` and its mount in `Home.tsx` before any other copy work. Do not replace the section. The three quotes name Daniel Roth at EY, Maya Lindqvist at Pizit, and Emily Davis at Northgate Clinics, and the file marks them unconfirmed. Ship that deletion as its own commit.
2. **"Tell us the vision. We will build it."** is at `CaseStudyDetailSections.tsx:417-418`. Both that line and "Your business, two steps ahead." stay.
3. **C1** is 10 component files and 12 strings. Include `AgentLauncher.tsx:9` ("book a call with a human") and update `scripts/verify-layout.mjs:101` and `:104` in the same change.
4. **Method, step two.** Do not use "deliver the solution." Use this verbatim:

   > We design it, build it, integrate it and ship it. The same people who understood the problem deliver it. There is no handover, because there is nobody to hand it to.

5. **Priority 0** blocks only work that touches proof (the rail, the proof strip, case-study proof, and restoring the portfolio). C1 does not wait on it.
6. **H-05** stays out of scope. It is a design task, not copy.
7. **`/api/book-call` stays as it is.** Honeypot plus field validation is enough for now. The missing rate limit is a separate issue, outside this migration.
8. **Naming EY, Bulthaup, Benchmark, and Social Lady is cleared.** Describing their work is not. Case studies for them stay TODO. The meta description, W-02, and the proof-strip wordmarks may use the names. Proof-strip marks are wordmarks in one weight. No grey boxes, no web-sourced logos.
9. **S-05 ships now.** Phyizit and Shift Manager are Two Steps products. Naming them in the capability sentence does not wait on question 2. Whether their case studies return to `/case-studies` is still question 2.
10. **Feature and benefit bullets** on the service pages stay for this migration. Report them. They are the next copy batch.
11. **N3.** The voice demo is a separate deployment, not in this repo. Leave a TODO to link out once the URL is confirmed. No nav or footer entry until then.
12. **Still blocked:** Q1 (are the five rail brands real, and is 41% measured), Q2 (restore Phyizit, Shift Manager, Estate Dashboard, HR Resume Agent to `/case-studies`), Q4 (one sentence each for Bulthaup, Benchmark, Social Lady), Q5 (a measured number from Phyizit or Shift Manager), Q6 (the founder paragraph). Generate nothing for these.

## Release gate

`ne1` must not be pushed until the branch contains no fabricated client, project, figure or quote. `36e0ddc` removed the testimonials. The work rail, the proof strip and the case-study data still carry invented entities. Pushing before that sweep puts them on the remote, and merging puts them on production.

`brag-output/` is not served and is not in the production build. It is a HyperFrames composition. The next render will bake the old "Book a Call" label into the video, so that copy has to be updated before the video is regenerated. Do not change it as part of this migration.

---

## How to treat the copy table

The copy table was written against a 19 September snapshot. The site has moved since, in both directions: some sections are now better than the spec, some are worse, and some no longer exist.

**Treat the copy table as the intent, not as literal find-and-replace.** Its purpose is the positioning shift — from "agency selling chat agents, voice agents, CRMs and SaaS" to "studio building custom systems for companies with a standard to protect" — plus the honesty rule. Where current code already serves that intent better than the spec's wording, keep the current code.

---

## PRIORITY 0 — Fabricated proof must come out

This is a blocking gate. Nothing else ships until it is resolved.

### The problem

| Location | Current content | Issue |
|---|---|---|
| `WorkRail.tsx:15-64` | MERIDIAN · NORTHBANK · ATLAS ONE · KESTREL · VOLTWAY, with figures including "41% shorter handle time" | Client names and performance figures that do not correspond to real Two Steps engagements |
| `ProofStrip.tsx:18-24` | Internal Team · Independent Barber · Leads Manager · Logistics Company · Accounting Firm | Generic category labels presented as client proof |
| `CaseStudies/data.ts` | Five anonymized studies using the same five entities | Same |
| `CaseStudies.tsx:61-72` | H1 "Proof, not promises." | A page making this claim while displaying unverifiable proof |

The real client roster is **EY · Bulthaup · Benchmark · Social Lady**. The real products are **Phyizit · Shift Manager · Estate Dashboard · HR Resume Agent · Voice Agent · Aura Residences**. None of these currently appear in the repo. The projects that were on the site in September were removed and replaced with these entities.

### The instruction

**Before writing any other copy, confirm with Yoni, for each of the five entities and every figure attached to them: is this a real engagement, and is the number measured?**

- **If real and measured** — leave them, and record where each figure comes from in a comment. Everything below still applies to the rest of the site.
- **If placeholder, illustrative, or unmeasured — and this is the expected answer —** every one of them comes out. They are replaced with the real roster. Do not soften them, do not anonymize them further, do not keep the figures with the names removed. A measured number attached to an invented client is still an invented claim.

**Never generate a replacement client, project, figure or percentage.** Where real content is not yet available, the component renders fewer items or a TODO. Three real case studies beat five invented ones by an enormous margin.

---

## The three conflicts, answered

### Conflict 1 — The portfolio in the spec is not in the repo

**Decision: restore the real work. Remove the invented work.**

The spec's "keep these lines" list (Phyizit, Voice Agent, Estate Dashboard, HR Resume Agent, Shift Manager, and the "Supports Hebrew only for now" sentence) describes projects that were on the site in September and have since been deleted. They are real, shipped, and ours. Their removal is a regression.

Restore them at `/case-studies`, using the descriptions in §11 of the copy table. Keep **"Supports Hebrew only for now"** verbatim — a company that admits a limitation unprompted is one buyers believe about everything else.

Client case studies (EY, Bulthaup, Benchmark, Social Lady) are `[NEEDS INPUT]` and stay as TODOs. Do not write them.

Keep the current route (`/case-studies`, `CaseStudyDetail.tsx` at `/case-studies/:slug`). The spec's `src/pages/work/[slug].tsx` was an inference; the existing structure is fine. Keep the eyebrow "Selected work" and, once the proof behind it is real, the H1 "Proof, not promises."

### Conflict 2 — The contact form is now a booking modal

**Decision: the modal stays. F-01 through F-05 are void.**

The broken reCAPTCHA is gone because the form is gone, which resolves the original problem. The modal copy is good and on-brand — better than what the spec proposed:

| Keep as-is | Where |
|---|---|
| "Tell us the vision." | `BookCallModal.tsx:315` |
| "We look at the work together and whether we can help." | `BookCallModal.tsx:315-321` |
| "30 minutes" · "No pitch deck" · "One clear next step" | modal points |
| Name and Email only, no company, no message, no counter | `BookCallModal.tsx:372-395` |

Two changes only:
1. The modal eyebrow "Book a call" → "Start a conversation" (see below).
2. **Flag, don't fix:** with no reCAPTCHA, `/api/book-call` has no bot protection. Report whether any rate limiting or validation exists server-side. Do not add a captcha or change the endpoint without asking.

### Conflict 3 — Sections rewritten, but not to spec

**Decision: keep what is already better. The list is explicit below.**

---

## KEEP — already better than the spec

Do not touch these.

| Copy | Location |
|---|---|
| "Your business, two steps ahead." | `CtaBand.tsx:21` |
| "Tell us the vision. We will build it." | `CaseStudyDetailSections.tsx:417-418` |
| Service page labels: "What it is." · "What you get." · "What it changes" · "Who it is for." | `ServiceDetail.tsx:88-111` |
| The single `ServiceDetail` page reading from `services.ts` | — |
| Eyebrow "Selected work" | `CaseStudies.tsx:61` |
| Why Us living on `/about` with a short version on home | `WhyUs.tsx` · `AboutTeaser.tsx` |
| Team on `/about#team` | `Team.tsx:58` |
| The `#process` → `/services#process` redirect pattern | — |

The spec proposed replacing the service-page labels and the free-consultation line. Both were already done, and better. Good.

---

## CHANGE — the positioning work

### C1 · "Book a Call" → "Start a conversation"

Every instance. 10 component files, 12 strings:
`Hero.tsx:85` · `NavbarDesktopNav.tsx:96` · `NavbarMobileMenu.tsx:100` · `FooterSections.tsx:74`, `:77` · `CtaBand.tsx:27` · `ServiceDetail.tsx:64` · `CaseStudyDetailSections.tsx:430` · `AgentLauncher.tsx:111` and `:9` ("book a call with a human") · `FAQ.tsx:16` ("Book a call") · `BookCallModal.tsx:315` (eyebrow). Also `scripts/verify-layout.mjs:101` and `:104`.

Component names (`BookCallModal`, `/api/book-call`) stay. This is user-facing copy only.

### C2 · Retire "Always Be Ahead"

Three places: `Hero.tsx:67-68` · `FooterSections.tsx:44` · `index.html:47` (JSON-LD `slogan`).

Footer tagline becomes **"Two Steps — AI systems, built to a standard."** JSON-LD slogan takes the same line.

### C3 · Hero

| Block | Old | New |
|---|---|---|
| H-02 | `AI Built Just For You` (`Hero.tsx:69`) | `AI systems, built to a standard.` |
| H-03 | The "you bring the vision / seamless automation" paragraph (`Hero.tsx:74-75`) | `We build custom AI that does real work — finished to the level your brand requires.` |
| H-04 | Secondary button "Our Work" (`Hero.tsx:95`) | Keep "Our Work" — it matches the nav. Spec's "See the work" is not an improvement. |

The same seamless-automation sentence also appears at `FooterSections.tsx:47` and `About.tsx:29`. Remove both; do not replace with the hero line (it shouldn't appear three times).

### C4 · Footer "Solutions" block

`FooterSections.tsx:138` · `footerData.ts:44-48`

Heading "Solutions" → "Work". Links become: Our Work · Services · Demos *(only if a demos route is built — see N3)*.

### C5 · Meta and structured data

`index.html:46` · `Head.tsx:38-39` → `Two Steps is an AI studio building custom systems for companies with a standard to protect. Delivered for EY and Bulthaup.`

`index.html:70-73` carries the four service descriptions in JSON-LD. These must be updated in step with `services.ts` — they are currently a second copy of the commodity framing.

### C6 · The four service cards → three capability blocks

`Services.tsx:14-15` · `services.ts:21-60` · `BentoGrid`

- Eyebrow "Our services" / H2 "Automate Roles, Not Just Tasks" → H2 **"What we build"**
- The four cards (S-02a–d) are retired from the home page
- Replaced by the three capability blocks S-03, S-04, S-05 in the copy table

"Automate Roles, Not Just Tasks" moves into S-03's body, where proof sits beside it. It is the best line on the site and should not simply disappear.

**Note the dependency:** `services.ts` feeds both the home cards and the `ServiceDetail` pages. Separate the two concerns — home renders capabilities, `/services/:slug` keeps the four detail pages.

### C7 · Service detail pages

`services.ts:21-60`. Apply D-01 to D-04 from the copy table: new headlines and bodies, keeping the searchable term in `<title>` (the current "AI Chat Agents - Two Steps AI" pattern is fine).

Two adjustments:
- **D-04 (Custom SaaS)** — the spec says this page has no body. It has one now, at `services.ts:60`. Replace it with the spec's Phyizit/Shift Manager paragraph, which is stronger.
- **D-02 (Voice)** — the existing "who it's for" line is different from both the spec's old and new copy. Report it before replacing.

### C8 · The six "What Sets Us Apart" cards

`whyUs.ts:7-44` · `WhyUs.tsx:170` · `AboutTeaser.tsx:16`

All six retire. Two break the honesty rule outright: *"zero downtime and immediate results"* is not provable, and *"Intelligence You Can Trust"* asks for trust rather than earning it.

Replaced by the studio teaser (W-02) on home, with the fuller studio content on `/about`.

### C9 · FAQ

`FAQ.tsx:12-58` — still the old agency Q&A, including "Book a call" and "free consultation." Audit every answer against the banned-word list and the honesty rule. Report what needs rewriting before changing it; do not rewrite answers wholesale without review.

"Free consultation" must go regardless — it gives away what Step One is meant to charge for.

### C10 · Process → the two-step method

`Process.tsx:12-34`, mounted at `Services.tsx:74`

The current five steps (Discovery Call, Tailored Solution Design, Development & Integration, plus two) are generic agency process and contain a banned word. Replace with the two-step method in §5 of the copy table, using the corrected Build paragraph in the Corrections section above. Do not write "deliver the solution."

This is what makes the company name mean something. Right now "Two Steps" is a label with a five-step process behind it.

---

## NEW

| # | What | Notes |
|---|---|---|
| N1 | Studio content | Fold into the existing `/about` rather than a new `/studio` route. Add the founder paragraph (T-01, needs Yoni's approval) and the "What we won't do" block. |
| N2 | ProofStrip → real clients | `ProofStrip.tsx:18-24`. EY · Bulthaup · Benchmark · Social Lady, as wordmarks in a single weight. Naming is cleared. Describing the work is not. No grey boxes, no logos from the web. Still gated on Priority 0 (the fabricated names have to be gone first). |
| N3 | Demos | The voice demo is not in this repo. Leave a TODO to link out once the URL is confirmed. No nav or footer entry until then. Do not build a placeholder. |

---

## Naming rules — non-negotiable

- The retail client behind the EY engagement is **never named**. The only permitted phrasing is *"a global retail brand, delivered with EY."*
- Client names appear only where written permission is confirmed. Until Yoni confirms, treat the proof strip and any named case study as blocked.
- No number, percentage, count or outcome figure appears in user-facing copy unless it is measured and sourced.

---

## Banned words

`solution` · `solutions` · `leverage` · `empower` · `unlock` · `seamless` · `seamlessly` · `cutting-edge` · `state-of-the-art` · `revolutionary` · `game-changing` · `robust` · `best-in-class` · `world-class` · `tailored` · `transform your business` · `chatbot` · `next-level` · `supercharge` · `free consultation`

Grep `src/` and `index.html` at the end. Distinguish code identifiers from user-facing copy; only the latter must be clean.

---

## Order of work

| # | Task | Gate |
|---|---|---|
| 0 | Resolve Priority 0 — the fabricated proof | **Blocks only work that touches proof** |
| 1 | C1 — "Book a Call" → "Start a conversation" | Safe, mechanical, do it first |
| 2 | C2, C3 — hero and "Always Be Ahead" | |
| 3 | C6 — service cards → capability blocks | |
| 4 | C8 — retire the six Why Us cards, add W-02 | |
| 5 | C10 — the two-step method | |
| 6 | C4, C5 — footer, meta, JSON-LD | |
| 7 | C7 — service detail pages | |
| 8 | C9 — FAQ | Report before rewriting |
| 9 | Restore the real portfolio (Conflict 1) | |
| 10 | N1, N2, N3 | N2 gated on permissions |

---

## Blocked — do not proceed without answers

| # | Question for Yoni |
|---|---|
| 1 | Are MERIDIAN, NORTHBANK, ATLAS ONE, KESTREL and VOLTWAY real clients, and is "41% shorter handle time" measured? |
| 2 | Why were Phyizit, Shift Manager, Estate Dashboard and the HR Resume Agent removed from the site? Restore, or was there a reason? |
| 3 | Written confirmation of what EY, Bulthaup, Benchmark and Social Lady each permit publicly — logo only, or logo plus described project? |
| 4 | One sentence each on Bulthaup, Benchmark and Social Lady: what was built, for whom. |
| 5 | Any measured number from Phyizit or Shift Manager. |
| 6 | Approve or rewrite the founder paragraph (T-01). |
| 7 | Is the live voice agent demo in this repo? |

Leave TODOs for all of these. Do not fill any of them with generated content.
