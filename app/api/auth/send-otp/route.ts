import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { OtpVerification } from '@/lib/models/OtpVerification'
import nodemailer from 'nodemailer'

const OTP_EXPIRY_MINUTES = 5

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

async function sendOtpEmail(email: string, otp: string): Promise<{ success: boolean; error?: string }> {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.EMAIL_FROM || 'CodeHire AI <noreply@codehire.ai>'
  const secure = process.env.SMTP_SECURE === 'true'

  if (!host || !user || !pass) {
    return {
      success: false,
      error: 'Email is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env.local',
    }
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    })

    await transporter.sendMail({
      from,
      to: email,
      subject: 'Your CodeHire AI verification code',
      html: `
        <div style="font-family: sans-serif; max-width: 400px;">
          <h2 style="color: #0f172a;">Verification code</h2>
          <p>Your verification code is:</p>
          <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #0369a1;">${otp}</p>
          <p style="color: #64748b; font-size: 14px;">This code expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
          <p style="color: #64748b; font-size: 14px;">If you didn't request this, you can ignore this email.</p>
        </div>
      `,
      text: `Your CodeHire AI verification code is: ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
    })

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to send email'
    console.error('Nodemailer error:', err)
    return { success: false, error: message }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = body.email?.trim()?.toLowerCase()
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required', errors: { email: 'Email is required' } },
        { status: 400 }
      )
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address', errors: { email: 'Please enter a valid email address' } },
        { status: 400 }
      )
    }

    await connectDB()

    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)
    await OtpVerification.deleteMany({ email })
    await OtpVerification.create({ email, otp, expiresAt })

    const result = await sendOtpEmail(email, otp)
    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || 'Failed to send verification email. Please try again.',
          errors: { email: result.error || 'Failed to send email' },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email.',
    })
  } catch (err) {
    console.error('Send OTP error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
