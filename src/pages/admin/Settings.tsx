import React, { useState } from 'react';
import { Save, Bell, Shield, Globe2, Mail, Loader } from 'lucide-react';

interface SettingsSection {
  title: string;
  description: string;
  settings: {
    id: string;
    label: string;
    description?: string;
    type: 'toggle' | 'select' | 'input';
    options?: { value: string; label: string }[];
    value: any;
  }[];
}

function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const sections: SettingsSection[] = [
    {
      title: 'General',
      description: 'Manage your general application settings',
      settings: [
        {
          id: 'timezone',
          label: 'Default Timezone',
          type: 'select',
          options: [
            { value: 'Pacific/Honolulu', label: 'Hawaii (HST)' },
            { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
            { value: 'America/New_York', label: 'Eastern Time (ET)' },
            { value: 'UTC', label: 'UTC' }
          ],
          value: 'Pacific/Honolulu'
        },
        {
          id: 'language',
          label: 'Default Language',
          type: 'select',
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' }
          ],
          value: 'en'
        }
      ]
    },
    {
      title: 'Notifications',
      description: 'Configure how you receive notifications',
      settings: [
        {
          id: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Receive notifications via email',
          type: 'toggle',
          value: true
        },
        {
          id: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Receive push notifications in your browser',
          type: 'toggle',
          value: false
        },
        {
          id: 'orderAlerts',
          label: 'Order Alerts',
          description: 'Get notified about new orders',
          type: 'toggle',
          value: true
        }
      ]
    },
    {
      title: 'Security',
      description: 'Manage your security preferences',
      settings: [
        {
          id: 'twoFactorAuth',
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          type: 'toggle',
          value: false
        },
        {
          id: 'sessionTimeout',
          label: 'Session Timeout',
          type: 'select',
          options: [
            { value: '15', label: '15 minutes' },
            { value: '30', label: '30 minutes' },
            { value: '60', label: '1 hour' },
            { value: '120', label: '2 hours' }
          ],
          value: '30'
        }
      ]
    }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Settings saved successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600">Manage your application preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="gradient-bg text-white px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center"
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin h-5 w-5 mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 bg-green-50 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          {successMessage}
        </div>
      )}

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-start mb-6">
              {section.title === 'General' && <Globe2 className="h-6 w-6 text-primary mt-1" />}
              {section.title === 'Notifications' && <Bell className="h-6 w-6 text-primary mt-1" />}
              {section.title === 'Security' && <Shield className="h-6 w-6 text-primary mt-1" />}
              <div className="ml-4">
                <h2 className="text-xl font-bold mb-1">{section.title}</h2>
                <p className="text-gray-600">{section.description}</p>
              </div>
            </div>

            <div className="space-y-6">
              {section.settings.map((setting) => (
                <div key={setting.id} className="flex items-start justify-between">
                  <div className="flex-1">
                    <label htmlFor={setting.id} className="block font-medium text-gray-700">
                      {setting.label}
                    </label>
                    {setting.description && (
                      <p className="mt-1 text-sm text-gray-500">{setting.description}</p>
                    )}
                  </div>
                  <div className="ml-4">
                    {setting.type === 'toggle' && (
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          setting.value ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            setting.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}
                    {setting.type === 'select' && (
                      <select
                        id={setting.id}
                        value={setting.value}
                        className="block w-48 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {setting.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Settings;
