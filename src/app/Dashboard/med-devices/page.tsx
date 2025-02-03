import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import MedTechDevicesPlatform from "@/components/techDevices/MedTechDevicesPlatform";


const MedTechDevicesPage= () => {
  return (
    <DefaultLayout>
      <div className=" ">
        
      <MedTechDevicesPlatform />
      </div>
    </DefaultLayout>
  );
};

export default MedTechDevicesPage;
