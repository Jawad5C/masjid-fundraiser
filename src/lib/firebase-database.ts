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
  setDoc,
  FieldValue
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
  private static demoStats: DonationStats = {
    totalRaised: 0,
    totalDonations: 0,
    totalPledges: 0,
    goalAmount: 1000000,
    lastUpdated: new Date()
  };

  // Initialize demo stats from localStorage if available
  private static initializeDemoStats() {
    if (typeof window !== 'undefined') {
      // Check deployment version - only clear on MAJOR version changes
      const currentVersion = '1.0.0'; // Only change this for MAJOR resets
      const savedVersion = localStorage.getItem('masjid-app-version');
      
      // Only clear data if this is a MAJOR version change (not minor updates)
      if (savedVersion && savedVersion !== currentVersion) {
        const [savedMajor] = savedVersion.split('.');
        const [currentMajor] = currentVersion.split('.');
        
        if (savedMajor !== currentMajor) {
          console.log('📊 MAJOR version change detected - clearing all data');
          localStorage.removeItem('masjid-demo-stats');
          localStorage.removeItem('adminPledges');
          localStorage.setItem('masjid-app-version', currentVersion);
          this.resetToDefault();
          return;
        }
      }
      
      // Set version if not exists (first visit)
      if (!savedVersion) {
        localStorage.setItem('masjid-app-version', currentVersion);
      }
      
      const savedStats = localStorage.getItem('masjid-demo-stats');
      if (savedStats) {
        try {
          const parsed = JSON.parse(savedStats);
          this.demoStats = {
            ...parsed,
            lastUpdated: new Date(parsed.lastUpdated)
          };
          console.log('📊 Loaded demo stats from localStorage:', this.demoStats);
        } catch (error) {
          console.log('📊 Error parsing saved stats, using default');
          this.resetToDefault();
        }
      } else {
        console.log('📊 Starting fresh with $0 - no saved data');
        this.resetToDefault();
      }
    }
  }

  // Reset to default $0 stats
  private static resetToDefault() {
    this.demoStats = {
      totalRaised: 0,
      totalDonations: 0,
      totalPledges: 0,
      goalAmount: 1000000,
      lastUpdated: new Date()
    };
  }

  // Save demo stats to localStorage
  private static saveDemoStats() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('masjid-demo-stats', JSON.stringify(this.demoStats));
      console.log('📊 Saved demo stats to localStorage:', this.demoStats);
    }
  }

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
      // Initialize demo stats from localStorage
      this.initializeDemoStats();
      
      // Update demo stats if Firebase not configured
      console.log('Using demo mode - updating demo stats');
      this.demoStats.totalRaised += donationData.amount;
      if (donationData.type === 'donation') {
        this.demoStats.totalDonations += 1;
      } else if (donationData.type === 'pledge') {
        this.demoStats.totalPledges += 1;
      }
      this.demoStats.lastUpdated = new Date();
      
      // Save to localStorage
      this.saveDemoStats();
      
      console.log('📊 Updated demo stats:', this.demoStats);
      
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

  // Get all pledges specifically
  static async getPledges(): Promise<Donation[]> {
    if (!db) {
      // Return demo data if Firebase not configured
      return [];
    }

    try {
      const snapshot = await getDocs(query(this.getDonationsRef()!, orderBy('createdAt', 'desc')));
      return snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            amount: data.amount,
            donorName: data.donorName,
            donorEmail: data.donorEmail,
            donorPhone: data.donorPhone,
            type: data.type,
            paymentMethod: data.paymentMethod,
            status: data.status,
            notes: data.notes,
            pledgeDate: data.pledgeDate?.toDate(),
            pledgeMethod: data.pledgeMethod,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          } as Donation;
        })
        .filter(donation => donation.type === 'pledge');
    } catch (error) {
      console.error('Error getting pledges:', error);
      return [];
    }
  }

  // Get all completed donations (non-pledges)
  static async getCompletedDonations(): Promise<Donation[]> {
    if (!db) {
      // Return demo data if Firebase not configured
      return [];
    }

    try {
      const snapshot = await getDocs(query(this.getDonationsRef()!, orderBy('createdAt', 'desc')));
      return snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            amount: data.amount,
            donorName: data.donorName,
            donorEmail: data.donorEmail,
            donorPhone: data.donorPhone,
            type: data.type,
            paymentMethod: data.paymentMethod,
            status: data.status,
            notes: data.notes,
            pledgeDate: data.pledgeDate?.toDate(),
            pledgeMethod: data.pledgeMethod,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          } as Donation;
        })
        .filter(donation => donation.type === 'donation');
    } catch (error) {
      console.error('Error getting completed donations:', error);
      return [];
    }
  }

  // Get donation stats
  static async getStats(): Promise<DonationStats> {
    if (!db) {
      // Initialize demo stats from localStorage
      this.initializeDemoStats();
      // Return persistent demo stats if Firebase not configured
      console.log('📊 Using persistent demo stats:', this.demoStats);
      return this.demoStats;
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
                 totalRaised: 0,
                 totalDonations: 0,
                 totalPledges: 0,
                 goalAmount: 1000000,
                 lastUpdated: serverTimestamp()
               };
               await setDoc(this.getStatsRef()!, initialStats);
               return {
                 totalRaised: 0,
                 totalDonations: 0,
                 totalPledges: 0,
                 goalAmount: 1000000,
                 lastUpdated: new Date()
               };
             }
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalRaised: 0,
        totalDonations: 0,
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
    if (!db) {
      console.log('📊 updateStats: No database connection');
      return;
    }

    try {
      console.log(`📊 updateStats: Updating stats for ${type} with amount ${amount} and status ${status}`);
      const statsSnap = await getDoc(this.getStatsRef()!);
      if (statsSnap.exists()) {
        const currentStats = statsSnap.data();
        console.log('📊 updateStats: Current stats:', currentStats);
        const updates: Record<string, FieldValue | number> = {
          lastUpdated: serverTimestamp()
        };

        if (type === 'donation' && (status === 'completed' || status === 'pending')) {
          const newTotalRaised = (currentStats.totalRaised || 0) + amount;
          updates.totalRaised = newTotalRaised;
          updates.totalDonations = (currentStats.totalDonations || 0) + 1;
          console.log(`📊 updateStats: Adding ${amount} to totalRaised. New total: ${newTotalRaised}`);
        } else if (type === 'pledge') {
          const newTotalRaised = (currentStats.totalRaised || 0) + amount;
          updates.totalRaised = newTotalRaised;
          updates.totalPledges = (currentStats.totalPledges || 0) + 1;
          console.log(`📊 updateStats: Adding ${amount} to totalRaised for pledge. New total: ${newTotalRaised}`);
        }

        console.log('📊 updateStats: About to update with:', updates);
        await updateDoc(this.getStatsRef()!, updates);
        console.log('📊 updateStats: Stats updated successfully');
      } else {
        console.log('📊 updateStats: Stats document does not exist');
      }
    } catch (error) {
      console.error('📊 updateStats: Error updating stats:', error);
      console.error('📊 updateStats: Error details:', error.message);
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

  // Set initial stats with the current raised amount - ONLY if stats don't exist
  static async setInitialStats(): Promise<void> {
    if (!db) {
      console.warn('Firebase not initialized - cannot set initial stats');
      return;
    }

    try {
      // Check if stats already exist
      const statsSnap = await getDoc(this.getStatsRef()!);
      if (statsSnap.exists()) {
        console.log('✅ Stats already exist - not overwriting');
        return;
      }

               // Only set initial stats if they don't exist
               const initialStats = {
                 totalRaised: 0,
                 totalDonations: 0,
                 totalPledges: 0,
                 goalAmount: 1000000,
                 lastUpdated: serverTimestamp()
               };

      await setDoc(this.getStatsRef()!, initialStats);
      console.log('✅ Initial stats set in Firebase (first time only)');
    } catch (error) {
      console.error('Error setting initial stats:', error);
      throw error;
    }
  }

  // Real-time listener for stats
  static onStatsUpdate(callback: (stats: DonationStats) => void) {
    if (!db) {
      // Initialize demo stats from localStorage
      this.initializeDemoStats();
      
      // Return persistent demo stats if Firebase not configured
      console.log('📊 Using persistent demo stats for real-time updates:', this.demoStats);
      callback(this.demoStats);
      
      // Set up a simple interval to check for updates in demo mode
      const interval = setInterval(() => {
        callback(this.demoStats);
      }, 5000); // Reduced frequency to every 5 seconds
      
      return () => clearInterval(interval); // Return cleanup function
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