import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import HealthMetricsDashboard from "@/components/HealthMetrics/HealthMetrics";


const HealthInsightsPage= () => {
  return (
    <DefaultLayout>
      <div >
     <HealthMetricsDashboard />
   
    </div>
    </DefaultLayout>
  );
};

export default HealthInsightsPage;
