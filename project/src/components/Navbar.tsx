import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Menu, 
  X, 
  BookOpen, 
  User, 
  Bell, 
  Moon, 
  Sun,
  Headphones,
  BookMarked,
  Crown,
  MessageSquare,
  Newspaper,
  Briefcase,
  Mail
} from 'lucide-react';
import { useAppStore } from '../store';

const Navbar: React.FC = () => {
  const { isMenuOpen, toggleMenu, currentTheme, setTheme, searchQuery, setSearchQuery, auth } = useAppStore();
  const [showSearch, setShowSearch] = useState(false);

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 text-transparent bg-clip-text">
                TextCenter
              </span>
            </Link>
            
            <div className="hidden md:flex md:items-center md:ml-10 space-x-6">
              <Link to="/browse" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400">
                Browse
              </Link>
              <Link to="/ebooks" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400">
                eBooks
              </Link>
              <Link to="/audiobooks" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400">
                Audiobooks
              </Link>
              <Link to="/blog" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400">
                Blog
              </Link>
              <Link to="/careers" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400">
                Careers
              </Link>
              <Link to="/contact" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400">
                Contact
              </Link>
              <Link to="/premium" className="inline-flex items-center text-sm font-medium text-amber-600 dark:text-amber-400">
                <Crown size={16} className="mr-1" />
                Premium
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {showSearch ? (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search books, authors..."
                  className="w-full md:w-64 px-4 py-2 pl-10 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                <button 
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowSearch(false)}
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button 
                className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setShowSearch(true)}
              >
                <Search size={20} />
              </button>
            )}
            
            <button 
              className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={toggleTheme}
            >
              {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {auth.isAuthenticated ? (
              <>
                <button className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 relative">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </button>
                
                <Link 
                  to="/library" 
                  className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <BookMarked size={20} />
                </Link>
                
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-3 p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <User size={20} className="text-primary-600 dark:text-primary-400" />
                  </div>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-full"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 shadow-lg">
            <Link 
              to="/browse" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Browse
            </Link>
            <Link 
              to="/ebooks" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              eBooks
            </Link>
            <Link 
              to="/audiobooks" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="flex items-center">
                <Headphones size={18} className="mr-2" />
                Audiobooks
              </div>
            </Link>
            <Link 
              to="/blog" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="flex items-center">
                <Newspaper size={18} className="mr-2" />
                Blog
              </div>
            </Link>
            <Link 
              to="/careers" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="flex items-center">
                <Briefcase size={18} className="mr-2" />
                Careers
              </div>
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              About
            </Link>
            <Link 
              to="/premium" 
              className="block px-3 py-2 rounded-md text-base font-medium text-amber-600 dark:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="flex items-center">
                <Crown size={18} className="mr-2" />
                Premium
              </div>
            </Link>
            <Link 
              to="/contact" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="flex items-center">
                <Mail size={18} className="mr-2" />
                Contact
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;