'use client';

import { useEffect, useRef } from 'react';
import Fireworks from 'fireworks-js';

interface FireworksCelebrationProps {
  isActive: boolean;
  onComplete: () => void;
}

export default function FireworksCelebration({ isActive, onComplete }: FireworksCelebrationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fireworksRef = useRef<Fireworks | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Sound disabled - silent celebration

    // Initialize realistic fireworks
    const options = {
      speed: 3,
      acceleration: 1.05,
      friction: 0.98,
      gravity: 1.5,
      particles: 100,
      trace: 4,
      explosion: 8,
      autoresize: true,
      brightness: { min: 60, max: 100 },
      decay: { min: 0.015, max: 0.03 },
      mouse: { click: false, move: false, max: 1 },
      boundaries: {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      colors: [
        '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
        '#ffa500', '#ff69b4', '#32cd32', '#ffd700', '#ff1493', '#00ced1'
      ]
    };

    fireworksRef.current = new Fireworks(containerRef.current, options);
    fireworksRef.current.start();

    // Auto-hide after 25 seconds
    const timer = setTimeout(() => {
      if (fireworksRef.current) {
        fireworksRef.current.stop();
      }
      onComplete();
    }, 25000);

    return () => {
      if (fireworksRef.current) {
        fireworksRef.current.stop();
      }
      clearTimeout(timer);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Fireworks Container */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Celebration Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-200/10 to-transparent" />
      
      {/* Celebration Text - Left Side */}
      <div className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-red-500 mb-2 sm:mb-3 animate-pulse px-2" style={{
            textShadow: '0 0 50px rgba(255, 0, 0, 1), 0 0 100px rgba(255, 0, 0, 1), 0 0 150px rgba(255, 0, 0, 0.8), 0 0 200px rgba(255, 0, 0, 0.6), 0 0 250px rgba(255, 0, 0, 0.4)',
            fontFamily: '"Cinzel", "Playfair Display", "Georgia", "serif"',
            animation: 'flash 0.5s ease-in-out infinite alternate, pulse 2s ease-in-out infinite',
            filter: 'brightness(3) contrast(2) saturate(2)',
            letterSpacing: '0.1em',
            color: '#ff0000'
          }}>
            GOAL REACHED!
          </h1>
          <h2 className="text-lg sm:text-2xl font-bold text-red-400 mb-2 sm:mb-3 animate-pulse px-2" style={{
            textShadow: '0 0 40px rgba(255, 0, 0, 1), 0 0 80px rgba(255, 0, 0, 1), 0 0 120px rgba(255, 0, 0, 0.8), 0 0 160px rgba(255, 0, 0, 0.6)',
            fontFamily: '"Cinzel", "Playfair Display", "Georgia", "serif"',
            animation: 'pulse 2.5s ease-in-out infinite',
            filter: 'brightness(2.5) contrast(1.8) saturate(1.8)',
            letterSpacing: '0.05em',
            color: '#ff3333'
          }}>
            $1,000,000 Raised!
          </h2>
        </div>
      </div>

      {/* Celebration Text - Right Side */}
      <div className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
        <div className="text-center">
          <p className="text-lg sm:text-3xl font-bold text-purple-300 animate-pulse px-2" style={{
            textShadow: '0 0 50px rgba(168, 85, 247, 1), 0 0 100px rgba(168, 85, 247, 1), 0 0 150px rgba(168, 85, 247, 0.8), 0 0 200px rgba(168, 85, 247, 0.6), 0 0 250px rgba(168, 85, 247, 0.4)',
            fontFamily: '"Algerian", "Cinzel", "Playfair Display", "Georgia", "serif"',
            lineHeight: '1.3',
            animation: 'pulse 2s ease-in-out infinite',
            filter: 'brightness(3) contrast(2) saturate(2)',
            fontWeight: '700',
            letterSpacing: '0.05em',
            color: '#a855f7'
          }}>
            JazakAllah Khair!<br/>
            May Allah reward all<br/>
            donors abundantly
          </p>
        </div>
      </div>

      {/* Additional Sparkle Effects */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
    </div>
  );
}
