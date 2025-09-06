import React, { useState } from 'react';
import { Lock, Key, ShieldCheck, X, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface SecuritySectionProps {
  onSuccess: (message: string) => void;
}

const SecuritySection: React.FC<SecuritySectionProps> = ({ onSuccess }) => {
  const { updatePassword, enableTwoFactorAuth, disableTwoFactorAuth } = useUser();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError(null);
    
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    setIsLoading(true);
    const success = await updatePassword({
      currentPassword,
      newPassword,
      confirmNewPassword: confirmPassword,
    });
    
    setIsLoading(false);
    
    if (success) {
      onSuccess('Password updated successfully');
      setIsChangingPassword(false);
      e.currentTarget.reset();
    } else {
      setPasswordError('Failed to update password. Please check your current password and try again.');
    }
  };

  const toggleTwoFactorAuth = async () => {
    setIsLoading(true);
    if (twoFactorEnabled) {
      const success = await disableTwoFactorAuth();
      if (success) {
        setTwoFactorEnabled(false);
        onSuccess('Two-factor authentication disabled');
      }
    } else {
      const success = await enableTwoFactorAuth();
      if (success) {
        setTwoFactorEnabled(true);
        onSuccess('Two-factor authentication enabled');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Password Update Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Update Password
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Ensure your account is using a long, random password to stay secure.
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          {isChangingPassword ? (
            <form onSubmit={handlePasswordChange} className="divide-y divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-gray-400" />
                  Current Password
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <input
                    type="password"
                    name="currentPassword"
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter current password"
                  />
                </dd>
              </div>
              
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Key className="h-4 w-4 mr-2 text-gray-400" />
                  New Password
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <input
                    type="password"
                    name="newPassword"
                    required
                    minLength={8}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter new password"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 8 characters long
                  </p>
                </dd>
              </div>
              
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Key className="h-4 w-4 mr-2 text-gray-400" />
                  Confirm New Password
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    minLength={8}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Confirm new password"
                  />
                  {passwordError && (
                    <div className="mt-2 flex items-center text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{passwordError}</span>
                    </div>
                  )}
                </dd>
              </div>
              
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500"></dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                        isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      {isLoading ? (
                        'Saving...'
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordError(null);
                      }}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </dd>
              </div>
            </form>
          ) : (
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Password
              </dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className="flex-1">•••••••••••</span>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(true)}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Change
                </button>
              </dd>
            </div>
          )}
        </div>
      </div>

      {/* Two-Factor Authentication Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Two-Factor Authentication
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Add additional security to your account using two-factor authentication.
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <ShieldCheck className="h-4 w-4 mr-2 text-gray-400" />
              Status
            </dt>
            <dd className="mt-1 flex items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span className="flex items-center">
                {twoFactorEnabled ? (
                  <>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Enabled
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      Two-factor authentication is currently enabled.
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">
                    Two-factor authentication is currently disabled.
                  </span>
                )}
              </span>
            </dd>
          </div>
          
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500"></dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <button
                type="button"
                onClick={toggleTwoFactorAuth}
                disabled={isLoading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  twoFactorEnabled 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? (
                  'Processing...'
                ) : twoFactorEnabled ? (
                  'Disable Two-Factor Authentication'
                ) : (
                  'Enable Two-Factor Authentication'
                )}
              </button>
              <p className="mt-2 text-xs text-gray-500">
                {twoFactorEnabled 
                  ? 'Disabling two-factor authentication will reduce the security of your account.'
                  : 'When two-factor authentication is enabled, you will be prompted for a secure, random token during authentication.'}
              </p>
            </dd>
          </div>
        </div>
      </div>

      {/* Recent Device Activity */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Device Activity
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Review devices that have recently accessed your account.
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Current Session
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">MacBook Pro</p>
                  <p className="text-sm text-gray-500">Safari on macOS</p>
                  <p className="text-xs text-gray-400">Now active • 192.168.1.1</p>
                </div>
              </div>
            </dd>
          </div>
          
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t border-gray-100">
            <dt className="text-sm font-medium text-gray-500">
              Previous Sessions
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 space-y-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">iPhone 13</p>
                  <p className="text-sm text-gray-500">Safari on iOS</p>
                  <p className="text-xs text-gray-400">2 hours ago • 192.168.1.2</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Windows PC</p>
                  <p className="text-sm text-gray-500">Chrome on Windows</p>
                  <p className="text-xs text-gray-400">Yesterday • 192.168.1.3</p>
                </div>
              </div>
            </dd>
          </div>
          
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t border-gray-100">
            <dt className="text-sm font-medium text-gray-500"></dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all active sessions
              </button>
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;
