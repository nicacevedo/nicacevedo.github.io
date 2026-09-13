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

export interface TimelineEntry {
  readonly role: string;
  readonly org: string;
  readonly place?: string;
  readonly period: string;
  readonly detail?: string;
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
    'I develop optimization and data-driven methods for equitable prediction, infrastructure systems, and reliable large-scale computation.',
  /** Slightly longer form, used for meta descriptions and the About page opener. */
  description:
    'Nicolás Acevedo Villena is a PhD student at the MIT Operations Research Center working on optimization and data-driven methods for equitable prediction, infrastructure systems, and reliable large-scale computation.',

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

  education: [
    {
      role: 'PhD in Operations Research',
      org: 'Massachusetts Institute of Technology',
      period: 'Sept. 2024 — present',
      detail: 'Expected 2029',
    },
    {
      role: 'Master in Operations Management',
      org: 'Universidad de Chile',
      period: '2022 — 2023',
      detail: 'Graduated with highest honors',
    },
    {
      role: 'Bachelor of Engineering Science in Industrial Engineering',
      org: 'Universidad de Chile',
      period: '2017 — 2021',
      detail: 'Graduated with highest honors',
    },
  ] as const satisfies readonly TimelineEntry[],

  experience: [
    {
      role: 'Researcher',
      org: 'Web Intelligence Centre (WIC) / ACHS',
      place: 'Santiago, Chile',
      period: 'Dec. 2023 — Apr. 2024',
      detail: 'Demand forecasting and appointment capacity planning for Hospital del Trabajador.',
    },
    {
      role: 'Research Engineer',
      org: 'Nezasa AG / TripYeah',
      place: 'Zurich, Switzerland',
      period: 'June 2022 — Apr. 2023',
      detail: 'Time-dependent routing formulation and solver work for itinerary selection.',
    },
  ] as const satisfies readonly TimelineEntry[],
} as const;

export type Profile = typeof profile;
