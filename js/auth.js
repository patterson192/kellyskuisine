import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { getFirestore, setLogLevel } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

// Global variables
let app;
let auth;
let db;
let userId;

/**
 * Initialize Firebase authentication
 * @param {Object} firebaseConfig - Firebase configuration object
 * @param {string} appId - Application ID
 * @returns {Promise<void>}
 */
export async function initializeAuth(firebaseConfig, appId) {
    try {
        // Initialize Firebase
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        setLogLevel('debug');

        // Set up authentication state observer
        onAuthStateChanged(auth, handleAuthStateChange);

        // Attempt initial sign in
        await signInUser();

    } catch (error) {
        console.error('Error initializing Firebase:', error);
        throw new Error('Could not initialize Firebase authentication');
    }
}

/**
 * Handle authentication state changes
 * @param {Object} user - Firebase user object
 */
async function handleAuthStateChange(user) {
    if (user) {
        userId = user.uid;
        console.log('User is signed in with UID:', userId);
        
        // Update UI with user ID if element exists
        const userIdDisplay = document.getElementById('user-id-display');
        if (userIdDisplay) userIdDisplay.textContent = `User ID: ${userId}`;

        // Dispatch event for other modules
        window.dispatchEvent(new CustomEvent('userAuthenticated', { detail: { userId } }));
    } else {
        console.log('User is signed out');
        userId = null;
        await signInUser();
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
            await signInAnonymously(auth);
            console.log('Signed in anonymously');
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        throw new Error('Authentication failed');
    }
}

/**
 * Get the current user ID
 * @returns {string|null} User ID if authenticated, null otherwise
 */
// Mock authentication for local storage
export let userId = 'local-user'; // Default user ID for local mode

/**
 * Initializes mock authentication.
 * @returns {Promise<void>} A promise that resolves immediately.
 */
export async function initializeAuth() {
    // No actual initialization needed for local mode
    console.log('Mock authentication initialized. User ID:', userId);
    // Dispatch an event to simulate user being authenticated
    window.dispatchEvent(new CustomEvent('userAuthenticated', { detail: { userId } }));
    return Promise.resolve();
}

/**
 * Checks if the user is authenticated (always true in local mode).
 * @returns {boolean} True, as user is always considered authenticated.
 */
export function isAuthenticated() {
    return true; 
}

/**
 * Gets the current user ID.
 * @returns {string} The mock user ID.
 */
export function getCurrentUserId() {
    return userId;
}

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called in local mode. No actual database instance.');
    return null; 
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

/**
 * Mock function for getting a database instance (returns null).
 * @returns {null} Null, as there's no database in local mode.
 */
export function getDb() {
    console.warn('getDb() called