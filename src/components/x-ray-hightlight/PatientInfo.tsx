import React from 'react'
import { Patient,XRayMachine} from './types'

interface PatientInfoProps {
  patient: Patient
  machine: XRayMachine | null
}

export const PatientInfo: React.FC<PatientInfoProps> = ({ patient, machine }) => {
  return (
    <div className="mb-8 p-4 bg-orange-100 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Patient Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p><strong>ID:</strong> {patient.id}</p>
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Age:</strong> {patient.age}</p>
        </div>
        {machine && (
          <div>
            <h3 className="font-semibold mb-1">Machine Details</h3>
            <p><strong>Machine:</strong> {machine.name}</p>
            <p><strong>Location:</strong> {machine.location}</p>
            <p><strong>Status:</strong> {machine.status}</p>
          </div>
        )}
      </div>
    </div>
  )
}