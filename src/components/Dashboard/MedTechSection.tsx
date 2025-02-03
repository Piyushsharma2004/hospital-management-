import React from 'react';
import Link from 'next/link';
import { 
  Stethoscope, 
  Thermometer, 
  TrendingUpIcon, 
  ShieldCheckIcon 
} from 'lucide-react';
import Card from './CardComponent';

const MedTechSection = () => {
  const medTechData: { 
    icon: JSX.Element; 
    title: string; 
    description: string; 
    features: string[]; 
    type: 'medTech' | 'quickLinks' | 'doItYourself'; 
    id: string;
  }[] = [
    { 
      id: 'digital-stethoscope',
      icon: <Stethoscope className="w-12 h-12 text-blue-500" />, 
      title: 'Digital Stethoscope', 
      description: 'AI-Enhanced Diagnostics',
      features: ['ML Insights', 'Real-time Monitoring'],
      type: 'medTech'
    },
    { 
      id: 'temperature-monitor',
      icon: <Thermometer className="w-12 h-12 text-red-500" />, 
      title: 'Temperature Monitor', 
      description: 'Continuous Health Tracking',
      features: ['Predictive Analytics', 'Instant Alerts'],
      type: 'medTech'
    },
    { 
      id: 'data-analytics',
      icon: <TrendingUpIcon className="w-12 h-12 text-green-500" />, 
      title: 'Data Analytics', 
      description: 'Comprehensive Health Insights',
      features: ['Personalized Reports', 'Trend Analysis'],
      type: 'medTech'
    },
    { 
      id: 'telemedicine',
      icon: <ShieldCheckIcon className="w-12 h-12 text-purple-500" />, 
      title: 'Telemedicine', 
      description: 'Remote Healthcare Solutions',
      features: ['Expert Consultations', 'Secure Platform'],
      type: 'medTech'
    }
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold mb-3 text-gray-700">MedTech Devices</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {medTechData.map((item) => (
          <Link 
            key={item.id} 
            href={`/Dashboard/med-devices/`}
            className="cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <Card {...item} />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MedTechSection;