import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Email configuration (using Gmail SMTP for now - you can change this)
const emailTransporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Twilio configuration
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: NextRequest) {
  try {
    const { donorInfo, donationAmount, receiptPreferences } = await request.json();

    const results = [];

    // Send email receipt if requested
    if (receiptPreferences.email && donorInfo.email) {
      try {
        const emailResult = await sendEmailReceipt(donorInfo, donationAmount);
        results.push({ method: 'email', success: true, result: emailResult });
      } catch (error) {
        results.push({ method: 'email', success: false, error: error.message });
      }
    }

    // Send SMS receipt if requested
    if (receiptPreferences.sms && donorInfo.phone) {
      try {
        const smsResult = await sendSMSReceipt(donorInfo, donationAmount);
        results.push({ method: 'sms', success: true, result: smsResult });
      } catch (error) {
        results.push({ method: 'sms', success: false, error: error.message });
      }
    }

    return NextResponse.json({ 
      success: true, 
      results,
      message: 'Receipt delivery processed'
    });

  } catch (error) {
    console.error('Error sending receipts:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function sendEmailReceipt(donorInfo: any, amount: number) {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: donorInfo.email,
    subject: 'WICC Masjid Fundraiser - Donation Receipt',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🕌 WICC Masjid Fundraiser</h1>
          <p style="color: white; margin: 10px 0 0 0;">Donation Receipt</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-top: 0;">Thank You for Your Generous Donation!</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">Donation Details</h3>
            <p><strong>Donor Name:</strong> ${donorInfo.name}</p>
            <p><strong>Donation Amount:</strong> $${amount}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Organization:</strong> Waterbury Islamic Cultural Center (WICC)</p>
            <p><strong>Tax ID:</strong> [Your 501(c)(3) Tax ID]</p>
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #4caf50;">
            <p style="margin: 0; color: #2e7d32;"><strong>Tax Deductible:</strong> This donation is tax-deductible under section 501(c)(3) of the Internal Revenue Code.</p>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <p style="color: #666;">May Allah (SWT) bless your generous contribution and reward you abundantly.</p>
            <p style="color: #666; font-style: italic;">"And whatever you spend in charity or devotion, be sure Allah knows it all." - Quran 2:273</p>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">© 2025 WICC Masjid Fundraiser. All rights reserved.</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Content created by Jawad Ashraf</p>
        </div>
      </div>
    `
  };

  return await emailTransporter.sendMail(mailOptions);
}

async function sendSMSReceipt(donorInfo: any, amount: number) {
  const message = `🕌 WICC Masjid Fundraiser\n\nThank you ${donorInfo.name} for your $${amount} donation!\n\nReceipt: Tax-deductible under 501(c)(3)\nDate: ${new Date().toLocaleDateString()}\n\nMay Allah (SWT) bless your generosity!`;

  return await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: donorInfo.phone
  });
}
