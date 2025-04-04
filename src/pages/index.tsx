import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { CheckIcon } from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import dynamic from 'next/dynamic'

// Dynamically import the Lottie component with SSR disabled
const Lottie = dynamic(() => import('lottie-react'), { 
  ssr: false,
  loading: () => <div style={{ height: 400 }} className="rounded-lg bg-gray-100 animate-pulse" />
})

// Import the animation data
import animationData from './images/Animation - 1743791739377.json'

const tiers = [
  {
    name: 'Website',
    id: 'tier-website',
    price: '$149',
    description: 'Intake widget for your law firm website.',
    features: [
      'Website Widget with 4 Contact Options',
      'Customizable Intake Forms',
      'Client Dashboard',
      'CRM Integration',
      'Basic Analytics',
    ],
    cta: 'Start with Website',
    mostPopular: false,
  },
  {
    name: 'Website + Messaging',
    id: 'tier-messaging',
    price: '$249',
    description: 'Advanced form customization and messaging capabilities.',
    features: [
      'Website Widget with 4 Contact Options',
      'Advanced Form Customization',
      'Client Dashboard',
      'CRM Integration',
      'SMS Automation Workflows',
      'WhatsApp Integration',
      'Chat History & Analytics',
    ],
    cta: 'Start with Messaging',
    mostPopular: true,
  },
  {
    name: 'Complete Suite',
    id: 'tier-complete',
    price: '$399',
    description: 'Full intake solution with advanced automations.',
    features: [
      'Website Widget with 4 Contact Options',
      'Advanced Form Customization',
      'Client Dashboard',
      'CRM Integration',
      'SMS Automation Workflows',
      'WhatsApp Integration',
      'Chat History & Analytics',
      'Custom Branding',
      'Advanced CRM Automations',
      'Marketing Campaign Integration',
      'Priority Support',
    ],
    cta: 'Start with Complete',
    mostPopular: false,
  },
]

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)

  // Only render Lottie after component is mounted
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero */}
        <section className="py-12 md:py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Transform Your Law Firm's Client Intake Process
                </h1>
                <p className="text-xl mb-8">
                  CaseFlowPro connects your website directly with your law firm CRM, creating a seamless client intake experience.
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link
                    href="/signup"
                    className="btn-white"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="#features"
                    className="btn-outline-white"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                {isMounted ? (
                  <Lottie 
                    animationData={animationData} 
                    className="rounded-lg" 
                    style={{ height: 400 }}
                  />
                ) : (
                  <div style={{ height: 400 }} className="rounded-lg bg-gray-100" />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <h2 className="mb-12 text-3xl font-bold text-center md:text-4xl">How CaseFlowPro Works</h2>
            
            <div className="grid gap-8 md:grid-cols-4">
              <div className="p-6 text-center card">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Call Now</h3>
                <p className="text-gray-600">
                  Potential clients can call your firm directly with one click from your website.
                </p>
              </div>
              
              <div className="p-6 text-center card">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">SMS Contact</h3>
                <p className="text-gray-600">
                  Collect client information through a customizable form that integrates with your CRM.
                </p>
              </div>
              
              <div className="p-6 text-center card">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">WhatsApp</h3>
                <p className="text-gray-600">
                  Allow clients to reach you instantly via WhatsApp with a single click.
                </p>
              </div>
              
              <div className="p-6 text-center card">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Case Value</h3>
                <p className="text-gray-600">
                  Potential clients can submit case details through a customized form to get a valuation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="py-20 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Universal CRM Integration</h2>
              <p className="text-lg text-gray-600">
                CaseFlowPro connects with all popular law firm CRMs, Zapier, Make, and more, making client intake effortless and efficient.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary-100">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold">Instant Lead Creation</h3>
                <p className="text-gray-600">
                  Form submissions automatically create new leads in your CRM with all the information you need.
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary-100">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold">Workflow Automation</h3>
                <p className="text-gray-600">
                  Trigger automated follow-up sequences, task assignments, and notifications through your CRM or automation tools like Zapier and Make.
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary-100">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold">Custom Form Mapping</h3>
                <p className="text-gray-600">
                  Map each field from your intake forms to specific fields in your law firm CRM for complete control over your data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-gray-100">
          <div className="container px-4 mx-auto">
            <h2 className="mb-4 text-3xl font-bold text-center md:text-4xl">Simple, Transparent Pricing</h2>
            <p className="max-w-2xl mx-auto mb-12 text-center text-gray-600">
              Choose the plan that works best for your law firm. All plans include unlimited leads and cases.
            </p>
            
            <div className="grid gap-8 lg:grid-cols-3">
              {tiers.map((tier) => (
                <div key={tier.id} className={`flex flex-col h-full overflow-hidden rounded-lg ${
                  tier.mostPopular 
                    ? 'ring-2 ring-primary-600 scale-105 shadow-xl' 
                    : 'border border-gray-200'
                }`}>
                  <div className="px-6 py-8 bg-white">
                    {tier.mostPopular && (
                      <p className="py-1.5 px-4 bg-primary-600 text-white text-xs font-semibold tracking-wide uppercase rounded-full inline-block mb-4">
                        Most Popular
                      </p>
                    )}
                    <h3 className="text-2xl font-semibold">{tier.name}</h3>
                    <p className="mt-2 text-gray-600">{tier.description}</p>
                    <p className="mt-6">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      <span className="text-gray-500">/month</span>
                    </p>
                  </div>
                  <div className="flex-grow px-6 pt-6 pb-8 bg-white border-t border-gray-100">
                    <ul className="mb-8 space-y-4">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <CheckIcon className="flex-shrink-0 w-5 h-5 mr-3 text-green-500" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link 
                      href={`/signup?plan=${tier.id}`}
                      className={`block w-full py-3 text-center rounded-md ${
                        tier.mostPopular 
                          ? 'btn-primary' 
                          : 'bg-white border border-primary-600 text-primary-600 hover:bg-primary-50'
                      }`}
                    >
                      {tier.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <h2 className="mb-12 text-3xl font-bold text-center md:text-4xl">What Clients Say</h2>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-6 card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 mr-4 overflow-hidden rounded-full">
                    <Image src="/images/avatar-1.jpg" alt="Avatar" width={48} height={48} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-gray-600">Family Law Attorney</p>
                  </div>
                </div>
                <p className="italic text-gray-600">
                  "CaseFlowPro has completely transformed our intake process. We're capturing leads 24/7 and our consultation bookings have increased by 40%."
                </p>
              </div>
              
              <div className="p-6 card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 mr-4 overflow-hidden rounded-full">
                    <Image src="/images/avatar-2.jpg" alt="Avatar" width={48} height={48} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Michael Rodriguez</h4>
                    <p className="text-sm text-gray-600">Rodriguez Law Group</p>
                  </div>
                </div>
                <p className="italic text-gray-600">
                  "The integration with our CRM is seamless. Our workflow automation saves hours of manual work, and the lead quality has improved dramatically."
                </p>
              </div>
              
              <div className="p-6 card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 mr-4 overflow-hidden rounded-full">
                    <Image src="/images/avatar-3.jpg" alt="Avatar" width={48} height={48} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Jennifer Chen</h4>
                    <p className="text-sm text-gray-600">Chen Immigration Law</p>
                  </div>
                </div>
                <p className="italic text-gray-600">
                  "Our clients love having multiple ways to contact us. The case value button has been especially effective for filtering high-value cases."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-white bg-primary-800">
          <div className="container px-4 mx-auto text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Ready to Transform Your Intake Process?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-primary-100">
              Join hundreds of law firms already using CaseFlowPro to streamline their intake process and grow their practice.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup" className="btn btn-secondary">
                Get Started
              </Link>
              <Link href="/demo" className="btn bg-transparent border border-white hover:bg-primary-700">
                Request Demo
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
} 