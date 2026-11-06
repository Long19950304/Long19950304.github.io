# Daily bilingual digest

The renewed digest covers the Chinese and world economy, useful AI tools, reproducible research and teaching technology. It publishes two independent language editions, each with approximately ten minutes of speech, a readable summary, original-release/reporting links and a downloadable transcript. No autoplay or third-party audio player is required.

## Editorial and publication gates

`sources.yml` allowlists official statistical/central-bank releases, established economic newsrooms and technical primary sources. Entries need a real timestamp within 48 hours, an allowlisted HTTPS link and substantive source evidence. Economic stories always require the article body; short technical feed descriptions also trigger article retrieval. Pre-releases are excluded. The preceding seven published days are checked for duplicate URLs. Each edition needs 5–7 distinct stories from at least three sources; no source supplies more than two. Of those, 2–3 must be economic stories and at least three must be technology/research. A mainland-China economic story from a Chinese authoritative publisher and an international economic story from an international authoritative publisher are required. Publisher location cannot establish the story's actual geography; the model review checks that separately. Missing coverage holds publication.

The initial economic sources are China's National Bureau of Statistics and Xinhua Finance, BBC News Business, the U.S. Bureau of Economic Analysis and the European Central Bank. A configured source may be unavailable or have no eligible releases on a particular day. The public catalogue at `/digest/sources/` and `/zh/digest/sources/` records the last source check. Reuters, FT, IMF and other proposed sources are not advertised as integrated when their endpoints fail or full evidence is inaccessible. Paywalls and TLS verification are not bypassed. Technical community posts hosted on Hugging Face are attributed to their authors; platform hosting is not independent verification.

Chinese HTML news indexes are read through explicit article-path/domain and body-container allowlists, without executing page scripts. A URL date is only a discovery hint: the article must have its own publication metadata. Date-only metadata uses midnight in Shanghai conservatively, without fabricating a publication hour. Known article containers exclude unrelated navigation/footer topics; table cell separators preserve statistical units and values. There is no navigation-text fallback if the configured body is absent.

`policy.yml` applies English and Chinese exclusions to source evidence and generated text. A separate MiniMax call checks every factual claim, equivalence of translations and topic suitability against the captured evidence. A matching quotation alone is insufficient. Unknown IDs, invalid quotations, inadequate source health, insufficient copy, failed reviews, audio failures or recordings outside 8–12 minutes stop publication. A small tempo correction is allowed only within 15%; silence is never added to manufacture duration. The programme does not guarantee that automated screening can identify every sensitive implication. Inspect the private review and narrow the allowlist if an edge case appears.

Policy version 2 adds numerical checks for reference periods, currencies, units, Chinese 万/亿 versus English million/billion/trillion, annual/monthly comparisons, and preliminary/revised data. Financial reporting is a factual overview without stock recommendations, return promises or price predictions. A valid source balance is selected and checked before writing the long narration, then checked again on the final issue. The separate audit uses another request to the same MiniMax model; it is not a separate model provider or human editorial approval.

Policy version 3 adds a second, separate MiniMax publication review after factual review. It receives the source evidence and the entire bilingual issue, without the first review's verdict. Each story and the whole programme require explicit `approve` decisions and empty blocking-reason lists. `hold`, `reject`, omitted IDs, malformed responses and API errors stop the run before speech or page installation. A failed publication review is held for inspection, rather than automatically rewriting a sensitive story. Both the audio and installation functions require valid receipts for both stages, so a direct call cannot skip the gate. Receipts bind the complete issue, selected evidence, policy, resolved review endpoint/model and corresponding prompt; changes invalidate approvals. Reports remain private as `review.json` and `publication-review.json`, with timestamped review copies.

## Local operation

```sh
bin/digest-daily collect
bin/digest-daily run
bin/digest-daily run --resume --publish
bin/digest-daily review --run-name 2026-11-06-economy
uv run --with feedparser --with pyyaml python -m unittest discover -s infra/digest -p 'test_*.py'
```

`run` without `--publish` prepares files locally. Publication commits only the current edition’s pages, public metadata, compressed audio and transcripts. It refuses an already populated Git staging area and only pushes `main`. A Git push is recorded as `pushed`, not as confirmed production deployment. The existing GitHub/Tencent deployment verification remains authoritative.

`review` submits an existing private run to both review stages afresh and saves the reports; it does not collect stories, change the draft, synthesize speech or publish files. Omitting `--run-name` selects today's ordinary run. The suffixed example above is the revised 2026-11-06 edition with economic coverage.

A semantic `hold` or `reject` remains blocking for the same input: the scheduler cannot repeatedly ask until it gets a pass. Changing the material/policy/review specification or explicitly running `review` permits a new assessment. Technical/API failures may be retried within the existing daily retry budget.

MiniMax credentials are read in process from macOS Keychain, account `picture-book-service`, services `minimax-token-plan-key` and optionally `minimax-tts-api-key`. Explicit environment alternatives are `MINIMAX_TOKEN_PLAN_KEY` and `MINIMAX_TTS_API_KEY`. Text uses the existing MiniMax M3 subscription endpoint. `DIGEST_MINIMAX_ENDPOINT` can point to a compatible local Anthropic relay. The default speech credential is the Token Plan; there is no silent metered fallback. Explicitly set `DIGEST_TTS_CREDENTIAL=tts` only to select the existing TTS account. Never put credentials in Git, public YAML, HTML, or logs. RSS/article requests use the existing local network proxy configured in `policy.yml`; GitHub API and MiniMax requests use their normal routes.

Both review stages use the same existing Token Plan credential, with separate `review_model` and `review_endpoint` settings. Their runtime overrides are `DIGEST_MINIMAX_REVIEW_MODEL` and `DIGEST_MINIMAX_REVIEW_ENDPOINT`; a writing-only relay override does not silently redirect review credentials. The current review model is `MiniMax-M3`. No dedicated local MiniMax listener was found in the earlier inventory; the defaults call the official HTTPS API using the locally stored key. These are separate requests to the same model, not independent-provider or human judgments.

Private evidence, source-health reports, drafts, audits, segment caches and audio intermediates stay in `/Volumes/longssd/WorkData/ResearchData/zhaozhilong-digest/runs/YYYY-MM-DD/`. An actual mounted SSD is required. Public MP3 files use mono 64 kbps, around 5 MB for ten minutes. Raw synthesis is cached by text/model/voice hash so a retry reuses completed segments.

Speech is divided at sentence boundaries into short requests, with at most two requests in flight, to avoid long-request timeouts. Decimal numbers stay intact. A passed audit is reused only when the complete draft, selected evidence and policy hashes match; otherwise it is repeated. An actual failed audit allows at most one evidence-based correction per day, followed by the same validation and a fresh review request. Drafting and review use the same model; this is not independent-provider or human review.

On macOS, Python's verified TLS context also loads Homebrew's maintained public CA bundle when present, unless `SSL_CERT_FILE` was explicitly set. Hostname and certificate verification stay enabled. This avoids stale macOS certificate roots blocking the ECB feed under uv's Python.

The original 36 text editions, YAML and 289 headline cards were backed up as `legacy-digest-before-restart-20261106.tar.gz` in the private SSD directory before retirement. Public legacy URLs now show a neutral archive notice, and their entries are excluded from the new index, RSS, weekly highlights and site search. The old `bin/digest draft/build` commands are disabled to prevent the unscreened feed configuration from being used inadvertently. Git history is retained.

## Scheduled delivery

After the implementation has reached `main`, run:

```sh
python3 infra/digest/install_scheduler.py
launchctl print gui/$(id -u)/com.longnewmini.zhaozhilong-digest
```

The job uses a dedicated checkout on the SSD, leaving the user’s working directory alone. It runs at 08:00 Shanghai time with a catch-up check every 30 minutes and at login. It skips completed days, prevents overlapping jobs and permits at most three attempts per day. A source/review failure leaves the last public edition in place. The Mac must be awake or wake later with the external disk, network and Keychain available; this is local automation, not an always-on server guarantee. Job logs are under `~/Library/Logs/zhaozhilong-digest/`; private `status.json` explains held editions. Stop the job with `launchctl bootout gui/$(id -u)/com.longnewmini.zhaozhilong-digest`.

On macOS the background interpreter needs removable-volume access separately from the interactive Codex app. The installer uses the available Python executable. If macOS asks to let Python access a removable volume, the user must allow it in the system dialog. An `Operation not permitted` in the job log means installation alone is insufficient; verify a real background run exits 0 and reports `already published; skipped` before describing the schedule as operational. Do not weaken or bypass macOS privacy controls. Keychain access must also be available to the background process.

The schedule is publishing to the existing GitHub-to-Tencent release flow; it does not access site accounts, comments, likes or the API database.

## Index cards and playback

Both language indexes use `_includes/digest-index-card.liquid`: an original lightweight SVG cover, one edition date, actual top-three headlines and publisher names, with exact audio durations from public metadata. The cover is a reusable editorial illustration, not a photograph or a chart of actual market data. Cards automatically reflect future issues without daily image generation. The desktop layout places the cover beside the content; mobile uses a short cover above it.

`assets/js/digest-card-player.js` provides direct Chinese/English play and pause, seeking, loading/error/end states and mutually exclusive playback across all index cards. Audio uses `preload="none"` and never autoplays. Switching language, filtering out a card or leaving the page pauses playback; late play responses cannot restart a cancelled track. Without JavaScript the labeled native audio controls remain available. Full text and sources remain linked from the card. Run `node --test infra/digest/test_card_player.cjs` for the media-state checks.
