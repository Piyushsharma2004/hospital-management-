import { XRayMachine } from "./types"
import { Patient } from "./types"
export const mockPatients: Patient[] = [
    {
      id: "P001",
      name: "John Doe",
      age: 45,
      xrays: [
        {
          id: "X001",
          date: "2024-02-01",
          imageUrl: "/disese-img/chest-xray.jpeg",
          machineId: "M001",
          type: "Chest X-Ray"
        },
        {
          id: "X002",
          date: "2024-02-03",
          imageUrl: "/disese-img/brain-xray.jpg",
          machineId: "M002",
          type: "Brain X-Ray"
        }
      ]
    }
  ]
  
  export const mockMachines: XRayMachine[] = [
    {
      id: "M001",
      name: "X-Ray Machine A",
      location: "Room 101",
      status: "available"
    },
    {
      id: "M002",
      name: "X-Ray Machine B",
      location: "Room 102",
      status: "in-use"
    }
  ]