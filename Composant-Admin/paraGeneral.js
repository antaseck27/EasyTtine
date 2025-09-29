let section1 = document.querySelector(".section-1");
let section2 = document.querySelector(".section-2");
let editorProfil = document.getElementById("editorProfil");
let btnMettreJour = document.getElementById("btnMettreJour");

editorProfil.addEventListener("click", ()=>{
    section1.style.display="none";
    section2.style.display="block";
})

btnMettreJour.addEventListener("click", ()=>{
    let prenom = document.getElementById("prenom").value;
    let nom = document.getElementById("nom").value;
    let tel = document.getElementById("telephone").value;
    let email = document.getElementById("email").value;
    let statut = document.getElementById("statut").value;
    alert(`${prenom} \n ${nom} \n ${tel} \n ${email} \n ${statut}`)
    section1.style.display="block";
    section2.style.display="none";
})