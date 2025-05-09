import React from 'react';
import { genres } from '../mockData';

const GenreSelector: React.FC = () => {
  return (
    <div className="my-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Browse by Genre</h2>
      
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <button
            key={genre}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors"
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreSelector;