// Example mock user data for testing without a database
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  companyName: 'Test Law Firm',
  phone: '+1 (555) 123-4567',
  whatsAppNumber: '+1 (555) 123-4567',
  ghlSettings: {
    locationId: 'test-location-id',
    apiKey: 'test-api-key',
  }
};

// Mock user operations
export const mockUserOperations = {
  getUser: () => Promise.resolve(mockUser),
  updateUser: (data: any) => Promise.resolve({ ...mockUser, ...data }),
};

// Check if we should use mock data (useful for development without DB)
export const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || 
                          process.env.NODE_ENV === 'development';

// Helper function to get user data (from DB or mock)
export async function getUserData(userId?: string) {
  if (useMockData) {
    return mockUser;
  }
  
  // This would normally use Prisma, but we'll catch errors and return mock data
  try {
    // Import prisma dynamically to avoid issues if DB is not available
    const { default: prisma } = await import('./prisma');
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
    });
    
    return user || mockUser;
  } catch (error) {
    console.error('Error fetching user data, using mock data instead:', error);
    return mockUser;
  }
} 