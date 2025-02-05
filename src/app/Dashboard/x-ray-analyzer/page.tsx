import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import MainXrayComponent from "@/components/xRayreport/mainXraycomponet";
import AutoHighlightXray from "@/components/x-ray-hightlight/AutoHighlightXray";


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
