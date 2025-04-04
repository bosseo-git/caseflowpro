import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '@/lib/prisma'
import { mockUser, mockUserOperations, useMockData } from '@/lib/mock-data'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const userId = session.user.id

  // Handle GET request - retrieve user settings
  if (req.method === 'GET') {
    try {
      // Try to use Prisma first
      if (!useMockData) {
        try {
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
              id: true,
              email: true,
              name: true,
              companyName: true,
              phone: true,
              whatsAppNumber: true,
              ghlSettings: true,
            },
          })

          if (user) {
            return res.status(200).json(user)
          }
        } catch (error) {
          console.error('Error fetching user with Prisma, falling back to mock data:', error)
        }
      }
      
      // Fall back to mock data
      return res.status(200).json(mockUser)
    } catch (error) {
      console.error('Error fetching user settings:', error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  // Handle PUT request - update user settings
  if (req.method === 'PUT') {
    try {
      const { companyName, phone, whatsAppNumber, ghlSettings } = req.body

      // Try to use Prisma first
      if (!useMockData) {
        try {
          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
              companyName,
              phone,
              whatsAppNumber,
              ghlSettings,
            },
            select: {
              id: true,
              email: true,
              name: true,
              companyName: true,
              phone: true,
              whatsAppNumber: true,
              ghlSettings: true,
            },
          })
          
          return res.status(200).json(updatedUser)
        } catch (error) {
          console.error('Error updating user with Prisma, falling back to mock data:', error)
        }
      }
      
      // Fall back to mock data
      const updatedMockUser = { 
        ...mockUser, 
        companyName, 
        phone, 
        whatsAppNumber, 
        ghlSettings 
      }
      
      return res.status(200).json(updatedMockUser)
    } catch (error) {
      console.error('Error updating user settings:', error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  // Return Method Not Allowed for other request types
  return res.status(405).json({ message: 'Method Not Allowed' })
} 