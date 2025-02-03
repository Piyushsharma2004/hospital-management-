import React from 'react';
import { Phone, Mail, Github, Linkedin, Globe } from 'lucide-react';
import Image from 'next/image';

interface Member {
  photoUrl?: string;
  name: string;
  role: string;
  skills?: string[];
  contact: string;
  email: string;
  github?: string;
  linkedin?: string;
  website?: string;
}

const TeamMemberCard = ({ member }: { member: Member }) => {
  return (
    <div className="group min-w-[350px] mr-5 relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden 
                    transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-blue-500/10 
                    dark:from-red-500/20 dark:to-blue-500/20 opacity-50" />
      
      {/* Top Section with Floating Card Effect */}
      <div className="relative">
        <div className="h-40 bg-gradient-to-r from-red-500 to-red-100 transform skew-y-3 -mt-6" />
        
        {/* Profile Image */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-32">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-white p-1 
                          transform transition-transform duration-300 group-hover:scale-105">
              <Image
                src={member.photoUrl || "/api/placeholder/200/200"}
                alt={member.name}
                width={200}
                height={200}
                className="w-full h-full rounded-full object-cover bg-white dark:bg-gray-700"
              />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-blue-600 blur-xl opacity-30" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 pt-20 pb-6 relative">
        {/* Name and Role */}
        <div className="text-center space-y-1 mb-4">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
            {member.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            {member.role}
          </p>
        </div>

       

        {/* Contact Info */}
        <div className="space-y-3">
          <a href={`tel:${member.contact}`} 
             className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 
                      hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300">
            <Phone className="w-4 h-4" />
            <span>{member.contact}</span>
          </a>
          
          <a href={`mailto:${member.email}`} 
             className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 
                      hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300">
            <Mail className="w-4 h-4" />
            <span className="break-all">{member.email}</span>
          </a>
        </div>

        {/* Social Links */}
        <div className="mt-6 flex justify-center gap-6">
          {member.github && (
            <a href={member.github} 
               target="_blank" 
               rel="noopener noreferrer"
               className="transform transition-all duration-300 hover:scale-110 
                        text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
              <Github className="w-6 h-6" />
            </a>
          )}
          {member.linkedin && (
            <a href={member.linkedin} 
               target="_blank" 
               rel="noopener noreferrer"
               className="transform transition-all duration-300 hover:scale-110 
                        text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
              <Linkedin className="w-6 h-6" />
            </a>
          )}
          {member.website && (
            <a href={member.website} 
               target="_blank" 
               rel="noopener noreferrer"
               className="transform transition-all duration-300 hover:scale-110 
                        text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
              <Globe className="w-6 h-6" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;