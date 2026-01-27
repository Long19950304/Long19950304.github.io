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
High-signal briefs. I post when there is something genuinely worth your time (quality over frequency).
</p>

{% assign digests = site.digests | sort: "name" | reverse %}

{% if digests.size == 0 %}
<p>No digests yet.</p>
{% else %}
<div class="row">
{% for d in digests %}
  {% assign zh = site.digests_zh | where: "digest_date", d.digest_date | first %}
  <div class="col-12 col-md-6 col-lg-4 mb-4">
    <div class="card h-100 digest-index-card">
      <a href="{{ d.url }}">
        <img
          class="card-img-top digest-card-thumb"
          src="{{ '/assets/img/digests/' | append: d.digest_date | append: '-en.png' | relative_url }}"
          alt="Daily Digest {{ d.digest_date }} card"
          loading="lazy">
      </a>
      <div class="card-body">
        <div class="small text-muted mb-1">{{ d.digest_date }}</div>
        <h5 class="card-title mb-0"><a href="{{ d.url }}">{{ d.title }}</a></h5>
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
