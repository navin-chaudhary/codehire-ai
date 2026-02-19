import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { connectDB } from '@/lib/db'
import { UserActivity } from '@/lib/models/UserActivity'

export async function GET() {
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

    await connectDB()

    const activity = await UserActivity.findOne({ userId }).lean()

    const stats = {
      codeReviewsCount: activity?.codeReviewsCount ?? 0,
      resumeAnalysesCount: activity?.resumeAnalysesCount ?? 0,
      lastCodeReviewAt: activity?.lastCodeReviewAt
        ? new Date(activity.lastCodeReviewAt).toISOString()
        : null,
      lastResumeAnalysisAt: activity?.lastResumeAnalysisAt
        ? new Date(activity.lastResumeAnalysisAt).toISOString()
        : null,
      lastResumeScore: activity?.lastResumeScore ?? null,
      lastCodeReviewScore: activity?.lastCodeReviewScore ?? null,
    }

    return NextResponse.json(stats)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
