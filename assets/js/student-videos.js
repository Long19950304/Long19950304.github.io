// Keep the gallery comfortable to watch: starting one video pauses the others.
document.querySelectorAll('.student-videos video').forEach((video) => {
  video.addEventListener('play', () => {
    document.querySelectorAll('.student-videos video').forEach((other) => {
      if (other !== video) other.pause();
    });
  });
});

(function () {
  'use strict';
  const buttons = Array.from(document.querySelectorAll('[data-video-like]'));
  if (!buttons.length) return;
  const zh = document.querySelector('.student-videos[data-game-language="zh"]') !== null;
  const api = (window.GAME_SHOWCASE_API || window.location.origin).replace(/\/$/, '');
  function render(button, count, liked) {
    button.setAttribute('aria-pressed', String(liked));
    button.classList.toggle('is-liked', liked);
    button.firstChild.textContent = liked ? '♥ ' : '♡ ';
    button.querySelector('[data-like-count]').textContent = String(count);
  }
  buttons.forEach((button) => {
    button.disabled = true;
    button.addEventListener('click', async () => {
      const feedback = button.closest('[data-video-id]').querySelector('[data-like-feedback]');
      const liked = button.getAttribute('aria-pressed') !== 'true';
      feedback.hidden = true;
      button.disabled = true;
      try {
        const response = await fetch(api + '/api/v1/games/' + encodeURIComponent(button.dataset.gameId) + '/like', {
          method: liked ? 'POST' : 'DELETE', credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' }, body: '{}',
        });
        if (!response.ok) throw new Error('like_failed');
        const data = await response.json();
        render(button, data.likes, liked);
      } catch (_) {
        feedback.textContent = zh ? '点赞未保存，请重试。' : 'Like was not saved. Please try again.';
        feedback.hidden = false;
      } finally { button.disabled = false; }
    });
  });
  fetch(api + '/api/v1/games/likes', { credentials: 'same-origin' })
    .then((response) => { if (!response.ok) throw new Error('counts_failed'); return response.json(); })
    .then((data) => {
      const liked = new Set(data.liked || []);
      buttons.forEach((button) => render(button, data.likes[button.dataset.gameId] || 0, liked.has(button.dataset.gameId)));
    })
    .catch(() => { /* Keep the like action available for retry when counts cannot load. */ })
    .finally(() => buttons.forEach((button) => { button.disabled = false; }));
})();
