import { highlightSearchTerm } from "./highlight-search-term.js";

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("bibsearch");
  if (!input) return;
  const selector = ".bibliography > li, .conference-papers > li";
  const items = [...document.querySelectorAll(selector)];
  const status = document.getElementById("bibsearch-status");
  const zh = document.documentElement.lang.startsWith("zh");

  function filterItems(value) {
    const term = value.trim().toLowerCase();
    document.querySelectorAll(".publication-group .unloaded").forEach(el => el.classList.remove("unloaded"));
    items.forEach(el => el.classList.toggle("unloaded", !el.innerText.toLowerCase().includes(term)));
    document.querySelectorAll("ol.bibliography").forEach(list => {
      const empty = !list.querySelector("li:not(.unloaded)");
      list.classList.toggle("unloaded", empty);
      if (list.previousElementSibling?.matches(".bibliography")) list.previousElementSibling.classList.toggle("unloaded", empty);
    });
    document.querySelectorAll(".publication-group").forEach(group => {
      const preserveEmpty = !term && group.querySelector('.publication-empty');
      group.classList.toggle("unloaded", !preserveEmpty && !group.querySelector("li:not(.unloaded)"));
    });
    if (CSS.highlights) highlightSearchTerm({ search: term, selector });
    const count = items.filter(el => !el.classList.contains("unloaded")).length;
    status.textContent = term ? (zh ? `找到 ${count} 条成果${count ? "" : "，请尝试其他关键词。"}` : `${count} results${count ? "" : ". Try another keyword."}`) : "";
  }

  let timeout;
  input.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => filterItems(input.value), 180);
  });
  document.querySelectorAll(".publication-jumps a").forEach(link => link.addEventListener("click", () => {
    clearTimeout(timeout);
    input.value = "";
    filterItems("");
  }));
  function readHash() {
    clearTimeout(timeout);
    let hash;
    try { hash = decodeURIComponent(location.hash.slice(1)); } catch (_) { hash = ""; }
    // Section and paper anchors are navigation; retain older search URLs for other hashes.
    input.value = hash && !document.getElementById(hash) ? hash : "";
    filterItems(input.value);
    if (hash && document.getElementById(hash)) requestAnimationFrame(() => document.getElementById(hash).scrollIntoView());
  }
  window.addEventListener("hashchange", readHash);
  readHash();
});
