import { m, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { BookingDay, BookingSlot } from '../../data/booking';
import { fade } from '../../utils/motion';
import {
  CAL_VIEWS,
  WEEKDAY_FULL,
  WEEKDAY_ONE,
  WEEKDAY_SHORT,
  type CalView,
  formatHour,
  formatTime,
  hourInZone,
  monthCells,
  monthKey,
  monthTitle,
  weekDays,
  weekdayIndex,
} from './calendar';

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

function SlotButtons({
  slots,
  timezone,
  hour24,
  onPick,
}: {
  slots: BookingSlot[];
  timezone: string;
  hour24: boolean;
  onPick: (slot: BookingSlot) => void;
}) {
  return slots.map((slot) => (
    <button key={slot.start} type="button" onClick={() => onPick(slot)} className="ts-slot">
      {formatTime(slot.start, timezone, hour24)}
    </button>
  ));
}

function BookCallWeek({
  dates,
  waiting,
  selectedDate,
  daysByDate,
  timezone,
  hour24,
  onPickDay,
  onPickSlot,
}: {
  dates: string[];
  waiting: boolean;
  selectedDate: string | null;
  daysByDate: Map<string, BookingDay>;
  timezone: string;
  hour24: boolean;
  onPickDay: (date: string) => void;
  onPickSlot: (slot: BookingSlot) => void;
}) {
  return (
    <m.div {...fade} className="ts-week">
      {dates.map((date) => {
        const day = daysByDate.get(date);
        const open = Boolean(day?.slots.length);
        return (
          <div key={date} className="ts-week-col" data-selected={date === selectedDate ? 'true' : undefined}>
            <button
              type="button"
              disabled={!open}
              onClick={() => onPickDay(date)}
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
              {waiting ? (
                Array.from({ length: 4 }, (_, index) => (
                  <span
                    key={`${date}-ph-${index}`}
                    data-cell
                    className="ts-slot ts-cal-loading pointer-events-none opacity-40"
                  />
                ))
              ) : day ? (
                <SlotButtons slots={day.slots} timezone={timezone} hour24={hour24} onPick={onPickSlot} />
              ) : null}
            </div>
          </div>
        );
      })}
    </m.div>
  );
}

function BookCallDay({
  waiting,
  selectedDay,
  timezone,
  hour24,
  onPickSlot,
}: {
  waiting: boolean;
  selectedDay: BookingDay | undefined;
  timezone: string;
  hour24: boolean;
  onPickSlot: (slot: BookingSlot) => void;
}) {
  return (
    <m.div {...fade} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
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
                <SlotButtons slots={group.slots} timezone={timezone} hour24={hour24} onPick={onPickSlot} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="m-0 text-[14px] text-muted">No times this window.</p>
      )}
    </m.div>
  );
}

function BookCallMonth({
  waiting,
  today,
  month,
  cells,
  selectedDate,
  selectedDay,
  daysByDate,
  hour24,
  timezone,
  onPickDay,
  onPickSlot,
}: {
  waiting: boolean;
  today: string;
  month: string;
  cells: string[];
  selectedDate: string | null;
  selectedDay: BookingDay | undefined;
  daysByDate: Map<string, BookingDay>;
  hour24: boolean;
  timezone: string;
  onPickDay: (date: string) => void;
  onPickSlot: (slot: BookingSlot) => void;
}) {
  const visibleCells = waiting ? monthCells(monthKey(today)) : cells;
  return (
    <m.div {...fade} className="flex min-h-0 flex-1 flex-col">
      <div className="ts-cal-grid shrink-0" role="grid" aria-label={monthTitle(month)}>
        {WEEKDAY_ONE.map((label, index) => (
          <span key={`${label}-${index}`} className="ts-cal-dow" aria-hidden="true">
            {label}
          </span>
        ))}
        {visibleCells.map((date) => {
          const inMonth = monthKey(date) === month;
          const open = daysByDate.has(date);
          return (
            <button
              key={date}
              type="button"
              role="gridcell"
              disabled={waiting || !open}
              onClick={() => onPickDay(date)}
              aria-selected={date === selectedDate}
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
            {waiting ? (
              Array.from({ length: 6 }, (_, index) => (
                <span
                  key={`slot-ph-${index}`}
                  data-cell
                  className="ts-slot ts-cal-loading pointer-events-none opacity-40"
                />
              ))
            ) : selectedDay ? (
              <SlotButtons slots={selectedDay.slots} timezone={timezone} hour24={hour24} onPick={onPickSlot} />
            ) : null}
          </div>
        ) : (
          <p className="m-0 text-[14px] text-muted">{selectedDate ? 'No times this window.' : 'Pick a day.'}</p>
        )}
      </div>
    </m.div>
  );
}

export function BookCallTimes({
  loadError,
  notice,
  onRetry,
  waiting,
  calView,
  onView,
  hour24,
  onHour24,
  canPrev,
  canNext,
  onStep,
  heading,
  timezone,
  today,
  month,
  cells,
  week,
  selectedDate,
  selectedDay,
  daysByDate,
  onPickDay,
  onPickSlot,
}: {
  loadError: string | null;
  notice: string | null;
  onRetry: () => void;
  waiting: boolean;
  calView: CalView;
  onView: (view: CalView) => void;
  hour24: boolean;
  onHour24: (next: boolean) => void;
  canPrev: boolean;
  canNext: boolean;
  onStep: (delta: number) => void;
  heading: string;
  timezone: string;
  today: string;
  month: string;
  cells: string[];
  week: string[];
  selectedDate: string | null;
  selectedDay: BookingDay | undefined;
  daysByDate: Map<string, BookingDay>;
  onPickDay: (date: string) => void;
  onPickSlot: (slot: BookingSlot) => void;
}) {
  const weekDates = waiting ? weekDays(today) : week;

  return (
    <m.div {...fade} className="flex h-full min-h-0 flex-col">
      {loadError ? (
        <div className="flex h-full flex-col items-start justify-center gap-4">
          <p className="m-0 text-[14px] text-[color:var(--status-error-text)]">{loadError}</p>
          <button type="button" onClick={onRetry} className="ts-pill-ghost h-11 px-5 text-[14px]">
            Try again
          </button>
        </div>
      ) : (
        <>
      {notice ? (
        <p className="mb-4 text-[13px] text-[color:var(--status-error-text)]">{notice}</p>
      ) : null}
      <div className="mb-5 flex shrink-0 items-center gap-2 pr-12">
        <button
          type="button"
          aria-label="Previous"
          disabled={!canPrev}
          onClick={() => onStep(-1)}
          className="ts-icon-btn flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-ink hover:bg-ink/10 disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="m-0 truncate text-[15px] font-medium text-ink">{heading}</p>
          <p className="m-0 truncate text-[12px] text-muted">Times shown in {timezone}</p>
        </div>
        <button
          type="button"
          aria-label="Next"
          disabled={!canNext}
          onClick={() => onStep(1)}
          className="ts-icon-btn flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-ink hover:bg-ink/10 disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-6 flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div className="ts-seg" role="tablist" aria-label="Calendar view">
          {CAL_VIEWS.map((view) => (
            <button key={view} type="button" role="tab" aria-selected={calView === view} onClick={() => onView(view)}>
              {view[0].toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
        <div className="ts-seg" role="group" aria-label="Time format">
          <button type="button" aria-pressed={!hour24} onClick={() => onHour24(false)}>
            12:00
          </button>
          <button type="button" aria-pressed={hour24} onClick={() => onHour24(true)}>
            24:00
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <AnimatePresence mode="wait">
          {calView === 'week' ? (
            <BookCallWeek
              key="week"
              dates={weekDates}
              waiting={waiting}
              selectedDate={selectedDate}
              daysByDate={daysByDate}
              timezone={timezone}
              hour24={hour24}
              onPickDay={onPickDay}
              onPickSlot={onPickSlot}
            />
          ) : calView === 'day' ? (
            <BookCallDay
              key="day"
              waiting={waiting}
              selectedDay={selectedDay}
              timezone={timezone}
              hour24={hour24}
              onPickSlot={onPickSlot}
            />
          ) : (
            <BookCallMonth
              key="month"
              waiting={waiting}
              today={today}
              month={month}
              cells={cells}
              selectedDate={selectedDate}
              selectedDay={selectedDay}
              daysByDate={daysByDate}
              hour24={hour24}
              timezone={timezone}
              onPickDay={onPickDay}
              onPickSlot={onPickSlot}
            />
          )}
        </AnimatePresence>
      </div>
        </>
      )}
    </m.div>
  );
}
