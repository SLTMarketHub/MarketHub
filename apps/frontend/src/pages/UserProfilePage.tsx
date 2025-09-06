import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import ProfileSection from '../components/profile/ProfileSection';
import SecuritySection from '../components/profile/SecuritySection';
import NotificationsSection from '../components/profile/NotificationsSection';

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, loading, error } = useUser();
  const [activeSection, setActiveSection] = useState('profile');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't load your profile information. Please try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection onSuccess={setSuccessMessage} />;
      case 'security':
        return <SecuritySection onSuccess={setSuccessMessage} />;
      case 'notifications':
        return <NotificationsSection onSuccess={setSuccessMessage} />;
      default:
        return <ProfileSection onSuccess={setSuccessMessage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 mb-4 md:mb-0"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              My Account
            </h1>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="lg:grid lg:grid-cols-12">
            {/* Sidebar */}
            <div className="lg:col-span-3 border-r border-gray-200 bg-gray-50">
              <nav className="p-4 space-y-1">
                <button
                  onClick={() => setActiveSection('profile')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeSection === 'profile'
                      ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <svg
                    className="mr-3 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile
                </button>
                
                <button
                  onClick={() => setActiveSection('security')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeSection === 'security'
                      ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <svg
                    className="mr-3 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Security
                </button>
                
                <button
                  onClick={() => setActiveSection('notifications')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeSection === 'notifications'
                      ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <svg
                    className="mr-3 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  Notifications
                </button>
                
                <button
                  onClick={() => setActiveSection('addresses')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeSection === 'addresses'
                      ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <svg
                    className="mr-3 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Addresses
                </button>
                
                <button
                  onClick={() => setActiveSection('payment')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeSection === 'payment'
                      ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <svg
                    className="mr-3 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Payment Methods
                </button>
              </nav>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-9 p-6">
              {renderSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
