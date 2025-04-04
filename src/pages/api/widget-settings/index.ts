import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type WidgetSettings = {
  id?: string
  userId: string
  theme: string
  title: string
  message: string
  buttonLabel: string
  size: string
  animation: string
  position: string
  primaryColor: string
  autoClose: boolean
  autoCloseDelay: number
  showCloseButton: boolean
  createdAt?: Date
  updatedAt?: Date
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the user session
  const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  const userId = session.user.id
  
  try {
    // Handle GET request - retrieve user's widget settings
    if (req.method === 'GET') {
      const settings = await prisma.user.findUnique({
        where: { id: userId },
        select: { ghlSettings: true }
      })
      
      if (!settings || !settings.ghlSettings) {
        return res.status(200).json({
          settings: null,
          message: 'No widget settings found'
        })
      }
      
      const widgetSettings = settings.ghlSettings as object
      
      return res.status(200).json({
        settings: widgetSettings,
        message: 'Widget settings retrieved successfully'
      })
    }
    
    // Handle POST request - save user's widget settings
    if (req.method === 'POST') {
      const data = req.body
      
      if (!data) {
        return res.status(400).json({ error: 'No data provided' })
      }
      
      // Update the user's ghlSettings field with the new widget settings
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ghlSettings: data,
          updatedAt: new Date()
        },
        select: { ghlSettings: true }
      })
      
      return res.status(200).json({
        settings: updatedUser.ghlSettings,
        message: 'Widget settings saved successfully'
      })
    }
    
    // Handle unsupported methods
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Error handling widget settings:', error)
    return res.status(500).json({ error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
} 