# M87 — Restricted staging access and integrity audit (candidate)

M84–M86 Node/static jobs passed; local Chromium jobs pending at branch creation. M87 complements M27 by checking anonymous access before authenticated integrity. Only an explicitly authorized staging origin; no live endpoint is contacted by CI. No deployment or server changes.

On a trusted operator machine, from the exact checkout used to build the deployed private ZIP, set STAGING_AUTH_HEADER securely in the local environment, then run:

    npm run staging:restricted -- https://AUTHORIZED-PRIVATE-STAGING --authorized-private-staging

First checks every full static target and known source-only path anonymously, requiring HTTP 401/403/404/410; any public success, redirect, ambiguity or network failure stops before credentials are transmitted. Authenticated phase uses existing M27 full static byte and security-header checks, then tests additional source-only routes derived from review inventory plus package/tool/tracker/evidence paths. Denial probes cancel response bodies without reading them. Reports never include Authorization values or private response text. The current strict policy intentionally rejects public robots.txt or assets: a separate private staging document root is required. No automatic credential discovery.

Synthetic HTTP regression tests cover complete denial, credential ordering, source exposure, stale bytes, redirects, network failure and invalid inputs. Still requires authorized operator, actual HTTPS staging origin, backup/rollback, physical device checks and independent signoff. No real site tested, no public approval. FP-097 remains externally blocked; 70/100 unchanged. Exact-head CI pending.
