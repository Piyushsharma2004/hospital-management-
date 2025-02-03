// types.ts
export interface Doctor {
    id: string
    name: string
    specialty: string
    rating: number
    availability: string
    imageUrl: string
    consultationFee: number
    languages: string[]
  }
  
  export interface Consultation {
    id: string
    date: string
    doctor: string
    type: 'Video' | 'Chat'
    status: 'Completed' | 'Upcoming' | 'In Progress'
    notes?: string
  }
  
  export interface ChatMessage {
    id: string
    sender: 'patient' | 'doctor'
    text: string
    timestamp: string
  }