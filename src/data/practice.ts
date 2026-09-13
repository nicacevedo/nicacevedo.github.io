/**
 * Adoption of research work outside MIT. Only entries with a public, checkable
 * record belong here, and the wording stays at what that record shows.
 */
export interface PracticeRecord {
  readonly date: string;
  readonly organization: string;
  readonly claim: string;
  readonly detail: string;
  readonly evidenceLabel: string;
  readonly evidenceHref: string;
  readonly projectSlug: string;
}

export const practice: readonly PracticeRecord[] = [
  {
    date: 'July 2026',
    organization: "Cook County Assessor's Office",
    claim:
      'Merged support for the covariance-penalized LightGBM objective developed with the MIT research team into its open-source residential assessment model.',
    detail:
      'The objective is selectable in the model configuration as `mse_cov`. This records a change to a public codebase, not a measured effect on assessments or policy.',
    evidenceLabel: 'Pull request #475 · ccao-data/model-res-avm',
    evidenceHref: 'https://github.com/ccao-data/model-res-avm/pull/475',
    projectSlug: 'equitable-property-assessment',
  },
];
