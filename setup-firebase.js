#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Setup Helper');
console.log('========================\n');

console.log('📋 Follow these steps:');
console.log('1. Go to: https://console.firebase.google.com');
console.log('2. Create a new project (or use existing)');
console.log('3. Enable Firestore Database in test mode');
console.log('4. Go to Project Settings > General');
console.log('5. Scroll to "Your apps" and click "Add app" (Web)');
console.log('6. Copy the config object\n');

console.log('📝 Once you have your Firebase config, update the .env.local file:');
console.log('   Replace the placeholder values with your actual Firebase config\n');

console.log('🔧 Your .env.local file should look like this:');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...');
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id');
console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com');
console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789');
console.log('NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef...\n');

console.log('✅ After updating .env.local, restart the server:');
console.log('   npm run dev\n');

console.log('🎯 Then test the Quranic recitation at:');
console.log('   http://localhost:3000');