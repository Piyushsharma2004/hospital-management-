import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import MedicalChatbot from "@/components/Chatbot/mainchatbot";
import MedicalChatbot2 from "@/components/Chatbot/chatsend";


const MedicalChatbotPage= () => {
  return (
    <DefaultLayout>
      <div className=" ">
      {/* <MedicalChatbot /> */}
      <MedicalChatbot2 />
      </div>
    </DefaultLayout>
  );
};

export default MedicalChatbotPage;
