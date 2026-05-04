import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAU-ynA1gYrGGUk8lHbLtWblQc5sRaIbNs",
  authDomain: "ccm-liga.firebaseapp.com",
  projectId: "ccm-liga",
  storageBucket: "ccm-liga.firebasestorage.app",
  messagingSenderId: "956411275900",
  appId: "1:956411275900:web:97a3c6b1aeb0545da1f7f9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);