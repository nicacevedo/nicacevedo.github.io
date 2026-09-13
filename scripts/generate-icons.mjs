/**
 * Generates the favicon set from one geometry: an N whose diagonal descends to
 * a marked optimum. Run with `npm run icons`; output is committed.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const OUT = new URL('../public/favicon/', import.meta.url);

const INK_LIGHT = '#111419';
const INK_DARK = '#f2f1ec';
const SIGNAL_LIGHT = '#2856d8';
const SIGNAL_DARK = '#7392ff';
const CANVAS = '#f7f6f2';

const glyph = (ink, signal, stroke = 2.9) => `
  <path d="M8 26.5V6M8 6l16 20.5M24 26.5V6"
        fill="none" stroke="${ink}" stroke-width="${stroke}"
        stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="24" cy="26.5" r="3.2" fill="${signal}"/>`;

/** Theme-aware SVG favicon: it inverts with the browser chrome. */
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    .ink { stroke: ${INK_LIGHT}; }
    .opt { fill: ${SIGNAL_LIGHT}; }
    @media (prefers-color-scheme: dark) {
      .ink { stroke: ${INK_DARK}; }
      .opt { fill: ${SIGNAL_DARK}; }
    }
  </style>
  <path class="ink" d="M8 26.5V6M8 6l16 20.5M24 26.5V6" fill="none" stroke-width="2.9"
        stroke-linecap="round" stroke-linejoin="round"/>
  <circle class="opt" cx="24" cy="26.5" r="3.2"/>
</svg>`;

const plate = (
  bg,
  ink,
  signal,
  inset = 0,
) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="${bg}"/>
  <g transform="translate(16 16) scale(${1 - inset}) translate(-16 -16)">${glyph(ink, signal)}</g>
</svg>`;

/** Minimal ICO container holding a single PNG image. */
function icoFromPng(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0);
  entry.writeUInt8(size === 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12);
  return Buffer.concat([header, entry, png]);
}

const render = (svg, size) =>
  sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();

await mkdir(OUT, { recursive: true });
await writeFile(new URL('favicon.svg', OUT), faviconSvg);

const transparent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${glyph(INK_LIGHT, SIGNAL_LIGHT)}</svg>`;
await writeFile(new URL('favicon-32.png', OUT), await render(transparent, 32));

const plated = plate(CANVAS, INK_LIGHT, SIGNAL_LIGHT, 0.14);
await writeFile(new URL('apple-touch-icon.png', OUT), await render(plated, 180));
await writeFile(new URL('icon-192.png', OUT), await render(plated, 192));
await writeFile(new URL('icon-512.png', OUT), await render(plated, 512));

const ico = await render(transparent, 32);
await writeFile(new URL('../public/favicon.ico', import.meta.url), icoFromPng(ico, 32));

await writeFile(
  new URL('site.webmanifest', OUT),
  `${JSON.stringify(
    {
      name: 'Nicolás Acevedo Villena',
      short_name: 'N. Acevedo',
      icons: [
        { src: '/favicon/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/favicon/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      theme_color: '#f7f6f2',
      background_color: '#f7f6f2',
      display: 'minimal-ui',
      start_url: '/',
    },
    null,
    2,
  )}\n`,
);

console.log('icons written to public/favicon/');
