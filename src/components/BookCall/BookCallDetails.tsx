import { useEffect, useRef, type FormEvent, RefObject } from 'react';
import { m } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import type { BookingSlot } from '../../data/booking';
import { fade } from '../../utils/motion';
import { formatSlot, formatTime } from './calendar';

function emailOk(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type BookingResult = { ok: true; start: string } | { ok: false; taken: boolean; error: string };
type BookingPayload = { error?: string; start?: string };

async function bookingPayload(res: Response): Promise<BookingPayload> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as BookingPayload;
  } catch {
    throw new Error('Could not book that time.');
  }
}

async function requestBooking(input: {
  name: string;
  email: string;
  start: string;
  trap: string;
  signal: AbortSignal;
}): Promise<BookingResult> {
  try {
    const res = await fetch('/api/book-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        start: input.start,
        ts_hp: input.trap,
        source: typeof window === 'undefined' ? '' : window.location.pathname,
      }),
      signal: input.signal,
    });
    if (res.status === 409) {
      const data = await bookingPayload(res);
      return { ok: false, taken: true, error: data.error || 'That time was just taken. Pick another.' };
    }
    if (!res.ok) {
      const data = await bookingPayload(res);
      throw new Error(data.error || 'Could not book that time.');
    }
    const data = await bookingPayload(res);
    if (!data.start) throw new Error('Booking is not connected yet.');
    return { ok: true, start: data.start };
  } catch (error) {
    if (input.signal.aborted) {
      return { ok: false, taken: false, error: '' };
    }
    return {
      ok: false,
      taken: false,
      error: error instanceof Error ? error.message : 'Could not book that time.',
    };
  }
}

export function BookCallDetails({
  slot,
  timezone,
  hour24,
  name,
  email,
  submitting,
  submitError,
  nameRef,
  trapRef,
  onName,
  onEmail,
  onBack,
  onSubmitError,
  onSubmitting,
  onTaken,
  onBooked,
}: {
  slot: BookingSlot;
  timezone: string;
  hour24: boolean;
  name: string;
  email: string;
  submitting: boolean;
  submitError: string | null;
  nameRef: RefObject<HTMLInputElement | null>;
  trapRef: RefObject<HTMLInputElement | null>;
  onName: (value: string) => void;
  onEmail: (value: string) => void;
  onBack: () => void;
  onSubmitError: (message: string | null) => void;
  onSubmitting: (value: boolean) => void;
  onTaken: () => void;
  onBooked: (start: string) => void;
}) {
  const pending = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => () => abortRef.current?.abort(), []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (pending.current || submitting) return;
    pending.current = true;
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (trimmedName.length < 2) {
      pending.current = false;
      onSubmitError('Tell us your name.');
      return;
    }
    if (!emailOk(trimmedEmail)) {
      pending.current = false;
      onSubmitError('Use a real email.');
      return;
    }
    onSubmitting(true);
    onSubmitError(null);
    const controller = new AbortController();
    abortRef.current = controller;
    const result = await requestBooking({
      name: trimmedName,
      email: trimmedEmail,
      start: slot.start,
      trap: trapRef.current?.value ?? '',
      signal: controller.signal,
    });
    if (controller.signal.aborted) return;
    if (!result.ok && result.taken) {
      onSubmitError(result.error);
      onTaken();
    } else if (!result.ok) {
      onSubmitError(result.error);
    } else {
      onBooked(result.start);
    }
    pending.current = false;
    onSubmitting(false);
  };

  return (
    <m.form
      {...fade}
      onSubmit={onSubmit}
      className="relative flex h-full min-h-[280px] max-w-[360px] flex-col justify-center"
    >
      <button
        type="button"
        onClick={onBack}
        className="ts-icon-btn mb-8 flex items-center gap-2 self-start text-[13px] font-medium text-muted hover:text-ink"
      >
        <ChevronLeft className="h-4 w-4" />
        {formatSlot(slot.start, timezone, hour24)}
      </button>
      <input
        ref={trapRef}
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        name="ts_hp"
      />
      <label className="block">
        <span className="ts-eyebrow">Name</span>
        <input
          ref={nameRef}
          className="ts-field mt-2"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => onName(event.target.value)}
          required
        />
      </label>
      <label className="mt-5 block">
        <span className="ts-eyebrow">Email</span>
        <input
          className="ts-field mt-2"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(event) => onEmail(event.target.value)}
          required
        />
      </label>
      {submitError ? (
        <p className="mt-4 mb-0 text-[13px] text-[color:var(--status-error-text)]">{submitError}</p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="ts-pill mt-8 h-12 w-full text-[15px] disabled:pointer-events-none disabled:opacity-40"
      >
        {submitting ? 'Booking…' : `Book ${formatTime(slot.start, timezone, hour24)}`}
      </button>
    </m.form>
  );
}
