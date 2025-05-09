import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Tag, Facebook, Twitter, Linkedin, Mail, Bookmark } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  authorRole: string;
  authorImage: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
}

// Sample blog posts data - would typically come from an API
const blogPosts: Record<string, BlogPost> = {
  '1': {
    id: '1',
    title: 'The Future of Digital Reading: AI and Personalization',
    excerpt: 'How artificial intelligence is transforming the way we discover and consume books in the digital age.',
    content: `
      <p>The digital reading landscape is undergoing a profound transformation, driven by advances in artificial intelligence and machine learning. These technologies are reshaping how readers discover, consume, and interact with books and other written content.</p>
      
      <h2>Personalized Recommendations</h2>
      <p>One of the most visible applications of AI in digital reading is personalized recommendation systems. Unlike traditional recommendation methods that rely on bestseller lists or editorial curation, AI-powered systems analyze a reader's behavior, preferences, and reading history to suggest titles that align with their unique interests.</p>
      
      <p>These systems go beyond simple genre matching. They can identify subtle patterns in reading behavior, such as a preference for certain writing styles, themes, or narrative structures. As a result, readers are more likely to discover books they enjoy, including titles they might never have encountered through traditional discovery channels.</p>
      
      <h2>Enhanced Reading Experiences</h2>
      <p>AI is also enhancing the reading experience itself. Adaptive interfaces can adjust text size, spacing, and contrast based on a reader's behavior and environmental conditions. Natural language processing can provide instant definitions, contextual information, or translations without disrupting the reading flow.</p>
      
      <p>For readers with disabilities, AI-powered tools are making content more accessible. Text-to-speech with natural-sounding voices, automatic image descriptions, and dynamic content reformatting are just a few examples of how AI is making reading more inclusive.</p>
      
      <h2>Content Creation and Curation</h2>
      <p>On the content side, AI is assisting authors and publishers in creating and curating digital reading materials. Tools can analyze manuscripts for readability, suggest structural improvements, or even help generate content for specific audiences.</p>
      
      <p>Publishers are using AI to optimize metadata, improve search functionality, and identify trends in reader preferences. This data-driven approach allows them to make more informed decisions about acquisitions, marketing, and content development.</p>
      
      <h2>The Human Element</h2>
      <p>Despite these technological advances, the human element remains crucial in digital reading. AI systems are tools that enhance human creativity and decision-making, not replacements for them. The most effective applications of AI in digital reading maintain a balance between technological efficiency and human insight.</p>
      
      <p>Readers still value human curation, especially from trusted sources like friends, favorite authors, or respected critics. The challenge for digital reading platforms is to integrate AI capabilities with human expertise in ways that feel natural and valuable to users.</p>
      
      <h2>Looking Ahead</h2>
      <p>As AI technologies continue to evolve, we can expect even more sophisticated applications in digital reading. Immersive experiences that adapt to a reader's emotional state, collaborative reading environments enhanced by AI facilitators, and seamless integration between different forms of media are all on the horizon.</p>
      
      <p>The future of digital reading will likely be characterized by increased personalization, accessibility, and interactivity. By leveraging AI responsibly, the industry can create reading experiences that are more engaging, inclusive, and tailored to individual needs and preferences.</p>
      
      <p>For readers, this means more opportunities to discover books they'll love, more ways to engage with content, and more tools to make reading fit seamlessly into their lives. The digital reading revolution is just beginning, and AI will play a central role in shaping its future.</p>
    `,
    author: 'Sarah Johnson',
    authorRole: 'Digital Content Strategist',
    authorImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    date: 'May 2, 2025',
    readTime: '8 min read',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    tags: ['AI', 'Digital Reading', 'Personalization', 'Technology', 'Future of Books']
  },
  '2': {
    id: '2',
    title: 'Why Audiobooks Are Experiencing a Renaissance',
    excerpt: 'The audiobook market is booming, and it\'s not just because of the pandemic. Here\'s why listeners are falling in love with spoken word.',
    content: `
      <p>Audiobooks are experiencing an unprecedented surge in popularity, with double-digit growth year over year. While the pandemic certainly accelerated this trend by changing how people consume content, the audiobook renaissance has deeper roots and broader implications for the future of reading.</p>
      
      <h2>The Convenience Factor</h2>
      <p>One of the primary drivers behind the audiobook boom is convenience. In our increasingly busy lives, audiobooks offer a way to fit reading into otherwise unproductive time: commuting, exercising, doing household chores, or any activity that occupies the hands but leaves the mind free.</p>
      
      <p>Unlike physical books or even e-readers, audiobooks don't require visual attention. This "hands-free, eyes-free" quality makes them uniquely suited to our multitasking culture. For many people who struggle to find dedicated reading time, audiobooks have reopened the door to literature and learning.</p>
      
      <h2>The Performance Element</h2>
      <p>Modern audiobooks are far more than just narrated text. They're sophisticated productions featuring professional voice actors, sound effects, and musical scores. These elements transform the reading experience into something closer to theater or film, engaging listeners on multiple sensory levels.</p>
      
      <p>Celebrity narrators have also elevated the profile of audiobooks. When a favorite actor brings characters to life or a beloved musician narrates their memoir, it creates a unique experience that can't be replicated in print. These performances add new dimensions to familiar texts and attract listeners who might not otherwise pick up a book.</p>
      
      <h2>Accessibility and Inclusion</h2>
      <p>Audiobooks have made reading more accessible to diverse audiences. For people with visual impairments, dyslexia, or other reading difficulties, audiobooks provide access to the same content available to traditional readers. They're also valuable tools for language learners, who benefit from hearing pronunciation alongside text.</p>
      
      <p>The format has opened up new possibilities for multilingual publishing as well. Books can be recorded in multiple languages more quickly than they can be translated and printed, reaching global audiences faster and more efficiently.</p>
      
      <h2>Technological Advances</h2>
      <p>Technological improvements have played a crucial role in the audiobook renaissance. Streaming platforms have made audiobooks more affordable and accessible than when they were sold on multiple CDs or cassettes. Mobile apps allow listeners to carry entire libraries in their pockets and seamlessly switch between devices.</p>
      
      <p>Production quality has also improved dramatically. Digital recording techniques, remote collaboration tools, and sophisticated editing software have raised the bar for audiobook production while reducing costs. These advances have made it feasible for more titles to be converted to audio, including backlist and niche publications.</p>
      
      <h2>The Social Dimension</h2>
      <p>Surprisingly, audiobooks have developed a strong social component. Book clubs dedicated to audiobooks are flourishing, and social media platforms host vibrant communities where listeners share recommendations and discuss performances. For many, the shared experience of listening to the same narrator creates a bond similar to watching the same film or TV series.</p>
      
      <p>Podcasts about books and reading have further blurred the line between reading and listening cultures. Many readers now move fluidly between text and audio, choosing the format that best suits their current situation rather than identifying exclusively with one medium.</p>
      
      <h2>The Future of Listening</h2>
      <p>As technology continues to evolve, we can expect audiobooks to become even more immersive and interactive. AI-generated voices are improving rapidly, potentially making audio production faster and more affordable. Spatial audio technologies promise more immersive listening experiences, while interactive elements could allow listeners to navigate non-fiction content in non-linear ways.</p>
      
      <p>The audiobook renaissance represents not a replacement for traditional reading but an expansion of what reading can be. By embracing multiple ways to consume and engage with text, the publishing industry is reaching new audiences and creating richer experiences for all readers, regardless of how they choose to access their favorite books.</p>
    `,
    author: 'Michael Chen',
    authorRole: 'Audio Content Producer',
    authorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: 'April 28, 2025',
    readTime: '6 min read',
    category: 'Trends',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    tags: ['Audiobooks', 'Digital Media', 'Publishing Trends', 'Listening']
  }
};

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = id && blogPosts[id] ? blogPosts[id] : null;

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Blog Post Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/blog" 
          className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link to="/blog" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Blog
        </Link>
      </div>
      
      {/* Post Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
            {post.category}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-400 text-sm mb-6">
          <div className="flex items-center mr-6 mb-2">
            <User size={16} className="mr-2" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center mr-6 mb-2">
            <Calendar size={16} className="mr-2" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center mb-2">
            <Clock size={16} className="mr-2" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>
      
      {/* Featured Image */}
      <div className="mb-8">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-[400px] object-cover rounded-xl"
        />
      </div>
      
      {/* Post Content */}
      <div 
        className="prose prose-lg prose-blue dark:prose-invert max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      {/* Tags */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span 
              key={tag}
              className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Share */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Share this post</h3>
        <div className="flex space-x-4">
          <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
            <Facebook size={20} />
          </button>
          <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
            <Twitter size={20} />
          </button>
          <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
            <Linkedin size={20} />
          </button>
          <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
            <Mail size={20} />
          </button>
          <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
            <Bookmark size={20} />
          </button>
        </div>
      </div>
      
      {/* Author */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-12">
        <div className="flex items-start">
          <img 
            src={post.authorImage} 
            alt={post.author}
            className="w-16 h-16 rounded-full object-cover mr-4"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{post.author}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{post.authorRole}</p>
            <p className="text-gray-600 dark:text-gray-400">
              Sarah is a digital content strategist with over 10 years of experience in publishing and technology.
              She specializes in the intersection of AI and digital reading experiences.
            </p>
          </div>
        </div>
      </div>
      
      {/* Related Posts */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">You might also like</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(blogPosts)
            .filter(relatedPost => relatedPost.id !== post.id)
            .slice(0, 2)
            .map(relatedPost => (
              <Link 
                key={relatedPost.id} 
                to={`/blog/${relatedPost.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <img 
                  src={relatedPost.image} 
                  alt={relatedPost.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <Tag size={16} className="text-blue-500 mr-2" />
                    <span className="text-blue-500 text-sm font-medium">{relatedPost.category}</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{relatedPost.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{relatedPost.excerpt}</p>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <Calendar size={14} className="mr-1" />
                    <span>{relatedPost.date}</span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
