import React, { lazy, Suspense } from 'react';
import { Users, Gift, Award } from 'lucide-react';
import { useAppStore } from '../../store';
import { UserProfile } from '../../types';

// Extended UserProfile type with referrals property
interface ExtendedUserProfile extends UserProfile {
  referrals?: {
    total: number;
    pending: number;
    completed: number;
    rewards: number;
  };
}

// Lazy load components
const ReferralProgram = lazy(() => import('../ReferralProgram'));

const DashboardReferrals: React.FC = () => {
  const { userProfile } = useAppStore();
  const extendedProfile = userProfile as ExtendedUserProfile;
  
  // Mock referral data
  const referralStats = {
    totalReferrals: extendedProfile?.referrals?.total || 0,
    pendingReferrals: extendedProfile?.referrals?.pending || 0,
    completedReferrals: extendedProfile?.referrals?.completed || 0,
    rewardsEarned: extendedProfile?.referrals?.rewards || 0,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Referral Program</h1>
      
      <Suspense fallback={<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 h-40 animate-pulse"></div>}>
        <ReferralProgram />
      </Suspense>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Referrals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {referralStats.totalReferrals}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Rewards Earned</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {referralStats.rewardsEarned}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Gift size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed Referrals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {referralStats.completedReferrals}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <Award size={20} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Referral history */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Referral History</h2>
        
        {referralStats.totalReferrals > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Reward
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {/* Sample data - would be replaced with actual referral history */}
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    John Doe
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    May 2, 2025
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                      Completed
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    1 month free
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Jane Smith
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    April 28, 2025
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full">
                      Pending
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    -
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You haven't referred anyone yet.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Share your referral link to start earning rewards!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardReferrals;
