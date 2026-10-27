---
title: "Scoping before models"
slug: scoping-before-models
publishedAt: 2026-10-08
excerpt: "The expensive mistake is choosing a model before you know what decision the business is trying to make."
draft: false
seoTitle: ""
seoDescription: ""
coverImage: "/blog/covers/scoping-before-models.svg"
author: "Two Steps"
tags: ["Scope", "Strategy"]
---

Teams often arrive with a model name already picked. The harder — and more valuable — question is what changes in the operation if the system works.

## Start with the decision, not the stack

Write the outcome in one sentence: who acts, on what signal, with what authority. If you cannot name the owner of the decision, you are not ready to estimate cost or latency requirements.

## Map the real inputs

Most “AI” work is data plumbing and permissions. List every system that must be read or written, every approval step, and every place a human overrides the machine. That map is the scope document — not a slide deck of model benchmarks.

## When scope is tight enough

You should be able to answer yes to all three:

- A named operator can run it without calling you every week.
- Failure modes are documented — including when to stop automation.
- Success is measurable in business terms, not accuracy alone.

Scope done this way makes build estimates honest and keeps pilots from becoming permanent side projects.
