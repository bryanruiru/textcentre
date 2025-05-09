import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AccessibilityPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
      </div>
      
      <div className="prose prose-blue dark:prose-invert max-w-none">
        <h1>Accessibility Statement</h1>
        <p className="text-gray-500 dark:text-gray-400">Last updated: May 7, 2025</p>
        
        <p>
          TextCentre is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user 
          experience for everyone and applying the relevant accessibility standards.
        </p>
        
        <h2>Conformance Status</h2>
        <p>
          The Web Content Accessibility Guidelines (WCAG) define requirements for designers and developers to improve accessibility for 
          people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
        </p>
        <p>
          TextCentre is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not 
          fully conform to the accessibility standard.
        </p>
        
        <h2>Accessibility Features</h2>
        <p>
          TextCentre includes the following accessibility features:
        </p>
        
        <h3>Text Customization</h3>
        <ul>
          <li>Adjustable font size</li>
          <li>Multiple font options, including dyslexia-friendly fonts</li>
          <li>Adjustable line spacing and margins</li>
          <li>High contrast mode</li>
        </ul>
        
        <h3>Navigation and Structure</h3>
        <ul>
          <li>Consistent navigation throughout the site</li>
          <li>Proper heading structure</li>
          <li>Skip to content links</li>
          <li>Keyboard accessible navigation</li>
        </ul>
        
        <h3>Media</h3>
        <ul>
          <li>Text alternatives for non-text content</li>
          <li>Captions for audio content</li>
          <li>Audio descriptions for video content</li>
          <li>Transcripts for audiobooks</li>
        </ul>
        
        <h3>Assistive Technology Support</h3>
        <ul>
          <li>Screen reader compatibility</li>
          <li>Voice control support</li>
          <li>Support for text-to-speech functionality</li>
          <li>Compatibility with browser accessibility extensions</li>
        </ul>
        
        <h2>Reading Experience</h2>
        <p>
          Our eBook reader has been designed with accessibility in mind:
        </p>
        <ul>
          <li>Semantic markup for proper structure</li>
          <li>Reflowable text that adapts to different screen sizes and zoom levels</li>
          <li>Support for text-to-speech and screen readers</li>
          <li>Customizable reading experience (font, size, spacing, colors)</li>
          <li>Ability to navigate by chapter, page, or search</li>
        </ul>
        
        <h2>Compatibility with Assistive Technologies</h2>
        <p>
          TextCentre is designed to be compatible with the following assistive technologies:
        </p>
        <ul>
          <li>Screen readers (including NVDA, JAWS, VoiceOver, and TalkBack)</li>
          <li>Screen magnification software</li>
          <li>Speech recognition software</li>
          <li>Alternative input devices</li>
        </ul>
        
        <h2>Known Limitations</h2>
        <p>
          Despite our efforts to ensure accessibility, there may be some limitations:
        </p>
        <ul>
          <li>Some older PDF books may not be fully accessible</li>
          <li>Some interactive features may require alternative accessible versions</li>
          <li>Third-party content may not meet the same accessibility standards</li>
        </ul>
        <p>
          We are working to address these limitations and improve accessibility across all areas of our service.
        </p>
        
        <h2>Feedback and Assistance</h2>
        <p>
          We welcome your feedback on the accessibility of TextCentre. Please let us know if you encounter any accessibility barriers:
        </p>
        <ul>
          <li>Email: <a href="mailto:accessibility@textcentre.com" className="text-blue-600 dark:text-blue-400">accessibility@textcentre.com</a></li>
          <li>Phone: +1 (800) 123-4567</li>
          <li>Feedback form: Available in the Help Center</li>
        </ul>
        <p>
          We try to respond to feedback within 2 business days.
        </p>
        
        <h2>Assessment Approach</h2>
        <p>
          TextCentre assesses the accessibility of our platform through the following methods:
        </p>
        <ul>
          <li>Self-evaluation</li>
          <li>External accessibility audits</li>
          <li>User testing with people with disabilities</li>
          <li>Automated testing tools</li>
        </ul>
        
        <h2>Legal Requirements</h2>
        <p>
          TextCentre is committed to complying with:
        </p>
        <ul>
          <li>Americans with Disabilities Act (ADA)</li>
          <li>Section 508 of the Rehabilitation Act</li>
          <li>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</li>
          <li>Applicable state and international accessibility laws and regulations</li>
        </ul>
        
        <h2>Continuous Improvement</h2>
        <p>
          TextCentre is committed to ongoing accessibility improvements. We regularly review our platform, train our staff on 
          accessibility, and incorporate accessibility into our design and development processes.
        </p>
        
        <h2>Contact Us</h2>
        <p>
          If you have specific questions or concerns about the accessibility of TextCentre, please contact our Accessibility Team:
        </p>
        <p>
          Email: <a href="mailto:accessibility@textcentre.com" className="text-blue-600 dark:text-blue-400">accessibility@textcentre.com</a><br />
          Phone: +1 (800) 123-4567<br />
          Address: 123 Book Street, Suite 101, Reading, CA 94103, USA
        </p>
      </div>
    </div>
  );
};

export default AccessibilityPage;
