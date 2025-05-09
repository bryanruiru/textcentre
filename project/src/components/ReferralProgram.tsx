import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Users, Copy, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ReferralProgram: React.FC = () => {
  const { auth } = useAppStore();
  const [copied, setCopied] = useState(false);
  
  // Generate a referral code if user doesn't have one
  const referralCode = auth.user?.referralCode || `${auth.user?.name?.split(' ')[0] || 'friend'}${Math.floor(Math.random() * 1000)}`;
  const referralCount = auth.user?.referralCount || 0;
  const referralUrl = `${window.location.origin}/signup?ref=${referralCode}`;
  
  // Handle copy to clipboard
  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralUrl)
      .then(() => {
        setCopied(true);
        toast.success('Referral link copied to clipboard!');
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy link. Please try again.');
      });
  };
  
  // Handle share via platforms
  const handleShare = (platform: 'twitter' | 'facebook' | 'whatsapp' | 'email') => {
    let shareUrl = '';
    const message = `Join me on TextCentre and get access to thousands of books! Sign up using my referral link:`;
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}&quote=${encodeURIComponent(message)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${message} ${referralUrl}`)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('Join me on TextCentre')}&body=${encodeURIComponent(`${message}\n\n${referralUrl}`)}`;
        break;
    }
    
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex items-center mb-4">
        <Users className="h-6 w-6 text-primary-500 mr-2 flex-shrink-0" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Invite Friends, Get Premium
        </h3>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Share your referral link with friends. When they sign up, you'll both get 7 days of Premium access for free!
      </p>
      
      {/* Referral stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="text-center sm:text-left">
          <p className="text-sm text-gray-500 dark:text-gray-400">Your Referrals</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{referralCount}</p>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-sm text-gray-500 dark:text-gray-400">Premium Days Earned</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{referralCount * 7}</p>
        </div>
      </div>
      
      {/* Referral link */}
      <div className="mb-6">
        <label htmlFor="referral-link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Referral Link
        </label>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <input
            id="referral-link"
            type="text"
            value={referralUrl}
            readOnly
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-r-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500 text-sm overflow-hidden text-ellipsis"
          />
          <button
            onClick={handleCopyReferralLink}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg sm:rounded-l-none flex items-center justify-center transition-colors duration-200"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Share options */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Share via
        </p>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => handleShare('twitter')}
            className="p-2 bg-[#1DA1F2] text-white rounded-full hover:bg-opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DA1F2]"
            aria-label="Share on Twitter"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </button>
          <button 
            onClick={() => handleShare('facebook')}
            className="p-2 bg-[#4267B2] text-white rounded-full hover:bg-opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4267B2]"
            aria-label="Share on Facebook"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>
          <button 
            onClick={() => handleShare('whatsapp')}
            className="p-2 bg-[#25D366] text-white rounded-full hover:bg-opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
            aria-label="Share on WhatsApp"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </button>
          <button 
            onClick={() => handleShare('email')}
            className="p-2 bg-gray-500 text-white rounded-full hover:bg-opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            aria-label="Share via Email"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Referral tiers */}
      <div className="mt-8">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
          Referral Rewards
        </h4>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 font-medium">
              1
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                First Referral
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                7 days of Premium access
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 font-medium">
              5
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                5 Referrals
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                1 month of Premium access
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 font-medium">
              10
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                10 Referrals
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                3 months of Premium access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralProgram;
