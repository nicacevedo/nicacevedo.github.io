/**
 * The three current research directions. These are descriptive groupings of
 * live work, not fixed disciplines, and this ordering is used site-wide.
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
      'Predictive systems whose errors are not neutral — where being wrong in a particular direction has distributional or institutional consequences, and accuracy alone is the wrong thing to optimize.',
    mark: 'frontier',
  },
  {
    id: 'infrastructure-modeling',
    index: '02',
    name: 'Infrastructure modeling & planning',
    summary:
      'Energy, water and environmental systems reconstructed from imperfect public records, where the accounting boundary matters as much as the model that sits inside it.',
    mark: 'network',
  },
  {
    id: 'scalable-optimization',
    index: '03',
    name: 'Scalable optimization & computation',
    summary:
      'Optimization at sizes that force a change of method — decomposition, sparsity, first-order algorithms on modern hardware — and the numerical reliability they need to be trusted.',
    mark: 'convergence',
  },
] as const satisfies readonly ResearchDirection[];

export const themeById = Object.fromEntries(themes.map((t) => [t.id, t])) as Record<
  ThemeId,
  ResearchDirection
>;
