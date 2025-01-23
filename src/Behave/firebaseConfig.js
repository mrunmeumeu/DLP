// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAWq44RtI569PW15hcGJNR6mR4IKZ8v2t0",
  authDomain: "clipboard-81621.firebaseapp.com",
  databaseURL: "https://clipboard-81621-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "clipboard-81621",
  storageBucket: "clipboard-81621.firebasestorage.app",
  messagingSenderId: "618629702430",
  appId: "1:618629702430:web:d91bbca79bd97ecfd39f0f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, get };



