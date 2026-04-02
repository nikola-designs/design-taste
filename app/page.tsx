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

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <>
      <Header />

      <main className="site-main">

        <Hero />

        <section id="onboarding" className="page-section">
          <OnboardingPanel
            initial={profile.onboarding}
            onSave={(ob) => {
              saveOnboarding(ob)
              setTimeout(() => scrollTo('references'), 80)
            }}
          />
        </section>

        <div className="section-divider" />

        <section id="references" className="page-section">
          <ReferencesPanel
            references={profile.references}
            uploadedImages={profile.uploadedImages}
            onAdd={addReference}
            onRemove={removeReference}
            onUpdateNotes={updateReferenceNotes}
          />
        </section>

        <div className="section-divider" />

        <section id="profile" className="page-section">
          <TasteProfilePanel
            key={JSON.stringify(profile.dimensions)}
            dimensions={profile.dimensions}
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
