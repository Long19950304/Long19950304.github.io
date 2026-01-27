# Personal Website — al-folio (GitHub Pages)

This folder is a ready-to-publish **English** personal website using the **al-folio** academic theme.

Target URL (your GitHub username):
- https://www.zhaozhilong.com
- Deployment: GitHub Actions builds the site and publishes the prebuilt `_site/` output to `gh-pages` (includes `.nojekyll`).

## Publish (fastest)

1) Create a GitHub repository named exactly:
- `Long19950304.github.io`

2) Copy **everything inside** `personal-site/` to the root of that repository.

3) In GitHub, enable Pages:
- `Settings` → `Pages`
- Source: **Deploy from a branch**
- Branch: **gh-pages** / Folder: **/(root)**

4) Push to `main`. The included workflow `.github/workflows/deploy.yml` will build and publish the site to the `gh-pages` branch.

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
