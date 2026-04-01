'use client'

import { useState } from 'react'
import { Panel } from '@/lib/types'
import { useDesignTaste } from '@/lib/useDesignTaste'
import Sidebar from '@/components/Sidebar'
import OnboardingPanel from '@/components/OnboardingPanel'
import ReferencesPanel from '@/components/ReferencesPanel'
import TasteProfilePanel from '@/components/TasteProfilePanel'
import ExportPanel from '@/components/ExportPanel'
import StatusBar from '@/components/StatusBar'

export default function Home() {
  const [activePanel, setActivePanel] = useState<Panel>('onboarding')
  const {
    activeProfile,
    setActiveProfile,
    profile,
    toastMsg,
    toast,
    saveOnboarding,
    addReference,
    removeReference,
    saveDimensions,
    rebuildFromRefs,
    buildSkillMD,
    buildTasteProfileMD,
  } = useDesignTaste()

  const p = profile()
  const isTeam = activeProfile === 'team'

  return (
    <div className="shell">
      <Sidebar
        activePanel={activePanel}
        activeProfile={activeProfile}
        onPanel={setActivePanel}
        onProfile={setActiveProfile}
      />

      <main className="main">
        {activePanel === 'onboarding' && (
          <OnboardingPanel
            key={activeProfile}
            initial={p.onboarding}
            onSave={(ob) => {
              saveOnboarding(ob)
              setActivePanel('references')
            }}
            isTeam={isTeam}
          />
        )}

        {activePanel === 'references' && (
          <ReferencesPanel
            key={activeProfile}
            references={p.references}
            uploadedImages={p.uploadedImages}
            isTeam={isTeam}
            onAdd={addReference}
            onRemove={removeReference}
          />
        )}

        {activePanel === 'profile' && (
          <TasteProfilePanel
            key={`${activeProfile}-${JSON.stringify(p.dimensions)}`}
            dimensions={p.dimensions}
            isTeam={isTeam}
            onSave={saveDimensions}
            onRebuild={rebuildFromRefs}
          />
        )}

        {activePanel === 'export' && (
          <ExportPanel
            buildSkillMD={buildSkillMD}
            buildTasteProfileMD={buildTasteProfileMD}
            toast={toast}
          />
        )}
      </main>

      <StatusBar message={toastMsg} />
    </div>
  )
}
