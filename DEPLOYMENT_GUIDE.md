# 🚀 Masjid Fundraiser - Production Deployment Guide

## 📋 Overview
This guide will help you deploy the masjid fundraiser with a real database and payment processing for handling donations from people across the country.

## 🏗️ Architecture Overview

### Current Setup (Demo):
- ✅ **Frontend**: Next.js with React
- ✅ **Styling**: Tailwind CSS
- ✅ **Database**: In-memory storage (demo only)
- ✅ **Payments**: Stripe test mode

### Production Setup Needed:
- 🎯 **Database**: PostgreSQL or Supabase
- 🎯 **Payments**: Real Stripe integration
- 🎯 **Hosting**: Vercel or Netlify
- 🎯 **Real-time**: WebSocket or Server-Sent Events

## 🛠️ Step 1: Database Setup

### Option A: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your database URL
4. Run this SQL to create tables:

```sql
-- Create donations table
CREATE TABLE donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  donor_name VARCHAR(255) NOT NULL,
  donor_email VARCHAR(255) NOT NULL,
  donor_phone VARCHAR(20),
  type VARCHAR(20) CHECK (type IN ('donation', 'pledge')) NOT NULL,
  payment_method VARCHAR(50),
  stripe_payment_id VARCHAR(255),
  status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
  notes TEXT,
  pledge_date DATE,
  pledge_method VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create stats table
CREATE TABLE donation_stats (
  id SERIAL PRIMARY KEY,
  total_raised DECIMAL(12,2) DEFAULT 0,
  total_donations INTEGER DEFAULT 0,
  total_pledges INTEGER DEFAULT 0,
  goal_amount DECIMAL(12,2) DEFAULT 1000000,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- Insert initial stats
INSERT INTO donation_stats (total_raised, total_donations, total_pledges, goal_amount) 
VALUES (525000, 1, 0, 1000000);
```

### Option B: Vercel Postgres
1. Go to your Vercel dashboard
2. Add Postgres database
3. Use the same SQL schema above

## 🎯 Step 2: Stripe Setup

1. **Create Stripe Account**:
   - Go to [stripe.com](https://stripe.com)
   - Create account and get API keys

2. **Get API Keys**:
   - Publishable key: `pk_live_...`
   - Secret key: `sk_live_...`
   - Webhook secret: `whsec_...`

3. **Set up Webhooks**:
   - Add webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Events to listen for: `payment_intent.succeeded`, `payment_intent.payment_failed`

## 🔧 Step 3: Environment Variables

Create `.env.local` file:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here
STRIPE_SECRET_KEY=sk_live_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 🚀 Step 4: Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**:
   - Go to Vercel dashboard
   - Add all environment variables from `.env.local`

## 🔄 Step 5: Real-time Updates

For real-time donation updates, you can use:

### Option A: Server-Sent Events (SSE)
- Already implemented in the code
- Polls every 30 seconds for updates

### Option B: WebSockets (Advanced)
- Use Socket.io for real-time updates
- More complex but faster updates

## 📊 Step 6: Monitoring

1. **Stripe Dashboard**: Monitor payments
2. **Database**: Check donation records
3. **Vercel Analytics**: Monitor site performance

## 🎯 Production Checklist

- [ ] Database connected and working
- [ ] Stripe payments processing
- [ ] Webhooks receiving events
- [ ] Real-time updates working
- [ ] Mobile responsive
- [ ] SSL certificate active
- [ ] Analytics tracking
- [ ] Backup strategy

## 🆘 Troubleshooting

### Common Issues:
1. **Database Connection**: Check DATABASE_URL
2. **Stripe Webhooks**: Verify webhook secret
3. **CORS Issues**: Check API routes
4. **Build Errors**: Check TypeScript errors

### Support:
- Check Vercel logs for errors
- Monitor Stripe dashboard for failed payments
- Use browser dev tools for frontend issues

## 🎉 Success!

Once deployed, your masjid fundraiser will:
- ✅ Accept donations from anywhere in the country
- ✅ Update the thermometer in real-time
- ✅ Process payments securely
- ✅ Store all data in a real database
- ✅ Send receipts automatically
- ✅ Handle pledges and donations

**Your masjid fundraiser is now ready for the world!** 🌍✨
