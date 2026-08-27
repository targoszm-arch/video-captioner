import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: 'A video file is required.' }, { status: 400 })

  const upstream = new FormData()
  upstream.append('file', file)
  upstream.append('model', 'openai/whisper-1')
  upstream.append('response_format', 'verbose_json')
  upstream.append('timestamp_granularities[]', 'word')

  const response = await fetch('https://ai-gateway.vercel.sh/v1/audio/transcriptions', {
    method: 'POST',
    body: upstream,
    headers: { Authorization: `Bearer ${process.env.AI_GATEWAY_API_KEY ?? ''}` },
  })
  const data = await response.json()
  if (!response.ok) return NextResponse.json({ error: data?.error?.message ?? 'Transcription service unavailable.' }, { status: response.status })

  const words = (data.words ?? []).map((word: { start: number; end: number; word: string }) => ({
    start: Math.max(0, Number(word.start) || 0),
    end: Math.max(Number(word.start) || 0, Number(word.end) || 0.1),
    word: word.word.trim(),
  })).filter((word: { word: string }) => word.word)
  return NextResponse.json({ words })
}
