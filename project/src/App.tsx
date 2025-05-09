import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import AudiobooksPage from './pages/AudiobooksPage';
import EbooksPage from './pages/EbooksPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BookDetailsPage from './pages/BookDetailsPage';
import ReaderPage from './pages/ReaderPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/UserDashboardPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PricingPage from './pages/PricingPage';
import SubscriptionPage from './pages/SubscriptionPage';
import HelpCenterPage from './pages/HelpCenterPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AccessibilityPage from './pages/AccessibilityPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import CareersPage from './pages/CareersPage';
import toast, { Toaster } from 'react-hot-toast';
import { NotificationProvider } from './contexts/NotificationContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { auth } = useAppStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check authentication status on mount and when auth changes
  useEffect(() => {
    const checkAuth = async () => {
      setIsCheckingAuth(true);
      
      // First check store state
      if (auth.isAuthenticated && auth.token) {
        setIsAuthenticated(true);
      } else {
        // Double-check with Supabase as a fallback
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      }
      
      setIsCheckingAuth(false);
    };
    
    checkAuth();
  }, [auth.isAuthenticated, auth.token]);
  
  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { currentTheme, login, logout } = useAppStore();
  
  // Handle auth state changes - optimized for faster sign-in
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          try {
            // Log user in immediately with session data to avoid delay
            // This provides immediate feedback to the user
            login(session.access_token, {
              id: session.user.id,
              name: session.user.user_metadata?.full_name || 'User',
              email: session.user.email!,
              isPremium: false // Default value until we get the actual value
            });
            
            // Then fetch profile data in the background
            const { data: profile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError) {
              // Only create a new profile if it doesn't exist
              if (profileError.code === 'PGRST116') { // 'not found'
                // Create profile in background
                const { data: newProfile, error } = await supabase.from('users')
                  .insert({
                    id: session.user.id,
                    full_name: session.user.user_metadata?.full_name || 'User',
                    email: session.user.email,
                    is_premium: false
                  })
                  .select('*')
                  .single();

                if (error) {
                  console.error('Error creating user profile:', error);
                  // Don't show error toast as user is already logged in
                } else if (newProfile) {
                  // Update user state with complete profile data
                  login(session.access_token, {
                    id: session.user.id,
                    name: newProfile.full_name,
                    email: session.user.email!,
                    isPremium: newProfile.is_premium
                  });
                }
              } else {
                console.error('Error fetching user profile:', profileError);
                // Don't show error toast as user is already logged in
              }
            } else if (profile) {
              // Update user state with complete profile data
              login(session.access_token, {
                id: session.user.id,
                name: profile.full_name,
                email: session.user.email!,
                isPremium: profile.is_premium
              });
            }
            
            // Show welcome toast after login (not dependent on profile fetch)
            toast.success(`Welcome back!`);
          } catch (error) {
            console.error('Authentication error:', error);
            // User is already logged in, so no need to show error
          }
        } else if (event === 'SIGNED_OUT') {
          logout();
          // Force redirect to homepage on sign out
          window.location.href = '/';
        }
      }
    );

    // Optimized session check - only check if we don't have a user already
    const checkSession = async () => {
      const { auth } = useAppStore.getState();
      if (!auth.isAuthenticated) {
        const { data } = await supabase.auth.getSession();
        // If session exists, the onAuthStateChange handler will handle it
        if (data.session) {
          console.log('Existing session found');
        }
      }
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [login, logout]);
  
  // Apply theme
  useEffect(() => {
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  return (
    <ErrorBoundary>
      <div className={`min-h-screen flex flex-col ${currentTheme === 'dark' ? 'dark' : ''}`}>
        <Router>
          <NotificationProvider>
            <Navbar />
            <Toaster position="top-right" />
            <main className="flex-grow bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/audiobooks" element={<AudiobooksPage />} />
                <Route path="/ebooks" element={<EbooksPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/book/:id" element={<BookDetailsPage />} />
                <Route path="/read/:id" element={<ReaderPage />} />
                <Route path="/payment/success" element={<PaymentSuccessPage />} />
                <Route path="/payment/cancel" element={<PaymentCancelPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                
                {/* Protected Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <UserDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/library" element={
                  <ProtectedRoute>
                    <UserDashboardPage activeTab="library" />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <UserDashboardPage activeTab="settings" />
                  </ProtectedRoute>
                } />
                <Route path="/subscription" element={
                  <ProtectedRoute>
                    <SubscriptionPage />
                  </ProtectedRoute>
                } />
                <Route path="/premium" element={
                  <ProtectedRoute>
                    <UserDashboardPage activeTab="premium" />
                  </ProtectedRoute>
                } />
                
                {/* Support Pages */}
                <Route path="/help" element={<HelpCenterPage />} />
                <Route path="/terms" element={<TermsOfServicePage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/accessibility" element={<AccessibilityPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:id" element={<BlogPostPage />} />
                <Route path="/careers" element={<CareersPage />} />
              </Routes>
            </main>
            <Footer />
          </NotificationProvider>
        </Router>
      </div>
    </ErrorBoundary>
  );
}

export default App;