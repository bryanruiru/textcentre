import React from 'react';
import { useAppStore } from '../store';
import { Book, BookOpen, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UsageLimitsProps {
  showUpgradeLink?: boolean;
}

const UsageLimits: React.FC<UsageLimitsProps> = ({ showUpgradeLink = true }) => {
  const { auth } = useAppStore();
  const isPremium = auth.user?.isPremium || false;
  
  // If user is premium, don't show usage limits
  if (isPremium) {
    return null;
  }
  
  // Default usage limits for free users
  const defaultUsage = {
    booksRead: 0,
    booksLimit: 5,
    previewsViewed: 0,
    previewsLimit: 10,
    aiQueriesUsed: 0,
    aiQueriesLimit: 5,
    lastResetDate: new Date().toISOString()
  };
  
  // Get actual usage from user profile or use defaults
  const usage = auth.user?.usageThisMonth || defaultUsage;
  
  // Calculate percentages for progress bars
  const booksPercentage = Math.min(100, Math.round((usage.booksRead / usage.booksLimit) * 100));
  const previewsPercentage = Math.min(100, Math.round((usage.previewsViewed / usage.previewsLimit) * 100));
  const aiQueriesPercentage = Math.min(100, Math.round((usage.aiQueriesUsed / usage.aiQueriesLimit) * 100));
  
  // Format date for display
  const resetDate = new Date(usage.lastResetDate);
  const nextResetDate = new Date(resetDate);
  nextResetDate.setMonth(nextResetDate.getMonth() + 1);
  
  const formattedNextReset = nextResetDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Monthly Usage Limits
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Resets on {formattedNextReset}
        </span>
        {showUpgradeLink && (
          <Link 
            to="/pricing" 
            className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline"
          >
            Upgrade for unlimited access
          </Link>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="space-y-4">
          <div>
            <div className="flex flex-wrap justify-between mb-1 gap-2">
              <div className="flex items-center">
                <BookOpen size={16} className="mr-2 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Books Read</span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {usage.booksRead} / {usage.booksLimit}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${booksPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex flex-wrap justify-between mb-1 gap-2">
              <div className="flex items-center">
                <Book size={16} className="mr-2 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Previews Viewed</span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {usage.previewsViewed} / {usage.previewsLimit}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${previewsPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex flex-wrap justify-between mb-1 gap-2">
              <div className="flex items-center">
                <Zap size={16} className="mr-2 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Queries</span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {usage.aiQueriesUsed} / {usage.aiQueriesLimit}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${aiQueriesPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Limits reset on {formattedNextReset}
      </div>
    </div>
  );
};

export default UsageLimits;
