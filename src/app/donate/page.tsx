'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import StarryBackground from '@/components/StarryBackground';
import DonationReceipt from '@/components/DonationReceipt';
import PledgeForm from '@/components/PledgeForm';
import { useDonations } from '@/contexts/DonationContext';

export default function UnifiedDonation() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>}>
      <UnifiedDonationContent />
    </Suspense>
  );
}

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
  const [isProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showPledgeForm, setShowPledgeForm] = useState(false);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [receiptPreferences, setReceiptPreferences] = useState({
    print: false
  });

  // Read URL parameter and set initial donation amount
  useEffect(() => {
    const amount = searchParams.get('amount');
    if (amount) {
      setDonationAmount(amount);
      setCustomAmount(''); // Clear custom amount if preset amount is selected
    }
  }, [searchParams]);

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Don't format if empty
    if (!phoneNumber) return '';
    
    // Format based on length
    if (phoneNumber.length <= 3) {
      return `(${phoneNumber}`;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  // Handle phone number input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setDonorInfo({...donorInfo, phone: formatted});
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      // First, record the donation on our site immediately
      const amount = parseInt(donationAmount || customAmount || '0');
      
      try {
        console.log('Recording donation:', { amount, donorName: donorInfo.name, status: 'pending' });
        
        await addDonation({
          amount,
          donorName: donorInfo.name,
          donorEmail: donorInfo.email,
          donorPhone: donorInfo.phone,
          type: 'donation',
          paymentMethod: 'card',
          status: 'pending', // Mark as pending until payment is completed
          notes: 'Payment to be completed via WICC Payment Center'
        });
        
        console.log('Donation recorded successfully');
        
        // Show confirmation message
        setShowPaymentConfirmation(true);
        
      } catch (error) {
        console.error('Error recording donation:', error);
        alert('Error recording donation. Please try again.');
      }
    } else if (paymentMethod === 'pledge') {
      setShowPledgeForm(true);
    }
  };

  // Handle proceeding to payment center
  const handleProceedToPayment = () => {
    const paymentUrl = `https://payments.madinaapps.com/WICC/9409fc5e-b6c0-4203-907b-2fe1ad4e3bd1`;
    window.open(paymentUrl, '_blank');
    
    // Redirect to main page to show updated minaret
    window.location.href = '/';
  };

  // Handle receipt delivery based on preferences - REMOVED (unused)
  // const handleReceiptDelivery = async (donationData: unknown) => {
  //   // Since we only have print option now, just log the preference
  //   if (receiptPreferences.print) {
  //     console.log('📄 Print receipt requested for tax purposes');
  //   }
  //   return [];
  // };


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
                         placeholder="(555) 123-4567"
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
                    className="w-5 h-5 text-purple-600"
                  />
                  <span className="text-white">Credit/Debit Card (WICC Payment Center)</span>
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

            {/* Receipt Delivery Preferences */}
            <div>
              <h3 className="text-white text-xl font-semibold mb-4">Receipt Options</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={receiptPreferences.print}
                    onChange={(e) => setReceiptPreferences({...receiptPreferences, print: e.target.checked})}
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                  <span className="text-white">📄 Print receipt (for tax purposes)</span>
                </label>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-gradient-to-br from-amber-900 to-amber-800 rounded-xl p-6 border-2 border-amber-500" style={{
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.1)'
            }}>
              <h4 className="text-white text-lg font-bold mb-4 flex items-center">
                <span className="text-2xl mr-2">📱</span>
                Quick Donate with QR Codes
              </h4>
              
              {/* Two QR Codes Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Masjid Custom Payment QR */}
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg mb-3">
                    <Image
                      src="/qr-codes/masjid-payment-qr.png"
                      alt="Masjid Payment QR Code"
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-lg"
                    />
                  </div>
                  <h5 className="text-white font-semibold mb-2">Masjid Payment Page</h5>
                  <p className="text-amber-100 text-sm">
                    Direct payment to WICC&apos;s custom donation system
                  </p>
                </div>

                {/* Launchgood QR */}
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg mb-3">
                    <Image
                      src="/qr-codes/launchgood-qr.png"
                      alt="Launchgood QR Code"
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-lg"
                    />
                  </div>
                  <h5 className="text-white font-semibold mb-2">Launchgood Platform</h5>
                  <p className="text-amber-100 text-sm">
                    Donate through Launchgood&apos;s trusted platform
                  </p>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-amber-100 text-sm">
                  <strong className="text-white">Scan either QR code to donate instantly!</strong> Use your phone&apos;s camera to scan for quick mobile donations.
                </p>
                <p className="text-amber-200 text-xs mt-2">
                  Compatible with Apple Pay, Google Pay, and other mobile payment apps.
                </p>
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
              </p>
              <div className="mt-3 text-purple-200 text-xs">
                <strong>Receipt includes:</strong> Donation amount, date, tax ID, and acknowledgment for tax purposes.
              </div>
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
              {isProcessing ? 'Processing Donation...' : `Donate $${donationAmount || customAmount || '0'} to WICC`}
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

             {/* Payment Confirmation Modal */}
             {showPaymentConfirmation && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                 <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                   {/* Payment Confirmation Header */}
                   <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-4">
                         <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
                           <Image 
                             src="/logo.jpeg" 
                             alt="WICC Logo" 
                             width={64}
                             height={64}
                             className="w-full h-full object-cover rounded-full"
                           />
                         </div>
                         <div>
                           <h2 className="text-2xl font-bold">Payment Confirmation</h2>
                           <p className="text-green-100">Waterbury Islamic Cultural Center</p>
                         </div>
                       </div>
                       <button
                         onClick={() => setShowPaymentConfirmation(false)}
                         className="text-white hover:text-green-200 transition-colors"
                       >
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                         </svg>
                       </button>
                     </div>
                   </div>

                   {/* Payment Confirmation Content */}
                   <div className="p-6 space-y-6">
                     {/* Thank You Message */}
                     <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
                       <h3 className="text-2xl font-bold text-green-800 mb-2">JazakAllah Khair!</h3>
                       <p className="text-lg text-green-700 mb-4">
                         Thank you for your generous donation of ${donationAmount || customAmount} to the Waterbury Islamic Cultural Center
                       </p>
                       <p className="text-sm text-green-600 italic">
                         &ldquo;And whatever you spend in charity or devotion, be sure Allah knows it all.&rdquo; - Quran 2:273
                       </p>
                     </div>

                     {/* Payment Instructions */}
                     <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-200">
                       <h4 className="font-bold text-amber-800 mb-4 flex items-center">
                         <span className="text-2xl mr-3">💳</span>
                         Complete Your Payment
                       </h4>
                       <div className="text-amber-700 space-y-3">
                         <p className="font-semibold">You will now be redirected to our secure payment center to complete your donation.</p>
                         <div className="bg-white p-4 rounded-lg border border-amber-300">
                           <p className="text-sm"><strong>Donation Amount:</strong> ${donationAmount || customAmount}</p>
                           <p className="text-sm"><strong>Donor:</strong> {donorInfo.name}</p>
                           <p className="text-sm"><strong>Email:</strong> {donorInfo.email}</p>
                         </div>
                         <p className="text-sm">Once payment is processed, you will receive a receipt via email for tax purposes.</p>
                       </div>
                     </div>

                     {/* Receipt Information */}
                     <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                       <h4 className="font-bold text-purple-800 mb-3 flex items-center">
                         <span className="text-2xl mr-2">📄</span>
                         Receipt Information
                       </h4>
                       <div className="text-purple-700 space-y-2">
                         <p><strong>Tax Receipt:</strong> You will receive an email receipt once payment is processed</p>
                         <p><strong>Organization:</strong> Waterbury Islamic Cultural Center (WICC)</p>
                         <p><strong>Tax ID:</strong> 83-3099502</p>
                         <p className="text-sm italic mt-2">
                           WICC is a registered 501(c)(3) non-profit organization. Your donation is tax-deductible.
                         </p>
                       </div>
                     </div>

                     {/* Impact Statement */}
                     <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                       <h4 className="font-bold text-green-800 mb-3 flex items-center">
                         <span className="text-2xl mr-2">🌟</span>
                         Your Donation Impact
                       </h4>
                       <p className="text-green-700">
                         Your generous donation of ${donationAmount || customAmount} will directly support our new masjid&apos;s vision through prayer services, 
                         education programs, community events, janazah services, recreation facilities, and nikah ceremonies. 
                         May Allah reward you abundantly for your generosity.
                       </p>
                     </div>

                     {/* Contact Information */}
                     <div className="text-center text-sm text-slate-600 border-t pt-4">
                       <p><strong>Waterbury Islamic Cultural Center</strong></p>
                       <p>For questions about this donation, please contact us at:</p>
                       <p>Email: info@waterburyicc.org | Phone: (203) 510-0400</p>
                     </div>
                   </div>

                   {/* Action Buttons */}
                   <div className="flex justify-center space-x-4 p-6 bg-slate-50 rounded-b-2xl">
                     <button
                       onClick={handleProceedToPayment}
                       className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center"
                     >
                       <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                       </svg>
                       Proceed to Payment Center
                     </button>
                     <button
                       onClick={() => setShowPaymentConfirmation(false)}
                       className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                     >
                       Cancel
                     </button>
                   </div>
                 </div>
               </div>
             )}
           </div>
         );
       }
