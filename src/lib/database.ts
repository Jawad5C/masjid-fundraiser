// Database schema and connection for donations
export interface Donation {
  id: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  type: 'donation' | 'pledge';
  paymentMethod: 'card' | 'pledge' | 'qr1' | 'qr2';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  date: Date;
  notes?: string;
  pledgeDate?: Date; // For pledges
  pledgeMethod?: string; // For pledges
}

export interface DonationStats {
  totalRaised: number;
  totalDonations: number;
  totalPledges: number;
  goalAmount: number;
  lastUpdated: Date;
}

// Database operations
export class DonationDatabase {
  // In production, this would connect to a real database
  // For now, we'll use a simple in-memory store for demo
  private static donations: Donation[] = [];
  private static stats: DonationStats = {
    totalRaised: 525000, // Starting amount
    totalDonations: 1,
    totalPledges: 0,
    goalAmount: 1000000,
    lastUpdated: new Date()
  };

  // TODO: Replace with real database connection
  // Example for Supabase:
  // private static supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  static async addDonation(donation: Omit<Donation, 'id' | 'date'>): Promise<Donation> {
    const newDonation: Donation = {
      ...donation,
      id: `donation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date()
    };

    this.donations.push(newDonation);
    
    // Update stats
    if (donation.type === 'donation' && donation.status === 'completed') {
      this.stats.totalRaised += donation.amount;
      this.stats.totalDonations += 1;
    } else if (donation.type === 'pledge') {
      this.stats.totalPledges += 1;
    }
    
    this.stats.lastUpdated = new Date();
    
    return newDonation;
  }

  static async getDonations(): Promise<Donation[]> {
    return [...this.donations];
  }

  static async getStats(): Promise<DonationStats> {
    return { ...this.stats };
  }

  static async updateDonationStatus(id: string, status: Donation['status']): Promise<Donation | null> {
    const donation = this.donations.find(d => d.id === id);
    if (!donation) return null;

    donation.status = status;
    
    // If payment completed, add to total
    if (status === 'completed' && donation.type === 'donation') {
      this.stats.totalRaised += donation.amount;
      this.stats.lastUpdated = new Date();
    }
    
    return donation;
  }

  static async getRecentDonations(limit: number = 10): Promise<Donation[]> {
    return this.donations
      .filter(d => d.status === 'completed')
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  }
}
