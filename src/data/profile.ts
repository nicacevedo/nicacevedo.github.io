/**
 * The single source of truth for identity, contact and biography.
 * Every page reads from here; nothing about the person is duplicated in markup.
 */

export interface SocialLink {
  readonly label: string;
  readonly href: string;
  /** Shown in the hero/footer rail. */
  readonly short: string;
  readonly external: boolean;
}

export interface ChronologyEntry {
  readonly kind: 'Education' | 'Research' | 'Industry';
  readonly period: string;
  readonly role: string;
  readonly org: string;
}

const email = 'nacevedo@mit.edu';
const name = 'Nicolás Acevedo Villena';

/** Research interests, as a phrase other copy is built from. */
const methods = 'optimization, machine learning, game theory, and applied mathematics';

export const profile = {
  name,
  /** Used where diacritics would break (BibTeX matching, file names). */
  nameAscii: 'Nicolas Acevedo Villena',
  role: 'PhD student in Operations Research',
  affiliation: 'MIT Operations Research Center',
  affiliationShort: 'MIT ORC',
  location: 'Cambridge, Massachusetts',

  /** Plain one-line identification, used in the home page title. */
  statement: 'PhD student at the MIT Operations Research Center',
  methods,
  /** First person, for the homepage hero. */
  summary: `I am a PhD student at the MIT Operations Research Center. My interests include ${methods}, from theory and algorithms to real-world applications.`,
  /** Current work, stated as areas rather than as the limits of the interests above. */
  current:
    'Recent and current research includes fairness in machine learning, sustainable computing, and optimization on GPUs.',
  /** Third person, for meta descriptions and structured data. */
  description: `${name} is a PhD student at the MIT Operations Research Center. He is interested in ${methods}.`,

  email,
  cvPdf: '/assets/pdf/Nicolas_Acevedo_Villena_CV.pdf',
  siteUrl: 'https://nicacevedo.github.io',

  socials: [
    {
      label: 'Google Scholar',
      short: 'Google Scholar',
      href: 'https://scholar.google.com/citations?user=pYNjmpgAAAAJ',
      external: true,
    },
    { label: 'GitHub', short: 'GitHub', href: 'https://github.com/nicacevedo', external: true },
    {
      label: 'LinkedIn',
      short: 'LinkedIn',
      href: 'https://www.linkedin.com/in/nacevedo-villena',
      external: true,
    },
    { label: 'Email', short: email, href: `mailto:${email}`, external: false },
  ] as const satisfies readonly SocialLink[],

  advising: {
    current: ['Saurabh Amin', 'Deep Deka'],
    past: ['Haihao Lu'],
  },

  /**
   * One compact reverse-chronological list for the homepage — education and
   * work interleaved, because the point is the shape of the path, not a résumé.
   * The full record lives on the CV page.
   */
  chronology: [
    {
      kind: 'Research',
      period: '2024 — present',
      role: 'PhD in Operations Research',
      org: 'Massachusetts Institute of Technology',
    },
    {
      kind: 'Research',
      period: '2023 — 2024',
      role: 'Researcher',
      org: 'Web Intelligence Centre (WIC) / ACHS',
    },
    {
      kind: 'Industry',
      period: '2022 — 2023',
      role: 'Research Engineer',
      org: 'Nezasa AG / TripYeah',
    },
    {
      kind: 'Education',
      period: '2022 — 2023',
      role: 'Master in Operations Management',
      org: 'Universidad de Chile',
    },
    {
      kind: 'Education',
      period: '2017 — 2021',
      role: 'Bachelor of Engineering Science, Industrial Engineering',
      org: 'Universidad de Chile',
    },
  ] as const satisfies readonly ChronologyEntry[],

  interests: 'Music, climbing and time outdoors.',
} as const;

export type Profile = typeof profile;
