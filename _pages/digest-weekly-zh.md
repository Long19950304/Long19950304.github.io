---
layout: page
title: 每周简报
permalink: /zh/digest/weekly/
description: 每周汇总：将每日简报中的重点条目按周聚合，便于回顾与收藏。
nav: false
lang: zh
translation_key: digest-weekly
---

<p class="small">
每周汇总（便于收藏/回顾）。每周包含每日简报链接，并精选部分重点条目。
</p>

{% assign weeks = site.data.digest_weekly.weeks | sort: "week" | reverse %}

{% if weeks == nil or weeks.size == 0 %}
<p>暂时还没有每周简报。</p>
{% else %}
{% for w in weeks %}
  <h2>{{ w.week }}（{{ w.start }} → {{ w.end }}）</h2>

  {% if w.issues and w.issues.size > 0 %}
  <p class="small">
    每日简报：
    {% for d in w.issues %}
      <a href="/zh/digest/{{ d }}/">{{ d }}</a>{% unless forloop.last %} · {% endunless %}
    {% endfor %}
  </p>
  {% endif %}

  {% if w.highlights_news and w.highlights_news.size > 0 %}
  <h3>重点 — 新闻</h3>
  <ul>
    {% for it in w.highlights_news limit:10 %}
      {% assign t = it.title_zh | default: it.title %}
      <li><a href="{{ it.url }}">{{ t }}</a> <span class="small text-muted">（{{ it.source }}）</span></li>
    {% endfor %}
  </ul>
  {% endif %}

  {% if w.highlights_ai and w.highlights_ai.size > 0 %}
  <h3>重点 — AI 工具</h3>
  <ul>
    {% for it in w.highlights_ai limit:10 %}
      {% assign t = it.title_zh | default: it.title %}
      <li><a href="{{ it.url }}">{{ t }}</a> <span class="small text-muted">（{{ it.source }}）</span></li>
    {% endfor %}
  </ul>
  {% endif %}
{% endfor %}
{% endif %}

