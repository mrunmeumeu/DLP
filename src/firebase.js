import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

let dbInstance; // Singleton instance of the Firebase Database

const initializeFirebase = async () => {
  if (dbInstance) {
    return dbInstance; // If already initialized, return the instance
  }

  try {
    // Fetch configuration from the Flask server
    const response = await fetch('http://localhost:5000/firebase-config');
    const { config } = await response.json();
    const firebaseConfig = JSON.parse(config);

    // Prevent re-initialization if Firebase is already initialized
    if (getApps().length === 0) {
      const app = initializeApp(firebaseConfig);
      dbInstance = getDatabase(app);
    } else {
      dbInstance = getDatabase();
    }

    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    throw error;
  }
};

export default initializeFirebase;
