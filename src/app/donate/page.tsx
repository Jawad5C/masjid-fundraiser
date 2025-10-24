'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StarryBackground from '@/components/StarryBackground';
import DonationReceipt from '@/components/DonationReceipt';
import StripePayment from '@/components/StripePayment';
import PledgeForm from '@/components/PledgeForm';
import { useDonations } from '@/contexts/DonationContext';

export default function UnifiedDonation() {
  const { addDonation } = useDonations();
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
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [showPledgeForm, setShowPledgeForm] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [receiptPreferences, setReceiptPreferences] = useState({
    email: true,
    sms: false,
    print: false
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      setShowStripeForm(true);
    } else if (paymentMethod === 'pledge') {
      setShowPledgeForm(true);
    }
  };

  // Handle receipt delivery based on preferences
  const handleReceiptDelivery = async (donationData: any) => {
    const receiptMethods = [];
    
    if (receiptPreferences.email && donorInfo.email) {
      receiptMethods.push('email');
      // TODO: Implement email service (SendGrid, AWS SES, etc.)
      console.log(`📧 Email receipt will be sent to: ${donorInfo.email}`);
    }
    
    if (receiptPreferences.sms && donorInfo.phone) {
      receiptMethods.push('sms');
      // TODO: Implement SMS service (Twilio, AWS SNS, etc.)
      console.log(`📱 SMS receipt will be sent to: ${donorInfo.phone}`);
    }
    
    if (receiptPreferences.print) {
      receiptMethods.push('print');
      // TODO: Generate printable receipt
      console.log(`📄 Print receipt will be generated`);
    }
    
    return receiptMethods;
  };

  // Handle successful payment
  const handlePaymentSuccess = async () => {
    // Donation is already added by StripePayment component
    setShowStripeForm(false);
    setShowReceipt(true);
  };

  // Handle payment error
  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setShowStripeForm(false);
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
                  placeholder="Phone Number"
                  value={donorInfo.phone}
                  onChange={(e) => setDonorInfo({...donorInfo, phone: e.target.value})}
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
                  <span className="text-white">Credit/Debit Card (Stripe)</span>
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
              <h3 className="text-white text-xl font-semibold mb-4">Receipt Delivery</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={receiptPreferences.email}
                    onChange={(e) => setReceiptPreferences({...receiptPreferences, email: e.target.checked})}
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                  <span className="text-white">📧 Email receipt to {donorInfo.email || 'your email'}</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={receiptPreferences.sms}
                    onChange={(e) => setReceiptPreferences({...receiptPreferences, sms: e.target.checked})}
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                  <span className="text-white">📱 SMS receipt to {donorInfo.phone || 'your phone'}</span>
                </label>
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
              <p className="text-amber-200 text-sm mt-2">
                💡 <strong>Tip:</strong> Email receipts are automatically sent. SMS and print options are available for your convenience.
              </p>
            </div>

            {/* QR Code Section */}
            <div className="bg-gradient-to-br from-amber-900 to-amber-800 rounded-xl p-6 border-2 border-amber-500" style={{
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.1)'
            }}>
              <h4 className="text-white text-lg font-bold mb-3 flex items-center">
                <span className="text-2xl mr-2">📱</span>
                Quick Donate with QR Code
              </h4>
              <div className="flex items-center space-x-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs">QR Code Placeholder</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-amber-100 text-sm leading-relaxed">
                    <strong className="text-white">Scan to donate instantly!</strong> Use your phone's camera to scan this QR code for quick mobile donations.
                  </p>
                  <p className="text-amber-200 text-xs mt-2">
                    Compatible with Apple Pay, Google Pay, and other mobile payment apps.
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
                Receipts will be delivered according to your preferences above (email, SMS, or print).
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

      {/* Stripe Payment Modal */}
      {showStripeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                    <h2 className="text-2xl font-bold">Secure Payment</h2>
                    <p className="text-green-100">Complete your donation to WICC</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStripeForm(false)}
                  className="text-white hover:text-green-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <StripePayment
                amount={parseInt(donationAmount || customAmount || '0')}
                donorInfo={donorInfo}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          </div>
        </div>
      )}

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
