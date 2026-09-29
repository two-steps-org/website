import React, { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { BookingAvailability, BookingDay, BookingSlot } from '../../data/booking';
import { fade, modalPanel } from '../../utils/motion';
import {
  WEEKDAY_FULL,
  WEEKDAY_ONE,
  WEEKDAY_SHORT,
  addYmd,
  dayTitle,
  formatHour,
  formatSlot,
  formatTime,
  hourInZone,
  monthCells,
  monthKey,
  monthTitle,
  shiftMonth,
  startOfWeek,
  todayYmd,
  weekDays,
  weekdayIndex,
} from './calendar';

const POINTS = ['30 minutes', 'No pitch deck', 'One clear next step'] as const;
const VIEWS = ['month', 'week', 'day'] as const;
type CalView = (typeof VIEWS)[number];

function emailOk(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function weekdayShort(ymd: string, timeZone: string) {
  const [year, month, day] = ymd.split('-').map(Number);
  const label = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' }).format(
    new Date(Date.UTC(year, month - 1, day, 12, 0, 0)),
  );
  return WEEKDAY_SHORT.includes(label as (typeof WEEKDAY_SHORT)[number]) ? label : label.slice(0, 3);
}

function groupSlots(slots: BookingSlot[], timeZone: string) {
  const groups: { hour: string; slots: BookingSlot[] }[] = [];
  slots.forEach((slot) => {
    const hour = String(hourInZone(slot.start, timeZone));
    const last = groups[groups.length - 1];
    if (last?.hour === hour) last.slots.push(slot);
    else groups.push({ hour, slots: [slot] });
  });
  return groups;
}

const BookCallModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const trapRef = useRef<HTMLInputElement>(null);
  const scrollPosition = useRef(0);
  const [availability, setAvailability] = useState<BookingAvailability | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookedStart, setBookedStart] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [calView, setCalView] = useState<CalView>('month');
  const [hour24, setHour24] = useState(false);
  const [cursorMonth, setCursorMonth] = useState<string | null>(null);

  const timezone = availability?.timezone ?? 'Asia/Jerusalem';
  const today = todayYmd(timezone);
  const daysByDate = useMemo(() => {
    const map = new Map<string, BookingDay>();
    availability?.days.forEach((day) => map.set(day.date, day));
    return map;
  }, [availability]);
  const days = availability?.days ?? [];
  const minDate = days[0]?.date ?? null;
  const maxDate = days[days.length - 1]?.date ?? null;
  const selectedDay = selectedDate ? daysByDate.get(selectedDate) : undefined;
  const waiting = loading || (isOpen && !availability && !loadError);
  const step = bookedStart ? 'done' : selectedSlot ? 'details' : 'times';
  const month = cursorMonth ?? (selectedDate ? monthKey(selectedDate) : monthKey(today));
  const cells = monthCells(month);
  const week = selectedDate ? weekDays(selectedDate) : weekDays(today);

  const canPrev =
    !!minDate &&
    (calView === 'month'
      ? month > monthKey(minDate)
      : calView === 'week'
        ? startOfWeek(selectedDate ?? minDate) > startOfWeek(minDate)
        : (selectedDate ?? minDate) > minDate);
  const canNext =
    !!maxDate &&
    (calView === 'month'
      ? month < monthKey(maxDate)
      : calView === 'week'
        ? startOfWeek(selectedDate ?? maxDate) < startOfWeek(maxDate)
        : (selectedDate ?? maxDate) < maxDate);

  useEffect(() => {
    if (!isOpen) return;
    scrollPosition.current = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition.current}px`;
    document.body.style.width = '100%';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';
      window.scrollTo({ top: scrollPosition.current, behavior: 'instant' });
    };
  }, [isOpen]);

  const onEscapeClose = useEffectEvent(onClose);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscapeClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onEscapeClose]);

  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (step === 'details') nameRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setEmail('');
      if (trapRef.current) trapRef.current.value = '';
      setSelectedSlot(null);
      setSubmitError(null);
      setBookedStart(null);
      setSelectedDate(null);
      setLoadError(null);
      setAvailability(null);
      setCalView('month');
      setHour24(false);
      setCursorMonth(null);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setLoadError(null);
    void (async () => {
      try {
        const res = await fetch('/api/book-call', { signal: controller.signal });
        const data = (await res.json()) as BookingAvailability & { error?: string };
        if (!res.ok) throw new Error(data.error || 'Could not load times.');
        setAvailability(data);
        const next = data.days[0]?.date ?? null;
        setSelectedDate((current) => {
          if (current && data.days.some((day) => day.date === current)) return current;
          return next;
        });
        setCursorMonth((current) => current ?? (next ? monthKey(next) : null));
      } catch (error) {
        if ((error as { name?: string }).name === 'AbortError') return;
        setAvailability(null);
        setLoadError(error instanceof Error ? error.message : 'Could not load times.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [isOpen, reloadKey]);

  const pickDay = (date: string) => {
    if (!daysByDate.has(date) || submitting || bookedStart) return;
    setSelectedDate(date);
    setCursorMonth(monthKey(date));
    setSelectedSlot(null);
    setSubmitError(null);
  };

  const pickSlot = (slot: BookingSlot) => {
    if (submitting || bookedStart) return;
    setSelectedSlot(slot);
    setSubmitError(null);
  };

  const goView = (next: CalView) => {
    setCalView(next);
    if (next === 'month' && selectedDate) setCursorMonth(monthKey(selectedDate));
  };

  const clampDate = (date: string) => {
    if (minDate && date < minDate) return minDate;
    if (maxDate && date > maxDate) return maxDate;
    return date;
  };

  const nearestOpen = (date: string) => {
    if (daysByDate.has(date)) return date;
    const around = weekDays(date);
    return around.find((day) => daysByDate.has(day)) ?? date;
  };

  const stepCal = (delta: number) => {
    if (calView === 'month') {
      setCursorMonth(shiftMonth(month, delta));
      return;
    }
    if (!selectedDate) return;
    const next =
      calView === 'week' ? nearestOpen(clampDate(addYmd(selectedDate, delta * 7))) : clampDate(addYmd(selectedDate, delta));
    setSelectedDate(next);
    setCursorMonth(monthKey(next));
    setSelectedSlot(null);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedSlot || submitting) return;
    if (name.trim().length < 2) {
      setSubmitError('Tell us your name.');
      return;
    }
    if (!emailOk(email.trim())) {
      setSubmitError('Use a real email.');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/book-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          start: selectedSlot.start,
          ts_hp: trapRef.current?.value ?? '',
        }),
      });
      const text = await res.text();
      let data: { error?: string; start?: string; dryRun?: boolean } = {};
      if (text) {
        try {
          data = JSON.parse(text) as typeof data;
        } catch {
          throw new Error('Could not book that time.');
        }
      }
      if (res.status === 409) {
        setSubmitError(data.error || 'That time was just taken. Pick another.');
        setSelectedSlot(null);
        setReloadKey((key) => key + 1);
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Could not book that time.');
      if (data.dryRun || !data.start) throw new Error('Booking is not connected yet.');
      setBookedStart(data.start);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not book that time.');
    } finally {
      setSubmitting(false);
    }
  };

  const slotButtons = (slots: BookingSlot[]) =>
    slots.map((slot) => (
      <button key={slot.start} type="button" onClick={() => pickSlot(slot)} className="ts-slot">
        {formatTime(slot.start, timezone, hour24)}
      </button>
    ));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <m.button
            type="button"
            aria-label="Close booking dialog"
            onClick={onClose}
            {...fade}
            className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
          />
          <div className="pointer-events-none flex h-full w-full items-center justify-center p-3 mobile-safe-px mobile-safe-pt mobile-safe-pb sm:p-6">
            <m.div
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="book-call-title"
              {...modalPanel}
              className="pointer-events-auto relative flex max-h-[min(900px,92dvh)] min-h-0 w-full max-w-[1100px] flex-col overflow-hidden ts-modal-shell lg:h-[min(780px,88dvh)] lg:flex-row"
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="ts-icon-btn absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-bg/70 text-ink backdrop-blur-md hover:bg-ink/10 lg:right-4 lg:top-4"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex shrink-0 flex-col justify-between gap-6 border-b border-line p-6 pr-14 sm:p-8 lg:w-[min(42%,420px)] lg:border-b-0 lg:border-r lg:p-10">
                <div>
                  <p className="ts-eyebrow mb-4">Start a conversation</p>
                  <h2 id="book-call-title" className="ts-display m-0 max-w-[10ch] text-[clamp(32px,4vw,52px)] text-ink">
                    Tell us the <em className="sig">vision</em>.
                  </h2>
                  <p className="ts-body mt-5 mb-0 max-w-[34ch]">
                    We look at the work together and whether we can help. No pitch. No deck.
                  </p>
                </div>
                <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[13px] font-medium text-muted">
                  {POINTS.map((point) => (
                    <li key={point} className="flex items-center gap-3">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-ink" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-bg px-6 pb-6 pt-16 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">
                <AnimatePresence mode="wait">
                  {step === 'done' && bookedStart ? (
                    <m.div key="done" {...fade} className="flex h-full min-h-[280px] max-w-[360px] flex-col justify-center">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-bg">
                        <Check className="h-5 w-5" strokeWidth={2.2} />
                      </span>
                      <p className="ts-h3 mt-6 mb-0 text-ink">You're booked.</p>
                      <p className="ts-body mt-3 mb-8">{formatSlot(bookedStart, timezone, hour24)}</p>
                      <button type="button" onClick={onClose} className="ts-pill h-12 w-fit px-8 text-[15px]">
                        Close
                      </button>
                    </m.div>
                  ) : step === 'details' && selectedSlot ? (
                    <m.form
                      key="details"
                      {...fade}
                      onSubmit={onSubmit}
                      className="relative flex h-full min-h-[280px] max-w-[360px] flex-col justify-center"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSlot(null);
                          setSubmitError(null);
                        }}
                        className="ts-icon-btn mb-8 flex items-center gap-2 self-start text-[13px] font-medium text-muted hover:text-ink"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        {formatSlot(selectedSlot.start, timezone, hour24)}
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
                          onChange={(event) => setName(event.target.value)}
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
                          onChange={(event) => setEmail(event.target.value)}
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
                        {submitting ? 'Booking…' : `Book ${formatTime(selectedSlot.start, timezone, hour24)}`}
                      </button>
                    </m.form>
                  ) : (
                    <m.div key="times" {...fade} className="flex h-full min-h-0 flex-col">
                      {loadError ? (
                        <div className="flex h-full flex-col items-start justify-center gap-4">
                          <p className="m-0 text-[14px] text-[color:var(--status-error-text)]">{loadError}</p>
                          <button
                            type="button"
                            onClick={() => setReloadKey((key) => key + 1)}
                            className="ts-pill-ghost h-11 px-5 text-[14px]"
                          >
                            Try again
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="mb-5 flex shrink-0 items-center gap-2 pr-12">
                            <button
                              type="button"
                              aria-label="Previous"
                              disabled={!canPrev}
                              onClick={() => stepCal(-1)}
                              className="ts-icon-btn flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-ink disabled:pointer-events-none disabled:opacity-30"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <p className="m-0 min-w-0 flex-1 truncate text-[15px] font-medium text-ink">
                              {calView === 'day' && selectedDate
                                ? dayTitle(selectedDate)
                                : calView === 'week' && selectedDate
                                  ? monthTitle(monthKey(selectedDate))
                                  : monthTitle(month)}
                            </p>
                            <button
                              type="button"
                              aria-label="Next"
                              disabled={!canNext}
                              onClick={() => stepCal(1)}
                              className="ts-icon-btn flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-ink disabled:pointer-events-none disabled:opacity-30"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mb-6 flex shrink-0 flex-wrap items-center justify-between gap-3">
                            <div className="ts-seg" role="tablist" aria-label="Calendar view">
                              {VIEWS.map((view) => (
                                <button
                                  key={view}
                                  type="button"
                                  role="tab"
                                  aria-selected={calView === view}
                                  onClick={() => goView(view)}
                                >
                                  {view[0].toUpperCase() + view.slice(1)}
                                </button>
                              ))}
                            </div>
                            <div className="ts-seg" role="group" aria-label="Time format">
                              <button type="button" aria-pressed={!hour24} onClick={() => setHour24(false)}>
                                12:00
                              </button>
                              <button type="button" aria-pressed={hour24} onClick={() => setHour24(true)}>
                                24:00
                              </button>
                            </div>
                          </div>

                          <div className="flex min-h-0 flex-1 flex-col">
                            <AnimatePresence mode="wait">
                              {calView === 'week' ? (
                                <m.div key="week" {...fade} className="ts-week">
                                  {(waiting ? weekDays(today) : week).map((date) => {
                                    const day = daysByDate.get(date);
                                    const open = Boolean(day?.slots.length);
                                    return (
                                      <div
                                        key={date}
                                        className="ts-week-col"
                                        data-selected={date === selectedDate ? 'true' : undefined}
                                      >
                                        <button
                                          type="button"
                                          disabled={!open}
                                          onClick={() => pickDay(date)}
                                          className="ts-week-head ts-icon-btn w-full"
                                          aria-pressed={date === selectedDate}
                                          aria-label={`${weekdayShort(date, timezone)} ${Number(date.slice(8))}`}
                                        >
                                          <span className="text-[10px] font-medium tracking-[0.08em] uppercase">
                                            {WEEKDAY_ONE[weekdayIndex(date)]}
                                          </span>
                                          <span className="text-[15px] font-medium">{Number(date.slice(8))}</span>
                                        </button>
                                        <div className="ts-week-slots">
                                          {waiting
                                            ? Array.from({ length: 4 }, (_, index) => (
                                                <span
                                                  key={`${date}-ph-${index}`}
                                                  data-cell
                                                  className="ts-slot ts-cal-loading pointer-events-none opacity-40"
                                                />
                                              ))
                                            : day
                                              ? slotButtons(day.slots)
                                              : null}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </m.div>
                              ) : calView === 'day' ? (
                                <m.div key="day" {...fade} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                                  {waiting ? (
                                    <div className="ts-day-agenda">
                                      {Array.from({ length: 4 }, (_, index) => (
                                        <div key={`hour-ph-${index}`} className="ts-day-hour">
                                          <span data-cell className="ts-cal-loading h-4 rounded-full opacity-40" />
                                          <span data-cell className="ts-slot ts-cal-loading pointer-events-none opacity-40" />
                                        </div>
                                      ))}
                                    </div>
                                  ) : selectedDay ? (
                                    <div className="ts-day-agenda">
                                      {groupSlots(selectedDay.slots, timezone).map((group) => (
                                        <div key={group.hour} className="ts-day-hour">
                                          <span className="pt-2 text-[12px] font-medium text-muted">
                                            {formatHour(Number(group.hour), hour24)}
                                          </span>
                                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                            {slotButtons(group.slots)}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="m-0 text-[14px] text-muted">No times this window.</p>
                                  )}
                                </m.div>
                              ) : (
                                <m.div key="month" {...fade} className="flex min-h-0 flex-1 flex-col">
                                  <div className="ts-cal-grid shrink-0" role="grid" aria-label={monthTitle(month)}>
                                    {WEEKDAY_ONE.map((label, index) => (
                                      <span key={`${label}-${index}`} className="ts-cal-dow" aria-hidden="true">
                                        {label}
                                      </span>
                                    ))}
                                    {(waiting ? monthCells(monthKey(today)) : cells).map((date) => {
                                      const inMonth = monthKey(date) === month;
                                      const open = daysByDate.has(date);
                                      return (
                                        <button
                                          key={date}
                                          type="button"
                                          role="gridcell"
                                          disabled={waiting || !open}
                                          onClick={() => pickDay(date)}
                                          aria-pressed={date === selectedDate}
                                          aria-label={`${WEEKDAY_FULL[weekdayIndex(date)]} ${Number(date.slice(8))}`}
                                          data-outside={inMonth ? undefined : ''}
                                          data-today={date === today ? '' : undefined}
                                          className="ts-cal-cell"
                                        >
                                          {Number(date.slice(8))}
                                          {open ? <span className="ts-cal-dot" /> : <span className="h-[3px] w-[3px] mt-[3px]" />}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <div className="mt-6 min-h-0 flex-1 overflow-y-auto overscroll-contain">
                                    {selectedDay || waiting ? (
                                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                        {waiting
                                          ? Array.from({ length: 6 }, (_, index) => (
                                              <span
                                                key={`slot-ph-${index}`}
                                                data-cell
                                                className="ts-slot ts-cal-loading pointer-events-none opacity-40"
                                              />
                                            ))
                                          : selectedDay
                                            ? slotButtons(selectedDay.slots)
                                            : null}
                                      </div>
                                    ) : (
                                      <p className="m-0 text-[14px] text-muted">No times this window.</p>
                                    )}
                                  </div>
                                </m.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </>
                      )}
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </m.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookCallModal;
