/**
 * The narrow end of the range.
 *
 * Visual review already covers 390px. A 320px viewport is the practical floor
 * for a phone, and it is where a long theme name, a course code or a CV date
 * would be the first thing to break the layout. Checked once, at two widths,
 * rather than folded into the three-width regression suite.
 */
import { test, expect, type Page } from '@playwright/test';
import { PAGES, NAV } from './routes';

const WIDTHS = [320, 360] as const;

/**
 * Block-level elements whose content is wider than their own box. Elements the
 * design deliberately lets scroll (the BibTeX record) are excluded, as are
 * inline boxes and SVG, for which clientWidth means nothing.
 */
async function overflowingBoxes(page: Page) {
  return page.evaluate(() => {
    const problems: string[] = [];
    const roots = ['header', 'main', 'footer'];
    for (const root of roots) {
      const scope = document.querySelector(root);
      if (!scope) continue;
      for (const element of scope.querySelectorAll('*')) {
        if (!(element instanceof HTMLElement)) continue;
        const style = getComputedStyle(element);
        if (style.display === 'inline' || style.display === 'none') continue;
        if (style.overflowX !== 'visible') continue;
        if (element.clientWidth === 0) continue;
        if (element.scrollWidth - element.clientWidth > 1) {
          const name = `${element.tagName.toLowerCase()}.${element.className
            .toString()
            .split(/\s+/)
            .filter((c) => c && !c.startsWith('astro-'))
            .join('.')}`;
          problems.push(`${name} (${element.scrollWidth} > ${element.clientWidth})`);
        }
      }
    }
    return [...new Set(problems)];
  });
}

for (const width of WIDTHS) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 760 } });

    for (const route of PAGES) {
      test(`${route.name} fits`, async ({ page }) => {
        await page.goto(route.path);
        await page.evaluate(() => document.fonts.ready);

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${route.path} page overflow in px`).toBeLessThanOrEqual(1);

        expect(await overflowingBoxes(page), `${route.path} overflowing boxes`).toEqual([]);
      });
    }

    test('the header keeps the navigation on one row', async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);

      // Below 23.5rem the navigation drops to a row of its own, so the header
      // is two rows tall. It must not grow past that.
      const height = await page
        .locator('.site-header')
        .evaluate((element) => element.getBoundingClientRect().height);
      expect(height, 'header height').toBeLessThanOrEqual(104);

      // The theme toggle is a control, not slack to be absorbed by a tight row.
      const toggle = await page
        .locator('.theme-toggle')
        .evaluate((element) => element.getBoundingClientRect().width);
      expect(toggle, 'theme toggle width').toBeGreaterThanOrEqual(40);

      const list = page.locator('.site-nav__list');
      const rows = await list.evaluate((element) => {
        const tops = [...element.querySelectorAll('a')].map((link) =>
          Math.round(link.getBoundingClientRect().top),
        );
        return new Set(tops).size;
      });
      expect(rows, 'navigation rows').toBe(1);

      // And no label is broken across two lines inside its own link.
      const wrapped = await list.evaluate((element) =>
        [...element.querySelectorAll('a')]
          .filter((link) => link.getBoundingClientRect().height > 44)
          .map((link) => link.textContent?.trim() ?? ''),
      );
      expect(wrapped, 'labels wrapped onto a second line').toEqual([]);

      for (const label of NAV) {
        await expect(
          page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: label }),
        ).toBeVisible();
      }
    });

    test('the hero statement breaks only where it is told to', async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);

      const lines = page.locator('.hero__line');
      await expect(lines).toHaveCount(3);

      const measured = await lines.evaluateAll((nodes) =>
        nodes.map((node) => ({
          text: node.textContent?.trim() ?? '',
          height: node.getBoundingClientRect().height,
          overflow: node.scrollWidth - node.clientWidth,
        })),
      );

      // Each authored line is one visual line: the tallest may not be much
      // taller than the shortest, and none may run past its own box.
      const heights = measured.map((line) => line.height);
      expect(Math.max(...heights) / Math.min(...heights)).toBeLessThan(1.6);
      for (const line of measured) {
        expect(line.overflow, `"${line.text}" overflow`).toBeLessThanOrEqual(1);
      }
    });

    test('dense titles and metadata stay inside their columns', async ({ page }) => {
      const checks = [
        { path: '/', selector: '.theme__name' },
        { path: '/', selector: '.case__title' },
        { path: '/', selector: '.chrono__period' },
        { path: '/', selector: '.output__title' },
        { path: '/teaching/', selector: '.course__title' },
        { path: '/publications/', selector: '.pub__title' },
        { path: '/publications/', selector: '.soft__repo' },
        { path: '/cv/', selector: '.entry__period' },
        { path: '/cv/', selector: '.entry__role' },
        { path: '/research/', selector: '.row__title' },
      ];

      for (const { path, selector } of checks) {
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        const worst = await page
          .locator(selector)
          .evaluateAll((nodes) =>
            Math.max(0, ...nodes.map((node) => node.scrollWidth - node.clientWidth)),
          );
        expect(worst, `${path} ${selector}`).toBeLessThanOrEqual(1);
      }
    });

    test('chips, links and the footer remain usable targets', async ({ page }) => {
      for (const path of ['/publications/', '/projects/equitable-property-assessment/', '/cv/']) {
        await page.goto(path);
        const small = await page.$$eval('a, button', (nodes) =>
          nodes
            .filter((node) => {
              const element = node as HTMLElement;
              if (element.closest('.skip-link') || element.offsetParent === null) return false;
              const rect = element.getBoundingClientRect();
              if (rect.width === 0 || rect.height === 0) return false;
              if (getComputedStyle(element).display === 'inline') return false;
              return rect.height < 24 || rect.width < 24;
            })
            .map((node) => (node as HTMLElement).innerText.slice(0, 40)),
        );
        expect(small, `${path} targets under 24px`).toEqual([]);
      }
    });
  });
}
