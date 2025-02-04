'use client'
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import XRayMachineDashboard from './xraymachinedashboard';
import XRayMachineCard from './xraymachinecard';

interface Machine {
  id: number;
  status: 'available' | 'in-use' | 'maintenance' | 'offline';
  location: string;
  currentPatient?: string | null;
  lastMaintenance: string;
  usageCount?: number;
  nextMaintenance?: string;
  maintenanceHistory?: {
    date: string;
    type: string;
    technician: string;
  }[];
}

interface MaintenanceRecord {
  date: string;
  type: string;
  technician: string;
}

const generateMaintenanceSchedule = (lastMaintenance: string): string => {
  const lastDate = new Date(lastMaintenance);
  const nextDate = new Date(lastDate);
  nextDate.setMonth(nextDate.getMonth() + 3); // Schedule maintenance every 3 months
  return nextDate.toISOString().split('T')[0];
};

const initialMachines: Machine[] = [
  {
    id: 1,
    status: 'available',
    location: 'Radiology Wing A',
    currentPatient: null,
    lastMaintenance: '2025-01-30',
    usageCount: 145,
    nextMaintenance: '2025-04-30',
    maintenanceHistory: [
      { date: '2025-01-30', type: 'Regular', technician: 'John Doe' },
      { date: '2024-10-15', type: 'Emergency', technician: 'Jane Smith' }
    ]
  },
  {
    id: 2,
    status: 'in-use',
    location: 'Emergency Department',
    currentPatient: 'P1234',
    lastMaintenance: '2025-01-28',
    usageCount: 278,
    nextMaintenance: '2025-04-28',
    maintenanceHistory: [
      { date: '2025-01-28', type: 'Regular', technician: 'Jane Smith' }
    ]
  },
  {
    id: 3,
    status: 'maintenance',
    location: 'Radiology Wing B',
    currentPatient: null,
    lastMaintenance: '2025-02-04',
    usageCount: 89,
    nextMaintenance: '2025-05-04',
    maintenanceHistory: [
      { date: '2025-02-04', type: 'Regular', technician: 'Mike Johnson' }
    ]
  },
  {
    id: 4,
    status: 'offline',
    location: 'Imaging Center',
    currentPatient: null,
    lastMaintenance: '2025-01-15',
    usageCount: 56,
    nextMaintenance: '2025-04-15',
    maintenanceHistory: [
      { date: '2025-01-15', type: 'Emergency', technician: 'John Doe' }
    ]
  },
  {
    id: 5,
    status: 'in-use',
    location: 'Emergency Department',
    currentPatient: 'P1234',
    lastMaintenance: '2025-01-28',
    usageCount: 278,
    nextMaintenance: '2025-04-28',
    maintenanceHistory: [
      { date: '2025-01-28', type: 'Regular', technician: 'Jane Smith' }
    ]
  },
  {
    id: 6,
    status: 'in-use',
    location: 'Emergency Department',
    currentPatient: 'P1234',
    lastMaintenance: '2025-01-28',
    usageCount: 278,
    nextMaintenance: '2025-04-28',
    maintenanceHistory: [
      { date: '2025-01-28', type: 'Regular', technician: 'Jane Smith' }
    ]
  },
  {
    id: 7,
    status: 'in-use',
    location: 'Emergency Department',
    currentPatient: 'P1234',
    lastMaintenance: '2025-01-28',
    usageCount: 278,
    nextMaintenance: '2025-04-28',
    maintenanceHistory: [
      { date: '2025-01-28', type: 'Regular', technician: 'Jane Smith' }
    ]
  },
  {
    id: 8,
    status: 'in-use',
    location: 'Emergency Department',
    currentPatient: 'P1234',
    lastMaintenance: '2025-01-28',
    usageCount: 278,
    nextMaintenance: '2025-04-28',
    maintenanceHistory: [
      { date: '2025-01-28', type: 'Regular', technician: 'Jane Smith' }
    ]
  },
  {
    id: 9,
    status: 'in-use',
    location: 'Emergency Department',
    currentPatient: 'P1234',
    lastMaintenance: '2025-01-28',
    usageCount: 278,
    nextMaintenance: '2025-04-28',
    maintenanceHistory: [
      { date: '2025-01-28', type: 'Regular', technician: 'Jane Smith' }
    ]
  },
  {
    id: 10,
    status: 'in-use',
    location: 'Emergency Department',
    currentPatient: 'P1234',
    lastMaintenance: '2025-01-28',
    usageCount: 278,
    nextMaintenance: '2025-04-28',
    maintenanceHistory: [
      { date: '2025-01-28', type: 'Regular', technician: 'Jane Smith' }
    ]
  },
  {
    id: 11,
    status: 'in-use',
    location: 'Emergency Department',
    currentPatient: 'P1234',
    lastMaintenance: '2025-01-28',
    usageCount: 278,
    nextMaintenance: '2025-04-28',
    maintenanceHistory: [
      { date: '2025-01-28', type: 'Regular', technician: 'Jane Smith' }
    ]
  },
  {
    id: 12,
    status: 'in-use',
    location: 'Emergency Department',
    currentPatient: 'P1234',
    lastMaintenance: '2025-01-28',
    usageCount: 278,
    nextMaintenance: '2025-04-28',
    maintenanceHistory: [
      { date: '2025-01-28', type: 'Regular', technician: 'Jane Smith' }
    ]
  }
];

const MainXrayMachine: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>(initialMachines);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading initial data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const updateMachineStatus = (machineId: number, newStatus: Machine['status']): void => {
    try {
      setMachines(machines.map(machine => {
        if (machine.id === machineId) {
          // Update usage count if the machine is being put into use
          const usageCount = newStatus === 'in-use' ? 
            (machine.usageCount || 0) + 1 : 
            machine.usageCount;

          return { 
            ...machine, 
            status: newStatus,
            usageCount,
            currentPatient: newStatus === 'in-use' ? 'P' + Math.random().toString(36).substr(2, 4) : null
          };
        }
        return machine;
      }));

      toast.success(`Machine #${machineId} status updated to ${newStatus}`);
    } catch (err) {
      setError('Failed to update machine status');
      toast.error('Failed to update machine status');
    }
  };

  const addNewMachine = (locationName: string = 'New Location'): void => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const newMachine: Machine = {
        id: Math.max(...machines.map(m => m.id)) + 1,
        status: 'available',
        location: locationName,
        currentPatient: null,
        lastMaintenance: today,
        usageCount: 0,
        nextMaintenance: generateMaintenanceSchedule(today),
        maintenanceHistory: [
          { date: today, type: 'Installation', technician: 'Installation Team' }
        ]
      };

      setMachines([...machines, newMachine]);
      toast.success('New machine added successfully');
    } catch (err) {
      setError('Failed to add new machine');
      toast.error('Failed to add new machine');
    }
  };

  const addMaintenanceRecord = (machineId: number, record: MaintenanceRecord): void => {
    try {
      setMachines(machines.map(machine => {
        if (machine.id === machineId) {
          const updatedHistory = [...(machine.maintenanceHistory || []), record];
          return {
            ...machine,
            lastMaintenance: record.date,
            nextMaintenance: generateMaintenanceSchedule(record.date),
            maintenanceHistory: updatedHistory
          };
        }
        return machine;
      }));
      toast.success(`Maintenance record added for Machine #${machineId}`);
    } catch (err) {
      setError('Failed to add maintenance record');
      toast.error('Failed to add maintenance record');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading machines...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  ">
      <XRayMachineDashboard 
        machines={machines}
        onUpdateMachine={updateMachineStatus}
        onAddMachine={() => addNewMachine()}
      />
    </div>
  );
};

export default MainXrayMachine;