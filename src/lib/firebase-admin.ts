import { initializeApp, getApps, getApp, cert, ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Settings } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Initialize Firebase Admin
let serviceAccount: ServiceAccount;
let adminApp: any = null;

try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
        console.error("❌ FIREBASE_SERVICE_ACCOUNT_KEY is missing from environment variables.");
        throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY");
    }

    // Clean up the string in case of extra quotes or whitespace from manual pasting
    const cleanedKey = serviceAccountKey.trim().replace(/^'|'$/g, "").replace(/^"|"$/g, "");

    serviceAccount = JSON.parse(cleanedKey);

    console.log("📋 Service Account Project ID:", serviceAccount.project_id);
} catch (error) {
    console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", error);
    // Fallback to empty object to prevent immediate crash, but auth will fail
    serviceAccount = {} as ServiceAccount;
}

if (!getApps().length) {
    try {
        adminApp = initializeApp({
            credential: cert(serviceAccount),
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
        console.log("✅ Firebase Admin initialized successfully.");
    } catch (error) {
        console.error("❌ Failed to initialize Firebase Admin:", error);
    }
} else {
    adminApp = getApp();
    console.log("✅ Firebase Admin app already initialized.");
}

export const adminAuth = getAuth(adminApp);

// Configure Firestore with proper settings for production
const firestoreSettings: Settings = {
    // Ignore undefined properties to prevent serialization issues
    ignoreUndefinedProperties: true,
};

export const adminDb = getFirestore(adminApp);
adminDb.settings(firestoreSettings);

export const adminStorage = getStorage(adminApp);
export default adminApp;
