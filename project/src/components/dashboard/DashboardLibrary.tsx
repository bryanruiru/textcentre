import React, { lazy, Suspense, useState } from 'react';
import { useAppStore } from '../../store';

// Lazy load components to improve initial loading time
const BookCard = lazy(() => import('../BookCard'));

const DashboardLibrary: React.FC = () => {
  const { books } = useAppStore();
  const [filter, setFilter] = useState('all');
  
  // Filter books based on selected filter
  const filteredBooks = books.filter(book => {
    if (filter === 'all') return true;
    if (filter === 'reading' && book.progress && book.progress > 0 && book.progress < 100) return true;
    if (filter === 'completed' && book.progress === 100) return true;
    if (filter === 'saved' && book.saved) return true;
    return false;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Library</h1>
      
      {/* Filter tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            filter === 'all'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All Books
        </button>
        <button
          onClick={() => setFilter('reading')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            filter === 'reading'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Currently Reading
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            filter === 'completed'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('saved')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            filter === 'saved'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Saved for Later
        </button>
      </div>
      
      {/* Books grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Suspense fallback={
          <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl"></div>
            ))}
          </div>
        }>
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} showProgress />
            ))
          ) : (
            <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {filter === 'all' 
                  ? "You don't have any books in your library yet." 
                  : filter === 'reading'
                    ? "You're not currently reading any books."
                    : filter === 'completed'
                      ? "You haven't completed any books yet."
                      : "You haven't saved any books for later."}
              </p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default DashboardLibrary;
