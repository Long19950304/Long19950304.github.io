# Personal Website — al-folio (GitHub Pages)

Bilingual academic website at https://www.zhaozhilong.com, built with Jekyll and al-folio.

Push to `main` to build and publish `gh-pages`. The existing Tencent Cloud server automatically pulls and verifies new static releases every two minutes. GitHub Actions also verifies that production reaches the expected source revision. Deployment setup, backups and troubleshooting: [infra/tencent-cloud/README.md](infra/tencent-cloud/README.md).

Commonly used scripts are served from `assets/vendor/`. Fonts use the original Google Fonts stylesheet to preserve the preferred appearance. Vendor sources and licenses are kept in `assets/vendor/`; ordinary pages do not load MathJax or Masonry unless their front matter opts in (`math: true`, `masonry: true`). Image zoom only loads when the rendered page contains zoomable images.

## What to edit first

- `_config.yml`: your title/description and site URL
- `_data/socials.yml`: your links (Google Scholar, ORCID, GitHub)
- `_pages/about.md`: homepage bio
- `_pages/research.md`: research + projects
- `_bibliography/papers.bib`: publications

## Profile photo

Replace the avatar image here:
- `assets/img/prof_pic.jpg`

Tip: use a square headshot.

## Course showcases and Tencent Cloud

The reusable student game showcase lives at `/teaching/games/` and `/zh/teaching/games/`. Published games are copied to `assets/games/`; the original local archive is ignored. The optional Tencent Cloud deployment files are in `infra/tencent-cloud/`, and the dependency-free likes API is in `server/api/`.

## Daily bilingual digest

The renewed digest covers practical technology and research, with separate Chinese and English audio editions of about ten minutes each. The local MiniMax pipeline, publication gates, SSD storage and 08:00 daily schedule are documented in [infra/digest/README.md](infra/digest/README.md). Use `bin/digest-daily`; `bin/digest` is the unscheduled legacy generator. The previous unscreened editions and headline cards have been moved to an offline SSD archive; their public URLs retain an archive notice.
