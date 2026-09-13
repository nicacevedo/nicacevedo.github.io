/** The three public research themes. This ordering is used site-wide. */

export type ThemeId = 'equitable-prediction' | 'infrastructure-systems' | 'optimization-at-scale';

export interface ResearchTheme {
  readonly id: ThemeId;
  readonly index: string;
  readonly name: string;
  readonly summary: string;
  readonly mark: 'frontier' | 'network' | 'convergence';
}

export const themes = [
  {
    id: 'equitable-prediction',
    index: '01',
    name: 'Equitable Prediction',
    summary:
      'Methods for predictive and learning systems whose errors are not neutral — where being wrong in a particular direction has distributional, institutional or social consequences.',
    mark: 'frontier',
  },
  {
    id: 'infrastructure-systems',
    index: '02',
    name: 'Infrastructure Systems',
    summary:
      'Modeling and planning of energy, water and environmental systems from imperfect public records, where the accounting boundary matters as much as the model.',
    mark: 'network',
  },
  {
    id: 'optimization-at-scale',
    index: '03',
    name: 'Optimization at Scale',
    summary:
      'Scalable optimization algorithms — decomposition, sparsity, first-order methods on modern hardware — and the numerical reliability they need to be trusted.',
    mark: 'convergence',
  },
] as const satisfies readonly ResearchTheme[];

export const themeById = Object.fromEntries(themes.map((t) => [t.id, t])) as Record<
  ThemeId,
  ResearchTheme
>;
