import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import firebaseConfig from "../firebase.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const login = document.getElementById("login");
const logout = document.getElementById("logout");

// Login with Google popup
login.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;

      // Store user info
      const userData = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        uid: user.uid,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      window.location.href = "/dashboard";
      return userData;
    })
    .catch((error) => {
      console.error("Sign-in error:", error.code, error.message);
      throw error;
    });
});
// Check auth state - runs on every page load
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User already logged in:", user.email);
    // Only redirect if we're on the homepage, not already on dashboard
    if (
      window.location.pathname === "/" ||
      window.location.pathname === "/index.html"
    ) {
      console.log("Redirecting to dashboard...");
      window.location.href = "/dashboard";
    }
  } else {
    console.log("No user logged in");
  }
});
