# Daily bilingual digest

The renewed digest covers useful AI tools, reproducible research and teaching technology. It publishes two independent language editions, each with approximately ten minutes of speech, a readable summary, primary-source links and a downloadable transcript. No autoplay or third-party audio player is required.

## Editorial and publication gates

`sources.yml` is an allowlist of technical primary sources, replacing general world/business news for the daily programme. Entries need a real timestamp within 48 hours, an allowlisted HTTPS link and substantive source evidence. Short feed descriptions trigger article-body retrieval. Pre-releases are excluded. The preceding seven published days are checked for duplicate URLs. Each edition needs 5–7 distinct stories from at least three sources; no source supplies more than two.

`policy.yml` applies English and Chinese exclusions to source evidence and generated text. A separate MiniMax call checks every factual claim, equivalence of translations and topic suitability against the captured evidence. A matching quotation alone is insufficient. Unknown IDs, invalid quotations, inadequate source health, insufficient copy, failed reviews, audio failures or recordings outside 8–12 minutes stop publication. A small tempo correction is allowed only within 15%; silence is never added to manufacture duration. The programme does not guarantee that automated screening can identify every sensitive implication. Inspect the private review and narrow the allowlist if an edge case appears.

## Local operation

```sh
bin/digest-daily collect
bin/digest-daily run
bin/digest-daily run --resume --publish
uv run --with feedparser --with pyyaml python -m unittest discover -s infra/digest -p 'test_*.py'
```

`run` without `--publish` prepares files locally. Publication commits only the current edition’s pages, public metadata, compressed audio and transcripts. It refuses an already populated Git staging area and only pushes `main`. A Git push is recorded as `pushed`, not as confirmed production deployment. The existing GitHub/Tencent deployment verification remains authoritative.

MiniMax credentials are read in process from macOS Keychain, account `picture-book-service`, services `minimax-token-plan-key` and optionally `minimax-tts-api-key`. Explicit environment alternatives are `MINIMAX_TOKEN_PLAN_KEY` and `MINIMAX_TTS_API_KEY`. Text uses the existing MiniMax M3 subscription endpoint. `DIGEST_MINIMAX_ENDPOINT` can point to a compatible local Anthropic relay. The default speech credential is the Token Plan; there is no silent metered fallback. Explicitly set `DIGEST_TTS_CREDENTIAL=tts` only to select the existing TTS account. Never put credentials in Git, public YAML, HTML, or logs. RSS/article requests use the existing local network proxy configured in `policy.yml`; GitHub API and MiniMax requests use their normal routes.

Private evidence, source-health reports, drafts, audits, segment caches and audio intermediates stay in `/Volumes/longssd/WorkData/ResearchData/zhaozhilong-digest/runs/YYYY-MM-DD/`. An actual mounted SSD is required. Public MP3 files use mono 64 kbps, around 5 MB for ten minutes. Raw synthesis is cached by text/model/voice hash so a retry reuses completed segments.

Speech is divided at sentence boundaries into short requests, with at most two requests in flight, to avoid long-request timeouts. Decimal numbers stay intact. A passed audit is reused only when the complete draft, selected evidence and policy hashes match; otherwise it is repeated. An actual failed audit allows at most one evidence-based correction per day, followed by the same validation and a fresh independent audit.

The original 36 text editions, YAML and 289 headline cards were backed up as `legacy-digest-before-restart-20261106.tar.gz` in the private SSD directory before retirement. Public legacy URLs now show a neutral archive notice, and their entries are excluded from the new index, RSS, weekly highlights and site search. The old `bin/digest draft/build` commands are disabled to prevent the unscreened feed configuration from being used inadvertently. Git history is retained.

## Scheduled delivery

After the implementation has reached `main`, run:

```sh
python3 infra/digest/install_scheduler.py
launchctl print gui/$(id -u)/com.longnewmini.zhaozhilong-digest
```

The job uses a dedicated checkout on the SSD, leaving the user’s working directory alone. It runs at 08:00 Shanghai time with a catch-up check every 30 minutes and at login. It skips completed days, prevents overlapping jobs and permits at most three attempts per day. A source/review failure leaves the last public edition in place. The Mac must be awake or wake later with the external disk, network and Keychain available; this is local automation, not an always-on server guarantee. Job logs are under `~/Library/Logs/zhaozhilong-digest/`; private `status.json` explains held editions. Stop the job with `launchctl bootout gui/$(id -u)/com.longnewmini.zhaozhilong-digest`.

The schedule is publishing to the existing GitHub-to-Tencent release flow; it does not access site accounts, comments, likes or the API database.
