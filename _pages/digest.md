---
layout: page
title: Digest
permalink: /digest/
description: A daily China and world economy, technology and research briefing, with Chinese and English audio, authoritative reporting and original releases.
nav: true
nav_order: 8
lang: en
translation_key: digest
---

{% assign digests = site.digests | where_exp: "d", "d.archived != true" | sort: "name" | reverse %}
<p>Developments in the Chinese and world economy, useful technology and research. Each edition includes complete Chinese and English recordings, about ten minutes each, with original releases, reporting and transcripts.</p>

<p class="small">
<a href="{{ '/digest/weekly/' | relative_url }}">Weekly roll-up</a>
 · <a href="{{ '/digest/feed.xml' | relative_url }}">RSS</a>
 · <a href="{{ '/digest/sources/' | relative_url }}">Sources and editorial checks</a>
</p>


{% if digests.size == 0 %}
<p>No digests yet.</p>
{% else %}
<div class="digest-index" data-digest-index>
  <div class="digest-index-controls">
    <div class="digest-index-controls__row">
      <input class="form-control form-control-sm digest-index-search" type="search" placeholder="Search stories and sources…" aria-label="Search briefings" data-digest-search>
    </div>
    <div class="digest-index-controls__row digest-index-filters" role="group" aria-label="Digest filters">
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="all">All</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="ai-tools">AI tools</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="ai-society">AI &amp; society</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="health">Health</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="education">Education</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="security">Security</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="business">Economy</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-digest-filter="tech">Tech</button>
    </div>
  </div>

  <div class="digest-index-list">
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
  <div data-digest-col>
    {% include digest-index-card.liquid issue=d meta=meta tags=tags tagline=tagline date_key=date_key alternate=zh %}
  </div>
{% endfor %}
</div>
  <p class="digest-index-empty" data-digest-empty hidden>No briefings match. Try another filter or search term.</p>
  <script defer src="{{ '/assets/js/digest-index.js' | relative_url }}"></script>
  <script defer src="{{ '/assets/js/digest-card-player.js' | relative_url }}"></script>
</div>
{% endif %}
