import React from 'react';
import { Lock, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import PaymentButton from './PaymentButton';

interface PremiumContentPreviewProps {
  bookId: string;
  title: string;
  previewPercentage?: number; // How much of the content to show as preview (default 10%)
  children: React.ReactNode; // The actual content
}

const PremiumContentPreview: React.FC<PremiumContentPreviewProps> = ({
  bookId,
  title,
  previewPercentage = 10,
  children
}) => {
  const { auth, userProfile } = useAppStore();
  const isPremium = auth.user?.isPremium || false;
  
  // If user is premium, show full content
  if (isPremium) {
    return <>{children}</>;
  }

  // For non-premium users, show partial content with upgrade prompt
  return (
    <div className="relative">
      <div className="relative">
        {/* Preview content - limited to previewPercentage */}
        <div className="relative overflow-hidden" style={{ maxHeight: '300px' }}>
          {children}
          
          {/* Gradient overlay */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"
            aria-hidden="true"
          />
        </div>
        
        {/* Premium content message */}
        <div className="mt-4 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <Crown className="h-6 w-6 text-yellow-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Premium Content
            </h3>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You're viewing a {previewPercentage}% preview of <strong>{title}</strong>. 
            Upgrade to Premium to access the full content and unlock all premium features.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <PaymentButton
              type="subscription"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg"
            >
              Upgrade to Premium
            </PaymentButton>
            
            <PaymentButton
              type="book"
              bookId={bookId}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white font-medium rounded-lg"
            >
              Purchase This Book
            </PaymentButton>
            
            <Link 
              to="/pricing" 
              className="px-4 py-2 text-primary-600 dark:text-primary-400 font-medium"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumContentPreview;
