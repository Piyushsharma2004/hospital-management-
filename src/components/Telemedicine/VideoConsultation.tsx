// components/VideoConsultation.tsx
'use client'
import React, { useRef, useEffect } from 'react'
import { Video, Mic, CameraOff, MicOff } from 'lucide-react'

interface VideoConsultationProps {
  isVideoActive: boolean
  audioMuted: boolean
  videoMuted: boolean
  setAudioMuted: (value: boolean) => void
  setVideoMuted: (value: boolean) => void
  onEndCall: () => void
}

const VideoConsultation: React.FC<VideoConsultationProps> = ({
  isVideoActive,
  audioMuted,
  videoMuted,
  setAudioMuted,
  setVideoMuted,
  onEndCall
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const initializeVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: !videoMuted, 
          audio: !audioMuted 
        })
        
        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream
          // Explicitly call play() after setting srcObject
          try {
            await videoRef.current.play()
          } catch (playError) {
            console.error('Error playing video:', playError)
          }
        }
      } catch (error) {
        console.error('Error accessing camera:', error)
        alert('Unable to access camera. Please check permissions.')
      }
    }

    if (isVideoActive) {
      initializeVideo()
    }

    // Cleanup function
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [isVideoActive, videoMuted, audioMuted])

  return (
    <div className="relative bg-black rounded-lg h-48 md:h-64 flex items-center justify-center">
      <video 
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg"
        muted={audioMuted}
        autoPlay
        playsInline
      />
      <div className="absolute bottom-4 flex space-x-4">
        <button 
          onClick={() => setVideoMuted(!videoMuted)}
          className={`bg-white/30 p-2 rounded-full ${videoMuted ? 'bg-red-500/50' : ''}`}
        >
          {videoMuted ? <CameraOff className="text-white" /> : <Video className="text-white" />}
        </button>
        <button 
          onClick={() => setAudioMuted(!audioMuted)}
          className={`bg-white/30 p-2 rounded-full ${audioMuted ? 'bg-red-500/50' : ''}`}
        >
          {audioMuted ? <MicOff className="text-white" /> : <Mic className="text-white" />}
        </button>
      </div>
    </div>
  )
}

export default VideoConsultation