---
layout: page
title: Reliable and scalable first-order optimization on GPUs
description: Ongoing research on numerical reliability in GPU-based first-order methods for large-scale optimization.
status: Ongoing research
period: 2024–present
importance: 3
selected: true
section: current
github: https://github.com/nicacevedo/cuPDLP.jl
---

## Research question

How can first-order optimization methods remain reliable when large-scale solvers are implemented on GPU hardware?

## Motivation

First-order methods can make large optimization problems more tractable, but GPU implementations introduce practical numerical questions that affect feasibility, residuals, and termination behavior. Reliable solver behavior is essential when large-scale computations are used to support optimization decisions.

## Approach

This research examines first-order-method solvers for large-scale optimization in GPU settings, with particular attention to numerical stability and reliability diagnostics. The public experimental code focuses on linear programming and records quantities such as primal and dual residuals and relative optimality gaps.

{% comment %}
TODO(USER): Add verified collaborators if appropriate.
{% endcomment %}

## Status

Ongoing research at the MIT Operations Research Center. This page describes the research direction without presenting unpublished results.

## Outputs

- [Experimental GPU solver code](https://github.com/nicacevedo/cuPDLP.jl)
