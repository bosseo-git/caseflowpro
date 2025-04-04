import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

type ResponseData = {
  status: string
  timestamp: string
  database: string
  environment: string
}

// This endpoint is called by Vercel's cron job
// It helps keep the serverless function warm and test database connectivity
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Verify the request is from Vercel CRON
  const isVercelCron = req.headers['x-vercel-cron'] === 'true';
  const isAuthorized = req.headers.authorization === process.env.API_SECRET;
  
  if (!isVercelCron && !isAuthorized && process.env.NODE_ENV === 'production') {
    return res.status(401).json({
      status: 'unauthorized',
      timestamp: new Date().toISOString(),
      database: 'not checked',
      environment: process.env.NODE_ENV || 'unknown'
    });
  }

  const connectionString = process.env.NODE_ENV === 'production'
    ? process.env.POSTGRES_PRISMA_URL
    : process.env.DATABASE_URL;

  const prisma = new PrismaClient({
    datasourceUrl: connectionString,
  });

  try {
    // Test database connection
    await prisma.$connect();
    
    // Simple query to verify database access
    const userCount = await prisma.user.count();
    
    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: `connected (${userCount} users)`,
      environment: process.env.NODE_ENV || 'unknown'
    });
  } catch (error) {
    console.error('Health check error:', error);
    
    return res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'connection failed',
      environment: process.env.NODE_ENV || 'unknown'
    });
  } finally {
    await prisma.$disconnect();
  }
} 