import { get } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get('pathname')
  if (!pathname || !pathname.startsWith('videos/')) {
    return NextResponse.json({ error: 'Missing or invalid video pathname.' }, { status: 400 })
  }

  try {
    const result = await get(pathname, {
      access: 'private',
      ifNoneMatch: request.headers.get('if-none-match') ?? undefined,
    })

    if (!result) {
      return new NextResponse('Video not found.', { status: 404 })
    }

    if (result.statusCode === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: result.blob.etag,
          'Cache-Control': 'private, no-cache',
        },
      })
    }

    return new NextResponse(result.stream, {
      headers: {
        'Content-Type': result.blob.contentType || 'video/mp4',
        ETag: result.blob.etag,
        'Cache-Control': 'private, no-cache',
        'Accept-Ranges': 'bytes',
      },
    })
  } catch (error) {
    console.error('[v0] Video delivery failed:', error)
    return NextResponse.json({ error: 'Unable to load the uploaded video.' }, { status: 500 })
  }
}
