---
title: Fair and equitable predictive modeling for property assessment
shortTitle: Property assessment
thesis: A mass-appraisal model can be made more accurate and still leave some owners systematically over-assessed; the two goals have to be optimized together.
description: Optimization-based predictive modeling for mass appraisal that holds predictive quality and vertical equity in the same objective.
researchQuestion: How can mass-appraisal models improve predictive performance without worsening systematic vertical inequity across properties?
period: 2024 — present
status: Ongoing research
primaryTheme: fair-reliable-prediction
secondaryThemes: [scalable-optimization]
featured: true
stage: current
order: 1
visual: frontier
visualCaption: Schematic. Attainable models sit above a frontier along which lower predictive error can only be bought with higher systematic inequity. No data is shown.
repository: https://github.com/nicacevedo/soft-vertical-equity-constrained-mass-appraissal
outputs:
  - label: Project repository
    href: https://github.com/nicacevedo/soft-vertical-equity-constrained-mass-appraissal
    kind: repository
  - label: Exploratory repository
    href: https://github.com/nicacevedo/fairness-for-regressivity-taxation
    kind: repository
  - label: CCAO pull request #475
    href: https://github.com/ccao-data/model-res-avm/pull/475
    kind: page
---

## Why it matters

Property assessments decide how a tax burden is divided. The model that produces
them is a public instrument, so it has to be judged on more than aggregate
accuracy: what matters is also whether its errors fall in a systematic pattern.
When low-value properties are assessed high relative to their sale price and
high-value properties low, the result is regressivity — a distributional
outcome produced by a modeling choice.

## The challenge

Vertical equity is measured by assessor-facing statistics such as the
price-related differential (PRD), the price-related bias (PRB) and the vertical
equity index (VEI). None of them is the loss a standard gradient-boosted model
minimizes, and improving the loss does not reliably improve them. Treating
equity as a post-hoc diagnostic therefore leaves the trade-off implicit, at
exactly the point where it should be stated and chosen.

## Approach

The public pipeline evaluates models under a realistic temporal protocol:
time-split sales data with rolling-origin validation, so a model is always
scored on sales it could not have seen. Against that protocol it compares
baseline models with fairness-regularized ones on both predictive error and the
assessor-facing equity measures.

The methodological direction is to move the equity criterion inside the
optimization problem rather than around it. This takes two forms: penalizing
the covariance between assessment ratio and value directly in the training
objective, and combining models by convex stacking whose weights are chosen
subject to vertical-equity constraints across validation folds. Both make the
trade-off a decision variable instead of a diagnostic.

## Research to practice

In July 2026 the Cook County Assessor's Office merged support for the
covariance-penalized LightGBM objective developed with the MIT research team
into its open-source residential assessment model, where it is selectable as
the `mse_cov` objective.

## Status

Ongoing research at the MIT Operations Research Center. The public materials
document the modeling and validation pipeline; no empirical findings are
reported here.
