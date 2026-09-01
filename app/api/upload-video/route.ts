import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File) || file.type !== 'video/mp4') {
      return NextResponse.json({ error: 'Please upload a valid MP4 file.' }, { status: 400 })
    }

    if (file.size > 500 * 1024 * 1024) {
      return NextResponse.json({ error: 'Videos must be smaller than 500 MB.' }, { status: 413 })
    }

    const blob = await put(`videos/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`, file, {
      access: 'private',
      addRandomSuffix: false,
      contentType: file.type,
    })

    return NextResponse.json({
      url: `/api/video?pathname=${encodeURIComponent(blob.pathname)}`,
      name: file.name,
    })
  } catch (error) {
    console.error('[v0] Video upload failed:', error)
    return NextResponse.json({ error: 'Video upload failed. Please try again.' }, { status: 500 })
  }
}
