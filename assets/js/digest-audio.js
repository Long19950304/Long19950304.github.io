(() => {
  const panel = document.querySelector('.digest-listen');
  if (!panel) return;
  const recordings = [...panel.querySelectorAll('audio')];
  for (const recording of recordings) {
    recording.addEventListener('play', () => {
      for (const other of recordings) {
        if (other !== recording) other.pause();
      }
    });
    recording.addEventListener('error', () => {
      const message = recording.parentElement.querySelector('[data-audio-error]');
      if (message) message.hidden = false;
    });
  }
  for (const select of panel.querySelectorAll('[data-audio-speed]')) {
    select.addEventListener('change', () => {
      const recording = document.getElementById(select.dataset.audioSpeed);
      const rate = Number(select.value);
      if (recording && [0.85, 1, 1.25, 1.5].includes(rate)) recording.playbackRate = rate;
    });
  }
})();
