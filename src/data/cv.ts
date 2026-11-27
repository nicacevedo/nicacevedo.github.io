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
  skills: [
    {
      category: 'Optimization',
      items:
        'Mathematical modeling, convex and conic optimization (SOCP), linear and mixed-integer programming (LP/MILP), robust optimization, numerical optimization, numerical linear algebra, column generation, combinatorial optimization, first-order methods, dynamic programming',
    },
    {
      category: 'Machine learning and statistics',
      items:
        'Probability and statistics, statistical learning, gradient boosting, custom loss functions, neural networks, time-series forecasting, anomaly detection, temporal cross-validation, bootstrap methods',
    },
    {
      category: 'Programming',
      items: 'Python, Julia, R, SQL',
    },
    {
      category: 'Libraries and solvers',
      items:
        'PyTorch, LightGBM, XGBoost, scikit-learn, Optuna, NumPy, pandas, SciPy, Gurobi, CVXPY',
    },
    {
      category: 'Scientific computing',
      items: 'GPU computing (CUDA.jl), Git, Linux, Slurm',
    },
    {
      category: 'Languages',
      items: 'Spanish (native), English (fluent)',
    },
  ] as const,
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
        'Graduated with highest honors (second-highest GPA in cohort).',
      ],
    },
    {
      period: '2022 — 2023',
      role: 'Professional title of Ingeniero Civil Industrial (Industrial Engineering)',
      org: 'Universidad de Chile',
      place: 'Santiago, Chile',
      notes: ['Graduated with highest honors (highest GPA in cohort).'],
    },
    {
      period: '2017 — 2021',
      role: 'Bachelor of Engineering Science in Industrial Engineering',
      org: 'Universidad de Chile',
      place: 'Santiago, Chile',
      notes: ['Graduated with highest honors (highest GPA in cohort).'],
    },
  ] as const satisfies readonly CvEntry[],

  research: [
    {
      period: 'Sept. 2024 — present',
      role: 'Research assistant',
      org: 'Operations Research Center, MIT',
      place: 'Cambridge, MA',
      notes: [
        'Advised by Saurabh Amin and Deepjyoti Deka; earlier PhD research guidance from Haihao Lu.',
        'Fair machine learning (first-author preprint): two covariance-based LightGBM training objectives with custom gradients and Hessians, a direct squared-covariance penalty and an observation-additive surrogate.',
        'Results: the cross-validated surrogate reduced the magnitude of price-related bias (PRB) by 49% on held-out sales and 39% on 2025 sales versus an unpenalized fit, with price-scale R² essentially unchanged and log-price RMSE up 3.1% and 1.7% respectively. Evaluated on 382,897 historical Cook County sales, a separate 26,641-sale 2025 test set and an eight-county benchmark, where both methods reduced regressivity in every county.',
        "Research adoption: collaborated with the Cook County Assessor's Office, which merged the direct covariance penalty into its public residential valuation model as a selectable training objective (mse_cov; PR #475, July 2026).",
        'Numerical optimization on GPUs: studied the convergence and numerical accuracy of large-scale first-order linear programming (LP) solvers on GPUs; implemented and tested iterative refinement and residual-based matrix scaling in a fork of cuPDLP.jl (Julia, CUDA.jl).',
        'Data-center modeling: optimization and public-data models of data-center operations, including workload scheduling, electricity use and cooling-water use.',
        'Tabular deep learning: fairness-aware PyTorch networks with projection layers and group-balanced batching, compared with gradient boosting under temporal cross-validation.',
      ],
    },
    {
      period: 'Aug. 2022 — July 2024',
      role: 'Research assistant',
      org: 'FCFM, Universidad de Chile',
      place: 'Santiago, Chile',
      notes: [
        'Advisor: Fernando Ordonez. Co-advisor: Renaud Chicoisne.',
        'Scalable decomposition for large-scale feature selection: unconstrained LASSO reformulated as a second-order cone program, with a column-wise decomposition driven by conic-dual subproblems. On large, strongly regularized instances with sparse solutions, it solved in seconds problems on which the original SOCP and coordinate-descent LASSO needed over 30 minutes, and it converged faster than coordinate descent and Frank–Wolfe on highly correlated features.',
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
        "Interpretable, unsupervised anomaly score for Chile's university selection exam (robust Mahalanobis distances, Isolation Forest, PCA and clustering) on data from DEMRE, the agency that administers it; methodology presented to DEMRE.",
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
        'Department-level patient-volume forecasting (Prophet, NeuralProphet; random-forest and XGBoost baselines) used in a scheduling optimization model for appointment capacity planning at Hospital del Trabajador.',
      ],
    },
    {
      period: 'June 2022 — Apr. 2023',
      role: 'Research engineer',
      org: 'Nezasa AG / TripYeah',
      place: 'Zurich, Switzerland (remote from Chile)',
      notes: [
        'Coordinated a small team developing a time-dependent traveling salesman problem (TSP) formulation and preliminary solver for ranking flight itineraries.',
        'Machine-learning classifiers (Extra Trees, neural networks) that prune the search space to reduce flight-data queries, evaluated on the trade-off between query savings and itinerary optimality.',
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

  graduateProjects: [
    {
      period: 'Spring 2026',
      role: 'Robust model selection',
      org: 'MIT 15.094 Robust Modeling, Optimization, and Computation',
      notes: [
        'Joint with D. K. Agarwal. Bootstrap box and ellipsoidal uncertainty sets and a mixed-integer selection model (Gurobi) raised out-of-sample satisfaction of group-error constraints from 80% to 96% (box set; 95% ellipsoidal) across 100 random splits of the Communities and Crime dataset, at about 6% higher mean test MSE.',
      ],
    },
  ] as const satisfies readonly CvEntry[],

  projects: [
    {
      period: '2026',
      role: 'Research OS',
      org: 'Personal project',
      href: 'https://github.com/nicacevedo/research-os',
      notes: [
        'Python project exploring LLM-assisted research workflows and experiment automation.',
      ],
    },
  ] as const satisfies readonly (CvEntry & { readonly href?: string })[],

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
      text: 'Acevedo Villena, N., Ordonez, F. Column generation-based decomposition for large-scale feature selection problems. Escuela de Verano en Inteligencia Computacional (EVIC), FCFM, Santiago, Chile.',
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
