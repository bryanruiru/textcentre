import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  BookOpen, 
  Settings, 
  LogOut, 
  Crown, 
  BarChart3,
  Users
} from 'lucide-react';
import { useAppStore } from '../../store';
import { NotificationBell } from '../notifications';

interface DashboardSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  handleUpgradeToPremium: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  currentTab, 
  setCurrentTab,
  handleUpgradeToPremium
}) => {
  const { auth, logout } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      // Force a page refresh to ensure all auth state is cleared
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/');
    }
  };

  return (
    <div className="md:w-1/4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
        {/* User info */}
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <User size={32} />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{auth.user?.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{auth.user?.email}</p>
            {auth.user?.isPremium && (
              <div className="flex items-center mt-1 text-amber-500">
                <Crown size={14} className="mr-1" />
                <span className="text-xs font-medium">Premium Member</span>
              </div>
            )}
          </div>
          <div className="ml-auto">
            <NotificationBell />
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-1">
          <button
            onClick={() => setCurrentTab('overview')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium ${
              currentTab === 'overview'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <BarChart3 size={18} className="mr-3" />
            Overview
          </button>
          
          <button
            onClick={() => setCurrentTab('library')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium ${
              currentTab === 'library'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <BookOpen size={18} className="mr-3" />
            My Library
          </button>

          {auth.user?.isPremium && (
            <button
              onClick={() => setCurrentTab('premium')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium ${
                currentTab === 'premium'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Crown size={18} className="mr-3 text-amber-500" />
              Premium
            </button>
          )}
          
          <button
            onClick={() => setCurrentTab('referrals')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium ${
              currentTab === 'referrals'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Users size={18} className="mr-3" />
            Referrals
          </button>
          
          <button
            onClick={() => setCurrentTab('settings')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium ${
              currentTab === 'settings'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Settings size={18} className="mr-3" />
            Settings
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <LogOut size={18} className="mr-3" />
            Sign Out
          </button>
        </nav>
        
        {/* Premium upgrade banner (if not premium) */}
        {!auth.user?.isPremium && (
          <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4 text-white">
            <div className="flex items-center mb-2">
              <Crown size={18} className="mr-2 text-yellow-300" />
              <h3 className="font-bold">Upgrade to Premium</h3>
            </div>
            <p className="text-sm mb-3 text-blue-100">
              Unlock unlimited access to all books and exclusive features.
            </p>
            <button 
              onClick={handleUpgradeToPremium}
              className="w-full py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardSidebar;
