/**
 * GET  /api/book-call — open 30-min slots (Sun–Thu, 10:00–17:00 Asia/Jerusalem).
 * POST /api/book-call — { name, email, start } writes one Google Calendar event.
 *
 * The public route never adds attendees and never asks Google to email anyone.
 * Share GOOGLE_CALENDAR_ID with the service account as "Make changes to events".
 */
import { createHash, createSign } from 'node:crypto';
import process from 'node:process';

const TZ = process.env.BOOK_TZ ?? 'Asia/Jerusalem';
const DURATION_MIN = 30;
const HORIZON_DAYS = 14;
const MIN_NOTICE_MS = 2 * 60 * 60 * 1000;
const START_HOUR = 10;
const END_HOUR = 17;
const NAME_MAX = 80;
const EMAIL_MAX = 254;
const FETCH_TIMEOUT_MS = 8000;
const BUSY_CACHE_MS = 45_000;
const TOKEN_SKEW_MS = 60_000;
const BURST_WINDOW_MS = 60_000;
const BURST_MAX = 8;
/** Sunday–Thursday in Asia/Jerusalem. */
const OPEN_WEEKDAYS = new Set([0, 1, 2, 3, 4]);
const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
function hasControlChar(value: string): boolean {
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code <= 0x1f || code === 0x7f) return true;
  }
  return false;
}
const dayLabelFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ,
  weekday: 'short',
  month: 'short',
  day: 'numeric',
});

export type BookCallRequest = {
  method: string;
  query: Record<string, string | undefined>;
  body: string | null;
  ip?: string;
};

export type BookCallResponse = { status: number; body: unknown };

type ServiceAccount = { client_email: string; private_key: string };

type Slot = { start: string; label: string };
type Day = { date: string; label: string; slots: Slot[] };
type BusyInterval = { start: string; end: string };
type CalendarBusy = { busy?: BusyInterval[]; errors?: unknown[] };

function json(status: number, body: unknown): BookCallResponse {
  return { status, body };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function b64url(value: string | Buffer) {
  return Buffer.from(value).toString('base64url');
}

function cacheEnabled() {
  return process.env.BOOK_CALL_NO_CACHE !== '1';
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

function addYmd(ymd: string, days: number) {
  const [year, month, day] = ymd.split('-').map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return `${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}-${pad(next.getUTCDate())}`;
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

let tokenCache: { key: string; token: string; exp: number } | null = null;

async function googleAccessToken(account: ServiceAccount) {
  const now = Date.now();
  if (
    cacheEnabled()
    && tokenCache
    && tokenCache.key === account.client_email
    && tokenCache.exp > now + TOKEN_SKEW_MS
  ) {
    return tokenCache.token;
  }
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: googleJwt(account),
    }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) {
    const detail = await res.text();
    console.error('Google auth failed', res.status, detail);
    throw new Error(`Google auth failed (${res.status})`);
  }
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) {
    console.error('Google auth failed', 'missing access_token');
    throw new Error('Google auth failed');
  }
  const ttl = Math.max(60, (data.expires_in ?? 3600) - 60) * 1000;
  tokenCache = { key: account.client_email, token: data.access_token, exp: now + ttl };
  return data.access_token;
}

function parseBusy(calendarId: string, data: { calendars?: Record<string, CalendarBusy> }): BusyInterval[] {
  const calendar = data.calendars?.[calendarId];
  if (!calendar || (calendar.errors && calendar.errors.length > 0)) {
    throw new Error('Calendar lookup failed');
  }
  const busy = calendar.busy ?? [];
  for (const block of busy) {
    if (
      Number.isNaN(new Date(block.start).getTime())
      || Number.isNaN(new Date(block.end).getTime())
    ) {
      throw new Error('Calendar lookup failed');
    }
  }
  return busy;
}

let busyCache: { key: string; busy: BusyInterval[]; exp: number } | null = null;

async function freeBusy(token: string, calendarId: string, timeMin: Date, timeMax: Date) {
  const key = `${calendarId}|${timeMin.toISOString()}|${timeMax.toISOString()}`;
  const now = Date.now();
  if (cacheEnabled() && busyCache && busyCache.key === key && busyCache.exp > now) {
    return busyCache.busy;
  }
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
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) {
    const detail = await res.text();
    console.error('Calendar lookup failed', res.status, detail);
    throw new Error(`Calendar lookup failed (${res.status})`);
  }
  const data = (await res.json()) as { calendars?: Record<string, CalendarBusy> };
  const busy = parseBusy(calendarId, data);
  busyCache = { key, busy, exp: now + BUSY_CACHE_MS };
  return busy;
}

function overlaps(start: Date, end: Date, busy: BusyInterval[]) {
  return busy.some((block) => start < new Date(block.end) && end > new Date(block.start));
}

function candidateDays(now: Date): Day[] {
  const todayYmd = ymdInZone(now, TZ);
  const days: Day[] = [];
  const seen = new Set<string>();
  for (let offset = 0; offset < HORIZON_DAYS; offset += 1) {
    const date = addYmd(todayYmd, offset);
    if (seen.has(date) || date < todayYmd) continue;
    seen.add(date);
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
    days.push({ date, label: dayLabelFormat.format(noon), slots });
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

function slotEventId(calendarId: string, startIso: string) {
  const digest = createHash('sha256').update(`${calendarId}\n${startIso}`).digest('hex').slice(0, 32);
  return `${digest}@twosteps.ai`;
}

function calendarEventsUrl(calendarId: string) {
  return `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?sendUpdates=none`;
}

const bursts = new Map<string, number[]>();

function tooFast(key: string) {
  const now = Date.now();
  const recent = (bursts.get(key) ?? []).filter((stamp) => now - stamp < BURST_WINDOW_MS);
  if (recent.length >= BURST_MAX) {
    bursts.set(key, recent);
    return true;
  }
  recent.push(now);
  bursts.set(key, recent);
  return false;
}

async function createEvent(input: { name: string; email: string; start: string; source: string; ip?: string }) {
  const creds = credentials();
  if (!creds) return json(503, { error: 'Booking is not connected yet.' });
  const burstKey = `${input.ip ?? ''}|${input.email}`;
  if (tooFast(burstKey)) return json(429, { error: 'Too many attempts. Try again in a minute.' });

  const start = new Date(input.start);
  const end = new Date(start.getTime() + DURATION_MIN * 60 * 1000);
  if (Number.isNaN(start.getTime())) return json(400, { error: 'That time is not valid.' });

  const open = await availableDays();
  const allowed = open.some((day) => day.slots.some((slot) => slot.start === start.toISOString()));
  if (!allowed) return json(409, { error: 'That time was just taken. Pick another.' });

  const token = await googleAccessToken(creds.account);
  const startIso = start.toISOString();
  const payload = {
    summary: 'Intro call',
    description: `Booked from twosteps.ai${input.source}\n${input.name}\n${input.email}`,
    iCalUID: slotEventId(creds.calendarId, startIso),
    start: { dateTime: startIso, timeZone: TZ },
    end: { dateTime: end.toISOString(), timeZone: TZ },
  };
  const res = await fetch(calendarEventsUrl(creds.calendarId), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (res.status === 409) {
    return json(409, { error: 'That time was just taken. Pick another.' });
  }
  if (!res.ok) {
    const detail = await res.text();
    console.error('Google Calendar insert failed', res.status, detail);
    return json(502, { error: 'Could not write the event. Try another time.' });
  }
  busyCache = null;
  return json(201, { ok: true, start: startIso });
}

export async function handleBookCall(req: BookCallRequest): Promise<BookCallResponse> {
  const method = req.method.toUpperCase();
  if (method === 'OPTIONS') return json(204, {});
  if (method === 'GET') {
    if (!credentials()) return json(503, { error: 'Booking is not connected yet.' });
    try {
      const days = await availableDays();
      return json(200, { timezone: TZ, durationMin: DURATION_MIN, days });
    } catch (error) {
      console.error('Calendar lookup failed', error instanceof Error ? error.message : 'unknown');
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
  if (name.length < 2 || name.length > NAME_MAX || hasControlChar(name)) {
    return json(400, { error: 'Tell us your name.' });
  }
  if (email.length > EMAIL_MAX || hasControlChar(email) || !validEmail(email)) {
    return json(400, { error: 'Use a real email.' });
  }
  if (!start) return json(400, { error: 'Pick a time.' });
  // Which page the visitor booked from (plan 0.6d): lets /he and campaigns be measured.
  const source = typeof body.source === 'string' ? body.source.replace(/[^\w/?=&.-]/g, '').slice(0, 80) : '';

  try {
    return await createEvent({ name, email, start, source, ip: req.ip });
  } catch (error) {
    console.error('Could not book that time', error instanceof Error ? error.message : 'unknown');
    return json(502, { error: 'Could not book that time. Try another.' });
  }
}
