'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import StarryBackground from '@/components/StarryBackground';
import DonationReceipt from '@/components/DonationReceipt';
import PledgeForm from '@/components/PledgeForm';
import { useDonations } from '@/contexts/DonationContext';

function UnifiedDonationContent() {
  const { addDonation } = useDonations();
  const searchParams = useSearchParams();
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
  const [showReceipt, setShowReceipt] = useState(false);
  const [showPledgeForm, setShowPledgeForm] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Set the donation amount from URL parameter
  useEffect(() => {
    const amount = searchParams.get('amount');
    if (amount) {
      setDonationAmount(amount);
    }
  }, [searchParams]);

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
    
    if (paymentMethod === 'card') {
      // Redirect to external payment center
      const paymentUrl = `https://payments.madinaapps.com/WICC/9409fc5e-b6c0-4203-907b-2fe1ad4e3bd1`;
      window.open(paymentUrl, '_blank');
      
      // Record the donation immediately
      const amount = parseInt(donationAmount || customAmount || '0');
      await addDonation({
        amount,
        donorName: donorInfo.name,
        donorEmail: donorInfo.email,
        donorPhone: donorInfo.phone,
        type: 'donation',
        paymentMethod: 'card',
        status: 'pending' // Pending until payment center processes
      });
      
      // Redirect to main page to show updated minaret
      window.location.href = '/';
    } else if (paymentMethod === 'pledge') {
      setShowPledgeForm(true);
    } else {
      // For other payment methods, show receipt directly
      const amount = parseInt(donationAmount || customAmount || '0');
      await addDonation({
        amount,
        donorName: donorInfo.name,
        donorEmail: donorInfo.email,
        donorPhone: donorInfo.phone,
        type: 'donation',
        paymentMethod: 'other',
        status: 'completed'
      });
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setShowReceipt(true);
      }, 2000);
    }
  };


  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Starry Background */}
      <StarryBackground />

      {/* Header */}
      <div className="relative z-10 text-center pt-16 pb-8">
        <Link href="/" className="text-amber-400 hover:text-amber-300 text-lg mb-4 inline-block">
          ← Back to Fundraiser
        </Link>
        <h1 className="text-4xl font-bold text-white mb-4">🕌 Masjid Fundraiser</h1>
        <p className="text-amber-200 text-lg mb-8">Supporting the Waterbury Islamic Cultural Center</p>
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
                {[25, 50, 100, 250, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setDonationAmount(amount.toString());
                      setCustomAmount('');
                    }}
                    className={`p-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                      donationAmount === amount.toString()
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-slate-700 text-purple-200 hover:bg-slate-600'
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
                  className="flex-1 p-4 rounded-xl bg-slate-700 text-white placeholder-gray-400 border border-purple-400 focus:border-purple-300 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setDonationAmount(customAmount)}
                  className="px-6 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
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
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-purple-600 mt-1"
                  />
                  <div className="flex flex-col">
                    <span className="text-white font-medium">Credit/Debit Card</span>
                    <span className="text-amber-300 text-sm mt-1">(You will be redirected to the Masjid Payment Processing Page)</span>
                  </div>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="pledge"
                    checked={paymentMethod === 'pledge'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-purple-600"
                  />
                  <span className="text-white">Pledge (Commit to donate later)</span>
                </label>
              </div>
            </div>

            {/* QR Code Display Areas - Always Visible */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl p-6 border-2 border-purple-500" style={{
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}>
              <h3 className="text-xl font-bold text-purple-200 mb-6 flex items-center justify-center">
                <span className="text-2xl mr-3">📱</span>
                QR Code Payment Options
              </h3>
              
              {/* Two QR Codes Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Masjid Payment QR Code */}
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg border-2 border-green-300">
                    <img 
                      src="/qr-codes/masjid-payment-qr.png" 
                      alt="Masjid Payment QR Code" 
                      className="w-48 h-48 mx-auto rounded-lg"
                    />
                  </div>
                  <p className="text-green-100 text-sm mt-3">
                    Masjid Payment QR
                  </p>
                </div>

                {/* LaunchGood QR Code */}
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
                    <img 
                      src="/qr-codes/launchgood-qr.png" 
                      alt="LaunchGood QR Code" 
                      className="w-48 h-48 mx-auto rounded-lg"
                    />
                  </div>
                  <p className="text-blue-100 text-sm mt-3">
                    LaunchGood QR
                  </p>
                </div>
              </div>
            </div>

            {/* Tax Receipt Info */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl p-6 border-2 border-purple-500" style={{
              boxShadow: '0 0 20px rgba(147, 51, 234, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.1)'
            }}>
              <h4 className="text-white text-lg font-bold mb-3 flex items-center">
                <span className="text-2xl mr-2">📄</span>
                Tax Receipt Information
              </h4>
              <p className="text-purple-100 text-sm leading-relaxed">
                <strong className="text-white">WICC is a registered 501(c)(3) non-profit organization.</strong> Your donation is tax-deductible. 
                A receipt will be automatically generated and emailed to you upon completion of your donation.
              </p>
            </div>

            {/* Payment Error Display */}
            {paymentError && (
              <div className="bg-red-600 text-white p-4 rounded-xl border border-red-500">
                <p className="font-semibold">Payment Error</p>
                <p className="text-sm">{paymentError}</p>
                <button 
                  onClick={() => setPaymentError('')}
                  className="mt-2 text-red-200 hover:text-white text-sm underline"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing || (!donationAmount && !customAmount)}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold text-xl rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              style={{
                boxShadow: '0 0 20px rgba(147, 51, 234, 0.5), 0 0 40px rgba(147, 51, 234, 0.3)'
              }}
            >
              {isProcessing ? (
                'Processing Donation...'
              ) : paymentMethod === 'card' ? (
                <div className="flex flex-col items-center">
                  <span>Donate ${donationAmount || customAmount || '0'} to WICC</span>
                  <span className="text-amber-200 text-sm font-normal mt-1">(You will be redirected to the Masjid Payment Processing Page)</span>
                </div>
              ) : (
                `Donate $${donationAmount || customAmount || '0'} to WICC`
              )}
            </button>
          </form>
        </div>
      </div>


      {/* Pledge Form Modal */}
      {showPledgeForm && (
        <PledgeForm
          donorInfo={donorInfo}
          donationAmount={donationAmount}
          customAmount={customAmount}
          onClose={() => setShowPledgeForm(false)}
        />
      )}

      {/* Donation Receipt Modal */}
      {showReceipt && (
        <DonationReceipt
          donorInfo={donorInfo}
          donationAmount={donationAmount}
          customAmount={customAmount}
          paymentMethod={paymentMethod}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
}

export default function UnifiedDonation() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-xl">Loading donation form...</div>
    </div>}>
      <UnifiedDonationContent />
    </Suspense>
  );
}
