---
title: Outlier detection for standardized tests
shortTitle: Test screening
thesis: Screening a national exam for anomalous results is only actionable if each flag can be explained to the people who must act on it.
description: An interpretable anomaly-screening protocol for Chile's university selection exam.
researchQuestion: How can statistical and machine-learning methods support interpretable screening for anomalous standardized-test results?
period: 2020 — 2022
status: Conference presentation (unpublished)
primaryTheme: equitable-prediction
featured: false
stage: earlier
order: 5
visual: observation
visualCaption: Schematic. A screening rule separates ordinary variation from the few results it ranks as anomalous. No data is shown.
outputs:
  - label: Presentation paper
    href: /assets/pdf/psu-outliers-tex.pdf
    kind: paper
  - label: Presentation slides
    href: /assets/pdf/psu-outliers-slides.pdf
    kind: slides
  - label: OPTIMA 2021 event page
    href: https://www.ucm.cl/eventos/xiv-chilean-conference-on-operations-research/
    kind: page
---

## Why it matters

A university selection exam allocates places, and a flagged result can trigger
review of an individual test taker. Screening therefore carries consequences in
both directions: missed anomalies undermine the exam, and unexplained flags are
not defensible to the agency that has to act on them.

## The challenge

Anomalies in test data are rare, heterogeneous and not labeled, which rules out
supervised detection and rewards methods whose output a reviewer can read. A
single score is needed, but it has to be traceable back to the evidence that
produced it.

## Approach

The project developed an outlier-detection protocol combining statistical
discrepancy measures, clustering-based screening and outlier-detection models
into one interpretable anomaly score per test taker. The methodology was
validated and presented to DEMRE, the government agency responsible for
administering the exam.

## Status

Presented at the XIV Chilean Conference on Operations Research (OPTIMA 2021) at
Universidad Católica del Maule in March 2022. This is an unpublished conference
presentation, not a publication.
