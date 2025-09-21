// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-399106168-52cb0",
  "appId": "1:76670919674:web:39113031dd3f52a3a8fa43",
  "apiKey": "AIzaSyCesfU3Cc1BzUYQnPacsIGR-oKSw1-Av6E",
  "authDomain": "studio-399106168-52cb0.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "76670919674"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
