# 🔥 Firebase Setup Guide for Beginners

## Step-by-Step Firebase Configuration

### 1. Create Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click "Get started"
3. Click "Add project"
4. Project name: `masjid-fundraiser`
5. Click "Continue"
6. Enable Google Analytics (recommended)
7. Click "Create project"
8. Wait for setup to complete

### 2. Get Firebase Configuration
1. Click the gear icon ⚙️ (top left)
2. Click "Project settings"
3. Scroll to "Your apps" section
4. Click the Web icon (</>)
5. App nickname: `masjid-fundraiser-web`
6. Click "Register app"
7. **COPY THE CONFIG VALUES** - you'll need them!

### 3. Set Up Firestore Database
1. Click "Firestore Database" (left sidebar)
2. Click "Create database"
3. Choose "Start in test mode"
4. Choose location closest to your users
5. Click "Done"

### 4. Create Environment Variables
Create a file called `.env.local` in your project root with these values:

```bash
# Replace with your actual Firebase config values
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe (we'll set up later)
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Test Your Setup
Run these commands to test:

```bash
npm run dev
```

If everything works, you should see your app running with Firebase connected!

## What Firebase Gives You:

✅ **Real-time updates** - Thermometer updates instantly
✅ **Free database** - No costs for small projects  
✅ **Google security** - Enterprise-grade protection
✅ **Automatic scaling** - Handles millions of donations
✅ **Easy setup** - No server configuration needed

## Next Steps:
1. Get your Firebase config values
2. Create the `.env.local` file
3. Test the app locally
4. Deploy to Netlify with Firebase

## Need Help?
If you get stuck at any step, just let me know what you see on your screen and I'll help you through it!
