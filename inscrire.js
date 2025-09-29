 // =============================
  // SECTION 3 : Inscription
  // =============================
  let inputNom = document.getElementById("inputNom");
  let inputNaissance = document.getElementById("inputNaissance");
  let inputDmot2passe = document.getElementById("inputDmot2passe");
  let inputMail = document.getElementById("inputMail");
  let inputAdresse = document.getElementById("inputAdresse");
  let inputPrenom = document.getElementById("inputPrenom");
  let inputProfession = document.getElementById("inputProfession");
  let inputCmot2passe = document.getElementById("inputCmot2passe");
  let inputTelephone = document.getElementById("inputTelephone");
  let inputOrganisation = document.getElementById("inputOrganisation");

  let inscrire = document.getElementById("inscrire");
  let connecteVous = document.getElementById("connecteVous");

  inscrire.addEventListener("click", (e) => {
    e.preventDefault();

    // Je récupère les valeurs des champs
    let data = {
      nom: inputNom.value,
      prenom: inputPrenom.value,
      naissance: inputNaissance.value,
      profession: inputProfession.value,
      motDePasse: inputDmot2passe.value,
      confirmerMotDePasse: inputCmot2passe.value,
      mail: inputMail.value,
      telephone: inputTelephone.value,
      adresse: inputAdresse.value,
      organisation: inputOrganisation.value,
    };



    // Vérifier que tous les champs obligatoires sont remplis
  if (
    !data.nom ||
    !data.prenom ||
    !data.mail ||
    !data.motDePasse ||
    !data.confirmerMotDePasse
  ) {
    alert("Veuillez remplir tous les champs obligatoires !");
    return;
  }

  // Vérifier que le mail est valide
  if (!data.mail.includes("@")) {
    alert("Veuillez entrer une adresse mail valide !");
    return;
  }

  // Vérifier que les mots de passe correspondent
  if (data.motDePasse !== data.confirmerMotDePasse) {
    alert("Les mots de passe ne correspondent pas !");
    return;
  }

  // Vérifier longueur du mot de passe
  if (data.motDePasse.length < 6) {
    alert("Le mot de passe doit contenir au moins 6 caractères !");
    return;
  }

 

  // On revient à la section connexion
  section1.style.display = "block";
  section3.style.display = "none";
});

// =============================
// EVENT : Déjà un compte ? Retour connexion
// =============================
connecteVous.addEventListener("click", (e) => {
  e.preventDefault();
  section3.style.display = "none";
  section1.style.display = "block";
});