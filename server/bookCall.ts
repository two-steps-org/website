/**
 * GET  /api/book-call — open 30-min slots (Sun–Thu, 10:00–17:00 Asia/Jerusalem).
 * POST /api/book-call — { name, email, start } writes a Google Calendar event.
 *
 * Share GOOGLE_CALENDAR_ID with the service account as "Make changes to events".
 */
import { createSign } from 'node:crypto';
import process from 'node:process';

const TZ = process.env.BOOK_TZ ?? 'Asia/Jerusalem';
const DURATION_MIN = 30;
const HORIZON_DAYS = 14;
const MIN_NOTICE_MS = 2 * 60 * 60 * 1000;
const START_HOUR = 10;
const END_HOUR = 17;
/** Sunday–Thursday in Asia/Jerusalem. */
const OPEN_WEEKDAYS = new Set([0, 1, 2, 3, 4]);
const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export type BookCallRequest = {
  method: string;
  query: Record<string, string | undefined>;
  body: string | null;
};

export type BookCallResponse = { status: number; body: unknown };

type ServiceAccount = { client_email: string; private_key: string };

type Slot = { start: string; label: string };
type Day = { date: string; label: string; slots: Slot[] };

function json(status: number, body: unknown): BookCallResponse {
  return { status, body };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function b64url(value: string | Buffer) {
  return Buffer.from(value).toString('base64url');
}

function tzOffsetMs(utcMs: number, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(utcMs));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );
  return asUtc - utcMs;
}

function zonedLocalToUtc(ymd: string, hm: string, timeZone: string) {
  const [year, month, day] = ymd.split('-').map(Number);
  const [hour, minute] = hm.split(':').map(Number);
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const once = utcGuess - tzOffsetMs(utcGuess, timeZone);
  return new Date(utcGuess - tzOffsetMs(once, timeZone));
}

function ymdInZone(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function weekdayInZone(ymd: string, timeZone: string) {
  const noon = zonedLocalToUtc(ymd, '12:00', timeZone);
  const label = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' }).format(noon);
  return WEEKDAY_SHORT.indexOf(label as (typeof WEEKDAY_SHORT)[number]);
}

function credentials(): { calendarId: string; account: ServiceAccount } | null {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const fromJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (fromJson) {
    try {
      const parsed = JSON.parse(fromJson) as ServiceAccount;
      if (calendarId && parsed.client_email && parsed.private_key) {
        return {
          calendarId,
          account: {
            client_email: parsed.client_email,
            private_key: normalizePrivateKey(parsed.private_key),
          },
        };
      }
    } catch {
      /* fall through to discrete env vars */
    }
  }
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
    ? normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY)
    : '';
  if (!calendarId || !clientEmail || !privateKey) return null;
  return { calendarId, account: { client_email: clientEmail, private_key: privateKey } };
}

function normalizePrivateKey(value: string) {
  return value.replace(/\\n/g, '\n').replace(/^\s*"|"\s*$/g, '').trim();
}

function googleJwt(account: ServiceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(
    JSON.stringify({
      iss: account.client_email,
      scope: 'https://www.googleapis.com/auth/calendar',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claim}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  return `${unsigned}.${signer.sign(account.private_key, 'base64url')}`;
}

async function googleAccessToken(account: ServiceAccount) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: googleJwt(account),
    }),
  });
  if (!res.ok) throw new Error(`Google auth failed (${res.status})`);
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('Google auth failed');
  return data.access_token;
}

async function freeBusy(token: string, calendarId: string, timeMin: Date, timeMax: Date) {
  const res = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      timeZone: TZ,
      items: [{ id: calendarId }],
    }),
  });
  if (!res.ok) throw new Error(`Calendar lookup failed (${res.status})`);
  const data = (await res.json()) as {
    calendars?: Record<string, { busy?: { start: string; end: string }[] }>;
  };
  return data.calendars?.[calendarId]?.busy ?? [];
}

function overlaps(
  start: Date,
  end: Date,
  busy: { start: string; end: string }[],
) {
  return busy.some((block) => start < new Date(block.end) && end > new Date(block.start));
}

function candidateDays(now: Date): Day[] {
  const todayYmd = ymdInZone(now, TZ);
  const days: Day[] = [];
  for (let offset = 0; offset < HORIZON_DAYS; offset += 1) {
    const cursor = new Date(now.getTime() + offset * 86400000);
    const date = ymdInZone(cursor, TZ);
    if (date < todayYmd) continue;
    const weekday = weekdayInZone(date, TZ);
    if (!OPEN_WEEKDAYS.has(weekday)) continue;
    const slots: Slot[] = [];
    for (let hour = START_HOUR; hour < END_HOUR; hour += 1) {
      for (const minute of [0, 30]) {
        if (hour * 60 + minute + DURATION_MIN > END_HOUR * 60) continue;
        const label = `${pad(hour)}:${pad(minute)}`;
        const start = zonedLocalToUtc(date, label, TZ);
        if (start.getTime() - now.getTime() < MIN_NOTICE_MS) continue;
        slots.push({ start: start.toISOString(), label });
      }
    }
    if (slots.length === 0) continue;
    const noon = zonedLocalToUtc(date, '12:00', TZ);
    const label = new Intl.DateTimeFormat('en-US', {
      timeZone: TZ,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(noon);
    days.push({ date, label, slots });
  }
  return days;
}

async function availableDays(now = new Date()): Promise<Day[]> {
  const days = candidateDays(now);
  const creds = credentials();
  if (!creds || days.length === 0) return days;
  const first = new Date(days[0].slots[0].start);
  const lastDay = days[days.length - 1];
  const last = new Date(lastDay.slots[lastDay.slots.length - 1].start);
  const token = await googleAccessToken(creds.account);
  const busy = await freeBusy(
    token,
    creds.calendarId,
    first,
    new Date(last.getTime() + DURATION_MIN * 60 * 1000),
  );
  return days
    .map((day) => ({
      ...day,
      slots: day.slots.filter((slot) => {
        const start = new Date(slot.start);
        const end = new Date(start.getTime() + DURATION_MIN * 60 * 1000);
        return !overlaps(start, end, busy);
      }),
    }))
    .filter((day) => day.slots.length > 0);
}

function readBody(raw: string | null) {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function calendarEventsUrl(calendarId: string, sendUpdates: 'all' | 'none') {
  return `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?sendUpdates=${sendUpdates}`;
}

async function insertEvent(
  token: string,
  calendarId: string,
  payload: Record<string, unknown>,
  sendUpdates: 'all' | 'none',
) {
  return fetch(calendarEventsUrl(calendarId, sendUpdates), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

async function createEvent(input: { name: string; email: string; start: string }) {
  const creds = credentials();
  if (!creds) return json(503, { error: 'Booking is not connected yet.' });

  const start = new Date(input.start);
  const end = new Date(start.getTime() + DURATION_MIN * 60 * 1000);
  if (Number.isNaN(start.getTime())) return json(400, { error: 'That time is not valid.' });

  const open = await availableDays();
  const allowed = open.some((day) => day.slots.some((slot) => slot.start === start.toISOString()));
  if (!allowed) return json(409, { error: 'That time was just taken. Pick another.' });

  const token = await googleAccessToken(creds.account);
  const payload = {
    summary: `Intro call — ${input.name}`,
    description: `Booked from twosteps.ai\n${input.name}\n${input.email}`,
    start: { dateTime: start.toISOString(), timeZone: TZ },
    end: { dateTime: end.toISOString(), timeZone: TZ },
    attendees: [{ email: input.email }],
  };
  let res = await insertEvent(token, creds.calendarId, payload, 'all');
  if (!res.ok) {
    res = await insertEvent(token, creds.calendarId, { ...payload, attendees: [] }, 'none');
  }
  if (!res.ok) {
    const detail = await res.text();
    console.error('Google Calendar insert failed', res.status, detail);
    return json(502, { error: 'Could not write the event. Try another time.' });
  }
  return json(201, { ok: true, start: start.toISOString() });
}

export async function handleBookCall(req: BookCallRequest): Promise<BookCallResponse> {
  const method = req.method.toUpperCase();
  if (method === 'OPTIONS') return json(204, {});
  if (method === 'GET') {
    if (!credentials()) return json(503, { error: 'Booking is not connected yet.' });
    try {
      const days = await availableDays();
      return json(200, { timezone: TZ, durationMin: DURATION_MIN, days });
    } catch {
      return json(502, { error: 'Could not load times.' });
    }
  }
  if (method !== 'POST') return json(405, { error: 'Method not allowed' });

  const body = readBody(req.body);
  const trap = [body.ts_hp, body.company].find((value) => typeof value === 'string' && value.trim());
  if (trap) return json(204, {});
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const start = typeof body.start === 'string' ? body.start : '';
  if (name.length < 2) return json(400, { error: 'Tell us your name.' });
  if (!validEmail(email)) return json(400, { error: 'Use a real email.' });
  if (!start) return json(400, { error: 'Pick a time.' });

  try {
    return await createEvent({ name, email, start });
  } catch {
    return json(502, { error: 'Could not book that time. Try another.' });
  }
}
