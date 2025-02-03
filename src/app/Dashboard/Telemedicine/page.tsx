import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import TelemedicinePlatform from "@/components/Telemedicine/TelemedicinePlatform1";


const TelemedicinePage= () => {
  return (
    <DefaultLayout>
      <div className="mb-5">
        
     < TelemedicinePlatform />
      </div>
      

    </DefaultLayout>
  );
};

export default TelemedicinePage;
