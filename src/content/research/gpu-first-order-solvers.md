---
title: Reliable and scalable first-order optimization on GPUs
shortTitle: First-order methods on GPUs
thesis: A first-order solver that runs fast on a GPU is only useful if its termination criteria still mean what they meant on a CPU.
description: Ongoing research on numerical reliability in GPU-based first-order methods for large-scale optimization.
researchQuestion: How can first-order optimization methods remain reliable when large-scale solvers are implemented on GPU hardware?
period: 2024 — present
status: Ongoing research
primaryTheme: scalable-optimization
featured: true
stage: current
order: 3
visual: convergence
visualCaption: Schematic. Residuals fall until they reach a floor set by arithmetic rather than by the algorithm. No data is shown.
repository: https://github.com/nicacevedo/cuPDLP.jl
repositoryKind: Research software
outputs:
  - label: Experimental GPU solver code
    href: https://github.com/nicacevedo/cuPDLP.jl
    kind: repository
---

## Why it matters

First-order methods make optimization problems tractable at sizes where
factorization-based solvers cannot go, and GPUs make each iteration cheap. That
combination is what puts very large linear programs within reach. But a solver
is trusted because of what its answer certifies, not because of how quickly it
arrives, and the certificate is a set of numerical quantities.

## The challenge

Moving a first-order method onto a GPU changes its arithmetic. Reduced
precision, different accumulation orders and massive parallelism all affect the
primal and dual residuals and the relative optimality gap — precisely the
quantities that decide when the method stops and what it reports as feasible.
Past some point the residuals stop reflecting algorithmic progress and start
reflecting the floating-point environment, and the two are not easy to tell
apart from the outside.

## Approach

This research examines first-order-method solvers for large-scale optimization
in GPU settings, with attention to numerical stability and to diagnostics that
make reliability visible rather than assumed. The public experimental code
focuses on linear programming and records quantities such as primal and dual
residuals and relative optimality gaps across runs.

## Status

Ongoing research at the MIT Operations Research Center. This page describes the
research direction; it does not present unpublished results.
