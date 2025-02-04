import React, { useState } from 'react';
import XRayMachineCard from './xraymachinecard';
import { Search, Filter, Plus, Activity, ChevronDown, LayoutGrid, LayoutList } from 'lucide-react';

interface Machine {
  id: number;
  status: 'available' | 'in-use' | 'maintenance' | 'offline';
  location: string;
  currentPatient?: string | null;
  lastMaintenance?: string;
  usageCount?: number;
  nextMaintenance?: string;
}

interface DashboardProps {
  machines: Machine[];
  onUpdateMachine: (machineId: number, status: Machine['status']) => void;
  onAddMachine: () => void;
}

interface StatCardProps {
  label: string;
  value: number;
  trend?: number;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, color = 'orange' }) => (
  <div className={`
    p-6 rounded-xl bg-gradient-to-br
    ${color === 'orange' && 'from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/20'}
    ${color === 'green' && 'from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20'}
    ${color === 'yellow' && 'from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/20'}
    ${color === 'red' && 'from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/20'}
    backdrop-blur-sm hover:shadow-lg transition-all duration-300
    dark:shadow-orange-900/10 dark:text-white
  `}>
    <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{label}</div>
    <div className="text-3xl font-bold mb-1 dark:text-white">{value}</div>
    {trend !== undefined && (
      <div className={`text-sm ${trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {trend >= 0 ? '+' : ''}{trend}% from last week
      </div>
    )}
  </div>
);

const XRayMachineDashboard: React.FC<DashboardProps> = ({ 
  machines, 
  onUpdateMachine,
  onAddMachine 
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | Machine['status']>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const locations = Array.from(new Set(machines.map(machine => machine.location)));

  const filteredMachines = machines.filter(machine => {
    const matchesStatus = statusFilter === 'all' || machine.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || machine.location === locationFilter;
    const matchesSearch = machine.id.toString().includes(searchQuery) ||
      machine.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesLocation && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            X-Ray Machine Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Monitor and manage your equipment in real-time</p>
        </div>
        <button 
          onClick={onAddMachine}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 
            text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300
            shadow-md hover:shadow-xl dark:shadow-orange-900/20"
        >
          <Plus className="w-5 h-5" />
          Add Machine
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Total Machines" 
          value={machines.length} 
          trend={2.5} 
          color="orange"
        />
        <StatCard 
          label="Available" 
          value={machines.filter(m => m.status === 'available').length} 
          trend={1.2}
          color="green"
        />
        <StatCard 
          label="In Use" 
          value={machines.filter(m => m.status === 'in-use').length} 
          trend={-0.8}
          color="yellow"
        />
        <StatCard 
          label="Under Maintenance" 
          value={machines.filter(m => m.status === 'maintenance').length} 
          trend={0.5}
          color="red"
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search machines..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl 
                focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50/50 dark:bg-gray-700/50
                dark:text-white dark:placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
          </div>

          <div className="flex gap-4">
            <select
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl 
                focus:ring-2 focus:ring-orange-500 bg-gray-50/50 dark:bg-gray-700/50
                dark:text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Machine['status'] | 'all')}
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="in-use">In Use</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
            </select>

            <select
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl 
                focus:ring-2 focus:ring-orange-500 bg-gray-50/50 dark:bg-gray-700/50
                dark:text-white"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="all">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'text-gray-400 dark:text-gray-500'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'text-gray-400 dark:text-gray-500'}`}
            >
              <LayoutList className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Machines Grid/List */}
      <div className={`
        ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
      `}>
        {filteredMachines.map(machine => (
          <XRayMachineCard
            key={machine.id}
            machine={machine}
            onSelect={(machine) => onUpdateMachine(machine.id, machine.status)}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
};

export default XRayMachineDashboard;