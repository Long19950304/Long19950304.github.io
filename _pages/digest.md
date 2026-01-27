---
layout: page
title: Digest
permalink: /digest/
description: Daily digest archive (news + sources), plus a separate AI tools/model updates section per day.
nav: true
nav_order: 7
lang: en
translation_key: digest
---

<p class="small">
Daily digest archive. Each day includes a news section and (when available) an AI tools/model updates section.
</p>

<div class="digest-index-meta small">
  <a href="{{ '/digest/weekly/' | relative_url }}">Weekly roll-up</a>
  · <a href="{{ '/digest/feed.xml' | relative_url }}">RSS</a>
</div>

{% assign digests = site.digests | sort: "name" | reverse %}

{% if digests.size == 0 %}
<p>No digests yet.</p>
{% else %}
<div class="digest-index" data-digest-index>
  <div class="digest-index-controls">
    <div class="digest-index-controls__row">
      <input class="form-control form-control-sm digest-index-search" type="search" placeholder="Search news & AI tools…" data-digest-search>
    </div>
    <div class="digest-index-controls__row">
      <div class="digest-search-results" data-digest-results hidden></div>
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

  <div class="digest-index-list" data-digest-grid>
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
  {%- comment -%}Keep the `data-tags` attribute small and stable for filtering.{%- endcomment -%}
  {% assign tags = tags | split: " " | uniq | join: " " | strip %}
  {% assign thumb_path = '/assets/img/digests/' | append: date_key | append: '-en.png' %}
  {% assign thumb_webp_path = '/assets/img/digests/' | append: date_key | append: '-en.webp' %}
  {% assign thumb_file = site.static_files | where: "path", thumb_path | first %}
  {% assign thumb_webp_file = site.static_files | where: "path", thumb_webp_path | first %}
  {% assign ai_path = '/assets/img/digests/' | append: date_key | append: '-ai-en.png' %}
  {% assign ai_file = site.static_files | where: "path", ai_path | first %}
  <div class="digest-index-entry" data-digest-col>
    <div class="digest-index-row" data-digest-card data-tags="{{ tags }}" data-title="{{ d.title }}" data-tagline="{{ tagline | strip }}">
      <a class="digest-index-row__thumb" href="{{ d.url }}">
        {% if thumb_file %}
          {% if thumb_webp_file %}
            <picture>
              <source type="image/webp" srcset="{{ thumb_webp_path | relative_url }}">
              <img
                class="digest-index-thumb"
                src="{{ thumb_path | relative_url }}"
                alt="Daily Digest {{ d.digest_date }} card"
                loading="lazy">
            </picture>
          {% else %}
            <img
              class="digest-index-thumb"
              src="{{ thumb_path | relative_url }}"
              alt="Daily Digest {{ d.digest_date }} card"
              loading="lazy">
          {% endif %}
        {% else %}
          <div class="digest-index-thumb digest-index-thumb--placeholder">
            <div class="digest-card-thumb__date">{{ d.digest_date }}</div>
          </div>
        {% endif %}
      </a>
      <div class="digest-index-row__body">
        <div class="digest-index-row__meta">
          <span class="digest-index-row__date">{{ d.digest_date }}</span>
          <span class="digest-index-row__badges">
            <span class="badge badge-light">News</span>
            {% if ai_file %}
              <span class="badge badge-light">AI tools</span>
            {% endif %}
          </span>
        </div>
        <div class="digest-index-row__title"><a href="{{ d.url }}">{{ d.title }}</a></div>
        {% if tagline %}
          <div class="digest-index-row__tagline">{{ tagline | strip | truncate: 140 }}</div>
        {% endif %}
        <div class="digest-index-row__actions">
          <a class="btn btn-sm btn-outline-primary" href="{{ d.url }}">Open</a>
          {% if zh %}
            <a class="btn btn-sm btn-outline-secondary" href="{{ zh.url }}">中文</a>
          {% endif %}
        </div>
      </div>
    </div>
  </div>
{% endfor %}
</div>
  <script defer src="{{ '/assets/js/digest-index.js' | relative_url }}"></script>
</div>
{% endif %}
