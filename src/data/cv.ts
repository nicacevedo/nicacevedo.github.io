/**
 * Concise HTML representation of the CV. The PDF at profile.cvPdf stays the
 * formal document; this exists so the same information is readable, selectable
 * and accessible without opening a PDF.
 *
 * Every entry here is taken from the current CV PDF or from the site's own
 * (more recent) record of advising and teaching.
 */

export interface CvEntry {
  readonly period: string;
  readonly role: string;
  readonly org: string;
  readonly place?: string;
  readonly notes?: readonly string[];
}

export const cv = {
  education: [
    {
      period: 'Sept. 2024 — present',
      role: 'PhD in Operations Research',
      org: 'Massachusetts Institute of Technology',
      place: 'Cambridge, MA',
      notes: ['Expected 2029.'],
    },
    {
      period: '2022 — 2023',
      role: 'Master in Operations Management',
      org: 'Universidad de Chile',
      place: 'Santiago, Chile',
      notes: [
        'Thesis: Column generation-based decomposition for large-scale feature selection problems.',
        'Graduated with highest honors (second-highest GPA).',
      ],
    },
    {
      period: '2017 — 2021',
      role: 'Bachelor of Engineering Science in Industrial Engineering',
      org: 'Universidad de Chile',
      place: 'Santiago, Chile',
      notes: ['Graduated with highest honors (highest GPA).'],
    },
  ] as const satisfies readonly CvEntry[],

  research: [
    {
      period: 'Sept. 2024 — present',
      role: 'Research assistant',
      org: 'Operations Research Center, MIT',
      place: 'Cambridge, MA',
      notes: [
        'Advised by Saurabh Amin and Deepjyoti (Deep) Deka; earlier PhD research guidance from Haihao (Sean) Lu.',
        'Fair and equitable predictive modeling for property assessment; public-data modeling of data-center infrastructure and resource systems; numerical reliability of first-order solvers on GPUs.',
      ],
    },
    {
      period: 'Aug. 2022 — July 2024',
      role: 'Research assistant',
      org: 'FCFM, Universidad de Chile',
      place: 'Santiago, Chile',
      notes: [
        'Advisor: Fernando Ordóñez. Co-advisor: Renaud Chicoisne.',
        'Scalable decomposition for large-scale feature selection: unconstrained LASSO reformulated as a second-order cone program, with a column-wise decomposition driven by conic-dual subproblems.',
      ],
    },
    {
      period: 'Jan. 2021 — Jan. 2022',
      role: 'Research assistant',
      org: 'Complex Engineering Systems Institute',
      place: 'Santiago, Chile',
      notes: [
        'Advisor: Ricardo Montoya. Co-advisor: Charles Thraves.',
        'Online optimization for adaptive questionnaires: choosing both the subset and the sequence of questions to maximize expected information gain.',
      ],
    },
    {
      period: 'Sept. 2020 — March 2022',
      role: 'Research assistant',
      org: 'Complex Engineering Systems Institute',
      place: 'Santiago, Chile',
      notes: [
        'Advisor: Charles Thraves.',
        "Outlier-detection protocol for Chile's university selection exam, validated and presented to DEMRE, the agency responsible for administering it.",
      ],
    },
  ] as const satisfies readonly CvEntry[],

  experience: [
    {
      period: 'Dec. 2023 — Apr. 2024',
      role: 'Researcher',
      org: 'Web Intelligence Centre (WIC) / ACHS',
      place: 'Santiago, Chile',
      notes: [
        'Department-level patient-volume forecasting integrated into a second-stage scheduling optimization for Hospital del Trabajador.',
      ],
    },
    {
      period: 'June 2022 — Apr. 2023',
      role: 'Research engineer',
      org: 'Nezasa AG / TripYeah',
      place: 'Zurich, Switzerland',
      notes: [
        'Time-dependent travelling-salesman formulation and preliminary solver for ranking flight itineraries.',
        'Probabilistic and learned edge-pruning models to reduce the size of the underlying graph.',
      ],
    },
    {
      period: 'Jan. 2020 — Feb. 2020',
      role: 'Internship',
      org: 'Hogar de Cristo',
      place: 'Santiago, Chile',
      notes: [
        'Online beneficiary-tracking process and automated status checks for funding applications.',
      ],
    },
  ] as const satisfies readonly CvEntry[],

  awards: [
    { year: '2023', text: 'Best Master Thesis Award, FCFM, Universidad de Chile.' },
    {
      year: '2023',
      text: 'Thesis distinction, School of Graduate Studies, Universidad de Chile (awarded December 2024).',
    },
    {
      year: '2022',
      text: 'Chilean grant for graduate studies (Beca Magíster Nacional), ANID.',
    },
    {
      year: '2022',
      text: 'Academic excellence scholarship (Beca de Excelencia Académica), Master in Operations Management.',
    },
    {
      year: '2019 — 2022',
      text: 'Outstanding Student, FCFM & DII, Universidad de Chile (top 10% by GPA).',
    },
  ] as const,

  talks: [
    {
      year: '2022',
      text: 'Acevedo Villena, N., Thraves, C., Varas, M. On the outlier detection for standardized tests. XIV Chilean Conference on Operations Research, Universidad Católica del Maule, Talca, Chile.',
    },
  ] as const,

  posters: [
    {
      year: '2023',
      text: 'Acevedo Villena, N., Ordóñez, F. Column generation-based decomposition for large-scale feature selection problems. Escuela de Verano en Inteligencia Computacional (EVIC), FCFM, Santiago, Chile.',
      href: '/assets/pdf/PosterEVIC2023.pdf',
    },
  ] as const,

  training: [
    {
      year: '2023',
      text: 'XVIII Summer School in Discrete Mathematics, Instituto de Sistemas Complejos de Valparaíso: graphs with high chromatic number; provable algorithms for data mining and machine learning; linear programming and the quest for strongly polynomial algorithms.',
    },
  ] as const,
} as const;
