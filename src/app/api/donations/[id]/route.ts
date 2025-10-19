import { NextRequest, NextResponse } from 'next/server';
import { DonationDatabase } from '@/lib/database';

// PUT /api/donations/[id] - Update donation status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required', success: false },
        { status: 400 }
      );
    }

    const donation = await DonationDatabase.updateDonationStatus(id, status);

    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      donation,
      success: true,
      message: 'Donation status updated successfully'
    });
  } catch (error) {
    console.error('Error updating donation:', error);
    return NextResponse.json(
      { error: 'Failed to update donation', success: false },
      { status: 500 }
    );
  }
}
