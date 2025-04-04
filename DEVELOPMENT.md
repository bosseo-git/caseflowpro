# Development Guide for CaseFlowPro

This guide provides instructions for running and developing the CaseFlowPro application.

## Running in Development Mode

You can run the application in development mode even without a fully configured database by using the `--no-migrate` flag.

### Using Command Prompt (Recommended for Windows)

```cmd
cd C:\Users\USER\CODE\INTAKE
npm run dev
```

### Using PowerShell with Execution Policy Bypass

If you encounter PowerShell execution policy restrictions:

```powershell
cd C:\Users\USER\CODE\INTAKE
powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass"
npm run dev
```

## Accessing the Application

Once the development server is running, you can access the application at:

**URL:** http://localhost:3000

## Testing GoHighLevel Integration

To test the GoHighLevel integration:

1. Start the development server
2. Create an account at http://localhost:3000/signup
3. Navigate to the settings page at http://localhost:3000/dashboard/settings
4. Enter your GoHighLevel credentials:
   - Location ID
   - API Key
5. Save your settings
6. Generate a widget code at http://localhost:3000/dashboard/script-generator
7. Copy the generated code and paste it into a test HTML file

## Running Without a Database (Mock Mode)

If you're having issues with the database connection, you can create a simplified version of the application by mocking database functions. Here's how:

1. Create a mock user service (`src/lib/mock-data.ts`):

```typescript
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
  updateUser: (data) => Promise.resolve({ ...mockUser, ...data }),
};
```

2. Modify your API handlers to use the mock data when database connection fails

3. Focus on developing and testing the UI and GoHighLevel integration aspects while database setup issues are being resolved

## Next Steps

1. Complete your PostgreSQL database setup using the instructions in `DATABASE-SETUP.md`
2. Set up your GoHighLevel account and obtain API credentials
3. Customize the widget appearance and behavior in the script generator
4. Deploy the application to your preferred hosting provider

## Useful Resources

- [NextJS Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [GoHighLevel API Documentation](https://highlevel.stoplight.io/docs/integrations) 