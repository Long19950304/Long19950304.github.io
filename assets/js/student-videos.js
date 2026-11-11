// Keep the gallery comfortable to watch: starting one video pauses the others.
document.querySelectorAll('.student-videos video').forEach((video) => {
  video.addEventListener('play', () => {
    document.querySelectorAll('.student-videos video').forEach((other) => {
      if (other !== video) other.pause();
    });
  });
});
