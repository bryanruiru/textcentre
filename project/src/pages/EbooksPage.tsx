import React, { useState } from 'react';
import { useAppStore } from '../store';
import { BookOpen, Filter, Clock } from 'lucide-react';
import BookCard from '../components/BookCard';

const EbooksPage: React.FC = () => {
  const { books } = useAppStore();
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [lengthFilter, setLengthFilter] = useState<string>('all');

  // Filter books that are eBooks (not audiobooks and not physical)
  // In a real app, you would have a specific flag for eBooks
  const ebooks = books.filter(book => !book.hasAudio && !book.isPremium);
  const genres = Array.from(new Set(ebooks.flatMap(book => book.genre)));

  const filteredBooks = ebooks.filter(book => {
    const genreMatch = selectedGenre === 'all' || book.genre.includes(selectedGenre);
    // Mock length filter - in a real app, we'd have actual page count data
    const lengthMatch = lengthFilter === 'all';
    return genreMatch && lengthMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            eBooks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore our collection of digital books for all devices
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
              value={lengthFilter}
              onChange={(e) => setLengthFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Any Length</option>
              <option value="short">Short (&lt; 200 pages)</option>
              <option value="medium">Medium (200-400 pages)</option>
              <option value="long">Long (&gt; 400 pages)</option>
            </select>
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
      </div>

      {/* Featured eBook */}
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
                  <BookOpen className="mr-2" size={24} />
                  <span className="text-lg font-medium">Featured eBook</span>
                </div>
                <h2 className="text-4xl font-bold mb-2">{filteredBooks[0].title}</h2>
                <p className="text-lg mb-4">By {filteredBooks[0].author}</p>
                <p className="text-gray-300 mb-6 line-clamp-2">{filteredBooks[0].description}</p>
                <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-full font-medium transition-colors">
                  Read Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* eBooks Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredBooks.slice(1).map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Empty State */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No eBooks Found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or check back later for new additions.
          </p>
        </div>
      )}
    </div>
  );
};

export default EbooksPage;
