import { Metadata } from "next";
import React from "react";
import HeroPage from "@/components/Home/HeroPage";

export const metadata: Metadata = {
  title:
    "Medigo Ai",
  description: "",
};

export default function Home() {
  return (
    <>
    
    <HeroPage />
      
    </>
  );
}
