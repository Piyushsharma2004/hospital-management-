'use client'
import React, { useState } from 'react';
import { 
  HelpCircle, 
  Book, 
  Stethoscope, 
  Shield, 
  MessageCircle, 
  Video, 
  FileText, 
  Info, 
  HeartPulse,
  UserPlus,
  Clipboard
} from 'lucide-react';

const MedicalHelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const medicalResources = [
    {
      title: "Patient Consultation Guide",
      icon: Stethoscope,
      description: "Comprehensive guidelines for effective patient interactions and medical consultations",
      color: "text-orange-600 dark:text-orange-400"
    },
    {
      title: "Data Privacy & Compliance",
      icon: Shield,
      description: "HIPAA compliance, patient data protection, and ethical guidelines",
      color: "text-orange-700 dark:text-orange-300"
    },
    {
      title: "Medical Documentation",
      icon: Clipboard,
      description: "Best practices for accurate medical record-keeping and reporting",
      color: "text-orange-800 dark:text-orange-200"
    }
  ];

  const supportTopics = [
    {
      title: "Telemedicine Support",
      icon: Video,
      description: "Remote consultation setup, troubleshooting, and best practices"
    },
    {
      title: "Patient Onboarding",
      icon: UserPlus,
      description: "Streamlined patient registration and initial assessment processes"
    },
    {
      title: "Medical AI Integration",
      icon: HeartPulse,
      description: "Implementing AI-driven diagnostics and health monitoring tools"
    },
    {
      title: "System Documentation",
      icon: FileText,
      description: "Comprehensive guides for using our medical management platform"
    }
  ];

  const quickLinks = [
    {
      title: "Frequently Asked Questions",
      icon: HelpCircle,
      link: "#faq"
    },
    {
      title: "Training Resources",
      icon: Book,
      link: "#training"
    },
    {
      title: "Additional Support",
      icon: Info,
      link: "#support"
    }
  ];

  const filterContent = (content: string): boolean => 
    content.toLowerCase().includes(searchQuery.toLowerCase());

  return (
    <div className="min-h-screen bg-gradient-to-br rounded-lg from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-800 dark:text-orange-300 mb-4">
            Medical Project Support Center
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive support for healthcare technology solutions, empowering medical professionals with advanced tools and resources
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-3xl mx-auto mb-10">
          <input
            type="text"
            placeholder="Search support topics..."
            className="w-full px-4 py-3 rounded-full border-2 border-orange-300 dark:border-orange-600
            focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent
            shadow-md text-gray-800 dark:text-gray-100 
            bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {quickLinks.map((link, index) => (
            <a
              key={index}
              href={link.link}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md 
              hover:shadow-xl transition-all 
              border border-orange-100 dark:border-orange-900
              hover:bg-orange-50 dark:hover:bg-gray-700
              flex items-center gap-4"
            >
              <link.icon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                {link.title}
              </span>
            </a>
          ))}
        </div>

        {/* Medical Resources */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {medicalResources.filter(item => 
            filterContent(item.title) || filterContent(item.description)
          ).map((resource, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md 
              hover:shadow-xl transition-all 
              border border-orange-100 dark:border-orange-900
              hover:bg-orange-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-4 mb-4">
                <resource.icon className={`w-8 h-8 ${resource.color}`} />
                <h3 className="font-bold text-gray-800 dark:text-gray-100">
                  {resource.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {resource.description}
              </p>
            </div>
          ))}
        </div>

        {/* Support Topics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-orange-800 dark:text-orange-300 mb-6">
            Support Topics
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportTopics.filter(item => 
              filterContent(item.title) || filterContent(item.description)
            ).map((topic, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border border-orange-200 dark:border-orange-900
                hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <topic.icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {topic.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {topic.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default MedicalHelpCenter;