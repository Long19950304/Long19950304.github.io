---
layout: page
permalink: /publications/
title: Publications
description: Peer-reviewed articles, preprints, working papers, and conference papers.
nav: true
nav_order: 2
lang: en
translation_key: publications
---

<!-- _pages/publications.md -->

<!-- Bibsearch Feature -->

<nav class="publication-jumps" aria-label="Publication sections"><a href="#articles">Articles</a> · <a href="#preprints">Preprints</a> · <a href="#chapters">Chapters and reports</a> · <a href="#conferences">Conferences</a></nav>

{% include bib_search.liquid %}

<div class="publications">

<section class="publication-group">
<h2 id="articles">Peer-reviewed Articles</h2>

{% bibliography --query @article %}

</section>
<section class="publication-group">
<h2 id="preprints">Preprints and Working Papers</h2>

{% bibliography --query @misc %}

</section>
<section class="publication-group">
<h2 id="chapters">Book Chapters and Research Reports</h2>

{% bibliography --query @incollection %}

</section>
</div>

<section class="publication-group">
<h2 id="conferences">Conference Papers and Presentations</h2>

{% include conference_list.liquid %}

</section>
