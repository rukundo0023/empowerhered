import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const TermsAndConditions: React.FC = () => {
  const navigate = useNavigate();
  const [, setIsAccepted] = useState(false);

  const handleAccept = () => {
    setIsAccepted(true);
    // Store acceptance in localStorage
    localStorage.setItem('termsAccepted', 'true');
    toast.success('Terms and Conditions accepted successfully');
    navigate('/');
  };

  const handleDecline = () => {
    toast.error('You must accept the Terms and Conditions to use our services');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
        
        <div className="space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to EmpowerHerEd. By accessing our platform, you agree to these terms and conditions. 
              Please read them carefully before using our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Definitions</h2>
            <p className="mb-4">
              "Platform" refers to EmpowerHerEd's website and services.
              "User," "you," and "your" refer to individuals accessing or using our Platform.
              "We," "us," and "our" refer to EmpowerHerEd.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. User Accounts</h2>
            <p className="mb-4">
              To access certain features, you must create an account. You are responsible for:
              - Maintaining the confidentiality of your account credentials
              - All activities that occur under your account
              - Providing accurate and complete information
              - Notifying us immediately of any unauthorized use
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Privacy and Data Protection</h2>
            <p className="mb-4">
              We are committed to protecting your privacy. Our data collection and processing practices are governed by:
              - Our Privacy Policy
              - Applicable data protection laws
              - Industry best practices
              We implement appropriate security measures to protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Intellectual Property</h2>
            <p className="mb-4">
              All content on our Platform, including but not limited to:
              - Text, graphics, logos, and images
              - Software and code
              - Course materials and resources
              is the property of EmpowerHerEd or its licensors and is protected by intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. User Conduct</h2>
            <p className="mb-4">
              You agree not to:
              - Violate any applicable laws or regulations
              - Infringe on others' intellectual property rights
              - Harass, abuse, or harm others
              - Interfere with the Platform's operation
              - Attempt unauthorized access to our systems
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Content and Materials</h2>
            <p className="mb-4">
              Our educational content is provided for personal, non-commercial use. You may not:
              - Copy, modify, or distribute our content
              - Use our materials for commercial purposes
              - Remove any copyright or proprietary notices
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law:
              - We are not liable for any indirect, incidental, or consequential damages
              - Our total liability shall not exceed the amount paid by you for our services
              - We do not guarantee uninterrupted or error-free service
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">9. Modifications</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. Changes will be effective upon posting to the Platform.
              Continued use of our services after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">10. Governing Law</h2>
            <p className="mb-4">
              These terms are governed by the laws of Rwanda. Any disputes shall be resolved in the courts of Rwanda.
            </p>
          </section>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Accept/Decline Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleAccept}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Accept Terms
          </button>
          <button
            onClick={handleDecline}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions; 