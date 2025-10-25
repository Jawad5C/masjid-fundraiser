import { NextRequest, NextResponse } from 'next/server';

// Optional email and SMS services - only initialize if credentials are provided
let emailTransporter: any = null;
let twilioClient: any = null;

// Initialize email service if credentials are available
if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
  try {
    // Mailgun configuration
    emailTransporter = {
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
      fromEmail: process.env.MAILGUN_FROM_EMAIL || `noreply@${process.env.MAILGUN_DOMAIN}`
    };
  } catch (error) {
    console.warn('Email service not available:', error.message);
  }
}

// Initialize Twilio service if credentials are available
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    const twilio = require('twilio');
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  } catch (error) {
    console.warn('SMS service not available:', error.message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { donorInfo, donationAmount, receiptPreferences } = await request.json();

    const results = [];

    // Send email receipt if requested
    if (receiptPreferences.email && donorInfo.email) {
      if (emailTransporter) {
        try {
          const emailResult = await sendEmailReceipt(donorInfo, donationAmount);
          results.push({ method: 'email', success: true, result: emailResult });
        } catch (error) {
          results.push({ method: 'email', success: false, error: error.message });
        }
      } else {
        results.push({ 
          method: 'email', 
          success: false, 
          error: 'Email service not configured. Please add MAILGUN_API_KEY and MAILGUN_DOMAIN to .env.local' 
        });
      }
    }

    // Send SMS receipt if requested
    if (receiptPreferences.sms && donorInfo.phone) {
      if (twilioClient) {
        try {
          const smsResult = await sendSMSReceipt(donorInfo, donationAmount);
          results.push({ method: 'sms', success: true, result: smsResult });
        } catch (error) {
          results.push({ method: 'sms', success: false, error: error.message });
        }
      } else {
        results.push({ 
          method: 'sms', 
          success: false, 
          error: 'SMS service not configured. Please add Twilio credentials to .env.local' 
        });
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
  if (!emailTransporter) {
    throw new Error('Email service not configured');
  }

  const htmlContent = `
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
          <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
          <p><strong>Organization:</strong> Waterbury Islamic Cultural Center (WICC)</p>
          <p><strong>Tax ID:</strong> 83-3099502</p>
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
  `;

  // Send email using Mailgun API
  const formData = new URLSearchParams();
  formData.append('from', emailTransporter.fromEmail);
  formData.append('to', donorInfo.email);
  formData.append('subject', 'WICC Masjid Fundraiser - Donation Receipt');
  formData.append('html', htmlContent);

  const response = await fetch(`https://api.mailgun.net/v3/${emailTransporter.domain}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`api:${emailTransporter.apiKey}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mailgun API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

async function sendSMSReceipt(donorInfo: any, amount: number) {
  if (!twilioClient) {
    throw new Error('SMS service not configured');
  }

  const message = `🕌 WICC Masjid Fundraiser\n\nThank you ${donorInfo.name} for your $${amount} donation!\n\nReceipt: Tax-deductible under 501(c)(3)\nDate: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}\n\nMay Allah (SWT) bless your generosity!`;

  return await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: donorInfo.phone
  });
}
