import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'
import { jwtVerify } from 'jose'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth')?.value
    if (!token) {
      return NextResponse.json({ user: null })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-in-production')
    const { payload } = await jwtVerify(token, secret)
    const userId = payload.userId as string
    if (!userId) return NextResponse.json({ user: null })

    await connectDB()
    const user = await User.findById(userId).select('email name _id createdAt')
    if (!user) return NextResponse.json({ user: null })

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
      },
    })
  } catch {
    return NextResponse.json({ user: null })
  }
}
