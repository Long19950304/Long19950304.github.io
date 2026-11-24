(() => {
  'use strict';
  const article = document.querySelector('[data-tech-article]');
  if (!article) return;
  const zh = article.dataset.techLang === 'zh';
  const say = (cn, en) => zh ? cn : en;
  const locale = zh ? 'zh-CN' : 'en-GB';
  const unavailable = say('互动功能暂时不可用，请稍后重试。', 'Interaction is temporarily unavailable. Please try again later.');
  const endpoint = slug => '/api/v1/tech-blog/' + encodeURIComponent(slug);

  async function request(path, method = 'GET', body) {
    const options = { method, credentials: 'same-origin', cache: 'no-store' };
    if (body !== undefined) {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(body);
    }
    const response = await fetch(path, options);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error);
      error.retry = data.retry_after || response.headers.get('Retry-After');
      error.code = response.status;
      throw error;
    }
    return data;
  }

  const base = endpoint(article.dataset.techSlug);
  const $ = selector => article.querySelector(selector);
  const form = $('[data-tech-form]');
  const submit = form.querySelector('button');
  const field = form.elements.text;
  const status = $('[data-tech-status]');
  const list = $('[data-tech-list]');
  const more = $('[data-tech-more]');
  let next = null;

  function errorText(error) {
    if (error.message === 'comment_not_approved') return say('这条留言未通过审核。请围绕教程讨论，并避免透露个人信息。', 'This comment did not pass review. Please keep it on topic and avoid sharing personal information.');
    if (error.code === 429) {
      const seconds = Number(error.retry);
      if (seconds > 0) return say('请等 ' + seconds + ' 秒再试。留言已保留在输入框。', 'Try again in ' + seconds + ' seconds. Your draft is still in the box.');
      return say('留言提交较频繁，请稍后重试。', 'Too many submissions. Please try again shortly.');
    }
    return unavailable;
  }

  function showEmpty() {
    status.textContent = list.children.length ? '' : say('还没有留言，欢迎分享你的问题。', 'No comments yet. Feel free to ask a question.');
  }

  function renderComment(item) {
    const entry = document.createElement('article');
    entry.className = 'tech-comment';
    const author = document.createElement('strong');
    author.textContent = say('匿名访客', 'Anonymous');
    const date = document.createElement('time');
    date.className = 'tech-meta';
    const at = new Date(item.created_at * 1000);
    date.dateTime = at.toISOString();
    date.textContent = at.toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' });
    const body = document.createElement('p');
    body.textContent = item.text;
    entry.append(author, date, body);
    if (item.own) {
      const remove = document.createElement('button');
      remove.className = 'tech-button';
      remove.type = 'button';
      remove.textContent = say('删除我的留言', 'Delete my comment');
      remove.addEventListener('click', async () => {
        remove.disabled = true;
        try {
          await request(base + '/comments/' + encodeURIComponent(item.id), 'DELETE');
          entry.remove();
          showEmpty();
        } catch (error) {
          remove.disabled = false;
          status.textContent = errorText(error);
        }
      });
      entry.append(remove);
    }
    return entry;
  }

  async function loadComments(append = false) {
    more.disabled = true;
    status.textContent = say('正在加载留言…', 'Loading comments…');
    try {
      const data = await request(base + '/comments' + (append && next ? '?before=' + encodeURIComponent(next) : ''));
      if (!append) list.replaceChildren();
      list.append(...data.comments.map(renderComment));
      next = data.next;
      more.hidden = !next;
      more.textContent = say('查看更早的留言', 'Load earlier comments');
      showEmpty();
    } catch (error) {
      status.textContent = errorText(error);
      more.hidden = false;
      more.textContent = say('重新加载留言', 'Reload comments');
    } finally { more.disabled = false; }
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const text = field.value.trim();
    if (!text) {
      status.textContent = say('请先填写留言。', 'Write a comment first.');
      field.focus();
      return;
    }
    submit.disabled = true;
    status.textContent = say('正在审核留言…', 'Reviewing your comment…');
    try {
      const data = await request(base + '/comments', 'POST', { text });
      field.value = '';
      list.prepend(renderComment(data.comment));
      status.textContent = say('留言已发布。', 'Your comment was posted.');
    } catch (error) { status.textContent = errorText(error); }
    finally { submit.disabled = false; }
  });

  more.addEventListener('click', () => loadComments(Boolean(next)));
  const copy = $('[data-tech-copy]');
  if (navigator.clipboard?.writeText) {
    copy.hidden = false;
    copy.addEventListener('click', async () => {
      const target = $('[data-tech-copy-status]');
      try {
        await navigator.clipboard.writeText($('[data-tech-prompt]').textContent.trim());
        target.textContent = say('已复制。', 'Copied.');
      } catch (_) { target.textContent = say('请选中文本后手动复制。', 'Select the prompt to copy it manually.'); }
    });
  }

  async function recordView() {
    if (!window.crypto?.getRandomValues) return;
    const id = Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('');
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await request(base + '/views', 'POST', { event_id: id });
        return;
      } catch (_) { /* Retrying uses the same event ID. */ }
    }
  }

  loadComments().then(() => { submit.disabled = false; });
  if (document.visibilityState === 'hidden') {
    const visible = () => {
      if (document.visibilityState !== 'visible') return;
      document.removeEventListener('visibilitychange', visible);
      recordView();
    };
    document.addEventListener('visibilitychange', visible);
  } else recordView();
})();
