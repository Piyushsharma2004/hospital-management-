import React from 'react';

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: string;
  textColor?: string;
  tag?: string;
  features?: string[];
  type: 'quickLinks' | 'doItYourself' | 'medTech';
}

const Card: React.FC<CardProps> = ({ 
  icon, 
  title, 
  description, 
  tag, 
  features, 
  type 
}) => {
  return (
    <div 
      className={`
       bg-orange-100 dark:bg-gray-800
        p-5 rounded-2xl shadow-lg transform transition-all 
        hover:scale-105 hover:shadow-2xl relative overflow-hidden
       text-gray-800 dark:text-gray-200
      `}
    >
      {type === 'doItYourself' && tag && (
        <span className="absolute top-2 right-2 bg-orange-500 dark:bg-orange-600 text-white text-xs px-2 py-1 rounded">
          {tag}
        </span>
      )}
      
      {icon}
      
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2 dark:text-white">{title}</h3>
        <p className="text-sm opacity-70 dark:opacity-80">{description}</p>
        
        {type === 'medTech' && features && (
          <div className="mt-3 space-y-1">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="inline-block bg-orange-400 dark:bg-orange-500 text-xs px-2 py-1 rounded-full mr-2 mb-2"
              >
                {feature}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;