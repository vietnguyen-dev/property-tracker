import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  getAdditionalUserInfo,
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
    .then(async (result) => {
      const user = result.user;
      const additionalInfo = getAdditionalUserInfo(result);

      let userId = null;

      if (additionalInfo.isNewUser) {
        // First sign-in, create user in backend
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firebase_id: user.uid }),
        });
        const data = await res.json();
        userId = data.id;
      } else {
        // Returning user, fetch existing user from backend
        const res = await fetch(`/api/users?firebase_id=${user.uid}`);
        const data = await res.json();
        userId = data.id;
      }

      // Store user info
      const userData = {
        id: userId,
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
