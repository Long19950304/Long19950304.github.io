---
layout: page
title: 简报
permalink: /zh/digest/
description: 国内外财经、科技与研究简报，提供中英文音频、权威报道和原始公告。
nav: true
nav_order: 8
lang: zh
translation_key: digest
---

{% assign digests = site.digests_zh | where_exp: "d", "d.archived != true" | sort: "name" | reverse %}
<p>关注国内与国际财经、实用科技和研究进展。每天提供中文和英文两套完整播报，每套约十分钟，并保留原始公告、报道和播报文字。</p>

<p class="small">
<a href="{{ '/zh/digest/weekly/' | relative_url }}">每周汇总</a>
 · <a href="{{ '/zh/digest/feed.xml' | relative_url }}">RSS</a>
 · <a href="{{ '/zh/digest/sources/' | relative_url }}">来源与筛选说明</a>
</p>


{% include digest-status.liquid latest=digests.first %}

{% if digests.size == 0 %}
<p>暂时还没有简报。</p>
{% else %}
<div class="digest-index" data-digest-index>
  <div class="digest-index-controls">
    <div class="digest-index-controls__row">
      <input class="form-control form-control-sm digest-index-search" type="search" placeholder="搜索本期主题、来源…" aria-label="搜索简报" data-digest-search>
    </div>
    <div class="digest-index-controls__row digest-index-filters" role="group" aria-label="简报筛选">
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="all">全部</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="ai-tools">AI 工具</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="ai-society">AI 与社会</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="health">健康</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="education">教育</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="security">安全</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="business">财经</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="tech">科技</button>
    </div>
  </div>

  <div class="digest-index-list">
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

  <div data-digest-col>
    {% include digest-index-card.liquid issue=d meta=meta tags=tags tagline=tagline date_key=date_key alternate=en %}
  </div>
{% endfor %}
</div>
  <p class="digest-index-empty" data-digest-empty hidden>没有符合条件的简报，请调整筛选或搜索词。</p>
  <script defer src="{{ '/assets/js/digest-index.js' | relative_url }}"></script>
  <script defer src="{{ '/assets/js/digest-card-player.js' | relative_url }}"></script>
</div>
{% endif %}
