import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'

type ToastProps = {
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
  onClose: () => void
}

function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = 
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' : 'bg-blue-500'

  return (
    <div className={`flex items-center justify-between p-4 mb-4 text-white rounded-md shadow-lg ${bgColor}`}>
      <p>{message}</p>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  )
}

type ToasterState = {
  toasts: Array<{
    id: string
    message: string
    type: 'success' | 'error' | 'info'
  }>
}

export const toastState = {
  toasts: [] as ToasterState['toasts'],
  listeners: new Set<() => void>(),
  
  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  },
  
  getState() {
    return { toasts: [...this.toasts] }
  },
  
  addToast(toast: { message: string; type: 'success' | 'error' | 'info' }) {
    this.toasts.push({ ...toast, id: Math.random().toString(36).substring(2, 9) })
    this.listeners.forEach(listener => listener())
    return this.toasts[this.toasts.length - 1].id
  },
  
  removeToast(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id)
    this.listeners.forEach(listener => listener())
  }
}

export function toast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  return toastState.addToast({ message, type })
}

export function Toaster() {
  const [state, setState] = useState<ToasterState>({ toasts: [] })
  
  useEffect(() => {
    return toastState.subscribe(() => {
      setState(toastState.getState())
    })
  }, [])
  
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])
  
  if (!isMounted) return null
  
  return createPortal(
    <div className="fixed z-50 flex flex-col items-end top-4 right-4 space-y-4">
      {state.toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => toastState.removeToast(toast.id)}
        />
      ))}
    </div>,
    document.body
  )
} 