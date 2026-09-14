/**
 * The three current research directions. These are descriptive groupings of
 * live work, not fixed disciplines, and this ordering is used site-wide.
 *
 * The names and summaries here are the site's only vocabulary for the three
 * directions: the homepage, the research index, every project page, the CV and
 * the generated social cards all read from this file.
 */

export type ThemeId =
  'fair-reliable-prediction' | 'infrastructure-modeling' | 'scalable-optimization';

export interface ResearchDirection {
  readonly id: ThemeId;
  readonly index: string;
  readonly name: string;
  readonly summary: string;
  readonly mark: 'frontier' | 'network' | 'convergence';
}

export const themes = [
  {
    id: 'fair-reliable-prediction',
    index: '01',
    name: 'Fair & reliable predictive modeling',
    summary:
      'Predictive systems whose errors carry distributional or institutional consequences — where accuracy alone is not the right objective.',
    mark: 'frontier',
  },
  {
    id: 'infrastructure-modeling',
    index: '02',
    name: 'Infrastructure modeling & planning',
    summary:
      'Energy, water, and environmental systems reconstructed from imperfect public records, with an explicit boundary between reported and modeled quantities.',
    mark: 'network',
  },
  {
    id: 'scalable-optimization',
    index: '03',
    name: 'Scalable optimization & computation',
    summary:
      'Decomposition, sparsity, and first-order methods on modern hardware, with numerical reliability that survives scale.',
    mark: 'convergence',
  },
] as const satisfies readonly ResearchDirection[];

export const themeById = Object.fromEntries(themes.map((t) => [t.id, t])) as Record<
  ThemeId,
  ResearchDirection
>;

/** "Fair & reliable predictive modeling · Infrastructure modeling & planning · …" */
export const themeNames = themes.map((t) => t.name).join(' · ');
