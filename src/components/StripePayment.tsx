'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useDonations } from '@/contexts/DonationContext';

// Test mode - replace with your actual publishable key when ready
// For demo purposes, using a placeholder key
const stripePromise = loadStripe('pk_test_51234567890abcdef');

interface StripePaymentProps {
  amount: number;
  donorInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  onSuccess: () => void;
  onError: (error: string) => void;
}

function CheckoutForm({ amount, donorInfo, onSuccess, onError }: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { addDonation } = useDonations();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // In a real implementation, you would create a payment intent on your backend
      // For demo purposes, we'll simulate the process
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add donation to database
      await addDonation({
        amount,
        donorName: donorInfo.name,
        donorEmail: donorInfo.email,
        donorPhone: donorInfo.phone,
        type: 'donation',
        paymentMethod: 'stripe',
        status: 'completed',
        notes: 'Stripe payment'
      });
      
      onSuccess();
    } catch {
      onError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: 'Arial, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-700 p-4 rounded-xl border border-amber-400">
        <label className="block text-white text-sm font-semibold mb-3">
          Card Information
        </label>
        <div className="bg-white p-3 rounded-lg">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-xl">
        <div className="text-white text-center">
          <p className="text-sm mb-2">Test Mode - No Real Charges</p>
          <p className="text-lg font-bold">Amount: ${amount}</p>
          <p className="text-xs text-purple-200 mt-1">
            Use test card: 4242 4242 4242 4242
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold text-xl rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
        style={{
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.5), 0 0 40px rgba(34, 197, 94, 0.3)'
        }}
      >
        {isProcessing ? 'Processing Payment...' : `Pay $${amount} Securely`}
      </button>
    </form>
  );
}

export default function StripePayment({ amount, donorInfo, onSuccess, onError }: StripePaymentProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm 
        amount={amount} 
        donorInfo={donorInfo} 
        onSuccess={onSuccess} 
        onError={onError} 
      />
    </Elements>
  );
}
