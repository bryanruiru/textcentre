import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Headphones, Clock, Filter } from 'lucide-react';
import BookCard from '../components/BookCard';

const AudiobooksPage: React.FC = () => {
  const { books } = useAppStore();
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [durationFilter, setDurationFilter] = useState<string>('all');

  const audiobooks = books.filter(book => book.hasAudio);
  const genres = Array.from(new Set(audiobooks.flatMap(book => book.genre)));

  const filteredBooks = audiobooks.filter(book => {
    const genreMatch = selectedGenre === 'all' || book.genre.includes(selectedGenre);
    // Mock duration filter - in a real app, we'd have actual duration data
    const durationMatch = durationFilter === 'all';
    return genreMatch && durationMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Audiobooks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Listen to professionally narrated audiobooks
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
          <div className="relative">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>

          <div className="relative">
            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Any Length</option>
              <option value="short">Under 3 hours</option>
              <option value="medium">3-8 hours</option>
              <option value="long">Over 8 hours</option>
            </select>
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
      </div>

      {/* Featured Audiobook */}
      {filteredBooks.length > 0 && (
        <div className="mb-12">
          <div className="relative h-[400px] rounded-2xl overflow-hidden">
            <img
              src={filteredBooks[0].coverImage}
              alt={filteredBooks[0].title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent">
              <div className="absolute bottom-0 left-0 p-8 text-white max-w-2xl">
                <div className="flex items-center mb-4">
                  <Headphones className="mr-2" size={24} />
                  <span className="text-lg font-medium">Featured Audiobook</span>
                </div>
                <h2 className="text-4xl font-bold mb-2">{filteredBooks[0].title}</h2>
                <p className="text-lg mb-4">By {filteredBooks[0].author}</p>
                <p className="text-gray-300 mb-6 line-clamp-2">{filteredBooks[0].description}</p>
                <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-full font-medium transition-colors">
                  Listen Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredBooks.slice(1).map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default AudiobooksPage;