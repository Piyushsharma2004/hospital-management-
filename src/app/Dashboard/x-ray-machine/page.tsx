import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import MainXrayMachine from "../../../components/Xraymachines/mainXraymachine";


const helpPage= () => {
  return (
    <DefaultLayout>
      <div className=" ">
        
        <MainXrayMachine />
      </div>
    </DefaultLayout>
  );
};

export default helpPage;
