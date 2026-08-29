---
layout: page
permalink: /research/
title: Research
description: Current and previous research in optimization, machine learning, and data-driven decision-making.
nav: true
nav_order: 1
---

My research develops optimization and data-driven methods for consequential decision problems. This page brings together current work and selected previous research; formal outputs are collected on the [Publications](/publications/) page.

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
