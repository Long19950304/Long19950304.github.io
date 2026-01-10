---
layout: page
title: Research
permalink: /research/
description: Research directions and selected projects (AE+X).
nav: true
nav_order: 3
research_filter: true
display_categories:
horizontal: false
---

<p class="lead">
My research program centers on <strong>Agentic Engineering (AE+X)</strong>: building and evaluating multi-agent systems that deliver reliable outcomes in applied communication and digital media contexts.
</p>

<!-- pages/projects.md -->
<div class="projects">
<!-- Display projects without categories -->

{% assign sorted_projects = site.projects | where: "category", "research" | sort: "importance" %}

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
  <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
</div>

## Research portfolio (synced)

<p class="small">
This list is synced from my internal research pool and includes published, in-press, preprints, and active projects.
</p>

<div class="research-filter" data-research-filter>
  <div class="research-filter__row">
    <input class="research-filter__input" type="search" placeholder="Filter by keyword (title/venue)..." aria-label="Filter research items by keyword" data-research-filter-input>
    <div class="research-filter__count small" data-research-filter-count></div>
  </div>
  <div class="research-filter__row research-filter__row--pills" role="group" aria-label="Stage filters">
    <button class="btn btn-sm z-depth-0 research-filter__pill is-active" type="button" data-research-filter-stage="all">All</button>
    <button class="btn btn-sm z-depth-0 research-filter__pill" type="button" data-research-filter-stage="published">Published</button>
    <button class="btn btn-sm z-depth-0 research-filter__pill" type="button" data-research-filter-stage="accepted">Accepted</button>
    <button class="btn btn-sm z-depth-0 research-filter__pill" type="button" data-research-filter-stage="preprint">Preprint</button>
  </div>
</div>

<div id="research-portfolio" data-research-portfolio>
{% assign stage_order = "published,accepted,revise_resubmit,submitted,writing,analysis,build,design,data_inventory,idea" | split: "," %}
{% assign pool = site.data.research_pool.projects %}
{% assign expanded_stages = "published,accepted,revise_resubmit,submitted" | split: "," %}

{% assign conf_items = pool | where: "kind", "conference_paper" | sort: "conference_date" | reverse %}
{% if conf_items.size > 0 %}
### Conference presentations

<ul>
{% for p in conf_items %}
<li
  id="{{ p.project_id }}"
  class="research-item"
  data-stage="{{ p.stage | default: 'conference' }}"
  data-year="{{ p.year | default: 0 }}"
  data-preprint="{% if p.preprint_url != '' %}true{% else %}false{% endif %}"
  data-title="{{ p.title | strip | escape }}"
  data-venue="{{ p.conference_name | default: '' | strip | escape }}"
>
{%- assign link_url = "" -%}
{%- if p.published_url != "" -%}
  {%- assign link_url = p.published_url -%}
{%- elsif p.preprint_url != "" -%}
  {%- assign link_url = p.preprint_url -%}
{%- endif -%}

{%- assign translated_title = site.data.title_translations[p.project_id] | default: "" -%}
{%- assign display_title = p.title -%}
{%- if translated_title != "" -%}
  {%- assign display_title = translated_title -%}
{%- endif -%}

<div class="research-item__headline">
{%- if link_url != "" -%}
  <a href="{{ link_url }}" target="_blank" rel="noopener">{{ display_title }}</a>
{%- else -%}
  {{ display_title }}
{%- endif -%}
</div>

{% if translated_title != "" %}
  <div class="research-item__subtitle">{{ p.title }}</div>
{% endif %}

{%- if p.conference_name != "" -%}
  — <em>{{ p.conference_name }}</em>
{%- endif -%}

{%- assign where_parts = "" -%}
{%- if p.conference_city != "" -%}
  {%- assign where_parts = where_parts | append: p.conference_city -%}
{%- endif -%}
{%- if p.conference_date != "" -%}
  {%- if where_parts != "" -%}
    {%- assign where_parts = where_parts | append: ", " -%}
  {%- endif -%}
  {%- assign where_parts = where_parts | append: p.conference_date -%}
{%- endif -%}
  {%- if where_parts != "" -%}
  ({{ where_parts }})
{%- endif -%}
</li>
{% endfor %}
</ul>
{% endif %}

{% for stage in stage_order %}
  {% assign items = pool | where: "stage", stage %}
  {% if items.size > 0 %}
    {% capture stage_label %}{{ stage | replace: "_", " " | capitalize }} ({{ items.size }}){% endcapture %}
    {% assign is_expanded = false %}
    {% if expanded_stages contains stage %}
      {% assign is_expanded = true %}
    {% endif %}

    {% if is_expanded %}
### {{ stage_label }}
    {% else %}
<details>
  <summary><strong>{{ stage_label }}</strong></summary>
    {% endif %}

<ul>
{% for p in items %}
<li
  id="{{ p.project_id }}"
  class="research-item"
  data-stage="{{ p.stage | default: '' }}"
  data-year="{{ p.year | default: 0 }}"
  data-preprint="{% if p.preprint_url != '' %}true{% else %}false{% endif %}"
  data-title="{{ p.title | strip | escape }}"
  data-venue="{{ p.target_venue | default: '' | strip | escape }}"
>
{%- assign link_url = "" -%}
{%- if p.published_url != "" -%}
  {%- assign link_url = p.published_url -%}
{%- elsif p.preprint_url != "" -%}
  {%- assign link_url = p.preprint_url -%}
{%- endif -%}

{%- assign translated_title = site.data.title_translations[p.project_id] | default: "" -%}
{%- assign display_title = p.title -%}
{%- if translated_title != "" -%}
  {%- assign display_title = translated_title -%}
{%- endif -%}

<div class="research-item__headline">
{%- if link_url != "" -%}
  <a href="{{ link_url }}" target="_blank" rel="noopener">{{ display_title }}</a>
{%- else -%}
  {{ display_title }}
{%- endif -%}
{% include cite_share_project.liquid project=p %}
</div>

{% if translated_title != "" %}
  <div class="research-item__subtitle">{{ p.title }}</div>
{% endif %}

<div class="research-item__meta">
{%- if p.target_venue != "" -%}
  <em>{{ p.target_venue }}</em>
{%- endif -%}

{%- if p.year -%}
  ({{ p.year }})
{%- endif -%}
</div>

{% include podcast_link.liquid id=p.project_id %}
</li>
{% endfor %}
</ul>

    {% unless is_expanded %}
</details>
    {% endunless %}
  {% endif %}
{% endfor %}

</div>
