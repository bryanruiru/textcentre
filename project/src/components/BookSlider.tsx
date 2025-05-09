import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BookCard from './BookCard';
import { Book } from '../types';

interface BookSliderProps {
  title: string;
  books: Book[];
  viewAllLink?: string;
  size?: 'small' | 'medium' | 'large';
}

const BookSlider: React.FC<BookSliderProps> = ({ 
  title, 
  books, 
  viewAllLink,
  size = 'medium'
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { current } = sliderRef;
      const scrollAmount = direction === 'left' 
        ? -current.offsetWidth * 0.75 
        : current.offsetWidth * 0.75;
      
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        
        {viewAllLink && (
          <a 
            href={viewAllLink} 
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All
          </a>
        )}
      </div>
      
      <div className="relative">
        {/* Left scroll button */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
        >
          <ChevronLeft size={20} />
        </button>
        
        {/* Books slider */}
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto scrollbar-hide gap-4 py-2 px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {books.map((book) => (
            <div key={book.id} className="flex-shrink-0">
              <BookCard book={book} size={size} />
            </div>
          ))}
        </div>
        
        {/* Right scroll button */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default BookSlider;