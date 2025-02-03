'use client'
import React, { useState, useRef } from 'react'
import { 
  Heart, 
  AlertCircle, 
  Upload,
  FileText,
  Loader2,
  Microscope
} from 'lucide-react'

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'

interface HealthMetric {
  timestamp: string
  heartRate: number
  glucoseLevel: number
}

interface MedicalReport {
  fileUrl: string
  fileName: string
  analysisResult?: string
  keyFindings?: string[]
  metrics: HealthMetric[]
  suggestions?: string[]
}

const HealthMetricsDashboard: React.FC = () => {
  const [medicalReports, setMedicalReports] = useState<MedicalReport[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateMetrics = (): HealthMetric[] => [
    { timestamp: '6:00', heartRate: 68, glucoseLevel: 85 },
    { timestamp: '8:00', heartRate: 72, glucoseLevel: 95 },
    { timestamp: '10:00', heartRate: 85, glucoseLevel: 120 },
    { timestamp: '12:00', heartRate: 78, glucoseLevel: 105 },
    { timestamp: '14:00', heartRate: 82, glucoseLevel: 110 },
    { timestamp: '16:00', heartRate: 75, glucoseLevel: 98 },
    { timestamp: '18:00', heartRate: 70, glucoseLevel: 92 }
  ]

  const generateSuggestions = (metrics: HealthMetric[]): string[] => {
    const suggestions: string[] = []
    const latestMetrics = metrics[metrics.length - 1]

    if (latestMetrics.glucoseLevel > 110) {
      suggestions.push('Consider monitoring carbohydrate intake and increasing physical activity')
    }
    if (latestMetrics.heartRate > 80) {
      suggestions.push('Practice relaxation techniques to maintain optimal heart rate')
    }
    if (latestMetrics.glucoseLevel < 90) {
      suggestions.push('Ensure regular, balanced meals throughout the day')
    }
    
    return suggestions.length ? suggestions : ['All metrics are within normal ranges']
  }

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true)

    // Simulated AI analysis with loading state
    setTimeout(() => {
      const metrics = generateMetrics()
      const newReport: MedicalReport = {
        fileUrl: URL.createObjectURL(file),
        fileName: file.name,
        analysisResult: 'Analysis complete - Report processed successfully',
        keyFindings: [
          'Normal heart rate variability',
          'Glucose levels showing minor fluctuations',
          'Overall vital signs within healthy range'
        ],
        metrics,
        suggestions: generateSuggestions(metrics)
      }

      setMedicalReports([...medicalReports, newReport])
      setIsAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-orange-800 dark:text-orange-400 flex items-center">
          <Heart className="mr-4 text-orange-600 dark:text-orange-400" /> 
          Health Metrics Dashboard
        </h1>

        {/* Medical Report Upload */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-400">
              Medical Reports
            </h3>
            <FileText className="text-orange-500 dark:text-orange-400" />
          </div>
          <div className="border-2 border-dashed rounded-xl p-6 text-center">
            <input 
              type="file" 
              ref={fileInputRef}
              accept=".pdf,.doc,.docx,.jpg,.png"
              className="hidden" 
              onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center w-full text-gray-700 dark:text-gray-200"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <Loader2 className="w-16 h-16 text-orange-600 dark:text-orange-400 mb-4 animate-spin" />
              ) : (
                <Upload className="w-16 h-16 text-orange-600 dark:text-orange-400 mb-4" />
              )}
              <p className="font-medium mb-2">
                {isAnalyzing ? 'Analyzing Report...' : 'Upload Medical Report'}
              </p>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {isAnalyzing ? 'Please wait' : 'PDF, DOC, Image'}
              </span>
            </button>
          </div>
        </div>

        {/* Medical Reports List with Metrics */}
        {medicalReports.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-400 mb-6">
              Analysis Results
            </h3>
            <div className="space-y-8">
              {medicalReports.map((report, index) => (
                <div key={index} className="space-y-6">
                  {/* Report Header */}
                  <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="mr-3 text-orange-600 dark:text-orange-400" />
                      <div>
                        <p className="font-bold dark:text-white">{report.fileName}</p>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          {report.analysisResult}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Charts */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Heart Rate Chart */}
                    <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-orange-800 dark:text-orange-400">
                          Heart Rate (BPM)
                        </h4>
                        <Heart className="text-orange-500 dark:text-orange-400" />
                      </div>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={report.metrics}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f3d9b1" />
                          <XAxis dataKey="timestamp" stroke="#FF6B35" />
                          <YAxis domain={[60, 100]} stroke="#FF6B35" />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="heartRate" 
                            stroke="#FF6B35" 
                            strokeWidth={3}
                            dot={{ fill: '#FF6B35', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Glucose Levels Chart */}
                    <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-orange-800 dark:text-orange-400">
                          Glucose Levels (mg/dL)
                        </h4>
                        <AlertCircle className="text-orange-500 dark:text-orange-400" />
                      </div>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={report.metrics}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f3d9b1" />
                          <XAxis dataKey="timestamp" stroke="#FF6B35" />
                          <YAxis domain={[70, 140]} stroke="#FF6B35" />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="glucoseLevel" 
                            stroke="#FF6B35" 
                            strokeWidth={3}
                            dot={{ fill: '#FF6B35', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Key Findings and Suggestions */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Key Findings */}
                    <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-4">
                        Key Findings
                      </h4>
                      <ul className="space-y-2">
                        {report.keyFindings?.map((finding, idx) => (
                          <li 
                            key={idx} 
                            className="text-gray-700 dark:text-gray-200 flex items-center"
                          >
                            <div className="w-2 h-2 rounded-full bg-orange-400 mr-2" />
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center mb-4">
                        <h4 className="font-semibold text-orange-700 dark:text-orange-400">
                          Recommendations
                        </h4>
                        <Microscope className="ml-2 text-orange-500 dark:text-orange-400" />
                      </div>
                      <ul className="space-y-2">
                        {report.suggestions?.map((suggestion, idx) => (
                          <li 
                            key={idx} 
                            className="text-gray-700 dark:text-gray-200 flex items-center"
                          >
                            <div className="w-2 h-2 rounded-full bg-orange-400 mr-2" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HealthMetricsDashboard