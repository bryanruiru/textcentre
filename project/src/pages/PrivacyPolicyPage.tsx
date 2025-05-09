import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
      </div>
      
      <div className="prose prose-blue dark:prose-invert max-w-none">
        <h1>Privacy Policy</h1>
        <p className="text-gray-500 dark:text-gray-400">Last updated: May 7, 2025</p>
        
        <p>
          TextCentre ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
          use, disclose, and safeguard your information when you use our website, mobile application, and services 
          (collectively, the "Service").
        </p>
        <p>
          Please read this Privacy Policy carefully. By accessing or using our Service, you acknowledge that you have read, 
          understood, and agree to be bound by all the terms of this Privacy Policy.
        </p>
        
        <h2>1. Information We Collect</h2>
        
        <h3>1.1 Personal Information</h3>
        <p>
          We may collect personal information that you voluntarily provide to us when you:
        </p>
        <ul>
          <li>Register for an account</li>
          <li>Subscribe to our premium service</li>
          <li>Purchase books or other content</li>
          <li>Contact our customer support</li>
          <li>Participate in surveys or promotions</li>
        </ul>
        <p>
          This information may include:
        </p>
        <ul>
          <li>Name</li>
          <li>Email address</li>
          <li>Billing information</li>
          <li>User preferences</li>
          <li>Reading history</li>
        </ul>
        
        <h3>1.2 Usage Information</h3>
        <p>
          We automatically collect certain information when you access or use our Service, including:
        </p>
        <ul>
          <li>Device information (e.g., device type, operating system)</li>
          <li>Log data (e.g., IP address, browser type, pages visited)</li>
          <li>Reading behavior (e.g., books viewed, time spent reading)</li>
          <li>Interaction with AI features</li>
        </ul>
        
        <h3>1.3 Information from Third Parties</h3>
        <p>
          We may receive information about you from third parties, such as:
        </p>
        <ul>
          <li>Social media platforms when you connect your account</li>
          <li>Payment processors for subscription and purchase information</li>
          <li>Analytics providers</li>
        </ul>
        
        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>Provide, maintain, and improve our Service</li>
          <li>Process transactions and manage your account</li>
          <li>Personalize your experience and deliver content relevant to your interests</li>
          <li>Provide customer support and respond to your inquiries</li>
          <li>Send you updates, security alerts, and administrative messages</li>
          <li>Detect, prevent, and address technical issues</li>
          <li>Comply with legal obligations</li>
        </ul>
        
        <h3>2.1 AI Features and Data Processing</h3>
        <p>
          Our AI-powered features, including book recommendations and the AI chat assistant, process your reading history, 
          preferences, and interactions to provide personalized services. This processing is essential to the functionality 
          of these features and is conducted in accordance with this Privacy Policy.
        </p>
        
        <h2>3. How We Share Your Information</h2>
        <p>
          We may share your information in the following circumstances:
        </p>
        <ul>
          <li>With service providers who perform services on our behalf</li>
          <li>With business partners when you purchase or access their content through our Service</li>
          <li>To comply with legal obligations</li>
          <li>To protect our rights, privacy, safety, or property</li>
          <li>In connection with a business transaction, such as a merger or acquisition</li>
        </ul>
        <p>
          We do not sell your personal information to third parties.
        </p>
        
        <h2>4. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information from unauthorized 
          access, disclosure, alteration, and destruction. However, no method of transmission over the Internet or electronic 
          storage is 100% secure, and we cannot guarantee absolute security.
        </p>
        
        <h2>5. Your Rights and Choices</h2>
        <p>
          Depending on your location, you may have certain rights regarding your personal information, including:
        </p>
        <ul>
          <li>Access to your personal information</li>
          <li>Correction of inaccurate or incomplete information</li>
          <li>Deletion of your personal information</li>
          <li>Restriction or objection to processing</li>
          <li>Data portability</li>
        </ul>
        <p>
          To exercise these rights, please contact us using the information provided in the "Contact Us" section.
        </p>
        
        <h3>5.1 Account Settings</h3>
        <p>
          You can update your account information and preferences at any time by accessing your account settings in the Service.
        </p>
        
        <h3>5.2 Marketing Communications</h3>
        <p>
          You can opt out of receiving marketing communications from us by following the unsubscribe instructions included in 
          these communications or by contacting us.
        </p>
        
        <h2>6. Children's Privacy</h2>
        <p>
          Our Service is not directed to children under the age of 13. We do not knowingly collect personal information from 
          children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, 
          please contact us.
        </p>
        
        <h2>7. International Data Transfers</h2>
        <p>
          Your information may be transferred to, and processed in, countries other than the country in which you reside. These 
          countries may have data protection laws that differ from your country. By using our Service, you consent to the transfer 
          of your information to these countries.
        </p>
        
        <h2>8. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
          on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
        </p>
        
        <h2>9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p>
          Email: <a href="mailto:privacy@textcentre.com" className="text-blue-600 dark:text-blue-400">privacy@textcentre.com</a><br />
          Address: 123 Book Street, Suite 101, Reading, CA 94103, USA
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
