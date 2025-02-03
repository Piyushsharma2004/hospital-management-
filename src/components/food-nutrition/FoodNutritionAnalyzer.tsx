'use client'
import React, { useState } from 'react'
import { 
  Upload, 
  Apple, 
  Flame, 
  Zap, 
  Droplet,
  BarChart2,
  Activity
} from 'lucide-react'

interface NutritionAnalysis {
  imageUrl: string
  foodName: string
  servingSize: string
  nutritionalData: {
    calories: number
    totalFat: number
    saturatedFat: number
    cholesterol: number
    sodium: number
    totalCarbohydrates: number
    dietaryFiber: number
    sugars: number
    protein: number
    potassium: number
    vitamins: {
      vitaminA: number
      vitaminC: number
      calcium: number
      iron: number
    }
  }
  healthInsights: string[]
}

const FoodNutritionAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<NutritionAnalysis | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleImageUpload = async (file: File) => {
    setSelectedImage(file)
    setIsProcessing(true)

    // Simulated AI analysis
    setTimeout(() => {
      setAnalysis({
        imageUrl: URL.createObjectURL(file),
        foodName: 'Burger',
        servingSize: '1 serving (250g)',
        nutritionalData: {
          calories: 350,
          totalFat: 12,
          saturatedFat: 3.5,
          cholesterol: 85,
          sodium: 480,
          totalCarbohydrates: 15,
          dietaryFiber: 4,
          sugars: 3,
          protein: 28,
          potassium: 520,
          vitamins: {
            vitaminA: 8,
            vitaminC: 12,
            calcium: 6,
            iron: 10
          }
        },
        healthInsights: [
          'High protein content supports muscle recovery',
          'Balanced macronutrient profile',
          'Low in saturated fats'
        ]
      })
      setIsProcessing(false)
    }, 3000)    
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-orange-400 to-orange-300 dark:from-orange-600 dark:to-orange-500">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Apple className="mr-3 text-white dark:text-gray-100" /> 
            <span className="text-white dark:text-gray-100">Nutrition Insights</span>
          </h1>
        </div>

        {/* Image Upload */}
        <div className="p-8">
          <div 
            className={`
              border-2 border-dashed rounded-xl p-8 text-center
              ${selectedImage 
                ? 'border-orange-500 bg-orange-50 dark:border-orange-400 dark:bg-orange-900/20' 
                : 'border-orange-300 hover:border-orange-500 dark:border-orange-600 dark:hover:border-orange-400'
              }
            `}
          >
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              id="food-upload"
              onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
            />
            <label 
              htmlFor="food-upload" 
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-16 h-16 text-orange-600 dark:text-orange-400 mb-4" />
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                {selectedImage 
                  ? `Selected: ${selectedImage.name}` 
                  : 'Upload Food Image'}
              </p>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Drag & Drop or Click to Upload
              </span>
            </label>
          </div>

          {/* Processing Loader */}
          {isProcessing && (
            <div className="flex justify-center items-center my-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-600 dark:border-orange-400"></div>
              <p className="ml-4 text-orange-700 dark:text-orange-300">Analyzing Nutrition...</p>
            </div>
          )}

          {/* Nutrition Results */}
          {analysis && (
            <div className="mt-8 grid md:grid-cols-1 gap-6"> 
              {/* Food Image */}
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-orange-800 dark:text-orange-300">
                  Uploaded Image
                </h3>
                <img 
                  src={analysis.imageUrl} 
                  alt="Food" 
                  className="rounded-lg max-h-72 w-full object-cover"
                />
                <p className="mt-3 text-center font-medium text-orange-700 dark:text-orange-400">
                  {analysis.foodName}
                </p>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Serving Size: {analysis.servingSize}
                </p>
              </div>

              {/* Nutritional Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-orange-800 dark:text-orange-300">
                  Detailed Nutritional Breakdown
                </h3>
                
                {/* Macronutrients and Key Metrics */}
                <div className="space-y-4">
                  <div className="flex items-center bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg">
                    <Flame className="mr-3 text-orange-500 dark:text-orange-400" />
                    <div className="grid grid-cols-2 gap-2 w-full">
                    <div>
                      <p className="font-bold text-black dark:text-white">Calories</p>
                      <p className="text-gray-700 dark:text-gray-300">{analysis.nutritionalData.calories} kcal</p>
                    </div>
                    <div>
                        <p className="font-bold text-black dark:text-white">Fiber</p>
                        <p className="text-gray-700 dark:text-gray-300">{analysis.nutritionalData.dietaryFiber}g</p>
                      </div>
                  </div>
                  </div>
                  
                  <div className="flex items-center bg-amber-100 dark:bg-amber-900/20 p-3 rounded-lg">
                    <BarChart2 className="mr-3 text-amber-500 dark:text-amber-400" />
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <div>
                        <p className="font-bold text-black dark:text-white">Total Fat</p>
                        <p className="text-gray-700 dark:text-gray-300">{analysis.nutritionalData.totalFat}g</p>
                      </div>
                      <div>
                        <p className="font-bold text-black dark:text-white">Saturated Fat</p>
                        <p className="text-gray-700 dark:text-gray-300">{analysis.nutritionalData.saturatedFat}g</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg">
                    <Zap className="mr-3 text-orange-500 dark:text-orange-400" />
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <div>
                        <p className="font-bold text-black dark:text-white">Protein</p>
                        <p className="text-gray-700 dark:text-gray-300">{analysis.nutritionalData.protein}g</p>
                      </div>
                      <div>
                        <p className="font-bold text-black dark:text-white">Carbohydrates</p>
                        <p className="text-gray-700 dark:text-gray-300">{analysis.nutritionalData.totalCarbohydrates}g</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-amber-100 dark:bg-amber-900/20 p-3 rounded-lg">
                    <Droplet className="mr-3 text-red-500 dark:text-red-400" />
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <div>
                        <p className="font-bold text-black dark:text-white">Sodium</p>
                        <p className="text-gray-700 dark:text-gray-300">{analysis.nutritionalData.sodium}mg</p>
                      </div>
                      <div>
                        <p className="font-bold text-black dark:text-white">Cholesterol</p>
                        <p className="text-gray-700 dark:text-gray-300">{analysis.nutritionalData.cholesterol}mg</p>
                      </div>
                     
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg">
                    <Activity className="mr-3 text-green-500 dark:text-green-400" />
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <div>
                        <p className="font-bold text-black dark:text-white">Potassium</p>
                        <p className="text-gray-700 dark:text-gray-300">{analysis.nutritionalData.potassium}mg</p>
                      </div>
                      <div>
                        <p className="font-bold text-black dark:text-white">Sugars</p>
                        <p className="text-gray-700 dark:text-gray-300">{analysis.nutritionalData.sugars}g</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Insights */}
                <div className="mt-6 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                  <h4 className="font-bold mb-3 text-orange-800 dark:text-orange-300">Health Insights</h4>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    {analysis.healthInsights.map((insight, index) => (
                      <li key={index} className="mb-2">{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FoodNutritionAnalyzer