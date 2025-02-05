import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Highlight } from './types'

interface XRayAnalysisProps {
  selectedXrayForAnalysis: string
  highlights: Highlight[]
  overallAssessment: {
    recommendation: string
    riskLevel: string
  } | null
  setSelectedXrayForAnalysis: (url: string | null) => void
  setHighlights: (highlights: Highlight[]) => void
  setOverallAssessment: (assessment: any) => void
  imageRef: React.RefObject<HTMLImageElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  generateHighlights: () => Highlight[]
}

export const XRayAnalysis: React.FC<XRayAnalysisProps> = ({
    selectedXrayForAnalysis,
    highlights,
    overallAssessment,
    setSelectedXrayForAnalysis,
    setHighlights,
    setOverallAssessment,
    imageRef,
    canvasRef,
    generateHighlights
  }) => {
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  
    useEffect(() => {
        if (imageRef.current) {
          const updateDimensions = () => {
            setImageDimensions({
              width: imageRef.current?.naturalWidth || 0,
              height: imageRef.current?.naturalHeight || 0
            })
          }
    
          if (imageRef.current.complete) {
            updateDimensions()
          } else {
            imageRef.current.onload = updateDimensions
          }
        }
      }, [selectedXrayForAnalysis])

      useEffect(() => {
        if (!selectedXrayForAnalysis || !canvasRef.current || !imageRef.current) return
    
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return
    
        canvas.width = imageDimensions.width
        canvas.height = imageDimensions.height
    
        const drawHighlights = () => {
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
    
        drawHighlights()
      }, [highlights, imageDimensions, selectedXrayForAnalysis])
    
  return (
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
        <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
          <img
            ref={imageRef}
            src={selectedXrayForAnalysis}
            alt="X-Ray Analysis"
            style={{ width: '100%', height: 'auto', display: 'block' }}
            onLoad={() => {
              if (highlights.length === 0) {
                const newHighlights = generateHighlights()
                setHighlights(newHighlights)
              }
            }}
          />
          <canvas 
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          />
        </div>
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
  )
}