'use client'
import React, { useState } from 'react'
import { Stethoscope, User, Scan } from 'lucide-react'
import AutoHighlightXray from '../x-ray-hightlight/AutoHighlightXray'
import AIXRayReports1 from './AIXRayReports1'
import DiseaseDetailPage from './all-disease-tab'

const MainXrayComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor' | 'xray'>('patient')

  return (
    <div className="container  ">
      <div className="flex mb-4 space-x-2">
        <button
          onClick={() => setActiveTab('patient')}
          className={`
            flex items-center px-3 py-1 rounded transition-all
            ${activeTab === 'patient'
              ? 'bg-orange-600 text-white'
              : 'text-black bg-orange-200 hover:bg-orange-300'
            }
          `}
        >
          <User className="mr-2" size={20} />
          Patient
        </button>
        
        <button
          onClick={() => setActiveTab('doctor')}
          className={`
            flex items-center px-3 py-1 rounded transition-all
            ${activeTab === 'doctor'
              ? 'bg-orange-600 text-white'
              : 'text-black bg-orange-200 hover:bg-orange-300'
            }
          `}
        >
          <Stethoscope className="mr-2" size={20} />
          Doctor (Work-in-Progress)
        </button>
        
        <button
          onClick={() => setActiveTab('xray')}
          className={`
            flex items-center px-3 py-1 rounded transition-all
            ${activeTab === 'xray'
              ? 'bg-orange-600 text-white'
              : 'text-black bg-orange-200 hover:bg-orange-300'
            }
          `}
        >
          <Scan className="mr-2" size={20} />
          X-Ray Disease DB
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'patient' && <AIXRayReports1 />}
        {activeTab === 'doctor' && <AutoHighlightXray />}
        {activeTab === 'xray' && <DiseaseDetailPage />}
      </div>
    </div>
  )
}

export default MainXrayComponent