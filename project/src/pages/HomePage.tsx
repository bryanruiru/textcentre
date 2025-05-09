import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { 
  BookOpen, 
  Headphones, 
  Brain, 
  Users, 
  Crown, 
  ChevronRight,
  Star,
  Sparkles,
  BookMarked,
  MessageSquare
} from 'lucide-react';
import FeaturedBook from '../components/FeaturedBook';
import BookSlider from '../components/BookSlider';
import GenreSelector from '../components/GenreSelector';
import PremiumBanner from '../components/PremiumBanner';
import AIChatButton from '../components/AIChatButton';

const HomePage: React.FC = () => {
  const { books } = useAppStore();
  
  // Get a random featured book
  const featuredBook = books[Math.floor(Math.random() * books.length)];
  
  // Filter books for different sections
  const trendingBooks = [...books].sort(() => 0.5 - Math.random()).slice(0, 8);
  const freeBooks = books.filter(book => book.isFree);
  const premiumBooks = books.filter(book => book.isPremium);
  const audiobooks = books.filter(book => book.hasAudio);
  const booksInProgress = books.filter(book => book.progress !== undefined && book.progress > 0);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-950">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Your AI-Powered Reading Experience
            </h1>
            <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto mb-8">
              Discover books that truly resonate with you through our intelligent recommendations. 
              Read, listen, and engage with a community of book lovers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/browse"
                className="px-8 py-3 bg-white text-primary-600 rounded-full font-semibold hover:bg-primary-50 transition-colors"
              >
                Start Reading
              </Link>
              <Link
                to="/premium"
                className="px-8 py-3 bg-primary-700 text-white rounded-full font-semibold hover:bg-primary-600 transition-colors flex items-center"
              >
                <Crown size={18} className="mr-2" />
                Try Premium Free
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose TextCenter?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Experience reading like never before with our unique features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                AI-Powered Recommendations
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get personalized book suggestions based on your reading preferences and history.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                <Headphones className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Immersive Audiobooks
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Listen to professionally narrated audiobooks with high-quality sound.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Community Engagement
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Join discussions, share reviews, and connect with fellow readers.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Smart Reading Tools
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track progress, set goals, and use AI-powered summaries and insights.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Book */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Featured Book of the Week
            </h2>
            <Link 
              to="/featured"
              className="text-primary-600 dark:text-primary-400 hover:underline flex items-center"
            >
              View all featured <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          <FeaturedBook book={featuredBook} />
        </div>
        
        {/* Continue Reading */}
        {booksInProgress.length > 0 && (
          <BookSlider 
            title="Continue Reading" 
            books={booksInProgress}
            viewAllLink="/library" 
          />
        )}
        
        {/* Trending Books */}
        <BookSlider 
          title="Trending Now" 
          books={trendingBooks}
          viewAllLink="/trending" 
        />
        
        {/* Genre Selector */}
        <GenreSelector />
        
        {/* Premium Banner */}
        <PremiumBanner />
        
        {/* Free Books */}
        <BookSlider 
          title="Free Reads" 
          books={freeBooks}
          viewAllLink="/free" 
        />
        
        {/* Premium Books */}
        <BookSlider 
          title="Premium Selection" 
          books={premiumBooks}
          viewAllLink="/premium" 
        />
        
        {/* Audiobooks */}
        <BookSlider 
          title="Popular Audiobooks" 
          books={audiobooks}
          viewAllLink="/audiobooks" 
        />

        {/* Testimonials */}
        <div className="py-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
            What Our Readers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Book Enthusiast",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                content: "The AI recommendations are spot-on! I've discovered so many great books I wouldn't have found otherwise."
              },
              {
                name: "Michael Chen",
                role: "Premium Member",
                image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                content: "The audiobook quality is exceptional, and the reading progress tracking helps me stay consistent."
              },
              {
                name: "Emily Rodriguez",
                role: "Avid Reader",
                image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                content: "I love the community features! The discussions and reviews add so much value to my reading experience."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {testimonial.content}
                </p>
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Chat Button */}
      <AIChatButton />
    </div>
  );
};

export default HomePage;