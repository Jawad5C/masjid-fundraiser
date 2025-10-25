# 📧 Mailgun Setup Guide for WICC Masjid Fundraiser

## Step 1: Create Mailgun Account

1. **Go to [mailgun.com](https://mailgun.com)**
2. **Click "Sign Up"** and create a free account
3. **Verify your email** and complete the setup process

## Step 2: Get Your Mailgun Credentials

1. **Login to Mailgun Dashboard**
2. **Go to "API Keys"** in the left sidebar
3. **Copy your Private API Key** (starts with `key-`)
4. **Go to "Domains"** in the left sidebar
5. **Copy your domain** (looks like `sandbox-123.mailgun.org` for testing)

## Step 3: Add Credentials to Your Project

Create or update your `.env.local` file in your project root:

```bash
# Firebase Configuration (Already working)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAx7-nh6MCz6I-hoKsaRyCUxUwWRm35n1U
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=masjid-fundraiser.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=masjid-fundraiser
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=masjid-fundraiser.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=896975334489
NEXT_PUBLIC_FIREBASE_APP_ID=1:896975334489:web:432f0b4ebef8d9c0ffd548
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-9R2FBCCKHS

# Mailgun Email Configuration
MAILGUN_API_KEY=key-your-actual-api-key-here
MAILGUN_DOMAIN=your-domain.mailgun.org
MAILGUN_FROM_EMAIL=noreply@your-domain.mailgun.org

# Twilio SMS Configuration (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## Step 4: Test Your Setup

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Make a test pledge** on your donation page
3. **Check your email** - you should receive a professional receipt!

## 🎯 Benefits of Mailgun

✅ **Professional emails** - Sent from your domain (not Gmail)  
✅ **High deliverability** - Emails won't go to spam  
✅ **10,000 free emails/month** - Perfect for a fundraiser  
✅ **Easy setup** - No complex SMTP configuration  
✅ **Reliable service** - Used by major companies  

## 🔧 Troubleshooting

**If emails don't arrive:**
1. **Check spam folder** first
2. **Verify your API key** is correct
3. **Check Mailgun dashboard** for delivery logs
4. **Make sure domain is verified** in Mailgun

**For production:**
- **Add your own domain** (like `wicc.org`) to Mailgun
- **Update MAILGUN_DOMAIN** to your custom domain
- **Update MAILGUN_FROM_EMAIL** to `noreply@wicc.org`

## 📞 Need Help?

- **Mailgun Documentation:** [mailgun.com/docs](https://mailgun.com/docs)
- **Free Support:** Available in Mailgun dashboard
- **Community:** Stack Overflow with `mailgun` tag
