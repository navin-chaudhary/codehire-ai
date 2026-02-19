import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'
import { OtpVerification } from '@/lib/models/OtpVerification'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, otp } = body

    const errors: Record<string, string> = {}

    const emailVal = email?.trim()?.toLowerCase()
    if (!emailVal) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) errors.email = 'Please enter a valid email address'

    if (!otp?.trim()) errors.otp = 'Verification code is required'
    else if (otp.trim().length !== 6) errors.otp = 'Enter the 6-digit code'

    if (!name?.trim()) errors.name = 'Name is required'

    if (!password) errors.password = 'Password is required'
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters'

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Please fix the errors below', errors },
        { status: 400 }
      )
    }

    await connectDB()

    const otpRecord = await OtpVerification.findOne({
      email: emailVal,
      otp: otp.trim(),
      expiresAt: { $gt: new Date() },
    })
    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code', errors: { otp: 'Invalid or expired code. Request a new one.' } },
        { status: 400 }
      )
    }

    const existing = await User.findOne({ email: emailVal })
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists', errors: { email: 'An account with this email already exists' } },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.create({
      email: emailVal,
      password: hashedPassword,
      name: name.trim(),
    })

    await OtpVerification.deleteMany({ email: emailVal })

    const { SignJWT } = await import('jose')
    const token = await new SignJWT({ userId: user._id.toString() })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-in-production'))

    const response = NextResponse.json({
      user: { id: user._id, email: user.email, name: user.name },
      token,
    })
    response.cookies.set('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
    console.error('Signup error:', err)
    return NextResponse.json(
      {
        error: process.env.NODE_ENV === 'development' ? message : 'Something went wrong. Please try again.',
      },
      { status: 500 }
    )
  }
}
