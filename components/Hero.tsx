'use client'

export default function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-badge">Free · No account needed · Saves locally</div>
        <h1 className="hero-title">
          Teach your AI agent<br />what good design looks like.
        </h1>
        <p className="hero-sub">
          Design Taste is a skill builder for Claude Code and Codex. Answer a few
          questions, drop in references you admire, and export a{' '}
          <code className="hero-code">.skill</code> file your agent actually understands.
        </p>
        <div className="hero-actions">
          <button className="hero-cta" onClick={() => scrollTo('onboarding')}>
            Build your taste profile →
          </button>
          <button className="hero-ghost" onClick={() => scrollTo('export')}>
            See export format
          </button>
        </div>
        <div className="hero-steps">
          <div className="hero-step"><span>01</span>Answer 7 questions</div>
          <div className="hero-step-sep">·</div>
          <div className="hero-step"><span>02</span>Add design references</div>
          <div className="hero-step-sep">·</div>
          <div className="hero-step"><span>03</span>Export your <code className="hero-code">.skill</code></div>
        </div>
      </div>
    </section>
  )
}
