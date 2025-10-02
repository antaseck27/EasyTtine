import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { db } from "./firebase-init.js"; // ⚠️ ton fichier Firebase init

const auth = getAuth();

// Quand l'utilisateur est connecté
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("Utilisateur connecté:", user.email);

    // 🔎 Chercher dans Firestore la collection "membres"
    const q = query(collection(db, "membres"), where("email", "==", user.email));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const membreData = snap.docs[0].data();

      // ✅ Navbar
      document.getElementById("userNameNav").textContent = membreData.prenom + " " + membreData.nom;
      document.getElementById("userFullName").textContent = membreData.prenom + " " + membreData.nom;
      document.getElementById("userRole").textContent = membreData.role || "Membre";

      // ✅ Image (si tu ajoutes un champ photoURL dans Firestore)
      if (membreData.photoURL) {
        document.getElementById("profileImg").src = membreData.photoURL;
      }
    } else {
      console.warn("⚠️ Aucun document trouvé pour cet utilisateur");
    }
  } else {
    // Si pas connecté → retour login
    window.location.href = "/index.html";
  }
});

// Déconnexion
document.getElementById("logoutBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  await signOut(auth);
  window.location.href = "/index.html";
});

