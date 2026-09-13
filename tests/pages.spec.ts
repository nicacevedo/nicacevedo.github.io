import { test, expect, type Page } from '@playwright/test';
import { PAGES, COMPATIBILITY, STATIC_FILES } from './routes';

/** Fails the test if the page logs anything to console.error or throws. */
function watchConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

test.describe('every page', () => {
  for (const route of PAGES) {
    test(`${route.name} renders, is unique and stays inside the viewport`, async ({ page }) => {
      const errors = watchConsole(page);
      const response = await page.goto(route.path);
      expect(response?.status(), `${route.path} should be served`).toBe(200);

      // Exactly one H1, and it is the page's own heading.
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      await expect(h1).toContainText(route.h1);

      // Unique, non-empty metadata.
      await expect(page).toHaveTitle(/\S/);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description?.length ?? 0).toBeGreaterThan(30);

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBe(`https://nicacevedo.github.io${route.path}`);

      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(ogImage).toMatch(/^https:\/\/nicacevedo\.github\.io\/generated\/og\/.+\.png$/);

      // Landmarks.
      await expect(page.locator('main#main')).toHaveCount(1);
      await expect(page.locator('header.site-header')).toHaveCount(1);
      await expect(page.locator('footer.site-footer')).toHaveCount(1);

      // No horizontal overflow at any tested width.
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(1);

      expect(errors, 'console errors').toEqual([]);
    });
  }

  test('headings descend without skipping a level', async ({ page }) => {
    for (const route of PAGES) {
      await page.goto(route.path);
      const levels = await page.$$eval('h1, h2, h3, h4, h5, h6', (nodes) =>
        nodes.map((n) => Number(n.tagName[1])),
      );
      let previous = levels[0] ?? 1;
      expect(previous, `${route.path} should start at h1`).toBe(1);
      for (const level of levels.slice(1)) {
        expect(level - previous, `heading jump on ${route.path}`).toBeLessThanOrEqual(1);
        previous = level;
      }
    }
  });
});

test.describe('url compatibility', () => {
  for (const route of COMPATIBILITY) {
    test(`${route.from} still reaches ${route.to}`, async ({ page }) => {
      const response = await page.goto(route.from);
      expect(response?.status()).toBe(200);
      // A glob like `**/` also matches the source path, so match the pathname.
      await page.waitForURL((url) => url.pathname === route.to, { timeout: 10_000 });
      expect(new URL(page.url()).pathname).toBe(route.to);
    });
  }

  for (const file of STATIC_FILES) {
    test(`${file} is served`, async ({ request }) => {
      const response = await request.get(file);
      expect(response.status()).toBe(200);
      expect(Number(response.headers()['content-length'] ?? '1')).toBeGreaterThan(0);
    });
  }

  test('404 page renders and is excluded from indexing', async ({ page }) => {
    await page.goto('/404.html');
    await expect(page.locator('h1')).toContainText('No feasible page');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.getByRole('link', { name: 'Research' }).first()).toBeVisible();
  });
});

test.describe('navigation', () => {
  test('primary navigation is reachable and marks the current page', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    for (const label of ['Research', 'Publications', 'Teaching', 'CV']) {
      await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible();
    }

    await nav.getByRole('link', { name: 'Research', exact: true }).click();
    await page.waitForURL('**/research/');
    await expect(
      page
        .getByRole('navigation', { name: 'Primary' })
        .getByRole('link', { name: 'Research', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
  });

  test('the name mark returns home', async ({ page }) => {
    await page.goto('/publications/');
    await page.getByRole('link', { name: /home/i }).first().click();
    await page.waitForURL((url) => url.pathname === '/');
  });

  test('skip link moves focus to the main landmark', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.locator('.skip-link');
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await skip.press('Enter');
    expect(new URL(page.url()).hash).toBe('#main');
  });

  test('the focus ring is visible on the first navigation link', async ({ page }) => {
    await page.goto('/');
    const link = page.getByRole('navigation', { name: 'Primary' }).getByRole('link').first();
    await link.focus();
    const outline = await link.evaluate((el) => getComputedStyle(el).outlineWidth);
    expect(parseFloat(outline)).toBeGreaterThan(0);
  });
});

test.describe('theme', () => {
  test('toggles, persists and survives a reload', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('#theme-toggle');
    const before = await page.evaluate(() =>
      matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    );

    await toggle.click();
    const after = before === 'dark' ? 'light' : 'dark';
    await expect(page.locator('html')).toHaveAttribute('data-theme', after);
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(after);

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', after);

    // The stored preference is applied before paint, so no flash of the other theme.
    const painted = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(painted).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('follows the system preference when nothing is stored', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'light');
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe('rgb(14, 17, 22)');
  });
});

test.describe('links', () => {
  test('no internal link is broken', async ({ page, request }) => {
    const seen = new Set<string>();
    for (const route of PAGES) {
      await page.goto(route.path);
      const hrefs = await page.$$eval('a[href]', (anchors) =>
        anchors.map((a) => (a as HTMLAnchorElement).getAttribute('href') ?? ''),
      );
      for (const href of hrefs) {
        if (!href.startsWith('/') || href.startsWith('//')) continue;
        const target = href.split('#')[0]!;
        if (!target || seen.has(target)) continue;
        seen.add(target);
        const response = await request.get(target);
        expect(response.status(), `${route.path} links to ${target}`).toBe(200);
      }
    }
    expect(seen.size).toBeGreaterThan(10);
  });

  test('in-page anchors exist', async ({ page }) => {
    for (const route of PAGES) {
      await page.goto(route.path);
      const anchors = await page.$$eval('a[href^="/"], a[href^="#"]', (nodes) =>
        nodes
          .map((n) => (n as HTMLAnchorElement).getAttribute('href') ?? '')
          .filter((href) => href.includes('#')),
      );
      for (const href of anchors) {
        const [path, hash] = href.split('#');
        if (!hash) continue;
        if (path && path !== route.path) await page.goto(path);
        const found = await page.evaluate((id) => Boolean(document.getElementById(id)), hash);
        expect(found, `${href} target`).toBe(true);
        if (path && path !== route.path) await page.goto(route.path);
      }
    }
  });

  test('external profile links are present and correct', async ({ page }) => {
    await page.goto('/');
    for (const href of [
      'https://github.com/nicacevedo',
      'https://www.linkedin.com/in/nacevedo-villena',
      'mailto:nacevedo@mit.edu',
    ]) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
    }
    // Every new-tab link opts out of window.opener access.
    const unsafe = await page.$$eval(
      'a[target="_blank"]',
      (nodes) => nodes.filter((n) => !(n.getAttribute('rel') ?? '').includes('noopener')).length,
    );
    expect(unsafe).toBe(0);
  });

  test('Teaching is in the primary navigation and About is not', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link', { name: 'Teaching', exact: true })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'About', exact: true })).toHaveCount(0);
    await expect(page.locator('a[href="/about/"]')).toHaveCount(0);
  });

  test('the CV is reachable as a PDF from the CV page', async ({ page, request }) => {
    await page.goto('/cv/');
    const href = await page.getByRole('link', { name: /download pdf/i }).getAttribute('href');
    expect(href).toBe('/assets/pdf/Nicolas_Acevedo_Villena_CV.pdf');
    const response = await request.get(href!);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('pdf');
  });
});

test.describe('content integrity', () => {
  test('the name keeps its accent everywhere it appears', async ({ page }) => {
    for (const route of PAGES) {
      await page.goto(route.path);
      const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
      expect(body, `${route.path} should not contain an unaccented name`).not.toMatch(
        /Nicolas Acevedo Villena/,
      );
    }
  });

  test('no placeholder or template text survives', async ({ page }) => {
    const forbidden = [
      /lorem ipsum/i,
      /al-folio/i,
      /TODO\(/,
      /your cool projects/i,
      /Maruan/i,
      /Powered by/i,
      /Built with/i,
    ];
    for (const route of PAGES) {
      await page.goto(route.path);
      const html = await page.content();
      for (const pattern of forbidden) {
        expect(html, `${route.path} matched ${pattern}`).not.toMatch(pattern);
      }
    }
  });

  test('no stray space before punctuation', async ({ page }) => {
    for (const route of PAGES) {
      await page.goto(route.path);
      // Screen-reader-only suffixes are read separately, so drop them first.
      const text = await page.evaluate(() => {
        const main = document.querySelector('main')!.cloneNode(true) as HTMLElement;
        main.querySelectorAll('.visually-hidden').forEach((node) => node.remove());
        return (main.textContent ?? '').replace(/\s+/g, ' ');
      });
      const matches = text.match(/\S{0,24}\s[,.;:](\s|$)/g) ?? [];
      expect(matches, `${route.path}`).toEqual([]);
    }
  });

  test('structured data on the homepage describes the person accurately', async ({ page }) => {
    await page.goto('/');
    const blocks = await page.$$eval('script[type="application/ld+json"]', (nodes) =>
      nodes.map((n) => JSON.parse(n.textContent ?? '{}')),
    );
    const profile = blocks.find((b) => b['@type'] === 'ProfilePage');
    expect(profile).toBeDefined();
    expect(profile.mainEntity.name).toBe('Nicolás Acevedo Villena');
    expect(profile.mainEntity.sameAs).toContain('https://github.com/nicacevedo');
    // Nothing unverified: no invented identifiers.
    expect(JSON.stringify(profile)).not.toMatch(/orcid|scholar/i);
  });

  test('project statuses stay within the agreed vocabulary', async ({ page }) => {
    const allowed = [
      'Ongoing research',
      'Ongoing public-data modeling',
      'Completed',
      'Conference presentation (unpublished)',
    ];
    for (const route of PAGES.filter((p) => p.name.startsWith('project-'))) {
      await page.goto(route.path);
      const status = await page.locator('.project__fact dd').first().innerText();
      expect(allowed).toContain(status.trim());
    }
  });
});

test.describe('images and media', () => {
  test('every image declares its size and has alt text', async ({ page }) => {
    for (const route of PAGES) {
      await page.goto(route.path);
      const problems = await page.$$eval('img', (images) =>
        images
          .filter(
            (img) => !img.getAttribute('width') || !img.getAttribute('height') || img.alt === null,
          )
          .map((img) => img.getAttribute('src') ?? 'unknown'),
      );
      expect(problems, `${route.path}`).toEqual([]);
    }
  });

  test('every image actually loads', async ({ page }) => {
    for (const route of PAGES) {
      await page.goto(route.path);
      const broken = await page.evaluate(async () => {
        document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
          (img as HTMLImageElement).loading = 'eager';
        });
        await Promise.all(
          [...document.images].map((img) => (img.complete ? null : img.decode().catch(() => null))),
        );
        return [...document.images]
          .filter((img) => img.naturalWidth === 0)
          .map((img) => img.currentSrc || img.src);
      });
      expect(broken, `${route.path}`).toEqual([]);
    }
  });

  test('decorative figures are hidden from assistive technology', async ({ page }) => {
    await page.goto('/');
    const exposed = await page.$$eval(
      'svg.fig',
      (nodes) =>
        nodes.filter(
          (n) => n.getAttribute('aria-hidden') !== 'true' && !n.getAttribute('aria-label'),
        ).length,
    );
    expect(exposed).toBe(0);
  });
});
