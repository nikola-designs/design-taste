'use client'

import { useState, useRef } from 'react'
import { Reference } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

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

  const toggleTag = (t: string) =>
    setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const readImageFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = e => { setImageData(e.target?.result as string); setImageName(file.name) }
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

  const clearForm = () => {
    setUrl(''); setName(''); setNotes(''); setTags([]); setImageData(null); setImageName(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div>
      <div className="page-header">
        <h1>
          References {isTeam && <Badge className="bg-[#1a3a5c] text-[#7eb8d4] hover:bg-[#1a3a5c] font-mono text-[0.65rem] ml-2">● team</Badge>}
        </h1>
        <p>Share URLs or screenshots of designs that speak to you. Each one trains the agent&apos;s understanding of your taste.</p>
      </div>

      <div className="references-wrap">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">

              <div>
                <div className="field-label">URL</div>
                <Input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://linear.app" />
              </div>
              <div>
                <div className="field-label">Name / Label</div>
                <Input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Linear" />
              </div>

              <div className="col-span-2">
                <div className="field-label">Screenshot (optional)</div>
                <div
                  className={cn(
                    'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all bg-[var(--warm)]',
                    isDragOver ? 'border-[var(--accent-color)] bg-[var(--accent-dim)]' : 'border-[var(--border-color)]',
                    'hover:border-[var(--accent-color)] hover:bg-[var(--accent-dim)]'
                  )}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={e => {
                    e.preventDefault(); setIsDragOver(false)
                    const file = e.dataTransfer.files[0]
                    if (file?.type.startsWith('image/')) readImageFile(file)
                  }}
                >
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) readImageFile(f) }} />
                  {imageData ? (
                    <div>
                      <img src={imageData} alt="" className="max-h-[120px] rounded max-w-full mx-auto" />
                      <div className="text-xs text-muted-foreground mt-2">{imageName}</div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Click to upload</strong> or drag & drop<br />
                      PNG, JPG, WebP — any screenshot of UI you admire
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <div className="field-label">What draws you to this? What does it do right?</div>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="The spacing is exceptional. Every element feels considered..." />
              </div>

              <div className="col-span-2">
                <div className="field-label">Taste signals (select all that apply)</div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {TAG_OPTIONS.map(t => (
                    <Badge
                      key={t}
                      variant={tags.includes(t) ? 'default' : 'outline'}
                      className="cursor-pointer select-none rounded-full px-3 py-1 text-[0.8rem] font-normal"
                      onClick={() => toggleTag(t)}
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="col-span-2 flex gap-3">
                <Button onClick={handleAdd}>Add reference</Button>
                <Button variant="outline" onClick={clearForm}>Clear</Button>
              </div>

            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          {references.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🖼</div>
              <p>No references yet. Add a URL or screenshot of a design you admire to start building your taste profile.</p>
            </div>
          ) : (
            references.map(ref => {
              const imgSrc = ref.hasImage ? uploadedImages[ref.id] : null
              return (
                <Card key={ref.id}>
                  <CardContent className="pt-5 grid gap-4" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
                    {imgSrc ? (
                      <img className="w-14 h-14 rounded-md object-cover border border-[var(--border-color)]" src={imgSrc} alt="" />
                    ) : (
                      <div className="w-14 h-14 rounded-md bg-[var(--warm)] border border-[var(--border-color)] flex items-center justify-center text-2xl">
                        {ref.url ? '🔗' : '🖼'}
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <div className="font-medium text-sm">{ref.name}</div>
                      {ref.url && <div className="font-mono text-[0.7rem] text-muted-foreground">{ref.url}</div>}
                      {ref.notes && <div className="text-[0.8rem] text-muted-foreground italic">&ldquo;{ref.notes}&rdquo;</div>}
                      {ref.tags?.length > 0 && (
                        <div className="flex gap-1 flex-wrap mt-1">
                          {ref.tags.map(t => (
                            <Badge key={t} variant="secondary" className="rounded-full text-[0.7rem] font-normal">{t}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-7 w-7"
                      onClick={() => onRemove(ref.id)}>✕</Button>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
