import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const filename = (await params).filename
    // Files are saved in public/uploads by the actions
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename)
    
    try {
      await fs.access(filePath)
    } catch (e) {
      return new NextResponse('File not found', { status: 404 })
    }

    const fileBuffer = await fs.readFile(filePath)
    
    // Determine content type
    let contentType = 'application/octet-stream'
    const ext = path.extname(filename).toLowerCase()
    if (ext === '.pdf') contentType = 'application/pdf'
    else if (ext === '.png') contentType = 'image/png'
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
    else if (ext === '.gif') contentType = 'image/gif'
    else if (ext === '.webp') contentType = 'image/webp'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
      },
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
