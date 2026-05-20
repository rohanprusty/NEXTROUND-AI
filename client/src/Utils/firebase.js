// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  // apiKey: "AIzaSyAv2ly2CN1x5YPl7gEVh00_9jb9bw43u3Q",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
 authDomain: "nextround-1865f.firebaseapp.com",
  projectId: "nextround-1865f",
  storageBucket: "nextround-1865f.firebasestorage.app",
  messagingSenderId: "318289877047",
  appId: "1:318289877047:web:5014491885955891afc7b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth(app) 
const provider = new GoogleAuthProvider() ;
export {auth , provider}