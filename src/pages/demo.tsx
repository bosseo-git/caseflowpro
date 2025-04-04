import { useState } from 'react'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { toast } from '@/components/ui/Toaster'
import Image from 'next/image'

type FormValues = {
  name: string
  email: string
  phone: string
  company: string
  firmSize: string
  website: string
  package: string
  source: string
  message: string
}

export default function Demo() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>()
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    
    try {
      // Here would be API call to schedule demo
      console.log('Demo request submitted:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast('Your demo request has been submitted successfully! We\'ll be in touch soon.', 'success')
      setSubmitted(true)
      reset()
    } catch (error) {
      console.error('Error submitting demo request:', error)
      toast('There was an error submitting your request. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Request a Demo | CaseFlowPro</title>
        <meta name="description" content="Schedule a personalized demo of CaseFlowPro, the integrated client intake solution for law firms." />
      </Head>

      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                See CaseFlowPro in Action
              </h1>
              <p className="text-xl text-primary-100">
                Request a personalized demo tailored to your law firm's needs
              </p>
            </div>
          </div>
        </section>

        {/* Demo Request Form */}
        <section className="py-16 bg-white">
          <div className="container px-4 mx-auto">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {submitted ? (
                  <div className="md:col-span-2 text-center py-12">
                    <div className="inline-block p-6 mb-6 bg-green-100 rounded-full">
                      <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Thanks for Requesting a Demo!</h2>
                    <p className="text-lg text-gray-600 mb-8">
                      One of our team members will contact you within 1 business day to schedule your personal demonstration.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn btn-primary"
                    >
                      Request Another Demo
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Form */}
                    <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                      <h2 className="text-2xl font-bold mb-6">Schedule Your Demo</h2>
                      
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                          <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                            Full Name *
                          </label>
                          <input
                            id="name"
                            type="text"
                            className={`input-field w-full ${errors.name ? 'border-red-500' : ''}`}
                            {...register('name', { required: 'Name is required' })}
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                              Email Address *
                            </label>
                            <input
                              id="email"
                              type="email"
                              className={`input-field w-full ${errors.email ? 'border-red-500' : ''}`}
                              {...register('email', { 
                                required: 'Email is required',
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: 'Invalid email address',
                                }
                              })}
                            />
                            {errors.email && (
                              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">
                              Phone Number *
                            </label>
                            <input
                              id="phone"
                              type="tel"
                              className={`input-field w-full ${errors.phone ? 'border-red-500' : ''}`}
                              {...register('phone', { required: 'Phone number is required' })}
                            />
                            {errors.phone && (
                              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="company" className="block mb-1 text-sm font-medium text-gray-700">
                            Law Firm Name *
                          </label>
                          <input
                            id="company"
                            type="text"
                            className={`input-field w-full ${errors.company ? 'border-red-500' : ''}`}
                            {...register('company', { required: 'Law firm name is required' })}
                          />
                          {errors.company && (
                            <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="firmSize" className="block mb-1 text-sm font-medium text-gray-700">
                              Firm Size *
                            </label>
                            <select
                              id="firmSize"
                              className={`input-field w-full ${errors.firmSize ? 'border-red-500' : ''}`}
                              {...register('firmSize', { required: 'Please select your firm size' })}
                            >
                              <option value="">Select firm size</option>
                              <option value="solo">Solo Practice</option>
                              <option value="2-5">2-5 Attorneys</option>
                              <option value="6-20">6-20 Attorneys</option>
                              <option value="21-50">21-50 Attorneys</option>
                              <option value="50+">50+ Attorneys</option>
                            </select>
                            {errors.firmSize && (
                              <p className="mt-1 text-sm text-red-600">{errors.firmSize.message}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="website" className="block mb-1 text-sm font-medium text-gray-700">
                              Website URL
                            </label>
                            <input
                              id="website"
                              type="url"
                              className="input-field w-full"
                              placeholder="https://example.com"
                              {...register('website')}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="package" className="block mb-1 text-sm font-medium text-gray-700">
                            Package Interest *
                          </label>
                          <select
                            id="package"
                            className={`input-field w-full ${errors.package ? 'border-red-500' : ''}`}
                            {...register('package', { required: 'Please select a package' })}
                          >
                            <option value="">Select package</option>
                            <option value="tier-website">Website ($149/month)</option>
                            <option value="tier-messaging">Website + Messaging ($249/month)</option>
                            <option value="tier-complete">Complete Suite ($399/month)</option>
                            <option value="custom">Custom Solution</option>
                            <option value="not-sure">Not Sure Yet</option>
                          </select>
                          {errors.package && (
                            <p className="mt-1 text-sm text-red-600">{errors.package.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="source" className="block mb-1 text-sm font-medium text-gray-700">
                            How did you hear about us?
                          </label>
                          <select
                            id="source"
                            className="input-field w-full"
                            {...register('source')}
                          >
                            <option value="">Select an option</option>
                            <option value="google">Google Search</option>
                            <option value="social">Social Media</option>
                            <option value="referral">Referral</option>
                            <option value="legal-tech-blog">Legal Tech Blog</option>
                            <option value="conference">Conference/Event</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="message" className="block mb-1 text-sm font-medium text-gray-700">
                            Additional Information
                          </label>
                          <textarea
                            id="message"
                            rows={4}
                            className="input-field w-full"
                            placeholder="Tell us about your specific needs or questions"
                            {...register('message')}
                          ></textarea>
                        </div>
                        
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-primary w-full"
                        >
                          {isSubmitting ? 'Submitting Request...' : 'Request Demo'}
                        </button>
                      </form>
                    </div>
                    
                    {/* Info */}
                    <div>
                      <h2 className="text-2xl font-bold mb-6">What to Expect</h2>
                      <p className="mb-8 text-gray-700">
                        During your personalized demo, one of our solution specialists will:
                      </p>
                      
                      <div className="space-y-6">
                        <div className="flex">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 mr-4">
                            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-1">Learn About Your Needs</h3>
                            <p className="text-gray-700">
                              We'll discuss your current intake process and identify specific challenges and goals.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 mr-4">
                            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-1">Personalized Product Tour</h3>
                            <p className="text-gray-700">
                              Walk through how CaseFlowPro works with a focus on features that address your specific needs.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 mr-4">
                            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-1">GoHighLevel Integration</h3>
                            <p className="text-gray-700">
                              See firsthand how CaseFlowPro seamlessly integrates with your GoHighLevel account.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 mr-4">
                            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-1">Q&A Session</h3>
                            <p className="text-gray-700">
                              Get all your questions answered by a product expert who understands the legal industry.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-10 p-6 bg-primary-50 border border-primary-100 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Demo Duration</h3>
                        <p className="text-gray-700 mb-0">
                          Each demo session lasts 30-45 minutes and is conducted via video conference. We'll send you a calendar invite once your request is confirmed.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-gray-600">
                Join hundreds of law firms already using CaseFlowPro
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 mr-4 overflow-hidden rounded-full">
                    <Image src="/images/avatar-1.jpg" alt="Avatar" width={48} height={48} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Sarah Johnson</h3>
                    <p className="text-sm text-gray-600">Family Law Attorney</p>
                  </div>
                </div>
                <p className="italic text-gray-600">
                  "The demo answered all my questions and gave me confidence that CaseFlowPro was the right solution for our firm's intake challenges. Implementation was seamless."
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 mr-4 overflow-hidden rounded-full">
                    <Image src="/images/avatar-2.jpg" alt="Avatar" width={48} height={48} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Michael Rodriguez</h3>
                    <p className="text-sm text-gray-600">Rodriguez Law Group</p>
                  </div>
                </div>
                <p className="italic text-gray-600">
                  "I was skeptical at first, but the personalized demo showed me exactly how CaseFlowPro would solve our specific intake bottlenecks. We've increased conversions by 35%."
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 mr-4 overflow-hidden rounded-full">
                    <Image src="/images/avatar-3.jpg" alt="Avatar" width={48} height={48} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Jennifer Chen</h3>
                    <p className="text-sm text-gray-600">Chen Immigration Law</p>
                  </div>
                </div>
                <p className="italic text-gray-600">
                  "The demo specialist really understood the unique needs of our immigration practice and showed us exactly how to customize the solution for our clients."
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
} 