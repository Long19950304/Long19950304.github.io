---
layout: page
permalink: /media/
title: Media
description: Selected media and creative works.
nav: true
nav_order: 4
---

## Selected works

### *Chinese Passenger / 普快列车*

- Experimental short film (MA thesis, University of Macau)
- Shortlisted/selected: Macao International Film Festival (*澳门国际电影节*) short film section (2017)

**Poster & stills**

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.75rem; margin: 0.75rem 0 0.5rem;">
  {% assign poster = site.static_files | where: "path", "/assets/img/media/chinese-passenger/poster.jpg" | first %}
  {% assign still1 = site.static_files | where: "path", "/assets/img/media/chinese-passenger/still-1.jpg" | first %}
  {% assign still2 = site.static_files | where: "path", "/assets/img/media/chinese-passenger/still-2.jpg" | first %}
  {% assign still3 = site.static_files | where: "path", "/assets/img/media/chinese-passenger/still-3.jpg" | first %}
  {% assign still4 = site.static_files | where: "path", "/assets/img/media/chinese-passenger/still-4.jpg" | first %}

  {% if poster %}
    <img src="{{ poster.path }}" alt="Chinese Passenger poster" style="width:100%; height:auto; border-radius: 14px;">
  {% else %}
    <img src="/assets/img/media/chinese-passenger/poster-placeholder.svg" alt="Chinese Passenger poster (placeholder)" style="width:100%; height:auto; border-radius: 14px;">
  {% endif %}

  {% if still1 %}
    <img src="{{ still1.path }}" alt="Chinese Passenger still" style="width:100%; height:auto; border-radius: 14px;">
  {% else %}
    <img src="/assets/img/media/chinese-passenger/still-placeholder.svg" alt="Chinese Passenger still (placeholder)" style="width:100%; height:auto; border-radius: 14px;">
  {% endif %}

  {% if still2 %}
    <img src="{{ still2.path }}" alt="Chinese Passenger still" style="width:100%; height:auto; border-radius: 14px;">
  {% else %}
    <img src="/assets/img/media/chinese-passenger/still-placeholder.svg" alt="Chinese Passenger still (placeholder)" style="width:100%; height:auto; border-radius: 14px;">
  {% endif %}

  {% if still3 %}
    <img src="{{ still3.path }}" alt="Chinese Passenger still" style="width:100%; height:auto; border-radius: 14px;">
  {% else %}
    <img src="/assets/img/media/chinese-passenger/still-placeholder.svg" alt="Chinese Passenger still (placeholder)" style="width:100%; height:auto; border-radius: 14px;">
  {% endif %}

  {% if still4 %}
    <img src="{{ still4.path }}" alt="Chinese Passenger still" style="width:100%; height:auto; border-radius: 14px;">
  {% else %}
    <img src="/assets/img/media/chinese-passenger/still-placeholder.svg" alt="Chinese Passenger still (placeholder)" style="width:100%; height:auto; border-radius: 14px;">
  {% endif %}
</div>

<p class="small">
Files: <code>assets/img/media/chinese-passenger/poster.jpg</code>, <code>assets/img/media/chinese-passenger/still-1.jpg</code>, <code>still-2.jpg</code>, <code>still-3.jpg</code>, <code>still-4.jpg</code>.
</p>

### *Interdimensional Interview Room / 异次元访谈室*

- AI-native interview-format video program
- Selected episode sample will be added (≤100MB) after you pick the episode and export the final audio.

<p class="small">
When ready, put the sample at <code>assets/video/interdimensional-interview-room-sample.mp4</code> (keep &lt;100MB), and I’ll embed it here.
</p>

{% assign sample = site.static_files | where: "path", "/assets/video/interdimensional-interview-room-sample.mp4" | first %}
{% if sample %}
<div style="max-width: 980px; margin: 0.5rem 0 0;">
  <video controls preload="metadata" style="width: 100%; border-radius: 14px;">
    <source src="{{ sample.path }}" type="video/mp4">
  </video>
</div>
{% endif %}
