'use client'
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import { jsPDF } from 'jspdf'

// Mock test data for AI analysis (unchanged)
const MOCK_ANALYSIS_DATA = {
  chest: {
    summary: 'Potential mild pneumonia indicators detected',
    confidence: '75%',
    recommendations: [
      'Consult with pulmonologist',
      'Antibiotics might be recommended',
      'Rest and hydration'
    ],
    detailed_report: {
      patient_info: {
        name: 'John Doe',
        age: 45,
        gender: 'Male'
      },
      findings: [
        'Slight inflammation in lower right lung',
        'Minimal fluid accumulation',
        'No critical abnormalities'
      ],
      additional_notes: 'Follow-up recommended in 3-4 weeks'
    }
  },
  brain: {
    summary: 'No significant abnormalities detected',
    confidence: '92%',
    recommendations: [
      'Regular follow-up suggested',
      'Annual neurological screening',
      'Maintain healthy lifestyle'
    ],
    detailed_report: {
      patient_info: {
        name: 'Jane Smith',
        age: 35,
        gender: 'Female'
      },
      findings: [
        'Uniform brain tissue density',
        'No tumor or lesion indicators',
        'Normal cerebral structure'
      ],
      additional_notes: 'Routine check-up recommended'
    }
  }
}

interface ChatMessage {
  type: 'user' | 'ai'
  content: string
}

interface XrayAnalysis {
  summary: string
  confidence: string
  recommendations: string[]
  detailed_report: {
    patient_info: {
      name: string
      age: number
      gender: string
    }
    findings: string[]
    additional_notes: string
  }
}

export default function MedicalChatbot() {
  const [welcomeScreen, setWelcomeScreen] = useState(true)
  const [xrayType, setXrayType] = useState<'chest' | 'brain' | null>(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [modelResult, setModelResult] = useState<XrayAnalysis | null>(null)
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false)
  const [pdfContent, setPdfContent] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const xrayOptions: Array<{value: 'chest' | 'brain', label: string}> = [
    { value: 'chest', label: 'Chest X-Ray' },
    { value: 'brain', label: 'Brain X-Ray' }
  ]

  const handleXrayTypeSelect = (type: 'chest' | 'brain') => {
    setXrayType(type)
    setWelcomeScreen(false)
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedImage(file)

      try {
        // Simulated API call with mock data
        const result = MOCK_ANALYSIS_DATA[xrayType!]
        
        setModelResult(result)
        
        const newMessages: ChatMessage[] = [
          ...chatMessages,
          { type: 'user', content: `Uploaded ${xrayType} X-Ray` },
          { type: 'ai', content: result.summary }
        ]
        
        setChatMessages(newMessages)
      } catch (error) {
        console.error('X-Ray analysis failed', error)
        alert('X-Ray analysis could not be completed')
      }
    }
  }

  const generatePDFReport = () => {
    if (modelResult) {
      const doc = new jsPDF()
      
      // Add title
      doc.setFontSize(18)
      doc.text('Medical X-Ray Report', 10, 20)
      
      // Patient Information
      doc.setFontSize(12)
      doc.text(`Patient Name: ${modelResult.detailed_report.patient_info.name}`, 10, 30)
      doc.text(`Age: ${modelResult.detailed_report.patient_info.age}`, 10, 37)
      doc.text(`Gender: ${modelResult.detailed_report.patient_info.gender}`, 10, 44)
      
      // X-Ray Details
      doc.text(`X-Ray Type: ${xrayType?.toUpperCase()} X-Ray`, 10, 54)
      doc.text(`Summary: ${modelResult.summary}`, 10, 61)
      doc.text(`Confidence: ${modelResult.confidence}`, 10, 68)
      
      // Findings
      doc.text('Findings:', 10, 78)
      modelResult.detailed_report.findings.forEach((finding, index) => {
        doc.text(`${index + 1}. ${finding}`, 15, 85 + (index * 7))
      })
      
      // Recommendations
      doc.text('Recommendations:', 10, 120)
      modelResult.recommendations.forEach((recommendation, index) => {
        doc.text(`${index + 1}. ${recommendation}`, 15, 127 + (index * 7))
      })
      
      // Additional Notes
      doc.text('Additional Notes:', 10, 160)
      doc.text(modelResult.detailed_report.additional_notes, 15, 167)
      
      // Generate and set PDF content
      const pdfString = doc.output('datauristring')
      setPdfContent(pdfString)
    }
  }

  const resetChatbot = () => {
    setWelcomeScreen(true)
    setXrayType(null)
    setUploadedImage(null)
    setChatMessages([])
    setModelResult(null)
    setPdfViewerOpen(false)
    setPdfContent(null)
  }

  return (
    <div className=" bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <Head>
        <title>Medical X-Ray Chatbot</title>
        <link rel="icon" href="/medical-icon.png" />
      </Head>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-orange-100">
        {pdfViewerOpen && pdfContent ? (
          <div>
            <h3 className="text-2xl font-bold text-orange-600 mb-4">PDF Report</h3>
            <iframe 
              src={pdfContent} 
              width="100%" 
              height="400" 
              className="border border-orange-200 rounded-lg"
            />
            <button 
              onClick={() => setPdfViewerOpen(false)}
              className="w-full py-3 mt-4 bg-white border border-orange-500 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors duration-300 font-semibold"
            >
              Close PDF
            </button>
          </div>
        ) : welcomeScreen ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-orange-600 mb-6">
              Medical Image Analysis
            </h2>
            <div className="space-y-4">
              {xrayOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleXrayTypeSelect(option.value)}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-300 font-semibold"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {!uploadedImage ? (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-300 font-semibold"
                >
                  Upload {(xrayType ?? 'X-Ray').charAt(0).toUpperCase() + (xrayType ?? 'X-Ray').slice(1)} X-Ray
                </button>
              </div>
            ) : (
              <div>
                <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                  {chatMessages.map((msg, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg ${
                        msg.type === 'user' 
                          ? 'bg-orange-100 text-right' 
                          : 'bg-white text-left border border-gray-200'
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                </div>

                {modelResult && (
                  <div className="space-y-4">
                    <div className="bg-white border border-orange-200 rounded-lg p-4">
                      <h3 className="font-bold text-orange-600 mb-2">Analysis Summary</h3>
                      <p>{modelResult.summary}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Confidence: {modelResult.confidence}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <button 
                        onClick={generatePDFReport}
                        className="w-1/2 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-300 font-semibold"
                      >
                        Generate Report
                      </button>
                      
                      <button 
                        onClick={() => setPdfViewerOpen(true)}
                        className="w-1/2 py-3 bg-white border border-orange-500 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors duration-300 font-semibold"
                      >
                        View Report
                      </button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        className="w-1/2 py-3 bg-white border border-orange-500 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors duration-300 font-semibold"
                      >
                        Connect with Doctor
                      </button>
                      
                      <button 
                        onClick={resetChatbot}
                        className="w-1/2 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-300 font-semibold"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}