(() => {
  const lang = (document.documentElement.getAttribute("lang") || "en").toLowerCase();
  const t = (en, zh) => (lang.startsWith("zh") ? zh : en);

  const closeAll = (exceptKey) => {
    document.querySelectorAll("details.cite-share[open]").forEach((d) => {
      const key = d.getAttribute("data-cite-share-key") || "";
      if (exceptKey && key === exceptKey) return;
      d.removeAttribute("open");
    });
  };

  const textToClipboard = async (text) => {
    const safeText = String(text ?? "");
    try {
      await navigator.clipboard.writeText(safeText);
      return true;
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = safeText;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.top = "-1000px";
        textarea.style.left = "-1000px";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        return ok;
      } catch {
        return false;
      }
    }
  };

  const downloadText = (filename, text, mime) => {
    const blob = new Blob([String(text ?? "")], { type: mime || "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const normalizeBibtex = (bibtex) => String(bibtex ?? "").replace(/\r\n/g, "\n").trim() + "\n";
  const normalizeRIS = (ris) => String(ris ?? "").replace(/\r\n/g, "\n").trim() + "\n";
  const normalizeJSON = (obj) => JSON.stringify(obj ?? {}, null, 2).replace(/\r\n/g, "\n").trim() + "\n";

  const getPayload = (root) => {
    const script = root.querySelector("script.cite-share__data");
    if (!script) return null;
    try {
      return JSON.parse(script.textContent || "{}");
    } catch {
      return null;
    }
  };

  const flashSummary = (root, message) => {
    const summary = root.querySelector("summary.cite-share__summary");
    if (!summary) return;
    const original = summary.textContent;
    summary.textContent = message;
    window.setTimeout(() => {
      summary.textContent = original;
    }, 1100);
  };

  const attach = (root) => {
    const payload = getPayload(root);
    if (!payload) return;

    root.addEventListener("toggle", () => {
      const key = root.getAttribute("data-cite-share-key") || "";
      if (root.open) closeAll(key);
    });

    root.addEventListener("click", async (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const action = target.getAttribute("data-cite-share-action");
      if (!action) return;

      e.preventDefault();
      e.stopPropagation();

      const key = payload.key || "citation";
      const canonicalUrl = payload.canonical_url || payload.url || "";
      const citationPlain = payload.citation_plain || "";
      const bibtex = normalizeBibtex(payload.bibtex || "");
      const ris = normalizeRIS(payload.ris || "");
      const cslJson = normalizeJSON(payload.csl_json || {});
      const shareText = [citationPlain, canonicalUrl].filter(Boolean).join("\n");

      if (action === "copy_link") {
        const ok = await textToClipboard(canonicalUrl);
        flashSummary(root, ok ? t("Link copied", "已复制链接") : t("Copy failed", "复制失败"));
        return;
      }
      if (action === "copy_citation") {
        const ok = await textToClipboard(citationPlain);
        flashSummary(root, ok ? t("Citation copied", "已复制引用") : t("Copy failed", "复制失败"));
        return;
      }
      if (action === "copy_bibtex") {
        const ok = await textToClipboard(bibtex);
        flashSummary(root, ok ? t("BibTeX copied", "已复制 BibTeX") : t("Copy failed", "复制失败"));
        return;
      }
      if (action === "copy_ris") {
        const ok = await textToClipboard(ris);
        flashSummary(root, ok ? t("RIS copied", "已复制 RIS") : t("Copy failed", "复制失败"));
        return;
      }
      if (action === "copy_csl_json") {
        const ok = await textToClipboard(cslJson);
        flashSummary(root, ok ? t("CSL-JSON copied", "已复制 CSL-JSON") : t("Copy failed", "复制失败"));
        return;
      }
      if (action === "copy_share_text") {
        const ok = await textToClipboard(shareText);
        flashSummary(root, ok ? t("Share text copied", "已复制分享文案") : t("Copy failed", "复制失败"));
        return;
      }
      if (action === "download_bibtex") {
        downloadText(`${key}.bib`, bibtex, "application/x-bibtex;charset=utf-8");
        flashSummary(root, t("Downloading…", "正在下载…"));
        return;
      }
      if (action === "download_ris") {
        downloadText(`${key}.ris`, ris, "application/x-research-info-systems;charset=utf-8");
        flashSummary(root, t("Downloading…", "正在下载…"));
        return;
      }
      if (action === "download_csl_json") {
        downloadText(`${key}.csl.json`, cslJson, "application/vnd.citationstyles.csl+json;charset=utf-8");
        flashSummary(root, t("Downloading…", "正在下载…"));
        return;
      }
    });
  };

  const init = () => {
    document.querySelectorAll("details.cite-share").forEach(attach);
  };

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t instanceof Element && t.closest("details.cite-share")) return;
    closeAll();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
