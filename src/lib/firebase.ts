import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration with fallback values
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'demo-app-id'
};

// Initialize Firebase only if we have real config
let app: ReturnType<typeof initializeApp> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;

// Only initialize if we have real Firebase keys (not placeholder values)
if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'demo-key' &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your_api_k...' &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'demo-project' &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'your_project_id') {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log('✅ Firebase initialized successfully');
    console.log('✅ Firebase Project ID:', firebaseConfig.projectId);
    console.log('✅ Firebase API Key:', firebaseConfig.apiKey.substring(0, 10) + '...');
  } catch (error) {
    console.warn('⚠️ Firebase initialization failed:', error);
  }
} else {
  console.log('ℹ️ Firebase not configured - using demo mode');
}

// Export Firebase instances (will be null if not configured)
export { db, auth };

// Note: Firebase emulators disabled for now - using live Firebase
// To enable emulators later, uncomment the code below:
// if (process.env.NODE_ENV === 'development' && db && auth) {
//   try {
//     connectFirestoreEmulator(db, 'localhost', 8080);
//     connectAuthEmulator(auth, 'http://localhost:9099');
//   } catch {
//     // Emulators already connected or not available
//   }
// }

export default app;