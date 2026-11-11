(() => {
  const counter = document.querySelector('[data-site-views]');
  if (!counter || counter.dataset.started || !window.crypto?.getRandomValues) return;
  counter.dataset.started = 'true';

  const render = (data) => {
    if (!Number.isSafeInteger(data.total) || !Number.isSafeInteger(data.initial_base) ||
        !Number.isSafeInteger(data.observed) || data.initial_base < 0 || data.observed < 0 ||
        data.total !== data.initial_base + data.observed) return;
    const locale = counter.dataset.locale === 'zh' ? 'zh-CN' : 'en-US';
    counter.querySelector('[data-view-total]').textContent = data.total.toLocaleString(locale);
    counter.querySelector('[data-view-base]').textContent = data.initial_base.toLocaleString(locale);
    counter.querySelector('[data-view-base-note]').hidden = data.initial_base === 0;
    counter.hidden = false;
  };

  const record = async () => {
    const bytes = window.crypto.getRandomValues(new Uint8Array(16));
    const eventId = Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
    // One ID per document; a network retry cannot increment the same view twice.
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await fetch('/api/v1/site/views', {
          method: 'POST', credentials: 'same-origin', cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_id: eventId }),
        });
        if (!response.ok) throw new Error('View count unavailable');
        render(await response.json());
        return;
      } catch (_) { /* Retry with the same event ID. Hide unavailable counts. */ }
    }
  };

  if (document.visibilityState === 'hidden') {
    const visible = () => {
      if (document.visibilityState !== 'visible') return;
      document.removeEventListener('visibilitychange', visible);
      record();
    };
    document.addEventListener('visibilitychange', visible);
  } else {
    record();
  }
})();
