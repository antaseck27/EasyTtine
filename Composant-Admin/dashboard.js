// // // dashboard.js

// // import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
// // import { db } from "./firebase-init.js";   // ✅ bon chemin vers ton fichier



// // async function loadCotisations() {
// //   try {
// //     const querySnapshot = await getDocs(collection(db, "cotisation"));
// //     const cotisations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// //     console.log("Cotisations Firestore:", cotisations);

// //     if (cotisations.length > 0) {
// //       const data = cotisations[0];
// //     //   document.getElementById("juinMontant").innerText = (data.montantMensuel || 19) + " FCFA";
// //     document.getElementById("juinMontant").innerText = (data.montantMensuel * 20|| 0) + " FCFA";
// //       document.getElementById("maiMontant").innerText = (data.montantMensuel * 14|| 0) + " FCFA";
// //       document.getElementById("caisseMontant").innerText = (data.montantTotal || 0) + " FCFA";
// //     }
// //   } catch (e) {
// //     console.error("Erreur Firestore:", e);
// //   }
// // }

// // loadCotisations();






// // 

// // dashboard.js
// import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
// import { db } from "./firebase-init.js";

// export async function loadCotisations() {
//   try {
//     // 1. Récupérer les cotisations Firestore
//     const querySnapshot = await getDocs(collection(db, "cotisation"));
//     const cotisations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     console.log("Cotisations Firestore:", cotisations);

//     if (cotisations.length > 0) {
//       const data = cotisations[0]; 
//       const montantMensuel = data.montantMensuel || 0;

//       // ⚡ Hypothèse : 6 mois de cotisation (Sept 2024 → Fév 2025)
//       const cotisationsParMois = {
//         "Sept 2024": 20,  // 20 cotisations
//         "Oct 2024": 14,  // 14 cotisations (6 bloqués)
//         "Nov 2024": 0,
//         "Déc 2024": 0,
//         "Janv 2025": 0,
//         "Fév 2025": 0
//       };

//       const mois = Object.keys(cotisationsParMois);
//       const dataMensuelle = mois.map(m => cotisationsParMois[m] * montantMensuel);

//       // 2. Mettre à jour les cards
//       document.getElementById("juinMontant").innerText =
//         (cotisationsParMois["Sept 2024"] * montantMensuel).toLocaleString() + " FCFA";
//       document.getElementById("maiMontant").innerText =
//         (cotisationsParMois["Oct 2024"] * montantMensuel).toLocaleString() + " FCFA";

//       const caisse = dataMensuelle.reduce((a, b) => a + b, 0);
//       document.getElementById("caisseMontant").innerText =
//         caisse.toLocaleString() + " FCFA";

//       // 3. Line Chart (évolution)
//       const lineEl = document.getElementById("lineChart");
//       if (lineEl) {
//         const lineCtx = lineEl.getContext("2d");
//         new Chart(lineCtx, {
//           type: "line",
//           data: {
//             labels: mois,
//             datasets: [{
//               label: "Cotisations mensuelles",
//               data: dataMensuelle,
//               borderColor: "#10b981",
//               backgroundColor: "rgba(16,185,129,0.08)",
//               tension: 0.35,
//               pointRadius: 4,
//               pointBackgroundColor: "#08303a"
//             }]
//           },
//           options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: { legend: { display: false } },
//             scales: { y: { beginAtZero: true } }
//           }
//         });
//       }

//       // 4. Doughnut Chart (statuts)
//       const doughEl = document.getElementById("doughnutChart");
//       if (doughEl) {
//         const doughCtx = doughEl.getContext("2d");

//         // const totalMembres = 20; // total attendu dans la tontine
//         // const termine = cotisationsParMois["Sept 2024"] + cotisationsParMois["Oct 2024"];
//         // const bloque = 6; // Octobre → 6 bloqués
//         // const enCours = totalMembres - termine - bloque;
//         // const archive = 0;
//         const enCours = cotisationsParMois["Sept 2024"] + cotisationsParMois["Oct 2024"]; 
//         const bloque = 6; // Octobre → 6 bloqués
//         const archive = 0; 
//         const termine = 0; 

//         new Chart(doughCtx, {
//           type: "doughnut",
//           data: {
//             labels: ["Terminé", "En cours", "Archivé", "Bloqué"],
//             datasets: [{
//               data: [termine, enCours, archive, bloque],
//               backgroundColor: ["#20DF7F", "#0F2D3D", "#fca5a5", "#fcd34d"]
//             }]
//           },
//           options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: { legend: { display: false } },
//             cutout: "60%"
//           }
//         });
//       }
//     }
    
//   } catch (e) {
//     console.error("Erreur Firestore:", e);
//   }
// }

// // Lancer directement au chargement
// loadCotisations();


// dashboard.js
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { db } from "./firebase-init.js";

let membres = [];
let currentPage = 1;
const rowsPerPage = 5; // 5 membres par page

// =============================
// Charger Cotisations (cards + graphs)
// =============================
export async function loadCotisations() {
  try {
    const querySnapshot = await getDocs(collection(db, "cotisation"));
    const cotisations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Cotisations Firestore:", cotisations);

    if (cotisations.length > 0) {
      const data = cotisations[0];
      const montantMensuel = data.montantMensuel || 0;

      const cotisationsParMois = {
        "Sept 2024": 20,
        "Oct 2024": 14,
        "Nov 2024": 0,
        "Déc 2024": 0,
        "Janv 2025": 0,
        "Fév 2025": 0
      };

      const mois = Object.keys(cotisationsParMois);
      const dataMensuelle = mois.map(m => cotisationsParMois[m] * montantMensuel);

      // ✅ Cards
      document.getElementById("juinMontant").innerText =
        (cotisationsParMois["Sept 2024"] * montantMensuel).toLocaleString() + " FCFA";
      document.getElementById("maiMontant").innerText =
        (cotisationsParMois["Oct 2024"] * montantMensuel).toLocaleString() + " FCFA";
      const caisse = dataMensuelle.reduce((a, b) => a + b, 0);
      document.getElementById("caisseMontant").innerText = caisse.toLocaleString() + " FCFA";

      // 📊 Line Chart
      const lineEl = document.getElementById("lineChart");
      if (lineEl) {
        new Chart(lineEl.getContext("2d"), {
          type: "line",
          data: {
            labels: mois,
            datasets: [{
              label: "Cotisations mensuelles",
              data: dataMensuelle,
              borderColor: "#10b981",
              backgroundColor: "rgba(16,185,129,0.08)",
              tension: 0.35,
              pointRadius: 4,
              pointBackgroundColor: "#08303a"
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
          }
        });
      }

      // 📊 Doughnut Chart
      const doughEl = document.getElementById("doughnutChart");
      if (doughEl) {
        const enCours = cotisationsParMois["Sept 2024"] + cotisationsParMois["Oct 2024"];
        const bloque = 6;
        const archive = 0;
        const termine = 0;

        new Chart(doughEl.getContext("2d"), {
          type: "doughnut",
          data: {
            labels: ["Terminé", "En cours", "Archivé", "Bloqué"],
            datasets: [{
              data: [termine, enCours, archive, bloque],
              backgroundColor: ["#20DF7F", "#0F2D3D", "#fca5a5", "#fcd34d"]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            cutout: "60%"
          }
        });
      }
    }
  } catch (e) {
    console.error("Erreur Firestore (cotisations):", e);
  }
}

// =============================
// Charger Membres (tables)
// =============================
export async function loadMembres() {
  try {
    const querySnapshot = await getDocs(collection(db, "membres"));
    membres = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Membres Firestore:", membres);

    renderCotisationsTable();
    renderProgressionTable();
    renderPaginationControls();
  } catch (e) {
    console.error("Erreur Firestore (membres):", e);
  }
}

// =============================
// Render Cotisations Table
// =============================
function renderCotisationsTable() {
  const tbody = document.getElementById("cotisationsTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = membres.slice(start, end);

  pageData.forEach(m => {
    const date = m.dateDebut?.seconds
      ? new Date(m.dateDebut.seconds * 1000).toLocaleDateString()
      : m.dateDebut || "-";

    const statutClass =
      m.statut === "En cours" ? "text-blue-500"
      : m.statut === "Bloqué" ? "text-red-500"
      : "text-gray-500";

    const tr = `
      <tr class="border-b">
        <td class="p-3">${m.nom || ""} ${m.prenom || ""}</td>
        <td class="p-3">${(m.seuil || 0).toLocaleString()} FCFA</td>
        <td class="p-3">${date}</td>
        <td class="p-3 font-medium ${statutClass}">${m.statut || "-"}</td>
      </tr>
    `;
    tbody.innerHTML += tr;
  });
}

// =============================
// Render Progression Table
// =============================
function renderProgressionTable() {
  const tbody = document.getElementById("progressionTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = membres.slice(start, end);

  pageData.forEach(m => {
    const date = m.dateDebut?.seconds
      ? new Date(m.dateDebut.seconds * 1000).toLocaleDateString()
      : m.dateDebut || "-";

    const progression = m.progression || 0;

    const tr = `
      <tr class="border-b">
        <td class="p-3">${m.nom || ""} ${m.prenom || ""}</td>
        <td class="p-3">${date}</td>
        <td class="p-3 flex items-center gap-2">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-green-500 h-2 rounded-full" style="width:${progression}%"></div>
          </div>
          <span class="text-gray-600 text-xs">${progression}%</span>
        </td>
      </tr>
    `;
    tbody.innerHTML += tr;
  });
}

// =============================
// Pagination Controls
// =============================
function renderPaginationControls() {
  const container = document.getElementById("paginationControls");
  if (!container) return;

  const totalPages = Math.ceil(membres.length / rowsPerPage);
  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  let html = `
    <button ${currentPage === 1 ? "disabled" : ""} id="prevPage">Previous page</button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="${i === currentPage ? "active" : ""}" data-page="${i}">
        ${i}
      </button>
    `;
  }

  html += `
    <button ${currentPage === totalPages ? "disabled" : ""} id="nextPage">Next page</button>
  `;

  container.innerHTML = html;

  // Events
  document.querySelectorAll("#paginationControls button[data-page]").forEach(btn => {
    btn.addEventListener("click", e => {
      currentPage = parseInt(e.target.dataset.page);
      renderCotisationsTable();
      renderProgressionTable();
      renderPaginationControls();
    });
  });

  document.getElementById("prevPage")?.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderCotisationsTable();
      renderProgressionTable();
      renderPaginationControls();
    }
  });

  document.getElementById("nextPage")?.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderCotisationsTable();
      renderProgressionTable();
      renderPaginationControls();
    }
  });
}

// =============================
// Lancer au chargement
// =============================
loadCotisations();
loadMembres();
