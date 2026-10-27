# Hyperframes Composition Brief: Two Steps AI

## Objective
Create a short launch-style brag video for the new Two Steps AI website.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 21 seconds

## Source Material
- Project root: `/home/yoni/projects/github/final_website`
- Primary files read: `index.html`, `src/index.css`, `tailwind.config.js`, `src/components/Hero.tsx`, `src/components/ui/AINetworkVisualization.tsx`, `src/components/ProofStrip.tsx`, `src/components/Services.tsx`, `src/components/AgentLauncher.tsx`, `src/components/CaseStudies/data.ts`, `src/components/Logo/Logo.tsx`
- Product name: Two Steps AI
- Tagline / strongest claim: "Always Be Ahead — AI Built Just For You"
- Key UI or visual moment to recreate: the hero AI network diagram (glass hub with the Two Steps mark, 6 connection lines with travelling pulses, 6 node cards)
- Copy that must appear verbatim:
  - Always Be *Ahead* / AI Built Just For You
  - you bring the vision, we bring it to life
  - Automate Roles, Not Just Tasks
  - AI Chat Agents · AI Voice Agents · CRM Development · Custom SaaS
  - Node cards: LLM Engine/Reasoning, Vector Store/Knowledge, Realtime API/Automation, Security/Privacy, Analytics/Insights, Connectors/Integrations
  - Book a Call · Talk to our AI now · twosteps.ai
- Numbers: only from `CaseStudies/data.ts` (80% bookings automated; +20% conversion; −30% delivery times). Do NOT use the WorkRail cards (MERIDIAN, NORTHBANK…) or testimonial names — those are design placeholders.

## Creative Direction
- Tone preset: polished
- Creative direction: monochrome product film with visible choreography — restraint in palette, not in motion
- Interpretation: 5 scenes with readable holds; every entrance is a real, legible move.
- Angle: the site's own signature moves carry the video — light display type with one serif-italic word, the network assembling itself, the dark→light band flip, real numbers counting up.
- Hook: "Always Be *Ahead*" word-stagger on black.
- Outro / punchline: wordmark, "Always Be *Ahead*", cursor presses "Book a Call", twosteps.ai.
- Avoid: generic SaaS language, abstract filler visuals, colour that isn't in the site (it is monochrome; only the green online dot).

## Visual Identity
- Background: `#0a0a0c`; light band `#fafafa` / border `#e6e6e6` / text `#0a0a0a` / muted `#6b6b6b`, `#8a8a8a`
- Text: `#f5f6f8`; muted `#8a8f98`
- Accent: `#f5f6f8` (pill bg, `#0a0a0c` pill text); `#4ade80` online dot
- Glass: `rgba(20,22,27,0.55)`, border `rgba(255,255,255,0.1)`, radius 20/12px
- Display font: Inter Tight 300, −0.021em, line-height 1.06; signature word Instrument Serif italic 400
- Body font: Inter
- Visual references: hero network, ProofStrip bordered grid, ts-pill / ts-glass chips, AgentLauncher pill

## Storyboard
Use `brag-output/brag-plan.md` as the creative contract.
1. Hook — 0.00–3.27 — headline word-stagger
2. The network — 3.27–8.74 — hero recreation, 6 nodes one by one, pulses
3. What we build — 8.74–13.11 — light band flip, 4 service cells
4. Results — 13.11–17.47 — 3 stat cards counting up
5. Outro — 17.47–21.00 — wordmark, tagline, cursor click on Book a Call, launcher

## Audio
- Audio role: steady clean bed, sparse professional accents
- Audio arc: opens calm → brightest on the light band → payoff on stats → fades under the wordmark
- Music: `assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`
- Music treatment: volume 0.45, fade-out baked into the 21s bed (last 1.6s)
- Music cue guidance: bundled preset `…/brag/assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json`. Locks: 8.74, 13.11, 17.47. Beat grid ≈0.545s.
- Audio-reactive treatment: subtle — hub glow / ambient gradient on RMS
- Audio-coupled moments: first+last node (drop), flip (soft impact), stats (light tick), logo (bong), click (mouse click)
- SFX analysis guidance: `…/brag/assets/sfx/sfx-analysis.md`; low HF-risk files only
- Exact SFX choice: Hyperframes decides.
- Audio files: copy into `brag-output/composition/assets/`

## Hyperframes Instructions
Load `hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, `hyperframes-cli`. Do not enter the `hyperframes` entry-point interview. Prefer native Hyperframes conventions. Requirements as per /brag step 3: real UI shown, readable text, 15–25s, audio layer, `hyperframes check` passes before render.
