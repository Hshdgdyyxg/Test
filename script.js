// 1. FIREBASE CONFIG
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

// 3. ANIMATION TRIGGER
signUpToggle.addEventListener('click', () => {
    mainContainer.classList.add("right-panel-active");
});
signInToggle.addEventListener('click', () => {
    mainContainer.classList.remove("right-panel-active");
});

// 4. VIEW & PANEL CONTROLS
function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

function toggleSettings() {
    settingsPanel.classList.toggle('active');
}

// 5. AUTH LOGIC
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('display-name-label').innerText = user.displayName || "User";
        switchView('dashboard-view');
    } else {
        if (!document.getElementById('reset-view').classList.contains('active')) {
            switchView('auth-view');
        }
    }
});

document.getElementById('signInForm').addEventListener('submit', (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(document.getElementById('inEmail').value, document.getElementById('inPassword').value)
        .catch(err => alert(err.message));
});

document.getElementById('signUpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('upName').value;
    auth.createUserWithEmailAndPassword(document.getElementById('upEmail').value, document.getElementById('upPassword').value)
        .then((res) => res.user.updateProfile({ displayName: name }))
        .catch(err => alert(err.message));
});

function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(err => alert(err.message));
}

function updateName() {
    const name = document.getElementById('newNameInput').value;
    if (name) {
        auth.currentUser.updateProfile({ displayName: name }).then(() => {
            alert("Updated!");
            document.getElementById('display-name-label').innerText = name;
            toggleSettings();
        });
    }
}

function logout() { auth.signOut(); settingsPanel.classList.remove('active'); }
