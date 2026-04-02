'use client'

import { useDesignTaste } from '@/lib/useDesignTaste'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import OnboardingPanel from '@/components/OnboardingPanel'
import ReferencesPanel from '@/components/ReferencesPanel'
import TasteProfilePanel from '@/components/TasteProfilePanel'
import ExportPanel from '@/components/ExportPanel'

export default function Home() {
  const {
    activeProfile,
    setActiveProfile,
    profile,
    saveOnboarding,
    addReference,
    removeReference,
    updateReferenceNotes,
    saveDimensions,
    rebuildFromRefs,
    buildSkillMD,
    buildTasteProfileMD,
  } = useDesignTaste()

  const p = profile()
  const isTeam = activeProfile === 'team'

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <>
      <Header activeProfile={activeProfile} onProfile={setActiveProfile} />

      <main className="site-main">

        <Hero />

        <section id="onboarding" className="page-section">
          <OnboardingPanel
            key={activeProfile}
            initial={p.onboarding}
            onSave={(ob) => {
              saveOnboarding(ob)
              setTimeout(() => scrollTo('references'), 80)
            }}
            isTeam={isTeam}
          />
        </section>

        <div className="section-divider" />

        <section id="references" className="page-section">
          <ReferencesPanel
            key={activeProfile}
            references={p.references}
            uploadedImages={p.uploadedImages}
            isTeam={isTeam}
            onAdd={addReference}
            onRemove={removeReference}
            onUpdateNotes={updateReferenceNotes}
          />
        </section>

        <div className="section-divider" />

        <section id="profile" className="page-section">
          <TasteProfilePanel
            key={`${activeProfile}-${JSON.stringify(p.dimensions)}`}
            dimensions={p.dimensions}
            isTeam={isTeam}
            onSave={saveDimensions}
            onRebuild={rebuildFromRefs}
          />
        </section>

        <div className="section-divider" />

        <section id="export" className="page-section">
          <ExportPanel
            buildSkillMD={buildSkillMD}
            buildTasteProfileMD={buildTasteProfileMD}
          />
        </section>

        <footer className="site-footer">
          <span>Design Taste · Skill Builder</span>
          <span>Saves locally · No account needed</span>
        </footer>

      </main>
    </>
  )
}
