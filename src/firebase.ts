import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCk8GPEMmzFONVOFyb3et24s-0nBfxSPhs',
  authDomain: 'formation-android-6e504.firebaseapp.com',
  projectId: 'formation-android-6e504',
  storageBucket: 'formation-android-6e504.firebasestorage.app',
  messagingSenderId: '903751504995',
  appId: '1:903751504995:web:4f1e93937aaa41e6c69456',
  measurementId: 'G-TQJ3S4GT9Z',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
