'use client'
import React, { useState, useEffect, useRef } from 'react'
import { 
  Bluetooth, 
  Stethoscope, 
  Thermometer, 
  Pause, 
  BarChart, 
  Link2, 
  Database, 
  Cpu, 
  Server,
  ChevronDown,
  Search,
  Filter,
  ArrowUpRight,
  Upload,
  Play,
  Square
} from 'lucide-react'

interface MedicalDevice {
  id: string
  name: string
  type: string
  status: 'Connected' | 'Disconnected'
  lastSync: string
  dataPoints?: number
  batteryLevel?: number
  healthMetrics?: {
    heartRate?: number
    bloodPressure?: string
    temperature?: number
  }
}

interface AudioData {
  timestamp: number
  amplitude: number
}

const MedTechDevicesPlatform: React.FC = () => {
  const [devices, setDevices] = useState<MedicalDevice[]>([
    {
      id: '1',
      name: 'Digital Stethoscope Pro',
      type: 'Diagnostic',
      status: 'Connected',
      lastSync: '2 mins ago',
      dataPoints: 324,
      batteryLevel: 85,
      healthMetrics: {
        heartRate: 72,
        bloodPressure: '120/80',
        temperature: 36.7
      }
    },
    {
      id: '2',
      name: 'Smart Blood Pressure Monitor',
      type: 'Cardiovascular',
      status: 'Disconnected',
      lastSync: '3 hours ago',
      dataPoints: 532,
      batteryLevel: 45,
      healthMetrics: {
        bloodPressure: '135/85'
      }
    },
    {
      id: '3',
      name: 'Portable ECG Tracker',
      type: 'Cardiac',
      status: 'Connected',
      lastSync: '10 mins ago',
      dataPoints: 876,
      batteryLevel: 72,
      healthMetrics: {
        heartRate: 68
      }
    }
  ])

  const [selectedDevice, setSelectedDevice] = useState<MedicalDevice | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [filterType, setFilterType] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAudioAnalysis, setShowAudioAnalysis] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioData, setAudioData] = useState<AudioData[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const filteredDevices = devices.filter(device => 
    (filterType ? device.type === filterType : true) &&
    device.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAudioFile(file)
      // Generate mock audio data for visualization
      const mockData: AudioData[] = Array.from({ length: 100 }, (_, i) => ({
        timestamp: i,
        amplitude: Math.random() * 50 + 25
      }))
      setAudioData(mockData)
    }
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const renderAudioAnalysis = () => {
    if (!showAudioAnalysis) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-99">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-400">
              Stethoscope Audio Analysis
            </h3>
            <button 
              onClick={() => setShowAudioAnalysis(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Close
            </button>
          </div>

          {!audioFile ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <Upload className="mx-auto w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
              <label className="cursor-pointer">
                <span className="bg-orange-600 dark:bg-orange-700 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                  Upload Audio File
                </span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlayPause}
                  className="bg-orange-600 dark:bg-orange-700 text-white p-2 rounded-lg"
                >
                  {isPlaying ? <Square size={20} /> : <Play size={20} />}
                </button>
                <span className="text-gray-600 dark:text-gray-400">{audioFile.name}</span>
              </div>

              <audio ref={audioRef} src={URL.createObjectURL(audioFile)} className="hidden" />

              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
                <div className="h-48 flex items-center">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path
                      d={`M ${audioData.map((point, i) => 
                        `${i} ${50 - point.amplitude / 2} L ${i} ${50 + point.amplitude / 2}`
                      ).join(' M ')}`}
                      stroke="rgb(234 88 12)"
                      strokeWidth="0.5"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-400 mb-2">
                    Heart Rate
                  </h4>
                  <p className="text-2xl font-bold">{selectedDevice?.healthMetrics?.heartRate || '--'} BPM</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-400 mb-2">
                    Recording Quality
                  </h4>
                  <p className="text-2xl font-bold">98%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderHealthMetrics = (device: MedicalDevice) => {
    const metrics = device.healthMetrics || {};
    return (
      <div className="text-black flex flex-col md:flex-row justify-between gap-4 dark:text-white bg-white dark:bg-gray-800 p-4 rounded-lg">
        <div className="space-y-2">
          {metrics.heartRate !== undefined && (
            <div className="text-gray-800 dark:text-gray-200">
              Heart Rate: {metrics.heartRate} bpm
            </div>
          )}
          {metrics.bloodPressure && (
            <div className="text-gray-800 dark:text-gray-200">
              Blood Pressure: {metrics.bloodPressure}
              <p className="text-xs text-gray-800 dark:text-gray-200">(Last data)</p>
            </div>
          )}
        </div>
        <div className="flex gap-2">   
          {device.type === 'Diagnostic' && (
            <button 
              onClick={() => setShowAudioAnalysis(true)}
              className="bg-orange-600 px-4 dark:bg-orange-700 h-10 text-white rounded-lg flex items-center justify-center hover:bg-orange-700"
            >
              <BarChart className="mr-2" /> Analyze Recording
            </button>
          )}
        </div>
      </div>
    );
  };

  const NavigationItems = () => (
    <>
      {[
        { icon: Stethoscope, label: 'Diagnostic', type: 'Diagnostic' },
        { icon: Pause, label: 'Monitoring', type: 'Cardiovascular' },
        { icon: Thermometer, label: 'Measurement', type: 'Cardiac' }
      ].map(({ icon: Icon, label, type }) => (
        <div 
          key={label} 
          className={`
            flex items-center p-3 rounded-lg cursor-pointer 
            ${filterType === type 
              ? 'bg-orange-200 dark:bg-orange-900/50 text-orange-900 dark:text-orange-300' 
              : 'hover:bg-orange-100 dark:hover:bg-gray-700'
            }
            md:px-6
          `}
          onClick={() => {
            setFilterType(filterType === type ? null : type)
            setIsMobileMenuOpen(false)
          }}
        >
          <Icon className="mr-3 text-orange-600 dark:text-orange-400" />
          <span>{label} Devices</span>
        </div>
      ))}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
   
   <div className="hidden rounded-lg md:flex w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b dark:border-gray-700">
        <div className="flex-1 flex items-center justify-between max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-8">
            <h2 className="text-2xl font-bold text-orange-800 dark:text-orange-400">
              MedTech Devices
            </h2>
            <nav className="flex space-x-2">
              <NavigationItems />
            </nav>
          </div>


           <div className="flex items-center space-x-4 ml-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search devices" 
                className="w-64 p-2 pl-10 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 dark:text-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" />
            </div>
            <button 
              className="bg-orange-600 h-12 dark:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center"
              onClick={() => setFilterType(filterType ? null : 'Diagnostic')}
            >
              <Filter className="mr-2" /> 
              {filterType ? 'Clear Filter' : 'Filter'}
            </button>
          </div>
        </div>
      </div>
        {/* Mobile Header */}
        <div className="md:hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b dark:border-gray-700 p-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-orange-800 dark:text-orange-400">MedTech</h2>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-orange-600 dark:text-orange-400"
        >
          {isMobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>
         {/* Mobile Sidebar */}
         <div className={`
        md:hidden
        fixed inset-y-0 left-0 z-50
        w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <nav className="space-y-4">
            <NavigationItems />
          </nav>
        </div>
      </div>
    

    {/* Main Content */}
    <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
    <div className="md:hidden mb-6 flex flex-col gap-4">
          <div className="relative flex-grow">
            <input 
              type="text" 
              placeholder="Search devices" 
              className="w-full p-3 pl-10 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 dark:text-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
          </div>
          <button 
            className="bg-orange-600 dark:bg-orange-700 text-white p-3 rounded-lg flex items-center justify-center"
            onClick={() => setFilterType(filterType ? null : 'Diagnostic')}
          >
            <Filter className="mr-2" /> 
            {filterType ? 'Clear Filter' : 'Filter Devices'}
          </button>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Connected Devices List */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-orange-800 dark:text-orange-400">
            {filterType ? `${filterType} Devices` : 'All Connected Devices'}
          </h3>
          {filteredDevices.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md">
              <p className="dark:text-gray-300">No devices found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDevices.map(device => (
                <div 
                  key={device.id}
                  className={`
                    bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md 
                    flex flex-col cursor-pointer
                    ${selectedDevice?.id === device.id 
                      ? 'ring-2 ring-orange-500' 
                      : 'hover:shadow-lg'
                    }
                  `}
                  onClick={() => setSelectedDevice(device)}
                >
                  <div className="flex items-center">
                    <div className="mr-4">
                      <Bluetooth 
                        className={`
                          w-10 h-10 
                          ${device.status === 'Connected' 
                            ? 'text-green-500' 
                            : 'text-gray-400 dark:text-gray-600'
                          }
                        `} 
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold dark:text-white">{device.name}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{device.type} Device</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Last Sync: {device.lastSync}
                      </p>
                    </div>
                  </div>
                  {renderHealthMetrics(device)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Device Details & Connection */}
        <div>
          {selectedDevice ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-400">
                  {selectedDevice.name} Details
                </h3>
                <div 
                  className={`
                    px-3 py-1 rounded-full text-sm 
                    ${selectedDevice.status === 'Connected' 
                      ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' 
                      : 'bg-orange-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                    }
                  `}
                >
                  {selectedDevice.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { 
                    icon: Cpu, 
                    bg: 'bg-orange-50 dark:bg-orange-900/20', 
                    iconColor: 'text-orange-600 dark:text-orange-400',
                    label: 'Device Type',
                    value: selectedDevice.type 
                  },
                  { 
                    icon: Database, 
                    bg: 'bg-green-50 dark:bg-green-900/20', 
                    iconColor: 'text-green-600 dark:text-green-400',
                    label: 'Sound Data Recorded',
                    value: selectedDevice.dataPoints 
                  },
                  { 
                    icon: BarChart, 
                    bg: 'bg-purple-50 dark:bg-purple-900/20', 
                    iconColor: 'text-purple-600 dark:text-purple-400',
                    label: 'Battery Level',
                    value: `${selectedDevice.batteryLevel}%` 
                  },
                  { 
                    icon: Link2, 
                    bg: 'bg-amber-50 dark:bg-amber-900/20', 
                    iconColor: 'text-amber-600 dark:text-amber-400',
                    label: 'Connection',
                    value: selectedDevice.status 
                  }
                ].map(({ icon: Icon, bg, iconColor, label, value }) => (
                  <div key={label} className={`${bg} p-4 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${iconColor} mb-2`} />
                    <p className="text-gray-600 dark:text-gray-400">{label}</p>
                    <p className="font-bold dark:text-white">{value}</p>
                  </div>
                ))}
              </div>

              {renderHealthMetrics(selectedDevice)}

              <div className="mt-6 flex space-x-4">
                <button 
                  className="flex-1 bg-orange-600 dark:bg-orange-700 text-white py-2 rounded-lg flex items-center justify-center"
                >
                  <ArrowUpRight className="mr-2" /> Sync Device
                </button>
                <button 
                  className="flex-1 border border-orange-600 dark:border-orange-400 text-orange-600 dark:text-orange-400 py-2 rounded-lg"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
              <Stethoscope className="mx-auto w-16 h-16 text-orange-500 dark:text-orange-400 mb-4" />
              <p className="dark:text-gray-300">Select a device to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
    {renderAudioAnalysis()}
  </div>
  )
}

export default MedTechDevicesPlatform