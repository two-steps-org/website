import assert from 'node:assert/strict';
import test from 'node:test';
import { addYmd, canShiftCalendar, monthCells, shiftMonth, steppedDate } from './calendar.ts';
import { applyPickDay, applyPickSlot, applyStep, dateBounds } from './bookCallModel.ts';

test('calendar date edges', () => {
  assert.equal(shiftMonth('2026-01', -1), '2025-12');
  assert.equal(shiftMonth('2026-12', 1), '2027-01');
  assert.equal(addYmd('2026-12-31', 1), '2027-01-01');
  assert.equal(addYmd('2024-02-28', 1), '2024-02-29');
  assert.equal(addYmd('2026-02-28', 1), '2026-03-01');
  assert.equal(monthCells('2026-02')[0], '2026-02-01');
  assert.equal(monthCells('2026-01')[0] < '2026-01-01', true);
  assert.equal(canShiftCalendar(-1, 'month', '2026-10', null, null, null), false);
  const open = new Set(['2026-10-08']);
  assert.equal(steppedDate('week', '2026-10-14', -1, '2026-10-04', '2026-10-20', open), '2026-10-08');
  assert.equal(steppedDate('day', '2026-10-08', 1, '2026-10-04', '2026-10-08', open), '2026-10-08');
});

test('pick guards and month step clears the selected day', () => {
  assert.deepEqual(dateBounds([]), { minDate: null, maxDate: null });
  const days = new Map([['2026-10-08', { date: '2026-10-08', label: 'Thu', slots: [{ start: 's', label: '10:00' }] }]]);
  const calls: unknown[][] = [];
  const spy = (name: string) => (value: unknown) => { calls.push([name, value]); };
  applyPickDay('2026-10-09', days, false, null, spy('date'), spy('month'), spy('slot'), spy('err'));
  applyPickDay('2026-10-08', days, true, null, spy('date'), spy('month'), spy('slot'), spy('err'));
  applyPickDay('2026-10-08', days, false, 'booked', spy('date'), spy('month'), spy('slot'), spy('err'));
  applyPickSlot({ start: 's', label: '10:00' }, true, null, spy('slot'), spy('err'));
  assert.deepEqual(calls, []);
  applyStep(1, 'month', '2026-10', '2026-10-08', '2026-10-08', '2026-10-08', days, spy('month'), spy('date'), spy('slot'));
  assert.deepEqual(calls, [['month', '2026-11'], ['date', null], ['slot', null]]);
});
