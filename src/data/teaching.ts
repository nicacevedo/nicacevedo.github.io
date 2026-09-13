/** Teaching record. Shared by /teaching/ and the CV page. */

export interface Course {
  readonly title: string;
  readonly level?: string;
  readonly institution: string;
  readonly unit?: string;
  readonly terms: string;
  /** Most recent term first; orders the Universidad de Chile chronology. */
  readonly order?: number;
}

export type Topic = 'Optimization' | 'Probability & statistics' | 'Decision models' | 'Operations';

export interface Recitation {
  readonly label: string;
  readonly href: string;
  /** One per topic is surfaced above the full index. */
  readonly featured?: boolean;
}

export interface RecitationSet {
  readonly course: string;
  readonly topic: Topic;
  readonly videos: readonly Recitation[];
}

export const topics: readonly Topic[] = [
  'Optimization',
  'Probability & statistics',
  'Decision models',
  'Operations',
];

export const teaching = {
  mit: [
    {
      title: '15.C571[J] Optimization Methods',
      institution: 'Massachusetts Institute of Technology',
      unit: 'MIT Sloan School of Management',
      terms: 'Fall 2026',
      order: 1,
    },
    {
      title: '15.087 Engineering Statistics and Data Science',
      institution: 'Massachusetts Institute of Technology',
      unit: 'MIT Sloan / Leaders for Global Operations',
      terms: 'Summer 2026',
      order: 2,
    },
    {
      title: '15.086 Engineering Probability',
      institution: 'Massachusetts Institute of Technology',
      unit: 'MIT Sloan / Leaders for Global Operations',
      terms: 'Summer 2026',
      order: 3,
    },
    {
      title: 'The Analytics Edge',
      institution: 'Massachusetts Institute of Technology',
      unit: 'MIT Sloan School of Management',
      terms: 'Spring 2026',
      order: 4,
    },
  ] as const satisfies readonly Course[],

  uchile: [
    {
      title: 'Optimization Models and Algorithms',
      level: 'Graduate',
      institution: 'Universidad de Chile',
      terms: 'Spring 2023 — Spring 2024',
      order: 1,
    },
    {
      title: 'Modeling and Optimization',
      level: 'Undergraduate',
      institution: 'Universidad de Chile',
      terms: 'Fall 2020; Spring 2023',
      order: 2,
    },
    {
      title: 'Probability',
      level: 'Undergraduate',
      institution: 'Universidad de Chile',
      terms: 'Spring 2021 — Spring 2022',
      order: 3,
    },
    {
      title: 'Quantitative Marketing',
      level: 'Graduate',
      institution: 'Universidad de Chile',
      terms: 'Spring 2022',
      order: 4,
    },
    {
      title: 'Organizational Economics',
      level: 'Graduate',
      institution: 'Universidad de Chile',
      terms: 'Spring 2022',
      order: 5,
    },
    {
      title: 'Decision Making Under Uncertainty',
      level: 'Undergraduate',
      institution: 'Universidad de Chile',
      terms: 'Fall 2021',
      order: 6,
    },
    {
      title: 'Statistics',
      level: 'Undergraduate',
      institution: 'Universidad de Chile',
      terms: 'Fall 2021',
      order: 7,
    },
    {
      title: 'Applied Econometrics for Business and Economics',
      level: 'Undergraduate',
      institution: 'Universidad de Chile',
      terms: 'Spring 2021',
      order: 8,
    },
    {
      title: 'Operations Management I',
      level: 'Undergraduate',
      institution: 'Universidad de Chile',
      terms: 'Fall 2020',
      order: 9,
    },
  ] as const satisfies readonly Course[],

  recitations: [
    {
      course: 'Optimization Models and Algorithms',
      topic: 'Optimization',
      videos: [
        {
          label: 'Lagrangian duality and the Lagrangian dual problem',
          href: 'https://youtu.be/r4_VXfXfxRc?si=yFHMQPDnX1vjoCqH',
          featured: true,
        },
        {
          label: 'Convexity, semidefinite optimization, separating hyperplanes and KKT conditions',
          href: 'https://www.youtube.com/watch?v=fYanUed6ZYw&list=PL0LFWVQ3MROuW3xvMNP8O2G_I1ilMXPyK',
        },
        {
          label: 'Conic alternatives, duality and KKT conditions',
          href: 'https://youtu.be/AzFTh3fcG0E?si=mZbqOY8viGXsjQpg',
        },
      ],
    },
    {
      course: 'Modeling and Optimization',
      topic: 'Optimization',
      videos: [
        {
          label: 'Modeling and geometry',
          href: 'https://youtu.be/NSQVuL3BdaA?si=8SPLRt5Un8SZN7Wj&t=1',
        },
        {
          label: 'Simplex and tableau',
          href: 'https://youtu.be/Z8Usp_uTmVs?si=3jMAGsyt1Kd5f73s',
        },
        {
          label: 'Nonlinear optimization',
          href: 'https://youtu.be/WHmQgi5OUEc?si=URAZMLlsG-eiPmUp',
        },
      ],
    },
    {
      course: 'Probability',
      topic: 'Probability & statistics',
      videos: [
        {
          label: 'Total probability, Bayes’ theorem and conditional independence',
          href: 'https://youtu.be/w3wlE5WAL88?si=J1_rpK0KYhYYiLYW',
          featured: true,
        },
        {
          label: 'Discrete random variables',
          href: 'https://youtu.be/DNiMZhKB1kc?si=3zClHhHAalyxI1Y1&t=2',
        },
        {
          label: 'Conditional expectation and variance',
          href: 'https://youtu.be/ZJ-GARTZ1mM?si=ViawrpGSsArXQ53M',
        },
      ],
    },
    {
      course: 'Statistics',
      topic: 'Probability & statistics',
      videos: [
        {
          label: 'Finite-sample estimators',
          href: 'https://youtu.be/aw3Q-G26Le8?si=dXeEmWgt5CdsZKUh',
        },
      ],
    },
    {
      course: 'Decision Making Under Uncertainty',
      topic: 'Decision models',
      videos: [
        {
          label: 'Dynamic programming',
          href: 'https://youtu.be/mt2mOV7mAZY?si=oKuezRqfU-H8qUY3',
          featured: true,
        },
        {
          label: 'Discrete Markov chains',
          href: 'https://youtu.be/xXxUQ8bX9QI?si=OLyxptRgbJhcjAte',
        },
        {
          label: 'Poisson processes',
          href: 'https://youtu.be/MRi6Q3TaTPQ?si=7WeycYBRxnSdeMYY',
        },
      ],
    },
    {
      course: 'Operations Management I',
      topic: 'Operations',
      videos: [
        {
          label: 'Process analysis',
          href: 'https://youtu.be/vFJzcE0TRdU?si=8h3VOWBRUODe6Vex',
          featured: true,
        },
        {
          label: 'Aggregate planning',
          href: 'https://youtu.be/AYjG8XEgszw?si=b7hHHhTHaYdhrbze',
        },
        {
          label: 'Transport logistics and vehicle routing',
          href: 'https://youtu.be/Xl2c66D-C98?si=hQGuFT8H00eCt1tw',
        },
      ],
    },
  ] as const satisfies readonly RecitationSet[],
} as const;

/** Total number of public recitation videos, used for the page's lead. */
export const recitationCount = teaching.recitations.reduce((n, set) => n + set.videos.length, 0);
