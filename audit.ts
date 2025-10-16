/**
 * Usage examples:
 *   npx tsc --project tsconfig.audit.json
 *   node dist/audit.js --pages localhost:5173,localhost:5173/case-studies,https://twosteps.ai,https://twosteps.ai/case-studies
 */

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import zlib from 'zlib';
import XLSX from 'xlsx';
import parser from '@babel/parser';
import traverseModule, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { JSDOM } from 'jsdom';

const traverse = (traverseModule as any).default || traverseModule;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CLI defaults & parsing ---
const argv = process.argv.slice(2);
function getArg(name: string, fallback?: string) {
  const idx = argv.indexOf(name);
  if (idx >= 0 && idx + 1 < argv.length) return argv[idx + 1];
  return fallback;
}
const SRC_DIR = getArg('--src', 'src')!;
const DIST_ASSETS = getArg('--dist', 'dist/assets')!;
const STATS_HTML = getArg('--stats', 'stats.html')!;
const OUT_XLSX = getArg('--out', 'audit-report.xlsx')!;
const OUT_JSON = getArg('--json-out', 'audit-report.json')!;
const LARGE_CHUNK_KB = Number(getArg('--large-chunk-kb', '1000')) || 1000;
const VERBOSE = argv.includes('--verbose');
const PAGES = (getArg('--pages', '') || '').split(',').filter(Boolean); // pages for Lighthouse

// --- Types ---
type Severity = 'High' | 'Medium' | 'Low';
interface TSIssue {
  file: string;
  line?: number;
  message: string;
  severity: Severity;
}
interface ESLintDeadCode {
  file: string;
  line?: number;
  rule?: string;
  message: string;
}
interface SecurityVuln {
  module: string;
  severity: Severity;
  title: string;
  overview?: string;
  recommendation?: string;
  url?: string;
}
interface BundleAsset {
  file: string;
  sizeKB: number;
  gzipKB?: number;
  warning?: string;
}
interface BundleRecommendation {
  file: string;
  sizeKB: number;
  recommendation: string;
}
interface ReactPerfIssue {
  file: string;
  line?: number;
  type: string;
  message: string;
}
interface PrioritizedIssue {
  file: string;
  line?: number;
  type: string;
  message: string;
  severity: Severity;
  impact?: Severity;
  recommendation?: string;
}
interface CoreWebVitals {
  page: string;
  formFactor: 'mobile' | 'desktop';
  LCP: number;
  FID: number;
  CLS: number;
  FCP: number;
  TBT?: number;
  SpeedIndex?: number;
  TTI?: number;
  LCP_OK?: boolean;
  FID_OK?: boolean;
  CLS_OK?: boolean;
  FCP_OK?: boolean;
  delta?: Partial<Record<'LCP' | 'FID' | 'CLS' | 'FCP', number>>;
}

// --- Helpers ---
function normalize(p: string): string {
  return path.relative(process.cwd(), path.resolve(p));
}
async function exists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}
function safeExec(cmd: string, opts = { encoding: 'utf-8' }) {
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf-8' });
  } catch (err: any) {
    return err.stdout?.toString?.() || err.stderr?.toString?.() || '';
  }
}

// --- FS Walk ---
async function getAllFiles(dir: string, extFilter = ['.ts', '.tsx']): Promise<string[]> {
  const results: string[] = [];
  async function walk(d: string) {
    const entries = await fs.readdir(d, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) await walk(full);
      else if (extFilter.includes(path.extname(e.name))) results.push(full);
    }
  }
  const root = path.resolve(dir);
  if (!(await exists(root))) return [];
  await walk(root);
  return results.sort();
}

// --- TypeScript checks ---
function parseTscOutputForIssues(output: string): TSIssue[] {
  const issues: TSIssue[] = [];
  const regex = /(src[\/\\].*?\.(ts|tsx)):(\d+):(\d+) - (error|warning) TS\d+: (.*)/;
  for (const line of output.split(/\r?\n/)) {
    const m = line.match(regex);
    if (m) {
      const file = normalize(m[1]);
      const lineNum = Number(m[3]);
      const message = m[6].trim();
      let severity: Severity = 'Low';
      if (/implicitly has an 'any'/.test(message) || /is of type 'any'/.test(message))
        severity = 'High';
      else if (/possibly 'null'|possibly 'undefined'/.test(message)) severity = 'Medium';
      else if (/is not assignable to/.test(message)) severity = 'Medium';
      issues.push({ file, line: lineNum, message, severity });
    }
  }
  return issues;
}
async function runTypeScriptCheck(): Promise<TSIssue[]> {
  const cmd = 'pnpm tsc --noEmit --pretty false';
  if (VERBOSE) console.log(`> ${cmd}`);
  const out = safeExec(cmd);
  if (!out.trim()) return [];
  return parseTscOutputForIssues(out);
}

// --- ESLint checks ---
function parseEslintJsonOutput(output: string): ESLintDeadCode[] {
  const results: ESLintDeadCode[] = [];
  try {
    const arr = JSON.parse(output);
    for (const r of arr) {
      for (const msg of r.messages || []) {
        if ((msg.ruleId && msg.ruleId.includes('no-unused')) || /unused/i.test(msg.message)) {
          results.push({
            file: normalize(r.filePath),
            line: msg.line,
            rule: msg.ruleId,
            message: msg.message,
          });
        }
      }
    }
  } catch {}
  return results;
}
async function runEslintCheck(): Promise<ESLintDeadCode[]> {
  const cmd = 'npx eslint src --ext .ts,.tsx -f json';
  if (VERBOSE) console.log(`> ${cmd}`);
  const out = safeExec(cmd);
  if (!out.trim()) return [];
  return parseEslintJsonOutput(out);
}

// --- Security audit ---
function normalizeSeverityFromAudit(sev: string): Severity {
  if (!sev) return 'Low';
  const s = sev.toLowerCase();
  if (s.includes('high') || s.includes('critical')) return 'High';
  if (s.includes('moderate') || s.includes('medium')) return 'Medium';
  return 'Low';
}
function parseAuditJSON(output: string): SecurityVuln[] {
  if (!output) return [];
  try {
    const data = JSON.parse(output);
    const vulns: SecurityVuln[] = [];
    if (data.advisories) {
      for (const adv of Object.values<any>(data.advisories)) {
        vulns.push({
          module: adv.module_name,
          severity: normalizeSeverityFromAudit(adv.severity),
          title: adv.title,
          overview: adv.overview,
          recommendation: adv.recommendation,
          url: adv.url,
        });
      }
    } else if (data.vulnerabilities) {
      for (const [pkg, v] of Object.entries<any>(data.vulnerabilities)) {
        vulns.push({
          module: pkg,
          severity: normalizeSeverityFromAudit(v.severity),
          title: v.title ?? (v.name || pkg),
          overview: v.overview || '',
          recommendation: v.fixAvailable ? 'Upgrade available' : v.recommendation ?? '',
          url: v.url ?? '',
        });
      }
    }
    return vulns;
  } catch (e) {
    if (VERBOSE) console.warn('pnpm audit parse error', e);
    return [];
  }
}
async function runSecurityAudit(): Promise<SecurityVuln[]> {
  const cmd = 'pnpm audit --json';
  if (VERBOSE) console.log(`> ${cmd}`);
  const out = safeExec(cmd);
  if (!out.trim()) return [];
  return parseAuditJSON(out);
}

// --- Bundle analysis ---
async function getAllBundleAssets(distDir = DIST_ASSETS): Promise<BundleAsset[]> {
  const assets: BundleAsset[] = [];
  const resolved = path.resolve(distDir);
  if (!fsSync.existsSync(resolved)) return assets;
  function walk(dir: string) {
    for (const name of fsSync.readdirSync(dir)) {
      const full = path.join(dir, name);
      const stat = fsSync.statSync(full);
      if (stat.isDirectory()) walk(full);
      else {
        const sizeKB = Math.round(stat.size / 1024);
        let gzipKB: number | undefined;
        try {
          const buffer = fsSync.readFileSync(full);
          gzipKB = Math.round(zlib.gzipSync(buffer).byteLength / 1024);
        } catch {}
        const warning = sizeKB > LARGE_CHUNK_KB ? `Chunk > ${LARGE_CHUNK_KB} KB` : undefined;
        assets.push({ file: path.relative(resolved, full), sizeKB, gzipKB, warning });
      }
    }
  }
  walk(resolved);
  return assets;
}
function getBundleRecommendations(assets: BundleAsset[]): BundleRecommendation[] {
  return assets
    .filter((a) => a.sizeKB > LARGE_CHUNK_KB)
    .map((a) => ({
      file: a.file,
      sizeKB: a.sizeKB,
      recommendation: 'Consider code-splitting / dynamic import / lazy-load',
    }));
}
function parseStatsHTML(file = STATS_HTML): BundleRecommendation[] {
  const recs: BundleRecommendation[] = [];
  if (!fsSync.existsSync(file)) return recs;
  try {
    const html = fsSync.readFileSync(file, 'utf-8');
    const dom = new JSDOM(html);
    const tableRows = dom.window.document.querySelectorAll('table tr');
    tableRows.forEach((row) => {
      const cols = row.querySelectorAll('td,th');
      if (cols.length >= 2) {
        const fileText = cols[0].textContent?.trim() || '';
        const sizeText = cols[1].textContent?.trim() || '';
        const size = Number(sizeText.replace(/[^0-9.]/g, ''));
        if (fileText && size > LARGE_CHUNK_KB) {
          recs.push({
            file: fileText,
            sizeKB: size,
            recommendation: 'Large bundle – consider splitting',
          });
        }
      }
    });
  } catch {}
  return recs;
}

// --- React perf checks ---
function runReactPerfCheck(files: string[]): ReactPerfIssue[] {
  const issues: ReactPerfIssue[] = [];
  for (const file of files) {
    if (!file.endsWith('.tsx')) continue;
    let code = '';
    try {
      code = fsSync.readFileSync(file, 'utf-8');
    } catch {
      continue;
    }
    let ast;
    try {
      ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx', 'decorators-legacy'],
      });
    } catch {
      continue;
    }
    traverse(ast as any, {
      JSXAttribute(path: NodePath<t.JSXAttribute>) {
        const name: any = path.node.name;
        const value = path.node.value;
        if (!value) return;
        if (
          (value as any).type === 'JSXExpressionContainer' &&
          (value as any).expression?.type === 'ArrowFunctionExpression'
        ) {
          issues.push({
            file: normalize(file),
            line: path.node.loc?.start.line,
            type: 'Inline Function',
            message: `Prop '${name.name ?? '?'}' is an inline arrow function`,
          });
        }
        if ((value as any).type === 'JSXExpressionContainer') {
          const expr = (value as any).expression;
          if (expr && (expr.type === 'ArrayExpression' || expr.type === 'ObjectExpression')) {
            issues.push({
              file: normalize(file),
              line: path.node.loc?.start.line,
              type: 'Inline Literal',
              message: `Prop '${name.name ?? '?'}' passes inline ${
                expr.type === 'ArrayExpression' ? 'array' : 'object'
              }`,
            });
          }
        }
      },
    });
  }
  return issues;
}

// --- Lighthouse Core Web Vitals + delta ---
const CWV_TARGETS = {
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
  FCP: 1500,
};
function runLighthouse(
  url: string,
  formFactor: 'mobile' | 'desktop' = 'mobile',
): CoreWebVitals | null {
  try {
    const cmd = `npx lighthouse ${url} --output json --quiet --chrome-flags="--headless" --emulated-form-factor=${formFactor}`;
    if (VERBOSE) console.log(`> ${cmd}`);
    const out = safeExec(cmd);
    if (!out) return null;
    const json = JSON.parse(out);
    const metrics = json.audits;

    const cwv: CoreWebVitals = {
      page: url,
      formFactor,
      LCP: metrics['largest-contentful-paint']?.numericValue ?? 0,
      FID: metrics['max-potential-fid']?.numericValue ?? 0,
      CLS: metrics['cumulative-layout-shift']?.numericValue ?? 0,
      FCP: metrics['first-contentful-paint']?.numericValue ?? 0,
      TBT: metrics['total-blocking-time']?.numericValue ?? 0,
      SpeedIndex: metrics['speed-index']?.numericValue ?? 0,
      TTI: metrics['interactive']?.numericValue ?? 0,
      LCP_OK: (metrics['largest-contentful-paint']?.numericValue ?? 0) < CWV_TARGETS.LCP,
      FID_OK: (metrics['max-potential-fid']?.numericValue ?? 0) < CWV_TARGETS.FID,
      CLS_OK: (metrics['cumulative-layout-shift']?.numericValue ?? 0) < CWV_TARGETS.CLS,
      FCP_OK: (metrics['first-contentful-paint']?.numericValue ?? 0) < CWV_TARGETS.FCP,
    };

    return cwv;
  } catch {
    return null;
  }
}

// --- Compute delta ---
function computeCWVDelta(cwvs: CoreWebVitals[]): CoreWebVitals[] {
  const grouped: Record<string, CoreWebVitals[]> = {};
  for (const c of cwvs) {
    grouped[c.page] = grouped[c.page] || [];
    grouped[c.page].push(c);
  }
  const result: CoreWebVitals[] = [];
  for (const [page, arr] of Object.entries(grouped)) {
    const mobile = arr.find((x) => x.formFactor === 'mobile');
    const desktop = arr.find((x) => x.formFactor === 'desktop');
    if (!mobile || !desktop) {
      result.push(...arr);
      continue;
    }
    const delta: Partial<Record<'LCP' | 'FID' | 'CLS' | 'FCP', number>> = {
      LCP: mobile.LCP - desktop.LCP,
      FID: mobile.FID - desktop.FID,
      CLS: mobile.CLS - desktop.CLS,
      FCP: mobile.FCP - desktop.FCP,
    };
    mobile.delta = delta;
    desktop.delta = delta;
    result.push(mobile, desktop);
  }
  return result;
}

// --- Excel & JSON helpers ---
function writeExcel(outPath: string, sheets: Record<string, any[]>) {
  const wb = XLSX.utils.book_new();
  for (const [sheetName, rows] of Object.entries(sheets)) {
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  }
  XLSX.writeFile(wb, outPath);
}
async function writeJson(outPath: string, data: any) {
  await fs.writeFile(outPath, JSON.stringify(data, null, 2), 'utf-8');
}

// --- Prioritize ---
function prioritize(
  ts: TSIssue[],
  lint: ESLintDeadCode[],
  sec: SecurityVuln[],
  perf: ReactPerfIssue[],
  bundles: BundleRecommendation[],
): PrioritizedIssue[] {
  const combined: PrioritizedIssue[] = [];
  for (const i of ts)
    combined.push({
      file: i.file,
      line: i.line,
      type: 'TypeScript',
      message: i.message,
      severity: i.severity,
      impact: i.severity,
      recommendation: 'Fix TypeScript type error',
    });
  for (const i of lint)
    combined.push({
      file: i.file,
      line: i.line,
      type: i.rule ?? 'ESLint',
      message: i.message,
      severity: 'Low',
      impact: 'Low',
      recommendation: 'Remove unused code or confirm dynamic usage',
    });
  for (const i of sec)
    combined.push({
      file: i.module,
      type: 'Security',
      message: i.title,
      severity: i.severity,
      impact: i.severity,
      recommendation: i.recommendation,
    });
  for (const i of perf)
    combined.push({
      file: i.file,
      line: i.line,
      type: i.type,
      message: i.message,
      severity: 'Medium',
      impact: 'Medium',
      recommendation: 'Consider moving computation out of render or memoizing',
    });
  for (const i of bundles)
    combined.push({
      file: i.file,
      type: 'Bundle',
      message: i.recommendation,
      severity: 'Medium',
      impact: 'Medium',
      recommendation: i.recommendation,
    });
  return combined.sort((a, b) => (a.severity === 'High' && b.severity !== 'High' ? -1 : 1));
}

// --- Main ---
async function main() {
  const files = await getAllFiles(SRC_DIR);
  const tsIssues = await runTypeScriptCheck();
  const lintIssues = await runEslintCheck();
  const secVulns = await runSecurityAudit();
  const bundleAssets = await getAllBundleAssets();
  const bundleRecs = getBundleRecommendations(bundleAssets).concat(parseStatsHTML());
  const reactPerf = runReactPerfCheck(files);

  // CWVs
  const cwvReports: CoreWebVitals[] = [];
  for (const page of PAGES) {
    const mobile = runLighthouse(page, 'mobile');
    const desktop = runLighthouse(page, 'desktop');
    if (mobile) cwvReports.push(mobile);
    if (desktop) cwvReports.push(desktop);
  }

  const cwvWithDelta = computeCWVDelta(cwvReports);

  // Prioritized
  const prioritized = prioritize(tsIssues, lintIssues, secVulns, reactPerf, bundleRecs);

  // Write Excel & JSON
  writeExcel(OUT_XLSX, {
    Summary: prioritized,
    TypeScript: tsIssues,
    ESLint: lintIssues,
    Security: secVulns,
    ReactPerf: reactPerf,
    Bundles: bundleRecs,
    CoreWebVitals: cwvWithDelta,
  });
  await writeJson(OUT_JSON, {
    tsIssues,
    lintIssues,
    secVulns,
    reactPerf,
    bundleRecs,
    cwvReports: cwvWithDelta,
    prioritized,
  });

  console.log(`✅ Audit complete. Excel: ${OUT_XLSX}, JSON: ${OUT_JSON}`);
}

main();
