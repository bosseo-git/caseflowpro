import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>About CaseFlowPro | Law Firm Intake Solution</title>
        <meta name="description" content="Learn about CaseFlowPro, the premier client intake solution built specifically for law firms. Our mission, team, and story." />
      </Head>

      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About CaseFlowPro
              </h1>
              <p className="text-xl text-primary-100">
                We're on a mission to transform the client intake process for law firms
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-white">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="mb-4 text-gray-700">
                CaseFlowPro was founded in 2023 by a team of legal technology experts who recognized a critical pain point in the legal industry: inefficient client intake processes were costing law firms valuable time and potential clients.
              </p>
              <p className="mb-4 text-gray-700">
                Having worked closely with law firms of all sizes, our team saw firsthand how many firms were struggling with disjointed intake systems, missed opportunities, and manual data entry that led to errors and frustration.
              </p>
              <p className="mb-6 text-gray-700">
                We set out to build a solution that would streamline the entire intake process while integrating seamlessly with GoHighLevel, the platform many forward-thinking law firms were already using for marketing automation.
              </p>
              
              <div className="my-10 relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/about-team.jpg"
                  alt="CaseFlowPro Team"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="mb-4 text-gray-700">
                Our mission is to empower law firms to provide exceptional client experiences from the very first interaction. We believe that a streamlined, modern intake process is essential for law firms to thrive in today's competitive legal market.
              </p>
              <p className="mb-6 text-gray-700">
                By automating routine tasks, eliminating data entry errors, and creating multiple channels for potential clients to connect with your firm, CaseFlowPro helps you focus on what matters most: providing excellent legal services to your clients.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Our Core Values</h2>
              <p className="text-gray-700">
                These principles guide everything we do at CaseFlowPro
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-primary-100 rounded-full">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-700">
                  We're constantly pushing the boundaries of what's possible in legal tech to create solutions that delight our users.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-primary-100 rounded-full">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Security</h3>
                <p className="text-gray-700">
                  We treat your client data with the utmost care, implementing robust security measures to protect sensitive information.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-primary-100 rounded-full">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Client-Centric</h3>
                <p className="text-gray-700">
                  We design every feature with our users in mind, aiming to solve real problems for law firms and their clients.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary-800 text-white">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Intake Process?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-primary-100">
              Join hundreds of law firms already using CaseFlowPro to streamline their intake process and grow their practice.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup" className="btn btn-secondary">
                Get Started
              </Link>
              <Link href="/contact" className="btn bg-transparent border border-white hover:bg-primary-700">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
} 