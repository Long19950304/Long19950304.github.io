# Homepage Latest Updates

The English and Chinese homepages show up to four significant milestones from
`_data/site_updates.yml`, sorted by event date. Use confirmed public facts and
existing destination links, with both languages. Dates refer to the milestone
(for example, the acceptance letter date), not a later website edit. Future-dated
entries stay hidden until the next build on or after that date.

Add a short entry alongside important publication, project, teaching or media
updates. Routine source-code edits and private submission activity do not belong
in this public list. This is an editorial list; Git commits are not automatically
published as personal news.

The Daily Digest link separately selects the latest published `daily-audio`
edition from `_data/digests` at build time. Daily publication updates that one
link automatically, without filling the milestone list with daily news items.
No client-side polling or new service is needed. If there are no milestones or
published digests, the section is hidden.

## Recent Publications

The homepage also displays exactly the latest three available accepted/published
journal articles, automatically selected from `accepted.bib` and `papers.bib` by
`_plugins/recent-publications.rb`. Per the user's preference, English-language
articles (`language = {en}`) take priority. Entries marked `homepage = {false}`
are excluded from the homepage, while remaining on the full publications page;
the Macau Studies article is explicitly excluded.

Accepted work uses `accepted_date`; published work uses `final_publication_date`
when available (the final issue publication date), otherwise `publication_date`
or its known year. Within language priority, sort newest first. Keep citation
years unchanged. Preserve date precision: a known month such as 2026-08 never
becomes a fabricated day. Future dates are excluded.
Preprints and book chapters are not journal articles and do not enter this list.
When a paper is published, move it to `papers.bib`, remove the accepted status,
and record its actual final issue publication date when available. The next build updates the three
homepage entries automatically.

Date verification on 2026-11-10: Crossref records final print publication for
`10.1007/s10896-024-00796-8` as August 2026, and
`10.1080/10410236.2024.2387389` as 12 May 2025. First-online dates are preserved
as bibliographic history and are not used when a final date is known.
