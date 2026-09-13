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
  { path: '/publications/', name: 'publications', h1: 'Formal research outputs' },
  { path: '/about/', name: 'about', h1: 'Nicolás Acevedo Villena' },
  { path: '/cv/', name: 'cv', h1: 'Nicolás Acevedo Villena' },
  { path: '/updates/', name: 'updates', h1: 'What has changed' },
  { path: '/teaching/', name: 'teaching', h1: 'Courses and recitations' },
] as const;

/** Old URLs that must keep resolving after the framework migration. */
export const COMPATIBILITY = [
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
