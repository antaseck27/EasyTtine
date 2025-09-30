// // main.js
// // Logic: connexion Firebase + redirection selon rôle (admin <-> utilisateur)

// import { auth, db } from './firebase-init.js';
// import {
//   onAuthStateChanged,
//   signInWithEmailAndPassword
// } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
// import {
//   doc,
//   getDoc,
//   setDoc,
//   serverTimestamp
// } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// /* ----------------------- CONFIG ----------------------- */
// /* Adapte ces chemins si tu veux rediriger vers d'autres pages */
// const redirectMap = {
//   admin: './Composant-Admin/dashboard.html',
//   administrateur: './Composant-Admin/dashboard.html',
//   utilisateur: './Composant-User/index.html',
//   user: './Composant-User/index.html'
// };

// /* ----------------------- DOM ------------------------ */
// const form = document.getElementById('loginForm');       // formulaire
// const submitBtn = document.getElementById('loginSubmit'); // bouton submit
// const msgBox = document.getElementById('loginMessage');   // zone message (optionnel)
// const forgotLink = document.getElementById('forgotLink'); // lien mot de passe oublié (optionnel)
// const modal = document.getElementById('modal');           // modal demo (optionnel)
// const modalOk = document.getElementById('btnOk');         // bouton ok modal

// /* --------------------- Helpers ----------------------- */
// function showMsg(text = '', type = 'info') {
//   if (!msgBox) { console.log('[MSG]', text); return; }
//   msgBox.textContent = text;
//   msgBox.style.color = type === 'error' ? 'crimson' : '#0f172a';
// }

// function normalizeRole(role) {
//   if (!role) return 'utilisateur';
//   return String(role).trim().toLowerCase();
// }

// /* ----------------- onAuthStateChanged ----------------- */
// /* Si un utilisateur est déjà connecté, on vérifie son rôle et on redirige */
// onAuthStateChanged(auth, async (user) => {
//   console.debug('[main.js] onAuthStateChanged ->', user ? user.uid : null);
//   if (!user) return; // pas connecté -> rien à faire

//   try {
//     const uRef = doc(db, 'utilisateurs', user.uid);
//     const uSnap = await getDoc(uRef);

//     if (uSnap.exists()) {
//       const role = normalizeRole(uSnap.data().role);
//       const dest = redirectMap[role] || redirectMap['utilisateur'];
//       showMsg('Utilisateur connecté — redirection...');
//       console.info(`[main.js] rôle détecté: ${role} → redirection vers ${dest}`);
//       setTimeout(() => window.location.replace(dest), 600);
//     } else {
//       // Si pas de doc, créer un profil minimal (role: utilisateur)
//       await setDoc(uRef, {
//         email: user.email || '',
//         displayName: user.displayName || '',
//         role: 'utilisateur',
//         createdAt: serverTimestamp()
//       });
//       showMsg('Profil créé — redirection vers espace utilisateur...');
//       console.info('[main.js] doc utilisateur créé (par défaut role=utilisateur)');
//       setTimeout(() => window.location.replace(redirectMap['utilisateur']), 600);
//     }
//   } catch (err) {
//     console.error('[main.js] erreur onAuthState processing', err);
//     showMsg('Erreur lors de la vérification du profil.', 'error');
//   }
// });

// /* --------------------- Form submit -------------------- */
// if (form) {
//   form.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     showMsg('');
//     submitBtn.disabled = true;
//     submitBtn.textContent = 'Connexion...';

//     const email = (document.getElementById('email')?.value || '').trim();
//     const password = document.getElementById('password')?.value || '';

//     if (!email || !password) {
//       showMsg('Email et mot de passe requis.', 'error');
//       submitBtn.disabled = false;
//       submitBtn.textContent = 'Se connecter';
//       return;
//     }

//     try {
//       // Authentification
//       const cred = await signInWithEmailAndPassword(auth, email, password);
//       console.info('[main.js] signIn success uid=', cred.user.uid);

//       // Lecture doc utilisateur
//       const uid = cred.user.uid;
//       const userRef = doc(db, 'utilisateurs', uid);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const role = normalizeRole(userSnap.data().role);
//         const dest = redirectMap[role] || redirectMap['utilisateur'];
//         showMsg('Connexion réussie — redirection...');
//         console.info(`[main.js] role=${role} -> ${dest}`);
//         window.location.replace(dest);
//       } else {
//         // Créer doc par défaut (utilisateur)
//         await setDoc(userRef, {
//           email,
//           displayName: cred.user.displayName || '',
//           role: 'utilisateur',
//           createdAt: serverTimestamp()
//         });
//         showMsg('Profil créé — redirection vers espace utilisateur...');
//         console.info('[main.js] doc utilisateur créé après login (role=utilisateur)');
//         window.location.replace(redirectMap['utilisateur']);
//       }
//     } catch (err) {
//       console.error('[main.js] login error', err);
//       const friendly = (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found')
//         ? 'Email ou mot de passe incorrect.'
//         : (err.message || 'Erreur lors de la connexion.');
//       showMsg(friendly, 'error');
//     } finally {
//       submitBtn.disabled = false;
//       submitBtn.textContent = 'Se connecter';
//     }
//   });
// } else {
//   console.warn('[main.js] formulaire #loginForm non trouvé dans la page.');
// }

// /* ------------- Modal "mot de passe oublié" demo ------------- */
// if (forgotLink && modal && modalOk) {
//   forgotLink.addEventListener('click', (e) => {
//     e.preventDefault();
//     modal.classList.remove('hidden');
//     modal.classList.add('flex');
//   });
//   modalOk.addEventListener('click', () => {
//     modal.classList.add('hidden');
//     modal.classList.remove('flex');
//   });
// }

// /* -------------------- Debug helper ---------------------- */
// /* Décommente ce bloc si tu veux des logs détaillés en continu */
// /*
// import { getDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
// onAuthStateChanged(auth, async (u) => {
//   console.log('[DEBUG] auth change', u ? u.uid : null);
//   if (!u) return;
//   try {
//     const s = await getDoc(doc(db, 'utilisateurs', u.uid));
//     console.log('[DEBUG] user doc exists:', s.exists(), s.exists() ? s.data() : null);
//   } catch(e) {
//     console.error('[DEBUG] getDoc error', e);
//   }
// });
// */

// main.js
import { auth, db } from './firebase-init.js';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const redirectMap = {
  admin: './Composant-Admin/index1.html',
  administrateur: './Composant-Admin/index1.html',
  utilisateur: './Composant-User/index.html',
  user: './Composant-User/index.html'
};

const form = document.getElementById('loginForm');
const submitBtn = document.getElementById('loginSubmit');
const msgBox = document.getElementById('loginMessage');
const loggedPanel = document.getElementById('loggedPanel');
const loggedInfo = document.getElementById('loggedInfo');
const btnGoToSpace = document.getElementById('btnGoToSpace');
const btnSignOutPanel = document.getElementById('btnSignOutPanel');

function showMsg(text = '', type = 'info') {
  if (!msgBox) { console.log('[MSG]', text); return; }
  msgBox.textContent = text;
  msgBox.style.color = type === 'error' ? 'crimson' : '#0f172a';
}
function normalizeRole(r) { return (r || 'utilisateur').toString().trim().toLowerCase(); }

/* onAuthStateChanged: afficher panel si session active (NE PAS REDIRIGER automatiquement) */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    if (loggedPanel) loggedPanel.classList.add('hidden');
    return;
  }

  try {
    const ref = doc(db, 'utilisateurs', user.uid);
    const snap = await getDoc(ref);
    const role = snap.exists() ? normalizeRole(snap.data().role) : 'utilisateur';

    if (loggedPanel && loggedInfo) {
      loggedInfo.textContent = `Vous êtes connecté en tant que ${user.email} (rôle: ${role}).`;
      loggedPanel.classList.remove('hidden');
    }
    if (btnGoToSpace) {
      btnGoToSpace.onclick = () => { const dest = redirectMap[role] || redirectMap['utilisateur']; window.location.replace(dest); };
    }
    if (btnSignOutPanel) {
      btnSignOutPanel.onclick = async () => { await signOut(auth); loggedPanel.classList.add('hidden'); showMsg('Déconnecté.'); };
    }
  } catch (err) {
    console.error('onAuthState error', err);
    showMsg('Erreur de vérification du profil.', 'error');
  }
});

/* Submit login: REQUIRE les champs et rediriger après authentification */
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showMsg('');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Connexion...';

    const email = (document.getElementById('email').value || '').trim();
    const password = (document.getElementById('password').value || '');

    if (!email || !password) {
      showMsg('Veuillez renseigner l\'email et le mot de passe.', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Se connecter';
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      const uRef = doc(db, 'utilisateurs', uid);
      const uSnap = await getDoc(uRef);

      if (uSnap.exists()) {
        const role = normalizeRole(uSnap.data().role);
        const dest = redirectMap[role] || redirectMap['utilisateur'];
        showMsg('Connexion réussie — redirection...');
        window.location.replace(dest);
      } else {
        await setDoc(uRef, { email, displayName: cred.user.displayName || '', role: 'utilisateur', createdAt: serverTimestamp() });
        showMsg('Profil créé — redirection...');
        window.location.replace(redirectMap['utilisateur']);
      }
    } catch (err) {
      console.error('Login error', err);
      const friendly = (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') ? 'Email ou mot de passe incorrect.' : (err.message || 'Erreur lors de la connexion.');
      showMsg(friendly, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Se connecter';
    }
  });
} else {
  console.warn('Formulaire #loginForm non trouvé.');
}
