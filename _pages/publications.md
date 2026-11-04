---
layout: page
permalink: /publications/
title: Publications
description: Peer-reviewed articles, preprints, and working papers.
nav: true
nav_order: 2
lang: en
translation_key: publications
---

<!-- _pages/publications.md -->

<!-- Bibsearch Feature -->

{% include bib_search.liquid %}

<div class="publications">

<h2>Peer-reviewed Articles</h2>

{% bibliography --query @article %}

<h2>Preprints and Working Papers</h2>

{% bibliography --query @misc %}

</div>
