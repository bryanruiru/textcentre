import React from 'react';
import { Link } from 'react-router-dom';
import { Play, BookOpen, Headphones } from 'lucide-react';
import { Book } from '../types';

interface FeaturedBookProps {
  book: Book;
}

const FeaturedBook: React.FC<FeaturedBookProps> = ({ book }) => {
  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-xl">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0">
        <img 
          src={book.coverImage} 
          alt={book.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-8 text-white">
        <div className="flex items-center space-x-2 mb-2">
          {book.hasAudio ? (
            <span className="flex items-center text-xs bg-blue-600 px-2 py-1 rounded-full">
              <Headphones size={12} className="mr-1" />
              Audiobook
            </span>
          ) : (
            <span className="flex items-center text-xs bg-indigo-600 px-2 py-1 rounded-full">
              <BookOpen size={12} className="mr-1" />
              Ebook
            </span>
          )}
          
          {book.isPremium && (
            <span className="text-xs bg-amber-500 px-2 py-1 rounded-full">
              Premium
            </span>
          )}
          
          {book.isFree && (
            <span className="text-xs bg-green-500 px-2 py-1 rounded-full">
              Free
            </span>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{book.title}</h1>
        <p className="text-lg text-gray-300 mb-1">by {book.author}</p>
        
        <div className="flex items-center mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(book.rating) ? 'text-yellow-400' : 'text-gray-500'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-300">{book.rating} ({book.reviewCount} reviews)</span>
        </div>
        
        <p className="text-sm md:text-base text-gray-300 mb-6 line-clamp-2 md:line-clamp-3 max-w-xl">
          {book.description}
        </p>
        
        <div className="flex flex-wrap gap-3">
          <Link 
            to={`/book/${book.id}`}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition-colors"
          >
            {book.isFree ? 'Read for Free' : book.isPremium ? 'Unlock with Premium' : `Buy for $${book.price?.toFixed(2)}`}
          </Link>
          
          {book.hasAudio && (
            <button className="flex items-center px-6 py-2.5 bg-gray-800/80 hover:bg-gray-700 rounded-full font-medium transition-colors">
              <Play size={16} className="mr-2" />
              Listen Sample
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedBook;