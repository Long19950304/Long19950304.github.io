---
layout: page
title: Digest sources and editorial checks
description: Sources, topic boundaries and verification for the China and world economy, technology and research briefing.
permalink: /digest/sources/
lang: en
translation_key: digest-sources
nav: false
---

The briefing covers the Chinese economy, the world economy, and technology and research. Each edition contains 5–7 stories: 2–3 economic stories and at least 3 technology or research stories. Chinese and English recordings each provide a complete edition. Every edition needs at least three publishers, with at most two stories per publisher; channels from one newsroom are counted together. The list below defines the candidate sources; each edition links to the releases and reporting it actually uses.

Economic coverage prioritizes statistical agencies and central banks for original data, with reporting from Xinhua, China News Service, BBC, CBC, NPR, CNBC, the Guardian and DW for company, consumption and industry developments. Research coverage includes ScienceNet, the Chinese Academy of Sciences, NASA, MIT News, BBC Science and ScienceDaily, alongside maintainer releases and research blogs. Institutional announcements and media accounts of papers are attributed reporting, rather than independent replication; the narration states research stages and evidence limits. Community posts hosted by Hugging Face represent their authors, not platform certification or independent testing. Vendor performance claims are attributed to the vendor.

{% include digest-sources.liquid %}

## Selection and verification

1. **Sources, freshness and duplicate events.** Stories require an allowlisted domain, a publication timestamp and substantive evidence, from the preceding 48 hours on weekdays or 72 hours on weekends. Original publication dates remain visible. The preceding seven days, including yesterday, are checked for matching URLs and titles, followed by a separate MiniMax comparison of underlying events. A different publisher, headline, language or angle does not make an aired event new. Uncertain matches are excluded. Resumed drafts and final publication review also check past coverage; insufficient new stories delay publication. Economic stories require the article body. Headlines, short snippets, paywalls or failed downloads cannot substitute for evidence. Both domestic and international economic coverage must qualify; an overseas story published by a Chinese outlet does not count as domestic news.
2. **Whole-story exclusions.** Titles, source text and both language editions are screened for politics, elections, conflict, sanctions, military affairs and territorial or religious disputes, as well as commercial litigation and false-advertising allegations. A flagged or uncertain story is omitted entirely, rather than repackaged after removing sensitive sentences. An authoritative publisher does not automatically make a topic eligible.
3. **Facts and figures.** Supporting quotations must match the original evidence. Economic checks cover reference periods, currencies, units, annual versus monthly changes, preliminary versus revised data and Chinese/English numerical magnitude conversions. A market movement does not establish a causal explanation.
4. **Factual and bilingual review.** After drafting, a separate MiniMax request checks each story against its evidence for factual support, scope and translation equivalence. Every item must pass. A failed draft may receive one evidence-based correction, followed by another review.
5. **A separate publication review.** Another MiniMax request then reads the sources and the entire bilingual edition, including titles, summaries, opening and closing. It checks sensitive context, misleading economic claims and programme framing, returning approve, hold or reject for every story and for the programme. It receives no earlier review verdict. All decisions must approve before audio synthesis and page installation. Uncertainty, missing checks, malformed responses or API failures hold publication. Changes to copy, evidence, policy, reviewer configuration or the corresponding review prompt invalidate previous approval records.
6. **Traceable records.** Evidence, exclusion counts, drafts and both review reports are retained locally. A publication hold or rejection for unchanged material cannot be overwritten by automatic repeated requests; revised material or an explicit re-audit is required. Published editions link to the original releases or reporting and provide dates and transcripts. Economic coverage excludes stock recommendations, return promises and price forecasts.

These automated checks cannot guarantee error-free or risk-free coverage. Drafting, factual review and publication review currently use separate requests to the same MiniMax model; they are neither independent model providers nor a human editorial review. Errors can be checked against the linked evidence and corrected. Insufficient sources or failed checks delay publication; old news is not relabeled as fresh.

[Back to the digest](/digest/)
