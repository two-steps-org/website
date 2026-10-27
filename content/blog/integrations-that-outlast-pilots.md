---
title: "Integrations that outlast pilots"
slug: integrations-that-outlast-pilots
publishedAt: 2026-10-03
excerpt: "Pilots die when they sit beside the ERP instead of inside it. Integration design is product design."
draft: false
seoTitle: ""
seoDescription: ""
coverImage: "/blog/covers/integrations-that-outlast-pilots.svg"
author: "Two Steps"
tags: ["Integrations", "Operations"]
---

A pilot that lives in a spreadsheet export is a rehearsal, not a system. Production means the same identity, audit trail, and rollback story as everything else in the stack.

![Moss and sand tones — integrations should feel native, not bolted on](/blog/covers/integrations-that-outlast-pilots.svg)

## Design for the Monday after launch

Operators do not care about embeddings; they care whether the ticket closes and the customer gets a correct answer. Integrations should:

- **Write back** to systems of record — not shadow databases that drift.
- **Respect roles** — the model should not see data the user cannot see in the UI.
- **Log decisions** — enough context to debug without replaying the entire chain.

## Prefer boring interfaces

Webhooks, queues, and idempotent workers beat clever real-time sync when volume spikes or vendors change APIs. Boring infrastructure survives reorganizations and vendor swaps.

## Handoff is part of integration

Runbooks, on-call boundaries, and a single dashboard beat a README no one opens. If your integration plan does not include who gets paged, it is incomplete.
