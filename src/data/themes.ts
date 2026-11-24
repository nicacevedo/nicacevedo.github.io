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
  readonly mark: 'frontier' | 'network' | 'convergence';
}

export const themes = [
  {
    id: 'fair-reliable-prediction',
    index: '01',
    name: 'Fair & reliable predictive modeling',
    mark: 'frontier',
  },
  {
    id: 'infrastructure-modeling',
    index: '02',
    name: 'Infrastructure modeling & planning',
    mark: 'network',
  },
  {
    id: 'scalable-optimization',
    index: '03',
    name: 'Scalable optimization & computation',
    mark: 'convergence',
  },
] as const satisfies readonly ResearchDirection[];

export const themeById = Object.fromEntries(themes.map((t) => [t.id, t])) as Record<
  ThemeId,
  ResearchDirection
>;
