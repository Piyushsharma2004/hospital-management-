// HeroSection.tsx
import { FC } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Features } from "./Features";

export const HeroSection: FC = () => {
  return (
    <main className="flex flex-col items-center text-center mt-8 md:mt-16 relative z-10 w-full">
      <h1 className="text-4xl md:text-6xl font-extrabold max-w-3xl text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
        Transforming Healthcare with AI
      </h1>
      <p className="mt-4 md:mt-6 max-w-2xl text-base md:text-lg text-gray-700 px-4">
        Advanced AI-powered health solutions that provide personalized insights, remote consultations, and proactive health management.
      </p>
      <Link href="/Dashboard">  
        <button className="mt-6 px-6 py-3 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-all transform hover:-translate-y-1 flex items-center">
          Go To Dashboard <ArrowRight className="ml-2" />
        </button>
      </Link>

      <Features />
    </main>
  );
};