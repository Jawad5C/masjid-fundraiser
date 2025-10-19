'use client';

import { useState, useEffect } from 'react';

interface MinaretThermometerProps {
  currentAmount: number;
  goalAmount: number;
  className?: string;
}

// Minaret-shaped thermometer component with animated mercury effect
export default function MinaretThermometer({ 
  currentAmount, 
  goalAmount, 
  className = '' 
}: MinaretThermometerProps) {
  const [animatedAmount, setAnimatedAmount] = useState(0);
  
  // Calculate progress percentage
  const progressPercentage = Math.min((currentAmount / goalAmount) * 100, 100);
  
  // Animate the mercury filling effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedAmount(currentAmount);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentAmount]);
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Crescent Moon Finial - Text Crescent */}
      <div className="relative mb-1 sm:mb-2 z-20">
        <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 text-3xl sm:text-4xl">🌙</div>
      </div>
      
      {/* Dome/Cupola */}
      <div className="relative w-10 sm:w-12 h-6 sm:h-8 bg-amber-200 border-2 border-black shadow-lg" style={{
        borderRadius: '50% 50% 0 0',
        marginBottom: '2px'
      }}>
        {/* Red Mercury in dome */}
        <div 
          className="absolute bottom-0 left-0 right-0 transition-all duration-2000 ease-out"
          style={{ 
            height: progressPercentage >= 100 ? '100%' : progressPercentage > 90 ? `${(progressPercentage - 90) * 10}%` : '0%',
            background: `linear-gradient(to top, 
              #8B0000 0%, 
              #B22222 20%, 
              #DC143C 40%, 
              #FF0000 60%, 
              #FF4500 80%, 
              #FF6347 100%)`,
            borderRadius: '50% 50% 0 0',
            boxShadow: progressPercentage >= 100 ? 
              '0 0 30px rgba(255, 0, 0, 1), 0 0 50px rgba(255, 0, 0, 0.9), 0 0 70px rgba(255, 0, 0, 0.7), inset 0 0 15px rgba(255, 255, 255, 0.3)' :
              '0 0 20px rgba(255, 0, 0, 1), 0 0 30px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.2)',
            animation: progressPercentage >= 100 ? 'pulse 1s ease-in-out infinite' : 'pulse 1.5s ease-in-out infinite',
            filter: progressPercentage >= 100 ? 'brightness(2) contrast(1.6)' : 'brightness(1.5) contrast(1.4)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-300 to-transparent opacity-30 animate-pulse"></div>
        </div>
      </div>
      
      {/* Balcony/Gallery Section */}
      <div className="relative w-14 sm:w-16 h-10 sm:h-12 bg-amber-200 border-2 border-black shadow-lg" style={{
        borderRadius: '8px 8px 0 0'
      }}>
        {/* Red Mercury in balcony */}
        <div 
          className="absolute bottom-0 left-0 right-0 transition-all duration-2000 ease-out"
          style={{ 
            height: progressPercentage >= 100 ? '100%' : progressPercentage > 70 ? `${Math.min((progressPercentage - 70) * 5, 100)}%` : '0%',
            background: `linear-gradient(to top, 
              #dc2626 0%, 
              #ef4444 50%, 
              #f87171 100%)`,
            borderRadius: '8px 8px 0 0',
            boxShadow: progressPercentage >= 100 ?
              '0 0 20px rgba(239, 68, 68, 1), 0 0 40px rgba(239, 68, 68, 0.8), 0 0 60px rgba(239, 68, 68, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.4)' :
              progressPercentage > 70 ?
              '0 0 15px rgba(239, 68, 68, 0.9), 0 0 25px rgba(239, 68, 68, 0.7), 0 0 35px rgba(239, 68, 68, 0.5), inset 0 0 12px rgba(255, 255, 255, 0.35)' :
              '0 0 10px rgba(239, 68, 68, 0.8), 0 0 20px rgba(239, 68, 68, 0.6), 0 0 30px rgba(239, 68, 68, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.3)',
            animation: progressPercentage >= 100 ? 'pulse 1s ease-in-out infinite' : 'pulse 2s ease-in-out infinite'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-300 to-transparent opacity-30 animate-pulse"></div>
        </div>
      </div>
      
      {/* Main Minaret Shaft */}
      <div className="relative w-8 sm:w-12 h-48 sm:h-64 bg-amber-200 border-2 border-black shadow-2xl">
        {/* Vertical decorative panels */}
        <div className="absolute left-1 top-0 w-1 h-full bg-amber-600"></div>
        <div className="absolute right-1 top-0 w-1 h-full bg-amber-600"></div>
        
        {/* Red Mercury in main shaft */}
        <div 
          className="absolute bottom-0 left-0 right-0 transition-all duration-2000 ease-out"
          style={{ 
            height: progressPercentage >= 100 ? '100%' : `${Math.min(progressPercentage, 70)}%`,
            background: `linear-gradient(to top, 
              #8B0000 0%, 
              #B22222 20%, 
              #DC143C 40%, 
              #FF0000 60%, 
              #FF4500 80%, 
              #FF6347 100%)`,
            boxShadow: progressPercentage >= 100 ?
              '0 0 30px rgba(255, 0, 0, 1), 0 0 50px rgba(255, 0, 0, 0.9), 0 0 70px rgba(255, 0, 0, 0.7), inset 0 0 15px rgba(255, 255, 255, 0.3)' :
              '0 0 20px rgba(255, 0, 0, 1), 0 0 30px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.2)',
            animation: progressPercentage >= 100 ? 'pulse 1s ease-in-out infinite' : 'pulse 1.5s ease-in-out infinite',
            filter: progressPercentage >= 100 ? 'brightness(2) contrast(1.6)' : 'brightness(1.5) contrast(1.4)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-300 to-transparent opacity-30 animate-pulse"></div>
        </div>
        
        {/* Progress markers */}
        <div className="absolute left-0 top-0 w-full h-full">
          {/* 25% marker */}
          <div className="absolute left-0 top-3/4 w-full h-0.5 bg-yellow-600 opacity-60"></div>
          <div className="absolute -left-8 top-3/4 text-xs text-yellow-600 font-semibold">25%</div>
          
          {/* 50% marker */}
          <div className="absolute left-0 top-1/2 w-full h-0.5 bg-yellow-600 opacity-60"></div>
          <div className="absolute -left-8 top-1/2 text-xs text-yellow-600 font-semibold">50%</div>
          
          {/* 75% marker */}
          <div className="absolute left-0 top-1/4 w-full h-0.5 bg-yellow-600 opacity-60"></div>
          <div className="absolute -left-8 top-1/4 text-xs text-yellow-600 font-semibold">75%</div>
        </div>
      </div>
      
      {/* Minaret Base */}
      <div className="w-20 h-6 bg-amber-300 border-2 border-black shadow-lg rounded-full"></div>
      
      {/* Foundation */}
      <div className="w-24 h-4 bg-amber-400 border-2 border-black shadow-lg rounded-full"></div>
      
      {/* Progress information */}
      <div className="mt-4 sm:mt-6 text-center w-full max-w-xs px-2">
        <div className="text-sm sm:text-lg font-bold text-red-600 mb-2">
          <div className="block sm:hidden">
            {formatCurrency(animatedAmount)}<br/>
            of {formatCurrency(goalAmount)}
          </div>
          <div className="hidden sm:block whitespace-nowrap">
            {formatCurrency(animatedAmount)} of {formatCurrency(goalAmount)} goal
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-red-600">
          {progressPercentage.toFixed(1)}%
        </div>
      </div>
      
      {/* Islamic decorative elements */}
      <div className="absolute -left-4 top-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute -right-4 top-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute -left-4 top-1/4 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
      <div className="absolute -right-4 top-2/3 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
    </div>
  );
}
