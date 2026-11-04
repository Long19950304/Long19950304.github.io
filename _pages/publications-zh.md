---
layout: page
permalink: /zh/publications/
title: 论文
description: 已发表期刊论文、预印本与工作论文。
nav: true
nav_order: 2
lang: zh
translation_key: publications
---

{% include bib_search.liquid %}

<div class="publications">
<h2>已发表期刊论文</h2>

{% bibliography --query @article %}

<h2>预印本与工作论文</h2>

{% bibliography --query @misc %}
</div>

