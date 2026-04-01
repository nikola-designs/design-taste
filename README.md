# design-taste

> A personal UI/UX taste profile builder for coding agents (Claude Code & OpenAI Codex).

Taste is something built through time, experience, and an eye for it — and it's different for everyone. This tool helps you teach your coding agent what *good design* means **to you specifically**, not to some generic style guide.

---

## What it does

You feed it references — URLs, screenshots, design inspirations. It extracts taste signals across eight dimensions and packages everything into a `.skill` file your agent loads on demand.

Once installed, your agent can:
- **Generate UI** that matches your taste
- **Critique designs** against your sensibility — and explain *why* something feels off
- **Suggest improvements** in taste terms, not generic rules
- **Add new references** and grow the profile over time

---

## Getting started

```bash
git clone https://github.com/your-org/design-taste
cd design-taste
open index.html   # or just double-click it
```

No build step. No dependencies. Pure HTML — runs locally in any browser.

---

## How the profile grows

Each reference you add **accumulates** into the profile — it never overwrites. Contradictions and tensions are preserved and named (e.g. *"you're drawn to both stark minimalism and warm texture"*). Real taste is never perfectly consistent.

---

## Profiles: Personal vs Team

| | Personal | Team |
|---|---|---|
| **Scope** | Your individual taste | Shared team sensibility |
| **Install location** | `~/.claude/skills/` | `.claude/skills/` in repo (commit to git) |
| **Who uses it** | You, across all projects | Everyone on the repo |

Both profiles are built in the same app — switch with the tab in the bottom-left corner.

---

## Installing the `.skill` file

### Claude Code
```bash
# Personal (all your projects)
cp design-taste-personal.skill ~/.claude/skills/

# Team (one repo, commit it)
cp design-taste-team.skill ./your-project/.claude/skills/
```

### OpenAI Codex
```bash
# Personal
cp design-taste-personal.skill ~/.codex/skills/

# Team
cp design-taste-team.skill ./your-project/.codex/skills/
```

The agent will pick it up automatically. No restart needed.

---

## The eight taste dimensions

The profile captures taste across eight dimensions — these are what the agent reads before any design work:

| Dimension | What it captures |
|---|---|
| **Density & Breathing Room** | How much lives on screen; how the design breathes |
| **Typography** | Weight, scale contrast, personality, type as voice |
| **Color Philosophy** | Neutral-dominant or expressive; contrast approach |
| **Motion & Interaction** | Snappy or fluid; functional or theatrical |
| **Visual Hierarchy** | How the eye is guided; what gets emphasis |
| **Component Character** | Sharp/soft, flat/layered, structured/organic |
| **Emotional Register** | The feeling the design gives off |
| **What It Avoids** | Taste is also refusal — what's actively rejected |

---

## Contributing your taste profile to the team

1. Open the app, switch to the **Team** profile tab
2. Add references and fill in the dimensions collaboratively
3. Export → **Download team.skill**
4. Commit to `.claude/skills/design-taste-team/` in your repo
5. Everyone on the team now has the same design sensibility loaded into their agent

---

## Philosophy

> Taste is not a style guide. It is not a color palette. It is a consistent way of seeing what is beautiful, what is clunky, what feels alive vs. dead.

The agent's job is not to apply generic rules. Its job is to see through your eyes.

---

## License

MIT
