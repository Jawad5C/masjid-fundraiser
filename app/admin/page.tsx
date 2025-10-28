'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useDonations } from '@/contexts/DonationContext';

interface Pledge {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  donorAddress: string;
  donorCity: string;
  donorState: string;
  donorZip: string;
  pledgeAmount: number;
  pledgeDate: string;
  paymentMethod: string;
  notes: string;
  pledgeNumber: string;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
}

export default function AdminDashboard() {
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { getPledges } = useDonations();

  // Simple password authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple password for now
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  // Load pledges function
  const loadPledges = useCallback(async () => {
    try {
      const pledgeData = await getPledges();
      setPledges(pledgeData);
    } catch (error) {
      console.error('Error loading pledges:', error);
    }
  }, [getPledges]);

  // Load pledges
  useEffect(() => {
    if (isAuthenticated) {
      loadPledges();
    }
  }, [isAuthenticated, loadPledges]);

  const updatePledgeStatus = async (pledgeId: string, newStatus: 'pending' | 'paid' | 'cancelled') => {
    try {
      // Update pledge status in localStorage (for demo) or Firebase
      const updatedPledges = pledges.map(pledge => 
        pledge.id === pledgeId ? { ...pledge, status: newStatus } : pledge
      );
      setPledges(updatedPledges);
      
      // Save to localStorage
      localStorage.setItem('adminPledges', JSON.stringify(updatedPledges));
      
      console.log(`Pledge ${pledgeId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating pledge status:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-white text-center mb-6">Admin Dashboard</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin password"
                required
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Back to Main Page Button */}
        <div className="mb-4">
        <Link 
          href="/" 
          className="inline-flex items-center bg-slate-700 hover:bg-slate-600 text-white text-sm px-4 py-2 rounded-lg transition-colors duration-200"
        >
          ← Back to Main Page
        </Link>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/80">Manage pledges and donations</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Pledge Management</h2>
          
          {pledges.length === 0 ? (
            <p className="text-white/80">No pledges found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4">Pledge #</th>
                    <th className="text-left py-3 px-4">Donor</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Payment Method</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pledges.map((pledge) => (
                    <tr key={pledge.id} className="border-b border-white/10">
                      <td className="py-3 px-4">{pledge.pledgeNumber}</td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{pledge.donorName}</div>
                          <div className="text-sm text-white/70">{pledge.donorEmail}</div>
                          <div className="text-sm text-white/70">{pledge.donorPhone}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">${pledge.pledgeAmount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="text-sm">
                          {pledge.paymentMethod === 'check' ? 'Check (Mail-in)' :
                           pledge.paymentMethod === 'card' ? 'Credit/Debit Card (Online)' :
                           pledge.paymentMethod === 'cash' ? 'Cash (In-person)' :
                           pledge.paymentMethod || 'Not specified'}
                        </span>
                      </td>
                      <td className="py-3 px-4">{new Date(pledge.pledgeDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pledge.status === 'paid' ? 'bg-green-500/20 text-green-300' :
                          pledge.status === 'cancelled' ? 'bg-red-500/20 text-red-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {pledge.status}
                        </span>
                      </td>
                             <td className="py-3 px-4">
                               <div className="flex space-x-2">
                                 {pledge.status === 'pending' && (
                                   <button
                                     onClick={() => updatePledgeStatus(pledge.id, 'paid')}
                                     className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded transition-colors"
                                   >
                                     Mark Paid
                                   </button>
                                 )}
                                 {pledge.status === 'paid' && (
                                   <button
                                     onClick={() => updatePledgeStatus(pledge.id, 'pending')}
                                     className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1 rounded transition-colors"
                                   >
                                     Mark Pending
                                   </button>
                                 )}
                                 {pledge.status === 'cancelled' && (
                                   <button
                                     onClick={() => updatePledgeStatus(pledge.id, 'pending')}
                                     className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors"
                                   >
                                     Reactivate
                                   </button>
                                 )}
                                 <button
                                   onClick={() => updatePledgeStatus(pledge.id, 'cancelled')}
                                   className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-colors"
                                 >
                                   Cancel
                                 </button>
                               </div>
                             </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}