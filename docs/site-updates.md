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
`_plugins/recent-publications.rb`. Accepted work uses `accepted_date`; published
work uses `publication_date` (first formal online publication, not a later print
issue year). Keep citation years unchanged. Legacy year-only records sort by
year without displaying an invented month or day. Future dates are excluded.
Preprints and book chapters are not journal articles and do not enter this list.
When a paper is published, move it to `papers.bib`, remove the accepted status,
and record its actual first publication date. The next build updates the three
homepage entries automatically.
