import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, Mail, MessageCircle } from 'lucide-react';

const HelpCenterPage = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>('general');
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    { id: 'general', name: 'General Questions' },
    { id: 'account', name: 'Account & Profile' },
    { id: 'subscription', name: 'Subscription & Billing' },
    { id: 'books', name: 'Books & Reading' },
    { id: 'technical', name: 'Technical Issues' },
  ];

  const faqs = [
    {
      id: 1,
      category: 'general',
      question: 'What is TextCentre?',
      answer: 'TextCentre is a digital reading platform that offers a wide selection of eBooks and audiobooks. Our platform combines traditional reading with AI-powered features to enhance your reading experience.'
    },
    {
      id: 2,
      category: 'general',
      question: 'How do I get started with TextCentre?',
      answer: 'To get started, create an account by clicking the "Register" button in the top right corner. Once registered, you can browse our collection, read free books, or subscribe to our premium plan for full access.'
    },
    {
      id: 3,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page. Enter your email address, and we\'ll send you instructions to reset your password.'
    },
    {
      id: 4,
      category: 'account',
      question: 'Can I use TextCentre on multiple devices?',
      answer: 'Yes, you can access your TextCentre account on multiple devices. Your reading progress and bookmarks will sync across all your devices automatically.'
    },
    {
      id: 5,
      category: 'subscription',
      question: 'What\'s included in the premium subscription?',
      answer: 'Our premium subscription gives you unlimited access to all books in our library, including premium titles and audiobooks. You also get access to AI-powered features like personalized recommendations and the AI reading assistant.'
    },
    {
      id: 6,
      category: 'subscription',
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription at any time from your dashboard. Go to Dashboard > Premium and click on "Cancel Subscription". Your premium access will remain active until the end of your current billing period.'
    },
    {
      id: 7,
      category: 'books',
      question: 'Can I read books offline?',
      answer: 'Yes, you can download books for offline reading on our mobile apps. Look for the download icon next to the book you want to read offline.'
    },
    {
      id: 8,
      category: 'books',
      question: 'How do I track my reading progress?',
      answer: 'Your reading progress is automatically tracked as you read. You can view your progress in your dashboard under the "Overview" tab.'
    },
    {
      id: 9,
      category: 'technical',
      question: 'What devices and browsers are supported?',
      answer: 'TextCentre works on all modern browsers including Chrome, Firefox, Safari, and Edge. We also have dedicated apps for iOS and Android devices.'
    },
    {
      id: 10,
      category: 'technical',
      question: 'I\'m experiencing technical issues. What should I do?',
      answer: 'First, try refreshing the page or restarting the app. If the issue persists, clear your browser cache or reinstall the app. If you still need help, contact our support team through the "Contact Support" button below.'
    },
  ];

  const filteredFaqs = searchQuery
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeCategory
      ? faqs.filter(faq => faq.category === activeCategory)
      : faqs;

  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);

  const toggleFaq = (id: number) => {
    setExpandedFaqs(prev => 
      prev.includes(id) 
        ? prev.filter(faqId => faqId !== id) 
        : [...prev, id]
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Help Center</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Find answers to common questions or contact our support team for assistance.
        </p>
      </div>

      {/* Search */}
      <div className="mb-10">
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      {!searchQuery && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {faqCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeCategory === category.id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* FAQs */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map(faq => (
            <div 
              key={faq.id} 
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <button
                className="w-full flex justify-between items-center p-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 focus:outline-none"
                onClick={() => toggleFaq(faq.id)}
              >
                <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                {expandedFaqs.includes(faq.id) ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {expandedFaqs.includes(faq.id) && (
                <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No results found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or browse by category.</p>
          </div>
        )}
      </div>

      {/* Contact Support */}
      <div className="mt-16 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Still need help?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Our support team is available to assist you with any questions or issues you may have.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a 
            href="mailto:support@textcentre.com" 
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Mail className="h-5 w-5 mr-2" />
            Email Support
          </a>
          <button 
            className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Live Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
