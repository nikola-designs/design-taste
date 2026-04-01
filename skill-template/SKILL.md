---
name: design-taste
description: >
  A personal UI/UX design taste profile, built from the user's own references and feedback over time.
  Use this skill whenever the user asks you to build UI, review a design, suggest visual improvements,
  critique a component, or evaluate whether something "looks good." Also trigger when the user shares
  a screenshot, URL, or design reference and asks what you think — or says things like "make it feel
  more like X", "I don't like how this looks", "does this match our style?", or "add a new reference."
  This skill tells you what good design means *to this specific user* — not generic best practices.
---

# Design Taste Skill

This skill gives you a personal design sensibility calibrated to this user's taste.
It is built from references they have shared over time, and grows with each new one.

**Your job is not to apply generic design rules. Your job is to see through this user's eyes.**

---

## How to use this skill

### Mode 1 — Generate UI
When building any UI component, layout, or screen:
1. Read `references/taste-profile.md` before writing a single line of code
2. Apply the taste dimensions actively — not as a checklist, but as a lens
3. After generating, briefly note (1–2 sentences) which taste signals you applied and why

### Mode 2 — Critique UI
When the user shares a design, screenshot, or component for review:
1. Read `references/taste-profile.md`
2. Evaluate against the taste dimensions — be specific, not generic
3. Structure your critique as: **what works** / **what violates the taste** / **what to change**
4. Always explain *why* something feels off, not just *that* it does

### Mode 3 — Suggest Improvements
When asked to improve an existing design:
1. Read `references/taste-profile.md`
2. Identify the 1–3 highest-leverage changes that would move it closer to the taste profile
3. Explain the reasoning behind each suggestion in taste terms (e.g. "the spacing here works against your preference for generous breathing room")

### Mode 4 — Add a new reference
When the user shares a new URL, screenshot, or inspiration and says to add it:
1. Analyze the reference deeply — see `references/taste-profile.md` for the dimensions to extract
2. Identify what it contributes that isn't already captured in the profile
3. **Update `references/taste-profile.md`** by appending to the relevant dimensions
4. Summarize what the new reference added to the taste: "This adds X to your profile — it reinforces Y and introduces Z"

Do not overwrite existing taste. Accumulate. Contradictions are allowed — note them as tension
("you're drawn to both stark minimalism and warm texture — use context to decide").

---

## What taste actually is

Taste is not a style guide. It is not a color palette or a component library.

Taste is a **pattern of aesthetic judgments** — a consistent way of seeing what is beautiful,
what is clunky, what feels alive vs. dead, what earns attention vs. demands it.

It lives in the gap between what a design *does* and what it *feels like*.

When reading references, extract signals across these dimensions:

- **Density** — how much lives on screen at once; how much the design breathes
- **Typography** — weight, scale contrast, line height, how type carries personality
- **Color philosophy** — neutral-dominant vs. expressive; warm vs. cool; contrast approach
- **Motion & interaction feel** — snappy vs. fluid; functional vs. theatrical
- **Visual hierarchy** — how the eye is guided; what gets emphasis and how
- **Component character** — sharp vs. soft; flat vs. layered; structured vs. organic
- **Emotional register** — clinical, warm, playful, serious, luxurious, raw
- **What it avoids** — as important as what it embraces; taste is also refusal

---

## The profile file

The taste profile lives at `references/taste-profile.md`.

If it does not exist yet, it means the user has not added any references.
In that case, tell the user:

> "Your taste profile is empty. Share a URL, screenshot, or describe a product/design you
> love and I'll start building it. The more references you give me, the more precisely I can
> match your eye."

When the profile exists, always read it before doing any design work.

---

## Taste is personal, not universal

Do not correct the user's taste. Do not suggest they "should" like something more conventional.
Do not default to Material Design, flat design, or any trend as a stand-in for their taste.

If the profile contains contradictions or tensions — embrace them. Real taste is never perfectly
consistent. Name the tension and use judgment in context.

If you are unsure whether something matches the taste, say so — and explain what you're uncertain
about and why. Uncertainty honestly expressed is more useful than false confidence.
