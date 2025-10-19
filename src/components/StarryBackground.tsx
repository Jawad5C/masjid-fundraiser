'use client';

import { useEffect, useState } from 'react';

// Component for animated stars that only renders on client side
export default function StarryBackground() {
  const [stars, setStars] = useState<Array<{
    left: string;
    top: string;
    animationDelay: string;
    animationDuration: string;
  }>>([]);

  useEffect(() => {
    // Generate stars only on client side to avoid hydration mismatch
    const generatedStars = [];
    
    // Simple approach: More stars at top, fewer in middle
    for (let i = 0; i < 200; i++) {
      const top = Math.random() * 100;
      let shouldInclude = true;
      
      // More stars at top (0-30%), fewer in middle (30-70%), some at bottom (70-100%)
      if (top < 30) {
        shouldInclude = Math.random() < 0.8; // 80% chance in top area
      } else if (top < 70) {
        shouldInclude = Math.random() < 0.1; // 10% chance in middle area (minaret)
      } else {
        shouldInclude = Math.random() < 0.3; // 30% chance in bottom area
      }
      
      if (shouldInclude) {
        generatedStars.push({
          left: `${Math.random() * 100}%`,
          top: `${top}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 2}s`
        });
      }
    }
    
    setStars(generatedStars);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-5">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.animationDelay,
            animationDuration: star.animationDuration,
            boxShadow: '0 0 4px rgba(255, 255, 255, 0.8), 0 0 8px rgba(255, 255, 255, 0.4)',
            filter: 'brightness(1.2)'
          }}
        />
      ))}
    </div>
  );
}
