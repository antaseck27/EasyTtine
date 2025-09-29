  // --- SECTIONS ---
  let section1 = document.querySelector(".section-1"); // Connexion
  let section2 = document.querySelector(".section-2"); // Mot de passe oublié
  let section3 = document.querySelector(".section-3"); // Inscription
 
 // =============================
  // SECTION 2 : Mot de passe oublié
  // =============================
  let btnEnvoyer = document.getElementById("btnEnvoyer");
  let telEmail = document.getElementById("telEmail");
  let btnOk = document.getElementById("btnOk");
 
  btnEnvoyer.addEventListener("click", () => {
    let modale = document.getElementById("modal");
     modale.style.display="block"
     section2.style.opacity="0.9";
     section2.style.backgroundColor="gainsboro";

  });

  btnOk.addEventListener("click", () => {
    let modale = document.getElementById("modal");
    modale.style.display="none"
    section2.style.display = "none";
    section1.style.display = "block";
  });