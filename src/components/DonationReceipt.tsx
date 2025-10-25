'use client';

import { useState } from 'react';
import Image from 'next/image';

interface DonationReceiptProps {
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
  paymentMethod: string;
  onClose: () => void;
}

export default function DonationReceipt({ 
  donorInfo, 
  donationAmount, 
  customAmount, 
  paymentMethod, 
  onClose 
}: DonationReceiptProps) {
  const [, setIsPrinting] = useState(false);
  
  const finalAmount = donationAmount || customAmount;
  const receiptNumber = `WICC-${Date.now().toString().slice(-6)}`;
  const donationDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    setIsPrinting(true);
    window.print();
    setTimeout(() => setIsPrinting(false), 1000);
  };

  const handleDownload = () => {
    // In a real implementation, this would generate a PDF
    alert('PDF download feature will be implemented with a PDF generation library');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Receipt Header */}
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
                <h2 className="text-2xl font-bold">Waterbury Islamic Cultural Center</h2>
                <p className="text-green-100">Tax-Deductible Donation Receipt</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-6">
          {/* Thank You Message */}
          <div className="text-center bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl border-2 border-amber-200">
            <h3 className="text-2xl font-bold text-green-800 mb-2">JazakAllah Khair!</h3>
            <p className="text-lg text-green-700 mb-4">
              Thank you for your generous donation to the Waterbury Islamic Cultural Center
            </p>
            <p className="text-sm text-green-600 italic">
              &ldquo;And whatever you spend in charity or devotion, be sure Allah knows it all.&rdquo; - Quran 2:273
            </p>
          </div>

          {/* Receipt Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Donor Information */}
            <div className="bg-slate-50 p-4 rounded-xl">
              <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                <span className="text-green-600 mr-2">👤</span>
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

            {/* Donation Details */}
            <div className="bg-slate-50 p-4 rounded-xl">
              <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                <span className="text-green-600 mr-2">💰</span>
                Donation Details
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Amount:</strong> ${finalAmount}</p>
                <p><strong>Date:</strong> {donationDate}</p>
                <p><strong>Receipt #:</strong> {receiptNumber}</p>
                <p><strong>Payment Method:</strong> {paymentMethod}</p>
                <p><strong>Status:</strong> <span className="text-green-600 font-semibold">Completed</span></p>
              </div>
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
              <p><strong>Deductible Amount:</strong> ${finalAmount}</p>
              <p className="text-xs italic mt-2">
                WICC is a registered 501(c)(3) non-profit organization. 
                Your donation is tax-deductible to the full extent allowed by law.
              </p>
            </div>
          </div>

          {/* Impact Statement */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <h4 className="font-bold text-green-800 mb-2 flex items-center">
              <span className="text-green-600 mr-2">🌟</span>
              Your Impact
            </h4>
            <p className="text-sm text-green-700">
              Your generous donation of ${finalAmount} will directly support our community through prayer services, 
              education programs, community events, and facility maintenance. May Allah reward you abundantly for your generosity.
            </p>
          </div>

          {/* Contact Information */}
          <div className="text-center text-sm text-slate-600 border-t pt-4">
            <p><strong>Waterbury Islamic Cultural Center</strong></p>
            <p>For questions about this receipt, please contact us at:</p>
            <p>Email: info@waterburyicc.org | Phone: (203) 510-0400</p>
            <p className="text-xs mt-2">
              This receipt was generated on {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 p-6 bg-slate-50 rounded-b-2xl">
          <button
            onClick={handlePrint}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
            </svg>
            Print Receipt
          </button>
          <button
            onClick={handleDownload}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
