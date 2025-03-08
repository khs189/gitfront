// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAS3PvYpj1jP-bgmg7dr0qucv6Qw6xtvWU",
  authDomain: "gitsurvey-4ae33.firebaseapp.com",
  projectId: "gitsurvey-4ae33",
  storageBucket: "gitsurvey-4ae33.firebasestorage.app",
  messagingSenderId: "604446927397",
  appId: "1:604446927397:web:726aa9bb3f85b02ab9edcc",
  measurementId: "G-TJ06TQWFC6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); // Firebase Authentication 추가
export default app;
