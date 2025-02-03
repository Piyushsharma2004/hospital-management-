'use client'
import React from 'react';
import DashboardBanner from './DashboardBanner';
import QuickLinksSection from './QuickLinksSection';
import DoItYourselfSection from './DoItYourselfSection';
import MedTechSection from './MedTechSection';

const HealthDashboard = () => {
  return (
    <div className="p-8  min-h-screen">
      <DashboardBanner />
      
      
      <div className="space-y-8">
        <QuickLinksSection />
        <MedTechSection />
        <DoItYourselfSection />
        
      </div>
    </div>
  );
};

export default HealthDashboard;