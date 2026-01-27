(() => {
  if (!document.querySelector('.digest-page')) return;

  const lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
  const isZh = lang.startsWith('zh');

  const copyLabel = isZh ? '复制链接' : 'Copy links';
  const copiedLabel = isZh ? '已复制' : 'Copied';

  const collectLinks = (sectionId) => {
    const h = document.getElementById(sectionId);
    if (!h) return [];

    // In our layout, the list is the next <ol> after the header.
    let el = h.nextElementSibling;
    while (el && el.tagName !== 'OL') el = el.nextElementSibling;
    if (!el) return [];

    const items = Array.from(el.querySelectorAll('li'));
    const out = [];
    for (const li of items) {
      const a = li.querySelector('a[href]');
      if (!a) continue;
      const title = (a.textContent || '').trim();
      const url = a.getAttribute('href');
      if (!url) continue;
      out.push(`${title} — ${url}`);
    }
    return out;
  };

  const installButton = (sectionId) => {
    const h = document.getElementById(sectionId);
    if (!h) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-sm btn-outline-secondary digest-copy-btn';
    btn.textContent = copyLabel;

    btn.addEventListener('click', async () => {
      const lines = collectLinks(sectionId);
      if (!lines.length) return;
      try {
        await navigator.clipboard.writeText(lines.join('\n'));
        const old = btn.textContent;
        btn.textContent = copiedLabel;
        setTimeout(() => (btn.textContent = old), 1200);
      } catch {
        // no-op (clipboard blocked)
      }
    });

    h.insertAdjacentElement('afterend', btn);
  };

  installButton('top-news');
  installButton('top-ai');
})();

