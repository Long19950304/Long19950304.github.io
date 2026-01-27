(() => {
  if (!document.querySelector('.digest-page')) return;

  const normalize = (s) => (s || '').toString().trim();
  const normalizeLower = (s) => normalize(s).toLowerCase();

  const parseUtc = (s) => {
    // Expected: YYYY-MM-DD HH:MM UTC
    const m = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})\s+UTC$/.exec(normalize(s));
    if (!m) return 0;
    const [_, y, mo, d, h, mi] = m;
    return Date.UTC(+y, +mo - 1, +d, +h, +mi);
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        return true;
      } catch {
        return false;
      }
    }
  };

  const initDetails = (details) => {
    const list = details.querySelector('[data-digest-full-list]');
    if (!list) return;

    const items = Array.from(details.querySelectorAll('.digest-full-item'));
    const search = details.querySelector('[data-digest-full-search]');
    const sort = details.querySelector('[data-digest-full-sort]');
    const filterCat = details.querySelector('[data-digest-full-filter=\"category\"]');
    const filterSrc = details.querySelector('[data-digest-full-filter=\"source\"]');

    const lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
    const isZh = lang.startsWith('zh');
    const allLabel = isZh ? '全部' : 'All';
    const catLabel = isZh ? '类别' : 'Category';
    const srcLabel = isZh ? '来源' : 'Source';

    const getVal = (el) => (el ? normalize(el.value) : '');

    const populate = (selectEl, label, values) => {
      if (!selectEl) return;
      const cur = selectEl.value;
      selectEl.innerHTML = '';
      const optAll = document.createElement('option');
      optAll.value = 'all';
      optAll.textContent = `${label}: ${allLabel}`;
      selectEl.appendChild(optAll);

      values.forEach((v) => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v;
        selectEl.appendChild(opt);
      });

      if (cur && Array.from(selectEl.options).some((o) => o.value === cur)) {
        selectEl.value = cur;
      } else {
        selectEl.value = 'all';
      }
    };

    const uniqueSorted = (arr) => {
      const uniq = Array.from(new Set(arr.filter(Boolean)));
      uniq.sort((a, b) => a.localeCompare(b));
      return uniq;
    };

    const cats = uniqueSorted(items.map((it) => normalize(it.dataset.category)));
    const srcs = uniqueSorted(items.map((it) => normalize(it.dataset.source)));
    populate(filterCat, catLabel, cats);
    populate(filterSrc, srcLabel, srcs);

    const apply = () => {
      const q = normalizeLower(search ? search.value : '');
      const cat = getVal(filterCat);
      const src = getVal(filterSrc);

      items.forEach((it) => {
        const t = normalizeLower(it.dataset.title);
        const u = normalizeLower(it.dataset.url);
        const c = normalize(it.dataset.category);
        const s = normalize(it.dataset.source);

        const qOk = !q || t.includes(q) || u.includes(q);
        const cOk = !cat || cat === 'all' || c === cat;
        const sOk = !src || src === 'all' || s === src;
        it.style.display = qOk && cOk && sOk ? '' : 'none';
      });
    };

    const doSort = () => {
      const mode = getVal(sort) || 'time';
      const visible = items.filter((it) => it.style.display !== 'none');
      visible.sort((a, b) => {
        if (mode === 'source') return normalize(a.dataset.source).localeCompare(normalize(b.dataset.source));
        if (mode === 'category') return normalize(a.dataset.category).localeCompare(normalize(b.dataset.category));
        // time desc
        return parseUtc(b.dataset.published) - parseUtc(a.dataset.published);
      });
      visible.forEach((it) => list.appendChild(it));
    };

    const applyAll = () => {
      apply();
      doSort();
    };

    if (search) search.addEventListener('input', applyAll);
    if (sort) sort.addEventListener('change', applyAll);
    if (filterCat) filterCat.addEventListener('change', applyAll);
    if (filterSrc) filterSrc.addEventListener('change', applyAll);

    // Copy link buttons
    details.addEventListener('click', async (e) => {
      const btn = e.target && e.target.closest ? e.target.closest('.digest-copy-row') : null;
      if (!btn) return;
      const url = btn.getAttribute('data-copy-url') || '';
      const title = btn.getAttribute('data-copy-title') || '';
      const text = title ? `${title} — ${url}` : url;
      const ok = await copyText(text);
      if (!ok) return;
      const old = btn.textContent;
      btn.textContent = isZh ? '已复制' : 'Copied';
      setTimeout(() => (btn.textContent = old), 900);
    });

    // Initial state
    applyAll();
  };

  document.querySelectorAll('[data-digest-full]').forEach(initDetails);
})();

