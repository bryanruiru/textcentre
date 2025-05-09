import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { getSubscriptionStatus } from '../lib/stripe';
import { Crown, Calendar, CreditCard, CheckCircle, AlertTriangle, RefreshCw, BookOpen, Headphones, Zap } from 'lucide-react';
import ReferralProgram from '../components/ReferralProgram';
import toast from 'react-hot-toast';

const SubscriptionPage: React.FC = () => {
  const { auth } = useAppStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!auth.isAuthenticated) {
      navigate('/login', { state: { from: '/subscription' } });
      return;
    }
    
    // Fetch subscription details
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        const data = await getSubscriptionStatus(auth.user?.id || '');
        setSubscription(data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        toast.error('Failed to load subscription details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscription();
  }, [auth.isAuthenticated, auth.user?.id, navigate]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    // In a real app, this would call an API to cancel the subscription
    toast.success('Your subscription has been cancelled. You will have access until the end of your billing period.');
    setCancelConfirm(false);
    
    // Update subscription status
    setSubscription({
      ...subscription,
      cancel_at_period_end: true
    });
  };
  
  // Handle subscription reactivation
  const handleReactivateSubscription = async () => {
    // In a real app, this would call an API to reactivate the subscription
    toast.success('Your subscription has been reactivated!');
    
    // Update subscription status
    setSubscription({
      ...subscription,
      cancel_at_period_end: false
    });
  };
  
  // Handle updating payment method
  const handleUpdatePayment = () => {
    // In a real app, this would redirect to a Stripe portal or payment update page
    toast.success('Redirecting to payment update page...');
  };
  
  // Determine subscription status display
  const getStatusDisplay = () => {
    if (!subscription) return { color: 'gray', text: 'No Subscription' };
    
    if (subscription.is_in_trial) {
      return { 
        color: 'blue', 
        text: `Trial (${subscription.trial_days_remaining} days remaining)` 
      };
    }
    
    if (subscription.cancel_at_period_end) {
      return { color: 'yellow', text: 'Cancelling' };
    }
    
    switch (subscription.status) {
      case 'active':
        return { color: 'green', text: 'Active' };
      case 'past_due':
        return { color: 'red', text: 'Past Due' };
      case 'canceled':
        return { color: 'gray', text: 'Cancelled' };
      default:
        return { color: 'gray', text: subscription.status };
    }
  };
  
  const statusDisplay = getStatusDisplay();
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Subscription Management
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : !auth.user?.isPremium && !subscription ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <Crown className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No Active Subscription
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You don't have an active premium subscription. Upgrade to access premium features.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
            >
              View Premium Plans
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Subscription details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center mb-6">
              <Crown className="h-6 w-6 text-primary-500 mr-2" />
              <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                Premium Subscription
              </h2>
              <div className={`ml-auto px-3 py-1 rounded-full text-sm font-medium bg-${statusDisplay.color}-100 text-${statusDisplay.color}-800`}>
                {statusDisplay.text}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Plan Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Current Period
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(subscription?.current_period_start)} - {formatDate(subscription?.current_period_end)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CreditCard className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Payment Method
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        •••• •••• •••• 4242 (Visa)
                      </p>
                      <button
                        onClick={handleUpdatePayment}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-1"
                      >
                        Update payment method
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Subscription Status
                </h3>
                
                {subscription?.cancel_at_period_end ? (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          Your subscription is set to cancel
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                          You will lose access to premium features on {formatDate(subscription?.current_period_end)}.
                        </p>
                        <button
                          onClick={handleReactivateSubscription}
                          className="mt-2 text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:underline flex items-center"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Reactivate subscription
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          Your subscription is active
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          You have full access to all premium features.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {!subscription?.cancel_at_period_end && (
                  <div className="mt-4">
                    {cancelConfirm ? (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Are you sure you want to cancel? You'll still have access until {formatDate(subscription?.current_period_end)}.
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={handleCancelSubscription}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md"
                          >
                            Yes, Cancel
                          </button>
                          <button
                            onClick={() => setCancelConfirm(false)}
                            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-medium rounded-md"
                          >
                            No, Keep Subscription
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setCancelConfirm(true)}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        Cancel subscription
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Premium benefits */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
              Your Premium Benefits
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <BookOpen className="h-5 w-5 text-primary-500 mr-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white">Unlimited Books</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Access our entire library with no monthly limits
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Headphones className="h-5 w-5 text-primary-500 mr-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white">All Audiobooks</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Listen to any audiobook in our collection
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Zap className="h-5 w-5 text-primary-500 mr-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white">AI Features</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get personalized recommendations and AI assistance
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Referral program */}
      <ReferralProgram />
    </div>
  );
};

export default SubscriptionPage;
