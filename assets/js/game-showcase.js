(function () {
  'use strict';

  var API = window.GAME_SHOWCASE_API || '';
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-game-card]'));
  var search = document.querySelector('[data-game-search]');
  var sort = document.querySelector('[data-game-sort]');

  function localKey(id) { return 'game-liked:' + id; }
  function isLiked(id) { return window.localStorage.getItem(localKey(id)) === '1'; }
  function setLiked(id, value) {
    if (value) window.localStorage.setItem(localKey(id), '1');
    else window.localStorage.removeItem(localKey(id));
  }
  function updateButton(button, count) {
    var id = button.getAttribute('data-game-id');
    var liked = isLiked(id);
    button.setAttribute('aria-pressed', liked ? 'true' : 'false');
    button.classList.toggle('is-liked', liked);
    button.querySelector('[data-like-count]').textContent = count == null ? (liked ? 'Liked' : 'Like') : String(count);
    button.firstChild.textContent = liked ? '♥ ' : '♡ ';
  }
  function renderOrder() {
    var term = (search && search.value || '').trim().toLowerCase();
    var mode = sort && sort.value || 'order';
    cards.sort(function (a, b) {
      if (mode === 'title') return a.dataset.title.localeCompare(b.dataset.title);
      if (mode === 'likes') return Number(b.dataset.likes || 0) - Number(a.dataset.likes || 0);
      return Number(a.dataset.order) - Number(b.dataset.order);
    }).forEach(function (card) {
      var hay = (card.dataset.title + ' ' + card.dataset.student).toLowerCase();
      card.hidden = term && hay.indexOf(term) === -1;
      card.parentNode.appendChild(card);
    });
  }
  function applyCounts(counts) {
    cards.forEach(function (card) {
      var id = card.dataset.gameId;
      var count = counts && counts[id];
      card.dataset.likes = count || 0;
      updateButton(card.querySelector('[data-like-button]'), count);
    });
    renderOrder();
  }
  function fetchCounts() {
    if (!API) { cards.forEach(function (card) { updateButton(card.querySelector('[data-like-button]')); }); return; }
    fetch(API.replace(/\/$/, '') + '/api/v1/games/likes')
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (data) { applyCounts(data.likes || {}); })
      .catch(function () { cards.forEach(function (card) { updateButton(card.querySelector('[data-like-button]')); }); });
  }
  cards.forEach(function (card) {
    var button = card.querySelector('[data-like-button]');
    button.addEventListener('click', function () {
      var id = card.dataset.gameId;
      var next = !isLiked(id);
      setLiked(id, next);
      updateButton(button, Number(card.dataset.likes || 0) + (next ? 1 : -1));
      card.dataset.likes = Math.max(0, Number(card.dataset.likes || 0) + (next ? 1 : -1));
      renderOrder();
      if (API) {
        fetch(API.replace(/\/$/, '') + '/api/v1/games/' + encodeURIComponent(id) + '/like', {
          method: next ? 'POST' : 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({})
        }).then(function (r) { if (!r.ok) throw new Error('like failed'); return r.json(); })
          .then(function (data) { card.dataset.likes = data.likes; updateButton(button, data.likes); })
          .catch(function () {});
      }
    });
    updateButton(button);
  });
  if (search) search.addEventListener('input', renderOrder);
  if (sort) sort.addEventListener('change', renderOrder);
  fetchCounts();
})();
