import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Tag, ChevronRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

const BlogPage: React.FC = () => {
  // Sample blog posts data
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'The Future of Digital Reading: AI and Personalization',
      excerpt: 'How artificial intelligence is transforming the way we discover and consume books in the digital age.',
      author: 'Sarah Johnson',
      date: 'May 2, 2025',
      readTime: '8 min read',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: '2',
      title: 'Why Audiobooks Are Experiencing a Renaissance',
      excerpt: 'The audiobook market is booming, and it\'s not just because of the pandemic. Here\'s why listeners are falling in love with spoken word.',
      author: 'Michael Chen',
      date: 'April 28, 2025',
      readTime: '6 min read',
      category: 'Trends',
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: '3',
      title: 'The Science of Reading: How Our Brains Process Text',
      excerpt: 'Recent neuroscience research reveals fascinating insights about how our brains interpret written language.',
      author: 'Dr. Emily Rodriguez',
      date: 'April 15, 2025',
      readTime: '10 min read',
      category: 'Science',
      image: 'https://images.unsplash.com/photo-1544164559-2e64cdefd452?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: '4',
      title: 'From Manuscript to Market: Inside the Publishing Industry',
      excerpt: 'A behind-the-scenes look at how books make their journey from an author\'s idea to your digital library.',
      author: 'Thomas Wright',
      date: 'April 10, 2025',
      readTime: '12 min read',
      category: 'Industry',
      image: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: '5',
      title: 'How to Build a Reading Habit That Sticks',
      excerpt: 'Practical strategies for incorporating more reading into your busy life and making it a lasting habit.',
      author: 'Olivia Parker',
      date: 'March 30, 2025',
      readTime: '7 min read',
      category: 'Lifestyle',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: '6',
      title: 'The Rise of Subscription Models in Digital Reading',
      excerpt: 'How subscription services are changing reader behavior and transforming the economics of publishing.',
      author: 'James Wilson',
      date: 'March 22, 2025',
      readTime: '9 min read',
      category: 'Business',
      image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    }
  ];

  // Categories for filtering
  const categories = ['All', 'Technology', 'Trends', 'Science', 'Industry', 'Lifestyle', 'Business'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
      </div>

      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">TextCentre Blog</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
          Insights, updates, and stories about reading, publishing, and the future of books.
        </p>
      </div>

      {/* Categories */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Post */}
      <div className="mb-16">
        <Link to={`/blog/${blogPosts[0].id}`} className="block">
          <div className="relative rounded-xl overflow-hidden">
            <img 
              src={blogPosts[0].image} 
              alt={blogPosts[0].title}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
              <span className="text-blue-400 text-sm font-medium mb-2">{blogPosts[0].category}</span>
              <h2 className="text-3xl font-bold text-white mb-3">{blogPosts[0].title}</h2>
              <p className="text-gray-200 mb-4 max-w-2xl">{blogPosts[0].excerpt}</p>
              <div className="flex items-center text-gray-300 text-sm">
                <User size={16} className="mr-1" />
                <span className="mr-4">{blogPosts[0].author}</span>
                <Calendar size={16} className="mr-1" />
                <span className="mr-4">{blogPosts[0].date}</span>
                <Clock size={16} className="mr-1" />
                <span className="mr-4">{blogPosts[0].readTime}</span>
                <span className="flex items-center text-blue-400 font-medium">
                  Read more <ChevronRight size={16} className="ml-1" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.slice(1).map((post) => (
          <Link 
            key={post.id} 
            to={`/blog/${post.id}`}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center mb-3">
                <Tag size={16} className="text-blue-500 mr-2" />
                <span className="text-blue-500 text-sm font-medium">{post.category}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{post.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                  <User size={14} className="mr-1" />
                  <span className="mr-3">{post.author}</span>
                  <Calendar size={14} className="mr-1" />
                  <span>{post.date}</span>
                </div>
                <span className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center">
                  Read <ChevronRight size={14} className="ml-1" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Newsletter */}
      <div className="mt-16 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Subscribe to our newsletter
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get the latest articles, book recommendations, and TextCentre updates delivered to your inbox.
          </p>
          <form className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-r-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
