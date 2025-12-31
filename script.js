// FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyD0efUT_IFoPQ3svHnu89j7kyWE6OYnWtE",
    authDomain: "the-tech-world-e2b7c.firebaseapp.com",
    projectId: "the-tech-world-e2b7c",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// AUTH STATE
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById("display-name-label").innerText = user.displayName || "User";
        document.getElementById("user-email-display").innerText = user.email;
        switchView("dashboard-view");
        loadCards();
    } else {
        switchView("auth-view");
    }
});

// VIEW SWITCH
function switchView(id) {
    document.querySelectorAll(".view-section").forEach(v => v.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

// SIGN UP
document.getElementById("signUpForm").onsubmit = e => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(
        upEmail.value,
        upPassword.value
    ).then(res => {
        return res.user.updateProfile({ displayName: upName.value });
    }).catch(err => alert(err.message));
};

// SIGN IN
document.getElementById("signInForm").onsubmit = e => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(inEmail.value, inPassword.value)
        .catch(err => alert(err.message));
};

// LOGOUT
function logout() {
    auth.signOut();
}

// =======================
// DEMO CARD SYSTEM
// =======================

document.getElementById("addCardForm").onsubmit = async e => {
    e.preventDefault();

    const user = auth.currentUser;
    const number = cardNumber.value.replace(/\s/g, '');

    if (number.length < 4) return alert("Invalid demo card");

    await db.collection("cards").add({
        userId: user.uid,
        holder: cardHolder.value,
        last4: number.slice(-4),
        brand: "Telda (Demo)",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    e.target.reset();
};

function loadCards() {
    const list = document.getElementById("cardsList");

    db.collection("cards")
      .where("userId", "==", auth.currentUser.uid)
      .onSnapshot(snapshot => {
          list.innerHTML = "";
          snapshot.forEach(doc => {
              const c = doc.data();
              list.innerHTML += `
                <li>
                    💳 ${c.brand}<br>
                    **** **** **** ${c.last4}<br>
                    ${c.holder}
                </li>`;
          });
      });
}
