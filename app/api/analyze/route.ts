import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are a design taste analyst. When shown a UI screenshot, write a concise, opinionated design critique from the perspective of a senior designer who cares deeply about craft.

Cover all of these angles in plain prose:
- Color & tone: palette mood, dominant hues, contrast approach
- Typography: weight, scale contrast, serif/sans/mono choices, type as voice
- Density & space: breathing room, information density, use of whitespace
- Component character: border radius, depth/shadows, shape language
- Hierarchy: how the eye is guided, emphasis approach
- Emotional register: what feeling it gives off (clinical, warm, playful, luxurious, raw, etc.)
- What an AI agent should replicate or remix from this design

Write 3–5 sentences. No bullet points. No headers. Be specific and opinionated — not generic. Write as if briefing a developer who will use this to build something inspired by it.`

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 })
  }

  try {
    const { imageData, name } = await req.json()

    if (!imageData?.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Invalid image data' }, { status: 400 })
    }

    // Strip data URL header → raw base64
    const [header, base64] = imageData.split(',')
    const mimeType = header.match(/data:(image\/[\w+]+)/)?.[1] ?? 'image/jpeg'

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = name
      ? `${SYSTEM_PROMPT}\n\nAnalyse this UI screenshot labeled "${name}" for design taste signals.`
      : `${SYSTEM_PROMPT}\n\nAnalyse this UI screenshot for design taste signals.`

    const result = await model.generateContent([
      prompt,
      { inlineData: { mimeType, data: base64 } },
    ])

    const description = result.response.text().trim()
    return NextResponse.json({ description })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Analyze error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
