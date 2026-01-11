---
layout: page
permalink: /cv/
title: CV
description: Downloadable CV (optional) and application-ready materials.
nav: false
lang: en
translation_key: cv
---

## CV

{% assign cv_pdf = site.static_files | where: "path", "/assets/pdf/cv.pdf" | first %}
{% if cv_pdf %}
<div class="cta-row">
  <a class="btn-cta" href="{{ cv_pdf.path }}"><i class="ti ti-download"></i> Download CV (PDF)</a>
</div>
{% else %}
The public CV PDF is available upon request.

Email: <a href="mailto:yb87315@umac.mo">yb87315@umac.mo</a>
{% endif %}
