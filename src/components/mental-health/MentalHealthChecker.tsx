'use client'
import React, { useState, useEffect } from 'react'
import { 
  Smile, 
  Frown, 
  Heart, 
  Users, 
  BookOpen, 
  ThumbsUp, 
  ThumbsDown, 
  Activity, 
  Clock, 
  Zap,
  Meh,
  Sun,
  Moon
} from 'lucide-react'

interface Question {
  id: string
  text: string
  type: 'slider' | 'multiChoice' | 'rating'
  options?: string[]
  category: 'mood' | 'lifestyle' | 'stress' | 'social' | 'mental_health'
  icon?: React.ReactNode
}

const MentalHealthChecker: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<{ [key: string]: number | string }>({})
  const [completed, setCompleted] = useState(false)
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [darkMode, setDarkMode] = useState(false)

  const questions: Question[] = [
    {
      id: 'mood',
      text: 'How would you rate your overall emotional well-being this week?',
      type: 'slider',
      category: 'mood',
      icon: <Meh className="w-8 h-8" />
    },
    {
      id: 'sleep',
      text: 'How would you describe your sleep patterns?',
      type: 'multiChoice',
      options: ['Consistent & Restful', 'Mostly Good', 'Irregular', 'Frequently Disrupted', 'Severe Insomnia'],
      category: 'lifestyle'
    },
    {
      id: 'anxiety',
      text: 'How intense are your feelings of anxiety or worry?',
      type: 'slider',
      category: 'stress'
    },
    {
      id: 'exercise',
      text: 'How consistently do you engage in physical activity?',
      type: 'multiChoice',
      options: ['Daily', 'Regular (3-4 times/week)', 'Occasional (1-2 times/week)', 'Minimal', 'Sedentary'],
      category: 'lifestyle'
    },
    {
      id: 'socialConnect',
      text: 'How meaningful are your social connections?',
      type: 'slider',
      category: 'social'
    },
    {
      id: 'positivity',
      text: 'Rate your ability to maintain emotional resilience',
      type: 'slider',
      category: 'mood'
    },
    {
      id: 'mentalCoping',
      text: 'How effectively do you manage stress and challenges?',
      type: 'slider',
      category: 'mental_health'
    },
    {
      id: 'selfCare',
      text: 'How often do you practice self-care activities?',
      type: 'multiChoice',
      options: ['Daily', 'Several times a week', 'Occasionally', 'Rarely', 'Never'],
      category: 'mental_health'
    }
  ]

  useEffect(() => {
    const progress = (currentStep / (questions.length - 1)) * 100
    setProgressPercentage(progress)
  }, [currentStep])

  const handleResponseChange = (value: number | string) => {
    setResponses(prev => ({
      ...prev,
      [questions[currentStep].id]: value
    }))
  }

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setCompleted(true)
    }
  }

  const calculateScore = () => {
    const categoryScores = {
      mood: 0,
      lifestyle: 0,
      stress: 0,
      social: 0,
      mental_health: 0
    }

    const scoringRules = {
      mood: (value: number) => value * 2,
      lifestyle: {
        sleep: (value: string) => 
          value === 'Consistent & Restful' ? 10 : 
          value === 'Mostly Good' ? 8 : 
          value === 'Irregular' ? 5 : 
          value === 'Frequently Disrupted' ? 3 : 1,
        exercise: (value: string) => 
          value === 'Daily' ? 10 : 
          value === 'Regular (3-4 times/week)' ? 8 : 
          value === 'Occasional (1-2 times/week)' ? 5 : 
          value === 'Minimal' ? 3 : 1
      },
      stress: (value: number) => 10 - value,
      social: (value: number) => value * 2,
      mental_health: {
        mentalCoping: (value: number) => value * 2,
        selfCare: (value: string) => 
          value === 'Daily' ? 10 : 
          value === 'Several times a week' ? 8 : 
          value === 'Occasionally' ? 5 : 
          value === 'Rarely' ? 3 : 1
      }
    }

    questions.forEach(question => {
      const value = responses[question.id]
      let score = 0

      switch(question.type) {
        case 'slider':
          if (typeof scoringRules[question.category] === 'function') {
            score = (scoringRules[question.category] as (value: number) => number)(value as number)
          } else if (question.category === 'mental_health') {
            score = scoringRules.mental_health.mentalCoping(value as number)
          }
          break
        case 'multiChoice':
          if (question.category === 'lifestyle') {
            score = scoringRules.lifestyle[question.id as keyof typeof scoringRules.lifestyle](value as string)
          } else if (question.category === 'mental_health') {
            score = scoringRules.mental_health.selfCare(value as string)
          }
          break
      }

      categoryScores[question.category] += score
    })

    const averageScore = Object.values(categoryScores).reduce((a, b) => a + b, 0) / Object.keys(categoryScores).length

    return {
      overallScore: Math.round(averageScore),
      categoryScores,
      interpretation: 
        averageScore >= 8 ? 'Excellent Mental Wellness' : 
        averageScore >= 6 ? 'Good Mental Health' : 
        averageScore >= 4 ? 'Moderate Challenges' : 'Significant Mental Health Considerations'
    }
  }

  const renderQuestion = () => {
    const question = questions[currentStep]

    return (
      <div className={`rounded-2xl p-8 shadow-2xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <div className="relative mb-6">
          <div 
            className="absolute top-0 left-0 h-1 bg-orange-500 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>
          {question.text}
        </h3>

        {question.type === 'slider' && (
          <div className="flex items-center space-x-6">
            <Frown className={`${darkMode ? 'text-gray-400' : 'text-gray-400'} w-8 h-8`} />
            <input 
              type="range" 
              min="0" 
              max="10" 
              value={responses[question.id] || 5}
              className={`flex-grow h-2 rounded-full appearance-none cursor-pointer 
                ${darkMode ? 'bg-gray-600' : 'bg-orange-200'}`} 
              onChange={(e) => handleResponseChange(Number(e.target.value))}
            />
            <Smile className={`${darkMode ? 'text-gray-400' : 'text-gray-400'} w-8 h-8`} />
            <span className={`text-lg font-semibold ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
              {responses[question.id] || 5}
            </span>
          </div>
        )}

        {question.type === 'multiChoice' && (
          <div className="grid grid-cols-3 gap-4">
            {question.options?.map(option => (
              <button 
                key={option}
                className={`
                  p-4 rounded-xl transition-all duration-300
                  ${responses[question.id] === option 
                    ? `${darkMode ? 'bg-orange-700 text-white' : 'bg-orange-500 text-white'} scale-105` 
                    : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-orange-100'}`
                  }
                `}
                onClick={() => handleResponseChange(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderResults = () => {
    const { overallScore, categoryScores, interpretation } = calculateScore()

    return (
      <div className={`relative rounded-3xl p-10 shadow-2xl ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
        <div className="absolute top-4 right-4">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {darkMode ? <Sun className="text-orange-300" /> : <Moon className="text-gray-600" />}
          </button>
        </div>

        <div className="text-center">
          <h2 className={`text-4xl font-extrabold mb-6 ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>
            Mental Wellness Snapshot
          </h2>

          <div className="max-w-xl mx-auto mb-8">
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-orange-50'}`}>
              <div 
                className={`text-5xl font-bold mb-4 ${
                  interpretation === 'Excellent Mental Wellness' ? 'text-green-500' : 
                  interpretation === 'Good Mental Health' ? 'text-blue-500' : 
                  interpretation === 'Moderate Challenges' ? 'text-orange-500' : 
                  'text-red-500'
                }`}
              >
                {overallScore}★
              </div>
              <p className={`text-2xl font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {interpretation}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {Object.entries(categoryScores).map(([category, score]) => (
              <div 
                key={category} 
                className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-orange-50'} hover:shadow-lg transition-all`}
              >
                <h3 className={`text-xl font-bold mb-4 capitalize ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>
                  {category.replace('_', ' ')} Health
                </h3>
                <div className="flex items-center justify-center">
                  <span className={`text-4xl font-bold ${
                    darkMode ? 'text-orange-300' : 'text-orange-700'
                  }`}>
                    {Math.round(score / 2)}★
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Heart className={`mx-auto mb-4 w-16 h-16 ${darkMode ? 'text-orange-300' : 'text-orange-500'}`} />,
                title: 'Emotional Support',
                description: 'Professional counseling and trusted support networks can help.'
              },
              {
                icon: <BookOpen className={`mx-auto mb-4 w-16 h-16 ${darkMode ? 'text-orange-300' : 'text-orange-500'}`} />,
                title: 'Learning Resources',
                description: 'Explore mental wellness workshops and self-help materials.'
              },
              {
                icon: <Users className={`mx-auto mb-4 w-16 h-16 ${darkMode ? 'text-orange-300' : 'text-orange-500'}`} />,
                title: 'Community Support',
                description: 'Connect with understanding support groups.'
              }
            ].map(item => (
              <div 
                key={item.title} 
                className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-orange-50'} hover:shadow-lg transition-all`}
              >
                {item.icon}
                <h4 className={`text-xl font-bold mb-4 ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>
                  {item.title}
                </h4>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  flex items-center justify-center ">
      <div className="max-w-4xl w-full">
        {!completed ? renderQuestion() : renderResults()}

        {!completed && (
          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <button 
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                Previous
              </button>
            )}
            <button 
              className="ml-auto bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              onClick={nextStep}
              disabled={responses[questions[currentStep].id] === undefined}
            >
              {currentStep < questions.length - 1 ? 'Next' : 'Complete Assessment'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MentalHealthChecker