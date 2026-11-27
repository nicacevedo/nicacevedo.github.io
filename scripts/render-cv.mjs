// Renders the print-ready CV (and, optionally, the one-page résumé) from their
// HTML sources with Chromium, so the PDF is reproducible from the repository.
//   node scripts/render-cv.mjs                 -> public/assets/pdf/Nicolas_Acevedo_Villena_CV.pdf
//   node scripts/render-cv.mjs in.html out.pdf -> any other source/target pair
import { chromium } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const src = resolve(process.argv[2] ?? 'scripts/cv.html');
const out = resolve(process.argv[3] ?? 'public/assets/pdf/Nicolas_Acevedo_Villena_CV.pdf');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(src).href, { waitUntil: 'load' });
// Keep hyphenated compounds ("column-generation", "Frank–Wolfe") on one line: a break after the
// hyphen makes some PDF text extractors drop it and fuse the two words.
await page.evaluate(() => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  const compound = /[\p{L}\p{N}²]+(?:[-–][\p{L}\p{N}²]+)+/gu;
  for (const node of nodes) {
    const text = node.textContent;
    if (!compound.test(text)) continue;
    compound.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0;
    for (const m of text.matchAll(compound)) {
      frag.append(text.slice(last, m.index));
      const span = document.createElement('span');
      span.style.whiteSpace = 'nowrap';
      span.textContent = m[0];
      frag.append(span);
      last = m.index + m[0].length;
    }
    frag.append(text.slice(last));
    node.replaceWith(frag);
  }
});
// A <meta name="footer" content="..."> in the source adds "<content> · page/total"
// at the foot of every page (used by the two-page CV, not the one-page résumé).
const footer = await page.evaluate(() => document.querySelector('meta[name="footer"]')?.content ?? '');
await page.pdf({
  path: out,
  format: 'Letter',
  preferCSSPageSize: true,
  printBackground: true,
  displayHeaderFooter: Boolean(footer),
  headerTemplate: '<span></span>',
  footerTemplate: `<div style="width:100%;text-align:center;font:8pt Georgia,serif;color:#555">${footer} · <span class="pageNumber"></span>/<span class="totalPages"></span></div>`,
});
await browser.close();
console.log(`wrote ${out}`);
