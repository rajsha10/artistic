"use client";

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero';
import LoadScrn from './components/LoadScrn';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1800);
  }, []);

  return (
    <main>
      {loading ? (
        <div className="fixed inset-0 z-50">
          <LoadScrn />
        </div>
      ) : (
        <div className="home-main-container animate-fadeIn">
          <div className="snow"></div>
          <Navbar />
          <Hero />
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-in;
        }
      `}</style>
    </main>
  );
};

export default Home;