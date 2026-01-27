---
layout: page
title: Weekly Digest
permalink: /digest/weekly/
description: A weekly roll-up of the most important items across my daily digests.
nav: false
lang: en
translation_key: digest-weekly
---

<p class="small">
Weekly roll-up (for bookmarking). Each week links to the daily issues and surfaces a few highlights.
</p>

{% assign weeks = site.data.digest_weekly.weeks | sort: "week" | reverse %}

{% if weeks == nil or weeks.size == 0 %}
<p>No weekly digests yet.</p>
{% else %}
{% for w in weeks %}
  <h2>{{ w.week }} ({{ w.start }} → {{ w.end }})</h2>

  {% if w.issues and w.issues.size > 0 %}
  <p class="small">
    Issues:
    {% for d in w.issues %}
      <a href="/digest/{{ d }}/">{{ d }}</a>{% unless forloop.last %} · {% endunless %}
    {% endfor %}
  </p>
  {% endif %}

  {% if w.highlights_news and w.highlights_news.size > 0 %}
  <h3>Highlights — News</h3>
  <ul>
    {% for it in w.highlights_news limit:10 %}
      <li><a href="{{ it.url }}">{{ it.title }}</a> <span class="small text-muted">({{ it.source }})</span></li>
    {% endfor %}
  </ul>
  {% endif %}

  {% if w.highlights_ai and w.highlights_ai.size > 0 %}
  <h3>Highlights — AI tools</h3>
  <ul>
    {% for it in w.highlights_ai limit:10 %}
      <li><a href="{{ it.url }}">{{ it.title }}</a> <span class="small text-muted">({{ it.source }})</span></li>
    {% endfor %}
  </ul>
  {% endif %}
{% endfor %}
{% endif %}

