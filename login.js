document.addEventListener("DOMContentLoaded", () => {
  // --- SECTIONS ---
  let section1 = document.querySelector(".section-1"); // Connexion
  let section2 = document.querySelector(".section-2"); // Mot de passe oublié
  let section3 = document.querySelector(".section-3"); // Inscription

  // --- BOUTONS & LIENS ---
  let btnConnexion = document.getElementById("btnConnexion");
  let mot2passe = document.getElementById("mot2passe");
  let inscrivezVous = document.getElementById("inscrivezVous");

  // --- INPUTS SECTION 1 ---
  let inputTéléphone = document.getElementById("inputTéléphone").value.trim();
  let inputMot2passe = document.getElementById("inputMot2passe").value.trim();

  // =============================
  // SECTION 1 : Connexion
  // =============================
  btnConnexion.addEventListener("click", (e) => {
    e.preventDefault();
    // Si tout est correct -> redirection
      window.location.href = "Composant-Admin/index1.html";

     
  });

  mot2passe.addEventListener("click", (e) => {
    e.preventDefault();
    section1.style.display = "none";
    section2.style.display = "block";

  });

  inscrivezVous.addEventListener("click", (e) => {
    e.preventDefault();
    section1.style.display = "none";
    section2.style.display = "none";
    section3.style.display = "block";

    window.location.href = "Composant-Admin/index1.html";


  });

 
});

