import React, { useEffect, useRef, useState } from 'react';
import { Mic, X } from 'lucide-react';
import clsx from 'clsx';
import { cancelFrame, frame } from 'framer-motion';
import { useBookCall } from './BookCall/useBookCall';

const LAUNCHER_LABEL = 'Talk to our AI now';
const WELCOME =
  'Hi, I am the Two Steps agent, built by the team you are looking at. Ask me anything about what we build, or start a conversation with a human.';

const LAUNCHER_BOTTOM = 'calc(1.5rem + env(safe-area-inset-bottom))';
const PANEL_BOTTOM = 'calc(5.75rem + env(safe-area-inset-bottom))';

/**
 * The agent launcher and its panel, from the design's "Chat launcher".
 *
 * Fixed bottom-right, above the safe-area inset. The circular badge carries the
 * mic and a green online dot; the label collapses on scroll (and on small
 * screens) so the launcher shrinks to a circle, as the design does.
 *
 * The panel is a non-modal `<dialog>` (`show()`, not `showModal()`): it sits
 * next to the launcher without locking the rest of the page.
 */
const AgentLauncher: React.FC = () => {
  const { open: openBookCall } = useBookCall();
  const [isOpen, setIsOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const update = () => {
      setIsCompact(window.scrollY > window.innerHeight * 0.6);
    };

    const onScroll = () => {
      frame.read(update);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelFrame(update);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      if (!dialog.open) dialog.show();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

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
      <dialog
        ref={dialogRef}
        aria-label="Two Steps agent"
        onClose={() => setIsOpen(false)}
        className="ts-chat-panel ts-glass fixed right-6 top-auto left-auto z-40 m-0 w-[min(360px,calc(100vw-48px))] rounded-card shadow-[var(--shadow-lg)] p-6 hidden open:flex flex-col gap-4"
        style={{ bottom: PANEL_BOTTOM }}
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
            className="ts-icon-btn flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-muted hover:text-ink"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="m-0 px-3.5 py-3 ts-surface text-sm leading-[1.5] text-ink">
          {WELCOME}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              openBookCall();
            }}
            className="ts-pill-ghost flex-1 h-11 text-sm"
          >
            Start a conversation
          </button>
        </div>
      </dialog>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={LAUNCHER_LABEL}
        className={clsx(
          'ts-launcher ts-glass fixed right-6 z-40 inline-flex h-14 min-w-14 cursor-pointer items-center rounded-full',
          'text-[15px] font-medium text-ink shadow-[var(--shadow-md)]',
          'transition-[padding] duration-300',
          isCompact ? 'justify-center px-3' : 'px-3 md:pr-5',
        )}
        style={{ bottom: LAUNCHER_BOTTOM }}
      >
        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg">
          <Mic className="h-4 w-4" strokeWidth={2.25} />
          <span className="absolute -top-px -right-px h-2 w-2 rounded-full bg-status-success border-2 border-bg" />
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
