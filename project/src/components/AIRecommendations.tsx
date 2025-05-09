import React, { useState, useEffect } from 'react';
import { Brain, Loader2, RefreshCw } from 'lucide-react';
import { useAppStore } from '../store';
import { getBookRecommendations } from '../services/aiService';
import { Book } from '../types';
import BookCard from './BookCard';
import toast from 'react-hot-toast';

interface AIRecommendationsProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  genre?: string;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  title = 'Recommended for You',
  subtitle = 'Personalized picks based on your reading history',
  limit = 4,
  genre
}) => {
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { auth } = useAppStore();
  
  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!auth.isAuthenticated) {
        throw new Error('User not authenticated');
      }
      
      const books = await getBookRecommendations(limit, genre);
      setRecommendations(books);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations');
      toast.error('Could not load personalized recommendations');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Only fetch recommendations if user is authenticated and premium
    if (auth.isAuthenticated && auth.user?.isPremium) {
      fetchRecommendations();
    } else {
      setIsLoading(false);
      if (auth.isAuthenticated && !auth.user?.isPremium) {
        setError('Premium feature');
      }
    }
  }, [auth.isAuthenticated, auth.user?.isPremium]);
  
  if (!auth.isAuthenticated) {
    return null;
  }
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Brain className="mr-2 text-blue-600 dark:text-blue-400" size={24} />
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
        </div>
        
        {!isLoading && auth.user?.isPremium && (
          <button 
            onClick={fetchRecommendations}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            aria-label="Refresh recommendations"
          >
            <RefreshCw size={16} className="mr-1" />
            <span className="text-sm">Refresh</span>
          </button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 size={32} className="animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      ) : error === 'Premium feature' ? (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 text-center">
          <Brain size={48} className="mx-auto mb-4 text-amber-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Unlock AI-Powered Recommendations
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Upgrade to Premium to get personalized book recommendations based on your reading history and preferences.
          </p>
          <button className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Upgrade to Premium
          </button>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchRecommendations}
            className="mt-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            We don't have enough data yet to make personalized recommendations. Keep reading to help our AI learn your preferences!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
