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
只在确实有值得读的内容时发布（质量优先，不强行日更）。
</p>

{% assign digests = site.digests_zh | sort: "name" | reverse %}

{% if digests.size == 0 %}
<p>暂时还没有简报。</p>
{% else %}
<ul>
{% for d in digests %}
  <li>
    <a href="{{ d.url }}">{{ d.title }}</a>
  </li>
{% endfor %}
</ul>
{% endif %}
