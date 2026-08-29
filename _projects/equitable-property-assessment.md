---
layout: page
title: Fair and equitable predictive modeling for property assessment
description: Optimization-based predictive modeling for mass appraisal that balances predictive quality and vertical equity.
status: Ongoing research
period: 2024–present
importance: 1
selected: true
section: current
github: https://github.com/nicacevedo/soft-vertical-equity-constrained-mass-appraissal
---

## Research question

How can mass-appraisal models improve predictive performance without worsening systematic vertical inequity across properties?

## Motivation

Property assessments inform consequential public decisions. Predictive models therefore need to be evaluated not only for overall accuracy, but also for whether their errors are systematically related to property value. This project studies the tension between predictive performance and vertical equity in property assessment.

## Approach

The public pipeline uses time-split sales data and rolling-origin validation to assess models under a realistic temporal protocol. It compares baseline and fairness-regularized predictive models using assessor-facing vertical-equity measures, including PRD, PRB, and VEI.

The methodological direction combines constrained or regularized learning with optimization-based model combination. In particular, the public code includes optional convex stacking whose weights are chosen subject to vertical-equity constraints across validation folds. The project emphasizes transparent validation and trade-offs rather than reporting preliminary performance conclusions.

{% comment %}
TODO(USER): Confirm whether robust/soft fairness constraints should remain a standalone research project or be treated as the methodological contribution within this property-assessment project.
{% endcomment %}

{% comment %}
TODO(USER): Add verified collaborators if appropriate.
{% endcomment %}

## Status

Ongoing research at the MIT Operations Research Center. Public materials describe the modeling and validation pipeline; no preliminary empirical findings are reported here.

## Research to practice

In July 2026, the Cook County Assessor's Office incorporated support for the covariance-penalized LightGBM objective developed through this research into its public residential assessment-model pipeline as the `mse_cov` objective. [CCAO PR #475](https://github.com/ccao-data/model-res-avm/pull/475)

## Outputs

- [Code / project repository](https://github.com/nicacevedo/soft-vertical-equity-constrained-mass-appraissal)
- [Related exploratory repository](https://github.com/nicacevedo/fairness-for-regressivity-taxation)
