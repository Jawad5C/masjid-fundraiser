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

  // Quranic verses for donation context
  const quranicVerses = [
    {
      id: 'verse-1',
      text: 'وَمَا أَنْفَقْتُمْ مِنْ شَيْءٍ فَهُوَ يُخْلِفُهُ',
      translation: 'And whatever you spend of anything, He will replace it',
      source: 'Quran 34:39',
      audio: '/audio/quran-34-39.mp3' // You'll need to add this audio file
    },
    {
      id: 'verse-2', 
      text: 'مَنْ ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا فَيُضَاعِفَهُ لَهُ أَضْعَافًا كَثِيرَةً',
      translation: 'Who is it that would loan Allah a goodly loan so He may multiply it for him many times over',
      source: 'Quran 2:245',
      audio: '/audio/quran-2-245.mp3' // You'll need to add this audio file
    },
    {
      id: 'verse-3',
      text: 'إِنَّ الْمُصَّدِّقِينَ وَالْمُصَّدِّقَاتِ وَأَقْرَضُوا اللَّهَ قَرْضًا حَسَنًا يُضَاعَفُ لَهُمْ وَلَهُمْ أَجْرٌ كَرِيمٌ',
      translation: 'Indeed, the men who practice charity and the women who practice charity and loan Allah a goodly loan, it will be multiplied for them, and they will have a noble reward',
      source: 'Quran 57:18',
      audio: '/audio/quran-57-18.mp3' // You'll need to add this audio file
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
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-800 to-green-600 text-white p-3 rounded-lg shadow-lg z-50 max-w-xs text-center">
          <div className="text-sm font-bold mb-1">📖 Quranic Recitation</div>
          <div className="text-xs">
            {quranicVerses.find(v => v.id === currentRecitation)?.text}
          </div>
          <div className="text-xs mt-1 opacity-90">
            {quranicVerses.find(v => v.id === currentRecitation)?.translation}
          </div>
          <div className="text-xs mt-1 font-semibold">
            {quranicVerses.find(v => v.id === currentRecitation)?.source}
          </div>
        </div>
      )}
    </div>
  );
}
