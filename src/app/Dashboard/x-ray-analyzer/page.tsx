import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import MainXrayComponent from "@/components/xRayreport/mainXraycomponet";


const ReportPage= () => {
  return (
    <DefaultLayout>
      <div className=" ">
        
      
     <MainXrayComponent />
   
  
      </div>
    </DefaultLayout>
  );
};

export default ReportPage;
