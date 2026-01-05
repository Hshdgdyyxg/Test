// FIREBASE INIT
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

/* VIEW SWITCH */
function switchView(viewId){
  document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
}

/* SETTINGS TOGGLE */
function toggleSettings(){
  const panel = document.getElementById('settings-panel');
  if(panel) panel.classList.toggle('active');
}

/* OVERLAY TOGGLE */
window.addEventListener("DOMContentLoaded", ()=>{
  const container = document.getElementById('main-container');
  document.getElementById('signUpToggle').onclick = ()=>container.classList.add('right-panel-active');
  document.getElementById('signInToggle').onclick = ()=>container.classList.remove('right-panel-active');
});

/* SIGN UP */
document.getElementById('signUpForm').onsubmit = async (e)=>{
  e.preventDefault();
  const name = document.getElementById('upName').value;
  const email = document.getElementById('upEmail').value;
  const password = document.getElementById('upPassword').value;
  try{
    const res = await auth.createUserWithEmailAndPassword(email,password);
    await res.user.updateProfile({displayName:name});
    await db.collection("users").doc(res.user.uid).set({name,email,lastLogin:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
  }catch(err){ alert(err.message); }
};

/* SIGN IN */
document.getElementById('signInForm').onsubmit = async (e)=>{
  e.preventDefault();
  const email = document.getElementById('inEmail').value;
  const password = document.getElementById('inPassword').value;
  try{ await auth.signInWithEmailAndPassword(email,password); }catch(err){ alert(err.message); }
};

/* RESET PASSWORD */
document.getElementById('resetForm').onsubmit = async (e)=>{
  e.preventDefault();
  const email = document.getElementById('resetEmail').value;
  try{
    await auth.sendPasswordResetEmail(email);
    alert("Check your email 📧");
    switchView('auth-view');
  }catch(err){ alert(err.message); }
};

/* GOOGLE LOGIN */
function loginWithGoogle(){
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({prompt:'select_account'});
  auth.signInWithPopup(provider).then(result=>{
    db.collection("users").doc(result.user.uid).set({name:result.user.displayName,email:result.user.email,lastLogin:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
    switchView('dashboard-view');
    document.getElementById('display-name-label').innerText = result.user.displayName || "User";
    document.getElementById('user-email-display').innerText = result.user.email;
  }).catch(err=>alert(err.message));
}

/* UPDATE NAME */
function updateName(){
  const newName = document.getElementById('newNameInput').value;
  if(newName && auth.currentUser){
    auth.currentUser.updateProfile({displayName:newName}).then(()=>{
      db.collection("users").doc(auth.currentUser.uid).set({name:newName},{merge:true});
      document.getElementById('display-name-label').innerText = newName;
      alert("Name Updated ✅");
      toggleSettings();
    });
  }
}

/* LOGOUT */
function logout(){ auth.signOut(); const panel=document.getElementById('settings-panel'); if(panel) panel.classList.remove('active'); }

/* AUTH STATE */
auth.onAuthStateChanged(user=>{
  if(user){
    document.getElementById('display-name-label').innerText=user.displayName||"User";
    document.getElementById('user-email-display').innerText=user.email;
    switchView('dashboard-view');
    db.collection("users").doc(user.uid).set({name:user.displayName,email:user.email,lastLogin:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
  }else{
    if(!document.getElementById('reset-view').classList.contains('active'))
      switchView('auth-view');
  }
});
