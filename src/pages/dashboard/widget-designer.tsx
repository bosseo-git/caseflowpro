import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/DashboardLayout'
import ModalDesigner from '@/components/ModalDesigner'
import WidgetPreview from '@/components/WidgetPreview'
import { EyeIcon } from '@heroicons/react/24/outline'

// Define widget design settings type
type WidgetPosition = 'right' | 'left'
type WidgetLayout = 'classic' | 'modern' | 'circles' | 'compact' | 'minimalist'
type ModalTheme = 'default' | 'minimal' | 'bordered' | 'dark' | 'branded'

type WidgetDesignSettings = {
  theme: ModalTheme
  layout: WidgetLayout
  position: WidgetPosition
  primaryColor: string
  secondaryColor: string
  startMinimized: boolean
  fixedToBottomRight: boolean
  buttonPadding: 'sm' | 'md' | 'lg'
  borderRadius: 'sm' | 'md' | 'lg' | 'full'
  showLabels: boolean
  animation: 'fade' | 'scale' | 'slide'
  buttonLabels: {
    call: string
    sms: string
    whatsapp: string
    chat: string
  }
  buttonColors: {
    call: string
    sms: string
    whatsapp: string
    chat: string
  }
}

export default function WidgetDesigner() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [savedSettings, setSavedSettings] = useState<WidgetDesignSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isShowingDesigner, setIsShowingDesigner] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [code, setCode] = useState<string>('')
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Clear messages after a delay
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null)
        setSuccessMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage, successMessage])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Load widget settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      if (!session?.user?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await fetch(`/api/widget-settings?userId=${session.user.id}`)
        const data = await response.json()

        if (data.settings) {
          setSavedSettings(data.settings as WidgetDesignSettings)
          
          // Generate embed code
          const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://caseflowpro.vercel.app'
          const embedCode = `<script src="${baseUrl}/api/widget/${session.user.id}" async></script>`
          setCode(embedCode)
        }
      } catch (error) {
        console.error('Error fetching widget settings:', error)
        setErrorMessage('Failed to load widget settings')
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user?.id) {
      fetchSettings()
    }
  }, [session])

  const handleSaveSettings = async (settings: WidgetDesignSettings) => {
    if (!session?.user?.id) {
      setErrorMessage('User session expired. Please log in again.')
      return
    }

    try {
      setIsSaving(true)
      const response = await fetch('/api/widget-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          settings,
        }),
      })

      if (response.ok) {
        setSavedSettings(settings)
        setIsShowingDesigner(false)
        setSuccessMessage('Widget design saved successfully!')
      } else {
        setErrorMessage('Failed to save widget settings')
      }
    } catch (error) {
      console.error('Error saving widget settings:', error)
      setErrorMessage('Error saving widget settings')
    } finally {
      setIsSaving(false)
    }
  }

  const copyCodeToClipboard = () => {
    if (!code) {
      setErrorMessage('No code available to copy')
      return
    }
    
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(code)
          .then(() => {
            setShowCopiedMessage(true)
            setSuccessMessage('Widget code copied to clipboard!')
            setTimeout(() => {
              setShowCopiedMessage(false)
            }, 2000)
          })
          .catch((err) => {
            console.error('Could not copy code: ', err)
            setErrorMessage('Could not copy code to clipboard')
          })
      } else {
        // Fallback method for copying
        const textArea = document.createElement('textarea')
        textArea.value = code
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          const successful = document.execCommand('copy')
          if (successful) {
            setShowCopiedMessage(true)
            setSuccessMessage('Widget code copied to clipboard!')
            setTimeout(() => setShowCopiedMessage(false), 2000)
          } else {
            setErrorMessage('Failed to copy code to clipboard')
          }
        } catch (err) {
          console.error('Fallback: Unable to copy', err)
          setErrorMessage('Unable to copy code to clipboard')
        }
        document.body.removeChild(textArea)
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      setErrorMessage('Error copying to clipboard')
    }
  }

  const openPreview = () => {
    setIsPreviewOpen(true)
  }

  // Safely render the component
  if (status === 'loading') {
    return <DashboardLayout>
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    </DashboardLayout>
  }

  return (
    <DashboardLayout>      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Inline notification messages */}
        {errorMessage && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {errorMessage}
            <button 
              className="absolute right-0 top-0 mt-3 mr-4" 
              onClick={() => setErrorMessage(null)}
            >
              <span className="text-red-500">&times;</span>
            </button>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            {successMessage}
            <button 
              className="absolute right-0 top-0 mt-3 mr-4" 
              onClick={() => setSuccessMessage(null)}
            >
              <span className="text-green-500">&times;</span>
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Widget Designer</h1>
          {savedSettings && (
            <button
              onClick={openPreview}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <EyeIcon className="h-5 w-5 mr-2" />
              Preview Widget
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-medium mb-2">Website Widget</h2>
          <p className="text-gray-600 mb-6">
            Customize your widget's appearance and behavior, then add the widget to your website by copying the code below.
          </p>

          {isLoading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="mb-4 md:mb-0 w-full md:w-2/3">
                  <h3 className="text-lg font-medium mb-2">Appearance Settings</h3>
                  {savedSettings ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600">
                        You can customize the appearance of your widget by clicking the "Edit Design" button below.
                      </p>
                      <button
                        onClick={() => setIsShowingDesigner(true)}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Edit Design
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600">
                        You haven't set up your widget yet. Click the button below to design your widget.
                      </p>
                      <button
                        onClick={() => setIsShowingDesigner(true)}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Design Widget
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-full md:w-1/3">
                  <h3 className="text-lg font-medium mb-2">Embed Code</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {code ? (
                      <>
                        <p className="text-gray-600 mb-2">
                          Copy and paste this code into your website's HTML, just before the closing &lt;/body&gt; tag.
                        </p>
                        <div className="relative">
                          <div className="bg-gray-100 p-3 rounded font-mono text-sm overflow-x-auto">
                            {code}
                          </div>
                          <button
                            className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            onClick={copyCodeToClipboard}
                          >
                            {showCopiedMessage ? 'Copied!' : 'Copy Code'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-600">
                        Design your widget first to get the embed code.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal Designer */}
      {isShowingDesigner && (
        <ModalDesigner
          onSave={handleSaveSettings}
          initialSettings={savedSettings || {}}
          onClose={() => setIsShowingDesigner(false)}
          isSaving={isSaving}
        />
      )}

      {/* Widget Preview */}
      {isPreviewOpen && savedSettings && (
        <WidgetPreview
          settings={savedSettings}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </DashboardLayout>
  )
} 