# Two Steps — Copy Replacement Table
**Repo:** `\\wsl.localhost\Ubuntu\home\yoni\projects\github\final_website`
**Source snapshot:** site copy as of 19 September 2026
**Generated:** 29 September 2026

---

## Read this first

**The location column is a search string, not a file path.** I could not read the repo from here (it sits in WSL; only `Developer`, `Documents` and `Desktop` on the Windows side are reachable, and `\\wsl.localhost\` paths are blocked). The exact current string is what finds the right file every time:

```bash
cd ~/projects/github/final_website
grep -rn "Automate Roles, Not Just Tasks" src/
```

The file path beside each search string is inferred from the site's section structure. Confirm it; don't trust it.

**If you've edited copy since 19 September,** some "Old" cells below will no longer match. Treat a failed `grep` as "already changed" and check the block against the rules in §1 before moving on.

**To get exact paths in a future version,** copy the repo somewhere I can read:
```bash
rsync -a --exclude node_modules --exclude .git --exclude dist \
  ~/projects/github/final_website /mnt/c/Users/yonii/Developer/
```

---

## §1 — The rules, in short

| Rule | Test |
|---|---|
| No claim without proof | What makes this true? If "it sounds good," cut it. |
| Premium, calm, exact | Second person, present tense, one idea per sentence, under 20 words. |
| Headlines under 10 words | Section headers under 15. |
| Nothing generic | If a competitor could run the line unchanged, cut it. |
| Read it aloud | Would you say this to Craig at EY? |

**Banned:** solution(s) · leverage · empower · unlock · seamless(ly) · cutting-edge · state-of-the-art · revolutionary · game-changing · robust · best-in-class · world-class · tailored · transform your business · chatbot · next-level · supercharge · any unmeasured number

**Naming:** the EY retail client is *"a global retail brand, delivered with EY"* — never named. Clients: EY · Bulthaup · Benchmark · Social Lady.

---

## §2 — GLOBAL

| # | Old copy | New copy | Location |
|---|---|---|---|
| G-01 | `Home · Services · Why Us · Process · Team · Q&A · Demo Sites` | `Work · Studio · Demos · Contact` | grep `#why-us` → `src/components/Navbar.tsx` |
| G-02 | `Book a Call` | `Start a conversation` | grep `Book a Call` → Navbar, Hero, CTA — **replace all instances** |
| G-03 | `Solutions` (footer heading) + `AI Voice Agents / AI Chat Agents / CRM Development / Custom SaaS` | `Work` + `Client work / Our products / Demos` | grep `Solutions` → `src/components/Footer.tsx` |
| G-04 | *(none)* | `Two Steps — AI systems, built to a standard.` | `src/components/Footer.tsx` |
| G-05 | *(check current)* | `Two Steps is an AI studio building custom systems for companies with a standard to protect. Delivered for EY and Bulthaup.` | `index.html` meta description |

---

## §3 — HOME: HERO

**Location:** grep `AI Built Just For You` → `src/components/Hero.tsx`

| # | Old copy | New copy |
|---|---|---|
| H-01 | `Always Be Ahead` | *(delete — appears twice, here and in the mid-page CTA)* |
| H-02 | `AI Built Just For You` | `AI systems, built to a standard.` |
| H-03 | `At Two Steps, our process is simple: You Bring The Vision, we bring it to life. We craft custom AI solutions, turning complex challenges into seamless automation.` | `We build custom AI that does real work — finished to the level your brand requires.` |
| H-04 | `Book a Call` · `Demo Sites` | `Start a conversation` · `See the work` |

**Why H-02:** "Built just for you" describes a delivery model every agency claims. "Built to a standard" carries the premium position and can't be copied without proof.

**H-05 — hero visual (not copy, but it outranks everything above).** The site claims premium craft; words can't prove craft. Put the Aura Residences render, the live Voice Agent visualiser, or a Phyizit interface in motion behind the hero.

---

## §4 — HOME: PROOF BAR *(new section)*

**Location:** new component `src/components/ProofBar.tsx`, placed immediately below the hero
**Old:** nothing — the current site has no proof above the fold at all

**New**
```
Selected clients

EY        Bulthaup        Benchmark        Social Lady
```

**Why:** highest impact per hour of work on this entire list. Four real enterprise and premium-brand names, seen within two seconds, reframe everything read afterwards. Logos if you have permission and clean assets; wordmarks in a single weight if not. Never grey placeholder shapes.

---

## §5 — HOME: THE METHOD *(new section)*

**Location:** new component `src/components/Method.tsx` — replaces whatever sits at `#process`

**New**
```
Two steps.

Complex work, delivered simply.

ONE — Understand
Before we talk about budget or timelines, we work out what's actually being
built. We sit with the people who'll use it, look at the systems already in
place, and write the blueprint: what it does, what it touches, what it takes.
You own that document whether or not we build it.

TWO — Build
We design it, build it, integrate it and ship it. The same people who
understood the problem deliver it. There is no handover, because
there is nobody to hand it to.
```

**Why:** right now "Two Steps" is a label with nothing behind it. This makes it the method — and gives enterprise buyers a low-risk way to start instead of a six-figure leap.

---

## §6 — HOME: SERVICES → WHAT WE BUILD

**Location:** grep `Automate Roles, Not Just Tasks` → `src/components/Services.tsx` · `src/data/services.ts`

### Section header

| # | Old copy | New copy |
|---|---|---|
| S-01 | `OUR SERVICES` / `Automate Roles, Not Just Tasks` | `What we build` |

*"Automate Roles, Not Just Tasks" is the best line on the current site. It doesn't disappear — it moves into S-03, where proof sits beside it.*

### The four cards — DELETE ALL FOUR

| # | Old copy | Action |
|---|---|---|
| S-02a | `AI Chat Agents` — `Transform how you engage with customers and streamline operations using smart AI Chat Agents built just for you.` | Retire |
| S-02b | `AI Voice Agents` — `Enhance customer experiences with conversational AI Voice Agents that handle calls like a pro.` | Retire |
| S-02c | `CRM Development` `[Popular]` — `Say goodbye to generic CRMs — let us build one perfectly designed for your needs.` | Retire |
| S-02d | `Custom SaaS Solutions` — `Bring your vision to life with custom-built software, tailored precisely to your needs.` | Retire |

**Why this is the most important change on the list:** these four names price you at $5K. A buyer reading "AI Chat Agents" expects chatbot pricing; your deals run $35K–$150K+. Also delete the `Popular` badge on the CRM card — that's a SaaS pricing-table device and it reads cheap on a studio site.

### Replace with three capability blocks

| # | New copy | Proof shown alongside |
|---|---|---|
| S-03 | **AI systems that hold a role**<br>We automate roles, not just tasks. Agents that own a process end to end — intake, decision, action — instead of assisting somebody who still does the work. | EY workforce agent · HR Resume Agent · the four Voice Agent personas |
| S-04 | **Interfaces people want to use**<br>Dashboards, tools and platforms designed to the standard of the brand they belong to. | Bulthaup · Aura Residences · Phyizit |
| S-05 | **Products from nothing**<br>Phyizit and Shift Manager started as blank files. We can take your idea the same distance. | Phyizit · Shift Manager |

---

## §7 — HOME: WHY US → THE STUDIO

**Location:** grep `What Sets Us Apart` → `src/components/WhyUs.tsx` · `src/data/whyUs.ts`

### Delete all six cards

| # | Old copy |
|---|---|
| W-01a | `Built for Your Business` — `Our AI solutions are custom-built to fit your goals, industry, and challenges—because your business deserves more than one-size-fits-all.` |
| W-01b | `Effortless Integration` — `Seamlessly connect our AI solutions with your existing tools and workflows, ensuring zero downtime and immediate results.` |
| W-01c | `Intelligence You Can Trust` — `Our AI agents are designed with precision, delivering reliable, consistent results that you can count on.` |
| W-01d | `Evolving with Your Needs` — `Our solutions grow with you, adapting to your business's evolution so you're always ready for what's next.` |
| W-01e | `Security at the Core` — `Every AI solution we build is designed with advanced data protection, keeping your operations secure at every step.` |
| W-01f | `Expertise You Can Rely On` — `Our team of specialists works closely with you, from concept to delivery, to ensure your AI vision becomes a reality.` |

**Why:** six claims, zero proof — every one could appear unchanged on a competitor's site. Two break the honesty rule outright: *"zero downtime and immediate results"* isn't provable, and *"Intelligence You Can Trust"* asks for trust instead of earning it. "Solutions" appears four times across the six.

### Replace with

| # | New copy | Location |
|---|---|---|
| W-02 | **A small studio in Tel Aviv, working worldwide.**<br>You work with the people who build it. That's the whole model, and it's why EY and Bulthaup called.<br>→ *About the studio* | new `src/components/StudioTeaser.tsx` |

---

## §8 — HOME: SELECTED WORK *(new section)*

**Location:** new component `src/components/SelectedWork.tsx`
**Old:** nothing — the current home page never mentions the portfolio

**New**
```
Selected work

Workforce intelligence for a global retail brand
Delivered with EY. A system that does an analyst's job.                    →

[Bulthaup — NEEDS INPUT: title and one line]                               →

Movement assessment without the equipment
Phyizit. Our own product, built from scratch.                              →

                                                          See all work →
```

**Why:** titles lead with what changed, client second. Three cards maximum here; the full set lives on `/work`.

---

## §9 — HOME: CLOSING CTA

**Location:** grep `We craft custom AI solutions, turning complex challenges` → `src/components/CTA.tsx`

| # | Old copy | New copy |
|---|---|---|
| C-01 | `Always Be Ahead`<br>`We craft custom AI solutions, turning complex challenges into seamless automation`<br>`[Book a Call]` | `Tell us what you're trying to build.`<br>`We'll tell you honestly whether we're the right people for it.`<br>`[ Start a conversation ]` |

**Why:** the old block repeats the hero verbatim and carries two banned words. The new one offers honesty rather than a sales call.

---

## §10 — SERVICE PAGES

**Don't delete these four pages** — they carry search traffic and give partners something to send. Reframe instead: the headline carries positioning, the searchable term stays in `<title>`, H2 and meta.

**Pattern across all four:**

| Old label | New label |
|---|---|
| `What's Included` | `What it does` |
| `Key Benefits` | `What changes` |
| `Ideal Solution For` | `Who it's for` *(and drop the quote marks — quoting yourself reads as a testimonial you wrote)* |
| `Consult an Expert` | `Start a conversation` |
| `No commitment required • Free 30-min consultation` | *(delete)* |

*Why delete the free consultation line: it gives away the thing Step One is meant to charge for, and it's the last urgency device on the site.*

---

### D-01 · Chat Agents
**Location:** `src/pages/services/ChatAgents.tsx` · page title stays `AI Chat Agents · Two Steps`

| | |
|---|---|
| **Old headline** | `AI Chat Agents` |
| **New headline** | `Conversational systems that hold a role` |

**Old body**
```
Our conversational AI agents deliver personalized, 24/7 support across multiple
platforms, integrating seamlessly with your existing workflows to automate
routine tasks while maintaining human-like interactions. From customer service
to internal team communication, our chat agents understand context, learn from
interactions, and continuously improve to provide exceptional experiences.
```
**New body**
```
An agent that owns a conversation end to end — understands what's being asked,
decides what to do, and does it. It reads your systems, takes the action, and
hands off to a person when a person is genuinely needed.

Built into the tools your team already uses, in the voice your brand already has.
```

**Old "Ideal Solution For"**
```
"Businesses aiming to automate customer service, streamline operations, and
ensure personalized interactions with clients and team members."
```
**New "Who it's for"**
```
Companies where the same questions are answered by hand every day, and where
the answer has to sound like it came from them.
```

---

### D-02 · Voice Agents
**Location:** `src/pages/services/VoiceAgents.tsx` · page title stays `AI Voice Agents · Two Steps`

| | |
|---|---|
| **Old headline** | `AI Voice Agents` |
| **New headline** | `Voice systems that do the job, not the demo` |

**Old body**
```
Deploy intelligent voice assistants that understand natural language, support
multiple languages, and execute tasks in real-time—perfect for customer support,
sales, and appointment scheduling. Our voice agents can handle inbound calls,
make outbound calls, integrate with your phone systems, and perform complex
tasks like lead qualification, appointment booking, and information retrieval—all
while sounding natural and professional.
```
**New body**
```
We build voice agents around a role rather than a script: inbound discovery,
customer success, win-back, the operator who never misses a call. Each one
knows what it's for, what it's allowed to do, and when to pass the call to
a person.

Ours is live on this site. Talk to it before you talk to us.
```

**New "Who it's for"**
```
Companies losing work to calls nobody picks up, and companies who won't put
a robot in front of a customer unless it's good enough.
```

*That last line is the differentiator on this page, and the live demo link is the strongest CTA anywhere on the site.*

---

### D-03 · CRM
**Location:** `src/pages/services/CRM.tsx` · page title stays `Custom CRM Development · Two Steps`

| | |
|---|---|
| **Old headline** | `CRM Development` |
| **New headline** | `The system your business actually runs on` |

**Old body**
```
We create fully customizable CRM platforms with built-in automation, seamless
integration with your existing tools, and scalable solutions that grow with your
business. Whether you need to manage customer relationships, track sales
pipelines, automate marketing campaigns, or centralize your business data, we
build CRMs that fit your unique processes—not the other way around.
```
**New body**
```
Most companies bend their process to fit the software. We build the software
around the process — the pipeline as you actually run it, the fields you
actually use, the reports you actually read.

It connects to what you already have. Nobody has to change how they work to
use it.
```

**New "Who it's for"**
```
Teams who've outgrown the off-the-shelf tool and are tired of the workarounds
holding it together.
```

---

### D-04 · Custom SaaS
**Location:** `src/pages/services/CustomSaaS.tsx` · page title stays `Custom Software Development · Two Steps`

| | |
|---|---|
| **Old headline** | `Custom SaaS Solutions` |
| **New headline** | `Products, built from nothing` |

**⚠️ This page has no description paragraph at all** — it jumps from the headline straight to "What's Included." The other three have one.

**New body**
```
Phyizit and Shift Manager started as blank files. We designed them, built them,
shipped them and still run them.

That's the same work we do for clients: an idea taken from nothing to a product
people use, with one team owning every step.
```

**New "Who it's for"**
```
Founders and companies building something that doesn't exist yet, who want it
done properly the first time.
```

---

## §11 — PORTFOLIO → WORK

**Location:** `src/pages/Portfolio.tsx` · `src/components/ProjectCard.tsx` · `src/data/projects.ts`

| # | Old copy | New copy |
|---|---|---|
| R-01 | `Our Portfolio`<br>`Discover our latest projects showcasing innovative AI solutions and full-stack applications designed to solve real-world challenges.` | `Selected work`<br>`Client projects and our own products. A few engagements aren't shown — some clients prefer it that way.` |
| R-02 | `All Categories · AI web application · Agents`<br>`All (5) · AI web application (3) · Agents (2)`<br>`5 projects found` | `Client work · Our products` |
| R-03 | Tech-stack chips on cards: `Turborepo` `NextJS` `Flask` `+2 more` `+8 more` | Move to the bottom of the individual case study page, small and quiet. Never a card headline. |
| R-04 | Trailing `\\` artifacts in the markup | Clean out |

**Why R-02:** "5 projects found" advertises a small number and reads like a search results page. Technical categories are how you organize work internally, not how a buyer thinks.

**Why R-01's second line:** it implies a deeper bench without claiming a number — and it's true.

### Project descriptions — KEEP these, they're good

| Project | Line | Change |
|---|---|---|
| Phyizit | `Phyizit offers reliable, objective tests to assess range of movement, endurance, strength and power without the need for expensive equipment.` | none |
| Voice Agent | `Give your customers a real person to talk to — 24/7, without hiring one.` | fix `--` → `—` |
| Estate Dashboard | `Your all-in-one real estate command center for managing properties, tracking deals, and making data-driven decisions.` | none |
| HR Resume Agent | `Upload resumes and instantly find the right candidates using AI-powered natural language search. Skip the manual screening — just ask, discover, and hire smarter.` | fix `--` → `—` |
| Shift Manager | `A smarter way to close your restaurant shift — accurate tip distribution, transparent records, and reports your team can trust. Supports Hebrew only for now.` | fix `--` → `—`, **keep the Hebrew line exactly** |

*"Supports Hebrew only for now" is the most trustworthy sentence on your entire site. A company that admits a limitation unprompted is one you believe about everything else.*

### Case study template — R-05

**Location:** new `src/pages/work/[slug].tsx`

```
[Outcome-led title]
[Client name, or anonymized descriptor]

The situation      — two to three sentences. What was hard before.
What we built      — three to four sentences. Concrete. Named systems, real integrations.
What changed       — only what is true and measured. No invented percentages.
Stack              — small, bottom of page.
```

| # | Client | Status |
|---|---|---|
| 1 | EY | Have the shape: six stages, 2.5–3 months, workforce intelligence for a retail client. Needs the situation and what changed. |
| 2 | Bulthaup | `[NEEDS INPUT]` |
| 3 | Benchmark | `[NEEDS INPUT]` |
| 4 | Social Lady | `[NEEDS INPUT]` |

---

## §12 — CONTACT

**Location:** `src/components/ContactForm.tsx` · `.env`

| # | Old copy | New copy |
|---|---|---|
| F-01 | `Security Verification` / `Invalid site key.` / `ERROR for site owner: Invalid site key` | **FIX FIRST.** Submissions may be failing. Verify the reCAPTCHA key is registered for the production domain and present in the deployed environment, then submit a real test and confirm it arrives. |
| F-02 | `Get In Touch`<br>`Have a project in mind? Let's discuss how we can bring your ideas to life with cutting-edge AI solutions.` | `Start a conversation`<br>`Tell us what you're trying to build. Include what's hard about it now, and anything you've already tried.`<br>`We read everything and reply within two business days.` |
| F-03 | `Category of Interest — Select a category (optional)` + the three paragraphs explaining Agents / AI web application / web extension | *(delete the whole field)* |
| F-04 | `Full Name · Email · Company · Category of Interest · Message (0/2000) · Security Verification` | `Name · Email · Company · What are you building?` — drop the character counter |
| F-05 | `We typically respond within 24 hours. For urgent inquiries, you can also reach out directly.` | *(delete — F-02 already states the reply time)* |

**Why F-03:** three paragraphs of explanation inside a form field, asking the visitor to categorize themselves before they've said what they want. That's Step One's job. "web extension" isn't a service you lead with anywhere else.

**Why F-05:** don't promise 24 hours unless it's always true. And "urgent inquiries" imports urgency the brand doesn't use.

---

## §13 — SECTIONS I HAVEN'T SEEN

These are in the nav but weren't in the copy you sent. Check what's there before acting.

| Section | Action |
|---|---|
| `#process` | Replace entirely with §5. |
| `#team` | Move to `/studio` — see T-01 below. |
| `#faq` | Audit against §1, then move to `/studio` or its own page. |
| `/demo-sites` | **Keep.** Rename to `Demos` in nav. A prospect who uses the voice agent for ninety seconds arrives already convinced. |

### T-01 · Studio page *(new)*
**Location:** new `src/pages/Studio.tsx`

```
Two Steps

We build AI systems for companies with a standard to protect.

The studio is small on purpose. You work with the people making the thing —
not an account manager relaying messages to a team you'll never meet.

[FOUNDER PARAGRAPH — draft, needs your approval]
Two Steps was founded by Yoni Insell, who came to software from filmmaking.
That background shows up in the work: how a system feels, how it moves, what
it chooses not to show. Most AI is built by people who have never had to hold
an audience's attention.

The team
Yoni Insell — CEO & Co-Founder
Shay Bushary — Head of Technology
Tal Sumroy — COO
Ziv Edri — CFO

How we work
[The two-step method — see §5]

What we won't do
We don't take work we can't do properly. We'll say so on the first call, and
point you somewhere better if we know of one.
```

*That last block is the only place on the site where saying no is the selling point, and it builds more trust than any list of values.*

---

## §14 — ORDER OF WORK

| Order | Block | Why first |
|---|---|---|
| 1 | `F-01` | Contact form may be dropping leads right now. |
| 2 | `ProofBar` §4 | Highest impact per hour on the whole list. |
| 3 | `H-02` `H-03` | The hero. |
| 4 | `S-02` → `S-03`–`S-05` | Kills the commodity pricing signal. |
| 5 | `W-01` → `W-02` | Removes six unprovable claims. |
| 6 | §5 Method | Makes the name mean something. |
| 7 | `R-05` | *Blocked on the three NEEDS INPUT items.* |
| 8 | Everything else | |

---

## §15 — OPEN ITEMS

| # | Needed | Blocks |
|---|---|---|
| 1 | Bulthaup, Benchmark, Social Lady — one sentence each: what you built, for whom | §8, R-05 |
| 2 | Written confirmation of what each client lets you say publicly | §4, R-05 |
| 3 | One measured number from Phyizit or Shift Manager | R-05 |
| 4 | Approve or rewrite the founder paragraph | T-01 |
| 5 | What currently sits at `#process`, `#team`, `#faq` | §13 |
| 6 | Step One scope and price — never published, but needed to sell it | — |
