// src/firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBE2bo1x11y2hVak0_8eQ2spwL4rY8dysQ",
    authDomain: "fir-test-da4fb.firebaseapp.com",
    projectId: "fir-test-da4fb",
    storageBucket: "fir-test-da4fb.firebasestorage.app",
    messagingSenderId: "730127183133",
    appId: "1:730127183133:web:16db45c86872d718b785f4",
    measurementId: "G-J2K4MSZECE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
