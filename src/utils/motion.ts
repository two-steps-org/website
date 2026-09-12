/**
 * Motion vocabulary for the 2026 design.
 *
 * One easing, one stagger, one viewport rule — but several distinct moves,
 * each chosen to match what a section *is*:
 *
 *   rise      — the default: fade + lift. Body copy, small blocks.
 *   slide     — enters along an axis. Horizontal rails, alternating layouts.
 *   scaleIn   — grows from 96%. Cards, panels, "screens powering on".
 *   blurIn    — sharpens out of a blur. Quotes, feature copy, anything editorial.
 *   deal      — drops in with a rotation, like a card dealt. Card stacks.
 *   draw      — scales open from the left edge. Hairlines, rails, dividers.
 *   pop       — springs from 80%. Icons, chips, dots, avatars.
 *   maskUp    — text rises out of a clipped line. Headlines (see SplitText).
 *
 * Timing follows PLAN.md §1.10: 200–400ms, cubic-bezier(0.22,1,0.36,1),
 * 60ms stagger. Reduced motion: MotionConfig strips the transforms and
 * index.css zeroes CSS transitions, so these stay declarative.
 */

export const EASE = [0.22, 1, 0.36, 1] as const;
export const STAGGER = 0.06;
export const DURATION = 0.36;

const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const;
const base = (delay: number, duration = DURATION) => ({ duration, ease: EASE, delay });

/**
 * Reduced motion: render at rest, immediately.
 *
 * MotionConfig already strips transforms, but it keeps opacity fades — which
 * leaves content invisible until a fade it never asked for finishes. The
 * web-animation-design guidance is explicit that opacity motion is not
 * automatically acceptable, so every preset returns `initial: false` here:
 * no start state, no fade, nothing to wait for. Presets are evaluated during
 * render, so a query change mid-session takes effect on the next render.
 */
const prefersReduced = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const AT_REST = { initial: false as const };

/* ── Scroll reveals ───────────────────────────────────────────────────────── */

/** Fade + lift. The general-purpose move. */
export const reveal = (delay = 0) => 
  prefersReduced() ? AT_REST : ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: VIEWPORT,
  transition: base(delay),
});
export const revealItem = (index: number, offset = 0) => reveal(offset + index * STAGGER);

/** Enters from the left or right. Match it to the layout's own axis. */
export const slide = (from: 'left' | 'right', delay = 0, distance = 48) => 
  prefersReduced() ? AT_REST : ({
  initial: { opacity: 0, x: from === 'left' ? -distance : distance },
  whileInView: { opacity: 1, x: 0 },
  viewport: VIEWPORT,
  transition: base(delay, 0.4),
});
export const slideItem = (from: 'left' | 'right', index: number, offset = 0) =>
  slide(from, offset + index * STAGGER);

/** Grows from 96% while fading. Cards and panels. */
export const scaleIn = (delay = 0) => 
  prefersReduced() ? AT_REST : ({
  initial: { opacity: 0, scale: 0.96, y: 16 },
  whileInView: { opacity: 1, scale: 1, y: 0 },
  viewport: VIEWPORT,
  transition: base(delay, 0.4),
});
export const scaleItem = (index: number, offset = 0) => scaleIn(offset + index * STAGGER);

/** Sharpens out of a blur. Feels editorial — use on quotes and long copy. */
export const blurIn = (delay = 0) => 
  prefersReduced() ? AT_REST : ({
  initial: { opacity: 0, filter: 'blur(8px)', y: 12 },
  whileInView: { opacity: 1, filter: 'blur(0px)', y: 0 },
  viewport: VIEWPORT,
  transition: base(delay, 0.45),
});

/** Dealt like a card: drops in from below with a small rotation that settles. */
export const deal = (index: number, offset = 0) => 
  prefersReduced() ? AT_REST : ({
  initial: { opacity: 0, y: 80, rotate: index % 2 ? 4 : -4 },
  whileInView: { opacity: 1, y: 0, rotate: 0 },
  viewport: VIEWPORT,
  transition: { type: 'spring' as const, stiffness: 260, damping: 27, delay: offset + index * 0.07 },
});

/** A line or rail drawing open from its left edge. */
export const draw = (delay = 0) => 
  prefersReduced() ? AT_REST : ({
  initial: { scaleX: 0, opacity: 0 },
  whileInView: { scaleX: 1, opacity: 1 },
  viewport: VIEWPORT,
  transition: base(delay, 0.5),
  style: { transformOrigin: 'left center' },
});

/** A vertical rule drawing down from its top edge. */
export const drawY = (delay = 0) => 
  prefersReduced() ? AT_REST : ({
  initial: { scaleY: 0, opacity: 0 },
  whileInView: { scaleY: 1, opacity: 1 },
  viewport: VIEWPORT,
  transition: base(delay, 0.5),
  style: { transformOrigin: 'center top' },
});

/** Lands from above at 140%, like a stamp. Big numerals and step counters. */
export const stamp = (delay = 0) => 
  prefersReduced() ? AT_REST : ({
  initial: { opacity: 0, scale: 1.12, y: -6 },
  whileInView: { opacity: 1, scale: 1, y: 0 },
  viewport: VIEWPORT,
  transition: { type: 'spring' as const, stiffness: 300, damping: 29, delay },
});

/** Settles from a slow zoom. Photography inside a clipped frame. */
export const settle = (delay = 0) => 
  prefersReduced() ? AT_REST : ({
  initial: { scale: 1.12, opacity: 0.6 },
  whileInView: { scale: 1, opacity: 1 },
  viewport: VIEWPORT,
  transition: base(delay, 0.8),
});

/** Springs in from 80%. Small things: icons, chips, avatars, dots. */
export const pop = (index = 0, offset = 0) => 
  prefersReduced() ? AT_REST : ({
  initial: { opacity: 0, scale: 0.92 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: VIEWPORT,
  transition: { type: 'spring' as const, stiffness: 420, damping: 33, delay: offset + index * 0.05 },
});

/* ── On-load entrances (content in view at first paint) ──────────────────── */
/* These use full `transform` strings rather than x/y/scale shorthands: they
   play during hydration, and the shorthands animate on the main thread via
   rAF, which drops frames exactly then. Strings let Motion use WAAPI. */

export const enter = (delay = 0) => 
  prefersReduced() ? AT_REST : ({
  initial: { opacity: 0, transform: 'translateY(32px)' },
  animate: { opacity: 1, transform: 'translateY(0px)' },
  transition: base(delay),
});
export const enterItem = (index: number, offset = 0) => enter(offset + index * STAGGER);

export const enterPop = (index = 0, offset = 0) => 
  prefersReduced() ? AT_REST : ({
  initial: { opacity: 0, transform: 'scale(0.92)' },
  animate: { opacity: 1, transform: 'scale(1)' },
  transition: { type: 'spring' as const, stiffness: 420, damping: 33, delay: offset + index * 0.05 },
});

export const enterScale = (delay = 0) => 
  prefersReduced() ? AT_REST : ({
  initial: { opacity: 0, transform: 'scale(0.94)' },
  animate: { opacity: 1, transform: 'scale(1)' },
  transition: base(delay, 0.55),
});

/* ── Variants for masked text (SplitText) ────────────────────────────────── */

/** Parent: orchestrates the stagger. Child: each word rises out of its clip. */
export const maskParent = (stagger = 0.035, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});
export const maskWord = {
  hidden: { transform: 'translateY(110%)', opacity: 0 },
  show: { transform: 'translateY(0%)', opacity: 1, transition: { duration: 0.45, ease: EASE } },
};
