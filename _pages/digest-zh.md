---
layout: page
title: 简报
permalink: /zh/digest/
description: 每日（高信号）简报：AI、CSS/AI 与社会、健康传播与教育方向。
nav: true
nav_order: 7
lang: zh
translation_key: digest
---

<p class="small">
精选高信号简报：AI、AI 与社会、健康传播与教育方向。
仅在确实有值得读的内容时更新。
</p>

{% assign digests = site.digests_zh | sort: "name" | reverse %}

{% if digests.size == 0 %}
<p>暂时还没有简报。</p>
{% else %}
<div class="row">
{% for d in digests %}
  {% assign en = site.digests | where: "digest_date", d.digest_date | first %}
  {% assign meta = site.data.digests[d.digest_date] %}
  {% assign tagline = meta.note_zh %}
  {% if tagline == nil or tagline == "" %}
    {% assign tagline = meta.items[0].title_zh %}
    {% if tagline == nil or tagline == "" %}
      {% assign tagline = meta.items[0].title %}
    {% endif %}
  {% endif %}
  {% assign thumb_path = '/assets/img/digests/' | append: d.digest_date | append: '-zh.png' %}
  {% assign thumb_file = site.static_files | where: "path", thumb_path | first %}
  {% assign ai_path = '/assets/img/digests/' | append: d.digest_date | append: '-ai-zh.png' %}
  {% assign ai_file = site.static_files | where: "path", ai_path | first %}
  <div class="col-12 col-md-6 col-lg-4 mb-4">
    <div class="card h-100 digest-index-card">
      <a href="{{ d.url }}">
        {% if thumb_file %}
          <img
            class="card-img-top digest-card-thumb"
            src="{{ thumb_path | relative_url }}"
            alt="每日简报 {{ d.digest_date }} 卡片"
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
{% endif %}
