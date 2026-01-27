(() => {
  const root = document.querySelector('[data-digest-index]');
  if (!root) return;

  const search = root.querySelector('[data-digest-search]');
  const buttons = Array.from(root.querySelectorAll('[data-digest-filter]'));
  const cards = Array.from(root.querySelectorAll('[data-digest-card]'));

  let activeTag = 'all';

  const normalize = (s) => (s || '').toLowerCase().trim();

  // Hide/show the *grid column*, not just the inner card; otherwise you end up with empty gaps.
  const cardWrap = (card) => card.closest('[data-digest-col]') || card.parentElement || card;

  const setActive = (tag) => {
    activeTag = tag;
    buttons.forEach((b) => {
      b.classList.toggle('active', b.dataset.digestFilter === tag);
      b.setAttribute('aria-pressed', b.dataset.digestFilter === tag ? 'true' : 'false');
    });
    apply();
  };

  const apply = () => {
    const q = normalize(search ? search.value : '');
    cards.forEach((card) => {
      const tags = normalize(card.dataset.tags || '');
      const title = normalize(card.dataset.title || '');
      const tagline = normalize(card.dataset.tagline || '');

      const tagOk = activeTag === 'all' ? true : tags.split(/\s+/).includes(activeTag);
      // Search also matches tags (so "ai", "health", "business" etc. work as expected).
      const qOk = !q ? true : (title.includes(q) || tagline.includes(q) || tags.includes(q));

      const wrap = cardWrap(card);
      wrap.style.display = tagOk && qOk ? '' : 'none';
    });
  };

  if (search) {
    search.addEventListener('input', apply);
  }

  buttons.forEach((b) => {
    b.addEventListener('click', () => setActive(b.dataset.digestFilter || 'all'));
  });

  // Default state.
  setActive('all');
})();
