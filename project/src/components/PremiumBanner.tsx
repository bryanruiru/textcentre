import React from 'react';
import { Crown, BookOpen, Headphones, Zap, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const PremiumBanner: React.FC = () => {
  return (
    <div className="relative my-10 rounded-xl overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-800"></div>
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }}></div>
      
      {/* Content */}
      <div className="relative px-6 py-8 md:p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:flex-1">
            <div className="flex items-center mb-4">
              <Crown className="h-6 w-6 text-yellow-300 mr-2" />
              <h2 className="text-2xl font-bold">Upgrade to Premium</h2>
            </div>
            
            <p className="mb-6 max-w-xl text-blue-100">
              Unlock unlimited access to our entire library of ebooks and audiobooks, 
              plus exclusive AI-powered features to enhance your reading experience.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-start">
                <BookOpen className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0" />
                <span className="text-sm">Unlimited ebooks</span>
              </div>
              <div className="flex items-start">
                <Headphones className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0" />
                <span className="text-sm">All audiobooks</span>
              </div>
              <div className="flex items-start">
                <Download className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0" />
                <span className="text-sm">Offline reading</span>
              </div>
              <div className="flex items-start">
                <Zap className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0" />
                <span className="text-sm">AI features</span>
              </div>
            </div>
            
            <Link 
              to="/premium"
              className="inline-block px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-full transition-colors"
            >
              Try Premium Free for 7 Days
            </Link>
          </div>
          
          <div className="hidden md:block md:w-1/3 lg:w-1/4">
            <div className="relative mt-8 md:mt-0 md:-mr-8 md:-mb-8">
              <div className="absolute -top-4 -left-4 w-32 h-44 rounded-lg shadow-lg transform rotate-6" style={{ 
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                zIndex: 1
              }}></div>
              <div className="absolute -top-2 -left-2 w-32 h-44 rounded-lg shadow-lg transform -rotate-3" style={{ 
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                zIndex: 2
              }}></div>
              <div className="relative w-32 h-44 rounded-lg shadow-lg transform rotate-1" style={{ 
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                zIndex: 3
              }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumBanner;