import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import Head from 'next/head'
import { signIn, useSession } from 'next-auth/react'
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
  const { data: session, status } = useSession()
  const { plan: planFromQuery } = router.query
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>()
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/dashboard')
    }
  }, [session, status, router])
  
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
    
    setIsSubmitting(true)
    
    try {
      // Call our API endpoint for registration
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          firmName: data.firmName,
          firmSize: data.firmSize,
          website: data.website,
        }),
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong')
      }
      
      toast('Account created successfully! Signing you in...', 'success')
      
      // Automatically sign in the user
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password
      })
      
      if (signInResult?.error) {
        // If sign-in fails, still redirect to login
        toast('Account created. Please log in.', 'success')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        // If sign-in succeeds, redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (error) {
      console.error('Error during signup:', error)
      toast(error instanceof Error ? error.message : 'There was an error creating your account. Please try again.', 'error')
      setIsSubmitting(false)
    }
  }
  
  if (status === 'loading') {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    )
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Sign Up | CaseFlowPro</title>
        <meta name="description" content="Create your CaseFlowPro account and start managing your law firm's client intake process." />
      </Head>
      
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="mb-6 text-3xl font-bold text-center">Create Your CaseFlowPro Account</h1>
            <p className="mb-8 text-center text-gray-600">
              Get started with your law firm intake widget that integrates with all popular CRMs
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
            
            <div className="flex flex-col space-y-4">
              <button
                type="button"
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                className="btn btn-outline w-full flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C8.849 2 5.58 4.152 3.875 7.258c-.857 1.562-1.346 3.354-1.346 5.258 0 1.904.489 3.696 1.346 5.258 1.706 3.107 4.975 5.258 8.67 5.258 4.783 0 8.913-3.477 9.693-8.174A9.798 9.798 0 0022.57 12.5c0-.705-.06-1.41-.179-2.082z"
                  ></path>
                </svg>
                Sign up with Google
              </button>
              
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white text-sm text-gray-500">Or sign up with email</span>
                </div>
              </div>
            </div>
            
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