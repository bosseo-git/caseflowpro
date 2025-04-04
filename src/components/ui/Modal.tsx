import React, { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

export type ModalTheme = 'default' | 'minimal' | 'bordered' | 'dark' | 'branded'

export type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: React.ReactNode
  theme?: ModalTheme
  size?: 'sm' | 'md' | 'lg' | 'xl'
  position?: 'center' | 'top'
  showCloseButton?: boolean
  customClass?: string
  animation?: 'fade' | 'scale' | 'slide'
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

const themeClasses = {
  default: {
    backdrop: 'bg-gray-500/75',
    container: 'bg-white text-gray-900',
    header: 'bg-white border-b border-gray-200',
    title: 'text-xl font-semibold text-gray-900',
    closeButton: 'text-gray-400 hover:text-gray-500',
    body: 'p-6',
  },
  minimal: {
    backdrop: 'bg-gray-500/75',
    container: 'bg-white text-gray-900 shadow-none',
    header: 'bg-white',
    title: 'text-xl font-medium text-gray-900',
    closeButton: 'text-gray-400 hover:text-gray-500',
    body: 'p-4',
  },
  bordered: {
    backdrop: 'bg-gray-500/75',
    container: 'bg-white text-gray-900 border-2 border-gray-300',
    header: 'bg-gray-50 border-b border-gray-300',
    title: 'text-xl font-bold text-gray-900',
    closeButton: 'text-gray-400 hover:text-gray-500',
    body: 'p-6',
  },
  dark: {
    backdrop: 'bg-black/80',
    container: 'bg-gray-800 text-white',
    header: 'bg-gray-900 border-b border-gray-700',
    title: 'text-xl font-semibold text-white',
    closeButton: 'text-gray-400 hover:text-gray-300',
    body: 'p-6',
  },
  branded: {
    backdrop: 'bg-primary-500/75',
    container: 'bg-white text-gray-900',
    header: 'bg-primary-600 text-white',
    title: 'text-xl font-bold text-white',
    closeButton: 'text-white/80 hover:text-white',
    body: 'p-6',
  },
}

const positionClasses = {
  center: 'items-center',
  top: 'items-start pt-16',
}

const animationClasses = {
  fade: {
    enter: 'ease-out duration-300',
    enterFrom: 'opacity-0',
    enterTo: 'opacity-100',
    leave: 'ease-in duration-200',
    leaveFrom: 'opacity-100',
    leaveTo: 'opacity-0',
  },
  scale: {
    enter: 'ease-out duration-300',
    enterFrom: 'opacity-0 scale-95',
    enterTo: 'opacity-100 scale-100',
    leave: 'ease-in duration-200',
    leaveFrom: 'opacity-100 scale-100',
    leaveTo: 'opacity-0 scale-95',
  },
  slide: {
    enter: 'ease-out duration-300',
    enterFrom: 'opacity-0 translate-y-4',
    enterTo: 'opacity-100 translate-y-0',
    leave: 'ease-in duration-200',
    leaveFrom: 'opacity-100 translate-y-0',
    leaveTo: 'opacity-0 translate-y-4',
  },
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  theme = 'default',
  size = 'md',
  position = 'center',
  showCloseButton = true,
  customClass = '',
  animation = 'fade',
}: ModalProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Prevent SSR issues with headlessUI
  if (!mounted) return null
  
  const themeStyle = themeClasses[theme]
  const sizeClass = sizeClasses[size]
  const positionClass = positionClasses[position]
  const animationClass = animationClasses[animation]

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          {...animationClass}
        >
          <div className={`fixed inset-0 transition-opacity ${themeStyle.backdrop}`} />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className={`flex min-h-full justify-center ${positionClass} p-4 text-center sm:p-0`}>
            <Transition.Child
              as={Fragment}
              {...animationClass}
            >
              <Dialog.Panel 
                className={clsx(
                  'relative w-full transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8',
                  sizeClass,
                  themeStyle.container,
                  customClass
                )}
              >
                {(title || showCloseButton) && (
                  <div className={`px-4 py-3 ${themeStyle.header}`}>
                    <div className="flex items-center justify-between">
                      {title && (
                        <Dialog.Title as="h3" className={themeStyle.title}>
                          {title}
                        </Dialog.Title>
                      )}
                      {showCloseButton && (
                        <button
                          type="button"
                          className={`rounded-md bg-transparent p-1 ${themeStyle.closeButton}`}
                          onClick={onClose}
                        >
                          <span className="sr-only">Close</span>
                          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                    {description && (
                      <Dialog.Description className="mt-1 text-sm text-gray-500">
                        {description}
                      </Dialog.Description>
                    )}
                  </div>
                )}
                <div className={themeStyle.body}>
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 