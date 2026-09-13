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

export const profile = {
  name: 'Nicolás Acevedo Villena',
  /** Used where diacritics would break (BibTeX matching, file names). */
  nameAscii: 'Nicolas Acevedo Villena',
  role: 'PhD student in Operations Research',
  affiliation: 'MIT Operations Research Center',
  affiliationShort: 'MIT Operations Research Center',
  location: 'Cambridge, Massachusetts',

  /** The site's central positioning. */
  statement: 'Optimization for consequential decisions.',
  summary:
    'I develop optimization and data-driven methods for fair and reliable prediction, infrastructure systems, and scalable computation.',
  /** Slightly longer form, used for meta descriptions and the About page opener. */
  description:
    'Nicolás Acevedo Villena is a PhD student at the MIT Operations Research Center. He works on optimization and data-driven methods for fair and reliable prediction, infrastructure modeling, and optimization at scale.',

  email,
  cvPdf: '/assets/pdf/Nicolas_Acevedo_Villena_CV.pdf',
  siteUrl: 'https://nicacevedo.github.io',

  socials: [
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
    current: ['Saurabh Amin', 'Deepjyoti (Deep) Deka'],
    past: ['Haihao (Sean) Lu'],
  },

  /**
   * One compact reverse-chronological list for the homepage — education and
   * work interleaved, because the point is the shape of the path, not a résumé.
   * The full record lives on the CV page.
   */
  chronology: [
    {
      kind: 'Education',
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
      role: 'Research engineer',
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
