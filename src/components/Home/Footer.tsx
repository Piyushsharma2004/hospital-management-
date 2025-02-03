import { FC } from "react";
import { 
  Twitter,  
  Linkedin, 
  Instagram, 
  Mail 
} from "lucide-react";
import Image from "next/image";

export const Footer: FC = () => {
  const quickLinks = [
    { title: 'About', href: '#about' },
    { title: 'Services', href: '#services' },
    { title: 'Blog', href: '#blog' },
    { title: 'Careers', href: '#careers' }
  ];

  const legalLinks = [
    { title: 'Privacy Policy', href: '#privacy' },
    { title: 'Terms of Service', href: '#terms' },
    { title: 'Cookie Settings', href: '#cookies' }
  ];

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/piyushs5321' },
    { icon: Linkedin, href: 'https://linkedin.com/in/piyushsharmanova' },
    { icon: Instagram, href: 'https://instagram.com/piyushsharma5321' }
  ];

  return (
    <footer className="z-999 w-full bg-gradient-to-br from-orange-200 mt-20 to-orange-200 py-12 px-4 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="flex flex-col items-start space-y-4">
          <div className="flex items-center">
           <Image
                    src="/images/logo/logo.png"
                    alt="MediGo Ai Logo"
                    width={200}
                    height={150} 
                  /> 
                  </div>
          <p className="text-gray-800 text-sm">
            Transforming healthcare through innovative AI solutions.
          </p>
          <div className="flex space-x-3">
            {socialLinks.map(({ icon: Icon, href }) => (
              <a 
                key={href} 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-orange-600 transition-colors"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {quickLinks.map(({ title, href }) => (
              <li key={title}>
                <a 
                  href={href} 
                  className="text-gray-800 hover:text-orange-700 transition-colors text-sm"
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Legal</h4>
          <ul className="space-y-2">
            {legalLinks.map(({ title, href }) => (
              <li key={title}>
                <a 
                  href={href} 
                  className="text-gray-800 hover:text-orange-700 transition-colors text-sm"
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Stay Updated</h4>
          <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden">
            <Mail className="ml-3 text-gray-500" size={20} />
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full px-3 py-2 text-sm text-gray-900 focus:outline-none" 
            />
            <button className="bg-orange-500 text-white px-4 py-2 text-sm hover:bg-orange-600 transition-colors">
              Sign Up
            </button>
          </div>
          <p className="text-xs text-gray-700 mt-2">
            Get weekly insights and healthcare tips.
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 pt-6 border-t border-orange-300 text-center text-gray-800 text-sm">
        &copy; {new Date().getFullYear()} MediGo Ai. All Rights Reserved.
      </div>
    </footer>
  );
};