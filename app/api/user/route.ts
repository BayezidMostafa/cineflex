// app/api/user/route.ts
import { NextResponse } from 'next/server'
import { Schema, model, models } from 'mongoose'
import connectToDb from '@/utils/connectToDb'

// define the schema & model once
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  image: { type: String },
  role:  { type: String, required: true },
}, { timestamps: true })

const User = models.User || model('User', userSchema)

export async function POST(request: Request) {
  await connectToDb()
  const { email, image, role } = await request.json()
  const user = await User.create({ email, image, role })
  return NextResponse.json({ success: true, data: user }, { status: 201 })
}

export async function PUT(request: Request) {
  await connectToDb()
  const { id, email, image, role } = await request.json()
  const user = await User.findByIdAndUpdate(id, { email, image, role }, { new: true })
  if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: user })
}

export async function DELETE(request: Request) {
  await connectToDb()
  const { id } = await request.json()
  const user = await User.findByIdAndDelete(id)
  if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: user })
}

// you can also add GET, PATCH, etc. as needed
