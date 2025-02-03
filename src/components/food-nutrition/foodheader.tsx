import React, { useState, useEffect } from 'react'
import { 
  UtensilsCrossed, 
  Clock, 
  Flame, 
  Trophy 
} from 'lucide-react'

interface CalorieTrackerProps {
  dailyCalorieGoal: number
}

const FoodAnalysisHeader: React.FC<CalorieTrackerProps> = ({ dailyCalorieGoal = 2000 }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [consumedCalories, setConsumedCalories] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mock function for calorie tracking (replace with actual tracking logic)
  useEffect(() => {
    // Simulating calories consumed - replace with actual tracking
    const mockCaloriesConsumed = Math.floor(Math.random() * (dailyCalorieGoal / 2));
    setConsumedCalories(mockCaloriesConsumed);
  }, [dailyCalorieGoal]);

  const caloriePercentage = (consumedCalories / dailyCalorieGoal) * 100;

  return (
    <div className="bg-gradient-to-r from-orange-400 to-amber-400 dark:from-orange-600 dark:to-amber-600 text-white p-6 rounded-2xl shadow-lg">
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <UtensilsCrossed className="w-10 h-10" />
        <h1 className="text-2xl font-bold">Nutrient Insight</h1>
      </div>
      <div className="flex items-center space-x-3">
        <Clock className="w-6 h-6" />
        <span className="text-lg">
          {currentTime.toLocaleTimeString()}
        </span>
      </div>
    </div>

    <div className="mt-6 grid grid-cols-3 gap-4">
      <div className="bg-orange-500/50 dark:bg-orange-700/50 p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <Flame className="w-8 h-8" />
          <div>
            <p className="text-sm">Calories Consumed</p>
            <p className="text-2xl font-bold">
              {consumedCalories} / {dailyCalorieGoal}
            </p>
          </div>
        </div>
        <div className="mt-2 bg-white/30 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full" 
            style={{ width: `${caloriePercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-orange-500/50 dark:bg-orange-700/50 p-4 rounded-xl flex items-center justify-between">
        <Trophy className="w-8 h-8" />
        <div>
          <p className="text-sm">Daily Goal</p>
          <p className="text-2xl font-bold">
            {Math.round(caloriePercentage)}%
          </p>
        </div>
      </div>

      <div className="bg-orange-500/50 dark:bg-orange-700/50 p-4 rounded-xl flex items-center justify-between">
        <UtensilsCrossed className="w-8 h-8" />
        <div>
          <p className="text-sm">Remaining</p>
          <p className="text-2xl font-bold">
            {dailyCalorieGoal - consumedCalories}
          </p>
        </div>
      </div>
    </div>
  </div>
  )
}

export default FoodAnalysisHeader