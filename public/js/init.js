/**
 * @module init
 * @description This module initializes the application's data provider.
 */

document.addEventListener('DOMContentLoaded', () => {
  // TODO: Replace with your app's actual Firebase project configuration
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Set the data provider for the application
  // The global `setDataProvider` function is exposed by `database.js`
  if (typeof setDataProvider === 'function') {
    setDataProvider('firebase', { firebase });
  } else {
    console.error('setDataProvider is not defined. Make sure database.js is loaded correctly.');
  }
});
