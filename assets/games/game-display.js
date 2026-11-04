(function () {
  'use strict';
  var game = document.documentElement.dataset.game;
  var zh = new URLSearchParams(location.search).get('lang') !== 'en';
  var gallery = (zh ? '/zh' : '') + '/teaching/games/';
  var menu = document.createElement('details');
  menu.className = 'game-display-menu';
  var toggle = document.createElement('summary');
  toggle.textContent = zh ? '游戏菜单' : 'Game menu';
  var panel = document.createElement('div');
  panel.className = 'game-display-panel';
  var help = document.createElement('p');
  help.textContent = zh ? '操作方法见游戏内提示。' : 'Follow the instructions in the game.';
  panel.appendChild(help);
  function link(text, hash) {
    var a = document.createElement('a');
    a.textContent = text;
    a.href = gallery + hash;
    panel.appendChild(a);
  }
  link(zh ? '← 返回作品展' : '← Back to games', '#game-' + Number(game));
  link(zh ? '评论这个作品' : 'Comment on this game', '#comment-' + Number(game));
  // Keep the original full-screen control where the game already provides one.
  if (!['13', '17', '18', '25'].includes(game) && document.fullscreenEnabled) {
    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = zh ? '进入全屏' : 'Enter full screen';
    button.addEventListener('click', function () {
      var action = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
      if (action && action.catch) action.catch(function () { help.textContent = zh ? '请使用浏览器的全屏功能。' : 'Please use the browser full-screen option.'; });
      menu.open = false;
    });
    document.addEventListener('fullscreenchange', function () { button.textContent = document.fullscreenElement ? (zh ? '退出全屏' : 'Exit full screen') : (zh ? '进入全屏' : 'Enter full screen'); });
    panel.appendChild(button);
  }
  menu.append(toggle, panel);
  if (['05', '06'].includes(game)) {
    menu.classList.add('game-display-menu--inline');
    document.body.prepend(menu);
  } else document.body.appendChild(menu);
  // Menu gestures must not trigger document-level game controls.
  ['pointerdown', 'pointerup', 'click', 'touchstart', 'touchend', 'keydown', 'keyup'].forEach(function (type) {
    menu.addEventListener(type, function (event) { event.stopPropagation(); });
  });
  document.addEventListener('pointerdown', function (event) { if (!menu.contains(event.target)) menu.open = false; });
  menu.addEventListener('keydown', function (event) { if (event.key === 'Escape') { menu.open = false; toggle.focus(); } });
  fetch('/assets/games/catalog.json').then(function (response) { if (!response.ok) throw new Error('catalog'); return response.json(); }).then(function (items) {
    var item = items.find(function (entry) { return entry.order === Number(game); });
    if (item) help.textContent = zh ? item.controls : item.controls_en;
  }).catch(function () {});
  if (game === '07') {
    var wrap = document.getElementById('boardWrap');
    var board = document.getElementById('board');
    function fitBoard() {
      var width = parseFloat(board.style.width);
      if (width && wrap.clientWidth) board.style.zoom = Math.min(1, wrap.clientWidth / width);
    }
    new ResizeObserver(fitBoard).observe(wrap);
    new MutationObserver(fitBoard).observe(board, { childList: true });
    window.addEventListener('resize', fitBoard);
  }
})();
