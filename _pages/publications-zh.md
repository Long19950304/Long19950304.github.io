---
layout: page
permalink: /zh/publications/
title: 论文
description: 已发表与已接收期刊论文、预印本、工作论文与会议论文。
nav: true
nav_order: 2
lang: zh
translation_key: publications
---

<nav class="publication-jumps" aria-label="成果分类"><a href="#upcoming">已接收／待刊</a> · <a href="#articles">期刊论文</a> · <a href="#preprints">预印本</a> · <a href="#chapters">章节与报告</a> · <a href="#conferences">会议</a></nav>

{% include bib_search.liquid %}

<div class="publications">
<section class="publication-group">
<h2 id="upcoming">已接收／待刊论文</h2>

{% bibliography --file accepted --group_by none --query @article %}

</section>
<section class="publication-group">
<h2 id="articles">已发表期刊论文</h2>

{% bibliography --query @article %}

</section>
<section class="publication-group">
<h2 id="preprints">预印本与工作论文</h2>

{% bibliography --query @misc %}

</section>
<section class="publication-group">
<h2 id="chapters">报告集章节与研究报告</h2>

{% bibliography --query @incollection %}
</section>
</div>

<section class="publication-group">
<h2 id="conferences">会议论文与报告</h2>

{% include conference_list.liquid %}

</section>
