(() => {
  const api = (window.GAME_SHOWCASE_API || location.origin).replace(/\/$/, '') + '/api/v1/games';
  const cards = [...document.querySelectorAll('[data-game-card], [data-video-id]')];
  const options = { credentials: 'same-origin' };
  function paint(card, total) {
    if (!Number.isSafeInteger(total) || total < 0) return;
    const value = card.querySelector('[data-work-activity]');
    value.textContent = total;
    value.parentElement.hidden = false;
  }
  const ready = fetch(api + '/activity', options).then(r => r.ok ? r.json() : null).catch(() => null);
  for (const card of cards) {
    const key = card.dataset.gameId || card.dataset.videoId;
    ready.then(x => paint(card, x?.activity?.[key]));
    let sent = false;
    async function record() {
      if (sent) return;
      sent = true;
      try {
        await ready;
        const r = await fetch(api + '/' + encodeURIComponent(key) + '/activity', {
          ...options, method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}', keepalive: true,
        });
        if (!r.ok) throw Error();
        paint(card, (await r.json()).total);
      } catch (_) { sent = false; }
    }
    if (card.dataset.videoId) {
      const video = card.querySelector('video');
      const watched = () => { if (video.currentTime >= 3 || video.ended) record(); };
      video.addEventListener('timeupdate', watched);
      video.addEventListener('ended', watched);
    } else {
      for (const link of card.querySelectorAll('.game-card__cover,.game-card__title a,.game-card__play')) {
        link.addEventListener('click', record);
        link.addEventListener('auxclick', e => { if (e.button === 1) record(); });
      }
    }
  }
})();
