# CaseFlowPro Testing Guide

This guide will help you set up and test your CaseFlowPro application with GoHighLevel integration.

## Quick Start

### For Windows Users:
1. Open Command Prompt (CMD) in the project directory
2. Run the setup script:
   ```
   setup.bat
   ```
3. Start the development server:
   ```
   npm run dev
   ```

### For macOS/Linux Users:
1. Open Terminal in the project directory
2. Run the setup script:
   ```
   bash setup.sh
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Complete Setup Process

1. **Environment Setup**
   - Make sure you have Node.js 16+ and PostgreSQL installed
   - Check that the `.env.local` file contains all required variables
   - Ensure the `DATABASE_URL` points to your PostgreSQL database

2. **Account Creation**
   - Navigate to http://localhost:3000/signup
   - Create a new account with your email and password
   - Select a subscription plan (you can use stripe test card: 4242 4242 4242 4242)

3. **GoHighLevel Integration**
   - Go to http://localhost:3000/dashboard/settings
   - Enter your GoHighLevel Location ID and API Key
   - Save the settings

4. **Widget Code Generation**
   - Go to http://localhost:3000/dashboard/script-generator
   - Customize the widget appearance and button labels
   - Copy the generated code

5. **Testing with Test Page**
   - Open the `widget-test.html` file in a text editor
   - Paste the copied widget code just before the closing `</body>` tag
   - Save the file and open it in a web browser
   - Test all the widget functionality:
     - Call button
     - SMS form submission
     - WhatsApp button
     - Case value estimation form

6. **Testing Webhooks with ngrok**
   - Install ngrok: `npm install -g ngrok`
   - Start your development server: `npm run dev`
   - In a new terminal, run: `ngrok http 3000`
   - Copy the https URL provided by ngrok
   - Update your `.env.local` file:
     ```
     NEXT_PUBLIC_GHL_WEBHOOK_URL="https://your-ngrok-url.ngrok.io/api/webhooks/gohighlevel"
     ```
   - Update the webhook URL in your GoHighLevel settings

7. **Verification in GoHighLevel**
   - Check that form submissions appear in your GoHighLevel account
   - Verify that contacts are being created correctly
   - Test any automation workflows you've set up

## Common Issues and Solutions

### Database Connection Error
- Ensure PostgreSQL is running
- Verify the connection string in `.env.local` is correct
- Check that the database user has proper permissions

### GoHighLevel Integration Issues
- Verify your Location ID and API Key are correct
- Make sure webhook URLs are properly configured
- Test webhooks using the ngrok URL

### Widget Visibility Problems
- Check that the widget code is properly inserted before the closing body tag
- Verify there are no JavaScript errors in the browser console
- Test on different browsers to ensure compatibility

## Advanced Testing

### Testing Different Form Configurations
- Try different combinations of form fields
- Test required vs optional fields
- Verify form validation works correctly

### Responsive Design Testing
- Test the widget on various device sizes
- Verify the widget is usable on mobile devices
- Test different widget positions (left vs right)

### Edge Cases
- Test with very long form inputs
- Try submitting forms with special characters
- Test performance with multiple widgets on the same page 