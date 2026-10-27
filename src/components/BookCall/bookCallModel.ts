import type { BookingDay, BookingSlot } from '../../data/booking';
import {
  type CalView,
  monthKey,
  shiftMonth,
  steppedDate,
} from './calendar';

export function dateBounds(days: BookingDay[]) {
  return {
    minDate: days[0]?.date ?? null,
    maxDate: days[days.length - 1]?.date ?? null,
  };
}

export function bookingStep(bookedStart: string | null, selectedSlot: BookingSlot | null) {
  if (bookedStart) return 'done' as const;
  if (selectedSlot) return 'details' as const;
  return 'times' as const;
}

export function visibleMonth(cursorMonth: string | null, selectedDate: string | null, today: string) {
  if (cursorMonth) return cursorMonth;
  return monthKey(selectedDate ?? today);
}

export function applyPickDay(
  date: string,
  daysByDate: Map<string, BookingDay>,
  submitting: boolean,
  bookedStart: string | null,
  setSelectedDate: (date: string) => void,
  setCursorMonth: (month: string) => void,
  setSelectedSlot: (slot: BookingSlot | null) => void,
  setSubmitError: (error: string | null) => void,
) {
  if (!daysByDate.has(date) || submitting || bookedStart) return;
  setSelectedDate(date);
  setCursorMonth(monthKey(date));
  setSelectedSlot(null);
  setSubmitError(null);
}

export function applyPickSlot(
  slot: BookingSlot,
  submitting: boolean,
  bookedStart: string | null,
  setSelectedSlot: (slot: BookingSlot) => void,
  setSubmitError: (error: string | null) => void,
) {
  if (submitting || bookedStart) return;
  setSelectedSlot(slot);
  setSubmitError(null);
}

export function applyView(
  next: CalView,
  selectedDate: string | null,
  setCalView: (view: CalView) => void,
  setCursorMonth: (month: string) => void,
) {
  setCalView(next);
  if (next === 'month' && selectedDate) setCursorMonth(monthKey(selectedDate));
}

export function applyStep(
  delta: number,
  calView: CalView,
  month: string,
  selectedDate: string | null,
  minDate: string | null,
  maxDate: string | null,
  daysByDate: Map<string, BookingDay>,
  setCursorMonth: (month: string) => void,
  setSelectedDate: (date: string | null) => void,
  setSelectedSlot: (slot: BookingSlot | null) => void,
) {
  if (calView === 'month') {
    setCursorMonth(shiftMonth(month, delta));
    setSelectedDate(null);
    setSelectedSlot(null);
    return;
  }
  if (!selectedDate) return;
  const next = steppedDate(calView, selectedDate, delta, minDate, maxDate, daysByDate);
  setSelectedDate(next);
  setCursorMonth(monthKey(next));
  setSelectedSlot(null);
}
