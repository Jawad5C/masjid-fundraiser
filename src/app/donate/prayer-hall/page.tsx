'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PrayerHallDonation() {
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Format phone number to (xxxx) xxx-xxxx
  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format based on length
    if (phoneNumber.length === 0) return '';
    if (phoneNumber.length <= 3) return `(${phoneNumber}`;
    if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  // Handle phone number change with formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setDonorInfo({...donorInfo, phone: formatted});
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Payment will be processed through external payment center
      alert('Thank you for your prayer hall donation! A tax receipt will be emailed to you.');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Starry Background */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {Array.from({ length: 200 }).map((_, i) => {
          // Use completely deterministic values to avoid hydration issues
          const left = ((i * 7 + 13) % 97) + 1.5; // Deterministic positioning
          const top = ((i * 11 + 17) % 95) + 2.5; // Deterministic positioning
          const delay = ((i * 3 + 5) % 30) / 10; // 0-3 seconds
          const duration = 2 + ((i * 2 + 7) % 20) / 10; // 2-4 seconds
          
          return (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`
              }}
            />
          );
        })}
      </div>

      {/* Header */}
      <div className="relative z-10 text-center pt-16 pb-8">
        <Link href="/" className="text-amber-400 hover:text-amber-300 text-lg mb-4 inline-block">
          ← Back to Fundraiser
        </Link>
        <h1 className="text-4xl font-bold text-white mb-4">🕌 Prayer Hall Fund</h1>
        <p className="text-amber-200 text-lg">Support the Heart of Our Community</p>
      </div>

      {/* Prayer Hall Impact */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 mb-8">
        <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-2xl shadow-2xl p-6 border border-green-400" style={{
          boxShadow: '0 0 30px rgba(34, 197, 94, 0.3), 0 0 60px rgba(34, 197, 94, 0.1)'
        }}>
          <h3 className="text-2xl font-bold text-white mb-4 text-center">Your Prayer Hall Donation Supports:</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🕌</div>
              <h4 className="text-lg font-semibold text-green-200 mb-2">Prayer Space</h4>
              <p className="text-green-100 text-sm">Maintaining and improving our main prayer hall for daily prayers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🕋</div>
              <h4 className="text-lg font-semibold text-green-200 mb-2">Qibla Direction</h4>
              <p className="text-green-100 text-sm">Ensuring proper Qibla alignment and prayer direction</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🕌</div>
              <h4 className="text-lg font-semibold text-green-200 mb-2">Jummah Services</h4>
              <p className="text-green-100 text-sm">Supporting Friday congregational prayers and special services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Form */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-8 border border-amber-400" style={{
          boxShadow: '0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1)'
        }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Donation Amount */}
            <div>
              <label className="block text-white text-lg font-semibold mb-4">Donation Amount</label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[100, 250, 500, 1000, 2500, 5000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setDonationAmount(amount.toString());
                      setCustomAmount('');
                    }}
                    className={`p-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                      donationAmount === amount.toString()
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-slate-700 text-green-200 hover:bg-slate-600'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Custom Amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setDonationAmount('');
                  }}
                  className="flex-1 p-4 rounded-xl bg-slate-700 text-white placeholder-gray-400 border border-green-400 focus:border-green-300 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setDonationAmount(customAmount)}
                  className="px-6 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
                >
                  Set
                </button>
              </div>
            </div>

            {/* Donor Information */}
            <div className="space-y-4">
              <h3 className="text-white text-xl font-semibold">Donor Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  required
                  value={donorInfo.name}
                  onChange={(e) => setDonorInfo({...donorInfo, name: e.target.value})}
                  className="p-4 rounded-xl bg-slate-700 text-white placeholder-gray-400 border border-amber-400 focus:border-amber-300 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  required
                  value={donorInfo.email}
                  onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})}
                  className="p-4 rounded-xl bg-slate-700 text-white placeholder-gray-400 border border-amber-400 focus:border-amber-300 focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone Number (xxx) xxx-xxxx"
                  value={donorInfo.phone}
                  onChange={handlePhoneChange}
                  maxLength={14}
                  className="p-4 rounded-xl bg-slate-700 text-white placeholder-gray-400 border border-amber-400 focus:border-amber-300 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={donorInfo.address}
                  onChange={(e) => setDonorInfo({...donorInfo, address: e.target.value})}
                  className="p-4 rounded-xl bg-slate-700 text-white placeholder-gray-400 border border-amber-400 focus:border-amber-300 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={donorInfo.city}
                  onChange={(e) => setDonorInfo({...donorInfo, city: e.target.value})}
                  className="p-4 rounded-xl bg-slate-700 text-white placeholder-gray-400 border border-amber-400 focus:border-amber-300 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={donorInfo.state}
                  onChange={(e) => setDonorInfo({...donorInfo, state: e.target.value})}
                  className="p-4 rounded-xl bg-slate-700 text-white placeholder-gray-400 border border-amber-400 focus:border-amber-300 focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-white text-xl font-semibold mb-4">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-green-600"
                  />
                  <span className="text-white">Credit/Debit Card</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-green-600"
                  />
                  <span className="text-white">Bank Transfer</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="check"
                    checked={paymentMethod === 'check'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-green-600"
                  />
                  <span className="text-white">Check (Mail-in)</span>
                </label>
              </div>
            </div>

            {/* Tax Receipt Info */}
            <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-6 border-2 border-green-500" style={{
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.1)'
            }}>
              <h4 className="text-white text-lg font-bold mb-3 flex items-center">
                <span className="text-2xl mr-2">📄</span>
                Tax Receipt Information
              </h4>
              <p className="text-green-100 text-sm leading-relaxed">
                <strong className="text-white">WICC is a registered 501(c)(3) non-profit organization.</strong> Your prayer hall donation is tax-deductible. 
                A receipt will be automatically generated and emailed to you upon completion of your donation.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing || (!donationAmount && !customAmount)}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold text-xl rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              style={{
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.5), 0 0 40px rgba(34, 197, 94, 0.3)'
              }}
            >
              {isProcessing ? 'Processing Donation...' : `Donate $${donationAmount || customAmount || '0'} to Prayer Hall`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
