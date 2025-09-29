// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
  import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD1gEj4mV2hRaJImHW1IsyQjZ1uEusY-bM",
    authDomain: "tontine-bakeli.firebaseapp.com",
    projectId: "tontine-bakeli",
    storageBucket: "tontine-bakeli.appspot.com",
    messagingSenderId: "542050089083",
    appId: "1:542050089083:web:41426bb7f5c41c496acade"
  };

  // Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Récupérer le formulaire
// const  inscrire = document.querySelector("inscrire");
// Récupérer le formulaire
const form = document.querySelector("#inscriptionForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Récupérer les valeurs
  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const dateNaissance = document.getElementById("dateNaissance").value;
  const profession = document.getElementById("profession").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const telephone = document.getElementById("telephone").value;
  const adresse = document.getElementById("adresse").value;
  const role = document.getElementById("role").value;

  if (password !== confirmPassword) {
    alert("Les mots de passe ne correspondent pas !");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "utilisateurs", user.uid), {
      nom,
      prenom,
      dateNaissance,
      profession,
      email,
      telephone,
      adresse,
      role,
      createdAt: new Date()
    });

    alert("Inscription réussie 🎉");
    form.reset();
    window.location.href = "/index.html";
  } catch (error) {
    alert("Erreur : " + error.message);
  }
});