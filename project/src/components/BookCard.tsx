import React from 'react';
import { Link } from 'react-router-dom';
import { Headphones, Crown, BookOpen } from 'lucide-react';
import { Book } from '../types';
import { formatKES } from '../lib/paystack';

interface BookCardProps {
  book: Book;
  size?: 'small' | 'medium' | 'large';
}

const BookCard: React.FC<BookCardProps> = ({ book, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-32 h-48',
    medium: 'w-40 h-56',
    large: 'w-48 h-64'
  };

  return (
    <Link to={`/book/${book.id}`} className="group">
      <div className="relative">
        <div className={`relative ${sizeClasses[size]} overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105`}>
          <img 
            src={book.coverImage} 
            alt={book.title} 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
            <h3 className="font-bold text-sm sm:text-base line-clamp-2">{book.title}</h3>
            <p className="text-xs text-gray-300 mt-1">{book.author}</p>
          </div>
          
          <div className="absolute top-2 right-2 flex flex-col gap-1.5">
            {book.hasAudio && (
              <div className="bg-blue-600 p-1 rounded-full">
                <Headphones size={16} className="text-white" />
              </div>
            )}
            {book.isPremium && (
              <div className="bg-amber-500 p-1 rounded-full">
                <Crown size={16} className="text-white" />
              </div>
            )}
            {book.isFree && (
              <div className="bg-green-500 p-1 rounded-full">
                <BookOpen size={16} className="text-white" />
              </div>
            )}
          </div>
          
          {book.progress !== undefined && book.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
              <div 
                className="h-full bg-blue-500" 
                style={{ width: `${book.progress * 100}%` }}
              ></div>
            </div>
          )}
        </div>
        
        <div className="mt-2 flex items-center">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-3 h-3 ${i < Math.floor(book.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">({book.reviewCount})</span>
        </div>
        
        <div className="mt-1">
          {book.isFree ? (
            <span className="text-xs font-medium text-green-600 dark:text-green-400">Free</span>
          ) : book.isPremium ? (
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Premium</span>
          ) : (
            <span className="text-xs font-medium text-gray-900 dark:text-gray-200">
              {formatKES(book.price || 0)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BookCard;