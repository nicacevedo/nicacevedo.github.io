---
title: Large-scale feature selection via column-generation decomposition
shortTitle: Feature selection
thesis: Feature selection stays tractable under heavy correlation if the problem is recast as a conic program and its columns are generated rather than enumerated.
description: Master's research on a scalable decomposition approach for feature selection under many correlated candidate predictors.
researchQuestion: How can feature selection remain tractable when data have many, highly correlated candidate features?
period: 2022 — 2023
status: Completed
primaryTheme: optimization-at-scale
featured: false
stage: earlier
order: 4
visual: sparse
visualCaption: Schematic of a sparse coefficient pattern with columns introduced one at a time. No data is shown.
outputs:
  - label: Master's thesis (Universidad de Chile)
    href: https://repositorio.uchile.cl/handle/2250/198750
    kind: thesis
  - label: Poster — Workshop in Management Science
    href: /assets/pdf/Poster_MSWorkshop.pdf
    kind: poster
  - label: Poster — EVIC 2023
    href: /assets/pdf/PosterEVIC2023.pdf
    kind: poster
---

## Why it matters

Selecting a small, defensible set of predictors from a large candidate pool is a
recurring requirement in applied modeling. When the candidates are highly
correlated, the selection problem becomes both statistically delicate and
computationally hard, and the methods that scale best are often the ones that
give up the clearest formulation.

## The challenge

Standard approaches either enumerate the candidate set or rely on coordinate
updates that slow markedly once features are strongly correlated. What is wanted
is a formulation that keeps convex-optimization guarantees while avoiding work
proportional to the full candidate pool.

## Approach

My master's thesis reformulates unconstrained LASSO as an equivalent
second-order cone program and develops a column-wise decomposition driven by
conic-dual subproblems, so candidate features enter the master problem only when
their dual price justifies it. The resulting framework is studied alongside
standard optimization methods for feature selection.

## Status

Completed master's research, 2022 — 2023. The thesis received the Best Master
Thesis Award from FCFM, Universidad de Chile, and a thesis distinction from the
School of Graduate Studies.
