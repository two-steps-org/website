---
title: "Handoff checklist for AI teams"
slug: handoff-checklist-for-ai-teams
publishedAt: 2026-09-18
excerpt: "A practical list we use before we call an engagement done — so client teams can run the system on day one."
draft: false
seoTitle: ""
seoDescription: ""
coverImage: "/blog/covers/handoff-checklist-for-ai-teams.svg"
author: "Two Steps"
tags: ["Handoff", "Delivery"]
---

We do not consider delivery complete when code merges. We consider it complete when your team can operate, extend, and explain the system without us in the room.

![Sand and ocean — handoff is when the system becomes yours](/blog/covers/handoff-checklist-for-ai-teams.svg)

## Documentation that gets used

- Architecture diagram with data flows and trust boundaries
- Runbook: deploy, rollback, rotate keys, common failures
- “When to call us” vs “fix it yourself” — explicit

## Access and ownership

- Repos, cloud projects, and API keys owned by the client org
- No hidden admin accounts or shared passwords
- Monitoring and alerts routed to client on-call, not ours

## Knowledge transfer

- Recorded walkthrough of operator UI and admin tasks
- Pair session on changing prompts, thresholds, or integrations
- List of known limitations — honest, dated, prioritized

If an item on this list is missing, the project is still open. That discipline keeps custom AI from becoming permanent vendor lock-in.
