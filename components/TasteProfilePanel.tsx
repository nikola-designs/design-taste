'use client'

import { useState } from 'react'
import { Dimensions, DIMENSION_META } from '@/lib/types'

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

  // Sync when dimensions prop changes (e.g. after rebuild)
  const syncedDims = dims

  const toggleKey = (key: string) => {
    setOpenKeys(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const handleSave = () => {
    onSave(syncedDims)
  }

  return (
    <div>
      <div className="page-header">
        <h1>
          Taste Profile {isTeam && <span className="team-badge">● team</span>}
        </h1>
        <p>Your taste expressed across eight dimensions. Edit directly, or let it grow from your references.</p>
      </div>
      <div className="profile-wrap">
        <div>
          {DIMENSION_META.map(dm => {
            const val = syncedDims[dm.key] || ''
            const isFilled = val.trim().length > 0
            const isOpen = openKeys.has(dm.key)
            return (
              <div key={dm.key} className="dimension-card">
                <div className="dimension-head" onClick={() => toggleKey(dm.key)}>
                  <div className="dimension-title">
                    <span className="dimension-icon">{dm.icon}</span>
                    {dm.label}
                  </div>
                  {isFilled
                    ? <span className="dimension-filled">✓ filled</span>
                    : <span className="dimension-empty">empty</span>}
                </div>
                {isOpen && (
                  <div className="dimension-body">
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>{dm.hint}</div>
                    <textarea
                      value={val}
                      onChange={e => setDims(prev => ({ ...prev, [dm.key]: e.target.value }))}
                      placeholder="Describe your taste in this dimension..."
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button className="btn btn-primary" onClick={handleSave}>Save profile</button>
          <button className="btn btn-secondary" onClick={onRebuild}>↺ Rebuild from references</button>
        </div>
      </div>
    </div>
  )
}
