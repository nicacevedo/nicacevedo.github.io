import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PAGES } from './routes';

const RULESETS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`axe — ${scheme}`, () => {
    for (const route of PAGES) {
      test(`${route.name} has no violations`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme });
        await page.goto(route.path);
        await page.evaluate(() => document.fonts.ready);

        const results = await new AxeBuilder({ page }).withTags(RULESETS).analyze();
        const summary = results.violations.map(
          (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`,
        );
        expect(summary, `${route.path} [${scheme}]`).toEqual([]);
      });
    }
  });
}

test.describe('zoom and reduced motion', () => {
  test('no horizontal overflow at 200% zoom on a narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 800 });
    for (const route of PAGES) {
      await page.goto(route.path);
      // 200% zoom on a 1280px screen is equivalent to a 640px CSS viewport.
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${route.path} at 200% zoom`).toBeLessThanOrEqual(1);
    }
  });

  test('reduced motion keeps the page fully rendered', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.hero__figure svg')).toBeVisible();
    const duration = await page.evaluate(
      () => getComputedStyle(document.querySelector('.btn')!).transitionDuration,
    );
    expect(parseFloat(duration)).toBeLessThan(0.02);
  });

  test('interactive targets are large enough to hit', async ({ page }) => {
    await page.goto('/');
    const small = await page.$$eval('a, button', (nodes) =>
      nodes
        .filter((n) => {
          const el = n as HTMLElement;
          if (el.closest('.skip-link') || el.offsetParent === null) return false;
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return false;
          // Inline links inside a paragraph are exempt from the target-size rule.
          const inline = getComputedStyle(el).display === 'inline';
          return !inline && (rect.height < 24 || rect.width < 24);
        })
        .map((n) => (n as HTMLElement).innerText.slice(0, 40)),
    );
    expect(small).toEqual([]);
  });
});
