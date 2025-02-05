'use client'
import React, { useState, useCallback, useEffect } from 'react'
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
  Stethoscope,
  BookOpen,
  RefreshCw
} from 'lucide-react'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import Image from 'next/image'
// TypeScript Interfaces
interface XRayAnalysisResult {
    imageUrl: string
    findings: {
      category: string
      confidence: number
      description: string
      severity: 'Low' | 'Moderate' | 'High'
      detectedDisease?: string
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

// Disease Details Modal Component
const DiseaseDetailsModal: React.FC<{
  diseaseDetails: any, 
  onClose: () => void
}> = ({ diseaseDetails, onClose }) => {
  if (!diseaseDetails) return null;

  // Access nested content
  const details = diseaseDetails.content || diseaseDetails;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-999999 flex justify-center items-center">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-800">{diseaseDetails.title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Images */}
          <div className="space-y-4">
            {details.images?.map((img: string, index: number) => (
               <Image 
               key={index} 
               src={img} 
               alt={`Disease Illustration ${index + 1}`} 
               className="rounded-lg shadow-md"
               width={500}
               height={500}
             />
           
            ))}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-orange-700">Summary</h3>
              <p>{details.summary}</p>
            </div>

            {/* Dynamically render sections */}
            {Object.entries(details)
              .filter(([key]) => [
                'possible_causes', 
                'risk_factors', 
                'symptoms', 
                'home_remedies', 
                'complications', 
                'when_to_see_a_doctor',
                'whom_to_consult'
              ].includes(key))
              .map(([key, value]) => (
                <div key={key}>
                  <h3 className="font-semibold text-orange-700">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  {Array.isArray(value) ? (
                    <ul className="list-disc pl-5">
                      {value.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{value as string}</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}


// Main Component
const AIXRayReports1: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<XRayAnalysisResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showFullDetails, setShowFullDetails] = useState(false)
  const [diseaseDetails, setDiseaseDetails] = useState<any>(null)
  const [showDiseaseModal, setShowDiseaseModal] = useState(false)

  // Load disease data
  useEffect(() => {
    if (analysisResult) {
      fetch('/data/disease_all_more_details.json')
        .then(response => response.json())
        .then(diseases => {
          const matchedDisease = diseases.find(
            (disease: any) => disease.title === analysisResult.findings[0].detectedDisease
          )
          setDiseaseDetails(matchedDisease)
        })
        .catch(error => console.error('Failed to load disease data:', error))
    }
  }, [analysisResult])

  const handleFileUpload = async (file: File) => {
    setSelectedFile(file)
    setIsProcessing(true)

    // Simulate AI processing with more comprehensive result
    setTimeout(() => {
      const result = {
        imageUrl: URL.createObjectURL(file),
        findings: [
          {
            category: 'Lung Structure',
            confidence: 0.83,
            description: 'Bacterial pneumonia, caused by *Streptococcus pneumoniae*, inflames lungs and blocks oxygen flow. Antibiotics are crucial.',
            severity: 'Moderate' as 'Moderate',
            detectedDisease: 'Bacterial Pneumonia'
          }
          // More findings...
        ],
        overallAssessment: {
          recommendation: 'Consult healthcare professional for comprehensive review',
          riskLevel: 'Moderate'
        },
        additionalMetadata: {
          hospitalName: 'Bacterial Pneumonia',
          patientId: 'XR-2024-0537',
          scanDate: '2024-01-24'
        }
      }
      setAnalysisResult(result)
      setIsProcessing(false)

      // Find matching disease details
      fetch('/data/disease_all_more_details.json')
        .then(response => response.json())
        .then(diseases => {
          const matchedDisease = diseases.find(
            (disease: any) => disease.title === result.findings[0].detectedDisease
          )
          setDiseaseDetails(matchedDisease)
        })
    }, 3000)
  }

  const downloadPDFReport = async () => {
    if (!analysisResult || !diseaseDetails) return
  
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([600, 1000]);
    // Increased page height
    const { width, height } = page.getSize()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
    // Fetch and embed X-Ray image
    let xrayImage;
    try {
      const imageResponse = await fetch(analysisResult.imageUrl)
      const imageArrayBuffer = await imageResponse.arrayBuffer()
      xrayImage = analysisResult.imageUrl.endsWith('.png') 
        ? await pdfDoc.embedPng(imageArrayBuffer)
        : await pdfDoc.embedJpg(imageArrayBuffer)
    } catch (error) {
      console.error('Image embedding failed', error)
    }
  
    const drawText = (text: string, x: number, y: number, fontSize: number = 12, fontType = font, color = rgb(0, 0, 0), maxWidth?: number) => {
      page.drawText(text, {
        x, 
        y, 
        size: fontSize,
        font: fontType,
        color,
        maxWidth: maxWidth || width - 100
      })
    }
  
    // Margins and Spacing
    const margin = 50
    let yPosition = height - margin
  
    // Title
    drawText('X-Ray Analysis Report', margin, yPosition, 18, boldFont)
    yPosition -= 40
  
    // Patient Metadata
    drawText(`disease: ${analysisResult.additionalMetadata?.hospitalName}`, margin, yPosition)
    yPosition -= 20
    drawText(`Patient ID: ${analysisResult.additionalMetadata?.patientId}`, margin, yPosition)
    yPosition -= 20
    drawText(`Scan Date: ${analysisResult.additionalMetadata?.scanDate}`, margin, yPosition)
    yPosition -= 40
  
    // X-Ray Image
    if (xrayImage) {
      const imageWidth = 300
      const imageHeight = (xrayImage.height / xrayImage.width) * imageWidth
      page.drawImage(xrayImage, {
        x: margin,
        y: yPosition - imageHeight,
        width: imageWidth,
        height: imageHeight
      })
      yPosition -= (imageHeight + 30)
    }
  
    // Findings Section
    drawText('Detailed Findings:', margin, yPosition, 14, boldFont)
    yPosition -= 30
  
    analysisResult.findings.forEach(finding => {
      drawText(`Category: ${finding.category}`, margin, yPosition, 12, boldFont)
      yPosition -= 20
      drawText(`Description: ${finding.description}`, margin, yPosition)
      yPosition -= 20
      drawText(`Confidence: ${(finding.confidence * 100).toFixed(0)}%`, margin, yPosition)
      yPosition -= 20
      drawText(`Severity: ${finding.severity}`, margin, yPosition)
      yPosition -= 40
    })
  
    // Disease Details
    if (diseaseDetails?.content) {
      const details = diseaseDetails.content
      drawText(`Disease: ${diseaseDetails.title}`, margin, yPosition, 14, boldFont)
      yPosition -= 30
  
      const detailSections = [
        { title: 'Summary', content: details.summary },
        { title: 'Possible Causes', content: details.possible_causes.join(', ') },
        { title: 'Risk Factors', content: details.risk_factors.join(', ') },
        { title: 'Symptoms', content: details.symptoms.join(', ') }
      ]
  
      detailSections.forEach(section => {
        drawText(`${section.title}:`, margin, yPosition, 12, boldFont)
        yPosition -= 20
        drawText(section.content, margin, yPosition, 10, font, rgb(0.2, 0.2, 0.2), width - 100)
        yPosition -= 40
      })
    }
  
    // Overall Assessment
    drawText('Overall Assessment:', margin, yPosition, 14, boldFont)
    yPosition -= 30
    drawText(`Recommendation: ${analysisResult.overallAssessment.recommendation}`, margin, yPosition)
    yPosition -= 20
    drawText(`Risk Level: ${analysisResult.overallAssessment.riskLevel}`, margin, yPosition)
  
    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'XRay_Analysis_Report.pdf'
    link.click()
  }

  const resetAnalysis = () => {
    setSelectedFile(null)
    setAnalysisResult(null)
    setDiseaseDetails(null)
  }
  
    const clearUpload = () => {
      setSelectedFile(null)
      setAnalysisResult(null)
    }
  
    const downloadReport = useCallback(() => {
      if (analysisResult) {
        const reportContent = `X-Ray Analysis Report
  disease: ${analysisResult.additionalMetadata?.hospitalName}
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

  // Rest of the component remains similar to previous implementation
  return (
    <div className="min-h-screen p-1">
      {/* main view part  */}
      <div className="max-w-4xl mx-auto bg-white/85 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-orange-200">
              <div className="p-6 bg-gradient-to-r from-orange-600 to-amber-600">
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <Stethoscope className="mr-3" /> Chest & Brain X-Ray AI Report Generator
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
                          <span className="font-semibold">disease:</span>
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
                    <div className="mt-6 flex flex-wrap bg-gradient-to-r from-orange-100 to-amber-100 p-5 rounded-xl  justify-between items-center">
                    <button 
                onClick={() => setShowDiseaseModal(true)}
                className="bg-amber-500 mt-2 text-white p-3 rounded-md hover:bg-amber-600 flex items-center"
              >
                <BookOpen className="mr-2" /> View Disease Details
              </button>
                      <div className="flex space-x-3">
                      <button 
              onClick={downloadPDFReport} 
              className="bg-orange-500 mt-2 text-white p-3 rounded-md hover:bg-orange-600 flex items-center"
            >
              <Download className="mr-2" /> Download Full Report
            </button>
            <button 
              onClick={resetAnalysis} 
              className="bg-gray-500 mt-2 text-white p-3 rounded-md hover:bg-gray-600 flex items-center"
            >
              <RefreshCw className="mr-2" /> Reset Analysis
            </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
      {/* Previous UI structure maintained */}
      {analysisResult && (
        <>
          {diseaseDetails && (
            <div className="mt-6 flex justify-center">
             
            </div>
          )}

          <div className="mt-6 flex justify-center space-x-4">
            
          </div>
        </>
      )}

      {/* Disease Details Modal */}
      {showDiseaseModal && diseaseDetails && (
        <DiseaseDetailsModal 
          diseaseDetails={diseaseDetails} 
          onClose={() => setShowDiseaseModal(false)} 
        />
      )}
    </div>
  )
}

export default AIXRayReports1

