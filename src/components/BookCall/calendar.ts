export const CAL_VIEWS = ['month', 'week', 'day'] as const;
export type CalView = (typeof CAL_VIEWS)[number];

const monthTitleFormat = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
const dayTitleFormat = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

export const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export const WEEKDAY_ONE = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
export const WEEKDAY_FULL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export function pad2(n: number) {
  return String(n).padStart(2, '0');
}

export function addYmd(ymd: string, days: number) {
  const [year, month, day] = ymd.split('-').map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return `${next.getUTCFullYear()}-${pad2(next.getUTCMonth() + 1)}-${pad2(next.getUTCDate())}`;
}

export function weekdayIndex(ymd: string) {
  const [year, month, day] = ymd.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function startOfWeek(ymd: string) {
  return addYmd(ymd, -weekdayIndex(ymd));
}

export function weekDays(ymd: string) {
  const start = startOfWeek(ymd);
  return Array.from({ length: 7 }, (_, index) => addYmd(start, index));
}

export function monthKey(ymd: string) {
  return ymd.slice(0, 7);
}

export function shiftMonth(key: string, delta: number) {
  const [year, month] = key.split('-').map(Number);
  const next = new Date(Date.UTC(year, month - 1 + delta, 1));
  return `${next.getUTCFullYear()}-${pad2(next.getUTCMonth() + 1)}`;
}

export function monthTitle(key: string) {
  const [year, month] = key.split('-').map(Number);
  return monthTitleFormat.format(new Date(year, month - 1, 1));
}

export function monthCells(key: string) {
  const [year, month] = key.split('-').map(Number);
  const first = `${year}-${pad2(month)}-01`;
  const last = `${year}-${pad2(month)}-${pad2(new Date(Date.UTC(year, month, 0)).getUTCDate())}`;
  const start = startOfWeek(first);
  const end = addYmd(last, 6 - weekdayIndex(last));
  const cells: string[] = [];
  for (let cursor = start; cursor <= end; cursor = addYmd(cursor, 1)) cells.push(cursor);
  return cells;
}

export function todayYmd(timeZone: string) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export function dayTitle(ymd: string) {
  const [year, month, day] = ymd.split('-').map(Number);
  return dayTitleFormat.format(new Date(year, month - 1, day));
}

export function calendarHeading(view: CalView, selectedDate: string | null, month: string) {
  if (view === 'day' && selectedDate) return dayTitle(selectedDate);
  if (view === 'week' && selectedDate) return monthTitle(monthKey(selectedDate));
  return monthTitle(month);
}

export function canShiftCalendar(
  delta: number,
  view: CalView,
  month: string,
  selectedDate: string | null,
  minDate: string | null,
  maxDate: string | null,
) {
  const bound = delta < 0 ? minDate : maxDate;
  if (!bound) return false;
  if (view === 'month') return delta < 0 ? month > monthKey(bound) : month < monthKey(bound);
  const cursor = view === 'week' ? startOfWeek(selectedDate ?? bound) : (selectedDate ?? bound);
  const edge = view === 'week' ? startOfWeek(bound) : bound;
  return delta < 0 ? cursor > edge : cursor < edge;
}

export function clampYmd(date: string, minDate: string | null, maxDate: string | null) {
  if (minDate && date < minDate) return minDate;
  if (maxDate && date > maxDate) return maxDate;
  return date;
}

export function nearestOpenDay(date: string, openDates: { has(date: string): boolean }) {
  if (openDates.has(date)) return date;
  return weekDays(date).find((day) => openDates.has(day)) ?? date;
}

export function steppedDate(
  view: 'week' | 'day',
  selectedDate: string,
  delta: number,
  minDate: string | null,
  maxDate: string | null,
  openDates: { has(date: string): boolean },
) {
  const shifted = addYmd(selectedDate, view === 'week' ? delta * 7 : delta);
  const clamped = clampYmd(shifted, minDate, maxDate);
  return view === 'week' ? nearestOpenDay(clamped, openDates) : clamped;
}

const formatCache = new Map<string, Intl.DateTimeFormat>();

function cachedFormat(key: string, options: Intl.DateTimeFormatOptions) {
  const existing = formatCache.get(key);
  if (existing) return existing;
  const format = new Intl.DateTimeFormat('en-US', options);
  formatCache.set(key, format);
  return format;
}

export function hourInZone(start: string, timeZone: string) {
  const hour = cachedFormat(`hour|${timeZone}`, {
    timeZone,
    hour: 'numeric',
    hourCycle: 'h23',
  })
    .formatToParts(new Date(start))
    .find((part) => part.type === 'hour')?.value;
  return Number(hour);
}

export function formatHour(hour: number, hour24: boolean) {
  if (hour24) return `${pad2(hour)}:00`;
  return `${hour % 12 || 12} ${hour >= 12 ? 'PM' : 'AM'}`;
}

export function formatTime(start: string, timeZone: string, hour24: boolean) {
  return cachedFormat(`time|${timeZone}|${hour24}`, {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: !hour24,
    hourCycle: hour24 ? 'h23' : 'h12',
  }).format(new Date(start));
}

export function formatSlot(start: string, timeZone: string, hour24: boolean) {
  return cachedFormat(`slot|${timeZone}|${hour24}`, {
    timeZone,
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: !hour24,
    hourCycle: hour24 ? 'h23' : 'h12',
  }).format(new Date(start));
}

