'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useDonations } from '@/contexts/DonationContext';
import { FirebaseDonationService } from '@/lib/firebase-database';

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

interface Donation {
  id: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  type: 'donation' | 'pledge';
  paymentMethod?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'paid';
  notes?: string;
  verificationStatus?: 'verified' | 'not_verified';
  createdAt: string;
}

interface DeletedItem {
  id: string;
  originalData: Pledge | Donation;
  deletedAt: string;
  deletedBy?: string;
}

export default function AdminDashboard() {
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<string>('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedDonations, setSelectedDonations] = useState<Set<string>>(new Set());
  const [selectedPledges, setSelectedPledges] = useState<Set<string>>(new Set());
  const [recentlyDeleted, setRecentlyDeleted] = useState<DeletedItem[]>([]);
  const [pledgedAmount, setPledgedAmount] = useState<number>(679000);
  const [pledgedAmountInput, setPledgedAmountInput] = useState<string>('679000');
  const [isUpdatingPledged, setIsUpdatingPledged] = useState<boolean>(false);
  const { getPledges } = useDonations();

  // Function to show notes in modal
  const showNotes = (notes: string) => {
    setSelectedNotes(notes || 'No notes available');
    setShowNotesModal(true);
  };

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

  // Load all donations
  const loadDonations = useCallback(async () => {
    try {
      const response = await fetch('/api/donations');
      const data = await response.json();
      if (data.success && data.donations) {
        setDonations(data.donations);
      }
    } catch (error) {
      console.error('Error loading donations:', error);
    }
  }, []);

  // Load recently deleted items
  const loadRecentlyDeleted = useCallback(() => {
    try {
      const stored = localStorage.getItem('recentlyDeletedDonations');
      if (stored) {
        const deletedItems = JSON.parse(stored);
        // Only keep items from the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const filtered = deletedItems.filter((item: DeletedItem) => 
          new Date(item.deletedAt) > thirtyDaysAgo
        );
        setRecentlyDeleted(filtered);
        if (filtered.length !== deletedItems.length) {
          localStorage.setItem('recentlyDeletedDonations', JSON.stringify(filtered));
        }
      }
    } catch (error) {
      console.error('Error loading recently deleted:', error);
    }
  }, []);

  // Save item to recently deleted list
  const saveToRecentlyDeleted = (item: Pledge | Donation) => {
    try {
      const deletedItem: DeletedItem = {
        id: `deleted_${Date.now()}_${item.id}`,
        originalData: item,
        deletedAt: new Date().toISOString()
      };
      
      const stored = localStorage.getItem('recentlyDeletedDonations');
      const deletedItems = stored ? JSON.parse(stored) : [];
      deletedItems.unshift(deletedItem); // Add to beginning
      
      // Keep only last 100 deleted items
      const limited = deletedItems.slice(0, 100);
      localStorage.setItem('recentlyDeletedDonations', JSON.stringify(limited));
      setRecentlyDeleted(limited);
    } catch (error) {
      console.error('Error saving to recently deleted:', error);
    }
  };

  // Load pledged amount from stats
  const loadPledgedAmount = useCallback(async () => {
    try {
      const stats = await FirebaseDonationService.getStats();
      const amount = stats.pledgedAmount ?? 679000;
      setPledgedAmount(amount);
      setPledgedAmountInput(amount.toString());
    } catch (error) {
      console.error('Error loading pledged amount:', error);
    }
  }, []);

  // Update pledged amount
  const updatePledgedAmount = async () => {
    const amount = parseFloat(pledgedAmountInput.replace(/[^0-9.]/g, ''));
    if (isNaN(amount) || amount < 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsUpdatingPledged(true);
    try {
      const success = await FirebaseDonationService.updatePledgedAmount(amount);
      if (success) {
        setPledgedAmount(amount);
        alert('Pledged amount updated successfully!');
      } else {
        alert('Failed to update pledged amount');
      }
    } catch (error) {
      console.error('Error updating pledged amount:', error);
      alert('Error updating pledged amount');
    } finally {
      setIsUpdatingPledged(false);
    }
  };

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadPledges();
      loadDonations();
      loadRecentlyDeleted();
      loadPledgedAmount();
    }
  }, [isAuthenticated, loadPledges, loadDonations, loadRecentlyDeleted, loadPledgedAmount]);

  // Delete donation function
  const deleteDonation = async (donationId: string) => {
    if (!confirm('Are you sure you want to delete this donation? This action cannot be undone.')) {
      return;
    }

    try {
      // Find and save the item before deleting
      const itemToDelete = donations.find(d => d.id === donationId) || 
                          pledges.find(p => p.id === donationId);
      if (itemToDelete) {
        saveToRecentlyDeleted(itemToDelete);
      }

      // Try to delete from Firebase (may fail if it doesn't exist in Firebase)
      try {
        await fetch(`/api/donations/${donationId}`, {
          method: 'DELETE'
        });
        // Continue even if Firebase deletion fails (localStorage-only items)
      } catch {
        // Ignore Firebase errors for localStorage-only items
        console.log('Firebase deletion failed, removing from localStorage only');
      }
      
      // Always remove from localStorage (even if Firebase deletion failed)
      const storedPledges = localStorage.getItem('adminPledges');
      if (storedPledges) {
        const pledges = JSON.parse(storedPledges);
        const filteredPledges = pledges.filter((p: Pledge) => p.id !== donationId);
        localStorage.setItem('adminPledges', JSON.stringify(filteredPledges));
      }
      
      // Reload donations
      await loadDonations();
      await loadPledges();
      loadRecentlyDeleted();
    } catch (error) {
      console.error('Error deleting donation:', error);
      alert('Error deleting donation');
    }
  };

  // Bulk delete donations
  const bulkDeleteDonations = async () => {
    const selectedIds = Array.from(selectedDonations);
    if (selectedIds.length === 0) {
      alert('Please select at least one donation to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedIds.length} donation(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      // First, save all items to recently deleted
      const itemsToDelete: (Pledge | Donation)[] = [];
      selectedIds.forEach(id => {
        const item = donations.find(d => d.id === id) || pledges.find(p => p.id === id);
        if (item) {
          itemsToDelete.push(item);
          saveToRecentlyDeleted(item);
        }
      });

      // Try to delete from Firebase (may fail if they don't exist in Firebase)
      const deletePromises = selectedIds.map(async (id) => {
        try {
          const response = await fetch(`/api/donations/${id}`, { method: 'DELETE' });
          const data = await response.json();
          // Even if Firebase deletion fails, we'll still remove from localStorage
          return { id, firebaseSuccess: data.success };
        } catch {
          // If API call fails, still mark for localStorage deletion
          return { id, firebaseSuccess: false };
        }
      });
      
      await Promise.allSettled(deletePromises);
      
      // Remove from localStorage regardless of Firebase result (localStorage-only items)
      const storedPledges = localStorage.getItem('adminPledges');
      if (storedPledges) {
        const pledges = JSON.parse(storedPledges);
        const filteredPledges = pledges.filter((p: Pledge) => !selectedIds.includes(p.id));
        localStorage.setItem('adminPledges', JSON.stringify(filteredPledges));
      }
      
      // Clear selections and reload
      setSelectedDonations(new Set());
      await loadDonations();
      await loadPledges();
      loadRecentlyDeleted();
      alert(`Successfully deleted ${selectedIds.length} donation(s)`);
    } catch (error) {
      console.error('Error bulk deleting donations:', error);
      alert('Error deleting donations');
    }
  };

  // Bulk delete pledges
  const bulkDeletePledges = async () => {
    const selectedIds = Array.from(selectedPledges);
    if (selectedIds.length === 0) {
      alert('Please select at least one pledge to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedIds.length} pledge(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      // First, save all items to recently deleted
      const itemsToDelete: (Pledge | Donation)[] = [];
      selectedIds.forEach(id => {
        const item = donations.find(d => d.id === id) || pledges.find(p => p.id === id);
        if (item) {
          itemsToDelete.push(item);
          saveToRecentlyDeleted(item);
        }
      });

      // Try to delete from Firebase (may fail if they don't exist in Firebase)
      const deletePromises = selectedIds.map(async (id) => {
        try {
          const response = await fetch(`/api/donations/${id}`, { method: 'DELETE' });
          const data = await response.json();
          // Even if Firebase deletion fails, we'll still remove from localStorage
          return { id, firebaseSuccess: data.success };
        } catch {
          // If API call fails, still mark for localStorage deletion
          return { id, firebaseSuccess: false };
        }
      });
      
      await Promise.allSettled(deletePromises);
      
      // Remove from localStorage regardless of Firebase result (localStorage-only pledges)
      const storedPledges = localStorage.getItem('adminPledges');
      if (storedPledges) {
        const pledges = JSON.parse(storedPledges);
        const filteredPledges = pledges.filter((p: Pledge) => !selectedIds.includes(p.id));
        localStorage.setItem('adminPledges', JSON.stringify(filteredPledges));
      }
      
      // Clear selections and reload
      setSelectedPledges(new Set());
      await loadPledges();
      await loadDonations();
      loadRecentlyDeleted();
      alert(`Successfully deleted ${selectedIds.length} pledge(s)`);
    } catch (error) {
      console.error('Error bulk deleting pledges:', error);
      alert('Error deleting pledges');
    }
  };

  // Toggle donation selection
  const toggleDonationSelection = (id: string) => {
    const newSelected = new Set(selectedDonations);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDonations(newSelected);
  };

  // Toggle pledge selection
  const togglePledgeSelection = (id: string) => {
    const newSelected = new Set(selectedPledges);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPledges(newSelected);
  };

  // Select all donations (currently unused but kept for future use)
  const _selectAllDonations = () => {
    if (selectedDonations.size === donations.length) {
      setSelectedDonations(new Set());
    } else {
      setSelectedDonations(new Set(donations.map(d => d.id)));
    }
  };

  // Select all pledges
  const selectAllPledges = () => {
    if (selectedPledges.size === pledges.length) {
      setSelectedPledges(new Set());
    } else {
      setSelectedPledges(new Set(pledges.map(p => p.id)));
    }
  };

  // Update verification status for QR payments
  const updateVerificationStatus = async (donationId: string, newStatus: 'verified' | 'not_verified') => {
    try {
      const response = await fetch(`/api/donations/${donationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ verificationStatus: newStatus })
      });
      
      if (response.ok) {
        // Reload donations to show updated status
        await loadDonations();
      } else {
        alert('Error updating verification status');
      }
    } catch (error) {
      console.error('Error updating verification status:', error);
      alert('Error updating verification status');
    }
  };

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

        {/* Pledged Amount Management */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Pledged Amount Management</h2>
          </div>
          <div className="bg-gradient-to-r from-amber-900/40 to-yellow-900/40 rounded-xl p-6 border-2 border-amber-500/50">
            <p className="text-white/90 mb-4 text-sm">
              Update the &quot;Amount Collected Including Pledged Amounts&quot; displayed under the fundraising thermometer.
              This amount is separate from the total raised and does not affect the thermometer calculation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-white/80 text-sm mb-2">
                  Pledged Amount (USD)
                </label>
                <input
                  type="text"
                  value={pledgedAmountInput}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    setPledgedAmountInput(value);
                  }}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                onClick={updatePledgedAmount}
                disabled={isUpdatingPledged || parseFloat(pledgedAmountInput.replace(/[^0-9.]/g, '')) === pledgedAmount}
                className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                {isUpdatingPledged ? 'Updating...' : 'Update Pledged Amount'}
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-amber-300 text-sm">
                <strong>Current Pledged Amount:</strong> ${pledgedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Pledge Management */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Pledge Management</h2>
            {selectedPledges.size > 0 && (
              <button
                onClick={bulkDeletePledges}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded transition-colors"
              >
                Delete Selected ({selectedPledges.size})
              </button>
            )}
          </div>
          
          {pledges.length === 0 ? (
            <p className="text-white/80">No pledges found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 w-12">
                      <input
                        type="checkbox"
                        checked={selectedPledges.size === pledges.length && pledges.length > 0}
                        onChange={selectAllPledges}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </th>
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
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedPledges.has(pledge.id)}
                          onChange={() => togglePledgeSelection(pledge.id)}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </td>
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
                               <div className="flex flex-wrap gap-1 sm:gap-1.5 items-center" style={{ minWidth: '280px' }}>
                                 <button
                                   onClick={() => {
                                     if (pledge.notes) {
                                       showNotes(pledge.notes);
                                     } else {
                                       alert('No notes available for this pledge.');
                                     }
                                   }}
                                   className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded transition-colors"
                                   style={{ width: '70px', minWidth: '70px' }}
                                 >
                                   View Notes
                                 </button>
                                 {pledge.status === 'pending' && (
                                   <button
                                     onClick={() => updatePledgeStatus(pledge.id, 'paid')}
                                     className="bg-green-600 hover:bg-green-700 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded transition-colors"
                                     style={{ width: '70px', minWidth: '70px' }}
                                   >
                                     Mark Paid
                                   </button>
                                 )}
                                 {pledge.status === 'paid' && (
                                   <button
                                     onClick={() => updatePledgeStatus(pledge.id, 'pending')}
                                     className="bg-yellow-600 hover:bg-yellow-700 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded transition-colors"
                                     style={{ width: '85px', minWidth: '85px' }}
                                   >
                                     Mark Pending
                                   </button>
                                 )}
                                 {pledge.status === 'cancelled' && (
                                   <button
                                     onClick={() => updatePledgeStatus(pledge.id, 'pending')}
                                     className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded transition-colors"
                                     style={{ width: '70px', minWidth: '70px' }}
                                   >
                                     Reactivate
                                   </button>
                                 )}
                                 <button
                                   onClick={() => updatePledgeStatus(pledge.id, 'cancelled')}
                                   className="bg-red-600 hover:bg-red-700 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded transition-colors"
                                   style={{ width: '60px', minWidth: '60px' }}
                                 >
                                   Cancel
                                 </button>
                                 <button
                                   onClick={() => deleteDonation(pledge.id)}
                                   className="bg-red-800 hover:bg-red-900 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded transition-colors"
                                   style={{ width: '55px', minWidth: '55px' }}
                                 >
                                   Delete
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

        {/* Credit/Debit Card Donations */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Credit/Debit Card Donations</h2>
            {donations.filter(d => d.paymentMethod === 'card' && d.type === 'donation').length > 0 && (
              <div className="flex items-center space-x-2">
                {selectedDonations.size > 0 && (
                  <button
                    onClick={bulkDeleteDonations}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded transition-colors"
                  >
                    Delete Selected ({selectedDonations.size})
                  </button>
                )}
              </div>
            )}
          </div>
          
          {donations.filter(d => d.paymentMethod === 'card' && d.type === 'donation').length === 0 ? (
            <p className="text-white/80">No credit/debit card donations found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 w-12">
                      <input
                        type="checkbox"
                        checked={(() => {
                          const cardDonations = donations.filter(d => d.paymentMethod === 'card' && d.type === 'donation');
                          return cardDonations.length > 0 && cardDonations.every(d => selectedDonations.has(d.id));
                        })()}
                        onChange={() => {
                          const cardDonations = donations.filter(d => d.paymentMethod === 'card' && d.type === 'donation');
                          const cardIds = new Set(cardDonations.map(d => d.id));
                          const allSelected = cardDonations.every(d => selectedDonations.has(d.id));
                          const newSelected = new Set(selectedDonations);
                          if (allSelected) {
                            cardIds.forEach(id => newSelected.delete(id));
                          } else {
                            cardIds.forEach(id => newSelected.add(id));
                          }
                          setSelectedDonations(newSelected);
                        }}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="text-left py-3 px-4">Donor</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.filter(d => d.paymentMethod === 'card' && d.type === 'donation').map((donation) => (
                    <tr key={donation.id} className="border-b border-white/10">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedDonations.has(donation.id)}
                          onChange={() => toggleDonationSelection(donation.id)}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{donation.donorName}</div>
                          <div className="text-sm text-white/70">{donation.donorEmail}</div>
                          {donation.donorPhone && (
                            <div className="text-sm text-white/70">{donation.donorPhone}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">${donation.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          donation.status === 'completed' || donation.status === 'paid' ? 'bg-green-500/20 text-green-300' :
                          donation.status === 'cancelled' ? 'bg-red-500/20 text-red-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {donation.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {donation.notes && (
                            <button
                              onClick={() => showNotes(donation.notes || '')}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors"
                            >
                              View Notes
                            </button>
                          )}
                          <button
                            onClick={() => deleteDonation(donation.id)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-colors"
                          >
                            Delete
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

        {/* Masjid QR Code Donations */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Masjid QR Code Donations</h2>
            {donations.filter(d => d.paymentMethod === 'qr1' && d.type === 'donation').length > 0 && (
              <div className="flex items-center space-x-2">
                {selectedDonations.size > 0 && (
                  <button
                    onClick={bulkDeleteDonations}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded transition-colors"
                  >
                    Delete Selected ({selectedDonations.size})
                  </button>
                )}
              </div>
            )}
          </div>
          
          {donations.filter(d => d.paymentMethod === 'qr1' && d.type === 'donation').length === 0 ? (
            <p className="text-white/80">No Masjid QR code donations found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 w-12">
                      <input
                        type="checkbox"
                        checked={(() => {
                          const qr1Donations = donations.filter(d => d.paymentMethod === 'qr1' && d.type === 'donation');
                          return qr1Donations.length > 0 && qr1Donations.every(d => selectedDonations.has(d.id));
                        })()}
                        onChange={() => {
                          const qr1Donations = donations.filter(d => d.paymentMethod === 'qr1' && d.type === 'donation');
                          const qr1Ids = new Set(qr1Donations.map(d => d.id));
                          const allSelected = qr1Donations.every(d => selectedDonations.has(d.id));
                          const newSelected = new Set(selectedDonations);
                          if (allSelected) {
                            qr1Ids.forEach(id => newSelected.delete(id));
                          } else {
                            qr1Ids.forEach(id => newSelected.add(id));
                          }
                          setSelectedDonations(newSelected);
                        }}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="text-left py-3 px-4">Donor</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Verification</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.filter(d => d.paymentMethod === 'qr1' && d.type === 'donation').map((donation) => (
                    <tr key={donation.id} className="border-b border-white/10">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedDonations.has(donation.id)}
                          onChange={() => toggleDonationSelection(donation.id)}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{donation.donorName}</div>
                          <div className="text-sm text-white/70">{donation.donorEmail}</div>
                          {donation.donorPhone && (
                            <div className="text-sm text-white/70">{donation.donorPhone}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">${donation.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => updateVerificationStatus(donation.id, (donation.verificationStatus || 'not_verified') === 'verified' ? 'not_verified' : 'verified')}
                          className={`text-xs px-3 py-1 rounded transition-colors ${
                            (donation.verificationStatus || 'not_verified') === 'verified' 
                              ? 'bg-green-600 hover:bg-green-700 text-white' 
                              : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          }`}
                        >
                          {(donation.verificationStatus || 'not_verified') === 'verified' ? '✓ Verified' : '✗ Not Verified'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {donation.notes && (
                            <button
                              onClick={() => showNotes(donation.notes || '')}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors"
                            >
                              View Notes
                            </button>
                          )}
                          <button
                            onClick={() => deleteDonation(donation.id)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-colors"
                          >
                            Delete
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

        {/* LaunchGood QR Code Donations */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">LaunchGood QR Code Donations</h2>
            {donations.filter(d => d.paymentMethod === 'qr2' && d.type === 'donation').length > 0 && (
              <div className="flex items-center space-x-2">
                {selectedDonations.size > 0 && (
                  <button
                    onClick={bulkDeleteDonations}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded transition-colors"
                  >
                    Delete Selected ({selectedDonations.size})
                  </button>
                )}
              </div>
            )}
          </div>
          
          {donations.filter(d => d.paymentMethod === 'qr2' && d.type === 'donation').length === 0 ? (
            <p className="text-white/80">No LaunchGood QR code donations found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 w-12">
                      <input
                        type="checkbox"
                        checked={(() => {
                          const qr2Donations = donations.filter(d => d.paymentMethod === 'qr2' && d.type === 'donation');
                          return qr2Donations.length > 0 && qr2Donations.every(d => selectedDonations.has(d.id));
                        })()}
                        onChange={() => {
                          const qr2Donations = donations.filter(d => d.paymentMethod === 'qr2' && d.type === 'donation');
                          const qr2Ids = new Set(qr2Donations.map(d => d.id));
                          const allSelected = qr2Donations.every(d => selectedDonations.has(d.id));
                          const newSelected = new Set(selectedDonations);
                          if (allSelected) {
                            qr2Ids.forEach(id => newSelected.delete(id));
                          } else {
                            qr2Ids.forEach(id => newSelected.add(id));
                          }
                          setSelectedDonations(newSelected);
                        }}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="text-left py-3 px-4">Donor</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Verification</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.filter(d => d.paymentMethod === 'qr2' && d.type === 'donation').map((donation) => (
                    <tr key={donation.id} className="border-b border-white/10">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedDonations.has(donation.id)}
                          onChange={() => toggleDonationSelection(donation.id)}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{donation.donorName}</div>
                          <div className="text-sm text-white/70">{donation.donorEmail}</div>
                          {donation.donorPhone && (
                            <div className="text-sm text-white/70">{donation.donorPhone}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">${donation.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => updateVerificationStatus(donation.id, (donation.verificationStatus || 'not_verified') === 'verified' ? 'not_verified' : 'verified')}
                          className={`text-xs px-3 py-1 rounded transition-colors ${
                            (donation.verificationStatus || 'not_verified') === 'verified' 
                              ? 'bg-green-600 hover:bg-green-700 text-white' 
                              : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          }`}
                        >
                          {(donation.verificationStatus || 'not_verified') === 'verified' ? '✓ Verified' : '✗ Not Verified'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {donation.notes && (
                            <button
                              onClick={() => showNotes(donation.notes || '')}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors"
                            >
                              View Notes
                            </button>
                          )}
                          <button
                            onClick={() => deleteDonation(donation.id)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-colors"
                          >
                            Delete
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

        {/* Zelle Donations */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Zelle Donations</h2>
            {donations.filter(d => d.paymentMethod === 'zelle' && d.type === 'donation').length > 0 && (
              <div className="flex items-center space-x-2">
                {selectedDonations.size > 0 && (
                  <button
                    onClick={bulkDeleteDonations}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded transition-colors"
                  >
                    Delete Selected ({selectedDonations.size})
                  </button>
                )}
              </div>
            )}
          </div>
          
          {donations.filter(d => d.paymentMethod === 'zelle' && d.type === 'donation').length === 0 ? (
            <p className="text-white/80">No Zelle donations found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 w-12">
                      <input
                        type="checkbox"
                        checked={(() => {
                          const zelleDonations = donations.filter(d => d.paymentMethod === 'zelle' && d.type === 'donation');
                          return zelleDonations.length > 0 && zelleDonations.every(d => selectedDonations.has(d.id));
                        })()}
                        onChange={() => {
                          const zelleDonations = donations.filter(d => d.paymentMethod === 'zelle' && d.type === 'donation');
                          const zelleIds = new Set(zelleDonations.map(d => d.id));
                          const allSelected = zelleDonations.every(d => selectedDonations.has(d.id));
                          const newSelected = new Set(selectedDonations);
                          if (allSelected) {
                            zelleIds.forEach(id => newSelected.delete(id));
                          } else {
                            zelleIds.forEach(id => newSelected.add(id));
                          }
                          setSelectedDonations(newSelected);
                        }}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="text-left py-3 px-4">Donor</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Verification</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.filter(d => d.paymentMethod === 'zelle' && d.type === 'donation').map((donation) => (
                    <tr key={donation.id} className="border-b border-white/10">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedDonations.has(donation.id)}
                          onChange={() => toggleDonationSelection(donation.id)}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{donation.donorName}</div>
                          <div className="text-sm text-white/70">{donation.donorEmail}</div>
                          {donation.donorPhone && (
                            <div className="text-sm text-white/70">{donation.donorPhone}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">${donation.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => updateVerificationStatus(donation.id, (donation.verificationStatus || 'not_verified') === 'verified' ? 'not_verified' : 'verified')}
                          className={`text-sm px-4 py-2 rounded transition-colors font-semibold ${
                            (donation.verificationStatus || 'not_verified') === 'verified' 
                              ? 'bg-green-600 hover:bg-green-700 text-white' 
                              : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          }`}
                          title={(donation.verificationStatus || 'not_verified') === 'verified' ? 'Click to mark as not verified' : 'Click to verify Zelle payment'}
                        >
                          {(donation.verificationStatus || 'not_verified') === 'verified' ? '✓ Verified' : 'Verify Payment'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {donation.notes && (
                            <button
                              onClick={() => showNotes(donation.notes || '')}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors"
                            >
                              View Notes
                            </button>
                          )}
                          <button
                            onClick={() => deleteDonation(donation.id)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-colors"
                          >
                            Delete
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

        {/* Recently Deleted Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Recently Deleted</h2>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all recently deleted items? This action cannot be undone.')) {
                  localStorage.removeItem('recentlyDeletedDonations');
                  setRecentlyDeleted([]);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded transition-colors"
            >
              Clear All
            </button>
          </div>
          
          {recentlyDeleted.length === 0 ? (
            <p className="text-white/80">No recently deleted items.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Donor</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Deleted At</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentlyDeleted.map((deletedItem) => {
                    const item = deletedItem.originalData;
                    const isPledge = 'pledgeNumber' in item;
                    return (
                      <tr key={deletedItem.id} className="border-b border-white/10">
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-300">
                            {isPledge ? 'Pledge' : 'Donation'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{item.donorName}</div>
                            <div className="text-sm text-white/70">{item.donorEmail}</div>
                            {item.donorPhone && (
                              <div className="text-sm text-white/70">{item.donorPhone}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          ${(isPledge ? (item as Pledge).pledgeAmount : (item as Donation).amount).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-white/70">
                          {new Date(deletedItem.deletedAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              if (item.notes) {
                                showNotes(item.notes);
                              } else {
                                alert('No notes available for this item.');
                              }
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors mr-2"
                          >
                            {item.notes ? 'View Notes' : 'No Notes'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-2xl w-full border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Notes</h3>
              <button
                onClick={() => setShowNotesModal(false)}
                className="text-white/70 hover:text-white text-2xl font-bold transition-colors"
              >
                ×
              </button>
            </div>
            <div className="bg-white/5 rounded-lg p-4 min-h-[100px] max-h-[400px] overflow-y-auto">
              <p className="text-white whitespace-pre-wrap break-words">
                {selectedNotes || 'No notes available'}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowNotesModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}