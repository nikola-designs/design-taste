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
  onUpdateNotes: (id: string, notes: string) => void
}

interface BatchItem {
  data: string
  name: string
  analysis: string       // AI-generated description
  analyzing: boolean     // in-flight
  error: boolean
}

async function analyzeImage(imageData: string, name: string): Promise<string> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageData, name }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Analysis failed')
  return json.description ?? ''
}

export default function ReferencesPanel({ references, uploadedImages, isTeam, onAdd, onRemove, onUpdateNotes }: Props) {
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [imageData, setImageData] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisFailed, setAnalysisFailed] = useState<string | null>(null)
  const [reanalyzing, setReanalyzing] = useState<string | null>(null)

  // Batch mode
  const [batchItems, setBatchItems] = useState<BatchItem[]>([])
  const [isAddingBatch, setIsAddingBatch] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleTag = (t: string) =>
    setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const readImageFile = (file: File): Promise<string> =>
    new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = e => resolve(e.target?.result as string)
      reader.readAsDataURL(file)
    })

  /** Analyze a single image file, populate notes */
  const handleSingleFile = async (file: File) => {
    const data = await readImageFile(file)
    setImageData(data)
    setImageName(file.name)
    setBatchItems([])
    setNotes('')
    setAnalysisFailed(null)
    setAnalyzing(true)
    try {
      const label = name || file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
      const description = await analyzeImage(data, label)
      setNotes(description)
    } catch (err) {
      setAnalysisFailed(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  /** Re-analyse an already-saved reference */
  const handleReanalyze = async (refId: string, imgSrc: string, refName: string) => {
    setReanalyzing(refId)
    try {
      const description = await analyzeImage(imgSrc, refName)
      onUpdateNotes(refId, description)
    } catch {
      // leave notes unchanged
    } finally {
      setReanalyzing(null)
    }
  }

  /** Load + analyze multiple files as batch items */
  const handleBatchFiles = async (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'))
    if (imageFiles.length === 0) return

    // Seed batch with placeholders immediately
    const placeholders: BatchItem[] = imageFiles.map(f => ({
      data: '',
      name: f.name,
      analysis: '',
      analyzing: true,
      error: false,
    }))
    setBatchItems(prev => [...prev, ...placeholders])

    // Read + analyze each file
    imageFiles.forEach(async (file, idx) => {
      const offset = batchItems.length + idx
      try {
        const data = await readImageFile(file)
        setBatchItems(prev => prev.map((it, i) => i === offset ? { ...it, data } : it))
        const label = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
        const analysis = await analyzeImage(data, label)
        setBatchItems(prev => prev.map((it, i) =>
          i === offset ? { ...it, analysis, analyzing: false } : it
        ))
      } catch {
        setBatchItems(prev => prev.map((it, i) =>
          i === offset ? { ...it, analyzing: false, error: true } : it
        ))
      }
    })
  }

  const handleFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (arr.length === 0) return

    if (arr.length === 1 && batchItems.length === 0) {
      await handleSingleFile(arr[0])
    } else {
      // Merge into batch (convert existing single image if needed)
      if (imageData && batchItems.length === 0) {
        const existingName = imageName || 'image'
        const label = existingName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
        setBatchItems([{
          data: imageData,
          name: existingName,
          analysis: notes,
          analyzing: false,
          error: false,
        }])
        setImageData(null)
        setImageName(null)
        setNotes('')
      }
      await handleBatchFiles(arr)
    }
  }

  const removeBatchItem = (idx: number) => {
    setBatchItems(prev => {
      const next = prev.filter((_, i) => i !== idx)
      if (next.length === 1 && !next[0].analyzing) {
        // Revert to single-file mode
        setImageData(next[0].data)
        setImageName(next[0].name)
        setNotes(next[0].analysis)
        return []
      }
      return next
    })
  }

  const handleAddBatch = async () => {
    if (batchItems.length === 0) return
    setIsAddingBatch(true)
    for (const item of batchItems) {
      if (!item.data) continue
      const label = item.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
      onAdd(
        { url: '', name: label, notes: item.analysis, tags: [], hasImage: true },
        item.data
      )
      await new Promise(r => setTimeout(r, 5))
    }
    setBatchItems([])
    setIsAddingBatch(false)
  }

  const handleAdd = () => {
    if (!url && !name && !notes && !imageData) return
    onAdd(
      { url: url.trim(), name: name.trim() || url.trim() || 'Reference', notes: notes.trim(), tags, hasImage: !!imageData },
      imageData ?? undefined
    )
    setUrl(''); setName(''); setNotes(''); setTags([])
    setImageData(null); setImageName(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const clearForm = () => {
    setUrl(''); setName(''); setNotes(''); setTags([])
    setImageData(null); setImageName(null)
    setBatchItems([])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const isBatchMode = batchItems.length >= 2
  const batchStillAnalyzing = batchItems.some(it => it.analyzing)

  return (
    <div>
      <div className="page-header">
        <h1>
          References {isTeam && <Badge className="bg-[#1a3a5c] text-[#7eb8d4] hover:bg-[#1a3a5c] font-mono text-[0.65rem] ml-2">● team</Badge>}
        </h1>
        <p>Upload screenshots of UI you admire. Each image is automatically analysed for design signals that train your agent.</p>
      </div>

      <div className="references-wrap">
        <Card className="mb-8">
          <CardContent className="pt-8">
            <div className="grid grid-cols-2 gap-4">

              {/* Single-file form fields */}
              {!isBatchMode && (
                <>
                  <div>
                    <div className="field-label">URL</div>
                    <Input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://linear.app" />
                  </div>
                  <div>
                    <div className="field-label">Name / Label</div>
                    <Input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Linear" />
                  </div>
                </>
              )}

              {/* Upload zone */}
              <div className="col-span-2">
                <div className="field-label">
                  {isBatchMode
                    ? `Screenshots — ${batchItems.length} queued`
                    : 'Screenshot (optional)'}
                </div>

                {isBatchMode ? (
                  <div>
                    <div className="batch-grid">
                      {batchItems.map((item, idx) => (
                        <div key={idx} className="batch-thumb">
                          {item.data ? (
                            <img src={item.data} alt="" className="batch-thumb-img" />
                          ) : (
                            <div className="batch-thumb-img flex items-center justify-center bg-[var(--warm)] text-[var(--muted-color)] text-xs">
                              Loading…
                            </div>
                          )}
                          <div className="batch-thumb-footer">
                            <div className="batch-thumb-name">
                              {item.name.replace(/\.[^.]+$/, '')}
                            </div>
                            {item.analyzing ? (
                              <div className="batch-thumb-status analyzing">✦ Analysing…</div>
                            ) : item.error ? (
                              <div className="batch-thumb-status error">⚠ No analysis</div>
                            ) : item.analysis ? (
                              <div className="batch-thumb-status done">✓ Analysed</div>
                            ) : null}
                          </div>
                          <button
                            className="batch-thumb-remove"
                            onClick={() => removeBatchItem(idx)}
                            title="Remove"
                          >✕</button>
                        </div>
                      ))}
                      {/* Add more tile */}
                      <div
                        className="batch-add-more"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <span className="text-2xl text-[var(--muted-color)]">+</span>
                        <span className="text-xs text-[var(--muted-color)] mt-1">Add more</span>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={e => { if (e.target.files) handleFiles(e.target.files) }}
                    />
                  </div>
                ) : (
                  <div
                    className={cn(
                      'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all bg-[var(--warm)]',
                      isDragOver ? 'border-[var(--teal)] bg-[var(--teal-dim)]' : 'border-[var(--border-color)]',
                      'hover:border-[var(--teal)] hover:bg-[var(--teal-dim)]'
                    )}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={e => {
                      e.preventDefault(); setIsDragOver(false)
                      if (e.dataTransfer.files) handleFiles(e.dataTransfer.files)
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={e => { if (e.target.files) handleFiles(e.target.files) }}
                    />
                    {imageData ? (
                      <div>
                        <img src={imageData} alt="" className="max-h-[140px] rounded max-w-full mx-auto" />
                        <div className="text-xs text-muted-foreground mt-2">{imageName}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Click to upload</strong> or drag & drop<br />
                        PNG, JPG, WebP — select multiple to batch import
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Single-file: notes field (auto-filled by AI analysis) */}
              {!isBatchMode && (
                <>
                  <div className="col-span-2">
                    <div className="field-label flex items-center gap-2">
                      Design analysis
                      {analyzing && (
                        <span className="analysis-badge analyzing">✦ Analysing image…</span>
                      )}
                      {!analyzing && notes && imageData && (
                        <span className="analysis-badge done">✓ AI analysed — edit freely</span>
                      )}
                      {!analyzing && analysisFailed && (
                        <span className="analysis-badge error" title={analysisFailed}>⚠ {analysisFailed}</span>
                      )}
                    </div>
                    <Textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder={
                        imageData
                          ? analyzing
                            ? 'Analysing your screenshot…'
                            : 'Analysis will appear here…'
                          : 'What draws you to this? Or upload an image for automatic analysis.'
                      }
                      disabled={analyzing}
                      className={analyzing ? 'opacity-60' : ''}
                    />
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
                </>
              )}

              {/* Action buttons */}
              <div className="col-span-2 flex gap-3 items-center flex-wrap">
                {isBatchMode ? (
                  <>
                    <Button
                      size="lg"
                      onClick={handleAddBatch}
                      disabled={isAddingBatch || batchStillAnalyzing}
                    >
                      {isAddingBatch
                        ? 'Adding…'
                        : batchStillAnalyzing
                          ? `Analysing ${batchItems.filter(i => i.analyzing).length} image${batchItems.filter(i => i.analyzing).length !== 1 ? 's' : ''}…`
                          : `Add ${batchItems.length} references`}
                    </Button>
                    <Button size="lg" variant="outline" onClick={clearForm}>Cancel</Button>
                    {!batchStillAnalyzing && (
                      <span className="text-xs text-[var(--muted-color)]">
                        Each image gets its own AI-written analysis in the skill export
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <Button size="lg" onClick={handleAdd} disabled={analyzing}>
                      Add reference
                    </Button>
                    <Button size="lg" variant="outline" onClick={clearForm}>Clear</Button>
                  </>
                )}
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Reference list */}
        <div className="flex flex-col gap-4">
          {references.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🖼</div>
              <p>No references yet. Upload a screenshot and Claude will analyse its design signals for your skill file.</p>
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
                      {ref.notes
                        ? <div className="text-[0.8rem] text-muted-foreground italic leading-relaxed">&ldquo;{ref.notes}&rdquo;</div>
                        : imgSrc && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[0.75rem] text-[var(--muted-color)]">No analysis yet</span>
                            <button
                              className="reanalyze-btn"
                              disabled={reanalyzing === ref.id}
                              onClick={() => handleReanalyze(ref.id, imgSrc, ref.name)}
                            >
                              {reanalyzing === ref.id ? '✦ Analysing…' : '✦ Analyse now'}
                            </button>
                          </div>
                        )
                      }
                      {ref.notes && imgSrc && (
                        <button
                          className="reanalyze-btn mt-0.5 w-fit"
                          disabled={reanalyzing === ref.id}
                          onClick={() => handleReanalyze(ref.id, imgSrc, ref.name)}
                        >
                          {reanalyzing === ref.id ? '✦ Re-analysing…' : '↺ Re-analyse'}
                        </button>
                      )}
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
