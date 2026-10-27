# ne1 build plan

Review of `ne1` against `origin/main`, including the uncommitted booking split and working-tree edits. Nothing in this file has been applied to product code.

Base: `origin/main` (`83ca070`). Branch tip at review time: `152e774`, plus a dirty working tree (booking modal split, FAQ, Team, About, CSS, services copy).

## How to use this

Work top to bottom. P0 blocks a production deploy. P1 breaks a real visitor or a returning visitor. P2 is a booking or page bug with a clear repro. P3 is polish, performance, or optional structure. Each item has the file, the failure, the fix, and the check.

Do not rebuild the old scroll-choreography plan (pinned Services scene-swapper, Why Us horizontal track, testimonials fan, WordPaint). Later commits replaced that design on purpose. See the last section.

## P0. Do not ship the booking route like this

The public `POST /api/book-call` writes a Google Calendar event. There is no login, no rate limit, and no proof the email belongs to the visitor.

### P0.1 Stranger invites and a filled calendar

`server/bookCall.ts` around 291–301.

`createEvent` sets `summary` to `Intro call — ${input.name}`, puts the email in the description, and inserts with `attendees: [{ email }]` and `sendUpdates=all`. The only abuse checks are a honeypot (`ts_hp` / `company`), name length >= 2, and a shape-only email regex (`validEmail` at line 254).

What happens: anyone who can load the site can take every Sun–Thu 30-minute slot in the 14-day window, and the first insert asks Google to email the address they typed. The title is whatever they typed.

Fix:

- Insert with `sendUpdates: 'none'` and no attendees until that inbox confirms (a link), or send mail from your own system.
- Use a fixed summary such as `Intro call`. Keep the visitor name in the description only after it is capped and stripped.
- Cap name at about 80 characters and email at 254. Reject control characters and newlines.
- Rate-limit POSTs by IP and by email. A single client must not be able to book the whole horizon.

Check: an anonymous POST with someone else's email does not produce a Google invite. A burst of POSTs is rejected before the calendar fills.

### P0.2 A failed invite still says "You're booked"

`server/bookCall.ts` 298–307. `BookCallDone.tsx` line 21 (`You're booked.`).

Any non-OK `events.insert` is immediately retried with attendees removed and `sendUpdates=none`. If the second call succeeds, the handler returns 201. Service accounts commonly get `403 forbiddenForServiceAccounts` on the attendee insert when the calendar is only shared as "Make changes to events" (the setup in `.env.example`). The dialog then shows booked, and neither the guest nor the host gets an invite.

Worse: if the first insert actually stored the event and the response was still an error, the retry has no `iCalUID`, so one POST can persist two events.

Fix:

- Treat a failed attendee insert as a failed booking, or send your own mail. Do not report 201 for the stripped retry unless that is the product you want, and say so in the dialog ("Saved on our calendar. We could not email you.").
- Retry only when you know the first call did not commit.
- Set a deterministic `iCalUID` (hash of slot start + calendar id) so a repeat write updates the same event.

Check: force the attendee insert to fail. The UI must not say booked unless an event exists and the guest was actually notified, or the copy matches the weaker outcome.

### P0.3 Calendar errors look like an empty day

`server/bookCall.ts` 163–181 and 226–241.

`freeBusy` can return HTTP 200 with `calendars[id].errors` (`notFound`, `internalError`) or with no entry for `GOOGLE_CALENDAR_ID`. The handler reads `busy ?? []` and treats that as a clear calendar. `availableDays` then offers every generated slot, and `createEvent` accepts them. An unparseable busy interval also fails open, because an Invalid Date never overlaps.

Codex confirmed the shape: a mocked calendar-level error still returned 200 with 129 offered slots.

Fix: if the payload has `errors`, lacks this calendar id, or has intervals that do not parse, return 502 and offer no slots. Do not fall through to the candidate list.

Check: a 200 freeBusy body with `errors: [{ reason: 'notFound' }]` yields GET 502 and zero slots. POST of a generated slot in that state is 502 or 409, never 201.

### P0.4 Two visitors can book one slot

`server/bookCall.ts` 286–298.

`createEvent` calls `availableDays()`, checks the start is still in the list, then inserts. Nothing locks the slot between the read and the write. Google Calendar allows overlapping events. Both requests can get 201.

The client makes this easier. `BookCallDetails.tsx` `onSubmit` (line 97) returns early only when the `submitting` prop is already true. That flag updates on the next render, so a double click or a second Enter in the same turn sends two POSTs.

Fix:

- A cross-request reservation: deterministic `iCalUID` plus a re-read of that slot after insert, and a 409 if another event overlaps. A second `availableDays()` call alone does not close the race.
- On the client, a ref (or disable the button synchronously before `await`) so the second click cannot start another `requestBooking`.

Check: two parallel POSTs of the same `start` produce one event. The other response is 409.

## P1. Build break, blank hero, stuck old site

### P1.1 `study.after` does not exist, so `tsc` fails

`src/pages/CaseStudies.tsx` lines 21–26. `src/components/CaseStudies/types.ts` line 68 has `before?` and no `after`. No case study in `data.ts` sets `after`.

`EntryFacts` branches on `study.before && study.after`. Codex ran `tsc --noEmit -p tsconfig.app.json` and got TS2339 at both accesses. `package.json` `build:ssg` runs `tsc --noEmit` first, so the production build does not get past typecheck.

The comment above `EntryFacts` says studies with explicit before/after copy should use it, and everyone else falls back to the first two metrics. The field was never added.

Fix: add `readonly after?: string` next to `before` on `CaseStudy`. Leave the branch. No current study sets it, so the rendered page does not change. If you do not want the pair, delete the `study.after` branch and the comment instead. Do not leave the property access.

Check: `pnpm exec tsc --noEmit -p tsconfig.app.json` exits 0.

### P1.2 A failed font download hides the hero

`src/components/Hero.tsx` lines 27–34.

`fontsReady` starts false. The effect races `document.fonts.load(...)` against a 1200ms timeout. If `fonts.load` rejects before the timeout (stylesheet present, file failed), `Promise.race` rejects and there is no `.catch`. `fontsReady` stays false. Reduced motion skips the gate (`ready = reduce || fontsReady`). Everyone else keeps the headline, the paragraph, and the primary button at `opacity: 0`.

Fix: `.catch(() => undefined)` on the font promise so a rejection still falls through to "ready", and always `setFontsReady(true)` in a `finally` or on either settlement. Fallback faces are better than an invisible hero.

Check: stub `document.fonts.load` to reject. The h1 text "AI systems, built to a standard." is visible within 1.2s.

### P1.3 Returning visitors can stay on the old service worker

`origin/main` `vite.config.ts` registers `vite-plugin-pwa` (`registerType: 'autoUpdate'`, Workbox precache of js/css/html, and a year-long cache for Google Fonts). `ne1` removes that plugin. Current `vite.config.ts` has no `VitePWA`.

Removing the plugin does not unregister a worker already installed. That worker keeps serving the cached shell. Requests for the old `/sw.js` then fail, so those browsers may never pick up this site.

Fix: for at least one deploy, ship a tiny `/sw.js` that `self.skipWaiting()`, `clients.claim()`, deletes the old caches, and `self.registration.unregister()`. Remove it on a later deploy after analytics show the old worker is gone. Do not turn the PWA back on unless you want it.

Check: a browser that visited production `main` once, then loads `ne1`, ends on the new HTML and has no active service worker.

### P1.4 If the bundle throws, prerender stays invisible

`index.html` lines 25–26: `#root[data-prerender] { visibility: hidden }`. `src/App.tsx` lines 52–54 remove `data-prerender` in a layout effect after React commits.

If the module 404s or throws before that effect, the captured HTML is in the document and cannot be seen. There is no `<noscript>` fallback and no timeout that reveals `#root`.

Fix: reveal `#root` from a tiny inline script on `window` `error` / a 4s timeout, or drop `visibility: hidden` and accept a flash of the prerender. Keep the attribute removal so the live tree replaces it.

Check: block the module script in devtools. The prerendered headline becomes visible, or a plain error is visible. A blank white page is the failure.

## P2. Booking dialog bugs

### P2.1 "That time was taken" is thrown away

`BookCallDetails.tsx` lines 118–120 sets `submitError`, then `onTaken`. `BookCallModal.tsx` lines 252–255 clears the slot and reloads. `BookCallTimes.tsx` renders `loadError` only (line 289). It never receives `submitError`.

The visitor lands back on the calendar with no explanation. If free/busy has not caught up, the same slot is still listed.

Fix: pass `submitError` into `BookCallTimes` and show it above the slots. Clear it when they pick a new slot (that part already exists in `applyPickSlot`).

Check: POST 409. The times step shows "That time was just taken. Pick another."

### P2.2 Month paging keeps yesterday's slots

`bookCallModel.ts` `applyStep` lines 78–80: month view only calls `setCursorMonth`. `selectedDate` stays put. `BookCallTimes.tsx` line 308 renders `heading` from the cursor month. The slot buttons (line 229) still come from `selectedDay`, which is the old date, and they show the time only.

Across a month boundary the heading says the new month and the buttons confirm a start instant from the previous month.

Fix: when the month changes, either clear `selectedDate` until they pick a day in the new month, or keep the heading tied to `selectedDate`. Do not show one month's title over another day's times.

Check: select 8 Oct, page to November, and confirm the slot list is empty or labeled 8 Oct, not "November" with October times.

### P2.3 Closing the dialog does not cancel the POST

`BookCallModal.tsx` lines 104–118 clear `bookedStart` when `isOpen` becomes false. `BookCallDetails` `onSubmit` keeps running after unmount and calls `onBooked`, which is `setBookedStart` on the parent that is still mounted. The next open can land on "You're booked" for a meeting they dismissed. Nothing cancels the event.

Fix: `AbortController` tied to the dialog lifetime. Ignore completions after close. If the event was created, either keep the done step or delete the event. Do not show a stale success on the next open.

Check: submit, press Escape before the response, open again. The dialog starts on the calendar. If the event was written, that is a separate visible state, not a surprise success.

### P2.4 Times never say the zone

`calendar.ts` `formatTime` / `formatSlot` (lines 149–169) format in `Asia/Jerusalem` (the server `timezone` field). The dialog never prints that name. A visitor outside Israel reads "10:00 AM" as local.

Fix: show `Asia/Jerusalem` (or the `timezone` string from GET) next to the slot list and on the done step. Do not convert to the visitor's zone unless the whole grid converts with it.

Check: a browser in `America/New_York` still shows Jerusalem times, and the label says so.

### P2.5 The intro hardcodes 30 minutes

`BookCallIntro.tsx` says "30 minutes". The server returns `durationMin` from `DURATION_MIN` (`server/bookCall.ts` line 11). The client never reads it.

Fix: render `availability.durationMin` once the GET succeeds. Keep `DURATION_MIN` as the only constant.

### P2.6 `dryRun` is a dead contract

`BookCallDetails.tsx` line 51 rejects a 2xx body when `data.dryRun` is set or `start` is missing. `handleBookCall` never returns `dryRun`. A 201 always includes `start`.

Fix: delete `dryRun` from `BookingPayload`. Treat 2xx with `start` as success. Keep the "no start" failure.

### P2.7 Mobile panel clips the form

`BookCallModal.tsx` lines 201–222. The shell is `max-h-[min(900px,92dvh)]` and `overflow-hidden`. The intro does not shrink. On a short phone (about 375×667) the intro, the calendar chrome, and the month grid exceed the panel. Body scroll is locked (lines 68–82), and the slot list is the only scroller, so the details form can sit below the clip.

Fix: below `lg`, let the whole stacked panel scroll (`overflow-y-auto` on the shell, `max-h` kept). Keep the inner scroll only for the desktop split.

Check: 375×667, open booking, reach the name field without content cut off.

### P2.8 Dev server buffers the whole POST

`vite.config.ts` lines 27–32. The dev middleware, on a server that can be bound with `host: true`, appends every chunk with no cap.

Fix: stop reading past 64KB and respond 413. Production Netlify has its own body limit. This is the dev path.

### P2.9 A new Google token on every availability GET

`server/bookCall.ts` line 226. Every GET signs a one-hour JWT, discards it, and calls freeBusy. The Netlify function sets `Cache-Control: no-store` (`netlify/functions/book-call.ts` line 17). No honeypot on GET.

Fix: cache the access token until shortly before `exp`, and cache the freeBusy result for a short TTL (30–60s). Rate-limit the route. The scope in `googleJwt` (line 135) is the full Calendar API (`auth/calendar`). Narrow it to `calendar.events` if inserts and freeBusy still work. The wider scope can read and delete every event the service account can touch.

### P2.10 Daylight-saving duplicate day

`server/bookCall.ts` `candidateDays` lines 196–197 walks the horizon by adding `86400000` ms. Around the Asia/Jerusalem fall-back (2026-10-25) two offsets can resolve to the same local date and the last day of the window drops out.

Fix: step by calendar date in `BOOK_TZ` (`en-CA` ymd plus one day), and dedupe ymd keys. Do not add raw 24h milliseconds.

### P2.11 One calendar is the whole busy set

`freeBusy` and the insert both use only `GOOGLE_CALENDAR_ID`. Meetings on any other calendar never show as busy, and those slots get offered and written.

Fix: if the host's commitments live on more than this calendar, query those ids too, and keep the write target separate. If this calendar is the only one, document that and leave the code.

### P2.12 Swallowed auth failures

GET and POST `catch` blocks (`server/bookCall.ts` 318 and 336) return a generic 502 and do not log. `console.error` runs only after `events.insert` fails (line 304). A bad key, a token 401, and a freeBusy failure look the same in the logs.

Fix: log the status and the Google error body (not the private key) before returning 502.

### P2.13 No fetch deadline

Outbound Google `fetch` calls have no `AbortSignal`. The client POST has no timeout. If the platform kills the function after Calendar has stored the event, the UI shows an error and the visitor can submit again (see P0.4 and the `iCalUID` fix).

Fix: `AbortSignal.timeout` on token, freeBusy, and insert (for example 8s). Pair it with the deterministic event id so a retry updates instead of duplicating.

## P1 leftover. Hash navigation can leave smooth scroll off

`src/pages/Home.tsx` lines 48–67. A hash jump sets `documentElement.style.scrollBehavior` to `auto` and restores it on a 240ms timer. The effect cleanup clears that timer. A navigation inside 240ms leaves the inline `auto` on the document, so later CSS smooth scroll stays off.

Fix: restore `scrollBehavior` in the cleanup, not only in the timer.

Check: click a hash link and navigate away immediately. `document.documentElement.style.scrollBehavior` is back to the previous value.

## P2. Tests that do not exist

There is no Jest or Vitest config. `src/components/CaseStudies/tone.check.ts` is the only `node:assert` file, and `package.json` never runs it. The new Playwright scripts (`scripts/verify-motion.mjs`, `verify-scroll-scenes.mjs`, `verify-layout.mjs`) use `waitForTimeout` and are not in `package.json`.

Add these with `node --import tsx` and `node:test`. Do not export private functions only so a test can import them.

1. `handleBookCall` with Google env unset: OPTIONS 204, honeypot 204, short name 400, bad email 400, missing start 400, PUT 405, GET 503, well-formed POST 503. This probe already passed once: `.gstack/qa-reports/review-ne1/.qa-evidence/001/observation.json`.
2. Slot policy with a mocked `fetch`: Sunday–Thursday, labels `10:00`–`16:30`, 2-hour notice, foreign start is 409 and does not call `/events`, a busy overlap removes the slot, a freeBusy `errors` array is 502, two overlapping inserts become one event.
3. `calendar.ts`: `shiftMonth('2026-01', -1)`, `addYmd` across New Year and a leap day, `steppedDate` when the clamped week day is closed.
4. `bookCallModel.ts`: `applyPickDay` / `applyPickSlot` no-op while `submitting` or after `bookedStart`. Month step changes only the cursor month (and, after P2.2, the selected day behavior you choose).
5. Wire `tone.check.ts` into the same script that runs `verify-seo-html`, or into `build:ssg`.

Replace `waitForTimeout` in the Playwright scripts with a DOM or scroll predicate before those scripts join CI.

## P3. Design checklist

These are real against the design rules used in the review. They are not ship blockers. Do them in one visual pass, then look at the pages. Do not mix them into the booking patch.

| Item | Where | Fix |
| --- | --- | --- |
| Tracking tighter than -0.04em | `src/index.css` `.ts-num` about line 369 (`-0.05em`); `CaseStudyDetailSections.tsx` line 203 (`tracking-[-0.05em]` at up to 96px) | Use about `-0.03em`, or the display tracking `-0.021em` |
| Body copy at 14px | `Process.tsx` line 42 desktop description is `text-sm` while mobile is `text-base`; `AgentLauncher.tsx` line 98 welcome paragraph is `text-sm` | `text-base` or `.ts-body` |
| `transition-all` | `PipelineCard.tsx` lines 232, 241, 253, 282; `NavbarMobileMenu.tsx` line 84 | Transition only opacity, transform, background, border |
| Zero-offset colored glow | `DataEncryptionCard.tsx` line 85 `shadow-[0_0_25px_rgba(59,130,246,0.4)]`; `PipelineCard.tsx` lines 93, 104, 115 and the dots | Drop the glow. Use a 1px border or a small offset shadow |
| Image zoom on hover | `CaseStudyDetailSections.tsx` line 378 `group-hover:scale-105`; `Team.tsx` line 42 `group-hover:scale-110` | Remove the scale. Keep the arrow, border, or caption |
| Logo has no focus ring | `Navbar.tsx` line 47 and `NavbarMobileMenu.tsx` line 46 `focus:outline-none` | Remove it so the global `:focus-visible` outline shows |
| Wordmark contrast | `ProofStrip.tsx` line 65, `#8a8a8a` on `#fafafa`, about 3.3:1 | Darken to at least the muted token (`#5b616b` or darker) so normal text clears 4.5:1 |
| Buzzwords still on the page | `CaseStudies/data.ts` "seamless" (about 125, 182) and "streamline" (about 23, 290); `FAQ.tsx` lines 16, 26, 41 ("streamline", "diverse industries", "effortlessly") | Name the job: which step was removed, which tool connects, which industry you have shipped |
| Pulsing dots | `PipelineCard.tsx` line 175 `animate-pulse`; `EncryptionMetricPanels.tsx` line 32 | Static dot, or one pulse when the state changes |
| Heading order | `ServiceDetail.tsx` line 58: service name is an `h2` eyebrow rendered before the `h1` | Make the name a `p.ts-eyebrow`. Leave one `h1` |
| Eyebrow on every section | `index.css` `.ts-eyebrow` about line 169, used above h1s | Delete the ones that only repeat the heading |
| Calendar controls | `BookCallTimes.tsx` lines 304 and 314, `h-9 w-9` (36px), no hover | `h-11 w-11` and `hover:bg-ink/10` |
| Touch targets | `index.css` `.ts-slot` about line 870 and `.ts-seg` about line 681 are 28px tall | `min-height: 44px` on coarse pointers, or keep the compact grid only for `pointer: fine` |

## P3. Performance

Not blockers. Measure before rewriting motion.

- `Scrub.tsx` line 54 reads `window.innerWidth` inside `useTransform`, which can force layout on the scroll frame. Cache a `matchMedia('(max-width: 767px)')` flag.
- `CountUp.tsx` line 38 calls `setState` every frame, including while the outcomes are below the fold. Write a text node, and start when the section intersects.
- `calendar.ts` `formatTime` / `hourInZone` (line 133 and 149) build a new `Intl.DateTimeFormat` per slot. Cache by timezone and hour cycle. Reuse `slot.label` for the 24-hour label.
- `FAQ.tsx` line 48 animates height to `auto` and spreads `mainThread`, so the measure stays on the JS loop. Prefer `grid-template-rows: 0fr` to `1fr`.
- `motion.ts` line 32: `mainThread` attaches an empty `onUpdate` so entrances stay off WAAPI. The comment names framer-motion 11. `package.json` is `framer-motion` `^12.43.0`. Confirm the flicker on 12.43. If it is gone, delete `mainThread`. If it is still there, limit the workaround to the elements that flicker.
- `App.tsx` line 28: `LazyMotion` gets a static `domMax` import, so drag and layout projection sit in the entry. Pass `features={() => import('framer-motion').then(m => m.domMax)}` if the footer accordion still needs layout. Use `domAnimation` if it does not.

## P3. Optional cuts

Advisory only. Do not do these in the booking patch. Each one has a single caller or no caller.

| Cut | Where | Lines back, roughly |
| --- | --- | --- |
| Inline the setter wrappers | `bookCallModel.ts` is only used by `BookCallModal` | ~78, minus the tests you add if you keep it |
| Delete `SplitText` mode `static` | `SplitText.tsx` about line 78, never passed | ~16 |
| Delete `Parallax` `fadeTo` | `Parallax.tsx` line 9, default 1, no caller sets it | ~6 |
| Delete `Scrub` effect `unfold` | `Scrub.tsx` line 31, no caller | ~3 |
| Replace `useInView.ts` | 21-line hook. `Scrub` already uses framer-motion `useInView` | ~11 after the five call sites move |
| Replace `getDeviceType` | `device.ts`. Hero and Footer only need mobile. `useMediaQuery` already exists | ~33 |

Also dead or stale, safe to clean while you are in the file:

- `useNavbar.ts` line 48 treats `data-pin` as a pinned section. Nothing sets `data-pin`. Drop the branch or set the attribute.
- `motion.ts` lines 8–9 still describe a Services pin and an interaction deck. Services is a static list. Rewrite the comment to Scrub, FAQ, drawer, modal.
- `motion.ts` stamp comment says 140% and the initial scale is 1.12. Pop comment says 80% and the initial scale is 0.92. Fix the comments, not the motion, unless you meant the old numbers.
- `'use client'` on `src/pages/CaseStudies.tsx` line 1 and `src/pages/CaseStudyDetail.tsx` line 1. This is a Vite app. The same branch already removed it from Services. Delete both prologues.

## Order of work

1. P0 booking: fail closed on freeBusy, no public invites, one event per slot, honest success copy. Add the handler tests in the same change.
2. P1.1 `after` field so `tsc` is green. P1.2 hero font `catch`. P1.3 one-shot service worker unregister.
3. P2 dialog: taken-slot message, month vs selected day, abort on close, timezone label, scroll on short phones.
4. P1.4 prerender reveal, and the Home hash `scrollBehavior` cleanup.
5. P3 design pass on a branch of its own. Performance and the optional cuts only if a profile or a reread says they are worth it.

## Acceptance

- `pnpm exec tsc --noEmit -p tsconfig.app.json` is clean.
- Handler tests cover 400, 204 honeypot, 405, 503 without credentials, freeBusy `errors` → 502, and two parallel POSTs → one event.
- A manual book on a shared test calendar creates one event, does not email an unconfirmed address, and the dialog copy matches what happened.
- 375×667 can reach the name field. 409 is visible. The month heading and the slot list name the same day.
- A browser with the old Workbox worker, after one load of this deploy, is on the new HTML with no active worker.
- Hero text is visible when `document.fonts.load` rejects.

## What this review already ran

- Handler probe with Google env unset: OPTIONS 204, short name 400 "Tell us your name.", GET and well-formed POST 503 "Booking is not connected yet." Evidence: `.gstack/qa-reports/review-ne1/.qa-evidence/001/observation.json`.
- Specialists: testing, maintainability, security, performance, API contract (no contract mismatch), design, simplification, red team, and a Claude adversarial pass.
- Codex structured review against `main` (P1 service worker, P1 mobile clip, P2 hero fonts, P2 double book, P2 freeBusy errors, P2 timezone label, P2 `study.after`).

Not run: a live Google write, browser screenshots, the scroll-plan Playwright pass, and `pnpm run build`.

## Scroll plan: do not treat it as missing work

`~/.claude/plans/work-on-upgrading-the-tingly-flurry.md` asked for pinned Services scenes, a Why Us horizontal track, a testimonials fan, and WordPaint. Later commits replaced those on purpose:

- `36e0ddc` removed unconfirmed testimonials.
- `52bcf20` replaced the six Why Us claims.
- `e229f38` replaced the five-step process with the two-step method.
- `c0686cf` made home services three capability blocks.
- `9eb0f5f` moved Why Us, Team, and Process onto real pages.

What shipped instead is `Scrub` plus `useSectionProgress` (`src/utils/scroll.ts`). `usePinProgress`, `useSmooth`, `useChoreoFallback`, `WordPaint.tsx`, `ServicesScenes.tsx`, and `WhyUsTrack.tsx` were never added. `scripts/prerender.ts` line 66 does set `reducedMotion: 'reduce'`, which that plan asked for. `BackgroundGradient.tsx` is static on purpose: a moving layer behind `backdrop-filter` pegged the compositor.

Leave that plan. The work in the sections above is the remaining work on the site you have now.
