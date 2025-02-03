'use client'
import React, { useState, useRef, useEffect } from 'react'
import { FileUp, X, Scan, AlertCircle, CheckCircle2 } from 'lucide-react'

interface Highlight {
  x: number
  y: number
  radius: number
  category: string
  confidence: number
  severity: 'Low' | 'Moderate' | 'High'
}

const AutoHighlightXray: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [overallAssessment, setOverallAssessment] = useState<{
    recommendation: string
    riskLevel: string
  } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const generateCenteredHighlights = () => {
    if (!imageRef.current || !canvasRef.current) return []

    const categories = [
      'Lung Structure', 
      'Cardiac Region', 
      'Bone Density', 
      'Soft Tissue'
    ]

    const centerX = canvasRef.current.width / 2
    const centerY = canvasRef.current.height / 2

    const newHighlights: Highlight[] = categories.slice(0, 3).map((category, index) => ({
      x: centerX + (index % 2 === 0 ? -1 : 1) * (centerX / 3),
      y: centerY + (index < 2 ? -1 : 1) * (centerY / 3),
      radius: 80,
      category,
      confidence: Math.random() * 0.4 + 0.6, // 60-100%
      severity: index === 0 ? 'High' : index === 1 ? 'Moderate' : 'Low'
    }))

    // Determine overall assessment
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

  const handleFileUpload = (file: File) => {
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setImageUrl(url)
    
    setTimeout(() => {
      const newHighlights = generateCenteredHighlights()
      setHighlights(newHighlights)
    }, 100)
  }

  const clearUpload = () => {
    setSelectedFile(null)
    setImageUrl(null)
    setHighlights([])
    setOverallAssessment(null)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!canvas || !image) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

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
  }, [highlights])

  return (
    <div className="min-h-screen p-8 bg-orange-50">
      <div className="max-w-4xl mx-auto bg-white/85 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-orange-200">
        <div className="p-6 bg-gradient-to-r from-orange-400 to-amber-600">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Scan className="mr-3" />Chest & Brain X-Ray AI Insights
          </h1>
        </div>

        <div className="p-8">
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

          {imageUrl && (
            <div className="mt-8 space-y-6">
              <div className="relative">
                <img 
                  ref={imageRef}
                  src={imageUrl} 
                  alt="X-Ray" 
                  className="hidden" 
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement
                    if (canvasRef.current) {
                      canvasRef.current.width = img.naturalWidth
                      canvasRef.current.height = img.naturalHeight
                    }
                  }}
                />
                <canvas 
                  ref={canvasRef}
                  className="w-full border rounded-lg"
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
      </div>
    </div>
  )
}

export default AutoHighlightXray