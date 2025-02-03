'use client'
import React, { useState, useCallback } from 'react'
import { 
  FileUp, 
  Scan, 
  PieChart, 
  AlertCircle, 
  CheckCircle2,
  X,
  Download,
  Share2,
  Database,
  Stethoscope 
} from 'lucide-react'

interface XRayAnalysisResult {
  imageUrl: string
  findings: {
    category: string
    confidence: number
    description: string
    severity: 'Low' | 'Moderate' | 'High'
  }[]
  overallAssessment: {
    recommendation: string
    riskLevel: string
  }
  additionalMetadata?: {
    hospitalName?: string
    patientId?: string
    scanDate?: string
  }
}

const AIXRayReports: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<XRayAnalysisResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showFullDetails, setShowFullDetails] = useState(false)

  const handleFileUpload = async (file: File) => {
    setSelectedFile(file)
    setIsProcessing(true)

    // Simulate AI processing with more comprehensive result
    setTimeout(() => {
      setAnalysisResult({
        imageUrl: URL.createObjectURL(file),
        findings: [
          {
            category: 'Lung Structure',
            confidence: 0.87,
            description: 'Potential minor opacity in lower left lobe, suggesting possible early-stage inflammation',
            severity: 'Moderate'
          },
          {
            category: 'Bone Density',
            confidence: 0.92,
            description: 'Consistent bone structure, no significant anomalies detected',
            severity: 'Low'
          },
          {
            category: 'Cardiac Region',
            confidence: 0.75,
            description: 'Slight asymmetry in cardiac silhouette, recommend further cardiac evaluation',
            severity: 'Moderate'
          }
        ],
        overallAssessment: {
          recommendation: 'Consult healthcare professional for comprehensive review',
          riskLevel: 'Moderate'
        },
        additionalMetadata: {
          hospitalName: 'Central Medical Center',
          patientId: 'XR-2024-0537',
          scanDate: '2024-01-24'
        }
      })
      setIsProcessing(false)
    }, 3000)
  }

  const clearUpload = () => {
    setSelectedFile(null)
    setAnalysisResult(null)
  }

  const downloadReport = useCallback(() => {
    if (analysisResult) {
      const reportContent = `X-Ray Analysis Report
Hospital: ${analysisResult.additionalMetadata?.hospitalName}
Patient ID: ${analysisResult.additionalMetadata?.patientId}
Scan Date: ${analysisResult.additionalMetadata?.scanDate}

Findings:
${analysisResult.findings.map(f => 
  `- ${f.category} (${(f.confidence * 100).toFixed(0)}% Confidence)
  Description: ${f.description}
  Severity: ${f.severity}`
).join('\n\n')}

Overall Assessment:
Recommendation: ${analysisResult.overallAssessment.recommendation}
Risk Level: ${analysisResult.overallAssessment.riskLevel}`

      const blob = new Blob([reportContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'XRay_Analysis_Report.txt'
      link.click()
    }
  }, [analysisResult])

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'High': return 'bg-orange-100 text-red-600 border-red-200'
      case 'Moderate': return 'bg-orange-100 text-orange-600 border-orange-200'
      default: return 'bg-green-100 text-green-600 border-green-200'
    }
  }

  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-4xl mx-auto bg-white/85 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-orange-200">
        <div className="p-6 bg-gradient-to-r from-orange-600 to-amber-600">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Stethoscope className="mr-3" /> AI X-Ray Report Generator
          </h1>
        </div>

        <div className="p-8">
          {/* File Upload Section */}
          <div 
            className={`
              border-2 border-dashed rounded-xl p-8 text-center 
              transition-all duration-300
              ${selectedFile 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-amber-300 hover:border-amber-500'
              }
            `}
          >
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              id="xray-upload"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
            />
            <label 
              htmlFor="xray-upload" 
              className="cursor-pointer flex flex-col items-center"
            >
              <FileUp className="w-16 h-16 text-orange-600 mb-4" />
              <p className="text-gray-700 font-medium mb-2">
                {selectedFile 
                  ? `Selected: ${selectedFile.name}` 
                  : 'Upload X-Ray Image'}
              </p>
              <span className="text-sm text-gray-500">
                Drag & Drop or Click to Upload
              </span>
            </label>

            {selectedFile && (
              <button 
                onClick={clearUpload} 
                className="mt-4 text-orange-600 hover:text-orange-800 flex items-center mx-auto"
              >
                <X className="mr-2" /> Clear Selection
              </button>
            )}
          </div>

          {/* Processing Loader */}
          {isProcessing && (
            <div className="flex justify-center items-center my-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-600"></div>
              <p className="ml-4 text-orange-700">Analyzing X-Ray...</p>
            </div>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <div className="mt-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* X-Ray Image */}
                <div className="bg-orange-50 rounded-xl p-4 shadow-md">
                  <h3 className="text-lg font-semibold mb-4 text-orange-800">
                    Original X-Ray
                  </h3>
                  <img 
                    src={analysisResult.imageUrl} 
                    alt="X-Ray" 
                    className="rounded-lg max-h-72 w-full object-cover"
                  />
                </div>

                {/* Findings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-orange-800 flex justify-between items-center">
                    Detailed Findings
                    <button 
                      onClick={() => setShowFullDetails(!showFullDetails)}
                      className="text-sm text-orange-600 hover:text-orange-800"
                    >
                      {showFullDetails ? 'Collapse' : 'Expand'} Details
                    </button>
                  </h3>
                  {analysisResult.findings.map((finding, index) => (
                    <div 
                      key={index} 
                      className={`
                        mb-4 p-4 rounded-lg border
                        ${getSeverityColor(finding.severity)}
                      `}
                    >
                      <div className="flex items-center mb-2">
                        <PieChart className="mr-2 w-5 h-5" />
                        <h4 className="font-bold">{finding.category}</h4>
                      </div>
                      <p>{finding.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm opacity-70">
                          Confidence: {(finding.confidence * 100).toFixed(0)}%
                        </span>
                        {showFullDetails && (
                          <span className="text-sm font-medium">
                            Severity: {finding.severity}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Metadata */}
              {analysisResult.additionalMetadata && (
                <div className="mt-6 bg-orange-50 p-5 rounded-xl grid md:grid-cols-3 gap-4">
                  <div>
                    <Database className="inline-block mr-2 text-orange-600" />
                    <span className="font-semibold">Hospital:</span>
                    <p>{analysisResult.additionalMetadata.hospitalName}</p>
                  </div>
                  <div>
                    <Scan className="inline-block mr-2 text-orange-600" />
                    <span className="font-semibold">Patient ID:</span>
                    <p>{analysisResult.additionalMetadata.patientId}</p>
                  </div>
                  <div>
                    <CheckCircle2 className="inline-block mr-2 text-orange-600" />
                    <span className="font-semibold">Scan Date:</span>
                    <p>{analysisResult.additionalMetadata.scanDate}</p>
                  </div>
                </div>
              )}

              {/* Overall Assessment */}
              <div className="mt-6 bg-gradient-to-r from-orange-100 to-amber-100 p-5 rounded-xl flex justify-between items-center">
                <div className="flex items-center">
                  {analysisResult.overallAssessment.riskLevel === 'High' ? (
                    <AlertCircle className="mr-3 text-red-600" />
                  ) : (
                    <CheckCircle2 className="mr-3 text-green-600" />
                  )}
                  <div>
                    <p className="font-medium text-gray-800">
                      {analysisResult.overallAssessment.recommendation}
                    </p>
                    <p className="text-sm text-gray-600">
                      Risk Level: {analysisResult.overallAssessment.riskLevel}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={downloadReport} 
                    className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 flex items-center"
                  >
                    <Download className="mr-2" /> Download Report
                  </button>
                  <button 
                    className="bg-amber-500 text-white p-2 rounded-md hover:bg-amber-600 flex items-center"
                  >
                    <Share2 className="mr-2" /> Share Results
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AIXRayReports