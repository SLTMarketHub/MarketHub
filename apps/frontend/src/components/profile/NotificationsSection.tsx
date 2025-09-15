import React, { useState } from 'react';
import { Bell, BellOff, Mail, Smartphone, Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface NotificationsSectionProps {
  onSuccess: (message: string) => void;
}

const NotificationsSection: React.FC<NotificationsSectionProps> = ({ onSuccess }) => {
  const { profile, updateNotificationPreferences } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Local state for notification preferences
  const [preferences, setPreferences] = useState({
    email: {
      orderUpdates: true,
      promotions: true,
      newsletter: true,
      accountActivity: true,
    },
    push: {
      orderUpdates: true,
      promotions: true,
      accountActivity: true,
    },
    sms: {
      orderUpdates: false,
      promotions: false,
      accountActivity: true,
    },
  });

  // Initialize preferences from profile
  React.useEffect(() => {
    if (profile?.notificationPreferences) {
      setPreferences(profile.notificationPreferences);
    }
  }, [profile]);

  // Toggle notification preference
  const togglePreference = (type: 'email' | 'push' | 'sms', key: string) => {
    setPreferences(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: !prev[type][key as keyof typeof prev[typeof type]]
      }
    }));
  };

  // Save notification preferences
  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await updateNotificationPreferences(preferences);
      
      if (success) {
        onSuccess('Notification preferences updated successfully');
        setIsEditing(false);
      } else {
        setError('Failed to update notification preferences. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while updating your preferences.');
    } finally {
      setIsLoading(false);
    }
  };

  // Notification preference item component
  const NotificationPreferenceItem = ({ 
    type, 
    label, 
    description,
    icon: Icon 
  }: {
    type: 'email' | 'push' | 'sms';
    label: string;
    description: string;
    icon: React.ElementType;
  }) => (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div className="ml-4">
          <label 
            htmlFor={`${type}-${label.toLowerCase().replace(/\s+/g, '-')}`}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
          <p className="text-sm text-gray-500">
            {description}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => togglePreference(type, label.toLowerCase().replace(/\s+/g, ''))}
        className={`${
          preferences[type][label.toLowerCase().replace(/\s+/g, '') as keyof typeof preferences[typeof type]]
            ? 'bg-blue-600'
            : 'bg-gray-200'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        role="switch"
        aria-checked={preferences[type][label.toLowerCase().replace(/\s+/g, '') as keyof typeof preferences[typeof type]]}
        disabled={!isEditing}
      >
        <span className="sr-only">{label} notifications</span>
        <span
          aria-hidden="true"
          className={`${
            preferences[type][label.toLowerCase().replace(/\s+/g, '') as keyof typeof preferences[typeof type]]
              ? 'translate-x-5'
              : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage how you receive notifications from us.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  // Reset to original preferences if available
                  if (profile?.notificationPreferences) {
                    setPreferences(profile.notificationPreferences);
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isLoading}
                className={`ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? 'Saving...' : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Preferences
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Email Notifications</h3>
          
          <div className="divide-y divide-gray-200">
            <NotificationPreferenceItem
              type="email"
              label="Order Updates"
              description="Order confirmations, shipping updates, and delivery notifications"
              icon={Bell}
            />
            
            <NotificationPreferenceItem
              type="email"
              label="Promotions"
              description="Exclusive offers, discounts, and product announcements"
              icon={Tag}
            />
            
            <NotificationPreferenceItem
              type="email"
              label="Newsletter"
              description="Weekly product updates, news, and tips"
              icon={Mail}
            />
            
            <NotificationPreferenceItem
              type="email"
              label="Account Activity"
              description="Important notifications about your account security"
              icon={Shield}
            />
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mt-8 mb-6">Push Notifications</h3>
          
          <div className="divide-y divide-gray-200">
            <NotificationPreferenceItem
              type="push"
              label="Order Updates"
              description="Real-time order status updates"
              icon={Bell}
            />
            
            <NotificationPreferenceItem
              type="push"
              label="Promotions"
              description="Limited-time offers and flash sales"
              icon={Tag}
            />
            
            <NotificationPreferenceItem
              type="push"
              label="Account Activity"
              description="Security alerts and important account notifications"
              icon={Shield}
            />
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mt-8 mb-6">SMS Notifications</h3>
          
          <div className="divide-y divide-gray-200">
            <NotificationPreferenceItem
              type="sms"
              label="Order Updates"
              description="Order confirmations and shipping updates"
              icon={Smartphone}
            />
            
            <NotificationPreferenceItem
              type="sms"
              label="Promotions"
              description="Exclusive SMS-only offers"
              icon={Smartphone}
            />
            
            <NotificationPreferenceItem
              type="sms"
              label="Account Activity"
              description="Important security notifications"
              icon={Shield}
            />
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <InformationCircleIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Need help with notifications?</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Some notifications are required and cannot be disabled. These are typically related to important account security or legal requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSection;
