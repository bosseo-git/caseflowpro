# Changelog

## [0.2.0] - 2023 - GoHighLevel Integration

### Added
- GoHighLevel API integration utilities for creating contacts, tasks, notes, and SMS messages
- New widget with four action buttons: call, SMS, WhatsApp, and case value
- Integration settings page for configuring GoHighLevel credentials
- API endpoint for handling GoHighLevel webhook events
- Custom form submissions for SMS and case value requests
- Environment variables for GoHighLevel API configuration

### Changed
- Updated the homepage to reflect the GoHighLevel integration
- Replaced AI assistant references with the multi-channel contact widget
- Modified pricing tiers to align with the new feature set
- Updated the dashboard navigation to include Widget Generator and Integration Settings
- Removed OpenAI and Twilio dependencies from package.json

### Removed
- AI chatbot functionality
- Twilio voice and SMS integration
- OpenAI-related code and configurations
- Knowledge base functionality that was used for AI training

## [0.1.0] - 2023 - Initial Release

### Added
- User authentication and account management
- Subscription management with Stripe
- Dashboard for managing AI intake settings
- Script generator for website integration
- AI chatbot powered by OpenAI
- Twilio integration for voice and SMS
- Knowledge base management 