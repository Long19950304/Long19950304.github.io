(function () {
  'use strict';
  var dialog = document.querySelector('[data-comments-dialog]');
  if (!dialog) return;
  var zh = document.querySelector('[data-game-language="zh"]') !== null;
  var api = (window.GAME_SHOWCASE_API || window.location.origin).replace(/\/$/, '');
  var form = dialog.querySelector('form');
  var list = dialog.querySelector('[data-comments-list]');
  var status = dialog.querySelector('[data-comments-status]');
  var more = dialog.querySelector('[data-comments-more]');
  var submit = form.querySelector('[type="submit"]');
  var name = form.elements.name;
  var text = form.elements.text;
  var active = null, next = null, generation = 0;

  function message(chinese, english) { return zh ? chinese : english; }
  function endpoint(id) { return api + '/api/v1/games/' + encodeURIComponent(id) + '/comments'; }
  async function request(url, options) {
    var response = await fetch(url, Object.assign({ credentials: 'same-origin' }, options || {}));
    var data = await response.json();
    if (!response.ok) {
      var error = new Error(data.error || 'request_failed');
      error.status = response.status;
      error.retryAfter = Number(data.retry_after || response.headers.get('Retry-After')) || 20;
      throw error;
    }
    return data;
  }
  function errorText(error) {
    if (error.status === 429) {
      var seconds = Math.max(1, Math.ceil(error.retryAfter));
      var wait = seconds < 60 ? message(seconds + ' 秒', seconds + ' seconds') : message(Math.ceil(seconds / 60) + ' 分钟', Math.ceil(seconds / 60) + ' minutes');
      return error.message === 'comment_hourly_limit'
        ? message('本小时评论较多，请约 ' + wait + '后再试。你输入的内容仍保留。', 'Hourly comment limit reached. Try again in about ' + wait + '. Your text has been kept.')
        : message('同一作品评论间隔较短，请等 ' + wait + '后再试。也可以先评论其他作品。', 'Please wait ' + wait + ' before commenting on this game again. You can comment on another game now.');
    }
    return message('暂时未能完成，请检查网络后重试。', 'Unable to complete this request. Please try again.');
  }
  function refreshCounts() {
    request(api + '/api/v1/games/comments').then(function (data) {
      document.querySelectorAll('[data-comments-open]').forEach(function (button) {
        button.querySelector('[data-comment-count]').textContent = data.comments[button.dataset.gameId] || 0;
      });
    }).catch(function () {});
  }
  function render(item, prepend) {
    var article = document.createElement('article');
    article.className = 'game-comment';
    var header = document.createElement('div');
    var author = document.createElement('strong');
    author.textContent = item.name || message('匿名访客', 'Anonymous');
    var date = document.createElement('time');
    var stamp = new Date(item.created_at * 1000);
    date.dateTime = stamp.toISOString();
    date.textContent = stamp.toLocaleString(zh ? 'zh-CN' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' });
    header.append(author, date);
    var body = document.createElement('p');
    body.textContent = item.text;
    article.append(header, body);
    if (item.own) {
      var remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = message('删除我的评论', 'Delete my comment');
      remove.addEventListener('click', async function () {
        var id = active;
        remove.disabled = true;
        try {
          await request(endpoint(id) + '/' + item.id, { method: 'DELETE' });
          if (active === id) {
            article.remove();
            status.textContent = message('已删除。', 'Comment deleted.');
          }
          refreshCounts();
        } catch (error) { status.textContent = errorText(error); remove.disabled = false; }
      });
      article.append(remove);
    }
    if (prepend) list.prepend(article); else list.append(article);
  }
  async function load(append) {
    var id = active, version = generation;
    more.disabled = true;
    status.textContent = message('正在加载评论…', 'Loading comments…');
    try {
      var data = await request(endpoint(id) + (append && next ? '?before=' + next : ''));
      if (version !== generation) return;
      if (!append) list.replaceChildren();
      data.comments.forEach(function (item) { render(item, false); });
      next = data.next;
      more.hidden = !next;
      more.textContent = message('查看更早评论', 'Load earlier comments');
      status.textContent = list.children.length ? '' : message('还没有评论，欢迎分享你的试玩感受。', 'No comments yet. Share your experience.');
    } catch (error) {
      if (version !== generation) return;
      status.textContent = errorText(error);
      more.hidden = false;
      more.textContent = message('重新加载', 'Try again');
    } finally { if (version === generation) more.disabled = false; }
  }
  function updateIdentity() {
    var named = form.elements.identity.value === 'named';
    dialog.querySelector('[data-comments-name-wrap]').hidden = !named;
    name.disabled = !named;
    name.required = named;
  }
  form.addEventListener('change', updateIdentity);
  document.querySelectorAll('[data-comments-open]').forEach(function (button) {
    button.addEventListener('click', function () {
      generation++;
      active = button.dataset.gameId;
      next = null;
      form.reset();
      updateIdentity();
      list.replaceChildren();
      more.hidden = true;
      dialog.querySelector('[data-comments-title]').textContent = button.dataset.gameTitle;
      dialog.showModal();
      load(false);
    });
  });
  dialog.querySelector('[data-comments-close]').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) { if (event.target === dialog) { var r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', function () { generation++; });
  more.addEventListener('click', function () { load(!!next); });
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (!text.value.trim() || (form.elements.identity.value === 'named' && !name.value.trim())) { form.reportValidity(); return; }
    var id = active, version = generation;
    submit.disabled = true;
    status.textContent = message('正在发布…', 'Posting…');
    try {
      var data = await request(endpoint(id), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.disabled ? '' : name.value.trim(), text: text.value.trim() }) });
      if (version === generation) {
        generation++;
        render(data.comment, true);
        text.value = '';
        await load(false);
        status.textContent = message('评论已发布，谢谢你的反馈。', 'Comment posted. Thank you for your feedback.');
      }
      refreshCounts();
    } catch (error) { if (version === generation) status.textContent = errorText(error); }
    finally { submit.disabled = false; }
  });
  function openLinkedComments() {
    var match = location.hash.match(/^#comment-(\d+)$/);
    if (!match) return;
    var card = document.getElementById('game-' + Number(match[1]));
    if (!card) return;
    card.scrollIntoView({ block: 'center' });
    card.querySelector('[data-comments-open]').click();
  }
  window.addEventListener('hashchange', openLinkedComments);
  openLinkedComments();
  refreshCounts();
})();
