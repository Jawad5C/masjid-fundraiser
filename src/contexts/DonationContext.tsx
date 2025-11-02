'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { FirebaseDonationService, Donation, DonationStats } from '@/lib/firebase-database';

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

interface DonationContextType {
  donations: Donation[];
  stats: DonationStats | null;
  isLoading: boolean;
  error: string | null;
  addDonation: (donationData: Partial<Donation>) => Promise<void>;
  refreshStats: () => Promise<void>;
  resetStats: () => Promise<void>;
  getPledges: () => Promise<Pledge[]>;
  updatePledgeStatus: (pledgeId: string, status: 'pending' | 'paid' | 'cancelled') => Promise<void>;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export function DonationProvider({ children }: { children: React.ReactNode }) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data and set up real-time listeners
  useEffect(() => {
    // DON'T set initial stats on every refresh - only when stats don't exist
    // FirebaseDonationService.setInitialStats().catch(console.error);

    // Set up real-time listener for stats immediately
        const unsubscribeStats = FirebaseDonationService.onStatsUpdate((newStats) => {
          setStats(newStats);
        });

    // Set up real-time listener for donations
    const unsubscribeDonations = FirebaseDonationService.onRecentDonationsUpdate((newDonations) => {
      setDonations(newDonations);
    });

    // Also load initial data
    loadDonations();

    return () => {
      unsubscribeStats();
      unsubscribeDonations();
    };
  }, []);

  const loadDonations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [donations, stats] = await Promise.all([
        FirebaseDonationService.getDonations(),
        FirebaseDonationService.getStats()
      ]);
      
      setDonations(donations);
      setStats(stats);
    } catch (err) {
      setError('Error loading donations');
      console.error('Error loading donations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addDonation = async (donationData: Partial<Donation>) => {
    try {
      console.log('🎯 DonationContext: addDonation called with data:', donationData);
      setError(null);
      
      await FirebaseDonationService.addDonation({
        amount: donationData.amount!,
        donorName: donationData.donorName!,
        donorEmail: donationData.donorEmail!,
        donorPhone: donationData.donorPhone!,
        type: donationData.type!,
        paymentMethod: donationData.paymentMethod!,
        status: donationData.status!,
        notes: donationData.notes!
      });
      console.log('🎯 DonationContext: addDonation completed successfully');
    } catch (err) {
      console.error('🎯 DonationContext: addDonation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit donation');
      throw err;
    }
  };

  const refreshStats = async () => {
    const stats = await FirebaseDonationService.getStats();
    setStats(stats);
  };

  const resetStats = async () => {
    try {
      setError(null);
      await FirebaseDonationService.resetStats();
      // Refresh stats after reset
      await refreshStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset stats');
      throw err;
    }
  };

  const getPledges = async (): Promise<Pledge[]> => {
    try {
      // For demo mode, get pledges from localStorage
      const storedPledges = localStorage.getItem('adminPledges');
      if (storedPledges) {
        return JSON.parse(storedPledges);
      }
      return [];
    } catch (error) {
      console.error('Error getting pledges:', error);
      return [];
    }
  };

  const updatePledgeStatus = async (pledgeId: string, status: 'pending' | 'paid' | 'cancelled'): Promise<void> => {
    try {
      const storedPledges = localStorage.getItem('adminPledges');
      if (storedPledges) {
        const pledges = JSON.parse(storedPledges);
        const updatedPledges = pledges.map((pledge: Pledge) => 
          pledge.id === pledgeId ? { ...pledge, status } : pledge
        );
        localStorage.setItem('adminPledges', JSON.stringify(updatedPledges));
      }
    } catch (error) {
      console.error('Error updating pledge status:', error);
    }
  };

  return (
    <DonationContext.Provider value={{
      donations,
      stats,
      isLoading,
      error,
      addDonation,
      refreshStats,
      resetStats,
      getPledges,
      updatePledgeStatus
    }}>
      {children}
    </DonationContext.Provider>
  );
}

export function useDonations() {
  const context = useContext(DonationContext);
  if (context === undefined) {
    throw new Error('useDonations must be used within a DonationProvider');
  }
  return context;
}