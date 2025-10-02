import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { db } from "./firebase-init.js";

const auth = getAuth();

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // récupérer l’utilisateur Firestore
    const ref = doc(db, "utilisateurs", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();

      if (data.role === "administrateur") {
        // remplir le dropdown avec les infos
        document.getElementById("userName").textContent = `${data.prenom} ${data.nom}`;
        document.getElementById("userFullName").textContent = `${data.prenom} ${data.nom}`;
        document.getElementById("userRole").textContent = "Administrateur";

        if (data.photoURL) {
          document.getElementById("profileImg").src = data.photoURL;
        }
      } else {
        alert("⛔ Accès refusé ! Seuls les administrateurs peuvent accéder au dashboard.");
        window.location.href = "/index.html";
      }
    }
  } else {
    // pas connecté → retour login
    window.location.href = "/index.html";
  }
});

