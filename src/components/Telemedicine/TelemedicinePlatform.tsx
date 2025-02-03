'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { 
  Search, 
  Video, 
  MessageCircle, 
  UserCheck, 
  Clock, 
  Star, 
  FileText, 
  Calendar,
  Mic,
  Send,
  Paperclip,
  CameraOff,
  MicOff 
} from 'lucide-react'
import Image from 'next/image'

interface Doctor {
  id: string
  name: string
  specialty: string
  rating: number
  availability: string
  imageUrl: string
  consultationFee: number
  languages: string[]
}

interface Consultation {
  id: string
  date: string
  doctor: string
  type: 'Video' | 'Chat'
  status: 'Completed' | 'Upcoming' | 'In Progress'
  notes?: string
}

interface ChatMessage {
  id: string
  sender: 'patient' | 'doctor'
  text: string
  timestamp: string
}

const TelemedicinePlatform: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [isVideoActive, setIsVideoActive] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [audioMuted, setAudioMuted] = useState(false)
  const [videoMuted, setVideoMuted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

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
      name: 'Dr. Prakhar',
      specialty: 'Neurology',
      rating: 4.6,
      availability: 'Tomorrow, 10 AM-1 PM',
      imageUrl: '/images/Team/prakhar.png',
      consultationFee: 200,
      languages: ['English', 'Hindi']
    }
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
    {
      id: '2',
      date: 'Feb 5, 2024',
      doctor: 'Dr. Prakhar',
      type: 'Chat',
      status: 'Upcoming',
      notes: 'Neurological consultation'
    }
  ])

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleVideoConsultation = () => {
    setIsVideoActive(!isVideoActive)
    if (!isVideoActive) {
      // Update consultation history
      const newConsultation: Consultation = {
        id: (consultationHistory.length + 1).toString(),
        date: new Date().toLocaleDateString(),
        doctor: selectedDoctor?.name || '',
        type: 'Video',
        status: 'In Progress'
      }
      setConsultationHistory(prev => [...prev, newConsultation])
    }
  }
  const startVideoConsultation = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: !videoMuted, 
        audio: !audioMuted 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      toggleVideoConsultation();
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to start video consultation. Please check camera permissions.');
    }
  }


  const endVideoConsultation = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream?.getTracks();
      
      tracks?.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsVideoActive(false);
  }
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

    {/* Sidebar */}
    <div className={`
      w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-r dark:border-gray-700 p-6 
      ${isMobileMenuOpen ? 'block' : 'hidden'} md:block
      fixed md:static inset-y-0 left-0 z-50 md:z-0
      w-full md:w-64 overflow-y-auto
    `}>
      <h2 className="text-2xl font-bold mb-6 text-orange-800 dark:text-orange-400 hidden md:block">Telemedicine</h2>
      
      <nav className="space-y-4">
        {[
          { icon: FileText, label: 'Prescriptions' },
          { icon: UserCheck, label: 'Medical Reports' },
          { icon: Calendar, label: 'Appointments' }
        ].map(({ icon: Icon, label }) => (
          <div 
            key={label} 
            className="flex items-center p-3 hover:bg-orange-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Icon className="mr-3 text-orange-600 dark:text-orange-400" />
            <span>{label}</span>
          </div>
        ))}
      </nav>
    </div>

    {/* Main Content */}
    <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
      {/* Doctor Search */}
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
        {/* Available Doctors */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-orange-800 dark:text-orange-400">Available Doctors</h3>
          <div className="space-y-4">
            {filteredDoctors.map(doctor => (
              <div 
                key={doctor.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md flex items-center hover:shadow-lg transition"
                onClick={() => {
                  setSelectedDoctor(doctor)
                  setIsMobileMenuOpen(false)
                }}
              >
                <Image
                  src={doctor.imageUrl} 
                  alt={doctor.name} 
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold dark:text-white">{doctor.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{doctor.specialty}</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span>{doctor.rating}</span>
                    <Clock className="w-4 h-4 ml-3 mr-1 text-green-500" />
                    <span className="text-sm">{doctor.availability}</span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Fee: ${doctor.consultationFee} | Languages: {doctor.languages.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                  <div className="relative bg-black rounded-lg h-48 md:h-64 flex items-center justify-center">
                    <video 
                      ref={videoRef} 
                      className="w-full h-full object-cover rounded-lg" 
                      muted={audioMuted}
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