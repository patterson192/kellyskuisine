import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, setPersistence, browserLocalPersistence } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore, setLogLevel } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js';

// Global variables
let app;
let auth;
let db;
let analytics;
let userId;

/**
 * Initialize Firebase authentication
 * @param {Object} firebaseConfig - Firebase configuration object
 * @param {string} appId - Application ID
 * @returns {Promise<void>}
 */
export async function initializeAuth(firebaseConfig, appId) {
    try {
        console.log('Starting Firebase initialization...');
        
        // Initialize Firebase
        if (!firebaseConfig || typeof firebaseConfig !== 'object') {
            throw new Error('Invalid Firebase configuration');
        }
        
        // Ensure all required config fields are present
        const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
        const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
        }
        
        app = initializeApp(firebaseConfig);
        console.log('Firebase app initialized');
        
        auth = getAuth(app);
        console.log('Firebase auth initialized');
        
        // Set auth persistence to keep user logged in
        await setPersistence(auth, browserLocalPersistence);
        console.log('Firebase auth persistence enabled');
        
        db = getFirestore(app);
        console.log('Firestore initialized');
        
        try {
            analytics = getAnalytics(app);
            console.log('Analytics initialized');
        } catch (analyticsError) {
            console.warn('Analytics initialization failed:', analyticsError);
            // Don't throw error for analytics failure
        }
        
        setLogLevel('debug');

        // Set up authentication state observer
        onAuthStateChanged(auth, handleAuthStateChange);

        // Don't attempt any automatic sign in - let the login form handle it
        console.log('Firebase initialization completed successfully');
        
        // Dispatch event to notify other modules that Firebase is ready
        window.dispatchEvent(new CustomEvent('firebaseInitialized'));

    } catch (error) {
        console.error('Error initializing Firebase:', error);
        throw new Error(`Firebase initialization failed: ${error.message}`);
    }
}

/**
 * Handle authentication state changes
 * @param {Object} user - Firebase user object
 */
async function handleAuthStateChange(user) {
    try {
    if (user) {
        userId = user.uid;
        console.log('User is signed in with UID:', userId);
        
        // Store current user ID in localStorage for persistence
        localStorage.setItem('lastUserId', userId);
        
        // Update UI with user ID if element exists
        const userIdDisplay = document.getElementById('user-id-display');
        if (userIdDisplay) userIdDisplay.textContent = `User ID: ${userId}`;

        // Dispatch event for other modules
        window.dispatchEvent(new CustomEvent('userAuthenticated', { detail: { userId } }));
    } else {
        console.log('User is signed out');
        userId = null;
        // Don't automatically sign in - let the login form handle authentication
        }
    } catch (error) {
        console.error('Error in auth state change:', error);
        throw new Error(`Authentication state change failed: ${error.message}`);
    }
}

/**
 * Attempt to sign in user
 * @returns {Promise<void>}
 */
async function signInUser() {
    try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(auth, __initial_auth_token);
            console.log('Signed in with custom token');
        } else {
            // Don't sign in anonymously - let the login form handle authentication
            console.log('No automatic sign-in - user must log in through the form');
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        throw new Error(`Authentication failed: ${error.message}`);
    }
}

/**
 * Get the Firestore database instance
 * @returns {Object} Firestore database instance
 */
export function getDb() {
    return db;
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export function isAuthenticated() {
    return !!userId;
}

/**
 * Get the current user ID
 * @returns {string|null} User ID if authenticated, null otherwise
 */
export function getCurrentUserId() {
    return userId;
}

// After initializing Firebase app
export { app };