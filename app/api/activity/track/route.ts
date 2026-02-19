import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { connectDB } from '@/lib/db'
import { UserActivity } from '@/lib/models/UserActivity'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-in-production')
    const { payload } = await jwtVerify(token, secret)
    const userId = payload.userId as string
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { type, score } = body as { type: 'code_review' | 'resume_analysis'; score?: number }

    if (!type || !['code_review', 'resume_analysis'].includes(type)) {
      return NextResponse.json({ error: 'Invalid activity type' }, { status: 400 })
    }

    await connectDB()

    const activity = await UserActivity.findOneAndUpdate(
      { userId },
      {
        $inc: type === 'code_review' ? { codeReviewsCount: 1 } : { resumeAnalysesCount: 1 },
        $set:
          type === 'code_review'
            ? { lastCodeReviewAt: new Date(), ...(score != null && { lastCodeReviewScore: score }) }
            : { lastResumeAnalysisAt: new Date(), ...(score != null && { lastResumeScore: score }) },
      },
      { upsert: true, new: true }
    )

    return NextResponse.json({ success: true, activity })
  } catch {
    return NextResponse.json({ error: 'Failed to track activity' }, { status: 500 })
  }
}
