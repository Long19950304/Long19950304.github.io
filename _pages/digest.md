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
<ul>
{% for d in digests %}
  <li>
    <a href="{{ d.url }}">{{ d.title }}</a>
  </li>
{% endfor %}
</ul>
{% endif %}

