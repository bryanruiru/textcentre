import React, { useState, useEffect, Suspense } from 'react';
import { Crown, CreditCard, Calendar, BookOpen, Zap } from 'lucide-react';
import { useAppStore } from '../../store';
import toast from 'react-hot-toast';
import { getSubscriptionPlans, cancelSubscription, upgradeToPremium, getUserProfile, createCheckoutSession } from '../../api';
import { SubscriptionPlan, Subscription } from '../../types';

// Extend the SubscriptionPlan type to include savings property
interface ExtendedSubscriptionPlan extends SubscriptionPlan {
  savings?: number;
}

// Extend the Subscription type to include additional properties
interface ExtendedSubscription extends Subscription {
  nextBillingDate?: string;
  plan?: string;
}

const DashboardPremium: React.FC = () => {
  const { auth, userProfile, setUserProfile } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<ExtendedSubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState('');

  // Fetch subscription plans
  useEffect(() => {
    let isMounted = true;
    const fetchSubscriptionPlans = async () => {
      try {
        // Check if we have cached plans and they're less than 1 hour old
        const cachedPlans = localStorage.getItem('subscriptionPlans');
        const cachedTime = localStorage.getItem('subscriptionPlansTime');
        
        if (cachedPlans && cachedTime && (Date.now() - parseInt(cachedTime)) < 3600000) {
          // Use cached plans if they're recent
          const plans = JSON.parse(cachedPlans) as ExtendedSubscriptionPlan[];
          if (isMounted) {
            setSubscriptionPlans(plans);
            // Set default selected plan to the popular one or the first one
            const popularPlan = plans.find((plan: ExtendedSubscriptionPlan) => plan.is_popular);
            setSelectedPlan(popularPlan?.id || (plans.length > 0 ? plans[0].id : ''));
          }
          return;
        }
        
        const plans = await getSubscriptionPlans() as ExtendedSubscriptionPlan[];
        if (isMounted) {
          setSubscriptionPlans(plans);
          
          // Set default selected plan to the popular one or the first one
          const popularPlan = plans.find((plan: ExtendedSubscriptionPlan) => plan.is_popular);
          setSelectedPlan(popularPlan?.id || (plans.length > 0 ? plans[0].id : ''));
          
          // Cache the plans
          localStorage.setItem('subscriptionPlans', JSON.stringify(plans));
          localStorage.setItem('subscriptionPlansTime', Date.now().toString());
        }
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
      }
    };
    
    fetchSubscriptionPlans();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpgradeToPremium = async () => {
    if (!auth.token || !selectedPlan) return;
    
    setIsLoading(true);
    try {
      await createCheckoutSession({
        type: 'subscription',
        userId: auth.user.id,
        planId: selectedPlan,
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`
      });
    } catch (error) {
      console.error('Error starting premium upgrade:', error);
      toast.error('Failed to start premium upgrade. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your premium subscription? You will still have access until the end of your billing period.')) {
      return;
    }
    
    if (auth.token) {
      setIsLoading(true);
      try {
        await cancelSubscription(auth.token);
        // Refresh user profile after cancellation
        const response = await getUserProfile(auth.token);
        setUserProfile(response.user);
        toast.success('Your subscription has been set to cancel at the end of the billing period.');
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        toast.error('Failed to cancel subscription. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Premium Subscription</h1>
      
      {/* Premium Subscription Management */}
      <Suspense fallback={<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 h-40 animate-pulse"></div>}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          {auth.user?.isPremium ? (
            <div>
              <div className="flex items-center mb-4">
                <Crown size={24} className="text-amber-500 mr-3" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Premium Subscription</h2>
              </div>
              
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
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Plan</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {(userProfile?.subscription as ExtendedSubscription)?.plan || 'Annual'}
                    </p>
                  </div>
                </div>
              </div>
              
              {userProfile?.subscription?.status !== 'canceled' && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={isLoading}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Cancel subscription'}
                </button>
              )}
            </div>
          ) : (
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Upgrade to Premium to unlock unlimited access to all books and exclusive features.
              </p>
              
              <div className="space-y-4 mb-6">
                {subscriptionPlans.map((plan) => (
                  <div 
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedPlan === plan.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium text-gray-900 dark:text-white">{plan.name}</h3>
                          {plan.is_popular && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{plan.description}</p>
                        
                        <div className="mt-2 flex items-center">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/{plan.interval}</span>
                        </div>
                        
                        {plan.savings && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            Save {plan.savings}% compared to monthly
                          </p>
                        )}
                      </div>
                      
                      <div className="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center
                        ${selectedPlan === plan.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-600'}">
                        {selectedPlan === plan.id && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-3 sm:mb-0">
                  <CreditCard size={20} className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Secure payment</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={20} className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Cancel anytime</span>
                </div>
              </div>
              
              <button
                onClick={handleUpgradeToPremium}
                disabled={isLoading || !selectedPlan}
                className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Upgrade Now'}
              </button>
            </div>
          )}
        </div>
      </Suspense>
      
      {/* Premium Features */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Premium Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Unlimited Books</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Access our entire library of books without any restrictions.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-3">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">AI Recommendations</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Get personalized book recommendations based on your reading history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPremium;
