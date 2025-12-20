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
const db = firebase.firestore();

// 2. DOM ELEMENTS
const mainContainer = document.getElementById('main-container');
const signUpToggle = document.getElementById('signUpToggle');
const signInToggle = document.getElementById('signInToggle');
const settingsPanel = document.getElementById('settings-panel');

// 3. UI ANIMATIONS
signUpToggle.addEventListener('click', () => mainContainer.classList.add("right-panel-active"));
signInToggle.addEventListener('click', () => mainContainer.classList.remove("right-panel-active"));

function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

function toggleSettings() {
    settingsPanel.classList.toggle('active');
}

// 4. DATABASE SYNC
function syncUserToFirestore(user) {
    return db.collection("users").doc(user.uid).set({
        name: user.displayName || "New User",
        email: user.email,
        photo: user.photoURL || "",
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
}

// 5. AUTH LOGIC
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('display-name-label').innerText = user.displayName || "User";
        document.getElementById('user-email-display').innerText = user.email;
        switchView('dashboard-view');
    } else {
        if (!document.getElementById('reset-view').classList.contains('active')) {
            switchView('auth-view');
        }
    }
});

// LOGIN
document.getElementById('signInForm').addEventListener('submit', (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(document.getElementById('inEmail').value, document.getElementById('inPassword').value)
        .catch(err => alert(err.message));
});

// SIGN UP
document.getElementById('signUpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('upName').value;
    auth.createUserWithEmailAndPassword(document.getElementById('upEmail').value, document.getElementById('upPassword').value)
        .then((res) => {
            return res.user.updateProfile({ displayName: name }).then(() => {
                syncUserToFirestore(res.user);
            });
        })
        .catch(err => alert(err.message));
});

// GOOGLE
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    // THIS LINE FORCES THE ACCOUNT SELECTION SCREEN
    provider.setCustomParameters({
        prompt: 'select_account'
    });

    auth.signInWithPopup(provider)
        .then((result) => {
            syncUserToFirestore(result.user);
        })
        .catch((error) => {
            console.error("Error:", error.code, error.message);
            alert(error.message);
        });
}

// RESET PASSWORD
document.getElementById('resetForm').addEventListener('submit', (e) => {
    e.preventDefault();
    auth.sendPasswordResetEmail(document.getElementById('resetEmail').value)
        .then(() => { alert("Check email!"); switchView('auth-view'); })
        .catch(err => alert(err.message));
});

// UPDATE NAME
function updateName() {
    const newName = document.getElementById('newNameInput').value;
    if (newName) {
        auth.currentUser.updateProfile({ displayName: newName }).then(() => {
            syncUserToFirestore(auth.currentUser);
            document.getElementById('display-name-label').innerText = newName;
            alert("Name Updated!");
            toggleSettings();
        });
    }
}

// LOGOUT
function logout() { auth.signOut(); settingsPanel.classList.remove('active'); }
const ADMIN_EMAIL = "admin@techworld.com";

auth.onAuthStateChanged(user => {
    if (user) {
        switchView('dashboard-view');
        startChatListener();

        if (user.email !== ADMIN_EMAIL) {
            document.getElementById("chatInputBox").style.display = "none";
        }
    }
});
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    const chatId = auth.currentUser.uid;

    db.collection("messages")
      .doc(chatId)
      .collection("msgs")
      .add({
          text: text,
          sender: "admin",
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

    messageInput.value = "";
}

