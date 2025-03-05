// auth.js - Authentication Utility Functions

import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

import { 
    getFirestore, 
    doc, 
    setDoc 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Initialize Firebase services
const auth = getAuth();
const db = getFirestore();
const googleProvider = new GoogleAuthProvider();

/**
 * Create a new user account with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} name - User's full name
 * @returns {Promise} - Firebase user credential
 */
export async function signUpUser(email, password, name) {
    try {
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user profile with name
        await updateProfile(user, { displayName: name });

        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            name: name,
            email: email,
            createdAt: new Date(),
            lastLogin: new Date(),
            courses: []
        });

        return user;
    } catch (error) {
        console.error("Signup Error:", error);
        throw error;
    }
}

/**
 * Sign in user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise} - Firebase user credential
 */
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}

/**
 * Sign in with Google authentication
 * @returns {Promise} - Firebase user credential
 */
export async function googleSignIn() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Create/update user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            name: user.displayName,
            email: user.email,
            lastLogin: new Date()
        }, { merge: true });

        return user;
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        throw error;
    }
}

/**
 * Log out the current user
 * @returns {Promise} - Logout promise
 */
export async function logoutUser() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout Error:", error);
        throw error;
    }
}

/**
 * Check current authentication state
 * @param {Function} callback - Callback function with user state
 * @returns {Function} - Unsubscribe function
 */
export function authStateObserver(callback) {
    return auth.onAuthStateChanged(callback);
}

/**
 * Reset user password
 * @param {string} email - User's email address
 * @returns {Promise} - Password reset promise
 */
export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error("Password Reset Error:", error);
        throw error;
    }
}