'use client'
import React, { useState } from 'react'
import { 
  Heart, 
  Brain, 
  Users, 
  BookOpen, 
  Activity, 
  Zap 
} from 'lucide-react'
import MentalHealthChecker from './MentalHealthChecker'

const MentalHealthLandingPage: React.FC = () => {
  const [showAssessment, setShowAssessment] = useState(false)

  const mentalHealthAspects = [
    {
      icon: <Heart className="w-12 h-12 text-orange-600" />,
      title: "Emotional Wellness",
      description: "Understanding and managing your emotional states effectively."
    },
    {
      icon: <Brain className="w-12 h-12 text-orange-600" />,
      title: "Cognitive Health",
      description: "Maintaining mental clarity, focus, and positive thought patterns."
    },
    {
      icon: <Users className="w-12 h-12 text-orange-600" />,
      title: "Social Connection",
      description: "Building and maintaining supportive relationships."
    },
    {
      icon: <BookOpen className="w-12 h-12 text-orange-600" />,
      title: "Personal Growth",
      description: "Continuous learning and self-improvement strategies."
    },
    {
      icon: <Activity className="w-12 h-12 text-orange-600" />,
      title: "Life Balance",
      description: "Harmonizing work, personal life, and mental well-being."
    },
    {
      icon: <Zap className="w-12 h-12 text-orange-600" />,
      title: "Stress Management",
      description: "Developing resilience and coping mechanisms."
    }
  ]


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900 text-black dark:text-white">
      {!showAssessment ? (
        <div className="max-w-6xl w-full">
          <h1 className="text-4xl font-bold text-center text-orange-800 dark:text-orange-400 mb-12">
            Mental Health Awareness
          </h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            {mentalHealthAspects.map((aspect, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="flex flex-col items-center text-center">
                  {aspect.icon}
                  <h3 className="text-xl font-semibold mt-4 text-orange-800 dark:text-orange-400">
                    {aspect.title}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {aspect.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => setShowAssessment(true)}
              className="bg-orange-600 text-white dark:bg-orange-500 px-10 py-4 rounded-xl text-xl font-bold hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors shadow-lg"
            >
              Start Mental Health Assessment
            </button>
          </div>
        </div>
      ) : (
        <MentalHealthChecker />
      )}
    </div>
  )
}

export default MentalHealthLandingPage