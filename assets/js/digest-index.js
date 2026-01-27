	(() => {
	  const root = document.querySelector('[data-digest-index]');
	  if (!root) return;

	  const search = root.querySelector('[data-digest-search]');
	  const results = root.querySelector('[data-digest-results]');
	  const grid = root.querySelector('[data-digest-grid]');
	  const buttons = Array.from(root.querySelectorAll('[data-digest-filter]'));
	  const cards = Array.from(root.querySelectorAll('[data-digest-card]'));

	  let activeTag = 'all';
	  let itemsPromise = null;
	  let lastIssuedQuery = '';

	  const normalize = (s) => (s || '').toLowerCase().trim();
	  const isZh = document.documentElement.lang === 'zh' || window.location.pathname.startsWith('/zh/');

	  // Hide/show the *grid column*, not just the inner card; otherwise you end up with empty gaps.
	  const cardWrap = (card) => card.closest('[data-digest-col]') || card.parentElement || card;

	  const deriveTags = (category) => {
	    const cat = normalize(category);
	    const out = new Set();
	    if (!cat) return out;
	    if (cat.includes('ai tools')) out.add('ai-tools');
	    if (cat.includes('css') || cat.includes('society')) out.add('ai-society');
	    if (cat.includes('health')) out.add('health');
	    if (cat.includes('education')) out.add('education');
	    if (cat.includes('security') || cat.includes('cyber')) out.add('security');
	    if (cat.includes('business') || cat.includes('economy') || cat.includes('finance')) out.add('business');
	    if (cat.includes('tech')) out.add('tech');
	    return out;
	  };

	  const loadItems = () => {
	    if (!itemsPromise) {
	      itemsPromise = fetch('/assets/digest-items.json', { cache: 'force-cache' })
	        .then((r) => (r.ok ? r.json() : []))
	        .catch(() => []);
	    }
	    return itemsPromise;
	  };

	  const renderResults = async (q) => {
	    if (!results) return;
	    lastIssuedQuery = q;
	    const items = await loadItems();
	    // Drop stale renders if the user has typed again while the index was loading.
	    if (lastIssuedQuery !== q) return;

	    const matches = [];
	    for (const it of items) {
	      const tags = deriveTags(it.category);
	      const tagOk = activeTag === 'all' ? true : tags.has(activeTag);

	      const hay = normalize(
	        `${it.title || ''} ${it.title_zh || ''} ${it.source || ''} ${it.category || ''} ${it.date || ''}`
	      );
	      if (tagOk && hay.includes(q)) matches.push({ it, tags });
	      if (matches.length >= 30) break;
	    }

	    if (!q) {
	      results.hidden = true;
	      results.innerHTML = '';
	      return;
	    }

	    results.hidden = false;
	    results.innerHTML = '';

	    const header = document.createElement('div');
	    header.className = 'digest-search-results__header';
	    header.textContent = isZh
	      ? `搜索结果：${matches.length} 条（点击标题打开原文）`
	      : `Results: ${matches.length} items (click title to open source)`;
	    results.appendChild(header);

	    if (matches.length === 0) {
	      const empty = document.createElement('div');
	      empty.className = 'digest-search-results__empty';
	      empty.textContent = isZh ? '暂无匹配结果。' : 'No matches.';
	      results.appendChild(empty);
	      return;
	    }

	    const list = document.createElement('div');
	    list.className = 'digest-search-results__list';

	    for (const { it, tags } of matches) {
	      const row = document.createElement('div');
	      row.className = 'digest-search-results__item';

	      const title = (isZh && it.title_zh) ? it.title_zh : it.title;
	      const a = document.createElement('a');
	      a.className = 'digest-search-results__title';
	      a.href = it.url || it.digest_url || '#';
	      a.target = '_blank';
	      a.rel = 'noopener noreferrer';
	      a.textContent = title || (isZh ? '(无标题)' : '(untitled)');

	      const meta = document.createElement('div');
	      meta.className = 'digest-search-results__meta';
	      const metaParts = [];
	      if (it.date) metaParts.push(it.date);
	      if (it.source) metaParts.push(it.source);
	      if (it.category) metaParts.push(it.category);
	      meta.textContent = metaParts.join(' · ');

	      const actions = document.createElement('div');
	      actions.className = 'digest-search-results__actions';

	      const tagBadge = document.createElement('span');
	      tagBadge.className = 'digest-search-results__badge';
	      tagBadge.textContent = (it.kind === 'ai-tools') ? (isZh ? 'AI 工具' : 'AI tools') : (isZh ? '新闻' : 'News');
	      actions.appendChild(tagBadge);

	      const digestLink = document.createElement('a');
	      digestLink.className = 'digest-search-results__link';
	      digestLink.href = isZh ? it.digest_zh_url : it.digest_url;
	      digestLink.textContent = isZh ? '进入简报' : 'Open digest';
	      actions.appendChild(digestLink);

	      row.appendChild(a);
	      row.appendChild(meta);
	      row.appendChild(actions);
	      list.appendChild(row);
	    }

	    results.appendChild(list);
	  };

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

	    // When the user searches, show direct item results (news/tools), not digest cards.
	    if (results && grid) {
	      const showItems = q.length >= 1;
	      results.hidden = !showItems;
	      grid.style.display = showItems ? 'none' : '';
	      if (showItems) {
	        // Kick off async render.
	        renderResults(q);
	        return;
	      }
	      results.innerHTML = '';
	    }

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
