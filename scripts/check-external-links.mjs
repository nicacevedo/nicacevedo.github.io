/**
 * Monthly health check for the external links this site depends on.
 *
 * Deliberately kept out of the normal CI path: a DOI resolver or a university
 * repository being briefly unreachable is not a reason to block a pull request
 * or a deploy. This runs on a schedule, retries, and only fails on evidence
 * that a link is actually gone.
 *
 * Targets are read out of the repository rather than listed here, so a new
 * project, publication or recitation is covered the moment it is added.
 *
 * Usage: node scripts/check-external-links.mjs [--report <file>]
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCES = ['src', 'scripts'].map((dir) => join(ROOT, dir));
const SCANNED = new Set(['.ts', '.tsx', '.astro', '.md', '.bib', '.mjs', '.css']);

const ATTEMPTS = 3;
const TIMEOUT_MS = 20_000;
const AGENT =
  'Mozilla/5.0 (compatible; nicacevedo.github.io link check; +https://nicacevedo.github.io/)';

/**
 * Hosts that answer bots with a challenge or a hard block, so a status code
 * from them says nothing about whether the link works for a reader.
 */
const EXCLUDED = [
  'linkedin.com', // returns 999 to anything that is not a browser
  'schema.org', // a vocabulary namespace, not a link
  'w3.org', // SVG/XML namespaces
  'nicacevedo.github.io', // this site; internal links are covered by the test suite
  'localhost',
  'youtube.com/oembed', // the probe endpoint this script builds, not a link
  'example.com',
];

/** A URL written as a template in source code is not a link to check. */
const PLACEHOLDER = /[${}]/;

/** Statuses that mean "the server refused a robot", not "the link is broken". */
const BLOCKED_STATUSES = new Set([401, 403, 405, 406, 429, 999]);

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (SCANNED.has(extname(entry.name))) out.push(full);
  }
  return out;
}

/** Collects every absolute URL mentioned in the repository's own sources. */
async function collect() {
  const found = new Map(); // url -> Set<file>
  for (const dir of SOURCES) {
    for (const file of await walk(dir)) {
      const source = await readFile(file, 'utf8');
      for (const match of source.matchAll(/https?:\/\/[^\s"'`)\\<>\]}]+/g)) {
        const url = match[0].replace(/[.,;:]+$/, '');
        if (PLACEHOLDER.test(url)) continue;
        if (EXCLUDED.some((host) => url.includes(host))) continue;
        if (!found.has(url)) found.set(url, new Set());
        found.get(url).add(file.slice(ROOT.length));
      }
    }
  }

  // DOIs are stored bare in the .bib, so they never appear as a URL. They are
  // the most important links on the site, so they are resolved explicitly.
  const bib = await readFile(join(ROOT, 'src/data/publications.bib'), 'utf8');
  for (const match of bib.matchAll(/^\s*doi\s*=\s*\{([^}]+)\}/gm)) {
    const url = `https://doi.org/${match[1].trim()}`;
    if (!found.has(url)) found.set(url, new Set());
    found.get(url).add('/src/data/publications.bib');
  }

  return found;
}

/**
 * YouTube answers 200 for a watch page even when the video is gone, so the
 * oEmbed endpoint is the only status that means anything.
 */
function probeUrl(url) {
  const youtube = url.match(/^https?:\/\/(?:youtu\.be\/|(?:www\.)?youtube\.com\/watch\?)/);
  if (!youtube) return { url, via: 'direct' };
  return {
    url: `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    via: 'oembed',
  };
}

async function request(url, method) {
  const response = await fetch(url, {
    method,
    redirect: 'follow',
    headers: {
      'user-agent': AGENT,
      accept: '*/*',
      // Some CDNs answer a bare HEAD with 403 unless a range is offered.
      ...(method === 'GET' ? { range: 'bytes=0-0' } : {}),
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  return response;
}

async function check(url) {
  const probe = probeUrl(url);
  let last = '';

  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    for (const method of ['HEAD', 'GET']) {
      try {
        const response = await request(probe.url, method);
        if (response.ok) return { state: 'ok', status: response.status, via: probe.via };
        if (BLOCKED_STATUSES.has(response.status)) {
          last = `HTTP ${response.status}`;
          if (method === 'GET') break; // try again, or give up as "blocked"
          continue; // HEAD refused: fall through to GET
        }
        last = `HTTP ${response.status}`;
        if (response.status >= 400 && response.status < 500) {
          return { state: 'broken', status: response.status, via: probe.via, detail: last };
        }
      } catch (error) {
        last = error instanceof Error ? error.message : String(error);
      }
    }
    if (attempt < ATTEMPTS) await new Promise((done) => setTimeout(done, attempt * 2_000));
  }

  if (/^HTTP (401|403|405|406|429|999)$/.test(last)) {
    return { state: 'blocked', via: probe.via, detail: last };
  }
  return { state: 'broken', via: probe.via, detail: last || 'no response' };
}

/* --------------------------------------------------------------------------- */

const reportFlag = process.argv.indexOf('--report');
const reportPath = reportFlag === -1 ? null : process.argv[reportFlag + 1];

const targets = [...(await collect()).entries()].sort(([a], [b]) => a.localeCompare(b));
console.log(`checking ${targets.length} external link(s)\n`);

const results = [];
// Sequential on purpose: a handful of links, and no reason to look like a bot.
for (const [url, files] of targets) {
  const result = await check(url);
  results.push({ url, files: [...files], ...result });
  const mark =
    result.state === 'ok' ? 'ok     ' : result.state === 'blocked' ? 'blocked' : 'BROKEN ';
  console.log(`${mark} ${url}${result.detail ? `  (${result.detail})` : ''}`);
}

const broken = results.filter((r) => r.state === 'broken');
const blocked = results.filter((r) => r.state === 'blocked');

const lines = [
  `Checked ${results.length} external links on ${new Date().toISOString().slice(0, 10)}.`,
  '',
  `- ok: ${results.length - broken.length - blocked.length}`,
  `- blocked by the host (not a failure): ${blocked.length}`,
  `- broken: ${broken.length}`,
];

if (broken.length > 0) {
  lines.push('', '## Broken', '');
  for (const item of broken) {
    lines.push(`- ${item.url} — ${item.detail}`, `  - referenced in: ${item.files.join(', ')}`);
  }
}
if (blocked.length > 0) {
  lines.push('', '## Blocked by the host', '');
  for (const item of blocked) lines.push(`- ${item.url} — ${item.detail}`);
}

const report = `${lines.join('\n')}\n`;
if (reportPath) await writeFile(reportPath, report, 'utf8');

console.log(`\n${lines.slice(2, 5).join('\n')}`);
if (broken.length > 0) {
  console.error('\nexternal links are broken; see the report above.');
  process.exit(1);
}
