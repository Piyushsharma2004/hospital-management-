import React, { useState } from 'react'
import { FileUp, X, Camera, AlertCircle } from 'lucide-react'
import { Highlight } from './types'

interface XRayUploadProps {
  selectedFile: File | null
  handleFileUpload: (file: File) => void
  setSelectedFile: (file: File | null) => void
  setSelectedXrayForAnalysis: (url: string | null) => void
  setHighlights: (highlights: Highlight[]) => void
  setOverallAssessment: (assessment: any) => void
  isCameraOpen: boolean
  setIsCameraOpen: (isOpen: boolean) => void
  cameraError: string | null
  videoRef: React.RefObject<HTMLVideoElement>
  startCamera: () => Promise<void>
  stopCamera: () => void
  captureImage: () => void
}

export const XRayUpload: React.FC<XRayUploadProps> = ({
    selectedFile,
    handleFileUpload,
    setSelectedFile,
    setSelectedXrayForAnalysis,
    setHighlights,
    setOverallAssessment,
    isCameraOpen,
    cameraError,
    videoRef,
    startCamera,
    stopCamera,
    captureImage
  }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0]
          
          // Create a preview URL for immediate display
          const objectUrl = URL.createObjectURL(file)
          setPreviewUrl(objectUrl)
          
          // Handle the file upload
          handleFileUpload(file)
        }
      }

      const clearSelection = () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
          setPreviewUrl(null)
        }
        setSelectedFile(null)
        setSelectedXrayForAnalysis(null)
        setHighlights([])
        setOverallAssessment(null)
      }

  return (
    <div>
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

      
<div className={`
        border-2 border-dashed rounded-xl p-8 text-center 
        transition-all duration-300
        ${selectedFile ? 'border-orange-500 bg-orange-50' : 'border-amber-300 hover:border-amber-500'}
      `}>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          id="xray-upload"
          onChange={handleFileChange}
        />
        <label 
          htmlFor="xray-upload" 
          className="cursor-pointer flex flex-col items-center"
        >
          {previewUrl ? (
            <div className="mb-4">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-w-full h-auto max-h-64 rounded-lg"
              />
            </div>
          ) : (
            <FileUp className="w-16 h-16 text-orange-600 mb-4" />
          )}
          
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
            onClick={clearSelection}
            className="mt-4 text-orange-600 hover:text-orange-800 flex items-center mx-auto"
          >
            <X className="mr-2" /> Clear Selection
          </button>
        )}
      </div>
    </div>
  )
}