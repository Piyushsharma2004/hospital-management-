// HeroPage.tsx (Main Page Component)
'use client'
import { FC } from "react";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { Footer } from "./Footer";

const HeroPage: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 flex flex-col items-center  overflow-hidden relative">
      {/* Subtle background blurs for depth */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-100/30 via-orange-200/20 to-orange-100/30 backdrop-blur-[100px] pointer-events-none"></div>
      
      <Navbar />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default HeroPage;