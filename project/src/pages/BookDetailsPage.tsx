import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Headphones, 
  BookOpen, 
  Star, 
  Share2, 
  Bookmark, 
  Play, 
  Download, 
  Crown, 
  ChevronDown, 
  ChevronUp,
  MessageSquare
} from 'lucide-react';
import { useAppStore } from '../store';
import AudioPlayer from '../components/AudioPlayer';
import PaymentButton from '../components/PaymentButton';
import { formatKES } from '../lib/paystack';

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { books, auth } = useAppStore();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  
  const book = books.find(b => b.id === id);
  const similarBooks = book 
    ? books.filter(b => b.id !== book.id && b.genre.some(g => book.genre.includes(g))).slice(0, 4)
    : [];

  // Check if user has access to the book
  const hasAccess = book?.isFree || auth.user?.isPremium || (!book?.isPremium);
  
  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Book not found</h2>
        <Link to="/" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  const renderActionButton = () => {
    if (book.isFree) {
      return (
        <Link 
          to={`/read/${book.id}`}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center"
        >
          <BookOpen size={18} className="mr-2" />
          Read Now
        </Link>
      );
    }

    if (book.isPremium) {
      if (auth.user?.isPremium) {
        return (
          <Link 
            to={`/read/${book.id}`}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center"
          >
            <Crown size={18} className="mr-2" />
            Read Premium Book
          </Link>
        );
      }
      return (
        <PaymentButton
          type="subscription"
          amount={999}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center"
        >
          <Crown size={18} className="mr-2" />
          Unlock with Premium
        </PaymentButton>
      );
    }

    return (
      <PaymentButton
        type="book"
        bookId={book.id}
        amount={book.price || 0}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center"
      >
        Buy for {formatKES(book.price || 0)}
      </PaymentButton>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Book cover and actions */}
        <div className="md:w-1/3 lg:w-1/4">
          <div className="sticky top-24">
            <div className="relative w-full max-w-xs mx-auto md:mx-0 aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
              <img 
                src={book.coverImage} 
                alt={book.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="mt-6 space-y-3">
              {renderActionButton()}
              
              {book.hasAudio && (
                <button 
                  onClick={() => setShowAudioPlayer(true)}
                  className={`w-full py-3 ${
                    hasAccess 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                  } text-white font-bold rounded-lg transition-colors flex items-center justify-center`}
                  disabled={!hasAccess}
                >
                  <Headphones size={18} className="mr-2" />
                  {hasAccess ? 'Listen Now' : 'Premium Only'}
                </button>
              )}
              
              <div className="flex gap-2">
                <button className="flex-1 py-2.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors flex items-center justify-center">
                  <Bookmark size={18} className="mr-2" />
                  Save
                </button>
                <button className="flex-1 py-2.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors flex items-center justify-center">
                  <Share2 size={18} className="mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Book details */}
        <div className="md:w-2/3 lg:w-3/4">
          {/* Book info header */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {book.hasAudio && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  <Headphones size={12} className="mr-1" />
                  Audiobook
                </span>
              )}
              
              {book.isPremium && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                  <Crown size={12} className="mr-1" />
                  Premium
                </span>
              )}
              
              {book.isFree && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  Free
                </span>
              )}
              
              {book.genre.map((g) => (
                <span key={g} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                  {g}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{book.title}</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">by <span className="font-medium hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">{book.author}</span></p>
            
            <div className="flex items-center mt-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    className={`${i < Math.floor(book.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{book.rating} ({book.reviewCount} reviews)</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Published: {book.publishedDate}</span>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About this book</h2>
            <div className={`text-gray-700 dark:text-gray-300 ${showFullDescription ? '' : 'line-clamp-4'}`}>
              <p>{book.description}</p>
            </div>
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="mt-2 flex items-center text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showFullDescription ? (
                <>
                  Show less <ChevronUp size={16} className="ml-1" />
                </>
              ) : (
                <>
                  Show more <ChevronDown size={16} className="ml-1" />
                </>
              )}
            </button>
          </div>
          
          {/* Similar books */}
          {similarBooks.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">You might also like</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {similarBooks.map((book) => (
                  <Link key={book.id} to={`/book/${book.id}`} className="group">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                      <img 
                        src={book.coverImage} 
                        alt={book.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{book.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{book.author}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Audio Player */}
      {showAudioPlayer && book.hasAudio && hasAccess && (
        <AudioPlayer 
          audioUrl={`/audio/${book.id}.mp3`}
          bookTitle={book.title}
          coverImage={book.coverImage}
        />
      )}
    </div>
  );
};

export default BookDetailsPage;