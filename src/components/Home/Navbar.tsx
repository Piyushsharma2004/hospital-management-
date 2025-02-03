// Navbar.tsx
'use client'
import { FC, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export const Navbar: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  

  return (
    <>
      {/* Mobile Header */}
      <div className="px-4 md:hidden w-full flex justify-between items-center relative z-20">
        <Image
          src="/images/logo/logo.png"
          alt="MediGo Ai Logo"
          width={200}
          height={150} 
        />
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-orange-600"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 fixed inset-0 bg-white/95 z-50 pt-20 px-6">
          <nav className="space-y-6">
           
           <div className="space-y-4 mt-6">
              <button className="w-full px-6 py-3 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-all">
                Sign Up
              </button>
              <Link 
                href="/auth/signin" 
                className="w-full block px-6 py-3 bg-white border border-orange-500 text-orange-700 rounded-full shadow-lg hover:bg-orange-50 transition-all text-center"
              >
                Log In
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Desktop Header */}
      <header className="px-4 hidden md:flex w-full justify-between items-center relative z-10">
        <Image
          src="/images/logo/logo.png"
          alt="MediGo Ai Logo"
          width={200}
          height={150} 
        />
        <nav className="flex space-x-6">
         
        </nav>
        <div className="space-x-4">
          <Link href="/auth/signin/" className="px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-lg hover:bg-orange-50 transition-all">
            Sign Up
          </Link>
          <Link href="/auth/signin/" className="px-4 py-2 bg-orange-500/10 backdrop-blur-sm text-orange-700 rounded-full shadow-lg hover:bg-orange-500/20 transition-all">
            Log In
          </Link>
        </div>
      </header>
    </>
  );
};
