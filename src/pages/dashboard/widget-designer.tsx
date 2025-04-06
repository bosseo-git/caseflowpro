import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/DashboardLayout'
import ModalDesigner from '@/components/ModalDesigner'
import WidgetPreview from '@/components/WidgetPreview'
import { EyeIcon } from '@heroicons/react/24/outline'
import { toast } from '@/components/ui/Toaster'

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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Load widget settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      if (!session?.user?.id) return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/widget-settings?userId=${session.user.id}`)
        const data = await response.json()

        if (data.settings) {
          setSavedSettings(data.settings as WidgetDesignSettings)
          
          // Generate embed code
          const baseUrl = window.location.origin || 'https://caseflowpro.vercel.app'
          const embedCode = `<script src="${baseUrl}/api/widget/${session.user.id}" async></script>`
          setCode(embedCode)
        }
      } catch (error) {
        console.error('Error fetching widget settings:', error)
        toast('Failed to load widget settings.', 'error')
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user?.id) {
      fetchSettings()
    }
  }, [session])

  const handleSaveSettings = async (settings: WidgetDesignSettings) => {
    if (!session?.user?.id) return

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
        toast('Widget design saved successfully!', 'success')
      } else {
        toast('Failed to save widget settings.', 'error')
      }
    } catch (error) {
      console.error('Error saving widget settings:', error)
      toast('An error occurred while saving settings.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(code).then(
      () => {
        setShowCopiedMessage(true)
        setTimeout(() => {
          setShowCopiedMessage(false)
        }, 2000)
        toast('Widget code copied to clipboard!', 'success')
      },
      (err) => {
        console.error('Could not copy code: ', err)
        toast('Failed to copy code.', 'error')
      }
    )
  }

  const openPreview = () => {
    setIsPreviewOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
                  <div className="bg-gray-50 rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">Widget Placement Code</h3>
                      <button
                        onClick={copyCodeToClipboard}
                        className="text-sm text-primary-600 hover:text-primary-700 focus:outline-none"
                      >
                        Copy to Clipboard
                      </button>
                    </div>
                    <div className="relative">
                      <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">{code}</pre>
                      {showCopiedMessage && (
                        <div className="absolute top-0 right-0 m-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          Copied!
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/3">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-2">Widget Appearance</h3>
                    <p className="text-xs text-gray-600 mb-3">
                      Customize how your widget looks and feels.
                    </p>
                    <button
                      onClick={() => setIsShowingDesigner(true)}
                      className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Customize Widget
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-2">Widget Preview</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This is a simple preview of how your widget will appear on your website. You can see the full interactive preview by clicking the "Preview Widget" button.
                </p>
                {savedSettings && (
                  <div className="h-28 border rounded-lg bg-gray-50 p-4 flex items-center justify-center relative">
                    <div className={`absolute ${savedSettings.position === 'right' ? 'right-5' : 'left-5'} bottom-5 flex space-x-2`}>
                      {savedSettings.layout === 'classic' ? (
                        <div 
                          className={`px-3 py-2 text-white text-sm rounded-md shadow-md`}
                          style={{ backgroundColor: savedSettings.primaryColor }}
                        >
                          Contact Us
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <div 
                            className={`h-10 w-10 flex items-center justify-center rounded-full shadow-md`}
                            style={{ backgroundColor: savedSettings.buttonColors.call }}
                          >
                            <span className="text-white">C</span>
                          </div>
                          <div 
                            className={`h-10 w-10 flex items-center justify-center rounded-full shadow-md`}
                            style={{ backgroundColor: savedSettings.buttonColors.sms }}
                          >
                            <span className="text-white">S</span>
                          </div>
                          <div 
                            className={`h-10 w-10 flex items-center justify-center rounded-full shadow-md`}
                            style={{ backgroundColor: savedSettings.buttonColors.chat }}
                          >
                            <span className="text-white">M</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {isShowingDesigner && savedSettings && (
          <ModalDesigner
            onSave={handleSaveSettings}
            initialSettings={savedSettings}
            onClose={() => setIsShowingDesigner(false)}
            isSaving={isSaving}
          />
        )}

        {/* Full Widget Preview */}
        {savedSettings && (
          <WidgetPreview
            settings={savedSettings}
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
          />
        )}
      </div>
    </DashboardLayout>
  )
} 