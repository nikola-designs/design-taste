'use client'

import { useState } from 'react'
import { ProfileType } from '@/lib/types'

interface Props {
  buildSkillMD: (profileType: ProfileType) => string
  buildTasteProfileMD: (profileType: ProfileType) => string
  toast: (msg: string) => void
}

async function loadJSZip() {
  const JSZip = (await import('jszip')).default
  return JSZip
}

export default function ExportPanel({ buildSkillMD, buildTasteProfileMD, toast }: Props) {
  const [previewVisible, setPreviewVisible] = useState<Record<string, boolean>>({})

  const togglePreview = (key: string) => {
    setPreviewVisible(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const exportSkill = async (profileType: ProfileType) => {
    const JSZip = await loadJSZip()
    const zip = new JSZip()
    zip.file('SKILL.md', buildSkillMD(profileType))
    zip.file('references/taste-profile.md', buildTasteProfileMD(profileType))
    const blob = await zip.generateAsync({ type: 'blob' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `design-taste-${profileType}.skill`
    a.click()
    toast(`design-taste-${profileType}.skill downloaded ✓`)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Export Skill</h1>
        <p>Download your taste profile as a ready-to-install <code>.skill</code> file for Claude Code or Codex.</p>
      </div>

      <div className="export-wrap">
        <div className="export-option">
          <div className="export-icon">👤</div>
          <div className="export-details">
            <div className="export-title">Personal skill</div>
            <div className="export-desc">
              Your individual taste profile. Install globally at <code>~/.claude/skills/</code> so it&apos;s available across all your projects.
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => exportSkill('personal')}>↓ Download personal.skill</button>
              <button className="btn btn-ghost" onClick={() => togglePreview('personal')}>
                {previewVisible['personal'] ? 'Hide preview' : 'Preview'}
              </button>
            </div>
            {previewVisible['personal'] && (
              <div className="preview-box">{buildSkillMD('personal')}</div>
            )}
          </div>
        </div>

        <div className="export-option">
          <div className="export-icon">👥</div>
          <div className="export-details">
            <div className="export-title">Team skill <span className="team-badge">● team</span></div>
            <div className="export-desc">
              A shared taste profile for your whole team. Commit to your repo at <code>.claude/skills/design-taste/</code> so everyone inherits the same design sensibility.
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => exportSkill('team')}>↓ Download team.skill</button>
              <button className="btn btn-ghost" onClick={() => togglePreview('team')}>
                {previewVisible['team'] ? 'Hide preview' : 'Preview'}
              </button>
            </div>
            {previewVisible['team'] && (
              <div className="preview-box">{buildSkillMD('team')}</div>
            )}
          </div>
        </div>

        <div className="divider" />

        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: '1.25rem 1.5rem' }}>
          <div style={{ fontWeight: 500, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Installing in Claude Code</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', lineHeight: 2, color: 'var(--muted)' }}>
            <span style={{ color: 'var(--accent)' }}># Personal (global, all projects)</span><br />
            cp design-taste.skill ~/.claude/skills/<br /><br />
            <span style={{ color: 'var(--accent)' }}># Team (per repo, commit to git)</span><br />
            cp design-taste.skill ./your-project/.claude/skills/
          </div>
        </div>
      </div>
    </div>
  )
}
