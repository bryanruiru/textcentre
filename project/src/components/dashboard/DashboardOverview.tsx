import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookMarked, 
  Award, 
  Clock, 
  Zap
} from 'lucide-react';
import { useAppStore } from '../../store';
import { UserProfile } from '../../types';

// Extended UserProfile type with readingStreak property
interface ExtendedUserProfile extends UserProfile {
  stats?: {
    totalBooks: number;
    completedBooks: number;
    readingTime?: number;
    readingStreak?: number;
  };
}

// Extended BookCard props
interface ExtendedBookCardProps {
  book: any;
  showProgress?: boolean;
  compact?: boolean;
  size?: 'small' | 'medium' | 'large';
}

// Lazy load components to improve initial loading time
const BookCard = lazy(() => import('../BookCard'));
const UsageLimits = lazy(() => import('../UsageLimits'));

const DashboardOverview: React.FC = () => {
  const { auth, userProfile, books } = useAppStore();
  const extendedProfile = userProfile as ExtendedUserProfile;
  
  // Mock data for demonstration
  const recentlyReadBooks = books.filter(book => book.progress !== undefined).slice(0, 3);
  const savedBooks = books.slice(3, 7);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      
      {/* Usage Limits for free users */}
      {!auth.user?.isPremium && <UsageLimits />}
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Books in Library</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {extendedProfile?.stats?.totalBooks || 12}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <BookMarked size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Books Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {extendedProfile?.stats?.completedBooks || 5}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <Award size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Reading Streak</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {extendedProfile?.stats?.readingStreak || 7} days
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Zap size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Reading Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {extendedProfile?.stats?.readingTime || 24} hrs
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Clock size={20} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Recently read books */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Continue Reading</h2>
          <Link to="/library" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Suspense fallback={<div className="col-span-3 h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl"></div>}>
            {recentlyReadBooks.length > 0 ? (
              recentlyReadBooks.map((book) => (
                <BookCard key={book.id} book={book} {...({showProgress: true} as ExtendedBookCardProps)} />
              ))
            ) : (
              <div className="col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">You haven't started reading any books yet.</p>
                <Link to="/browse" className="inline-block mt-2 text-blue-600 dark:text-blue-400 hover:underline">
                  Browse Books
                </Link>
              </div>
            )}
          </Suspense>
        </div>
      </div>
      
      {/* Saved books */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Saved for Later</h2>
          <Link to="/library" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Suspense fallback={<div className="col-span-4 h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl"></div>}>
            {savedBooks.length > 0 ? (
              savedBooks.map((book) => (
                <BookCard key={book.id} book={book} {...({compact: true} as ExtendedBookCardProps)} />
              ))
            ) : (
              <div className="col-span-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">You haven't saved any books yet.</p>
                <Link to="/browse" className="inline-block mt-2 text-blue-600 dark:text-blue-400 hover:underline">
                  Browse Books
                </Link>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
