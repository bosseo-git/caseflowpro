import { useState, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/router'
import DashboardLayout from '@/components/DashboardLayout'
import { useUser } from '@/lib/hooks'

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading } = useUser({
    redirectTo: '/login',
  });

  const [generalSettings, setGeneralSettings] = useState({
    companyName: '',
    email: '',
    phone: '',
    whatsAppNumber: '',
    timezone: 'America/New_York',
    language: 'en'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newLeadAlerts: true,
    weeklyReports: true,
    marketingEmails: false
  });

  // Load user data when available
  useEffect(() => {
    if (user) {
      setGeneralSettings({
        companyName: user.companyName || '',
        email: user.email || '',
        phone: user.phone || '',
        whatsAppNumber: user.whatsAppNumber || '',
        timezone: user.timezone || 'America/New_York',
        language: user.language || 'en'
      });
    }
  }, [user]);

  const handleGeneralChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const saveSettings = async () => {
    // In a real app, this would call an API endpoint
    console.log('Saving settings...');
    // await fetch('/api/settings', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     ...generalSettings,
    //     notificationSettings
    //   })
    // });
  };

  if (loading) {
    return <DashboardLayout>Loading settings...</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Account Settings</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">General Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={generalSettings.companyName}
                onChange={handleGeneralChange}
                className="input-field w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={generalSettings.email}
                onChange={handleGeneralChange}
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
                value={generalSettings.phone}
                onChange={handleGeneralChange}
                className="input-field w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number
              </label>
              <input
                type="tel"
                name="whatsAppNumber"
                value={generalSettings.whatsAppNumber}
                onChange={handleGeneralChange}
                className="input-field w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                name="timezone"
                value={generalSettings.timezone}
                onChange={handleGeneralChange}
                className="input-field w-full"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                name="language"
                value={generalSettings.language}
                onChange={handleGeneralChange}
                className="input-field w-full"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Notification Preferences</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={notificationSettings.emailNotifications}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                Receive email notifications
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="newLeadAlerts"
                name="newLeadAlerts"
                checked={notificationSettings.newLeadAlerts}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="newLeadAlerts" className="ml-2 block text-sm text-gray-700">
                Alert me when new leads are captured
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="weeklyReports"
                name="weeklyReports"
                checked={notificationSettings.weeklyReports}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="weeklyReports" className="ml-2 block text-sm text-gray-700">
                Send me weekly performance reports
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="marketingEmails"
                name="marketingEmails"
                checked={notificationSettings.marketingEmails}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="marketingEmails" className="ml-2 block text-sm text-gray-700">
                Receive product updates and marketing emails
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={saveSettings}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Save Settings
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
} 