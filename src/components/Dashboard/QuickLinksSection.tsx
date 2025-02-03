import React from 'react';
import { 
  Activity, 
  Heart, 
  PieChart, 
  BarChart3 
} from 'lucide-react';
import Link from 'next/link';
import Card from './CardComponent';

const QuickLinksSection = () => {
  interface QuickLink {
    icon: JSX.Element;
    title: string;
    description: string;
    color: string;
    textColor: string;
    type: 'quickLinks' | 'doItYourself' | 'medTech';
    link: string;
  }

  const quickLinksData: QuickLink[] = [
    { 
      icon: <Activity className="w-12 h-12 text-blue-600" />, 
      title: 'X-Ray Reports', 
      description: 'Advanced Medical Imaging',
      color: 'bg-blue-50',
      textColor: 'text-blue-800',
      type: 'quickLinks',
      link: '/Dashboard/x-ray-analyzer'
    },
    { 
      icon: <Heart className="w-12 h-12 text-green-600" />, 
      title: 'Lab Reports', 
      description: 'Comprehensive Analysis',
      color: 'bg-green-50',
      textColor: 'text-green-800',
      type: 'quickLinks',
      link: '/Dashboard/Health-insights'
    },
    { 
      icon: <PieChart className="w-12 h-12 text-purple-600" />, 
      title: 'Health Metrics', 
      description: 'Personalized Insights',
      color: 'bg-purple-50',
      textColor: 'text-purple-800',
      type: 'quickLinks',
      link: '/Dashboard/Health-insights'
    },
    { 
      icon: <BarChart3 className="w-12 h-12 text-pink-600" />, 
      title: 'Nutrition Insights', 
      description: 'Smart Calorie Tracking',
      color: 'bg-pink-50',
      textColor: 'text-pink-800',
      type: 'quickLinks',
      link: '/Dashboard/Food-nutrition-analyzer'
    }
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold mb-3 text-gray-700">Services</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {quickLinksData.map((item, index) => (
          <Link key={index} href={item.link}>
            <Card {...item} />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickLinksSection;