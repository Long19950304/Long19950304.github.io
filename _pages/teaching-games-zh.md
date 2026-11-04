---
layout: page
permalink: /zh/teaching/games/
title: 现代教育技术 · 小游戏作品展
description: 现代教育技术课程学生小游戏作品展示。
nav: false
lang: zh
translation_key: teaching-games
---

<div class="game-showcase-page">
  <p class="lead">这里展示《现代教育技术》课程的 <strong>27 个学生小游戏作品</strong>。点击“试玩”打开游戏，也欢迎为喜欢的作品点一颗心。</p>
  <p class="small game-showcase-note">这些作品是课堂原型；部分游戏适合双人或触屏操作。</p>

  <div class="game-showcase-toolbar" data-game-toolbar>
    <input class="game-showcase-search" type="search" placeholder="按作品名或学生搜索" aria-label="搜索小游戏" data-game-search>
    <select class="game-showcase-sort" aria-label="排序方式" data-game-sort>
      <option value="order">按课堂序号</option>
      <option value="likes">按喜欢数</option>
      <option value="title">按作品名</option>
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
            <a class="btn btn-sm z-depth-0 game-card__play" href="{{ game.file | relative_url }}" target="_blank" rel="noopener">试玩</a>
            <button class="btn btn-sm z-depth-0 game-like" type="button" data-like-button data-game-id="{{ game.id }}" aria-pressed="false">♡ <span data-like-count>喜欢</span></button>
          </div>
        </div>
      </article>
    {% endfor %}
  </div>
</div>

<script src="{{ '/assets/js/game-showcase.js' | relative_url | bust_file_cache }}"></script>
