/**
 * Architecture and weight budget for the built site.
 *
 * Not a Lighthouse score: the point is to catch the handful of regressions that
 * would quietly change what this site *is* — a static, dependency-free,
 * self-hosted page. Thresholds are set with room, so ordinary copy changes
 * never trip them.
 *
 * Run with `npm run budget`, after `npm run build`.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));

/**
 * Budgets, in bytes. Each is roughly double the current value, so a normal
 * edit cannot reach it and a new dependency or a pasted-in asset will.
 */
const BUDGET = {
  homepageGzip: 60_000,
  anyPageGzip: 60_000,
  inlineStylesheet: 64_000,
  totalHtmlGzip: 500_000,
};

/** Hosts a page must never reach out to at runtime, and why. */
const FORBIDDEN_HOSTS = [
  ['fonts.googleapis.com', 'typefaces are vendored; nothing may be fetched from a font CDN'],
  ['fonts.gstatic.com', 'typefaces are vendored; nothing may be fetched from a font CDN'],
  ['cdn.jsdelivr.net', 'no third-party runtime'],
  ['cdnjs.cloudflare.com', 'no third-party runtime'],
  ['unpkg.com', 'no third-party runtime'],
  ['esm.sh', 'no third-party runtime'],
  ['googletagmanager.com', 'the site carries no analytics'],
  ['google-analytics.com', 'the site carries no analytics'],
  ['plausible.io', 'the site carries no analytics'],
  ['analytics.umami.is', 'the site carries no analytics'],
  ['static.cloudflareinsights.com', 'the site carries no analytics'],
  ['vercel-insights.com', 'the site carries no analytics'],
  ['identity.netlify.com', 'no third-party runtime'],
  ['disqus.com', 'no third-party runtime'],
  ['giscus.app', 'no third-party runtime'],
  ['utteranc.es', 'no third-party runtime'],
];

/** Markers of a client-side framework runtime reaching the browser. */
const FORBIDDEN_MARKERS = [
  ['astro-island', 'a client component was hydrated; this site ships no framework runtime'],
  ['data-astro-reload', 'view transitions would add a client runtime'],
  ['__NEXT_DATA__', 'no other framework belongs in the output'],
  ['window.__remixContext', 'no other framework belongs in the output'],
];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const failures = [];
const notes = [];
const fail = (message) => failures.push(message);

let files;
try {
  files = await walk(DIST);
} catch {
  console.error('dist/ is missing — run `npm run build` first.');
  process.exit(1);
}

/* ---------------------------------------------------------------------------
   1. No JavaScript bundle. Every behaviour on this site is a few inline lines.
   --------------------------------------------------------------------------- */

const scripts = files.filter((file) => ['.js', '.mjs', '.cjs'].includes(extname(file)));
if (scripts.length > 0) {
  fail(
    `dist/ emitted ${scripts.length} JavaScript file(s); this site ships none:\n` +
      scripts.map((file) => `      ${relative(DIST, file)}`).join('\n'),
  );
} else {
  notes.push('no emitted JavaScript bundle');
}

/* ---------------------------------------------------------------------------
   2. Self-hosted: no runtime request leaves the origin.
   --------------------------------------------------------------------------- */

const html = files.filter((file) => extname(file) === '.html');
if (html.length === 0) fail('dist/ contains no HTML');

let totalHtmlGzip = 0;
let worstPage = { path: '', gzip: 0 };
let worstStyle = { path: '', bytes: 0 };

for (const file of html) {
  const source = await readFile(file, 'utf8');
  const where = relative(DIST, file);

  for (const [host, why] of FORBIDDEN_HOSTS) {
    if (source.includes(host)) fail(`${where} references ${host} — ${why}`);
  }
  for (const [marker, why] of FORBIDDEN_MARKERS) {
    if (source.includes(marker)) fail(`${where} contains "${marker}" — ${why}`);
  }

  // Any script must be inline. An external src is either a bundle or a third party.
  for (const [, attrs] of source.matchAll(/<script([^>]*)>/g)) {
    const src = attrs.match(/\ssrc=["']([^"']+)["']/);
    if (src) fail(`${where} loads an external script: ${src[1]}`);
  }

  const gzip = gzipSync(source).length;
  totalHtmlGzip += gzip;
  if (gzip > worstPage.gzip) worstPage = { path: where, gzip };

  if (where === 'index.html' && gzip > BUDGET.homepageGzip) {
    fail(`homepage is ${gzip} bytes gzipped, over the ${BUDGET.homepageGzip} budget`);
  }
  if (gzip > BUDGET.anyPageGzip) {
    fail(`${where} is ${gzip} bytes gzipped, over the ${BUDGET.anyPageGzip} per-page budget`);
  }

  const inline = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].reduce(
    (total, match) => total + match[1].length,
    0,
  );
  if (inline > worstStyle.bytes) worstStyle = { path: where, bytes: inline };
  if (inline > BUDGET.inlineStylesheet) {
    fail(`${where} inlines ${inline} bytes of CSS, over the ${BUDGET.inlineStylesheet} budget`);
  }
}

if (totalHtmlGzip > BUDGET.totalHtmlGzip) {
  fail(`all HTML is ${totalHtmlGzip} bytes gzipped, over the ${BUDGET.totalHtmlGzip} budget`);
}

/* ---------------------------------------------------------------------------
   3. The fonts are actually in the output, and are the subsets we vendored.
   --------------------------------------------------------------------------- */

const fonts = files.filter((file) => extname(file) === '.woff2');
if (fonts.length === 0) fail('no .woff2 file was emitted — the local font provider is not running');
else notes.push(`${fonts.length} self-hosted font file(s)`);

for (const file of fonts) {
  const { size } = await stat(file);
  if (size > 200_000) fail(`${relative(DIST, file)} is ${size} bytes; a subset should be smaller`);
}

/* ---------------------------------------------------------------------------
   Report
   --------------------------------------------------------------------------- */

console.log(`pages:            ${html.length}`);
console.log(`html gzip total:  ${totalHtmlGzip} B (budget ${BUDGET.totalHtmlGzip})`);
console.log(
  `largest page:     ${worstPage.path} ${worstPage.gzip} B (budget ${BUDGET.anyPageGzip})`,
);
console.log(
  `largest inline CSS: ${worstStyle.path} ${worstStyle.bytes} B (budget ${BUDGET.inlineStylesheet})`,
);
for (const note of notes) console.log(`ok:               ${note}`);

if (failures.length > 0) {
  console.error(`\n${failures.length} budget failure(s):`);
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}
console.log('\nall architecture and weight budgets hold.');
