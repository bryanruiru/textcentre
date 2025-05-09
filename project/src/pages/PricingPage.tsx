import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Check, X, Crown, BookOpen, Clock } from 'lucide-react';
import PaymentButton from '../components/PaymentButton';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  annualPrice: number;
  description: string;
  features: {
    text: string;
    included: boolean;
  }[];
  buttonText: string;
  isPopular?: boolean;
  trialDays?: number;
}

const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const { auth } = useAppStore();

  const pricingTiers: PricingTier[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      annualPrice: 0,
      description: 'Basic access to our library',
      features: [
        { text: 'Access to free books', included: true },
        { text: 'Limited book previews', included: true },
        { text: '5 books per month', included: true },
        { text: 'Basic search', included: true },
        { text: 'Premium books', included: false },
        { text: 'Audiobooks', included: false },
        { text: 'Offline reading', included: false },
        { text: 'AI recommendations', included: false },
        { text: 'AI reading assistant', included: false },
      ],
      buttonText: 'Current Plan',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 999,
      annualPrice: 9990,
      description: 'Full access to our entire library',
      features: [
        { text: 'Access to free books', included: true },
        { text: 'Unlimited book access', included: true },
        { text: 'Unlimited books per month', included: true },
        { text: 'Advanced search', included: true },
        { text: 'Premium books', included: true },
        { text: 'Audiobooks', included: true },
        { text: 'Offline reading', included: true },
        { text: 'AI recommendations', included: true },
        { text: 'AI reading assistant', included: true },
      ],
      buttonText: 'Get Premium',
      isPopular: true,
      trialDays: 14,
    },
  ];

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  const getDiscountPercentage = (monthly: number, annual: number): number => {
    const monthlyAnnualized = monthly * 12;
    const savings = monthlyAnnualized - annual;
    return Math.round((savings / monthlyAnnualized) * 100);
  };

  // This function is kept for future use when adding more payment options
  // or custom handling for different subscription tiers
  /*
  const handleGetStarted = (tier: PricingTier) => {
    if (tier.id === 'free') {
      // Already on free plan
      return;
    }

    if (!auth.isAuthenticated) {
      navigate('/login', { state: { from: '/pricing', upgradeTier: tier.id } });
      return;
    }
  };
  */

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Reading Experience
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Unlock the full potential of TextCentre with our premium subscription.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex justify-center mb-8 sm:mb-12">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full inline-flex flex-wrap">
          <button
            className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400'
            } transition-colors duration-200`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium ${
              billingCycle === 'annual'
                ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400'
            } transition-colors duration-200`}
            onClick={() => setBillingCycle('annual')}
          >
            Annual
            <span className="ml-1 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
              Save {getDiscountPercentage(pricingTiers[1].price, pricingTiers[1].annualPrice / 12)}%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
        {pricingTiers.map((tier) => (
          <div
            key={tier.id}
            className={`relative rounded-2xl border ${
              tier.isPopular
                ? 'border-primary-500 border-2'
                : 'border-gray-200 dark:border-gray-700'
            } bg-white dark:bg-gray-800 shadow-lg overflow-hidden`}
          >
            {tier.isPopular && (
              <div className="absolute top-0 right-0 bg-primary-500 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                Most Popular
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center mb-4">
                {tier.id === 'premium' ? (
                  <Crown className="h-6 w-6 text-primary-500 mr-2" />
                ) : (
                  <BookOpen className="h-6 w-6 text-gray-400 mr-2" />
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tier.name}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{tier.description}</p>
              <div className="mb-6">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(billingCycle === 'monthly' ? tier.price : tier.annualPrice / 12)}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {tier.price > 0 ? '/month' : ''}
                </span>
                {billingCycle === 'annual' && tier.price > 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Billed as {formatPrice(tier.annualPrice)} annually
                  </div>
                )}
              </div>

              {tier.trialDays && (
                <div className="flex items-center mb-6 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-lg">
                  <Clock className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p className="text-sm">
                    <span className="font-medium">{tier.trialDays}-day free trial</span> - Cancel anytime
                  </p>
                </div>
              )}

              {tier.id === 'premium' ? (
                <PaymentButton
                  type="subscription"
                  className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors mb-6"
                >
                  {auth.user?.isPremium ? 'Manage Subscription' : tier.buttonText}
                </PaymentButton>
              ) : (
                <button
                  className="w-full py-3 px-4 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 font-medium rounded-lg mb-6 cursor-not-allowed"
                  disabled
                >
                  {tier.buttonText}
                </button>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">What's included:</h4>
              <ul className="space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    )}
                    <span
                      className={
                        feature.included
                          ? 'text-gray-700 dark:text-gray-300'
                          : 'text-gray-400 dark:text-gray-500'
                      }
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="mt-16 sm:mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 dark:text-white mb-6 sm:mb-8">
          What Our Premium Users Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              name: "Sarah Johnson",
              role: "Book Enthusiast",
              quote: "The premium subscription has completely transformed my reading experience. The AI recommendations are spot on!"
            },
            {
              name: "Michael Chen",
              role: "Student",
              quote: "Being able to access all the textbooks I need for my studies in one place has been a game-changer."
            },
            {
              name: "Aisha Patel",
              role: "Professional",
              quote: "I love the audiobook feature. I can listen during my commute and the selection is incredible."
            }
          ].map((testimonial, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 sm:mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 dark:text-white mb-6 sm:mb-8">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
          {[
            {
              question: "How does the free trial work?",
              answer: "You can try Premium for 14 days completely free. You'll need to provide payment details, but we won't charge you until the trial ends. You can cancel anytime before the trial ends and you won't be charged."
            },
            {
              question: "Can I cancel my subscription anytime?",
              answer: "Yes, you can cancel your subscription at any time. If you cancel, you'll still have access to Premium features until the end of your current billing period."
            },
            {
              question: "What happens to my saved books if I downgrade?",
              answer: "You'll still have access to all your saved free books. Premium books will be available in your library but will require an upgrade to access them again."
            },
            {
              question: "Is there a limit to how many books I can read?",
              answer: "Free users can access up to 5 books per month. Premium users have unlimited access to our entire library, including premium books and audiobooks."
            }
          ].map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
