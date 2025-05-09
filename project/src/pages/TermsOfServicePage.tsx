import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfServicePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
      </div>
      
      <div className="prose prose-blue dark:prose-invert max-w-none">
        <h1>Terms of Service</h1>
        <p className="text-gray-500 dark:text-gray-400">Last updated: May 7, 2025</p>
        
        <h2>1. Introduction</h2>
        <p>
          Welcome to TextCentre. These Terms of Service ("Terms") govern your access to and use of the TextCentre website, 
          mobile applications, and services (collectively, the "Service"). Please read these Terms carefully before using our Service.
        </p>
        <p>
          By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, 
          you may not access the Service.
        </p>
        
        <h2>2. Definitions</h2>
        <ul>
          <li><strong>"TextCentre"</strong> (or "we", "us", "our") refers to the company TextCentre Inc.</li>
          <li><strong>"Service"</strong> refers to the TextCentre website, mobile applications, and all content and services accessible through them.</li>
          <li><strong>"User"</strong> (or "you", "your") refers to the individual accessing or using the Service.</li>
          <li><strong>"Account"</strong> refers to a registered user profile on our Service.</li>
          <li><strong>"Content"</strong> refers to text, images, audio, video, and other materials available through our Service.</li>
          <li><strong>"Subscription"</strong> refers to the paid access to premium features and content on our Service.</li>
        </ul>
        
        <h2>3. Account Registration</h2>
        <p>
          To access certain features of the Service, you may be required to register for an account. You agree to provide accurate, 
          current, and complete information during the registration process and to update such information to keep it accurate, 
          current, and complete.
        </p>
        <p>
          You are responsible for safeguarding the password that you use to access the Service and for any activities or actions 
          under your password. We encourage you to use "strong" passwords (passwords that use a combination of upper and lower case 
          letters, numbers, and symbols) with your account.
        </p>
        
        <h2>4. Subscriptions and Payments</h2>
        <p>
          TextCentre offers both free and paid subscription plans. By selecting a paid subscription, you agree to pay the subscription 
          fees indicated for that service. Payments will be charged on the day you sign up for a subscription and will cover the use 
          of that service for the period indicated.
        </p>
        <p>
          Subscription fees are non-refundable except where required by law or as specifically stated in these Terms. You can cancel 
          your subscription at any time, and you will continue to have access to the Service through the end of your billing period.
        </p>
        
        <h2>5. Content and Intellectual Property</h2>
        <p>
          The Service and its original content, features, and functionality are and will remain the exclusive property of TextCentre 
          and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign 
          countries.
        </p>
        <p>
          Books and other content available through the Service are licensed, not sold, to you. Your subscription or purchase grants 
          you a non-exclusive, non-transferable right to access and use the content for personal, non-commercial purposes.
        </p>
        
        <h2>6. User Conduct</h2>
        <p>
          You agree not to use the Service:
        </p>
        <ul>
          <li>In any way that violates any applicable national, federal, state, local, or international law or regulation</li>
          <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter", "spam", or any other similar solicitation</li>
          <li>To impersonate or attempt to impersonate TextCentre, a TextCentre employee, another user, or any other person or entity</li>
          <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which may harm TextCentre or users of the Service</li>
        </ul>
        
        <h2>7. Limitation of Liability</h2>
        <p>
          In no event shall TextCentre, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, 
          incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
          or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>
        
        <h2>8. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will 
          provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at 
          our sole discretion.
        </p>
        
        <h2>9. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of 
          law provisions.
        </p>
        
        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <p>
          Email: <a href="mailto:legal@textcentre.com" className="text-blue-600 dark:text-blue-400">legal@textcentre.com</a><br />
          Address: 123 Book Street, Suite 101, Reading, CA 94103, USA
        </p>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
