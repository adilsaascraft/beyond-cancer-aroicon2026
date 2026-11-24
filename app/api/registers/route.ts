import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Register from '@/lib/models/Register'
import Counter from '@/lib/models/Counter'
import { EVEventRegistrationSchema } from '@/validations/registrationSchema'

const REG_PREFIX = 'AROICON26'
const REG_START = 1001

function fail(message: string, status: number) {
  return NextResponse.json({ success: false, message }, { status })
}

// Atomic, race-condition-free registration number
async function nextRegNum(): Promise<string> {
  // Make sure the counter starts at REG_START (only on first ever call)
  await Counter.updateOne(
    { _id: 'register' },
    { $setOnInsert: { seq: REG_START - 1 } },
    { upsert: true },
  )
  const counter = await Counter.findOneAndUpdate(
    { _id: 'register' },
    { $inc: { seq: 1 } },
    { new: true },
  )
  return `${REG_PREFIX}-${counter.seq}`
}

// =========================================================
// POST - CREATE REGISTRATION
// =========================================================
export async function POST(req: Request) {
  try {
    await connectDB()

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return fail('Invalid request body', 400)
    }

    // Validate with the same zod schema the form uses
    const parsed = EVEventRegistrationSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message || 'Invalid input', 400)
    }

    const name = parsed.data.name
    const email = parsed.data.email.toLowerCase()
    const mobile = parsed.data.mobile
    const affiliation = parsed.data.affiliation

    // Duplicate check
    const exists = await Register.findOne({ $or: [{ mobile }, { email }] })
    if (exists) {
      if (exists.mobile === mobile) return fail('Mobile number already registered', 409)
      return fail('Email ID already registered', 409)
    }

    const regNum = await nextRegNum()

    const register = await Register.create({ name, email, mobile, affiliation, regNum })

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        data: {
          regNum: register.regNum,
          name: register.name,
          email: register.email,
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('REGISTER ERROR:', error)

    if (error?.code === 11000) {
      return fail('Email ID or mobile number is already registered', 409)
    }
    return fail('Server error', 500)
  }
}

// =========================================================
// GET - ALL REGISTRATIONS
// NOTE: this exposes everyone's name/email/phone to anyone who calls it.
// Protect it with admin auth, or delete it if you don't need it.
// =========================================================
export async function GET(req: Request) {
  try {
    const key = req.headers.get('x-admin-key')
    if (!process.env.ADMIN_API_KEY || key !== process.env.ADMIN_API_KEY) {
      return fail('Unauthorized', 401)
    }

    await connectDB()
    const data = await Register.find().sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error('GET REGISTER ERROR:', error)
    return fail('Server error', 500)
  }
}
