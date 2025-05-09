import React from 'react';
import { BookOpen, Users, Brain, Award, Headphones, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About TextCenter
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          We're revolutionizing the way people discover, read, and experience books through 
          the power of artificial intelligence and community engagement.
        </p>
      </div>

      {/* Mission Section */}
      <div className="mb-16">
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              To make reading more accessible, engaging, and personalized through innovative 
              technology and a vibrant community of book lovers. We believe everyone has a 
              perfect book waiting to be discovered.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <BookOpen className="text-primary-600 dark:text-primary-400 mr-3" size={24} />
                <span className="font-medium">50K+ Books</span>
              </div>
              <div className="flex items-center">
                <Users className="text-primary-600 dark:text-primary-400 mr-3" size={24} />
                <span className="font-medium">100K+ Readers</span>
              </div>
              <div className="flex items-center">
                <Globe className="text-primary-600 dark:text-primary-400 mr-3" size={24} />
                <span className="font-medium">190+ Countries</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          What Sets Us Apart
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <Brain className="text-primary-600 dark:text-primary-400 mb-4" size={32} />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              AI-Powered Recommendations
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our advanced AI understands your reading preferences and suggests books 
              you'll truly enjoy, learning and adapting with every interaction.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <Headphones className="text-primary-600 dark:text-primary-400 mb-4" size={32} />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Professional Audiobooks
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enjoy high-quality narration from professional voice actors, making your 
              favorite books come alive wherever you are.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <Award className="text-primary-600 dark:text-primary-400 mb-4" size={32} />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Premium Content
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Access exclusive books, advanced features, and early releases with our 
              premium membership, designed for serious readers.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Chen",
              role: "Founder & CEO",
              image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&h=200&q=80",
              bio: "Former tech executive passionate about combining AI with literature."
            },
            {
              name: "David Kumar",
              role: "Head of Technology",
              image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&h=200&q=80",
              bio: "AI specialist with 15 years experience in recommendation systems."
            },
            {
              name: "Emily Rodriguez",
              role: "Content Director",
              image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&h=200&q=80",
              bio: "Former publishing executive curating our extensive library."
            }
          ].map((member) => (
            <div key={member.name} className="text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {member.name}
              </h3>
              <p className="text-primary-600 dark:text-primary-400 mb-2">
                {member.role}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Want to Learn More?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We'd love to hear from you and answer any questions you might have.
        </p>
        <a
          href="/contact"
          className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-colors"
        >
          Get in Touch
        </a>
      </div>
    </div>
  );
};

export default AboutPage;