import { NextRequest, NextResponse } from 'next/server';
import { DonationDatabase } from '@/lib/database';
import { FirebaseDonationService } from '@/lib/firebase-database';

// PUT /api/donations/[id] - Update donation status or verification status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, verificationStatus } = body;

    // Update verification status if provided
    if (verificationStatus !== undefined) {
      const updated = await FirebaseDonationService.updateVerificationStatus(id, verificationStatus);
      if (!updated) {
        return NextResponse.json(
          { error: 'Donation not found', success: false },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'Verification status updated successfully'
      });
    }

    // Update status if provided
    if (status) {
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
    }

    return NextResponse.json(
      { error: 'Status or verificationStatus is required', success: false },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating donation:', error);
    return NextResponse.json(
      { error: 'Failed to update donation', success: false },
      { status: 500 }
    );
  }
}

// DELETE /api/donations/[id] - Delete a donation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await FirebaseDonationService.deleteDonation(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Donation not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Donation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting donation:', error);
    return NextResponse.json(
      { error: 'Failed to delete donation', success: false },
      { status: 500 }
    );
  }
}
