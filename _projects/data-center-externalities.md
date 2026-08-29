---
layout: page
title: Data-center infrastructure and externalities
description: Public-data modeling of data-center resource systems, beginning with a transparent case-study reconstruction.
status: Ongoing public-data modeling
period: 2026–present
importance: 2
selected: true
section: current
github: https://github.com/nicacevedo/data-center-externalities-modeling
---

## Research question

How can public data support transparent, reproducible modeling of the infrastructure and resource externalities associated with large data centers when detailed operational telemetry is unavailable?

## Motivation

Large data centers create substantial demands on electricity, water, and surrounding infrastructure. Studying those systems requires careful attention to what public records can establish, which accounting boundaries differ, and where uncertainty remains.

## Approach

This project develops a public-data reconstruction framework, beginning with the Meta Prineville campus as a case study. The repository integrates reported annual site quantities with weather, water-system, grid, permit, and groundwater-context data, while preserving source provenance and the boundaries of each data product.

The modeling direction uses physics-constrained reconstruction, chronological validation, and sensitivity or counterfactual analysis. It explicitly distinguishes reported quantities from modeled, proxy, and scenario components, and does not treat public data as a substitute for private hourly workload or meter telemetry.

{% comment %}
TODO(USER): Add verified collaborators if appropriate.
{% endcomment %}

## Status

Ongoing public-data modeling. The current public repository documents the baseline and its limitations; this page does not report preliminary conclusions.

## Outputs

- [Code / project repository](https://github.com/nicacevedo/data-center-externalities-modeling)

