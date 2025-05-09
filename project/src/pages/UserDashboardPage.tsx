import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { getUserProfile, upgradeToPremium } from '../api';

// Import modular dashboard components
import {
  DashboardSidebar,
  DashboardOverview,
  DashboardLibrary,
  DashboardPremium,
  DashboardSettings,
  DashboardReferrals
} from '../components/dashboard';

interface UserDashboardPageProps {
  activeTab?: 'overview' | 'library' | 'settings' | 'premium' | 'referrals';
}

const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ activeTab = 'overview' }) => {
  const { auth, setUserProfile } = useAppStore();
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [isLoading, setIsLoading] = useState(false);
  
  // Update active tab when prop changes
  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);
  
  // Fetch user profile data on mount
  useEffect(() => {
    let isMounted = true;
    const fetchUserProfile = async () => {
      if (auth.token) {
        try {
          const response = await getUserProfile(auth.token);
          if (isMounted) {
            setUserProfile(response.user);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };
    
    fetchUserProfile();
    
    return () => {
      isMounted = false;
    };
  }, [auth.token, setUserProfile]);
  
  const handleUpgradeToPremium = async () => {
    if (auth.token) {
      setIsLoading(true);
      try {
        await upgradeToPremium(auth.token);
        // Refresh user profile after upgrade
        const response = await getUserProfile(auth.token);
        setUserProfile(response.user);
      } catch (error) {
        console.error('Error upgrading to premium:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Loading state with skeleton UI
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4 animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-96"></div>
          </div>
          <div className="md:w-3/4 animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-96"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <DashboardSidebar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          handleUpgradeToPremium={handleUpgradeToPremium} 
        />
        
        {/* Main content */}
        <div className="md:w-3/4">
          {currentTab === 'overview' && <DashboardOverview />}
          {currentTab === 'library' && <DashboardLibrary />}
          {currentTab === 'premium' && <DashboardPremium />}
          {currentTab === 'settings' && <DashboardSettings />}
          {currentTab === 'referrals' && <DashboardReferrals />}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
