import React, { useState } from 'react';
import { useAppStore } from '../../store';
import toast from 'react-hot-toast';
import { Subscription } from '../../types';

// Extended Subscription type with additional properties
interface ExtendedSubscription extends Subscription {
  nextBillingDate?: string;
}

const DashboardSettings: React.FC = () => {
  const { auth, userProfile } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock function to update user profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Profile updated successfully!');
    }, 1000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h1>
      
      {/* Profile settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Information</h2>
        
        <form onSubmit={handleUpdateProfile}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                defaultValue={auth.user?.name}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                defaultValue={auth.user?.email}
                disabled
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Your email address cannot be changed.
              </p>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Password settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Change Password</h2>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          toast.success('Password updated successfully!');
        }}>
          <div className="space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="current-password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Update Password
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Reading preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Reading Preferences</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="theme" 
                  value="light"
                  defaultValue="light"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700"
                />
                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Light</span>
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="theme" 
                  value="dark"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700"
                />
                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Dark</span>
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="theme" 
                  value="system"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700"
                />
                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">System</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font Size
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="font-size" 
                  value="small"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700"
                />
                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Small</span>
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="font-size" 
                  value="medium"
                  defaultValue="medium"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700"
                />
                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Medium</span>
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="font-size" 
                  value="large"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700"
                />
                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Large</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
              />
              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Enable page turn animations
              </span>
            </label>
          </div>
          
          <div>
            <button
              type="button"
              onClick={() => toast.success('Reading preferences saved!')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
      
      {/* Subscription section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Subscription</h2>
        
        {auth.user?.isPremium ? (
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You are currently on the Premium plan. You have access to all premium features.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {userProfile?.subscription?.status === 'canceled' 
                      ? 'Canceling at end of billing period' 
                      : 'Active'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Next billing date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {(userProfile?.subscription as ExtendedSubscription)?.nextBillingDate || 'June 15, 2025'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  // Navigate to premium tab
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Manage Subscription
              </button>
              
              {userProfile?.subscription?.status !== 'canceled' && (
                <button
                  type="button"
                  onClick={() => {
                    // Cancel subscription
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Upgrade to Premium to unlock unlimited access to all books and exclusive features.
            </p>
            <button
              type="button"
              onClick={() => {
                // Navigate to premium tab
              }}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-colors"
            >
              Upgrade to Premium
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardSettings;
