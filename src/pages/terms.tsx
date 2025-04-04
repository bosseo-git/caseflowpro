import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Terms() {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Terms of Service | CaseFlowPro</title>
        <meta name="description" content="Terms of Service for CaseFlowPro, the client intake solution for law firms." />
      </Head>

      <Header />
      
      <main className="flex-grow py-12">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
            <p className="text-gray-500 mb-8">Last updated: April 4, 2023</p>
            
            <div className="prose prose-lg max-w-none">
              <p>
                Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the CaseFlowPro website 
                and services operated by CaseFlowPro, Inc. ("us", "we", "our").
              </p>
              
              <p>
                Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. 
                These Terms apply to all visitors, users, and others who access or use the Service.
              </p>
              
              <p>
                <strong>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part 
                of the terms, then you may not access the Service.</strong>
              </p>
              
              <h2>1. Accounts</h2>
              <p>
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
                Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
              </p>
              
              <p>
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
                You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
              </p>
              
              <h2>2. Subscriptions and Payments</h2>
              <p>
                Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis ("Billing Cycle").
                Billing cycles are set on a monthly or annual basis, depending on the type of subscription plan you select when purchasing a Subscription.
              </p>
              
              <p>
                At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless you cancel it or
                CaseFlowPro cancels it. You may cancel your Subscription renewal either through your online account management page or by contacting CaseFlowPro customer support team.
              </p>
              
              <p>
                All payments shall be processed using the payment method you provided during the subscription process. If a payment is not successfully 
                settled, due to expiry, insufficient funds, or otherwise, and you do not edit your payment method information or cancel your Subscription, 
                you remain responsible for any uncollected amounts and authorize us to continue billing the payment method, as it may be updated.
              </p>
              
              <h2>3. Content</h2>
              <p>
                Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material 
                ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
              </p>
              
              <p>
                By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and 
                distribute such Content on and through the Service. You retain any and all of your rights to any Content you submit, post or display on or 
                through the Service and you are responsible for protecting those rights.
              </p>
              
              <p>
                You represent and warrant that: (i) the Content is yours (you own it) or you have the right to use it and grant us the rights and license as 
                provided in these Terms, and (ii) the posting of your Content on or through the Service does not violate the privacy rights, publicity rights, 
                copyrights, contract rights or any other rights of any person.
              </p>
              
              <h2>4. GoHighLevel Integration</h2>
              <p>
                The Service integrates with GoHighLevel. Your use of GoHighLevel through our Service is subject to GoHighLevel's Terms of Service. 
                We are not responsible for any changes, disruptions, or discontinuation of GoHighLevel services that may affect our Service.
              </p>
              
              <h2>5. Limitation of Liability</h2>
              <p>
                In no event shall CaseFlowPro, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, 
                special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              
              <ul>
                <li>Your access to or use of or inability to access or use the Service;</li>
                <li>Any conduct or content of any third party on the Service;</li>
                <li>Any content obtained from the Service; and</li>
                <li>Unauthorized access, use or alteration of your transmissions or content.</li>
              </ul>
              
              <h2>6. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
              
              <h2>7. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at 
                least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              
              <h2>8. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p>
                Email: legal@caseflowpro.com<br />
                Address: 123 Legal Tech Drive, Boston, MA 02110<br />
                Phone: (800) 123-4567
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 