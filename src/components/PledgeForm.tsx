'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useDonations } from '@/contexts/DonationContext';

interface PledgeFormProps {
  donorInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  donationAmount: string;
  customAmount: string;
  onClose: () => void;
}

export default function PledgeForm({ 
  donorInfo, 
  donationAmount, 
  customAmount, 
  onClose 
}: PledgeFormProps) {
  console.log('🔧 PledgeForm: Component loaded/rendered');
  const { addDonation } = useDonations();
  console.log('PledgeForm - addDonation from context:', addDonation);
  const [pledgeDetails, setPledgeDetails] = useState({
    pledgeDate: '',
    paymentMethod: '',
    notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  // Handle phone number change with formatting (unused - phone formatting handled in parent)
  // const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const formatted = formatPhoneNumber(e.target.value);
  //   setDonorInfo({...donorInfo, phone: formatted});
  // };
  
  const finalAmount = donationAmount || customAmount;
  const pledgeNumber = `PLEDGE-${Date.now().toString().slice(-6)}`;
  const pledgeDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('🔧 PledgeForm: handleSubmit called');
    e.preventDefault();
    const amount = parseInt(donationAmount || customAmount || '0');
    
    try {
      await addDonation({
        amount,
        donorName: donorInfo.name,
        donorEmail: donorInfo.email,
        donorPhone: donorInfo.phone,
        type: 'pledge',
        paymentMethod: 'pledge',
        status: 'completed',
        notes: `Pledge for ${pledgeDetails.pledgeDate} via ${pledgeDetails.paymentMethod}. ${pledgeDetails.notes}`
      });

      // Save pledge to localStorage for admin dashboard
      const pledgeData = {
        id: `pledge-${Date.now()}`,
        donorName: donorInfo.name,
        donorEmail: donorInfo.email,
        donorPhone: donorInfo.phone,
        donorAddress: donorInfo.address,
        donorCity: donorInfo.city,
        donorState: donorInfo.state,
        donorZip: donorInfo.zip,
        pledgeAmount: amount,
        pledgeDate: pledgeDetails.pledgeDate,
        paymentMethod: pledgeDetails.paymentMethod,
        notes: pledgeDetails.notes,
        pledgeNumber: pledgeNumber,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };

      // Get existing pledges and add new one
      const existingPledges = JSON.parse(localStorage.getItem('adminPledges') || '[]');
      existingPledges.push(pledgeData);
      localStorage.setItem('adminPledges', JSON.stringify(existingPledges));
      
      // Pledge saved successfully
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting pledge:', error);
      alert('Failed to submit pledge. Please try again.');
    }
  };


  const handlePrint = () => {
    window.print();
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Pledge Confirmation Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 rounded-t-2xl">
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
                  <h2 className="text-2xl font-bold">Pledge Confirmation</h2>
                  <p className="text-amber-100">Waterbury Islamic Cultural Center</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  window.location.href = '/';
                }}
                className="text-white hover:text-amber-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Pledge Confirmation Content */}
          <div className="p-6 space-y-6">
            {/* Thank You Message */}
            <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
              <h3 className="text-2xl font-bold text-green-800 mb-2">JazakAllah Khair!</h3>
              <p className="text-lg text-green-700 mb-4">
                Thank you for your generous pledge to the Waterbury Islamic Cultural Center
              </p>
              <p className="text-sm text-green-600 italic">
                &ldquo;And whatever you spend in charity or devotion, be sure Allah knows it all.&rdquo; - Quran 2:273
              </p>
            </div>

            {/* Pledge Details */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pledge Information */}
              <div className="bg-slate-50 p-4 rounded-xl">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                  <span className="text-amber-600 mr-2">📋</span>
                  Pledge Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Pledge #:</strong> {pledgeNumber}</p>
                  <p><strong>Amount:</strong> ${finalAmount}</p>
                  <p><strong>Date:</strong> {pledgeDate}</p>
                  <p><strong>Status:</strong> <span className="text-amber-600 font-semibold">Pledged</span></p>
                </div>
              </div>

              {/* Donor Information */}
              <div className="bg-slate-50 p-4 rounded-xl">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                  <span className="text-amber-600 mr-2">👤</span>
                  Donor Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {donorInfo.name}</p>
                  <p><strong>Email:</strong> {donorInfo.email}</p>
                  {donorInfo.phone && <p><strong>Phone:</strong> {donorInfo.phone}</p>}
                  {donorInfo.address && (
                    <div>
                      <p><strong>Address:</strong></p>
                      <p className="ml-4">{donorInfo.address}</p>
                      <p className="ml-4">{donorInfo.city}, {donorInfo.state} {donorInfo.zip}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pledge Instructions */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200">
              <h4 className="font-bold text-amber-800 mb-2 flex items-center">
                <span className="text-amber-600 mr-2">📝</span>
                Next Steps
              </h4>
              <div className="text-sm text-amber-700 space-y-2">
                <p><strong>1. Payment Method:</strong> {pledgeDetails.paymentMethod || 'To be determined'}</p>
                <p><strong>2. Payment Date:</strong> {pledgeDetails.pledgeDate ? new Date(pledgeDetails.pledgeDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'To be scheduled'}</p>
                <p><strong>3. Contact:</strong> We will contact you to arrange payment</p>
                {pledgeDetails.notes && (
                  <p><strong>4. Notes:</strong> {pledgeDetails.notes}</p>
                )}
              </div>
            </div>

            {/* Tax Information */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <h4 className="font-bold text-purple-800 mb-2 flex items-center">
                <span className="text-purple-600 mr-2">📄</span>
                Tax Deduction Information
              </h4>
              <div className="text-sm text-purple-700 space-y-1">
                <p><strong>Organization:</strong> Waterbury Islamic Cultural Center (WICC)</p>
                <p><strong>Tax ID:</strong> 83-3099502</p>
                <p><strong>Pledge Amount:</strong> ${finalAmount}</p>
                <p className="text-xs italic mt-2">
                  <strong>Note:</strong> Tax receipt will be provided upon payment completion.
                  WICC is a registered 501(c)(3) non-profit organization.
                </p>
              </div>
            </div>

            {/* Impact Statement */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
              <h4 className="font-bold text-green-800 mb-2 flex items-center">
                <span className="text-green-600 mr-2">🌟</span>
                Your Pledge Impact
              </h4>
              <p className="text-sm text-green-700">
                Your generous pledge of ${finalAmount} will directly support our new masjid&apos;s vision through prayer services, 
                education programs, community events, janazah services, recreation facilities, and nikah ceremonies. 
                May Allah reward you abundantly for your commitment to our community.
              </p>
            </div>

            {/* Contact Information */}
            <div className="text-center text-sm text-slate-600 border-t pt-4">
              <p><strong>Waterbury Islamic Cultural Center</strong></p>
              <p>For questions about this pledge, please contact us at:</p>
              <p>Email: info@waterburyicc.org | Phone: (203) 510-0400</p>
              <p className="text-xs mt-2">
                This pledge was recorded on {new Date().toLocaleString()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 p-6 bg-slate-50 rounded-b-2xl">
            <button
              onClick={handlePrint}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
              </svg>
              Print Pledge
            </button>
            <button
              onClick={() => {
                onClose();
                window.location.href = '/';
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Close & Return to Main Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Pledge Form Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 rounded-t-2xl">
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
                <h2 className="text-2xl font-bold">Pledge Form</h2>
                <p className="text-amber-100">Commit to donate ${finalAmount} to WICC</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-amber-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Pledge Form Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pledge Amount Display */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
              <h3 className="text-lg font-bold text-green-800 mb-2">Pledge Amount</h3>
              <p className="text-2xl font-bold text-green-700">${finalAmount}</p>
              <p className="text-sm text-green-600 mt-1">
                You are committing to donate this amount to support our new masjid
              </p>
            </div>

            {/* Pledge Details Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-slate-900 text-base font-bold mb-2">
                  Preferred Payment Date
                </label>
                <input
                  type="date"
                  value={pledgeDetails.pledgeDate}
                  onChange={(e) => setPledgeDetails({...pledgeDetails, pledgeDate: e.target.value})}
                  className="w-full p-3 rounded-xl bg-white border-2 border-slate-400 focus:border-amber-500 focus:outline-none text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-900 text-base font-bold mb-2">
                  Preferred Payment Method
                </label>
                <select
                  value={pledgeDetails.paymentMethod}
                  onChange={(e) => setPledgeDetails({...pledgeDetails, paymentMethod: e.target.value})}
                  className="w-full p-3 rounded-xl bg-white border-2 border-slate-400 focus:border-amber-500 focus:outline-none text-slate-900 font-medium"
                >
                  <option value="">Select payment method</option>
                  <option value="check">Check (Mail-in)</option>
                  <option value="card">Credit/Debit Card (Online)</option>
                  <option value="cash">Cash (In-person)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-900 text-base font-bold mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={pledgeDetails.notes}
                  onChange={(e) => setPledgeDetails({...pledgeDetails, notes: e.target.value})}
                  placeholder="Any special instructions or notes..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-white border-2 border-slate-400 focus:border-amber-500 focus:outline-none text-slate-900 font-medium placeholder-slate-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xl rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              style={{
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(245, 158, 11, 0.3)'
              }}
            >
              Submit Pledge
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
