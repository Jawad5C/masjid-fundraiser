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
  // const [currentRecitation, setCurrentRecitation] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

         // Quranic verse from your project - Used in donation receipt
         const quranicVerses = [
           {
             id: 'project-verse',
             text: 'مَّن ذَا ٱلَّذِى يُقۡرِضُ ٱللَّهَ قَرۡضًا حَسَنًۭا فَيُضَـٰعِفَهُۥ لَهُۥ وَلَهُۥٓ أَجۡرٌۭ كَرِيمٌۭ',
             translation: 'Who is it that would loan Allah a goodly loan so He will multiply it for him and he will have a noble reward?',
             source: 'Qur&apos;an 57:11',
             audio: '/audio/test-quran-2-273.mp3', // Test audio - replace with Zain Abu Kautsar file
             reciter: 'Zain Abu Kautsar'
           }
         ];

         // Play random Quranic recitation
         const playQuranicRecitation = () => {
           if (isPlaying) return; // Prevent multiple simultaneous recitations

           const randomVerse = quranicVerses[Math.floor(Math.random() * quranicVerses.length)];
           // setCurrentRecitation(randomVerse.id);
           setIsPlaying(true);

           // Create audio element
           const audio = new Audio(randomVerse.audio);
           audioRef.current = audio;

           audio.onended = () => {
             setIsPlaying(false);
             // setCurrentRecitation(null);
             // Redirect after audio finishes
             onDonationClick();
           };

           audio.onerror = () => {
             // If audio file doesn't exist, redirect immediately
             setIsPlaying(false);
             // setCurrentRecitation(null);
             onDonationClick();
           };

           audio.play().catch(() => {
             // If audio fails, redirect immediately
             setIsPlaying(false);
             // setCurrentRecitation(null);
             onDonationClick();
           });
         };

         // Handle donation click with recitation
         const handleDonationClick = () => {
           playQuranicRecitation();
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

             {/* Beautiful transition overlay during audio */}
             {isPlaying && (
               <div className="fixed inset-0 bg-gradient-to-br from-green-900/90 via-emerald-800/90 to-teal-900/90 backdrop-blur-sm z-50 flex items-center justify-center">
                 <div className="text-center text-white">
                   <div className="mb-8">
                     <div className="text-6xl mb-4 animate-pulse">🕌</div>
                     <div className="text-2xl font-bold mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                       مَّن ذَا ٱلَّذِى يُقۡرِضُ ٱللَّهَ قَرۡضًا حَسَنًۭا فَيُضَـٰعِفَهُۥ لَهُۥ وَلَهُۥٓ أَجۡرٌۭ كَرِيمٌۭ
                     </div>
                     <div className="text-lg opacity-90 mb-4">
                       Who is it that would loan Allah a goodly loan so He will multiply it for him and he will have a noble reward?
                     </div>
                     <div className="text-sm font-semibold">
                       Qur&apos;an 57:11 • Recited by Zain Abu Kautsar
                     </div>
                   </div>
                   
                   {/* Animated loading dots */}
                   <div className="flex justify-center space-x-2">
                     <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                     <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                     <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                   </div>
                   
                   <div className="mt-4 text-sm opacity-75">
                     Preparing your donation page...
                   </div>
                 </div>
               </div>
             )}
           </div>
         );
}
