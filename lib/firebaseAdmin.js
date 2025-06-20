import admin from "firebase-admin";

// Initialize Firebase Admin only if environment variables are available
// This prevents build-time errors when env vars aren't set
let firebaseAdmin = null;

function initializeFirebaseAdmin() {
  if (firebaseAdmin) {
    return firebaseAdmin;
  }

  // Check if we're in a build environment or if env vars aren't available
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL) {
      // In Vercel build environment, return null instead of throwing
      console.warn('Firebase environment variables not available during build');
      return null;
    }
    // In development or runtime, throw error for missing env vars
    const missingVars = [];
    if (!process.env.FIREBASE_PROJECT_ID) missingVars.push('FIREBASE_PROJECT_ID');
    if (!process.env.FIREBASE_CLIENT_EMAIL) missingVars.push('FIREBASE_CLIENT_EMAIL');
    if (!process.env.FIREBASE_PRIVATE_KEY) missingVars.push('FIREBASE_PRIVATE_KEY');
    
    throw new Error(
      `Missing required Firebase environment variables: ${missingVars.join(", ")}`
    );
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  }
  firebaseAdmin = admin;
  return firebaseAdmin;
}

// Export the initialization function and a getter for the admin instance
export { initializeFirebaseAdmin };
export default function getFirebaseAdmin() {
  return initializeFirebaseAdmin();
}
