import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type IntakeSubmission = {
  userId: string
  name: string
  email: string
  phone?: string
  message?: string
  timestamp: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers to allow submissions from embedded widgets
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  const data: IntakeSubmission = req.body
  
  // Validate required fields
  if (!data.userId || !data.name || !data.email) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  
  try {
    // Verify that the user exists
    const user = await prisma.user.findUnique({
      where: { id: data.userId }
    })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    // Store the intake data in the database (in a real app, you would have a leads/submissions table)
    // For now, we'll just log it and simulate a successful submission
    console.log('New intake submission:', {
      userId: data.userId,
      name: data.name,
      email: data.email,
      phone: data.phone || 'Not provided',
      message: data.message || 'Not provided',
      timestamp: data.timestamp || new Date().toISOString()
    })
    
    // In a real app, you would also:
    // 1. Send an email notification to the law firm
    // 2. Integrate with their CRM system or GoHighLevel
    // 3. Store the lead in your database
    
    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully'
    })
  } catch (error) {
    console.error('Error processing intake submission:', error)
    return res.status(500).json({ error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
} 