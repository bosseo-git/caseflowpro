import { useState } from 'react'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { toast } from '@/components/ui/Toaster'

type FormValues = {
  name: string
  email: string
  phone: string
  company: string
  message: string
}

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>()
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    
    try {
      // Here would be API call to send the message
      console.log('Form submitted:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast('Your message has been sent successfully! We\'ll get back to you soon.', 'success')
      reset()
    } catch (error) {
      console.error('Error sending message:', error)
      toast('There was an error sending your message. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Contact Us | CaseFlowPro</title>
        <meta name="description" content="Get in touch with the CaseFlowPro team. We're here to answer your questions about our law firm intake solution." />
      </Head>

      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Contact Us
              </h1>
              <p className="text-xl text-primary-100">
                We're here to help with any questions you have about CaseFlowPro
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 bg-white">
          <div className="container px-4 mx-auto">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                  <p className="mb-8 text-gray-700">
                    Have questions about CaseFlowPro or need help getting started? Our team is ready to assist you.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 mr-4">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">Phone</h3>
                        <p className="text-gray-700">(800) 123-4567</p>
                        <p className="text-sm text-gray-500 mt-1">Monday - Friday, 9am - 5pm EST</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 mr-4">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">Email</h3>
                        <p className="text-gray-700">support@caseflowpro.com</p>
                        <p className="text-sm text-gray-500 mt-1">We'll respond as quickly as possible</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 mr-4">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">Office</h3>
                        <p className="text-gray-700">123 Legal Tech Drive</p>
                        <p className="text-gray-700">Boston, MA 02110</p>
                        <p className="text-sm text-gray-500 mt-1">By appointment only</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Contact Form */}
                <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                        Full Name
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
                    
                    <div>
                      <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                        Email Address
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">
                          Phone (Optional)
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          className="input-field w-full"
                          {...register('phone')}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="company" className="block mb-1 text-sm font-medium text-gray-700">
                          Company/Firm (Optional)
                        </label>
                        <input
                          id="company"
                          type="text"
                          className="input-field w-full"
                          {...register('company')}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block mb-1 text-sm font-medium text-gray-700">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        className={`input-field w-full ${errors.message ? 'border-red-500' : ''}`}
                        {...register('message', { 
                          required: 'Message is required',
                          minLength: {
                            value: 10,
                            message: 'Message must be at least 10 characters',
                          }
                        })}
                      ></textarea>
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                      )}
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary w-full"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-2">How quickly can I get set up with CaseFlowPro?</h3>
                  <p className="text-gray-700">
                    Most firms are able to complete the setup process within 1-2 business days. Our team will guide you through the entire process, including GoHighLevel integration.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-2">Do I need to have a GoHighLevel account already?</h3>
                  <p className="text-gray-700">
                    Yes, CaseFlowPro integrates with your existing GoHighLevel account. If you don't have one yet, we can provide guidance on setting that up as well.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-2">Can I customize the widget to match my website's branding?</h3>
                  <p className="text-gray-700">
                    Absolutely! CaseFlowPro offers extensive customization options, including colors, button text, placement, and form fields to match your firm's branding.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-2">Is there a contract or can I cancel anytime?</h3>
                  <p className="text-gray-700">
                    CaseFlowPro is billed monthly with no long-term contract. You can upgrade, downgrade, or cancel your subscription at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
} 