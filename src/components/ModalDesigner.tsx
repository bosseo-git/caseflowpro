import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Modal, { ModalTheme } from './ui/Modal'
import { PencilSquareIcon, EyeIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

type ModalDesignSettings = {
  theme: ModalTheme
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

type ModalDesignerProps = {
  onSave: (settings: ModalDesignSettings) => void
  initialSettings?: Partial<ModalDesignSettings>
}

const defaultSettings: ModalDesignSettings = {
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
    label: 'Branded', 
    value: 'branded',
    description: 'Uses your primary color for the header area'
  },
]

export default function ModalDesigner({ onSave, initialSettings = {} }: ModalDesignerProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const settings = { ...defaultSettings, ...initialSettings }
  
  const { register, handleSubmit, control, watch, reset } = useForm<ModalDesignSettings>({
    defaultValues: settings
  })
  
  const currentValues = watch()
  
  const handleReset = () => {
    reset(defaultSettings)
  }
  
  const onSubmit = (data: ModalDesignSettings) => {
    onSave(data)
  }
  
  const openPreview = () => {
    setPreviewOpen(true)
  }
  
  const previewDescription = `
    This is a live preview of your widget design. 
    Any changes you make in the form will be reflected here in real-time.
    Click outside to close.
  `.trim()

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Modal Designer</h2>
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theme Selection */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Modal Theme</label>
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

          {/* Content */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Modal Title
              </label>
              <input
                type="text"
                id="title"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                {...register('title')}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Modal Message
              </label>
              <textarea
                id="message"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                {...register('message')}
              />
            </div>

            <div>
              <label htmlFor="buttonLabel" className="block text-sm font-medium text-gray-700">
                Button Label
              </label>
              <input
                type="text"
                id="buttonLabel"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                {...register('buttonLabel')}
              />
            </div>
          </div>

          {/* Styling & Effects */}
          <div className="space-y-4">
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                Modal Size
              </label>
              <select
                id="size"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                {...register('size')}
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </div>

            <div>
              <label htmlFor="animation" className="block text-sm font-medium text-gray-700">
                Animation
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

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <select
                id="position"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                {...register('position')}
              >
                <option value="center">Center</option>
                <option value="top">Top</option>
              </select>
            </div>

            <div>
              <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                Primary Color (for Branded theme)
              </label>
              <input
                type="color"
                id="primaryColor"
                className="mt-1 h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                {...register('primaryColor')}
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center">
            <input
              id="showCloseButton"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              {...register('showCloseButton')}
            />
            <label htmlFor="showCloseButton" className="ml-2 block text-sm text-gray-700">
              Show Close Button
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="autoClose"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              {...register('autoClose')}
            />
            <label htmlFor="autoClose" className="ml-2 block text-sm text-gray-700">
              Auto Close After Submission
            </label>
          </div>

          {currentValues.autoClose && (
            <div className="flex items-center">
              <label htmlFor="autoCloseDelay" className="block text-sm text-gray-700 mr-2">
                Close After (seconds):
              </label>
              <input
                type="number"
                id="autoCloseDelay"
                min="1"
                max="30"
                className="block w-16 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                {...register('autoCloseDelay', { valueAsNumber: true })}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PencilSquareIcon className="mr-2 h-4 w-4" />
            Save Changes
          </button>
        </div>
      </form>

      {/* Modal Preview */}
      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={currentValues.title || defaultSettings.title}
        description={previewDescription}
        theme={currentValues.theme || defaultSettings.theme}
        size={currentValues.size || defaultSettings.size}
        position={currentValues.position || defaultSettings.position}
        showCloseButton={currentValues.showCloseButton !== undefined ? currentValues.showCloseButton : defaultSettings.showCloseButton}
        animation={currentValues.animation || defaultSettings.animation}
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-500">{currentValues.message || defaultSettings.message}</p>
          
          <div className="pt-4">
            <div className="flex flex-col space-y-2">
              <div className="text-xs text-gray-400 italic">Example form fields would appear here</div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  style={{ backgroundColor: currentValues.theme === 'branded' ? (currentValues.primaryColor || defaultSettings.primaryColor) : undefined }}
                >
                  {currentValues.buttonLabel || defaultSettings.buttonLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
} 