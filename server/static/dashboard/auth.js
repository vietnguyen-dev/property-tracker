import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import firebaseConfig from "../firebase.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const logout = document.getElementById("logout");

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user);
    const intro = document.getElementById("intro");
    intro.innerHTML = `Hello, ${user.displayName}`;
  } else {
    console.log("No user logged in");
    window.location.href = "/index.html";
  }
});

// Login with Google popup
logout.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
});
