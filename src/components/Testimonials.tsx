import React, { useCallback, useEffect, useRef, useState } from 'react';
import { m, useTransform, type MotionValue } from 'framer-motion';
import SplitText from './common/SplitText';
import Scrub from './common/Scrub';
import { useReducedMotionQuery, useSectionProgress } from '../utils/scroll';

interface Quote {
  readonly quote: string;
  readonly name: string;
  readonly role: string;
  readonly company: string;
}

/**
 * Quotes carried over from the design's `content.js`.
 *
 * These are flagged `mock: true` there — real names, roles and wording need to
 * be confirmed before launch.
 */
const QUOTES: readonly Quote[] = [
  {
    quote:
      'They started from the systems we already had and made them work together. Nothing was ripped out for the sake of it.',
    name: 'Daniel Roth',
    role: 'Director of Operations',
    company: 'EY',
  },
  {
    quote:
      'Orders, kitchen and delivery finally live in one place. Our staff learned it in an afternoon.',
    name: 'Maya Lindqvist',
    role: 'Co-founder',
    company: 'Pizit',
  },
  {
    quote:
      'The voice agent picks up every call after hours. We stopped losing bookings the week it went live.',
    name: 'Emily Davis',
    role: 'Practice Manager',
    company: 'Northgate Clinics',
  },
];

/** Depth 0 is the face-up card; 1 and 2 peek out behind it. */
const DEPTH_STYLE = [
  { ty: '0px', sc: 1, rot: '0deg' },
  { ty: '16px', sc: 0.96, rot: '-2.5deg' },
  { ty: '32px', sc: 0.92, rot: '2deg' },
];

/** Horizontal travel, in px, past which a drag counts as a discard. */
const FLING_THRESHOLD = 110;
/** A fast flick may discard sooner, but never from a tap's pixel jitter. */
const FLICK_MIN_TRAVEL = 24;

// Scroll opens the fan; the article inside retains its independent drag transform.
const DeckFan = ({ progress, depth, children }: { progress: MotionValue<number>; depth: number; children: React.ReactNode }) => {
  const rest = DEPTH_STYLE[depth];
  const transform = useTransform(progress, value => {
    const remaining = 1 - value;
    const y = -parseFloat(rest.ty) * remaining;
    const rotate = -parseFloat(rest.rot) * remaining;
    const scale = 1 + (1 / rest.sc - 1) * remaining;
    return `translateY(${y}px) rotate(${rotate}deg) scale(${scale})`;
  });
  return <m.div className="h-full" data-scroll-deck={depth} style={{ transform }}>{children}</m.div>;
};

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

/**
 * Testimonials — the draggable card stack from the design.
 *
 * Sits on the light band directly under the work rail, so the two read as one
 * continuous light region. Drag the top card aside (or press Next) to advance.
 */
const Testimonials: React.FC = () => {
  // `order[0]` is the card currently face-up.
  const [order, setOrder] = useState(() => QUOTES.map((_, i) => i));
  const reduce = useReducedMotionQuery();
  const stackRef = useRef<HTMLDivElement>(null);
  const deckProgress = useSectionProgress(stackRef, ['start 0.94', 'start 0.34']);
  const dragRef = useRef<{ x: number; y: number; dx: number; t: number; el: HTMLElement; horizontal: boolean } | null>(null);

  const flingTimer = useRef<number | null>(null);
  useEffect(() => () => {
    if (flingTimer.current !== null) window.clearTimeout(flingTimer.current);
  }, []);

  const advance = useCallback(() => {
    if (flingTimer.current !== null) return;
    setOrder((prev) => prev.slice(1).concat(prev[0]));
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    const el = event.currentTarget;
    if (!event.isPrimary || event.button !== 0 || flingTimer.current !== null || el.getAttribute('data-top') !== '1') return;
    dragRef.current = { x: event.clientX, y: event.clientY, dx: 0, t: performance.now(), el, horizontal: false };
    el.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    drag.dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.horizontal) {
      if (Math.max(Math.abs(drag.dx), Math.abs(dy)) < 8) return;
      // A vertical gesture belongs to native page scrolling.
      if (Math.abs(dy) >= Math.abs(drag.dx)) {
        dragRef.current = null;
        return;
      }
      drag.horizontal = true;
      drag.el.style.transition = 'none';
    }
    drag.el.style.transform = `translateX(${drag.dx}px) rotate(${reduce ? 0 : drag.dx / 18}deg)`;
  };

  const cancelDrag = () => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    drag.el.style.transition = reduce ? 'none' : 'transform .22s var(--ease)';
    drag.el.style.transform = '';
  };

  const onPointerUp = () => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    const { el, dx, t } = drag;
    if (!drag.horizontal) return;
    const velocity = Math.abs(dx) / Math.max(performance.now() - t, 1);

    const flicked = Math.abs(dx) >= FLICK_MIN_TRAVEL && velocity >= 0.11;
    if (Math.abs(dx) < FLING_THRESHOLD && !flicked) {
      el.style.transition = reduce ? 'none' : 'transform .22s var(--ease)';
      el.style.transform = '';
      return;
    }

    if (reduce) {
      el.style.transform = '';
      el.style.transition = '';
      advance();
      return;
    }

    // Finish the exit before recycling the card; do not accept another fling.
    el.style.transition = 'transform .25s var(--ease), opacity .25s var(--ease)';
    el.style.transform = `translate(${dx * 4}px, 40px) rotate(${dx / 8}deg)`;
    el.style.opacity = '0';
    flingTimer.current = window.setTimeout(() => {
      flingTimer.current = null;
      el.style.transition = 'none';
      el.style.transform = '';
      el.style.opacity = '';
      advance();
      requestAnimationFrame(() => {
        el.style.transition = '';
      });
    }, 250);
  };

  return (
    <section
      data-theme="light"
      data-band="light"
      className="ts-section relative z-[1] bg-[#fafafa] text-[#0a0a0a] border-b border-[#e6e6e6]"
    >
      <div className="ts-container grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[clamp(32px,5vw,80px)] items-center">
        <Scrub x={-28} y={20} contentClassName="flex flex-col gap-6">
          <p className="ts-eyebrow">What clients say</p>
          <SplitText
            as="h2"
            delay={0.1}
            className="ts-h2 text-[#0a0a0a] max-w-[14ch] m-0"
            text="Said by the people who run on it."
          />
          <p className="text-base text-[#6b6b6b] m-0 max-w-[40ch]">
            Drag a card aside to read the next one.
          </p>

          <div className="flex items-center gap-4 mt-4">
            <button
              type="button"
              onClick={advance}
              aria-label="Next quote"
              className="ts-icon-btn inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-[#0a0a0a] bg-transparent px-[18px] text-sm font-medium text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
            >
              Next
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
            <span className="font-mono text-[13px] text-[#6b6b6b] tabular-nums">
              {String(order[0] + 1).padStart(2, '0')} / {String(QUOTES.length).padStart(2, '0')}
            </span>
          </div>
        </Scrub>

        <div ref={stackRef} data-scroll-anchor="deck" className="relative h-[clamp(360px,40vw,460px)]">
          {QUOTES.map((q, i) => {
            const depth = order.indexOf(i);
            const style = DEPTH_STYLE[Math.min(depth, DEPTH_STYLE.length - 1)];
            const isTop = depth === 0;

            return (
              <div
                key={q.name}
                className="absolute inset-0"
                style={{
                  zIndex: 10 - depth,
                  transform: `translateY(${style.ty}) scale(${style.sc}) rotate(${style.rot})`,
                  pointerEvents: isTop ? 'auto' : 'none',
                  transition: reduce ? 'none' : 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <DeckFan progress={deckProgress} depth={reduce ? 0 : depth}>
                  <article
                    data-top={isTop ? '1' : '0'}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={cancelDrag}
                    onLostPointerCapture={cancelDrag}
                    className="h-full flex flex-col justify-between gap-8 p-[clamp(24px,3vw,40px)] rounded-[20px] bg-white border border-[#e6e6e6] shadow-[0_24px_64px_rgba(0,0,0,0.10)] select-none touch-pan-y"
                    style={{ cursor: isTop ? 'grab' : 'default' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-[0.14em] uppercase">
                        {q.company}
                      </span>
                      <span className="font-mono text-xs text-[#6b6b6b]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <blockquote className="font-tight font-light text-[clamp(22px,2.4vw,34px)] leading-[1.15] tracking-[-0.025em] text-balance m-0">
                      &ldquo;{q.quote}&rdquo;
                    </blockquote>

                    <div className="flex items-center gap-3">
                      <span className="flex w-10 h-10 items-center justify-center rounded-full bg-[#0a0a0a] text-white text-xs font-semibold">
                        {initials(q.name)}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{q.name}</span>
                        <span className="text-[13px] text-[#6b6b6b]">{q.role}</span>
                      </div>
                    </div>
                  </article>
                </DeckFan>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Testimonials);
