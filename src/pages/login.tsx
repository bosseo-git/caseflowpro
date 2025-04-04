import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { signIn, useSession } from 'next-auth/react'
import { toast } from '@/components/ui/Toaster'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type FormValues = {
  email: string
  password: string
  rememberMe: boolean
}

export default function Login() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false)
  const [detailedError, setDetailedError] = useState<string | null>(null)
  const { error, callbackUrl } = router.query

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  // Fix for useLayoutEffect warning on server - use isClient to ensure we're on the client
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (isClient && status === 'authenticated' && session) {
      router.push('/dashboard')
    }
  }, [session, status, router, isClient])

  // Handle error messages from NextAuth
  useEffect(() => {
    if (!isClient) return

    if (error) {
      console.error('Authentication error:', error)
      
      if (error === 'CredentialsSignin') {
        toast('Invalid email or password', 'error')
      } else if (error === 'Callback') {
        const errorMsg = 'Authentication error during callback. This is often caused by cookie or database issues.'
        toast(errorMsg, 'error')
        setDetailedError(`Error type: ${error}. This usually means the database couldn't create or find the user record. Check the database connection and permissions.`)
      } else if (error === 'OAuthSignin') {
        toast('Error starting Google sign-in. Please try again.', 'error')
        setDetailedError('Failed to initialize the OAuth sign-in process with Google.')
      } else if (error === 'OAuthCallback') {
        toast('Error during Google callback. Please try again.', 'error') 
        setDetailedError('Google authenticated you successfully but there was an error during the callback to our site.')
      } else if (error === 'OAuthCreateAccount') {
        toast('Error creating account with Google credentials.', 'error')
        setDetailedError('We couldn\'t create an account using your Google credentials. This might be a database issue.')
      } else if (error === 'AccessDenied') {
        toast('Access denied. You may not have permission to sign in.', 'error')
      } else {
        toast(`Authentication error: ${error}`, 'error')
        setDetailedError(`Unrecognized error type: ${error}. Check the console logs for more information.`)
      }
    }
  }, [error, isClient])

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password
      })
      
      if (result?.error) {
        toast('Invalid email or password', 'error')
      } else if (result?.ok) {
        toast('Login successful!', 'success')
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }
    } catch (error) {
      console.error('Login error:', error)
      toast('An error occurred during login', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleSigningIn(true)
      setDetailedError(null)
      
      // For Google sign-in, it's often better to allow the redirect
      // instead of handling it in client-side JS
      const destination = typeof callbackUrl === 'string' ? callbackUrl : '/dashboard'
      
      await signIn('google', { 
        callbackUrl: destination,
        redirect: true
      })
    } catch (error) {
      console.error('Google sign-in error:', error)
      toast('An error occurred during Google sign-in', 'error')
      setIsGoogleSigningIn(false)
      setDetailedError(`Error during Google sign-in: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // Function to test database connection (for debugging)
  const testDatabaseConnection = async () => {
    try {
      const response = await fetch('/api/test-db')
      const data = await response.json()
      
      if (data.success) {
        toast('Database connection successful!', 'success')
        setDetailedError(`Database info: ${JSON.stringify(data.details, null, 2)}`)
      } else {
        toast('Database connection failed!', 'error')
        setDetailedError(`Database error: ${JSON.stringify(data.details, null, 2)}`)
      }
    } catch (error) {
      toast('Error testing database connection', 'error')
      setDetailedError(`Error: ${error instanceof Error ? error.message : String(error)}`)
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
        <title>Log In | CaseFlowPro</title>
        <meta name="description" content="Log in to your CaseFlowPro account to manage your law firm's client intake process." />
      </Head>

      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 bg-gray-50">
        <div className="w-full max-w-md px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Log in to CaseFlowPro</h1>
              <p className="text-gray-600">
                Access your dashboard and manage your intake widget
              </p>
            </div>
            
            {detailedError && (
              <div className="mb-6 p-4 border border-red-300 bg-red-50 rounded-md">
                <h3 className="text-sm font-medium text-red-800 mb-1">Detailed Error Information</h3>
                <p className="text-xs text-red-700 whitespace-pre-wrap">{detailedError}</p>
                {process.env.NODE_ENV === 'development' && (
                  <button 
                    onClick={testDatabaseConnection}
                    className="mt-2 text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded"
                  >
                    Test Database Connection
                  </button>
                )}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className={`input-field w-full ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="you@example.com"
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
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-800">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  className={`input-field w-full ${errors.password ? 'border-red-500' : ''}`}
                  {...register('password', { required: 'Password is required' })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
              
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  {...register('rememberMe')}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting ? 'Logging in...' : 'Log In'}
              </button>
              
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white text-sm text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleSigningIn}
                className="btn btn-outline w-full flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C8.849 2 5.58 4.152 3.875 7.258c-.857 1.562-1.346 3.354-1.346 5.258 0 1.904.489 3.696 1.346 5.258 1.706 3.107 4.975 5.258 8.67 5.258 4.783 0 8.913-3.477 9.693-8.174A9.798 9.798 0 0022.57 12.5c0-.705-.06-1.41-.179-2.082z"
                  ></path>
                </svg>
                {isGoogleSigningIn ? 'Connecting to Google...' : 'Sign in with Google'}
              </button>
              
              <p className="text-center text-gray-600 mt-6">
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary-600 hover:text-primary-800">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 