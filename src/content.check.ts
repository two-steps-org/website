/**
 * The honesty gate (plan 0.11). Fails `pnpm test` when a banned word or a
 * fabricated entity is back in user-facing source. Run it with:
 *
 *   node --import tsx src/content.check.ts
 */
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// docs/copy-decisions.md banned list, plus the additions from 01-positioning §9.
const BANNED = [
  'solutions?', 'leverage', 'empower', 'unlock', 'seamless(?:ly)?', 'cutting-edge', 'state-of-the-art',
  'revolutionary', 'game-changing', 'robust', 'best-in-class', 'world-class', 'tailored',
  'transform your business', 'chatbot', 'next-level', 'supercharge', 'free consultation',
  'streamline', 'effortless(?:ly)?', 'diverse industries', 'AI-powered', 'trusted by',
];
// The five rail clients and five case-study labels removed in Phase 0, and the one figure.
const FABRICATED = [
  'MERIDIAN', 'NORTHBANK', 'ATLAS ONE', 'KESTREL', 'VOLTWAY', 'Internal Team', 'Independent Barber',
  'Leads Manager', 'Logistics Company', 'Accounting Firm', '41% shorter',
];
// Strings the plan removes in a named later item. Each entry is a debt, not an exemption.
const PENDING: Array<{ text: string; item: string }> = [
  { text: 'Custom SaaS Solutions', item: '1.4 rename to Custom software' },
  { text: 'custom-saas-solutions', item: '1.4 slug redirect' },
  { text: 'We Are Ready To Provide Solutions', item: '1.3 team heading' },
  { text: 'custom AI solutions built for your business', item: '1.5 about description' },
  { text: 'How do you ensure the AI solution will deliver results', item: '1.2 FAQ' },
  { text: 'Streamline workflows', item: '1.4 service bullets' },
  { text: 'Scale effortlessly', item: '1.4 service bullets' },
  { text: 'Buy the 80% solution', item: '1.11 blog fix' },
];

const SKIP = /\.(check|test)\.ts$|\/types\.ts$/;
function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (/\.(tsx?|mjs|html|md)$/.test(name) && !SKIP.test(path)) yield path;
  }
}

const files = [...walk('src'), 'index.html', ...walk('content')];
const hits: string[] = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const isCode = /\.(tsx?|mjs)$/.test(file);
  text.split('\n').forEach((line, i) => {
    // In code, only string literals and JSX text are user-facing; identifiers are not.
    let probe = isCode
      ? (line.match(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`[^`]*`|>[^<{]+</g) ?? []).join(' ')
      : line;
    for (const { text: pending } of PENDING) probe = probe.split(pending).join('');
    for (const word of BANNED) {
      if (new RegExp(`\\b${word}\\b`, 'i').test(probe)) hits.push(`${file}:${i + 1}: banned "${word}": ${line.trim().slice(0, 90)}`);
    }
    for (const entity of FABRICATED) {
      if (probe.includes(entity)) hits.push(`${file}:${i + 1}: fabricated "${entity}"`);
    }
  });
}

assert.deepEqual(hits, [], `content.check: ${hits.length} hit(s)\n${hits.join('\n')}`);
console.log(`content.check: ${files.length} files clean (${PENDING.length} strings pending, see PENDING)`);
