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
npm ci             # install exactly what the lockfile pins — the normal case
npm run dev        # local dev server on http://localhost:4321
npm run build      # regenerate icons and cards, then build into dist/
npm run serve      # serve dist/ the way GitHub Pages does
npm run check      # TypeScript + content-schema check
npm test           # Playwright browser and accessibility suite
npm run budget     # architecture and weight budgets for dist/
npm run format     # Prettier
```

Use `npm ci` to install. It installs the locked versions and nothing else, so a
checkout builds the same way everywhere and CI matches a laptop. `npm install`
is for the one case it is meant for: deliberately adding, removing or bumping a
dependency, which rewrites `package-lock.json` and should be committed as its
own change.

The first test run also needs the browsers. Chromium carries the full
regression suite; Firefox and WebKit are used only by the cross-engine smoke
spec:

```bash
npm run test:install
```

Two checks reach the network and so are not part of `npm test`:

```bash
npm run links        # resolve every external link the site depends on
npm run production   # verify the deployed site, route by route
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
scripts/              figure, icon, social-card, static-server and check scripts
tests/                Playwright specs and the route inventory
```

## Pages

Primary navigation is Research, Publications, Teaching and CV; the name mark
returns home. There is deliberately no About page — the homepage carries the
identity, positioning, background and advising context, so a separate page would
only duplicate it. `/about/` redirects home in case the URL is ever linked.
Updates are a secondary destination reachable from the homepage and the footer.

Two conventions hold across every page:

- **`CV` means the HTML page at `/cv/`,** never the file. Every link labelled CV
  or "Curriculum vitae" goes to that page, and the PDF-specific actions —
  Download PDF, View PDF — live only on it. The PDF is still the formal
  document; the HTML exists so the same record is selectable and searchable.
- **The `↗` marker means the link leaves the site.** Internal routes never carry
  one. `tests/consistency.spec.ts` asserts both rules on every route.

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
repositoryKind: Research repository # Research repository | Research code | Research software
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
- **A repository is not software.** `repositoryKind` says what a public
  repository actually is, and it defaults to the weakest claim,
  `Research repository`. Use `Research software` only for something built to be
  run by other people. It is the label shown on `/publications/` under "Open
  research code" and in the homepage output list, so upgrading it upgrades the
  claim everywhere.

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

Entry kinds come from the BibTeX entry type, mapped in
`src/utils/publications.ts`. `@unpublished` deliberately renders as
**Conference presentation (unpublished)** — the qualifier is part of the label
rather than a footnote, so no compact rendering anywhere on the site can read as
a published paper. `/publications/` separates **Scholarly outputs** from **Open
research code** for the same reason.

Everything the parser returns passes through one conversion boundary in
`src/utils/publications.ts`, which strips the parser's inline markup and
normalizes to Unicode NFC. The parser decomposes accents, so without this
`Nicolás` would reach the page as `a` + U+0301: visually identical, but a
different string to search, sort and copy.

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

`@fontsource/instrument-sans` is still a devDependency, and is required:
`scripts/generate-og.mjs` resolves static `.woff` files out of that package to
hand to satori, which cannot use a variable font. It never reaches the site — it
exists only so the social cards can be drawn. `npm run budget` asserts that no
font is ever requested from a CDN at runtime.

## Design tokens

`src/styles/tokens.css` is the whole palette, type scale and spacing scale.
`--prose-max` is tuned so a reading column lands at roughly 75 characters; if you
change `--step-0`, re-check it.

Both themes are defined there: light on bare `:root`, dark under both
`prefers-color-scheme` and an explicit `[data-theme="dark"]`, so the toggle wins
in either direction. Contrast is asserted by the accessibility tests, so a token
change that breaks AA fails CI.

The whole theme mechanism is one inline script in
`src/components/layout/BaseHead.astro`, applied before first paint. It also owns
the single `<meta name="theme-color">` tag, so the browser chrome follows the
effective theme — system preference, or an explicit choice, whichever applies.
The toggle at the end of `Base.astro` calls into it rather than reimplementing
it. The two canvas colors appear in that file as well as in `tokens.css`; the
cross-browser spec asserts they still agree.

Astro's scoped styles cannot cross a component boundary, so a page cannot style
`SectionHead` directly. The gap below a section heading is set inside that
component and tuned by pages through the inherited `--section-head-gap` custom
property.

## Figures

`src/components/visuals/` holds six primitives. The geometry is computed at
build time by `src/utils/field.ts` — the contours are real level sets, the
trajectories are real descent paths, and the scatter is a seeded draw, so every
build produces identical output. They share stroke weights, caps and color
tokens via `figure.css`.

## Icons and social cards

Both are generated, committed, and regenerated on every build: `prebuild` runs
`npm run icons && npm run og` before Astro, so there is no way to forget.

```bash
npm run icons   # public/favicon/* and public/favicon.ico
npm run og      # public/generated/og/*.png
```

`npm run og` builds one 1200×630 card per page and one per research project,
reading titles, directions and figure types straight from the content
frontmatter, and identity and positioning straight from `src/data/profile.ts`
and `src/data/themes.ts` — so a card cannot disagree with the site, and a new
project gets one without editing the script. Each project card carries that
project's own figure (`scripts/og-figures.mjs` draws card-scale renditions of
the same geometry), never a portrait and never the same generic artwork. Cards
are laid out with satori and rasterised with sharp; nothing screenshots a page.

Both generators are byte-for-byte deterministic, which is what makes the
committed files checkable: CI builds and then fails if `public/` is dirty. So
the two models — generated and committed — cannot drift apart. If you change a
project title or a theme name, run the generators and commit the new PNGs in the
same change.

## Tests and checks

`npm test` runs one Playwright config with several projects, so nothing is paid
for twice:

| Project                     | Specs           | What it is for                                        |
| --------------------------- | --------------- | ----------------------------------------------------- |
| `desktop` `tablet` `mobile` | `pages`, `a11y` | the full regression suite at 1440, 768 and 412px      |
| `consistency`               | `consistency`   | what every route _says_ — checked once, not per width |
| `narrow`                    | `narrow`        | the 320 and 360px floor                               |
| `smoke-*`                   | `cross-browser` | Chromium, Firefox, WebKit and a mobile WebKit profile |

The regression suite is deliberately **not** multiplied across engines. The
smoke spec is the part an engine can actually differ on: layout width, sticky
positioning, font loading, inline scripting and SVG rendering.

`npm run budget` checks the shape of `dist/` rather than a Lighthouse score: no
emitted JavaScript bundle, no request to a font CDN or an analytics host, no
external `<script src>`, no framework runtime markers, and page weight under a
deliberately roomy ceiling. It runs in CI, so the site cannot quietly stop being
a static, dependency-free page.

`npm run production` makes the same assertions as `consistency`, but against
what GitHub Pages is actually serving: every route in the published sitemap, the
legacy redirects, the files that must stay put, and the 404 behaviour. Run it
after a deploy.

## Deployment

GitHub Pages publishes this site from **GitHub Actions**, not from a branch.
`.github/workflows/deploy.yml` is the sole production publisher: every push to
`main` builds the site with Astro into `dist/`, and the official
`actions/upload-pages-artifact` and `actions/deploy-pages` steps publish that
directory. `dist/` is never committed, and no branch is served — the obsolete
`gh-pages` branch has been deleted. The pre-Astro site it used to carry is
preserved by the `pre-astro-redesign-20260913` tag.

`.github/workflows/ci.yml` runs formatting, type checks, the build, the
generated-asset check, the budgets, the full test suite and `npm audit` on every
push and pull request. `.github/workflows/external-links.yml` resolves the site's
external links monthly and opens an issue if one is genuinely gone — it is kept
off the normal path so a briefly unreachable DOI resolver can never block a
deploy. `.github/dependabot.yml` proposes npm and Actions updates monthly,
grouped; nothing auto-merges.

The site has no custom domain; adding one means putting a `CNAME` file in
`public/` and updating `site` in `astro.config.mjs`.

### Repository metadata

The About panel is not reachable from the source tree; setting it needs `repo`
scope on the GitHub API, or a few clicks in the repository sidebar. The values it
should carry:

- **Description:** Personal research website of Nicolás Acevedo Villena —
  optimization, fair and reliable prediction, infrastructure modeling, and
  scalable computation.
- **Homepage:** `https://nicacevedo.github.io/`
- **Topics:** `astro`, `operations-research`, `optimization`, `research`,
  `academic-website`

```bash
gh repo edit nicacevedo/nicacevedo.github.io \
  --homepage "https://nicacevedo.github.io/" \
  --description "Personal research website of Nicolás Acevedo Villena — optimization, fair and reliable prediction, infrastructure modeling, and scalable computation." \
  --add-topic astro \
  --add-topic operations-research \
  --add-topic optimization \
  --add-topic research \
  --add-topic academic-website
```

The description deliberately uses the same research vocabulary as
`src/data/themes.ts`; the retired labels listed in `tests/routes.ts` should not
reappear here either.

GitHub also keeps showing that this repository was generated from the al-folio
template. That is accurate history and harmless — hiding it would mean deleting
and recreating the repository, throwing away every pull request, issue and
Actions record.

## URL compatibility

Routes from the previous version of this site are kept alive by the `redirects`
map in `astro.config.mjs`, and `tests/routes.ts` asserts that each one still
resolves. Add a redirect there whenever a route moves.
