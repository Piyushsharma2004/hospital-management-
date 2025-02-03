import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import MentalHealthChecker from "@/components/mental-health/MentalHealthChecker";
import MentalHealthLandingPage from "@/components/mental-health/mentalhealthloading";

const MentalHealthPage= () => {
  return (
    <DefaultLayout>
      <div >
     
      <MentalHealthLandingPage />
    </div>
    </DefaultLayout>
  );
};

export default MentalHealthPage;
