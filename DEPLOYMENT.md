# CaseFlowPro Deployment Guide 
This guide will walk you through deploying your CaseFlowPro application to production using your caseflowpro.com domain. 
  
## Prerequisites  
  
- Domain name: caseflowpro.com (already purchased)  
- Access to domain DNS settings  
- PostgreSQL database (production)  
- Node.js hosting environment 
  
## Deployment Options  
  
You have several options for deploying your CaseFlowPro application:  
  
### Option 1: Vercel (Recommended)  
  
Vercel is built by the creators of Next.js and offers the simplest deployment experience.  
 
1. **Create a Vercel Account**:  
   - Sign up at https://vercel.com  
   - Connect your GitHub account  
 
2. **Configure Environment Variables**:  
   - Go to your project settings  
   - Add all the variables from your `.env.local` file:  
     ``` 
     DATABASE_URL="postgresql://[username]:[password]@[host]:[port]/caseflowpro?schema=public"  
     NEXTAUTH_URL="https://caseflowpro.com"  
     NEXTAUTH_SECRET="[generate-a-secure-random-string]"  
     STRIPE_SECRET_KEY="[your-stripe-secret-key]"  
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="[your-stripe-publishable-key]"  
     NEXT_PUBLIC_GHL_WEBHOOK_URL="https://caseflowpro.com/api/webhooks/gohighlevel"  
     GHL_API_KEY="[your-gohighlevel-api-key]"  
     GHL_LOCATION_ID="[your-gohighlevel-location-id]"  
     ```  
 
3. **Deploy from GitHub**:  
   - Import your repository  
   - Vercel will automatically build and deploy your application  
  
4. **Configure Your Domain**:  
   - In Vercel project settings, go to "Domains"  
   - Add "caseflowpro.com" as a custom domain  
   - Follow Vercel's instructions to set up the necessary DNS records  
 
### Option 2: DigitalOcean App Platform  
  
DigitalOcean provides a reliable platform with predictable pricing.  
  
1. **Create a DigitalOcean Account**:  
   - Sign up at https://digitalocean.com  
   - Create a new App  
  
2. **Connect to GitHub**:  
   - Select your repository  
   - Choose the branch to deploy  
 
3. **Configure Environment Variables**:  
   - Add all variables from your `.env.local` file  
   - Ensure database connection string is correct  
  
4. **Configure Build Command**:  
   ``` 
   npm run build  
   ``` 
  
5. **Configure Run Command**:  
   ``` 
   npm start  
   ``` 
  
6. **Add Domain**:  
   - Go to "Domains" in your app settings  
   - Add "caseflowpro.com"  
   - Follow the instructions to set up DNS records  
 
### Option 3: AWS Elastic Beanstalk  
  
For more control and scalability, AWS Elastic Beanstalk is a great option.  
  
1. **Create an AWS Account**:  
   - Sign up at https://aws.amazon.com  
  
2. **Install the EB CLI**:  
   ```bash  
   pip install awsebcli  
   ```  
  
3. **Initialize Elastic Beanstalk**:  
   ```bash  
   eb init  
   ```  
 
4. **Create Environment Variables**:  
   - Create a file named `.ebextensions/env.config` with your environment variables  
  
5. **Deploy Your Application**:  
   ```bash  
   eb create caseflowpro-production  
   ```  
  
6. **Configure Your Domain with Route 53**:  
   - Create a hosted zone for caseflowpro.com  
   - Create an A record pointing to your Elastic Beanstalk environment  
 
## Database Setup  
  
For production, you need a reliable PostgreSQL database:  
  
### Option 1: Managed PostgreSQL Services  
  
- **Vercel PostgreSQL** - Directly integrated with Vercel deployments  
- **DigitalOcean Managed Databases** - If using DigitalOcean for hosting  
- **AWS RDS** - Managed PostgreSQL for AWS deployments  
- **Railway.app** - Simple setup for PostgreSQL  
  
### Option 2: Self-Hosted PostgreSQL  
  
If you're managing your own server:  
 
1. Install PostgreSQL on your server  
2. Create a database for CaseFlowPro  
3. Set up proper security (firewalls, SSL)  
4. Run the database migration:  
   ```bash  
   npx prisma migrate deploy  
   ```  
 
## Domain Configuration  
  
To configure your caseflowpro.com domain:  
  
1. **Log in to Your Domain Registrar**  
2. **Configure DNS Settings**:  
   - Point your domain to your hosting provider using:  
     - For Vercel: Follow their domain setup instructions  
     - For DigitalOcean: Create an A record pointing to your app  
     - For AWS: Use Route 53 to manage DNS  
  
3. **Set up SSL**:  
   - Most hosting providers will automatically set up SSL  
   - For self-hosted solutions, use Let's Encrypt with Certbot  
 
## Post-Deployment Steps  
  
After deploying, complete these steps:  
  
1. **Test Your Live Application**:  
   - Visit https://caseflowpro.com  
   - Test signup, login, and all features  
   - Verify GoHighLevel integration  
  
2. **Update GoHighLevel Webhook URL**:  
   - Update the webhook URL in GoHighLevel to use your production URL:  
     ```  
     https://caseflowpro.com/api/webhooks/gohighlevel  
     ```  
 
3. **Configure Stripe for Production**:  
   - Switch from test mode to production mode  
   - Update API keys in your environment variables  
  
4. **Set Up Monitoring**:  
   - Use a service like Uptime Robot to monitor your site  
   - Set up logging (Vercel provides this by default)  
  
5. **Create Regular Backups**:  
   - Set up automatic database backups  
   - Store backups in a secure location  
 
## Security Considerations  
  
1. **SSL Configuration**:  
   - Ensure all traffic uses HTTPS  
   - Set up HSTS (HTTP Strict Transport Security)  
  
2. **API Security**:  
   - Use rate limiting  
   - Implement CORS properly  
  
3. **Authentication Security**:  
   - Use strong password policies  
   - Consider adding two-factor authentication  
  
4. **Database Security**:  
   - Use a complex password  
   - Limit access to database server  
   - Regular security updates  
 
## Ongoing Maintenance  
  
1. **Regular Updates**:  
   - Keep dependencies updated  
   - Apply security patches  
  
2. **Performance Monitoring**:  
   - Track page load times  
   - Monitor database performance  
  
3. **Content Updates**:  
   - Regularly update your terms of service and privacy policy  
   - Keep documentation current  
 
