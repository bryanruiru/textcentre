import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useAppStore } from '../store';
import { supabase } from '../lib/supabase';
// import { validatePaymentSession } from '../lib/stripe'; // We'll implement this directly
import toast from 'react-hot-toast';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUserProfile } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        if (!sessionId) {
          throw new Error('No session ID provided');
        }

        // Check if this is a mock checkout session
        const mockCheckoutData = localStorage.getItem('mockCheckout');
        let checkoutData;
        
        if (mockCheckoutData) {
          checkoutData = JSON.parse(mockCheckoutData);
          
          // Verify the session ID matches and the checkout is recent (within last hour)
          if (checkoutData.sessionId === sessionId && 
              (Date.now() - checkoutData.timestamp) < 3600000) {
            console.log('Valid mock checkout session detected');
            setIsValid(true);
          } else {
            // Clean up old mock checkout data
            localStorage.removeItem('mockCheckout');
            throw new Error('Invalid or expired checkout session');
          }
        } else {
          // In a real implementation, we would validate with Stripe here
          // For demo purposes, we'll accept any session ID
          console.log('No mock checkout data found, assuming valid session');
          setIsValid(true);
        }

        // Refresh user data
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not found');

        // Handle different checkout types
        if (mockCheckoutData) {
          checkoutData = JSON.parse(mockCheckoutData);
          
          if (checkoutData.type === 'subscription') {
            // Update user to premium
            const { error: userError } = await supabase
              .from('users')
              .update({ is_premium: true })
              .eq('id', user.id);
              
            if (userError) throw userError;
            
            // Create subscription record
            const now = new Date();
            const renewalDate = new Date();
            
            // Set renewal date based on plan (monthly or annual)
            if (checkoutData.planId?.includes('annual')) {
              renewalDate.setFullYear(now.getFullYear() + 1); // 1 year subscription
            } else {
              renewalDate.setMonth(now.getMonth() + 1); // 1 month subscription
            }
            
            const { error: subError } = await supabase
              .from('subscriptions')
              .upsert({
                user_id: user.id,
                plan_id: checkoutData.planId || 'premium-annual',
                status: 'active',
                current_period_start: now.toISOString(),
                current_period_end: renewalDate.toISOString(),
                cancel_at_period_end: false
              });
              
            if (subError) throw subError;
            
            // Clean up mock checkout data
            localStorage.removeItem('mockCheckout');
          } else if (checkoutData.type === 'book') {
            // Add book to user's library
            const { error: bookError } = await supabase
              .from('user_books')
              .upsert({
                user_id: user.id,
                book_id: checkoutData.bookId,
                purchased_at: new Date().toISOString(),
                is_owned: true
              });
              
            if (bookError) throw bookError;
            
            // Clean up mock checkout data
            localStorage.removeItem('mockCheckout');
          }
        } else {
          // Default behavior for real Stripe checkout or when no mock data is available
          // Update user to premium
          const { error: userError } = await supabase
            .from('users')
            .update({ is_premium: true })
            .eq('id', user.id);
            
          if (userError) throw userError;
          
          // Create subscription record
          const now = new Date();
          const renewalDate = new Date();
          renewalDate.setFullYear(now.getFullYear() + 1); // 1 year subscription
          
          const { error: subError } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: user.id,
              plan_id: 'premium-annual', // Default plan
              status: 'active',
              current_period_start: now.toISOString(),
              current_period_end: renewalDate.toISOString(),
              cancel_at_period_end: false
            });
            
          if (subError) throw subError;
        }

        // Get updated profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserProfile(profile);
        }

        toast.success('Welcome to TextCentre Premium!', {
          icon: '👑',
          duration: 5000
        });

        // Redirect after a delay
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      } catch (error) {
        console.error('Payment verification error:', error);
        toast.error('Failed to verify payment. Please contact support.');
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, setUserProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
          {isValid ? (
            <>
              <div className="flex justify-center mb-6">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Successful!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Thank you for your purchase. You will be redirected to your profile page shortly.
              </p>
              <button
                onClick={() => navigate('/profile')}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Go to Profile
              </button>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <svg className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Verification Failed
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We couldn't verify your payment. Please contact our support team for assistance.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Contact Support
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Return Home
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;