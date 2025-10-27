'use client';

import { useState, useEffect } from 'react';
import { FirebaseDonationService, Donation } from '@/lib/firebase-database';
import StarryBackground from '@/components/StarryBackground';

export default function AdminPage() {
  const [pledges, setPledges] = useState<Donation[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pledges' | 'donations'>('pledges');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pledgesData, donationsData] = await Promise.all([
        FirebaseDonationService.getPledges(),
        FirebaseDonationService.getCompletedDonations()
      ]);
      setPledges(pledgesData);
      setDonations(donationsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black relative">
      <StarryBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            WICC Fundraising Admin
          </h1>
          <p className="text-purple-200 text-lg">
            Access and manage all pledges and donations
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-purple-900/30 rounded-xl p-1 border border-purple-500/50">
            <button
              onClick={() => setActiveTab('pledges')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'pledges'
                  ? 'bg-purple-600 text-white'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              Pledges ({pledges.length})
            </button>
            <button
              onClick={() => setActiveTab('donations')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'donations'
                  ? 'bg-purple-600 text-white'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              Donations ({donations.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-white text-xl">
            Loading data...
          </div>
        ) : (
          <div className="bg-purple-900/20 rounded-xl border border-purple-500/50 p-6">
            {activeTab === 'pledges' ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="text-amber-500 mr-2">📋</span>
                  All Pledges
                </h2>
                
                {pledges.length === 0 ? (
                  <div className="text-center text-purple-200 py-8">
                    No pledges found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pledges.map((pledge) => (
                      <div
                        key={pledge.id}
                        className="bg-white/10 rounded-xl p-4 border border-purple-400/30"
                      >
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <h3 className="font-bold text-white text-lg">
                              {pledge.donorName}
                            </h3>
                            <p className="text-purple-200 text-sm">
                              {pledge.donorEmail}
                            </p>
                            {pledge.donorPhone && (
                              <p className="text-purple-200 text-sm">
                                {pledge.donorPhone}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <p className="text-2xl font-bold text-amber-400">
                              {formatCurrency(pledge.amount)}
                            </p>
                            <p className="text-purple-200 text-sm">
                              {formatDate(pledge.createdAt)}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-purple-200 text-sm">
                              <strong>Status:</strong> {pledge.status}
                            </p>
                            {pledge.notes && (
                              <p className="text-purple-200 text-sm mt-1">
                                <strong>Notes:</strong> {pledge.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="text-green-500 mr-2">💰</span>
                  All Donations
                </h2>
                
                {donations.length === 0 ? (
                  <div className="text-center text-purple-200 py-8">
                    No donations found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {donations.map((donation) => (
                      <div
                        key={donation.id}
                        className="bg-white/10 rounded-xl p-4 border border-purple-400/30"
                      >
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <h3 className="font-bold text-white text-lg">
                              {donation.donorName}
                            </h3>
                            <p className="text-purple-200 text-sm">
                              {donation.donorEmail}
                            </p>
                            {donation.donorPhone && (
                              <p className="text-purple-200 text-sm">
                                {donation.donorPhone}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <p className="text-2xl font-bold text-green-400">
                              {formatCurrency(donation.amount)}
                            </p>
                            <p className="text-purple-200 text-sm">
                              {formatDate(donation.createdAt)}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-purple-200 text-sm">
                              <strong>Method:</strong> {donation.paymentMethod}
                            </p>
                            <p className="text-purple-200 text-sm">
                              <strong>Status:</strong> {donation.status}
                            </p>
                            {donation.notes && (
                              <p className="text-purple-200 text-sm mt-1">
                                <strong>Notes:</strong> {donation.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Total Pledges</h3>
            <p className="text-3xl font-bold">
              {formatCurrency(pledges.reduce((sum, pledge) => sum + pledge.amount, 0))}
            </p>
            <p className="text-amber-100 text-sm">
              {pledges.length} pledge{pledges.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Total Donations</h3>
            <p className="text-3xl font-bold">
              {formatCurrency(donations.reduce((sum, donation) => sum + donation.amount, 0))}
            </p>
            <p className="text-green-100 text-sm">
              {donations.length} donation{donations.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Back to Main Page */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Back to Main Page
          </a>
        </div>
      </div>
    </div>
  );
}
