---
layout: page
title: Digest
permalink: /digest/
description: A daily briefing on useful AI tools, research methods and teaching technology, with Chinese and English audio and primary sources.
nav: true
nav_order: 8
lang: en
translation_key: digest
---

{% assign digests = site.digests | where_exp: "d", "d.archived != true" | sort: "name" | reverse %}
{% assign latest_digest = digests | first %}
<p>Useful developments in AI tools, research methods and teaching technology. New editions include complete Chinese and English recordings, about ten minutes each, with primary sources and transcripts.</p>
{% if latest_digest %}
<div class="digest-current"><strong>Latest edition · {{ latest_digest.digest_date }}</strong><br><a href="{{ latest_digest.url | relative_url }}">Read and listen to the latest briefing →</a><br><small>Check the edition date. Publication may be delayed when source coverage or verification is insufficient.</small></div>
{% endif %}

<p class="small">
<a href="{{ '/digest/weekly/' | relative_url }}">Weekly roll-up</a>
 · <a href="{{ '/digest/feed.xml' | relative_url }}">RSS</a>
</p>

{% assign digests = site.digests | where_exp: "d", "d.archived != true" | sort: "name" | reverse %}

{% if digests.size == 0 %}
<p>No digests yet.</p>
{% else %}
<div class="digest-index" data-digest-index>
  <div class="digest-index-controls">
    <div class="digest-index-controls__row">
      <input class="form-control form-control-sm digest-index-search" type="search" placeholder="Search…" data-digest-search>
    </div>
    <div class="digest-index-controls__row digest-index-filters" role="group" aria-label="Digest filters">
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="all">All</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="ai-tools">AI tools</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="ai-society">AI &amp; society</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="health">Health</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="education">Education</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="security">Security</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="business">Business</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="tech">Tech</button>
    </div>
  </div>

  <div class="row">
{% for d in digests %}
  {% assign date_key = d.digest_date | date: "%Y-%m-%d" %}
  {% assign zh = site.digests_zh | where: "digest_date", d.digest_date | first %}
  {% assign meta = site.data.digests[date_key] %}
  {% assign tagline = meta.note %}
  {% if tagline == nil or tagline == "" %}
    {% assign tagline = meta.items[0].title %}
  {% endif %}
  {% assign tags = "" %}
  {% if meta and meta.items %}
    {% for it in meta.items %}
      {% assign cat = it.category | downcase %}
      {% if cat contains "ai tools" %}{% assign tags = tags | append: " ai-tools" %}{% endif %}
      {% if cat contains "css" or cat contains "society" %}{% assign tags = tags | append: " ai-society" %}{% endif %}
      {% if cat contains "health" %}{% assign tags = tags | append: " health" %}{% endif %}
      {% if cat contains "education" %}{% assign tags = tags | append: " education" %}{% endif %}
      {% if cat contains "security" or cat contains "cyber" %}{% assign tags = tags | append: " security" %}{% endif %}
      {% if cat contains "business" or cat contains "economy" or cat contains "finance" %}{% assign tags = tags | append: " business" %}{% endif %}
      {% if cat contains "tech" %}{% assign tags = tags | append: " tech" %}{% endif %}
    {% endfor %}
  {% endif %}
  {% assign tags = tags | strip %}
  {% assign thumb_path = '/assets/img/digests/' | append: date_key | append: '-en.png' %}
  {% assign thumb_webp_path = '/assets/img/digests/' | append: date_key | append: '-en.webp' %}
  {% assign thumb_file = site.static_files | where: "path", thumb_path | first %}
  {% assign thumb_webp_file = site.static_files | where: "path", thumb_webp_path | first %}
  {% assign ai_path = '/assets/img/digests/' | append: date_key | append: '-ai-en.png' %}
  {% assign ai_file = site.static_files | where: "path", ai_path | first %}
  <div class="col-12 col-md-6 col-lg-4 mb-4" data-digest-col>
    <div class="card h-100 digest-index-card" data-digest-card data-tags="{{ tags }}" data-title="{{ d.title }}" data-tagline="{{ tagline | strip }}">
      <a href="{{ d.url }}">
        {% if thumb_file %}
          {% if thumb_webp_file %}
            <picture>
              <source type="image/webp" srcset="{{ thumb_webp_path | relative_url }}">
              <img
                class="card-img-top digest-card-thumb"
                src="{{ thumb_path | relative_url }}"
                alt="Daily Digest {{ d.digest_date }} card"
                loading="lazy">
            </picture>
          {% else %}
            <img
              class="card-img-top digest-card-thumb"
              src="{{ thumb_path | relative_url }}"
              alt="Daily Digest {{ d.digest_date }} card"
              loading="lazy">
          {% endif %}
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
          {% if meta.audio %}<span class="badge badge-light">Chinese & English audio · ~10 min</span>{% else %}<span class="badge badge-light">Text archive</span>{% endif %}
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
  <script defer src="{{ '/assets/js/digest-index.js' | relative_url }}"></script>
</div>
{% endif %}
