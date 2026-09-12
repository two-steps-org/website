import React from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { maskParent, maskWord } from '../../utils/motion';

/** A run of words that share styling — lets a headline mix a serif word in. */
export interface TextSegment {
  text: string;
  className?: string;
  /** Force a line break before this segment. */
  breakBefore?: boolean;
}

interface SplitTextProps {
  /** Plain string, split on spaces. */
  text?: string;
  /** Mixed-style alternative to `text`. */
  segments?: TextSegment[];
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  /** Seconds between words. */
  stagger?: number;
  /** Seconds before the first word. */
  delay?: number;
  /** `enter` animates on mount (above the fold); `reveal` waits for scroll. */
  mode?: 'enter' | 'reveal';
}

/**
 * Headline reveal: each word rises out of its own clipped line, staggered.
 *
 * The clip is what sells it — words appear to come up from behind an
 * invisible edge rather than fading in place. Each word carries its own
 * trailing space inside the clip so line-wrapping is unaffected.
 */
const SplitText: React.FC<SplitTextProps> = ({
  text,
  segments,
  as = 'h2',
  className,
  stagger = 0.035,
  delay = 0,
  mode = 'reveal',
}) => {
  const Tag = m[as];
  const reduce = useReducedMotion();
  const runs: TextSegment[] = segments ?? [{ text: text ?? '' }];
  const label = runs.map((r) => r.text).join(' ');
  const trigger =
    mode === 'enter'
      ? { animate: 'show' as const }
      : { whileInView: 'show' as const, viewport: { once: true, margin: '0px 0px -12% 0px' } };

  // Reduced motion: no "hidden" start state, so the words are simply there.
  const motionProps = reduce
    ? { initial: false as const }
    : { variants: maskParent(stagger, delay), initial: 'hidden' as const, ...trigger };

  return (
    <Tag className={className} {...motionProps} aria-label={label}>
      {runs.map((run, r) => {
        const words = run.text.split(' ').filter(Boolean);
        return (
          <React.Fragment key={`${run.text}-${r}`}>
            {run.breakBefore && <br />}
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]"
                aria-hidden="true"
              >
                <m.span className={`inline-block ${run.className ?? ''}`} variants={maskWord}>
                  {word}
                  {i < words.length - 1 || r < runs.length - 1 ? ' ' : ''}
                </m.span>
              </span>
            ))}
          </React.Fragment>
        );
      })}
    </Tag>
  );
};

export default React.memo(SplitText);
