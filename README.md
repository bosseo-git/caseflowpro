# CaseFlowPro - Law Firm Intake Widget with GoHighLevel Integration

CaseFlowPro is a comprehensive client intake solution for lawyers and law firms. It provides a customizable widget for websites that connects with GoHighLevel for managing client communications and workflows.

## Features

- **Multi-channel Contact**: Offer potential clients multiple ways to reach you - phone calls, SMS, WhatsApp, or case value estimation form
- **GoHighLevel Integration**: Connect seamlessly with GoHighLevel's CRM and marketing automation tools
- **Customizable Forms**: Design intake forms with fields specific to your practice areas
- **Mobile-Friendly Widget**: Smooth experience on all devices for maximum lead capture
- **Analytics Dashboard**: Track performance and identify opportunities for improvement

## Technology Stack

- Next.js
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- GoHighLevel API
- Stripe for payments

## Subscription Plans

CaseFlowPro offers three subscription tiers:

### Basic Plan - $49/month
- Widget customization
- Call & SMS functionality
- Basic GoHighLevel integration
- Email support

### Pro Plan - $99/month
- All Basic features
- WhatsApp integration
- Case value estimation form
- Custom branding
- Priority support

### Enterprise Plan - $199/month
- All Pro features
- Advanced analytics
- Multiple websites
- Custom GoHighLevel automation workflows
- Dedicated account manager

## Widget Features

### Call Button
Direct phone calls to your firm with a single click

### SMS Form
Custom intake form that sends data directly to GoHighLevel

### WhatsApp Button
Connect clients to your WhatsApp business account

### Case Value Button
Help potential clients understand the potential value of their case

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/caseflowpro.git
cd caseflowpro

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run the development server
npm run dev
```

## GoHighLevel Integration

1. Set up your GoHighLevel account
2. Create an API key in GoHighLevel Settings
3. In the CaseFlowPro dashboard, navigate to "Website Script"
4. Enter your GoHighLevel credentials
5. Configure the widget appearance and save settings
6. Copy the generated widget code to your website

## Widget Installation

1. In your CaseFlowPro dashboard, go to the Widget Generator
2. Customize the appearance and button labels
3. Copy the generated code
4. Paste the code just before the closing `</body>` tag on your website

## Deployment

This application can be deployed to any hosting provider that supports Node.js applications. We recommend Google Cloud App Engine for ease of deployment.

1. Set up a Google Cloud account
2. Install the Google Cloud SDK
3. Configure app.yaml with your settings
4. Deploy with `gcloud app deploy`

## License

© 2023 CaseFlowPro. All rights reserved.

## Contact

For questions, support, or feedback, please contact us at support@caseflowpro.com 