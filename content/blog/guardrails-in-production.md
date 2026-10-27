---
title: "Guardrails in production"
slug: guardrails-in-production
publishedAt: 2026-09-26
excerpt: "Safety in AI products is not a policy PDF — it is routing, limits, and humans in the loop where it counts."
draft: false
seoTitle: ""
seoDescription: ""
coverImage: "/blog/covers/guardrails-in-production.svg"
author: "Two Steps"
tags: ["Safety", "Product"]
---

Guardrails are the parts of the system that stay on when the model is confident, uncertain, or wrong. They should be testable, versioned, and visible to operators.

## Layer your defenses

1. **Input** — PII rules, prompt injection patterns, size limits.
2. **Output** — schema validation, blocked topics, required citations for factual claims.
3. **Action** — no irreversible steps without confirmation; rate limits on external calls.

Each layer should fail in a way users understand — not a generic error page.

## Measure override rate

If humans override the model on more than a small fraction of cases, the automation is lying about readiness. Track overrides by category and feed that back into scope and training data — not into shame.

## Red team with real workflows

Synthetic jailbreak prompts are useful; so are the messy PDFs and edge-case tickets your team already handles. Test with production-shaped inputs, in staging that mirrors permissions.

Guardrails are not anti-innovation. They are what lets you ship without betting the brand on every token.
