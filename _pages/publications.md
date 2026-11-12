---
layout: page
permalink: /publications/
title: Publications
description: Published and accepted journal articles, preprints, working papers, and conference papers.
nav: true
nav_order: 2
lang: en
translation_key: publications
---

<!-- _pages/publications.md -->

<!-- Bibsearch Feature -->

{% include publication_navigation.liquid %}

{% include bib_search.liquid %}

<div class="publications">

<section class="publication-group">
<h2 id="upcoming">Accepted / Upcoming Articles</h2>

{% include accepted_publications.liquid %}

</section>
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
