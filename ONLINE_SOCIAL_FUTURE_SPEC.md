# Future online friends and chat — explicitly NOT deployed

The current shared-hosting build has **no online invitations, messaging, room servers, accounts, contact uploads, friends list, referral rewards or tracking**. Same-device co-op requires no remote player data.

## Why not launch now?

A private URL does not establish the age of a child, parental authorization or the identity of the friend; links can be forwarded. A simple 18+ checkbox is not reliable identity or age assurance. Children should not be able to access open text chat, stranger matchmaking, personal profiles, friend rankings or behavioral referral pressure before safeguarding and legal assessment.

## Proposed staged API, only after eligibility and governance

- Adult-only accounts (adequate age-assurance requirements to be reviewed) → short-lived anonymous game invitation → accepted invite → bounded asynchronous turn-based room → server-validated result → private individual/team history, no aptitude leaderboard.
- Child social features (if ever) require jurisdiction-specific consent and guardian controls, verified membership, block/report/leave, staff-supported incident handling, retention/deletion decisions, DPIA/child privacy analysis, accessibility, rate limiting, secure logging and human operational ownership.
- Predefined Quick Chat ID list only; server ignores arbitrary text; no images, voice, video, DM, links, contact-list syncing or location. Any text moderation cannot replace human incident response.
- Participation/achievement should reward genuinely completed missions, not invitation volume. No prize multiplier, paid advantage or academic score benefit from recruiting friends.
- Separate server security review: auth/session fixation, CSRF, SQLi, IDOR, guessing tokens, timing attacks, room authorization, replay attacks, double-spend of rewards, self-invites, abuse and rate limits. Enforce all checks on the server.
- MySQL/PHP can run low-frequency asynchronous turn-based sessions on shared hosting under measured rate and concurrency limits. Do not claim reliable WebSocket realtime chat on shared hosting.

**Release gate:** An accountable administrator and legal/child-safety reviewers must approve scope, consent/age assurance, reporting and incident response. There is no deployed system to audit yet.