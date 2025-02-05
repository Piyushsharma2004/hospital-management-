// AutoHighlightXray.tsx
'use client'
import React, { useState, useRef } from 'react'
import { Scan, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { SearchBar } from './SearchBar'
import { PatientInfo } from './PatientInfo'
import { XRayUpload } from './XRayUpload'
import { XRayAnalysis } from './XRayAnalysis'
import { mockPatients, mockMachines } from './mockData'
import type { Highlight, Patient, XRayMachine } from './types'



const AutoHighlightXray: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [overallAssessment, setOverallAssessment] = useState<{
    recommendation: string
    riskLevel: string
  } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [currentXrayIndex, setCurrentXrayIndex] = useState(0)
  const [selectedMachine, setSelectedMachine] = useState<XRayMachine | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedXrayForAnalysis, setSelectedXrayForAnalysis] = useState<string | null>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleSearch = () => {
    setIsLoading(true)
    setError(null)
    
    setTimeout(() => {
      const patient = mockPatients.find(p => p.id === searchQuery)
      if (patient) {
        setSelectedPatient(patient)
        setCurrentXrayIndex(0)
        setSelectedXrayForAnalysis(null)
        setHighlights([])
        setOverallAssessment(null)
        const machine = mockMachines.find(m => m.id === patient.xrays[0].machineId)
        setSelectedMachine(machine || null)
      } else {
        setError("Patient not found. Please check the ID and try again.")
        setSelectedPatient(null)
      }
      setIsLoading(false)
    }, 1000)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSelectedPatient(null)
    setSelectedXrayForAnalysis(null)
    setHighlights([])
    setOverallAssessment(null)
    setError(null)
  }

  const analyzeXray = (imageUrl: string) => {
    setSelectedXrayForAnalysis(imageUrl)
    setIsLoading(true)
    
    setTimeout(() => {
      const newHighlights = generateHighlights()
      setHighlights(newHighlights)
      setIsLoading(false)
    }, 1000)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
      setIsCameraOpen(true)
      setCameraError(null)
    } catch (error) {
      setCameraError('Unable to access camera. Please ensure you have granted camera permissions.')
      console.error('Camera error:', error)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    setIsCameraOpen(false)
  }

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
            setSelectedFile(file)
            const imageUrl = URL.createObjectURL(blob)
            setSelectedXrayForAnalysis(imageUrl)
            analyzeXray(imageUrl)
            stopCamera()
          }
        }, 'image/jpeg')
      }
    }
  }

  const handleFileUpload = (file: File) => {
    const objectUrl = URL.createObjectURL(file)
    setSelectedFile(file)
    setSelectedXrayForAnalysis(objectUrl)
    analyzeXray(objectUrl)
  
    // Clean up the object URL when component unmounts
    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }

  const generateHighlights = () => {
    const canvas = canvasRef.current
    if (!canvas) return []

    const width = canvas.width
    const height = canvas.height

    const categories = [
      'Lung Structure', 
      'Cardiac Region', 
      'Bone Density', 
      'Soft Tissue'
    ]

    const newHighlights: Highlight[] = categories.slice(0, 3).map((category, index) => ({
      x: width * (0.25 + (index * 0.25)),
      y: height * (0.3 + (index * 0.2)),
      radius: Math.min(width, height) * 0.15,
      category,
      confidence: Math.random() * 0.4 + 0.6,
      severity: index === 0 ? 'High' : index === 1 ? 'Moderate' : 'Low'
    }))

    const riskLevels = ['Low', 'Moderate', 'High']
    const dominantRisk = newHighlights.reduce((max, highlight) => 
      riskLevels.indexOf(highlight.severity) > riskLevels.indexOf(max) 
        ? highlight.severity 
        : max, 
      'Low'
    )

    setOverallAssessment({
      recommendation: dominantRisk === 'High' 
        ? 'Urgent medical consultation recommended' 
        : dominantRisk === 'Moderate'
          ? 'Follow-up with healthcare professional suggested'
          : 'No immediate concerns detected',
      riskLevel: dominantRisk
    })

    return newHighlights
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto bg-white/85 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-orange-200">
        <div className="p-6 bg-gradient-to-r from-orange-400 to-amber-600">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Scan className="mr-3" />Chest & Brain X-Ray AI Insights
          </h1>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              clearSearch={clearSearch}
              isLoading={isLoading}
              selectedPatient={selectedPatient}
            />
            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}
          </div>

          {selectedPatient && (
            <PatientInfo 
              patient={selectedPatient} 
              machine={selectedMachine}
            />
          )}

          {selectedPatient ? (
            <div className="mt-8 space-y-6">
              {!selectedXrayForAnalysis && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedPatient.xrays.map((xray, index) => (
                    <div 
                      key={xray.id} 
                      className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="aspect-w-4 aspect-h-3">
                        <Image
                          src={xray.imageUrl}
                          alt={`X-Ray ${index + 1}`}
                          width={400}
                          height={300}
                          className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white font-medium mb-2">{xray.type}</p>
                          <p className="text-white/80 text-sm mb-3">Date: {xray.date}</p>
                          <button
                            onClick={() => analyzeXray(xray.imageUrl)}
                            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
                          >
                            Analyze
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedXrayForAnalysis && (
                <XRayAnalysis
                  selectedXrayForAnalysis={selectedXrayForAnalysis}
                  highlights={highlights}
                  overallAssessment={overallAssessment}
                  setSelectedXrayForAnalysis={setSelectedXrayForAnalysis}
                  setHighlights={setHighlights}
                  setOverallAssessment={setOverallAssessment}
                  imageRef={imageRef}
                  canvasRef={canvasRef}
                  generateHighlights={generateHighlights}
                />
              )}
            </div>
          ) : (
            <XRayUpload
              selectedFile={selectedFile}
              handleFileUpload={handleFileUpload}
              setSelectedFile={setSelectedFile}
              setSelectedXrayForAnalysis={setSelectedXrayForAnalysis}
              setHighlights={setHighlights}
              setOverallAssessment={setOverallAssessment}
              isCameraOpen={isCameraOpen}
              setIsCameraOpen={setIsCameraOpen}
              cameraError={cameraError}
              videoRef={videoRef}
              startCamera={startCamera}
              stopCamera={stopCamera}
              captureImage={captureImage}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default AutoHighlightXray