// 1. FIREBASE INITIALIZATION
const firebaseConfig = {
  apiKey: "AIzaSyD0efUT_IFoPQ3svHnu89j7kyWE6OYnWtE",
  authDomain: "the-tech-world-e2b7c.firebaseapp.com",
  projectId: "the-tech-world-e2b7c",
  storageBucket: "the-tech-world-e2b7c.firebasestorage.app",
  messagingSenderId: "435175920778",
  appId: "1:435175920778:web:09c9e899d71afce34c0973"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// 2. DOM ELEMENTS
const container = document.getElementById('main-container');
const signUpBtn = document.getElementById('signUpToggle');
const signInBtn = document.getElementById('signInToggle');

// 3. UI NAVIGATION
signUpBtn.addEventListener('click', () => container.classList.add("right-panel-active"));
signInBtn.addEventListener('click', () => container.classList.remove("right-panel-active"));

function switchView(viewId) {
  document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
}

// 4. AUTH STATE OBSERVER
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('user-info').innerText = "Logged in as: " + user.email;
    switchView('dashboard-view');
  } else {
    // Only go to login view if user isn't on the password reset page
    if (!document.getElementById('reset-view').classList.contains('active')) {
      switchView('auth-view');
    }
  }
});

// 5. AUTH FUNCTIONS
document.getElementById('signInForm').addEventListener('submit', (e) => {
  e.preventDefault();
  auth.signInWithEmailAndPassword(document.getElementById('inEmail').value, document.getElementById('inPassword').value)
    .catch(err => alert("Login Error: " + err.message));
});

document.getElementById('signUpForm').addEventListener('submit', (e) => {
  e.preventDefault();
  auth.createUserWithEmailAndPassword(document.getElementById('upEmail').value, document.getElementById('upPassword').value)
    .catch(err => alert("Sign Up Error: " + err.message));
});

document.getElementById('resetForm').addEventListener('submit', (e) => {
  e.preventDefault();
  auth.sendPasswordResetEmail(document.getElementById('resetEmail').value)
    .then(() => {
      alert("Reset link sent! Check your inbox.");
      switchView('auth-view');
    })
    .catch(err => alert("Error: " + err.message));
});

function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(err => alert("Google Error: " + err.message));
}

function logout() { auth.signOut(); }
