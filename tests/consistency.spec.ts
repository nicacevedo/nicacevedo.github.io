/**
 * Route-wide consistency. Viewport-independent, so it runs once rather than
 * on every width: the point is what every page says, not how it lays out.
 *
 * Externally cached copies of this site still show an older navigation and an
 * older set of research-direction names. These assertions make a partial
 * rename impossible to ship.
 */
import { test, expect } from '@playwright/test';
import { PAGES, NAV, CURRENT_NAV, THEMES, RETIRED_LABELS } from './routes';

test.describe('primary navigation', () => {
  for (const route of PAGES) {
    test(`${route.name} offers exactly Research, Publications, Teaching and CV`, async ({
      page,
    }) => {
      await page.goto(route.path);
      const nav = page.getByRole('navigation', { name: 'Primary' });

      const labels = (await nav.locator('a').allInnerTexts()).map((text) =>
        text.replace(/\s+/g, ' ').trim(),
      );
      expect(labels, `${route.path} navigation`).toEqual([...NAV]);

      // CV is an internal HTML route, so it carries no external marker, and no
      // other item may grow one either.
      expect(labels.join(' '), `${route.path} navigation`).not.toContain('↗');

      const hrefs = await nav
        .locator('a')
        .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
      expect(hrefs).toEqual(['/research/', '/publications/', '/teaching/', '/cv/']);
    });
  }

  for (const [path, expected] of Object.entries(CURRENT_NAV)) {
    test(`${path} marks ${expected ?? 'no'} navigation item as current`, async ({ page }) => {
      await page.goto(path);
      const current = page
        .getByRole('navigation', { name: 'Primary' })
        .locator('a[aria-current="page"]');
      if (expected === null) {
        await expect(current).toHaveCount(0);
      } else {
        await expect(current).toHaveCount(1);
        await expect(current).toHaveText(expected);
      }
    });
  }
});

test.describe('research vocabulary', () => {
  test('no page uses a retired label', async ({ page }) => {
    for (const route of PAGES) {
      await page.goto(route.path);
      const html = await page.content();
      for (const label of RETIRED_LABELS) {
        expect(html, `${route.path} still says "${label}"`).not.toContain(label);
      }
    }
  });

  test('every theme named on a project page is one of the three current ones', async ({ page }) => {
    for (const route of PAGES.filter((p) => p.name.startsWith('project-'))) {
      await page.goto(route.path);

      // The breadcrumb names the primary theme, and the facts list names all of
      // them. `.label` is uppercased by CSS, so the source text is what to read.
      const crumb = ((await page.locator('.crumbs li').last().textContent()) ?? '').trim();
      expect(THEMES, `${route.path} breadcrumb`).toContain(crumb);

      const themesFact = page
        .locator('.project__fact')
        .filter({ has: page.locator('dt', { hasText: 'Themes' }) })
        .locator('dd');
      await expect(themesFact, `${route.path} has a Themes fact`).toHaveCount(1);
      const named = ((await themesFact.textContent()) ?? '')
        .split('·')
        .map((part) => part.trim())
        .filter(Boolean);
      expect(named.length).toBeGreaterThan(0);
      for (const name of named) {
        expect(THEMES, `${route.path} theme "${name}"`).toContain(name);
      }
    }
  });

  test('the research index lists the three themes in order, with their summaries', async ({
    page,
  }) => {
    await page.goto('/research/');
    const names = await page.locator('.theme__name').allInnerTexts();
    expect(names.map((n) => n.trim())).toEqual([...THEMES]);
    const summaries = await page.locator('.theme__summary').allInnerTexts();
    for (const summary of summaries) expect(summary.trim().length).toBeGreaterThan(60);
  });

  test('the homepage links each theme to its section on the research page', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('.theme__name a');
    await expect(links).toHaveCount(THEMES.length);
    for (const name of THEMES) {
      await expect(links.filter({ hasText: name })).toHaveCount(1);
    }
  });
});

test.describe('output terminology', () => {
  test('the publications page uses the agreed section names', async ({ page }) => {
    await page.goto('/publications/');
    await expect(page.getByRole('heading', { name: 'Scholarly outputs' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Open research code' })).toBeVisible();
  });

  test('every open-code entry says what kind of output it is', async ({ page }) => {
    const allowed = ['Research repository', 'Research code', 'Research software'];
    await page.goto('/publications/');
    const kinds = await page.locator('.soft__kind').allTextContents();
    expect(kinds.length).toBeGreaterThan(0);
    for (const kind of kinds) expect(allowed).toContain(kind.trim());
  });

  test('the unpublished presentation keeps its qualifier in every representation', async ({
    page,
  }) => {
    const label = 'Conference presentation (unpublished)';

    await page.goto('/publications/');
    const kinds = await page.locator('.pub__kind').allTextContents();
    expect(kinds.map((k) => k.trim())).toContain(label);

    // The compact lists must not drop it on the way to a shorter line.
    await page.goto('/');
    expect((await page.locator('.output__kind').allTextContents()).map((k) => k.trim())).toContain(
      label,
    );

    await page.goto('/cv/');
    const cv = ((await page.locator('#cv-publications').textContent()) ?? '').trim();
    expect(cv).toBe('Publications & presentations');
    const entries = await page.locator('.entry__org').allTextContents();
    expect(entries.some((text) => text.includes(label))).toBe(true);

    await page.goto('/projects/standardized-test-outliers/');
    const status = ((await page.locator('.project__fact dd').first().textContent()) ?? '').trim();
    expect(status).toBe(label);
    expect(await page.locator('.pub__kind').first().textContent()).toContain(label);
  });
});

test.describe('CV routing', () => {
  test('CV means the HTML page, and the PDF actions live on it', async ({ page }) => {
    await page.goto('/');
    const cv = page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'CV' });
    await expect(cv).toHaveAttribute('href', '/cv/');

    // The homepage's secondary call to action goes to the page, not the file.
    const cta = page.getByRole('link', { name: 'Curriculum vitae', exact: true });
    await expect(cta).toHaveAttribute('href', '/cv/');

    // No page other than /cv/ links straight at the PDF.
    for (const route of PAGES.filter((p) => p.path !== '/cv/')) {
      await page.goto(route.path);
      await expect(
        page.locator('a[href$="Nicolas_Acevedo_Villena_CV.pdf"]'),
        `${route.path} links the PDF directly`,
      ).toHaveCount(0);
    }

    await page.goto('/cv/');
    await expect(page.getByRole('link', { name: /download pdf/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /view pdf/i })).toBeVisible();
  });
});

test.describe('text encoding', () => {
  test('the name is emitted in NFC on every page that carries it', async ({ page }) => {
    const NFC = 'Nicolás';
    const NFD = 'Nicolás';

    for (const route of PAGES) {
      await page.goto(route.path);
      const html = await page.content();
      expect(html, `${route.path} contains a decomposed accent`).not.toContain(NFD);
    }

    // The three pages built from the .bib, where the parser hands back NFD.
    for (const path of ['/publications/', '/cv/', '/']) {
      await page.goto(path);
      const html = await page.content();
      expect(html, `${path} should carry the composed name`).toContain(NFC);
    }

    // The rendered author line, not just the source.
    await page.goto('/publications/');
    const authors = await page.locator('.pub__author.is-self').first().innerText();
    expect(authors.normalize('NFC')).toBe(authors);
    expect(authors).toContain(NFC);
  });

  test('structured data and metadata are NFC too', async ({ page }) => {
    await page.goto('/');
    const blocks = await page.$$eval('script[type="application/ld+json"]', (nodes) =>
      nodes.map((node) => node.textContent ?? ''),
    );
    for (const block of blocks) expect(block.normalize('NFC')).toBe(block);

    // A deployment date is not a modification date, so none is claimed.
    expect(blocks.join(' ')).not.toContain('dateModified');

    for (const name of ['description', 'twitter:image:alt'] as const) {
      const content = (await page.locator(`meta[name="${name}"]`).getAttribute('content')) ?? '';
      expect(content.normalize('NFC')).toBe(content);
    }
  });
});

test.describe('social metadata', () => {
  const expected: Record<string, string> = {
    '/': 'profile',
    '/cv/': 'profile',
    '/research/': 'website',
    '/publications/': 'website',
    '/teaching/': 'website',
    '/updates/': 'website',
    '/projects/equitable-property-assessment/': 'article',
    '/projects/data-center-externalities/': 'article',
    '/projects/gpu-first-order-solvers/': 'article',
    '/projects/feature-selection/': 'article',
    '/projects/standardized-test-outliers/': 'article',
    '/projects/adaptive-questionnaires/': 'article',
  };

  test('og:type describes what each page actually is', async ({ page }) => {
    for (const [path, type] of Object.entries(expected)) {
      await page.goto(path);
      await expect(page.locator('meta[property="og:type"]'), path).toHaveAttribute('content', type);
    }
  });

  test('both image alt texts are present and identical', async ({ page }) => {
    for (const route of PAGES) {
      await page.goto(route.path);
      const og = await page.locator('meta[property="og:image:alt"]').getAttribute('content');
      const twitter = await page.locator('meta[name="twitter:image:alt"]').getAttribute('content');
      expect(og, `${route.path} og:image:alt`).toBeTruthy();
      expect(twitter, `${route.path} twitter:image:alt`).toBe(og);
    }
  });
});
