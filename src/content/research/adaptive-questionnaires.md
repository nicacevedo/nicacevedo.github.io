---
title: Adaptive questionnaires for polarized survey questions
shortTitle: Adaptive questionnaires
thesis: Which question is worth asking next depends on the answers already given, so a questionnaire has to be designed as a sequence rather than as a set.
description: Online optimization for adaptive questionnaires, formulated as a variant of matrix completion.
researchQuestion: How should a questionnaire choose both the subset and the order of its questions so that each answer carries as much information as possible?
period: 2021 — 2022
status: Completed
primaryTheme: fair-reliable-prediction
featured: false
stage: earlier
order: 6
visual: sequence
visualCaption: Schematic. A few candidates are selected from a larger pool, and the order in which they are asked is part of the decision. No data is shown.
---

## Why it matters

A survey has a budget. Every additional question costs attention, and on socially
polarized topics it can cost willingness to answer at all. That makes the choice
of which questions to ask, and when, a design decision rather than an
administrative one.

## The challenge

Choosing the most informative subset of questions is already combinatorial.
Choosing the order makes it sequential, because what is worth asking next depends
on what has been answered so far. The two parts cannot be solved well in
isolation, and the respondent's remaining answers are exactly the quantities that
are unknown at the moment the next question has to be chosen.

## Approach

The project modeled the task as an online variant of matrix completion, and
solved it with an ensemble of predictive models, probabilistic greedy policies
and dynamic programming for the sequential decisions.

## Status

Completed research at the Complex Engineering Systems Institute, 2021 — 2022,
with Ricardo Montoya and Charles Thraves. There are no public outputs from this
work.
