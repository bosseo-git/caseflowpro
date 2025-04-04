import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import DashboardLayout from '@/components/DashboardLayout'
import { useUser } from '@/lib/hooks'
import toast from 'react-hot-toast'

interface UserSettings {
  companyName: string
  phone: string
  whatsAppNumber: string
  crmSettings: {
    apiKey: string
    webhookUrl: string
    crmType: string
  }
}

export default function Settings() {
  const router = useRouter()
  const { user, loading } = useUser({
    redirectTo: '/login',
  })

  const [settings, setSettings] = useState<UserSettings>({
    companyName: '',
    phone: '',
    whatsAppNumber: '',
    crmSettings: {
      apiKey: '',
      webhookUrl: '',
      crmType: 'other'
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
        crmSettings: {
          apiKey: user.ghlSettings?.apiKey || '',
          webhookUrl: user.ghlSettings?.webhookUrl || '',
          crmType: user.ghlSettings?.crmType || 'other'
        }
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.startsWith('crmSettings.')) {
      const field = name.split('.')[1]
      setSettings(prev => ({
        ...prev,
        crmSettings: {
          ...prev.crmSettings,
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
        body: JSON.stringify({
          ...settings,
          // Map back to ghlSettings for API compatibility
          ghlSettings: {
            apiKey: settings.crmSettings.apiKey,
            webhookUrl: settings.crmSettings.webhookUrl,
            crmType: settings.crmSettings.crmType
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      toast.success('Settings saved successfully')
      
      // Refresh the page to get updated user data
      setTimeout(() => {
        router.reload()
      }, 1500)
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
          
          {/* CRM Integration */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium mb-4">CRM Integration</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Connect your CRM account to enable lead collection and automation. CaseFlowPro integrates with all popular law firm CRMs, Zapier, Make, and more.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CRM Type
                </label>
                <select
                  name="crmSettings.crmType"
                  value={settings.crmSettings.crmType}
                  onChange={handleInputChange}
                  className="input-field w-full"
                >
                  <option value="clio">Clio</option>
                  <option value="smokeball">Smokeball</option>
                  <option value="filevine">Filevine</option>
                  <option value="lawmatics">Lawmatics</option>
                  <option value="practice_panther">Practice Panther</option>
                  <option value="zapier">Zapier</option>
                  <option value="make">Make.com</option>
                  <option value="other">Other CRM</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  name="crmSettings.apiKey"
                  value={settings.crmSettings.apiKey}
                  onChange={handleInputChange}
                  className="input-field w-full"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Your CRM API key (create one in your CRM's developer settings)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook URL
                </label>
                <input
                  type="url"
                  name="crmSettings.webhookUrl"
                  value={settings.crmSettings.webhookUrl}
                  onChange={handleInputChange}
                  className="input-field w-full"
                />
                <p className="mt-1 text-sm text-gray-500">
                  URL for your webhook (used for integration with your CRM)
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="text-sm font-medium text-blue-800 mb-2">CRM Integration Guide</h3>
                <ol className="list-decimal pl-5 text-sm text-blue-700 space-y-1">
                  <li>Log in to your CRM account</li>
                  <li>Navigate to the API or Developer Settings section</li>
                  <li>Create a new API key with appropriate permissions</li>
                  <li>Set up webhook endpoints for contact creation and form submissions</li>
                  <li>Copy the API key and webhook URLs and paste them here</li>
                  <li>For Zapier/Make integration, create a webhook trigger in your automation flow</li>
                </ol>
              </div>
            </div>
          </div>
          
          {/* Save button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
} 