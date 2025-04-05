import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { toast } from '@/components/ui/Toaster'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import ModalDesigner from '@/components/ModalDesigner'

type ModalDesignSettings = {
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

export default function WidgetDesigner() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [savedSettings, setSavedSettings] = useState<ModalDesignSettings | null>(null)

  console.log('Widget Designer - Rendering', { status, session: session?.user?.email })

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    console.log('Widget Designer - User not authenticated, redirecting to login')
    router.push('/login')
    return null
  }

  // Load user's widget settings on component mount
  useEffect(() => {
    console.log('Widget Designer - useEffect triggered', { authenticated: status === 'authenticated' })
    if (status === 'authenticated') {
      loadWidgetSettings()
    }
  }, [status])

  // Load widget settings from the API
  const loadWidgetSettings = async () => {
    console.log('Widget Designer - Loading settings')
    try {
      setIsLoading(true)
      const response = await fetch('/api/widget-settings')
      const data = await response.json()
      
      console.log('Widget Designer - Settings loaded', { 
        success: response.ok, 
        status: response.status,
        hasSettings: !!data.settings
      })
      
      if (data.settings) {
        setSavedSettings(data.settings as ModalDesignSettings)
      }
    } catch (error) {
      console.error('Error loading widget settings:', error)
      toast('Failed to load widget settings', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle when modal settings are saved
  const handleSaveSettings = async (settings: ModalDesignSettings) => {
    try {
      setIsSaving(true)
      
      // Save settings to the API
      const response = await fetch('/api/widget-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSavedSettings(settings)
        toast('Modal design saved successfully!', 'success')
      } else {
        throw new Error(data.error || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving modal settings:', error)
      toast('Failed to save modal settings', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Widget Designer | CaseFlowPro</title>
        <meta
          name="description"
          content="Design and customize your client intake widget appearance and behavior"
        />
      </Head>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Widget Designer</h1>
          <p className="mt-2 text-sm text-gray-500">
            Create and customize your client intake widget for your website. Design the appearance, 
            add your branding colors, and configure how it behaves to optimize client conversions.
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Widget Placement</h2>
              <p className="mt-1 text-sm text-gray-500">
                Add this code to your website to display your intake widget.
              </p>
            </div>
            <div className="bg-gray-50 rounded-md p-4">
              <pre className="text-sm text-gray-800 overflow-x-auto">
                {`<script src="https://caseflowpro.vercel.app/api/widget/${session?.user?.id}" async></script>`}
              </pre>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `<script src="https://caseflowpro.vercel.app/api/widget/${session?.user?.id}" async></script>`
                  )
                  toast('Widget code copied to clipboard!', 'success')
                }}
                className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Copy Code
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white shadow rounded-lg p-6 flex items-center justify-center h-64">
              <div className="text-center">
                <svg 
                  className="animate-spin h-8 w-8 text-primary-500 mx-auto mb-4" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  ></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-gray-500">Loading your widget settings...</p>
              </div>
            </div>
          ) : (
            <ModalDesigner
              onSave={handleSaveSettings}
              initialSettings={savedSettings || undefined}
            />
          )}

          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Form Fields</h2>
              <p className="mt-1 text-sm text-gray-500">
                Configure which fields to collect in your intake form.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-md p-6 flex flex-col items-center justify-center">
              <p className="text-sm text-gray-500">Form field configuration coming soon!</p>
              <p className="text-xs text-gray-400 mt-1">
                You'll be able to add, remove, and reorder form fields in a future update.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 