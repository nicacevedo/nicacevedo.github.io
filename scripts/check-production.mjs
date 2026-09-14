/**
 * Verifies the deployed site, not a local build.
 *
 * Cached copies of this site elsewhere still show an older navigation and an
 * older set of research-direction names, so the same assertions the test suite
 * makes against localhost are made again here, against what GitHub Pages is
 * actually serving.
 *
 * Usage: node scripts/check-production.mjs [origin]
 */
/** Where the pages are fetched from; a local `npm run serve` also works. */
const ORIGIN = (process.argv[2] ?? 'https://nicacevedo.github.io').replace(/\/$/, '');
/** What the pages declare themselves to be, which never changes with the origin. */
const SITE = 'https://nicacevedo.github.io';

const NAV = ['Research', 'Publications', 'Teaching', 'CV'];
const NAV_HREFS = ['/research/', '/publications/', '/teaching/', '/cv/'];

const THEMES = [
  'Fair & reliable predictive modeling',
  'Infrastructure modeling & planning',
  'Scalable optimization & computation',
];

const RETIRED = [
  'Equitable Prediction',
  'Equitable prediction',
  'Infrastructure Systems',
  'Infrastructure systems',
  'Optimization at Scale',
  'Optimization at scale',
  'Decisions / Systems / Computation',
  'Fairness and Robust Constraints',
  'Papers and theses',
];

/** Old URLs that must still land somewhere sensible. */
const REDIRECTS = [
  ['/about/', '/'],
  ['/projects/', '/research/'],
  ['/projects/fairness-robust-constraints/', '/projects/equitable-property-assessment/'],
  ['/news/', '/updates/'],
  ['/news/announcement_1/', '/updates/'],
  ['/news/announcement_2/', '/updates/'],
  ['/news/announcement_3/', '/updates/'],
  ['/news/announcement_4/', '/updates/'],
];

const FILES = [
  '/robots.txt',
  '/sitemap-index.xml',
  '/sitemap-0.xml',
  '/favicon.ico',
  '/favicon/favicon.svg',
  '/favicon/site.webmanifest',
  '/generated/og/home.png',
  '/generated/og/research.png',
  '/generated/og/equitable-property-assessment.png',
  '/assets/pdf/Nicolas_Acevedo_Villena_CV.pdf',
  '/assets/pdf/Poster_MSWorkshop.pdf',
  '/assets/pdf/PosterEVIC2023.pdf',
  '/assets/pdf/psu-outliers-tex.pdf',
  '/assets/pdf/psu-outliers-slides.pdf',
];

const failures = [];
const fail = (where, message) => {
  failures.push(`${where}: ${message}`);
  console.log(`  ✗ ${message}`);
};
const pass = (message) => console.log(`  ✓ ${message}`);

const decode = (value) =>
  value
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

async function get(path, init) {
  const response = await fetch(`${ORIGIN}${path}`, {
    headers: { 'cache-control': 'no-cache', pragma: 'no-cache' },
    ...init,
  });
  return response;
}

const meta = (html, attr, name) =>
  html.match(new RegExp(`<meta[^>]*${attr}="${name}"[^>]*content="([^"]*)"`))?.[1] ??
  html.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${name}"`))?.[1] ??
  null;

function navOf(html) {
  const block = html.match(/<nav[^>]*aria-label="Primary"[\s\S]*?<\/nav>/)?.[0];
  if (!block) return null;
  const links = [...block.matchAll(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)];
  return {
    labels: links.map((match) => decode(match[2])),
    hrefs: links.map((match) => match[1]),
    current: links
      .filter((match) => /aria-current="page"/.test(match[0]))
      .map((match) => decode(match[2])),
    raw: block,
  };
}

/** The og:type each route must declare. */
function expectedOgType(path) {
  if (path === '/' || path === '/cv/') return 'profile';
  if (path.startsWith('/projects/')) return 'article';
  return 'website';
}

/** Which navigation item the route marks as current, if any. */
function expectedCurrent(path) {
  const index = NAV_HREFS.indexOf(path);
  return index === -1 ? null : NAV[index];
}

/* --------------------------------------------------------------------------- */

console.log(`checking ${ORIGIN}\n`);

// The sitemap is the site's own statement of which pages are canonical.
const sitemapResponse = await get('/sitemap-0.xml');
if (!sitemapResponse.ok) {
  console.error(`cannot read /sitemap-0.xml (HTTP ${sitemapResponse.status}); aborting`);
  process.exit(1);
}
const sitemap = await sitemapResponse.text();
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => new URL(match[1]).pathname)
  .sort();

console.log(`sitemap lists ${routes.length} canonical route(s)\n`);

// Compatibility routes exist to keep old URLs alive and must stay out of it.
for (const [from] of REDIRECTS) {
  if (routes.includes(from)) fail('sitemap', `${from} is a redirect and must not be listed`);
}

for (const path of routes) {
  console.log(path);
  const response = await get(path);
  const where = path;

  if (response.status !== 200) {
    fail(where, `HTTP ${response.status}`);
    continue;
  }
  const html = await response.text();

  // 1. Navigation is the same everywhere, with no external marker on CV.
  const nav = navOf(html);
  if (!nav) {
    fail(where, 'no primary navigation');
  } else {
    if (nav.labels.join(' | ') !== NAV.join(' | ')) {
      fail(where, `navigation is [${nav.labels.join(', ')}], expected [${NAV.join(', ')}]`);
    }
    if (nav.hrefs.join(' | ') !== NAV_HREFS.join(' | ')) {
      fail(where, `navigation targets are [${nav.hrefs.join(', ')}]`);
    }
    if (nav.raw.includes('↗')) fail(where, 'the primary navigation carries an external marker');

    const current = expectedCurrent(path);
    if (current === null && nav.current.length !== 0) {
      fail(where, `marks ${nav.current.join(', ')} as current, expected none`);
    }
    if (current !== null && nav.current.join(' ') !== current) {
      fail(where, `marks [${nav.current.join(', ')}] as current, expected ${current}`);
    }
  }

  // 2. No page carries a label from an earlier version of the site.
  for (const label of RETIRED) {
    if (html.includes(label)) fail(where, `still says "${label}"`);
  }

  // 3. Project pages name their themes, and only from the current three.
  if (path.startsWith('/projects/')) {
    const crumb = html.match(/<nav[^>]*aria-label="Breadcrumb"[\s\S]*?<\/nav>/)?.[0] ?? '';
    const named = [...crumb.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)]
      .map((match) => decode(match[1]))
      .filter((text) => text && text !== '/' && text !== 'Research');
    if (named.length === 0) fail(where, 'breadcrumb names no theme');
    for (const name of named) {
      if (!THEMES.includes(name)) fail(where, `breadcrumb theme "${name}" is not current`);
    }
  }

  // 4. The research index still carries all three, in order.
  if (path === '/research/') {
    const names = [...html.matchAll(/class="theme__name[^"]*"[^>]*>([\s\S]*?)<\/h3>/g)].map(
      (match) => decode(match[1]),
    );
    if (names.join(' | ') !== THEMES.join(' | ')) {
      fail(where, `themes are [${names.join(', ')}]`);
    }
  }

  // 5. Metadata: canonical, og:type, both image alts, one theme-color per scheme.
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/)?.[1];
  if (canonical !== `${SITE}${path}`) fail(where, `canonical is ${canonical}`);

  const ogType = meta(html, 'property', 'og:type');
  if (ogType !== expectedOgType(path)) {
    fail(where, `og:type is "${ogType}", expected "${expectedOgType(path)}"`);
  }

  const ogAlt = meta(html, 'property', 'og:image:alt');
  const twitterAlt = meta(html, 'name', 'twitter:image:alt');
  if (!ogAlt) fail(where, 'no og:image:alt');
  if (twitterAlt !== ogAlt) fail(where, 'twitter:image:alt does not match og:image:alt');

  const themeColors = [...html.matchAll(/<meta[^>]*name="theme-color"[^>]*>/g)].map((m) => m[0]);
  if (themeColors.length !== 2) fail(where, `${themeColors.length} theme-color tag(s), expected 2`);
  if (!themeColors.some((tag) => tag.includes('#f7f6f2'))) fail(where, 'no light theme-color');
  if (!themeColors.some((tag) => tag.includes('#0e1116'))) fail(where, 'no dark theme-color');

  // 6. No build-clock date masquerading as a content date.
  if (html.includes('dateModified')) fail(where, 'declares a synthetic dateModified');

  // 7. Text is NFC, so the name is one codepoint per accented letter.
  if (html.includes('Nicolás')) fail(where, 'carries a decomposed accent (NFD)');
  if (html.normalize('NFC') !== html) fail(where, 'is not fully NFC');

  // 8. The social card this page points at exists.
  const ogImage = meta(html, 'property', 'og:image');
  if (!ogImage) fail(where, 'no og:image');
  else {
    const card = await get(new URL(ogImage).pathname, { method: 'HEAD' });
    if (!card.ok) fail(where, `og:image ${ogImage} is HTTP ${card.status}`);
  }

  if (!failures.some((entry) => entry.startsWith(`${where}:`))) pass('as expected');
}

console.log('\nlegacy URLs');
for (const [from, to] of REDIRECTS) {
  const response = await get(from);
  if (!response.ok) {
    fail(from, `HTTP ${response.status}`);
    continue;
  }
  const html = await response.text();
  const refresh = html.match(/http-equiv="refresh"[^>]*content="[^"]*url=([^"']+)"/i)?.[1];
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/)?.[1];
  const lands = refresh ?? canonical ?? '';
  if (!lands.includes(to)) fail(from, `points at "${lands}", expected ${to}`);
  else pass(`${from} → ${to}`);
}

console.log('\nfiles that must stay put');
for (const file of FILES) {
  const response = await get(file, { method: 'HEAD' });
  if (!response.ok) fail(file, `HTTP ${response.status}`);
  else pass(`${file} (${response.headers.get('content-type') ?? 'unknown type'})`);
}

console.log('\n404 handling');
const missing = await get('/this-page-does-not-exist/');
if (missing.status !== 404)
  fail('/this-page-does-not-exist/', `HTTP ${missing.status}, expected 404`);
else {
  const html = await missing.text();
  if (!/noindex/.test(html)) fail('404', 'is not marked noindex');
  else pass('unknown paths return the 404 page, marked noindex');
}

console.log('');
if (failures.length > 0) {
  console.error(`${failures.length} production check failure(s):`);
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}
console.log(`production at ${ORIGIN} matches every expectation.`);
