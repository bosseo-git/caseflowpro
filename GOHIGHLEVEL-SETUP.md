# GoHighLevel Integration Setup Guide

This guide will walk you through setting up your GoHighLevel integration with CaseFlowPro.

## Creating a GoHighLevel Account

1. If you don't already have a GoHighLevel account, sign up at [https://www.gohighlevel.com/](https://www.gohighlevel.com/)
2. Complete the registration process and set up your agency account

## Obtaining Your GoHighLevel Credentials

### Finding Your Location ID

1. Log in to your GoHighLevel account
2. Click on the location you want to connect to CaseFlowPro
3. Your location ID is in the URL: `https://app.gohighlevel.com/location/XXXXXX/dashboard`
4. Copy the XXXXXX part - this is your Location ID

### Creating an API Key

1. In your GoHighLevel account, go to Settings → Developer Settings → API Keys
2. Click "Create New API Key"
3. Name it "CaseFlowPro Integration" or something descriptive
4. Select the following permissions:
   - Contacts: Read & Write
   - Conversations: Read & Write
   - Custom Fields: Read & Write
   - Custom Values: Read & Write
   - Tasks: Read & Write
   - Forms: Read & Write
5. Click "Create API Key"
6. Copy the generated API key immediately (you won't be able to see it again)

### Setting Up Webhooks

1. In your GoHighLevel account, go to Settings → Webhooks
2. Click "Create Webhook"
3. Name it "CaseFlowPro Webhook"
4. For the webhook URL, you'll need to use your application's URL plus `/api/webhooks/gohighlevel`
   - For local testing, use ngrok to create a temporary URL (see below)
   - For production, use your actual domain
5. Select the following events:
   - Contact Created
   - Contact Updated
   - Form Submitted
   - Message Received
6. Click "Create Webhook"

## Using ngrok for Local Testing

To test webhooks locally, you need to create a publicly accessible URL that forwards to your local development server:

1. Install ngrok if you haven't already: `npm install -g ngrok`
2. Start your development server: `npm run dev`
3. In a new terminal window, run: `ngrok http 3000`
4. Copy the HTTPS URL provided by ngrok (it looks like `https://xxxx-xxxx-xxxx.ngrok.io`)
5. Use this URL plus `/api/webhooks/gohighlevel` as your webhook URL in GoHighLevel
6. Set `NEXT_PUBLIC_GHL_WEBHOOK_URL` in your `.env.local` file to this same webhook URL

## Configuring CaseFlowPro

1. Start your CaseFlowPro application
2. Log in and go to Dashboard → Integration Settings
3. Enter your GoHighLevel credentials:
   - Location ID: The ID you copied earlier
   - API Key: The API key you generated
   - Webhook URL: Your GoHighLevel webhook URL
4. Click "Save Settings"

## Testing the Integration

1. Go to Dashboard → Widget Generator
2. Configure your widget settings
3. Copy the generated code
4. Paste it into the `widget-test.html` file
5. Open the HTML file in your browser
6. Test each button functionality:
   - Click the Call button (should initiate a call)
   - Click the SMS button (should show a form)
   - Click the WhatsApp button (should open WhatsApp)
   - Click the Case Value button (should show a form with case type fields)
7. Submit the SMS and Case Value forms
8. Check your GoHighLevel account to verify that contacts, notes, and tasks are being created

## Troubleshooting

If you encounter issues with the integration:

1. Check your browser console for JavaScript errors
2. Verify your API key and Location ID are correct
3. Make sure your webhook URL is accessible and correctly formatted
4. Check the server logs for any backend errors
5. Ensure all required permissions are enabled for your API key

For webhook testing, remember that ngrok URLs expire, so you'll need to update your GoHighLevel webhook URL and environment variables each time you restart ngrok. 