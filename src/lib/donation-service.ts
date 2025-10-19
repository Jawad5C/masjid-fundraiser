// Real-time donation service for live updates
interface DonationStats {
  totalRaised: number;
  totalDonations: number;
  totalPledges: number;
  goalAmount: number;
  lastUpdated: Date;
}

interface DonationData {
  amount: number;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  type: 'donation' | 'pledge';
  paymentMethod?: string;
  status?: string;
  notes?: string;
}

export class DonationService {
  private static listeners: Set<(stats: DonationStats) => void> = new Set();

  // Subscribe to donation updates
  static subscribe(callback: (stats: DonationStats) => void) {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Notify all listeners of updates
  static notifyListeners(stats: DonationStats) {
    this.listeners.forEach(callback => {
      try {
        callback(stats);
      } catch (error) {
        console.error('Error in donation listener:', error);
      }
    });
  }

  // Fetch latest stats from API
  static async fetchStats(): Promise<DonationStats | null> {
    try {
      const response = await fetch('/api/donations');
      const data = await response.json();
      
      if (data.success) {
        this.notifyListeners(data.stats);
        return data.stats;
      }
    } catch (error) {
      console.error('Error fetching donation stats:', error);
    }
    return null;
  }

  // Poll for updates every 30 seconds
  static startPolling() {
    // Initial fetch
    this.fetchStats();
    
    // Set up polling
    const interval = setInterval(() => {
      this.fetchStats();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }

  // Submit new donation
  static async submitDonation(donationData: DonationData) {
    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });

      const data = await response.json();
      
      if (data.success) {
        // Fetch updated stats and notify listeners
        await this.fetchStats();
        return data.donation;
      } else {
        throw new Error(data.error || 'Failed to submit donation');
      }
    } catch (error) {
      console.error('Error submitting donation:', error);
      throw error;
    }
  }
}
