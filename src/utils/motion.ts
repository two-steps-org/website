import { prefersReducedMotion as prefersReduced } from './motionPreference';

/**
 * Motion vocabulary.
 *
 * Three jobs, one language:
 *   load      — Hero (and page headers) on first paint. `enter` / SplitText.
 *   explain   — Process timeline and case-study scenes. Scroll-linked, not decoration.
 *   interact  — accordion, deck, drawer, modal, press. Spatial + feedback.
 *
 * Home sections use Scrub for reversible scroll scenes; these presets also
 * support entrances and interactions on the case-study pages.
 */

export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;
export const STAGGER = 0.06;
export const DURATION = 0.36;

const uiIn = { duration: 0.22, ease: EASE_OUT };
const uiOut = { duration: 0.2, ease: EASE_OUT };

/**
 * Keep entrances and overlays off WAAPI. framer-motion 11 ends a native
 * animation by setting the final value and cancelling the WAAPI effect at
 * once, but the inline-style write lands a frame later, so the element blinks
 * back to its previous inline state: copy flickers to opacity 0 as it lands,
 * a modal blanks after opening and flashes back after closing. Any `onUpdate`
 * prop makes Motion run the value on the main thread, where there is no hand-off.
 */
export const mainThread = { onUpdate: () => {} } as const;

/** Overlay fade. Opacity only — reduced motion keeps this. */
export const fade = {
  ...mainThread,
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: uiOut },
  transition: uiIn,
};

export const drawerScrim = {
  ...mainThread,
  initial: { opacity: 0 },
  animate: { opacity: 0.6 },
  exit: { opacity: 0, transition: uiOut },
  transition: uiIn,
};

export const modalPanel = {
  ...mainThread,
  initial: { opacity: 0, transform: 'scale(0.96)' },
  animate: { opacity: 1, transform: 'scale(1)' },
  exit: { opacity: 0, transform: 'scale(0.96)', transition: uiOut },
  transition: uiIn,
};

export const drawerPanel = {
  ...mainThread,
  initial: { transform: 'translateX(100%)' },
  animate: { transform: 'translateX(0%)' },
  exit: { transform: 'translateX(100%)', transition: { duration: 0.2, ease: EASE_DRAWER } },
  transition: { duration: 0.32, ease: EASE_DRAWER },
};

const VIEWPORT = { once: true, amount: 0.3, margin: '0px 0px -8% 0px' } as const;
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

/** Lands from above at 112%, like a stamp. Big numerals and step counters. */
export const stamp = (delay = 0) => 
  prefersReduced() ? AT_REST : ({
  initial: { opacity: 0, scale: 1.12, y: -6 },
  whileInView: { opacity: 1, scale: 1, y: 0 },
  viewport: VIEWPORT,
  transition: { type: 'spring' as const, stiffness: 300, damping: 29, delay },
});

/** Springs in from 92%. Small things: icons, chips, avatars, dots. */
export const pop = (index = 0, offset = 0) => 
  prefersReduced() ? AT_REST : ({
  initial: { opacity: 0, scale: 0.92 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: VIEWPORT,
  transition: { type: 'spring' as const, stiffness: 420, damping: 33, delay: offset + index * 0.05 },
});

/* ── On-load entrances (content in view at first paint) ──────────────────── */


export const enter = (delay = 0) => 
  prefersReduced() ? AT_REST : ({
  ...mainThread,
  initial: { opacity: 0, transform: 'translateY(32px)' },
  animate: { opacity: 1, transform: 'translateY(0px)' },
  transition: base(delay),
});
export const enterItem = (index: number, offset = 0) => enter(offset + index * STAGGER);

export const enterScale = (delay = 0) => 
  prefersReduced() ? AT_REST : ({
  ...mainThread,
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
