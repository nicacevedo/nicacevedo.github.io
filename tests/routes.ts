/** Every route the site is expected to serve, with the page's own H1. */
export const PAGES = [
  { path: '/', name: 'home', h1: 'Nicolás Acevedo Villena' },
  { path: '/research/', name: 'research', h1: 'Where a model is wrong' },
  {
    path: '/projects/equitable-property-assessment/',
    name: 'project-property',
    h1: 'Fair and equitable predictive modeling',
  },
  {
    path: '/projects/data-center-externalities/',
    name: 'project-datacenter',
    h1: 'Data-center infrastructure',
  },
  {
    path: '/projects/gpu-first-order-solvers/',
    name: 'project-gpu',
    h1: 'Reliable and scalable first-order',
  },
  {
    path: '/projects/feature-selection/',
    name: 'project-features',
    h1: 'Large-scale feature selection',
  },
  {
    path: '/projects/standardized-test-outliers/',
    name: 'project-tests',
    h1: 'Outlier detection for standardized tests',
  },
  {
    path: '/projects/adaptive-questionnaires/',
    name: 'project-adaptive',
    h1: 'Adaptive questionnaires',
  },
  { path: '/publications/', name: 'publications', h1: 'Formal research outputs' },
  { path: '/cv/', name: 'cv', h1: 'Nicolás Acevedo Villena' },
  { path: '/updates/', name: 'updates', h1: 'What has changed' },
  { path: '/teaching/', name: 'teaching', h1: 'Courses and recitations' },
] as const;

/** Old URLs that must keep resolving after the framework migration. */
export const COMPATIBILITY = [
  { from: '/about/', to: '/' },
  { from: '/projects/', to: '/research/' },
  {
    from: '/projects/fairness-robust-constraints/',
    to: '/projects/equitable-property-assessment/',
  },
  { from: '/news/', to: '/updates/' },
  { from: '/news/announcement_1/', to: '/updates/' },
  { from: '/news/announcement_2/', to: '/updates/' },
  { from: '/news/announcement_3/', to: '/updates/' },
  { from: '/news/announcement_4/', to: '/updates/' },
] as const;

/** Files that were linked from the previous site and must stay put. */
export const STATIC_FILES = [
  '/assets/pdf/Nicolas_Acevedo_Villena_CV.pdf',
  '/assets/pdf/Poster_MSWorkshop.pdf',
  '/assets/pdf/PosterEVIC2023.pdf',
  '/assets/pdf/psu-outliers-tex.pdf',
  '/assets/pdf/psu-outliers-slides.pdf',
  '/robots.txt',
  '/sitemap-index.xml',
  '/favicon.ico',
  '/favicon/favicon.svg',
  '/favicon/site.webmanifest',
  '/generated/og/home.png',
] as const;

/** The primary navigation, in order. Every page offers exactly these. */
export const NAV = ['Research', 'Publications', 'Teaching', 'CV'] as const;

/**
 * Which navigation item a route marks as current, or null where none does:
 * a project page is reached through Research but is not Research, and Updates
 * is a secondary destination that never appears in the primary navigation.
 */
export const CURRENT_NAV: Record<string, (typeof NAV)[number] | null> = {
  '/': null,
  '/research/': 'Research',
  '/publications/': 'Publications',
  '/teaching/': 'Teaching',
  '/cv/': 'CV',
  '/updates/': null,
};

/** The current research-direction vocabulary. Nothing else may name a theme. */
export const THEMES = [
  'Fair & reliable predictive modeling',
  'Infrastructure modeling & planning',
  'Scalable optimization & computation',
] as const;

/**
 * Labels this site has used before. A cached page or a half-finished rename
 * must never put one of them back.
 */
export const RETIRED_LABELS = [
  'Equitable Prediction',
  'Equitable prediction',
  'Infrastructure Systems',
  'Infrastructure systems',
  'Optimization at Scale',
  'Optimization at scale',
  'Decisions / Systems / Computation',
  'Fairness and Robust Constraints',
  'Papers and theses',
] as const;

/** The pages used by the cross-engine smoke suite: one of each kind. */
export const SMOKE_PAGES = PAGES.filter((page) =>
  ['home', 'research', 'project-property', 'publications', 'teaching', 'cv'].includes(page.name),
);
