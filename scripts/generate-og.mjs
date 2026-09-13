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
import { contour, descentPath, projector, toSmoothPath } from '../src/utils/field.ts';
import { themeById } from '../src/data/themes.ts';

const require = createRequire(import.meta.url);
const OUT = new URL('../public/generated/og/', import.meta.url);

const NAME = 'Nicolás Acevedo Villena';
const CONTEXT = 'MIT Operations Research Center';

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

/* ---------------------------------------------------------------------------
   The card's artwork: the same decision landscape the site uses, drawn as a
   standalone SVG string so satori can place it as an image.
   --------------------------------------------------------------------------- */

const field = (x, y) => 0.55 * (1 - x) ** 2 + 2.6 * (y - 0.58 * x * x) ** 2;
const OPTIMUM = [1, 0.58];
const LEVELS = [0.05, 0.15, 0.34, 0.64, 1.08, 1.7, 2.55, 3.7, 5.2, 7.1, 9.5];

function landscapeSvg(width, height) {
  const bounds = { x0: -2.1, x1: 2.55, y0: -0.5, y1: 3.68 };
  const proj = projector(bounds, width, height, 0);
  let body = '';

  LEVELS.forEach((level, i) => {
    const stroke = i < LEVELS.length - 3 ? '#9aa1a5' : C.graph;
    for (const line of contour(field, level, bounds, 150)) {
      const a = line[0];
      const z = line[line.length - 1];
      const closed = Math.hypot(a[0] - z[0], a[1] - z[1]) < 0.05;
      body += `<path d="${toSmoothPath(line.map(proj), closed)}" fill="none" stroke="${stroke}" stroke-width="${i < 3 ? 1.6 : 1.25}" stroke-linecap="round"/>`;
    }
  });

  const iterates = descentPath(field, [-1.72, 2.55], {
    steps: 120,
    rate: 0.028,
    momentum: 0.86,
    stopWithin: 0.07,
    target: OPTIMUM,
  }).map(proj);

  body += `<path d="${toSmoothPath(iterates)}" fill="none" stroke="${C.signal}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  const every = Math.max(4, Math.round(iterates.length / 8));
  iterates.forEach((p, i) => {
    if (i > 0 && i < iterates.length - 2 && i % every === 0) {
      body += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.4" fill="${C.signal}"/>`;
    }
  });
  const opt = proj(OPTIMUM);
  body += `<circle cx="${opt[0].toFixed(1)}" cy="${opt[1].toFixed(1)}" r="9" fill="none" stroke="${C.signal}" stroke-width="1.6" opacity="0.45"/>`;
  body += `<circle cx="${opt[0].toFixed(1)}" cy="${opt[1].toFixed(1)}" r="5" fill="${C.signal}"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${body}</svg>`;
}

const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="34" height="34">
  <path d="M8 26.5V6M8 6l16 20.5M24 26.5V6" fill="none" stroke="${C.ink}" stroke-width="2.9" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="24" cy="26.5" r="3.2" fill="${C.signal}"/>
</svg>`;

const dataUri = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

/* ---------------------------------------------------------------------------
   Card layout
   --------------------------------------------------------------------------- */

const ART = landscapeSvg(520, 470);

function card({ eyebrow, title, subtitle, footer }) {
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
              props: { src: dataUri(ART), width: 520, height: 470 },
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
    title: 'Optimization for consequential decisions.',
    subtitle:
      'Optimization and data-driven methods for equitable prediction, infrastructure systems, and reliable large-scale computation.',
    footer: 'nicacevedo.github.io',
  },
  {
    slug: 'home',
    eyebrow: CONTEXT,
    title: 'Optimization for consequential decisions.',
    subtitle:
      'Optimization and data-driven methods for equitable prediction, infrastructure systems, and reliable large-scale computation.',
    footer: 'nicacevedo.github.io',
  },
  {
    slug: 'research',
    eyebrow: 'Research',
    title: 'Where a model is wrong matters as much as how often.',
    subtitle: 'Equitable prediction · Infrastructure systems · Optimization at scale',
    footer: 'Research',
  },
  {
    slug: 'publications',
    eyebrow: 'Publications',
    title: 'Formal research outputs',
    subtitle: 'Theses, conference work and public research software.',
    footer: 'Publications',
  },
  {
    slug: 'about',
    eyebrow: CONTEXT,
    title: 'Nicolás Acevedo Villena',
    subtitle: 'PhD student in Operations Research, MIT Operations Research Center.',
    footer: 'About',
  },
  {
    slug: 'cv',
    eyebrow: 'Curriculum vitae',
    title: 'Nicolás Acevedo Villena',
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
  projects.push({
    slug: file.replace(/\.md$/, ''),
    eyebrow: themeById[data.primaryTheme]?.name ?? 'Research',
    title: data.title,
    subtitle: data.description ?? '',
    footer: 'Research',
  });
}

await mkdir(OUT, { recursive: true });

for (const spec of [...CARDS, ...projects]) {
  const svg = await satori(card(spec), { width: 1200, height: 630, fonts, embedFont: true });
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  await writeFile(new URL(`${spec.slug}.png`, OUT), png);
  console.log(`og/${spec.slug}.png  ${(png.length / 1024).toFixed(0)}kB`);
}
