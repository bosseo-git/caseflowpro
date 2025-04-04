import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

type ResponseData = {
  success: boolean
  message: string
  details?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow in development or if authorized
  if (process.env.NODE_ENV !== 'development' && req.headers.authorization !== process.env.API_SECRET) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized' 
    })
  }

  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

  try {
    // Test database connection
    await prisma.$connect()
    
    // Try a simple query to get counts
    const userCount = await prisma.user.count()
    const accountCount = await prisma.account.count()
    const sessionCount = await prisma.session.count()
    
    // Get database info
    const databaseUrl = process.env.DATABASE_URL?.substring(0, 25) + '...' || 'Not set'
    
    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      details: {
        databaseUrl,
        counts: {
          users: userCount,
          accounts: accountCount,
          sessions: sessionCount
        },
        env: {
          nodeEnv: process.env.NODE_ENV,
          nextAuthUrl: process.env.NEXTAUTH_URL?.substring(0, 25) + '...' || 'Not set',
          hasSecret: !!process.env.NEXTAUTH_SECRET
        }
      }
    })
  } catch (error) {
    console.error('Database test error:', error)
    
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      details: {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        databaseUrl: process.env.DATABASE_URL?.substring(0, 25) + '...' || 'Not set'
      }
    })
  } finally {
    await prisma.$disconnect()
  }
} 