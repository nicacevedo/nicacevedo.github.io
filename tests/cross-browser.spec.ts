/**
 * Cross-engine smoke suite.
 *
 * The Chromium suite in pages.spec.ts and a11y.spec.ts stays the full
 * regression; this file is the part that is worth paying for on three engines,
 * so it checks the things an engine can actually differ on: layout width,
 * sticky positioning, font loading, inline scripting and SVG rendering.
 *
 * Runs on Chromium, Firefox, WebKit and a mobile WebKit profile.
 */
import { test, expect, type Page } from '@playwright/test';
import { SMOKE_PAGES, NAV } from './routes';

function watchConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

for (const route of SMOKE_PAGES) {
  test(`${route.name} renders in this engine`, async ({ page }) => {
    const errors = watchConsole(page);

    const response = await page.goto(route.path);
    expect(response?.status(), route.path).toBe(200);

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText(route.h1);

    // Landmarks, so the page is not a blank shell that happens to carry an H1.
    await expect(page.locator('header.site-header')).toBeVisible();
    await expect(page.locator('main#main')).toBeVisible();
    await expect(page.locator('footer.site-footer')).toBeVisible();

    // The personal mark is inline SVG; if an engine cannot draw it, it has no size.
    const mark = page.locator('header .mark-n');
    await expect(mark).toBeVisible();
    const markBox = await mark.boundingBox();
    expect(markBox?.width ?? 0).toBeGreaterThan(8);

    // Every page-level figure is inline SVG drawn from build-time geometry.
    const figures = page.locator('main svg');
    if ((await figures.count()) > 0) {
      const box = await figures.first().boundingBox();
      expect(box?.width ?? 0, `${route.path} first figure width`).toBeGreaterThan(20);
      expect(box?.height ?? 0, `${route.path} first figure height`).toBeGreaterThan(20);
    }

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `${route.path} horizontal overflow in px`).toBeLessThanOrEqual(1);

    expect(errors, `${route.path} console errors`).toEqual([]);
  });
}

test('the vendored typefaces resolve', async ({ page }) => {
  await page.goto('/');
  const fonts = await page.evaluate(async () => {
    await document.fonts.ready;
    return {
      body: getComputedStyle(document.body).fontFamily,
      loaded: [...document.fonts]
        .filter((face) => face.status === 'loaded')
        .map((face) => face.family.replace(/["']/g, '')),
    };
  });

  expect(fonts.body).toContain('Instrument Sans');
  expect(fonts.loaded.some((family) => family.includes('Instrument Sans'))).toBe(true);
});

test('the primary navigation works and marks the page it reached', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary' });
  for (const label of NAV) {
    await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible();
  }

  await nav.getByRole('link', { name: 'Publications', exact: true }).click();
  await page.waitForURL((url) => url.pathname === '/publications/');
  await expect(
    page
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: 'Publications', exact: true }),
  ).toHaveAttribute('aria-current', 'page');

  // And back home by the mark.
  await page.getByRole('link', { name: /home/i }).first().click();
  await page.waitForURL((url) => url.pathname === '/');
});

test('the theme toggle changes the page and the browser chrome', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('#theme-toggle');
  await expect(toggle).toBeVisible();

  const read = () =>
    page.evaluate(() => ({
      theme: document.documentElement.dataset.theme ?? null,
      background: getComputedStyle(document.body).backgroundColor,
      chrome:
        document
          .querySelector('meta[name="theme-color"]')
          ?.getAttribute('content')
          ?.toLowerCase() ?? null,
    }));

  const before = await read();
  await toggle.click();
  const after = await read();

  expect(after.theme).not.toBe(before.theme);
  expect(after.background).not.toBe(before.background);

  // The one theme-color tag follows the effective theme, manual choice included.
  const expectedChrome = after.theme === 'dark' ? '#0e1116' : '#f7f6f2';
  expect(after.chrome).toBe(expectedChrome);

  // And it survives a reload, still before first paint.
  await page.reload();
  const reloaded = await read();
  expect(reloaded.theme).toBe(after.theme);
  expect(reloaded.chrome).toBe(expectedChrome);
  expect(reloaded.background).toBe(after.background);
});

test('the header stays put while the page scrolls', async ({ page }) => {
  await page.goto('/');
  const header = page.locator('#site-header');

  const position = await header.evaluate((el) => getComputedStyle(el).position);
  expect(position).toBe('sticky');

  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(header).toHaveClass(/is-scrolled/);
  await expect(header).toBeInViewport();

  const top = await header.evaluate((el) => el.getBoundingClientRect().top);
  expect(Math.abs(top), 'header offset from the top of the viewport').toBeLessThanOrEqual(2);

  // The navigation is still usable from down the page.
  await expect(
    page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'CV' }),
  ).toBeVisible();
});
