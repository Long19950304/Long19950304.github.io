---
layout: page
permalink: /zh/teaching/games/
title: 学习小游戏作品
description: 现代教育技术课程学生小游戏作品展示。
nav: false
lang: zh
translation_key: teaching-games
---

{% include teaching-navigation.liquid %}

<div class="game-showcase-page" data-game-language="zh">
  <p class="lead">这里展示《现代教育技术》课程的 <strong>27 个学生小游戏作品</strong>。面向<strong>小学或初中低年级学生</strong>设计，点击画面即可试玩。欢迎点赞，也可以匿名或署名评论。</p>
  <p class="small game-showcase-note">封面均为游戏内实景。支持浏览器直接游玩；双人作品可同屏体验，横向布局建议使用电脑或横屏。</p>

  <div class="game-showcase-toolbar" data-game-toolbar>
    <input class="game-showcase-search" type="search" placeholder="按游戏、玩法或学生搜索" aria-label="搜索小游戏" data-game-search>
    <select class="game-showcase-mode" aria-label="游玩人数" data-game-mode>
      <option value="all">全部玩法</option>
      <option value="single">单人游玩</option>
      <option value="multiplayer">双人或多人</option>
    </select>
    <select class="game-showcase-sort" aria-label="排序方式" data-game-sort>
      <option value="order">按课堂序号</option>
      <option value="likes">按喜欢数</option>
      <option value="title">按作品名</option>
    </select>
  </div>

  {% include game-showcase-grid.liquid %}
</div>

<script src="{{ '/assets/js/game-showcase.js' | relative_url | bust_file_cache }}"></script>
