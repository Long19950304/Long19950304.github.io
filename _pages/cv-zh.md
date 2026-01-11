---
layout: page
permalink: /zh/cv/
title: 简历
description: 简历与申请材料（按需提供）。
nav: false
lang: zh
translation_key: cv
---

## 简历

{% assign cv_pdf = site.static_files | where: "path", "/assets/pdf/cv.pdf" | first %}
{% if cv_pdf %}
<div class="cta-row">
  <a class="btn-cta" href="{{ cv_pdf.path }}"><i class="ti ti-download"></i> 下载简历（PDF）</a>
</div>
{% else %}
公开版本简历（PDF）可按需提供。

邮箱：<a href="mailto:yb87315@umac.mo">yb87315@umac.mo</a>
{% endif %}

