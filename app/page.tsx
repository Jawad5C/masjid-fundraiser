'use client';

import MinaretThermometer from '@/components/MinaretThermometer';
import StarryBackground from '@/components/StarryBackground';
import FireworksCelebration from '@/components/FireworksCelebration';
import { useDonations } from '@/contexts/DonationContext';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  return <HomeContent />;
}

function HomeContent() {
  const { stats, isLoading, error } = useDonations();
  const [showFireworks, setShowFireworks] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const totalRaised = stats?.totalRaised || 0;
  const goalAmount = stats?.goalAmount || 1000000;
  const pledgedAmount = stats?.pledgedAmount ?? 679000;

  // Debug logging
  useEffect(() => {
    console.log('🏠 Home page - stats:', stats);
    console.log('🏠 Home page - totalRaised:', totalRaised);
  }, [stats, totalRaised]);

  // Check if goal is reached
  useEffect(() => {
    if (totalRaised >= goalAmount && !hasTriggered) {
      setShowFireworks(true);
      setHasTriggered(true);
    }
  }, [totalRaised, goalAmount, hasTriggered]);

  // Reset hasTriggered when totalRaised goes below goal
  useEffect(() => {
    if (totalRaised < goalAmount) {
      setHasTriggered(false);
    }
  }, [totalRaised, goalAmount]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading donation data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl">Error loading data: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Starry Background */}
      <StarryBackground />
      
      {/* Moon with Circular Wrapped Text */}
      <div className="relative pt-8 sm:pt-16 pb-4 sm:pb-8 z-30 flex items-center justify-center">
        {/* Moon Logo - Center */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 z-20" style={{
          filter: 'drop-shadow(0 0 40px rgba(255, 255, 255, 1))'
        }}>
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center p-1 sm:p-1.5 md:p-2 animate-pulse" style={{
            boxShadow: '0 0 40px rgba(255, 255, 255, 1), 0 0 80px rgba(255, 255, 255, 0.8), 0 0 120px rgba(255, 255, 255, 0.6)'
          }}>
            <Image 
              src="/logo.jpeg" 
              alt="Waterbury Islamic Cultural Center Logo" 
              width={192}
              height={192}
              className="object-contain"
              style={{
                width: '70%',
                height: '70%',
                filter: 'brightness(1.4) contrast(1.2) drop-shadow(0 0 20px rgba(255, 255, 255, 1))'
              }}
            />
          </div>
        </div>


        {/* Prophet Muhammad (PBUH) Statement - Below Moon on Mobile, Sides on Larger Screens */}
        <div className="absolute top-12 sm:top-20 left-0 right-0 flex items-center justify-center pointer-events-none z-50">
          {/* Mobile View: Text Below Moon */}
          <div className="sm:hidden mt-36 text-center px-4">
            <div className="text-xs text-white font-bold italic animate-pulse mb-1" style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.8)',
              fontFamily: '"Edwardian Script ITC", "Brush Script MT", cursive',
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 1))',
              zIndex: 50
            }}>
              Whoever builds a Masjid for Allah,
            </div>
            <div className="text-xs text-white font-bold italic animate-pulse mb-1" style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.8)',
              fontFamily: '"Edwardian Script ITC", "Brush Script MT", cursive',
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 1))',
              zIndex: 50
            }}>
              Allah will build for him a house like it in Paradise
            </div>
            <div className="text-xs text-amber-200 font-bold italic animate-pulse" style={{
              textShadow: '0 0 20px rgba(245, 158, 11, 1), 0 0 40px rgba(245, 158, 11, 0.8)',
              fontFamily: '"Edwardian Script ITC", "Brush Script MT", cursive',
              filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 1))',
              zIndex: 50
            }}>
              — Prophet Muhammad (Peace Be Upon Him)
            </div>
          </div>

          {/* Desktop View: Text on Sides of Moon */}
          <div className="hidden sm:block relative w-96 h-96 flex items-center justify-center">
            {/* Left Side: First Half of Hadith */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-80">
              <div className="text-center animate-bounce" style={{
                animationDuration: '8s',
                animationDelay: '3s'
              }}>
                <div className="text-xl md:text-2xl text-white font-bold italic animate-pulse mb-2" style={{
                  textShadow: '0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.8)',
                  fontFamily: '"Edwardian Script ITC", "Brush Script MT", cursive',
                  filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 1))',
                  zIndex: 50
                }}>
                  Whoever builds a Masjid for Allah,
                </div>
                <div className="text-xl md:text-2xl text-white font-bold italic animate-pulse" style={{
                  textShadow: '0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.8)',
                  fontFamily: '"Edwardian Script ITC", "Brush Script MT", cursive',
                  filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 1))',
                  zIndex: 50
                }}>
                  Allah will build for him
                </div>
              </div>
            </div>

            {/* Right Side: Second Half of Hadith */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-96">
              <div className="text-center animate-bounce" style={{
                animationDuration: '8s',
                animationDelay: '3.3s'
              }}>
                <div className="text-xl md:text-2xl text-white font-bold italic animate-pulse mb-2" style={{
                  textShadow: '0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.8)',
                  fontFamily: '"Edwardian Script ITC", "Brush Script MT", cursive',
                  filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 1))',
                  zIndex: 50
                }}>
                  a house like it in Paradise
                </div>
                <div className="text-xl md:text-2xl text-amber-200 font-bold italic animate-pulse" style={{
                  textShadow: '0 0 20px rgba(245, 158, 11, 1), 0 0 40px rgba(245, 158, 11, 0.8)',
                  fontFamily: '"Edwardian Script ITC", "Brush Script MT", cursive',
                  filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 1))',
                  zIndex: 50
                }}>
                  — Prophet Muhammad (Peace Be Upon Him)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Glowing Halo Effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full" style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 80%)',
            animation: 'pulse 3s ease-in-out infinite'
          }}></div>
        </div>
      </div>

      {/* Header removed - text moved under minaret */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        
        {/* Minaret Thermometer - Moved Up */}
        <div className="flex justify-center mb-8 sm:mb-16 relative z-20 mt-28 sm:mt-20">
          <div className="relative flex flex-col items-center scale-100 sm:scale-125">
            <MinaretThermometer 
              currentAmount={totalRaised}
              goalAmount={goalAmount}
              pledgedAmount={pledgedAmount}
            />
          </div>
        </div>

        {/* Donation Options - Mosque Domes - Visible at all times */}
        <div className="sticky top-0 text-center mb-8 sm:mb-16 relative z-50 pt-4 sm:pt-6 pb-4 sm:pb-6 -mt-4">
          <h3 className="text-2xl sm:text-4xl font-bold text-purple-300 mb-4 sm:mb-8 px-4" style={{
            textShadow: '0 0 10px rgba(196, 181, 253, 0.8), 0 0 20px rgba(196, 181, 253, 0.6), 0 0 30px rgba(196, 181, 253, 0.4), 0 0 40px rgba(196, 181, 253, 0.2)',
            fontFamily: '"Playfair Display", "Georgia", "serif"',
            letterSpacing: '0.05em',
            fontWeight: '700',
            background: 'linear-gradient(45deg, #a855f7, #c084fc, #e879f9, #f0abfc, #a855f7)',
            backgroundSize: '400% 400%',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradientShift 3s ease-in-out infinite, slide-side-to-side 4s ease-in-out infinite',
            filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.8))',
            display: 'inline-block'
          }}>Make a Donation</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 px-4">
            <div className="relative flex flex-col items-center">
              {/* Mosque Dome - Rounded Rectangle - Entirely Clickable */}
              <button
                onClick={() => window.location.href = '/donate?amount=25'}
                className="w-full max-w-40 sm:max-w-48 h-14 sm:h-16 bg-gradient-to-br from-green-200 to-green-400 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden block cursor-pointer"
                style={{
                transform: 'perspective(1000px) rotateX(5deg) rotateY(-2deg)',
                boxShadow: '0 0 30px rgba(34, 197, 94, 0.8), 0 0 60px rgba(34, 197, 94, 0.6), 0 0 90px rgba(34, 197, 94, 0.4), 0 20px 40px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
                border: '2px solid rgba(34, 197, 94, 0.8)'
              }}>
                {/* Dome Content */}
                <div className="text-center z-10">
                  <div className="text-xl sm:text-2xl font-bold text-green-800">$25</div>
                </div>
                
                {/* Dome Button */}
                <div className="absolute bottom-2 text-cyan-300 py-2 px-4 text-xs sm:text-sm font-bold shadow-2xl transition-all duration-300 animate-pulse" style={{
                  background: 'linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff)',
                  borderRadius: '20px 5px 20px 5px',
                  boxShadow: '0 0 20px rgba(255, 0, 255, 1), 0 0 40px rgba(0, 255, 255, 0.8), 0 0 60px rgba(255, 0, 255, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  textShadow: '0 0 5px rgba(34, 211, 238, 1), 0 0 10px rgba(34, 211, 238, 1), 0 0 15px rgba(34, 211, 238, 1), 0 0 20px rgba(34, 211, 238, 0.8), 0 0 25px rgba(34, 211, 238, 0.6)',
                  filter: 'brightness(1.3) contrast(1.2)',
                  fontFamily: 'monospace',
                  letterSpacing: '0.1em'
                }}>
                  DONATE
                </div>
              </button>
            </div>

            <div className="relative flex flex-col items-center">
              {/* Mosque Dome - Rounded Rectangle - Entirely Clickable */}
              <button
                onClick={() => window.location.href = '/donate?amount=100'}
                className="w-full max-w-40 sm:max-w-48 h-14 sm:h-16 bg-gradient-to-br from-green-200 to-green-400 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden block cursor-pointer"
                style={{
                transform: 'perspective(1000px) rotateX(5deg) rotateY(2deg)',
                boxShadow: '0 0 30px rgba(34, 197, 94, 0.8), 0 0 60px rgba(34, 197, 94, 0.6), 0 0 90px rgba(34, 197, 94, 0.4), 0 20px 40px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
                border: '2px solid rgba(34, 197, 94, 0.8)'
              }}>
                {/* Dome Content */}
                <div className="text-center z-10">
                  <div className="text-xl sm:text-2xl font-bold text-amber-800">$100</div>
                </div>
                
                {/* Dome Button */}
                <div className="absolute bottom-2 text-cyan-300 py-2 px-4 text-xs sm:text-sm font-bold shadow-2xl transition-all duration-300 animate-pulse" style={{
                  background: 'linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff)',
                  borderRadius: '20px 5px 20px 5px',
                  boxShadow: '0 0 20px rgba(255, 0, 255, 1), 0 0 40px rgba(0, 255, 255, 0.8), 0 0 60px rgba(255, 0, 255, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  textShadow: '0 0 5px rgba(34, 211, 238, 1), 0 0 10px rgba(34, 211, 238, 1), 0 0 15px rgba(34, 211, 238, 1), 0 0 20px rgba(34, 211, 238, 0.8), 0 0 25px rgba(34, 211, 238, 0.6)',
                  filter: 'brightness(1.3) contrast(1.2)',
                  fontFamily: 'monospace',
                  letterSpacing: '0.1em'
                }}>
                  DONATE
                </div>
              </button>
            </div>

            <div className="relative flex flex-col items-center">
              {/* Mosque Dome - Rounded Rectangle - Entirely Clickable */}
              <button
                onClick={() => window.location.href = '/donate?amount=500'}
                className="w-full max-w-40 sm:max-w-48 h-14 sm:h-16 bg-gradient-to-br from-green-200 to-green-400 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden block cursor-pointer"
                style={{
                transform: 'perspective(1000px) rotateX(-5deg) rotateY(-2deg)',
                boxShadow: '0 0 30px rgba(34, 197, 94, 0.8), 0 0 60px rgba(34, 197, 94, 0.6), 0 0 90px rgba(34, 197, 94, 0.4), 0 20px 40px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
                border: '2px solid rgba(34, 197, 94, 0.8)'
              }}>
                {/* Dome Content */}
                <div className="text-center z-10">
                  <div className="text-xl sm:text-2xl font-bold text-amber-800">$500</div>
                </div>
                
                {/* Dome Button */}
                <div className="absolute bottom-2 text-cyan-300 py-2 px-4 text-xs sm:text-sm font-bold shadow-2xl transition-all duration-300 animate-pulse" style={{
                  background: 'linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff)',
                  borderRadius: '20px 5px 20px 5px',
                  boxShadow: '0 0 20px rgba(255, 0, 255, 1), 0 0 40px rgba(0, 255, 255, 0.8), 0 0 60px rgba(255, 0, 255, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  textShadow: '0 0 5px rgba(34, 211, 238, 1), 0 0 10px rgba(34, 211, 238, 1), 0 0 15px rgba(34, 211, 238, 1), 0 0 20px rgba(34, 211, 238, 0.8), 0 0 25px rgba(34, 211, 238, 0.6)',
                  filter: 'brightness(1.3) contrast(1.2)',
                  fontFamily: 'monospace',
                  letterSpacing: '0.1em'
                }}>
                  DONATE
                </div>
              </button>
            </div>

            <div className="relative flex flex-col items-center">
              {/* Mosque Dome - Rounded Rectangle - Entirely Clickable */}
              <button
                onClick={() => window.location.href = '/donate?amount=1000'}
                className="w-full max-w-40 sm:max-w-48 h-14 sm:h-16 bg-gradient-to-br from-green-200 to-green-400 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden block cursor-pointer"
                style={{
                transform: 'perspective(1000px) rotateX(-5deg) rotateY(2deg)',
                boxShadow: '0 0 30px rgba(34, 197, 94, 0.8), 0 0 60px rgba(34, 197, 94, 0.6), 0 0 90px rgba(34, 197, 94, 0.4), 0 20px 40px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
                border: '2px solid rgba(34, 197, 94, 0.8)'
              }}>
                {/* Dome Content */}
                <div className="text-center z-10">
                  <div className="text-xl sm:text-2xl font-bold text-amber-800">$1000</div>
                </div>
                
                {/* Dome Button */}
                <div className="absolute bottom-2 text-cyan-300 py-2 px-4 text-xs sm:text-sm font-bold shadow-2xl transition-all duration-300 animate-pulse" style={{
                  background: 'linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff)',
                  borderRadius: '20px 5px 20px 5px',
                  boxShadow: '0 0 20px rgba(255, 0, 255, 1), 0 0 40px rgba(0, 255, 255, 0.8), 0 0 60px rgba(255, 0, 255, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  textShadow: '0 0 5px rgba(34, 211, 238, 1), 0 0 10px rgba(34, 211, 238, 1), 0 0 15px rgba(34, 211, 238, 1), 0 0 20px rgba(34, 211, 238, 0.8), 0 0 25px rgba(34, 211, 238, 0.6)',
                  filter: 'brightness(1.3) contrast(1.2)',
                  fontFamily: 'monospace',
                  letterSpacing: '0.1em'
                }}>
                  DONATE
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Single Animated Masjid Assalam Fundraising Text - Moving to Random Positions */}
        <div className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute" style={{
            animation: 'random-position-glow 32s ease-in-out infinite',
            left: '4rem',
            top: '4rem'
          }}>
            <h1 className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-center" style={{
              textShadow: '0 0 50px rgba(34, 211, 238, 1), 0 0 100px rgba(34, 211, 238, 1), 0 0 150px rgba(34, 211, 238, 0.8), 0 0 200px rgba(34, 211, 238, 0.6), 0 0 250px rgba(34, 211, 238, 0.4), 0 0 300px rgba(34, 211, 238, 0.2)',
              fontFamily: '"Playfair Display", "Georgia", "serif"',
              letterSpacing: '0.05em',
              fontWeight: '700',
              filter: 'brightness(1.8) contrast(1.5) saturate(2.0)',
              background: 'linear-gradient(45deg, #00ffff, #ff00ff, #ffff00, #00ff00, #ff0080, #8000ff, #00ffff)',
              backgroundSize: '400% 400%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradient-shift 3s ease-in-out infinite',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span>Masjid</span>
              <span>Assalam</span>
              <span>Fundraiser</span>
            </h1>
          </div>
        </div>
        
        {/* Help Us Reach Our Goal - In Starry Space */}
        <div className="text-center mb-8 relative z-10 mt-16 sm:mt-32">
          <h2 className="text-2xl sm:text-4xl font-bold text-purple-300 mb-4 sm:mb-6 px-4" style={{
            textShadow: '0 0 10px rgba(196, 181, 253, 0.8), 0 0 20px rgba(196, 181, 253, 0.6), 0 0 30px rgba(196, 181, 253, 0.4)'
          }}>
            Help Us Reach Our Goal
          </h2>
          <p className="text-lg sm:text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed px-4" style={{
            textShadow: '0 0 5px rgba(196, 181, 253, 0.6), 0 0 10px rgba(196, 181, 253, 0.4)'
          }}>
            Join us in building a stronger community. Every donation brings us closer to our $1 million goal.
          </p>
        </div>


        {/* WICC Community Gallery */}
        <div className="text-center mb-8 sm:mb-16 relative z-10 mt-8 sm:mt-16">
          <h3 className="text-3xl sm:text-5xl font-bold text-purple-300 mb-6 sm:mb-8 px-4" style={{
            textShadow: '0 0 10px rgba(196, 181, 253, 0.8), 0 0 20px rgba(196, 181, 253, 0.6), 0 0 30px rgba(196, 181, 253, 0.4)',
            fontFamily: '"Playfair Display", "Georgia", "serif"',
            letterSpacing: '0.05em',
            fontWeight: '700'
          }}>Our Community</h3>
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 p-4 sm:p-8 border border-amber-400" style={{
              boxShadow: '0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}>
              <div className="text-center mb-6 sm:mb-8">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🕌</div>
                <h4 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Waterbury Islamic Cultural Center</h4>
                <p className="text-amber-200 mb-4 sm:mb-6 text-sm sm:text-base">Building our community together through faith, education, and service</p>
              </div>
              
              
              {/* Download Button */}
              <div className="text-center">
                <a 
                  href="/FINAL%20WICC%20PDF%202025.pdf" 
            target="_blank"
            rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-2.5 sm:py-4 px-4 sm:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-lg whitespace-normal sm:whitespace-nowrap"
                  style={{
                    boxShadow: '0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  📄 <span className="hidden sm:inline">View New Masjid Building</span><span className="sm:hidden">View New Masjid Bldg.</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Abu Huraira Hadith */}
        <div className="text-center mb-16 relative z-10 mt-16">
          <div className="max-w-6xl mx-auto px-2 sm:px-6">
            <blockquote className="text-center">
              <p className="text-sm sm:text-lg md:text-xl text-yellow-300 font-thin mb-4 leading-relaxed animate-pulse" style={{
                textShadow: '0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.8)',
                fontFamily: '"Georgia", "Times New Roman", "serif"',
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 1))',
                letterSpacing: '0.5px',
                animation: 'pulse 2s ease-in-out infinite'
              }}>
                &ldquo;Verily, among the good deeds that will join a believer after his death are these: knowledge which he taught and spread, a righteous child he leaves behind, a copy of the Quran he leaves for inheritance, a mosque he has built, a house he built for travelers, a well he has dug, and charity distributed from his wealth while he was alive and well. These deeds will join him after his death.&rdquo;
              </p>
              <footer className="text-xs sm:text-base text-amber-200 font-light italic animate-pulse" style={{
                textShadow: '0 0 20px rgba(245, 158, 11, 1), 0 0 40px rgba(245, 158, 11, 0.8)',
                fontFamily: '"Georgia", "Times New Roman", "serif"',
                filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 1))',
                letterSpacing: '0.3px'
              }}>
                — Abu Huraira (RA) • Sunan Ibn Majah 242
              </footer>
            </blockquote>
          </div>
        </div>

        {/* All Services Impact */}
        <div className="text-center mb-16 relative z-10 mt-16">
          <div className="max-w-6xl mx-auto px-2 sm:px-6">
            <h3 className="text-3xl font-bold text-white mb-12 text-center" style={{
              fontFamily: '"Playfair Display", "Georgia", "serif"',
              letterSpacing: '0.02em',
              fontWeight: '700',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4)'
            }}>Your Donation Supports All Our Services Envisioned For The New Masjid</h3>
            
            {/* Main Services Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 md:gap-16 mb-8 sm:mb-16">
                {/* Prayer Services */}
                <div className="text-center bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-xl p-2.5 sm:p-6 border-2 border-purple-300/80 backdrop-blur-sm" style={{
                  boxShadow: '0 0 30px rgba(147, 51, 234, 0.6), 0 0 60px rgba(147, 51, 234, 0.4), 0 0 0 2px rgba(196, 181, 253, 0.8), 0 0 20px rgba(196, 181, 253, 0.6), 0 0 40px rgba(196, 181, 253, 0.4)',
                  animation: 'neon-pulse 2s ease-in-out infinite'
                }}>
                  <div className="text-2xl sm:text-4xl mb-1.5 sm:mb-3">🕌</div>
                  <h4 className="text-base sm:text-xl font-semibold text-purple-200 mb-1.5 sm:mb-3">Prayer Services</h4>
                  <p className="text-purple-100 text-xs sm:text-sm leading-relaxed px-0 sm:px-0 w-full">Daily prayers, Friday Jummah, and special religious observances including the 2 Eids</p>
                </div>

                {/* Education */}
                <div className="text-center bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-xl p-2.5 sm:p-6 border-2 border-purple-300/80 backdrop-blur-sm" style={{
                  boxShadow: '0 0 30px rgba(147, 51, 234, 0.6), 0 0 60px rgba(147, 51, 234, 0.4), 0 0 0 2px rgba(196, 181, 253, 0.8), 0 0 20px rgba(196, 181, 253, 0.6), 0 0 40px rgba(196, 181, 253, 0.4)',
                  animation: 'neon-pulse 2s ease-in-out infinite'
                }}>
                  <div className="text-2xl sm:text-4xl mb-1.5 sm:mb-3">📚</div>
                  <h4 className="text-base sm:text-xl font-semibold text-purple-200 mb-1.5 sm:mb-3">Education</h4>
                  <p className="text-purple-100 text-xs sm:text-sm leading-relaxed px-0 sm:px-0 w-full">Islamic studies, Quran classes, and community learning programs</p>
                  
                  {/* Education Highlight */}
                  <div className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-lg p-1.5 sm:p-3 border border-teal-400/30 backdrop-blur-sm mt-1.5 sm:mt-4" style={{
                    boxShadow: '0 0 15px rgba(20, 184, 166, 0.2), 0 0 30px rgba(20, 184, 166, 0.1), inset 0 0 10px rgba(255, 255, 255, 0.1)'
                  }}>
                    <p className="text-white text-xs sm:text-sm font-bold">
                      🌟 Over 35 students in Huffaz classes<br/>
                      📖 Nearly 300 students in Islamic School
                    </p>
                  </div>
                </div>

                {/* Community Events */}
                <div className="text-center bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-xl p-2.5 sm:p-6 border-2 border-purple-300/80 backdrop-blur-sm" style={{
                  boxShadow: '0 0 30px rgba(147, 51, 234, 0.6), 0 0 60px rgba(147, 51, 234, 0.4), 0 0 0 2px rgba(196, 181, 253, 0.8), 0 0 20px rgba(196, 181, 253, 0.6), 0 0 40px rgba(196, 181, 253, 0.4)',
                  animation: 'neon-pulse 2s ease-in-out infinite'
                }}>
                  <div className="text-2xl sm:text-4xl mb-1.5 sm:mb-3">🍽️</div>
                  <h4 className="text-base sm:text-xl font-semibold text-purple-200 mb-1.5 sm:mb-3">Community Events</h4>
                  <p className="text-purple-100 text-xs sm:text-sm leading-relaxed px-0 sm:px-0 w-full">Iftar dinners, Eid celebrations, and community gatherings</p>
                </div>

                {/* Janazah Services */}
                <div className="text-center bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-xl p-2.5 sm:p-6 border-2 border-purple-300/80 backdrop-blur-sm" style={{
                  boxShadow: '0 0 30px rgba(147, 51, 234, 0.6), 0 0 60px rgba(147, 51, 234, 0.4), 0 0 0 2px rgba(196, 181, 253, 0.8), 0 0 20px rgba(196, 181, 253, 0.6), 0 0 40px rgba(196, 181, 253, 0.4)',
                  animation: 'neon-pulse 2s ease-in-out infinite'
                }}>
                  <div className="text-2xl sm:text-4xl mb-1.5 sm:mb-3">🤲</div>
                  <h4 className="text-base sm:text-xl font-semibold text-purple-200 mb-1.5 sm:mb-3">Janazah Services</h4>
                  <p className="text-purple-100 text-xs sm:text-sm leading-relaxed px-0 sm:px-0 w-full">Funeral prayers, burial arrangements, and bereavement support for our community</p>
                </div>

                {/* Body Washing */}
                <div className="text-center bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-xl p-2.5 sm:p-6 border-2 border-purple-300/80 backdrop-blur-sm" style={{
                  boxShadow: '0 0 30px rgba(147, 51, 234, 0.6), 0 0 60px rgba(147, 51, 234, 0.4), 0 0 0 2px rgba(196, 181, 253, 0.8), 0 0 20px rgba(196, 181, 253, 0.6), 0 0 40px rgba(196, 181, 253, 0.4)',
                  animation: 'neon-pulse 2s ease-in-out infinite'
                }}>
                  <div className="text-2xl sm:text-4xl mb-1.5 sm:mb-3">💧</div>
                  <h4 className="text-base sm:text-xl font-semibold text-purple-200 mb-1.5 sm:mb-3">Body Washing</h4>
                  <p className="text-purple-100 text-xs sm:text-sm leading-relaxed px-0 sm:px-0 w-full">Ghusl services for deceased community members according to Islamic tradition</p>
                </div>

                {/* Recreation Center */}
                <div className="text-center bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-xl p-2.5 sm:p-6 border-2 border-purple-300/80 backdrop-blur-sm" style={{
                  boxShadow: '0 0 30px rgba(147, 51, 234, 0.6), 0 0 60px rgba(147, 51, 234, 0.4), 0 0 0 2px rgba(196, 181, 253, 0.8), 0 0 20px rgba(196, 181, 253, 0.6), 0 0 40px rgba(196, 181, 253, 0.4)',
                  animation: 'neon-pulse 2s ease-in-out infinite'
                }}>
                  <div className="text-2xl sm:text-4xl mb-1.5 sm:mb-3">🏃‍♂️</div>
                  <h4 className="text-base sm:text-xl font-semibold text-purple-200 mb-1.5 sm:mb-3">Recreation Center</h4>
                  <p className="text-purple-100 text-xs sm:text-sm leading-relaxed px-0 sm:px-0 w-full">Sports facilities, fitness programs, and recreational activities for all ages</p>
                </div>

                {/* Nikah/Weddings */}
                <div className="text-center bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-xl p-2.5 sm:p-6 border-2 border-purple-300/80 backdrop-blur-sm" style={{
                  boxShadow: '0 0 30px rgba(147, 51, 234, 0.6), 0 0 60px rgba(147, 51, 234, 0.4), 0 0 0 2px rgba(196, 181, 253, 0.8), 0 0 20px rgba(196, 181, 253, 0.6), 0 0 40px rgba(196, 181, 253, 0.4)',
                  animation: 'neon-pulse 2s ease-in-out infinite'
                }}>
                  <div className="text-2xl sm:text-4xl mb-1.5 sm:mb-3">💒</div>
                  <h4 className="text-base sm:text-xl font-semibold text-purple-200 mb-1.5 sm:mb-3">Nikah/Weddings</h4>
                  <p className="text-purple-100 text-xs sm:text-sm leading-relaxed px-0 sm:px-0 w-full">Islamic marriage ceremonies, wedding planning, and matrimonial services</p>
                </div>

                {/* Social Services */}
                <div className="text-center bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-xl p-2.5 sm:p-6 border-2 border-purple-300/80 backdrop-blur-sm" style={{
                  boxShadow: '0 0 30px rgba(147, 51, 234, 0.6), 0 0 60px rgba(147, 51, 234, 0.4), 0 0 0 2px rgba(196, 181, 253, 0.8), 0 0 20px rgba(196, 181, 253, 0.6), 0 0 40px rgba(196, 181, 253, 0.4)',
                  animation: 'neon-pulse 2s ease-in-out infinite'
                }}>
                  <div className="text-2xl sm:text-4xl mb-1.5 sm:mb-3">👥</div>
                  <h4 className="text-base sm:text-xl font-semibold text-purple-200 mb-1.5 sm:mb-3">Social Services</h4>
                  <p className="text-purple-100 text-xs sm:text-sm leading-relaxed px-0 sm:px-0 w-full">Supporting families in need and community outreach programs</p>
                </div>

              </div>

            {/* Impact Statement */}
            <div className="text-center bg-gradient-to-br from-purple-900/15 to-purple-800/15 rounded-xl p-3 sm:p-6 border-2 border-purple-400/30 backdrop-blur-sm mt-24 sm:mt-16 mb-8 sm:mb-16" style={{
              boxShadow: '0 0 15px rgba(147, 51, 234, 0.2), 0 0 30px rgba(147, 51, 234, 0.1), inset 0 0 10px rgba(255, 255, 255, 0.1)'
            }}>
              <h4 className="text-base sm:text-xl font-bold text-white mb-2 sm:mb-3">🌟 Building Our Community Together</h4>
              <p className="text-sm sm:text-base text-purple-100 leading-relaxed">
                Every donation, regardless of amount, directly supports the Waterbury Islamic Cultural Center&apos;s mission to serve our community through faith, education, and service. Your contribution helps us maintain our facilities, expand our programs, and continue building bonds that strengthen our community.
              </p>
            </div>
          </div>
        </div>


      </main>


      {/* Footer */}
      <footer className="bg-slate-800 text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-slate-300 mb-4 text-sm sm:text-base">
              © 2025 Masjid Assalam Fundraising. Building our community together.
            </p>
            <div className="text-xs sm:text-sm text-slate-400 border-t border-slate-700 pt-4 relative">
              {/* Contact Info - Centered */}
              <div className="text-center mb-3 sm:mb-0">
                <p className="mb-2">Website Design & Development</p>
                <p className="text-slate-300">
                  <span className="text-amber-300 font-semibold">Jawad Ashraf</span> • 
                  <a 
                    href="mailto:jawad.ashraf.nyc@gmail.com" 
                    className="text-amber-300 hover:text-amber-200 transition-colors duration-200 ml-1 break-all sm:break-normal"
                  >
                    jawad.ashraf.nyc@gmail.com
                  </a>
                </p>
                <p className="text-slate-300 mt-1">
                  <span className="text-amber-300">Text</span> <span className="text-amber-300">(860) 796-3837</span>
                </p>
              </div>
              
              {/* Admin Dashboard - Below contact info on mobile, absolute right on larger screens */}
              <div className="text-center sm:absolute sm:bottom-0 sm:right-0 sm:text-right mt-3 sm:mt-0">
                <a 
                  href="/admin" 
                  className="inline-block bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Admin Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Fireworks Celebration */}
      <FireworksCelebration 
        isActive={showFireworks} 
        onComplete={() => setShowFireworks(false)} 
      />
    </div>
  );
}