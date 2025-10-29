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
  console.log('📄 UnifiedDonationContent: Component loaded');
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
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [showPledgeForm, setShowPledgeForm] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [qr1DonationAmount, setQr1DonationAmount] = useState('');
  const [qr2DonationAmount, setQr2DonationAmount] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  // Set the donation amount from URL parameter
  useEffect(() => {
    const amount = searchParams.get('amount');
    console.log('🔗 URL amount parameter:', amount);
    if (amount) {
      setDonationAmount(amount);
      console.log('🔗 Set donation amount to:', amount);
    }
  }, [searchParams]);

  // Auto-populate QR amount fields when QR payment method is selected
  useEffect(() => {
    if (paymentMethod === 'qr1' && donationAmount && !qr1DonationAmount) {
      setQr1DonationAmount(donationAmount);
    }
    if (paymentMethod === 'qr2' && donationAmount && !qr2DonationAmount) {
      setQr2DonationAmount(donationAmount);
    }
  }, [paymentMethod, donationAmount, qr1DonationAmount, qr2DonationAmount]);

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

  // QR Code donation handler removed - functionality moved to Donate to WICC button

  // Credit/Debit Card donation handler - Using EXACT same logic as pledge
  const handleCardDonation = async () => {
    const amount = parseInt(donationAmount || customAmount || '0');
    
    try {
      // EXACT same logic as pledge - this works perfectly
      await addDonation({
        amount,
        donorName: donorInfo.name,
        donorEmail: donorInfo.email,
        donorPhone: donorInfo.phone,
        type: 'donation',
        paymentMethod: 'card',
        status: 'completed',
        notes: 'Payment via WICC Payment Center'
      });
      
      // Redirect to payment page AFTER donation is recorded (like pledge)
      window.open('https://payments.madinaapps.com/WICC/9409fc5e-b6c0-4203-907b-2fe1ad4e3bd1', '_blank');
      
      // Redirect to main page to show updated tower
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting card donation:', error);
      alert('Failed to submit donation. Please try again.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    if (paymentMethod === 'card') {
      await handleCardDonation();
    } else if (paymentMethod === 'qr1' || paymentMethod === 'qr2') {
      // Handle QR code donations
      const amount = parseInt(donationAmount || customAmount || '0');
      
      if (amount <= 0) {
        alert('Please enter a valid donation amount');
        return;
      }
      
      try {
        // Record the donation immediately
        await addDonation({
          amount,
          donorName: donorInfo.name,
          donorEmail: donorInfo.email,
          donorPhone: donorInfo.phone,
          type: 'donation',
          paymentMethod: paymentMethod,
          status: 'completed',
          notes: `QR Code Payment - ${paymentMethod === 'qr1' ? 'Masjid Payment QR' : 'LaunchGood QR'}`
        });
        
        // Show QR modal
        setShowQrModal(true);
        
      } catch (error) {
        console.error('Error submitting QR donation:', error);
        alert('Failed to submit donation. Please try again.');
      }
    } else if (paymentMethod === 'pledge') {
      setShowPledgeForm(true);
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
        <h1 className="text-4xl font-bold text-white mb-4">🕌 Masjid Assalam Fundraising</h1>
        <p className="text-amber-200 text-lg mb-8">Supporting the Waterbury Islamic Cultural Center</p>
      </div>

      {/* Donation Form */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-8 border border-amber-400" style={{
          boxShadow: '0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1)'
        }}>
          <form onSubmit={(e) => {
            console.log('📝 Form onSubmit triggered');
            handleSubmit(e);
          }} className="space-y-6">
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
                
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="qr1"
                    checked={paymentMethod === 'qr1'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-purple-600 mt-1"
                  />
                  <div className="flex flex-col">
                    <span className="text-white font-medium">Masjid Payment QR Code</span>
                    <span className="text-green-300 text-sm mt-1">Press &quot;Donate to WICC&quot; button below to get QR code</span>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="qr2"
                    checked={paymentMethod === 'qr2'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-purple-600 mt-1"
                  />
                  <div className="flex flex-col">
                    <span className="text-white font-medium">LaunchGood QR Code</span>
                    <span className="text-blue-300 text-sm mt-1">Press &quot;Donate to WICC&quot; button below to get QR code</span>
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
              disabled={!donationAmount && !customAmount}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (paymentMethod === 'card') {
                  await handleCardDonation();
                } else {
                  handleSubmit(e);
                }
              }}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold text-xl rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              style={{
                boxShadow: '0 0 20px rgba(147, 51, 234, 0.5), 0 0 40px rgba(147, 51, 234, 0.3)'
              }}
            >
              {paymentMethod === 'card' ? (
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

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border-2 border-green-500" style={{
            boxShadow: '0 0 30px rgba(34, 197, 94, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)'
          }}>
            <div className="p-6 text-center">
              {/* Success Icon */}
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3" style={{
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.6)'
                }}>
                  <span className="text-3xl">✅</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-white mb-4">
                Donation Recorded Successfully!
              </h2>

              {/* Amount */}
              <div className="bg-white/10 rounded-xl p-3 mb-4 border border-green-400/30">
                <p className="text-green-100 text-sm mb-1">Donation Amount</p>
                <p className="text-2xl font-bold text-white">
                  ${donationAmount || customAmount}
                </p>
              </div>

              {/* QR Code Display */}
              <div className="bg-white/10 rounded-xl p-4 mb-4 border border-green-400/30">
                <p className="text-green-100 text-sm mb-3">Scan QR Code to Complete Payment</p>
                <div className="bg-white p-3 rounded-lg inline-block">
                  <Image
                    src={paymentMethod === 'qr1' ? '/qr-codes/masjid-payment-qr.png' : '/qr-codes/launchgood-qr.png'}
                    alt={paymentMethod === 'qr1' ? 'Masjid Payment QR Code' : 'LaunchGood QR Code'}
                    width={150}
                    height={150}
                    className="w-36 h-36 rounded-lg"
                  />
                </div>
                <p className="text-white font-semibold mt-3 text-sm">
                  {paymentMethod === 'qr1' ? 'Masjid Payment QR Code' : 'LaunchGood QR Code'}
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-white/5 rounded-xl p-3 mb-4 border border-green-400/20">
                <p className="text-green-200 text-xs leading-relaxed">
                  <span className="font-semibold text-white">Instructions:</span><br/>
                  1. Use your phone&apos;s camera to scan the QR code above<br/>
                  2. Complete the payment through the mobile app<br/>
                  3. Your donation has been recorded and will be reflected on the fundraising thermometer
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowQrModal(false);
                  window.location.href = '/';
                }}
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors duration-300"
                style={{
                  boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)'
                }}
              >
                Close & Return to Main Page
              </button>
            </div>
          </div>
        </div>
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
