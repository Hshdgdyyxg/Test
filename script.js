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
// This handles the sliding effect between Login and Sign Up
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

// 5. AUTH LOGIC & OBSERVER
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in, show dashboard
        document.getElementById('display-name-label').innerText = user.displayName || "User";
        switchView('dashboard-view');
    } else {
        // User is signed out, show auth screen (unless on reset screen)
        if (!document.getElementById('reset-view').classList.contains('active')) {
            switchView('auth-view');
        }
    }
});

// SIGN IN
document.getElementById('signInForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('inEmail').value;
    const pass = document.getElementById('inPassword').value;
    auth.signInWithEmailAndPassword(email, pass).catch(err => alert(err.message));
});

// SIGN UP
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

// GOOGLE LOGIN
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(err => alert(err.message));
}

// UPDATE PROFILE NAME
function updateName() {
    const newName = document.getElementById('newNameInput').value;
    const user = auth.currentUser;

    if (user && newName.trim() !== "") {
        user.updateProfile({ displayName: newName })
            .then(() => {
                alert("Name updated successfully!");
                document.getElementById('display-name-label').innerText = newName;
                document.getElementById('newNameInput').value = ""; // Clear input
                toggleSettings(); // Close panel
            })
            .catch((error) => alert(error.message));
    } else {
        alert("Please enter a valid name.");
    }
}

// LOGOUT
function logout() {
    auth.signOut().then(() => {
        settingsPanel.classList.remove('active');
    });
}

// Initialize Firestore
const db = firebase.firestore();

function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;

            // SAVE DATA TO FIRESTORE
            // This creates a document in a collection called 'users' using the User's ID
            db.collection("users").doc(user.uid).set({
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true }) // 'merge: true' updates the data without deleting old fields
            .then(() => {
                console.log("User data saved to Firestore!");
            })
            .catch((error) => {
                console.error("Error writing to Firestore:", error);
            });

        })
        .catch((error) => alert(error.message));
}
