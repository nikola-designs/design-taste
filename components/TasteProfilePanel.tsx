'use client'

import { useState } from 'react'
import { Dimensions, DIMENSION_META } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface Props {
  dimensions: Dimensions
  isTeam: boolean
  onSave: (dims: Dimensions) => void
  onRebuild: () => void
}

export default function TasteProfilePanel({ dimensions, isTeam, onSave, onRebuild }: Props) {
  const [dims, setDims] = useState<Dimensions>(dimensions)
  const [openKeys, setOpenKeys] = useState<Set<string>>(() => {
    const s = new Set<string>()
    DIMENSION_META.forEach(dm => { if (dimensions[dm.key]?.trim()) s.add(dm.key) })
    return s
  })

  const toggleKey = (key: string) => {
    setOpenKeys(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  return (
    <div>
      <div className="page-header">
        <h1>
          Taste Profile {isTeam && <Badge className="bg-[#1a3a5c] text-[#7eb8d4] hover:bg-[#1a3a5c] font-mono text-[0.65rem] ml-2">● team</Badge>}
        </h1>
        <p>Your taste expressed across eight dimensions. Edit directly, or let it grow from your references.</p>
      </div>
      <div className="profile-wrap">
        <div>
          {DIMENSION_META.map(dm => {
            const val = dims[dm.key] || ''
            const isFilled = val.trim().length > 0
            const isOpen = openKeys.has(dm.key)
            return (
              <Card key={dm.key} className="mb-3 overflow-hidden">
                <div
                  className={cn(
                    'flex items-center justify-between px-5 py-4 cursor-pointer transition-colors',
                    'hover:bg-[var(--warm)]'
                  )}
                  onClick={() => toggleKey(dm.key)}
                >
                  <div className="flex items-center gap-3 font-medium text-sm">
                    <span>{dm.icon}</span>
                    {dm.label}
                  </div>
                  {isFilled
                    ? <Badge variant="outline" className="font-mono text-[0.65rem] text-[var(--green)] bg-[var(--green-dim)] border-transparent">✓ filled</Badge>
                    : <span className="font-mono text-[0.65rem] text-muted-foreground">empty</span>}
                </div>
                {isOpen && (
                  <div className="px-5 pb-5">
                    <div className="text-xs text-muted-foreground mb-2">{dm.hint}</div>
                    <Textarea
                      value={val}
                      onChange={e => setDims(prev => ({ ...prev, [dm.key]: e.target.value }))}
                      placeholder="Describe your taste in this dimension..."
                      className="min-h-[70px]"
                    />
                  </div>
                )}
              </Card>
            )
          })}
        </div>
        <div className="flex gap-3 mt-6">
          <Button onClick={() => onSave(dims)}>Save profile</Button>
          <Button variant="secondary" onClick={onRebuild}>↺ Rebuild from references</Button>
        </div>
      </div>
    </div>
  )
}
