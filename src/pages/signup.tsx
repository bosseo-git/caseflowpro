import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { toast } from '@/components/ui/Toaster'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type FormValues = {
  name: string
  email: string
  password: string
  firmName: string
  firmSize: string
  website: string
  agreeTerms: boolean
}

const planData = {
  'tier-website': {
    name: 'Website',
    price: '$149',
    description: 'AI intake for your law firm website.',
  },
  'tier-messaging': {
    name: 'Website + Messaging',
    price: '$249',
    description: 'Everything in Website, plus SMS and WhatsApp integration.',
  },
  'tier-complete': {
    name: 'Complete Suite',
    price: '$399',
    description: 'Full AI intake solution with voice capabilities.',
  },
}

export default function SignUp() {
  const router = useRouter()
  const { plan: planFromQuery } = router.query
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormValues>()
  
  useEffect(() => {
    if (planFromQuery && typeof planFromQuery === 'string' && planData[planFromQuery as keyof typeof planData]) {
      setSelectedPlan(planFromQuery)
    }
  }, [planFromQuery])
  
  const onSubmit = async (data: FormValues) => {
    if (!selectedPlan) {
      toast('Please select a plan to continue', 'error')
      return
    }
    
    try {
      // Here you would connect to your backend for user registration
      // And Stripe integration for payment
      console.log('Form submitted:', { ...data, plan: selectedPlan })
      
      // Simulate successful registration
      toast('Account created successfully! Redirecting to payment...', 'success')
      
      // In a real implementation, redirect to checkout
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Error during signup:', error)
      toast('There was an error creating your account. Please try again.', 'error')
    }
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="mb-6 text-3xl font-bold text-center">Create Your CaseFlowPro Account</h1>
            <p className="mb-8 text-center text-gray-600">
              Get started with your law firm intake widget with GoHighLevel integration
            </p>
            
            {!selectedPlan && (
              <div className="mb-10">
                <h2 className="mb-6 text-xl font-semibold text-center">Select Your Plan</h2>
                <div className="grid gap-6 md:grid-cols-3">
                  {Object.entries(planData).map(([planId, plan]) => (
                    <div 
                      key={planId}
                      className={`p-6 border rounded-lg cursor-pointer ${
                        selectedPlan === planId
                          ? 'border-primary-600 ring-2 ring-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                      onClick={() => setSelectedPlan(planId)}
                    >
                      <h3 className="mb-2 text-lg font-semibold">{plan.name}</h3>
                      <p className="mb-4 text-gray-600">{plan.description}</p>
                      <p className="text-2xl font-bold text-primary-600">{plan.price}<span className="text-sm font-normal text-gray-500">/month</span></p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedPlan && (
              <div className="p-6 mb-8 border rounded-lg bg-primary-50 border-primary-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Selected Plan: {planData[selectedPlan as keyof typeof planData].name}</h3>
                    <p className="text-gray-600">{planData[selectedPlan as keyof typeof planData].price}/month</p>
                  </div>
                  <button 
                    onClick={() => setSelectedPlan(null)}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    Change Plan
                  </button>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={`input ${errors.name ? 'border-red-500' : ''}`}
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`input ${errors.email ? 'border-red-500' : ''}`}
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
              </div>
              
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className={`input ${errors.password ? 'border-red-500' : ''}`}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    }
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="firmName" className="block mb-2 text-sm font-medium text-gray-700">
                  Law Firm Name
                </label>
                <input
                  id="firmName"
                  type="text"
                  className={`input ${errors.firmName ? 'border-red-500' : ''}`}
                  {...register('firmName', { required: 'Firm name is required' })}
                />
                {errors.firmName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firmName.message}</p>
                )}
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="firmSize" className="block mb-2 text-sm font-medium text-gray-700">
                    Firm Size
                  </label>
                  <select
                    id="firmSize"
                    className={`input ${errors.firmSize ? 'border-red-500' : ''}`}
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
                  <label htmlFor="website" className="block mb-2 text-sm font-medium text-gray-700">
                    Website URL
                  </label>
                  <input
                    id="website"
                    type="url"
                    className={`input ${errors.website ? 'border-red-500' : ''}`}
                    placeholder="https://example.com"
                    {...register('website', { 
                      required: 'Website URL is required',
                      pattern: {
                        value: /^(http|https):\/\/[^ "]+$/,
                        message: 'Please enter a valid URL',
                      }
                    })}
                  />
                  {errors.website && (
                    <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <input
                  id="agreeTerms"
                  type="checkbox"
                  className="w-4 h-4 mt-1 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
                  {...register('agreeTerms', { 
                    required: 'You must agree to the terms and conditions' 
                  })}
                />
                <label htmlFor="agreeTerms" className="block ml-2 text-sm text-gray-700">
                  I agree to the <Link href="/terms" className="text-primary-600 hover:text-primary-800">Terms of Service</Link> and <Link href="/privacy" className="text-primary-600 hover:text-primary-800">Privacy Policy</Link>
                </label>
                {errors.agreeTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.agreeTerms.message}</p>
                )}
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn btn-primary"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
              
              <p className="text-center text-gray-600">
                Already have an account? <Link href="/login" className="text-primary-600 hover:text-primary-800">Log in</Link>
              </p>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 