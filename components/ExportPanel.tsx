'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface Props {
  buildSkillMD: () => string
  buildTasteProfileMD: () => string
}

async function loadJSZip() {
  const JSZip = (await import('jszip')).default
  return JSZip
}

export default function ExportPanel({ buildSkillMD, buildTasteProfileMD }: Props) {
  const [previewVisible, setPreviewVisible] = useState(false)

  const exportSkill = async () => {
    const JSZip = await loadJSZip()
    const zip = new JSZip()
    zip.file('SKILL.md', buildSkillMD())
    zip.file('references/taste-profile.md', buildTasteProfileMD())
    const blob = await zip.generateAsync({ type: 'blob' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'design-taste.skill'
    a.click()
    toast('design-taste.skill downloaded ✓')
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
              <div className="font-medium mb-1">Your design taste skill</div>
              <div className="text-sm text-muted-foreground leading-relaxed mb-3">
                Install globally so it&apos;s available across all your projects.
                Drop it at <code>~/.claude/skills/design-taste.skill</code>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button size="lg" onClick={exportSkill}>↓ Download design-taste.skill</Button>
                <Button size="lg" variant="outline" onClick={() => setPreviewVisible(v => !v)}>
                  {previewVisible ? 'Hide preview' : 'Preview'}
                </Button>
              </div>
              {previewVisible && (
                <div className="preview-box mt-3">{buildSkillMD()}</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <Card>
          <CardContent className="pt-8">
            <div className="font-medium mb-3 text-sm">Installing in Claude Code</div>
            <div className="font-mono text-[0.72rem] leading-loose text-muted-foreground">
              <span className="text-[var(--teal)]"># Global install — available in all projects</span><br />
              cp design-taste.skill ~/.claude/skills/<br /><br />
              <span className="text-[var(--teal)]"># Per-repo install — commit to git</span><br />
              cp design-taste.skill ./your-project/.claude/skills/
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
