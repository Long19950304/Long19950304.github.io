(() => {
  const recordings = [...document.querySelectorAll('[data-digest-recording]')];
  let active = null;
  let request = 0;
  const clock = (seconds) => {
    const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
  };

  for (const panel of document.querySelectorAll('[data-digest-player]')) {
    const status = panel.querySelector('[data-digest-player-status]');
    const progress = panel.querySelector('[data-digest-progress]');
    const seek = panel.querySelector('[data-digest-seek]');
    const elapsed = panel.querySelector('[data-digest-elapsed]');
    const total = panel.querySelector('[data-digest-total]');
    let selected = null;

    const updateProgress = () => {
      if (!selected) return;
      const duration = selected.duration;
      seek.disabled = !Number.isFinite(duration) || duration <= 0;
      seek.value = seek.disabled ? '0' : String(Math.round((selected.currentTime / duration) * 1000));
      elapsed.textContent = clock(selected.currentTime);
      total.textContent = clock(duration);
      seek.setAttribute('aria-valuetext', `${clock(selected.currentTime)} / ${clock(duration)}`);
    };

    for (const button of panel.querySelectorAll('[data-digest-play]')) {
      const audio = document.getElementById(button.dataset.digestPlay);
      if (!audio) continue;
      const state = (value) => {
        button.dataset.state = value;
        button.setAttribute('aria-pressed', String(value === 'playing' || value === 'loading'));
        button.setAttribute('aria-busy', String(value === 'loading'));
        button.setAttribute('aria-label', value === 'playing' ? button.dataset.labelPause : value === 'loading' ? button.dataset.labelLoading : button.dataset.labelPlay);
      };
      const message = (name) => { status.textContent = status.dataset[name]; };
      const fail = () => {
        audio.pause();
        state('idle');
        if (selected === audio) message('error');
      };
      button.addEventListener('click', async () => {
        if (active === audio && (button.dataset.state === 'loading' || !audio.paused)) {
          request += 1;
          active = null;
          audio.pause();
          state('idle');
          message('paused');
          return;
        }
        active = null;
        for (const other of recordings) { if (other !== audio) other.pause(); }
        const currentRequest = ++request;
        active = audio;
        selected = audio;
        if (audio.ended) audio.currentTime = 0;
        progress.hidden = false;
        updateProgress();
        state('loading');
        message('loading');
        try {
          await audio.play();
          if (currentRequest !== request || active !== audio) {
            // A newer request for this same audio owns its state now.
            if (active !== audio) audio.pause();
            return;
          }
          state('playing');
          message('playing');
        } catch (_) {
          if (currentRequest === request && active === audio) { active = null; fail(); }
        }
      });
      audio.addEventListener('play', () => {
        if (active !== audio) { audio.pause(); return; }
        for (const other of recordings) { if (other !== audio) other.pause(); }
      });
      audio.addEventListener('playing', () => {
        if (active === audio) { state('playing'); message('playing'); }
      });
      audio.addEventListener('waiting', () => {
        if (active === audio && !audio.paused) { state('loading'); message('loading'); }
      });
      audio.addEventListener('pause', () => {
        if (active === audio) { active = null; request += 1; }
        state('idle');
        if (selected === audio) message(audio.ended ? 'ended' : 'paused');
      });
      audio.addEventListener('ended', () => {
        state('idle');
        if (active === audio) active = null;
        if (selected === audio) { updateProgress(); message('ended'); }
      });
      audio.addEventListener('error', () => {
        if (active === audio) { active = null; request += 1; }
        fail();
      });
      for (const event of ['timeupdate', 'loadedmetadata', 'durationchange']) {
        audio.addEventListener(event, () => { if (selected === audio) updateProgress(); });
      }
    }
    seek.addEventListener('input', () => {
      if (selected && Number.isFinite(selected.duration) && selected.duration > 0) {
        selected.currentTime = (Number(seek.value) / 1000) * selected.duration;
        updateProgress();
      }
    });
    panel.classList.add('is-enhanced');
  }
  window.addEventListener('pagehide', () => {
    request += 1;
    active = null;
    recordings.forEach((audio) => audio.pause());
  });
})();
