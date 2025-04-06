import { useState, useEffect } from 'react'
import { PhoneIcon, ChatBubbleLeftIcon, EnvelopeIcon } from '@heroicons/react/24/solid'
import { XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

// Widget design settings type
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

// Modal display settings
type ModalSettings = {
  theme: ModalTheme
  title: string
  message: string
  buttonLabel: string
  size: 'sm' | 'md' | 'lg' | 'xl'
  animation: 'fade' | 'scale' | 'slide'
  position: 'center' | 'top'
  primaryColor: string
  autoClose: boolean
  showCloseButton: boolean
}

// Default modal settings
const defaultModalSettings: ModalSettings = {
  theme: 'default',
  title: 'Get in Touch',
  message: 'Please fill out this form to get started with your case evaluation.',
  buttonLabel: 'Submit',
  size: 'md',
  animation: 'scale',
  position: 'center',
  primaryColor: '#4F46E5',
  autoClose: false,
  showCloseButton: true,
}

interface WidgetPreviewProps {
  settings: WidgetDesignSettings
  isOpen: boolean
  onClose: () => void
}

export default function WidgetPreview({ settings, isOpen, onClose }: WidgetPreviewProps) {
  const [minimized, setMinimized] = useState(settings.startMinimized)
  const [showChat, setShowChat] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  // Reset state when preview is opened
  useEffect(() => {
    if (isOpen) {
      setMinimized(settings.startMinimized)
      setShowChat(false)
    }
  }, [isOpen, settings.startMinimized])

  if (!isOpen) return null

  // Get padding class based on settings
  const getPaddingClass = () => {
    switch (settings.buttonPadding) {
      case 'sm': return 'p-2'
      case 'lg': return 'p-4'
      default: return 'p-3'
    }
  }

  // Get border radius class based on settings
  const getBorderRadiusClass = () => {
    switch (settings.borderRadius) {
      case 'sm': return 'rounded'
      case 'lg': return 'rounded-xl'
      case 'full': return 'rounded-full'
      default: return 'rounded-lg'
    }
  }

  // Get layout classes based on settings
  const getLayoutClasses = () => {
    switch (settings.layout) {
      case 'modern':
        return 'flex flex-row space-x-2'
      case 'circles':
        return 'flex flex-row space-x-2'
      case 'compact':
        return 'grid grid-cols-2 gap-2'
      case 'minimalist':
        return 'flex flex-col space-y-2'
      default: // 'classic'
        return 'flex flex-col space-y-2'
    }
  }

  // Handle chat button click
  const handleChatClick = () => {
    setShowChat(true)
  }

  // Get theme classes for modal
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
          button: `bg-[${settings.primaryColor}] text-white`,
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

  const themeClasses = getThemeClasses()

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
        onClick={onClose}
      />

      {/* Preview container with website mockup */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-4xl h-[600px] rounded-lg shadow-xl overflow-hidden relative">
          {/* Mockup header */}
          <div className="h-12 bg-gray-100 border-b flex items-center px-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="mx-auto bg-white rounded-full px-4 py-1 text-sm text-gray-500">
              example-website.com
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Mockup content */}
          <div className="h-[552px] bg-gray-50 p-4 overflow-hidden">
            <div className="bg-white h-full w-full rounded border border-gray-200 p-4 flex flex-col">
              <h1 className="text-2xl font-bold text-gray-800">Example Website</h1>
              <p className="text-gray-600 mt-2">
                This is a preview of how your widget will appear on your website.
                Try clicking the buttons to see how they work.
              </p>
              
              {/* Content filler */}
              <div className="mt-6 space-y-4 flex-grow">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                
                <div className="h-20 bg-gray-200 rounded mt-6"></div>
                
                <div className="h-4 bg-gray-200 rounded mt-6"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              
              {/* Widget preview */}
              <div className={`absolute ${settings.position === 'right' ? 'right-8' : 'left-8'} bottom-8`}>
                {minimized ? (
                  <button
                    onClick={() => setMinimized(false)}
                    className={`flex items-center justify-center ${getBorderRadiusClass()} shadow-lg transition-all duration-300`}
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    <div className={`${getPaddingClass()} text-white`}>
                      <div className="flex items-center">
                        <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                        <span className="font-medium">Contact Us</span>
                      </div>
                    </div>
                  </button>
                ) : (
                  <>
                    <div className={`${getLayoutClasses()} min-w-[180px]`}>
                      {/* Call button */}
                      <button
                        className={`${getBorderRadiusClass()} ${getPaddingClass()} shadow-md flex items-center justify-center transition-all duration-300`}
                        style={{ backgroundColor: settings.buttonColors.call }}
                      >
                        <PhoneIcon className="h-5 w-5 text-white" />
                        {settings.showLabels && (
                          <span className="ml-2 text-white font-medium">{settings.buttonLabels.call}</span>
                        )}
                      </button>

                      {/* SMS button */}
                      <button
                        className={`${getBorderRadiusClass()} ${getPaddingClass()} shadow-md flex items-center justify-center transition-all duration-300`}
                        style={{ backgroundColor: settings.buttonColors.sms }}
                      >
                        <EnvelopeIcon className="h-5 w-5 text-white" />
                        {settings.showLabels && (
                          <span className="ml-2 text-white font-medium">{settings.buttonLabels.sms}</span>
                        )}
                      </button>

                      {/* WhatsApp button */}
                      <button
                        className={`${getBorderRadiusClass()} ${getPaddingClass()} shadow-md flex items-center justify-center transition-all duration-300`}
                        style={{ backgroundColor: settings.buttonColors.whatsapp }}
                      >
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        {settings.showLabels && (
                          <span className="ml-2 text-white font-medium">{settings.buttonLabels.whatsapp}</span>
                        )}
                      </button>

                      {/* Chat button */}
                      <button
                        onClick={handleChatClick}
                        className={`${getBorderRadiusClass()} ${getPaddingClass()} shadow-md flex items-center justify-center transition-all duration-300`}
                        style={{ backgroundColor: settings.buttonColors.chat }}
                      >
                        <ChatBubbleLeftIcon className="h-5 w-5 text-white" />
                        {settings.showLabels && (
                          <span className="ml-2 text-white font-medium">{settings.buttonLabels.chat}</span>
                        )}
                      </button>

                      {/* Minimize button */}
                      <button
                        onClick={() => setMinimized(true)}
                        className={`${getBorderRadiusClass()} ${getPaddingClass()} bg-gray-200 hover:bg-gray-300 shadow-md flex items-center justify-center ml-auto`}
                      >
                        <XMarkIcon className="h-5 w-5 text-gray-700" />
                      </button>
                    </div>
                    
                    {/* Chat modal */}
                    {showChat && (
                      <div className={`fixed bottom-24 ${settings.position === 'right' ? 'right-8' : 'left-8'} w-80 ${getBorderRadiusClass()} shadow-xl overflow-hidden`}>
                        <div className={`${themeClasses.header} px-4 py-3`}>
                          <div className="flex items-center justify-between">
                            <h3 className={`${themeClasses.title} text-lg font-medium`}>
                              {defaultModalSettings.title}
                            </h3>
                            {defaultModalSettings.showCloseButton && (
                              <button
                                className={`${themeClasses.closeBtn} rounded-md p-1`}
                                onClick={() => setShowChat(false)}
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                          <p className={`${themeClasses.desc} mt-1 text-sm`}>
                            {defaultModalSettings.message}
                          </p>
                        </div>
                        
                        <div className={`${themeClasses.container} p-4`}>
                          <form className="space-y-4">
                            <div>
                              <label htmlFor="name" className={`${themeClasses.label} block text-sm font-medium mb-1`}>
                                Your Name
                              </label>
                              <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={() => {}}
                                className={`${themeClasses.input} w-full rounded-md px-3 py-2 border focus:ring-2 focus:ring-opacity-50`}
                                style={{ outlineColor: settings.primaryColor }}
                                placeholder="John Doe"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="email" className={`${themeClasses.label} block text-sm font-medium mb-1`}>
                                Email Address
                              </label>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={() => {}}
                                className={`${themeClasses.input} w-full rounded-md px-3 py-2 border focus:ring-2 focus:ring-opacity-50`}
                                style={{ outlineColor: settings.primaryColor }}
                                placeholder="john@example.com"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="phone" className={`${themeClasses.label} block text-sm font-medium mb-1`}>
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={() => {}}
                                className={`${themeClasses.input} w-full rounded-md px-3 py-2 border focus:ring-2 focus:ring-opacity-50`}
                                style={{ outlineColor: settings.primaryColor }}
                                placeholder="(123) 456-7890"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="message" className={`${themeClasses.label} block text-sm font-medium mb-1`}>
                                Your Message
                              </label>
                              <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={() => {}}
                                rows={3}
                                className={`${themeClasses.input} w-full rounded-md px-3 py-2 border focus:ring-2 focus:ring-opacity-50`}
                                style={{ outlineColor: settings.primaryColor }}
                                placeholder="How can we help you?"
                              ></textarea>
                            </div>
                            
                            <button
                              type="button"
                              className="w-full rounded-md px-4 py-2 text-white font-medium"
                              style={{ backgroundColor: settings.primaryColor }}
                            >
                              {defaultModalSettings.buttonLabel}
                            </button>
                          </form>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 