import React from 'react';
import { 
  HeartPulseIcon, 
  CloudLightning, 
  BrainIcon, 
  UserCheckIcon 
} from 'lucide-react';
import Card from './CardComponent';

const DoItYourselfSection = () => {
  const doItYourselfData = [
    { 
      icon: <HeartPulseIcon className="w-12 h-12 text-red-500" />, 
      title: 'Heart Rate Monitor', 
      tag: 'upcoming',
      description: 'Real-time Cardiac Tracking',
      type: 'doItYourself' as 'doItYourself'
    },
    { 
      icon: <CloudLightning className="w-12 h-12 text-yellow-500" />, 
      title: 'Stress Check', 
      tag: 'upcoming',
      description: 'Emotional Balance Analysis',
      type: 'doItYourself' as 'doItYourself'
    },
    { 
      icon: <BrainIcon className="w-12 h-12 text-green-500" />, 
      title: 'Emotional Wellness', 
      tag: 'upcoming',
      description: 'Mental Health Insights',
      type: 'doItYourself' as 'doItYourself'
    },
    { 
      icon: <UserCheckIcon className="w-12 h-12 text-blue-500" />, 
      title: 'Face Scan Pro', 
      tag: 'upcoming',
      description: 'Advanced Facial Analysis',
      type: 'doItYourself' as 'doItYourself'
    }
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold mb-3 text-gray-700">Do It Yourself</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {doItYourselfData.map((item, index) => (
          <Card key={index} {...item} />
        ))}
      </div>
    </section>
  );
};

export default DoItYourselfSection;