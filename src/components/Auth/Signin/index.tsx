"use client";
import React from "react";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  return (
    <div className="flex flex-col items-center justify-center   dark:bg-dark-2">
      <div className="w-full  p-6 bg-white rounded-lg  dark:bg-dark-3">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-dark dark:text-white">
            Welcome Back!
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to access your Dashboard
          </p>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center justify-center">
          <span className="block h-px w-full bg-gray-300 dark:bg-gray-600"></span>
          <div className="px-4 text-sm font-medium text-gray-500 bg-white dark:bg-dark-3">
            Sign in to Dashboard
          </div>
          <span className="block h-px w-full bg-gray-300 dark:bg-gray-600"></span>
        </div>

        {/* Sign-in Form */}
        <div>
          <SigninWithPassword />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} MediGO AI Dashboard. All rights reserved.
        
      </div>
    </div>
  );
}
