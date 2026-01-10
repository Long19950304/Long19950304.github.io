(() => {
  const getItems = (root) => Array.from(root.querySelectorAll("li.research-item"));

  const normalize = (s) => String(s ?? "").toLowerCase().trim();

  const matchesStage = (item, stage) => {
    if (!stage || stage === "all") return true;
    const itemStage = item.getAttribute("data-stage") || "";
    const hasPreprint = item.getAttribute("data-preprint") === "true";
    if (stage === "preprint") return hasPreprint;
    return itemStage === stage;
  };

  const matchesQuery = (item, q) => {
    if (!q) return true;
    const title = item.getAttribute("data-title") || "";
    const venue = item.getAttribute("data-venue") || "";
    const text = normalize(`${title} ${venue} ${item.textContent || ""}`);
    return text.includes(q);
  };

  const updateSectionVisibility = (root) => {
    // Hide <details> sections where all items are hidden.
    root.querySelectorAll("details").forEach((d) => {
      const items = Array.from(d.querySelectorAll("li.research-item"));
      if (items.length === 0) return;
      const anyVisible = items.some((li) => li.style.display !== "none");
      d.style.display = anyVisible ? "" : "none";
    });

    // Hide <ul> sections (expanded stages) where all items are hidden.
    root.querySelectorAll("ul").forEach((ul) => {
      const items = Array.from(ul.querySelectorAll(":scope > li.research-item"));
      if (items.length === 0) return;
      const anyVisible = items.some((li) => li.style.display !== "none");
      ul.style.display = anyVisible ? "" : "none";
    });
  };

  const attach = (root) => {
    const input = root.querySelector("[data-research-filter-input]");
    const count = root.querySelector("[data-research-filter-count]");
    const pills = Array.from(root.querySelectorAll("[data-research-filter-stage]"));

    if (!input || pills.length === 0) return;

    const portfolio = document.querySelector("[data-research-portfolio]");
    if (!portfolio) return;
    const items = getItems(portfolio);

    const state = {
      stage: "all",
      query: "",
    };

    const render = () => {
      const q = normalize(state.query);
      let visible = 0;
      items.forEach((li) => {
        const ok = matchesStage(li, state.stage) && matchesQuery(li, q);
        li.style.display = ok ? "" : "none";
        if (ok) visible += 1;
      });

      updateSectionVisibility(portfolio);

      if (count) {
        count.textContent = `${visible} / ${items.length}`;
      }
    };

    const setActivePill = () => {
      pills.forEach((b) => {
        const s = b.getAttribute("data-research-filter-stage") || "all";
        b.classList.toggle("is-active", s === state.stage);
      });
    };

    input.addEventListener("input", () => {
      state.query = input.value || "";
      render();
    });

    pills.forEach((b) => {
      b.addEventListener("click", () => {
        state.stage = b.getAttribute("data-research-filter-stage") || "all";
        setActivePill();
        render();
      });
    });

    setActivePill();
    render();
  };

  const init = () => {
    document.querySelectorAll("[data-research-filter]").forEach(attach);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
