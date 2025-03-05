// dashboard.js - Dashboard Related Utilities

import { 
    getFirestore, 
    doc, 
    getDoc, 
    updateDoc, 
    collection, 
    query, 
    where, 
    getDocs 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Initialize Firestore
const db = getFirestore();
const auth = getAuth();

/**
 * Fetch user's profile data
 * @returns {Promise} - User profile data
 */
export async function getUserProfile() {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user");

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
        console.error("Profile Fetch Error:", error);
        throw error;
    }
}

/**
 * Update user's profile information
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} - Update promise
 */
export async function updateUserProfile(profileData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user");

        await updateDoc(doc(db, 'users', user.uid), profileData);
    } catch (error) {
        console.error("Profile Update Error:", error);
        throw error;
    }
}

/**
 * Fetch user's enrolled courses
 * @returns {Promise} - Array of enrolled courses
 */
export async function getUserCourses() {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user");

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        return userDoc.data()?.courses || [];
    } catch (error) {
        console.error("Courses Fetch Error:", error);
        throw error;
    }
}

/**
 * Enroll user in a course
 * @param {string} courseId - Course identifier
 * @returns {Promise} - Enrollment promise
 */
export async function enrollInCourse(courseId) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user");

        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
            courses: firebase.firestore.FieldValue.arrayUnion(courseId)
        });
    } catch (error) {
        console.error("Course Enrollment Error:", error);
        throw error;
    }
}

/**
 * Get recommended courses based on user's profile
 * @returns {Promise} - Array of recommended courses
 */
export async function getRecommendedCourses() {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user");

        const coursesRef = collection(db, 'courses');
        const recommendedQuery = query(
            coursesRef, 
            where('difficulty', '==', 'beginner'),
            where('category', 'in', ['AI', 'Programming'])
        );

        const querySnapshot = await getDocs(recommendedQuery);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Recommended Courses Error:", error);
        throw error;
    }
}

/**
 * Track course progress
 * @param {string} courseId - Course identifier
 * @param {number} progress - Progress percentage
 * @returns {Promise} - Progress update promise
 */
export async function updateCourseProgress(courseId, progress) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user");

        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
            [`courseProgress.${courseId}`]: progress
        });
    } catch (error) {
        console.error("Course Progress Update Error:", error);
        throw error;
    }
}