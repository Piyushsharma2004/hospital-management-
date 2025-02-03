import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import BrowserCards from "@/components/testmodel/BrowserCards";


const adminPage= () => {
  return (
    <DefaultLayout>
      <div className=" ">
        
      <BrowserCards />
      </div>
    </DefaultLayout>
  );
};

export default adminPage;
