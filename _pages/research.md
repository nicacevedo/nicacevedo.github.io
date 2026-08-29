---
layout: page
permalink: /research/
title: Research
description: Current and previous research in optimization, machine learning, and data-driven decision-making.
nav: true
nav_order: 1
---

My research combines optimization and data-driven modeling for consequential systems. Current work spans equitable predictive modeling for property assessment, transparent models of data-center resource externalities, and reliable large-scale first-order optimization. Earlier work on feature selection and standardized-test screening remains available below; formal outputs are collected on the [Publications](/publications/) page.

## Current research

{% assign current_projects = site.projects | where: "section", "current" | sort: "importance" %}

<div class="container px-0">
  <div class="row row-cols-1 row-cols-md-2">
    {% for project in current_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
  </div>
</div>

## Previous research

{% assign previous_projects = site.projects | where: "section", "previous" | sort: "importance" %}

<div class="container px-0">
  <div class="row row-cols-1 row-cols-md-2">
    {% for project in previous_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
  </div>
</div>
