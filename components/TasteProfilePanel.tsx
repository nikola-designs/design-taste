'use client'

import { useState } from 'react'
import { Dimensions, DIMENSION_META } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Props {
  dimensions: Dimensions
  isTeam: boolean
  onSave: (dims: Dimensions) => void
  onRebuild: () => void
}

/** Parse a comma-joined string → string[] */
const toArr = (val: string) =>
  val.split(',').map(s => s.trim()).filter(Boolean)

/** Toggle one chip in the comma-string and return the new string */
const toggleChip = (val: string, chip: string): string => {
  const arr = toArr(val)
  return arr.includes(chip)
    ? arr.filter(c => c !== chip).join(', ')
    : [...arr, chip].join(', ')
}

export default function TasteProfilePanel({ dimensions, isTeam, onSave, onRebuild }: Props) {
  const [dims, setDims] = useState<Dimensions>(dimensions)
  const [openKeys, setOpenKeys] = useState<Set<string>>(() => {
    // open all dimensions that already have values
    const s = new Set<string>()
    DIMENSION_META.forEach(dm => { if (dimensions[dm.key]?.trim()) s.add(dm.key) })
    return s
  })

  const toggle = (key: string) =>
    setOpenKeys(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  return (
    <div>
      <div className="page-header">
        <h1>
          Taste Profile
          {isTeam && (
            <Badge className="font-mono text-[0.62rem] ml-2 bg-[#1a3a5c] text-[#7eb8d4] border-0">
              ● team
            </Badge>
          )}
        </h1>
        <p>Select what resonates across each dimension. Your choices are exported as context for your AI agent.</p>
      </div>

      <div className="profile-wrap">

        <div className="flex flex-col gap-3">
          {DIMENSION_META.map(dm => {
            const val = dims[dm.key] || ''
            const selected = toArr(val)
            const count = selected.length
            const isOpen = openKeys.has(dm.key)

            return (
              <div
                key={dm.key}
                className="card bg-base-100 shadow-sm overflow-hidden"
              >
                {/* Row header — click to expand */}
                <div
                  className={cn(
                    'flex items-center justify-between px-5 py-4 cursor-pointer select-none transition-colors',
                    isOpen ? 'bg-base-200/60' : 'hover:bg-base-200/40'
                  )}
                  onClick={() => toggle(dm.key)}
                >
                  <div className="flex items-center gap-2.5 text-sm font-medium">
                    <span className="text-base leading-none opacity-70">{dm.icon}</span>
                    {dm.label}
                  </div>
                  <div className="flex items-center gap-2">
                    {count > 0 ? (
                      <span className="text-[0.68rem] font-semibold text-[var(--green)] bg-[var(--green-dim)] px-2 py-0.5 rounded-full">
                        ✓ {count} selected
                      </span>
                    ) : (
                      <span className="text-[0.68rem] text-base-content/40 font-medium">empty</span>
                    )}
                    <span className={cn(
                      'text-base-content/30 text-xs transition-transform duration-200',
                      isOpen ? 'rotate-180' : ''
                    )}>▾</span>
                  </div>
                </div>

                {/* Expanded chip grid */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-3">
                    <p className="text-xs text-base-content/50 mb-3">{dm.hint}</p>
                    <div className="flex flex-wrap gap-2">
                      {dm.chips.map(chip => {
                        const active = selected.includes(chip)
                        return (
                          <button
                            key={chip}
                            onClick={() =>
                              setDims(prev => ({
                                ...prev,
                                [dm.key]: toggleChip(prev[dm.key] || '', chip),
                              }))
                            }
                            className={cn(
                              'chip-btn',
                              active ? 'chip-btn-active' : 'chip-btn-idle'
                            )}
                          >
                            {chip}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex gap-3 mt-6">
          <Button size="lg" onClick={() => onSave(dims)}>Save profile</Button>
          <Button size="lg" variant="secondary" onClick={onRebuild}>↺ Rebuild from references</Button>
        </div>

      </div>
    </div>
  )
}
