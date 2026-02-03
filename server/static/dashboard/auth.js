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

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Ensure user data is in localStorage
    if (!localStorage.getItem("user")) {
      const res = await fetch(`/api/users?firebase_id=${user.uid}`);
      const data = await res.json();
      const userData = {
        id: data.id,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        uid: user.uid,
      };
      localStorage.setItem("user", JSON.stringify(userData));
    }

    const intro = document.getElementById("intro");
    if (intro) {
      intro.innerHTML = `Hello, ${user.displayName}`;
    }
  } else {
    localStorage.removeItem("user");
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
