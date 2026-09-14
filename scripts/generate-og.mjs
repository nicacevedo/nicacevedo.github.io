/**
 * Deterministic 1200x630 social cards.
 *
 * Satori lays the card out and embeds the type as outlines, so rasterising with
 * sharp needs no font at all. Nothing here screenshots a page; the same inputs
 * always produce the same bytes.
 *
 * Run with `npm run og`. Output is committed under public/generated/og/.
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';
import { artworkFor, landscape } from './og-figures.mjs';
import { themeById, themeNames } from '../src/data/themes.ts';
import { profile } from '../src/data/profile.ts';

const require = createRequire(import.meta.url);
const OUT = new URL('../public/generated/og/', import.meta.url);

// Identity, positioning and the research vocabulary come from the same data the
// pages read, so a card can never disagree with the site.
const NAME = profile.name;
const CONTEXT = profile.affiliation;
/** profile.methods as a standalone sentence; a card is not written in first person. */
const METHODS = `${profile.methods[0].toUpperCase()}${profile.methods.slice(1)}.`;

const C = {
  canvas: '#f7f6f2',
  ink: '#111419',
  muted: '#5e646c',
  faint: '#9aa0a6',
  line: '#dadddc',
  signal: '#2856d8',
  graph: '#b9bfbd',
};

const fontFile = (weight) =>
  require.resolve(`@fontsource/instrument-sans/files/instrument-sans-latin-${weight}-normal.woff`);

const fonts = [
  { name: 'Instrument Sans', data: await readFile(fontFile(400)), weight: 400, style: 'normal' },
  { name: 'Instrument Sans', data: await readFile(fontFile(500)), weight: 500, style: 'normal' },
  { name: 'Instrument Sans', data: await readFile(fontFile(600)), weight: 600, style: 'normal' },
];

const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="34" height="34">
  <path d="M8 26.5V6M8 6l16 20.5M24 26.5V6" fill="none" stroke="${C.ink}" stroke-width="2.9" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="24" cy="26.5" r="3.2" fill="${C.signal}"/>
</svg>`;

const dataUri = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

/* ---------------------------------------------------------------------------
   Card layout
   --------------------------------------------------------------------------- */

const SITE_ART = landscape(520, 470);

function card({ eyebrow, title, subtitle, footer, art = SITE_ART }) {
  return {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        backgroundColor: C.canvas,
        fontFamily: 'Instrument Sans',
        position: 'relative',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              right: '54px',
              top: '80px',
              display: 'flex',
              opacity: 0.95,
            },
            children: {
              type: 'img',
              props: { src: dataUri(art), width: 520, height: 470 },
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              padding: '64px 72px',
              width: '760px',
              height: '100%',
              justifyContent: 'space-between',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center', gap: '14px' },
                  children: [
                    { type: 'img', props: { src: dataUri(markSvg), width: 34, height: 34 } },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '19px',
                          color: C.muted,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          fontWeight: 500,
                        },
                        children: eyebrow,
                      },
                    },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column' },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: title.length > 46 ? '48px' : '64px',
                          lineHeight: 1.04,
                          letterSpacing: '-0.03em',
                          color: C.ink,
                          fontWeight: 500,
                          maxWidth: '590px',
                        },
                        children: title,
                      },
                    },
                    subtitle
                      ? {
                          type: 'div',
                          props: {
                            style: {
                              marginTop: '22px',
                              fontSize: '25px',
                              lineHeight: 1.4,
                              color: C.muted,
                              maxWidth: '560px',
                            },
                            children: subtitle,
                          },
                        }
                      : null,
                  ].filter(Boolean),
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    borderTop: `1px solid ${C.line}`,
                    paddingTop: '20px',
                    fontSize: '20px',
                    color: C.faint,
                  },
                  children: [
                    { type: 'div', props: { style: { color: C.ink }, children: NAME } },
                    { type: 'div', props: { children: '·' } },
                    { type: 'div', props: { children: footer } },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

const CARDS = [
  {
    slug: 'default',
    eyebrow: CONTEXT,
    title: profile.statement,
    subtitle: METHODS,
    footer: 'nicacevedo.github.io',
  },
  {
    slug: 'home',
    eyebrow: CONTEXT,
    title: profile.statement,
    subtitle: METHODS,
    footer: 'nicacevedo.github.io',
  },
  {
    slug: 'research',
    eyebrow: 'Research',
    title: 'Where a model is wrong matters as much as how often.',
    subtitle: themeNames,
    footer: 'Research',
  },
  {
    slug: 'publications',
    eyebrow: 'Publications',
    title: 'Formal research outputs',
    subtitle: 'Theses, conference work and open research code.',
    footer: 'Publications',
  },
  {
    slug: 'cv',
    eyebrow: 'Curriculum vitae',
    title: NAME,
    subtitle: 'Education, research, experience, teaching and awards.',
    footer: 'CV',
  },
  {
    slug: 'updates',
    eyebrow: 'Updates',
    title: 'What has changed, and when',
    subtitle: 'Research and professional milestones, most recent first.',
    footer: 'Updates',
  },
  {
    slug: 'teaching',
    eyebrow: 'Teaching',
    title: 'Courses and recitations',
    subtitle: 'MIT Sloan and the Universidad de Chile.',
    footer: 'Teaching',
  },
];

/* Project cards come straight from the research collection's frontmatter, so a
   new project gets a card without touching this file. */
const RESEARCH_DIR = new URL('../src/content/research/', import.meta.url);

/** Reads just the scalar frontmatter keys this script needs. */
function frontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const out = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.+)$/);
    if (!field) continue;
    out[field[1]] = field[2].trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

const projects = [];
for (const file of (await readdir(RESEARCH_DIR)).filter((f) => f.endsWith('.md')).sort()) {
  const data = frontmatter(await readFile(new URL(file, RESEARCH_DIR), 'utf8'));
  if (!data.title) continue;
  const art = artworkFor[data.visual];
  projects.push({
    slug: file.replace(/\.md$/, ''),
    eyebrow: themeById[data.primaryTheme]?.name ?? 'Research',
    title: data.title,
    subtitle: data.description ?? '',
    footer: 'Research',
    // Each project's card shows that project's own figure, never the portrait
    // and never the same generic artwork.
    art: art ? art(520, 470) : SITE_ART,
  });
}

await mkdir(OUT, { recursive: true });

for (const spec of [...CARDS, ...projects]) {
  const svg = await satori(card(spec), { width: 1200, height: 630, fonts, embedFont: true });
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  await writeFile(new URL(`${spec.slug}.png`, OUT), png);
  console.log(`og/${spec.slug}.png  ${(png.length / 1024).toFixed(0)}kB`);
}
