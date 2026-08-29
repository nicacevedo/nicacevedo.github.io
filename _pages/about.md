---
layout: about
title: Nicolás Acevedo Villena
permalink: /
subtitle: "PhD student in Operations Research at MIT"

profile:
  align: right
  image: prof_trek.jpg
  image_circular: false
  more_info: >
    <p>MIT Operations Research Center</p>
    <p>Cambridge, MA</p>

selected_papers: false
social: true

announcements:
  enabled: true
  scrollable: true
  limit: 3

latest_posts:
  enabled: false
---

I study how optimization and data-driven methods can support consequential operational and policy decisions. My current work examines fairness in machine learning and numerical reliability in large-scale GPU optimization; earlier work includes scalable feature selection and outlier detection for standardized tests.

## Selected research

{% assign selected_projects = site.projects | where: "selected", true | sort: "importance" %}

<div class="container px-0">
  <div class="row row-cols-1 row-cols-md-2">
    {% for project in selected_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
  </div>
</div>

Outside research, I enjoy music, climbing, and time outdoors.
