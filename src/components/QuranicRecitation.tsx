'use client';

import { useState, useRef } from 'react';

interface QuranicRecitationProps {
  onDonationClick: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function QuranicRecitation({ onDonationClick, children, className, style }: QuranicRecitationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRecitation, setCurrentRecitation] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Quranic verse from your project - Abu Huraira hadith
  const quranicVerses = [
    {
      id: 'project-verse',
      text: 'مَنْ بَنَى مَسْجِدًا لِلَّهِ بَنَى اللَّهُ لَهُ مِثْلَهُ فِي الْجَنَّةِ',
      translation: 'Whoever builds a Masjid for Allah, Allah will build for him a house like it in Paradise',
      source: 'Hadith - Abu Huraira (RA) • Sunan Ibn Majah 242',
      audio: '/audio/omar-hisham-masjid-verse.mp3', // Omar Hisham recitation
      reciter: 'Omar Hisham Al Arabi'
    }
  ];

  // Play random Quranic recitation
  const playQuranicRecitation = () => {
    if (isPlaying) return; // Prevent multiple simultaneous recitations
    
    const randomVerse = quranicVerses[Math.floor(Math.random() * quranicVerses.length)];
    setCurrentRecitation(randomVerse.id);
    setIsPlaying(true);

    // Create audio element
    const audio = new Audio(randomVerse.audio);
    audioRef.current = audio;
    
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentRecitation(null);
    };

    audio.onerror = () => {
      // If audio file doesn't exist, show text instead
      console.log(`Playing: ${randomVerse.text}`);
      console.log(`Translation: ${randomVerse.translation}`);
      console.log(`Source: ${randomVerse.source}`);
      
      // Show text for 3 seconds if audio fails
      setTimeout(() => {
        setIsPlaying(false);
        setCurrentRecitation(null);
      }, 3000);
    };

    audio.play().catch(() => {
      // If audio fails, show text instead
      console.log(`Playing: ${randomVerse.text}`);
      console.log(`Translation: ${randomVerse.translation}`);
      console.log(`Source: ${randomVerse.source}`);
      
      setTimeout(() => {
        setIsPlaying(false);
        setCurrentRecitation(null);
      }, 3000);
    });
  };

  // Handle donation click with recitation
  const handleDonationClick = () => {
    playQuranicRecitation();
    onDonationClick();
  };

  return (
    <div className="relative">
      <button
        onClick={handleDonationClick}
        disabled={isPlaying}
        className={`${className} ${isPlaying ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'} transition-all duration-300`}
        style={style}
      >
        {children}
      </button>
      
      {/* Quranic text display */}
      {isPlaying && currentRecitation && (
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-800 to-green-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm text-center">
          <div className="text-sm font-bold mb-2">📖 Quranic Recitation</div>
          <div className="text-lg font-bold mb-2" style={{ fontFamily: 'Amiri, serif' }}>
            {quranicVerses.find(v => v.id === currentRecitation)?.text}
          </div>
          <div className="text-sm mt-2 opacity-90">
            {quranicVerses.find(v => v.id === currentRecitation)?.translation}
          </div>
          <div className="text-xs mt-2 font-semibold">
            {quranicVerses.find(v => v.id === currentRecitation)?.source}
          </div>
          <div className="text-xs mt-1 opacity-80">
            Recited by: {quranicVerses.find(v => v.id === currentRecitation)?.reciter}
          </div>
        </div>
      )}
    </div>
  );
}
