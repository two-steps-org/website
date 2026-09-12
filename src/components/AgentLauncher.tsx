import React, { useEffect, useState } from 'react';
import { Mic, X } from 'lucide-react';
import clsx from 'clsx';
import { BOOK_CALL_URL } from '../data/navItems';

/**
 * Live voice-agent endpoint.
 *
 * Empty until the embed is chosen (PLAN.md leaves the voice embed flagged).
 * While it is empty the "Talk" button is not rendered at all and Book a Call
 * takes the full width — a visible-but-dead button would be worse than none.
 */
const VOICE_AGENT_URL = '';

const LAUNCHER_LABEL = 'Talk to our AI now';
const WELCOME =
  'Hi, I am the Two Steps agent, built by the team you are looking at. Ask me anything about what we build, or book a call with a human.';

/**
 * The agent launcher and its panel, from the design's "Chat launcher".
 *
 * Fixed bottom-right, above the safe-area inset. The circular badge carries the
 * mic and a green online dot; the label is hidden on small screens so the
 * launcher collapses to a circle, as the design does.
 */
const AgentLauncher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  // Past the hero the launcher sheds its label and collapses to the icon, so it
  // stops competing with page content. rAF-throttled, like the nav band check.
  useEffect(() => {
    let ticking = false;

    const update = () => {
      setIsCompact(window.scrollY > window.innerHeight * 0.6);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Escape closes the panel, matching the site's other dialogs.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          role="dialog"
          aria-label="Two Steps agent"
          className="ts-chat-panel ts-glass fixed right-6 z-40 w-[min(360px,calc(100vw-48px))] rounded-card shadow-[var(--shadow-lg)] p-6 flex flex-col gap-4"
          style={{ bottom: 'calc(88px + env(safe-area-inset-bottom))' }}
        >
          <div className="flex items-center justify-between gap-3">
            <span
              className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold"
              style={{
                background: 'var(--status-success-bg)',
                color: 'var(--status-success-text)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
              Online
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="flex w-8 h-8 items-center justify-center rounded-full border-0 bg-transparent text-muted hover:text-ink transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="m-0 px-3.5 py-3 rounded-[14px] bg-surface border border-line text-sm leading-[1.5] text-ink">
            {WELCOME}
          </p>

          <div className="flex gap-2">
            {VOICE_AGENT_URL && (
              <a
                href={VOICE_AGENT_URL}
                target="_blank"
                rel="noreferrer"
                className="ts-pill flex-1 h-11 text-sm"
              >
                <Mic className="w-3.5 h-3.5" />
                Talk
              </a>
            )}
            <a
              href={BOOK_CALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="ts-pill-ghost flex-1 h-11 text-sm"
            >
              Book a Call
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={LAUNCHER_LABEL}
        className={clsx(
          'ts-glass fixed right-6 z-40 inline-flex items-center h-[52px] min-w-[52px] px-3 rounded-full',
          'text-ink text-sm font-medium shadow-[var(--shadow-md)]',
          'transition-[transform,padding] duration-300 hover:-translate-y-0.5',
          !isCompact && 'md:pr-[18px]',
        )}
        style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
      >
        <span className="relative flex w-7 h-7 items-center justify-center rounded-full bg-accent text-accent-fg shrink-0">
          <Mic className="w-3.5 h-3.5" />
          <span className="absolute -top-px -right-px w-2 h-2 rounded-full bg-status-success border-2 border-bg" />
        </span>
        <span
          aria-hidden={isCompact}
          className={clsx(
            'hidden md:inline-block overflow-hidden whitespace-nowrap',
            'transition-[max-width,opacity,margin-left] duration-300 ease-smooth',
            isCompact ? 'max-w-0 opacity-0 ml-0' : 'max-w-[180px] opacity-100 ml-2.5',
          )}
        >
          {LAUNCHER_LABEL}
        </span>
      </button>
    </>
  );
};

export default React.memo(AgentLauncher);
