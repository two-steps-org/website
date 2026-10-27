import React, { useEffect, useMemo, useRef, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { BookingAvailability, BookingDay, BookingSlot } from '../../data/booking';
import { fade, modalPanel } from '../../utils/motion';
import {
  type CalView,
  calendarHeading,
  canShiftCalendar,
  monthCells,
  monthKey,
  todayYmd,
  weekDays,
} from './calendar';
import {
  applyPickDay,
  applyPickSlot,
  applyStep,
  applyView,
  bookingStep,
  dateBounds,
  visibleMonth,
} from './bookCallModel';
import { BookCallDetails } from './BookCallDetails';
import { BookCallDone } from './BookCallDone';
import { BookCallIntro } from './BookCallIntro';
import { BookCallTimes } from './BookCallTimes';

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
  const days = availability?.days ?? [];
  const daysByDate = useMemo(() => {
    const map = new Map<string, BookingDay>();
    (availability?.days ?? []).forEach((day) => map.set(day.date, day));
    return map;
  }, [availability]);
  const { minDate, maxDate } = dateBounds(days);
  const selectedDay = selectedDate ? daysByDate.get(selectedDate) : undefined;
  const waiting = loading || (isOpen && !availability && !loadError);
  const step = bookingStep(bookedStart, selectedSlot);
  const month = visibleMonth(cursorMonth, selectedDate, today);
  const cells = monthCells(month);
  const week = weekDays(selectedDate ?? today);
  const canPrev = canShiftCalendar(-1, calView, month, selectedDate, minDate, maxDate);
  const canNext = canShiftCalendar(1, calView, month, selectedDate, minDate, maxDate);
  const heading = calendarHeading(calView, selectedDate, month);

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

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

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
    let ignore = false;
    const controller = new AbortController();
    setLoading(true);
    setLoadError(null);
    void (async () => {
      try {
        const res = await fetch('/api/book-call', { signal: controller.signal });
        if (ignore) return;
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          if (ignore) return;
          throw new Error(data.error || 'Could not load times.');
        }
        const data = (await res.json()) as BookingAvailability;
        if (ignore) return;
        setAvailability(data);
        const next = data.days[0]?.date ?? null;
        setSelectedDate((current) => {
          if (current && data.days.some((day) => day.date === current)) return current;
          return next;
        });
        setCursorMonth((current) => current ?? (next ? monthKey(next) : null));
      } catch (error) {
        if (ignore) return;
        if ((error as { name?: string }).name === 'AbortError') return;
        setAvailability(null);
        setLoadError(error instanceof Error ? error.message : 'Could not load times.');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [isOpen, reloadKey]);

  const pickDay = (date: string) =>
    applyPickDay(
      date,
      daysByDate,
      submitting,
      bookedStart,
      setSelectedDate,
      setCursorMonth,
      setSelectedSlot,
      setSubmitError,
    );

  const pickSlot = (slot: BookingSlot) =>
    applyPickSlot(slot, submitting, bookedStart, setSelectedSlot, setSubmitError);

  const goView = (next: CalView) => applyView(next, selectedDate, setCalView, setCursorMonth);

  const stepCal = (delta: number) =>
    applyStep(
      delta,
      calView,
      month,
      selectedDate,
      minDate,
      maxDate,
      daysByDate,
      setCursorMonth,
      setSelectedDate,
      setSelectedSlot,
    );

  const retry = () => setReloadKey((key) => key + 1);

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
              className="pointer-events-auto relative flex max-h-[min(900px,92dvh)] min-h-0 w-full max-w-[1100px] flex-col overflow-y-auto ts-modal-shell lg:h-[min(780px,88dvh)] lg:flex-row lg:overflow-hidden"
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="ts-icon-btn absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-bg/70 text-ink backdrop-blur-md hover:bg-ink/10 lg:right-4 lg:top-4"
              >
                <X className="h-4 w-4" />
              </button>

              <BookCallIntro durationMin={availability?.durationMin} />

              <div className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-bg px-6 pb-6 pt-16 sm:px-8 sm:pb-8 lg:overflow-hidden lg:px-10 lg:pb-10">
                <AnimatePresence mode="wait">
                  {step === 'done' && bookedStart ? (
                    <BookCallDone
                      key="done"
                      bookedStart={bookedStart}
                      timezone={timezone}
                      hour24={hour24}
                      onClose={onClose}
                    />
                  ) : step === 'details' && selectedSlot ? (
                    <BookCallDetails
                      key="details"
                      slot={selectedSlot}
                      timezone={timezone}
                      hour24={hour24}
                      name={name}
                      email={email}
                      submitting={submitting}
                      submitError={submitError}
                      nameRef={nameRef}
                      trapRef={trapRef}
                      onName={setName}
                      onEmail={setEmail}
                      onBack={() => {
                        setSelectedSlot(null);
                        setSubmitError(null);
                      }}
                      onSubmitError={setSubmitError}
                      onSubmitting={setSubmitting}
                      onTaken={() => {
                        setSelectedSlot(null);
                        retry();
                      }}
                      onBooked={setBookedStart}
                    />
                  ) : (
                    <BookCallTimes
                      key="times"
                      loadError={loadError}
                      notice={submitError}
                      onRetry={retry}
                      waiting={waiting}
                      calView={calView}
                      onView={goView}
                      hour24={hour24}
                      onHour24={setHour24}
                      canPrev={canPrev}
                      canNext={canNext}
                      onStep={stepCal}
                      heading={heading}
                      timezone={timezone}
                      today={today}
                      month={month}
                      cells={cells}
                      week={week}
                      selectedDate={selectedDate}
                      selectedDay={selectedDay}
                      daysByDate={daysByDate}
                      onPickDay={pickDay}
                      onPickSlot={pickSlot}
                    />
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
