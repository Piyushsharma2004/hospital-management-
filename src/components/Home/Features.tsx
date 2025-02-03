// Features.tsx
import { FC } from "react";
import { 
  Monitor, 
  Stethoscope, 
  Brain, 
  Activity, 
  VideoIcon, 
  Camera, 
  MessageCircle, 
  Lightbulb,
} from "lucide-react";

const features = [
  { 
    title: "X-Ray AI", 
    description: "Advanced diagnostic image analysis.",
    icon: Monitor
  },
  { 
    title: "Smart Devices", 
    description: "Seamless health device integration.",
    icon: Stethoscope
  },
  { 
    title: "Disease Predictor", 
    description: "AI-powered health risk assessment.",
    icon: Brain
  },
  { 
    title: "Health Insights", 
    description: "Personalized health trend analysis.",
    icon: Activity
  },
  { 
    title: "TeleMed", 
    description: "Virtual doctor consultations.",
    icon: VideoIcon
  },
  { 
    title: "Nutrition Scan", 
    description: "Instant food and calorie tracking.",
    icon: Camera
  },
  { 
    title: "Wellness Guide", 
    description: "Personalized daily health tips.",
    icon: Lightbulb
  },
  { 
    title: "AI Health Assistant", 
    description: "24/7 intelligent health support.",
    icon: MessageCircle
  }
];

export const FeatureCard: FC<{ 
  title: string; 
  description: string; 
  icon: React.ElementType 
}> = ({ title, description, icon: Icon }) => {
  return (
    <div className="p-4 md:p-6 bg-white/60 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 hover:scale-105 transition-all group">
      <div className="flex items-center mb-3">
        <Icon 
          className="mr-3 text-orange-600 group-hover:text-orange-700 transition-colors" 
          size={24} 
        />
        <h3 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-sm md:text-base text-gray-600">{description}</p>
    </div>
  );
};

export const Features: FC = () => {
  return (
    <div className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-6xl px-4">
      {features.map((feature) => (
        <FeatureCard 
          key={feature.title} 
          title={feature.title} 
          description={feature.description} 
          icon={feature.icon} 
        />
      ))}
    </div>
  );
};