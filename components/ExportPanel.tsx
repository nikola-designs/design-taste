'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { ProfileType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface Props {
  buildSkillMD: (profileType: ProfileType) => string
  buildTasteProfileMD: (profileType: ProfileType) => string
}

async function loadJSZip() {
  const JSZip = (await import('jszip')).default
  return JSZip
}

export default function ExportPanel({ buildSkillMD, buildTasteProfileMD }: Props) {
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

        <Card className="mb-4">
          <CardContent className="pt-8 flex gap-5 items-start">
            <div className="text-2xl flex-shrink-0 mt-0.5">👤</div>
            <div className="flex-1">
              <div className="font-medium mb-1">Personal skill</div>
              <div className="text-sm text-muted-foreground leading-relaxed mb-3">
                Your individual taste profile. Install globally at <code>~/.claude/skills/</code> so it&apos;s available across all your projects.
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button size="lg" onClick={() => exportSkill('personal')}>↓ Download personal.skill</Button>
                <Button size="lg" variant="outline" onClick={() => togglePreview('personal')}>
                  {previewVisible['personal'] ? 'Hide preview' : 'Preview'}
                </Button>
              </div>
              {previewVisible['personal'] && (
                <div className="preview-box mt-3">{buildSkillMD('personal')}</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardContent className="pt-8 flex gap-5 items-start">
            <div className="text-2xl flex-shrink-0 mt-0.5">👥</div>
            <div className="flex-1">
              <div className="font-medium mb-1 flex items-center gap-2">
                Team skill
                <Badge className="bg-[#1a3a5c] text-[#7eb8d4] hover:bg-[#1a3a5c] font-mono text-[0.65rem]">● team</Badge>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed mb-3">
                A shared taste profile for your whole team. Commit to your repo at <code>.claude/skills/design-taste/</code> so everyone inherits the same design sensibility.
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button size="lg" onClick={() => exportSkill('team')}>↓ Download team.skill</Button>
                <Button size="lg" variant="outline" onClick={() => togglePreview('team')}>
                  {previewVisible['team'] ? 'Hide preview' : 'Preview'}
                </Button>
              </div>
              {previewVisible['team'] && (
                <div className="preview-box mt-3">{buildSkillMD('team')}</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <Card>
          <CardContent className="pt-8">
            <div className="font-medium mb-3 text-sm">Installing in Claude Code</div>
            <div className="font-mono text-[0.72rem] leading-loose text-muted-foreground">
              <span className="text-[var(--accent-color)]"># Personal (global, all projects)</span><br />
              cp design-taste.skill ~/.claude/skills/<br /><br />
              <span className="text-[var(--accent-color)]"># Team (per repo, commit to git)</span><br />
              cp design-taste.skill ./your-project/.claude/skills/
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
