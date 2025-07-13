
const firebaseConfig = {
  apiKey: "AIzaSyAx5LSkCZpE157lhflrrLtD0sG2-grxbiY",
  authDomain: "flow-control-center.firebaseapp.com",
  projectId: "flow-control-center",
  storageBucket: "flow-control-center.firebasestorage.app",
  messagingSenderId: "739617076077",
  appId: "1:739617076077:web:7ba2def0df169471a92064"
};

// ✅ Initialize App Once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// ✅ Export auth instance (or just use `firebase.auth()` directly)
window.auth = firebase.auth();


