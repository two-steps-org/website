import React, { useContext, useRef } from 'react';
import { m, useTransform, type MotionValue } from 'framer-motion';
import { mainThread, maskParent, maskWord } from '../../utils/motion';
import { ScrollProgressContext, useReducedMotionQuery, useSectionProgress } from '../../utils/scroll';

export interface TextSegment {
  text: string;
  className?: string;
  breakBefore?: boolean;
}

interface SplitTextProps {
  text?: string;
  segments?: TextSegment[];
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  stagger?: number;
  delay?: number;
  mode?: 'enter' | 'reveal' | 'static';
  /** Hold an entrance until its layout is ready, such as after fonts load. */
  ready?: boolean;
}

type Word = { id: string; text: string; className?: string; breakBefore?: boolean };
const ScrollWord = ({ word, index, total, progress }: { word: Word; index: number; total: number; progress: MotionValue<number> }) => {
  const start = (index / Math.max(total, 1)) * 0.35;
  const wordProgress = useTransform(progress, [start, start + 0.65], [0, 1]);
  const transform = useTransform(wordProgress, value => `translateY(${(1 - value) * 105}%)`);
  const opacity = useTransform(wordProgress, [0, 1], [0.15, 1]);
  return <m.span className={`inline-block ${word.className ?? ''}`} style={{ transform, opacity }}>{word.text}</m.span>;
};

const maskClass = 'inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]';

type HeadingProps = SplitTextProps & { words: Word[]; label: string };

function HeadingWords({ as = 'h2', className, words, label, progress, anchorRef }: HeadingProps & { progress: MotionValue<number>; anchorRef?: React.Ref<HTMLHeadingElement> }) {
  const Tag = as;
  return (
    <Tag ref={anchorRef} className={className} aria-label={label}>
      {words.map((word, index) => (
        <React.Fragment key={word.id}>
          {word.breakBefore && <br />}
          <span className={maskClass} aria-hidden="true">
            <ScrollWord word={word} index={index} total={words.length} progress={progress} />
          </span>
        </React.Fragment>
      ))}
    </Tag>
  );
}

function StandaloneScrollHeading(props: HeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const progress = useSectionProgress(ref, ['start 0.94', 'start 0.34']);
  return <HeadingWords {...props} anchorRef={ref} progress={progress} />;
}

function ScrollHeading(props: HeadingProps) {
  const shared = useContext(ScrollProgressContext);
  return shared ? <HeadingWords {...props} progress={shared} /> : <StandaloneScrollHeading {...props} />;
}

/** Optional entrances and scroll-driven word masks, with a stationary mode. */
const SplitText: React.FC<SplitTextProps> = ({ text, segments, as = 'h2', className, stagger = 0.035, delay = 0, mode = 'reveal', ready = true }) => {
  const reduce = useReducedMotionQuery();
  const runs = segments ?? [{ text: text ?? '' }];
  const label = runs.map(run => run.text).join(' ');
  const words = runs.flatMap((run, runIndex) => {
    const parts = run.text.split(' ').filter(Boolean);
    return parts.map((word, index) => ({
      id: `${runIndex}-${index}-${word}`,
      text: word + (index < parts.length - 1 || runIndex < runs.length - 1 ? '\u00a0' : ''),
      className: run.className,
      breakBefore: index === 0 && run.breakBefore,
    }));
  });
  if (mode === 'static') {
    const Tag = as;
    return (
      <Tag className={className} aria-label={label}>
        {words.map((word) => (
          <React.Fragment key={word.id}>
            {word.breakBefore && <br />}
            <span className={maskClass} aria-hidden="true">
              <span className={`inline-block ${word.className ?? ''}`}>{word.text}</span>
            </span>
          </React.Fragment>
        ))}
      </Tag>
    );
  }
  if (!reduce && mode === 'reveal') return <ScrollHeading as={as} className={className} words={words} label={label} />;

  const Tag = m[as];
  return (
    <Tag className={className} aria-label={label} initial={reduce ? false : 'hidden'} animate={reduce || ready ? 'show' : 'hidden'} variants={maskParent(reduce ? 0 : stagger, reduce ? 0 : delay)}>
      {words.map((word) => (
        <React.Fragment key={word.id}>
          {word.breakBefore && <br />}
          <span className={maskClass} aria-hidden="true">
            <m.span {...mainThread} className={`inline-block ${word.className ?? ''}`} variants={reduce ? undefined : maskWord}>{word.text}</m.span>
          </span>
        </React.Fragment>
      ))}
    </Tag>
  );
};

export default React.memo(SplitText);
