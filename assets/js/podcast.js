(() => {
  const attach = (root) => {
    const audio = root.querySelector("audio.podcast__audio");
    if (!audio) return;

    const src = audio.getAttribute("data-src") || "";
    if (!src) return;

    root.addEventListener("toggle", () => {
      if (!root.open) return;
      if (audio.getAttribute("src")) return;
      audio.setAttribute("src", src);
      audio.load();
    });
  };

  const init = () => {
    document.querySelectorAll("details.podcast").forEach(attach);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

