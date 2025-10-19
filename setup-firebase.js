#!/usr/bin/env node

/**
 * Firebase Setup Script for Masjid Fundraiser
 * This script helps you set up Firebase step by step
 */

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Setup for Masjid Fundraiser');
console.log('=====================================\n');

console.log('📋 Step-by-Step Instructions:');
console.log('1. Go to https://console.firebase.google.com');
console.log('2. Click "Get started" or "Add project"');
console.log('3. Project name: masjid-fundraiser');
console.log('4. Enable Google Analytics (recommended)');
console.log('5. Click "Create project"\n');

console.log('🔧 Get Your Firebase Configuration:');
console.log('1. In Firebase console, click the gear icon ⚙️ (top left)');
console.log('2. Click "Project settings"');
console.log('3. Scroll to "Your apps" section');
console.log('4. Click the Web icon (</>)');
console.log('5. App nickname: masjid-fundraiser-web');
console.log('6. Click "Register app"');
console.log('7. COPY the config values that appear\n');

console.log('🗄️ Set Up Firestore Database:');
console.log('1. Click "Firestore Database" (left sidebar)');
console.log('2. Click "Create database"');
console.log('3. Choose "Start in test mode"');
console.log('4. Choose location closest to your users');
console.log('5. Click "Done"\n');

console.log('📝 Create Environment File:');
console.log('Create a file called .env.local in your project root with:');
console.log('');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here');
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id');
console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com');
console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id');
console.log('NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id');
console.log('');

console.log('✅ Test Your Setup:');
console.log('Run: npm run dev');
console.log('If everything works, you should see your app with Firebase connected!\n');

console.log('🎉 What You Get:');
console.log('✅ Real-time updates - Thermometer updates instantly');
console.log('✅ Free database - No costs for small projects');
console.log('✅ Google security - Enterprise-grade protection');
console.log('✅ Automatic scaling - Handles millions of donations');
console.log('✅ Easy setup - No server configuration needed\n');

console.log('📞 Need Help?');
console.log('If you get stuck, just let me know what you see on your screen!');
