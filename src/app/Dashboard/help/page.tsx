import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import HelpComponent from "@/components/Help/helptool";
import MedicalHelpCenter from "@/components/Help/helptool";


const helpPage= () => {
  return (
    <DefaultLayout>
      <div className=" ">
        
    <MedicalHelpCenter />
      </div>
    </DefaultLayout>
  );
};

export default helpPage;
