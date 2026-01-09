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

{% assign poster = site.static_files | where: "path", "/assets/img/media/chinese-passenger/poster.jpg" | first %}
{% assign still1 = site.static_files | where: "path", "/assets/img/media/chinese-passenger/still-1.jpg" | first %}
{% assign still2 = site.static_files | where: "path", "/assets/img/media/chinese-passenger/still-2.jpg" | first %}
{% assign still3 = site.static_files | where: "path", "/assets/img/media/chinese-passenger/still-3.jpg" | first %}
{% assign still4 = site.static_files | where: "path", "/assets/img/media/chinese-passenger/still-4.jpg" | first %}

<div class="media-work__gallery">
  <div class="media-work__poster">
    {% if poster %}
      {% include figure.liquid
        path="assets/img/media/chinese-passenger/poster.jpg"
        alt="Chinese Passenger / 普快列车 poster"
        class="media-work__img media-work__img--poster"
        sizes="(min-width: 992px) 40vw, 95vw"
        loading="eager"
        zoomable=true
      %}
    {% else %}
      <img src="/assets/img/media/chinese-passenger/poster-placeholder.svg" alt="Chinese Passenger poster (placeholder)" class="media-work__placeholder">
    {% endif %}
  </div>

  <div class="media-work__stills">
    <div class="media-work__still">
      {% if still1 %}
        {% include figure.liquid
          path="assets/img/media/chinese-passenger/still-1.jpg"
          alt="Chinese Passenger / 普快列车 still 1"
          class="media-work__img"
          sizes="(min-width: 992px) 26vw, (min-width: 576px) 45vw, 95vw"
          zoomable=true
        %}
      {% else %}
        <img src="/assets/img/media/chinese-passenger/still-placeholder.svg" alt="Chinese Passenger still (placeholder)" class="media-work__placeholder">
      {% endif %}
    </div>

    <div class="media-work__still">
      {% if still2 %}
        {% include figure.liquid
          path="assets/img/media/chinese-passenger/still-2.jpg"
          alt="Chinese Passenger / 普快列车 still 2"
          class="media-work__img"
          sizes="(min-width: 992px) 26vw, (min-width: 576px) 45vw, 95vw"
          zoomable=true
        %}
      {% else %}
        <img src="/assets/img/media/chinese-passenger/still-placeholder.svg" alt="Chinese Passenger still (placeholder)" class="media-work__placeholder">
      {% endif %}
    </div>

    <div class="media-work__still">
      {% if still3 %}
        {% include figure.liquid
          path="assets/img/media/chinese-passenger/still-3.jpg"
          alt="Chinese Passenger / 普快列车 still 3"
          class="media-work__img"
          sizes="(min-width: 992px) 26vw, (min-width: 576px) 45vw, 95vw"
          zoomable=true
        %}
      {% else %}
        <img src="/assets/img/media/chinese-passenger/still-placeholder.svg" alt="Chinese Passenger still (placeholder)" class="media-work__placeholder">
      {% endif %}
    </div>

    <div class="media-work__still">
      {% if still4 %}
        {% include figure.liquid
          path="assets/img/media/chinese-passenger/still-4.jpg"
          alt="Chinese Passenger / 普快列车 still 4"
          class="media-work__img"
          sizes="(min-width: 992px) 26vw, (min-width: 576px) 45vw, 95vw"
          zoomable=true
        %}
      {% else %}
        <img src="/assets/img/media/chinese-passenger/still-placeholder.svg" alt="Chinese Passenger still (placeholder)" class="media-work__placeholder">
      {% endif %}
    </div>
  </div>
</div>

### *Interdimensional Interview Room / 异次元访谈室*

- AI-native interview-format video program
- Sample episodes are available via private viewing links upon request (selected stills shown below).

**Selected stills**

{% assign iir1 = site.static_files | where: "path", "/assets/img/media/interdimensional-interview-room/still-1.jpg" | first %}
{% assign iir2 = site.static_files | where: "path", "/assets/img/media/interdimensional-interview-room/still-2.jpg" | first %}
{% assign iir3 = site.static_files | where: "path", "/assets/img/media/interdimensional-interview-room/still-3.jpg" | first %}
{% assign iir4 = site.static_files | where: "path", "/assets/img/media/interdimensional-interview-room/still-4.jpg" | first %}
{% assign iir5 = site.static_files | where: "path", "/assets/img/media/interdimensional-interview-room/still-5.jpg" | first %}
{% assign iir6 = site.static_files | where: "path", "/assets/img/media/interdimensional-interview-room/still-6.jpg" | first %}

<div class="media-gallery media-gallery--16x9">
  {% if iir1 %}
    {% include figure.liquid path="assets/img/media/interdimensional-interview-room/still-1.jpg" alt="Interdimensional Interview Room still 1" class="media-gallery__img" sizes="(min-width: 992px) 30vw, (min-width: 576px) 45vw, 95vw" zoomable=true %}
  {% endif %}
  {% if iir2 %}
    {% include figure.liquid path="assets/img/media/interdimensional-interview-room/still-2.jpg" alt="Interdimensional Interview Room still 2" class="media-gallery__img" sizes="(min-width: 992px) 30vw, (min-width: 576px) 45vw, 95vw" zoomable=true %}
  {% endif %}
  {% if iir3 %}
    {% include figure.liquid path="assets/img/media/interdimensional-interview-room/still-3.jpg" alt="Interdimensional Interview Room still 3" class="media-gallery__img" sizes="(min-width: 992px) 30vw, (min-width: 576px) 45vw, 95vw" zoomable=true %}
  {% endif %}
  {% if iir4 %}
    {% include figure.liquid path="assets/img/media/interdimensional-interview-room/still-4.jpg" alt="Interdimensional Interview Room still 4" class="media-gallery__img" sizes="(min-width: 992px) 30vw, (min-width: 576px) 45vw, 95vw" zoomable=true %}
  {% endif %}
  {% if iir5 %}
    {% include figure.liquid path="assets/img/media/interdimensional-interview-room/still-5.jpg" alt="Interdimensional Interview Room still 5" class="media-gallery__img" sizes="(min-width: 992px) 30vw, (min-width: 576px) 45vw, 95vw" zoomable=true %}
  {% endif %}
  {% if iir6 %}
    {% include figure.liquid path="assets/img/media/interdimensional-interview-room/still-6.jpg" alt="Interdimensional Interview Room still 6" class="media-gallery__img" sizes="(min-width: 992px) 30vw, (min-width: 576px) 45vw, 95vw" zoomable=true %}
  {% endif %}
</div>

{% assign sample = site.static_files | where: "path", "/assets/video/interdimensional-interview-room-sample.mp4" | first %}
{% if sample %}
<div style="max-width: 980px; margin: 0.5rem 0 0;">
  <video controls preload="metadata" style="width: 100%; border-radius: 14px;">
    <source src="{{ sample.path }}" type="video/mp4">
  </video>
</div>
{% endif %}
