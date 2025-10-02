// ==========================
// Firebase
// ==========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAQQa-v3Zg-HNwKoNDiTGYrfyXX7SnIiGM",
  authDomain: "tontine-easy.firebaseapp.com",
  projectId: "tontine-easy",
  storageBucket: "tontine-easy.firebasestorage.app",
  messagingSenderId: "138013449509",
  appId: "1:138013449509:web:a7e8b5462449f77e7f8ecc"
};

// ✅ éviter l’erreur duplicate-app
import { getApps } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
const db = getFirestore(app);

// ==========================
// Variables DOM
// ==========================
const tbodyActifs = document.getElementById('tbodyActifs');
const tbodyBloques = document.getElementById('tbodyBloques');
const fmt = new Intl.NumberFormat('fr-FR');

const cardActifs = document.querySelector('.card[data-card="actifs"] p');
const cardBloques = document.querySelector('.card[data-card="bloques"] p');
const cardTotal = document.querySelector('.card[data-card="total"] p');

// Pagination
const itemsPerPage = 5;
let currentPageActifs = 1;
let membresActifs = [];
let membresBloques = [];

// ==========================
// Render lignes
// ==========================
function renderRow(m) {
  const tr = document.createElement('tr');
  const dateDebut = m.dateDebut?.toDate ? m.dateDebut.toDate().toLocaleDateString('fr-FR') : m.dateDebut ?? "-";

  tr.innerHTML = `
    <td class="py-3 px-6 ms-5">${m.prenom ?? "-"} ${m.nom ?? ""}</td>
    <td class="py-3 px-6 ms-5">${dateDebut}</td>
    <td class="py-3 px-6 ms-5">${fmt.format(m.seuil ?? 0)} FCFA</td>
    <td class="py-3 px-6 ms-5">${m.progression ?? 0}%</td>
    <td class="py-3 px-6 ms-5">${m.statut ?? "En cours"}</td>
    <td class="py-3 px-6 ms-5 flex gap-3">
      <button class="hover:text-blue-500">👁</button>
      <button class="hover:text-yellow-500">✏</button>
      <button class="hover:text-red-500">🚫</button>
    </td>
  `;
  return tr;
}

function renderRowBloque(m) {
  const tr = document.createElement('tr');
  const dateDebut = m.dateDebut?.toDate ? m.dateDebut.toDate().toLocaleDateString('fr-FR') : m.dateDebut ?? "-";

  tr.innerHTML = `
    <td class="py-3 px-6 ms-5">${m.prenom ?? "-"} ${m.nom ?? ""}</td>
    <td class="py-3 px-6 ms-5">${dateDebut}</td>
    <td class="py-3 px-6 ms-5">${fmt.format(m.seuil ?? 0)} FCFA</td>
    <td class="py-3 px-6 ms-5 text-red-500 font-bold">${m.statut ?? "Bloqué"}</td>
    <td class="py-3 px-6 ms-5 flex gap-3">
      <button class="hover:text-blue-500">👁</button>
      <button class="hover:text-red-500">❌</button>
    </td>
  `;
  return tr;
}

// ==========================
// Pagination
// ==========================
function renderTableActifsPage(page) {
  tbodyActifs.innerHTML = '';
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  membresActifs.slice(start, end).forEach(m => tbodyActifs.appendChild(renderRow(m)));
  renderPaginationActifs();
}

function renderPaginationActifs() {
  const totalPages = Math.ceil(membresActifs.length / itemsPerPage);
  const container = document.getElementById('paginationActifs');
  container.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = `px-3 py-1 rounded border ${i===currentPageActifs ? 'bg-[#20DF7F] text-white':'bg-white text-[#093545]'}`;
    btn.addEventListener('click', () => {
      currentPageActifs = i;
      renderTableActifsPage(i);
    });
    container.appendChild(btn);
  }
}

// ==========================
// Snapshot Firestore
// ==========================
const q = query(collection(db, "membres"), orderBy("createdAt", "asc"));
onSnapshot(q, (snap) => {
  membresActifs = [];
  membresBloques = [];

  snap.forEach(doc => {
    const m = doc.data();
    if (m.statut === "Bloqué") membresBloques.push(m);
    else membresActifs.push(m);
  });

  cardActifs.textContent = membresActifs.length;
  cardBloques.textContent = membresBloques.length;
  cardTotal.textContent = membresActifs.length + membresBloques.length;

  renderTableActifsPage(currentPageActifs);
  tbodyBloques.innerHTML = '';
  membresBloques.forEach(m => tbodyBloques.appendChild(renderRowBloque(m)));
});

// ==========================
// Modal
// ==========================
const modal = document.getElementById('modal');
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');

if (openBtn && closeBtn) {
  openBtn.addEventListener('click', ()=>modal.classList.remove('hidden'));
  closeBtn.addEventListener('click', ()=>modal.classList.add('hidden'));
  window.addEventListener('click', e => { if(e.target===modal) modal.classList.add('hidden'); });
}

// ==========================
// Ajouter un membre
// ==========================
const form = document.getElementById('formMembre');
if (form) {
  form.addEventListener('submit', async e=>{
    e.preventDefault();
    const [nom, prenom, , profession, email, telephone, adresse, role] = form.querySelectorAll('input');

    try {
      await addDoc(collection(db,"membres"),{
        nom: nom.value,
        prenom: prenom.value,
        profession: profession.value,
        email: email.value,
        telephone: telephone.value,
        adresse: adresse.value,
        role: role.value,
        seuil: 300000,
        progression: 0,
        statut: "En cours",
        dateDebut: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      modal.classList.add('hidden');
      form.reset();
    } catch(err) {
      console.error("Erreur ajout membre :", err);
    }
  });
}

// ==========================
// Cards clic (filtrer affichage)
// ==========================
const cards = document.querySelectorAll('.card');
const divActifs = tbodyActifs.closest('div');
const divBloques = tbodyBloques.closest('div');

function showTable(cardType) {
  if(cardType==='actifs'){ divActifs.style.display='block'; divBloques.style.display='none'; }
  else if(cardType==='bloques'){ divActifs.style.display='none'; divBloques.style.display='block'; }
  else{ divActifs.style.display='block'; divBloques.style.display='block'; }

  cards.forEach(card=>{
    if(card.dataset.card===cardType){ 
      card.style.backgroundColor='#20DF7F'; 
      card.style.color='#FFFFFF'; 
    } else {
      card.style.backgroundColor='#FFFFFF'; 
      card.style.color='#093545'; 
    }
  });
}

showTable('total');
cards.forEach(card=>card.addEventListener('click',()=>showTable(card.dataset.card)));

console.log("✅ utilisateurs.js chargé et exécuté !");
