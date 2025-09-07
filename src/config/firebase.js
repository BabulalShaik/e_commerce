// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v9-compat and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAB1n3z7mHnS-JChJt491V9HbRPG0vekms",
  authDomain: "e-commerce-8aec3.firebaseapp.com",
  projectId: "e-commerce-8aec3",
  storageBucket: "e-commerce-8aec3.firebasestorage.app",
  messagingSenderId: "108019865885",
  appId: "1:108019865885:web:9d7f547e7bae91c74ea9f4",
  measurementId: "G-40821G11WR"
};

// Debug: Log the config to ensure it's loaded correctly
console.log('Environment Variables:', {
  REACT_APP_FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY ? 'LOADED' : 'MISSING',
  REACT_APP_FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'MISSING',
  REACT_APP_FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'MISSING'
});

console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? '***' : 'MISSING',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId ? '***' : 'MISSING',
  appId: firebaseConfig.appId ? '***' : 'MISSING'
});

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
