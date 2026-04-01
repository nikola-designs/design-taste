'use client'

import { useState, useRef } from 'react'
import { Reference } from '@/lib/types'

const TAG_OPTIONS = ['Minimal', 'Dense', 'Editorial', 'Dark', 'Light', 'Serif', 'Monospace', 'Motion-forward', 'Static', 'Warm', 'Cold', 'Luxury', 'Utility-first']

interface Props {
  references: Reference[]
  uploadedImages: Record<string, string>
  isTeam: boolean
  onAdd: (ref: Omit<Reference, 'id'>, imageData?: string) => void
  onRemove: (id: string) => void
}

export default function ReferencesPanel({ references, uploadedImages, isTeam, onAdd, onRemove }: Props) {
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [imageData, setImageData] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleTag = (t: string) => {
    setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  const readImageFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setImageData(e.target?.result as string)
      setImageName(file.name)
    }
    reader.readAsDataURL(file)
  }

  const handleAdd = () => {
    if (!url && !name && !notes && !imageData) return
    onAdd(
      { url: url.trim(), name: name.trim() || url.trim() || 'Reference', notes: notes.trim(), tags, hasImage: !!imageData },
      imageData ?? undefined
    )
    setUrl(''); setName(''); setNotes(''); setTags([]); setImageData(null); setImageName(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div>
      <div className="page-header">
        <h1>
          References {isTeam && <span className="team-badge">● team</span>}
        </h1>
        <p>Share URLs or screenshots of designs that speak to you. Each one trains the agent's understanding of your taste.</p>
      </div>

      <div className="references-wrap">
        <div className="add-ref-area">
          <div>
            <div className="field-label">URL</div>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://linear.app" />
          </div>
          <div>
            <div className="field-label">Name / Label</div>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Linear" />
          </div>

          <div className="full">
            <div className="field-label">Screenshot (optional)</div>
            <div
              className={`drop-zone${isDragOver ? ' dragover' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={e => {
                e.preventDefault()
                setIsDragOver(false)
                const file = e.dataTransfer.files[0]
                if (file?.type.startsWith('image/')) readImageFile(file)
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) readImageFile(f) }}
              />
              {imageData ? (
                <div>
                  <img src={imageData} alt="" style={{ maxHeight: 120, borderRadius: 4, maxWidth: '100%' }} />
                  <div className="drop-zone-text" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>{imageName}</div>
                </div>
              ) : (
                <div className="drop-zone-text">
                  <strong>Click to upload</strong> or drag & drop<br />
                  PNG, JPG, WebP — any screenshot of UI you admire
                </div>
              )}
            </div>
          </div>

          <div className="full">
            <div className="field-label">What draws you to this? What does it do right?</div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="The spacing is exceptional. Every element feels considered. Nothing is decorative for decoration's sake..."
            />
          </div>

          <div className="full">
            <div className="field-label">Taste signals (select all that apply)</div>
            <div className="chip-group">
              {TAG_OPTIONS.map(t => (
                <span key={t} className={`chip${tags.includes(t) ? ' selected' : ''}`} onClick={() => toggleTag(t)}>{t}</span>
              ))}
            </div>
          </div>

          <div className="full" style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={handleAdd}>Add reference</button>
            <button className="btn btn-ghost" onClick={() => {
              setUrl(''); setName(''); setNotes(''); setTags([]); setImageData(null); setImageName(null)
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}>Clear</button>
          </div>
        </div>

        <div className="refs-list">
          {references.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🖼</div>
              <p>No references yet. Add a URL or screenshot of a design you admire to start building your taste profile.</p>
            </div>
          ) : (
            references.map(ref => {
              const imgSrc = ref.hasImage ? uploadedImages[ref.id] : null
              return (
                <div key={ref.id} className="ref-card">
                  {imgSrc ? (
                    <img className="ref-thumb" src={imgSrc} alt="" />
                  ) : (
                    <div className="ref-thumb">{ref.url ? '🔗' : '🖼'}</div>
                  )}
                  <div className="ref-info">
                    <div className="ref-name">{ref.name}</div>
                    {ref.url && <div className="ref-url">{ref.url}</div>}
                    {ref.notes && <div className="ref-notes">"{ref.notes}"</div>}
                    {ref.tags?.length > 0 && (
                      <div className="ref-tags">
                        {ref.tags.map(t => <span key={t} className="ref-tag">{t}</span>)}
                      </div>
                    )}
                  </div>
                  <button className="ref-remove" onClick={() => onRemove(ref.id)} title="Remove">✕</button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
