---
layout: page
permalink: /zh/media/
title: 作品
description: 影像与创作作品（节选）。
nav: true
nav_order: 4
lang: zh
translation_key: media
---

## 作品选集

### *普快列车 / Chinese Passenger*

- 实验短片（澳门大学硕士论文作品）
- 入围/展映：澳门国际电影节短片单元（2017）

**海报与剧照**

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
        alt="普快列车 / Chinese Passenger 海报"
        class="media-work__img media-work__img--poster"
        sizes="(min-width: 992px) 40vw, 95vw"
        loading="eager"
        zoomable=true
      %}
    {% endif %}
  </div>

  <div class="media-work__stills">
    <div class="media-work__still">
      {% if still1 %}{% include figure.liquid path="assets/img/media/chinese-passenger/still-1.jpg" alt="普快列车 剧照 1" class="media-work__img" sizes="(min-width: 992px) 26vw, (min-width: 576px) 45vw, 95vw" zoomable=true %}{% endif %}
    </div>
    <div class="media-work__still">
      {% if still2 %}{% include figure.liquid path="assets/img/media/chinese-passenger/still-2.jpg" alt="普快列车 剧照 2" class="media-work__img" sizes="(min-width: 992px) 26vw, (min-width: 576px) 45vw, 95vw" zoomable=true %}{% endif %}
    </div>
    <div class="media-work__still">
      {% if still3 %}{% include figure.liquid path="assets/img/media/chinese-passenger/still-3.jpg" alt="普快列车 剧照 3" class="media-work__img" sizes="(min-width: 992px) 26vw, (min-width: 576px) 45vw, 95vw" zoomable=true %}{% endif %}
    </div>
    <div class="media-work__still">
      {% if still4 %}{% include figure.liquid path="assets/img/media/chinese-passenger/still-4.jpg" alt="普快列车 剧照 4" class="media-work__img" sizes="(min-width: 992px) 26vw, (min-width: 576px) 45vw, 95vw" zoomable=true %}{% endif %}
    </div>
  </div>
</div>

### *异次元访谈室 / Interdimensional Interview Room*

- AI-native 的访谈型视频节目
- 样片可通过私密链接提供（下方为部分截图）

**截图（节选）**

{% assign iir1 = site.static_files | where: "path", "/assets/img/media/interdimensional-interview-room/still-1.jpg" | first %}
{% assign iir2 = site.static_files | where: "path", "/assets/img/media/interdimensional-interview-room/still-2.jpg" | first %}
{% assign iir3 = site.static_files | where: "path", "/assets/img/media/interdimensional-interview-room/still-3.jpg" | first %}
{% assign iir4 = site.static_files | where: "path", "/assets/img/media/interdimensional-interview-room/still-4.jpg" | first %}
{% assign iir5 = site.static_files | where: "path", "/assets/img/media/interdimensional-interview-room/still-5.jpg" | first %}
{% assign iir6 = site.static_files | where: "path", "/assets/img/media/interdimensional-interview-room/still-6.jpg" | first %}

<div class="media-gallery media-gallery--16x9">
  {% if iir1 %}{% include figure.liquid path="assets/img/media/interdimensional-interview-room/still-1.jpg" alt="异次元访谈室 截图 1" class="media-gallery__img" sizes="(min-width: 992px) 30vw, (min-width: 576px) 45vw, 95vw" zoomable=true %}{% endif %}
  {% if iir2 %}{% include figure.liquid path="assets/img/media/interdimensional-interview-room/still-2.jpg" alt="异次元访谈室 截图 2" class="media-gallery__img" sizes="(min-width: 992px) 30vw, (min-width: 576px) 45vw, 95vw" zoomable=true %}{% endif %}
  {% if iir3 %}{% include figure.liquid path="assets/img/media/interdimensional-interview-room/still-3.jpg" alt="异次元访谈室 截图 3" class="media-gallery__img" sizes="(min-width: 992px) 30vw, (min-width: 576px) 45vw, 95vw" zoomable=true %}{% endif %}
  {% if iir4 %}{% include figure.liquid path="assets/img/media/interdimensional-interview-room/still-4.jpg" alt="异次元访谈室 截图 4" class="media-gallery__img" sizes="(min-width: 992px) 30vw, (min-width: 576px) 45vw, 95vw" zoomable=true %}{% endif %}
  {% if iir5 %}{% include figure.liquid path="assets/img/media/interdimensional-interview-room/still-5.jpg" alt="异次元访谈室 截图 5" class="media-gallery__img" sizes="(min-width: 992px) 30vw, (min-width: 576px) 45vw, 95vw" zoomable=true %}{% endif %}
  {% if iir6 %}{% include figure.liquid path="assets/img/media/interdimensional-interview-room/still-6.jpg" alt="异次元访谈室 截图 6" class="media-gallery__img" sizes="(min-width: 992px) 30vw, (min-width: 576px) 45vw, 95vw" zoomable=true %}{% endif %}
</div>

{% assign sample = site.static_files | where: "path", "/assets/video/interdimensional-interview-room-sample.mp4" | first %}
{% if sample %}
<div style="max-width: 980px; margin: 0.5rem 0 0;">
  <video controls preload="metadata" style="width: 100%; border-radius: 14px;">
    <source src="{{ sample.path }}" type="video/mp4">
  </video>
</div>
{% endif %}

