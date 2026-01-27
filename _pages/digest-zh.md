---
layout: page
title: 简报
permalink: /zh/digest/
description: 每日简报归档（新闻 + 来源），并单列当日 AI 工具 / 模型更新。
nav: true
nav_order: 7
lang: zh
translation_key: digest
---

<p class="small">
每日简报归档（新闻 + 来源），并单列当日 AI 工具 / 模型更新。
</p>

<p class="small">
<a href="{{ '/zh/digest/weekly/' | relative_url }}">每周汇总</a>
 · <a href="{{ '/zh/digest/feed.xml' | relative_url }}">RSS</a>
</p>

{% assign digests = site.digests_zh | sort: "name" | reverse %}

{% if digests.size == 0 %}
<p>暂时还没有简报。</p>
{% else %}
<div class="digest-index" data-digest-index>
  <div class="digest-index-controls">
    <div class="digest-index-controls__row">
      <input class="form-control form-control-sm digest-index-search" type="search" placeholder="搜索…" data-digest-search>
    </div>
    <div class="digest-index-controls__row">
      <div class="digest-search-results" data-digest-results hidden></div>
    </div>
    <div class="digest-index-controls__row digest-index-filters" role="group" aria-label="简报筛选">
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="all">全部</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="ai-tools">AI 工具</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="ai-society">AI 与社会</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="health">健康</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="education">教育</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="security">安全</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="business">商业</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="tech">科技</button>
    </div>
  </div>

  <div class="row" data-digest-grid>
{% for d in digests %}
  {% assign date_key = d.digest_date | date: "%Y-%m-%d" %}
  {% assign en = site.digests | where: "digest_date", d.digest_date | first %}
  {% assign meta = site.data.digests[date_key] %}
  {% assign tagline = meta.note_zh %}
  {% if tagline == nil or tagline == "" %}
    {% assign tagline = meta.items[0].title_zh %}
    {% if tagline == nil or tagline == "" %}
      {% assign tagline = meta.items[0].title %}
    {% endif %}
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
  {%- comment -%}保持 `data-tags` 简洁，便于筛选与缓存。{%- endcomment -%}
  {% assign tags = tags | split: " " | uniq | join: " " | strip %}

  {% assign thumb_path = '/assets/img/digests/' | append: date_key | append: '-zh.png' %}
  {% assign thumb_webp_path = '/assets/img/digests/' | append: date_key | append: '-zh.webp' %}
  {% assign thumb_file = site.static_files | where: "path", thumb_path | first %}
  {% assign thumb_webp_file = site.static_files | where: "path", thumb_webp_path | first %}
  {% assign ai_path = '/assets/img/digests/' | append: date_key | append: '-ai-zh.png' %}
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
                alt="每日简报 {{ d.digest_date }} 卡片"
                loading="lazy">
            </picture>
          {% else %}
            <img
              class="card-img-top digest-card-thumb"
              src="{{ thumb_path | relative_url }}"
              alt="每日简报 {{ d.digest_date }} 卡片"
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
          <div class="digest-card-tagline mt-2">{{ tagline | strip | truncate: 80 }}</div>
        {% endif %}
        <div class="mt-2">
          <span class="badge badge-light">新闻</span>
          {% if ai_file %}
            <span class="badge badge-light">AI 工具</span>
          {% endif %}
        </div>
      </div>
      <div class="card-footer bg-transparent border-top-0 pt-0">
        <a class="btn btn-sm btn-outline-primary" href="{{ d.url }}">打开</a>
        {% if en %}
          <a class="btn btn-sm btn-outline-secondary" href="{{ en.url }}">EN</a>
        {% endif %}
      </div>
    </div>
  </div>
{% endfor %}
</div>
  <script defer src="{{ '/assets/js/digest-index.js' | relative_url }}"></script>
</div>
{% endif %}
