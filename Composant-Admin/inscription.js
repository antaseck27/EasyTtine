// // Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
//   import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
//   import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

//   // TODO: Add SDKs for Firebase products that you want to use
//   // https://firebase.google.com/docs/web/setup#available-libraries

 

//    // Your web app's Firebase configuration
//    const firebaseConfig = {
//     apiKey: "AIzaSyAQQa-v3Zg-HNwKoNDiTGYrfyXX7SnIiGM",
//     authDomain: "tontine-easy.firebaseapp.com",
//     projectId: "tontine-easy",
//     storageBucket: "tontine-easy.firebasestorage.app",
//     messagingSenderId: "138013449509",
//     appId: "1:138013449509:web:a7e8b5462449f77e7f8ecc"
//   };

//   // Initialisation Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// // Récupérer le formulaire
// // const  inscrire = document.querySelector("inscrire");
// // Récupérer le formulaire
// const form = document.querySelector("#inscriptionForm");

// form.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   // Récupérer les valeurs
//   const nom = document.getElementById("nom").value;
//   const prenom = document.getElementById("prenom").value;
//   const dateNaissance = document.getElementById("dateNaissance").value;
//   const profession = document.getElementById("profession").value;
//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;
//   const confirmPassword = document.getElementById("confirmPassword").value;
//   const telephone = document.getElementById("telephone").value;
//   const adresse = document.getElementById("adresse").value;
//   const role = document.getElementById("role").value;

//   if (password !== confirmPassword) {
//     alert("Les mots de passe ne correspondent pas !");
//     return;
//   }

//   try {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     await setDoc(doc(db, "utilisateurs", user.uid), {
//       nom,
//       prenom,
//       dateNaissance,
//       profession,
//       email,
//       telephone,
//       adresse,
//       role,
//       createdAt: new Date()
//     });

//     alert("Inscription réussie 🎉");
//     form.reset();
//     window.location.href = "/index.html";
//   } catch (error) {
//     alert("Erreur : " + error.message);
//   }
// });



// Composant-Admin/inscription.js
import { auth, db } from '../firebase-init.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const form = document.getElementById('inscriptionForm');
if (!form) {
  console.error('form inscription non trouvé');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // récupérer valeurs
  const nom = document.getElementById('nom').value.trim();
  const prenom = document.getElementById('prenom').value.trim();
  const dateNaissance = document.getElementById('dateNaissance').value;
  const profession = document.getElementById('profession').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const telephone = document.getElementById('telephone').value.trim();
  const adresse = document.getElementById('adresse').value.trim();
  let role = (document.getElementById('role').value || '').trim().toLowerCase();

  if (password !== confirmPassword) {
    alert('Les mots de passe ne correspondent pas !');
    return;
  }

  if (!email || !password) {
    alert('Email et mot de passe requis');
    return;
  }

  try {
    // Créer l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // N'autoriser ADMIN que si tu le fais MANUELLEMENT => ici on force role utilisateur si champ vide
    if (!role) role = 'utilisateur';

    // Créer doc Firestore
    await setDoc(doc(db, 'utilisateurs', user.uid), {
      nom, prenom, dateNaissance, profession, email, telephone, adresse,
      role, createdAt: serverTimestamp()
    });

    alert('Inscription réussie 🎉');
    form.reset();
    window.location.href = '../index.html1'; // retourne à la page de connexion (racine)
  } catch (err) {
    console.error('inscription error', err);
    alert('Erreur : ' + (err.message || err.code));
  }
});
