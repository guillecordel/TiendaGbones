// src/lib/firebase.ts
import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { type Firestore, getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validate required fields (fails fast in dev)
if (typeof window !== "undefined") {
	const required = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"];
	for (const key of required) {
		if (!firebaseConfig[key as keyof typeof firebaseConfig]) {
			throw new Error(`[Firebase Config] Missing: NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`);
		}
	}
}

// Initialize app (singleton pattern)
let app: FirebaseApp;
if (getApps().length === 0) {
	app = initializeApp(firebaseConfig);
} else {
	app = getApp();
}

// Initialize Firestore (HMR-safe)
let firestoreInstance: Firestore | null = null;

export const getDb = (): Firestore => {
	if (firestoreInstance) return firestoreInstance;

	try {
		// Try to get existing instance first (survives HMR)
		firestoreInstance = getFirestore(app);
	} catch (error) {
		// If getFirestore fails (shouldn't happen), initialize manually
		if (typeof window !== "undefined") {
			firestoreInstance = initializeFirestore(app, {
				experimentalAutoDetectLongPolling: true,
			});
		} else {
			firestoreInstance = getFirestore(app);
		}
	}

	return firestoreInstance;
};

// Export singleton instance
export const db = getDb();

export default app;
