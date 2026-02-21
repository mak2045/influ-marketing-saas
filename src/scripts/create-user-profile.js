/**
 * One-time setup script to create user profiles in Firestore
 * Run this with: node src/scripts/create-user-profile.js
 *
 * This script creates a user document directly using Firebase Admin SDK
 */

require('dotenv').config({ path: '.env.local' });

const admin = require('firebase-admin');

// Parse service account
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const cleanedKey = serviceAccountKey.trim().replace(/^'|'$/g, "").replace(/^"|"$/g, "");
const serviceAccount = JSON.parse(cleanedKey);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
});

const db = admin.firestore();

// User data to create
const userData = {
  uid: "VvHV1Srir5StUSrkchzjmARCQA32",  // Your Firebase Auth UID from the logs
  email: "test@gmail.com",
  role: "CREATOR",  // Can be "CREATOR", "BRAND", or "ADMIN"
  displayName: "Test User",
  createdAt: new Date().toISOString(),
};

async function createUserProfile() {
  try {
    console.log('📝 Creating user profile in Firestore...');
    console.log('📋 User data:', userData);

    await db.collection('users').doc(userData.uid).set(userData);

    console.log('✅ User profile created successfully!');
    console.log(`📍 Document path: users/${userData.uid}`);

    // Verify the document was created
    const doc = await db.collection('users').doc(userData.uid).get();
    if (doc.exists) {
      console.log('✅ Verification successful - document exists in Firestore');
      console.log('📄 Stored data:', doc.data());
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating user profile:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

createUserProfile();
