// components/Sidebar.tsx
'use client'
import React from 'react'
import { FileText, UserCheck, Calendar } from 'lucide-react'

interface SidebarProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (value: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  return (
    <div className={`
      w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-r dark:border-gray-700 p-6 
      ${isMobileMenuOpen ? 'block' : 'hidden'} md:block
      fixed md:static inset-y-0 left-0 z-50 md:z-0
      w-full md:w-64 overflow-y-auto
    `}>
      <h2 className="text-2xl font-bold mb-6 text-orange-800 dark:text-orange-400 hidden md:block">Telemedicine</h2>
      
      <nav className="space-y-4">
        {[
          { icon: FileText, label: 'Prescriptions' },
          { icon: UserCheck, label: 'Medical Reports' },
          { icon: Calendar, label: 'Appointments' }
        ].map(({ icon: Icon, label }) => (
          <div 
            key={label} 
            className="flex items-center p-3 hover:bg-orange-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Icon className="mr-3 text-orange-600 dark:text-orange-400" />
            <span>{label}</span>
          </div>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar