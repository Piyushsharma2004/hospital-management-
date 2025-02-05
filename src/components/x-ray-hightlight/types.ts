export interface Highlight {
    x: number
    y: number
    radius: number
    category: string
    confidence: number
    severity: 'Low' | 'Moderate' | 'High'
  }
  
  export interface Patient {
    id: string
    name: string
    age: number
    xrays: {
      id: string
      date: string
      imageUrl: string
      machineId: string
      type: string
    }[]
  }
  
  export interface XRayMachine {
    id: string
    name: string
    location: string
    status: 'available' | 'in-use' | 'maintenance'
  }
  