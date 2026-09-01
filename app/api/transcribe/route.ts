import { transcribe } from 'ai'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) return NextResponse.json({ error: 'A video file is required.' }, { status: 400 })

    const transcript = await transcribe({
      model: 'openai/whisper-1',
      audio: new Uint8Array(await file.arrayBuffer()),
    })

    const words = (transcript.segments ?? []).flatMap((segment) =>
      segment.text.trim().split(/\\s+/).filter(Boolean).map((word) => ({
        start: Math.max(0, segment.startSeconds),
        end: Math.max(segment.startSeconds, segment.endSeconds),
        word,
      })),
    )

    return NextResponse.json({ words, text: transcript.text })
  } catch (error) {
    console.error('[v0] Transcription failed:', error)
    return NextResponse.json({ error: 'Transcription failed. Please try another MP4 file.' }, { status: 502 })
  }
}
