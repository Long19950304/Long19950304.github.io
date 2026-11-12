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

{% include publication_navigation.liquid %}

{% include bib_search.liquid %}

<div class="publications">
<section class="publication-group">
<h2 id="upcoming">已接收／待刊论文</h2>

{% include accepted_publications.liquid %}

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
