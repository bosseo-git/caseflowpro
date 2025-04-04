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

  // Determine which connection string to use
  const connectionString = process.env.NODE_ENV === 'production' 
    ? process.env.POSTGRES_PRISMA_URL 
    : process.env.DATABASE_URL;

  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasourceUrl: connectionString,
  })

  try {
    // Test database connection with timeout
    const connectPromise = prisma.$connect();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), 10000)
    );
    
    await Promise.race([connectPromise, timeoutPromise]);
    
    // Try a simple query to get counts
    const userCount = await prisma.user.count()
    const accountCount = await prisma.account.count()
    const sessionCount = await prisma.session.count()
    
    // Get environment info
    const databaseUrl = connectionString?.substring(0, 25) + '...' || 'Not set'
    const isProdEnv = process.env.NODE_ENV === 'production'
    const hasPoolingUrl = !!process.env.POSTGRES_PRISMA_URL
    const hasNonPoolingUrl = !!process.env.POSTGRES_URL_NON_POOLING
    
    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      details: {
        databaseUrl,
        connectionType: isProdEnv ? 'Production' : 'Development',
        counts: {
          users: userCount,
          accounts: accountCount,
          sessions: sessionCount
        },
        env: {
          nodeEnv: process.env.NODE_ENV,
          nextAuthUrl: process.env.NEXTAUTH_URL?.substring(0, 25) + '...' || 'Not set',
          hasSecret: !!process.env.NEXTAUTH_SECRET,
          hasPoolingUrl,
          hasNonPoolingUrl
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
        databaseUrl: connectionString?.substring(0, 25) + '...' || 'Not set',
        connectionType: process.env.NODE_ENV === 'production' ? 'Production' : 'Development'
      }
    })
  } finally {
    await prisma.$disconnect()
  }
} 