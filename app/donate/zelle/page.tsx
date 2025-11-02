'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import StarryBackground from '@/components/StarryBackground';

function ZellePaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [donationAmount, setDonationAmount] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Get amount from URL parameter
  useEffect(() => {
    const amount = searchParams.get('amount');
    if (amount) {
      setDonationAmount(amount);
    }
  }, [searchParams]);

  // Play Quranic recitation audio
  const playQuranicRecitation = (): Promise<void> => {
    return new Promise((resolve) => {
      if (isPlayingAudio) {
        resolve();
        return;
      }

      setIsPlayingAudio(true);

      // Quranic verse from your project
      const quranicVerse = {
        audio: '/audio/test-quran-2-273.mp3',
        arabic: 'مَّن ذَا ٱلَّذِى يُقۡرِضُ ٱللَّهَ قَرۡضًا حَسَنًۭا فَيُضَـٰعِفَهُۥ لَهُۥ وَلَهُۥٓ أَجۡرٌۭ كَرِيمٌۭ',
        translation: 'Who is it that would loan Allah a goodly loan so He will multiply it for him and he will have a noble reward?',
        source: "Qur'an 57:11",
        reciter: 'Zain Abu Kautsar'
      };

      // Create audio element
      const audio = new Audio(quranicVerse.audio);
      audio.playbackRate = 1.40; // Play 40% faster

      audio.onended = () => {
        setIsPlayingAudio(false);
        resolve();
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
        resolve();
      };

      audio.play().catch(() => {
        setIsPlayingAudio(false);
        resolve();
      });
    });
  };

  // Handle return to main page
  const handleReturnToMain = async () => {
    // Play audio before returning
    await playQuranicRecitation();
    router.push('/');
  };

  // Copy email to clipboard
  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText('Info@waterburyicc.org');
    alert('Email copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Starry Background */}
      <StarryBackground />

      {/* Header */}
      <div className="relative z-10 text-center pt-16 pb-8">
        <Link href="/donate" className="text-amber-400 hover:text-amber-300 text-lg mb-4 inline-block">
          ← Back to Donation Form
        </Link>
        <h1 className="text-4xl font-bold text-white mb-4">💚 Zelle Payment</h1>
        <p className="text-cyan-200 text-lg mb-8">Complete your donation via Zelle</p>
      </div>

      {/* Zelle Payment Instructions */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-br from-cyan-900 to-blue-900 rounded-2xl shadow-2xl p-8 sm:p-12 border-2 border-cyan-400" style={{
          boxShadow: '0 0 30px rgba(34, 211, 238, 0.5), 0 0 60px rgba(34, 211, 238, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)'
        }}>
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4" style={{
              boxShadow: '0 0 30px rgba(34, 211, 238, 0.6), 0 0 60px rgba(34, 211, 238, 0.4)'
            }}>
              <span className="text-4xl">💚</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Donation Recorded Successfully!</h2>
            {donationAmount && (
              <div className="bg-white/10 rounded-xl p-4 mb-4 border border-cyan-400/30 inline-block">
                <p className="text-cyan-100 text-sm mb-1">Your Donation Amount</p>
                <p className="text-4xl font-bold text-white">${donationAmount}</p>
              </div>
            )}
          </div>

          {/* Zelle Information Card */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 sm:p-8 mb-6 border-2 border-cyan-400/50" style={{
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), inset 0 0 15px rgba(255, 255, 255, 0.1)'
          }}>
            <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center">
              <span className="text-3xl mr-3">💚</span>
              Zelle Payment Information
            </h3>

            {/* Email Address */}
            <div className="bg-gradient-to-r from-cyan-800/40 to-blue-800/40 rounded-xl p-6 mb-6 border border-cyan-400/30">
              <p className="text-cyan-200 text-sm font-semibold mb-3 text-center">Send Payment To:</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="bg-white/10 rounded-lg px-6 py-4 border border-cyan-400/40">
                  <p className="text-cyan-100 text-xs mb-1">Email Address</p>
                  <p className="text-2xl font-bold text-white font-mono">Info@waterburyicc.org</p>
                </div>
                <button
                  onClick={copyEmailToClipboard}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2"
                  style={{
                    boxShadow: '0 0 15px rgba(34, 211, 238, 0.4)'
                  }}
                >
                  <span>📋</span>
                  <span>Copy Email</span>
                </button>
              </div>
            </div>

            {/* Organization Name */}
            <div className="bg-gradient-to-r from-cyan-800/40 to-blue-800/40 rounded-xl p-6 mb-6 border border-cyan-400/30">
              <p className="text-cyan-200 text-sm font-semibold mb-3 text-center">Look For:</p>
              <div className="bg-white/10 rounded-lg px-6 py-4 border border-cyan-400/40 text-center">
                <p className="text-cyan-100 text-xs mb-1">Organization Name</p>
                <p className="text-2xl font-bold text-white">Waterbury Islamic Cultural Center</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white/5 rounded-xl p-6 border border-cyan-400/20">
              <h4 className="text-white font-bold text-lg mb-4 flex items-center">
                <span className="text-2xl mr-2">📱</span>
                How to Complete Your Zelle Payment
              </h4>
              <ol className="space-y-3 text-cyan-100 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="font-bold text-cyan-300 mr-2">1.</span>
                  <span>Open your banking app or Zelle app on your mobile device</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-cyan-300 mr-2">2.</span>
                  <span>Select &quot;Send Money&quot; or &quot;Send&quot; in Zelle</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-cyan-300 mr-2">3.</span>
                  <span>Enter the email address: <strong className="text-white font-mono">Info@waterburyicc.org</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-cyan-300 mr-2">4.</span>
                  <span>Look for &quot;<strong className="text-white">Waterbury Islamic Cultural Center</strong>&quot; as the recipient</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-cyan-300 mr-2">5.</span>
                  <span>Enter the donation amount: <strong className="text-white">${donationAmount || '[Your Amount]'}</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-cyan-300 mr-2">6.</span>
                  <span>Add a note (optional): &quot;Donation to Masjid Assalam Fundraiser&quot;</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-cyan-300 mr-2">7.</span>
                  <span>Review and confirm your payment</span>
                </li>
              </ol>
            </div>

            {/* Important Notes */}
            <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl p-6 mt-6 border-2 border-amber-500/40">
              <h4 className="text-white font-bold text-lg mb-3 flex items-center">
                <span className="text-2xl mr-2">⚠️</span>
                Important Notes
              </h4>
              <ul className="space-y-2 text-amber-100 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Your donation has been recorded and will be reflected on the fundraising thermometer</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Please send the exact amount: <strong className="text-white">${donationAmount || '[Your Amount]'}</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Zelle payments are typically instant and secure</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>A tax receipt will be emailed to you upon verification of payment</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Return Button */}
          <div className="text-center">
            <button
              onClick={handleReturnToMain}
              disabled={isPlayingAudio}
              className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold text-xl rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              style={{
                boxShadow: '0 0 25px rgba(34, 211, 238, 0.5), 0 0 50px rgba(34, 211, 238, 0.3)'
              }}
            >
              {isPlayingAudio ? 'Playing Recitation...' : 'Close & Return to Main Page'}
            </button>
          </div>
        </div>
      </div>

      {/* Audio Overlay - Shows during Quranic recitation */}
      {isPlayingAudio && (
        <div className="fixed inset-0 bg-gradient-to-br from-cyan-900/90 via-blue-800/90 to-indigo-900/90 backdrop-blur-sm z-50 flex items-center justify-center">
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
              Preparing your return...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ZellePayment() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-xl">Loading Zelle payment information...</div>
    </div>}>
      <ZellePaymentContent />
    </Suspense>
  );
}

