// TelemedicinePlatform.tsx
'use client'
import React, { useState, useCallback } from 'react'
import { Search, UserCheck, Send, Paperclip } from 'lucide-react'
import { Doctor, Consultation, ChatMessage } from './types'
import Sidebar from './Sidebar'
import DoctorList from './DoctorList'
import VideoConsultation from './VideoConsultation'

const TelemedicinePlatform: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [isVideoActive, setIsVideoActive] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [audioMuted, setAudioMuted] = useState(false)
  const [videoMuted, setVideoMuted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const chatEndRef = React.useRef<HTMLDivElement>(null)

  // Your existing doctors and consultationHistory data...

  const startVideoConsultation = () => {
    setIsVideoActive(true)
    // Update consultation history...
  }

  const endVideoConsultation = () => {
    setIsVideoActive(false)
  }
  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Piyush Sharma',
      specialty: 'Cardiology',
      rating: 4.8,
      availability: 'Today, 2-5 PM',
      imageUrl: '/images/team/piyush.jpg',
      consultationFee: 1500,
      languages: ['English', 'Hindi']
    },
    {
      id: '2',
      name: 'Dr. Nirmal Jain',
      specialty: 'Neurologist',
      rating: 4.8,
      availability: 'Today, 10-12 AM',
      imageUrl: '/images/team/nirmal.jpeg',
      consultationFee: 1200,
      languages: ['English', 'Hindi']
    },
    // ... other doctors
  ]
  
  const [consultationHistory, setConsultationHistory] = useState<Consultation[]>([
    {
      id: '1',
      date: 'Jan 15, 2024',
      doctor: 'Piyush Sharma',
      type: 'Video',
      status: 'Completed',
      notes: 'Annual cardiac check-up'
    },
    // ... other consultation history items
  ])

  const sendMessage = useCallback(() => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: (chatMessages.length + 1).toString(),
        sender: 'patient',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString()
      }
      setChatMessages(prev => [...prev, message])
      setNewMessage('')

      // Simulate doctor response
      setTimeout(() => {
        const doctorResponse: ChatMessage = {
          id: (chatMessages.length + 2).toString(),
          sender: 'doctor',
          text: `Thank you for your message. I'll review your concerns shortly.`,
          timestamp: new Date().toLocaleTimeString()
        }
        setChatMessages(prev => [...prev, doctorResponse])
      }, 1000)
    }
  }, [newMessage, chatMessages])

  // Scroll to bottom of chat
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  return (

        <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
          {/* Mobile Header */}
          <div className="md:hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b dark:border-gray-700 p-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-orange-800 dark:text-orange-400">Telemedicine</h2>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-orange-600 dark:text-orange-400"
            >
              {isMobileMenuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
      
          {/* Sidebar Component */}
          <Sidebar 
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
      
          {/* Main Content */}
          <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
            {/* Search Bar */}
            <div className="mb-8 flex items-center">
              <div className="relative flex-grow mr-4">
                <input 
                  type="text" 
                  placeholder="Search doctors by name or specialty" 
                  className="w-full p-3 pl-10 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 dark:text-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
      
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {/* Doctor List Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-orange-800 dark:text-orange-400">
                  Available Doctors
                </h3>
                <DoctorList 
                  doctors={doctors}
                  searchTerm={searchTerm}
                  onSelectDoctor={setSelectedDoctor}
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
              </div>
      
              {/* Consultation Section */}
              <div>
                {selectedDoctor ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-400">
                        Consultation with {selectedDoctor.name}
                      </h3>
                      <button 
                        className="bg-orange-600 dark:bg-orange-700 text-white px-4 py-2 rounded-lg"
                        onClick={isVideoActive ? endVideoConsultation : startVideoConsultation}
                      >
                        {isVideoActive ? 'End Consultation' : 'Start Video Call'}
                      </button>
                    </div>
      
                    {isVideoActive ? (
                      <VideoConsultation 
                        isVideoActive={isVideoActive}
                        audioMuted={audioMuted}
                        videoMuted={videoMuted}
                        setAudioMuted={setAudioMuted}
                        setVideoMuted={setVideoMuted}
                        onEndCall={endVideoConsultation}
                      />
                    ) : (
                      <div className="bg-orange-50 dark:bg-slate-700 rounded-lg p-6">
                        <div className="flex flex-col items-center">
                          <UserCheck className="w-16 h-16 text-orange-500 mb-4" />
                          <p className="text-gray-900 dark:text-white text-center">
                            Start a video or chat consultation with {selectedDoctor.name}
                          </p>
                          <div className="mt-4 flex space-x-4">
                            <button 
                              className="bg-orange-600 text-white px-4 py-2 rounded-lg"
                              onClick={startVideoConsultation}
                            >
                              Video Consultation
                            </button>
                            <button 
                              className="bg-amber-600 text-white px-4 py-2 rounded-lg"
                              onClick={() => setChatMessages([])}
                            >
                              Chat Consultation
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
      
                    {/* Chat Interface */}
                    {chatMessages.length > 0 && (
                      <div className="mt-6 bg-orange-50 rounded-lg p-4 h-64 overflow-y-auto">
                        {chatMessages.map(message => (
                          <div 
                            key={message.id} 
                            className={`mb-3 flex ${
                              message.sender === 'patient' 
                                ? 'justify-end' 
                                : 'justify-start'
                            }`}
                          >
                            <div 
                              className={`
                                p-3 rounded-lg max-w-[70%]
                                ${message.sender === 'patient' 
                                  ? 'bg-orange-600 text-white' 
                                  : 'bg-gray-200 text-black'
                                }
                              `}
                            >
                              <p>{message.text}</p>
                              <span className="text-xs opacity-70 block mt-1">
                                {message.timestamp}
                              </span>
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>
                    )}
      
                    {/* Chat Input */}
                    {chatMessages.length > 0 && (
                      <div className="mt-4 flex items-center space-x-2">
                        <button className="text-orange-600">
                          <Paperclip />
                        </button>
                        <input 
                          type="text"
                          placeholder="Type your message..."
                          className="flex-grow p-2 border rounded-lg"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button 
                          onClick={sendMessage}
                          className="bg-orange-600 text-white p-2 rounded-lg"
                        >
                          <Send />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
                    <UserCheck className="mx-auto w-16 h-16 text-orange-500 dark:text-orange-400 mb-4" />
                    <p className="dark:text-gray-300">Select a doctor to start consultation</p>
                  </div>
                )}
      
                {/* Consultation History */}
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 text-orange-800 dark:text-orange-400">
                    Consultation History
                  </h3>
                  {consultationHistory.map(consultation => (
                    <div 
                      key={consultation.id} 
                      className="flex justify-between items-center p-3 border-b dark:border-gray-700 last:border-b-0"
                    >
                      <div>
                        <p className="font-medium dark:text-white">{consultation.doctor}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{consultation.date}</p>
                        {consultation.notes && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{consultation.notes}</p>
                        )}
                      </div>
                      <span 
                        className={`
                          px-3 py-1 rounded-full text-sm 
                          ${
                            consultation.status === 'Completed' 
                              ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' 
                            : consultation.status === 'In Progress'
                              ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
                              : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                          }
                        `}
                      >
                        {consultation.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
  
}

export default TelemedicinePlatform