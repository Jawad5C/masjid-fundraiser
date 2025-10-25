import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  serverTimestamp,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase';

export interface Donation {
  id: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  type: 'donation' | 'pledge';
  paymentMethod?: string;
  stripePaymentId?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  notes?: string;
  pledgeDate?: Date;
  pledgeMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DonationStats {
  totalRaised: number;
  totalDonations: number;
  totalPledges: number;
  goalAmount: number;
  lastUpdated: Date;
}

export class FirebaseDonationService {
  private static getDonationsRef() {
    if (!db) {
      console.warn('Firebase not initialized - using demo data');
      return null;
    }
    return collection(db, 'donations');
  }

  private static getStatsRef() {
    if (!db) {
      console.warn('Firebase not initialized - using demo data');
      return null;
    }
    return doc(db, 'stats', 'main');
  }

  // Add new donation
  static async addDonation(donationData: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Donation> {
    if (!db) {
      // Return demo data if Firebase not configured
      console.log('Using demo mode - donation not saved to database');
      return {
        ...donationData,
        id: `demo_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    try {
      const docRef = await addDoc(this.getDonationsRef()!, {
        ...donationData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Update stats
      await this.updateStats(donationData.amount, donationData.type, donationData.status);

      return {
        ...donationData,
        id: docRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error adding donation:', error);
      throw error;
    }
  }

  // Get all donations
  static async getDonations(): Promise<Donation[]> {
    if (!db) {
      // Return demo data if Firebase not configured
      return [];
    }

    try {
      const snapshot = await getDocs(query(this.getDonationsRef()!, orderBy('createdAt', 'desc')));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Donation[];
    } catch (error) {
      console.error('Error getting donations:', error);
      return [];
    }
  }

  // Get donation stats
  static async getStats(): Promise<DonationStats> {
    if (!db) {
      // Return demo stats if Firebase not configured
      return {
        totalRaised: 525000,
        totalDonations: 1,
        totalPledges: 0,
        goalAmount: 1000000,
        lastUpdated: new Date()
      };
    }

    try {
      const docSnap = await getDoc(this.getStatsRef()!);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          totalRaised: data.totalRaised || 0,
          totalDonations: data.totalDonations || 0,
          totalPledges: data.totalPledges || 0,
          goalAmount: data.goalAmount || 1000000,
          lastUpdated: data.lastUpdated?.toDate() || new Date()
        };
      } else {
        // Initialize stats if they don't exist
        const initialStats = {
          totalRaised: 525000,
          totalDonations: 1,
          totalPledges: 0,
          goalAmount: 1000000,
          lastUpdated: serverTimestamp()
        };
        await setDoc(this.getStatsRef()!, initialStats);
        return {
          ...initialStats,
          lastUpdated: new Date()
        };
      }
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalRaised: 525000,
        totalDonations: 1,
        totalPledges: 0,
        goalAmount: 1000000,
        lastUpdated: new Date()
      };
    }
  }

  // Update donation status
  static async updateDonationStatus(id: string, status: Donation['status']): Promise<Donation | null> {
    if (!db) {
      console.warn('Firebase not initialized - cannot update donation status');
      return null;
    }

    try {
      const donationRef = doc(this.getDonationsRef()!, id);
      await updateDoc(donationRef, {
        status,
        updatedAt: serverTimestamp()
      });

      // Get updated donation
      const donationSnap = await getDoc(donationRef);
      if (donationSnap.exists()) {
        const data = donationSnap.data();
        return {
          id: donationSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Donation;
      }
      return null;
    } catch (error) {
      console.error('Error updating donation status:', error);
      return null;
    }
  }

  // Update stats when donation is added
  private static async updateStats(amount: number, type: 'donation' | 'pledge', status: string) {
    if (!db) return;

    try {
      const statsSnap = await getDoc(this.getStatsRef()!);
      if (statsSnap.exists()) {
        const currentStats = statsSnap.data();
        const updates: Record<string, unknown> = {
          lastUpdated: serverTimestamp()
        };

        if (type === 'donation' && (status === 'completed' || status === 'pending')) {
          updates.totalRaised = (currentStats.totalRaised || 0) + amount;
          updates.totalDonations = (currentStats.totalDonations || 0) + 1;
        } else if (type === 'pledge') {
          updates.totalRaised = (currentStats.totalRaised || 0) + amount;
          updates.totalPledges = (currentStats.totalPledges || 0) + 1;
        }

        await updateDoc(this.getStatsRef()!, updates);
      }
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  }

  // Reset stats to initial values
  static async resetStats(): Promise<void> {
    if (!db) {
      console.warn('Firebase not initialized - cannot reset stats');
      return;
    }

    try {
      const initialStats = {
        totalRaised: 0,
        totalDonations: 0,
        totalPledges: 0,
        goalAmount: 1000000,
        lastUpdated: serverTimestamp()
      };

      await setDoc(this.getStatsRef()!, initialStats);
    } catch (error) {
      console.error('Error resetting stats:', error);
      throw error;
    }
  }

  // Real-time listener for stats
  static onStatsUpdate(callback: (stats: DonationStats) => void) {
    if (!db) {
      // Return demo stats if Firebase not configured
      callback({
        totalRaised: 525000,
        totalDonations: 1,
        totalPledges: 0,
        goalAmount: 1000000,
        lastUpdated: new Date()
      });
      return () => {}; // Return empty unsubscribe function
    }

    return onSnapshot(this.getStatsRef()!, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback({
          totalRaised: data.totalRaised || 0,
          totalDonations: data.totalDonations || 0,
          totalPledges: data.totalPledges || 0,
          goalAmount: data.goalAmount || 1000000,
          lastUpdated: data.lastUpdated?.toDate() || new Date()
        });
      }
    });
  }

  // Real-time listener for recent donations
  static onRecentDonationsUpdate(callback: (donations: Donation[]) => void, limitCount: number = 10) {
    if (!db) {
      // Return empty array if Firebase not configured
      callback([]);
      return () => {}; // Return empty unsubscribe function
    }

    const q = query(this.getDonationsRef()!, orderBy('createdAt', 'desc'), limit(limitCount));
    return onSnapshot(q, (snapshot) => {
      const donations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Donation[];
      callback(donations);
    });
  }
}