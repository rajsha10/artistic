import React from 'react';
import { Home, Compass } from 'lucide-react';
import Link from 'next/link';
import '../../fonts.css';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16 p-10">
          {/* Left - Home Icon
          <div className="flex-shrink-0 ">
            <Link href="/" className="text-white hover:text-grey-400 transition-colors ">
              <Home className="h-6 w-6" />
            </Link>
          </div> */}

          {/* Center - Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="mt-7 plaster-regular text-7xl hover:text-white transition-colors">
              Artistic
            </Link>
          </div>

          {/* Right - Explore
          <div className="flex-shrink-0">
            <Link href="/explore" className="flex items-center text-white hover:text-white transition-colors">
              <Compass className="h-6 w-6" />
              <span className="ml-2 font-medium">Explore</span>
            </Link>
          </div> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;