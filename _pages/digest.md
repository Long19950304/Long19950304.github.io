---
layout: page
title: Digest
permalink: /digest/
description: Daily (high-signal) research briefs curated across AI, CSS/AI & society, digital health, and education.
nav: true
nav_order: 7
lang: en
translation_key: digest
---

<p class="small">
Curated, high-signal briefings across AI, AI &amp; society, digital health, and education.
Updated when there is something genuinely worth reading.
</p>

{% assign digests = site.digests | sort: "name" | reverse %}

{% if digests.size == 0 %}
<p>No digests yet.</p>
{% else %}
<div class="row">
{% for d in digests %}
  {% assign zh = site.digests_zh | where: "digest_date", d.digest_date | first %}
  {% assign meta = site.data.digests[d.digest_date] %}
  {% assign tagline = meta.note %}
  {% if tagline == nil or tagline == "" %}
    {% assign tagline = meta.items[0].title %}
  {% endif %}
  {% assign thumb_path = '/assets/img/digests/' | append: d.digest_date | append: '-en.png' %}
  {% assign thumb_file = site.static_files | where: "path", thumb_path | first %}
  {% assign ai_path = '/assets/img/digests/' | append: d.digest_date | append: '-ai-en.png' %}
  {% assign ai_file = site.static_files | where: "path", ai_path | first %}
  <div class="col-12 col-md-6 col-lg-4 mb-4">
    <div class="card h-100 digest-index-card">
      <a href="{{ d.url }}">
        {% if thumb_file %}
          <img
            class="card-img-top digest-card-thumb"
            src="{{ thumb_path | relative_url }}"
            alt="Daily Digest {{ d.digest_date }} card"
            loading="lazy">
        {% else %}
          <div class="digest-card-thumb digest-card-thumb--placeholder">
            <div class="digest-card-thumb__date">{{ d.digest_date }}</div>
          </div>
        {% endif %}
      </a>
      <div class="card-body">
        <div class="small text-muted mb-1">{{ d.digest_date }}</div>
        <h5 class="card-title mb-0"><a href="{{ d.url }}">{{ d.title }}</a></h5>
        {% if tagline %}
          <div class="digest-card-tagline mt-2">{{ tagline | strip | truncate: 120 }}</div>
        {% endif %}
        <div class="mt-2">
          <span class="badge badge-light">News</span>
          {% if ai_file %}
            <span class="badge badge-light">AI tools</span>
          {% endif %}
        </div>
      </div>
      <div class="card-footer bg-transparent border-top-0 pt-0">
        <a class="btn btn-sm btn-outline-primary" href="{{ d.url }}">Open</a>
        {% if zh %}
          <a class="btn btn-sm btn-outline-secondary" href="{{ zh.url }}">中文</a>
        {% endif %}
      </div>
    </div>
  </div>
{% endfor %}
</div>
{% endif %}
