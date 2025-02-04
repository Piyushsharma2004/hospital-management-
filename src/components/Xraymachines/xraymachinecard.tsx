import React from 'react';
import { CheckCircle, Clock, AlertTriangle, PowerOff, User, MapPin, Calendar } from 'lucide-react';

interface Machine {
  id: number;
  status: 'available' | 'in-use' | 'maintenance' | 'offline';
  location: string;
  currentPatient?: string | null;
  lastMaintenance?: string;
  usageCount?: number;
  nextMaintenance?: string;
}

interface XRayMachineCardProps {
  machine: Machine;
  onSelect: (machine: Machine) => void;
  viewMode: 'grid' | 'list';
}

const getStatusStyles = (status: Machine['status']): string => {
  const baseStyles = 'backdrop-blur-sm backdrop-filter dark:backdrop-blur-lg';
  switch (status) {
    case 'available':
      return `${baseStyles} border-green-400/50 bg-green-50/80 shadow-green-100 
        dark:border-green-500/20 dark:bg-green-900/20 dark:shadow-green-900/10`;
    case 'in-use':
      return `${baseStyles} border-blue-400/50 bg-blue-50/80 shadow-blue-100
        dark:border-blue-500/20 dark:bg-blue-900/20 dark:shadow-blue-900/10`;
    case 'maintenance':
      return `${baseStyles} border-yellow-400/50 bg-yellow-50/80 shadow-yellow-100
        dark:border-yellow-500/20 dark:bg-yellow-900/20 dark:shadow-yellow-900/10`;
    case 'offline':
      return `${baseStyles} border-red-400/50 bg-red-50/80 shadow-red-100
        dark:border-red-500/20 dark:bg-red-900/20 dark:shadow-red-900/10`;
    default:
      return `${baseStyles} border-gray-300 bg-gray-50/80 dark:border-gray-700 dark:bg-gray-800/80`;
  }
};

const getStatusIcon = (status: Machine['status']) => {
  const baseClass = "w-6 h-6";
  switch (status) {
    case 'available':
      return <CheckCircle className={`${baseClass} text-green-500 dark:text-green-400`} />;
    case 'in-use':
      return <Clock className={`${baseClass} text-blue-500 dark:text-blue-400`} />;
    case 'maintenance':
      return <AlertTriangle className={`${baseClass} text-yellow-500 dark:text-yellow-400`} />;
    case 'offline':
      return <PowerOff className={`${baseClass} text-red-500 dark:text-red-400`} />;
    default:
      return null;
  }
};

const getStatusText = (status: Machine['status']): string => {
  switch (status) {
    case 'available':
      return 'Ready for Use';
    case 'in-use':
      return 'Currently Active';
    case 'maintenance':
      return 'Under Maintenance';
    case 'offline':
      return 'Temporarily Offline';
    default:
      return status;
  }
};

const XRayMachineCard: React.FC<XRayMachineCardProps> = ({ machine, onSelect }) => {
  return (
    <div 
      className={`
        p-6 rounded-xl border transition-all duration-300
        hover:shadow-lg hover:scale-102 cursor-pointer
        dark:hover:shadow-gray-900/30
        ${getStatusStyles(machine.status)}
      `}
      onClick={() => onSelect(machine)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {getStatusIcon(machine.status)}
            <h3 className="text-lg font-bold dark:text-white">X-Ray #{machine.id}</h3>
          </div>
          <span className={`
            text-sm font-medium px-3 py-1 rounded-full
            ${machine.status === 'available' && 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'}
            ${machine.status === 'in-use' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'}
            ${machine.status === 'maintenance' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400'}
            ${machine.status === 'offline' && 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'}
          `}>
            {getStatusText(machine.status)}
          </span>
        </div>
        
        {machine.usageCount && (
          <div className="text-right text-sm text-gray-600 dark:text-gray-400">
            <div className="font-semibold dark:text-gray-300">{machine.usageCount}</div>
            <div>Uses Today</div>
          </div>
        )}
      </div>
      
      <div className="space-y-3 text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{machine.location}</span>
        </div>
        
        {machine.currentPatient && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Patient: {machine.currentPatient}</span>
          </div>
        )}

        {machine.lastMaintenance && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Maintained: {machine.lastMaintenance}</span>
          </div>
        )}
        
        {machine.nextMaintenance && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Next Maintenance: </span>
              <span className="font-medium dark:text-gray-300">{machine.nextMaintenance}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default XRayMachineCard;