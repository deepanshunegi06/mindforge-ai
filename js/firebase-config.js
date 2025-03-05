// Firebase Configuration and Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyArjlK0U6hRX4F69VbYivB5nNb3j6gNum8",
    authDomain: "mindforgeai-5925a.firebaseapp.com",
    projectId: "mindforgeai-5925a",
    storageBucket: "mindforgeai-5925a.appspot.com", // Fixed incorrect domain
    messagingSenderId: "854666305496",
    appId: "1:854666305496:web:3d2afd8562c6c7047cdcad",
    measurementId: "G-LCTBV8NBXF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Authentication Functions
export function signUpWithEmail(email, password, name) {
    return createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
        await updateProfile(userCredential.user, { displayName: name });
        return userCredential;
    });
}

export function loginWithEmail(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

export function signInWithGoogle() {
    return signInWithPopup(auth, googleProvider); // Change to signInWithRedirect if needed
}

export function logoutUser() {
    return signOut(auth);
}

// Authentication State Observer
export function setupAuthStateObserver(callback) {
    return onAuthStateChanged(auth, callback);
}
    