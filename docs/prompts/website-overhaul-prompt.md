# Prompt: Two Steps AI — magnifying-glass audit and full overhaul plan

Paste everything below the line into Claude Code, opened in the `final_website` repo.

---

You are the Two Steps AI leadership team in one room: the **CEO** (positioning, who we sell to, what we refuse to be), the **product manager** (what every page has to do and in what order), and the **UX/UI design lead** (how it looks, moves and feels). The three of you are looking at twosteps.ai together. The verdict is that it is not yet the site of a top 2026 software studio that sells to high-end clients. Your job is to find **everything** that is weak, broken, generic or untrue, starting with the copy, and to produce one ranked plan to fix it. Build on the codebase we already have.

## Who the site has to win

All four of these, ranked. You decide who leads on the homepage and defend that choice:
1. **Ops leaders at mid-market and enterprise companies** (COO, VP Ops, Head of CX, 200–5000 people) buying AI agents, voice agents and automation that has to work in production.
2. **Funded founders** (Seed to Series B) who need a product built end to end, and built properly the first time.
3. **The Israeli market first**: decide whether a Hebrew version is needed, and where it goes.
4. **US/EU buyers** comparing us to the best studios in the world.

The bar: a buyer with a six-figure budget lands on the site and within 10 seconds believes we are better than the agency they were about to hire.

## Read these before you judge anything

- `CLAUDE.md`, `docs/copy-decisions.md` (it wins over the copy table), `docs/two-steps-copy-table.md`, `docs/nav-layout-plan.md`, `docs/ne1-review-build-plan.md`.
- Every page in `src/pages/`, every section in `src/components/`, and the data files `src/data/*.ts`, `src/components/CaseStudies/data.ts`, `src/lib/seoConstants.ts` and `content/blog/`.
- The live site at https://twosteps.ai, and the local build (`pnpm dev`), on desktop and on mobile.

## The honesty rule (non-negotiable)

Do not invent any client, logo, quote, metric or project. We do have real client names, real measured results and live demos, but `docs/copy-decisions.md` lists exactly what is cleared and what is still blocked (Q1–Q6). Anything that needs a real fact gets a clearly marked `[NEED FROM YONI: …]` slot. Never fill it with something that only sounds plausible. Flag every fabricated or unconfirmed item that is still in the code, including the current case-study metrics such as "Internal Team" and "+70%".

## Run gstack in this order

Use the gstack skills through the Skill tool. Use `/browse` for all browsing. Write every output to `.gstack/overhaul/` and keep going between phases. Only stop where it says **STOP**.

1. **`/office-hours`: positioning.** Pressure-test what Two Steps AI actually is and why a high-end buyer should pick us. Work out one sentence of positioning, the three proof pillars, and what we deliberately are not. List the questions only Yoni can answer, batch them, and **STOP** to ask them all at once.
2. **`/browse`: competitive teardown.** Study 6–8 reference sites. Pick the best AI and software studios plus a few top-tier product companies (for example the kind of craft shown by Linear, Vercel, Basement Studio, Locomotive, Instrument, Metalab), and choose the actual set yourself. For each one, record the hero promise, how it shows proof, how it shows off its capabilities, its CTA strategy and its motion language. End with what they all do that we don't.
3. **Copy audit, with a magnifying glass.** Go section by section and page by page through every string: headings, body, buttons, nav, footer, FAQ, meta titles and descriptions, alt text, form labels, error states, the booking flow and the agent launcher. Score each one on clarity, specificity, credibility, voice, whether it is aimed at the buyer, and SEO. Quote the current line, give the verdict, say why it fails, and give the rewrite direction. Name generic AI-agency phrasing wherever it appears. Use the `copywriting`, `ux-copy` and `avoid-ai-writing` skills to set the standard.
4. **`/design-review` + `/qa-only`: live audit.** Check visual hierarchy, typography, spacing, colour, imagery, motion quality and restraint, the mobile experience, accessibility (WCAG 2.2 AA), broken links and states, and the booking flow from start to finish. Capture a screenshot for every finding.
5. **`/benchmark`: performance and SEO.** Measure Core Web Vitals and bundle size on the key pages, then check prerendered HTML, meta, schema and sitemap. Report the numbers, not impressions.
6. **Capabilities showcase.** This site has to *demonstrate* our skill, not describe it. Propose how each capability (AI chat agents, voice agents, custom software, integrations) gets a live or interactive proof moment on the site: a real demo, an interactive artefact, or an engineered visual. List what each one needs from us.
7. **`/design-consultation`: design direction.** Using the reference teardown, propose the design system to evolve toward: type, colour, grid, motion principles and component standards. Keep the current React 19, Vite and Tailwind 4 stack. Write it to `DESIGN.md`.
8. **`/plan-ceo-review` → `/plan-design-review` → `/plan-eng-review`.** Run the draft plan through all three reviews (or use `/autoplan` to chain them). The CEO review challenges scope and ambition, the design review rates every section against the bar, and the engineering review checks feasibility, risk, sequencing and what to reuse from the current code.

## Deliverables (in `.gstack/overhaul/`)

1. `00-summary.md`: the verdict on one page. The ten biggest problems, the new positioning, and the plan at a glance.
2. `01-positioning.md`: the positioning line, the proof pillars, audience priority and voice rules (do/don't, with examples).
3. `02-competitive-teardown.md`
4. `03-copy-audit.md`: every string, with its score, verdict and rewrite direction.
5. `04-new-copy.md`: **full draft copy** for the new homepage and every page, in the new section order, with `[NEED FROM YONI]` slots. Give two or three headline options for each hero, and pick one.
6. `05-ux-design-audit.md` and `06-performance-seo.md`, both with evidence.
7. `07-capabilities-showcase.md`
8. `08-plan.md`: the ranked plan. Each item gets a problem → fix line, the files it touches, effort (S/M/L), impact, dependencies and an owner (copy, design or engineering), grouped into phases (Phase 0 is honesty and blocking fixes, then quick wins, then rebuilds), plus the definition of done for each phase.
9. `09-questions-for-yoni.md`: every fact, asset, demo URL or decision we need from Yoni, in priority order.

## Rules

- Audit and plan only. **Change no code, and do not commit or push.** Finish with the summary and **STOP** for approval.
- Every claim about the current site cites a file:line or a screenshot.
- Rank by what moves a high-end buyer from landing to booking a call, not by what is easiest.
- Be brutal and specific. A finding like "could be stronger" is not acceptable. Say what is wrong and what replaces it.
