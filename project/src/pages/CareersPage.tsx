import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Clock, ChevronRight, Users, Heart, Zap, Globe, BookOpen } from 'lucide-react';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

const CareersPage: React.FC = () => {
  // Sample job positions
  const jobPositions: JobPosition[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'San Francisco, CA (Hybrid)',
      type: 'Full-time',
      description: 'Build and maintain our React-based web application, focusing on performance and accessibility.'
    },
    {
      id: '2',
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Remote (US)',
      type: 'Full-time',
      description: 'Create intuitive and beautiful user experiences for our digital reading platform.'
    },
    {
      id: '3',
      title: 'Content Acquisition Manager',
      department: 'Content',
      location: 'New York, NY',
      type: 'Full-time',
      description: 'Develop and maintain relationships with publishers to expand our digital book catalog.'
    },
    {
      id: '4',
      title: 'Machine Learning Engineer',
      department: 'AI & Data',
      location: 'Remote (Worldwide)',
      type: 'Full-time',
      description: 'Improve our recommendation algorithms and develop new AI features for personalized reading.'
    },
    {
      id: '5',
      title: 'Customer Success Specialist',
      department: 'Support',
      location: 'Austin, TX (Hybrid)',
      type: 'Full-time',
      description: 'Help our users get the most out of TextCentre and resolve technical issues.'
    },
    {
      id: '6',
      title: 'Digital Marketing Manager',
      department: 'Marketing',
      location: 'Remote (US)',
      type: 'Full-time',
      description: 'Drive user acquisition and engagement through digital marketing channels.'
    },
    {
      id: '7',
      title: 'Product Manager',
      department: 'Product',
      location: 'San Francisco, CA (Hybrid)',
      type: 'Full-time',
      description: 'Lead the development of new features and improvements to our reading platform.'
    },
    {
      id: '8',
      title: 'Audiobook Production Coordinator',
      department: 'Content',
      location: 'Los Angeles, CA',
      type: 'Full-time',
      description: 'Oversee the production of high-quality audiobooks from acquisition to publication.'
    }
  ];

  // Department filters
  const departments = ['All Departments', 'Engineering', 'Design', 'Content', 'AI & Data', 'Support', 'Marketing', 'Product'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Join the TextCentre Team</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
          Help us transform the future of reading and make knowledge more accessible to everyone.
        </p>
        <a 
          href="#open-positions" 
          className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          View Open Positions
          <ChevronRight className="ml-2 h-5 w-5" />
        </a>
      </div>

      {/* Our Values */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Knowledge for All</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We believe everyone deserves access to quality reading materials regardless of location or background.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Innovation</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We embrace new technologies and ideas to continuously improve the reading experience.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Diversity & Inclusion</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We celebrate diverse perspectives and create an inclusive environment for all team members.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Reader-Centric</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We put readers first in everything we do, creating experiences that delight and inspire.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-20 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Why Work With Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Remote-Friendly Culture</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Work from anywhere with flexible hours and a results-oriented approach.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Learning Budget</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Annual budget for books, courses, and conferences to support your growth.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Comprehensive Healthcare</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Full medical, dental, and vision coverage for you and your dependents.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Equity Compensation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share in the company's success with competitive equity packages.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Unlimited PTO</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Take the time you need to rest, recharge, and bring your best self to work.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Latest Technology</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose your preferred equipment and software to do your best work.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div id="open-positions" className="scroll-mt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">Open Positions</h2>
          
          {/* Department filter */}
          <div className="w-full md:w-auto">
            <select className="w-full md:w-auto px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {departments.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Job listings */}
        <div className="grid grid-cols-1 gap-4">
          {jobPositions.map((job) => (
            <div 
              key={job.id} 
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h3>
                  <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center mr-4 mb-2 md:mb-0">
                      <Briefcase className="h-4 w-4 mr-1" />
                      <span>{job.department}</span>
                    </div>
                    <div className="flex items-center mr-4 mb-2 md:mb-0">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center mb-2 md:mb-0">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">{job.description}</p>
                </div>
                <div className="md:ml-4">
                  <button className="w-full md:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* No positions that match? */}
      <div className="mt-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Don't see a position that matches your skills?</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          We're always looking for talented individuals to join our team. Send us your resume and tell us how you can contribute to TextCentre.
        </p>
        <button className="px-6 py-3 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
          Send General Application
        </button>
      </div>
    </div>
  );
};

export default CareersPage;
