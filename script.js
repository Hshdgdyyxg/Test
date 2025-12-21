// 1. INITIALIZE FIREBASE
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
const mainContainer = document.getElementById('main-container');
const signUpToggle = document.getElementById('signUpToggle');
const signInToggle = document.getElementById('signInToggle');
const settingsPanel = document.getElementById('settings-panel');

// 3. ANIMATION LOGIC (The Sliding Fix)
if (signUpToggle && signInToggle && mainContainer) {
    signUpToggle.addEventListener('click', () => {
        mainContainer.classList.add("right-panel-active");
    });

    signInToggle.addEventListener('click', () => {
        mainContainer.classList.remove("right-panel-active");
    });
}

// 4. VIEW CONTROL
function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
    const targetView = document.getElementById(viewId);
    if (targetView) targetView.classList.add('active');
}

function toggleSettings() {
    settingsPanel.classList.toggle('active');
}

// 5. AUTH OBSERVER
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('display-name-label').innerText = user.displayName || "User";
        document.getElementById('user-email-display').innerText = user.email;
        switchView('dashboard-view');
    } else {
        // Only show auth view if not currently on reset view
        if (!document.getElementById('reset-view').classList.contains('active')) {
            switchView('auth-view');
        }
    }
});

// 6. LOGIN & SIGNUP
document.getElementById('signInForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('inEmail').value;
    const pass = document.getElementById('inPassword').value;
    auth.signInWithEmailAndPassword(email, pass).catch(err => alert(err.message));
});

document.getElementById('signUpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('upName').value;
    const email = document.getElementById('upEmail').value;
    const pass = document.getElementById('upPassword').value;

    auth.createUserWithEmailAndPassword(email, pass)
        .then((res) => {
            return res.user.updateProfile({ displayName: name });
        })
        .catch(err => alert(err.message));
});

// 7. GOOGLE LOGIN
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    auth.signInWithPopup(provider).catch((error) => alert(error.message));
}

// 8. RESET PASSWORD
document.getElementById('resetForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    auth.sendPasswordResetEmail(email)
        .then(() => { 
            alert("Success! Check your email for the reset link."); 
            switchView('auth-view'); 
        })
        .catch(err => alert(err.message));
});

// 9. UPDATE NAME
function updateName() {
    const newName = document.getElementById('newNameInput').value;
    if (newName && auth.currentUser) {
        auth.currentUser.updateProfile({ displayName: newName }).then(() => {
            document.getElementById('display-name-label').innerText = newName;
            alert("Profile Updated!");
            toggleSettings();
        });
    }
}

// 10. LOGOUT
function logout() { 
    auth.signOut().then(() => {
        settingsPanel.classList.remove('active');
    });
}
