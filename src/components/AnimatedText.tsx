'use client';

import { useState, useEffect } from 'react';

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

const animations = [
  'star-emerge-fade-out',
  'star-emerge-blur-away', 
  'star-emerge-shrink-away',
  'star-emerge-fade-to-star',
  'star-emerge-flash-away',
  'star-emerge-disintegrate',
  'star-emerge-burn-away',
  'star-emerge-glitch-away',
  'star-emerge-melt-away'
];

export default function AnimatedText({ children, className, style, delay = 0 }: AnimatedTextProps) {
  const [currentAnimation, setCurrentAnimation] = useState(animations[0]);

  useEffect(() => {
    const cycleAnimations = () => {
      const randomIndex = Math.floor(Math.random() * animations.length);
      setCurrentAnimation(animations[randomIndex]);
    };

    // Start cycling after initial delay
    const timeout = setTimeout(cycleAnimations, delay * 1000);
    
    // Set up interval to change animation every 19 seconds (full cycle)
    const interval = setInterval(cycleAnimations, 19000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [delay]);

  return (
    <div 
      className={className}
      style={{
        ...style,
        animation: `${currentAnimation} 19s ease-in-out infinite ${delay}s`
      }}
    >
      {children}
    </div>
  );
}
