---
layout: page
permalink: /teaching/games/
title: Modern Educational Technology · Game Showcase
description: Student-created learning games from the Modern Educational Technology course.
nav: false
lang: en
translation_key: teaching-games
---

<div class="game-showcase-page">
  <p class="lead">A playable showcase of 27 student-created learning games from <strong>Modern Educational Technology</strong>. Open a game, try it, and leave a like for the works you enjoy.</p>
  <p class="small game-showcase-note">The games are classroom prototypes. Some are designed for two players or touch screens.</p>

  <div class="game-showcase-toolbar" data-game-toolbar>
    <input class="game-showcase-search" type="search" placeholder="Search by title or student" aria-label="Search games" data-game-search>
    <select class="game-showcase-sort" aria-label="Sort games" data-game-sort>
      <option value="order">Class order</option>
      <option value="likes">Most liked</option>
      <option value="title">Title</option>
    </select>
  </div>

  <div class="game-showcase-grid" data-game-grid>
    {% for game in site.data.game_showcases.modern_education_technology %}
      <article class="game-card" data-game-card data-title="{{ game.title | escape }}" data-student="{{ game.student | escape }}" data-order="{{ game.order }}" data-game-id="{{ game.id }}">
        <div class="game-card__number">{{ game.order }}</div>
        <div class="game-card__body">
          <h2 class="game-card__title">{{ game.title }}</h2>
          <p class="game-card__student">{{ game.student }}</p>
          <div class="game-card__actions">
            <a class="btn btn-sm z-depth-0 game-card__play" href="{{ game.file | relative_url }}" target="_blank" rel="noopener">Play</a>
            <button class="btn btn-sm z-depth-0 game-like" type="button" data-like-button data-game-id="{{ game.id }}" aria-pressed="false">♡ <span data-like-count>Like</span></button>
          </div>
        </div>
      </article>
    {% endfor %}
  </div>
</div>

<script src="{{ '/assets/js/game-showcase.js' | relative_url | bust_file_cache }}"></script>
