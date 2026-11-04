---
layout: page
permalink: /teaching/games/
title: Modern Educational Technology · Game Showcase
description: Student-created learning games from the Modern Educational Technology course.
nav: false
lang: en
translation_key: teaching-games
---

<div class="game-showcase-page" data-game-language="en">
  <p class="lead">A playable showcase of 27 student-created learning games from <strong>Modern Educational Technology</strong>. Designed for <strong>primary and lower secondary school students</strong>. Play, leave a like, or share a comment anonymously or with your name.</p>
  <p class="small game-showcase-note">Real gameplay screenshots. Play directly in your browser; use a computer or landscape screen for games with a wide layout.</p>

  <div class="game-showcase-toolbar" data-game-toolbar>
    <input class="game-showcase-search" type="search" placeholder="Search title, game type or student" aria-label="Search games" data-game-search>
    <select class="game-showcase-mode" aria-label="Player mode" data-game-mode>
      <option value="all">All modes</option>
      <option value="single">Single player</option>
      <option value="multiplayer">Two or more players</option>
    </select>
    <select class="game-showcase-sort" aria-label="Sort games" data-game-sort>
      <option value="order">Class order</option>
      <option value="likes">Most liked</option>
      <option value="title">Title</option>
    </select>
  </div>

  {% include game-showcase-grid.liquid %}
</div>

<script src="{{ '/assets/js/game-showcase.js' | relative_url | bust_file_cache }}"></script>
