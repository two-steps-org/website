import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { describe, test } from 'node:test';

process.env.BOOK_TZ = 'Asia/Jerusalem';
process.env.BOOK_CALL_NO_CACHE = '1';
for (const key of ['GOOGLE_CALENDAR_ID', 'GOOGLE_CLIENT_EMAIL', 'GOOGLE_PRIVATE_KEY', 'GOOGLE_SERVICE_ACCOUNT_JSON']) {
  delete process.env[key];
}

const { handleBookCall } = await import('./bookCall.ts');

const post = (body: unknown, email = 'ada@example.com') => handleBookCall({
  method: 'POST',
  query: {},
  body: body == null ? null : JSON.stringify(typeof body === 'object' && body && !Array.isArray(body)
    ? { email, ...(body as object) }
    : body),
});

function weekday(ymd: string) {
  const [year, month, day] = ymd.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jerusalem',
    weekday: 'short',
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

describe('book call', { concurrency: 1 }, () => {
  test('rejects bad input before Google', async () => {
    assert.equal((await handleBookCall({ method: 'OPTIONS', query: {}, body: null })).status, 204);
    assert.equal((await post({ name: 'Ada', start: '2026-10-08T07:00:00.000Z', ts_hp: 'bot' }, 'trap@example.com')).status, 204);
    assert.equal((await post({ name: 'Ada', start: '2026-10-08T07:00:00.000Z', company: 'spam' }, 'co@example.com')).status, 204);
    assert.equal((await post({ name: 'A', start: '2026-10-08T07:00:00.000Z' }, 'short@example.com')).status, 400);
    assert.equal((await post({ name: 'Ada\nLovelace', start: '2026-10-08T07:00:00.000Z' }, 'nl@example.com')).status, 400);
    assert.equal((await post({ name: 'Ada', email: 'not-an-email', start: '2026-10-08T07:00:00.000Z' })).status, 400);
    assert.equal((await post({ name: 'Ada' }, 'nostart@example.com')).status, 400);
    assert.equal((await handleBookCall({ method: 'POST', query: {}, body: '{' })).status, 400);
    assert.equal((await handleBookCall({ method: 'PUT', query: {}, body: null })).status, 405);
    assert.equal((await handleBookCall({ method: 'GET', query: {}, body: null })).status, 503);
    assert.equal((await post({ name: 'Ada', start: '2026-10-08T07:00:00.000Z' }, 'nocreds@example.com')).status, 503);
  });

  test('offered slots, freeBusy errors, and one event per slot', async () => {
    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    process.env.GOOGLE_CALENDAR_ID = 'cal';
    process.env.GOOGLE_CLIENT_EMAIL = 'svc@example.com';
    process.env.GOOGLE_PRIVATE_KEY = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();

    const calls: string[] = [];
    const inserts: { iCalUID?: string; summary?: string; attendees?: unknown }[] = [];
    let freeBusyBody: unknown = { calendars: { cal: { busy: [] } } };
    let insertStatus = 200;

    globalThis.fetch = async (url, init) => {
      const href = String(url);
      calls.push(href);
      if (href.includes('oauth2.googleapis.com')) {
        return Response.json({ access_token: 't', expires_in: 3600 });
      }
      if (href.includes('freeBusy')) return Response.json(freeBusyBody);
      inserts.push(JSON.parse(String(init?.body)) as { iCalUID?: string; summary?: string; attendees?: unknown });
      return new Response('{}', { status: insertStatus });
    };

    const now = Date.now();
    const got = await handleBookCall({ method: 'GET', query: {}, body: null });
    assert.equal(got.status, 200);
    const days = (got.body as { days: { date: string; slots: { start: string; label: string }[] }[] }).days;
    assert.ok(days.length > 0);
    for (const day of days) {
      assert.ok(!['Fri', 'Sat'].includes(weekday(day.date)));
      for (const slot of day.slots) {
        assert.ok(Date.parse(slot.start) - now >= 2 * 60 * 60 * 1000 - 5000);
        assert.match(slot.label, /^(1[0-6]):(00|30)$/);
      }
    }

    const foreign = await post({ name: 'Ada', start: '1999-01-01T00:00:00.000Z' }, 'foreign@example.com');
    assert.equal(foreign.status, 409);
    assert.equal(calls.some((url) => url.includes('/events')), false);

    freeBusyBody = { calendars: { cal: { errors: [{ reason: 'notFound' }], busy: [] } } };
    const broken = await handleBookCall({ method: 'GET', query: {}, body: null });
    assert.equal(broken.status, 502);
    const before = calls.length;
    const blocked = await post({ name: 'Ada', start: days[0].slots[0].start }, 'blocked@example.com');
    assert.equal(blocked.status, 502);
    assert.equal(calls.slice(before).some((url) => url.includes('/events')), false);

    freeBusyBody = { calendars: {} };
    assert.equal((await handleBookCall({ method: 'GET', query: {}, body: null })).status, 502);

    freeBusyBody = { calendars: { cal: { busy: [] } } };
    const start = days[0].slots[0].start;
    const first = await post({ name: 'Ada', start }, 'once@example.com');
    assert.equal(first.status, 201);
    insertStatus = 409;
    const second = await post({ name: 'Ada', start }, 'twice@example.com');
    assert.equal(second.status, 409);
    assert.equal(inserts.length, 2);
    assert.equal(inserts[0].iCalUID, inserts[1].iCalUID);
    assert.equal(inserts[0].summary, 'Intro call');
    assert.equal(inserts[0].attendees, undefined);
    assert.equal(calls.filter((url) => url.includes('sendUpdates=none')).length, 2);
    assert.equal(calls.some((url) => url.includes('sendUpdates=all')), false);
  });
});
