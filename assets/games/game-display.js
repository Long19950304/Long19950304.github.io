(function () {
  'use strict';
  var game = document.documentElement.dataset.game;
  // Existing full-screen controls in these games remain the only controls.
  if (!['13', '17', '18', '25'].includes(game) && document.fullscreenEnabled) {
    var button = document.createElement('button');
    button.className = 'game-display-fullscreen';
    button.textContent = '⛶ 全屏';
    button.setAttribute('aria-label', '切换游戏全屏');
    button.addEventListener('click', function () {
      var action = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
      if (action && action.catch) action.catch(function () { button.textContent = '请使用浏览器全屏'; });
    });
    document.addEventListener('fullscreenchange', function () { button.textContent = document.fullscreenElement ? '⛶ 退出全屏' : '⛶ 全屏'; });
    document.body.appendChild(button);
  }
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
