# nicacevedo.github.io

Source for [nicacevedo.github.io](https://nicacevedo.github.io) — the personal
research website of Nicolás Acevedo Villena.

Static [Astro](https://astro.build) site: TypeScript, custom CSS, hand-built
SVG, and a few lines of vanilla JavaScript for the theme toggle and the sticky
header. No UI framework, no runtime dependencies, no analytics.

## Prerequisites

- Node.js 22.12 or newer (`node --version`)
- npm 10 or newer

## Everyday commands

```bash
npm install        # install dependencies from the lockfile
npm run dev        # local dev server on http://localhost:4321
npm run build      # production build into dist/
npm run serve      # serve dist/ the way GitHub Pages does
npm run check      # TypeScript + content-schema check
npm test           # Playwright browser and accessibility suite
npm run format     # Prettier
```

The first test run also needs a browser:

```bash
npm run test:install
```

## Where things live

```
src/
  content/research/   one Markdown file per research project
  content/updates/    one Markdown file per update
  data/               profile, directions, CV, teaching, practice record, .bib
  components/visuals/ the SVG figure primitives
  assets/fonts/       vendored woff2 subsets (see the README there)
  styles/tokens.css   every color, type step and spacing value
  pages/              one file per route
public/
  assets/pdf/         the CV and other PDFs, at their original URLs
  favicon/            generated icon set
  generated/og/       generated social cards
scripts/              figure, icon, social-card and static-server scripts
tests/                Playwright specs and the route inventory
```

## Pages

Primary navigation is Research, Publications, Teaching and CV; the name mark
returns home. There is deliberately no About page — the homepage carries the
identity, positioning, background and advising context, so a separate page would
only duplicate it. `/about/` redirects home in case the URL is ever linked.
Updates are a secondary destination reachable from the homepage and the footer.

## Adding or updating a research project

Create `src/content/research/<slug>.md`. The slug becomes the URL:
`/projects/<slug>/`. The frontmatter is validated at build time by the schema in
`src/content.config.ts`, so a typo fails the build rather than the page.

```yaml
---
title: Full project title
shortTitle: Short label # optional, used in dense lists
thesis: One sentence stating what the project claims.
description: One sentence for search results and cards.
researchQuestion: The question the project is answering?
period: 2026 — present
status: Ongoing research # see the enum in src/content.config.ts
primaryTheme: fair-reliable-prediction # or infrastructure-modeling / scalable-optimization
secondaryThemes: []
featured: true # show as a homepage case study
stage: current # current | earlier
order: 1 # sort order within its stage
visual: frontier # frontier | network | convergence | sparse | observation
visualCaption: What the figure is, and that it shows no data.
repository: https://github.com/... # optional
outputs:
  - label: Project repository
    href: https://github.com/...
    kind: repository # repository | paper | thesis | poster | slides | data | page
---
```

The body is Markdown. Use `## Why it matters`, `## The challenge`,
`## Approach`, `## Status`, and optionally `## Research to practice`. Sections
you leave out simply do not render — a sparse project should stay sparse rather
than be padded.

`stage: current` projects get the large editorial treatment on `/research/`;
`stage: earlier` projects get a compact row. Only `featured: true` projects
appear as homepage case studies, and there should be exactly three.

To show a **real** research figure as well as the schematic, add a `figure`
block. It requires a description and a source, so a real figure can never appear
without provenance:

```yaml
figure:
  src: outlier-screening-table.jpg # a file in src/assets/
  alt: What a screen reader should hear, described literally.
  caption: What the figure shows, ending with an em dash —
  source: link text naming where it came from
  sourceHref: /assets/pdf/psu-outliers-slides.pdf
```

Two conventions worth keeping:

- **Figures never claim results.** The five `visual` options are schematics
  drawn from generated geometry. Their captions say so. If a real research
  figure is ever added, it needs a caption naming its source.
- **Statuses are factual.** The status enum exists so an ongoing project cannot
  quietly become a publication.

## Adding an update

Create `src/content/updates/YYYY-MM-DD-<slug>.md`:

```markdown
---
date: 2026-09-01
title: Short headline
---

One sentence, with [links](https://example.com) where useful.
```

The homepage shows the three most recent; `/updates/` shows all of them. There
are no individual update pages.

## Publications

`src/data/publications.bib` is the single source of truth. It is parsed at build
time by `src/utils/publications.ts`; no BibTeX parser is ever sent to the
browser. Standard BibTeX fields work as expected, plus these extras:

| Field      | Effect                                              |
| ---------- | --------------------------------------------------- |
| `pdf`      | PDF button (site-absolute path or full URL)         |
| `doi`      | DOI button                                          |
| `arxiv`    | arXiv button                                        |
| `code`     | Code button                                         |
| `data`     | Data button                                         |
| `slides`   | Slides button                                       |
| `poster`   | Poster button                                       |
| `website`  | Event-page button                                   |
| `project`  | Links the entry to `src/content/research/<slug>.md` |
| `selected` | `{true}` includes it in the homepage output list    |

Buttons appear only for fields that are present.

## Teaching

`src/data/teaching.ts` drives both `/teaching/` and the CV page. Courses carry an
`order` (1 = most recent) that sorts each institution's list. Recitations are
grouped by `topic`; exactly one per topic is marked `featured: true` and is
surfaced under "Selected recitations", while every video stays reachable in the
full index below it.

## Replacing the CV

Overwrite `public/assets/pdf/Nicolas_Acevedo_Villena_CV.pdf`, keeping the
filename so existing links stay valid. Then update `src/data/cv.ts`, which
drives the HTML version at `/cv/`. The PDF stays the formal document; the HTML
exists so the same record is readable and searchable without opening a PDF.

## Profile data

`src/data/profile.ts` holds the name, role, affiliation, statement, contact
details and social links, and `src/data/themes.ts` holds the three research
themes. Nothing about the person is written directly into a page — change it
once here and every page follows.

## Fonts

Instrument Sans and Newsreader are vendored as variable `.woff2` subsets in
`src/assets/fonts/`, with their SIL Open Font License text beside them. Astro's
local font provider emits the `@font-face` rules, per-subset `unicode-range`
splits, preload links and metric-matched fallbacks. Nothing is fetched from a
font CDN, at build time or in the browser. To change a face, drop the new file
in and update the `fonts` array in `astro.config.mjs`.

## Design tokens

`src/styles/tokens.css` is the whole palette, type scale and spacing scale.
`--prose-max` is tuned so a reading column lands at roughly 75 characters; if you
change `--step-0`, re-check it.

Astro's scoped styles cannot cross a component boundary, so a page cannot style
`SectionHead` directly. The gap below a section heading is set inside that
component and tuned by pages through the inherited `--section-head-gap` custom
property. Both
themes are defined there: light on bare `:root`, dark under both
`prefers-color-scheme` and an explicit `[data-theme="dark"]`, so the toggle wins
in either direction. Contrast is asserted by the accessibility tests, so a token
change that breaks AA fails CI.

## Figures

`src/components/visuals/` holds six primitives. The geometry is computed at
build time by `src/utils/field.ts` — the contours are real level sets, the
trajectories are real descent paths, and the scatter is a seeded draw, so every
build produces identical output. They share stroke weights, caps and color
tokens via `figure.css`.

## Icons and social cards

Both are generated and committed:

```bash
npm run icons   # public/favicon/* and public/favicon.ico
npm run og      # public/generated/og/*.png
```

`npm run og` builds one 1200×630 card per page and one per research project,
reading titles, directions and figure types straight from the content
frontmatter — a new project gets a card without editing the script. Each project
card carries that project's own figure (`scripts/og-figures.mjs` draws
card-scale renditions of the same geometry), never a portrait and never the same
generic artwork. Cards are laid out with satori and rasterised with sharp;
nothing screenshots a page.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and
publishes it with the official GitHub Pages action. `.github/workflows/ci.yml`
runs formatting, type checks, the full browser and accessibility suite, and
`npm audit` on every push and pull request.

`dist/` is never committed. The site has no custom domain; adding one means
putting a `CNAME` file in `public/` and updating `site` in `astro.config.mjs`.

## URL compatibility

Routes from the previous version of this site are kept alive by the `redirects`
map in `astro.config.mjs`, and `tests/routes.ts` asserts that each one still
resolves. Add a redirect there whenever a route moves.
