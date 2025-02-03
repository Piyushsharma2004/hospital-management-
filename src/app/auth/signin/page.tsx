import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Signin from "@/components/Auth/Signin";
import { Stethoscope, Activity, ShieldCheck } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "CORE MEDICINE Dashboard",
  description: "Comprehensive Medical Health Management Platform",
};

const SignIn: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50 p-4 relative overflow-hidden">
      {/* Background Blur Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-orange-100/20 to-amber-100/30 backdrop-blur-[100px] pointer-events-none"></div>
      
      <div className="flex w-full max-w-6xl overflow-hidden rounded-2xl shadow-2xl border border-white/20 bg-white/60 backdrop-blur-lg relative z-10">
        {/* Left Section (Sign-in Form) */}
        <div className="flex w-full flex-col p-6 sm:p-12 lg:w-1/2 xl:p-16">
          <Signin />
        </div>

        {/* Right Section (Illustration and Branding) */}
        <div className="hidden w-1/2 bg-gradient-to-br from-orange-600 to-amber-600 p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center">
             <Image
                        src="/images/logo/logo-white.png"
                        alt="MediGo Ai Logo"
                        width={200}
                        height={150} 
                      />
          </div>

          <div className="mt-8">
            <div className="flex items-center mb-4">
              <ShieldCheck className="mr-3 text-white" size={32} />
              <p className="text-xl font-medium text-white">
                Secure Medical Access
              </p>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-white">
              Welcome Back, Health Professional!
            </h1>
            <p className="max-w-sm text-white/80">
              Access your comprehensive medical dashboard with advanced health insights.
            </p>
          </div>

          <div className="mt-auto">
            <Activity 
              className="mx-auto text-white/50" 
              size={200} 
              strokeWidth={1} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;