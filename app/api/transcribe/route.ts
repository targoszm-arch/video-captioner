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

    // Prefer provider word timestamps when available. The Gateway transcript type
    // currently exposes segment timestamps, so split each segment's duration by
    // spoken character weight instead of assigning every word the same interval.
    const providerWords = (transcript as { words?: Array<{ word?: string; text?: string; startSeconds?: number; endSeconds?: number }> }).words
    const words = providerWords?.length
      ? providerWords.map((item) => ({
          start: Math.max(0, item.startSeconds ?? 0),
          end: Math.max(item.startSeconds ?? 0, item.endSeconds ?? item.startSeconds ?? 0),
          word: (item.word ?? item.text ?? '').trim(),
        })).filter((item) => item.word)
      : (transcript.segments ?? []).flatMap((segment) => {
          const segmentWords = segment.text.trim().split(/\\s+/).filter(Boolean)
          const start = Math.max(0, segment.startSeconds)
          const end = Math.max(start + 0.05, segment.endSeconds)
          const totalWeight = segmentWords.reduce((sum, word) => sum + Math.max(1, word.replace(/[^\\p{L}\\p{N}]/gu, '').length), 0)
          let cursor = start

          return segmentWords.map((word, index) => {
            const weight = Math.max(1, word.replace(/[^\\p{L}\\p{N}]/gu, '').length)
            const wordStart = cursor
            const wordEnd = index === segmentWords.length - 1
              ? end
              : cursor + ((end - start) * weight) / totalWeight
            cursor = wordEnd
            return { start: wordStart, end: Math.max(wordStart + 0.05, wordEnd), word }
          })
        })

    return NextResponse.json({ words, text: transcript.text })
  } catch (error) {
    console.error('[v0] Transcription failed:', error)
    return NextResponse.json({ error: 'Transcription failed. Please try another MP4 file.' }, { status: 502 })
  }
}
