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

I study how optimization and data-driven methods can support consequential operational and policy decisions. My current research examines equitable predictive modeling for property assessment, transparent models of data-center infrastructure and externalities, and reliable large-scale optimization on GPUs. Across these settings, I use optimization and data-driven modeling to make trade-offs explicit and evaluate methods under realistic operational conditions.

{% comment %}
TODO(USER): Confirm an exact public date and wording before adding an update about the Spring 2026 Analytics Edge teaching appointment.
{% endcomment %}

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
