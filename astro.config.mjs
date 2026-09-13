// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://nicacevedo.github.io';

// Subset ranges as published by Google Fonts, so a page of plain English never
// downloads the extended-Latin file.
/** @type {[string, ...string[]]} */
const LATIN = [
  'U+0000-00FF',
  'U+0131',
  'U+0152-0153',
  'U+02BB-02BC',
  'U+02C6',
  'U+02DA',
  'U+02DC',
  'U+0304',
  'U+0308',
  'U+0329',
  'U+2000-206F',
  'U+20AC',
  'U+2122',
  'U+2191',
  'U+2193',
  'U+2212',
  'U+2215',
  'U+FEFF',
  'U+FFFD',
];
/** @type {[string, ...string[]]} */
const LATIN_EXT = [
  'U+0100-02BA',
  'U+02BD-02C5',
  'U+02C7-02CC',
  'U+02CE-02D7',
  'U+02DD-02FF',
  'U+0304',
  'U+0308',
  'U+0329',
  'U+1D00-1DBF',
  'U+1E00-1E9F',
  'U+1EF2-1EFF',
  'U+2020',
  'U+20A0-20AB',
  'U+20AD-20C0',
  'U+2113',
  'U+2C60-2C7F',
  'U+A720-A7FF',
];

/** Routes that exist only to keep old URLs alive; they must stay out of the sitemap. */
const COMPATIBILITY_ROUTES = [
  '/projects/',
  '/projects/fairness-robust-constraints/',
  '/news/',
  '/news/announcement_1/',
  '/news/announcement_2/',
  '/news/announcement_3/',
  '/news/announcement_4/',
];

// https://astro.build/config
export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  prefetch: false,
  devToolbar: { enabled: false },
  image: {
    responsiveStyles: true,
  },
  // Fonts are vendored into src/assets/fonts (OFL, see the licenses beside
  // them) and emitted by Astro's local provider: subset by unicode-range,
  // preloaded where it matters, and never fetched from a CDN at build or run
  // time. Optimized fallback metrics come for free, which keeps CLS at zero.
  fonts: [
    {
      name: 'Instrument Sans Variable',
      cssVariable: '--font-sans',
      provider: fontProviders.local(),
      fallbacks: [
        'ui-sans-serif',
        'system-ui',
        'Segoe UI',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
      ],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/instrument-sans-latin-wght-normal.woff2'],
            weight: '400 700',
            style: 'normal',
            unicodeRange: LATIN,
          },
          {
            src: ['./src/assets/fonts/instrument-sans-latin-ext-wght-normal.woff2'],
            weight: '400 700',
            style: 'normal',
            unicodeRange: LATIN_EXT,
          },
        ],
      },
    },
    {
      name: 'Newsreader Variable',
      cssVariable: '--font-serif',
      provider: fontProviders.local(),
      fallbacks: ['ui-serif', 'Iowan Old Style', 'Georgia', 'Times New Roman', 'serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/newsreader-latin-wght-normal.woff2'],
            weight: '400 600',
            style: 'normal',
            unicodeRange: LATIN,
          },
          {
            src: ['./src/assets/fonts/newsreader-latin-ext-wght-normal.woff2'],
            weight: '400 600',
            style: 'normal',
            unicodeRange: LATIN_EXT,
          },
          {
            src: ['./src/assets/fonts/newsreader-latin-wght-italic.woff2'],
            weight: '400 600',
            style: 'italic',
            unicodeRange: LATIN,
          },
          {
            src: ['./src/assets/fonts/newsreader-latin-ext-wght-italic.woff2'],
            weight: '400 600',
            style: 'italic',
            unicodeRange: LATIN_EXT,
          },
        ],
      },
    },
  ],
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        return !COMPATIBILITY_ROUTES.includes(path);
      },
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (path === '/') item.priority = 1.0;
        else if (path === '/research/' || path === '/publications/') item.priority = 0.9;
        else if (path.startsWith('/projects/')) item.priority = 0.8;
        return item;
      },
    }),
  ],
  redirects: {
    '/projects/': '/research/',
    '/projects/fairness-robust-constraints/': '/projects/equitable-property-assessment/',
    '/news/': '/updates/',
    '/news/announcement_1/': '/updates/',
    '/news/announcement_2/': '/updates/',
    '/news/announcement_3/': '/updates/',
    '/news/announcement_4/': '/updates/',
  },
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
