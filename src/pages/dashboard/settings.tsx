import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { SaveIcon } from '@heroicons/react/outline'
import DashboardLayout from '@/components/DashboardLayout'
import { useUser } from '@/lib/hooks'
import toast from 'react-hot-toast'

interface UserSettings {
  companyName: string
  phone: string
  whatsAppNumber: string
  ghlSettings: {
    locationId: string
    apiKey: string
    webhookUrl: string
  }
}

export default function Settings() {
  const router = useRouter()
  const { user, loading, mutateUser } = useUser({
    redirectTo: '/login',
  })

  const [settings, setSettings] = useState<UserSettings>({
    companyName: '',
    phone: '',
    whatsAppNumber: '',
    ghlSettings: {
      locationId: '',
      apiKey: '',
      webhookUrl: '',
    }
  })

  const [isSaving, setIsSaving] = useState(false)

  // Load user settings when available
  useEffect(() => {
    if (user) {
      setSettings({
        companyName: user.companyName || '',
        phone: user.phone || '',
        whatsAppNumber: user.whatsAppNumber || '',
        ghlSettings: {
          locationId: user.ghlSettings?.locationId || '',
          apiKey: user.ghlSettings?.apiKey || '',
          webhookUrl: user.ghlSettings?.webhookUrl || '',
        }
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name.startsWith('ghlSettings.')) {
      const field = name.split('.')[1]
      setSettings(prev => ({
        ...prev,
        ghlSettings: {
          ...prev.ghlSettings,
          [field]: value
        }
      }))
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      const data = await response.json()
      mutateUser(data)
      toast.success('Settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return <DashboardLayout>Loading...</DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Account Settings</h1>
        
        <form onSubmit={saveSettings} className="space-y-8">
          {/* Company Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4">Company Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={settings.companyName}
                  onChange={handleInputChange}
                  className="input-field w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={settings.phone}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  name="whatsAppNumber"
                  value={settings.whatsAppNumber}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="+1 (555) 123-4567"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Include country code (e.g., +1 for US)
                </p>
              </div>
            </div>
          </div>
          
          {/* GoHighLevel Integration */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4">GoHighLevel Integration</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Connect your GoHighLevel account to enable lead collection and automation. You'll need to create API credentials in your GoHighLevel account.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location ID
                </label>
                <input
                  type="text"
                  name="ghlSettings.locationId"
                  value={settings.ghlSettings.locationId}
                  onChange={handleInputChange}
                  className="input-field w-full"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Your GoHighLevel location ID (found in Location Settings)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  name="ghlSettings.apiKey"
                  value={settings.ghlSettings.apiKey}
                  onChange={handleInputChange}
                  className="input-field w-full"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Your GoHighLevel API key (create one in Developer Settings)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook URL
                </label>
                <input
                  type="url"
                  name="ghlSettings.webhookUrl"
                  value={settings.ghlSettings.webhookUrl}
                  onChange={handleInputChange}
                  className="input-field w-full"
                />
                <p className="mt-1 text-sm text-gray-500">
                  URL for your GoHighLevel webhook (create one in Settings → Webhooks)
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">How to set up your GoHighLevel integration</h3>
                <ol className="list-decimal pl-5 text-sm text-yellow-700 space-y-1">
                  <li>Log in to your GoHighLevel account</li>
                  <li>Go to Settings → Developer Settings → API Keys</li>
                  <li>Create a new API key with appropriate permissions</li>
                  <li>Go to Settings → Webhooks</li>
                  <li>Create webhooks for Contact Created, Form Submission, and SMS/Message events</li>
                  <li>Copy the webhook URLs and paste them here</li>
                </ol>
              </div>
            </div>
          </div>
          
          {/* Save button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary inline-flex items-center"
              disabled={isSaving}
            >
              <SaveIcon className="w-5 h-5 mr-2" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
} 