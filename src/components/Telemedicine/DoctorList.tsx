// components/DoctorList.tsx
'use client'
import React from 'react'
import Image from 'next/image'
import { Star, Clock } from 'lucide-react'
import { Doctor } from './types'

interface DoctorListProps {
  doctors: Doctor[]
  searchTerm: string
  onSelectDoctor: (doctor: Doctor) => void
  setIsMobileMenuOpen: (value: boolean) => void
}

const DoctorList: React.FC<DoctorListProps> = ({ 
  doctors, 
  searchTerm, 
  onSelectDoctor,
  setIsMobileMenuOpen 
}) => {
  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {filteredDoctors.map(doctor => (
        <div 
          key={doctor.id}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md flex items-center hover:shadow-lg transition"
          onClick={() => {
            onSelectDoctor(doctor)
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
              Fee: ₹{doctor.consultationFee} | Languages: {doctor.languages.join(', ')}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DoctorList