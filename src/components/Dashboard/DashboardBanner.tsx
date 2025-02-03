import React from 'react';
import Image from 'next/image';
import { FaStethoscope, FaRobot } from 'react-icons/fa';
import Link from 'next/link';

const DashboardBanner = ({ userName = "Piyush" }) => {
  return (
    <div className="relative w-full mb-4 p-5 h-auto md:h-[250px] bg-gradient-to-r from-orange-100 dark:from-gray-800 to-orange-200 dark:to-gray-900 flex flex-col md:flex-row items-center overflow-hidden rounded-xl">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between relative z-10">
        {/* Left Content */}
        <div className="order-2 md:order-1 md:w-1/2 w-full text-center md:text-left space-y-4">
          <div className="flex items-center justify-center md:justify-start space-x-4">
            <FaStethoscope className="text-orange-600 dark:text-orange-400 text-3xl md:text-4xl" />
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Welcome, {userName}
            </h1>
          </div>
          <p className="text-sm md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Your personalized health platform, combining advanced medical insights
            with cutting-edge AI technology to support your wellness journey.
          </p>
          <div className="flex justify-center md:justify-start space-x-4">
            <Link
              href="/Dashboard/Chatbot"
              className="flex items-center bg-orange-500 dark:bg-orange-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors shadow-md"
            >
              <FaRobot className="mr-2" />
              AI Medical Assistant
            </Link>
          </div>
        </div>

        {/* Right Content - Medical Illustration */}
        <div className="order-1 md:order-2 md:mt-0 md:w-1/2 w-full hidden md:flex justify-center md:justify-end">
          <Image
            src="/images/todo/doctor.png"
            alt="Medical Professionals"
            width={400}
            height={500}
            className="rounded-xl object-cover"
          />
        </div>
      </div>

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-orange-500 dark:bg-gray-700 opacity-10 z-0"></div>
    </div>
  );
};

export default DashboardBanner;