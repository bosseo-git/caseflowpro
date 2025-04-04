import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { name, email, password, firmName, firmSize, website } = req.body

    // Check if all required fields are provided
    if (!name || !email || !password || !firmName) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        companyName: firmName,
        // Store firmSize as part of GHL settings
        ghlSettings: {
          firmSize,
          website
        },
      },
    })

    // Create subscription record
    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: 'website', // Default plan
        status: 'active',
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return res.status(201).json(userWithoutPassword)
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 