// Create demo account script
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Creating demo account...');
    
    // Check if the demo account already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'demo@caseflowpro.com' },
    });

    if (existingUser) {
      console.log('Demo account already exists');
      return;
    }

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    const user = await prisma.user.create({
      data: {
        name: 'Demo User',
        email: 'demo@caseflowpro.com',
        password: hashedPassword,
        companyName: 'Demo Law Firm',
        ghlSettings: {
          firmSize: '2-5',
          website: 'https://www.demolawfirm.com'
        }
      },
    });

    // Create subscription for the demo account
    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: 'complete', // Give demo account access to all features
        status: 'active',
      }
    });

    console.log('Demo account created successfully!');
    console.log('Email: demo@caseflowpro.com');
    console.log('Password: demo123');
  } catch (error) {
    console.error('Error creating demo account:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 