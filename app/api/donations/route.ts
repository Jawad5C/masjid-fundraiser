import { NextRequest, NextResponse } from 'next/server';
import { FirebaseDonationService } from '@/lib/firebase-database';

// GET /api/donations - Get all donations and stats
export async function GET() {
  try {
    const [donations, stats] = await Promise.all([
      FirebaseDonationService.getDonations(),
      FirebaseDonationService.getStats()
    ]);

    return NextResponse.json({
      donations,
      stats,
      success: true
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donations', success: false },
      { status: 500 }
    );
  }
}

// POST /api/donations - Add new donation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      amount, 
      donorName, 
      donorEmail, 
      donorPhone,
      type, 
      paymentMethod, 
      status = 'pending',
      notes,
      pledgeDate,
      pledgeMethod
    } = body;

    // Validate required fields
    if (!amount || !donorName || !donorEmail || !type) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    const donation = await FirebaseDonationService.addDonation({
      amount: Number(amount),
      donorName,
      donorEmail,
      donorPhone,
      type,
      paymentMethod,
      status,
      notes,
      pledgeDate: pledgeDate ? new Date(pledgeDate) : undefined,
      pledgeMethod
    });

    return NextResponse.json({
      donation,
      success: true,
      message: 'Donation recorded successfully'
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { error: 'Failed to create donation', success: false },
      { status: 500 }
    );
  }
}
