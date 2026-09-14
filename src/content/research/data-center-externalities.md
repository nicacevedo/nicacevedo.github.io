---
title: Data-center infrastructure and externalities
shortTitle: Data-center systems
thesis: What a large data center draws from the grid, the water system and the aquifer around it can be partially reconstructed from public records — provided the reconstruction is explicit about which quantities are reported and which are modeled.
description: Public-data modeling of data-center resource systems, beginning with a transparent case-study reconstruction.
researchQuestion: How can public data support transparent, reproducible modeling of the infrastructure and resource externalities associated with large data centers when detailed operational telemetry is unavailable?
period: 2026 — present
status: Ongoing public-data modeling
primaryTheme: infrastructure-modeling
featured: true
stage: current
order: 2
visual: network
visualCaption: Schematic of the accounting boundary. Solid paths are supplied quantities, dashed paths leave the reported boundary. No data is shown.
repository: https://github.com/nicacevedo/data-center-externalities-modeling
repositoryKind: Research repository
outputs:
  - label: Project repository
    href: https://github.com/nicacevedo/data-center-externalities-modeling
    kind: repository
---

## Why it matters

Large data centers place substantial and concentrated demands on electricity,
water and the infrastructure of the communities that host them. Those demands
are increasingly the subject of local permitting and utility decisions, which
need quantities that can be checked. Operators publish annual site totals;
almost everything below that resolution is private.

## The challenge

Public records are not a smaller version of operational telemetry. They are
assembled on different accounting boundaries, refreshed on different schedules,
and report different things: an annual water figure from a sustainability
report, a municipal water-system record, weather observations, grid data,
building permits and groundwater context each answer a slightly different
question. Combining them is only defensible if the reconstruction keeps track of
which quantity came from where.

## Approach

This project develops a public-data reconstruction framework, beginning with the
Meta Prineville campus as a case study. The repository integrates reported
annual site quantities with weather, water-system, grid, permit and
groundwater-context data while preserving source provenance and the boundary of
each data product.

The modeling direction uses physics-constrained reconstruction, chronological
validation, and sensitivity and counterfactual analysis. It keeps reported
quantities distinct from modeled, proxy and scenario components, and does not
treat public data as a substitute for private hourly workload or meter
telemetry.

## Status

Ongoing public-data modeling. The public repository documents the baseline and
its limitations; this page does not report preliminary conclusions.
