---
layout: page
title: Digest sources and editorial checks
description: Sources, topic boundaries and verification for the China and world economy, technology and research briefing.
permalink: /digest/sources/
lang: en
translation_key: digest-sources
nav: false
---

The briefing covers the Chinese economy, the world economy, and technology and research. Each edition contains 5–7 stories: 2–3 economic stories and at least 3 technology or research stories. Chinese and English recordings each provide a complete edition. The list below defines the candidate sources; each edition links to the releases and reporting it actually uses.

Economic coverage prioritizes statistical agencies and central banks for original data, with reporting from Xinhua and BBC for company, consumption and industry developments. Technical sources include maintainer release notes, research blogs and developer articles. Community posts hosted by Hugging Face represent their authors, not platform certification or independent testing. Vendor performance claims are attributed to the vendor.

{% include digest-sources.liquid %}

## Selection and verification

1. **Source and freshness checks.** Stories require an allowlisted domain, a publication timestamp and substantive evidence, normally from the preceding 48 hours. Economic stories require the article body. Headlines, short snippets, paywalls or failed downloads cannot substitute for evidence. Both domestic and international economic coverage must qualify; an overseas story published by a Chinese outlet does not count as domestic news.
2. **Whole-story exclusions.** Titles, source text and both language editions are screened for politics, elections, conflict, sanctions, military affairs and territorial or religious disputes. A flagged or uncertain story is omitted entirely, rather than repackaged after removing sensitive sentences. An authoritative publisher does not automatically make a topic eligible.
3. **Facts and figures.** Supporting quotations must match the original evidence. Economic checks cover reference periods, currencies, units, annual versus monthly changes, preliminary versus revised data and Chinese/English numerical magnitude conversions. A market movement does not establish a causal explanation.
4. **A separate model review.** After drafting, a separate MiniMax request checks each story against its evidence for factual support, scope and translation equivalence. Every item must pass. A failed draft may receive one evidence-based correction, followed by another review. Failed editions are held.
5. **Traceable records.** Evidence, exclusion counts, drafts and reviews are retained locally. Published editions link to the original releases or reporting and provide dates and transcripts. Economic coverage excludes stock recommendations, return promises and price forecasts.

These automated checks cannot guarantee error-free or risk-free coverage. Drafting and review use separate requests to the same MiniMax model; they are neither independent model providers nor a human editorial review. Errors can be checked against the linked evidence and corrected. Insufficient sources or failed checks delay publication; old news is not relabeled as fresh.

[Back to the digest](/digest/)
