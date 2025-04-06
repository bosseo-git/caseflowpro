import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Modal, { ModalTheme } from './ui/Modal'
import { PencilSquareIcon, EyeIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

type WidgetPosition = 'right' | 'left'
type WidgetLayout = 'classic' | 'modern' | 'circles' | 'compact' | 'minimalist'

type WidgetDesignSettings = {
  theme: ModalTheme
  layout: WidgetLayout
  position: WidgetPosition
  primaryColor: string
  secondaryColor: string
  startMinimized: boolean
  fixedToBottomRight: boolean // New setting for chat-like fixed position
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

type ModalDesignerProps = {
  onSave: (settings: WidgetDesignSettings) => void
  initialSettings?: Partial<WidgetDesignSettings>
}

const defaultSettings: WidgetDesignSettings = {
  theme: 'default',
  layout: 'classic',
  position: 'right',
  primaryColor: '#4F46E5',
  secondaryColor: '#818CF8',
  startMinimized: true,
  fixedToBottomRight: true,
  buttonPadding: 'md',
  borderRadius: 'md',
  showLabels: true,
  animation: 'scale',
  buttonLabels: {
    call: 'Call Now',
    sms: 'Text Us',
    whatsapp: 'WhatsApp',
    chat: 'Live Chat'
  },
  buttonColors: {
    call: '#2196F3',
    sms: '#9E9E9E',
    whatsapp: '#4CAF50',
    chat: '#673AB7'
  }
}

const themeOptions: { label: string; value: ModalTheme; description: string }[] = [
  { 
    label: 'Default', 
    value: 'default',
    description: 'Clean and professional look with subtle borders'
  },
  { 
    label: 'Minimal', 
    value: 'minimal',
    description: 'Lightweight design with no borders and minimal styling'
  },
  { 
    label: 'Bordered', 
    value: 'bordered',
    description: 'Bold borders with a highlighted header area'
  },
  { 
    label: 'Dark', 
    value: 'dark',
    description: 'Dark mode with light text for a modern look'
  },
  { 
    label: 'Dark Gold', 
    value: 'branded',
    description: 'Premium dark theme with gold accents'
  },
]

const layoutOptions: { label: string; value: WidgetLayout; description: string }[] = [
  { 
    label: 'Classic', 
    value: 'classic',
    description: 'Traditional vertical button layout'
  },
  { 
    label: 'Modern', 
    value: 'modern',
    description: 'Sleek horizontal button layout'
  },
  { 
    label: 'Circles', 
    value: 'circles',
    description: 'Circular buttons with colorful icons'
  },
  { 
    label: 'Compact', 
    value: 'compact',
    description: 'Space-saving square layout'
  },
  { 
    label: 'Minimalist', 
    value: 'minimalist',
    description: 'Clean design with subtle indicators'
  },
]

export default function ModalDesigner({ onSave, initialSettings = {} }: ModalDesignerProps) {
  const [previewOpen, setPreviewOpen] = useState(false)

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<WidgetDesignSettings>({
    defaultValues: {
      ...defaultSettings,
      ...initialSettings
    }
  });

  // Get current values from form for live preview
  const currentValues = watch();
  
  const openPreview = () => {
    setPreviewOpen(true)
  };
  
  const handleReset = () => {
    reset(defaultSettings)
  };
  
  const onSubmit = (data: WidgetDesignSettings) => {
    onSave(data)
  };

  // Preview description text with form fields filled/not filled
  const previewDescription = "The widget interface will appear as designed. Inner forms and modals will open at the bottom right corner like a chat.";

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Widget Designer</h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={openPreview}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-secondary-600 hover:bg-secondary-700"
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            Live Preview
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowPathIcon className="mr-2 h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theme Selection */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Widget Theme</label>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {themeOptions.map((option) => (
                <div key={option.value} className="relative">
                  <label 
                    className={`
                      block p-4 border rounded-lg cursor-pointer
                      ${currentValues.theme === option.value 
                        ? 'border-primary-500 ring-2 ring-primary-500' 
                        : 'border-gray-300 hover:border-gray-400'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      value={option.value}
                      {...register('theme')}
                    />
                    <div className="text-sm font-medium text-gray-900">{option.label}</div>
                    <div className="mt-1 text-xs text-gray-500">{option.description}</div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Layout Selection */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Button Layout</label>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {layoutOptions.map((option) => (
                <div key={option.value} className="relative">
                  <label 
                    className={`
                      block p-4 border rounded-lg cursor-pointer
                      ${currentValues.layout === option.value 
                        ? 'border-primary-500 ring-2 ring-primary-500' 
                        : 'border-gray-300 hover:border-gray-400'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      value={option.value}
                      {...register('layout')}
                    />
                    <div className="text-sm font-medium text-gray-900">{option.label}</div>
                    <div className="mt-1 text-xs text-gray-500">{option.description}</div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Button Labels */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Button Labels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="buttonLabels.call" className="block text-sm font-medium text-gray-700">
                  Call Button Label
                </label>
                <input
                  type="text"
                  id="buttonLabels.call"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  {...register('buttonLabels.call')}
                />
              </div>

              <div>
                <label htmlFor="buttonLabels.sms" className="block text-sm font-medium text-gray-700">
                  SMS Button Label
                </label>
                <input
                  type="text"
                  id="buttonLabels.sms"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  {...register('buttonLabels.sms')}
                />
              </div>

              <div>
                <label htmlFor="buttonLabels.whatsapp" className="block text-sm font-medium text-gray-700">
                  WhatsApp Button Label
                </label>
                <input
                  type="text"
                  id="buttonLabels.whatsapp"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  {...register('buttonLabels.whatsapp')}
                />
              </div>

              <div>
                <label htmlFor="buttonLabels.chat" className="block text-sm font-medium text-gray-700">
                  Chat Button Label
                </label>
                <input
                  type="text"
                  id="buttonLabels.chat"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  {...register('buttonLabels.chat')}
                />
              </div>
            </div>
          </div>

          {/* Button Colors */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Button Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="buttonColors.call" className="block text-sm font-medium text-gray-700">
                  Call Button Color
                </label>
                <input
                  type="color"
                  id="buttonColors.call"
                  className="mt-1 h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  {...register('buttonColors.call')}
                />
              </div>

              <div>
                <label htmlFor="buttonColors.sms" className="block text-sm font-medium text-gray-700">
                  SMS Button Color
                </label>
                <input
                  type="color"
                  id="buttonColors.sms"
                  className="mt-1 h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  {...register('buttonColors.sms')}
                />
              </div>

              <div>
                <label htmlFor="buttonColors.whatsapp" className="block text-sm font-medium text-gray-700">
                  WhatsApp Button Color
                </label>
                <input
                  type="color"
                  id="buttonColors.whatsapp"
                  className="mt-1 h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  {...register('buttonColors.whatsapp')}
                />
              </div>

              <div>
                <label htmlFor="buttonColors.chat" className="block text-sm font-medium text-gray-700">
                  Chat Button Color
                </label>
                <input
                  type="color"
                  id="buttonColors.chat"
                  className="mt-1 h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  {...register('buttonColors.chat')}
                />
              </div>
            </div>
          </div>

          {/* Widget Styling */}
          <div>
            <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
              Primary Color
            </label>
            <input
              type="color"
              id="primaryColor"
              className="mt-1 h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              {...register('primaryColor')}
            />
          </div>

          <div>
            <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
              Secondary Color
            </label>
            <input
              type="color"
              id="secondaryColor"
              className="mt-1 h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              {...register('secondaryColor')}
            />
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700">
              Widget Position
            </label>
            <select
              id="position"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              {...register('position')}
            >
              <option value="right">Bottom Right</option>
              <option value="left">Bottom Left</option>
            </select>
          </div>

          <div>
            <label htmlFor="buttonPadding" className="block text-sm font-medium text-gray-700">
              Button Padding
            </label>
            <select
              id="buttonPadding"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              {...register('buttonPadding')}
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>

          <div>
            <label htmlFor="borderRadius" className="block text-sm font-medium text-gray-700">
              Button Corner Roundness
            </label>
            <select
              id="borderRadius"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              {...register('borderRadius')}
            >
              <option value="sm">Slight Rounded</option>
              <option value="md">Medium Rounded</option>
              <option value="lg">Very Rounded</option>
              <option value="full">Completely Round</option>
            </select>
          </div>

          <div>
            <label htmlFor="animation" className="block text-sm font-medium text-gray-700">
              Animation Style
            </label>
            <select
              id="animation"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              {...register('animation')}
            >
              <option value="fade">Fade</option>
              <option value="scale">Scale</option>
              <option value="slide">Slide</option>
            </select>
          </div>
        </div>

        {/* Options */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              id="startMinimized"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              {...register('startMinimized')}
            />
            <label htmlFor="startMinimized" className="ml-2 block text-sm text-gray-700">
              Start Widget Minimized
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="fixedToBottomRight"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              {...register('fixedToBottomRight')}
            />
            <label htmlFor="fixedToBottomRight" className="ml-2 block text-sm text-gray-700">
              Fix Inner Modals to Bottom Right (Chat-Style)
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="showLabels"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              {...register('showLabels')}
            />
            <label htmlFor="showLabels" className="ml-2 block text-sm text-gray-700">
              Show Button Labels
            </label>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PencilSquareIcon className="mr-2 h-4 w-4" />
            Save Widget Design
          </button>
        </div>
      </form>

      {/* Widget Preview */}
      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Widget Preview"
        description={previewDescription}
        theme={currentValues.theme || defaultSettings.theme}
        size="lg"
        position="center"
        showCloseButton={true}
        animation={currentValues.animation || defaultSettings.animation}
      >
        <div className="space-y-6">
          <div className="border rounded-lg p-4 relative h-96">
            <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
              {/* Widget toggle button */}
              <button 
                className="w-16 h-16 flex items-center justify-center rounded-full shadow-lg"
                style={{ backgroundColor: currentValues.primaryColor || defaultSettings.primaryColor }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </button>

              {/* Widget panel */}
              <div 
                className="p-4 rounded-lg shadow-lg max-w-xs"
                style={{ backgroundColor: currentValues.secondaryColor || defaultSettings.secondaryColor }}
              >
                <div className="flex flex-col space-y-2">
                  {/* Call button */}
                  <button
                    className={`flex items-center justify-center text-white rounded-${currentValues.borderRadius} px-4 py-${currentValues.buttonPadding}`}
                    style={{ backgroundColor: currentValues.buttonColors.call || defaultSettings.buttonColors.call }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {currentValues.showLabels && (currentValues.buttonLabels.call || defaultSettings.buttonLabels.call)}
                  </button>

                  {/* SMS button */}
                  <button
                    className={`flex items-center justify-center text-white rounded-${currentValues.borderRadius} px-4 py-${currentValues.buttonPadding}`}
                    style={{ backgroundColor: currentValues.buttonColors.sms || defaultSettings.buttonColors.sms }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    {currentValues.showLabels && (currentValues.buttonLabels.sms || defaultSettings.buttonLabels.sms)}
                  </button>

                  {/* WhatsApp button */}
                  <button
                    className={`flex items-center justify-center text-white rounded-${currentValues.borderRadius} px-4 py-${currentValues.buttonPadding}`}
                    style={{ backgroundColor: currentValues.buttonColors.whatsapp || defaultSettings.buttonColors.whatsapp }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {currentValues.showLabels && (currentValues.buttonLabels.whatsapp || defaultSettings.buttonLabels.whatsapp)}
                  </button>

                  {/* Chat button */}
                  <button
                    className={`flex items-center justify-center text-white rounded-${currentValues.borderRadius} px-4 py-${currentValues.buttonPadding}`}
                    style={{ backgroundColor: currentValues.buttonColors.chat || defaultSettings.buttonColors.chat }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4h-2a2 2 0 01-2-2v-2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h.01M12 12h.01M15 12h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v2" />
                    </svg>
                    {currentValues.showLabels && (currentValues.buttonLabels.chat || defaultSettings.buttonLabels.chat)}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal preview for chat-style forms */}
            {currentValues.fixedToBottomRight && (
              <div className="absolute bottom-4 right-24 w-72 bg-white rounded-lg shadow-lg border">
                <div className="flex items-center justify-between p-3 border-b">
                  <h4 className="font-medium">Get in Touch</h4>
                  <button className="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-4 text-xs text-gray-500">
                  Inner modal forms will appear here in a chat-like style, fixed to the bottom right
                </div>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500">
            This preview shows the appearance of your widget. The actual widget will be functional with clickable buttons that trigger the actions you've configured.
          </p>
        </div>
      </Modal>
    </div>
  )
} 