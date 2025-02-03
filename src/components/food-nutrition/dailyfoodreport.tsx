'use client'
import React, { useState } from 'react';
import FoodNutritionAnalyzer from './FoodNutritionAnalyzer';
import FoodAnalysisHeader from './foodheader';

// Custom Calendar Component
const CustomCalendar: React.FC<{ onDateSelect: (date: Date) => void }> = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(), 
    currentMonth.getMonth() + 1, 
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(), 
    currentMonth.getMonth(), 
    1
  ).getDay();

  const renderCalendarDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div 
          key={`empty-${i}`} 
          className="text-gray-300 p-2"
        />
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(), 
        currentMonth.getMonth(), 
        day
      );
      
      const isSelected = date.toDateString() === selectedDate.toDateString();
      
      days.push(
        <div 
          key={day}
          onClick={() => {
            setSelectedDate(date);
            onDateSelect(date);
          }}
          className={`
            p-2 text-center cursor-pointer 
            hover:bg-orange-100 
            ${isSelected ? 'bg-orange-500 text-white' : 'hover:bg-orange-50'}
            transition-colors duration-200
          `}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const changeMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden">
      <div className="bg-orange-400 dark:bg-orange-600 text-white p-4 flex justify-between items-center">
        <button 
          onClick={() => changeMonth(-1)}
          className="text-white hover:bg-orange-600 dark:hover:bg-orange-700 p-2 rounded"
        >
          ←
        </button>
        <span className="text-lg font-bold">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button 
          onClick={() => changeMonth(1)}
          className="text-white hover:bg-orange-600 dark:hover:bg-orange-700 p-2 rounded"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 p-2 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-semibold text-orange-700 dark:text-orange-400">{day}</div>
        ))}
        {renderCalendarDays()}
      </div>
    </div>
  );
};

// Daily Food Report Component
const DailyFoodReport: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [foodEntries, setFoodEntries] = useState([
    { time: '08:00', name: 'Breakfast and tea', calories: 250, type: 'Breakfast' },
    { time: '10:30', name: 'Burger', calories: 350, type: 'Lunch' },
    { time: '01:12', name: 'paneer and rice', calories: 350, type: 'Lunch' },
    { time: '18:45', name: 'Flatbread and Potato Curry', calories: 600, type: 'Dinner' }
  ]);

  const totalCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);

  const calorieProgress = () => {
    const dailyGoal = 2000;
    const percentage = (totalCalories / dailyGoal) * 100;
    
    return (
      <div className="mt-4">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-orange-500 dark:bg-orange-600 h-full" 
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-gray-800 dark:text-gray-200">
          <span>Calories: {totalCalories} / {2000}</span>
          <span>{Math.round(percentage)}% of Daily Goal</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-orange-50 dark:bg-gray-900 min-h-screen p-6">
      <div className='mb-4'>
        <FoodAnalysisHeader dailyCalorieGoal={2000} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <CustomCalendar onDateSelect={setSelectedDate} />
          <div className="mt-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
            <h2 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-4">
              Food Entries for {selectedDate.toLocaleDateString()}
            </h2>
            <table className="w-full">
              <thead>
                <tr className="bg-orange-100 dark:bg-gray-700">
                  <th className="p-2 text-gray-800 dark:text-white">Time</th>
                  <th className="p-2 text-gray-800 dark:text-white">Meal</th>
                  <th className="p-2 text-gray-800 dark:text-white">Calories</th>
                </tr>
              </thead>
              <tbody>
                {foodEntries.map((entry, index) => (
                  <tr key={index} className="border-b dark:border-gray-700">
                    <td className="p-2 text-center text-gray-700 dark:text-gray-200">{entry.time}</td>
                    <td className="p-2 text-center text-gray-700 dark:text-gray-200">{entry.name}</td>
                    <td className="p-2 text-center text-gray-700 dark:text-gray-200">{entry.calories}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {calorieProgress()}
          </div>
        </div>
        
        <div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <FoodNutritionAnalyzer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyFoodReport;