import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

// Interface for widget settings
interface WidgetSettings {
  theme: 'default' | 'minimal' | 'bordered' | 'dark' | 'branded'
  title: string
  message: string
  buttonLabel: string
  size: 'sm' | 'md' | 'lg' | 'xl'
  animation: 'fade' | 'scale' | 'slide'
  position: 'center' | 'top'
  primaryColor: string
  autoClose: boolean
  autoCloseDelay: number
  showCloseButton: boolean
}

// Default settings
const defaultSettings: WidgetSettings = {
  theme: 'default',
  title: 'Get in Touch',
  message: 'Please fill out this form to get started with your case evaluation.',
  buttonLabel: 'Submit',
  size: 'md',
  animation: 'scale',
  position: 'center',
  primaryColor: '#4F46E5',
  autoClose: false,
  autoCloseDelay: 5,
  showCloseButton: true,
}

export default function WidgetPage() {
  const router = useRouter()
  const { userId } = router.query
  
  const [settings, setSettings] = useState<WidgetSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  
  // Fetch settings when userId is available
  useEffect(() => {
    if (typeof userId === 'string') {
      fetchSettings(userId)
    }
  }, [userId])
  
  // Send message to parent window to close iframe
  const closeWidget = () => {
    if (window.parent) {
      window.parent.postMessage('caseflowpro:close', '*')
    }
  }
  
  // Fetch user settings
  const fetchSettings = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/widget-settings?userId=${id}`)
      const data = await response.json()
      
      if (data.settings) {
        setSettings({ ...defaultSettings, ...data.settings })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      setError('Failed to load widget settings')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userId || typeof userId !== 'string') {
      setError('Invalid user ID')
      return
    }
    
    // Validate email
    if (!formData.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)) {
      setError('Please enter a valid email address')
      return
    }
    
    try {
      setSubmitting(true)
      setError(null)
      
      const response = await fetch('/api/intake-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId,
          timestamp: new Date().toISOString(),
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSubmitted(true)
        
        // Auto close if enabled
        if (settings.autoClose) {
          setTimeout(closeWidget, settings.autoCloseDelay * 1000)
        }
      } else {
        throw new Error(data.error || 'Failed to submit form')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setError('There was an error submitting your request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  
  // Define theme classes based on settings.theme
  const getThemeClasses = () => {
    switch (settings.theme) {
      case 'dark':
        return {
          backdrop: 'bg-black/80',
          container: 'bg-gray-800 text-white',
          header: 'bg-gray-900 border-b border-gray-700',
          title: 'text-white',
          desc: 'text-gray-300',
          label: 'text-gray-300',
          input: 'bg-gray-700 border-gray-600 text-white',
          button: `bg-${settings.primaryColor} text-white`,
          closeBtn: 'text-gray-400 hover:text-gray-300',
        }
      case 'branded':
        return {
          backdrop: 'bg-black/50',
          container: 'bg-white text-gray-900',
          header: `bg-[${settings.primaryColor}] text-white`,
          title: 'text-white',
          desc: 'text-white/80',
          label: 'text-gray-700',
          input: 'bg-white border-gray-300 text-gray-900',
          button: `bg-[${settings.primaryColor}] text-white`,
          closeBtn: 'text-white/80 hover:text-white',
        }
      case 'minimal':
        return {
          backdrop: 'bg-black/50',
          container: 'bg-white text-gray-900 shadow-none',
          header: 'bg-white',
          title: 'text-gray-900',
          desc: 'text-gray-500',
          label: 'text-gray-700',
          input: 'bg-white border-gray-300 text-gray-900',
          button: `bg-[${settings.primaryColor}] text-white`,
          closeBtn: 'text-gray-400 hover:text-gray-500',
        }
      case 'bordered':
        return {
          backdrop: 'bg-black/50',
          container: 'bg-white text-gray-900 border-2 border-gray-300',
          header: 'bg-gray-50 border-b border-gray-300',
          title: 'text-gray-900 font-bold',
          desc: 'text-gray-500',
          label: 'text-gray-700',
          input: 'bg-white border-gray-300 text-gray-900',
          button: `bg-[${settings.primaryColor}] text-white`,
          closeBtn: 'text-gray-400 hover:text-gray-500',
        }
      default: // 'default'
        return {
          backdrop: 'bg-black/50',
          container: 'bg-white text-gray-900',
          header: 'bg-white border-b border-gray-200',
          title: 'text-gray-900',
          desc: 'text-gray-500',
          label: 'text-gray-700',
          input: 'bg-white border-gray-300 text-gray-900',
          button: `bg-[${settings.primaryColor}] text-white`,
          closeBtn: 'text-gray-400 hover:text-gray-500',
        }
    }
  }
  
  const theme = getThemeClasses()
  
  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }
  
  // Position classes
  const positionClasses = {
    center: 'items-center',
    top: 'items-start pt-16',
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black/50">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }
  
  return (
    <>
      <Head>
        <title>{settings.title} | CaseFlowPro</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style jsx global>{`
          body {
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, sans-serif;
            overflow: hidden;
          }
        `}</style>
      </Head>
      
      {/* Backdrop */}
      <div className={`fixed inset-0 ${theme.backdrop}`} onClick={closeWidget}></div>
      
      {/* Modal Container */}
      <div className={`flex min-h-screen justify-center ${positionClasses[settings.position]} p-4`}>
        <div className={`relative w-full ${sizeClasses[settings.size]} rounded-lg overflow-hidden shadow-xl ${theme.container}`}>
          {/* Header */}
          <div className={`px-4 py-3 ${theme.header}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-medium ${theme.title}`}>{settings.title}</h2>
              {settings.showCloseButton && (
                <button
                  type="button"
                  className={`rounded-md bg-transparent p-1 ${theme.closeBtn}`}
                  onClick={closeWidget}
                >
                  <span className="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Body */}
          <div className="p-6">
            {!submitted ? (
              <>
                <p className={`mb-4 text-sm ${theme.desc}`}>{settings.message}</p>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className={`block text-sm font-medium ${theme.label} mb-1`}>
                        Your Name*
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md ${theme.input} shadow-sm px-3 py-2 text-sm`}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className={`block text-sm font-medium ${theme.label} mb-1`}>
                        Email Address*
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md ${theme.input} shadow-sm px-3 py-2 text-sm`}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className={`block text-sm font-medium ${theme.label} mb-1`}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md ${theme.input} shadow-sm px-3 py-2 text-sm`}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className={`block text-sm font-medium ${theme.label} mb-1`}>
                        Brief Description of Your Case
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md ${theme.input} shadow-sm px-3 py-2 text-sm`}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                        submitting ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                      style={{ backgroundColor: settings.primaryColor, color: 'white' }}
                    >
                      {submitting ? 'Submitting...' : settings.buttonLabel}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className={`text-lg font-medium ${theme.title} mb-2`}>Thank You!</h3>
                <p className={`text-sm ${theme.desc}`}>
                  Your information has been submitted successfully. We'll be in touch soon.
                </p>
                <button
                  type="button"
                  onClick={closeWidget}
                  className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-primary-100 px-4 py-2 text-sm font-medium text-primary-900 hover:bg-primary-200 focus:outline-none"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
} 