'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { FirebaseDonationService, Donation } from '@/lib/firebase-database';

interface DonationStats {
  totalRaised: number;
  totalDonations: number;
  totalPledges: number;
  goalAmount: number;
  lastUpdated: Date;
}

interface DonationContextType {
  donations: Donation[];
  stats: DonationStats | null;
  isLoading: boolean;
  error: string | null;
  addDonation: (donationData: Partial<Donation>) => Promise<void>;
  refreshStats: () => Promise<void>;
  resetStats: () => Promise<void>;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export function DonationProvider({ children }: { children: React.ReactNode }) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data and set up real-time listeners
  useEffect(() => {
    // Set initial stats in Firebase if needed
    FirebaseDonationService.setInitialStats().catch(console.error);

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
      setError(null);
      
      await FirebaseDonationService.addDonation({
        amount: donationData.amount!,
        donorName: donationData.donorName!,
        donorEmail: donationData.donorEmail!,
        donorPhone: donationData.donorPhone,
        type: donationData.type!,
        paymentMethod: donationData.paymentMethod,
        status: donationData.status || 'pending',
        notes: donationData.notes
      });
    } catch (err) {
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

  return (
    <DonationContext.Provider value={{
      donations,
      stats,
      isLoading,
      error,
      addDonation,
      refreshStats,
      resetStats
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