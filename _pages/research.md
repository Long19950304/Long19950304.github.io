---
layout: page
title: Research
permalink: /research/
description: Research directions and selected projects (AE + X).
nav: true
nav_order: 3
display_categories:
horizontal: false
---

<p class="lead">
My research program centers on <strong>Agentic Engineering (AE + X)</strong>: building and evaluating multi-agent systems that deliver reliable outcomes in applied communication and digital media contexts.
</p>

<!-- pages/projects.md -->
<div class="projects">
<!-- Display projects without categories -->

{% assign sorted_projects = site.projects | sort: "importance" %}

  <!-- Generate cards for each project -->

{% if page.horizontal %}

  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
</div>
