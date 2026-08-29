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

I study how optimization and data-driven methods can support consequential operational and policy decisions. My current research spans equitable predictive modeling for property assessment, public-data modeling of data-center infrastructure and resource systems, and reliable large-scale first-order optimization on GPUs. Across these settings, I use optimization and data-driven modeling to make trade-offs explicit and evaluate methods under realistic operational conditions.

I have been fortunate to receive research guidance from Haihao (Sean) Lu, Saurabh Amin, and Deepjyoti (Deep) Deka during my PhD. I am currently advised by Saurabh and Deep.

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

## Background

<div class="row">
  <div class="col-md-6 mb-3 mb-md-0">
    <h3>Education</h3>
    <p class="mb-3">
      <strong>PhD in Operations Research</strong><br>
      Massachusetts Institute of Technology (MIT) · Sept. 2024–Present
    </p>
    <p class="mb-3">
      <strong>Master in Operations Management</strong><br>
      Universidad de Chile · 2022–2023
    </p>
    <p class="mb-0">
      <strong>Bachelor of Engineering Science in Industrial Engineering</strong><br>
      Universidad de Chile · 2017–2021
    </p>
  </div>
  <div class="col-md-6">
    <h3>Experience</h3>
    <p class="mb-3">
      <strong>Researcher</strong><br>
      Web Intelligence Centre (WIC) / ACHS · Dec. 2023–Apr. 2024
    </p>
    <p class="mb-0">
      <strong>Research Engineer</strong><br>
      Nezasa AG / TripYeah · June 2022–April 2023
    </p>
  </div>
</div>

Outside research, I enjoy music, climbing, and time outdoors.
