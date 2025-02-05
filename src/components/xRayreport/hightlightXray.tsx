'use client'
import React, { useState, useRef, useEffect } from 'react'
import { FileUp, X, Scan, AlertCircle, CheckCircle2, Search, ChevronLeft, ChevronRight, Camera } from 'lucide-react'
import Image from 'next/image'

interface Highlight {
  x: number
  y: number
  radius: number
  category: string
  confidence: number
  severity: 'Low' | 'Moderate' | 'High'
}

interface Patient {
  id: string
  name: string
  age: number
  xrays: {
    id: string
    date: string
    imageUrl: string
    machineId: string
    type: string
  }[]
}

interface XRayMachine {
  id: string
  name: string
  location: string
  status: 'available' | 'in-use' | 'maintenance'
}

const mockPatients: Patient[] = [
  {
    id: "P001",
    name: "John Doe",
    age: 45,
    xrays: [
      {
        id: "X001",
        date: "2024-02-01",
        imageUrl: "/disese-img/chest-xray.jpeg",
        machineId: "M001",
        type: "Chest X-Ray"
      },
      {
        id: "X002",
        date: "2024-02-03",
        imageUrl: "/disese-img/brain-xray.jpg",
        machineId: "M002",
        type: "Brain X-Ray"
      }
    ]
  }
]

const mockMachines: XRayMachine[] = [
  {
    id: "M001",
    name: "X-Ray Machine A",
    location: "Room 101",
    status: "available"
  },
  {
    id: "M002",
    name: "X-Ray Machine B",
    location: "Room 102",
    status: "in-use"
  }
]

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
    
    // Simulate API call delay
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
    
    // Simulate analysis delay
    setTimeout(() => {
      const newHighlights = generateHighlights()
      setHighlights(newHighlights)
      setIsLoading(false)
    }, 1000)
  }

  //camera
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
    setSelectedFile(file)
    const imageUrl = URL.createObjectURL(file)
    setSelectedXrayForAnalysis(imageUrl)
    analyzeXray(imageUrl)
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

    // Increased radius and adjusted positions for better visibility
    const newHighlights: Highlight[] = categories.slice(0, 3).map((category, index) => ({
      x: width * (0.25 + (index * 0.25)),
      y: height * (0.3 + (index * 0.2)),
      radius: Math.min(width, height) * 0.15, // Increased radius
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

  useEffect(() => {
    if (!selectedXrayForAnalysis) return

    const canvas = canvasRef.current
    const image = imageRef.current
    if (!canvas || !image || !image.complete) return

    const updateCanvas = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set canvas size to match image size
      canvas.width = image.width
      canvas.height = image.height

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      highlights.forEach(highlight => {
        ctx.beginPath()
        ctx.arc(highlight.x, highlight.y, highlight.radius, 0, 2 * Math.PI)
        ctx.fillStyle = highlight.severity === 'High' 
          ? 'rgba(255, 0, 0, 0.3)' 
          : highlight.severity === 'Moderate' 
            ? 'rgba(255, 165, 0, 0.3)' 
            : 'rgba(0, 255, 0, 0.3)'
        ctx.fill()
        
        ctx.strokeStyle = highlight.severity === 'High' 
          ? 'rgba(255, 0, 0, 0.7)' 
          : highlight.severity === 'Moderate' 
            ? 'rgba(255, 165, 0, 0.7)' 
            : 'rgba(0, 255, 0, 0.7)'
        ctx.lineWidth = 3
        ctx.stroke()
      })
    }

    image.onload = updateCanvas
    if (image.complete) updateCanvas()
  }, [highlights, selectedXrayForAnalysis])

  return (
    <div className="min-h-screen p-8">
    <div className="max-w-6xl mx-auto bg-white/85 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-orange-200">
    <div className="p-6 bg-gradient-to-r from-orange-400 to-amber-600">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Scan className="mr-3" />Chest & Brain X-Ray AI Insights
          </h1>
        </div>

        <div className="p-8">
          {/* Search Section */}
          <div className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter Patient ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'Searching...' : (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>
              {selectedPatient && (
                <button
                  onClick={clearSearch}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}
          </div>

          {/* Patient Info */}
          {selectedPatient && (
            <div className="mb-8 p-4 bg-orange-100 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Patient Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>ID:</strong> {selectedPatient.id}</p>
                  <p><strong>Name:</strong> {selectedPatient.name}</p>
                  <p><strong>Age:</strong> {selectedPatient.age}</p>
                </div>
                {selectedMachine && (
                  <div>
                    <h3 className="font-semibold mb-1">Machine Details</h3>
                    <p><strong>Machine:</strong> {selectedMachine.name}</p>
                    <p><strong>Location:</strong> {selectedMachine.location}</p>
                    <p><strong>Status:</strong> {selectedMachine.status}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* X-Ray Display Section */}
          {selectedPatient ? (
            <div className="mt-8 space-y-6">
              {/* Thumbnail Grid */}
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

              {/* Analysis View */}
              {selectedXrayForAnalysis && (
                <div className="space-y-6">
                  <button
                    onClick={() => {
                      setSelectedXrayForAnalysis(null)
                      setHighlights([])
                      setOverallAssessment(null)
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
                  >
                    <ChevronLeft />
                    Back to All X-Rays
                  </button>

                  <div className="relative rounded-xl overflow-hidden shadow-2xl">
                    <Image
                      ref={imageRef}
                      src={selectedXrayForAnalysis}
                      alt="X-Ray Analysis"
                      width={1200}
                      height={800}
                      className="w-full"
                      onLoad={() => {
                        // Trigger highlight generation after image loads
                        if (highlights.length === 0) {
                          const newHighlights = generateHighlights()
                          setHighlights(newHighlights)
                        }
                      }}
                    />
                  <canvas 
                      ref={canvasRef}
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    />
                  </div>

                  {highlights.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {highlights.map((highlight, index) => (
                        <div 
                          key={index} 
                          className={`
                            p-4 rounded-lg 
                            ${highlight.severity === 'High' 
                              ? 'bg-red-100 border-red-300' 
                              : highlight.severity === 'Moderate' 
                                ? 'bg-orange-100 border-orange-300' 
                                : 'bg-green-100 border-green-300'}
                          `}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">{highlight.category}</h4>
                            <span className="text-sm font-medium">
                              {(highlight.confidence * 100).toFixed(0)}% Confidence
                            </span>
                          </div>
                          <p className="text-sm">
                            Severity: {highlight.severity}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {overallAssessment && (
                    <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-5 rounded-xl flex items-center">
                      {overallAssessment.riskLevel === 'High' ? (
                        <AlertCircle className="mr-3 text-red-600" />
                      ) : (
                        <CheckCircle2 className="mr-3 text-green-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">
                          {overallAssessment.recommendation}
                        </p>
                        <p className="text-sm text-gray-600">
                          Risk Level: {overallAssessment.riskLevel}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Upload Section - Only shown when no patient is selected */
            <div>
              {/* Camera Section */}
              {isCameraOpen ? (
                <div className="mb-8 relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-xl"
                  />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                    <button
                      onClick={captureImage}
                      className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 flex items-center gap-2"
                    >
                      <Camera className="w-5 h-5" /> Capture
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 mb-8 justify-center">
                  <button
                    onClick={startCamera}
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" /> Open Camera
                  </button>
                </div>
              )}

              {cameraError && (
                <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {cameraError}
                </div>
              )}

              {/* Upload Section */}
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
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0])
                    }
                  }}
                />
                <label 
                  htmlFor="xray-upload" 
                  className="cursor-pointer flex flex-col items-center"
                >
                  <FileUp className="w-16 h-16 text-orange-600 mb-4" />
                  <p className="text-gray-700 font-medium mb-2">
                    {selectedFile 
                      ? `Selected: ${selectedFile.name}` 
                      : 'Upload New X-Ray Image'}
                  </p>
                  <span className="text-sm text-gray-500">
                    Drag & Drop or Click to Upload
                  </span>
                </label>

                {selectedFile && (
                  <button 
                    onClick={() => {
                      setSelectedFile(null)
                      setSelectedXrayForAnalysis(null)
                      setHighlights([])
                      setOverallAssessment(null)
                    }} 
                    className="mt-4 text-orange-600 hover:text-orange-800 flex items-center mx-auto"
                  >
                    <X className="mr-2" /> Clear Selection
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AutoHighlightXray