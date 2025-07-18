/**
 * @module database
 * @description This module provides a database-agnostic interface for all data operations.
 * It abstracts the underlying database implementation (e.g., Firebase) from the main application logic.
 */

// --- Database Agnostic Interface ---

const dataProvider = {
  /**
   * Initializes the data provider.
   * @param {object} config - The configuration for the provider.
   */
  init: (config) => {
    console.log('Data provider not initialized.');
  },

  // --- Auth ---
  signIn: (email, password) => Promise.reject('Provider not configured'),
  signUp: (email, password) => Promise.reject('Provider not configured'),
  signOut: () => Promise.reject('Provider not configured'),
  onAuthStateChanged: (callback) => {
    console.log('Provider not configured');
    return () => {}; // Return an empty unsubscribe function
  },

  // --- Diagrams ---
  saveDiagram: (diagramData) => Promise.reject('Provider not configured'),
  getDiagrams: (userId) => Promise.reject('Provider not configured'),
  deleteDiagram: (diagramId) => Promise.reject('Provider not configured'),

  // --- User ---
  updateUser: (userId, userData) => Promise.reject('Provider not configured'),
  getUser: (userId) => Promise.reject('Provider not configured'),

  // --- AddOns ---
  saveAddOn: (addOnData) => Promise.reject('Provider not configured'),
  getAddOns: (userId) => Promise.reject('Provider not configured'),

  // --- Utility ---
  getServerTimestamp: () => new Date(),
  arrayUnion: (element) => [element], // This will need specific implementation
  arrayRemove: (element) => [element] // This will need specific implementation
};

// --- Firebase Implementation ---

const firebaseProvider = {
  init: (firebaseInstance) => {
    this.auth = firebaseInstance.auth();
    this.db = firebaseInstance.firestore();
    console.log('Firebase provider initialized.');
  },

  // Implement all methods from the generic interface using Firebase SDK
  // Example:
  signIn: (email, password) => {
    return this.auth.signInWithEmailAndPassword(email, password);
  },
  
  signOut: () => {
      return this.auth.signOut();
  },

  onAuthStateChanged: (callback) => {
    return this.auth.onAuthStateChanged(callback);
  },

  // ... other implementations ...
};

/**
 * Sets the active data provider for the application.
 * @param {string} providerName - The name of the provider to use ('firebase').
 * @param {object} config - The configuration object for the provider.
 */
function setDataProvider(providerName, config) {
  if (providerName === 'firebase') {
    firebaseProvider.init(config.firebase);
    Object.assign(dataProvider, firebaseProvider);
  } else {
    throw new Error(`Unsupported data provider: ${providerName}`);
  }
}

// Export the generic dataProvider and the setter function
// The application will only interact with these.
